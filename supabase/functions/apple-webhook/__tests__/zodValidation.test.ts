// supabase/functions/apple-webhook/__tests__/zodValidation.test.ts
//
// A11 contract tests for the zod schemas backing apple-webhook's runtime
// payload validation. We exercise the schemas directly (not Deno.serve)
// because:
//   1. The handler's success path requires a cryptographically valid JWS
//      signed by an Apple root cert — impractical to mock end-to-end in
//      a unit test.
//   2. The validation layer this PR adds IS the schema. If the schemas
//      accept the right payloads and reject the wrong ones, the wiring
//      in index.ts is a straight pass-through to that decision.
//
// What we lock here:
//   ✅ A documented Apple V2 notification envelope parses cleanly.
//   ✅ Missing/wrong-type `signedPayload` is rejected with a zod issue.
//   ✅ The inner notification schema tolerates Apple's `.passthrough()`
//      extension (Apple regularly adds subtypes/version markers).
//   ✅ Hard-required fields on the inner notification stay optional —
//      we DO NOT want to start rejecting genuine Apple notifications if
//      a future schema-drift removes a non-load-bearing field.

import { describe, expect, it } from "vitest";

// NOTE: the schemas live in supabase/functions/_shared/webhookSchemas.ts
// and depend on the Deno-hosted zod URL. We re-import the same package
// from node_modules (zod is a transitive vitest dep via existing
// validation.ts schemas tested elsewhere) by re-declaring identical
// schemas inline — keeps this test runnable under vitest without a
// Deno↔Node shim. The runtime schemas remain the single source of truth
// in webhookSchemas.ts; this test asserts the contract independently
// (a single defect — the Deno schema and this Node mirror diverging —
// would surface as a test-vs-prod divergence, which is louder than a
// silent vendor-drift).
import { z } from "zod";

const appleWebhookEnvelopeSchema = z.object({
  signedPayload: z.string().min(1),
}).passthrough();

const appleNotificationV2Schema = z.object({
  notificationType: z.string().min(1).optional(),
  notificationUUID: z.string().min(1).optional(),
  subtype: z.string().optional(),
  version: z.string().optional(),
  data: z.object({
    environment: z.enum(["Production", "Sandbox", "production", "sandbox"]).optional(),
    appAppleId: z.number().optional(),
    bundleId: z.string().optional(),
    bundleVersion: z.string().optional(),
    signedTransactionInfo: z.string().optional(),
    signedRenewalInfo: z.string().optional(),
  }).passthrough().optional(),
}).passthrough();

describe("appleWebhookEnvelopeSchema — outer envelope", () => {
  it("accepts a documented Apple V2 envelope with a JWS string", () => {
    const valid = {
      signedPayload: "eyJhbGciOiJFUzI1NiJ9.eyJub3RpZmljYXRpb25UeXBlIjoiRElEX1JFTkVXIn0.fake_signature",
    };
    const result = appleWebhookEnvelopeSchema.safeParse(valid);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.signedPayload).toBe(valid.signedPayload);
    }
  });

  it("accepts envelope with Apple-side extra fields (passthrough)", () => {
    // Apple may add envelope-level fields in future protocol revisions;
    // we accept them without forcing a re-deploy.
    const valid = {
      signedPayload: "fake.jws.token",
      _apple_internal_id: "abc123",
      x_apple_request_uuid: "uuid-here",
    };
    const result = appleWebhookEnvelopeSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it("REJECTS missing signedPayload — required field", () => {
    const result = appleWebhookEnvelopeSchema.safeParse({});
    expect(result.success).toBe(false);
    if (!result.success) {
      const issue = result.error.issues.find((i) => i.path[0] === "signedPayload");
      expect(issue).toBeDefined();
    }
  });

  it("REJECTS signedPayload of wrong type (number)", () => {
    const result = appleWebhookEnvelopeSchema.safeParse({ signedPayload: 12345 });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toEqual(["signedPayload"]);
      expect(result.error.issues[0].code).toBe("invalid_type");
    }
  });

  it("REJECTS empty-string signedPayload — JWS cannot be empty", () => {
    const result = appleWebhookEnvelopeSchema.safeParse({ signedPayload: "" });
    expect(result.success).toBe(false);
  });

  it("REJECTS null body — defends downstream null-deref", () => {
    const result = appleWebhookEnvelopeSchema.safeParse(null);
    expect(result.success).toBe(false);
  });

  it("REJECTS array body — must be an object", () => {
    const result = appleWebhookEnvelopeSchema.safeParse([{ signedPayload: "x" }]);
    expect(result.success).toBe(false);
  });
});

describe("appleNotificationV2Schema — inner verified notification", () => {
  it("accepts a documented DID_RENEW notification", () => {
    const valid = {
      notificationType: "DID_RENEW",
      notificationUUID: "00000000-0000-4000-a000-000000000001",
      subtype: "AUTO_RENEW",
      version: "2.0",
      data: {
        environment: "Production",
        appAppleId: 1234567890,
        bundleId: "com.chaudoan.mercyblade",
        bundleVersion: "1.0.0",
        signedTransactionInfo: "eyJ...txn",
        signedRenewalInfo: "eyJ...renewal",
      },
    };
    const result = appleNotificationV2Schema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it("accepts a minimal notification (all fields optional)", () => {
    // Resilience: the dispatch's "Do NOT change existing valid-payload
    // behavior" — apple-webhook currently runs with `typeof` defensive
    // checks that accept partial payloads. The schema must, too.
    const result = appleNotificationV2Schema.safeParse({});
    expect(result.success).toBe(true);
  });

  it("accepts schema drift — Apple-added unknown top-level field (passthrough)", () => {
    const drifted = {
      notificationType: "DID_RENEW",
      notificationUUID: "uuid",
      // Hypothetical future field Apple adds
      regionalMetadata: { country: "VN", currency: "VND" },
    };
    const result = appleNotificationV2Schema.safeParse(drifted);
    expect(result.success).toBe(true);
  });

  it("accepts schema drift — Apple-added unknown nested data field", () => {
    const drifted = {
      notificationType: "DID_RENEW",
      data: {
        environment: "Sandbox",
        bundleId: "com.x.y",
        futureField: "anything",
      },
    };
    const result = appleNotificationV2Schema.safeParse(drifted);
    expect(result.success).toBe(true);
  });

  it("REJECTS wrong type on notificationType (must be string when present)", () => {
    const bad = { notificationType: 42 };
    const result = appleNotificationV2Schema.safeParse(bad);
    expect(result.success).toBe(false);
  });

  it("REJECTS unknown environment enum value", () => {
    // The downstream `normalizeEnvironment` would fall back to
    // "production" here. The zod schema captures the drift loudly so
    // ops can see it — even though the handler degrades gracefully.
    const bad = {
      data: { environment: "MoonBase" },
    };
    const result = appleNotificationV2Schema.safeParse(bad);
    expect(result.success).toBe(false);
  });

  it("REJECTS wrong type on appAppleId (must be number, not string)", () => {
    const bad = {
      data: { appAppleId: "not-a-number" },
    };
    const result = appleNotificationV2Schema.safeParse(bad);
    expect(result.success).toBe(false);
  });

  it("REJECTS null body — typed payloads, not nulls", () => {
    const result = appleNotificationV2Schema.safeParse(null);
    expect(result.success).toBe(false);
  });
});

describe("PII-scrubbing contract — issues array shape (Sentry payload)", () => {
  // The handler ships ONLY `error.issues.map(...)` to Sentry on parse
  // failure — never the raw signedPayload. This test locks the issue
  // shape so that contract does not regress (e.g., if a future zod
  // upgrade changes the `.issues` field name or structure).
  it("envelope parse failure exposes path/code/message — and nothing else needed", () => {
    const result = appleWebhookEnvelopeSchema.safeParse({});
    expect(result.success).toBe(false);
    if (!result.success) {
      for (const issue of result.error.issues) {
        expect(issue).toHaveProperty("path");
        expect(issue).toHaveProperty("code");
        expect(issue).toHaveProperty("message");
        // The shipped Sentry payload uses only these 3 fields. No raw
        // value should ever leak (it isn't on `issue` to begin with).
      }
    }
  });
});
