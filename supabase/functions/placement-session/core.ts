// supabase/functions/placement-session/core.ts
//
// Placement Test v2 — the edge-function orchestrator (Phase 2, PR 9).
//
// THIS IS "the edge function" / "the orchestrator" that EVERY merged
// engine module's header defers to:
//   • itemBank.ts:8  "the edge function reads the server-only
//     placement_items table via service-role and hands the rows here"
//   • itemSelector.ts:13 / session.ts:70 / advance.ts:50  "the edge fn
//     strips to PublicItem before it leaves the server"
//   • advance.ts:35  "the edge fn owns de-duplication"
//   • result.ts:81  "the caller reads profiles.placement_history — the
//     engine stays storage-free"
//   • terminator.ts:62  "the orchestrator (a later PR) computes
//     hasEligibleItem … and passes it in"  (advance.ts already does this
//     internally; the orchestrator just drives advance)
//
// It is the SECOND half of the locked mock-interview split, scaled up:
//   core.ts  — PURE, DI'd `handleRequest(req, Deps)`: routing, the
//              lifecycle decisions, edge-owned de-duplication, the
//              per-request anchor reconstruction (flag #4), PublicItem
//              stripping, the reconstruction knobs. vitest goldens are
//              its gate (it reaches Fetch web globals, so it is excluded
//              from the DOM-free tsconfig.functions.json exactly like
//              index.ts — see that file's exclude comment).
//   index.ts — the Deno entrypoint + the real Supabase service-role row
//              I/O behind the `Deps` seam. tsconfig.functions.json was
//              PRE-WIRED in PR-V2-4 to exclude index.ts with the exact
//              comment "Logic lives in core.ts (vitest-tested)" — a
//              direct breadcrumb that PR 9 == core.ts + index.ts.
//
// SCOPE BOUNDARY (the established engine house style — SessionDeps
// injects id/clock/rng, ResultDeps injects the room map + history row,
// the terminator takes a pre-computed `hasEligibleItem`): ALL Supabase /
// SQL-row-shape knowledge lives behind `Deps` in index.ts. core.ts
// speaks only domain objects so it stays pure + fully unit-testable with
// in-memory fakes (the mock-interview discipline).
//
// ── RECONSTRUCTION FLAGS (design+sequence docs ephemeral/unavailable
//    this session — same transparency as #712 randomesqueK / #718
//    terminator precedence / #724 L1-severity bands) ───────────────────
//   1. CEFR→room is a SERVER MIRROR of the browser cefrToRoom.ts
//      (config.ts:CEFR_TO_ROOM_SERVER); an anti-drift golden makes
//      silent divergence impossible. Full rationale in config.ts.
//   2. `pickBankVersion` resolves D4's undefined "<current>" selector
//      with NO new knob: env override → single active version → "" →
//      lexicographic-max + warn. See config.ts:PLACEMENT_BANK_VERSION_ENV.
//   3. LEGACY-SNAPSHOT scope: v2 writes the new relational store
//      (placement_sessions/responses, #678) + profiles.placement_history
//      (the v2 source of truth) + the shared `profiles` "latest
//      snapshot" the migration says v2 must keep writing
//      (placement_cefr/score/starting_room/completed_at/weaknesses, read
//      by useFocusAreas / dailyChallenge / MercyGuide / AccountPage). It
//      does NOT re-write v1's PARALLEL audit store (user_placements /
//      mb_user_weakness_profile) — v2's audit surface is the new
//      relational tables (one-owner-per-function, no duplicate
//      surfaces). KNOWN, non-corrupting limitation: v2 emits
//      `L1TransferTag`s; the browser weakness-catalog vocabulary may not
//      contain all of them, so `resolveWeaknessTags` (drops-unknown,
//      never throws) may under-populate legacy focus-areas until a
//      deliberate L1Tag→catalog mapping PR. The v2 reader uses
//      `placement_history.l1Top` (lossless). Mapping is a separate
//      reviewable concern, not guessed here ("don't solve uncertainty
//      with more code").
//   4. PER-REQUEST ANCHOR RECONSTRUCTION. The #678 `placement_sessions`
//      schema persists NO `current_item_id` / `served_item_ids` /
//      `type_counts` columns (its columns: bank_version, self_rating,
//      phase, prior_mean, theta, theta_se, cefr, termination_reason,
//      started/completed/updated_at) and `placement_responses` is
//      APPEND-ONLY (no UPDATE/DELETE policy — anti-cheat). The edge
//      runtime is STATELESS (every call reloads the session). So the
//      resume/idempotency anchor (`SessionState.currentItemId`) CANNOT
//      round-trip via a column. Two options were: (a) a new
//      `current_item_id` migration — but that would gate PR 9 on a
//      Chau-applied migration and break the series' migration-
//      independence invariant (PRs 5-8 took none); (b) reconstruct the
//      anchor per request from facts the schema DOES persist. (b),
//      here: a submitted answer is the live anchor iff the session is
//      `in_progress`, the itemId is a real bank item, AND it is NOT
//      already among the answered items (rebuilt from
//      placement_responses by seq). `administered` / `servedItemIds` /
//      `typeCounts` are likewise re-derived from the response rows
//      (+ the current submitted item folded into `servedItemIds` so the
//      engine's "served before answered" invariant holds and an
//      answered item is never re-selected). This makes the stateless
//      boundary + the core answer path WORK with zero new migration.
//   5. RESUME = continuation, not re-serve. With no persisted anchor the
//      server cannot RE-SEND the in-flight item on `/start`; the client
//      UI still holds the last `PublicItem` it received and simply
//      re-submits it (flag #4 then validates + advances). `/start`
//      therefore: stale unfinished → `abandoned` + fresh; non-stale
//      `in_progress` → `{ resumed:true, phase:in_progress, item:null }`
//      (client continues with its held item); non-stale
//      `awaiting_self_rating` → resume at that phase. The selector's
//      exact next-pick is NOT server-enforced across requests because
//      #678 never persisted it either — a documented, acceptable anti-
//      cheat reduction for an inherently single-tab sequential placement
//      test (the dropped-connection / double-tap retry IS covered by the
//      idempotent flag-#4 dedup). Hardening (a `current_item_id`
//      column + strict anchor) is a deliberate future migration PR if
//      telemetry ever warrants it — not smuggled in here.

import { CEFR_TO_ROOM_SERVER, SESSION_ABANDON_TTL_MIN } from "./config.ts";
import { buildItemBank } from "./engine/itemBank.ts";
import {
  applySelfRating,
  createSession,
  markAbandonedIfStale,
  type SessionDeps,
} from "./engine/session.ts";
import { advance } from "./engine/advance.ts";
import { assembleResult, type ResultDeps } from "./engine/result.ts";
import type {
  CefrBand,
  Item,
  ItemBank,
  PlacementHistoryEntry,
  PublicItem,
  ResultPayload,
  SelfRating,
  SessionState,
  TerminationReason,
} from "./types.ts";

type Response_ = SessionState["administered"][number];

// ── HTTP plumbing (verbatim mock-interview/core.ts idiom) ──────────────

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

// ── Domain DTOs the Deps seam trades in ────────────────────────────────

/** The exact shape of one `profiles` "latest snapshot" write (flag #3),
 *  mapped 1:1 onto the v1 columns (persistence.ts:savePlacementResult
 *  parity) by index.ts so existing readers stay unchanged.
 *  `weaknessTags` is a raw string[] (resolveWeaknessTags drops-unknown
 *  safely). */
export interface LegacySnapshot {
  cefr: CefrBand;
  score: number;
  startingRoom: string;
  completedAt: string;
  weaknessTags: string[];
}

/**
 * The DI seam. index.ts supplies real service-role implementations;
 * vitest supplies in-memory fakes. Every method is domain-typed — NO SQL
 * row shapes leak into this pure module.
 *
 * loadSession / loadLatestUnfinished return a SessionState whose
 * `currentItemId` is ALWAYS null and whose `administered` /
 * `servedItemIds` / `typeCounts` are rebuilt from the append-only
 * `placement_responses` rows (seq-ordered) — the schema persists nothing
 * else (flag #4). core.ts reconstructs the live anchor per request.
 */
export interface Deps {
  /** Resolve the JWT → the user, or null. Placement is sign-in-gated
   *  (placement_sessions RLS owner == auth.uid). */
  getUser: (req: Request) => Promise<{ id: string } | null>;

  /** Active item rows + the distinct `bank_version`s among active rows +
   *  the optional env override. core.ts picks the effective version. */
  loadActiveItems: () => Promise<{
    rawItems: ReadonlyArray<unknown>;
    activeVersions: string[];
    envVersion?: string;
  }>;

  /** Owner-scoped rebuild of a session by id, or null. */
  loadSession: (
    sessionId: string,
    userId: string,
  ) => Promise<SessionState | null>;

  /** The caller's most-recent UNFINISHED session (awaiting_self_rating |
   *  in_progress), or null. Drives resume-or-new. */
  loadLatestUnfinished: (userId: string) => Promise<SessionState | null>;

  /** Upsert the placement_sessions row from the SessionState scalars. */
  persistSession: (session: SessionState) => Promise<void>;

  /** Append exactly one placement_responses row (append-only). `seq` is
   *  this response's 0-based index in `administered`. */
  appendResponse: (
    args: {
      session: SessionState;
      response: Response_;
      seq: number;
      itemType: string;
      itemCefr: string | null;
    },
  ) => Promise<void>;

  /** The caller's most-recent PRIOR placement_history entry EXCLUDING
   *  `excludeSessionId` (re-finalize stays idempotent), or null. */
  loadPrevHistory: (
    userId: string,
    excludeSessionId: string,
  ) => Promise<PlacementHistoryEntry | null>;

  /** Finalize: session row → complete, append placement_history, write
   *  the shared `profiles` snapshot (flag #3). */
  writeCompletion: (
    args: {
      session: SessionState;
      historyEntry: PlacementHistoryEntry;
      snapshot: LegacySnapshot;
      terminationReason: TerminationReason;
    },
  ) => Promise<void>;

  // Injected non-determinism (the SessionDeps seam, threaded whole).
  newSessionId: () => string;
  now: () => string;
  rng: () => number;

  /** Non-fatal telemetry sink. Optional — absence never changes
   *  behavior. */
  warn?: (msg: string, meta?: unknown) => void;
}

// ── Pure, unit-tested helpers (the valuable testable surface) ──────────

/**
 * Reconstruction flag #2 — resolve D4's undefined "<current>" bank
 * version with ZERO new knob: env override → single active version →
 * "" (→ empty bank → engine `bank_exhausted`, the D2 ship-EMPTY path) →
 * lexicographic-max + a telemetried warning (>1 active == an authoring
 * error). Never throws.
 */
export function pickBankVersion(
  activeVersions: ReadonlyArray<string>,
  envVersion?: string,
): { version: string; warning?: string } {
  const env = (envVersion ?? "").trim();
  if (env.length > 0) return { version: env };

  const distinct = [...new Set(activeVersions.filter((v) => v.length > 0))];
  if (distinct.length === 0) return { version: "" };
  if (distinct.length === 1) return { version: distinct[0] };

  const sorted = [...distinct].sort();
  const version = sorted[sorted.length - 1];
  return {
    version,
    warning:
      `placement_items has ${distinct.length} active bank_versions ` +
      `(${distinct.join(", ")}); using lexicographic-max "${version}". ` +
      `Authoring error — exactly one bank_version should be active.`,
  };
}

/**
 * The SOLE Item→PublicItem reduction (locked Q1 / types.ts:104-126).
 * HAND-WRITTEN allow-list, NOT `Omit`/spread — a derived shape would
 * silently leak any future answer-bearing `Item` field. Carries nothing
 * that reveals the answer (`correctOptionId`), the withheld
 * `transcript`, the IRT params, or authoring `meta`.
 */
export function toPublicItem(item: Item): PublicItem {
  const pub: PublicItem = {
    id: item.id,
    type: item.type,
    skill: item.skill,
    prompt: { en: item.prompt.en, vi: item.prompt.vi },
  };
  if (item.passage) {
    pub.passage = { en: item.passage.en, vi: item.passage.vi };
  }
  if (item.options) {
    // ItemOption is {id,en,vi} — no answer flag — but re-map explicitly
    // so a future option field cannot ride along implicitly.
    pub.options = item.options.map((o) => ({ id: o.id, en: o.en, vi: o.vi }));
  }
  if (item.audio) {
    pub.audio = { key: item.audio.key, replayLimit: item.audio.replayLimit };
  }
  return pub;
}

/** Reconstruction flag #1 — server CEFR→room via the config mirror, with
 *  cefrToRoom.ts's exact defensive `?? A1` fallback. */
export function recommendedRoomFor(cefr: CefrBand): string {
  return CEFR_TO_ROOM_SERVER[cefr] ?? CEFR_TO_ROOM_SERVER.A1;
}

/** ResultPayload → the denormalized placement_history append (design
 *  §3.1 / types.ts:212). perSkill keeps only reportable θ; l1Top is the
 *  already-severity-sorted tag list; source is always 'v2'. */
export function historyEntryFromResult(
  result: ResultPayload,
): PlacementHistoryEntry {
  const perSkill: PlacementHistoryEntry["perSkill"] = {};
  for (const s of result.perSkill) {
    if (
      s.reportable &&
      s.theta !== null &&
      (s.skill === "reading" ||
        s.skill === "listening" ||
        s.skill === "grammar" ||
        s.skill === "vocabulary")
    ) {
      perSkill[s.skill] = s.theta;
    }
  }
  return {
    ts: result.createdAt,
    bankVersion: result.bankVersion,
    theta: result.overall.theta,
    se: result.overall.se,
    cefr: result.overall.cefr,
    perSkill,
    l1Top: result.l1Weaknesses.map((w) => w.tag),
    sessionId: result.sessionId,
    source: "v2",
  };
}

/** ResultPayload → the shared `profiles` "latest snapshot" (flag #3).
 *  `score` = the overall θ (legacy `placement_score` is display/audit-
 *  only, not logic-load-bearing in any current reader). `weaknessTags`
 *  = the v2 L1 tags as raw strings (resolveWeaknessTags drops-unknown
 *  safely). */
export function legacySnapshotFromResult(
  result: ResultPayload,
): LegacySnapshot {
  return {
    cefr: result.overall.cefr,
    score: result.overall.theta,
    startingRoom: result.recommendedRoomId,
    completedAt: result.createdAt,
    weaknessTags: result.l1Weaknesses.map((w) => w.tag),
  };
}

const SELF_RATINGS: ReadonlySet<SelfRating> = new Set([
  "beginner",
  "intermediate",
  "advanced",
  "not_sure",
]);

function asSelfRating(v: unknown): SelfRating | null {
  return typeof v === "string" && SELF_RATINGS.has(v as SelfRating)
    ? (v as SelfRating)
    : null;
}

/** Parse + validate the client `response` into the engine `Response`
 *  (types.ts:128). Returns null on any shape violation — the caller
 *  answers 400 (never feed the engine a malformed response). */
function parseResponse(raw: unknown): Response_ | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const itemId = r.itemId;
  if (typeof itemId !== "string" || itemId.length === 0) return null;
  // `correct` is boolean | null (null === writing_sample, decision #3).
  const correct =
    r.correct === null || typeof r.correct === "boolean"
      ? (r.correct as boolean | null)
      : undefined;
  if (correct === undefined) return null;
  if (typeof r.responseMs !== "number" || !Number.isFinite(r.responseMs)) {
    return null;
  }
  if (typeof r.timedOut !== "boolean") return null;
  if (typeof r.l1RevealedUsed !== "boolean") return null;
  if (typeof r.shownAt !== "string" || typeof r.answeredAt !== "string") {
    return null;
  }
  const out: Response_ = {
    itemId,
    correct,
    responseMs: r.responseMs,
    timedOut: r.timedOut,
    l1RevealedUsed: r.l1RevealedUsed,
    shownAt: r.shownAt,
    answeredAt: r.answeredAt,
  };
  if (typeof r.selectedOptionId === "string") {
    out.selectedOptionId = r.selectedOptionId;
  }
  if (typeof r.audioPlays === "number" && Number.isFinite(r.audioPlays)) {
    out.audioPlays = r.audioPlays;
  }
  return out;
}

// ── Bank loading (one place; degrades to empty, never throws) ──────────

async function loadBank(deps: Deps): Promise<ItemBank> {
  const { rawItems, activeVersions, envVersion } = await deps.loadActiveItems();
  const picked = pickBankVersion(activeVersions, envVersion);
  if (picked.warning) deps.warn?.(picked.warning);

  // D4: "edge fn loads where active AND bank_version = <current>". The
  // raw rows carry a non-`Item` `bankVersion` tag (buildItemBank ignores
  // unknown fields); filter to the picked version so two coexisting
  // active banks never mix. Empty version ("" — no active rows) ⇒ no
  // items ⇒ engine `bank_exhausted` (the D2 ship-EMPTY path).
  const scoped = picked.version.length === 0
    ? []
    : rawItems.filter(
      (r) => (r as { bankVersion?: string } | null)?.bankVersion ===
        picked.version,
    );

  const { bank, rejected } = buildItemBank(scoped, picked.version);
  if (rejected.length > 0) {
    // A bad item must never crash a live test (itemBank.ts:35 — "the
    // edge fn telemetries these"). The engine simply never selects them.
    deps.warn?.(`buildItemBank rejected ${rejected.length} item(s)`, rejected);
  }
  return bank;
}

function sessionDepsFrom(deps: Deps): SessionDeps {
  return { newSessionId: deps.newSessionId, now: deps.now, rng: deps.rng };
}

// ── Endpoint handlers ──────────────────────────────────────────────────

/**
 * POST /start  body: { selfRating?: SelfRating }
 *
 * Resume-or-new (design §4 + flag #5): an UNFINISHED session that is
 * stale → `abandoned` + fresh; non-stale `in_progress` → resume
 * (client continues with its held item, server can't re-serve it —
 * flag #4); non-stale `awaiting_self_rating` → resume at that phase.
 * Else create fresh; if `selfRating` supplied, apply it now (one
 * round-trip → the first item comes back immediately).
 */
async function handleStart(
  req: Request,
  userId: string,
  deps: Deps,
): Promise<Response> {
  let body: { selfRating?: unknown };
  try {
    body = (await req.json()) as { selfRating?: unknown };
  } catch {
    body = {};
  }
  const rating = body.selfRating === undefined
    ? null
    : asSelfRating(body.selfRating);
  if (body.selfRating !== undefined && rating === null) {
    return json({ error: "invalid_self_rating" }, 400);
  }

  const now = deps.now();
  const bank = await loadBank(deps);

  const existing = await deps.loadLatestUnfinished(userId);
  if (existing) {
    const swept = markAbandonedIfStale(existing, now, SESSION_ABANDON_TTL_MIN);
    if (swept.phase === "abandoned") {
      await deps.persistSession(swept);
      // fall through to a fresh start
    } else if (
      swept.phase === "in_progress" ||
      swept.phase === "awaiting_self_rating"
    ) {
      return json({
        sessionId: swept.sessionId,
        phase: swept.phase,
        item: null, // flag #4/#5 — client re-submits its held item
        bankVersion: swept.bankVersion,
        resumed: true,
      });
    }
  }

  const sdeps = sessionDepsFrom(deps);
  let session = createSession(sdeps, { userId, bankVersion: bank.version });
  let item: Item | null = null;
  if (rating !== null) {
    const turn = applySelfRating(sdeps, session, rating, bank);
    session = turn.session;
    item = turn.item;
  }

  await deps.persistSession(session);
  return json({
    sessionId: session.sessionId,
    phase: session.phase,
    item: item ? toPublicItem(item) : null,
    bankVersion: session.bankVersion,
    resumed: false,
  });
}

/**
 * POST /self-rating  body: { sessionId, rating }
 * Engine-guarded to `awaiting_self_rating`; any other phase →
 * applySelfRating is a documented no-op (session unchanged).
 */
async function handleSelfRating(
  req: Request,
  userId: string,
  deps: Deps,
): Promise<Response> {
  let body: { sessionId?: unknown; rating?: unknown };
  try {
    body = (await req.json()) as { sessionId?: unknown; rating?: unknown };
  } catch {
    return json({ error: "invalid_json" }, 400);
  }
  const sessionId = typeof body.sessionId === "string" ? body.sessionId : null;
  const rating = asSelfRating(body.rating);
  if (!sessionId) return json({ error: "sessionId_required" }, 400);
  if (!rating) return json({ error: "invalid_self_rating" }, 400);

  const session = await deps.loadSession(sessionId, userId);
  if (!session) return json({ error: "session_not_found" }, 404);

  const bank = await loadBank(deps);
  const turn = applySelfRating(sessionDepsFrom(deps), session, rating, bank);
  await deps.persistSession(turn.session);
  return json({
    sessionId: turn.session.sessionId,
    phase: turn.session.phase,
    item: turn.item ? toPublicItem(turn.item) : null,
  });
}

/**
 * POST /answer  body: { sessionId, response: Response }
 *
 * Flag #4 — reconstruct the live anchor per request. A submission is
 * valid iff: session `in_progress` ∧ itemId ∈ bank ∧ itemId NOT already
 * answered (rebuilt from placement_responses). Then `advance` runs over
 * a session whose `currentItemId` == the submitted id and whose
 * `servedItemIds` folds that id in (so the engine's "served before
 * answered" invariant holds — an answered item is never re-selected).
 * An invalid (stale / duplicate / unknown) submission appends NOTHING
 * and returns the current phase (idempotent convergence).
 *
 * On termination, finalize in the SAME request (assembleResult →
 * writeCompletion).
 */
async function handleAnswer(
  req: Request,
  userId: string,
  deps: Deps,
): Promise<Response> {
  let body: { sessionId?: unknown; response?: unknown };
  try {
    body = (await req.json()) as { sessionId?: unknown; response?: unknown };
  } catch {
    return json({ error: "invalid_json" }, 400);
  }
  const sessionId = typeof body.sessionId === "string" ? body.sessionId : null;
  if (!sessionId) return json({ error: "sessionId_required" }, 400);
  const response = parseResponse(body.response);
  if (!response) return json({ error: "invalid_response" }, 400);

  const session = await deps.loadSession(sessionId, userId);
  if (!session) return json({ error: "session_not_found" }, 404);

  const bank = await loadBank(deps);
  const answered = bank.byId[response.itemId] ?? null;
  const alreadyAnswered = session.administered.some(
    (r) => r.itemId === response.itemId,
  );
  const isLiveTarget =
    session.phase === "in_progress" && answered !== null && !alreadyAnswered;

  if (!isLiveTarget) {
    // Stale / duplicate / unknown — append nothing, just report state.
    return json({
      sessionId: session.sessionId,
      phase: session.phase,
      item: null,
      result: null,
      deduplicated: true,
    });
  }

  const seq = session.administered.length;
  // Fold the submitted id into the anchor + servedItemIds so the engine
  // sees exactly the live invariant (item served, now being answered).
  const servedItemIds = session.servedItemIds.includes(response.itemId)
    ? session.servedItemIds
    : [...session.servedItemIds, response.itemId];
  const anchored: SessionState = {
    ...session,
    currentItemId: response.itemId,
    servedItemIds,
  };

  const adv = advance(sessionDepsFrom(deps), anchored, response, bank);

  await deps.appendResponse({
    session: adv.session,
    response,
    seq,
    itemType: answered.type,
    itemCefr: answered.cefr,
  });

  if (adv.session.phase !== "terminating") {
    await deps.persistSession(adv.session);
    return json({
      sessionId: adv.session.sessionId,
      phase: adv.session.phase,
      item: adv.item ? toPublicItem(adv.item) : null,
      result: null,
    });
  }

  // ── Finalize (terminating → complete) ────────────────────────────────
  const prev = await deps.loadPrevHistory(userId, adv.session.sessionId);
  const outcome = assembleResult(adv.session, bank, {
    now: deps.now,
    recommendedRoomFor,
    previous: prev,
  });
  if (outcome.result === null) {
    // Defensive: assembleResult only no-ops off a non-terminating
    // phase, impossible here. Persist the terminating state so /result
    // can finalize; never throw.
    await deps.persistSession(adv.session);
    return json({
      sessionId: adv.session.sessionId,
      phase: adv.session.phase,
      item: null,
      result: null,
    });
  }

  await deps.writeCompletion({
    session: outcome.session,
    historyEntry: historyEntryFromResult(outcome.result),
    snapshot: legacySnapshotFromResult(outcome.result),
    terminationReason: outcome.result.terminationReason,
  });
  return json({
    sessionId: outcome.session.sessionId,
    phase: outcome.session.phase, // "complete"
    item: null,
    result: outcome.result,
  });
}

/**
 * POST /result  body: { sessionId }
 *
 * Idempotent finalize/fetch. A still-`terminating` session is finalized
 * exactly like /answer's tail. An already-`complete` session is
 * RE-ASSEMBLED deterministically: coerce the rebuilt state back to
 * `terminating` IN MEMORY (not persisted) and re-run assembleResult with
 * `now` PINNED to the stored completion instant (a complete session's
 * `updatedAt`). result.ts is explicit that reason/overall are
 * "re-derived … resume-from-DB safe … never re-rolled" → byte-identical
 * payload with zero extra stored columns.
 */
async function handleResult(
  req: Request,
  userId: string,
  deps: Deps,
): Promise<Response> {
  let body: { sessionId?: unknown };
  try {
    body = (await req.json()) as { sessionId?: unknown };
  } catch {
    return json({ error: "invalid_json" }, 400);
  }
  const sessionId = typeof body.sessionId === "string" ? body.sessionId : null;
  if (!sessionId) return json({ error: "sessionId_required" }, 400);

  const session = await deps.loadSession(sessionId, userId);
  if (!session) return json({ error: "session_not_found" }, 404);
  if (session.phase !== "terminating" && session.phase !== "complete") {
    return json({ error: "not_finalizable", phase: session.phase }, 409);
  }

  const bank = await loadBank(deps);
  const prev = await deps.loadPrevHistory(userId, session.sessionId);

  if (session.phase === "terminating") {
    const outcome = assembleResult(session, bank, {
      now: deps.now,
      recommendedRoomFor,
      previous: prev,
    });
    if (outcome.result === null) return json({ error: "finalize_failed" }, 500);
    await deps.writeCompletion({
      session: outcome.session,
      historyEntry: historyEntryFromResult(outcome.result),
      snapshot: legacySnapshotFromResult(outcome.result),
      terminationReason: outcome.result.terminationReason,
    });
    return json({
      sessionId: outcome.session.sessionId,
      phase: outcome.session.phase,
      result: outcome.result,
    });
  }

  const pinned = session.updatedAt;
  const reassembled = assembleResult(
    { ...session, phase: "terminating" },
    bank,
    { now: () => pinned, recommendedRoomFor, previous: prev },
  );
  if (reassembled.result === null) {
    return json({ error: "reassemble_failed" }, 500);
  }
  return json({
    sessionId: session.sessionId,
    phase: "complete",
    result: reassembled.result,
  });
}

/** POST /abandon  body: { sessionId } — explicit user abandon (distinct
 *  from the §4 TTL sweep). Settled phases are left as-is. */
async function handleAbandon(
  req: Request,
  userId: string,
  deps: Deps,
): Promise<Response> {
  let body: { sessionId?: unknown };
  try {
    body = (await req.json()) as { sessionId?: unknown };
  } catch {
    return json({ error: "invalid_json" }, 400);
  }
  const sessionId = typeof body.sessionId === "string" ? body.sessionId : null;
  if (!sessionId) return json({ error: "sessionId_required" }, 400);

  const session = await deps.loadSession(sessionId, userId);
  if (!session) return json({ error: "session_not_found" }, 404);

  if (
    session.phase === "awaiting_self_rating" ||
    session.phase === "in_progress"
  ) {
    await deps.persistSession({
      ...session,
      phase: "abandoned",
      updatedAt: deps.now(),
    });
  }
  return json({ ok: true });
}

// ── Router (mock-interview/core.ts idiom) ──────────────────────────────

export async function handleRequest(
  req: Request,
  deps: Deps,
): Promise<Response> {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return json({ error: "method_not_allowed" }, 405);
  }

  const url = new URL(req.url);
  const path = url.pathname.replace(/^.*\/placement-session/, "") || "/";

  const user = await deps.getUser(req);
  if (!user) {
    return json(
      {
        error: "auth_required",
        message: "Sign in to take the placement test.",
        message_vi: "Vui lòng đăng nhập để làm bài kiểm tra xếp lớp.",
      },
      401,
    );
  }

  const route = path.replace(/\/+$/, "") || "/";
  switch (route) {
    case "/start":
      return handleStart(req, user.id, deps);
    case "/self-rating":
      return handleSelfRating(req, user.id, deps);
    case "/answer":
      return handleAnswer(req, user.id, deps);
    case "/result":
      return handleResult(req, user.id, deps);
    case "/abandon":
      return handleAbandon(req, user.id, deps);
    default:
      return json({ error: "not_found", path }, 404);
  }
}
