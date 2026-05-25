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
