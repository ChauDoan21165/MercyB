> ⚠️ **ARCHIVE-CLASS (April 2026)** — historical runbook/recon kept in
> place due to live cross-references outside `reports/`. Do not act on
> this document without verifying current state. See
> `reports/archive/agent-runs-2026-04/README.md` for context.

# A6 — Email re-engagement runbook

**Status:** Skeleton (Step 4 / Retention). No real emails are sent yet.
**Branch:** `feat/a6-email-reengagement`
**Owner:** A6

## What this PR ships

1. New table `public.email_sends_log` — queue + audit trail.
2. New edge function `supabase/functions/email-reengagement/` — identifies inactive users, queues pending rows, **does NOT send**.
3. Three bilingual templates (warm 7d / cool 14d / cold 30d) under `templates/`.
4. Pure categorization logic (`categorizeUsers.ts`) + vitest tests covering bucket boundaries, timezone, null/malformed timestamps, future-clock skew.

## What this PR deliberately does NOT do

- No email vendor SDK is added (no Resend, no Postmark, no Sendgrid).
- No actual `resend.emails.send(...)` call is made.
- No cron / scheduled invocation is wired.
- No admin UI surface.

These are deferred so the production decisions (vendor, schedule, authoring UX) get a daytime review instead of being baked in by the skeleton.

## Open decisions before enabling production sends

### 1. Vendor — Resend vs Postmark

| Criterion          | Resend                                               | Postmark                                       |
| ------------------ | ---------------------------------------------------- | ---------------------------------------------- |
| Already in use     | Yes (`email-broadcast`, `send-redeem-email`, etc.)   | No                                             |
| DX                 | Simple `from` / `to` / `html` API                    | Strong template/tagging story                  |
| Deliverability     | Good for transactional + light marketing             | Industry-leading for transactional             |
| Bulk-send patterns | Per-recipient loop (current pattern in this repo)    | Batch endpoint                                 |
| Cost at ~100 users | Free tier sufficient                                 | Free tier sufficient                           |

**Recommendation:** stay on Resend for consistency with existing functions. Revisit if deliverability complaints appear.

### 2. Trigger — cron vs admin-button vs both

The edge function is invokable today via `GET /functions/v1/email-reengagement` with an admin JWT. To make it auto-run:

- **Option A:** Supabase scheduled function (`pg_cron` → `net.http_post(...)`). Daily at 09:00 ICT.
- **Option B:** Admin presses a button in the dashboard (manual control during the cohort's first 100-user phase).
- **Option C:** Both — cron for production, admin button as override.

**Recommendation:** start with B (admin button) for the first 30 days, then migrate to C once the queue depth + opt-out behavior is observed.

### 3. Unsubscribe — BLOCKER for any actual send

Per `CLAUDE.md` § Email system:

> **Unsubscribe system is still being built** — no `email_unsubscribes` table yet, no unsubscribe edge function yet, no footer in campaign templates yet. Do not send marketing emails until this is in place.

Re-engagement emails are marketing, not transactional. **Real sending must wait until** the unsubscribe system lands. The cold (30d) template includes a "reply 'stop'" stopgap; that is a courtesy, not a substitute.

### 4. Sender address

Use `admin@mercyblade.com` (per project memory `project_sending_address.md`). Reply-to should also be `admin@mercyblade.com`. Resend sender configuration: `Mercy Blade <admin@mercyblade.com>`.

Note: `email-broadcast/index.ts` currently uses `Mercy Blade <onboarding@resend.dev>` — that's a Resend test address. Migrating to `admin@mercyblade.com` is a separate cleanup; do not block this PR on it.

## How to enable real sending (production wiring sketch)

When the unsubscribe system + vendor decision are settled, the diff is roughly:

```ts
// 1. Add Resend import
import { Resend } from "https://esm.sh/resend@2.0.0";

// 2. Replace the queueing loop with an actual send
const resend = new Resend(Deno.env.get("RESEND_API_KEY")!);
const template = TEMPLATES[campaign];
const { data, error } = await resend.emails.send({
  from: "Mercy Blade <admin@mercyblade.com>",
  to: [user.email],
  reply_to: "admin@mercyblade.com",
  subject: template.subject_vi,
  text: template.body_vi + UNSUBSCRIBE_FOOTER, // <-- needs the unsubscribe table first
});

// 3. Update the row to 'sent' or 'failed' instead of leaving it 'pending'
```

The `email_sends_log` schema already has the columns this needs (`sent_at`, `status`, `error_message`).

## Test plan (skeleton)

- [x] `npm test` — `categorizeUsers.test.ts` passes (boundary cases, timezone, null, future timestamps).
- [x] `npm run typecheck` — clean.
- [x] `npm run lint` — clean.
- [ ] Apply migration locally (`supabase db reset` or SQL Editor): `email_sends_log` exists with expected columns + indexes.
- [ ] Invoke `email-reengagement` with an admin JWT: returns `{ok: true, scanned, buckets, queued, sent: 0}`.
- [ ] Invoke twice in a row: second call's `already_queued` matches the first call's `queued` (idempotency check via the unique partial index).

## Test plan (production, when unblocked)

- [ ] Send to a single test address first (loop over a one-element array).
- [ ] Confirm Resend logs the send and the `email_sends_log` row flipped to `status='sent'`.
- [ ] Confirm the unsubscribe footer renders and the link works.
- [ ] Send to 5 internal addresses; check spam-folder placement on Gmail / iCloud / Outlook.
- [ ] Send to 10 real users; monitor `email_events` (or equivalent) for bounces over 24h.
- [ ] Full cohort send only after the above.

## Compliance notes

- **CAN-SPAM (US):** physical address + clear unsubscribe required. Add to footer when unsubscribe system ships.
- **GDPR (EU):** lawful basis for re-engagement of existing users is generally legitimate interest, but unsubscribe must be one-click. Same blocker as above.
- **Vietnam:** no specific marketing-email statute that materially differs from the above; Vietnamese language already covered in templates.
- **Frequency cap:** the unique partial index on `(user_id, campaign) WHERE status='pending'` prevents re-queueing the same campaign while one is pending. It does NOT cap total emails per user across campaigns — once we go live, add a "max 1 re-engagement email per user per 14 days" check before insert.

## Reversibility

If we need to roll this back:

```sql
DROP TABLE IF EXISTS public.email_sends_log;
```

Edge function: `supabase functions delete email-reengagement` (or just don't deploy it). The skeleton is self-contained — nothing else in the app references `email_sends_log` yet.
