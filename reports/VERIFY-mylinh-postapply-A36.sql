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
--              reports/REMEDIATION-mylinh-paid-but-free-B5.sql once in the
--              Supabase SQL Editor (per RUNBOOK-mylinh-apply-A26.md step C-ter).
--   RUN WHERE: Supabase SQL Editor, project buemdfxyhxunzpgdoqin, live.
--              (Runs as owner/service-role → same RLS-bypassing visibility the
--              me-entitlement edge fn uses via its adminClient, so RLS is NOT a
--              differing variable between this mirror and production.)
--   OPERATOR:  Chau. Paste the whole file, Run, read the panels top→bottom.
--              PART V4 is the one-glance verdict; V1–V3 are the evidence;
--              V5 is the "customer reality" entitlement mirror; V6 is the
--              optional true HTTP end-to-end.
--
--   INPUT PROVENANCE (read, not modified):
--     - A2/B57 remediation : origin/b57/mylinh-sql-salvage
--                            reports/REMEDIATION-mylinh-paid-but-free-B5.sql
--     - B24/B5 recon       : origin/b57/mylinh-sql-salvage
--                            reports/RECON-mylinh-paid-but-free-B5.md
--     - A26 apply runbook  : origin/a26/mylinh-apply-runbook
--                            reports/RUNBOOK-mylinh-apply-A26.md
--     - read-path logic    : origin/main supabase/functions/me-entitlement/
--                            {index.ts,entitlement.ts}, _shared/billing.ts
--
--   IDENTITY (fully recoverable, used verbatim):
--     user_id / profiles.id = cd9b889c-eb9f-428f-9462-de66d4f92c04
--     email                 = mylinh.nutrition@gmail.com
--
--   ANCHOR CONSTANTS:
--     STALE  current_period_end (the WRONG value, must be GONE):
--            2026-05-09T06:16:41+00:00
--     TARGET current_period_end (corrected; A26 step B-7 authoritative value,
--            exact decode of Stripe object_time 1780985801000):
--            2026-06-09T06:16:41+00:00
--     EYEBALL-ERROR value to specifically flag (the ~1-day prose error that
--            appears in B5/B45 recon text — a realistic operator mis-fill):
--            2026-06-08T06:16:41+00:00
--     premium target status : 'active'  (or a legitimate Trialing/Past-due
--            target if A26 step B-6 took the signed-off non-Active path)
--
--   WHAT SUCCESS LOOKS LIKE (from A2's SQL PART 5 + A26 §C-bis D1/D2/D3):
--     1. subscriptions.current_period_end = TARGET (no longer the STALE value)
--     2. subscriptions.status            = 'active' (premium-bucket status)
--     3. profiles.premium_status         = 'active'
--     4. profiles.premium_expires_at    >= TARGET   (GREATEST guard worked,
--                                                    gift not regressed)
--     5. user_subscriptions (gift table) byte-identical — never written
--     6. No collateral row carries TARGET written in the apply window
--     7. me-entitlement read-path mirror → is_premium = true
-- ============================================================================


-- ── PART V0 — clock + apply-window knob ─────────────────────────────────────
-- A2's UPDATEs set updated_at = now(). "Written by this apply" = updated_at
-- inside APPLY_WINDOW of right-now. Default 20 min covers a slow read. If you
-- applied long ago, widen the interval below in BOTH places it appears.
SELECT now()                                   AS server_now,
       now() - interval '20 minutes'           AS apply_window_floor,
       '2026-05-09T06:16:41+00:00'::timestamptz AS stale_cpe,
       '2026-06-09T06:16:41+00:00'::timestamptz AS target_cpe,
       '2026-06-08T06:16:41+00:00'::timestamptz AS eyeball_error_cpe;
--   EXPECT: one row. Sanity-check server_now is roughly current UTC.


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
--   EXPECT: exactly 1 row.
--     cpe_is_target = true, cpe_still_stale = false, status = 'active',
--     app_id = 'mercy_blade', written_in_window = true.
--   READ THESE AS:
--     cpe_still_stale = true  → APPLY DID NOT TAKE. The COMMIT was never made
--                               (ROLLBACK left in place / tab closed), OR a
--                               placeholder was left unresolved so the whole
--                               transaction errored and rolled back. Nothing
--                               persisted. Re-run the runbook from §C.
--     cpe_is_eyeball_error = true → WRONG VALUE FILLED. Operator typed
--                               2026-06-08 (the ~1-day prose error) instead of
--                               the authoritative 2026-06-09 from A26 §B-7.
--                               The DB now holds a value Stripe never sent.
--                               Needs a corrected re-apply, not "close enough".
--     cpe_is_target = true but written_in_window = false → the row reached
--                               TARGET via a DIFFERENT writer (a later webhook
--                               or B12 bulk remediation), not this apply. Not
--                               a failure per se, but A2's idempotency guard
--                               will have made the subscriptions UPDATE a
--                               no-op (UPDATE 0) — check PART V2 carefully,
--                               profiles may NOT have been touched.
--     0 rows / >1 row         → state diverged from the B5 diagnosis; do not
--                               infer anything; report row count and stop.


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
--   EXPECT: 1 row. status_is_active = true, expiry_ge_target = true.
--   READ THESE AS:
--     expiry_ge_target = true but premium_status <> 'active'
--                               → A26 KNOWN AMBIGUITY #2 FIRED. A longer
--                               (gift) premium_expires_at meant the profiles
--                               UPDATE's "expiry < TARGET" guard matched 0
--                               rows, so premium_status was NEVER flipped.
--                               The subscriptions row may look perfect while
--                               the profile-based readers still deny her.
--                               This IS the silent partial-apply. Escalate.
--     premium_status = 'active' but written_in_window = false
--                               → profile was already correct before the
--                               apply (or fixed by another path). Acceptable
--                               only if PART V1 cpe_is_target is also true.
--     expiry_ge_target = false  → GREATEST did not advance expiry; profiles
--                               UPDATE did not land. Treat as failed apply.


-- ── PART V3 — gift table untouched + no collateral bleed ───────────────────
-- V3a: her independent (gift / manual) entitlement — A2's block NEVER writes
-- this table. Compare against the dry-run PREVIEW's user_subscriptions panel
-- (A26 §C step 2) if you still have it: must be byte-identical.
SELECT user_id,
       is_gift_redemption,
       status,
       current_period_end,
       created_at,
       updated_at
FROM   public.user_subscriptions
WHERE  user_id = 'cd9b889c-eb9f-428f-9462-de66d4f92c04';
--   EXPECT: identical to the dry-run PREVIEW read. If any updated_at here is
--           inside the apply window → the remediation touched a table it must
--           never touch (PART 2 invariant violated). Escalate immediately.

-- V3b: collateral bleed scan — any OTHER row stamped with TARGET inside the
-- apply window. A2's SQL is PK/user_id-targeted so this MUST be 0; a non-zero
-- count means a predicate leaked the corrected value across rows.
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
--   EXPECT: collateral_rows = 0 for BOTH. Anything > 0 = blast-radius event;
--           stop, do not run anything else, escalate with the row list.


-- ── PART V4 — ONE-GLANCE VERDICT (silent partial-apply detector) ───────────
-- One row per check: verdict ∈ PASS / FAIL / INVESTIGATE. If every verdict is
-- PASS, the repair landed in full and the customer's reality changed. Any
-- FAIL/INVESTIGATE → read its note, do NOT re-apply blindly, escalate.
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
  -- 1: exactly one subscriptions row
  SELECT 1 AS ord, 'subscriptions row count' AS check_name,
         CASE WHEN (SELECT count(*) FROM s) = 1 THEN 'PASS' ELSE 'FAIL' END AS verdict,
         (SELECT count(*)::text FROM s) AS observed, '1' AS expected,
         'Row count diverged from B5 diagnosis — stop & report.' AS note
  UNION ALL
  -- 2: stale value is gone (the COMMIT-was-really-ROLLBACK / unfilled-placeholder detector)
  SELECT 2, 'stale period eliminated',
         CASE WHEN NOT EXISTS (SELECT 1 FROM s
                WHERE current_period_end = '2026-05-09T06:16:41+00:00'::timestamptz)
              THEN 'PASS' ELSE 'FAIL' END,
         (SELECT max(current_period_end)::text FROM s),
         'not 2026-05-09T06:16:41+00:00',
         'FAIL ⇒ apply never committed (ROLLBACK left / placeholder unresolved / tab closed). Nothing persisted.'
  UNION ALL
  -- 3: current_period_end is exactly TARGET
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
  -- 4: subscriptions.status is a premium bucket
  SELECT 4, 'subscriptions.status premium-bucket',
         CASE WHEN lower((SELECT max(status) FROM s))
                   IN ('active','trialing','trial','grace_period','grace',
                       'in_grace_period','past_due','past-due','unpaid')
              THEN 'PASS' ELSE 'FAIL' END,
         (SELECT max(status) FROM s), 'active (expected)',
         'Non-premium status ⇒ me-entitlement will normalize to non-premium; A26 §B-6 STOP path was likely required.'
  UNION ALL
  -- 5: subscriptions written in the apply window
  SELECT 5, 'subscriptions written in apply window',
         CASE WHEN (SELECT max(updated_at) FROM s) > now() - interval '20 minutes'
              THEN 'PASS' ELSE 'INVESTIGATE' END,
         (SELECT (now() - max(updated_at))::text FROM s), '< 20 min',
         'INVESTIGATE ⇒ row reached TARGET via a different writer; A2 subscriptions UPDATE was a no-op — verify profiles (check 7) independently.'
  UNION ALL
  -- 6: app_id visible to me-entitlement (its query filters app_id='mercy_blade')
  SELECT 6, 'app_id visible to me-entitlement',
         CASE WHEN (SELECT max(app_id) FROM s) = 'mercy_blade'
              THEN 'PASS' ELSE 'FAIL' END,
         (SELECT max(app_id) FROM s), 'mercy_blade',
         'FAIL ⇒ row is correct in DB but me-entitlement filters app_id=mercy_blade and will NOT see it ⇒ customer STILL free. True silent failure.'
  UNION ALL
  -- 7: profiles.premium_status active
  SELECT 7, 'profiles.premium_status active',
         CASE WHEN (SELECT max(premium_status) FROM p) = 'active'
              THEN 'PASS' ELSE 'INVESTIGATE' END,
         (SELECT max(premium_status) FROM p), 'active',
         'INVESTIGATE ⇒ if expiry>=TARGET but status<>active, A26 ambiguity #2 fired: gift-longer guard skipped the status flip. Profile readers still deny.'
  UNION ALL
  -- 8: profiles.premium_expires_at >= TARGET (GREATEST guard worked)
  SELECT 8, 'profiles.premium_expires_at >= TARGET',
         CASE WHEN (SELECT max(premium_expires_at) FROM p)
                   >= '2026-06-09T06:16:41+00:00'::timestamptz
              THEN 'PASS' ELSE 'FAIL' END,
         (SELECT max(premium_expires_at)::text FROM p),
         '>= 2026-06-09T06:16:41+00:00',
         'FAIL ⇒ profiles UPDATE did not land / GREATEST did not advance expiry.'
  UNION ALL
  -- 9: gift table not written by the apply
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
  -- 10: no collateral bleed of TARGET to other rows
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
--   EXPECT: every verdict = PASS (check 5 may legitimately be INVESTIGATE if a
--           different writer fixed the row first — then check 7 must still PASS
--           on its own). Any FAIL ⇒ stop, read note, escalate, do not re-apply
--           without a human deciding the corrected action.


-- ── PART V5 — ENTITLEMENT READ-PATH MIRROR ("did her reality change?") ─────
-- Faithful SQL re-implementation of the deployed me-entitlement edge function
-- (supabase/functions/me-entitlement/{index.ts,entitlement.ts}):
--   candidate set = subscriptions WHERE user_id = uid AND app_id='mercy_blade'
--   per row: normalizeStatus() ; pick "best" by statusRank desc, then expiry
--            desc, then updated_at desc, then id ; is_premium =
--            status ∈ {active,trialing,grace_period,past_due}
--   if not premium → gift fallback on user_subscriptions
--            (is_gift_redemption=true, status='active', current_period_end>now())
-- NOTE: getExpiresAt() in JS also falls back to expires_at/period_end/ends_at/
--       expired_at; on this table current_period_end is the live expiry column,
--       so the mirror uses it (same as the production code's effective path).
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
--   EXPECT: final_is_premium = true.
--           After a clean apply: me_entitlement_status = 'active',
--           is_premium_from_subscriptions = true. THIS is the customer's
--           reality on the canonical reader — true here means /account and
--           the premium gate now show her as paid.
--   READ THESE AS:
--     final_is_premium = false → she is STILL paid-but-free despite the DB
--                                writes. Most likely causes, in order:
--                                (a) app_id <> 'mercy_blade' (check V4 #6) so
--                                    her row is invisible to this reader;
--                                (b) subscriptions.status not a premium bucket
--                                    (V4 #4) — A26 §B-6 non-Active path;
--                                (c) the apply did not land at all (V4 #2).
--                                The repair is NOT done. Do not close out.
--     is_premium_from_subscriptions = false but gift_fallback_premium = true
--                                → she's premium ONLY by a pre-existing gift,
--                                NOT by the Stripe fix. The original bug is
--                                masked, not fixed. Flag for follow-up.

-- V5-bis — family-of-4 cross-reader guard. Some sibling readers gate purely
-- on current_period_end > now() (the exact predicate the original bug broke,
-- per RECON-isentitling-fix-plan-B13). me-entitlement's 'active' short-circuits
-- BEFORE expiry; a status-only fix could leave a split-brain where this reader
-- still denies. Post-fix this MUST be true.
SELECT id, status, current_period_end,
       (current_period_end > now()) AS period_in_future
FROM   public.subscriptions
WHERE  user_id = 'cd9b889c-eb9f-428f-9462-de66d4f92c04'
  AND  app_id = 'mercy_blade';
--   EXPECT: period_in_future = true for the active row. If status='active' but
--           period_in_future=false → split-brain: me-entitlement says premium,
--           a current_period_end-gating reader still says free. Escalate.


-- ── PART V6 — OPTIONAL true HTTP end-to-end (customer's literal reality) ────
-- V5 is the operator-runnable proxy and is logic-faithful to the deployed
-- function (same normalizeStatus / isPremiumStatus / app_id filter / gift
-- fallback, same RLS-bypassing read visibility). The only thing it cannot
-- reproduce is the HTTP request authenticated AS HER. If a support session /
-- access token for her account is available, the literal end-to-end check is:
--
--   curl -s -X GET \
--     "https://buemdfxyhxunzpgdoqin.supabase.co/functions/v1/me-entitlement" \
--     -H "Authorization: Bearer <HER_USER_ACCESS_TOKEN>" \
--     -H "apikey: <SUPABASE_ANON_KEY>"
--
--   EXPECT JSON: {"is_premium":true,"source":"stripe","status":"active",
--                 "expires_at":"2026-06-09T06:16:41.000Z",
--                 "trial_expires_at":null,"is_trial_expired":false}
--
-- me-entitlement requires a real USER JWT (it calls auth.getUser(); a
-- service-role token returns 401 — it is NOT a substitute). Minting her token
-- is a human admin step (support-session / impersonation), so this is OPTIONAL
-- and out of band. When you cannot get her token, PART V5 is the authoritative
-- operator check — it reads the identical data through the identical logic.
-- ============================================================================
-- A36 — operator artifact, branch a36/mylinh-postapply-verify. Read-only.
-- No PR. Run after Chau COMMITs the remediation; if every PART V4 verdict is
-- PASS and PART V5 final_is_premium = true, the repair landed and her premium
-- reality changed. Otherwise escalate per the per-check notes — never re-apply
-- the remediation without a human deciding the corrected action.
-- ============================================================================
