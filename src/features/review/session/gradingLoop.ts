// src/features/review/session/gradingLoop.ts — Lane D / D4
//
// Apply a grade to the current card of a session. Pure-ish: the only side
// effects are the store writes (putCard / appendLog / incrementDailyCount); the
// returned ReviewSessionState is a fresh object (the input is not mutated).
//
// Time is ms-epoch + an explicit clock (nowMs); never Date.now().

import type {
  ReviewGrade,
  ReviewSessionState,
  StoredCard,
} from "@/features/review/types";

import type { SessionDeps } from "./deps";
import { dayKey } from "./queueBuilder";

/**
 * Grade the current card (state.queue[state.index]).
 *
 * - scheduler.review(...) → new scheduling state + interval + log entry.
 * - store.putCard(updated), store.appendLog(log).
 * - store.incrementDailyCount(flow, day, { reviews: 1, newCards: wasNew ? 1 : 0 }).
 * - bump state.grades[grade], state.newIntroduced (if the card was new), and
 *   advance state.index by one.
 *
 * Returns the next session state. If the session is already complete
 * (index >= queue.length), it is a no-op that returns the input state unchanged.
 */
export async function gradeCard(
  deps: SessionDeps,
  state: ReviewSessionState,
  grade: ReviewGrade,
  nowMs: number,
): Promise<ReviewSessionState> {
  const { scheduler, store } = deps;

  // Guard: no current card → nothing to grade.
  if (state.index >= state.queue.length) return state;

  const current = state.queue[state.index];
  const wasNew = current.isNew;

  const result = scheduler.review(
    current.card.state,
    grade,
    nowMs,
    current.item.id,
    state.flow,
  );

  const updatedCard: StoredCard = {
    ...current.card,
    state: result.state,
  };

  await store.putCard(updatedCard);
  await store.appendLog(result.log);
  await store.incrementDailyCount(state.flow, dayKey(nowMs), {
    reviews: 1,
    newCards: wasNew ? 1 : 0,
  });

  // Reflect the persisted state back into the queue entry so a re-read of the
  // session sees the updated card without a store round-trip.
  const nextQueue = state.queue.slice();
  nextQueue[state.index] = { ...current, card: updatedCard };

  return {
    ...state,
    queue: nextQueue,
    index: state.index + 1,
    grades: { ...state.grades, [grade]: state.grades[grade] + 1 },
    newIntroduced: state.newIntroduced + (wasNew ? 1 : 0),
  };
}

/** A zeroed grade tally — handy for constructing a fresh session state. */
export function emptyGrades(): Record<ReviewGrade, number> {
  return { again: 0, hard: 0, good: 0, easy: 0 };
}

/**
 * Build the initial session state for a freshly-built queue. Convenience for
 * the UI layer (D5) so it does not hand-roll the zeroed counters.
 */
export function startSession(
  flow: ReviewSessionState["flow"],
  queue: ReviewSessionState["queue"],
): ReviewSessionState {
  return {
    flow,
    queue,
    index: 0,
    grades: emptyGrades(),
    newIntroduced: 0,
  };
}
