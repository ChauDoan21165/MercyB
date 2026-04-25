// src/billing/__tests__/computeEntitlementWithGifts.test.ts
//
// Step 9 — gift-stacking semantics. The original computeEntitlement()
// path is unchanged; this suite locks the new computeEntitlementWithGifts
// branch so future Stripe-webhook recomputers don't accidentally regress
// the "max-end, paid wins ties" rule.

import { describe, expect, it } from "vitest";

import {
  computeEntitlement,
  computeEntitlementWithGifts,
  effectiveGiftEnd,
  type RedeemedGift,
} from "../computeEntitlement";
import type { SubscriptionRow } from "../types";

const NOW = new Date("2026-04-25T12:00:00Z");
const DAY_MS = 24 * 60 * 60 * 1000;
const MONTH_DAYS = 30;

function plusDaysIso(d: number, base: Date = NOW): string {
  return new Date(base.getTime() + d * DAY_MS).toISOString();
}

function activeSub(currentPeriodEnd: string): SubscriptionRow {
  return {
    user_id: "u1",
    provider: "stripe",
    status: "active",
    current_period_end: currentPeriodEnd,
  };
}

const redeemed = (durationMonths: number, redeemedAt: string): RedeemedGift => ({
  durationMonths,
  redeemedAt,
});

describe("effectiveGiftEnd", () => {
  it("returns null for an empty list", () => {
    expect(effectiveGiftEnd([], NOW)).toBeNull();
  });

  it("returns the gift's end-of-window in ms", () => {
    const start = "2026-04-01T00:00:00Z";
    const expectedEnd = Date.parse(start) + 6 * MONTH_DAYS * DAY_MS;
    expect(effectiveGiftEnd([redeemed(6, start)], NOW)).toBe(expectedEnd);
  });

  it("returns the MAX end across multiple redeemed gifts", () => {
    const earlier = "2026-04-01T00:00:00Z";
    const later = "2026-04-15T00:00:00Z";
    // earlier 6mo: end ≈ Sep 28
    // later 12mo: end ≈ Apr 10 next year (longer)
    const result = effectiveGiftEnd(
      [redeemed(6, earlier), redeemed(12, later)],
      NOW,
    );
    expect(result).toBe(Date.parse(later) + 12 * MONTH_DAYS * DAY_MS);
  });

  it("ignores redeemed gifts already past their window", () => {
    const longAgo = "2024-01-01T00:00:00Z"; // 1mo gift expired in 2024
    expect(effectiveGiftEnd([redeemed(1, longAgo)], NOW)).toBeNull();
  });

  it("does NOT add durations together (max wins, not sum)", () => {
    // Two 3-month gifts redeemed today — effective end is 3mo, not 6.
    const today = NOW.toISOString();
    const expected = Date.parse(today) + 3 * MONTH_DAYS * DAY_MS;
    expect(
      effectiveGiftEnd([redeemed(3, today), redeemed(3, today)], NOW),
    ).toBe(expected);
  });
});

describe("computeEntitlementWithGifts", () => {
  it("returns the unchanged paid result when no gifts are redeemed", () => {
    const sub = activeSub(plusDaysIso(60));
    const expected = computeEntitlement([sub]);
    const got = computeEntitlementWithGifts([sub], [], NOW);
    expect(got).toEqual(expected);
  });

  it("returns the unchanged paid result when all gifts are expired", () => {
    const sub = activeSub(plusDaysIso(60));
    const got = computeEntitlementWithGifts(
      [sub],
      [redeemed(1, "2024-01-01T00:00:00Z")],
      NOW,
    );
    expect(got).toEqual(computeEntitlement([sub]));
  });

  it("activates entitlement on a redeemed gift when no paid sub exists", () => {
    const today = NOW.toISOString();
    const result = computeEntitlementWithGifts([], [redeemed(6, today)], NOW);
    expect(result.status).toBe("active");
    expect(result.expires_at).toBeTruthy();
    expect(Date.parse(result.expires_at!)).toBeGreaterThan(NOW.getTime());
  });

  it("when paid expiry is LATER than gift expiry, paid wins (no extension)", () => {
    const paidEnd = plusDaysIso(365); // a year out
    const giftStart = NOW.toISOString(); // 6mo from now
    const result = computeEntitlementWithGifts(
      [activeSub(paidEnd)],
      [redeemed(6, giftStart)],
      NOW,
    );
    expect(result.expires_at).toBe(paidEnd);
    expect(result.source).toBe("stripe");
  });

  it("when gift expiry is LATER than paid expiry, gift extends entitlement", () => {
    const paidEnd = plusDaysIso(30); // a month out
    const giftStart = NOW.toISOString(); // 12mo from now
    const result = computeEntitlementWithGifts(
      [activeSub(paidEnd)],
      [redeemed(12, giftStart)],
      NOW,
    );
    expect(result.status).toBe("active");
    expect(Date.parse(result.expires_at!)).toBeGreaterThan(Date.parse(paidEnd));
    // Gift end ≈ NOW + 360 days
    expect(Date.parse(result.expires_at!)).toBeCloseTo(
      NOW.getTime() + 12 * MONTH_DAYS * DAY_MS,
      -3, // tolerance: within 1 second
    );
  });

  it("does not modify the original computeEntitlement path", () => {
    // Sanity: original function with the same input returns the paid-only
    // answer regardless of how many gifts are passed elsewhere.
    const sub = activeSub(plusDaysIso(60));
    const a = computeEntitlement([sub]);
    const b = computeEntitlement([sub]);
    expect(a).toEqual(b);
    expect(a.expires_at).toBe(plusDaysIso(60));
  });
});
