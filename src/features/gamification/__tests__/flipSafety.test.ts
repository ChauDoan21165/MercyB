// src/features/gamification/__tests__/flipSafety.test.ts
//
// Flip-safety for the FEATURE_GAMIFICATION gate. The module ships dark
// (flag OFF) and must be correct the instant it flips on:
//
//   - isGamificationEnabled() is the single gate and tracks the flag.
//   - the streak ENGINE is pure and flag-agnostic: flipping the flag never
//     retroactively rewrites streak math, and same-day activity stays an
//     idempotent no-op. So turning the module on cannot corrupt or
//     double-count a streak that accrued while it was off.

import { vi, describe, it, expect, beforeEach } from "vitest";

const h = vi.hoisted(() => ({ flags: { FEATURE_GAMIFICATION: false as boolean } }));

vi.mock("@/lib/featureFlags", () => ({ FEATURE_FLAGS: h.flags }));

import { isGamificationEnabled } from "@/features/gamification/flag";
import { streakEngine } from "@/features/gamification/engines/streakEngine";
import { DEFAULT_STREAK_CONFIG } from "@/features/gamification/defaults";
import type { StreakState } from "@/features/gamification/types";

const base: StreakState = {
  current: 4,
  longest: 9,
  lastActiveDate: "2026-06-05",
  freezesAvailable: 1,
  freezeUsedDates: [],
};

beforeEach(() => {
  h.flags.FEATURE_GAMIFICATION = false;
});

describe("isGamificationEnabled — the single gate tracks the flag", () => {
  it("is OFF by default", () => {
    expect(isGamificationEnabled()).toBe(false);
  });

  it("flips ON only when the flag is exactly true", () => {
    h.flags.FEATURE_GAMIFICATION = true;
    expect(isGamificationEnabled()).toBe(true);
  });
});

describe("streak engine — pure + flag-agnostic across the flip", () => {
  it("produces identical streak math whether the module is OFF or ON", () => {
    h.flags.FEATURE_GAMIFICATION = false;
    const off = streakEngine.recordActivity(base, "2026-06-06", DEFAULT_STREAK_CONFIG);

    h.flags.FEATURE_GAMIFICATION = true;
    const on = streakEngine.recordActivity(base, "2026-06-06", DEFAULT_STREAK_CONFIG);

    expect(on).toEqual(off); // flipping the flag changes nothing
    expect(on.state.current).toBe(5); // consecutive day → incremented
    expect(on.incremented).toBe(true);
  });

  it("same-day activity is an idempotent no-op (no double-count on the flip)", () => {
    h.flags.FEATURE_GAMIFICATION = true;
    const first = streakEngine.recordActivity(base, "2026-06-06", DEFAULT_STREAK_CONFIG);
    const again = streakEngine.recordActivity(first.state, "2026-06-06", DEFAULT_STREAK_CONFIG);

    expect(again.changed).toBe(false);
    expect(again.state.current).toBe(first.state.current);
    expect(again.state).toEqual(first.state);
  });

  it("does not mutate the input state", () => {
    const snapshot = structuredClone(base);
    streakEngine.recordActivity(base, "2026-06-06", DEFAULT_STREAK_CONFIG);
    expect(base).toEqual(snapshot);
  });
});
