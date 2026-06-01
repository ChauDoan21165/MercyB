// src/features/gamification/engines/__tests__/xpEngine.test.ts
//
// Lane F — F2 XP engine tests.

import { describe, expect, it } from "vitest";
import { xpEngine } from "../xpEngine";
import type { XpState } from "../../types";

const { xpForLevel, levelForXp, award, progress } = xpEngine;

describe("xpEngine — curve xpForLevel / levelForXp", () => {
  it("matches the documented cumulative floors", () => {
    expect(xpForLevel(1)).toBe(0);
    expect(xpForLevel(2)).toBe(100);
    expect(xpForLevel(3)).toBe(400);
    expect(xpForLevel(4)).toBe(900);
    expect(xpForLevel(5)).toBe(1600);
  });

  it("maps XP to the right level at exact boundaries", () => {
    expect(levelForXp(0)).toBe(1);
    expect(levelForXp(99)).toBe(1);
    expect(levelForXp(100)).toBe(2);
    expect(levelForXp(399)).toBe(2);
    expect(levelForXp(400)).toBe(3);
    expect(levelForXp(899)).toBe(3);
    expect(levelForXp(900)).toBe(4);
  });

  it("treats negative XP as level 1", () => {
    expect(levelForXp(-50)).toBe(1);
  });

  it("round-trips: xpForLevel(L) is exactly the floor of level L", () => {
    for (let L = 1; L <= 20; L++) {
      // At the floor, you are level L.
      expect(levelForXp(xpForLevel(L))).toBe(L);
      // One XP below the next floor, you are still level L.
      expect(levelForXp(xpForLevel(L + 1) - 1)).toBe(L);
    }
  });
});

describe("xpEngine — award", () => {
  const base: XpState = { totalXp: 0, level: 1 };

  it("adds XP without a level change", () => {
    const r = award({ totalXp: 100, level: 2 }, 50, "practice");
    expect(r.state.totalXp).toBe(150);
    expect(r.state.level).toBe(2);
    expect(r.leveledUp).toBe(false);
    expect(r.newLevel).toBe(2);
    expect(r.levelsGained).toBe(0);
  });

  it("reports a single level-up", () => {
    const r = award({ totalXp: 50, level: 1 }, 60, "lesson_complete");
    // 50 + 60 = 110 -> level 2
    expect(r.state.totalXp).toBe(110);
    expect(r.state.level).toBe(2);
    expect(r.leveledUp).toBe(true);
    expect(r.newLevel).toBe(2);
    expect(r.levelsGained).toBe(1);
  });

  it("reports multiple levels gained in one award", () => {
    // 0 -> 1600 jumps from level 1 to level 5 (gain 4).
    const r = award(base, 1600, "manual");
    expect(r.state.totalXp).toBe(1600);
    expect(r.state.level).toBe(5);
    expect(r.leveledUp).toBe(true);
    expect(r.newLevel).toBe(5);
    expect(r.levelsGained).toBeGreaterThanOrEqual(2);
    expect(r.levelsGained).toBe(4);
  });

  it("treats a negative amount as a no-op", () => {
    const r = award({ totalXp: 250, level: 2 }, -100, "manual");
    expect(r.state.totalXp).toBe(250);
    expect(r.state.level).toBe(2);
    expect(r.leveledUp).toBe(false);
    expect(r.levelsGained).toBe(0);
  });

  it("treats a zero amount as a no-op", () => {
    const r = award({ totalXp: 250, level: 2 }, 0, "manual");
    expect(r.state.totalXp).toBe(250);
    expect(r.state.level).toBe(2);
    expect(r.leveledUp).toBe(false);
    expect(r.levelsGained).toBe(0);
  });

  it("does not mutate the input state", () => {
    const input: XpState = { totalXp: 50, level: 1 };
    const snapshot = { ...input };
    const r = award(input, 100, "practice");
    expect(input).toEqual(snapshot);
    expect(r.state).not.toBe(input);
  });

  it("recomputes old level from totalXp, ignoring a stale cached level", () => {
    // Cached level is wrong (says 1) but totalXp=120 is really level 2.
    // Adding 0 should not claim a level-up.
    const r = award({ totalXp: 120, level: 1 }, 10, "manual");
    expect(r.newLevel).toBe(2);
    expect(r.leveledUp).toBe(false);
    expect(r.levelsGained).toBe(0);
  });
});

describe("xpEngine — progress", () => {
  it("is 0 at a level floor", () => {
    const p = progress(400); // exact floor of level 3
    expect(p.level).toBe(3);
    expect(p.intoLevel).toBe(0);
    expect(p.neededForNext).toBe(900 - 400);
    expect(p.ratio).toBe(0);
  });

  it("approaches 1 just below the next floor", () => {
    const p = progress(899); // one below level-4 floor
    expect(p.level).toBe(3);
    expect(p.intoLevel).toBe(899 - 400);
    expect(p.neededForNext).toBe(500);
    expect(p.ratio).toBeGreaterThan(0.99);
    expect(p.ratio).toBeLessThan(1);
  });

  it("stays at the midpoint mid-level", () => {
    // Level 3 floor 400, next 900, span 500. 650 is halfway.
    const p = progress(650);
    expect(p.level).toBe(3);
    expect(p.ratio).toBeCloseTo(0.5, 10);
  });

  it("clamps ratio to 0..1 and reports level 1 at zero XP", () => {
    const p = progress(0);
    expect(p.level).toBe(1);
    expect(p.intoLevel).toBe(0);
    expect(p.neededForNext).toBe(100);
    expect(p.ratio).toBe(0);
  });
});
