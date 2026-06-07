import { describe, it, expect } from "vitest";

import {
  computeNewStreakState,
  formatLocalDate,
  type StreakState,
} from "../streakMath";

/**
 * These tests are the TypeScript mirror of the SQL trigger in
 * `supabase/migrations/20260425000000_server_side_streaks.sql`. If you
 * change the SQL logic, update `streakMath.ts` to match and re-run
 * these tests (and vice versa).
 */

const EMPTY: StreakState = { current: 0, longest: 0, lastStudiedDate: null };
const BUMP = (cur: number, longest: number, date: string): StreakState => ({
  current: cur,
  longest,
  lastStudiedDate: date,
});

describe("computeNewStreakState — Chau's edge cases", () => {
  it("REQ-A-1: new user, first keyword → current=1, longest=1", () => {
    const result = computeNewStreakState(EMPTY, "2026-04-23");
    expect(result.action).toBe("reset");
    if (result.action === "reset") {
      expect(result.reason).toBe("first_ever");
      expect(result.next).toEqual({
        current: 1,
        longest: 1,
        lastStudiedDate: "2026-04-23",
      });
    }
  });

  it("REQ-A-2: Day 1 → Day 2 (consecutive) → current=2, longest=2", () => {
    const prev = BUMP(1, 1, "2026-04-22");
    const result = computeNewStreakState(prev, "2026-04-23");
    expect(result.action).toBe("increment");
    if (result.action === "increment") {
      expect(result.reason).toBe("consecutive");
      expect(result.next.current).toBe(2);
      expect(result.next.longest).toBe(2);
    }
  });

  it("REQ-A-3: Day 1 → Day 3 (1-day grace) → current=2, grace preserves streak", () => {
    const prev = BUMP(1, 1, "2026-04-22");
    const result = computeNewStreakState(prev, "2026-04-24"); // skipped Apr 23
    expect(result.action).toBe("increment");
    if (result.action === "increment") {
      expect(result.reason).toBe("grace");
      expect(result.next.current).toBe(2);
      expect(result.next.longest).toBe(2);
    }
  });

  it("REQ-A-4: Day 1 → Day 4 (2+ day gap) → current=1, longest=prev.longest preserved", () => {
    const prev = BUMP(5, 12, "2026-04-21"); // 12-day all-time best
    const result = computeNewStreakState(prev, "2026-04-25"); // 4-day gap
    expect(result.action).toBe("reset");
    if (result.action === "reset") {
      expect(result.reason).toBe("gap");
      expect(result.next.current).toBe(1);
      expect(result.next.longest).toBe(12); // NOT overwritten
    }
  });

  it("REQ-A-5: multiple same-day writes → no-op after first", () => {
    const prev = BUMP(3, 5, "2026-04-23");
    const result = computeNewStreakState(prev, "2026-04-23");
    expect(result.action).toBe("noop_same_day");
  });

  it("clock skew / prev in future → no-op, do not corrupt state", () => {
    const prev = BUMP(3, 5, "2026-04-25"); // future date
    const result = computeNewStreakState(prev, "2026-04-23");
    expect(result.action).toBe("noop_future_prev");
  });

  it("grace edge: prev exactly 2 days ago still counts", () => {
    const prev = BUMP(7, 7, "2026-04-21");
    const result = computeNewStreakState(prev, "2026-04-23");
    expect(result.action).toBe("increment");
    if (result.action === "increment") {
      expect(result.reason).toBe("grace");
      expect(result.next.current).toBe(8);
    }
  });

  it("grace edge: prev exactly 3 days ago resets", () => {
    const prev = BUMP(7, 7, "2026-04-20");
    const result = computeNewStreakState(prev, "2026-04-23");
    expect(result.action).toBe("reset");
    if (result.action === "reset") {
      expect(result.reason).toBe("gap");
      expect(result.next.current).toBe(1);
      expect(result.next.longest).toBe(7);
    }
  });

  it("longest never decreases during a reset", () => {
    const prev = BUMP(1, 100, "2026-04-01");
    const result = computeNewStreakState(prev, "2026-04-23");
    expect(result.action).toBe("reset");
    if (result.action === "reset") {
      expect(result.next.longest).toBe(100);
    }
  });

  it("longest updates when current exceeds it", () => {
    const prev = BUMP(5, 5, "2026-04-22");
    const result = computeNewStreakState(prev, "2026-04-23");
    expect(result.action).toBe("increment");
    if (result.action === "increment") {
      expect(result.next.current).toBe(6);
      expect(result.next.longest).toBe(6);
    }
  });

  it("month boundary: end of April → May 1 is consecutive", () => {
    const prev = BUMP(3, 3, "2026-04-30");
    const result = computeNewStreakState(prev, "2026-05-01");
    expect(result.action).toBe("increment");
    if (result.action === "increment") {
      expect(result.reason).toBe("consecutive");
      expect(result.next.current).toBe(4);
    }
  });

  it("year boundary: Dec 31 → Jan 1 is consecutive", () => {
    const prev = BUMP(10, 10, "2025-12-31");
    const result = computeNewStreakState(prev, "2026-01-01");
    expect(result.action).toBe("increment");
    if (result.action === "increment") {
      expect(result.reason).toBe("consecutive");
      expect(result.next.current).toBe(11);
    }
  });
});

describe("formatLocalDate", () => {
  it("formats UTC → Asia/Ho_Chi_Minh correctly", () => {
    // 2026-04-23T16:30:00Z = 23:30 in ICT (UTC+7) → still Apr 23 local
    const d = new Date("2026-04-23T16:30:00Z");
    expect(formatLocalDate(d, "Asia/Ho_Chi_Minh")).toBe("2026-04-23");
  });

  it("handles date-boundary crossover — UTC 18:00 Apr 23 is Apr 24 in ICT", () => {
    const d = new Date("2026-04-23T18:00:00Z"); // 01:00 Apr 24 ICT
    expect(formatLocalDate(d, "Asia/Ho_Chi_Minh")).toBe("2026-04-24");
  });

  it("handles America/Los_Angeles (UTC-7/8) — UTC 05:00 Apr 23 is Apr 22 LA", () => {
    const d = new Date("2026-04-23T05:00:00Z");
    // PDT (summer) is UTC-7; 05:00Z → 22:00 Apr 22 LA.
    expect(formatLocalDate(d, "America/Los_Angeles")).toBe("2026-04-22");
  });

  it("DST transition: LA spring-forward March 2026. 10:00Z is 03:00 PDT Mar 8 after spring forward.", () => {
    const d = new Date("2026-03-08T10:00:00Z");
    expect(formatLocalDate(d, "America/Los_Angeles")).toBe("2026-03-08");
  });

  it("LA spring-forward keeps one local day across the skipped hour, then increments the next local day", () => {
    const beforeShiftDay = formatLocalDate(
      new Date("2026-03-08T09:30:00Z"), // 01:30 PST
      "America/Los_Angeles",
    );
    const afterShiftDay = formatLocalDate(
      new Date("2026-03-08T10:30:00Z"), // 03:30 PDT; 02:xx never exists
      "America/Los_Angeles",
    );
    const nextLocalDay = formatLocalDate(
      new Date("2026-03-09T07:30:00Z"), // 00:30 PDT
      "America/Los_Angeles",
    );

    expect(beforeShiftDay).toBe("2026-03-08");
    expect(afterShiftDay).toBe("2026-03-08");
    expect(nextLocalDay).toBe("2026-03-09");

    const first = computeNewStreakState(BUMP(4, 4, "2026-03-07"), beforeShiftDay);
    expect(first.action).toBe("increment");
    if (first.action !== "increment") throw new Error("expected DST first day increment");
    expect(first.next.current).toBe(5);

    expect(computeNewStreakState(first.next, afterShiftDay)).toEqual({
      action: "noop_same_day",
    });

    const next = computeNewStreakState(first.next, nextLocalDay);
    expect(next.action).toBe("increment");
    if (next.action === "increment") {
      expect(next.reason).toBe("consecutive");
      expect(next.next.current).toBe(6);
    }
  });

  it("New York fall-back repeated hour does not double-count the same local day", () => {
    const firstOneThirty = formatLocalDate(
      new Date("2026-11-01T05:30:00Z"), // 01:30 EDT
      "America/New_York",
    );
    const secondOneThirty = formatLocalDate(
      new Date("2026-11-01T06:30:00Z"), // 01:30 EST after clocks fall back
      "America/New_York",
    );

    expect(firstOneThirty).toBe("2026-11-01");
    expect(secondOneThirty).toBe("2026-11-01");
    expect(
      computeNewStreakState(BUMP(9, 9, firstOneThirty), secondOneThirty),
    ).toEqual({ action: "noop_same_day" });
  });

  it("the same instant buckets by learner timezone without UTC-day skip or double-count", () => {
    const instant = new Date("2026-06-01T18:30:00Z");
    const vietnamDay = formatLocalDate(instant, "Asia/Ho_Chi_Minh");
    const edmontonDay = formatLocalDate(instant, "America/Edmonton");

    expect(vietnamDay).toBe("2026-06-02");
    expect(edmontonDay).toBe("2026-06-01");

    const vietnam = computeNewStreakState(BUMP(3, 3, "2026-06-01"), vietnamDay);
    expect(vietnam.action).toBe("increment");
    if (vietnam.action === "increment") {
      expect(vietnam.reason).toBe("consecutive");
      expect(vietnam.next.current).toBe(4);
    }

    expect(computeNewStreakState(BUMP(3, 3, "2026-06-01"), edmontonDay)).toEqual({
      action: "noop_same_day",
    });
  });
});
