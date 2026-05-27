// @vitest-environment node
//
// Date-helper tests for the read-side leaderboard client.

import { describe, expect, it, vi, beforeEach } from "vitest";

// The module under test imports the supabase singleton at module-load.
// In a node test environment without env vars, that crashes — so stub
// the client first.
const fromMock = vi.hoisted(() => vi.fn());

vi.mock("@/lib/supabaseClient", () => ({
  supabase: { from: fromMock },
}));

import {
  getAllTimeTop,
  getMonthlyTop,
  monthStartIso,
  lastMonthStartIso,
  monthBucket,
} from "../leaderboardClient";

beforeEach(() => {
  fromMock.mockReset();
});

describe("monthStartIso", () => {
  it("returns YYYY-MM-01 for a mid-month date", () => {
    const ref = new Date("2026-04-26T12:00:00Z");
    expect(monthStartIso(ref)).toBe("2026-04-01");
  });

  it("returns the same date when passed the 1st", () => {
    const ref = new Date("2026-04-01T00:00:00Z");
    expect(monthStartIso(ref)).toBe("2026-04-01");
  });
});

describe("lastMonthStartIso", () => {
  it("returns the previous month's first day", () => {
    const ref = new Date("2026-04-26T12:00:00Z");
    expect(lastMonthStartIso(ref)).toBe("2026-03-01");
  });

  it("rolls back across year boundaries", () => {
    const ref = new Date("2026-01-15T12:00:00Z");
    expect(lastMonthStartIso(ref)).toBe("2025-12-01");
  });
});

describe("monthBucket", () => {
  it("zero-pads single-digit months", () => {
    expect(monthBucket(new Date("2026-04-26T00:00:00Z"))).toBe("2026-04");
    expect(monthBucket(new Date("2026-12-01T00:00:00Z"))).toBe("2026-12");
  });
});

describe("safe public projection reads", () => {
  it("reads monthly rows from the safe physical projection without user_id", async () => {
    const limitMock = vi.fn().mockResolvedValue({
      data: [
        {
          rank: 1,
          display_name: "Chau",
          total_referrals_this_month: 3,
          successful_conversions: 2,
          month_starts_on: "2026-05-01",
        },
      ],
      error: null,
    });
    const orderMock = vi.fn(() => ({ limit: limitMock }));
    const eqMock = vi.fn(() => ({ order: orderMock }));
    const selectMock = vi.fn(() => ({ eq: eqMock }));
    fromMock.mockReturnValue({ select: selectMock });

    const rows = await getMonthlyTop("2026-05-01", 100);

    expect(fromMock).toHaveBeenCalledWith("referral_leaderboard_monthly_public");
    expect(selectMock).toHaveBeenCalledWith(
      "rank, display_name, total_referrals_this_month, successful_conversions, month_starts_on",
    );
    expect(orderMock).toHaveBeenCalledWith("rank", { ascending: true });
    expect(rows[0]).not.toHaveProperty("user_id");
  });

  it("reads all-time rows from the safe physical projection without user_id", async () => {
    const limitMock = vi.fn().mockResolvedValue({
      data: [
        {
          rank: 1,
          display_name: "Chau",
          total_referrals: 9,
          total_premium_conversions: 4,
          first_referral_date: "2026-05-01T00:00:00Z",
        },
      ],
      error: null,
    });
    const orderMock = vi.fn(() => ({ limit: limitMock }));
    const selectMock = vi.fn(() => ({ order: orderMock }));
    fromMock.mockReturnValue({ select: selectMock });

    const rows = await getAllTimeTop(100);

    expect(fromMock).toHaveBeenCalledWith("referral_leaderboard_all_time_public");
    expect(selectMock).toHaveBeenCalledWith(
      "rank, display_name, total_referrals, total_premium_conversions, first_referral_date",
    );
    expect(orderMock).toHaveBeenCalledWith("rank", { ascending: true });
    expect(rows[0]).not.toHaveProperty("user_id");
  });
});
