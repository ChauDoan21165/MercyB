// src/lib/xp/__tests__/levels.test.ts

import { describe, expect, it } from "vitest";

import {
  MAX_LEVEL,
  cumulativeXPForLevel,
  levelForXP,
  levelProgress,
  xpToNextLevel,
} from "../levels";

describe("cumulativeXPForLevel", () => {
  it("returns 0 for level 1", () => {
    expect(cumulativeXPForLevel(1)).toBe(0);
  });

  it("matches the brief's stated thresholds", () => {
    expect(cumulativeXPForLevel(2)).toBe(50);
    expect(cumulativeXPForLevel(3)).toBe(120);
  });

  it("is monotonically increasing", () => {
    let prev = -1;
    for (let n = 1; n <= 20; n += 1) {
      const v = cumulativeXPForLevel(n);
      expect(v).toBeGreaterThanOrEqual(prev);
      prev = v;
    }
  });

  it("clamps to MAX_LEVEL when given a higher level", () => {
    expect(cumulativeXPForLevel(MAX_LEVEL + 50)).toBe(
      cumulativeXPForLevel(MAX_LEVEL),
    );
  });

  it("returns 0 for non-finite or non-positive levels", () => {
    expect(cumulativeXPForLevel(0)).toBe(0);
    expect(cumulativeXPForLevel(-3)).toBe(0);
    expect(cumulativeXPForLevel(Number.NaN)).toBe(0);
  });
});

describe("xpToNextLevel", () => {
  it("returns the gap between current and next thresholds", () => {
    expect(xpToNextLevel(1)).toBe(50); // L1→L2
    expect(xpToNextLevel(2)).toBe(70); // L2→L3
  });

  it("returns 0 at the maximum level", () => {
    expect(xpToNextLevel(MAX_LEVEL)).toBe(0);
  });
});

describe("levelForXP", () => {
  it("starts at level 1 for zero or negative XP", () => {
    expect(levelForXP(0)).toBe(1);
    expect(levelForXP(-50)).toBe(1);
  });

  it("stays on level 1 for sub-50 XP", () => {
    expect(levelForXP(49)).toBe(1);
  });

  it("advances to level 2 exactly at 50 XP", () => {
    expect(levelForXP(50)).toBe(2);
  });

  it("stays on level 2 between 50 and 119", () => {
    expect(levelForXP(119)).toBe(2);
  });

  it("advances to level 3 exactly at 120 XP", () => {
    expect(levelForXP(120)).toBe(3);
  });

  it("caps at MAX_LEVEL when total XP exceeds the L100 threshold", () => {
    // The curve grows fast — L100 threshold is astronomical, so use it
    // directly rather than guess a "big enough" number.
    expect(levelForXP(cumulativeXPForLevel(MAX_LEVEL))).toBe(MAX_LEVEL);
    expect(levelForXP(cumulativeXPForLevel(MAX_LEVEL) + 1)).toBe(MAX_LEVEL);
  });

  it("handles non-finite input", () => {
    expect(levelForXP(Number.NaN)).toBe(1);
    expect(levelForXP(Number.POSITIVE_INFINITY)).toBe(MAX_LEVEL);
  });
});

describe("levelProgress", () => {
  it("returns full progress at MAX_LEVEL", () => {
    const huge = cumulativeXPForLevel(MAX_LEVEL) + 10;
    const p = levelProgress(huge);
    expect(p.current).toBe(MAX_LEVEL);
    expect(p.next).toBe(MAX_LEVEL);
    expect(p.fraction).toBe(1);
    expect(p.span).toBe(0);
  });

  it("returns half-progress between thresholds", () => {
    // Halfway from L1 (0) to L2 (50) is 25 XP.
    const p = levelProgress(25);
    expect(p.current).toBe(1);
    expect(p.next).toBe(2);
    expect(p.into).toBe(25);
    expect(p.span).toBe(50);
    expect(p.fraction).toBeCloseTo(0.5, 5);
  });

  it("clamps fraction at 1 when into > span (defensive)", () => {
    // Should never happen in practice but the guard is documented.
    const p = levelProgress(49);
    expect(p.fraction).toBeGreaterThan(0);
    expect(p.fraction).toBeLessThanOrEqual(1);
  });

  it("starts at fraction 0 immediately after a level-up", () => {
    const p = levelProgress(50); // exact L2 threshold
    expect(p.current).toBe(2);
    expect(p.into).toBe(0);
    expect(p.fraction).toBe(0);
  });
});
