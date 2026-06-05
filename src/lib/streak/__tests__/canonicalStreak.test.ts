import { vi, describe, it, expect, beforeEach } from "vitest";

const h = vi.hoisted(() => ({ flags: { SERVER_STREAKS_ENABLED: false } }));

vi.mock("@/lib/featureFlags", () => ({ FEATURE_FLAGS: h.flags }));
// pointsService pulls these — keep them inert so we can exercise its writers.
vi.mock("@/notificationEngine", () => ({ onFirstActionOfDay: vi.fn() }));
vi.mock("@/lib/supabaseClient", () => ({
  supabase: { auth: { getUser: async () => ({ data: { user: null } }) } },
}));

import { getCanonicalStreak, isStreakAtRisk } from "../canonicalStreak";
import { setCachedStreak, __resetStreakCacheForTests } from "@/lib/streakCache";
import { getStreakDays, awardPoints } from "@/services/pointsService";

beforeEach(() => {
  h.flags.SERVER_STREAKS_ENABLED = false;
  __resetStreakCacheForTests();
  // localStorage is reset by the canonical storage mock in global setup.
});

describe("canonicalStreak — the single read seam", () => {
  it("flag OFF → reads localStorage; getStreakDays delegates to the same value", () => {
    // Seed a continuing streak: yesterday active at 5 days.
    // Local-calendar yesterday — MUST mirror pointsService's local-day seam
    // (getYesterdayStr → localDayStr: getFullYear/getMonth/getDate, NOT UTC
    // toISOString). Since 379c20ef0 the streak buckets by LOCAL day; a UTC
    // toISOString() seed disagrees with the writer on non-UTC runners (UTC
    // "yesterday" can equal the local "today"), so the continued-streak
    // increment is missed and the read returns 5 instead of 6.
    const y = new Date();
    y.setDate(y.getDate() - 1);
    const yesterday = `${y.getFullYear()}-${String(y.getMonth() + 1).padStart(2, "0")}-${String(y.getDate()).padStart(2, "0")}`;
    localStorage.setItem("mb.points.streak", "5");
    localStorage.setItem("mb.points.lastDaily", yesterday);

    // pointsService writes the streak on the first action of the day...
    awardPoints("keyword_click");

    const canon = getCanonicalStreak();
    expect(canon.source).toBe("local");
    expect(canon.current).toBe(6); // 5 + continued today
    expect(getStreakDays()).toBe(6); // delegates to the seam — same number
  });

  it("flag ON + warm cache → reads the server value (source=server)", () => {
    h.flags.SERVER_STREAKS_ENABLED = true;
    setCachedStreak({
      current: 12,
      longest: 30,
      lastStudiedDate: "2026-06-02",
      updatedAt: 1,
    });
    const canon = getCanonicalStreak();
    expect(canon).toMatchObject({
      current: 12,
      longest: 30,
      lastStudiedDate: "2026-06-02",
      source: "server",
    });
    expect(getStreakDays()).toBe(12);
  });

  it("flag ON + cold cache → localStorage warm fallback (no 0 flash)", () => {
    h.flags.SERVER_STREAKS_ENABLED = true;
    __resetStreakCacheForTests(); // cache cold
    localStorage.setItem("mb.points.streak", "4");
    const canon = getCanonicalStreak();
    expect(canon.source).toBe("local");
    expect(canon.current).toBe(4);
  });
});

describe("isStreakAtRisk — the single shared rule", () => {
  const dates = { todayLocal: "2026-06-03", yesterdayLocal: "2026-06-02" };

  it("true only when server-enabled, streak>0, lastStudied===yesterday !==today", () => {
    expect(
      isStreakAtRisk({
        serverStreaksEnabled: true,
        streakDays: 5,
        lastStudiedDate: "2026-06-02",
        ...dates,
      }),
    ).toBe(true);
  });

  it("false when server streaks disabled", () => {
    expect(
      isStreakAtRisk({
        serverStreaksEnabled: false,
        streakDays: 5,
        lastStudiedDate: "2026-06-02",
        ...dates,
      }),
    ).toBe(false);
  });

  it("false when already studied today", () => {
    expect(
      isStreakAtRisk({
        serverStreaksEnabled: true,
        streakDays: 5,
        lastStudiedDate: "2026-06-03",
        ...dates,
      }),
    ).toBe(false);
  });

  it("false when streak is zero", () => {
    expect(
      isStreakAtRisk({
        serverStreaksEnabled: true,
        streakDays: 0,
        lastStudiedDate: "2026-06-02",
        ...dates,
      }),
    ).toBe(false);
  });
});
