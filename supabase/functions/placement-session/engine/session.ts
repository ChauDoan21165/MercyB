// supabase/functions/placement-session/engine/session.ts
//
// Placement Test v2 — session lifecycle / state machine (Phase 2, PR 7).
//
// Implements: sequence-doc PR 7; design §4 (start / self-rating / resume
// / abandon + the SessionPhase transitions). This is the SCORING-FREE
// part of "the orchestrator (a later PR)" that terminator.ts:62 and the
// estimator/selector headers point at: it wires the already-merged pure
// modules — seed/priorMeanForSelfRating (PR 3), selectNextItem (PR 5) —
// into a SessionState, and owns the phase machine + the §4 abandon-TTL /
// resume-anchor rules. The SCORED turn step (`advance`: apply a
// Response, re-estimate θ̂, run the terminator, select-or-finalize) is
// DELIBERATELY NOT here — it needs the Response→ScoredItem scoring
// mapping, which the estimator/itemSelector headers lock to PR 8
// ("where scoring lives", incl. decision-#3 writing-sample exclusion +
// the L1-revealed discount). Authoring it here would either duplicate
// that mapping or ship a dead stub seam (CLAUDE.md "dead-code wiring"
// trap). So PR 7 stops exactly at the scoring boundary; PR 8 adds
// `advance` + result assembly on top.
//
// SERVER-SIDE (locked Q1). PURE given an injected `SessionDeps` — the
// only non-deterministic inputs (session id, wall-clock ISO timestamps,
// the selector's randomesque rng) are DI, so the whole lifecycle is
// deterministic + vitest-golden-testable (the locked mock-interview
// core.ts + DI Deps pattern). Imports are this series' own config/types
// + the merged PR-3/PR-5 engine functions only — no Deno/URL ⇒
// tsconfig.functions.json (gate #6) type-checks it.
//
// RECONSTRUCTION NOTE (flagged in the PR + to Chau, same discipline as
// `itemSelector.randomesqueK` #712 / `terminator` precedence #718): the
// design+sequence docs are ephemeral and unavailable this session.
// "PR 7 = §4 lifecycle, scoring-free" is itself reconstructed from the
// in-repo breadcrumbs (terminator.ts:62 "the orchestrator (a later
// PR)"; itemSelector.ts:14 numbers PR 8 = scoring/answer-key/result;
// estimator §-mapping). Every numeric/threshold choice below is anchored
// to an EXISTING named constant (SESSION_ABANDON_TTL_MIN, PRIOR_SD,
// SELF_RATING_PRIOR_MEAN via priorMeanForSelfRating) — no new knob
// invented; the scope cut at the scoring boundary is the only inference,
// and it FOLLOWS the locked "scoring is PR 8" decision rather than
// contradicting it (doc-availability gap, not a locked-decision clash).

import { PRIOR_SD, SESSION_ABANDON_TTL_MIN } from "../config.ts";
import { priorMeanForSelfRating, seed } from "./thetaEstimator.ts";
import { selectNextItem } from "./itemSelector.ts";
import type {
  Item,
  ItemBank,
  ItemType,
  SelfRating,
  SessionState,
} from "../types.ts";

/**
 * Injected non-determinism (the locked DI seam). The edge function
 * supplies real implementations (crypto session id, `new Date()
 * .toISOString()`, `Math.random`); tests script all three so every
 * lifecycle transition is an exact golden.
 */
export interface SessionDeps {
  /** Fresh, unique session id. */
  newSessionId: () => string;
  /** Current wall-clock instant as an ISO-8601 string. */
  now: () => string;
  /** Uniform [0, 1) — only consumed by the selector's randomesque draw
   *  when a first item is chosen. */
  rng: () => number;
}

/** A lifecycle step's result: the new immutable state + the item now
 *  awaiting a response (the FULL server `Item`; the edge fn strips it to
 *  `PublicItem` before it leaves the server). `item` is null when no
 *  item is outstanding (pre-rating, or the bank had nothing to serve). */
export interface SessionTurn {
  session: SessionState;
  item: Item | null;
}

/** All-five-keys zero counts (explicit, no cast — `SessionState
 *  .typeCounts` is the full `Record<ItemType,number>`; mirrors
 *  itemBank.buildItemBank's all-keys construction). */
function zeroTypeCounts(): Record<ItemType, number> {
  return {
    reading: 0,
    listening: 0,
    grammar: 0,
    vocabulary: 0,
    writing_sample: 0,
  };
}

/** Unfinished phases — the only ones a §4 abandon-TTL sweep can move to
 *  `abandoned`, and the only ones a resume applies to. `terminating`/
 *  `complete`/`abandoned` are settled (PR-8 result step owns them). */
const UNFINISHED: ReadonlySet<SessionState["phase"]> = new Set([
  "awaiting_self_rating",
  "in_progress",
]);

/**
 * Create a new session (design §4, step 1). Phase
 * `awaiting_self_rating`: no θ̂ exists yet, so `current` is a neutral
 * `seed(0, PRIOR_SD)` placeholder (method `'seed'`, not converged — it
 * is replaced the instant a self-rating arrives). No item is served
 * until the learner self-rates.
 */
export function createSession(
  deps: SessionDeps,
  args: { userId: string; bankVersion: string },
): SessionState {
  const ts = deps.now();
  return {
    sessionId: deps.newSessionId(),
    userId: args.userId,
    bankVersion: args.bankVersion,
    phase: "awaiting_self_rating",
    selfRating: null,
    priorMean: 0,
    administered: [],
    servedItemIds: [],
    current: seed(0, PRIOR_SD),
    currentItemId: null,
    typeCounts: zeroTypeCounts(),
    startedAt: ts,
    updatedAt: ts,
  };
}

/**
 * Apply the learner's self-rating (design §4 / §2.5): set μ₀ from
 * `priorMeanForSelfRating` (the single source — "not_sure ⇒
 * conservative A2"), seed θ̂ = `seed(μ₀, PRIOR_SD)` (n == 0 ⇒ posterior
 * == prior, exactly the estimator's seed contract), and select the FIRST
 * item via the PR-5 selector at θ̂ = μ₀.
 *
 * Phase → `in_progress` with that item as the resume anchor; or →
 * `terminating` if the bank can serve nothing (empty/all-served — the
 * PR-8 result step maps that to `bank_exhausted`).
 *
 * IDEMPOTENT GUARD: callable only from `awaiting_self_rating`. From any
 * other phase it is a no-op returning the session unchanged + `item:
 * null` (the engine never throws / never crashes a live session — the
 * edge fn is responsible for not double-submitting; "core path survives
 * optional failures").
 */
export function applySelfRating(
  deps: SessionDeps,
  session: SessionState,
  rating: SelfRating,
  bank: ItemBank,
): SessionTurn {
  if (session.phase !== "awaiting_self_rating") {
    return { session, item: null };
  }

  const priorMean = priorMeanForSelfRating(rating);
  const current = seed(priorMean, PRIOR_SD);
  const typeCounts = zeroTypeCounts();

  const first = selectNextItem(
    bank,
    { theta: priorMean, servedItemIds: [], typeCounts },
    deps.rng,
  );
  const ts = deps.now();

  if (first === null) {
    return {
      session: {
        ...session,
        selfRating: rating,
        priorMean,
        current,
        phase: "terminating",
        currentItemId: null,
        updatedAt: ts,
      },
      item: null,
    };
  }

  return {
    session: {
      ...session,
      selfRating: rating,
      priorMean,
      current,
      phase: "in_progress",
      servedItemIds: [first.id],
      currentItemId: first.id,
      updatedAt: ts,
    },
    item: first,
  };
}

/**
 * Is an unfinished session stale per design §4 — no activity for longer
 * than `SESSION_ABANDON_TTL_MIN`? Settled phases (terminating/complete/
 * abandoned) are never "stale". Strict `>`: a session exactly at the TTL
 * edge is NOT yet abandoned (one-sided, deterministic boundary).
 */
export function isStale(
  session: SessionState,
  now: string,
  ttlMin: number = SESSION_ABANDON_TTL_MIN,
): boolean {
  if (!UNFINISHED.has(session.phase)) return false;
  const idleMs = Date.parse(now) - Date.parse(session.updatedAt);
  return idleMs > ttlMin * 60_000;
}

/**
 * Mark a stale unfinished session `abandoned` (design §4: "a
 * started-but-not-completed session older than this … is treated as
 * `abandoned`; a fresh `start` begins a new one"). Non-stale or settled
 * sessions are returned unchanged (immutable, no clone).
 */
export function markAbandonedIfStale(
  session: SessionState,
  now: string,
  ttlMin: number = SESSION_ABANDON_TTL_MIN,
): SessionState {
  if (!isStale(session, now, ttlMin)) return session;
  return { ...session, phase: "abandoned", updatedAt: now };
}

/**
 * Can this session be resumed (design §4 resume anchor)? True iff it is
 * `in_progress`, still has an outstanding item awaiting a response
 * (`currentItemId` — also `Response.shownAt`'s idempotency anchor), and
 * has not gone stale. The edge fn re-serves `currentItemId` on resume so
 * a dropped connection never loses or double-counts an item.
 */
export function canResume(
  session: SessionState,
  now: string,
  ttlMin: number = SESSION_ABANDON_TTL_MIN,
): boolean {
  return (
    session.phase === "in_progress" &&
    session.currentItemId !== null &&
    !isStale(session, now, ttlMin)
  );
}
