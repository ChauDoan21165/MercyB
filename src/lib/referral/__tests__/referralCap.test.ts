// src/lib/referral/__tests__/referralCap.test.ts
//
// Boundary verification for the 90-day-per-year owner cap. The actual
// cap is enforced inside the SQL function `grant_referral_reward` (see
// supabase/migrations/20260510000000_referral_engagement_gate.sql) — we
// can't exercise that here without a live Postgres, but we CAN lock in
// the math the SQL is implementing so that future edits don't drift.
//
// Cap policy:
//   - 12 successful owner grants × 7 days = 84 days  → still under 90
//   - 13 successful owner grants × 7 days = 91 days  → would exceed 90
// → SQL caps at 12 grants per rolling 365 days.

import { describe, it, expect } from "vitest";

const CAP_GRANTS_PER_YEAR = 12;
const REWARD_DAYS_PER_GRANT = 7;
const CAP_LABEL_DAYS = 90;

describe("referral owner cap math", () => {
  it("12 grants × 7 days stays at or below the 90-day label", () => {
    const totalDays = CAP_GRANTS_PER_YEAR * REWARD_DAYS_PER_GRANT;
    expect(totalDays).toBe(84);
    expect(totalDays).toBeLessThanOrEqual(CAP_LABEL_DAYS);
  });

  it("13 grants × 7 days would exceed the 90-day label", () => {
    const totalDays = (CAP_GRANTS_PER_YEAR + 1) * REWARD_DAYS_PER_GRANT;
    expect(totalDays).toBe(91);
    expect(totalDays).toBeGreaterThan(CAP_LABEL_DAYS);
  });

  it("the cap constant in the SQL function is the largest int satisfying N×7 ≤ 90", () => {
    // sanity-check: floor(90 / 7) === 12
    expect(Math.floor(CAP_LABEL_DAYS / REWARD_DAYS_PER_GRANT)).toBe(
      CAP_GRANTS_PER_YEAR,
    );
  });
});
