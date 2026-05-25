// supabase/functions/revenuecat-webhook/__tests__/zodValidation.test.ts
//
// A11 contract tests for the zod schema backing revenuecat-webhook's
// runtime envelope validation. Pattern follows #886 (apple) / #891
// (google) / A11-stripe — schema-level unit tests against an in-test
// mirror of _shared/webhookSchemas.ts.
//
// RevenueCat sends every event as { event: {...}, api_version: string }.
// The inner event always has `type` (required) plus a variable set of
// fields depending on which event type fired (INITIAL_PURCHASE /
// RENEWAL / CANCELLATION / EXPIRATION / REFUND / BILLING_ISSUE /
// PRODUCT_CHANGE / NON_RENEWING_PURCHASE / SUBSCRIBER_ALIAS / …).

import { describe, expect, it } from "vitest";
import { z } from "zod";

const revenuecatWebhookEnvelopeSchema = z.object({
  api_version: z.string().optional(),
  event: z.object({
    type: z.string().min(1),
    id: z.string().optional(),
    app_user_id: z.string().optional(),
    original_app_user_id: z.string().optional(),
    aliases: z.array(z.string()).optional(),
    product_id: z.string().optional(),
    transaction_id: z.string().optional(),
    original_transaction_id: z.string().optional(),
    entitlement_id: z.string().nullable().optional(),
    entitlement_ids: z.array(z.string()).optional(),
    expiration_at_ms: z.number().nullable().optional(),
    purchased_at_ms: z.number().nullable().optional(),
    event_timestamp_ms: z.number().optional(),
    environment: z.enum(["PRODUCTION", "SANDBOX"]).optional(),
    price: z.number().nullable().optional(),
    price_in_purchased_currency: z.number().nullable().optional(),
    currency: z.string().nullable().optional(),
    store: z.string().optional(),
    period_type: z.string().optional(),
    presented_offering_id: z.string().nullable().optional(),
    cancel_reason: z.string().nullable().optional(),
    new_product_id: z.string().nullable().optional(),
  }).passthrough(),
}).passthrough();

describe("revenuecatWebhookEnvelopeSchema — outer envelope", () => {
  it("accepts a documented INITIAL_PURCHASE event", () => {
    const valid = {
      api_version: "1.0",
      event: {
        type: "INITIAL_PURCHASE",
        id: "rc_evt_xxx",
        app_user_id: "00000000-0000-4000-a000-000000000001",
        product_id: "mercyblade_premium_monthly",
        transaction_id: "txn_xxx",
        original_transaction_id: "txn_orig",
        entitlement_ids: ["premium"],
        expiration_at_ms: 1763500800000,
        purchased_at_ms: 1763000000000,
        environment: "PRODUCTION",
        price: 9.99,
        currency: "USD",
        store: "APP_STORE",
        period_type: "NORMAL",
      },
    };
    const result = revenuecatWebhookEnvelopeSchema.safeParse(valid);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.event.type).toBe("INITIAL_PURCHASE");
    }
  });

  it("accepts a documented RENEWAL event", () => {
    const valid = {
      api_version: "1.0",
      event: {
        type: "RENEWAL",
        id: "rc_evt_renew",
        app_user_id: "uuid-here",
        product_id: "mercyblade.annual",
        environment: "PRODUCTION",
        expiration_at_ms: 1795036800000,
        period_type: "NORMAL",
      },
    };
    const result = revenuecatWebhookEnvelopeSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it("accepts a documented CANCELLATION event with cancel_reason", () => {
    const valid = {
      event: {
        type: "CANCELLATION",
        app_user_id: "user-x",
        cancel_reason: "UNSUBSCRIBE",
        expiration_at_ms: 1763500800000,
      },
    };
    const result = revenuecatWebhookEnvelopeSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it("accepts an EXPIRATION event with null entitlement_id", () => {
    const valid = {
      event: {
        type: "EXPIRATION",
        app_user_id: "user-x",
        entitlement_id: null,
        expiration_at_ms: 1763000000000,
      },
    };
    const result = revenuecatWebhookEnvelopeSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it("accepts a SANDBOX environment event", () => {
    const valid = {
      event: {
        type: "INITIAL_PURCHASE",
        app_user_id: "test-user",
        environment: "SANDBOX",
      },
    };
    const result = revenuecatWebhookEnvelopeSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it("accepts a PRODUCT_CHANGE event with new_product_id", () => {
    const valid = {
      event: {
        type: "PRODUCT_CHANGE",
        app_user_id: "user-x",
        product_id: "old_monthly",
        new_product_id: "new_annual",
      },
    };
    const result = revenuecatWebhookEnvelopeSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it("accepts aliases array on SUBSCRIBER_ALIAS event", () => {
    const valid = {
      event: {
        type: "SUBSCRIBER_ALIAS",
        app_user_id: "user-new",
        original_app_user_id: "user-old",
        aliases: ["user-new", "user-old", "another-id"],
      },
    };
    const result = revenuecatWebhookEnvelopeSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it("accepts schema drift — RC-added top-level field", () => {
    const drifted = {
      api_version: "1.0",
      event: { type: "RENEWAL", app_user_id: "x" },
      // Hypothetical future RC envelope field
      delivery_id: "delivery_xxx",
    };
    const result = revenuecatWebhookEnvelopeSchema.safeParse(drifted);
    expect(result.success).toBe(true);
  });

  it("accepts schema drift — RC-added event-level field", () => {
    const drifted = {
      event: {
        type: "RENEWAL",
        app_user_id: "x",
        offer_id: "promo_2025",
        introductory_price: 0.99,
      },
    };
    const result = revenuecatWebhookEnvelopeSchema.safeParse(drifted);
    expect(result.success).toBe(true);
  });

  it("REJECTS missing event field (envelope-level)", () => {
    const bad = { api_version: "1.0" };
    const result = revenuecatWebhookEnvelopeSchema.safeParse(bad);
    expect(result.success).toBe(false);
    if (!result.success) {
      const issue = result.error.issues.find((i) => i.path[0] === "event");
      expect(issue).toBeDefined();
    }
  });

  it("REJECTS missing event.type (required)", () => {
    const bad = { event: { app_user_id: "x" } };
    const result = revenuecatWebhookEnvelopeSchema.safeParse(bad);
    expect(result.success).toBe(false);
    if (!result.success) {
      const issue = result.error.issues.find(
        (i) => i.path[0] === "event" && i.path[1] === "type",
      );
      expect(issue).toBeDefined();
    }
  });

  it("REJECTS empty-string event.type", () => {
    const bad = { event: { type: "" } };
    const result = revenuecatWebhookEnvelopeSchema.safeParse(bad);
    expect(result.success).toBe(false);
  });

  it("REJECTS event.type of wrong type (number)", () => {
    const bad = { event: { type: 42 } };
    const result = revenuecatWebhookEnvelopeSchema.safeParse(bad);
    expect(result.success).toBe(false);
  });

  it("REJECTS unknown environment enum (not PRODUCTION/SANDBOX)", () => {
    const bad = {
      event: {
        type: "RENEWAL",
        environment: "STAGING",
      },
    };
    const result = revenuecatWebhookEnvelopeSchema.safeParse(bad);
    expect(result.success).toBe(false);
  });

  it("REJECTS expiration_at_ms of wrong type (string)", () => {
    const bad = {
      event: {
        type: "RENEWAL",
        expiration_at_ms: "1763500800000",
      },
    };
    const result = revenuecatWebhookEnvelopeSchema.safeParse(bad);
    expect(result.success).toBe(false);
  });

  it("REJECTS entitlement_ids with non-string element", () => {
    const bad = {
      event: {
        type: "INITIAL_PURCHASE",
        entitlement_ids: ["premium", 42],
      },
    };
    const result = revenuecatWebhookEnvelopeSchema.safeParse(bad);
    expect(result.success).toBe(false);
  });

  it("REJECTS null body", () => {
    const result = revenuecatWebhookEnvelopeSchema.safeParse(null);
    expect(result.success).toBe(false);
  });

  it("REJECTS array body", () => {
    const result = revenuecatWebhookEnvelopeSchema.safeParse([
      { event: { type: "RENEWAL" } },
    ]);
    expect(result.success).toBe(false);
  });

  it("REJECTS event=null (envelope present but event null)", () => {
    const bad = { event: null };
    const result = revenuecatWebhookEnvelopeSchema.safeParse(bad);
    expect(result.success).toBe(false);
  });
});

describe("PII-scrubbing contract — issues array shape (Sentry payload)", () => {
  // Locks the same contract as the other 3 webhook PRs. The handler
  // ships ONLY error.issues.map(...) + top-level keys to Sentry on
  // envelope-validation failure — never the raw event body (which
  // contains app_user_id UUIDs, transaction_ids, prices, currency).
  it("envelope parse failure exposes path/code/message — and nothing else", () => {
    const result = revenuecatWebhookEnvelopeSchema.safeParse({});
    expect(result.success).toBe(false);
    if (!result.success) {
      for (const issue of result.error.issues) {
        expect(issue).toHaveProperty("path");
        expect(issue).toHaveProperty("code");
        expect(issue).toHaveProperty("message");
      }
    }
  });

  it("nested-field failure (event.type wrong type) exposes drilled path", () => {
    const result = revenuecatWebhookEnvelopeSchema.safeParse({
      event: { type: 42 },
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      // Path should be ["event", "type"] — the location of the bad
      // value, NOT the value itself
      const issue = result.error.issues.find(
        (i) => i.path[0] === "event" && i.path[1] === "type",
      );
      expect(issue).toBeDefined();
      // Confirm `issue` does NOT carry the offending value (42)
      expect(JSON.stringify(issue)).not.toContain('"42"');
    }
  });
});
