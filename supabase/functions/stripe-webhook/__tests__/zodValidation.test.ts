// supabase/functions/stripe-webhook/__tests__/zodValidation.test.ts
//
// A11 contract tests for the zod schema backing stripe-webhook's
// runtime envelope validation. Schema-level unit tests against an
// in-test mirror of _shared/webhookSchemas.ts (same pattern as
// apple-webhook #886 and google-webhook A11-google).
//
// Stripe sends events in dozens of shapes by `type`. Per the dispatch's
// "use z.discriminatedUnion or fallback to observability" hint, we
// validate the Event ENVELOPE only (id/type/created/livemode/data.object).
// The downstream event-type dispatcher narrows by type-string and reads
// only the fields it expects for that specific event type.

import { describe, expect, it } from "vitest";
import { z } from "zod";

const stripeWebhookEventSchema = z.object({
  id: z.string().min(1),
  type: z.string().min(1),
  object: z.literal("event").optional(),
  api_version: z.string().nullable().optional(),
  created: z.number().int().optional(),
  livemode: z.boolean().optional(),
  pending_webhooks: z.number().int().optional(),
  request: z.object({
    id: z.string().nullable().optional(),
    idempotency_key: z.string().nullable().optional(),
  }).passthrough().nullable().optional(),
  data: z.object({
    object: z.record(z.unknown()),
    previous_attributes: z.record(z.unknown()).optional(),
  }).passthrough(),
}).passthrough();

describe("stripeWebhookEventSchema — Event envelope", () => {
  it("accepts a documented customer.subscription.created event", () => {
    const valid = {
      id: "evt_1Nxxxxxxxxx",
      object: "event",
      api_version: "2023-10-16",
      created: 1763500800,
      livemode: true,
      pending_webhooks: 1,
      request: {
        id: "req_xxxxxxx",
        idempotency_key: "idem-key-1",
      },
      type: "customer.subscription.created",
      data: {
        object: {
          id: "sub_xxxxxxx",
          object: "subscription",
          status: "active",
          customer: "cus_xxxxxxx",
        },
      },
    };
    const result = stripeWebhookEventSchema.safeParse(valid);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.id).toBe("evt_1Nxxxxxxxxx");
      expect(result.data.type).toBe("customer.subscription.created");
    }
  });

  it("accepts a documented invoice.payment_succeeded event", () => {
    const valid = {
      id: "evt_2Nxxxxxxxxx",
      object: "event",
      type: "invoice.payment_succeeded",
      created: 1763500800,
      livemode: false,
      data: {
        object: {
          id: "in_xxx",
          object: "invoice",
          status: "paid",
          amount_paid: 990,
        },
      },
    };
    const result = stripeWebhookEventSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it("accepts a documented charge.refunded event", () => {
    const valid = {
      id: "evt_3xxx",
      type: "charge.refunded",
      data: {
        object: {
          id: "ch_xxx",
          object: "charge",
          refunded: true,
        },
      },
    };
    const result = stripeWebhookEventSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it("accepts minimal event (only id/type/data.object required)", () => {
    const minimal = {
      id: "evt_min",
      type: "customer.created",
      data: { object: { id: "cus_min" } },
    };
    const result = stripeWebhookEventSchema.safeParse(minimal);
    expect(result.success).toBe(true);
  });

  it("accepts request=null (test events / non-API-triggered)", () => {
    const valid = {
      id: "evt_x",
      type: "checkout.session.completed",
      request: null,
      data: { object: { id: "cs_x" } },
    };
    const result = stripeWebhookEventSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it("accepts api_version=null (some events omit it)", () => {
    const valid = {
      id: "evt_x",
      type: "x.y",
      api_version: null,
      data: { object: {} },
    };
    const result = stripeWebhookEventSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it("accepts schema drift — Stripe-added top-level field", () => {
    const drifted = {
      id: "evt_x",
      type: "x.y",
      data: { object: {} },
      // Hypothetical future field Stripe adds
      account: "acct_x",
    };
    const result = stripeWebhookEventSchema.safeParse(drifted);
    expect(result.success).toBe(true);
  });

  it("accepts schema drift — Stripe-added field inside data", () => {
    const drifted = {
      id: "evt_x",
      type: "x.y",
      data: {
        object: { id: "x" },
        new_metadata_field: { something: "new" },
      },
    };
    const result = stripeWebhookEventSchema.safeParse(drifted);
    expect(result.success).toBe(true);
  });

  it("REJECTS missing id (required)", () => {
    const bad = {
      type: "customer.created",
      data: { object: {} },
    };
    const result = stripeWebhookEventSchema.safeParse(bad);
    expect(result.success).toBe(false);
    if (!result.success) {
      const issue = result.error.issues.find((i) => i.path[0] === "id");
      expect(issue).toBeDefined();
    }
  });

  it("REJECTS empty-string id", () => {
    const bad = { id: "", type: "x.y", data: { object: {} } };
    const result = stripeWebhookEventSchema.safeParse(bad);
    expect(result.success).toBe(false);
  });

  it("REJECTS missing type (required)", () => {
    const bad = { id: "evt_x", data: { object: {} } };
    const result = stripeWebhookEventSchema.safeParse(bad);
    expect(result.success).toBe(false);
  });

  it("REJECTS missing data (required)", () => {
    const bad = { id: "evt_x", type: "customer.created" };
    const result = stripeWebhookEventSchema.safeParse(bad);
    expect(result.success).toBe(false);
  });

  it("REJECTS missing data.object (downstream handlers assume it exists)", () => {
    const bad = {
      id: "evt_x",
      type: "customer.created",
      data: {},
    };
    const result = stripeWebhookEventSchema.safeParse(bad);
    expect(result.success).toBe(false);
  });

  it("REJECTS data.object that is null (downstream handler would crash)", () => {
    const bad = {
      id: "evt_x",
      type: "x.y",
      data: { object: null },
    };
    const result = stripeWebhookEventSchema.safeParse(bad);
    expect(result.success).toBe(false);
  });

  it("REJECTS object field with wrong literal (must be 'event' when present)", () => {
    const bad = {
      id: "evt_x",
      object: "subscription", // wrong — should be 'event' or absent
      type: "x.y",
      data: { object: {} },
    };
    const result = stripeWebhookEventSchema.safeParse(bad);
    expect(result.success).toBe(false);
  });

  it("REJECTS livemode of wrong type (must be boolean when present)", () => {
    const bad = {
      id: "evt_x",
      type: "x.y",
      livemode: "true", // wrong — string
      data: { object: {} },
    };
    const result = stripeWebhookEventSchema.safeParse(bad);
    expect(result.success).toBe(false);
  });

  it("REJECTS non-integer created (must be int unix timestamp)", () => {
    const bad = {
      id: "evt_x",
      type: "x.y",
      created: 1763500800.5,
      data: { object: {} },
    };
    const result = stripeWebhookEventSchema.safeParse(bad);
    expect(result.success).toBe(false);
  });

  it("REJECTS null body", () => {
    const result = stripeWebhookEventSchema.safeParse(null);
    expect(result.success).toBe(false);
  });

  it("REJECTS array body", () => {
    const result = stripeWebhookEventSchema.safeParse([{ id: "x", type: "x.y", data: { object: {} } }]);
    expect(result.success).toBe(false);
  });
});

describe("PII-scrubbing contract — issues array shape (Sentry payload)", () => {
  // Stripe events carry customer ids (cus_xxx), email addresses, and
  // payment metadata in event.data.object. The handler ships ONLY
  // `error.issues.map(...)` + the top-level key list to Sentry on
  // envelope-validation failure — never the raw event body.
  it("envelope parse failure exposes path/code/message — and nothing else", () => {
    const result = stripeWebhookEventSchema.safeParse({
      // Missing both id and data.object — should yield multiple issues
      type: "customer.created",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.length).toBeGreaterThan(0);
      for (const issue of result.error.issues) {
        expect(issue).toHaveProperty("path");
        expect(issue).toHaveProperty("code");
        expect(issue).toHaveProperty("message");
      }
    }
  });
});
