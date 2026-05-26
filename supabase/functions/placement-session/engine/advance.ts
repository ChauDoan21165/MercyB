// supabase/functions/placement-session/engine/advance.ts
//
// Placement Test v2 — the scored turn step (Phase 2, PR 8).
//
// Implements: sequence-doc PR 8. This is the second half of "the
// orchestrator (a later PR)" the terminator/estimator/selector headers
// point at, and the piece PR 7's session.ts header explicitly defers:
// "The SCORED turn step (`advance`: apply a Response, re-estimate θ̂, run
// the terminator, select-or-finalize) is DELIBERATELY NOT here — it needs
// the Response→ScoredItem scoring mapping … So PR 7 stops exactly at the
// scoring boundary; PR 8 adds `advance` + result assembly on top."
//
// `advance` is the in-test loop body, run once per answered item:
//
//   apply Response → re-estimate θ̂ (EAP/MLE, PR 3) → terminator (PR 6)
//     ├─ stop  → phase `terminating` (result.ts finalizes → `complete`)
//     └─ go on → select next item (PR 5) → phase stays `in_progress`
//
// It owns ONLY the `in_progress → in_progress | terminating` transition;
// session.ts owns every other phase edge (one-owner-per-function). It is
// the sole writer of the SCORED `ThetaEstimate` into `SessionState`
// (createSession/applySelfRating only ever write the `seed` placeholder).
//
// SERVER-SIDE, PURE given the same injected `SessionDeps` as session.ts
// (`now`, `rng` — `newSessionId` is unused here but kept so the edge fn
// threads ONE deps object through the whole lifecycle). Deterministic +
// golden-testable. Imports are this series' own modules only (no
// Deno/URL) ⇒ tsconfig.functions.json (gate #6) type-checks it.
//
// IDEMPOTENCY / RESUME (design §4, mirrors session.ts's guard discipline):
// `advance` is a no-op (session unchanged, `item:null`, `termination:
// null`, no rng/clock drawn) unless ALL hold — phase `in_progress`, an
// outstanding `currentItemId`, and the response targets exactly that
// item. A duplicate / stale / mismatched submit therefore can never
// double-count an item or crash a live session; the edge fn owns
// de-duplication, the engine just refuses to mutate ("permissions are
// product logic / core path survives optional failures").

import { evaluateTermination } from "./terminator.ts";
import { eligibleItems, selectNextItem } from "./itemSelector.ts";
import { estimate } from "./thetaEstimator.ts";
import { toScoredItems } from "./scoring.ts";
import { itemById } from "./itemBank.ts";
import type { SessionDeps } from "./session.ts";
import type { TerminationDecision } from "./terminator.ts";
import type { Item, ItemBank, Response, SessionState } from "../types.ts";

/**
 * One scored-turn result: the new immutable state, the NEXT item awaiting
 * a response (the full server `Item`; the edge fn strips it to
 * `PublicItem` — null when the test just terminated), and the
 * `TerminationDecision` that ended it (non-null iff this step stopped the
 * test; the `TerminationReason` result.ts re-derives independently —
 * threaded here only so the orchestrator/tests can read it without a
 * second pass). Superset of PR 7's `SessionTurn` plus `termination`.
 */
export interface AdvanceResult {
  session: SessionState;
  item: Item | null;
  termination: TerminationDecision | null;
}

/** Untouched no-op (the idempotency / resume guard outcome). Same
 *  "return the session unchanged, never throw" shape as
 *  session.ts:applySelfRating's guard. */
function noop(session: SessionState): AdvanceResult {
  return { session, item: null, termination: null };
}

/**
 * Apply the learner's response to the outstanding item and take one step.
 *
 * Guard (no-op unless ALL hold):
 *   • phase === "in_progress"
 *   • currentItemId !== null
 *   • response.itemId === currentItemId   (the resume / idempotency
 *     anchor — only the awaited item's response advances the test)
 *
 * On a valid response:
 *   1. APPEND to `administered` (append-only; index == item order — the
 *      types.ts contract). The just-answered id is already in
 *      `servedItemIds` (added when it was selected); `typeCounts` is
 *      bumped for the answered item's type — `typeCounts` is the count of
 *      *answered* scored items per type, exactly what the
 *      selector/terminator consume (a served-but-unanswered item never
 *      counts; mirrors applySelfRating serving item 1 with zeroed
 *      counts).
 *   2. RE-ESTIMATE θ̂ over ALL scored responses (`toScoredItems` applies
 *      decision #3 + the L1-revealed discount), prior mean from the
 *      self-rating. This is the working EAP/MLE estimate of record.
 *   3. TERMINATE? `evaluateTermination` with the fresh SE, the answered
 *      `typeCounts`, and `hasEligibleItem` = "≥1 unserved scored item
 *      remains" (the bank fact the terminator's header says the
 *      orchestrator must compute and pass in).
 *        • stop → phase `terminating`, `currentItemId:null`,
 *          `item:null`, `termination` = the decision. result.ts maps
 *          `terminating → complete` + the `ResultPayload`.
 *        • continue → select the next item (PR 5) at the new θ̂; serve
 *          it (append to `servedItemIds`, set `currentItemId`), phase
 *          stays `in_progress`.
 *
 * Defensive belt: if the terminator says "continue" but the selector
 * still returns null (cannot happen when `hasEligibleItem` is true — kept
 * so a future bank/selector change can never crash a live session), fold
 * to a forced `bank_exhausted` stop. Deterministic, never throws.
 */
export function advance(
  deps: SessionDeps,
  session: SessionState,
  response: Response,
  bank: ItemBank,
): AdvanceResult {
  if (
    session.phase !== "in_progress" ||
    session.currentItemId === null ||
    response.itemId !== session.currentItemId
  ) {
    return noop(session);
  }

  const ts = deps.now();
  const administered: Response[] = [...session.administered, response];

  // Bump the answered item's type count (faithful to the actual item;
  // writing_sample is harmlessly counted but ignored by every scored-type
  // consumer — administeredCount/quotas iterate SCORED_TYPES only).
  const answered = itemById(bank, response.itemId);
  const typeCounts: SessionState["typeCounts"] = { ...session.typeCounts };
  if (answered !== null) typeCounts[answered.type] += 1;

  // Re-estimate θ̂ over every scored response (decision #3 + L1 discount
  // applied in toScoredItems — the single scoring source).
  const current = estimate(toScoredItems(bank, administered), {
    priorMean: session.priorMean,
  });

  const hasEligibleItem =
    eligibleItems(bank, session.servedItemIds).length > 0;

  const decision = evaluateTermination({
    se: current.se,
    typeCounts,
    hasEligibleItem,
  });

  if (decision.stop) {
    return {
      session: {
        ...session,
        administered,
        typeCounts,
        current,
        phase: "terminating",
        currentItemId: null,
        updatedAt: ts,
      },
      item: null,
      termination: decision,
    };
  }

  const next = selectNextItem(
    bank,
    {
      theta: current.theta,
      servedItemIds: session.servedItemIds,
      typeCounts,
    },
    deps.rng,
  );

  if (next === null) {
    // Unreachable while hasEligibleItem is true; folded to the forced
    // bank_exhausted stop so a future change can never strand a session.
    const forced = evaluateTermination({
      se: current.se,
      typeCounts,
      hasEligibleItem: false,
    });
    return {
      session: {
        ...session,
        administered,
        typeCounts,
        current,
        phase: "terminating",
        currentItemId: null,
        updatedAt: ts,
      },
      item: null,
      termination: forced,
    };
  }

  return {
    session: {
      ...session,
      administered,
      typeCounts,
      current,
      servedItemIds: [...session.servedItemIds, next.id],
      currentItemId: next.id,
      phase: "in_progress",
      updatedAt: ts,
    },
    item: next,
    termination: null,
  };
}
