// supabase/functions/stripe-webhook/__tests__/eventTypes.test.ts
//
// Keeps the webhook's supported-event gate explicit. Unsupported Stripe
// events are intentionally acknowledged after signature verification so
// Stripe does not keep retrying events MercyBlade does not process.

import { describe, expect, it } from "vitest";
import { isSupportedStripeWebhookEventType } from "../event-types";

describe("isSupportedStripeWebhookEventType", () => {
  it("accepts billing events the webhook processes", () => {
    expect(isSupportedStripeWebhookEventType("checkout.session.completed")).toBe(true);
    expect(isSupportedStripeWebhookEventType("customer.subscription.updated")).toBe(true);
    expect(isSupportedStripeWebhookEventType("invoice.paid")).toBe(true);
    expect(isSupportedStripeWebhookEventType("invoice.payment_failed")).toBe(true);
  });

  it("rejects valid Stripe events that should be acknowledged but ignored", () => {
    expect(isSupportedStripeWebhookEventType("charge.succeeded")).toBe(false);
    expect(isSupportedStripeWebhookEventType("payment_intent.succeeded")).toBe(false);
  });
});
