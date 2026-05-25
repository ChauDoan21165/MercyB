// supabase/functions/_shared/publicApiSchemas.ts
//
// Zod schemas for the public-api edge function's handler payloads
// (A11c). Sibling of _shared/webhookSchemas.ts (A11) and
// _shared/adminSchemas.ts (A11b).
//
// Threat-model note (important):
//   public-api is NOT an open anonymous endpoint. The orchestrator
//   (index.ts) requires a developer API key (Authorization: Bearer
//   <token>, hashed and looked up in developer_api_keys) AND enforces
//   a sliding-window rate limit per key via api_request_logs BEFORE
//   any handler runs. Zod here is the THIRD gate, not the first.
//
//   What zod adds: typed downstream access (no `as` casts), structured
//   Sentry beacons on schema drift, protection against wrong-type
//   fields the existing defensive type-checks silently coerce. What
//   zod does NOT add: rate limiting, auth, CORS — those already exist
//   in the orchestrator.
//
// PII scrubbing — TIGHTER for public-api than for the other A11 tracks:
//   The Sentry payload contract here is `{ path, code }` per zod
//   issue PLUS the top-level key list. We DROP the `message` field
//   that the webhook/admin schemas include, since zod's auto-generated
//   message strings could echo user-supplied content in failure
//   descriptions (e.g. "expected string at .text, received 'malicious-
//   string-from-caller'"). Stripping message preserves the diagnostic
//   value of path+code while making it impossible to leak input
//   values into Sentry's free-text indexes from this surface.

import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

/* ────────────────────────────────────────────────────────────────────
 * l1-detect — POST /api/v1/l1-detect
 *
 * Body: { text: string, l1_code: "vi" }
 *
 * The schema is intentionally PERMISSIVE at the structural level:
 * both fields optional. This matches the existing handler's defensive
 * `typeof body.text === "string" ? ... : ""` coercion — which then
 * returns specific application-layer errors ('missing_field',
 * 'text_too_long', 'unsupported_l1_code') for the documented
 * validation paths.
 *
 * Adding STRICT requirements here (e.g., text: z.string().min(1).max(1000)
 * or l1_code: z.literal("vi")) would convert those specific error
 * codes into a generic zod-failure 400 — a documented contract change.
 * We keep the schema permissive so the existing error codes continue
 * to drive the public response.
 *
 * What this schema DOES catch (that the existing code does not):
 *   - text or l1_code as wrong type (number, object, array)
 *   - null body, array body
 *   - structurally malformed payloads
 *
 * Those failures go to generic 400 (no specific code leaks the schema).
 * ──────────────────────────────────────────────────────────────────── */

export const l1DetectRequestSchema = z.object({
  text: z.string().optional(),
  l1_code: z.string().optional(),
}).passthrough();
export type L1DetectRequest = z.infer<typeof l1DetectRequestSchema>;

// Note: sentence-of-the-day and public-stats have NO request body
// (both are GET endpoints; their handlers do not invoke
// ctx.request.json()). No schema is needed for them; the orchestrator's
// auth + rate-limit gates plus the handler's `method !== 'GET'` check
// are sufficient. Documented here to prevent a future agent from
// adding empty schemas as defensive overengineering.
