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

/* ────────────────────────────────────────────────────────────────────
 * admin-publish-room — flip a room's is_demo flag to false (publish)
 *
 * Risk class: content-visibility surface. Wrong room id here means
 * "the wrong room becomes visible to all users" (or the operation
 * silently no-ops if the id doesn't exist). DB id format is the
 * file-based room slug (e.g. "english_basics_1") or a UUID — we
 * accept either string shape with a max-length sanity bound.
 * ──────────────────────────────────────────────────────────────────── */

export const adminPublishRoomRequestSchema = z.object({
  room_id: z.string().trim().min(1).max(200),
}).passthrough();
export type AdminPublishRoomRequest = z.infer<typeof adminPublishRoomRequestSchema>;

/* ────────────────────────────────────────────────────────────────────
 * admin-hide-room — flip a room's is_demo flag to true (hide from
 * non-admin users). Mirror of admin-publish-room; same input shape,
 * same id-format flexibility.
 * ──────────────────────────────────────────────────────────────────── */

export const adminHideRoomRequestSchema = z.object({
  room_id: z.string().trim().min(1).max(200),
}).passthrough();
export type AdminHideRoomRequest = z.infer<typeof adminHideRoomRequestSchema>;

/* ────────────────────────────────────────────────────────────────────
 * admin-management — discriminated-union over action
 *
 * Five action shapes (existing handler-side surface, all preserved):
 *   list           — no payload fields (default when body / action absent)
 *   my-role        — no payload fields
 *   create         — { email: non-empty string, level?: 1-10 } — creates
 *                    a new admin row. Handler enforces level constraints
 *                    against requestor.level downstream.
 *   update_level   — { admin_id: non-empty string, new_level: 1-10 }
 *   delete         — { admin_id: non-empty string }
 *
 * Constraints chosen to MATCH existing handler defensive checks
 * (`if (!email)`, `if (!admin_id)`, `if (level === undefined)`).
 * Tighter validation (e.g. z.string().uuid() on admin_id or
 * z.string().email() on email) would CHANGE existing valid-payload
 * behavior — the dispatch forbids that. Field-level format checks
 * stay where they live today (downstream).
 *
 * Note for callers: this schema is intentionally permissive on
 * .passthrough() (admin app may send tracking/UI fields). The
 * handler's downstream business logic — including all admin-level
 * privilege gates (requestorAdmin.level >= 9, target.level === 10,
 * etc.) — runs UNCHANGED on a zod-validated body.
 * ──────────────────────────────────────────────────────────────────── */

const adminManagementListSchema = z.object({
  action: z.literal("list"),
}).passthrough();

const adminManagementMyRoleSchema = z.object({
  action: z.literal("my-role"),
}).passthrough();

const adminManagementCreateSchema = z.object({
  action: z.literal("create"),
  email: z.string().trim().min(1),
  level: z.number().int().min(1).max(10).optional(),
}).passthrough();

const adminManagementUpdateLevelSchema = z.object({
  action: z.literal("update_level"),
  admin_id: z.string().min(1),
  new_level: z.number().int().min(1).max(10),
}).passthrough();

const adminManagementDeleteSchema = z.object({
  action: z.literal("delete"),
  admin_id: z.string().min(1),
}).passthrough();

export const adminManagementRequestSchema = z.discriminatedUnion("action", [
  adminManagementListSchema,
  adminManagementMyRoleSchema,
  adminManagementCreateSchema,
  adminManagementUpdateLevelSchema,
  adminManagementDeleteSchema,
]);
export type AdminManagementRequest = z.infer<typeof adminManagementRequestSchema>;
