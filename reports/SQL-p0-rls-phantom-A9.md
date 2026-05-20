# P0 SQL batch — anon-view RLS revoke + phantom subscription rows (A9)

> Packaged 2026-05-19. Two paste-ready SQL items for hand-apply via the Supabase
> SQL Editor. Both are merged-to-`main` migration FILES / committed report SQL
> whose **apply step** is still pending — this Supabase has no unattended SQL
> path (`project_db_schema_drift_audit`, `project_578_rls_applied`), so the
> files do nothing until Chau runs them. This doc consolidates source
> attribution, blast radius, the verbatim SQL, and a run order.
>
> Sources (verbatim — no SQL rewritten by A9):
> - **Section 1** — `supabase/migrations/20260622000000_revoke_anon_on_internal_views.sql` + `…20260624000000_revoke_anon_residual_views.sql` on `origin/main` (PR #676 + PR #710, renamed by PR #750 to clear timestamp collisions; pending #3 in `reports/PENDING-CHAU-ACTIONS-2026-05-19.md`).
> - **Section 2** — `reports/REMEDIATION-stripe-deletion-events-B21.sql` on branch `b21/failed-deletion-events` (now pushed to `origin`); paired recon `reports/RECON-failed-deletion-events-B21.md` (pending #5).

---

## Run order

1. **Section 1 first** — 🔴 anon-view RLS revoke. Closes a real data-exposure
   path (`postgres`-owned views over RLS-protected base tables, readable by
   the anon key that ships in the browser bundle). Idempotent; safe to re-run.
2. **Section 2 second** — 🟡 phantom-row cleanup. MRR-hygiene only, zero
   paying-customer impact (both rows are founder/test identities). Section 1
   is a security closure with a real blast radius; Section 2 is data-integrity
   hygiene on two specific PKs. Apply the security fix before the cosmetic one
   so an unexpected anomaly in Section 2's run doesn't gate the security work.

Both sections are independent (different tables, different operations). They
can be applied in separate SQL Editor sessions on the same day.

---

## Section 1 — anon-view RLS revoke (🔴 real data exposure)

### What it closes

`postgres`-owned views over RLS-protected base tables in the `public` schema
execute with the *view owner's* privileges (not `security_invoker`), so the
view **bypasses RLS** on its underlying base table. Combined with Supabase's
default `GRANT SELECT … TO anon`, the listed views are readable by anyone
holding the public anon key — which ships in the browser bundle. Source: RLS
audit 2026-05-18 (`project_rls_audit_2026_05_18`).

Base tables themselves have **0 PII anon leaks**; the leak is exclusively via
views. The two files split the closure as:

- **#676 / file `20260622000000`** — billing / admin / analytics views with
  evidence of leak (Group A revokes from anon + authenticated; Group B revokes
  anon only — authenticated path is still wanted by `AdminUsersPage.tsx` and
  `speechHistory.getUserStats()`).
- **#710 / file `20260624000000`** — residual sweep over every remaining
  `public.*` view + a dynamic catch-all (anon only) so prod-ahead drift views
  whose definitions aren't in repo migrations are still covered.

### Hard allowlist — DO NOT revoke (regex-parser false positive)

`weekly_digest_data` is intentional public `/blog` content (RLS policy
`20260517000000`). The catch-all keeps it readable. Reference base tables
(`pronunciation_challenges`, `listening_clips`, `writing_prompts`,
`feature_flags`, `certificate_types`) are also allowlisted for parity.

### Safety

- Idempotent — REVOKE of an absent grant is a no-op; every revoke is
  `to_regclass`-guarded so a missing relation is skipped, not fatal.
- `service_role` is preserved (and explicitly re-granted) so edge functions
  (`admin-billing-metrics`, `delete-account`) and BI keep working.
- Catch-all touches **anon only** — cannot break an authenticated feature.

### SQL (paste both files in order)

**1A. File `20260622000000_revoke_anon_on_internal_views.sql` (PR #676 / #750)**

```sql
-- =============================================================================
-- Revoke anon (and where appropriate, authenticated) SELECT on internal views
-- =============================================================================
do $$
declare
  v text;
  group_a text[] := array[
    'billing_subscription_events_v',
    'billing_active_subscriptions_v',
    'billing_mrr_inputs_v',
    'billing_recent_subscription_changes_v',
    'admin_mrr_snapshot',
    'admin_revenue_risk_snapshot',
    'mercy_feedback_insights',
    'mercy_feedback_prompt_summary',
    'v_analytics_user_cohorts',
    'v_analytics_room_popularity',
    'v_analytics_cohort_retention_daily',
    'v_analytics_daily_active_users',
    'v_analytics_user_funnel'
  ];
begin
  foreach v in array group_a loop
    if to_regclass('public.' || v) is null then
      raise notice 'skip (absent): public.%', v;
      continue;
    end if;
    execute format('revoke select on public.%I from anon', v);
    execute format('revoke select on public.%I from authenticated', v);
    execute format('grant select on public.%I to service_role', v);
    raise notice 'group A locked (service_role only): public.%', v;
  end loop;
end $$;

do $$
declare
  v text;
  group_b text[] := array[
    'admin_users_dashboard_v1',
    'v_user_pronunciation_stats'
  ];
begin
  foreach v in array group_b loop
    if to_regclass('public.' || v) is null then
      raise notice 'skip (absent): public.%', v;
      continue;
    end if;
    execute format('revoke select on public.%I from anon', v);
    execute format('grant select on public.%I to authenticated', v);
    execute format('grant select on public.%I to service_role', v);
    raise notice 'group B locked (authenticated + service_role): public.%', v;
  end loop;
end $$;
```

**1B. File `20260624000000_revoke_anon_residual_views.sql` (PR #710 / #750)**

```sql
-- =============================================================================
-- Revoke anon SELECT on RESIDUAL public views (sweep follow-up to #676)
-- =============================================================================
do $$
declare
  v text;
  group_a text[] := array[
    'daily_feedback_summary',
    'room_health_view',
    'v_analytics_feature_usage_7d',
    'v_analytics_l1_rule_effectiveness',
    'v_analytics_weakness_trends_weekly'
  ];
begin
  foreach v in array group_a loop
    if to_regclass('public.' || v) is null then
      raise notice 'skip (absent): public.%', v;
      continue;
    end if;
    execute format('revoke all on public.%I from anon', v);
    execute format('revoke all on public.%I from authenticated', v);
    execute format('grant select on public.%I to service_role', v);
    raise notice 'group A locked (service_role only): public.%', v;
  end loop;
end $$;

do $$
declare
  v text;
  group_b text[] := array[
    'vip3_public_profiles'
  ];
begin
  foreach v in array group_b loop
    if to_regclass('public.' || v) is null then
      raise notice 'skip (absent): public.%', v;
      continue;
    end if;
    execute format('revoke all on public.%I from anon', v);
    execute format('grant select on public.%I to authenticated', v);
    execute format('grant select on public.%I to service_role', v);
    raise notice 'group B locked (authenticated + service_role): public.%', v;
  end loop;
end $$;

do $$
declare
  r record;
  allow text[] := array[
    'weekly_digest_data',        -- public /blog — NEVER revoke
    'pronunciation_challenges',  -- public reference data
    'listening_clips',           -- public reference data
    'writing_prompts',           -- public reference data
    'feature_flags',             -- public reference data
    'certificate_types'          -- public reference data
  ];
begin
  for r in
    select table_name
    from information_schema.views
    where table_schema = 'public'
  loop
    if r.table_name = any(allow) then
      raise notice 'skip (intentional public): public.%', r.table_name;
      continue;
    end if;
    execute format('revoke all on public.%I from anon', r.table_name);
    raise notice 'catch-all: anon revoked on public.%', r.table_name;
  end loop;
end $$;
```

### Verify (after both files)

```sql
-- Should return 0 rows — no public views grant SELECT to anon
SELECT table_schema, table_name, grantee, privilege_type
FROM   information_schema.role_table_grants
WHERE  table_schema = 'public'
  AND  grantee      = 'anon'
  AND  privilege_type = 'SELECT'
  AND  table_name IN (
    SELECT table_name FROM information_schema.views WHERE table_schema = 'public'
  )
  AND  table_name NOT IN (
    'weekly_digest_data','pronunciation_challenges','listening_clips',
    'writing_prompts','feature_flags','certificate_types'
  );
```

---

## Section 2 — phantom subscription rows (🟡 MRR hygiene, zero paying impact)

### Table + what defines a phantom row

**Table:** `public.subscriptions` (the Stripe mirror table; entitlements live
in `public.user_subscriptions` and are structurally untouched here).

**Phantom row definition (per B21 recon):** a `subscriptions` row where the
upstream `customer.subscription.deleted` webhook delivery FAILED (pre-PR-#561
`[object Object]` serialization defect, fixed but its 2026-05-08/09 victims
are still resident) and no later event reconciled the row. The row still
reads `status='active'`, `canceled_at IS NULL`, and `updated_at` unchanged
since 2026-04-09 — yet the upstream Stripe subscription is cancelled.

Identified victims (B21 read-only forensic, verified 2026-05-19):

| # | `subscriptions.id` (PK) | `provider_subscription_id` | User identity | Independent entitlement |
|---|---|---|---|---|
| U1 | `c3496ebe-e584-4c3c-a92a-1d2a32a69072` | `sub_1TK6no2K1tPxy04urxSq7DAL` | `chaudoanproton@proton.me` (founder/test) | Gift comp in `user_subscriptions` 2030→2031 (different table — untouched by the UPDATE) |
| U2 | `03fb832c-81d8-426f-b73c-e899fc4eeaae` | `sub_1TK7Fj2K1tPxy04uV17yVd7K` | `chaudoan@yahoo.com` (founder/test) | None |

A third event (`evt_1TUxM52K1tPxy04udiaKvPJL`, 2026-05-08T22:58:53Z) is
UNKNOWABLE from any DB/Sentry source — resolve by hand via Stripe Dashboard
→ Developers → Events. **Deliberately excluded** from the SQL below; tracked
as pending #4 (`reports/RUNBOOK-evt-1TUxM5-lookup.md` on
`b28/unknowable-event-lookup`).

### Note on canonical SQL

The PENDING-CHAU index (`reports/PENDING-CHAU-ACTIONS-2026-05-19.md` §5)
records that A94's *canonical* cleanup SQL is **lost (branch empty — verified
this run, only untracked `probe*.mjs` files)**, so the B21 reference snapshot
is treated as the surviving apply candidate. The B21 file's own header
banners it `NON-CANONICAL` out of caution about the lost A94 version; per
the PENDING index decision, paste it as the apply candidate.

### Pre-cleanup count query (run first)

Expected count from B21's 2026-05-19 read: **2 rows, both `status='active'`,
both `updated_at = 2026-04-09 …`** (verbatim from
`reports/RECON-failed-deletion-events-B21.md`). **No new prod query run by A9
— this is B21's measurement carried forward.**

```sql
-- ---- 0. VERIFY BEFORE (expect 2 rows, both status='active') ---------------
SELECT id, user_id, provider, status, provider_subscription_id,
       current_period_end, canceled_at, ended_at, updated_at
FROM   public.subscriptions
WHERE  id IN ('c3496ebe-e584-4c3c-a92a-1d2a32a69072',   -- U1
              '03fb832c-81d8-426f-b73c-e899fc4eeaae');  -- U2
```

### Cleanup SQL

PK-targeted, provider/subscription-id-guarded, idempotent (the
`AND status='active'` clause makes a re-run a no-op once flipped). The
deleted-handler maps to `status='revoked'`
(`stripe-webhook/webhook-events.ts:617`); `canceled_at`/`ended_at` are set to
the Stripe `period_end` (best available proxy — the event payload was never
stored, `stripe_webhook_events` has no payload column).

**Wrap in BEGIN/ROLLBACK first** (B29 convention), read the verify-after
output, then re-run with `COMMIT`:

```sql
BEGIN;

-- ---- 1. U1 — 04c57155 (chaudoanproton@proton.me) -------------------------
--      failed event evt_1TUz732K1tPxy04uz1zfCXKV @ 2026-05-09T00:51:28Z
UPDATE public.subscriptions
SET    status      = 'revoked',
       canceled_at = '2026-05-09T00:50:36+00:00',
       ended_at    = '2026-05-09T00:50:36+00:00',
       updated_at  = now()
WHERE  id                       = 'c3496ebe-e584-4c3c-a92a-1d2a32a69072'
  AND  provider                 = 'stripe'
  AND  provider_subscription_id = 'sub_1TK6no2K1tPxy04urxSq7DAL'
  AND  status                   = 'active';   -- idempotency guard; expect 1 row

-- ---- 2. U2 — 397a6ab7 (chaudoan@yahoo.com) -------------------------------
--      failed event evt_1TUzYp2K1tPxy04uWOBxRjGW @ 2026-05-09T01:20:10Z
UPDATE public.subscriptions
SET    status      = 'revoked',
       canceled_at = '2026-05-09T01:19:27+00:00',
       ended_at    = '2026-05-09T01:19:27+00:00',
       updated_at  = now()
WHERE  id                       = '03fb832c-81d8-426f-b73c-e899fc4eeaae'
  AND  provider                 = 'stripe'
  AND  provider_subscription_id = 'sub_1TK7Fj2K1tPxy04uV17yVd7K'
  AND  status                   = 'active';   -- idempotency guard; expect 1 row

-- ROLLBACK;  -- first run
-- COMMIT;    -- second run, after verify
```

### Post-cleanup verify query

```sql
-- Expect 2 rows, both status='revoked', canceled_at + ended_at populated,
-- updated_at = now-from-the-UPDATE (today, not 2026-04-09)
SELECT id, user_id, status, canceled_at, ended_at, updated_at
FROM   public.subscriptions
WHERE  id IN ('c3496ebe-e584-4c3c-a92a-1d2a32a69072',
              '03fb832c-81d8-426f-b73c-e899fc4eeaae');
```

### Out-of-scope (deliberate)

- `evt_1TUxM52K1tPxy04udiaKvPJL` — UNKNOWABLE; resolve via Stripe Dashboard.
  See pending #4.
- Gift comp in `public.user_subscriptions` for U1 — different table,
  untouched. U1 keeps its 2030→2031 entitlement.

---

## Source branches pushed by A9

- `b21/failed-deletion-events` — pushed to `origin` (carries the B21 recon
  doc + reference SQL + probe scripts).
- `a94/stale-sub-rows-cleanup` — **not pushed**. Branch has no committed
  deliverable on top of `origin/main` (only three untracked probe scripts
  in the working tree); per PENDING #5, A94's canonical SQL is lost and the
  B21 file above is the surviving apply candidate.
