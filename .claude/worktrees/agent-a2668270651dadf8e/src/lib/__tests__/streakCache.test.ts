import { describe, it, expect, beforeEach, vi } from "vitest";

vi.mock("@/lib/featureFlags", () => ({
  FEATURE_FLAGS: {
    SERVER_STREAKS_ENABLED: true,
    MERCY_HOST_ENABLED: false,
  },
}));

import {
  getCachedStreak,
  setCachedStreak,
  __resetStreakCacheForTests,
} from "../streakCache";

import { getStreakDays } from "@/services/pointsService";

// Stub localStorage so pointsService's fallback path can read a value.
const store: Record<string, string> = {};
const localStorageMock = {
  getItem: (k: string) => (k in store ? store[k] : null),
  setItem: (k: string, v: string) => {
    store[k] = v;
  },
  removeItem: (k: string) => {
    delete store[k];
  },
  clear: () => {
    for (const k of Object.keys(store)) delete store[k];
  },
};

beforeEach(() => {
  localStorageMock.clear();
  vi.stubGlobal("localStorage", localStorageMock);
  __resetStreakCacheForTests();
});

describe("streak cache / pointsService integration", () => {
  it("pointsService.getStreakDays prefers cached server value when flag is on", () => {
    localStorage.setItem("mb.points.streak", "99"); // local fallback
    setCachedStreak({
      current: 7,
      longest: 30,
      lastStudiedDate: "2026-04-22",
      updatedAt: Date.now(),
    });

    expect(getStreakDays()).toBe(7);
  });

  it("pointsService.getStreakDays falls back to localStorage when cache is empty", () => {
    localStorage.setItem("mb.points.streak", "4");
    // cache deliberately empty

    expect(getStreakDays()).toBe(4);
  });

  it("cache read/write round-trip", () => {
    setCachedStreak({
      current: 12,
      longest: 20,
      lastStudiedDate: "2026-04-23",
      updatedAt: 1234,
    });
    expect(getCachedStreak()).toEqual({
      current: 12,
      longest: 20,
      lastStudiedDate: "2026-04-23",
      updatedAt: 1234,
    });
  });

  it("cache null resets state", () => {
    setCachedStreak({
      current: 5,
      longest: 5,
      lastStudiedDate: "2026-04-23",
      updatedAt: 1,
    });
    setCachedStreak(null);
    expect(getCachedStreak()).toBeNull();
  });
});
