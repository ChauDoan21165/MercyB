// src/features/gamification/__tests__/flipSafetyIntegration.test.tsx
//
// Integration coverage for FEATURE_GAMIFICATION flip safety. The pure gate and
// engine invariants live in flipSafety.test.ts; this file locks the rendered
// route, widget, store fallback, and no-live-writer contracts.

import React from "react";
import { act, render, renderHook, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const flagState = {
  FEATURE_GAMIFICATION: false,
  SERVER_STREAKS_ENABLED: false,
};

vi.mock("@/lib/featureFlags", () => ({
  get FEATURE_FLAGS() {
    return flagState;
  },
  isFlagEnabledForUser: vi.fn(async () => false),
}));

const live = vi.hoisted(() => ({
  xpClientAwardXp: vi.fn(),
  awardXPEvent: vi.fn(),
  awardXPEventBackground: vi.fn(),
  publishXPAwarded: vi.fn(),
  setCachedStreak: vi.fn(),
  setStreakDays: vi.fn(),
}));

vi.mock("@/lib/xp/xpClient", () => ({
  awardXp: live.xpClientAwardXp,
  getXp: vi.fn(async () => 0),
  getXpThisWeek: vi.fn(async () => 0),
  weekRange: vi.fn(() => ({ startISO: "", endISO: "" })),
}));

vi.mock("@/lib/xp/awardXPEvent", () => ({
  awardXPEvent: live.awardXPEvent,
  awardXPEventBackground: live.awardXPEventBackground,
}));

vi.mock("@/lib/xp/awardXPEventBus", () => ({
  publishXPAwarded: live.publishXPAwarded,
  XP_AWARDED_EVENT: "mb:xp:awarded",
}));

vi.mock("@/lib/streakCache", () => ({
  setCachedStreak: live.setCachedStreak,
  getCachedStreak: vi.fn(() => null),
}));

vi.mock("@/services/pointsService", () => ({
  getStreakDays: vi.fn(() => 4),
  setStreakDays: live.setStreakDays,
  isSupabaseSyncDisabled: vi.fn(() => false),
  disableSupabaseSync: vi.fn(),
}));

vi.mock("@/hooks/useServerStreak", () => ({
  useServerStreak: vi.fn(() => ({
    current: 0,
    longest: 0,
    lastStudiedDate: null,
    loading: false,
    error: null,
  })),
}));

vi.mock("@/hooks/usePoints", () => ({
  usePoints: vi.fn(() => ({
    totalPoints: 120,
    isLoading: false,
    awardPoints: vi.fn(),
    refreshPoints: vi.fn(),
  })),
}));

import { createDefaultState } from "../defaults";
import { createGamificationStore } from "../store/createGamificationStore";
import { InMemoryGamificationStore } from "../store/InMemoryGamificationStore";
import { IndexedDbGamificationStore } from "../store/IndexedDbGamificationStore";
import { gamificationNavItems } from "../nav/gamificationNav";
import StreakWidget from "../components/StreakWidget";
import XpWidget from "../components/XpWidget";
import DailyGoalWidget from "../components/DailyGoalWidget";
import AchievementsScreen from "../components/AchievementsScreen";
import { ACHIEVEMENTS } from "../engines/achievementEngine";
import { dailyGoalEngine } from "../engines/dailyGoalEngine";
import { xpEngine } from "../engines/xpEngine";
import GamificationPage from "../routes/GamificationPage";
import { useGamification } from "../hooks/useGamification";

function setGamificationFlag(on: boolean): void {
  flagState.FEATURE_GAMIFICATION = on;
}

function expectNoLiveWriters(): void {
  expect(live.xpClientAwardXp).not.toHaveBeenCalled();
  expect(live.awardXPEvent).not.toHaveBeenCalled();
  expect(live.awardXPEventBackground).not.toHaveBeenCalled();
  expect(live.publishXPAwarded).not.toHaveBeenCalled();
  expect(live.setCachedStreak).not.toHaveBeenCalled();
  expect(live.setStreakDays).not.toHaveBeenCalled();
}

beforeEach(() => {
  vi.clearAllMocks();
  setGamificationFlag(false);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("FEATURE_GAMIFICATION flip safety: rendered surface", () => {
  beforeEach(() => {
    setGamificationFlag(true);
  });

  it("mounts GamificationPage and all user-facing widgets without live writes", async () => {
    expect(() => render(<GamificationPage />)).not.toThrow();

    await waitFor(() => {
      expect(screen.getByTestId("gamification-page")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByTestId("streak-widget")).toBeInTheDocument();
    });
    expect(screen.getByTestId("xp-widget")).toBeInTheDocument();
    expect(screen.getByTestId("daily-goal-widget")).toBeInTheDocument();
    expect(screen.getByTestId("achievements-screen")).toBeInTheDocument();
    expectNoLiveWriters();
  });

  it("renders each widget standalone with representative props", () => {
    const achievement = ACHIEVEMENTS[0];

    expect(() =>
      render(
        <>
          <StreakWidget current={3} longest={5} freezesAvailable={1} atRisk />
          <XpWidget level={2} intoLevel={40} neededForNext={100} ratio={0.4} />
          <DailyGoalWidget
            metric="minutes"
            target={10}
            progress={6}
            ratio={0.6}
            completed={false}
          />
          <AchievementsScreen
            definitions={ACHIEVEMENTS}
            unlocked={{ [achievement.id]: { id: achievement.id, unlockedAt: 1 } }}
          />
        </>,
      ),
    ).not.toThrow();

    expect(screen.getByTestId("streak-widget")).toBeInTheDocument();
    expect(screen.getByTestId("xp-widget")).toBeInTheDocument();
    expect(screen.getByTestId("daily-goal-widget")).toBeInTheDocument();
    expect(screen.getByTestId("achievements-screen")).toBeInTheDocument();
  });

  it("exposes the nav item only when the flag is on", () => {
    expect(gamificationNavItems()).toHaveLength(1);
    expect(gamificationNavItems()[0]?.to).toBe("/progress/play");

    setGamificationFlag(false);
    expect(gamificationNavItems()).toEqual([]);
  });
});

describe("FEATURE_GAMIFICATION flip safety: hook and storage", () => {
  beforeEach(() => {
    setGamificationFlag(true);
  });

  it("loads, applies actions, saves, and never invokes live XP/streak writers", async () => {
    const { result } = renderHook(() => useGamification());
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.recordActivity();
      await result.current.awardXp(50, "manual");
      await result.current.setGoal({ metric: "minutes", target: 10 });
    });

    expect(result.current.state.streak.current).toBe(1);
    expect(result.current.state.xp.totalXp).toBe(50);
    expectNoLiveWriters();
  });

  it("keeps goal-complete XP local to gamification state", async () => {
    const { result } = renderHook(() => useGamification());
    await waitFor(() => expect(result.current.loading).toBe(false));

    const target = result.current.state.dailyGoal.config.target;
    let completedNow = false;
    await act(async () => {
      const update = await result.current.addGoalProgress(target);
      completedNow = update.completedNow;
    });

    expect(completedNow).toBe(true);
    expect(result.current.state.dailyGoal.completedToday).toBe(true);
    expect(result.current.state.xp.totalXp).toBeGreaterThan(0);
    expectNoLiveWriters();
  });

  it("recordActivity updates only the gamification streak", async () => {
    const { result } = renderHook(() => useGamification());
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.recordActivity();
    });

    expect(result.current.state.streak.current).toBe(1);
    expectNoLiveWriters();
  });

  it("falls back to an in-memory store when IndexedDB is unavailable", async () => {
    vi.stubGlobal("indexedDB", undefined);

    const idb = new IndexedDbGamificationStore();
    expect(idb.isAvailable()).toBe(false);

    const store = createGamificationStore();
    await expect(store.load()).resolves.toEqual(createDefaultState());

    const seeded = createDefaultState();
    seeded.xp = { totalXp: 99, level: 2 };
    await store.save(seeded);
    await expect(store.load()).resolves.toEqual(seeded);
  });

  it("keeps IndexedDbGamificationStore no-op safe without IndexedDB", async () => {
    vi.stubGlobal("indexedDB", undefined);

    const idb = new IndexedDbGamificationStore();
    await expect(idb.load()).resolves.toEqual(createDefaultState());
    await expect(idb.save(createDefaultState())).resolves.toBeUndefined();
    await expect(idb.clear()).resolves.toBeUndefined();
  });

  it("keeps the in-memory fallback compliant with the store contract", async () => {
    const store = new InMemoryGamificationStore();
    expect(store.isAvailable()).toBe(true);
    await expect(store.load()).resolves.toEqual(createDefaultState());
  });
});

describe("FEATURE_GAMIFICATION flip safety: flag-off dark behavior", () => {
  it("keeps nav dark and pure engines readable when the flag is off", () => {
    setGamificationFlag(false);

    expect(gamificationNavItems()).toEqual([]);
    expect(() => xpEngine.progress(0)).not.toThrow();
    expect(() =>
      dailyGoalEngine.ratio(createDefaultState().dailyGoal),
    ).not.toThrow();
  });
});
