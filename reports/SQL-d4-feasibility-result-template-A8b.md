# D4 `raw_payload` Feasibility — Result Template + Decision Tree (A8b)

**Agent:** A8b (template-and-decision-tree only) · **Branch:** `docs/raw-payload-feasibility-result`
**Labels:** silent-failure, money-path, D4, feasibility-gate
**Source query (single source of truth):**
[`reports/SQL-p0-price-map-bridge-A8.md` Block 3 in PR #798](https://github.com/ChauDoan21165/MercyB/pull/798)
**D4 strategic context:**
[`reports/RECON-mrr-source-D4-A8.md` flip-condition #4 on `origin/b69/d4-mrr-source-strategic`](https://github.com/ChauDoan21165/MercyB/tree/b69/d4-mrr-source-strategic/reports/RECON-mrr-source-D4-A8.md)

> **Purpose.** This file is the **landing zone** for the one read-only query
> Chau runs at the SQL Editor to decide whether the D4 (b2) `unit_amount`
> backfill is feasible from the database alone. A8b cannot run it (no prod
> credentials, D6: no unattended catalog path). This template fixes the query
> wording, fixes the result categories, and fixes the next-dispatch decision
> per category — so when Chau pastes the result there is no second judgment
> call.

---

## 1. The query (verbatim from PR #798)

This is the **same text** as PR #798's Block 3. Single source of truth — if it
ever changes here, change it there first.

```sql
-- Read-only. Service-role via SQL Editor. Returns one number.
SELECT count(*) AS unit_amount_missing
FROM   public.subscriptions
WHERE  status IN ('active','trialing','past_due')
  AND  provider = 'stripe'
  AND  (
         raw_payload IS NULL
         OR raw_payload #> '{items,data,0,price,unit_amount}' IS NULL
       );
-- expect 0
```

**What the number is.** Count of currently-billing Stripe subscriptions whose
`raw_payload` either does not exist or does not carry a `unit_amount` at the
canonical JSON path `items.data[0].price.unit_amount`. This is the JSON path
the D4 (b2) backfill would read to populate the proposed `unit_amount_minor`
column. A row that does not have it cannot be backfilled from the DB alone —
it would need a Stripe-API replay.

**Why active/trialing/past_due only.** Per A8 D4 RECON §"Where MRR is computed
today", the `billing_mrr_inputs_v` view restricts to exactly these statuses.
Historical `canceled`/`incomplete_expired` rows do not contribute to MRR and
therefore do not need a backfill — narrowing the gate to the same set is the
honest comparison.

---

## 2. Result categories

The query returns one integer. Bucket it:

| Bucket | `unit_amount_missing` | Meaning | D4 (b2) backfill feasibility |
|---|---|---|---|
| **(a)** | **0** | Every active priced Stripe sub carries the amount at the canonical JSON path. | **Feasible from DB alone.** Proceed to D4 P2. |
| **(b)** | **1–100** | A small recoverable gap. Pre-`team_c` / pre-`20260319` cohort. Per-row inspection is tractable. | **Recoverable.** Document each row, decide per-row (DB shape-shift vs. Stripe-API replay vs. exclude). |
| **(c)** | **>100** | Systemic gap. The (b2) JSON assumption does not hold on a meaningful slice of live data. | **Not viable as designed.** D4 (b2) needs a revised plan (Stripe-API-driven backfill becomes the path of record, raising cost). |

**Boundary note.** The 1/100 boundary is a discipline cliff, not a math cliff
— it forces a different *process* (per-row recovery vs. systemic redesign),
not a different *outcome*. If the count is 0 (a) the answer is unambiguous; if
it is 1 the answer is unambiguous; the boundary cases (e.g., exactly 100, or
99 vs. 101) require Chau's judgment on whether per-row inspection is still
tractable that day. Round trips beat false precision: if the count is in the
80–120 range, treat it as bucket (b) **and** open a follow-up scoping recon
before any per-row work.

---

## 3. Decision tree — which dispatch is next

### Bucket (a) — count = 0 → **PROCEED to D4 P2**

Next dispatches, in order:

1. **Confirm B48 P1 has landed** (single `deriveEntitlement` write-path
   consolidation). D4 (b2) sequences *after* P1 per A8 RECON §Recommendation
   step 4. If P1 is not in `main`, **STOP** — hold (b2) until P1 lands.
2. **Open the (b2) implementation scoping dispatch.** Suggested label:
   `D4-P2-b2-implementation-scoping`. Scope:
   - Schema: add `unit_amount_minor BIGINT`, populate the existing-but-dead
     `currency_code` + `billing_interval` + `billing_interval_count` columns
     on `public.subscriptions`.
   - Webhook write path: `subscription-insert.ts` projects from `price.*` on
     every `customer.subscription.*` + `invoice.paid` event.
   - One-shot historical backfill from `raw_payload` (Chau-applied via SQL
     Editor, D6).
   - View rewrite: `billing_mrr_inputs_v` → `CASE billing_interval WHEN 'year'
     THEN unit_amount_minor / interval_count / 12 ELSE unit_amount_minor / 12
     ... END` with zero-decimal currency `CASE` (kills the `formatMoney`
     trap surface from one source).
   - RevenueCat parity: `revenuecat-webhook/projection.ts` starts persisting
     `price`/`currency` from `RcEvent` (closes the cross-cutting blind spot
     from A8 RECON §RevenueCat).
3. **B42 INSERT + the `b64/price-map-repair-sql` bridge from PR #798 are
   independent** — they still ship as the P0 bridge regardless of (a), do not
   wait on (b2).

### Bucket (b) — count = 1–100 → **PARTIAL FEASIBILITY, per-row recovery**

Next dispatches, in order:

1. **Run the per-row inspector** (read-only, append to this file under §4
   below as a follow-up). Query template — paste this after the count query,
   one paste:

   ```sql
   -- Read-only. Service-role via SQL Editor. Returns row-by-row diagnostic.
   SELECT id,
          user_id,
          provider_subscription_id,
          status,
          created_at,
          (raw_payload IS NULL)                                    AS payload_null,
          (raw_payload #> '{items,data,0,price,unit_amount}')      AS extracted_amount,
          jsonb_object_keys(coalesce(raw_payload, '{}'::jsonb))    AS top_level_keys
   FROM   public.subscriptions
   WHERE  status IN ('active','trialing','past_due')
     AND  provider = 'stripe'
     AND  (
            raw_payload IS NULL
            OR raw_payload #> '{items,data,0,price,unit_amount}' IS NULL
          );
   ```

2. **Classify each row** into one of three sub-buckets:
   - **Shape-shifted** (`payload_null=false`, `extracted_amount=null`, but
     `top_level_keys` contains something like `data.object.items` instead of
     `items` directly): the amount is in `raw_payload` but at a different JSON
     path. (b2) backfill needs a multi-path extractor (`COALESCE` over a small
     set of known historical shapes).
   - **Truly empty** (`payload_null=true`): row was written before
     `team_c`/`20260319` widened the schema. Needs a Stripe-API call against
     `provider_subscription_id` to recover the amount.
   - **Non-Stripe-paying** (e.g., NULL `provider_subscription_id`,
     `de…@m……….com`-style internal/comp account): exclude from (b2) by
     predicate, not backfill.

3. **Open the (b2) scoping dispatch** as in (a), **plus** a `D4-P2-recovery`
   side dispatch authoring the per-row recovery SQL/Stripe-API plan. The (b2)
   migration **must** wait for the recovery to complete (or to explicitly
   accept the un-recoverable rows as excluded), otherwise it ships with
   silent 0-MRR rows.

### Bucket (c) — count >100 → **STOP. D4 (b2) not viable as designed.**

Next dispatches, in order:

1. **Halt the D4 (b2) workstream.** Do not open the (b2) scoping dispatch.
2. **Open a revised D4 plan recon** — suggested label: `D4-revised-plan-recon`.
   Required scope:
   - Option A: D4 (b2) with a Stripe-API-driven historical backfill as
     primary mechanism, `raw_payload` as fallback. Cost: high (rate-limited
     API replay against `provider_subscription_id` for >100 rows).
   - Option B: D4 (b1) — view-only `raw_payload` JSON extraction in
     `billing_mrr_inputs_v`. Same gap exposure, but no migration; the >100
     rows simply don't contribute to MRR (status quo for them, no regression
     vs. today's `billing_price_map` gap).
   - Option C: **Keep `billing_price_map` indefinitely.** D4 RECON
     flip-condition #4 was always: "non-zero count → flip toward (a)+B52
     Option A as the bridge until the historical rows are repaired." A
     systemic gap is the strongest evidence for this flip. **B52 Option A
     ships** as the durable solution rather than the bridge.
3. **B42 INSERT + the P0 bridge in PR #798 still ship.** Bucket (c) does not
   change today's bleed; the bridge stops it for the known yearly price
   regardless of (b2) feasibility.

---

## 4. Result — paste here

After Chau runs the §1 query at the SQL Editor, paste the output verbatim
inside the fence below. Then complete §5.

```
<!-- CHAU: paste the SELECT output here. Expect one row, one column. -->


```

If bucket (b) or follow-up inspection was run, also paste the §3.(b).1
per-row inspector output here (it is fine to have multiple fences):

```
<!-- Optional: paste per-row inspector output here if applicable. -->


```

---

## 5. Decision recorded

After §4 is populated, complete this footer in the same PR or in a
documenting commit on top of it. **One** of the three lines should remain;
delete the other two.

- [ ] **Bucket (a) — count = 0.** D4 (b2) feasibility: **GO**.
      Next dispatch: confirm B48 P1 status, then open D4 P2 (b2)
      implementation scoping.
- [ ] **Bucket (b) — count = N (1–100).** D4 (b2) feasibility: **CONDITIONAL
      GO**. Per-row recovery first; (b2) gated on recovery completion.
      Next dispatch: D4 P2 (b2) scoping + D4-P2-recovery side scoping.
- [ ] **Bucket (c) — count = N (>100).** D4 (b2) feasibility: **NO-GO as
      designed**. Next dispatch: D4 revised-plan recon (A/B/C options above).

**Recorded by:** _Chau_  ·  **Date:** _YYYY-MM-DD_  ·  **Snapshot UTC:** _YYYY-MM-DDTHH:MM:SSZ_

---

## 6. Reference

- **Query source:** PR #798 → `reports/SQL-p0-price-map-bridge-A8.md` Block 3.
- **D4 flip-condition #4:** `origin/b69/d4-mrr-source-strategic` →
  `reports/RECON-mrr-source-D4-A8.md` §Confidence & what would flip it · #4.
- **B42 RUNBOOK / B64 SQL:** the P0 bridge that ships regardless of this
  result (`origin/b42/price-map-missing-row`, `origin/b64/price-map-repair-sql`).
- **B30 Q5a finding:** `reports/RECON-monitor-query-baseline-B30.md` on `main`
  @ `98e05a40` — the trigger for the bridge.

---

## Status

- **No SQL executed by A8b.** Template-and-decision-tree only.
- **No production data touched.**
- **No code edited.** Pure docs PR.

*A8b — template only. The query body is owned by PR #798; this file is the
landing zone for Chau's one paste + one decision.*
