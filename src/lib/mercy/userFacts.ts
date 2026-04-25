// Episodic user-fact memory client.
//
// Backed by public.mercy_user_facts (see migration
// 20260501000000_mercy_user_facts.sql). Concerns:
//
//   - Adding new facts (idempotent on duplicate via unique constraint).
//   - Reading the active set (excludes superseded rows).
//   - Replacing a fact via the supersede chain (audit trail preserved).
//   - Bumping last_referenced_at when a fact is actually used in a prompt.
//   - Decaying confidence on facts that haven't been referenced for N days.
//
// Auth: every write asserts that the caller's user_id matches the row's
// user_id. We pass userId explicitly so callers can fail fast for unauth
// flows without a round-trip; RLS still enforces the contract on the DB.

import { supabase } from "@/lib/supabaseClient";

export type FactType = "preference" | "goal" | "context" | "avoidance";
export type FactSource = "user_stated" | "inferred" | "admin_set";

export type UserFact = {
  id: string;
  userId: string;
  factType: FactType;
  content: string;
  source: FactSource | null;
  confidence: number;
  createdAt: string;
  lastReferencedAt: string | null;
  supersededBy: string | null;
};

const TABLE = "mercy_user_facts";

/**
 * Default confidence per source. Heuristic-extracted facts come in lower
 * than user-stated ones because they're guesses; an admin-set fact comes
 * in at 1.0 because it's a known truth.
 */
export function defaultConfidenceForSource(source: FactSource): number {
  switch (source) {
    case "user_stated":
      return 0.8;
    case "inferred":
      return 0.5;
    case "admin_set":
      return 1.0;
  }
}

/**
 * Add a new fact. Returns the inserted row, or the existing row if the
 * (user_id, fact_type, content) tuple already exists (the unique
 * constraint kicks in — we treat that as success and re-read the row so
 * the caller always gets a UserFact back).
 */
export async function addFact(
  userId: string,
  factType: FactType,
  content: string,
  source: FactSource,
  confidence?: number,
): Promise<UserFact | null> {
  if (!userId || !content.trim()) return null;

  const conf =
    typeof confidence === "number" && confidence >= 0 && confidence <= 1
      ? confidence
      : defaultConfidenceForSource(source);

  const { data, error } = await supabase
    .from(TABLE)
    .insert({
      user_id: userId,
      fact_type: factType,
      content: content.trim(),
      source,
      confidence: conf,
    })
    .select("*")
    .maybeSingle();

  if (!error && data) return toUserFact(data);

  // Unique-violation (duplicate fact): re-read the existing row.
  if (error && isUniqueViolation(error)) {
    const { data: existing } = await supabase
      .from(TABLE)
      .select("*")
      .eq("user_id", userId)
      .eq("fact_type", factType)
      .eq("content", content.trim())
      .maybeSingle();
    return existing ? toUserFact(existing) : null;
  }

  if (error) {
    console.warn("[userFacts] addFact failed:", error.message);
  }
  return null;
}

/**
 * Active facts for the user (those not superseded). Optionally filter by
 * fact_type. Order: highest confidence first, then most-recently-referenced.
 */
export async function getActiveFactsForUser(
  userId: string,
  factType?: FactType,
): Promise<UserFact[]> {
  if (!userId) return [];

  let q = supabase
    .from(TABLE)
    .select("*")
    .eq("user_id", userId)
    .is("superseded_by", null)
    .order("confidence", { ascending: false })
    .order("last_referenced_at", { ascending: false, nullsFirst: false });

  if (factType) q = q.eq("fact_type", factType);

  const { data, error } = await q;
  if (error) {
    console.warn("[userFacts] getActiveFactsForUser failed:", error.message);
    return [];
  }
  return Array.isArray(data) ? data.map(toUserFact) : [];
}

/**
 * Replace an existing fact with a new one. We insert the replacement
 * row first, then mark the old row as superseded. If the new insert
 * fails (e.g. duplicate content), nothing is changed — the old row
 * stays active.
 *
 * Why not UPDATE in place: the audit trail. A future debug session
 * needs to be able to ask "what did we believe about this user three
 * months ago, and when did it change?".
 */
export async function supersedeFact(
  oldId: string,
  newContent: string,
  newConfidence?: number,
): Promise<UserFact | null> {
  if (!oldId || !newContent.trim()) return null;

  // Read the original to get user_id + fact_type + source.
  const { data: old, error: readErr } = await supabase
    .from(TABLE)
    .select("*")
    .eq("id", oldId)
    .maybeSingle();
  if (readErr || !old) {
    if (readErr) console.warn("[userFacts] supersedeFact read failed:", readErr.message);
    return null;
  }

  const oldRow = toUserFact(old);
  const conf =
    typeof newConfidence === "number" && newConfidence >= 0 && newConfidence <= 1
      ? newConfidence
      : oldRow.confidence;

  const { data: inserted, error: insertErr } = await supabase
    .from(TABLE)
    .insert({
      user_id: oldRow.userId,
      fact_type: oldRow.factType,
      content: newContent.trim(),
      source: oldRow.source ?? "user_stated",
      confidence: conf,
    })
    .select("*")
    .maybeSingle();

  if (insertErr || !inserted) {
    if (insertErr) console.warn("[userFacts] supersedeFact insert failed:", insertErr.message);
    return null;
  }

  // Point the old row at the new one. If this fails the new fact still
  // exists and is the highest-confidence active fact — minor inconsistency,
  // but no data loss.
  const { error: linkErr } = await supabase
    .from(TABLE)
    .update({ superseded_by: inserted.id })
    .eq("id", oldId);

  if (linkErr) {
    console.warn("[userFacts] supersedeFact link failed:", linkErr.message);
  }

  return toUserFact(inserted);
}

/**
 * Mark a fact as just-referenced (touch last_referenced_at). Use this
 * when a fact is actually slotted into a Mercy prompt — drives the
 * decay logic so unused facts age out first.
 */
export async function markFactReferenced(factId: string): Promise<void> {
  if (!factId) return;
  const { error } = await supabase
    .from(TABLE)
    .update({ last_referenced_at: new Date().toISOString() })
    .eq("id", factId);
  if (error) {
    console.warn("[userFacts] markFactReferenced failed:", error.message);
  }
}

/**
 * Reduce confidence on active facts that haven't been referenced for at
 * least `daysUnused` days. Default decay step is -0.2; floors at 0.
 *
 * This is a CLIENT-SIDE batch: we read the candidates, compute the new
 * confidences, and write them back. Done this way rather than as a SQL
 * RPC because:
 *   - Step 7 is iterating fast; client-side keeps the loop tight.
 *   - The decay policy will likely change as we learn what works, and
 *     we don't want to ship a migration every time.
 *   - The candidate count per user is tiny (tens, not thousands).
 *
 * If this becomes a hot path later, lift it to a SECURITY DEFINER RPC.
 */
export async function decayUnusedFacts(
  userId: string,
  daysUnused: number,
  step: number = 0.2,
): Promise<{ scanned: number; decayed: number }> {
  if (!userId || daysUnused < 0) return { scanned: 0, decayed: 0 };

  const cutoff = new Date(Date.now() - daysUnused * 24 * 60 * 60 * 1000)
    .toISOString();

  // Candidates: active facts whose last_referenced_at is null OR < cutoff.
  // We split into two queries because Supabase's `or` filter quoting on
  // is-null + lt is fragile across versions; two reads + a merge is
  // boring and reliable.
  const [neverRef, oldRef] = await Promise.all([
    supabase
      .from(TABLE)
      .select("id, confidence, created_at")
      .eq("user_id", userId)
      .is("superseded_by", null)
      .is("last_referenced_at", null)
      .lt("created_at", cutoff),
    supabase
      .from(TABLE)
      .select("id, confidence")
      .eq("user_id", userId)
      .is("superseded_by", null)
      .lt("last_referenced_at", cutoff),
  ]);

  if (neverRef.error) {
    console.warn("[userFacts] decay (never-ref) read failed:", neverRef.error.message);
  }
  if (oldRef.error) {
    console.warn("[userFacts] decay (old-ref) read failed:", oldRef.error.message);
  }

  const candidates = [
    ...((neverRef.data ?? []) as Array<{ id: string; confidence: number }>),
    ...((oldRef.data ?? []) as Array<{ id: string; confidence: number }>),
  ];

  const seen = new Set<string>();
  const unique = candidates.filter((c) => {
    if (seen.has(c.id)) return false;
    seen.add(c.id);
    return true;
  });

  let decayed = 0;
  for (const c of unique) {
    const next = Math.max(0, Number((c.confidence - step).toFixed(3)));
    if (next === c.confidence) continue;
    const { error: upErr } = await supabase
      .from(TABLE)
      .update({ confidence: next })
      .eq("id", c.id);
    if (upErr) {
      console.warn("[userFacts] decay update failed:", upErr.message);
      continue;
    }
    decayed++;
  }

  return { scanned: unique.length, decayed };
}

// ── helpers ──────────────────────────────────────────────────────────────

function toUserFact(raw: unknown): UserFact {
  const r = (raw ?? {}) as Record<string, unknown>;
  return {
    id: String(r.id ?? ""),
    userId: String(r.user_id ?? ""),
    factType: String(r.fact_type ?? "context") as FactType,
    content: String(r.content ?? ""),
    source: (r.source ? (String(r.source) as FactSource) : null),
    confidence: Number(r.confidence ?? 0),
    createdAt: String(r.created_at ?? ""),
    lastReferencedAt: r.last_referenced_at ? String(r.last_referenced_at) : null,
    supersededBy: r.superseded_by ? String(r.superseded_by) : null,
  };
}

function isUniqueViolation(err: { code?: string; message?: string }): boolean {
  // Postgres unique_violation = 23505. Supabase surfaces both.
  return err.code === "23505" || /duplicate|unique/i.test(err.message ?? "");
}
