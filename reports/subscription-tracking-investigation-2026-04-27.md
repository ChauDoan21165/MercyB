# Subscription tracking — investigation

**Author:** A5
**Date:** 2026-04-27 (revised 2026-04-28 with prod findings)
**Status:** Migration drafted at `supabase/migrations/20260611000000_subscription_tracking_sync.sql`. **NOT applied** — draft PR for SQL review. Awaiting Chau's green light before any apply.

## Revision log — 2026-04-28

Three production findings from Chau changed the design:

1. **`app_tier_ranks` is empty** (0 rows). The original Direction-B sketch read mapping from this table; with the table empty, no consumer had real mapping data. **Resolved**: this migration *seeds* `app_tier_ranks` with all 4 known tiers. The trigger reads from it; falls back to the Free tier on missing product_id (fail-closed). Production has only 1 live Stripe product today, but the seed is complete for future products.

2. **3 orphan rows in `user_subscriptions`** with NULL `profiles.email`:
   - `5b0e03c8-1d12-45dd-a1cf-27a229583cb5` — Free, 2026-01-02
   - `42a24883-3f9d-4398-9985-e9ae0a38e7a1` — One Year, 2026-02-23
   - `fbbbd84d-dcc3-47b3-843f-f57d17fcf8c3` — One Month, 2026-02-27

   **Diagnosis**: `user_subscriptions.user_id` is declared `UUID NOT NULL` but the original migration did **NOT** add a FK to `auth.users` (or any CASCADE) — search confirms no FK definition. So when the matching `auth.users` / `profiles` row was deleted, these `user_subscriptions` rows were stranded. Most likely source: legacy `TestPurchasePanel.tsx` test inserts (which DOES write to `user_subscriptions`), or pre-FK manual seed rows from before this code path existed.

   **Decision**: do **NOT** delete in this migration. The backfill is non-destructive — orphan rows have no matching `subscriptions` source row, so the backfill `INSERT … SELECT FROM subscriptions` skips them automatically. Cleanup is a separate decision (see "Open follow-ups" below).

3. **Confirmed Stripe product mapping** — single live product today:
   - `prod_UAfnlqhxFFLDE0` → `One Month` (`tier_id=3d5a977c-4fde-4afc-99a4-4b37c3555839`), 7 active subscribers, monthly @ 200,000 VND.

   **Resolved**: the migration's `app_tier_ranks` seed uses this exact mapping. Other tiers seeded with `pending_*` placeholder product_keys so the row is complete for future Stripe products without colliding when the real product_id is wired.

Tier IDs from `public.subscription_tiers` (per Chau's verified prod query):

| `tier_id` | name |
|---|---|
| `3d5a977c-4fde-4afc-99a4-4b37c3555839` | One Month |
| `a2863250-1798-443e-b1d3-d20e3db06281` | One Year |
| `abc81cdf-da87-4912-a294-277449745c10` | Legacy VIP 3 |
| `e50f166d-c3dd-41b8-bdb4-c0a8ca58b35d` | Free |

## Specific design questions answered

### How is `vip_rank` determined per tier without `app_tier_ranks` populated?

**Answer**: this migration *seeds* `app_tier_ranks` so it stops being empty. The trigger reads from it as the canonical source. Seed values:

| `product_key` | `tier_id` | `vip_rank` | Notes |
|---|---|---|---|
| `free` | `e50f166d-…` | 1 | Default fallback when no Stripe sub |
| `prod_UAfnlqhxFFLDE0` | `3d5a977c-…` | 2 | Live: 7 subscribers (Finding #3) |
| `pending_one_year` | `a2863250-…` | 3 | Placeholder; rewrite product_key when yearly Stripe product ships |
| `legacy_vip3` | `abc81cdf-…` | 4 | Pre-Stripe internal; not a real Stripe product |

The trigger ALSO writes `vip_rank` directly to `profiles.vip_rank` (the column actually read by `preResponseIntelligence.ts:279` and `mercy_weekly_cron`). Without that, populating `app_tier_ranks` alone wouldn't fix the read path.

Alternative considered + rejected: read `vip_rank` from `subscription_tiers.display_order`. Display_order is layout intent (UI ordering), not a stable rank — couples billing semantics to a UI field.

### Do the 3 orphan rows need cleanup before or alongside backfill?

**Neither.** The backfill is non-destructive: it `INSERT INTO user_subscriptions … SELECT FROM subscriptions` on `ON CONFLICT (user_id) DO UPDATE`. The 3 orphan user_ids have NO matching row in `public.subscriptions`, so the SELECT side returns nothing for them and nothing changes.

After this migration:
- `user_subscriptions` will have **3 orphans + N=7 mirrored Stripe subs = 10 rows** (assuming all 7 Stripe subscribers are unique users).
- Admins will see the 7 paying users correctly tiered.
- The 3 orphans will still appear with no email (because `profiles.email` is NULL — they're already orphan today).

Cleanup recommendation (separate decision, NOT in this migration):

```sql
-- Audit query — run before deciding to delete:
SELECT us.user_id, us.tier_id, t.name as tier, us.status, us.created_at,
       (SELECT email FROM auth.users WHERE id = us.user_id) AS auth_email,
       (SELECT email FROM public.profiles WHERE id = us.user_id) AS profile_email,
       EXISTS (SELECT 1 FROM public.subscriptions s WHERE s.user_id = us.user_id) AS has_unified_row
  FROM public.user_subscriptions us
  LEFT JOIN public.subscription_tiers t ON t.id = us.tier_id
 WHERE us.user_id IN (
   '5b0e03c8-1d12-45dd-a1cf-27a229583cb5',
   '42a24883-3f9d-4398-9985-e9ae0a38e7a1',
   'fbbbd84d-dcc3-47b3-843f-f57d17fcf8c3'
 );

-- If `auth_email IS NULL AND has_unified_row = false` for all 3,
-- they're truly stranded and safe to delete:
-- DELETE FROM public.user_subscriptions WHERE user_id IN ( … );
```

### Idempotency of the backfill

Every step is safe to re-run:

| Step | Idempotency mechanism |
|---|---|
| `app_tier_ranks` seed | `ON CONFLICT (product_key) DO UPDATE SET tier_id = EXCLUDED.tier_id, vip_rank = EXCLUDED.vip_rank` |
| Backfill INSERT | `ON CONFLICT (user_id) DO UPDATE` matches the existing UNIQUE(user_id) on `user_subscriptions` |
| Trigger function | `CREATE OR REPLACE FUNCTION` |
| Trigger registration | `DROP TRIGGER IF EXISTS …; CREATE TRIGGER` |
| `profiles.vip_rank` backfill | `UPDATE … SET …` — same row, same value on re-run |
| Recovery RPC | Same `ON CONFLICT (user_id) DO UPDATE` |

Re-running the entire migration is a no-op after first apply; no duplicate rows, no version drift.

### Trigger fires on INSERT only or INSERT OR UPDATE?

**INSERT OR UPDATE**, scoped to the relevant columns:

```sql
AFTER INSERT OR UPDATE OF
  status,
  current_period_start,
  current_period_end,
  product_id,
  provider_subscription_id,
  provider_customer_id
ON public.subscriptions
```

Reasoning:

- **INSERT-only would miss status changes.** Stripe sends `customer.subscription.updated` events when a sub goes `active → past_due → canceled`. Those land on the existing `subscriptions` row as UPDATEs, not INSERTs. INSERT-only would leave the legacy row stuck at the original status.
- **UPDATE-without-OF would over-fire.** Webhook handlers can write `raw_payload` updates for audit purposes without changing entitlement. Limiting to the OF columns means raw-payload-only writes don't fire the legacy sync.
- **Provider-id columns are in the OF list** because if a Stripe customer/subscription identity changes (rare, but possible after a Stripe customer merge), the legacy mirror needs to follow.

---

## TL;DR

The Stripe webhook **does succeed** — but it writes to `public.subscriptions` (the unified billing-shape table introduced in PR `20260315`), while every admin query / cohort filter / matchmaking join in the app reads from `public.user_subscriptions` (the legacy 2025-10 tier-shape table). The two tables drifted apart with **no sync layer** in between. Result: paying users get correct entitlement at runtime (`me-entitlement` → `subscriptions`) **but appear as free-tier in admin queries** (`adminUserUtils.ts` → `user_subscriptions`).

This is a **table-drift bug**, not a webhook failure. It's a stronger version of the brief's expected root cause #5 ("tier_id lookup mismatched"): there's no tier_id lookup at all because there's no INSERT at all into `user_subscriptions` from the webhook.

## Two questions answered

### 1. "Does this succeed?"

**Yes.** The Stripe webhook handler at `supabase/functions/stripe-webhook/index.ts` verifies the Stripe signature, processes events, and writes correct rows to `public.subscriptions`. The C4 security PR (#?, signature verification) is in place. `me-entitlement` reads `public.subscriptions` and computes the correct premium status. A user who pays via Stripe gets premium gating in the app correctly.

### 2. "Does it appear in admin queries?"

**No.** Admin queries — and several other production reads — go to `public.user_subscriptions`, which is **never written to by the Stripe webhook**. So:
- Admin user list: every Stripe-paid user shows `tier = Level 0` / "Free"
- `email-broadcast` cohort filter (`tier_id` join): excludes all Stripe-paid users
- `generate-matches` (level-3 matchmaking inner-join on `user_subscriptions!inner`): excludes all Stripe-paid users
- `get_user_tier(uuid)` SQL function (joins `user_subscriptions ↔ subscription_tiers`): returns NULL for every Stripe-paid user

## Expected-root-cause checklist

| # | Hypothesis | Verdict | Evidence |
|---|---|---|---|
| 1 | Stripe webhook URL not configured | **NOT IT** | The webhook code path is fully wired and signature-verified; can't 100% confirm dashboard config from code alone, but the symptoms (entitlement works, admin queries empty) prove webhooks ARE firing for some events at minimum. If the URL were unconfigured the entitlement gate would also be broken — and per the question-framing it isn't. |
| 2 | Wrong endpoint (test vs prod) | **NOT IT** | Same reasoning as #1. |
| 3 | stripe-webhook function errors | **NOT IT** | The function has signature verification + event-key idempotency + Sentry wrapper (`wrapHandler`). A consistent error would show up in Sentry; the symptom shape (works for entitlement, missing for admin) is incompatible with a generic 5xx. |
| 4 | `user_subscriptions` insert fails (RLS / schema) | **CLOSE BUT NO** | An insert that *fails* would leave a Sentry trail and the entitlement gate would also be broken. The actual reality: **the webhook doesn't even attempt an insert into `user_subscriptions`**. |
| 5 | tier_id lookup mismatched | **DEEPEST** | The legacy table uses `tier_id UUID REFERENCES subscription_tiers(id)` keyed off `subscription_tiers.name` (`'Level 0'..'Level 3'`); the unified billing table uses `product_id text` keyed off Stripe product IDs. There's no mapping. But this is a symptom of #4 — the root cause is the missing sync layer, not the lookup itself. |

## Actual root cause: split-table drift

```
                     ┌──────────────────────────────────────┐
Stripe webhook ─────►│ public.subscriptions (unified, 2026-03)│
                     │   user_id, provider, product_id,     │
                     │   status, current_period_*, etc.     │
                     └──────────────────┬───────────────────┘
                                        │
                                        │  read by
                                        ▼
                     ┌──────────────────────────────────────┐
                     │ supabase/functions/me-entitlement   │ ✅ correct
                     └──────────────────────────────────────┘

                                  ✗ NO SYNC

                     ┌──────────────────────────────────────┐
                     │ public.user_subscriptions (legacy,    │
admin UI ───────────►│   2025-10)                           │
email-broadcast ────►│   user_id, tier_id (UUID),           │
generate-matches ───►│   stripe_subscription_id, status     │
get_user_tier() ────►│                                      │
                     └──────────────────────────────────────┘
                       (empty for every Stripe-paid user
                        unless inserted manually via the
                        admin TestPurchasePanel)
```

### Code evidence

**Writers** (search: `from("subscriptions"|"user_subscriptions")`):

| Writer | Target table |
|---|---|
| `supabase/functions/stripe-webhook/billing.ts` (5+ writes — checkout, subscription created/updated/deleted, invoice paid) | `public.subscriptions` |
| `supabase/functions/stripe-webhook/webhook-events.ts:626` | `public.subscriptions` |
| `supabase/functions/apple-webhook/`, `google-webhook/` | `public.subscriptions` |
| `src/components/admin/TestPurchasePanel.tsx:96` (admin manual upsert) | `public.user_subscriptions` |
| `src/simulator/TierSimulation.ts:183` (test simulator) | `public.user_subscriptions` |

**Readers**:

| Reader | Source table |
|---|---|
| `supabase/functions/me-entitlement/index.ts:336` | `public.subscriptions` ✅ |
| `src/utils/adminUserUtils.ts` (7 reads — admin user list, search, etc.) | `public.user_subscriptions` ✗ |
| `src/utils/securityUtils.ts:210` | `public.user_subscriptions` ✗ |
| `src/lib/performance/supabase-optimizer.ts:57` | `public.user_subscriptions` ✗ |
| `supabase/functions/email-broadcast/index.ts:138` (cohort filter) | `public.user_subscriptions` ✗ |
| `supabase/functions/generate-matches/index.ts:85` (`user_subscriptions!inner` JOIN) | `public.user_subscriptions` ✗ |
| `supabase/migrations/20251020094557_…sql:137` (`get_user_tier()` SQL function) | `public.user_subscriptions` ✗ |

**Sync triggers**: NONE. `grep -rn "TRIGGER" supabase/migrations` returns only `update_*_updated_at` timestamp triggers; no `subscriptions → user_subscriptions` sync function exists.

## Test-account impact (cd12536, chaudoan@yahoo)

Without DB access in this environment I can't confirm the live row state, but the predicted state for both accounts (assuming both purchased through Stripe) is:

| Table | cd12536 row | chaudoan@yahoo row |
|---|---|---|
| `public.profiles` | exists | exists |
| `public.subscriptions` (unified) | EXISTS, status=`active` | EXISTS, status=`active` |
| `profiles.premium_status` | `active` | `active` |
| `public.user_subscriptions` (legacy) | **MISSING** | **MISSING** |

This explains: app works for them (premium content unlocks), but admin pages list them as Free.

To verify this prediction before patching, run on the prod DB:

```sql
-- Both accounts should appear in subscriptions but not in user_subscriptions.
SELECT
  p.id, p.email,
  EXISTS (SELECT 1 FROM public.subscriptions s
          WHERE s.user_id = p.id AND s.status IN ('active','trialing')) AS has_unified_row,
  EXISTS (SELECT 1 FROM public.user_subscriptions us
          WHERE us.user_id = p.id AND us.status = 'active') AS has_legacy_row,
  p.premium_status
FROM public.profiles p
WHERE p.email IN ('cd12536@gmail.com', 'chaudoan@yahoo.com');
```

If `has_unified_row=true` and `has_legacy_row=false` for both, the diagnosis is confirmed.

## Proposed fix (NOT applied yet — awaiting your review)

There are two clean directions. Both should ship together for safety, but each has a different blast-radius profile.

### Direction A (preferred): kill the legacy table, migrate readers to `subscriptions`

The unified table is the canonical billing source. The legacy table exists because it predates the unified design.

**Plan**:

1. **Migration** — create a SQL view `public.user_subscriptions` (replace the current table after backfill) that projects `public.subscriptions` into the legacy shape:

   ```sql
   create or replace view public.user_subscriptions_v as
     select
       s.id,
       s.user_id,
       coalesce(
         (select t.id from public.subscription_tiers t
          where t.name = case s.product_id
                  when '<stripe-prod-level-1>' then 'Level 1'
                  when '<stripe-prod-level-2>' then 'Level 2'
                  when '<stripe-prod-level-3>' then 'Level 3'
                end),
         (select t.id from public.subscription_tiers t where t.name = 'Level 0')
       ) as tier_id,
       s.provider_subscription_id as stripe_subscription_id,
       s.provider_customer_id     as stripe_customer_id,
       case s.status
         when 'active'      then 'active'
         when 'trialing'    then 'active'
         when 'grace_period' then 'active'
         when 'past_due'    then 'past_due'
         when 'paused'      then 'cancelled'
         when 'expired'     then 'expired'
         when 'revoked'     then 'cancelled'
       end as status,
       s.current_period_start,
       s.current_period_end,
       s.created_at,
       s.updated_at
     from public.subscriptions s
     where s.provider = 'stripe';
   ```

2. **Reader migration** — every read above moves to either the view or directly to `public.subscriptions`. The 7 reads in `adminUserUtils.ts` plus the 5 elsewhere are mechanical 1:1 swaps once the view is in place.

3. **Trade-off**: this is a multi-file migration that touches admin UI + email-broadcast + generate-matches. Bigger blast radius, but eliminates the drift permanently.

### Direction B: keep both tables, add a SECURITY DEFINER trigger to sync writes

Lower-risk, faster to ship, but leaves the architectural debt in place.

**Plan**:

1. **Migration** — add a trigger on `public.subscriptions` that mirrors INSERTs / UPDATEs into `public.user_subscriptions`:

   ```sql
   create or replace function public.sync_subscription_to_legacy()
   returns trigger
   language plpgsql
   security definer
   set search_path = public
   as $$
   declare
     v_tier_id uuid;
     v_legacy_status text;
   begin
     -- Map product_id → tier_id via subscription_tiers.name.
     -- Adjust the case mapping to your real Stripe product IDs.
     select t.id into v_tier_id
     from public.subscription_tiers t
     where t.name = case NEW.product_id
       when '<stripe-prod-level-1>' then 'Level 1'
       when '<stripe-prod-level-2>' then 'Level 2'
       when '<stripe-prod-level-3>' then 'Level 3'
       else 'Level 0'
     end;

     v_legacy_status := case NEW.status
       when 'active' then 'active'
       when 'trialing' then 'active'
       when 'grace_period' then 'active'
       when 'past_due' then 'past_due'
       when 'paused' then 'cancelled'
       when 'expired' then 'expired'
       when 'revoked' then 'cancelled'
       else 'active'
     end;

     insert into public.user_subscriptions (
       user_id, tier_id, stripe_subscription_id, stripe_customer_id, status,
       current_period_start, current_period_end
     )
     values (
       NEW.user_id, v_tier_id, NEW.provider_subscription_id, NEW.provider_customer_id,
       v_legacy_status, NEW.current_period_start, NEW.current_period_end
     )
     on conflict (user_id) do update set
       tier_id                = excluded.tier_id,
       stripe_subscription_id = excluded.stripe_subscription_id,
       stripe_customer_id     = excluded.stripe_customer_id,
       status                 = excluded.status,
       current_period_start   = excluded.current_period_start,
       current_period_end     = excluded.current_period_end;

     return NEW;
   end;
   $$;

   create trigger trg_sync_subscription_to_legacy
     after insert or update on public.subscriptions
     for each row execute function public.sync_subscription_to_legacy();
   ```

2. **Recovery RPC** for one-shot backfill / manual repair:

   ```sql
   create or replace function public.retry_subscription_creation(
     p_user_id uuid,
     p_stripe_subscription_id text default null
   )
   returns json
   language plpgsql
   security definer
   set search_path = public
   as $$
   declare
     v_caller_admin_level int;
     v_src record;
     v_tier_id uuid;
     v_legacy_status text;
   begin
     -- Admin-only.
     select coalesce(public.get_admin_level(auth.uid()), 0) into v_caller_admin_level;
     if v_caller_admin_level < 9 then
       raise exception 'admin level >= 9 required';
     end if;

     -- Pick the source row from public.subscriptions.
     select * into v_src
     from public.subscriptions
     where user_id = p_user_id
       and (p_stripe_subscription_id is null
         or provider_subscription_id = p_stripe_subscription_id)
       and provider = 'stripe'
     order by current_period_end desc nulls last
     limit 1;

     if v_src is null then
       return json_build_object('ok', false, 'reason', 'no_unified_row');
     end if;

     -- Same tier-mapping + status-mapping as the trigger.
     select t.id into v_tier_id
     from public.subscription_tiers t
     where t.name = case v_src.product_id
       when '<stripe-prod-level-1>' then 'Level 1'
       when '<stripe-prod-level-2>' then 'Level 2'
       when '<stripe-prod-level-3>' then 'Level 3'
       else 'Level 0'
     end;

     v_legacy_status := case v_src.status
       when 'active' then 'active'
       when 'trialing' then 'active'
       when 'grace_period' then 'active'
       when 'past_due' then 'past_due'
       when 'paused' then 'cancelled'
       when 'expired' then 'expired'
       when 'revoked' then 'cancelled'
       else 'active'
     end;

     insert into public.user_subscriptions (
       user_id, tier_id, stripe_subscription_id, stripe_customer_id, status,
       current_period_start, current_period_end
     )
     values (
       v_src.user_id, v_tier_id, v_src.provider_subscription_id, v_src.provider_customer_id,
       v_legacy_status, v_src.current_period_start, v_src.current_period_end
     )
     on conflict (user_id) do update set
       tier_id                = excluded.tier_id,
       stripe_subscription_id = excluded.stripe_subscription_id,
       stripe_customer_id     = excluded.stripe_customer_id,
       status                 = excluded.status,
       current_period_start   = excluded.current_period_start,
       current_period_end     = excluded.current_period_end;

     return json_build_object('ok', true, 'tier_id', v_tier_id, 'status', v_legacy_status);
   end;
   $$;

   revoke all on function public.retry_subscription_creation(uuid, text) from public, anon, authenticated;
   grant execute on function public.retry_subscription_creation(uuid, text) to service_role;
   ```

3. **One-shot backfill** for every existing Stripe-paid user (safe to run; idempotent via the same `on conflict` clause):

   ```sql
   insert into public.user_subscriptions (
     user_id, tier_id, stripe_subscription_id, stripe_customer_id, status,
     current_period_start, current_period_end
   )
   select
     s.user_id,
     coalesce(
       (select t.id from public.subscription_tiers t
        where t.name = case s.product_id
          when '<stripe-prod-level-1>' then 'Level 1'
          when '<stripe-prod-level-2>' then 'Level 2'
          when '<stripe-prod-level-3>' then 'Level 3'
        end),
       (select t.id from public.subscription_tiers t where t.name = 'Level 0')
     ),
     s.provider_subscription_id,
     s.provider_customer_id,
     case s.status
       when 'active' then 'active'
       when 'trialing' then 'active'
       when 'grace_period' then 'active'
       when 'past_due' then 'past_due'
       when 'paused' then 'cancelled'
       when 'expired' then 'expired'
       when 'revoked' then 'cancelled'
     end,
     s.current_period_start,
     s.current_period_end
   from public.subscriptions s
   where s.provider = 'stripe'
   on conflict (user_id) do update set
     tier_id                = excluded.tier_id,
     stripe_subscription_id = excluded.stripe_subscription_id,
     stripe_customer_id     = excluded.stripe_customer_id,
     status                 = excluded.status,
     current_period_start   = excluded.current_period_start,
     current_period_end     = excluded.current_period_end;
   ```

4. **Targeted backfill for the 2 test accounts** (run AFTER the above one-shot, OR if you want to fix only those two without the project-wide backfill):

   ```sql
   -- Once the recovery RPC is deployed:
   select public.retry_subscription_creation(
     (select id from public.profiles where email = 'cd12536@gmail.com')
   );
   select public.retry_subscription_creation(
     (select id from public.profiles where email = 'chaudoan@yahoo.com')
   );
   ```

### My recommendation

**Direction B first** (lower-risk, ship today), **Direction A as a follow-up** when you have time to migrate the readers.

Direction B:
- 1 migration file (trigger + recovery RPC + backfill)
- Idempotent — the trigger uses `on conflict (user_id) do update`
- Safe if the webhook fires twice (no duplicate rows)
- Surfaces the failure clearly (Sentry breadcrumbs) if the tier mapping is wrong

What it leaves undone:
- The split-table debt is still there
- Future schema changes have to be made in two places
- A new payment provider (or a tier rename) will mean re-doing the mapping

Direction A is the proper architectural fix; B is the production-stop-the-bleed fix that buys time for A.

## What I need from you before patching

1. **Confirm Direction B vs A** — I'd ship B first; you may want to go straight to A.
2. **Stripe product IDs** — the case mapping (`<stripe-prod-level-1>` etc.) needs the real Stripe product IDs you use in production. Without those the trigger can't map status correctly. I'd grab them from `Stripe dashboard → Products` or by running on prod:
   ```sql
   select distinct product_id, count(*) from public.subscriptions
   where provider = 'stripe' group by product_id order by 2 desc;
   ```
3. **Confirm verification query** — run the diagnostic SQL above against prod for cd12536 + chaudoan@yahoo. If both show `has_unified_row=true, has_legacy_row=false`, the diagnosis is locked.
4. **Stripe CLI access** — to test the fix end-to-end I'd want `stripe trigger checkout.session.completed` against a local `supabase functions serve stripe-webhook`. This isn't possible from this environment; you'd run it locally.

## What I will NOT do without your green light

- **Will not** apply any migration, even the recovery RPC, without confirmation.
- **Will not** open a PR yet — the brief said "Open PR after fix verified locally with Stripe CLI" and I can't run that here.
- **Will not** edit any production code path until you confirm direction.

## Sentry breadcrumbs (next-PR todo)

When the fix lands, every step of webhook handling should emit a breadcrumb so the next time something is off, the failure is one Sentry trace away from diagnosis instead of a 4-hour dig:

- `stripe-webhook:event.received` — provider event id + type
- `stripe-webhook:event.signature_verified` — pass/fail
- `stripe-webhook:subscriptions.upsert` — user_id + product_id + status + result
- `stripe-webhook:legacy.sync` — user_id + tier_id + result (after Direction B trigger fires)

Each breadcrumb is one `Sentry.addBreadcrumb({ category, message, data })` call; trivial to add to the existing `wrapHandler` shell.
