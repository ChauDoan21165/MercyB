// src/features/gamification/engines/__tests__/streakEngine.test.ts
//
// Lane F — F1 streak engine tests. Pure-reducer behaviour, deterministic dates.

import { describe, it, expect } from "vitest";
import { streakEngine } from "../streakEngine";
import type { StreakState, StreakConfig } from "../../types";
import { DEFAULT_STREAK_CONFIG } from "../../defaults";

function freshState(overrides: Partial<StreakState> = {}): StreakState {
  return {
    current: 0,
    longest: 0,
    lastActiveDate: null,
    freezesAvailable: 0,
    freezeUsedDates: [],
    ...overrides,
  };
}

describe("streakEngine.recordActivity", () => {
  it("starts a streak on first activity", () => {
    const r = streakEngine.recordActivity(freshState(), "2026-06-01");
    expect(r.state.current).toBe(1);
    expect(r.state.longest).toBe(1);
    expect(r.state.lastActiveDate).toBe("2026-06-01");
    expect(r).toMatchObject({
      changed: true,
      incremented: true,
      freezeConsumed: false,
      broken: false,
    });
  });

  it("is a no-op when called twice on the same day", () => {
    const state = freshState({
      current: 3,
      longest: 5,
      lastActiveDate: "2026-06-01",
    });
    const r = streakEngine.recordActivity(state, "2026-06-01");
    expect(r.changed).toBe(false);
    expect(r.incremented).toBe(false);
    expect(r.freezeConsumed).toBe(false);
    expect(r.broken).toBe(false);
    expect(r.state).toBe(state); // unchanged reference is fine for a no-op
    expect(r.state.current).toBe(3);
  });

  it("increments on a consecutive day", () => {
    const state = freshState({
      current: 2,
      longest: 2,
      lastActiveDate: "2026-06-01",
    });
    const r = streakEngine.recordActivity(state, "2026-06-02");
    expect(r.state.current).toBe(3);
    expect(r.state.longest).toBe(3);
    expect(r.state.lastActiveDate).toBe("2026-06-02");
    expect(r.incremented).toBe(true);
    expect(r.changed).toBe(true);
  });

  it("tracks longest without shrinking it", () => {
    const state = freshState({
      current: 1,
      longest: 10,
      lastActiveDate: "2026-06-01",
    });
    const r = streakEngine.recordActivity(state, "2026-06-02");
    expect(r.state.current).toBe(2);
    expect(r.state.longest).toBe(10); // longest never decreases
  });

  it("bridges a single missed day with a freeze", () => {
    const state = freshState({
      current: 4,
      longest: 4,
      lastActiveDate: "2026-06-01",
      freezesAvailable: 1,
      freezeUsedDates: [],
    });
    // gap = 2 (missed 06-02), missedDays = 1 <= graceDays(1)
    const r = streakEngine.recordActivity(state, "2026-06-03");
    expect(r.freezeConsumed).toBe(true);
    expect(r.broken).toBe(false);
    expect(r.incremented).toBe(true);
    expect(r.state.current).toBe(5);
    expect(r.state.longest).toBe(5);
    expect(r.state.freezesAvailable).toBe(0);
    expect(r.state.freezeUsedDates).toEqual(["2026-06-03"]);
    expect(r.state.lastActiveDate).toBe("2026-06-03");
  });

  it("does not duplicate a date in freezeUsedDates", () => {
    const state = freshState({
      current: 4,
      longest: 4,
      lastActiveDate: "2026-06-01",
      freezesAvailable: 1,
      freezeUsedDates: ["2026-06-03"],
    });
    // gap from 06-01 to 06-03 is 2 → bridgeable; but date already present
    const r = streakEngine.recordActivity(state, "2026-06-03");
    expect(r.state.freezeUsedDates).toEqual(["2026-06-03"]);
  });

  it("breaks when the gap is too large and no freeze applies", () => {
    const state = freshState({
      current: 7,
      longest: 9,
      lastActiveDate: "2026-06-01",
      freezesAvailable: 1,
    });
    // gap = 4 → missedDays = 3 > graceDays(1) → broken
    const r = streakEngine.recordActivity(state, "2026-06-05");
    expect(r.broken).toBe(true);
    expect(r.freezeConsumed).toBe(false);
    expect(r.incremented).toBe(false);
    expect(r.changed).toBe(true);
    expect(r.state.current).toBe(1); // fresh day
    expect(r.state.longest).toBe(9); // preserved
    expect(r.state.freezesAvailable).toBe(1); // freeze NOT spent
    expect(r.state.lastActiveDate).toBe("2026-06-05");
  });

  it("breaks when a single day is missed but no freeze is available", () => {
    const state = freshState({
      current: 3,
      longest: 3,
      lastActiveDate: "2026-06-01",
      freezesAvailable: 0,
    });
    const r = streakEngine.recordActivity(state, "2026-06-03");
    expect(r.broken).toBe(true);
    expect(r.state.current).toBe(1);
    expect(r.state.longest).toBe(3);
  });

  it("treats an out-of-order (earlier) date as a no-op", () => {
    const state = freshState({
      current: 5,
      longest: 5,
      lastActiveDate: "2026-06-10",
    });
    const r = streakEngine.recordActivity(state, "2026-06-05");
    expect(r.changed).toBe(false);
    expect(r.state.current).toBe(5);
    expect(r.state.lastActiveDate).toBe("2026-06-10");
  });

  it("does not mutate the input state", () => {
    const state = freshState({
      current: 2,
      longest: 2,
      lastActiveDate: "2026-06-01",
      freezesAvailable: 1,
      freezeUsedDates: [],
    });
    const snapshot = JSON.parse(JSON.stringify(state));
    streakEngine.recordActivity(state, "2026-06-03"); // bridges with freeze
    expect(state).toEqual(snapshot);
    expect(state.freezeUsedDates).toEqual([]);
    expect(state.freezesAvailable).toBe(1);
  });

  it("honours a custom config (graceDays=2 bridges two missed days)", () => {
    const config: StreakConfig = { graceDays: 2, maxFreezes: 5 };
    const state = freshState({
      current: 4,
      longest: 4,
      lastActiveDate: "2026-06-01",
      freezesAvailable: 1,
    });
    // gap = 3 → missedDays = 2 <= graceDays(2)
    const r = streakEngine.recordActivity(state, "2026-06-04", config);
    expect(r.freezeConsumed).toBe(true);
    expect(r.state.current).toBe(5);
  });
});

describe("streakEngine.status", () => {
  it("reports inactive when never active", () => {
    expect(streakEngine.status(freshState(), "2026-06-01")).toEqual({
      active: false,
      atRisk: false,
      daysSinceActive: 0,
    });
  });

  it("reports active and not at risk when active today", () => {
    const state = freshState({ current: 3, lastActiveDate: "2026-06-01" });
    const s = streakEngine.status(state, "2026-06-01");
    expect(s.active).toBe(true);
    expect(s.atRisk).toBe(false);
    expect(s.daysSinceActive).toBe(0);
  });

  it("reports active and at risk when last active yesterday", () => {
    const state = freshState({ current: 3, lastActiveDate: "2026-06-01" });
    const s = streakEngine.status(state, "2026-06-02");
    expect(s.active).toBe(true);
    expect(s.atRisk).toBe(true);
    expect(s.daysSinceActive).toBe(1);
  });

  it("still active (bridgeable) within graceDays window", () => {
    const state = freshState({ current: 3, lastActiveDate: "2026-06-01" });
    // daysSinceActive = 2, 1 + graceDays(1) = 2 → still active
    const s = streakEngine.status(state, "2026-06-03");
    expect(s.active).toBe(true);
    expect(s.atRisk).toBe(true);
    expect(s.daysSinceActive).toBe(2);
  });

  it("reports broken (inactive) once past the bridge window", () => {
    const state = freshState({ current: 3, lastActiveDate: "2026-06-01" });
    const s = streakEngine.status(state, "2026-06-05");
    expect(s.active).toBe(false);
    expect(s.atRisk).toBe(false);
    expect(s.daysSinceActive).toBe(4);
  });

  it("clamps daysSinceActive to 0 for an out-of-order today", () => {
    const state = freshState({ current: 3, lastActiveDate: "2026-06-10" });
    const s = streakEngine.status(state, "2026-06-05");
    expect(s.daysSinceActive).toBe(0);
    expect(s.active).toBe(true);
    expect(s.atRisk).toBe(false);
  });
});

describe("streakEngine.grantFreeze", () => {
  it("adds a freeze up to maxFreezes", () => {
    const state = freshState({ freezesAvailable: 0 });
    const next = streakEngine.grantFreeze(state);
    expect(next.freezesAvailable).toBe(1);
  });

  it("caps at config.maxFreezes", () => {
    const state = freshState({ freezesAvailable: DEFAULT_STREAK_CONFIG.maxFreezes });
    const next = streakEngine.grantFreeze(state);
    expect(next.freezesAvailable).toBe(DEFAULT_STREAK_CONFIG.maxFreezes);
  });

  it("does not mutate the input state", () => {
    const state = freshState({ freezesAvailable: 0 });
    streakEngine.grantFreeze(state);
    expect(state.freezesAvailable).toBe(0);
  });
});
