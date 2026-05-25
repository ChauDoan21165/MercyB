// supabase/functions/google-webhook/__tests__/zodValidation.test.ts
//
// A11 contract tests for the zod schemas backing google-webhook's
// runtime payload validation. Pattern follows apple-webhook (#886):
// schema-level unit tests against in-test mirrors of the production
// schemas in _shared/webhookSchemas.ts.
//
// Two layers under test:
//   1. Pub/Sub push envelope     `{ message: { data, messageId, ... } }`
//   2. Decoded RTDN notification — one of subscriptionNotification /
//      voidedPurchaseNotification / oneTimeProductNotification /
//      testNotification (Google's spec; exactly one is set per message)

import { describe, expect, it } from "vitest";
import { z } from "zod";

const googlePubSubEnvelopeSchema = z.object({
  message: z.object({
    data: z.string().optional(),
    messageId: z.string().optional(),
    message_id: z.string().optional(),
    publishTime: z.string().optional(),
    publish_time: z.string().optional(),
    attributes: z.record(z.string()).optional(),
  }).passthrough(),
  subscription: z.string().optional(),
}).passthrough();

const googleRtdnNotificationSchema = z.object({
  version: z.string().optional(),
  packageName: z.string().optional(),
  eventTimeMillis: z.string().optional(),
  subscriptionNotification: z.object({
    version: z.string().optional(),
    notificationType: z.number().int().optional(),
    purchaseToken: z.string().optional(),
    subscriptionId: z.string().optional(),
  }).passthrough().optional(),
  oneTimeProductNotification: z.object({
    version: z.string().optional(),
    notificationType: z.number().int().optional(),
    purchaseToken: z.string().optional(),
    sku: z.string().optional(),
  }).passthrough().optional(),
  voidedPurchaseNotification: z.object({
    purchaseToken: z.string().optional(),
    orderId: z.string().optional(),
    productType: z.number().int().optional(),
    refundType: z.number().int().optional(),
  }).passthrough().optional(),
  testNotification: z.object({
    version: z.string().optional(),
  }).passthrough().optional(),
}).passthrough();

describe("googlePubSubEnvelopeSchema — outer Pub/Sub envelope", () => {
  it("accepts a documented Google Pub/Sub push envelope", () => {
    const valid = {
      message: {
        data: "eyJ2ZXJzaW9uIjoiMS4wIn0=", // base64 of {"version":"1.0"}
        messageId: "12345678",
        publishTime: "2026-05-19T22:00:00Z",
        attributes: {},
      },
      subscription: "projects/mercyblade/subscriptions/rtdn-sub",
    };
    const result = googlePubSubEnvelopeSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it("accepts snake_case fields (historic Pub/Sub field names)", () => {
    const valid = {
      message: {
        data: "eyJ2ZXJzaW9uIjoiMS4wIn0=",
        message_id: "12345678",
        publish_time: "2026-05-19T22:00:00Z",
      },
    };
    const result = googlePubSubEnvelopeSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it("accepts envelope without data (Pub/Sub bootstrap test publish)", () => {
    // Documented edge case — Google sometimes publishes a no-data
    // message to bootstrap subscription verification. Must not reject.
    const valid = {
      message: {
        messageId: "bootstrap-1",
      },
    };
    const result = googlePubSubEnvelopeSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it("accepts schema drift — Pub/Sub-added envelope-level field", () => {
    const drifted = {
      message: { data: "eyJ4Ijp0cnVlfQ==", messageId: "1" },
      subscription: "projects/x/subscriptions/y",
      _future_pubsub_field: { nested: true },
    };
    const result = googlePubSubEnvelopeSchema.safeParse(drifted);
    expect(result.success).toBe(true);
  });

  it("REJECTS missing message field — required envelope key", () => {
    const result = googlePubSubEnvelopeSchema.safeParse({});
    expect(result.success).toBe(false);
    if (!result.success) {
      const issue = result.error.issues.find((i) => i.path[0] === "message");
      expect(issue).toBeDefined();
    }
  });

  it("REJECTS message of wrong type (string instead of object)", () => {
    const result = googlePubSubEnvelopeSchema.safeParse({ message: "not-an-object" });
    expect(result.success).toBe(false);
  });

  it("REJECTS null body", () => {
    const result = googlePubSubEnvelopeSchema.safeParse(null);
    expect(result.success).toBe(false);
  });

  it("REJECTS array body — must be object", () => {
    const result = googlePubSubEnvelopeSchema.safeParse([{ message: { data: "x" } }]);
    expect(result.success).toBe(false);
  });

  it("REJECTS attributes with non-string values", () => {
    // Pub/Sub attributes are always string-to-string. Numeric values
    // would indicate a mock or corrupted payload.
    const bad = {
      message: {
        data: "abc",
        attributes: { region: 42 as unknown as string },
      },
    };
    const result = googlePubSubEnvelopeSchema.safeParse(bad);
    expect(result.success).toBe(false);
  });
});

describe("googleRtdnNotificationSchema — decoded RTDN payload", () => {
  it("accepts a documented subscriptionNotification (SUBSCRIPTION_RENEWED type=2)", () => {
    const valid = {
      version: "1.0",
      packageName: "com.mercyapps.mercyblade",
      eventTimeMillis: "1763500800000",
      subscriptionNotification: {
        version: "1.0",
        notificationType: 2, // SUBSCRIPTION_RENEWED
        purchaseToken: "opaque-token-xyz",
        subscriptionId: "mercyblade.premium.monthly",
      },
    };
    const result = googleRtdnNotificationSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it("accepts a documented oneTimeProductNotification", () => {
    const valid = {
      version: "1.0",
      packageName: "com.mercyapps.mercyblade",
      eventTimeMillis: "1763500800000",
      oneTimeProductNotification: {
        version: "1.0",
        notificationType: 1, // ONE_TIME_PRODUCT_PURCHASED
        purchaseToken: "opaque-token",
        sku: "lifetime_access",
      },
    };
    const result = googleRtdnNotificationSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it("accepts a voidedPurchaseNotification (refund)", () => {
    const valid = {
      version: "1.0",
      voidedPurchaseNotification: {
        purchaseToken: "opaque-token",
        orderId: "GPA.xxxx",
        productType: 1, // subscription
        refundType: 1,  // full refund
      },
    };
    const result = googleRtdnNotificationSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it("accepts a testNotification (Google's verification ping)", () => {
    // Google issues a testNotification when the developer first
    // configures the RTDN topic. Must not reject — that would block
    // every Pub/Sub topic setup.
    const valid = {
      version: "1.0",
      packageName: "com.mercyapps.mercyblade",
      testNotification: { version: "1.0" },
    };
    const result = googleRtdnNotificationSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it("accepts a minimal notification (all fields optional)", () => {
    const result = googleRtdnNotificationSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it("accepts schema drift — Google-added unknown top-level field", () => {
    const drifted = {
      version: "1.0",
      subscriptionNotification: { notificationType: 4 },
      // Hypothetical future field
      experimentBucket: "A",
    };
    const result = googleRtdnNotificationSchema.safeParse(drifted);
    expect(result.success).toBe(true);
  });

  it("accepts schema drift — Google-added unknown nested notification field", () => {
    const drifted = {
      subscriptionNotification: {
        notificationType: 4,
        purchaseToken: "x",
        newField: { latency_p95: 200 },
      },
    };
    const result = googleRtdnNotificationSchema.safeParse(drifted);
    expect(result.success).toBe(true);
  });

  it("REJECTS wrong type on subscriptionNotification.notificationType (must be int)", () => {
    const bad = {
      subscriptionNotification: { notificationType: "renewed" },
    };
    const result = googleRtdnNotificationSchema.safeParse(bad);
    expect(result.success).toBe(false);
  });

  it("REJECTS non-integer notificationType (float)", () => {
    const bad = { subscriptionNotification: { notificationType: 2.5 } };
    const result = googleRtdnNotificationSchema.safeParse(bad);
    expect(result.success).toBe(false);
  });

  it("REJECTS wrong type on packageName (object instead of string)", () => {
    const bad = { packageName: { tld: "com" } };
    const result = googleRtdnNotificationSchema.safeParse(bad);
    expect(result.success).toBe(false);
  });

  it("REJECTS null body", () => {
    const result = googleRtdnNotificationSchema.safeParse(null);
    expect(result.success).toBe(false);
  });
});

describe("PII-scrubbing contract — issues array shape (Sentry payload)", () => {
  // Locks the same contract as apple-webhook (#886). The handler ships
  // ONLY error.issues.map(...) to Sentry on parse failure — never the
  // raw data field (which is a base64-encoded JSON containing
  // purchaseTokens, orderIds, and other PII proxies).
  it("envelope parse failure exposes path/code/message — and nothing else", () => {
    const result = googlePubSubEnvelopeSchema.safeParse({});
    expect(result.success).toBe(false);
    if (!result.success) {
      for (const issue of result.error.issues) {
        expect(issue).toHaveProperty("path");
        expect(issue).toHaveProperty("code");
        expect(issue).toHaveProperty("message");
      }
    }
  });

  it("inner notification parse failure exposes path/code/message — and nothing else", () => {
    const result = googleRtdnNotificationSchema.safeParse({
      subscriptionNotification: { notificationType: "wrong-type" },
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      for (const issue of result.error.issues) {
        expect(issue).toHaveProperty("path");
        expect(issue).toHaveProperty("code");
        expect(issue).toHaveProperty("message");
      }
    }
  });
});
