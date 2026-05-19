// supabase/functions/_shared/__tests__/mockInterviewRateLimit.test.ts
//
// Pure-function tests for the mock-interview weekly rate limit:
//   - tier rules (free/trial/paid/admin)
//   - boundary cases (1st session allowed, 2nd blocked, week reset)
//   - ICT week-start math (Mon 00:00 ICT, Sunday late-night still
//     belongs to current week)
//   - retry_after_seconds math (positive, < 7d, decreases as week
//     progresses)

import { describe, it, expect, vi } from "vitest";

import {
  buildMockInterviewLimitErrorBody,
  checkMockInterviewRateLimit,
  ictWeekStart,
} from "../mockInterviewRateLimit";

const SECONDS_PER_DAY = 24 * 60 * 60;
const SECONDS_PER_WEEK = 7 * SECONDS_PER_DAY;

// 2026-04-29 (Wednesday) 10:00 ICT → 03:00 UTC
const WED_ICT_10AM_UTC = new Date("2026-04-29T03:00:00Z");
// 2026-04-27 (Monday) 00:00 ICT → 2026-04-26T17:00:00Z UTC — week start
const MON_ICT_MIDNIGHT_UTC = new Date("2026-04-26T17:00:00Z");
// 2026-05-04 (next Monday) 00:00 ICT → 2026-05-03T17:00:00Z UTC
const NEXT_MON_ICT_MIDNIGHT_UTC = new Date("2026-05-03T17:00:00Z");

const baseCtx = {
  userId: "u-1",
  tier: 0,
  isTrialing: false,
  isPaid: false,
  adminLevel: 0,
};

describe("ictWeekStart", () => {
  it("rounds Wednesday 10:00 ICT down to Monday 00:00 ICT", () => {
    expect(ictWeekStart(WED_ICT_10AM_UTC).toISOString())
      .toBe(MON_ICT_MIDNIGHT_UTC.toISOString());
  });

  it("rounds Monday 00:01 ICT to that same Monday 00:00 ICT", () => {
    // Monday 2026-04-27 00:01 ICT = 2026-04-26T17:01:00Z UTC
    const mondayJustAfterMidnightUtc = new Date("2026-04-26T17:01:00Z");
    expect(ictWeekStart(mondayJustAfterMidnightUtc).toISOString())
      .toBe(MON_ICT_MIDNIGHT_UTC.toISOString());
  });

  it("rounds Sunday 23:59 ICT to the PREVIOUS Monday (still current week)", () => {
    // Sunday 2026-05-03 23:59 ICT = 2026-05-03T16:59:00Z UTC
    const sundayLateUtc = new Date("2026-05-03T16:59:00Z");
    expect(ictWeekStart(sundayLateUtc).toISOString())
      .toBe(MON_ICT_MIDNIGHT_UTC.toISOString());
  });

  it("rolls over to next Monday at Mon 00:00 ICT exactly", () => {
    expect(ictWeekStart(NEXT_MON_ICT_MIDNIGHT_UTC).toISOString())
      .toBe(NEXT_MON_ICT_MIDNIGHT_UTC.toISOString());
  });

  it("is idempotent — applying it to a result returns the same value", () => {
    const first = ictWeekStart(WED_ICT_10AM_UTC);
    const second = ictWeekStart(first);
    expect(second.toISOString()).toBe(first.toISOString());
  });
});

describe("checkMockInterviewRateLimit — tier bypasses", () => {
  it("admin level >= 9 bypasses regardless of tier or count", async () => {
    const count = vi.fn();
    const result = await checkMockInterviewRateLimit(
      { ...baseCtx, tier: 0, adminLevel: 10 },
      { countSessionsThisWeek: count, now: () => WED_ICT_10AM_UTC },
    );
    expect(result.allowed).toBe(true);
    expect(result.reason).toBe("admin_bypass");
    expect(count).not.toHaveBeenCalled();
  });

  it("admin level exactly 9 bypasses (boundary)", async () => {
    const result = await checkMockInterviewRateLimit(
      { ...baseCtx, adminLevel: 9 },
      { countSessionsThisWeek: vi.fn(), now: () => WED_ICT_10AM_UTC },
    );
    expect(result.reason).toBe("admin_bypass");
  });

  it("admin level 8 does NOT bypass", async () => {
    const result = await checkMockInterviewRateLimit(
      { ...baseCtx, adminLevel: 8 },
      { countSessionsThisWeek: async () => 0, now: () => WED_ICT_10AM_UTC },
    );
    expect(result.reason).not.toBe("admin_bypass");
  });

  it("trialing user gets unlimited without a count query", async () => {
    const count = vi.fn();
    const result = await checkMockInterviewRateLimit(
      { ...baseCtx, isTrialing: true },
      { countSessionsThisWeek: count, now: () => WED_ICT_10AM_UTC },
    );
    expect(result.allowed).toBe(true);
    expect(result.reason).toBe("trialing");
    expect(count).not.toHaveBeenCalled();
  });

  it("paid (legacy tier ≥ 2 defensive fallback) gets unlimited without a count query", async () => {
    const count = vi.fn();
    const result = await checkMockInterviewRateLimit(
      { ...baseCtx, tier: 2 },
      { countSessionsThisWeek: count, now: () => WED_ICT_10AM_UTC },
    );
    expect(result.reason).toBe("paid");
    expect(count).not.toHaveBeenCalled();
  });

  // B17 money-path: the real paid signal is `isPaid` (premium_status-
  // derived), NOT the dead numeric `tier`. A premium user who paid
  // after their trial lapsed arrives as tier 0 / isTrialing false /
  // isPaid true and MUST still be unlimited.
  it("isPaid user with tier 0 (the Mylinh case) gets unlimited without a count query", async () => {
    const count = vi.fn();
    const result = await checkMockInterviewRateLimit(
      { ...baseCtx, tier: 0, isTrialing: false, isPaid: true },
      { countSessionsThisWeek: count, now: () => WED_ICT_10AM_UTC },
    );
    expect(result.allowed).toBe(true);
    expect(result.reason).toBe("paid");
    expect(result.limit).toBe(Number.POSITIVE_INFINITY);
    expect(count).not.toHaveBeenCalled();
  });

  it("isPaid=false + tier 0 (truly free) is NOT unlimited — falls through to the weekly cap", async () => {
    const result = await checkMockInterviewRateLimit(
      { ...baseCtx, isPaid: false },
      { countSessionsThisWeek: async () => 1, now: () => WED_ICT_10AM_UTC },
    );
    expect(result.allowed).toBe(false);
    expect(result.reason).toBe("free_weekly_limit_reached");
  });
});

describe("checkMockInterviewRateLimit — free tier weekly cap boundary", () => {
  it("free user with 0 sessions → allowed (1st of week)", async () => {
    const result = await checkMockInterviewRateLimit(baseCtx, {
      countSessionsThisWeek: async () => 0,
      now: () => WED_ICT_10AM_UTC,
    });
    expect(result.allowed).toBe(true);
    expect(result.reason).toBe("within_free_limit");
    expect(result.used_this_period).toBe(0);
    expect(result.limit).toBe(1);
  });

  it("free user with 1 session → blocked (2nd of week)", async () => {
    const result = await checkMockInterviewRateLimit(baseCtx, {
      countSessionsThisWeek: async () => 1,
      now: () => WED_ICT_10AM_UTC,
    });
    expect(result.allowed).toBe(false);
    expect(result.reason).toBe("free_weekly_limit_reached");
    expect(result.used_this_period).toBe(1);
    expect(result.limit).toBe(1);
  });

  it("free user with 7 historical sessions → blocked (count > limit)", async () => {
    const result = await checkMockInterviewRateLimit(baseCtx, {
      countSessionsThisWeek: async () => 7,
      now: () => WED_ICT_10AM_UTC,
    });
    expect(result.allowed).toBe(false);
    expect(result.used_this_period).toBe(7);
  });

  it("free user passes the userId + ICT-week-start to the count loader", async () => {
    const count = vi.fn().mockResolvedValue(0);
    await checkMockInterviewRateLimit(baseCtx, {
      countSessionsThisWeek: count,
      now: () => WED_ICT_10AM_UTC,
    });
    expect(count).toHaveBeenCalledWith(
      "u-1",
      MON_ICT_MIDNIGHT_UTC.toISOString(),
    );
  });
});

describe("checkMockInterviewRateLimit — retry-after math", () => {
  it("retry_after_seconds counts down to next Monday 00:00 ICT", async () => {
    // Wednesday 10:00 ICT → next reset 4 days + 14 hours away
    const result = await checkMockInterviewRateLimit(baseCtx, {
      countSessionsThisWeek: async () => 1,
      now: () => WED_ICT_10AM_UTC,
    });
    const expectedSeconds = (NEXT_MON_ICT_MIDNIGHT_UTC.getTime() -
      WED_ICT_10AM_UTC.getTime()) / 1000;
    expect(result.retry_after_seconds).toBe(expectedSeconds);
    expect(result.retry_after_seconds).toBeGreaterThan(0);
    expect(result.retry_after_seconds).toBeLessThanOrEqual(SECONDS_PER_WEEK);
  });

  it("resets_at is the next Monday 00:00 ICT in ISO UTC", async () => {
    const result = await checkMockInterviewRateLimit(baseCtx, {
      countSessionsThisWeek: async () => 1,
      now: () => WED_ICT_10AM_UTC,
    });
    expect(result.resets_at).toBe(NEXT_MON_ICT_MIDNIGHT_UTC.toISOString());
  });

  it("at the exact week boundary, retry_after_seconds is one full week", async () => {
    // At Mon 00:00 ICT, the count would be 0 anyway, so simulate the
    // pure clock math by passing tier 0 + count 1 (past sessions
    // hypothetically; week-start floors so they wouldn't be counted in
    // reality, but this test isolates the clock math).
    const result = await checkMockInterviewRateLimit(baseCtx, {
      countSessionsThisWeek: async () => 1,
      now: () => MON_ICT_MIDNIGHT_UTC,
    });
    expect(result.retry_after_seconds).toBe(SECONDS_PER_WEEK);
  });
});

describe("buildMockInterviewLimitErrorBody", () => {
  it("returns bilingual VI/EN with the configured fields", () => {
    const body = buildMockInterviewLimitErrorBody({
      used_this_period: 1,
      limit: 1,
      retry_after_seconds: 3600,
      resets_at: "2026-05-04T00:00:00Z",
    });
    expect(body.error_code).toBe("MOCK_INTERVIEW_FREE_LIMIT_REACHED");
    expect(body.error_message_vi).toContain("Đã hết lượt mock interview tuần này");
    expect(body.error_message_en).toContain("Out of mock interviews this week");
    expect(body.used_this_period).toBe(1);
    expect(body.limit).toBe(1);
    expect(body.retry_after_seconds).toBe(3600);
    expect(body.resets_at).toBe("2026-05-04T00:00:00Z");
    expect(body.ok).toBe(false);
  });
});
