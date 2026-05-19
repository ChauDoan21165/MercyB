# RUNBOOK — Apply the mylinh paid-but-free fix (A26)

Operator: **Chau, in one sitting.** Read time ~5 min · Run time ~10 min.
Target SQL: `reports/REMEDIATION-mylinh-paid-but-free-B5.sql` (A2/B57 salvage skeleton).
User: `mylinh.nutrition@gmail.com` · `user_id = cd9b889c-eb9f-428f-9462-de66d4f92c04`.

> This SQL is a **skeleton with 4 blanks** you fill from one Stripe lookup and
> one DB preview, then commit once. You never edit the logic — only the blanks.
> If any **STOP** fires, you close the tab without committing and report back.

---

## A. Pre-flight (1 min — confirm all three, then start)

1. **Stripe Dashboard** — open `https://dashboard.stripe.com` in a tab and confirm
   you are logged in (top-right shows your account, not a login screen).
   Confirm you are in **live mode**: the top-left has a toggle; it must **not**
   say "Test mode" (no orange "Test" banner across the top).
2. **Supabase SQL Editor** — open the project SQL Editor in a second tab
   (project `buemdfxyhxunzpgdoqin`), confirm a query window is ready.
3. **The SQL file** — open `reports/REMEDIATION-mylinh-paid-but-free-B5.sql`
   from branch `b57/mylinh-sql-salvage` in a third tab/editor. Confirm the last
   line (≈221) reads `ROLLBACK;` (not `COMMIT;`).

The 4 blanks you will fill (everything else is already correct):

| Blank | Comes from | Expected |
|---|---|---|
| `:corrected_period_end` | **Stripe** (step B) | `'2026-06-09T06:16:41+00:00'` |
| `:premium_status_target` | **Stripe** status (step B) | `'active'` |
| `:subscription_pk` | **DB PREVIEW** (step C) | a uuid Stripe prints |
| `:gift_period_end` | **DB PREVIEW** (step C) | usually: delete this line |

`:provider_subscription_id` and `:sub_status_pre` appear in the comments but are
**not blanks** — they are display-only PREVIEW columns. Do not hunt for them.

---

## B. Stripe Dashboard lookup (2 min)

1. **Find Customers.** Left sidebar of dashboard.stripe.com. The icon is a
   small **two-person silhouette** labelled **"Customers"** (top group of the
   nav, under the Stripe logo / Home). Click it.
2. **Search her.** Top of the Customers page is a search box ("Search by email,
   name…"). Type `mylinh.nutrition@gmail.com` and press Enter. One row should
   match — the email in the row matches exactly. Click that row.
3. **Her customer page opens.** Header shows her email. Scroll to the
   **"Subscriptions"** card (a panel listing her subscription(s), each a clickable
   row with a coloured **status pill** on the right — green = Active).
4. **Open the subscription.** Click the active subscription row. The
   subscription detail page opens.
5. **Record TWO things, exactly:**
   - **Status** — the pill near the top-left of the subscription page. It will
     read one of: `Active`, `Trialing`, `Past due`, `Canceled`, `Unpaid`,
     `Incomplete`, `Paused`. *(There is no "grace period" pill in Stripe — that
     is an internal app concept; ignore it as a literal label.)*
   - **Current period end** — on the subscription page there is a **"Current
     period"** line / a **"Next invoice"** or **"Renews on"** date, shown as e.g.
     `May 9 – Jun 9, 2026`. The **end** of that range is the value you want.
     Record the **date** (the exact second is supplied below, see step B-7).

6. **STOP gate — Status.**
   - Status = **Active** → continue (clean path).
   - Status = **Trialing** or **Past due** → continue through ROLLBACK only,
     then **STOP at step D** (do **not** COMMIT) and report — A2's SQL writes one
     value into two status columns and that mapping is unconfirmed for non-Active
     (see "Known ambiguities" at the bottom; this needs A2/Chau sign-off).
   - Status = **Canceled / Unpaid / Incomplete / Incomplete expired / Paused**
     → **HARD STOP. Do not run the SQL at all.** This is a different defect,
     not the stale-period bug. Report the status and stop here.

7. **STOP gate — period-end date.** The corrected timestamp is the exact decode
   of Stripe's own freshness epoch: **`2026-06-09T06:16:41+00:00`**.
   - If the Stripe "current period end" date is **June 9, 2026** → use exactly
     `'2026-06-09T06:16:41+00:00'` for `:corrected_period_end`. (Stripe's UI may
     only show the date; the second-precise value is authoritative because it
     decodes exactly from Stripe's own object_time.)
   - If Stripe shows **any other date** → **STOP.** Do not run. Her state has
     drifted past B5's diagnostic; report the Stripe date you saw. Do not
     silently reconcile.

8. Set, in the SQL file's blanks: `:corrected_period_end` →
   `'2026-06-09T06:16:41+00:00'`, and `:premium_status_target` → `'active'`
   (only if Status was Active per step B-6).

---

## C. SQL Editor — PREVIEW pass (2 min)

1. Paste the **entire** SQL file into the SQL Editor. Confirm the last line is
   still `ROLLBACK;`. Run it. Because it is wrapped in `BEGIN … ROLLBACK`,
   **nothing persists** on this pass — it only shows you the reads.
2. Read **PREVIEW** output (the PART 4 block — first results panel):
   - **subscriptions read** — must be **exactly 1 row**. Note its
     `subscription_pk` value (a uuid). Confirm `current_period_end` =
     `2026-05-09T06:16:41+00:00` (the stale value).
     - **STOP** if 0 rows, >1 row, or the period is not exactly that stale value
       → state changed since diagnosis; close tab, report, do not proceed.
   - **profiles read** — note `premium_status` and `premium_expires_at`.
   - **user_subscriptions read** — this is the gift table.
     - **No rows** → in the SQL, in the `profiles` UPDATE, **delete the line**
       `:gift_period_end ...` inside `GREATEST( … )` (≈ line 189) and its
       trailing comma so `GREATEST(:corrected_period_end, premium_expires_at)`
       remains valid. (A2's comment at that line instructs exactly this.)
     - **A gift row exists** → set `:gift_period_end` to that row's
       `current_period_end` value (quoted, e.g. `'2026-11-11T00:00:00+00:00'`).
       Note this in your report — its presence was never confirmed in evidence.
3. Fill the remaining blanks in the SQL: `:subscription_pk` → the uuid from the
   PREVIEW subscriptions read. Double-check **all 4 blanks** are now real values
   (search the file for a leading `:` — only `:provider_subscription_id` and
   `:sub_status_pre` may remain, those are comment-only).

## C-bis. SQL Editor — dry-run with blanks filled (1 min)

4. Re-run the file **with `ROLLBACK;` still as the last line.** Now the two
   UPDATEs execute inside the rolled-back transaction. Read the result panels:
   - **B1 = UPDATE public.subscriptions** → expect **`UPDATE 1`**.
   - **B2 = UPDATE public.profiles** → expect **`UPDATE 1`**
     (or `UPDATE 0` *only if* PREVIEW showed `premium_expires_at` already ≥
     `2026-06-09T06:16:41+00:00` — see ambiguity note; if so, STOP and report).
   - **VERIFY** (PART 5): `D1` = subscriptions now shows
     `current_period_end = 2026-06-09T06:16:41+00:00`, status `active`.
     `D2` = profiles shows `premium_status = active`,
     `premium_expires_at ≥ 2026-06-09T06:16:41+00:00`.
   - **GUARD** (PART 2): `D3` = user_subscriptions is byte-identical to the
     PREVIEW read of the same table (this block never writes it).
   - **STOP** if B1 ≠ `UPDATE 1`, or D1/D2 are not as above → close tab without
     committing, report the exact output, do **not** edit logic and re-run.

## C-ter. SQL Editor — COMMIT (30 sec)

5. Only if every check in C-bis passed **and** no STOP fired: change the single
   word on the last line from `ROLLBACK;` to `COMMIT;`. Change nothing else.
6. Run **once**. Confirm the panels again show `UPDATE 1` / `UPDATE 1` and the
   same VERIFY values. It is now persisted.

---

## D. Confirmation — paste this back to chat

> mylinh SQL applied via Supabase SQL Editor (live, COMMIT).
> Stripe Status = **Active**, Stripe period end = **Jun 9 2026**.
> B1 (UPDATE subscriptions): **UPDATE 1**
> B2 (UPDATE profiles): **UPDATE 1**  ← or "UPDATE 0 (gift already longer)"
> D1 subscriptions: current_period_end = 2026-06-09T06:16:41+00:00, status = active
> D2 profiles: premium_status = active, premium_expires_at = <value shown>
> D3 user_subscriptions: unchanged vs PREVIEW (gift row: <yes+date / none>)
> :gift_period_end → <value used / line deleted, no gift row>

If you hit a STOP instead, paste: which step, the Status pill, the Stripe
period-end date you saw, and any row count / value that was off — **and that
you closed the tab without committing.**

---

## E. Rollback / abort procedure

- The SQL is self-protecting: until you change `ROLLBACK;` to `COMMIT;`,
  **nothing is ever written.** Aborting = just close the SQL Editor tab.
- If a STOP fires (Status not Active; wrong date; row count off; B1 not
  `UPDATE 1`; VERIFY off): **close the SQL Editor tab without changing
  ROLLBACK to COMMIT.** Do **not** tweak the WHERE clause, retype a value, or
  re-run to "see if it works." Report exactly what you saw and stop.
- If you already committed and VERIFY then looked wrong: do **not** run
  anything else. Report immediately with the full VERIFY output — recovery is a
  human-reviewed follow-up, not a blind second UPDATE.

---

## Known ambiguities in A2's SQL (read before you start)

1. **One status value, two columns.** A2's SQL writes `:premium_status_target`
   into **both** `subscriptions.status` and `profiles.premium_status`. This is
   clean when Stripe Status = **Active** (both → `'active'`). For
   Trialing / Past due the correct mapping is unconfirmed (subscriptions.status
   arguably mirrors Stripe; profiles.premium_status is the entitlement gate) —
   that is why non-Active is a STOP-before-COMMIT, not an auto-proceed.
2. **profiles guard keys on expiry only.** The `profiles` UPDATE only fires if
   `premium_expires_at` is null or < corrected. If a longer gift already pushed
   `premium_expires_at` past Jun 9, `B2` = `UPDATE 0` and **`premium_status` is
   NOT flipped** even if it is currently wrong. If PREVIEW shows
   `premium_status` already `active`, this is harmless; if PREVIEW shows it
   wrong **and** a longer gift exists, STOP — A2's SQL can't fix that case.
3. **Branch name.** The dispatch said `b5/mylinh-sql-regen`; the real branch is
   `b57/mylinh-sql-salvage` (same two files, verified by content). No action.
