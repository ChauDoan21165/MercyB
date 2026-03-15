import { describe, expect, it } from "vitest";
import { computeEntitlement } from "./computeEntitlement";
import type { SubscriptionRow } from "./types";

function sub(overrides: Partial<SubscriptionRow>): SubscriptionRow {
  return {
    user_id: "user-1",
    provider: "stripe",
    status: "active",
    current_period_end: "2026-04-15T12:00:00Z",
    cancel_at_period_end: false,
    ended_at: null,
    ...overrides,
  };
}

describe("computeEntitlement", () => {
  const now = new Date("2026-04-01T00:00:00Z");

  it("returns free when there are no subscriptions", () => {
    const result = computeEntitlement([], now);

    expect(result).toEqual({
      isPremium: false,
      premiumStatus: "free",
      premiumSource: "none",
      premiumExpiresAt: null,
    });
  });

  it("returns premium for one active subscription", () => {
    const result = computeEntitlement([sub({ status: "active" })], now);

    expect(result.isPremium).toBe(true);
    expect(result.premiumStatus).toBe("active");
    expect(result.premiumSource).toBe("stripe");
    expect(result.premiumExpiresAt).toBe("2026-04-15T12:00:00Z");
  });

  it("ignores expired subscriptions", () => {
    const result = computeEntitlement(
      [sub({ status: "expired", current_period_end: "2026-03-01T00:00:00Z" })],
      now
    );

    expect(result.isPremium).toBe(false);
    expect(result.premiumStatus).toBe("free");
  });

  it("ignores paused subscriptions", () => {
    const result = computeEntitlement([sub({ status: "paused" })], now);

    expect(result.isPremium).toBe(false);
    expect(result.premiumStatus).toBe("free");
  });

  it("ignores revoked subscriptions", () => {
    const result = computeEntitlement([sub({ status: "revoked" })], now);

    expect(result.isPremium).toBe(false);
    expect(result.premiumStatus).toBe("free");
  });

  it("keeps premium for past_due when current_period_end is still in the future", () => {
    const result = computeEntitlement(
      [sub({ status: "past_due", current_period_end: "2026-04-10T00:00:00Z" })],
      now
    );

    expect(result.isPremium).toBe(true);
    expect(result.premiumStatus).toBe("past_due");
  });

  it("does not keep premium for past_due when current_period_end is in the past", () => {
    const result = computeEntitlement(
      [sub({ status: "past_due", current_period_end: "2026-03-10T00:00:00Z" })],
      now
    );

    expect(result.isPremium).toBe(false);
    expect(result.premiumStatus).toBe("free");
  });

  it("chooses the eligible subscription with the latest end date", () => {
    const result = computeEntitlement(
      [
        sub({
          provider: "stripe",
          status: "active",
          current_period_end: "2026-04-05T00:00:00Z",
        }),
        sub({
          provider: "apple",
          status: "grace_period",
          current_period_end: "2026-04-20T00:00:00Z",
        }),
      ],
      now
    );

    expect(result.isPremium).toBe(true);
    expect(result.premiumSource).toBe("apple");
    expect(result.premiumStatus).toBe("grace_period");
    expect(result.premiumExpiresAt).toBe("2026-04-20T00:00:00Z");
  });
});