// WP-LEARNER-PROFILE-1A — durable learner profile write edge.
//
// Trust boundary:
//   - resolves the learner from the request JWT;
//   - writes with the service-role client so browser roles have no insert/update
//     path to learner_skill_state / learner_error_patterns;
//   - accepts only taxonomy codes and UUID unit refs; never raw learner text.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SKILLS = new Set([
  "pronunciation",
  "grammar",
  "vocabulary",
  "listening",
  "speaking",
  "reading",
  "writing",
]);

const PATTERN_CODES = new Set([
  "missing-article",
  "tense-omission",
  "subj-verb-agreement",
  "preposition-calque",
  "word-order",
  "zero-copula",
  "double-negation",
  "word_choice",
  "sentence_structure",
  "pronunciation",
  "politeness_register",
]);

const CEFR = new Set(["A1", "A2", "B1", "B2", "C1", "C2"]);
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

const adminClient = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

type QueryError = { code?: string; message?: string };
type PatternInput = {
  pattern_code: string;
  l1?: string | null;
  occurrence_count?: number | null;
  resolved_count?: number | null;
  example_unit_id?: string | null;
  syntheticMonitoring?: unknown;
};
type SkillInput = {
  skill: string;
  score?: number | null;
  cefr_estimate?: string | null;
  confidence?: number | null;
  evidence_count?: number | null;
  last_assessed_at?: string | null;
  syntheticMonitoring?: unknown;
};

class SchemaMissingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SchemaMissingError";
  }
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function isSyntheticMarkerValue(value: unknown): boolean {
  return value === true || value === "1" || value === "true" || value === "synthetic";
}

function isSchemaMissingError(error: unknown): boolean {
  const e = error as QueryError | null;
  const fallbackMessage = error instanceof Error ? error.message : String(error ?? "");
  const blob = `${e?.code ?? ""} ${e?.message ?? ""} ${fallbackMessage}`;
  return /42P01|42703|PGRST204|PGRST205|schema cache|does not exist|could not find/i.test(blob);
}

async function resolveUserId(req: Request): Promise<string | null> {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;
  const token = authHeader.slice("Bearer ".length).trim();
  if (!token) return null;

  const userClient = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: authHeader } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data, error } = await userClient.auth.getUser(token);
  if (error || !data?.user) return null;
  if ((data.user as { is_anonymous?: boolean | null }).is_anonymous === true) return null;
  return data.user.id;
}

async function loadProfileIsSynthetic(userId: string): Promise<boolean> {
  try {
    const { data, error } = await adminClient
      .from("profiles")
      .select("is_synthetic")
      .eq("id", userId)
      .maybeSingle();
    if (error) return false;
    return (data as { is_synthetic?: unknown } | null)?.is_synthetic === true;
  } catch {
    return false;
  }
}

function normalizeL1(value: unknown): string {
  const raw = String(value ?? "vi").trim().toLowerCase().replace(/[^a-z0-9_-]/g, "");
  return /^[a-z][a-z0-9_-]{1,11}$/.test(raw) ? raw : "vi";
}

function intAtLeast(value: unknown, fallback: number, min = 0): number {
  const n = typeof value === "number" && Number.isFinite(value) ? Math.floor(value) : fallback;
  return Math.max(min, n);
}

function nullableScore(value: unknown, max: number): number | null {
  if (value == null) return null;
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  return Math.max(0, Math.min(max, value));
}

function normalizeTimestamp(value: unknown): string {
  if (typeof value === "string") {
    const d = new Date(value);
    if (!Number.isNaN(d.getTime())) return d.toISOString();
  }
  return new Date().toISOString();
}

function normalizeUuidArray(existing: unknown, next?: string | null): string[] {
  const base = Array.isArray(existing)
    ? existing.filter((value): value is string => typeof value === "string" && UUID_RE.test(value))
    : [];
  if (next && UUID_RE.test(next)) base.push(next);
  return [...new Set(base)].slice(-20);
}

function computeTrend(previousOccurrence: number, previousResolved: number, occurrence: number, resolved: number): string {
  const previousOpen = Math.max(0, previousOccurrence - previousResolved);
  const nextOpen = Math.max(0, occurrence - resolved);
  if (nextOpen < previousOpen) return "improving";
  if (nextOpen > previousOpen && previousOccurrence > 0) return "worsening";
  return "stable";
}

async function upsertPattern(
  userId: string,
  input: PatternInput,
  profileIsSynthetic: boolean,
): Promise<"written" | "ignored"> {
  const patternCode = String(input.pattern_code ?? "").trim();
  if (!PATTERN_CODES.has(patternCode)) return "ignored";

  const l1 = normalizeL1(input.l1);
  const occurrenceDelta = intAtLeast(input.occurrence_count, 1, 1);
  const resolvedDelta = Math.min(intAtLeast(input.resolved_count, 0), occurrenceDelta);
  const now = new Date().toISOString();

  const existingResult = await adminClient
    .from("learner_error_patterns")
    .select("occurrence_count,resolved_count,first_seen_at,example_unit_ids,is_synthetic")
    .eq("user_id", userId)
    .eq("pattern_code", patternCode)
    .eq("l1", l1)
    .maybeSingle();
  if (existingResult.error) {
    if (isSchemaMissingError(existingResult.error)) throw new SchemaMissingError(existingResult.error.message ?? "schema_missing");
    throw new Error(existingResult.error.message ?? "pattern_read_failed");
  }

  const existing = existingResult.data as {
    occurrence_count?: number | null;
    resolved_count?: number | null;
    first_seen_at?: string | null;
    example_unit_ids?: unknown;
    is_synthetic?: boolean | null;
  } | null;
  const previousOccurrence = intAtLeast(existing?.occurrence_count, 0);
  const previousResolved = intAtLeast(existing?.resolved_count, 0);
  const occurrenceCount = previousOccurrence + occurrenceDelta;
  const resolvedCount = Math.min(occurrenceCount, previousResolved + resolvedDelta);
  const isSynthetic = isSyntheticMarkerValue(input.syntheticMonitoring) || profileIsSynthetic || existing?.is_synthetic === true;

  const { error } = await adminClient
    .from("learner_error_patterns")
    .upsert({
      user_id: userId,
      pattern_code: patternCode,
      l1,
      occurrence_count: occurrenceCount,
      resolved_count: resolvedCount,
      first_seen_at: existing?.first_seen_at ?? now,
      last_seen_at: now,
      trend: computeTrend(previousOccurrence, previousResolved, occurrenceCount, resolvedCount),
      example_unit_ids: normalizeUuidArray(existing?.example_unit_ids, input.example_unit_id ?? null),
      is_synthetic: isSynthetic,
    }, { onConflict: "user_id,pattern_code,l1" });
  if (error) {
    if (isSchemaMissingError(error)) throw new SchemaMissingError(error.message ?? "schema_missing");
    throw new Error(error.message ?? "pattern_upsert_failed");
  }
  return "written";
}

async function upsertSkill(
  userId: string,
  input: SkillInput,
  profileIsSynthetic: boolean,
): Promise<"written" | "ignored"> {
  const skill = String(input.skill ?? "").trim();
  if (!SKILLS.has(skill)) return "ignored";

  const existingResult = await adminClient
    .from("learner_skill_state")
    .select("evidence_count,is_synthetic")
    .eq("user_id", userId)
    .eq("skill", skill)
    .maybeSingle();
  if (existingResult.error) {
    if (isSchemaMissingError(existingResult.error)) throw new SchemaMissingError(existingResult.error.message ?? "schema_missing");
    throw new Error(existingResult.error.message ?? "skill_read_failed");
  }

  const existing = existingResult.data as {
    evidence_count?: number | null;
    is_synthetic?: boolean | null;
  } | null;
  const cefr = typeof input.cefr_estimate === "string" && CEFR.has(input.cefr_estimate) ? input.cefr_estimate : null;
  const isSynthetic = isSyntheticMarkerValue(input.syntheticMonitoring) || profileIsSynthetic || existing?.is_synthetic === true;

  const { error } = await adminClient
    .from("learner_skill_state")
    .upsert({
      user_id: userId,
      skill,
      score: nullableScore(input.score, 100),
      cefr_estimate: cefr,
      confidence: nullableScore(input.confidence, 1),
      evidence_count: intAtLeast(existing?.evidence_count, 0) + intAtLeast(input.evidence_count, 1, 1),
      last_assessed_at: normalizeTimestamp(input.last_assessed_at),
      is_synthetic: isSynthetic,
      updated_at: new Date().toISOString(),
    }, { onConflict: "user_id,skill" });
  if (error) {
    if (isSchemaMissingError(error)) throw new SchemaMissingError(error.message ?? "schema_missing");
    throw new Error(error.message ?? "skill_upsert_failed");
  }
  return "written";
}

async function handle(req: Request): Promise<Response> {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json({ ok: false, error: "method_not_allowed" }, 405);

  const userId = await resolveUserId(req);
  if (!userId) return json({ ok: true, skipped: true, reason: "anon" });

  let payload: { patterns?: PatternInput[]; skills?: SkillInput[] };
  try {
    payload = await req.json();
  } catch {
    return json({ ok: false, error: "bad_json" }, 400);
  }

  const patterns = Array.isArray(payload.patterns) ? payload.patterns.slice(0, 50) : [];
  const skills = Array.isArray(payload.skills) ? payload.skills.slice(0, 20) : [];
  if (patterns.length === 0 && skills.length === 0) {
    return json({ ok: true, skipped: true, reason: "empty" });
  }

  const profileIsSynthetic = await loadProfileIsSynthetic(userId);
  let written = 0;
  let ignored = 0;
  try {
    for (const pattern of patterns) {
      const result = await upsertPattern(userId, pattern, profileIsSynthetic);
      if (result === "written") written += 1;
      else ignored += 1;
    }
    for (const skill of skills) {
      const result = await upsertSkill(userId, skill, profileIsSynthetic);
      if (result === "written") written += 1;
      else ignored += 1;
    }
  } catch (err) {
    if (err instanceof SchemaMissingError) {
      return json({ ok: true, skipped: true, reason: "schema_missing" });
    }
    const message = err instanceof Error ? err.message : String(err);
    console.warn("[learner-profile-write] write failed:", message);
    return json({ ok: false, error: message }, 500);
  }

  return json({ ok: true, skipped: false, written, ignored });
}

serve(handle);
