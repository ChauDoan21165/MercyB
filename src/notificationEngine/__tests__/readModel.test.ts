import { vi, describe, it, expect, beforeEach } from "vitest";

const h = vi.hoisted(() => ({
  flags: { SERVER_STREAKS_ENABLED: true },
  profile: { timezone: "Asia/Ho_Chi_Minh", streak_last_studied_date: "2026-06-01" } as Record<string, unknown>,
  streakDays: 5,
  dueCount: 0,
  nextScheduledAt: null as string | null,
}));

vi.mock("@/lib/featureFlags", () => ({ FEATURE_FLAGS: h.flags }));
vi.mock("@/lib/supabaseClient", () => ({
  supabase: {
    from: () => ({
      select: () => ({
        eq: () => ({ maybeSingle: async () => ({ data: h.profile, error: null }) }),
      }),
    }),
  },
}));
vi.mock("@/lib/streak/canonicalStreak", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/streak/canonicalStreak")>();
  return {
    ...actual,
    getCanonicalStreak: () => ({
      current: h.streakDays,
      longest: h.streakDays,
      lastStudiedDate: null,
      source: "local" as const,
    }),
  };
});
vi.mock("@/lib/vocabulary/repository", () => ({
  fetchDueCount: async () => h.dueCount,
  fetchNextScheduledAt: async () => h.nextScheduledAt,
}));

import { buildHabitSnapshot } from "../readModel";

// 2026-06-01T17:30Z → Asia/Ho_Chi_Minh: today 2026-06-02, yesterday 2026-06-01.
const NOW = new Date("2026-06-01T17:30:00Z");

beforeEach(() => {
  h.flags.SERVER_STREAKS_ENABLED = true;
  h.profile = { timezone: "Asia/Ho_Chi_Minh", streak_last_studied_date: "2026-06-01" };
  h.streakDays = 5;
  h.dueCount = 0;
  h.nextScheduledAt = null;
});

describe("readModel.buildHabitSnapshot — SERVER_STREAKS-gated at-risk", () => {
  it("isAtRiskToday true only when server on + streak>0 + lastStudied===yesterday !==today", async () => {
    const s = await buildHabitSnapshot("u1", NOW);
    expect(s.todayLocal).toBe("2026-06-02");
    expect(s.yesterdayLocal).toBe("2026-06-01");
    expect(s.isAtRiskToday).toBe(true);
  });

  it("false when already studied today", async () => {
    h.profile.streak_last_studied_date = "2026-06-02";
    const s = await buildHabitSnapshot("u1", NOW);
    expect(s.isAtRiskToday).toBe(false);
  });

  it("false when SERVER_STREAKS disabled (even if lastStudied===yesterday)", async () => {
    h.flags.SERVER_STREAKS_ENABLED = false;
    const s = await buildHabitSnapshot("u1", NOW);
    expect(s.serverStreaksEnabled).toBe(false);
    expect(s.isAtRiskToday).toBe(false);
  });

  it("false when streak is zero", async () => {
    h.streakDays = 0;
    const s = await buildHabitSnapshot("u1", NOW);
    expect(s.isAtRiskToday).toBe(false);
  });

  it("never reads the legacy localStorage key for eligibility", async () => {
    const spy = vi.spyOn(Storage.prototype, "getItem");
    await buildHabitSnapshot("u1", NOW);
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  it("surfaces due-review fields from the repository", async () => {
    h.dueCount = 9;
    h.nextScheduledAt = "2026-06-03T01:00:00Z";
    const s = await buildHabitSnapshot("u1", NOW);
    expect(s.dueCount).toBe(9);
    expect(s.nextScheduledAt).toBe("2026-06-03T01:00:00Z");
  });
});
