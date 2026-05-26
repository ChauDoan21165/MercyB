# CUSTOMER — Gift-victim apply package (audit → repair → outreach)

> Agent: A3 · Branch: `chore/gift-victims-package` · Date: 2026-05-19
> Labels: money-path, customer-incident, apply-package
> Source artifacts (unmerged branches at time of writing):
> - `a13/gift-redemption-victims` — `reports/AUDIT-gift-victims-A13.sql` + `reports/OUTREACH-gift-victims-A13.md`
> - `a28/gift-victim-repair-sql` — `reports/REMEDIATION-gift-victim-repair-A28.sql`
> Forward fix in prod: PR #787 (`redeem-gift-code` now returns honest errors instead of `ok:true` silent loss).

## What this package is

The `redeem-gift-code` Edge Function silently burned gift codes without
granting entitlement (the buggy `INSERT` omitted `is_gift_redemption`, so the
read path `fetchActiveGiftSubscription.ts` could not honor the row). PR #787
stops the bleeding **going forward**. Every prior redemption is still a victim:
code consumed, zero entitlement, customer told "Welcome!".

This document is the **operator runbook** that pairs the read-only audit
(A13) with the corrective write (A28) and the apology email (A13) so Chau
can execute end-to-end in one sitting via the Supabase SQL Editor.

## Apply order (do not skip steps)

1. **Run AUDIT SQL** (block 1) in the SQL Editor. Save the Query 1 output —
   that is the canonical victim list.
2. **Transcribe** each Query 1 row into the A28 VALUES lists per the
   instructions in block 2's header. The list classification is mechanical
   (driven by the `failure_mode` column).
3. **Run REPAIR SQL** (block 3) under the default `ROLLBACK`. Read PART A
   PREVIEW + PART D VERIFY. Only when all 5 GATE items pass: flip the
   single trailing `ROLLBACK;` to `COMMIT;` and re-run once.
4. **Send OUTREACH email** (block 4) per-victim — but only AFTER the
   commit in step 3 succeeds, so the apology's promise ("I will manually
   activate {{GOI}}") is already true when it lands in the inbox.

Constraints (CLAUDE.md + memory):

- Supabase SQL Editor only. **Never** `supabase db push`. **Never** an
  unattended agent. There is no automated path to this Supabase.
- Send-from / reply-to: `admin@mercyblade.com` (canonical — never `hello@`).
- VI is the email; EN block is fallback for non-VN recipients only.

---

## Block 1 — AUDIT SQL (run FIRST, read-only)

Run in the Supabase SQL Editor. Query 1 is the victim list to transcribe.
Query 2 / Query 3 are sizing aids (counts only).

```sql
-- ============================================================================
-- AUDIT — Gift-code redemption silent-failure victims (A13)
-- READ-ONLY. SELECTs only. Run in the Supabase SQL Editor.
-- ============================================================================

-- ════════════════════════════════════════════════════════════════════════════
-- QUERY 1 — OUTREACH LIST  (one row per affected redemption)
-- This is the list to TRANSCRIBE into the A28 VALUES lists in Block 3.
-- ════════════════════════════════════════════════════════════════════════════
SELECT
    gc.used_by                                   AS user_id,
    au.email                                     AS current_email,
    gc.used_by_email                             AS email_at_redeem,
    gc.id                                        AS gift_code_id,
    gc.code                                      AS gift_code_value,
    gc.tier                                      AS intended_tier,
    gc.used_at                                   AS redeemed_at,
    (gc.used_at + interval '1 year')             AS intended_period_end,
    st.id                                        AS intended_tier_id_besteffort,
    st.vip_key                                   AS intended_vip_key_besteffort,
    us.id                                        AS user_sub_id,
    us.is_gift_redemption                        AS user_sub_is_gift_redemption,
    us.status                                    AS user_sub_status,
    us.tier_id                                   AS user_sub_tier_id,
    us.current_period_end                        AS user_sub_period_end,
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
WHERE gc.used_at  IS NOT NULL
  AND gc.used_by  IS NOT NULL
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
-- QUERY 2 — BLAST-RADIUS SUMMARY  (counts only)
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
```

---

## Block 2 — Transcription step (Query 1 → A28 VALUES lists)

For **each row** in Query 1's output, read `failure_mode` and route it:

| `failure_mode` | Action |
|---|---|
| `is_gift_redemption=false (THE #787 fingerprint)` | Add a row to **`victims_update`** in Block 3 |
| `no_subscription_row (deleted/never persisted)` | Add a row to **`victims_insert`** in Block 3 |
| `status=… (not active)` | **DO NOT auto-repair.** Note and resolve by hand. |
| `expired/no period_end` | **DO NOT auto-repair.** This is a naturally-elapsed prior gift, not the #787 incident. |
| `other — inspect manually` | **DO NOT auto-repair.** |
| any row where `intended_tier_id_besteffort IS NULL` | **DO NOT auto-repair** (tier not configured — separate defect). |

For each victim being repaired, fill three columns from the Query 1 row:

- `user_id` ← `user_id` (cast `::uuid`)
- `redeemed_at` ← `redeemed_at` (cast `::timestamptz`)
- `intended_tier_id` ← `intended_tier_id_besteffort` (cast `::uuid`)

Remove the all-zero **SENTINEL** row from a list **only after** that list
has ≥1 real victim. A list left at the sentinel is a safe 0-row no-op
(keep the sentinel if that class has no victims). Keep the explicit
`::uuid` / `::timestamptz` casts on whichever row is first in each list.

**Also build the `victims_all` list in PART D VERIFY** — it's the union of
every transcribed `user_id` across both classes (sentinel filtered out).

---

## Block 3 — REPAIR SQL (run SECOND, transactional)

Paste into the SQL Editor. Default trailing keyword is `ROLLBACK;` — first
run reveals PART A PREVIEW + PART D VERIFY without persisting. Read both,
clear the 5-item GATE, then flip the **single** trailing `ROLLBACK;` to
`COMMIT;` and re-run **once**.

```sql
-- ============================================================================
-- A28 — Remediation: gift-code silent-failure VICTIMS — re-grant entitlement
-- ============================================================================
-- See the source-of-record header in reports/REMEDIATION-gift-victim-repair-A28.sql
-- for full provenance (read-path predicate, +1 year duration, never-shorten
-- stack, CHECK active_requires_stripe_for_paid_tiers, scope guarantees).
--
--   ┌──────────────────────────────────────────────────────────────────┐
--   │ >>> GATE — DO NOT FLIP ROLLBACK→COMMIT UNTIL ALL 5 ARE DONE <<<    │
--   ├──────────────────────────────────────────────────────────────────┤
--   │ 1. Transcribed every A13 Q1 row by failure_mode (Block 2 above). │
--   │ 2. PART A PREVIEW: every victims_update row is live status=     │
--   │    'active' AND is_gift_redemption=false AND live tier_id =     │
--   │    transcribed intended_tier_id; every victims_insert row has   │
--   │    existing_rows=0 and transcribed_tier_id NOT NULL.            │
--   │ 3. PART D D1 honored_now = true for every transcribed victim.   │
--   │ 4. Period decision: for victims flagged                         │
--   │    code_faithful_already_expired=true, DEFAULT is code-faithful │
--   │    (period may already be past = still no usable access). To    │
--   │    give "1 year from activation" instead, swap the marked       │
--   │    GREATEST expression in PART B1/B2 — deliberate edit only.    │
--   │ 5. PART D D2 = 0 rows (no scope leak) · D3 = 0 (profiles        │
--   │    untouched). Only then change trailing ROLLBACK; → COMMIT;.   │
--   └──────────────────────────────────────────────────────────────────┘

BEGIN;

-- ---------------------------------------------------------------------------
-- ‹‹ TRANSCRIBE A13 Q1 VICTIM ROWS HERE ››
-- First row of each list is an all-zero SENTINEL (nil uuid matches no user,
-- so an un-edited paste writes NOTHING). Add one real row per victim of
-- that class from A13 Q1; remove the sentinel ONLY when that list has ≥1
-- real row. Keep explicit ::uuid / ::timestamptz casts on the first row.
-- ---------------------------------------------------------------------------
WITH
victims_update (user_id, redeemed_at, intended_tier_id) AS (
  VALUES
    -- SENTINEL — do not run against this; replace with real rows.
    ( '00000000-0000-0000-0000-000000000000'::uuid,
      '1970-01-01T00:00:00+00:00'::timestamptz,
      '00000000-0000-0000-0000-000000000000'::uuid )
    -- , ( '‹A13 Q1 user_id›'::uuid,
    --     '‹A13 Q1 redeemed_at›'::timestamptz,
    --     '‹A13 Q1 intended_tier_id_besteffort›'::uuid )   -- one per #787-fingerprint victim
),
victims_insert (user_id, redeemed_at, intended_tier_id) AS (
  VALUES
    -- SENTINEL — do not run against this; replace with real rows.
    ( '00000000-0000-0000-0000-000000000000'::uuid,
      '1970-01-01T00:00:00+00:00'::timestamptz,
      '00000000-0000-0000-0000-000000000000'::uuid )
    -- , ( '‹A13 Q1 user_id›'::uuid,
    --     '‹A13 Q1 redeemed_at›'::timestamptz,
    --     '‹A13 Q1 intended_tier_id_besteffort›'::uuid )   -- one per no_subscription_row victim
)

-- ---- PART A · PREVIEW ------------------------------------------------------
SELECT v.user_id,
       us.id                              AS user_sub_pk,
       us.status                          AS live_status,
       us.is_gift_redemption              AS live_is_gift,
       us.tier_id                         AS live_tier_id,
       v.intended_tier_id                 AS transcribed_tier_id,
       us.current_period_end              AS live_period_end,
       (v.redeemed_at + interval '1 year') AS code_faithful_end,
       ((v.redeemed_at + interval '1 year') <= now())
                                          AS code_faithful_already_expired
FROM   victims_update v
LEFT JOIN public.user_subscriptions us ON us.user_id = v.user_id
WHERE  v.user_id <> '00000000-0000-0000-0000-000000000000'::uuid;

SELECT v.user_id,
       (SELECT count(*) FROM public.user_subscriptions u
         WHERE u.user_id = v.user_id)     AS existing_rows,
       v.intended_tier_id                 AS transcribed_tier_id,
       (v.redeemed_at + interval '1 year') AS code_faithful_end,
       ((v.redeemed_at + interval '1 year') <= now())
                                          AS code_faithful_already_expired
FROM   victims_insert v
WHERE  v.user_id <> '00000000-0000-0000-0000-000000000000'::uuid;

-- ---- PART B · THE FIX ------------------------------------------------------

-- B1. UPDATE — un-hide #787-fingerprint rows, extend to intended period.
WITH
victims_update (user_id, redeemed_at, intended_tier_id) AS (
  VALUES
    ( '00000000-0000-0000-0000-000000000000'::uuid,
      '1970-01-01T00:00:00+00:00'::timestamptz,
      '00000000-0000-0000-0000-000000000000'::uuid )
    -- , (... KEEP IDENTICAL to PART A's victims_update ...)
)
UPDATE public.user_subscriptions us
SET    is_gift_redemption = true,
       current_period_end = GREATEST(
                              (v.redeemed_at + interval '1 year'),
                              -- GATE 4 goodwill swap (deliberate, per-run):
                              -- replace the line above with
                              --   GREATEST(v.redeemed_at + interval '1 year', now() + interval '1 year')
                              -- ONLY for code_faithful_already_expired victims.
                              us.current_period_end
                            ),
       updated_at         = now()
FROM   victims_update v
WHERE  us.user_id              = v.user_id
  AND  v.user_id              <> '00000000-0000-0000-0000-000000000000'::uuid
  AND  us.status               = 'active'
  AND  us.is_gift_redemption   = false;

-- B2. INSERT — re-create the row the buggy path failed to persist.
WITH
victims_insert (user_id, redeemed_at, intended_tier_id) AS (
  VALUES
    ( '00000000-0000-0000-0000-000000000000'::uuid,
      '1970-01-01T00:00:00+00:00'::timestamptz,
      '00000000-0000-0000-0000-000000000000'::uuid )
    -- , (... KEEP IDENTICAL to PART A's victims_insert ...)
)
INSERT INTO public.user_subscriptions
       (user_id, tier_id, status, current_period_start,
        current_period_end, is_gift_redemption, updated_at)
SELECT v.user_id,
       v.intended_tier_id,
       'active',
       v.redeemed_at,
       GREATEST(
         (v.redeemed_at + interval '1 year'),
         -- GATE 4 goodwill swap (deliberate, per-run): replace with
         --   GREATEST(v.redeemed_at + interval '1 year', now() + interval '1 year')
         -- ONLY for code_faithful_already_expired victims.
         v.redeemed_at + interval '1 year'
       ),
       true,
       now()
FROM   victims_insert v
WHERE  v.user_id        <> '00000000-0000-0000-0000-000000000000'::uuid
  AND  v.intended_tier_id IS NOT NULL
  AND  NOT EXISTS (
         SELECT 1 FROM public.user_subscriptions u
         WHERE  u.user_id = v.user_id
       );

-- ---- PART D · VERIFY (read before flipping to COMMIT) ----------------------
WITH
victims_all (user_id) AS (
  -- Union of every transcribed victim user_id, both classes. KEEP IDENTICAL
  -- to PART A's two lists (sentinel filtered out).
  VALUES ( '00000000-0000-0000-0000-000000000000'::uuid )
  -- , ('‹every transcribed victim user_id›'::uuid)
)
-- D1. PRIMARY SUCCESS — every transcribed victim honored by read predicate.
SELECT us.user_id,
       us.status,
       us.is_gift_redemption,
       us.tier_id,
       us.current_period_end,
       (us.status = 'active'
        AND us.is_gift_redemption = true
        AND us.current_period_end > now())          AS honored_now
FROM   public.user_subscriptions us
JOIN   victims_all va ON va.user_id = us.user_id
WHERE  va.user_id <> '00000000-0000-0000-0000-000000000000'::uuid;

-- D2. GUARD — no user_id outside the transcribed victim set changed.
SELECT us.user_id, us.status, us.is_gift_redemption, us.updated_at
FROM   public.user_subscriptions us
WHERE  us.updated_at >= date_trunc('second', now())
  AND  us.user_id NOT IN (
         SELECT user_id FROM victims_all
         WHERE user_id <> '00000000-0000-0000-0000-000000000000'::uuid
       );

-- D3. INDEPENDENT-ENTITLEMENT untouched (profiles never written by this txn).
SELECT count(*) AS profiles_touched_this_txn
FROM   public.profiles
WHERE  updated_at >= date_trunc('second', now());

-- ============================================================================
-- First run with ROLLBACK below. Read PART D:
--   D1 honored_now = true for every transcribed victim ·
--   D2 = 0 rows (no scope leak) · D3 = 0 (profiles untouched).
-- Only THEN change the single word `ROLLBACK;` to `COMMIT;` and re-run ONCE.
ROLLBACK;
-- ============================================================================
```

---

## Block 4 — OUTREACH email copy (send THIRD, post-COMMIT only)

**Operator notes** (NOT part of the email):

- **Send from / reply-to:** `admin@mercyblade.com` (canonical — never `hello@`).
- **VI is the email.** EN block below is fallback for the rare non-VN
  recipient. For VN users, send VI only — delete the EN block.
- **Personalize from A13 Q1 columns:**
  | Placeholder | A13 Q1 column |
  |---|---|
  | `{{TEN}}` | recipient name if known, else `Bạn` |
  | `{{MA}}` | `gift_code_value` |
  | `{{GOI}}` | `intended_tier` (`Level 2` / `Level 3`) |
  | `{{NGAY}}` | `redeemed_at` (format `dd/mm/yyyy`) |
  | send-to   | `current_email` (use `email_at_redeem` only if `current_email` is null) |
- **Do NOT send until Block 3 has committed**, so the email's promise
  ("I will manually activate {{GOI}}") is already true at delivery time.
- Tone is a personal apology from the founder — keep it.

### Subject

**Tiếng Việt (chính):**
`Lỗi từ phía MercyBlade — mình sẽ kích hoạt lại quà tặng cho bạn`

**English (fallback):**
`A mistake on our side — we're restoring your MercyBlade gift`

### Body — Tiếng Việt (gửi bản này cho người dùng Việt)

```
Chào {{TEN}},

Mình là Châu, người làm MercyBlade. Mình viết email này để xin lỗi bạn một
cách thẳng thắn.

Bạn đã dùng mã quà tặng {{MA}} (gói {{GOI}}) vào ngày {{NGAY}}.
Màn hình lúc đó hiện "Chào mừng bạn! Quyền truy cập đã được kích hoạt" — nhưng
điều đó không đúng. Hệ thống của mình có một lỗi: mã của bạn đã bị đánh dấu
là "đã dùng", nhưng phần mở khóa gói {{GOI}} lại không hề được kích hoạt.
Nói thẳng: mã đã bị tiêu, còn bạn thì không nhận được gì. Đây hoàn toàn là lỗi
kỹ thuật từ phía mình, không phải lỗi của bạn.

Đây là điều mình sẽ làm:

- Mình sẽ tự tay kích hoạt gói {{GOI}} cho tài khoản của bạn, đầy đủ
  thời hạn mà món quà đáng lẽ phải mang lại (1 năm).
- Bạn không cần làm gì cả — không cần nhập lại mã, không cần đăng ký lại.
  Mã {{MA}} vẫn được ghi nhận cho bạn.
- Khi gói đã được bật, mình sẽ báo lại cho bạn.

Mình thật sự xin lỗi vì sự cố này, và xin lỗi vì màn hình đã báo "thành công"
trong khi thực tế không phải vậy. Một công cụ học tiếng Anh thì không được phép
nói dối người dùng — kể cả vô tình. Mình đã sửa lỗi gốc để chuyện này không
xảy ra với bất kỳ ai nữa.

Nếu bạn có bất kỳ câu hỏi nào, cứ trả lời thẳng email này — email về đúng hộp
thư của mình.

Cảm ơn bạn đã tin tưởng MercyBlade.

Châu
MercyBlade — admin@mercyblade.com
```

### Body — English (fallback only — delete for VN recipients)

```
Hi {{TEN}},

I'm Chau, the person who builds MercyBlade. I'm writing to apologize to you
directly and honestly.

You redeemed gift code {{MA}} (the {{GOI}} plan) on {{NGAY}}. The
screen said "Welcome! Your access is now active" — but that was not true.
A bug in our system marked your code as used, but never actually unlocked
{{GOI}}. Plainly: the code was burned and you received nothing. This was
entirely a technical fault on our side, not anything you did wrong.

Here's what I'm doing about it:

- I will manually activate {{GOI}} on your account, for the full duration
  the gift was meant to give you (1 year).
- You don't need to do anything — no re-entering the code, no signing up
  again. Code {{MA}} is still credited to you.
- I'll let you know once it's switched on.

I'm genuinely sorry this happened, and sorry the screen claimed "success" when
it hadn't. An English-learning tool should never lie to its users — even by
accident. I've fixed the underlying bug so this can't happen to anyone else.

If you have any questions, just reply straight to this email — it reaches me.

Thank you for trusting MercyBlade.

Chau
MercyBlade — admin@mercyblade.com
```

---

## Lifecycle

After Block 3 commits + Block 4 has been sent to every affected victim,
banner the top of this file:

```
-- APPLIED via SQL Editor <date> — verified <N> rows; outreach sent <date>; do not re-run
```

The forward-fix bug (silent `ok:true`) is closed by PR #787 once merged.
This package is the one-time historical-victim repair plus apology.
