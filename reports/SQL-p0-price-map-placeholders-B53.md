# P0 SQL package — `billing_price_map` placeholder-row DELETE (B53)

> Companion to PR #798 (`SQL-p0-price-map-bridge-A8.md`). #798 **INSERTs**
> the missing live yearly price row; this package **DELETEs** the two
> leftover `price_replace_*` placeholder rows. Disjoint PKs, disjoint
> operations, no collision.
>
> Sources (verbatim — no SQL rewritten by A9f):
> - **SQL:** `reports/REMEDIATION-price-map-placeholders-B53.sql` on
>   branch `b53/price-data-quality-diagnostic` (pushed to origin).
> - **Recon:** `reports/RECON-price-data-quality-B53.md` on the same
>   branch — PK list, zero-consumer proof, PR #700 root cause.
>
> **Operational status:** HANDOFF ONLY. No SQL executed. Apply once via
> the Supabase SQL Editor, human-reviewed. Never `supabase db push`.
> There is no unattended SQL path to this Supabase.

---

## Section 1 — what the placeholder rows are + why they're stale

`public.billing_price_map` is a price→amount reference table used only by
the view `billing_mrr_inputs_v` (LEFT JOIN on `provider_price_id`). PR
**#700** introduced two rows with literal sentinel `price_id` values —
`price_replace_monthly` and `price_replace_yearly` — as a placeholder
seeded by a one-shot SQL Editor patch that was meant to be replaced with
the real Stripe price ids in a follow-up. **The follow-up never landed.**
Migrations don't touch this drifted Supabase (CLAUDE.md → Supabase), so
the placeholders survived even though the live Stripe price ids
(`price_1TCKY02K1tPxy04uCHQNbvik` for monthly, plus the yearly row #798
INSERTs) are now in the table alongside them.

The placeholders are **inert**: zero rows in `public.subscriptions`
reference `provider_price_id IN ('price_replace_monthly',
'price_replace_yearly')`. The `billing_mrr_inputs_v` view's LEFT JOIN
therefore matches zero rows on either placeholder — they contribute **0
to MRR**. Removing them changes MRR by exactly nothing and the
GUARD-BEFORE block in §3 below proves this empirically before the
operator commits. The stake is data-hygiene only: stale sentinel rows
look like real entries to anyone reading `billing_price_map` for the
first time and are a footgun for the next price-map maintainer.

PKs in scope:

| PK | `price_id` | `plan_name` |
|---|---|---|
| `19a53680-13f1-4bf4-bdb1-a7b4c12080ce` | `price_replace_monthly` | VIP Monthly |
| `0384314a-78fb-4153-af06-31aae8e22c72` | `price_replace_yearly` | VIP Yearly |

**Out of scope (explicit):**

- `b950361e-fe86-4263-82e6-03ed61fbe616` (the wrong yearly id
  `price_1TCW5p2NqcfRsoh4SghDrMQv`) → **#798's territory** (B42's
  reconciliation). Not touched here to avoid a two-agent collision.
- Subscription `a03266db-…` (the NULL-`provider_price_id` reviewer comp
  account, B53 Finding 1) → decision-gated, not executable; see the recon
  doc.

---

## Run order relative to #798

Both items touch `public.billing_price_map` at **disjoint PKs** — they do
not interact at the row level. Either order would be safe in isolation.
The **recommended** order is:

1. **#798 INSERT first** (real-revenue visibility — 3 active yearly subs
   currently count as 0 MRR; this is the P0 productive write).
2. **B53 DELETE second** (this doc — hygiene only; the placeholders are
   inert and removal changes nothing observable).

Why this order:

- Running #798 first closes the active MRR-visibility gap immediately.
- The B53 placeholders contribute 0 join rows to `billing_mrr_inputs_v`
  whether they're present or absent; their removal is observationally
  silent.
- Doing the productive write first matches the priority order in
  `reports/PENDING-CHAU-ACTIONS-2026-05-20.md` §B (§B.2 is #798).
- If for any reason #798 is blocked (e.g. the pre-flight Stripe Dashboard
  check fails), this DELETE is still safe to run independently — it has
  no dependency on the new yearly row being present.

The two operations can also be run **in the same SQL Editor session**
back-to-back if that's easier: #798 BEGIN/COMMIT block first, then B53
BEGIN/COMMIT block second. Two transactions, not one.

---

## Section 2 — pre-delete count query (run first)

Expected count, per B53's recon (2026-05-19 read): **exactly 2 rows**,
both with `price_id` starting `price_replace_`, both `is_active=true`,
both `created_at = 2026-04-03 15:55:…`.

```sql
-- Pre-delete VERIFY — expect exactly 2 rows, both price_replace_*
SELECT id, provider, price_id, plan_name, is_active, created_at
FROM   public.billing_price_map
WHERE  id IN ('19a53680-13f1-4bf4-bdb1-a7b4c12080ce',
              '0384314a-78fb-4153-af06-31aae8e22c72');
```

**Decision rule:** if Section 2 returns anything **other than** 2 rows,
both with `price_id IN ('price_replace_monthly', 'price_replace_yearly')`,
both `provider='stripe'`, **STOP and report the actual output**. Do not
proceed to Section 3.

| Section 2 result | Action |
|---|---|
| 2 rows, both `price_replace_*` | proceed to Section 3 |
| 0 rows | already deleted (likely PR #700's intended follow-up landed since B53's read) — no-op, skip to Section 4 to confirm |
| 1 row | partial state — STOP, re-diagnose; don't auto-apply |
| > 2 rows or different `price_id` values on the 2 PKs | STOP — premise violated, re-diagnose |

---

## Section 3 — GUARD-protected DELETE SQL

Verbatim from `b53/price-data-quality-diagnostic`. PK-targeted,
provider/price_id-guarded, idempotent (a second run matches 0 rows). The
GUARD-BEFORE block proves the zero-consumer premise empirically — if any
subscription references the placeholder price_ids, the DELETE must NOT
proceed (the rows are not dead and the recon's premise is violated).

**Wrap is `BEGIN; … ROLLBACK;` — read all four verify outputs, then flip
the trailing `ROLLBACK;` to `COMMIT;` and re-run.**

```sql
BEGIN;

-- ---- PREVIEW (run first; expect EXACTLY 2 rows, both price_replace_*) ------
SELECT id, provider, price_id, plan_name, is_active, created_at
FROM   public.billing_price_map
WHERE  id IN ('19a53680-13f1-4bf4-bdb1-a7b4c12080ce',
              '0384314a-78fb-4153-af06-31aae8e22c72');   -- PK-targeted, part 1

-- ---- GUARD-BEFORE: no subscription references the placeholder price_ids ---
-- Expect 0 rows. If this returns ANY row, STOP — do not COMMIT (the rows are
-- not dead and the recon's zero-consumer premise is violated).
SELECT id, user_id, status, provider_price_id
FROM   public.subscriptions
WHERE  provider_price_id IN ('price_replace_monthly', 'price_replace_yearly');

-- ---- DELETE (PK + idempotency-guarded; expect 2 rows) ---------------------
DELETE FROM public.billing_price_map
WHERE  id IN ('19a53680-13f1-4bf4-bdb1-a7b4c12080ce',
              '0384314a-78fb-4153-af06-31aae8e22c72')   -- PK, not predicate
  AND  provider = 'stripe'                               -- discriminator
  AND  price_id IN ('price_replace_monthly',
                    'price_replace_yearly');             -- idempotency, part 3
                    -- second run: rows gone -> 0 matched -> safe no-op.

-- ---- VERIFY-AFTER: the 2 PKs are gone ------------------------------------
SELECT id, price_id
FROM   public.billing_price_map
WHERE  id IN ('19a53680-13f1-4bf4-bdb1-a7b4c12080ce',
              '0384314a-78fb-4153-af06-31aae8e22c72');   -- expect 0 rows

-- ---- VERIFY-AFTER: real price rows untouched, count == 2 -----------------
-- Expect exactly the 2 real Stripe rows still present:
--   price_1TCKY02K1tPxy04uCHQNbvik (monthly), and the yearly row
--   (still price_1TCW5p2NqcfRsoh4SghDrMQv until B42's reconciliation runs).
SELECT id, price_id, plan_name, is_active
FROM   public.billing_price_map
ORDER  BY created_at;                                    -- expect 2 rows

-- ---- GUARD-AFTER: billing_mrr_inputs_v join unaffected -------------------
-- Expect IDENTICAL row count / amounts to a pre-run snapshot of this query.
-- The placeholders contributed 0 join rows, so MRR inputs must be unchanged.
SELECT count(*)                              AS mrr_input_rows,
       count(*) FILTER (WHERE mapped_monthly_amount IS NULL) AS unmapped_rows
FROM   public.billing_mrr_inputs_v;

-- First run with ROLLBACK. Read PREVIEW (=2 rows), GUARD-BEFORE (=0 rows),
-- VERIFY-AFTER (PK rows = 0, real rows = 2), GUARD-AFTER (mrr rows unchanged).
-- Only then change the line below to `COMMIT;` and re-run.
ROLLBACK;
```

**STOP-gate summary inside Section 3 (must all pass before flipping to
`COMMIT;`):**

1. PREVIEW returns **2 rows**, both `price_replace_*`. Anything else → STOP.
2. GUARD-BEFORE returns **0 rows**. Any row → STOP (placeholders are *not*
   inert; the recon premise is violated and the next agent needs to
   re-diagnose).
3. VERIFY-AFTER first block returns **0 rows** (both PKs gone in the
   transaction).
4. VERIFY-AFTER second block returns **exactly 2 rows** (the two real
   Stripe rows, ordered by `created_at`: monthly first
   `price_1TCKY02K1tPxy04uCHQNbvik`, then yearly — either the wrong
   `price_1TCW5p2NqcfRsoh4SghDrMQv` if #798 hasn't been applied yet, or
   the corrected `price_1TCKSF2K1tPxy04uNeKcQWp5` if #798 ran first).
5. GUARD-AFTER returns the **same** `mrr_input_rows` count as before. Any
   change → STOP (the placeholders weren't inert after all).

If all five pass on the ROLLBACK run, flip the trailing `ROLLBACK;` to
`COMMIT;` and re-run the entire block.

---

## Section 4 — post-delete verify query

After `COMMIT;`, run this standalone outside the transaction wrapper to
confirm the durable state:

```sql
-- Post-delete VERIFY (standalone, no transaction)
-- A) The 2 placeholder PKs should be gone.
SELECT id, price_id
FROM   public.billing_price_map
WHERE  id IN ('19a53680-13f1-4bf4-bdb1-a7b4c12080ce',
              '0384314a-78fb-4153-af06-31aae8e22c72');   -- expect 0 rows

-- B) billing_price_map should hold only the real Stripe rows.
--    If #798 has not yet been applied: 2 rows (monthly + wrong yearly).
--    If #798 has been applied:         3 rows (monthly + wrong yearly + new yearly),
--                                      OR 2 rows if B42 followed through and
--                                      removed the wrong yearly id (B42's call,
--                                      not in scope here).
SELECT id, price_id, plan_name, is_active
FROM   public.billing_price_map
ORDER  BY created_at;

-- C) No subscription should reference the (now-deleted) placeholder ids.
--    Expected: 0 rows. (Was 0 rows before the delete too — this is a
--    durable invariant, not a state change.)
SELECT count(*) AS subs_referencing_placeholders
FROM   public.subscriptions
WHERE  provider_price_id IN ('price_replace_monthly', 'price_replace_yearly');
```

**Expected output, durable state:**

- (A) 0 rows.
- (B) 2 or 3 rows depending on whether #798 has been applied at the time
  Section 4 runs.
- (C) `subs_referencing_placeholders = 0`.

---

## Source branches

- `b53/price-data-quality-diagnostic` — pushed to origin by A10b. Carries
  the recon doc + the verbatim SQL above.
- `b42/price-map-missing-row` — separately tracked; #798's source. Not
  touched here.

## Provenance

- A9e classification audit (PR #825) identified b53 as the one PR-READY
  branch among the 11 A10b durability pushes.
- A9f (this PR) packages b53's SQL into a hand-apply shape matching #800.
- §B.2a sibling line in `reports/PENDING-CHAU-ACTIONS-2026-05-20.md` to be
  added by a follow-up once #814 merges.

*A9f — packaging only. No DB writes, no prod query, no SQL executed.
Apply once via Supabase SQL Editor, human-reviewed.*
