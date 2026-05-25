// supabase/functions/_shared/webhookSchemas.ts
//
// Zod schemas for vendor webhook payloads. Added per A11 to give every
// `*-webhook` edge function a structured runtime validation layer on top
// of its existing cryptographic signature verification.
//
// Each schema reflects the documented vendor payload shape, NOT a
// best-guess inference from sample traffic. Where the vendor's contract
// permits additional/future fields, schemas use `.passthrough()` so
// vendor schema-drift does not start rejecting real notifications.
//
// IMPORTANT — what these schemas DO and DO NOT defend against:
//   ✅ Malformed JSON at the outer envelope (returns 400 + Sentry beacon)
//   ✅ Wrong type on a required field (returns 400 + Sentry beacon)
//   ✅ Missing required field (returns 400 + Sentry beacon)
//   ✅ Eliminating downstream `any` after parse — TS narrows correctly
//   ❌ Tampered payloads (that is the signature-verification layer's job)
//   ❌ Replay attacks (that is the idempotency layer's job)
//
// PII scrubbing rule: when reporting parse failures to Sentry, callers
// MUST NOT send the raw payload. Only zod's `error.issues` (field names
// + parse errors) and the top-level key list are safe. Vendor payloads
// regularly contain user emails, transaction tokens, and entitlement
// IDs that we do not want indexed in Sentry events.

import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

/* ────────────────────────────────────────────────────────────────────
 * Apple — App Store Server Notifications V2
 *
 * Reference: https://developer.apple.com/documentation/appstoreservernotifications/
 *
 * Apple wraps every notification in a single JWS string at body.signedPayload.
 * The JWS is verified by verifyAppleJws() and decodes to the inner V2
 * notification, whose minimum-stable fields are documented below.
 * `.passthrough()` allows Apple to add new top-level fields (subtypes,
 * version markers) without breaking us.
 * ──────────────────────────────────────────────────────────────────── */

export const appleWebhookEnvelopeSchema = z.object({
  signedPayload: z.string().min(1),
}).passthrough();
export type AppleWebhookEnvelope = z.infer<typeof appleWebhookEnvelopeSchema>;

export const appleNotificationV2Schema = z.object({
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
export type AppleNotificationV2 = z.infer<typeof appleNotificationV2Schema>;

/* ────────────────────────────────────────────────────────────────────
 * Google — Real-time Developer Notifications (RTDN) via Cloud Pub/Sub
 *
 * Reference: https://developer.android.com/google/play/billing/rtdn-reference
 *            https://cloud.google.com/pubsub/docs/push#receive_push
 *
 * Two layers:
 *   1. Pub/Sub push envelope — `{ message: { data: base64-json, ... }, subscription }`
 *   2. The decoded `message.data` JSON — one of subscriptionNotification /
 *      voidedPurchaseNotification / oneTimeProductNotification /
 *      testNotification per Google's RTDN spec.
 *
 * Both layers are `.passthrough()` for vendor schema drift; the inner
 * notification's four event-shape fields are all optional because a
 * single message contains exactly one of them, and the validation
 * layer must not reject the other three "absent" fields.
 * ──────────────────────────────────────────────────────────────────── */

export const googlePubSubEnvelopeSchema = z.object({
  message: z.object({
    // data is a base64-encoded JSON string. May be absent on Google's
    // bootstrap "test publish" (rare). messageId is the de-dup key.
    data: z.string().optional(),
    messageId: z.string().optional(),
    message_id: z.string().optional(), // historic Pub/Sub snake_case field
    publishTime: z.string().optional(),
    publish_time: z.string().optional(),
    attributes: z.record(z.string()).optional(),
  }).passthrough(),
  subscription: z.string().optional(),
}).passthrough();
export type GooglePubSubEnvelope = z.infer<typeof googlePubSubEnvelopeSchema>;

export const googleRtdnNotificationSchema = z.object({
  // Common fields on every RTDN notification.
  version: z.string().optional(),
  packageName: z.string().optional(),
  eventTimeMillis: z.string().optional(),
  // Exactly ONE of the next four is set per Google's spec. We mark all
  // four optional and `.passthrough()` so the handler can branch on
  // which is present without us pre-rejecting valid notifications.
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
export type GoogleRtdnNotification = z.infer<typeof googleRtdnNotificationSchema>;

/* ────────────────────────────────────────────────────────────────────
 * Stripe — Webhook Event (https://stripe.com/docs/api/events/object)
 *
 * Stripe sends events in dozens of shapes (one per event.type). Rather
 * than building a `discriminatedUnion` across the full event-type
 * enum — which would lock us into Stripe's current type list and
 * force a schema update for every new event type — we validate the
 * Event ENVELOPE (id/type/created/livemode/data.object) and leave
 * data.object as an untyped passthrough. The downstream event-type
 * dispatcher (`handleCheckoutSessionCompleted`, etc.) already
 * narrows by type-string and reads only the fields it expects.
 *
 * Cryptographic HMAC verification is done by `verifyStripeSignature
 * OrThrow` upstream; this schema adds shape-level defense AFTER
 * signature has passed.
 * ──────────────────────────────────────────────────────────────────── */

export const stripeWebhookEventSchema = z.object({
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
    // `object` is the changed Stripe resource (Subscription, Invoice,
    // CheckoutSession, etc.) — shape varies wildly by event.type and
    // is narrowed downstream. We require it to be an object so the
    // handler's `event.data.object` access is safe.
    object: z.record(z.unknown()),
    previous_attributes: z.record(z.unknown()).optional(),
  }).passthrough(),
}).passthrough();
export type StripeWebhookEventParsed = z.infer<typeof stripeWebhookEventSchema>;

/* ────────────────────────────────────────────────────────────────────
 * RevenueCat — Webhook v2 event
 *
 * Reference: https://www.revenuecat.com/docs/integrations/webhooks/event-flows-and-objects
 *
 * RevenueCat wraps every event in `{ event: {...}, api_version: string }`.
 * The inner event always has a `type` string (INITIAL_PURCHASE,
 * RENEWAL, CANCELLATION, etc.). All other fields vary by event type;
 * the existing handler reads them defensively. The schema mirrors that
 * defensive shape — `type` required, everything else optional +
 * `.passthrough()` so RevenueCat-added fields do not reject real events.
 * ──────────────────────────────────────────────────────────────────── */

export const revenuecatWebhookEnvelopeSchema = z.object({
  api_version: z.string().optional(),
  event: z.object({
    // The handler hard-requires a string `type` (line 162 of pre-A11
    // index.ts). Schema-level requirement matches the runtime guard.
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
export type RevenuecatWebhookEnvelope = z.infer<typeof revenuecatWebhookEnvelopeSchema>;
