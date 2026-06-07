// src/services/__tests__/pointsService.flipSafety.test.ts
//
// Flip-safety for the points/streak awarding seam. Two flags bracket this
// code and both default OFF:
//   - SERVER_STREAKS_ENABLED — flips the streak READ seam (getStreakDays →
//     canonicalStreak: server cache vs localStorage).
//   - the awarding multiplier reads the LOCAL streak directly.
//
// The guarantee locked here: awardPoints' math and idempotence do NOT
// change when the read seam flips, the daily bonus + streak increment fire
// exactly once per local day, and only genuine production learner actions
// (the allowlist) count an active day. See pointsService.ts
// ACTIVE_DAY_REASON_CODES and the canonicalStreak read seam.

import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";

const h = vi.hoisted(() => ({
  flags: { SERVER_STREAKS_ENABLED: false as boolean },
  recordActiveDay: vi.fn(),
  onFirstActionOfDay: vi.fn(),
}));

vi.mock("@/lib/featureFlags", () => ({ FEATURE_FLAGS: h.flags }));
vi.mock("@/lib/retention/recordActiveDay", () => ({
  recordActiveDay: h.recordActiveDay,
}));
vi.mock("@/notificationEngine", () => ({ onFirstActionOfDay: h.onFirstActionOfDay }));
// No signed-in user → Supabase sync short-circuits; awarding stays local.
vi.mock("@/lib/supabaseClient", () => ({
  supabase: { auth: { getUser: async () => ({ data: { user: null } }) } },
}));

import {
  awardPoints,
  awardSpeakPoints,
  getTotalPoints,
  getStreakDays,
} from "@/services/pointsService";
import { setCachedStreak, __resetStreakCacheForTests } from "@/lib/streakCache";

// Mirror pointsService's LOCAL day seam (getFullYear/getMonth/getDate).
function localDay(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
const TODAY = localDay(new Date());
const YESTERDAY = (() => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return localDay(d);
})();

const STREAK_KEY = "mb.points.streak";
const LAST_DAILY_KEY = "mb.points.lastDaily";
const POINTS_KEY = "mb.points";

beforeEach(() => {
  h.flags.SERVER_STREAKS_ENABLED = false;
  h.recordActiveDay.mockClear();
  h.onFirstActionOfDay.mockClear();
  __resetStreakCacheForTests();
  localStorage.clear();
});

afterEach(() => {
  vi.useRealTimers();
});

/** Pin streak to `streak` and mark "already acted today" so awardPoints
 *  skips the first-action bonus + streak mutation — isolates the multiplier. */
function pinStreakNoBonus(streak: number) {
  localStorage.setItem(STREAK_KEY, String(streak));
  localStorage.setItem(LAST_DAILY_KEY, TODAY);
  localStorage.setItem(POINTS_KEY, "0");
}

describe("awardPoints — decoupled from the streak READ seam (flip-safe)", () => {
  it("flipping SERVER_STREAKS_ENABLED does not change points awarded for identical local state", () => {
    pinStreakNoBonus(1);
    h.flags.SERVER_STREAKS_ENABLED = false;
    const off = awardPoints("keyword_click"); // 10 * 1.0

    localStorage.setItem(POINTS_KEY, "0");
    localStorage.setItem(LAST_DAILY_KEY, TODAY);
    localStorage.setItem(STREAK_KEY, "1");
    h.flags.SERVER_STREAKS_ENABLED = true;
    const on = awardPoints("keyword_click");

    expect(off).toBe(10);
    expect(on).toBe(off); // flip changes nothing about awarding
  });

  it("the awarding multiplier uses the LOCAL streak even when the read seam reads a different server value", () => {
    pinStreakNoBonus(1); // local streak = 1 → 1.0x
    h.flags.SERVER_STREAKS_ENABLED = true;
    setCachedStreak({ current: 12, longest: 30, lastStudiedDate: TODAY, updatedAt: 1 });

    const earned = awardPoints("keyword_click");

    expect(getStreakDays()).toBe(12); // read seam = server
    expect(earned).toBe(10); // awarding = LOCAL streak (1.0x), not 12 (2.0x)
  });
});

describe("awardPoints — streak multiplier math", () => {
  it("applies 1.0x below 3, 1.5x at 3-6, 2.0x at 7+", () => {
    pinStreakNoBonus(1);
    expect(awardPoints("keyword_click")).toBe(10); // 10 * 1.0

    pinStreakNoBonus(3);
    expect(awardPoints("keyword_click")).toBe(15); // 10 * 1.5

    pinStreakNoBonus(7);
    expect(awardPoints("keyword_click")).toBe(20); // 10 * 2.0
  });
});

describe("awardPoints — daily bonus + streak increment are idempotent per local day", () => {
  it("first action of the day adds the bonus and increments the streak once; same-day repeats do neither", () => {
    // Continuing streak: last active yesterday at 5.
    localStorage.setItem(STREAK_KEY, "5");
    localStorage.setItem(LAST_DAILY_KEY, YESTERDAY);
    localStorage.setItem(POINTS_KEY, "0");

    // First action today: streak 5 → 6, bonus(10) included. Multiplier from
    // the post-increment streak (6 → 1.5x): (10 + 10) * 1.5 = 30.
    const first = awardPoints("keyword_click");
    expect(first).toBe(30);
    expect(getStreakDays()).toBe(6);
    expect(h.onFirstActionOfDay).toHaveBeenCalledTimes(1);

    // Second action same day: no bonus, streak unchanged. 10 * 1.5 = 15.
    const second = awardPoints("keyword_click");
    expect(second).toBe(15);
    expect(getStreakDays()).toBe(6); // not double-incremented
    expect(h.onFirstActionOfDay).toHaveBeenCalledTimes(1); // not re-fired
    expect(getTotalPoints()).toBe(45);
  });

  it("is flip-safe — same bonus/increment behaviour with SERVER_STREAKS_ENABLED on", () => {
    h.flags.SERVER_STREAKS_ENABLED = true;
    localStorage.setItem(STREAK_KEY, "5");
    localStorage.setItem(LAST_DAILY_KEY, YESTERDAY);
    localStorage.setItem(POINTS_KEY, "0");

    expect(awardPoints("keyword_click")).toBe(30);
    expect(awardPoints("keyword_click")).toBe(15);
    expect(h.onFirstActionOfDay).toHaveBeenCalledTimes(1);
  });

  it("resets instead of continuing after a missed local day", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 5, 10, 12, 0, 0)); // 2026-06-10 local
    localStorage.setItem(STREAK_KEY, "8");
    localStorage.setItem(LAST_DAILY_KEY, "2026-06-08"); // missed 2026-06-09
    localStorage.setItem(POINTS_KEY, "0");

    const first = awardPoints("keyword_click");

    expect(first).toBe(20); // base(10) + daily(10), reset streak multiplier 1.0x
    expect(getStreakDays()).toBe(1);
    expect(localStorage.getItem(LAST_DAILY_KEY)).toBe("2026-06-10");
    expect(h.onFirstActionOfDay).toHaveBeenCalledTimes(1);

    const second = awardPoints("keyword_click");
    expect(second).toBe(10);
    expect(getStreakDays()).toBe(1);
    expect(h.onFirstActionOfDay).toHaveBeenCalledTimes(1);
  });

  it("resets instead of continuing after a multi-day local gap", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 5, 10, 12, 0, 0)); // 2026-06-10 local
    localStorage.setItem(STREAK_KEY, "30");
    localStorage.setItem(LAST_DAILY_KEY, "2026-06-01");
    localStorage.setItem(POINTS_KEY, "0");

    const first = awardPoints("keyword_click");

    expect(first).toBe(20);
    expect(getStreakDays()).toBe(1);
    expect(localStorage.getItem(LAST_DAILY_KEY)).toBe("2026-06-10");
    expect(h.onFirstActionOfDay).toHaveBeenCalledTimes(1);
  });
});

describe("recordActiveDay allowlist — only production learner actions count an active day", () => {
  beforeEach(() => pinStreakNoBonus(1));

  it("fires for keyword_click and speak_* (production reason-codes)", () => {
    awardPoints("keyword_click");
    awardPoints("speak_attempt");
    awardPoints("speak_match_high");
    expect(h.recordActiveDay).toHaveBeenCalledTimes(3);
  });

  it("does NOT fire for passive earners or zero-value events", () => {
    awardPoints("room_open"); // passive, 5 pts
    awardPoints("audio_listen"); // passive, 15 pts
    awardPoints("grammar_analyze"); // not on the active-day allowlist
    awardPoints("streak_bonus"); // 0 pts → early return
    expect(h.recordActiveDay).not.toHaveBeenCalled();
  });

  it("zero-value events award nothing and short-circuit", () => {
    const before = getTotalPoints();
    expect(awardPoints("streak_bonus")).toBe(0);
    expect(getTotalPoints()).toBe(before);
  });
});

describe("awardSpeakPoints — score thresholds, flip-independent", () => {
  beforeEach(() => pinStreakNoBonus(1));

  it("≥95 → high, 80-94 → mid, 60-79 → low, <60 → attempt only", () => {
    expect(awardSpeakPoints(96)).toBe(80); // speak_match_high
    pinStreakNoBonus(1);
    expect(awardSpeakPoints(85)).toBe(40); // speak_match_mid
    pinStreakNoBonus(1);
    expect(awardSpeakPoints(70)).toBe(20); // speak_match_low
    pinStreakNoBonus(1);
    expect(awardSpeakPoints(40)).toBe(0); // attempt only, no match bonus
  });

  it("always awards the attempt and counts an active day, on either flag", () => {
    h.flags.SERVER_STREAKS_ENABLED = true;
    awardSpeakPoints(40); // attempt only
    // attempt (5 pts) is on the active-day allowlist → recordActiveDay fired.
    expect(h.recordActiveDay).toHaveBeenCalled();
    expect(getTotalPoints()).toBe(5); // 5 * 1.0, no match bonus
  });
});
