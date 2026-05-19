-- ============================================================================
-- AUDIT — Gift-code redemption silent-failure victims
-- ============================================================================
-- Agent:   A13            Branch: a13/gift-redemption-victims    No PR (operator artifact)
-- Date:    2026-05-19
-- Labels:  money-path, silent-failure, customer-incident, read-only, PREVIEW-ONLY
-- Source:  PR #787 (B22 carve-out) + reports/RECON-billing-architecture-as-built-B45.md
--          + supabase/functions/redeem-gift-code/index.ts (the buggy version on
--            origin/main, lines 159-185) + migration 20260510020000.
--
-- ┌────────────────────────────────────────────────────────────────────────┐
-- │  SAFETY: THIS FILE CONTAINS ONLY SELECT STATEMENTS. PREVIEW ONLY.        │
-- │  Do NOT add UPDATE/INSERT/DELETE here. The repair SQL is a SEPARATE,     │
-- │  later task — outreach decisions come first (per A13 dispatch).          │
-- │  Run in the Supabase SQL Editor (needs `auth` schema read = service      │
-- │  role / SQL Editor; an anon client cannot run this).                    │
-- └────────────────────────────────────────────────────────────────────────┘
--
-- THE BUG (verbatim mechanism)
-- ---------------------------------------------------------------------------
-- The `redeem-gift-code` Edge Function inserted a `user_subscriptions` row
-- that OMITS the `is_gift_redemption` column:
--
--     INSERT INTO user_subscriptions
--       (user_id, tier_id, status, current_period_start,
--        current_period_end, updated_at)            -- no is_gift_redemption
--
-- The column has DB DEFAULT false (migration 20260510020000). The entitlement
-- read path `src/lib/gift/fetchActiveGiftSubscription.ts:77` only honors a row
-- where:
--
--     status = 'active' AND is_gift_redemption = true
--                        AND current_period_end > now()
--
-- So the row was written invisible. The function then burned the code
-- (`gift_codes.is_active=false`, `used_at`/`used_by`/`used_by_email` set) and
-- returned `{ ok:true, message:"Welcome to <tier>! Your access is now
-- active." }`. Net effect of EVERY redemption through this function: code
-- consumed, ZERO entitlement granted, customer told "Welcome!", nobody
-- alerted. Still LIVE in prod — PR #787 (the fix) is OPEN, not yet on main.
--
-- SCOPE — which table, and why ONLY this one
-- ---------------------------------------------------------------------------
-- There are TWO unrelated redemption paths. They do NOT share a table:
--
--   * `redeem-gift-code` Edge Function  -> public.gift_codes      <- BUGGY
--   * `redeem_access_code_atomic` RPC   -> public.access_codes    <- NOT affected
--                                          (the RPC explicitly sets
--                                           is_gift_redemption=true on both its
--                                           UPDATE and INSERT — migration
--                                           20260510020000 step 5)
--
-- This audit queries `public.gift_codes` ONLY. Including `access_codes` would
-- manufacture false positives. (The migration's BUG-3 manual fix —
-- trankhuctriet@yahoo.com / user 5171545f-... / code GIFT1Y-DB4433 — was on
-- the access_codes path, a DIFFERENT incident; it will not appear here.)
--
-- THE LINK
-- ---------------------------------------------------------------------------
-- There is NO gift_code_id / redeemed_by_user_id FK on user_subscriptions —
-- the buggy insert wrote no linkage column. The ONLY join is:
--
--     gift_codes.used_by  =  user_subscriptions.user_id   (uuid -> auth.users.id)
--
-- `gift_codes.used_by_email` is a denormalized snapshot of the redeemer's
-- email AT REDEEM TIME (handy if the account email later changed).
-- `user_subscriptions` has `UNIQUE(user_id)` => at most ONE sub row per user,
-- so a plain LEFT JOIN on user_id is exact (no fan-out, no de-dup needed).
--
-- WHAT THE GIFT WAS MEANT TO GRANT
-- ---------------------------------------------------------------------------
-- `gift_codes.tier` is TEXT, CHECK IN ('Level 2','Level 3'). The buggy
-- function hard-codes a ONE YEAR duration (`end.setFullYear(+1)`), starting at
-- redemption. So intended grant = (gift_codes.tier) for 1 year from used_at,
-- i.e. intended_period_end = used_at + interval '1 year'. (Repair task will
-- resolve the exact subscription_tiers.id; the function's name match is
-- `subscription_tiers.name = gift_codes.tier`, with a 'Level 3'->'Level 3 II'
-- fallback. Surfaced best-effort below for the repair task; for OUTREACH the
-- human label gift_codes.tier is what the customer was promised.)
-- ============================================================================


-- ════════════════════════════════════════════════════════════════════════════
-- QUERY 1 — OUTREACH LIST  (one row per affected redemption)
-- Every redeemed gift_codes code whose user has NO currently-honored gift
-- entitlement = the system took the code and gave nothing back, right now.
-- This is the list Chau emails. Read-only.
-- ════════════════════════════════════════════════════════════════════════════
SELECT
    gc.used_by                                   AS user_id,
    au.email                                     AS current_email,        -- authoritative (auth.users)
    gc.used_by_email                             AS email_at_redeem,      -- snapshot at redeem time
    gc.id                                        AS gift_code_id,
    gc.code                                      AS gift_code_value,      -- fully recoverable
    gc.tier                                      AS intended_tier,        -- 'Level 2' | 'Level 3'
    gc.used_at                                   AS redeemed_at,
    (gc.used_at + interval '1 year')             AS intended_period_end,  -- function hard-codes +1yr
    -- best-effort intended subscription_tiers row (for the LATER repair task,
    -- not needed for outreach). NULL is fine here.
    st.id                                        AS intended_tier_id_besteffort,
    st.vip_key                                   AS intended_vip_key_besteffort,
    -- what the user actually has now (UNIQUE(user_id) => 0 or 1 row):
    us.id                                        AS user_sub_id,
    us.is_gift_redemption                        AS user_sub_is_gift_redemption,
    us.status                                    AS user_sub_status,
    us.tier_id                                   AS user_sub_tier_id,
    us.current_period_end                        AS user_sub_period_end,
    -- precise failure mode, so Chau/repair can eyeball each row:
    CASE
        WHEN us.id IS NULL
            THEN 'no_subscription_row (deleted/never persisted)'
        WHEN us.is_gift_redemption = false
            THEN 'is_gift_redemption=false (THE #787 fingerprint)'
        WHEN us.status <> 'active'
            THEN 'status=' || us.status || ' (not active)'
        WHEN us.current_period_end IS NULL OR us.current_period_end <= now()
            THEN 'expired/no period_end'
        ELSE 'other — inspect manually'
    END                                          AS failure_mode
FROM public.gift_codes               gc
JOIN      auth.users                 au ON au.id = gc.used_by
LEFT JOIN public.user_subscriptions  us ON us.user_id = gc.used_by
LEFT JOIN public.subscription_tiers  st
       ON st.name = gc.tier
       OR (gc.tier = 'Level 3' AND st.name = 'Level 3 II')
WHERE gc.used_at  IS NOT NULL          -- the code was redeemed
  AND gc.used_by  IS NOT NULL          -- ...by a real user we can contact
  -- ...and that user has NO currently-honored gift entitlement (the exact
  -- inverse of fetchActiveGiftSubscription.ts). If they DO, they were made
  -- whole by some later path (re-redeem via access_codes, manual patch, paid
  -- separately) and are NOT a current victim — exclude them.
  AND NOT EXISTS (
        SELECT 1
        FROM public.user_subscriptions h
        WHERE h.user_id              = gc.used_by
          AND h.status               = 'active'
          AND h.is_gift_redemption   = true
          AND h.current_period_end   > now()
  )
ORDER BY gc.used_at DESC;


-- ════════════════════════════════════════════════════════════════════════════
-- QUERY 2 — BLAST-RADIUS SUMMARY  (counts; read-only)
-- Run this to size the incident in one shot: how many customers, by tier and
-- by failure mode. (Same victim definition as Query 1.)
-- ════════════════════════════════════════════════════════════════════════════
SELECT
    gc.tier                                      AS intended_tier,
    CASE
        WHEN us.id IS NULL                       THEN 'no_subscription_row'
        WHEN us.is_gift_redemption = false       THEN 'is_gift_redemption=false'
        WHEN us.status <> 'active'               THEN 'not_active'
        WHEN us.current_period_end IS NULL
          OR us.current_period_end <= now()      THEN 'expired'
        ELSE 'other'
    END                                          AS failure_mode,
    count(*)                                     AS affected_customers,
    min(gc.used_at)                              AS earliest_redeemed,
    max(gc.used_at)                              AS latest_redeemed
FROM public.gift_codes               gc
JOIN      auth.users                 au ON au.id = gc.used_by
LEFT JOIN public.user_subscriptions  us ON us.user_id = gc.used_by
WHERE gc.used_at IS NOT NULL
  AND gc.used_by IS NOT NULL
  AND NOT EXISTS (
        SELECT 1
        FROM public.user_subscriptions h
        WHERE h.user_id              = gc.used_by
          AND h.status               = 'active'
          AND h.is_gift_redemption   = true
          AND h.current_period_end   > now()
  )
GROUP BY ROLLUP (gc.tier, 2)
ORDER BY gc.tier NULLS LAST, affected_customers DESC;


-- ════════════════════════════════════════════════════════════════════════════
-- QUERY 3 — TOTAL REDEMPTIONS THROUGH THE BUGGY PATH  (sanity denominator)
-- Every gift_codes redemption ever, regardless of current state. Compare to
-- Query 2's total: (Query 3) - (honored) = blast radius. Read-only.
-- ════════════════════════════════════════════════════════════════════════════
SELECT
    count(*)                                                       AS total_gift_codes_redeemed,
    count(*) FILTER (WHERE gc.used_by IS NOT NULL)                 AS redeemed_with_known_user,
    count(*) FILTER (
        WHERE EXISTS (
            SELECT 1 FROM public.user_subscriptions h
            WHERE h.user_id            = gc.used_by
              AND h.status             = 'active'
              AND h.is_gift_redemption = true
              AND h.current_period_end > now()
        )
    )                                                              AS currently_honored,
    min(gc.used_at)                                                AS first_ever_redeemed,
    max(gc.used_at)                                                AS last_ever_redeemed
FROM public.gift_codes gc
WHERE gc.used_at IS NOT NULL;
