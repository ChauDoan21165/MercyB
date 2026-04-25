# A6 — Trial-expiry email funnel runbook

**Step 9 (Monetization).** A 3-stage email funnel for users approaching
or just past the end of their free trial. Pairs with the
`profiles.trial_extension_days` column (PR #referral_grant) — the
funnel reads the same source of truth, so referral-extended trials get
their D-3 / D-1 / D+1 emails on the *adjusted* dates.

## What ships in this branch

| File | Role |
| --- | --- |
| `supabase/migrations/20260425080800_trial_expiry_funnel.sql` | Adds `campaign_type` column to `email_sends_log`, expands the campaign CHECK constraint to allow `trial_expiry_*` values, adds `(user_id, campaign_type, sent_at DESC)` index. |
| `supabase/functions/trial-expiry-emails/index.ts` | Daily cron entry. Auth (admin >= 9), scan profiles, categorize, queue rows, **no real send**. |
| `supabase/functions/trial-expiry-emails/categorizeForTrialExpiry.ts` | Pure function: row → stage. Vitest-friendly. |
| `supabase/functions/trial-expiry-emails/templates/trial-{d-3,d-1,plus-1}.json` | Bilingual VN+EN copy with Mercy's voice. |
| `supabase/functions/trial-expiry-emails/__tests__/categorizeForTrialExpiry.test.ts` | 22 tests covering every stage boundary + premium/no-email gates + extension days. |

## How to invoke

### One-shot (admin terminal)

```bash
# Local Supabase CLI dev:
supabase functions invoke trial-expiry-emails \
  --header "Authorization: Bearer $ADMIN_JWT"

# Production (Supabase project URL):
curl -X POST \
  -H "Authorization: Bearer $ADMIN_JWT" \
  https://<project-ref>.supabase.co/functions/v1/trial-expiry-emails
```

`$ADMIN_JWT` must be a session JWT for an admin with level >= 9. The
function returns:

```json
{
  "ok": true,
  "scanned": 92,
  "buckets": { "d_minus_3": 4, "d_minus_1": 2, "d_plus_1": 1 },
  "queued": 6,
  "already_queued": 1,
  "skipped": 85,
  "sent": 0,
  "note": "Skeleton mode: rows written to email_sends_log as 'pending' ..."
}
```

### Scheduled (recommended once we trust it)

Two paths — pick **one**, not both:

1. **`pg_cron` inside the Supabase project** (cleanest):

   ```sql
   SELECT cron.schedule(
     'trial-expiry-emails-daily',
     '0 9 * * *',  -- 09:00 UTC = 16:00 ICT (Asia/Ho_Chi_Minh)
     $$
       SELECT net.http_post(
         url := 'https://<project-ref>.supabase.co/functions/v1/trial-expiry-emails',
         headers := jsonb_build_object(
           'Content-Type', 'application/json',
           'Authorization', 'Bearer ' || current_setting('app.cron_admin_jwt')
         )
       );
     $$
   );
   ```

   The `app.cron_admin_jwt` GUC must be set to a long-lived admin JWT
   in the project's Postgres config. Rotate quarterly.

2. **External scheduler** (cron-job.org, GitHub Actions, etc.) hitting
   the same endpoint with a stored admin JWT. Easier to debug; one
   more moving part to monitor.

Daily at **09:00 UTC** is a good first guess — that's late afternoon in
Vietnam. Inbox engagement is highest on the same-day after lunch.

## Email vendor wiring (deferred)

This branch writes `pending` rows to `email_sends_log` and **does not
call any vendor SDK**. The sender pass that flips `pending → sent`
(or `failed`) is intentionally separate — same separation the
existing email-reengagement skeleton uses. Two production candidates:

- **Resend** — already in the codebase footprint per
  `docs/email-system.md`; verified sending domain `mercyblade.com`
  with `hello@mercyblade.com` as the canonical from-address. Lowest
  integration cost.
- **Postmark** — better deliverability tier but requires a fresh
  domain verification + DKIM rotation.

When wiring the sender, the loop is:

```ts
const { data: pending } = await admin
  .from("email_sends_log")
  .select("*")
  .eq("status", "pending")
  .eq("campaign_type", "trial_expiry")
  .limit(50);

for (const row of pending) {
  const tpl = TEMPLATES[row.campaign];
  const result = await resend.emails.send({
    from: "Mercy <hello@mercyblade.com>",
    to: row.email,
    subject: tpl.subject_vi,           // VN-first; EN below the fold
    html: render(tpl, { first_name: ... }),
  });
  await admin
    .from("email_sends_log")
    .update({ status: result.error ? "failed" : "sent", sent_at: now })
    .eq("id", row.id);
}
```

Keep the sender as its **own** edge function (`trial-expiry-send` or
similar) so this categorization function can run idempotently every
day even when the sender is paused for a deliverability check.

## Privacy

- Templates contain a single PII token: `{{first_name}}` (rendered
  from `profiles.preferred_name`, which the user provided themselves).
  No email, phone, full_name, or address is templated.
- The `email_sends_log` row only records `user_id`, `email`,
  `campaign`, `campaign_type`, `status`, and timestamps — same
  surface as the existing reengagement log.
- RLS on `email_sends_log` denies all client access; only the
  service-role key (edge functions, SQL Editor) can read / write.
- Premium users are filtered out **inside the categorizer**, not at
  the queue layer — so a premium user can't accidentally enter the
  funnel even if their classification flips during a run.

## Tone guardrails (Chau's voice)

The templates were written under five hard rules — keep them when
editing:

1. **No streak shaming.** Don't reference "your streak" or "what you
   lost". Streaks are a separate retention surface and the trial
   funnel must not weaponize them.
2. **No paywall-rage.** Phrases like "Don't lose access!" or "Last
   chance!" are out. The D-1 template explicitly says *"any time
   works — no rush."*
3. **No fake scarcity / no countdown timers.** The 24-hour mention
   in D-1 is a fact, not a ticking clock graphic.
4. **No guilt language.** D+1 says *"life's busy, that wasn't the
   week"* — not *"you abandoned us"*.
5. **Always Vietnamese-first.** Subject + body lead with VN; EN
   follows below the fold for diaspora readers.

If a future template tweak feels pushy, it probably is. Ask Chau.

## Why D-3 / D-1 / D+1 (and not other dates)

- **D-3** is the *anticipation* beat. Far enough out that users still
  feel they have time to come back; close enough that they remember
  the trial exists.
- **D-1** is the *honest reminder* beat. We're not pretending the
  trial isn't ending; we're telling them in plain language and
  pointing at the upgrade link if they want it.
- **D+1** is the *open door* beat. Sent **once per user, ever** (the
  unique-pending index in `email_sends_log` enforces it). After this
  email, the funnel is silent — anything else is the sender's
  general-purpose reengagement track, not this funnel.

Removing any of the three flattens the curve. Adding more (D-7,
D-2, D+3, D+7) creates fatigue and pushes opt-outs up — Mercy isn't a
SaaS marketing machine, and the founder voice is the moat.

## Verification

- `npx vitest run supabase/functions/trial-expiry-emails/__tests__/categorizeForTrialExpiry.test.ts`
  — 22 / 22 pass.
- `npm run typecheck` — clean.
- Real send test deferred until vendor pass.

## Future / not in this branch

- Sender edge function (Resend wiring + retries + bounce handling).
- A dashboard view of `email_sends_log` filtered by `campaign_type =
  'trial_expiry'` for the admin team (read-only).
- A/B harness — run two D-3 subject lines side by side once the cohort
  is big enough (~500 users / month). Currently the cohort is too
  small (~100) for meaningful significance.
- Suppression list integration — once unsubscribe lands (tracked
  separately in CLAUDE.md "Email system"), the categorizer should
  filter unsubscribed users *before* `email_sends_log` insert.
