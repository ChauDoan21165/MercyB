// src/features/review/session/summary.ts — Lane D / D4
//
// Summarize a finished (or in-progress) session. Pure: reads the session state
// for tallies and the store for the next due instant; no writes, no Date.now().

import type {
  ReviewGrade,
  ReviewSessionState,
  SessionSummary,
} from "@/features/review/types";

import type { SessionDeps } from "./deps";

/**
 * Produce a SessionSummary.
 *
 * - reviewed = sum of all grade counts.
 * - newIntroduced / grades = passed straight through from session state.
 * - nextDueAt = the minimum `state.due` across the flow's stored cards that is
 *   still strictly in the future (> nowMs); null if no future-due card exists.
 */
export async function summarize(
  deps: SessionDeps,
  state: ReviewSessionState,
  nowMs: number,
): Promise<SessionSummary> {
  const { store } = deps;

  const reviewed = (Object.keys(state.grades) as ReviewGrade[]).reduce(
    (sum, g) => sum + state.grades[g],
    0,
  );

  const cards = await store.getCards(state.flow);
  let nextDueAt: number | null = null;
  for (const c of cards) {
    const due = c.state.due;
    if (due > nowMs && (nextDueAt === null || due < nextDueAt)) {
      nextDueAt = due;
    }
  }

  return {
    flow: state.flow,
    reviewed,
    newIntroduced: state.newIntroduced,
    grades: { ...state.grades },
    nextDueAt,
  };
}
