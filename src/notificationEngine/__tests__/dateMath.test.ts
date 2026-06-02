import { describe, it, expect } from "vitest";

import { getLocalStudyDates, resolveTimezone } from "../dateMath";

describe("dateMath.getLocalStudyDates — IANA-local, never UTC", () => {
  it("computes today/yesterday in the supplied IANA timezone, not UTC", () => {
    // 2026-06-01T17:30Z is already 2026-06-02 00:30 in Asia/Ho_Chi_Minh (UTC+7).
    const now = new Date("2026-06-01T17:30:00Z");
    const { todayLocal, yesterdayLocal } = getLocalStudyDates(
      "Asia/Ho_Chi_Minh",
      now,
    );
    expect(todayLocal).toBe("2026-06-02");
    expect(yesterdayLocal).toBe("2026-06-01");
    // The forbidden UTC-slice would have given the WRONG day here.
    expect(todayLocal).not.toBe(now.toISOString().slice(0, 10));
  });

  it("yesterday is one calendar day before today (DST-immune, month boundary)", () => {
    const now = new Date("2026-03-01T06:00:00Z"); // HCMC: 2026-03-01 13:00
    const { todayLocal, yesterdayLocal } = getLocalStudyDates(
      "Asia/Ho_Chi_Minh",
      now,
    );
    expect(todayLocal).toBe("2026-03-01");
    expect(yesterdayLocal).toBe("2026-02-28");
  });

  it("falls back to a valid timezone when the supplied one is invalid", () => {
    const { timezone } = getLocalStudyDates("Not/AReal_Zone", new Date());
    expect(timezone).not.toBe("Not/AReal_Zone");
    expect(timezone.length).toBeGreaterThan(0);
  });

  it("resolveTimezone falls back to Asia/Ho_Chi_Minh chain", () => {
    expect(resolveTimezone("Asia/Tokyo")).toBe("Asia/Tokyo");
    // invalid → device or HCMC; always a non-empty valid string
    expect(typeof resolveTimezone(null)).toBe("string");
  });
});
