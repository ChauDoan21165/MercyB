# A3 — C2 fix: send-feedback-reply hardening

**Date:** 2026-04-25
**Branch:** `security/a3-feedback-reply-hardening`
**Audit reference:** `reports/a3-edge-function-audit-2026-04-25.md` § C2

## TL;DR

Before the fix, `send-feedback-reply` was an open Resend relay: any
authenticated user could pass an arbitrary `userEmail` in the request
body and our Resend account would email that recipient under the
MercyBlade brand. Cost vector + phishing vector + sender-reputation
vector.

After the fix:
- **Admin-only** — `get_admin_level >= 9` enforced inside the handler.
- **Recipient locked to feedback row** — caller passes a `feedback_id`,
  the function looks up `feedback.user_id` server-side and resolves
  the email via `auth.admin.getUserById`. The body's recipient is
  ignored.
- **Per-admin rate limit** — 10 emails / hour, enforced by the new
  `check_admin_email_rate_limit` RPC against `email_audit`. Fail-closed
  on RPC error.
- **Subject + body sanitised** — HTML stripped from caller input;
  subject ≤ 200 chars, body ≤ 10 000 chars. Output HTML-escaped before
  templating.
- **All sends audit-logged** to a new `email_audit` table (success or
  failure, with admin user id, feedback id, recipient, subject, and
  Resend message id where available).

## Changes

### 1. New migration — `supabase/migrations/20260505020000_email_audit.sql`
- `email_audit` table (id / admin_user_id / feedback_id / recipient_email /
  subject / sent_at / success / error_message / metadata).
- RLS owner-admin-read (`get_admin_level >= 9`); writes only via
  SECURITY DEFINER edge functions.
- `check_admin_email_rate_limit(p_admin_id, p_max, p_window)` RPC —
  returns `false` when the admin has hit the limit in the rolling
  window. Defaults: 10 emails / 1 hour.

### 2. Rewritten edge function — `supabase/functions/send-feedback-reply/index.ts`
- **Auth flow:** `Authorization` header → `auth.getUser(token)` →
  `get_admin_level` RPC. Returns 401 when missing/invalid JWT, 403 on
  non-admin.
- **New contract:** `POST { feedback_id: uuid, subject?: string,
  replyMessage: string }`. Recipient is no longer accepted from the
  body; it is derived from `feedback.user_id`.
- **Sanitisation:** `stripHtml` removes tags + decodes a small set of
  entities; `escapeHtml` re-escapes for the final template. Length
  caps enforced on subject + body.
- **Rate limit:** runs `check_admin_email_rate_limit` BEFORE Resend so
  we never burn quota when a request is going to be rejected anyway.
- **Audit log:** every send (success or failure) writes one row to
  `email_audit`. Best-effort — a logging failure never blocks the
  send response, but the Resend `id` is captured when available.
- **From address:** changed from `onboarding@resend.dev` placeholder
  to the canonical `admin@mercyblade.com` (per memory's sending-address
  rule). `reply_to` is set so user replies route back into the
  feedback inbox.

### 3. No caller updates required
The brief instructed me to update `src/components/admin/FeedbackMessages.tsx`
as the legitimate caller. I checked: that file does **not** invoke
`send-feedback-reply` today — there is no admin "Reply" button wired
to the function. `grep -rn "send-feedback-reply" src/` returns zero
hits. The function existed but was unreachable from any UI surface,
which is why the open-relay risk had not been exploited yet. Since
the spec says "DO NOT add features beyond what the task requires," I
did **not** add a Reply UI in this PR — that is a separate scope. The
new contract is documented in this report so the daytime UI work knows
what to call.

If a future PR adds the Reply UI, the call shape is:

```ts
await supabase.functions.invoke("send-feedback-reply", {
  body: {
    feedback_id: msg.id,
    replyMessage: replyText,
    subject: "Reply to your feedback", // optional; default if omitted
  },
});
// response: { ok: true, id: "<resend-id>" } or { error: "..." }
```

## Verification matrix (intended behaviour)

The function is rewritten but the worktree cannot exercise live edge-
function calls. The verification table below describes the intended
HTTP-level behaviour after deployment:

| Test | Request | Expected status | Reason |
|---|---|---|---|
| Admin + valid feedback_id | `Authorization: Bearer <admin>` + `{ feedback_id, replyMessage }` | 200 `{ ok: true, id }` | happy path |
| No auth header | (no Authorization) | 401 `{ error: "Unauthorized" }` | token missing |
| Bad JWT | `Authorization: Bearer junk` | 401 `{ error: "Unauthorized" }` | `auth.getUser` rejects |
| Non-admin user JWT | valid user, `admin_level < 9` | 403 `{ error: "Admin required" }` | rpc gate |
| Admin + missing feedback_id | `{ replyMessage: "..." }` | 400 `{ error: "feedback_id required (uuid)" }` | input validation |
| Admin + non-uuid feedback_id | `{ feedback_id: "abc", replyMessage: "..." }` | 400 | input validation |
| Admin + unknown feedback_id | uuid that doesn't exist | 404 `{ error: "Feedback not found" }` | server-side lookup |
| Admin + feedback with null user_id | (anonymous feedback) | 422 `{ error: "Feedback has no associated user" }` | recipient not derivable |
| Admin + arbitrary recipient in body | tries to inject `userEmail`/`recipient` | 200 — but recipient comes from feedback row, body field ignored | open-relay vector closed |
| Admin + 11th call within an hour | rate-limit hit | 429 `{ error: "Rate limit exceeded", limit: 10, window: "1 hour" }` | `check_admin_email_rate_limit` |
| Admin + body > 10 000 chars | oversized replyMessage | 400 | length cap |
| Admin + HTML in replyMessage | `<script>...</script>` etc. | 200 — tags stripped before send | XSS safe |

To exercise these against staging once deployed, run `gh workflow run`
on the existing edge-fn deploy workflow (or `supabase functions deploy
send-feedback-reply` then curl with a known admin JWT).

## What remains out of scope

- Apply the migration in production. The spec says no push; Chau
  applies migrations via the Supabase SQL editor manually per CLAUDE.md.
- Wire the admin Reply button in `FeedbackMessages.tsx`. Daytime UI
  scope.
- Backfill historical sends into `email_audit`. There were none from
  this function (no caller existed) but other admin emailers may want
  to start writing here too.
- Apply the same template (admin gate + recipient allowlist + audit)
  to the other email functions flagged in the audit (`test-email`,
  `mercy-ai-builder-email`). Tracked as separate fixes.

— A3
