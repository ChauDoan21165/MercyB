# B13 Phase 3 PR-B — post-merge recompute runbook

> One-time read-only quantification + targeted `UPDATE` to bring
> `profiles.premium_*` projection rows into line with the new
> expiry-aware derivation. Chau-run via Supabase SQL Editor — no
> unattended SQL path to this project (B48 D6).
>
> Status: parked. Do **not** run until PR-B has been deployed AND the
> real-device verify checklist (PR description §8) is clean.

---

## 0. Why this exists

PR-B fixes the read-side bug where an entitling status (`active`,
`trialing`, `grace_period`, `past_due`) granted premium even when the
row's expiry was already in the past. After deploy, the four edge
functions stop granting that premium, but the **persisted projection**
`profiles.premium_*` keeps lying for users who haven't triggered a
fresh webhook recompute. R2 (`get-subscription-status`) reads that
projection; this script is what fixes the rows in place.

Once entitlements-table (A17/A5/A6 — out of scope for PR-B) lands and
recompute becomes the single writer, this UPDATE becomes unnecessary
because every read flows through derive. For PR-B, run it once.

---

## 1. Read-only quantification — run first

These two queries answer **how many users will see a state change**.
Run both, capture the counts, attach them to the PR comment thread
before running step 2.

```sql
-- A. Projection-reader surface (R2, R4). Users whose persisted
--    profiles.premium_* row currently says they're premium but whose
--    expiry has already passed. These flip to non-premium the moment
--    PR-B's recompute step (§2) runs.
select count(*) as projection_rows_to_flip
  from public.profiles
 where premium_status in ('active', 'trialing', 'grace_period', 'past_due')
   and premium_expires_at is not null
   and premium_expires_at <= now();

-- B. Derive-reader surface (R1, R3). Subscription rows whose
--    canonical status is entitling but whose current_period_end is
--    already in the past. Users with one of these rows would have
--    been incorrectly granted premium by R1/R3 pre-PR-B.
select count(*) as subscription_rows_already_expired
  from public.subscriptions
 where app_id = 'mercy_blade'
   and status in ('active', 'trialing', 'grace_period', 'past_due')
   and current_period_end is not null
   and current_period_end <= now();
```

Optional drill-down (no UPDATE):

```sql
-- Which user_ids will flip? Useful if Chau wants to spot-check a few
-- before running the UPDATE.
select id, premium_status, premium_expires_at, premium_source
  from public.profiles
 where premium_status in ('active', 'trialing', 'grace_period', 'past_due')
   and premium_expires_at is not null
   and premium_expires_at <= now()
 order by premium_expires_at desc
 limit 25;
```

---

## 2. One-time UPDATE — run only after §1 counts reviewed

This `UPDATE` is the recompute. It flips `profiles.premium_status` for
exactly the rows query A counts. **Idempotent** — running it twice has
the same effect as running it once.

```sql
-- Recompute the projection for rows whose persisted premium_status
-- is entitling but whose expiry has already passed. The status is
-- moved from {active,trialing,grace_period,past_due} → 'expired'.
--
-- Why 'expired' (not 'inactive'):
--   - 'expired' matches what `normalizeStatus` in
--     supabase/functions/_shared/entitlement.ts emits for an
--     expired-but-canceled or default-with-past-expiry row. Keeping
--     the recompute consistent with the runtime derive avoids two
--     different "you're not premium anymore" status strings.
--   - 'inactive' is the no-row default. Reusing it for known-expired
--     subs would lose history.
--
-- premium_expires_at + premium_source are left intact — they carry
-- useful history for support inquiries and don't drive any gate.
update public.profiles
   set premium_status = 'expired',
       updated_at = now()
 where premium_status in ('active', 'trialing', 'grace_period', 'past_due')
   and premium_expires_at is not null
   and premium_expires_at <= now();
```

Capture the affected-row count from the editor; cross-check it
against query A from §1 (should match).

---

## 3. Verification — run last

After the UPDATE, this query should return **0** every time it's run
afterwards (the bug class is closed):

```sql
select count(*) as stragglers
  from public.profiles
 where premium_status in ('active', 'trialing', 'grace_period', 'past_due')
   and premium_expires_at is not null
   and premium_expires_at <= now();
```

Cross-check against the production app: pick three user IDs from the
drill-down in §1, hit `/account` (or whatever screen reads
`me-entitlement`), confirm they show non-premium.

---

## 4. What this script does NOT do

- **No `subscriptions` table writes.** Query B counts existing
  expired-but-entitling subscription rows; those flip naturally on
  the next webhook (or via A6/A18's recompute redesign, when that
  lands). PR-B does not fold gift entitlements, does not retire T2,
  does not delete dead browser stack.
- **No grace fudge / skew tolerance.** Per A12 §6, the locked
  decision is that expired users should lose premium (correctness;
  they are not paying). If a real paying user reports they lost
  premium incorrectly, investigate the row's `current_period_end`
  for the B5/#770 field-order-legacy bug — that is a data fix, not a
  PR-B rollback.
- **No A17/A5/A6 entitlements-table writes.** PR-B ships zero
  migrations. The entitlements-table redesign is the next batch
  (gated on D1 confirmation, A17 migration applied to prod).
