import { describe, expect, it } from "vitest";
import type { SharedSubscriptionStatus, SubscriptionRow } from "../types";
import { mapStripeSubscription } from "./mapStripeSubscription";

describe("mapStripeSubscription", () => {
  it("returns a value assignable to the canonical shared persisted row contract", () => {
    const rawPayload = { source: "stripe-webhook" };

    const mapped = mapStripeSubscription({
      userId: "user-123",
      providerCustomerId: "cus_123",
      providerSubscriptionId: "sub_123",
      providerTransactionId: "in_123",
      providerOriginalTransactionId: "sub_123",
      productId: "prod_123",
      environment: "production",
      status: "active" satisfies SharedSubscriptionStatus,
      currentPeriodStart: "2026-03-01T00:00:00.000Z",
      currentPeriodEnd: "2026-04-01T00:00:00.000Z",
      cancelAtPeriodEnd: false,
      canceledAt: null,
      endedAt: null,
      rawPayload,
    });

    const canonicalRow: SubscriptionRow = mapped;

    expect(canonicalRow).toEqual({
      user_id: "user-123",
      provider: "stripe",
      provider_customer_id: "cus_123",
      provider_subscription_id: "sub_123",
      provider_transaction_id: "in_123",
      provider_original_transaction_id: "sub_123",
      product_id: "prod_123",
      environment: "production",
      status: "active",
      current_period_start: "2026-03-01T00:00:00.000Z",
      current_period_end: "2026-04-01T00:00:00.000Z",
      cancel_at_period_end: false,
      canceled_at: null,
      ended_at: null,
      raw_payload: rawPayload,
    });
  });

  it("defaults to canonical expired status and subscription-root original transaction id", () => {
    const mapped = mapStripeSubscription({
      userId: "user-123",
      providerCustomerId: null,
      providerSubscriptionId: "sub_root",
      environment: "sandbox",
      rawPayload: { bootstrap: true },
    });

    const canonicalRow: SubscriptionRow = mapped;

    expect(canonicalRow.status).toBe("expired");
    expect(canonicalRow.provider_original_transaction_id).toBe("sub_root");
    expect(canonicalRow.provider).toBe("stripe");
  });
});