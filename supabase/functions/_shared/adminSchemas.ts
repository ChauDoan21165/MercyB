// supabase/functions/_shared/adminSchemas.ts
//
// Zod schemas for admin edge function payloads. Added per A11b to give
// every admin-* edge function a structured runtime validation layer on
// top of its existing auth + admin-role gates.
//
// Sibling of _shared/webhookSchemas.ts (A11) — admin payloads come from
// the trusted admin app, not external vendors, so the failure mode here
// is "the admin app sent a malformed request" (operator bug) rather
// than "external vendor changed shape" (vendor schema drift). Both
// surfaces use the same .passthrough() + outer-strict / inner-
// observability discipline.
//
// IMPORTANT — what these schemas DO and DO NOT defend against:
//   ✅ Malformed JSON at the request body (returns 400 + Sentry beacon)
//   ✅ Missing required field / wrong type (returns 400 + Sentry beacon)
//   ✅ Out-of-bounds values (days > 365, tier_name > 50 chars, …)
//   ✅ Eliminating downstream `any` after parse — TS narrows correctly
//   ❌ Authentication (the auth.getUser() + user_roles/admin_users
//       lookup at the top of each handler — UNTOUCHED by A11b)
//   ❌ Authorization (admin-level check — UNTOUCHED by A11b)
//   ❌ Rate limiting (the rateLimit() call where present — UNTOUCHED)
//
// PII scrubbing rule (mirrored from webhookSchemas.ts): when reporting
// parse failures to Sentry, callers MUST NOT send the raw request body.
// Only zod's `error.issues` (field names + parse errors) and the top-
// level key list are safe. Admin payloads carry target user UUIDs,
// tier names, and admin actions — all of which we want to keep out of
// Sentry's free-text indexes.

import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

/* ────────────────────────────────────────────────────────────────────
 * admin-set-tier — assign a subscription tier to a user
 *
 * Risk class: money-path adjacent. Modifies user_subscriptions and
 * fires log_security_event / log_admin_access / auditLog. Bad input
 * here means "wrong user gets premium" or "tier set for 9999 days."
 *
 * Bounds chosen to mirror the (orphan) `setTierSchema` already in
 * `supabase/functions/shared/validation.ts:51-55`:
 *   - tier_name max 50 chars (DB column is varchar; sane upper bound)
 *   - days max 365 (a year — anything longer indicates a caller bug
 *     or a manual decision that should NOT route through this RPC)
 * ──────────────────────────────────────────────────────────────────── */

export const adminSetTierRequestSchema = z.object({
  user_id: z.string().uuid(),
  tier_name: z.string().trim().min(1).max(50),
  days: z.number().int().positive().max(365),
}).passthrough();
export type AdminSetTierRequest = z.infer<typeof adminSetTierRequestSchema>;
