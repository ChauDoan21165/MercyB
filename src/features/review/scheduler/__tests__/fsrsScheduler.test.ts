// src/features/review/scheduler/__tests__/fsrsScheduler.test.ts — Lane D / D1
//
// Deterministic: every test pins `nowMs`. The scheduler never reads the wall
// clock, so these are stable across runs/machines.

import { describe, it, expect } from "vitest";

import { createScheduler } from "../fsrsScheduler";
import type {
  ReviewGrade,
  SchedulerCardState,
} from "@/features/review/types";

// A fixed, arbitrary instant: 2026-01-01T00:00:00.000Z.
const T0 = Date.UTC(2026, 0, 1, 0, 0, 0, 0);
const DAY = 86_400_000;

const FLOW = "vi-en" as const;
const ITEM = "vi-en:vocab:hello";

function gradeOnce(
  state: SchedulerCardState,
  grade: ReviewGrade,
  nowMs: number,
): SchedulerCardState {
  const sched = createScheduler();
  return sched.review(state, grade, nowMs, ITEM, FLOW).state;
}

describe("fsrsScheduler — newCard", () => {
  it("returns a fresh card due at/near now in state 'new'", () => {
    const sched = createScheduler();
    const card = sched.newCard(T0);

    expect(card.state).toBe("new");
    expect(card.reps).toBe(0);
    expect(card.lapses).toBe(0);
    expect(card.lastReview).toBeNull();
    // A brand-new card is due immediately (within a second of now).
    expect(Math.abs(card.due - T0)).toBeLessThanOrEqual(1000);
  });
});

describe("fsrsScheduler — review progression", () => {
  it("grading 'good' repeatedly increases the interval", () => {
    const sched = createScheduler();
    let state = sched.newCard(T0);
    let now = T0;

    const intervals: number[] = [];
    // Drive several 'good' reviews, advancing the clock to each due date so
    // the card graduates out of short-term learning into review with growing
    // spacing.
    for (let i = 0; i < 6; i++) {
      const result = sched.review(state, "good", now, ITEM, FLOW);
      intervals.push(result.intervalDays);
      state = result.state;
      // Advance the clock to the moment it next becomes due.
      now = state.due;
    }

    // Reach the long-term review state.
    expect(state.state).toBe("review");
    expect(state.reps).toBeGreaterThan(0);

    // Once in review, successive 'good' intervals strictly grow.
    const reviewIntervals = intervals.filter((d) => d >= 1);
    expect(reviewIntervals.length).toBeGreaterThanOrEqual(2);
    for (let i = 1; i < reviewIntervals.length; i++) {
      expect(reviewIntervals[i]).toBeGreaterThan(reviewIntervals[i - 1]);
    }
  });
});

describe("fsrsScheduler — lapse", () => {
  it("grading 'again' on a review-state card increments lapses and shortens the interval", () => {
    const sched = createScheduler();

    // Build a card up to the 'review' state with a meaningful interval.
    let state = sched.newCard(T0);
    let now = T0;
    for (let i = 0; i < 5 && state.state !== "review"; i++) {
      const r = sched.review(state, "good", now, ITEM, FLOW);
      state = r.state;
      now = state.due;
    }
    // One more 'good' to grow the interval well past a day.
    {
      const r = sched.review(state, "good", now, ITEM, FLOW);
      state = r.state;
      now = state.due;
    }

    expect(state.state).toBe("review");
    const goodInterval = state.scheduledDays;
    const lapsesBefore = state.lapses;
    expect(goodInterval).toBeGreaterThan(1);

    // Grade the SAME card at the SAME instant two ways for a fair comparison.
    const failed = gradeOnce(state, "again", now);
    const passed = gradeOnce(state, "good", now);

    expect(failed.lapses).toBe(lapsesBefore + 1);
    // 'good' does not lapse.
    expect(passed.lapses).toBe(lapsesBefore);
    // The interval after a lapse is much shorter than the prior 'good' one…
    expect(failed.scheduledDays).toBeLessThan(goodInterval);
    // …and shorter than passing the card again right now.
    expect(failed.scheduledDays).toBeLessThan(passed.scheduledDays);
    expect(failed.due).toBeLessThan(passed.due);
  });
});

describe("fsrsScheduler — preview", () => {
  it("returns 4 grades with again <= hard <= good <= easy intervals", () => {
    const sched = createScheduler();

    // Use a matured review card so the ordering is meaningful in days.
    let state = sched.newCard(T0);
    let now = T0;
    for (let i = 0; i < 6; i++) {
      const r = sched.review(state, "good", now, ITEM, FLOW);
      state = r.state;
      now = state.due;
    }

    const p = sched.preview(state, now);

    expect(Object.keys(p).sort()).toEqual(
      ["again", "easy", "good", "hard"].sort(),
    );
    expect(p.again).toBeLessThanOrEqual(p.hard);
    expect(p.hard).toBeLessThanOrEqual(p.good);
    expect(p.good).toBeLessThanOrEqual(p.easy);
  });

  it("does not mutate the input state", () => {
    const sched = createScheduler();
    const state = sched.newCard(T0);
    const snapshot = JSON.stringify(state);

    sched.preview(state, T0 + DAY);

    expect(JSON.stringify(state)).toBe(snapshot);
  });
});
