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
