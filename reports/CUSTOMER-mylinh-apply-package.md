# CUSTOMER — mylinh.nutrition@gmail.com paid-but-free, apply-ready package

> **For Chau, hand-apply in one sitting via the Supabase SQL Editor.**
> Combines the diagnosis (B5/B24 recon), the regenerated remediation SQL
> (A2, supersedes B57), the apply mechanics (A26, placeholders refreshed
> to A2's syntax), and the post-apply verify (A36) into a single
> copy-ready document. Nothing has been executed by any agent. Reads only
> the three locally-tracked source artifacts; no live Stripe / Supabase
> probe was run to compose this file.
>
> **Status:** HANDOFF ONLY. No code change. The DB write is a Chau
> SQL-Editor action (no unattended SQL path to this Supabase).
>
> **Source artifacts** (all on origin, branches pushed by A2):
> - `b5/mylinh-sql-regen` — `reports/RECON-mylinh-paid-but-free-B5.md`
>   + `reports/REMEDIATION-mylinh-paid-but-free-B5.sql` (A2's regen)
> - `a26/mylinh-apply-runbook` — `reports/RUNBOOK-mylinh-apply-A26.md`
>   (mechanics; placeholder names are pre-A2 and replaced below)
> - `a36/mylinh-postapply-verify` — `reports/VERIFY-mylinh-postapply-A36.sql`

---

## Diagnosis (1 paragraph)

A paying user — `mylinh.nutrition@gmail.com`, user_id
`cd9b889c-eb9f-428f-9462-de66d4f92c04`, Stripe customer prefix
`cd9b889c` — paid 200K VND and is denied premium because her
`public.subscriptions.current_period_end` froze at
`2026-05-09T06:16:41+00:00` (the prior monthly boundary), while
Stripe's own freshness payload says the corrected next-period end is
`2026-06-09T06:16:41+00:00` (the exact decode of
`__stripe_freshness.object_time = 1780985801000`, a clean +31-day
monthly renewal). This is one historical instance of the `period_end`
field-order class bug; the **write-path fix already landed in PR #770
(B11)** so new renewals no longer create this state, but #770 cannot
retro-fix the one row that already drifted. The downstream entitlement
reader (`deriveEntitlementFromSubscriptions` / `me-entitlement`) gates
on `current_period_end > now()`, so the stale column denies her even
though Stripe shows the payment as good through June. The repair below
corrects exactly that one column and re-grants `profiles.premium_*` by
mirroring the live writer (`recomputeAndPersistEntitlement`), with a
`GREATEST(corrected, existing)` guard so any longer-running gift
expiry is never shortened. Scope = exactly 1 user, 2 rows, PK-targeted.

---

## Operator pre-flight (1 min — confirm all three before pasting)

1. **Stripe Dashboard** open at `https://dashboard.stripe.com` in live
   mode (no orange "Test mode" banner). Verify the account is correct.
2. **Supabase SQL Editor** open on project `buemdfxyhxunzpgdoqin`.
3. **This file** open in a third tab — you will copy three SQL blocks
   from it into the Editor, in order.

You will need to look up exactly **two values from live Stripe** before
running Block 2:

| Value | Where it comes from | Used in Block 2 |
|---|---|---|
| `‹SUBSCRIPTION_PK›` | DB Block 1 first SELECT (her `subscriptions.id` UUID) | replaces the all-zero sentinel in PART B1 |
| `‹CORRECTED_PERIOD_END›` | Stripe Dashboard → Customers → mylinh.nutrition@gmail.com → active subscription → "Current period end" date | confirms or replaces the pre-filled `'2026-06-09T06:16:41+00:00'` in PART B1 + PART B2 |

The pre-filled `2026-06-09T06:16:41+00:00` is the evidence-derived
**cross-check candidate** (exact decode of Stripe's own epoch
constant). If live Stripe agrees, paste it as-is; if it disagrees by
> ~1 day, **STOP** and re-diagnose — do not silently reconcile.

---

## STOP gates — read before pasting Block 2

Per A2's GATE block + A26 §B-6/B-7:

1. **Stripe subscription Status pill:**
   - `Active` → proceed
   - `Trialing` / `Past due` → STOP at PART D under ROLLBACK (do not
     COMMIT); A2's regen assumes the `'active'` re-grant target, so
     non-Active needs sign-off
   - `Canceled` / `Unpaid` / `Incomplete` / `Paused` → **HARD STOP**.
     Different defect; the period-only fix will not re-grant her.
2. **Block 1 row counts:** her `subscriptions` row count must be
   exactly 1 with `current_period_end = 2026-05-09T06:16:41+00:00`.
   Anything else (0 rows, >1 row, period not stale) → STOP, report.
3. **Block 2 dry-run (ROLLBACK):** PART D in the result panels must
   show `D1`=period corrected, status unchanged · `D2`=premium active
   + expires≥corrected · `D3`=byte-identical to A3 · `D4`=1 row
   matching D2. Anything off → close the tab without committing.
4. **Block 3 verdicts:** every PART V4 row must be PASS (V4 #5 may
   legitimately be INVESTIGATE if a different writer beat us to it,
   provided V4 #7 + V5 `final_is_premium` are still PASS / true).

Aborting at any STOP = close the SQL Editor tab without changing
`ROLLBACK;` to `COMMIT;`. Do **not** edit predicates and re-run.

---

## SQL Block 1 — pre-apply state check (read-only)

Paste into SQL Editor and Run. Read the three result panels. Confirms
state still matches B5's diagnosis and gives you the `subscription_pk`
UUID you need for Block 2.

```sql
-- Block 1 · pre-apply state check · READ-ONLY, no transaction
-- target user: mylinh.nutrition@gmail.com
--              cd9b889c-eb9f-428f-9462-de66d4f92c04

-- 1A. subscriptions row(s) for this user. EXPECT EXACTLY 1 ROW.
--     Read off: `id` (subscription_pk) → paste into Block 2 PART B1.
--               `status`               → STOP gate (must be entitling).
--               `current_period_end`   → must be 2026-05-09T06:16:41+00:00.
--               `app_id`               → must be 'mercy_blade' (else
--                                        me-entitlement won't see her).
SELECT id                       AS subscription_pk,
       user_id,
       app_id,
       provider,
       status                   AS sub_status_live,
       provider_subscription_id,
       current_period_end,                                    -- expect 2026-05-09T06:16:41+00:00
       current_period_end_at,                                 -- drift column; DO NOT write
       updated_at
FROM   public.subscriptions
WHERE  user_id = 'cd9b889c-eb9f-428f-9462-de66d4f92c04';

-- 1B. profiles row. EXPECT 1 ROW currently showing her as NOT premium
--     (premium_status='inactive' OR premium_expires_at in the past).
SELECT id, premium_status, premium_expires_at, premium_source, tier, updated_at
FROM   public.profiles
WHERE  id = 'cd9b889c-eb9f-428f-9462-de66d4f92c04';

-- 1C. user_subscriptions (gift / manual grants) — NEVER written by the
--     repair. Note the values here; Block 2 PART D3 must show them
--     byte-identical post-apply.
SELECT user_id, is_gift_redemption, current_period_end, created_at
FROM   public.user_subscriptions
WHERE  user_id = 'cd9b889c-eb9f-428f-9462-de66d4f92c04';
```

**Before continuing:** confirm 1A returned exactly 1 row with
`current_period_end = 2026-05-09T06:16:41+00:00`, then transcribe the
`subscription_pk` UUID — you'll paste it into Block 2 next.

---

## SQL Block 2 — the repair (BEGIN…ROLLBACK; flip to COMMIT after PART D)

Two placeholders to fill before pasting:

- `‹SUBSCRIPTION_PK›` — replace the all-zero UUID sentinel
  (`00000000-0000-0000-0000-000000000000`) with the `subscription_pk`
  from Block 1 row 1A. The sentinel matches 0 rows by design, so an
  un-edited paste is a safe no-op — never a wrong-row write.
- `‹CORRECTED_PERIOD_END›` — confirm or replace `'2026-06-09T06:16:41+00:00'`
  with live Stripe's "Current period end" for her active subscription.
  This value appears in **three places** below: B1's `SET`, B2's
  `GREATEST(…)`, and B2's `WHERE` clause idempotency guard. **All three
  must use the same value.**

```sql
-- Block 2 · the repair · transactional · WITH ROLLBACK on first pass
--   First run: leave the last word as ROLLBACK; (nothing persists).
--               Read PART D in the result panels. Confirm:
--                 D1 period corrected, status unchanged
--                 D2 premium_status active, premium_expires_at ≥ corrected
--                 D3 user_subscriptions byte-identical to Block 1 row 1C
--                 D4 single row matching D2 (code-derived target)
--   Second run: change ROLLBACK; → COMMIT; (single word). Re-run ONCE.

BEGIN;

-- ---- PART A · PREVIEW (run first; nothing persists under ROLLBACK) ---------

-- A1. The subscriptions row(s) for this user. EXPECT EXACTLY 1 ROW.
--     Read off: `id` → transcribe into PART B1 (GATE 1); `status` → GATE 3
--     go/stop; confirm `current_period_end` = the stale
--     2026-05-09T06:16:41+00:00; note `current_period_end_at` is the
--     IGNORED drift column (GATE 4); `app_id` shown because the live
--     entitlement reader scopes by it (billing.ts recomputeAndPersist
--     filters .eq app_id) — if >1 app_id row appears, STOP & re-dispatch.
SELECT id                       AS subscription_pk,   -- → PART B1 (GATE 1)
       user_id,
       app_id,
       provider,
       status                   AS sub_status_live,   -- → GATE 3 go/stop
       provider_subscription_id,
       current_period_end,                             -- expect 2026-05-09T06:16:41+00:00
       current_period_end_at,                          -- drift column; DO NOT write
       updated_at
FROM   public.subscriptions
WHERE  user_id = 'cd9b889c-eb9f-428f-9462-de66d4f92c04';
-- expect 1 row

-- A2. Current canonical entitlement state (profiles PK = user_id).
--     EXPECT 1 ROW; expect it to currently show the user as NOT premium
--     (premium_status='inactive' OR premium_expires_at in the past) — that
--     is the user-felt symptom this block repairs.
SELECT id, premium_status, premium_expires_at, premium_source, tier, updated_at
FROM   public.profiles
WHERE  id = 'cd9b889c-eb9f-428f-9462-de66d4f92c04';
-- expect 1 row

-- A3. Independent-entitlement pre-state (NEVER written by this block —
--     this is the part-2 guard baseline). If a gift row exists, note its
--     current_period_end; PART B2's GREATEST() will preserve it. If NO
--     row, the GREATEST() still behaves correctly (NULL arg ignored).
SELECT user_id, is_gift_redemption, current_period_end, created_at
FROM   public.user_subscriptions
WHERE  user_id = 'cd9b889c-eb9f-428f-9462-de66d4f92c04';
-- expect: 0 or more rows; whatever is here MUST be byte-identical in D3

-- ---- PART B · THE FIX -----------------------------------------------------

-- B1. Correct ONLY the stale period on the Stripe mirror row.
--     PK-targeted (B29 part 1). The all-zero sentinel below MUST be
--     replaced with the real `id` from PREVIEW A1 (GATE 1) — left as-is it
--     matches 0 rows (safe no-op, not a wrong-row write). Idempotency
--     (B29 part 3): the guard `AND current_period_end = '2026-05-09…'` is
--     the EXACT recoverable stale value, so a second paste (or a run after
--     PR #770 already fixed it) matches 0 rows. status is intentionally
--     NOT in the SET list (see header EXCLUDED + GATE 3).
UPDATE public.subscriptions
SET    current_period_end = '2026-06-09T06:16:41+00:00',  -- ‹CORRECTED_PERIOD_END›
                                                          -- <<< CONFIRM/REPLACE from
                                                          --     LIVE Stripe (GATE 2) >>>
       updated_at         = now()
WHERE  id      = '00000000-0000-0000-0000-000000000000'   -- ‹SUBSCRIPTION_PK›
                                                          -- <<< REPLACE from PREVIEW A1
                                                          --     (GATE 1) >>>
  AND  user_id = 'cd9b889c-eb9f-428f-9462-de66d4f92c04'   -- recoverable, fixed
  AND  current_period_end = '2026-05-09T06:16:41+00:00';  -- idempotency: exact stale
-- expect 1 row

-- B2. Re-grant premium by MIRRORING the live writer
--     (deriveEntitlementFromSubscriptions + recomputeAndPersistEntitlement,
--     core.ts/billing.ts): an entitling sub ⇒ premium_status='active',
--     premium_expires_at = winner.current_period_end, premium_source =
--     provider. premium_expires_at uses GREATEST(corrected, existing) so
--     it can ONLY move FORWARD — this IS the independent-entitlement /
--     gift guard (B29 part 2): a longer existing or gift expiry is never
--     shortened. premium_status/premium_source/premium_expires_at are NOT
--     free guesses — they are the exact code-derived target and satisfy
--     profiles_premium_status_chk ('active'|'inactive') and
--     profiles_premium_source_chk (NULL|'stripe'|'apple'|'google').
--     profiles.updated_at is intentionally NOT set (the canonical webhook
--     writer billing.ts does not set it; avoids depending on a column the
--     live writer never touches). Idempotency (B29 part 3): the WHERE
--     skips the row if it is already at/after target.
--     >>> Run ONLY if GATE 3 passed (live status is entitling). If GATE 3
--         said STOP, do not run B2 — re-dispatch. <<<
UPDATE public.profiles
SET    premium_status     = 'active',                     -- code-derived, not a guess
       premium_source     = 'stripe',                     -- = winner.provider
       premium_expires_at = GREATEST(
                              '2026-06-09T06:16:41+00:00'::timestamptz, -- ‹CORRECTED_PERIOD_END›
                                                          -- <<< same live Stripe value
                                                          --     as B1 (GATE 2) >>>
                              premium_expires_at                        -- never regress
                            )
WHERE  id = 'cd9b889c-eb9f-428f-9462-de66d4f92c04'        -- PK, fully recoverable
  AND  ( premium_status <> 'active'
         OR premium_expires_at IS NULL
         OR premium_expires_at < '2026-06-09T06:16:41+00:00'::timestamptz ); -- ‹CORRECTED_PERIOD_END›
-- expect 1 row (0 on a re-run / if already correct)

-- ---- PART C · OPTIONAL cleanup ---------------------------------------------
-- NONE. Considered and deliberately rejected: scope is exactly the stale
-- period (CLAUDE.md "smallest safe change"). No status flip, no
-- user_subscriptions touch, no class-wide sweep — those belong to
-- B11/B12/#770. This section is kept (empty) so the structure matches B64
-- and the "we did not bolt on extra writes" decision is explicit.

-- ---- PART D · VERIFY-AFTER (read before flipping to COMMIT) ----------------

-- D1. PRIMARY SUCCESS CRITERION — the stale period is corrected.
SELECT id, user_id, status, current_period_end, current_period_end_at, updated_at
FROM   public.subscriptions
WHERE  user_id = 'cd9b889c-eb9f-428f-9462-de66d4f92c04';
-- expect: current_period_end = ‹CORRECTED_PERIOD_END›; status UNCHANGED
--         from A1 (we did not touch it); current_period_end_at UNCHANGED.

-- D2. Entitlement re-granted on the canonical pair.
SELECT id, premium_status, premium_expires_at, premium_source, updated_at
FROM   public.profiles
WHERE  id = 'cd9b889c-eb9f-428f-9462-de66d4f92c04';
-- expect: premium_status='active', premium_source='stripe',
--         premium_expires_at >= ‹CORRECTED_PERIOD_END› (and >= any gift
--         period from A3 — GREATEST guarantees it never regressed).

-- D3. PART-2 GUARD — independent entitlements structurally untouched.
SELECT user_id, is_gift_redemption, current_period_end, created_at
FROM   public.user_subscriptions
WHERE  user_id = 'cd9b889c-eb9f-428f-9462-de66d4f92c04';
-- expect: byte-identical to PREVIEW A3 (this block never writes this table).

-- D4. Code-faithful sanity: re-derive entitlement the way the live reader
--     does (isEntitlingSubscription = status in the 4-set; winner =
--     max current_period_end). After the fix this MUST yield exactly the
--     state D2 shows — proving the manual write matches what the webhook
--     would have produced, not an ad-hoc value.
SELECT 'active'::text                       AS derived_premium_status,
       max(current_period_end)              AS derived_premium_expires_at,
       'stripe'::text                       AS derived_premium_source
FROM   public.subscriptions
WHERE  user_id = 'cd9b889c-eb9f-428f-9462-de66d4f92c04'
  AND  status IN ('active','trialing','grace_period','past_due');
-- expect: 1 row matching D2 (derived_premium_expires_at = the corrected
--         period). If 0 rows → no entitling sub → GATE 3 was mis-passed:
--         ROLLBACK and re-diagnose, do NOT COMMIT.

-- ============================================================================
-- First run with ROLLBACK below. Read PART D. Confirm:
--   D1 = period corrected, status unchanged · D2 = premium active +
--   expires>=corrected · D3 = byte-identical to A3 · D4 = 1 row matching D2.
-- Only THEN change the single word `ROLLBACK;` to `COMMIT;` and re-run ONCE.
ROLLBACK;
```

After the COMMIT pass returns the same `UPDATE 1` / `UPDATE 1` and the
same PART D values, the repair is persisted. Wait ~1 minute (so the
verify's `updated_at > now() - 20 minutes` window is well-populated),
then run Block 3.

---

## SQL Block 3 — A36 post-apply verify (read-only)

Paste into the SQL Editor and Run. PART V4 is the **one-glance
verdict** (every row should read `PASS`). PART V5 is the customer's
literal reality through the `me-entitlement` read-path mirror —
`final_is_premium = true` means /account and the premium gate now
show her as paid.

```sql
-- ============================================================================
--   VERIFY — mylinh.nutrition@gmail.com paid-but-free, POST-APPLY check (A36)
--
--   READ-ONLY. No BEGIN/COMMIT, no UPDATE, no DDL. Safe to run any number of
--   times. This file does NOT apply anything and must NEVER be confused with
--   the remediation. It answers exactly one question, three ways:
--
--       "Did A2's remediation actually land, in full, and did the
--        customer's premium reality change as a result?"
--
--   RUN WHEN:  ~1 minute after Chau changes ROLLBACK→COMMIT and re-runs
--              the remediation once in the Supabase SQL Editor.
--   RUN WHERE: Supabase SQL Editor, project buemdfxyhxunzpgdoqin, live.
--              (Runs as owner/service-role → same RLS-bypassing visibility the
--              me-entitlement edge fn uses via its adminClient, so RLS is NOT a
--              differing variable between this mirror and production.)
--   OPERATOR:  Chau. Paste the whole file, Run, read the panels top→bottom.
--              PART V4 is the one-glance verdict; V1–V3 are the evidence;
--              V5 is the "customer reality" entitlement mirror; V6 is the
--              optional true HTTP end-to-end.
--
--   IDENTITY (fully recoverable, used verbatim):
--     user_id / profiles.id = cd9b889c-eb9f-428f-9462-de66d4f92c04
--     email                 = mylinh.nutrition@gmail.com
--
--   ANCHOR CONSTANTS:
--     STALE  current_period_end (the WRONG value, must be GONE):
--            2026-05-09T06:16:41+00:00
--     TARGET current_period_end (corrected; authoritative value, exact
--            decode of Stripe object_time 1780985801000):
--            2026-06-09T06:16:41+00:00
--     EYEBALL-ERROR value to specifically flag (the ~1-day prose error that
--            appears in recon text — a realistic operator mis-fill):
--            2026-06-08T06:16:41+00:00
--     premium target status : 'active'
--
--   WHAT SUCCESS LOOKS LIKE:
--     1. subscriptions.current_period_end = TARGET (no longer STALE)
--     2. subscriptions.status            = 'active' (premium-bucket status)
--     3. profiles.premium_status         = 'active'
--     4. profiles.premium_expires_at    >= TARGET   (GREATEST guard worked)
--     5. user_subscriptions (gift table) byte-identical — never written
--     6. No collateral row carries TARGET written in the apply window
--     7. me-entitlement read-path mirror → is_premium = true
-- ============================================================================


-- ── PART V0 — clock + apply-window knob ─────────────────────────────────────
SELECT now()                                   AS server_now,
       now() - interval '20 minutes'           AS apply_window_floor,
       '2026-05-09T06:16:41+00:00'::timestamptz AS stale_cpe,
       '2026-06-09T06:16:41+00:00'::timestamptz AS target_cpe,
       '2026-06-08T06:16:41+00:00'::timestamptz AS eyeball_error_cpe;


-- ── PART V1 — subscriptions row landed? ─────────────────────────────────────
SELECT id                                                   AS subscription_pk,
       user_id,
       app_id,                                              -- must be 'mercy_blade'
       provider,
       status,                                              -- expect 'active'
       provider_subscription_id,
       current_period_end,                                  -- expect TARGET
       updated_at,
       now() - updated_at                                   AS age_since_write,
       (current_period_end = '2026-06-09T06:16:41+00:00'::timestamptz)
                                                            AS cpe_is_target,
       (current_period_end = '2026-05-09T06:16:41+00:00'::timestamptz)
                                                            AS cpe_still_stale,
       (current_period_end = '2026-06-08T06:16:41+00:00'::timestamptz)
                                                            AS cpe_is_eyeball_error,
       (updated_at > now() - interval '20 minutes')         AS written_in_window
FROM   public.subscriptions
WHERE  user_id = 'cd9b889c-eb9f-428f-9462-de66d4f92c04';


-- ── PART V2 — profiles row landed (GREATEST guard, gift-safe)? ──────────────
SELECT id,
       premium_status,                                      -- expect 'active'
       premium_expires_at,                                  -- expect >= TARGET
       premium_source,
       tier,
       updated_at,
       now() - updated_at                                   AS age_since_write,
       (premium_status = 'active')                          AS status_is_active,
       (premium_expires_at >= '2026-06-09T06:16:41+00:00'::timestamptz)
                                                            AS expiry_ge_target,
       (updated_at > now() - interval '20 minutes')         AS written_in_window
FROM   public.profiles
WHERE  id = 'cd9b889c-eb9f-428f-9462-de66d4f92c04';


-- ── PART V3 — gift table untouched + no collateral bleed ───────────────────
-- V3a: her independent (gift / manual) entitlement — must be byte-identical
-- to Block 1 row 1C.
SELECT user_id,
       is_gift_redemption,
       status,
       current_period_end,
       created_at,
       updated_at
FROM   public.user_subscriptions
WHERE  user_id = 'cd9b889c-eb9f-428f-9462-de66d4f92c04';

-- V3b: collateral bleed scan — any OTHER row stamped with TARGET inside the
-- apply window. MUST be 0; non-zero = predicate leak across rows.
SELECT 'subscriptions' AS tbl, count(*) AS collateral_rows
FROM   public.subscriptions
WHERE  user_id <> 'cd9b889c-eb9f-428f-9462-de66d4f92c04'
  AND  current_period_end = '2026-06-09T06:16:41+00:00'::timestamptz
  AND  updated_at > now() - interval '20 minutes'
UNION ALL
SELECT 'profiles' AS tbl, count(*) AS collateral_rows
FROM   public.profiles
WHERE  id <> 'cd9b889c-eb9f-428f-9462-de66d4f92c04'
  AND  premium_expires_at = '2026-06-09T06:16:41+00:00'::timestamptz
  AND  updated_at > now() - interval '20 minutes';


-- ── PART V4 — ONE-GLANCE VERDICT (silent partial-apply detector) ───────────
WITH s AS (
  SELECT * FROM public.subscriptions
  WHERE user_id = 'cd9b889c-eb9f-428f-9462-de66d4f92c04'
),
p AS (
  SELECT * FROM public.profiles
  WHERE id = 'cd9b889c-eb9f-428f-9462-de66d4f92c04'
),
g AS (
  SELECT * FROM public.user_subscriptions
  WHERE user_id = 'cd9b889c-eb9f-428f-9462-de66d4f92c04'
    AND is_gift_redemption = true
    AND status = 'active'
    AND current_period_end > now()
),
chk AS (
  SELECT 1 AS ord, 'subscriptions row count' AS check_name,
         CASE WHEN (SELECT count(*) FROM s) = 1 THEN 'PASS' ELSE 'FAIL' END AS verdict,
         (SELECT count(*)::text FROM s) AS observed, '1' AS expected,
         'Row count diverged from B5 diagnosis — stop & report.' AS note
  UNION ALL
  SELECT 2, 'stale period eliminated',
         CASE WHEN NOT EXISTS (SELECT 1 FROM s
                WHERE current_period_end = '2026-05-09T06:16:41+00:00'::timestamptz)
              THEN 'PASS' ELSE 'FAIL' END,
         (SELECT max(current_period_end)::text FROM s),
         'not 2026-05-09T06:16:41+00:00',
         'FAIL ⇒ apply never committed (ROLLBACK left / placeholder unresolved / tab closed). Nothing persisted.'
  UNION ALL
  SELECT 3, 'subscriptions.current_period_end = TARGET',
         CASE WHEN EXISTS (SELECT 1 FROM s
                WHERE current_period_end = '2026-06-09T06:16:41+00:00'::timestamptz)
              THEN 'PASS'
              WHEN EXISTS (SELECT 1 FROM s
                WHERE current_period_end = '2026-06-08T06:16:41+00:00'::timestamptz)
              THEN 'FAIL'
              ELSE 'INVESTIGATE' END,
         (SELECT max(current_period_end)::text FROM s),
         '2026-06-09T06:16:41+00:00',
         'FAIL on 06-08 ⇒ eyeball-error value filled (the ~1-day prose error). INVESTIGATE ⇒ some other value entirely.'
  UNION ALL
  SELECT 4, 'subscriptions.status premium-bucket',
         CASE WHEN lower((SELECT max(status) FROM s))
                   IN ('active','trialing','trial','grace_period','grace',
                       'in_grace_period','past_due','past-due','unpaid')
              THEN 'PASS' ELSE 'FAIL' END,
         (SELECT max(status) FROM s), 'active (expected)',
         'Non-premium status ⇒ me-entitlement will normalize to non-premium; non-Active path was likely required.'
  UNION ALL
  SELECT 5, 'subscriptions written in apply window',
         CASE WHEN (SELECT max(updated_at) FROM s) > now() - interval '20 minutes'
              THEN 'PASS' ELSE 'INVESTIGATE' END,
         (SELECT (now() - max(updated_at))::text FROM s), '< 20 min',
         'INVESTIGATE ⇒ row reached TARGET via a different writer; verify profiles (check 7) independently.'
  UNION ALL
  SELECT 6, 'app_id visible to me-entitlement',
         CASE WHEN (SELECT max(app_id) FROM s) = 'mercy_blade'
              THEN 'PASS' ELSE 'FAIL' END,
         (SELECT max(app_id) FROM s), 'mercy_blade',
         'FAIL ⇒ row is correct in DB but me-entitlement filters app_id=mercy_blade and will NOT see it ⇒ customer STILL free.'
  UNION ALL
  SELECT 7, 'profiles.premium_status active',
         CASE WHEN (SELECT max(premium_status) FROM p) = 'active'
              THEN 'PASS' ELSE 'INVESTIGATE' END,
         (SELECT max(premium_status) FROM p), 'active',
         'INVESTIGATE ⇒ if expiry>=TARGET but status<>active, gift-longer guard skipped the status flip. Profile readers still deny.'
  UNION ALL
  SELECT 8, 'profiles.premium_expires_at >= TARGET',
         CASE WHEN (SELECT max(premium_expires_at) FROM p)
                   >= '2026-06-09T06:16:41+00:00'::timestamptz
              THEN 'PASS' ELSE 'FAIL' END,
         (SELECT max(premium_expires_at)::text FROM p),
         '>= 2026-06-09T06:16:41+00:00',
         'FAIL ⇒ profiles UPDATE did not land / GREATEST did not advance expiry.'
  UNION ALL
  SELECT 9, 'gift table untouched by apply',
         CASE WHEN NOT EXISTS (
                SELECT 1 FROM public.user_subscriptions
                WHERE user_id = 'cd9b889c-eb9f-428f-9462-de66d4f92c04'
                  AND updated_at > now() - interval '20 minutes')
              THEN 'PASS' ELSE 'FAIL' END,
         (SELECT count(*)::text FROM public.user_subscriptions
          WHERE user_id = 'cd9b889c-eb9f-428f-9462-de66d4f92c04'
            AND updated_at > now() - interval '20 minutes'),
         '0 rows updated in window',
         'FAIL ⇒ remediation wrote a table it must never touch (PART 2 invariant breach).'
  UNION ALL
  SELECT 10, 'no collateral bleed',
         CASE WHEN (SELECT count(*) FROM public.subscriptions
                    WHERE user_id <> 'cd9b889c-eb9f-428f-9462-de66d4f92c04'
                      AND current_period_end = '2026-06-09T06:16:41+00:00'::timestamptz
                      AND updated_at > now() - interval '20 minutes') = 0
              THEN 'PASS' ELSE 'FAIL' END,
         (SELECT count(*)::text FROM public.subscriptions
          WHERE user_id <> 'cd9b889c-eb9f-428f-9462-de66d4f92c04'
            AND current_period_end = '2026-06-09T06:16:41+00:00'::timestamptz
            AND updated_at > now() - interval '20 minutes'),
         '0', 'FAIL ⇒ corrected value bled to other users (predicate leak). Blast-radius event.'
)
SELECT ord, check_name, verdict, observed, expected, note
FROM   chk
ORDER  BY ord;


-- ── PART V5 — ENTITLEMENT READ-PATH MIRROR ("did her reality change?") ─────
WITH cand AS (
  SELECT id, status, current_period_end,
         lower(coalesce(status,'')) AS rawst,
         CASE
           WHEN lower(coalesce(status,'')) = 'active' THEN 'active'
           WHEN lower(coalesce(status,'')) IN ('trialing','trial') THEN 'trialing'
           WHEN lower(coalesce(status,'')) IN ('grace_period','grace','in_grace_period') THEN 'grace_period'
           WHEN lower(coalesce(status,'')) IN ('past_due','past-due','unpaid') THEN 'past_due'
           WHEN lower(coalesce(status,'')) IN ('paused','pause','on_hold') THEN 'paused'
           WHEN lower(coalesce(status,'')) IN ('revoked','refunded','refund','chargeback') THEN 'revoked'
           WHEN lower(coalesce(status,'')) = 'expired' THEN 'expired'
           WHEN lower(coalesce(status,'')) IN ('inactive','incomplete','incomplete_expired') THEN 'inactive'
           WHEN lower(coalesce(status,'')) IN ('canceled','cancelled','ended','terminated')
                THEN CASE WHEN current_period_end > now() THEN 'active' ELSE 'expired' END
           ELSE CASE WHEN current_period_end IS NOT NULL AND current_period_end <= now()
                     THEN 'expired' ELSE 'inactive' END
         END AS canonical_status
  FROM   public.subscriptions
  WHERE  user_id = 'cd9b889c-eb9f-428f-9462-de66d4f92c04'
    AND  app_id = 'mercy_blade'
),
ranked AS (
  SELECT *,
         CASE canonical_status
           WHEN 'active' THEN 70 WHEN 'trialing' THEN 60
           WHEN 'grace_period' THEN 50 WHEN 'past_due' THEN 40
           WHEN 'paused' THEN 30 WHEN 'expired' THEN 20
           WHEN 'revoked' THEN 10 ELSE 0 END AS status_rank
  FROM cand
),
best AS (
  SELECT * FROM ranked
  ORDER BY status_rank DESC, current_period_end DESC NULLS LAST, id
  LIMIT 1
),
gift AS (
  SELECT 1 AS hit FROM public.user_subscriptions
  WHERE user_id = 'cd9b889c-eb9f-428f-9462-de66d4f92c04'
    AND is_gift_redemption = true
    AND status = 'active'
    AND current_period_end > now()
  LIMIT 1
)
SELECT
  (SELECT canonical_status FROM best)                       AS me_entitlement_status,
  (SELECT (canonical_status IN ('active','trialing','grace_period','past_due'))
   FROM best)                                               AS is_premium_from_subscriptions,
  EXISTS (SELECT 1 FROM gift)                               AS gift_fallback_premium,
  COALESCE(
    (SELECT canonical_status IN ('active','trialing','grace_period','past_due') FROM best),
    false) OR EXISTS (SELECT 1 FROM gift)                   AS final_is_premium,
  (SELECT current_period_end FROM best)                     AS me_entitlement_expires_at;

-- V5-bis — family-of-4 cross-reader guard.
SELECT id, status, current_period_end,
       (current_period_end > now()) AS period_in_future
FROM   public.subscriptions
WHERE  user_id = 'cd9b889c-eb9f-428f-9462-de66d4f92c04'
  AND  app_id = 'mercy_blade';


-- ── PART V6 — OPTIONAL true HTTP end-to-end (skip unless her token available) ──
-- See VERIFY-mylinh-postapply-A36.sql header on a36/mylinh-postapply-verify for
-- the curl form; not reproduced here as it requires a real USER JWT (support
-- session / impersonation), which is a human admin step out of band.
```

If every PART V4 verdict is `PASS` **and** PART V5 `final_is_premium`
is `true`, the repair landed in full and her premium reality changed.
Otherwise escalate per the per-check note — **never re-apply the
remediation blindly**; the cause must be diagnosed first.

---

## Post-apply confirmation (paste back to chat)

> mylinh SQL applied via Supabase SQL Editor (live, COMMIT).
> Stripe Status = **Active**, Stripe period end = **<date>**.
> Block 2 B1 (UPDATE subscriptions): **UPDATE 1**
> Block 2 B2 (UPDATE profiles): **UPDATE 1**  ← or "UPDATE 0 (already correct)"
> Block 3 PART V4: every verdict **PASS** ← or list any FAIL/INVESTIGATE
> Block 3 PART V5: `final_is_premium = true`, `me_entitlement_status = 'active'`,
> `me_entitlement_expires_at = <value shown>`

If a STOP fires instead: paste which step, the Stripe Status pill, the
Stripe period-end date you saw, any row count / value that was off, and
that you closed the tab without committing.

---

## Source-file drift note (for reviewers)

A26's runbook (`a26/mylinh-apply-runbook`) was written against the
older B57 SQL skeleton (`b57/mylinh-sql-salvage`) before A2 regenerated
the remediation on `b5/mylinh-sql-regen`. A26's *mechanics* (Stripe
lookup, STOP gates, ROLLBACK→COMMIT discipline) are sound and are
lifted into the "Operator pre-flight" + "STOP gates" sections above.
A26's *specific placeholder names* (`:premium_status_target`,
`:gift_period_end`, `:subscription_pk`) are pre-A2 and **do not appear
in A2's regen** — A2 uses inline `‹SUBSCRIPTION_PK›` +
`‹CORRECTED_PERIOD_END›` sentinels and explicitly does NOT write
`subscriptions.status` (resolving A26's "Known ambiguity #1"). Block 2
in this file is A2's SQL verbatim; the operator-facing placeholder
syntax in this doc tracks A2, not A26.
