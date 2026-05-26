// @vitest-environment node
//
// Date-helper tests for the read-side leaderboard client.

import { describe, expect, it, vi } from "vitest";

// The module under test imports the supabase singleton at module-load.
// In a node test environment without env vars, that crashes — so stub
// the client first.
vi.mock("@/lib/supabaseClient", () => ({
  supabase: { from: vi.fn() },
}));

import {
  monthStartIso,
  lastMonthStartIso,
  monthBucket,
  findRank,
} from "../leaderboardClient";

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

describe("findRank", () => {
  it("returns 1-indexed rank when found", () => {
    const rows = [
      { user_id: "a" },
      { user_id: "b" },
      { user_id: "c" },
    ];
    expect(findRank(rows, "a")).toBe(1);
    expect(findRank(rows, "c")).toBe(3);
  });

  it("returns null when the user isn't in the list", () => {
    expect(findRank([{ user_id: "a" }], "missing")).toBeNull();
  });

  it("returns null on empty input", () => {
    expect(findRank([], "x")).toBeNull();
  });
});
