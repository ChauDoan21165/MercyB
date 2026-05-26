# Stripe Dashboard pre-flight — mylinh.nutrition@gmail.com (A2b)

> **For Chau, before pasting Block 2 of `reports/CUSTOMER-mylinh-apply-package.md`
> (PR #801).** A single-page checklist for the manual Stripe Dashboard
> verification that produces the two placeholder values Block 2 needs
> (`‹SUBSCRIPTION_PK›` and `‹CORRECTED_PERIOD_END›`).
>
> Webhook-table data is NOT sufficient to authorize the apply (this is the
> stale-`current_period_end` defect Block 2 is repairing — trusting the
> mirror would be circular). The dashboard is the authoritative source.
>
> Read time ~2 min · Lookup time ~3 min. No code or DB writes.

---

## Target

| Field | Value |
|---|---|
| Email | `mylinh.nutrition@gmail.com` |
| Supabase user_id | `cd9b889c-eb9f-428f-9462-de66d4f92c04` |
| DB record customer-prefix | `cd9b889c` (leading 8 chars of user_id, **not** a Stripe `cus_` id) |
| Expected paid product | 200K VND MercyBlade subscription |
| Stale `current_period_end` we are correcting | `2026-05-09T06:16:41+00:00` |
| Cross-check candidate (Stripe epoch decode) | `2026-06-09T06:16:41+00:00` |

You will look her up **by email**, not by id — the Supabase user_id is not a
Stripe identifier and the actual Stripe `cus_…` is not stored in this doc on
purpose (it has to come from the live dashboard).

---

## 1 · Environment checks before the lookup (~30 sec)

These are the 5 verification points from §i applied to mylinh — confirm
ALL of them before clicking anything else.

| # | Check | Pass condition | Fail action |
|---|---|---|---|
| 1 | **Live mode confirmed** | Top-left toggle reads **"Live mode"** (no orange `Test mode` banner anywhere on the page) | If `Test mode` banner is visible → flip toggle to Live mode. **Do not proceed in Test mode** — test data does not represent her real subscription. |
| 2 | **Correct Stripe account** | Top-right account menu shows the **MercyBlade** account (the one that receives production webhook events to `buemdfxyhxunzpgdoqin.supabase.co`). | If a different account → log out, log back in to the MercyBlade account, repeat env checks. |
| 3 | **Customer found by email, exactly one match** | Searching `mylinh.nutrition@gmail.com` returns **exactly 1** customer row with that email verbatim | 0 matches → STOP (her payment isn't on this account, escalate). >1 matches → STOP (duplicate customer; needs human decision before any DB write). |
| 4 | **Customer has an active (or entitling) subscription** | The customer's Subscriptions card shows ≥1 subscription with a Status pill of **`Active`**, `Trialing`, or `Past due` | Other statuses → STOP, see §3 below. |
| 5 | **Subscription period end is in the future** | The active subscription's "Current period end" date is **after today (2026-05-19)** AND not equal to the stale `2026-05-09` we're correcting | If "Current period end" is still on 2026-05-09 → STOP (Stripe itself shows her unpaid; the DB row is consistent with Stripe, this is a *different* defect, not the stale-mirror class). If a date neither matches `Jun 9 2026` nor the eyeball-error `Jun 8 2026` → STOP, see §4. |

If any of 1–5 fails → close the dashboard tab, do **not** paste Block 2,
report which check failed.

---

## 2 · Customer + subscription lookup (~2 min)

### 2a. Find her customer

1. Left sidebar → **Customers** (two-person silhouette icon, top group of nav).
2. Search box at top of Customers page → paste `mylinh.nutrition@gmail.com` → Enter.
3. Confirm exactly **1 row** with that email matches. Click it.

URL pattern after click (record this for the PR comment):
- `https://dashboard.stripe.com/customers/cus_XXXXXXXXXXXXXX`
  (the `cus_…` is Stripe's customer id; it is **not** the value Block 2 needs —
  Block 2 needs the *subscription* id, not the customer id.)

`[SCREENSHOT: customer page header showing email + customer cus_ id + Live mode toggle visible]`

### 2b. Open her active subscription

1. Scroll the customer detail page to the **Subscriptions** card.
2. Click the row whose Status pill is `Active` (or `Trialing` / `Past due` —
   see §3 below for what to do with the non-Active variants).
3. The subscription detail page opens.

URL pattern (record this too):
- `https://dashboard.stripe.com/subscriptions/sub_XXXXXXXXXXXXXX`
  (the `sub_…` is Stripe's subscription id — it is the **`provider_subscription_id`**
  on our DB row, NOT the `subscription_pk` Block 2 needs.)

`[SCREENSHOT: subscription detail page header showing status pill + period range]`

### 2c. Extract the two values

| Block 2 placeholder | What it actually is | Source |
|---|---|---|
| `‹SUBSCRIPTION_PK›` | The `id` (UUID) of her row in `public.subscriptions` — **a Supabase PK, not a Stripe id** | Comes from **Block 1 row 1A** of `CUSTOMER-mylinh-apply-package.md` (paste Block 1 in the Supabase SQL Editor first; the first SELECT returns `subscription_pk` as the leading column). Stripe Dashboard does NOT show this UUID. |
| `‹CORRECTED_PERIOD_END›` | The corrected `current_period_end` timestamp, full second-precise form | Stripe Dashboard subscription page → "Current period" line (e.g. `May 9 – Jun 9, 2026`); take the **end** of that range. The full second-precise value is `'2026-06-09T06:16:41+00:00'` (exact decode of Stripe's freshness epoch). |

**Important — the most common mis-mapping to avoid:** the `sub_…` id on
Stripe and the `subscription_pk` UUID on Supabase are **two different
identifiers** for the same logical subscription. The mapping in our DB:

- `public.subscriptions.id` → UUID (our PK) → this is `‹SUBSCRIPTION_PK›`
- `public.subscriptions.provider_subscription_id` → `sub_…` (Stripe id) → this is **NOT** `‹SUBSCRIPTION_PK›`; Block 2 does not write it

So the workflow is:
1. **Stripe Dashboard first** → confirm Status + period-end date.
2. **Supabase SQL Editor next** → run Block 1; copy the `subscription_pk` UUID from row 1A.
3. **Block 2** → paste UUID into `‹SUBSCRIPTION_PK›`, paste timestamp into `‹CORRECTED_PERIOD_END›`.

`[SCREENSHOT: subscription detail page with "Current period" line + Status pill clearly visible]`

---

## 3 · STOP — Status pill conditions

Before extracting `‹CORRECTED_PERIOD_END›`, classify the Status pill:

| Status pill | Action |
|---|---|
| **Active** | Proceed. `‹CORRECTED_PERIOD_END›` = the period-end date on the subscription detail page. |
| **Trialing** | STOP at Block 2 PART D under ROLLBACK; do NOT COMMIT. A2's regen targets `premium_status='active'`; the trialing-vs-active mapping needs sign-off. Report the trial expiry date. |
| **Past due** | STOP at Block 2 PART D under ROLLBACK; do NOT COMMIT. Same reason as trialing — the entitling-but-not-fully-active path needs sign-off. Report the past-due context (failed invoice? expected retry date?). |
| **Canceled** | **HARD STOP. Do not paste Block 2 at all.** Her subscription is canceled in Stripe — paid-but-free is the *correct* state, not the stale-mirror defect. Re-diagnose: is this a refund? a churn? a different user complaint? |
| **Unpaid** / **Incomplete** / **Incomplete expired** | **HARD STOP.** Stripe never collected payment for the period that's stale — this is a *different* defect than the period_end field-order bug. Re-diagnose. |
| **Paused** | **HARD STOP.** Subscription is paused; the period_end isn't moving forward because Stripe isn't billing it. Block 2's repair would fabricate entitlement she doesn't have. |

In every STOP case: close the dashboard tab, do **not** run Block 1/2/3,
paste back the Status pill + period-end date + customer URL.

---

## 4 · STOP — period-end date conditions

After Status passes the §3 gate, classify the "Current period end" date:

| Stripe period-end date | Action |
|---|---|
| **June 9, 2026** | Proceed. `‹CORRECTED_PERIOD_END›` = `'2026-06-09T06:16:41+00:00'` (the second-precise value is authoritative — it decodes exactly from Stripe's own `__stripe_freshness.object_time = 1780985801000`). |
| **June 8, 2026** | **STOP.** The recon prose mistakenly approximates the corrected date as ~Jun 8; pasting `2026-06-08T06:16:41+00:00` is the "eyeball-error" mis-fill A36's verify (PART V1 `cpe_is_eyeball_error`) specifically catches. If Stripe genuinely shows Jun 8, something has drifted from the diagnosis — re-diagnose, don't paste. |
| **May 9, 2026** (still the stale value) | **STOP.** Stripe and the DB agree she's unpaid — this is **not** the stale-mirror defect Block 2 repairs. Different bug; re-diagnose. |
| **Any other date** (e.g. Jul 9, Aug 9, etc.) | **STOP.** Her state has advanced past B5's diagnosis (e.g. a later webhook delivered cleanly). The Block 2 idempotency guard would match 0 rows and B2 would no-op — but verify why the period changed before declaring "no action needed". Paste back the date you saw. |

Memory rule (from the source RECON): "do not silently reconcile" — if
Stripe and the diagnosis disagree by > ~1 day, escalate, don't paste.

---

## 5 · Pre-flight summary template (paste into PR #801 before applying)

Before changing Block 2's `ROLLBACK;` → `COMMIT;`, paste this filled-in
block as a PR comment so the apply attempt is auditable:

```
mylinh Stripe Dashboard pre-flight (A2b) — confirmed before COMMIT:

Environment:
 1. Live mode toggle: ✅ Live (no Test mode banner)
 2. Stripe account: ✅ MercyBlade (production)
 3. Customer found by email: ✅ exactly 1 match
 4. Active/entitling subscription on her customer: ✅ <Status pill>
 5. Period end in future and not 2026-05-09: ✅ <Stripe period-end date>

Stripe URLs (for evidence):
 - Customer:     https://dashboard.stripe.com/customers/cus_<redacted-in-comment-OK>
 - Subscription: https://dashboard.stripe.com/subscriptions/sub_<redacted-in-comment-OK>

Values extracted:
 - ‹CORRECTED_PERIOD_END› → '2026-06-09T06:16:41+00:00'   (Stripe shows Jun 9, 2026)
 - ‹SUBSCRIPTION_PK›      → <UUID from Supabase Block 1 row 1A>

Screenshots attached:
 - [ ] customer page header
 - [ ] subscription detail page (Status pill + Current period line visible)

Ready to paste Block 2 with ROLLBACK; first pass.
```

After Block 2's COMMIT pass, append:

```
Block 2 COMMIT pass:
 - B1 UPDATE public.subscriptions: UPDATE 1
 - B2 UPDATE public.profiles:      UPDATE 1   (or "UPDATE 0 (already correct)")
 - PART D1: current_period_end = 2026-06-09T06:16:41+00:00, status unchanged
 - PART D2: premium_status=active, premium_expires_at >= corrected
 - PART D3: byte-identical to PREVIEW A3 (gift table untouched)
 - PART D4: 1 row matching D2

Block 3 (A36 verify) run ~1 min later: every PART V4 verdict PASS,
PART V5 final_is_premium = true, me_entitlement_status = 'active'.
```

---

## 6 · What this checklist deliberately does NOT do

- Does **not** call any Stripe API. Pure dashboard-eyeball check.
- Does **not** include her `cus_…` or `sub_…` ids — those come from the
  live lookup, intentionally not committed to git.
- Does **not** trust the `public.subscriptions` row, the `public.profiles`
  row, or the webhook events table — those are the suspect mirror (the
  whole point of Block 2 is that they drifted from Stripe). Stripe
  Dashboard is the only source of truth here.
- Does **not** authorize the apply. Even after all 5 environment checks
  and both STOP gates pass, Block 2's first run is still ROLLBACK; the
  PART D panels are the final go/no-go before flipping to COMMIT.

---

## Source

- Applied to `reports/CUSTOMER-mylinh-apply-package.md` (PR #801).
- Recon backing every value: `reports/RECON-mylinh-paid-but-free-B5.md`
  (origin `b5/mylinh-sql-regen`).
- Verify run AFTER apply: `reports/VERIFY-mylinh-postapply-A36.sql`
  (origin `a36/mylinh-postapply-verify`).
