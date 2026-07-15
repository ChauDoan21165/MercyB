// supabase/functions/stripe-webhook/__tests__/subscriptionInsert.test.ts
//
// Locks the Stripe → `subscriptions` Insert mapping. This is money-path
// persistence: a wrong product_id / app_id / customer linkage corrupts
// entitlement. The mapping was previously un-unit-testable (it lived in
// billing.ts, which transitively imports Deno-only code) and shipped with
// a latent type bug — `product_id`/`app_id` reads failed `deno check`
// (TS2339/TS2353) because the metadata type was over-narrowed and the
// generated `subscriptions` type had drifted out of sync with the real
// columns. This suite asserts the fixed product_id path end-to-end.
//
// No __fixtures__ dir exists in supabase/functions, so the Stripe-derived
// params are constructed inline.

import { describe, expect, it } from "vitest";

import { mapStripeSubscription } from "../subscription-insert";

const NOW = "2026-05-19T00:00:00.000Z";

function baseParams() {
  return {
    nowIso: NOW,
    userId: "user-123",
    appId: "mercyblade",
    providerCustomerId: "cus_ABC",
    providerSubscriptionId: "sub_XYZ",
    environment: "production" as const,
    rawPayload: { id: "evt_1" },
  };
}

describe("mapStripeSubscription — product_id path (the fixed code path)", () => {
  it("maps an explicit product_id into product_id and provider_product_id", () => {
    const row = mapStripeSubscription({
      ...baseParams(),
      productId: "prod_PRIMARY",
    });

    expect(row.product_id).toBe("prod_PRIMARY");
    // provider_product_id falls back to productId when no explicit
    // providerProductId is given (providerProductId ?? productId ?? null).
    expect(row.provider_product_id).toBe("prod_PRIMARY");
  });

  it("prefers an explicit providerProductId but still keeps product_id", () => {
    const row = mapStripeSubscription({
      ...baseParams(),
      productId: "prod_PRIMARY",
      providerProductId: "prod_PROVIDER_SPECIFIC",
    });

    expect(row.product_id).toBe("prod_PRIMARY");
    expect(row.provider_product_id).toBe("prod_PROVIDER_SPECIFIC");
  });

  it("nulls both product columns when no product is supplied", () => {
    const row = mapStripeSubscription(baseParams());

    expect(row.product_id).toBeNull();
    expect(row.provider_product_id).toBeNull();
  });
});

describe("mapStripeSubscription — columns that were missing from the type", () => {
  it("threads app_id through (the column that tripped TS2353)", () => {
    const row = mapStripeSubscription({ ...baseParams(), appId: "kids-app" });
    expect(row.app_id).toBe("kids-app");
  });

  it("maps customer_id and subscription_id from the provider ids", () => {
    const row = mapStripeSubscription(baseParams());
    expect(row.customer_id).toBe("cus_ABC");
    expect(row.subscription_id).toBe("sub_XYZ");
    expect(row.provider_customer_id).toBe("cus_ABC");
    expect(row.provider_subscription_id).toBe("sub_XYZ");
  });

  it("writes both legacy and _at period columns from the same timestamps", () => {
    const row = mapStripeSubscription({
      ...baseParams(),
      currentPeriodStart: "2026-12-01T00:00:00.000Z",
      currentPeriodEnd: "2027-01-01T00:00:00.000Z",
    });

    expect(row.current_period_start).toBe("2026-12-01T00:00:00.000Z");
    expect(row.current_period_start_at).toBe("2026-12-01T00:00:00.000Z");
    expect(row.current_period_end).toBe("2027-01-01T00:00:00.000Z");
    expect(row.current_period_end_at).toBe("2027-01-01T00:00:00.000Z");
  });
});

describe("mapStripeSubscription — invariants & defaults", () => {
  it("is always provider=stripe", () => {
    expect(mapStripeSubscription(baseParams()).provider).toBe("stripe");
  });

  it("defaults status to 'revoked' and cancel_at_period_end to false", () => {
    const row = mapStripeSubscription(baseParams());
    expect(row.status).toBe("revoked");
    expect(row.cancel_at_period_end).toBe(false);
  });

  it("honors an explicit status and boolean cancel_at_period_end", () => {
    const row = mapStripeSubscription({
      ...baseParams(),
      status: "active",
      cancelAtPeriodEnd: true,
    });
    expect(row.status).toBe("active");
    expect(row.cancel_at_period_end).toBe(true);
  });

  it("mirrors metadata into metadata + provider_metadata and uses injected clock", () => {
    const meta = { product_id: "prod_FROM_META", plan: "yearly" };
    const row = mapStripeSubscription({ ...baseParams(), metadata: meta });

    expect(row.metadata).toEqual(meta);
    expect(row.provider_metadata).toEqual(meta);
    expect(row.raw_payload).toEqual({ id: "evt_1" });
    expect(row.updated_at).toBe(NOW);
  });
});
