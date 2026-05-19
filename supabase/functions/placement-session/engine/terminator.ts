// supabase/functions/placement-session/engine/terminator.ts
//
// Placement Test v2 — adaptive stop rule / terminator (Phase 2, PR 6).
//
// Implements: sequence-doc PR 6; design §2.7 (the stop rule + length
// bounds). Consumes PR-3's `ThetaEstimate.se` (the working EAP SE —
// locked decision #2) and the per-type administered counts; produces the
// `TerminationReason` union from types.ts §2.3
// ("precision" | "max_items" | "bank_exhausted"). The companion to
// itemSelector.ts (PR 5): the selector decides WHAT to ask next, the
// terminator decides WHETHER to ask at all. itemSelector's header states
// the contract this module honors verbatim: "`selectNextItem` returning
// `null` (eligible pool empty) is the ONE termination signal the selector
// owns: the terminator maps it to `bank_exhausted`."
//
// SERVER-SIDE, like all engine/* code (locked Q1): the stop decision and
// the SE that drives it never reach the browser. PURE, dependency-light:
// imports are only this series' own config + itemSelector's single source
// of "administered count" (DRY — same cross-module reuse as
// thetaEstimator importing irt). No Deno/URL ⇒ tsconfig.functions.json
// (gate #6) type-checks it; vitest runs its goldens.
//
// SCOPE: this is the in-test stop rule ONLY. The post-test retest
// cooldown (`RETEST_COOLDOWN_DAYS`) and CEFR banding live with result
// assembly (a later PR), not here — same scope-boundary discipline as
// irt.ts→{a,b}, thetaEstimator→ScoredItem[], itemSelector→SelectionState:
// a minimal hand-written `TerminationState`, NOT the full SessionState.
//
// RECONSTRUCTION NOTE (flagged in the PR + to Chau, same discipline as
// `itemSelector.randomesqueK` in #712): the design doc is ephemeral and
// unavailable this session. §2.7 is pinned by the in-repo config.ts
// annotations EXCEPT one ordering choice with no named constant — the
// PRECEDENCE between the three reasons when more than one fires at once.
// config.ts calls `TYPE_QUOTAS` "Hard minimums that MUST be met before
// terminate"; a literal reading would block EVERY stop on unmet quotas,
// but `max_items` (hard cap) and `bank_exhausted` (nothing left to ask)
// are FORCED stops — honoring quotas there is impossible (infinite test /
// no item to serve). Standard CAT practice, adopted here: quotas + the
// MIN_ITEMS floor gate the ELECTIVE `precision` stop only; the two forced
// stops override. The precedence is isolated in the single pure
// `evaluateTermination` (one-line reorder if the doc later says
// otherwise) and anchored entirely to existing named constants — no new
// knob invented.

import { MAX_ITEMS, MIN_ITEMS, SE_STOP, TYPE_QUOTAS } from "../config.ts";
import { administeredCount, SCORED_TYPES } from "./itemSelector.ts";
import type { ItemType, TerminationReason } from "../types.ts";

/**
 * Minimal structural input the terminator needs from the live session —
 * NOT the full `SessionState` (the engine scope-boundary house style).
 * Hand-written, not derived: keeps the contract explicit + stable.
 */
export interface TerminationState {
  /** SE(θ̂) from the working EAP estimator (`ThetaEstimate.se`, PR 3).
   *  +Infinity for a freshly seeded session ⇒ never precision-stops. */
  se: number;
  /** Scored items administered per type so far. Missing keys read as 0;
   *  `writing_sample` (if present) is ignored (unscored, decision #3). */
  typeCounts: Partial<Record<ItemType, number>>;
  /** Whether ≥1 eligible (unserved, scored) item remains in the bank.
   *  The orchestrator (a later PR) computes this from
   *  `itemSelector.eligibleItems(...).length > 0` and passes it in — the
   *  terminator stays decoupled from the bank, the same boundary as the
   *  estimator not taking `Item[]`. `false` ⇒ a forced `bank_exhausted`
   *  stop (the selector would have returned `null`). */
  hasEligibleItem: boolean;
}

/** The terminator's verdict. `reason` is non-null iff `stop` is true. */
export interface TerminationDecision {
  stop: boolean;
  reason: TerminationReason | null;
}

/**
 * Are all HARD `TYPE_QUOTAS` minimums met? (design §2.7 / config:
 * "Hard minimums that MUST be met before [the elective] terminate".)
 *
 * Only the three quota'd types matter (reading 3, listening 3,
 * grammar 2); `vocabulary` has no quota ⇒ vacuously satisfied;
 * `writing_sample` is unscored and never administered. A type whose
 * count exactly equals its quota counts as MET (`>=`).
 */
export function hardQuotasMet(
  typeCounts: Partial<Record<ItemType, number>>,
): boolean {
  for (const t of SCORED_TYPES) {
    const quota = TYPE_QUOTAS[t] ?? 0;
    if (quota > 0 && (typeCounts[t] ?? 0) < quota) return false;
  }
  return true;
}

/**
 * The §2.7 stop rule. Evaluated AFTER each response is scored and θ̂ is
 * re-estimated, BEFORE selecting the next item. Precedence (see the
 * header's RECONSTRUCTION NOTE for why forced stops outrank the
 * quota/floor gate):
 *
 *   1. `max_items`     — administered ≥ MAX_ITEMS. Hard cap; the
 *                        dominant invariant — the test NEVER exceeds it,
 *                        regardless of SE / quotas / remaining items.
 *                        Reported in preference to `bank_exhausted` when
 *                        both hold (hitting the cap is the design intent;
 *                        "ran out" is incidental at that point).
 *   2. `bank_exhausted`— no eligible item remains. Forced: cannot
 *                        continue with nothing to ask, even below
 *                        MIN_ITEMS / with unmet quotas / huge SE.
 *   3. `precision`     — the ELECTIVE early stop: administered ≥
 *                        MIN_ITEMS (anti lucky-streak floor) AND all
 *                        hard quotas met AND se < SE_STOP (strict: a SE
 *                        exactly at the threshold keeps going).
 *   4. otherwise       — continue (stop:false, reason:null).
 */
export function evaluateTermination(
  state: TerminationState,
): TerminationDecision {
  const n = administeredCount(state.typeCounts);

  if (n >= MAX_ITEMS) return { stop: true, reason: "max_items" };
  if (!state.hasEligibleItem) {
    return { stop: true, reason: "bank_exhausted" };
  }
  if (
    n >= MIN_ITEMS &&
    hardQuotasMet(state.typeCounts) &&
    state.se < SE_STOP
  ) {
    return { stop: true, reason: "precision" };
  }
  return { stop: false, reason: null };
}
