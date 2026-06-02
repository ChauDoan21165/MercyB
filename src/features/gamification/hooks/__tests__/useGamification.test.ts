// src/features/gamification/hooks/__tests__/useGamification.test.ts
//
// Lane F — F6 hook test. Under jsdom the store factory falls back to in-memory
// (no `indexedDB` global), so this exercises the real engine composition with
// no IndexedDB dependency.

import { describe, it, expect } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";

import { useGamification } from "../useGamification";

describe("useGamification", () => {
  it("loads, records activity, awards XP, and completes the daily goal", async () => {
    const { result } = renderHook(() => useGamification());

    // Initial async load resolves loading -> false.
    await waitFor(() => expect(result.current.loading).toBe(false));

    // recordActivity → first-ever activity makes the streak 1.
    await act(async () => {
      await result.current.recordActivity();
    });
    expect(result.current.state.streak.current).toBe(1);

    // awardXp(100) → level/totalXp update. 100 XP === floor of level 2.
    await act(async () => {
      await result.current.awardXp(100, "manual");
    });
    expect(result.current.state.xp.totalXp).toBe(100);
    expect(result.current.state.xp.level).toBe(2);

    // addGoalProgress(target) → completes today's goal (default target 10).
    const target = result.current.state.dailyGoal.config.target;
    let completedNow = false;
    await act(async () => {
      const r = await result.current.addGoalProgress(target);
      completedNow = r.completedNow;
    });
    expect(completedNow).toBe(true);
    expect(result.current.state.dailyGoal.completedToday).toBe(true);
  });

  it("surfaces newly-unlocked achievements after an action", async () => {
    const { result } = renderHook(() => useGamification());
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.recordActivity();
    });
    // first_day unlocks at streak.current >= 1.
    const ids = result.current.newlyUnlocked.map((d) => d.id);
    expect(ids).toContain("first_day");
  });
});
