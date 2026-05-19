# RECON — billing price data-quality (B53)

> Status: diagnostic. NO writes performed. Read-only service-role probes only.
> Dispatched off B42's two side findings. Branch `b53/price-data-quality-diagnostic`.
> Pairs with `reports/REMEDIATION-price-map-placeholders-B53.sql`.

## Verdict

**Two independent defects, one shared root cause for the bigger one.**

- **Finding 1 (NULL `provider_price_id` "active" sub):** NOT a webhook-ingestion
  bug. The row is a hand-seeded **app-store/Stripe reviewer comp account**
  (`cus_demo_reviewer_2026` / `sub_demo_reviewer_2026`, `raw_payload = null`,
  every `provider_*` column null). No Stripe webhook code path produces this
  shape. Attribution from `raw_payload` is **impossible** (it is null) — so
  Option A (one-row price_id backfill) is **not applicable**; fabricating a
  price_id would inject fake revenue into MRR. Recommend: leave it, or
  decision-gated metadata tag so MRR excludes the comp.
- **Finding 2 (stale `price_replace_*` placeholder rows):** PR #700's
  **one-shot SQL Editor patch was never applied to live prod.** Migration
  files do not touch this drifted Supabase (CLAUDE.md → Supabase). The
  placeholders survive *and* — same root cause — the PR #700 **primary** fix
  (yearly price-id reconciliation) is also unapplied: 3 active yearly subs
  currently map to **nothing** in `billing_price_map`. Placeholder DELETE is
  safe (zero consumers) → `REMEDIATION-price-map-placeholders-B53.sql`. The
  yearly-row gap is **B42's territory** (`b42/price-map-missing-row` RUNBOOK)
  — flagged here, not fixed here, to avoid collision.

## Evidence

### Finding 1 — the NULL-price "active" sub (full row)

```
GET /rest/v1/subscriptions?id=eq.a03266db-9618-4c28-9a06-44594b66524c
```
```json
{
  "id": "a03266db-9618-4c28-9a06-44594b66524c",
  "user_id": "c4780775-7f21-487b-8f1c-73dc88da1cf9",
  "provider": "stripe",
  "app_id": "mercyblade",
  "customer_id": "cus_demo_reviewer_2026",
  "subscription_id": "sub_demo_reviewer_2026",
  "status": "active",
  "tier": "pro",
  "current_period_start": "2026-04-28T19:32:31.052159+00:00",
  "current_period_end":   "2027-04-28T19:32:31.052159+00:00",
  "created_at":           "2026-04-28T19:32:31.052159+00:00",
  "updated_at":           "2026-04-28T19:32:31.052159+00:00",
  "provider_price_id": null, "provider_customer_id": null,
  "provider_subscription_id": null, "provider_product_id": null,
  "product_id": null, "price_id": null,
  "raw_payload": null, "metadata": {}, "provider_metadata": {},
  "environment": "production"
}
```

Why this is NOT a webhook failure (root cause, by layer = **data shape /
ownership**, not external/ingestion):

- The Stripe webhook insert mapper `supabase/functions/stripe-webhook/subscription-insert.ts:58-59`
  **always** writes `provider_customer_id` and `provider_subscription_id`
  (required params). This row has both null + `raw_payload` null + `metadata {}`.
  No webhook path emits that shape.
- `created_at == updated_at == current_period_start` to the microsecond, and
  `current_period_end` is exactly +1 year — the signature of a programmatic
  `now()`→`now()+1yr` **manual/comp grant**, never a Stripe period (Stripe
  periods are unix-second-aligned, not microsecond-aligned to insert time).
- Identifiers are literal synthetic strings `cus_demo_reviewer_2026` /
  `sub_demo_reviewer_2026` written into the **legacy mirror** columns
  (`customer_id`/`subscription_id`/`tier`) — a hand-seeded reviewer demo so an
  app-store/Stripe reviewer can exercise the paid tier without paying.

→ The B42 hypothesis "separate webhook-ingestion data-quality issue" is a
**wrong premise**. The webhook is not implicated. `provider_price_id` is null
because a manual seed never set it; there is no Stripe payload to extract from.

`getSubscriptionPriceId` / `getCheckoutSessionPriceId`
(`supabase/functions/stripe-webhook/core.ts:636-688`) read
`subscription.items.data[0].price.id` ?? `metadata.price_id` ?? null — a
genuine webhook-null would still carry a `raw_payload` and provider ids. This
row carries none. Confirmed not the webhook.

### Finding 2 — billing_price_map live state

```
GET /rest/v1/billing_price_map?order=created_at   (4 rows)
```
| id | price_id | plan | is_active | notes | created |
|---|---|---|---|---|---|
| `19a53680-…2080ce` | **`price_replace_monthly`** | VIP Monthly | true | "Mercy Blade monthly premium" | 2026-04-03 15:55 |
| `0384314a-…e8e22c72` | **`price_replace_yearly`** | VIP Yearly | true | "…yearly premium normalized…" | 2026-04-03 15:55 |
| `33bd028c-…f5805fd` | `price_1TCKY02K1tPxy04uCHQNbvik` | VIP Monthly | true | real monthly | 2026-04-03 16:05 |
| `b950361e-…d61fbe616` | `price_1TCW5p2NqcfRsoh4SghDrMQv` | VIP Yearly | true | **WRONG yearly id** | 2026-04-03 16:05 |

`provider_price_id` actually used by real subs (`GET /subscriptions?select=provider,status,provider_price_id`, n=9):

| provider | status | price_id | count | maps to billing_price_map? |
|---|---|---|---|---|
| stripe | active | `price_1TCKY02K1tPxy04uCHQNbvik` | 4 | ✅ row 3 |
| stripe | trialing | `price_1TCKY02K1tPxy04uCHQNbvik` | 1 | ✅ row 3 |
| stripe | active | `price_1TCKSF2K1tPxy04uNeKcQWp5` | **3** | ❌ **NO ROW** (row 4 has wrong id) |
| stripe | active | `null` | 1 | n/a (Finding 1 comp) |

No subscription anywhere references `price_replace_monthly` / `price_replace_yearly`.

PR #700 (commit `089bafe4c`) changed **only** the migration file
`supabase/migrations/20260403000000_billing_price_map.sql` (DELETE
placeholders + reconcile yearly id → `price_1TCKSF2K1tPxy04uNeKcQWp5`). Its
own commit body states: *"a one-shot SQL Editor patch was run by hand to clear
them + reconcile the yearly id on the live database."* Prod proves that hand
patch **was never run**: both placeholders present `is_active=true`, yearly row
still the wrong `price_1TCW5p2NqcfRsoh4SghDrMQv`, correct
`price_1TCKSF2K1tPxy04uNeKcQWp5` **absent entirely**.

### Consumers of `billing_price_map`

- Application code: **none.** `grep -rn billing_price_map src api supabase/functions`
  → only the migration + one test *comment* in
  `src/billing/recomputeAndPersistEntitlement.test.ts:139`. No runtime read.
  Entitlement derives from subscription **status**, not price_id (PR #700's
  own test asserts a stale/wrong price_id must NOT lock a user).
- DB view `billing_mrr_inputs_v` LEFT JOINs it on
  `provider='stripe' AND price_id=s.provider_price_id AND is_active=true`.
  No sub has `provider_price_id IN ('price_replace_*')` → the placeholder rows
  produce **0 join rows**. Deleting them changes the view by exactly nothing.

## Root cause

| Finding | Layer | Mechanism |
|---|---|---|
| 1 | data shape / ownership | Manual reviewer-comp seed wrote legacy mirror columns only; never set `provider_price_id`. No webhook involved. No `raw_payload` → nothing to attribute from. |
| 2 | external / process | PR #700 merged the migration-file edit; the **separate** hand-applied SQL-Editor patch it explicitly required was never run (migration files don't reach this drifted prod DB). Result: placeholders persist **and** the yearly id is still wrong (3 active yearly subs map to nothing). |

## Impact

- **Finding 1:** No entitlement risk (status-driven). Minor analytics caveat
  only: the comp shows in `billing_mrr_inputs_v` with NULL mapped amount —
  active-sub **count** +1, revenue contribution **0** (correct for a comp).
  Not a money leak. Severity: **low / cosmetic**.
- **Finding 2 (placeholders):** Pure dead rows, zero consumers, zero MRR
  effect. Severity: **low / hygiene**. Safe to DELETE.
- **Finding 2 (the bigger discovery — yearly id still unreconciled):**
  3 active **yearly** subs (`price_1TCKSF2K1tPxy04uNeKcQWp5`) map to NO
  `billing_price_map` row → ~2,000,000 VND/yr each ≈ **~6,000,000 VND/yr of
  real yearly revenue still invisible in MRR.** This is exactly the bug PR
  #700 was opened to fix, still **live**. Severity: **medium, money-path
  reporting** — but **owned by B42** (`b42/price-map-missing-row` RUNBOOK,
  commit `202bfffa5`). Surfaced here for coordination; **not fixed by B53** to
  avoid two agents writing the same row.

## Fix recommendation

**Finding 2 (B53 scope) — Option B, DELETE the placeholders.** Smallest safe
change: PK-keyed DELETE of the two placeholder UUIDs. No consumer to fix first
(none exists). Executable: `reports/REMEDIATION-price-map-placeholders-B53.sql`
(B29 7-part shape, BEGIN/ROLLBACK, HANDOFF ONLY — Chau applies once via SQL
Editor). The same operator session should ALSO apply B42's yearly
reconciliation (insert/repoint `price_1TCKSF2K1tPxy04uNeKcQWp5`) — see B42's
RUNBOOK; B53 deliberately does not include that statement.

**Finding 1 — no executable remediation; product decision required.**
Attribution is impossible (null `raw_payload`, no Stripe linkage). Do **NOT**
fabricate a `price_id` — it would inject phantom revenue. Two acceptable paths,
Chau decides (neither auto-run):

1. **Leave as-is** (recommended) — null price on a non-paying comp is honest;
   the NULL mapped amount in MRR is correct (0 revenue).
2. **Tag for analytics exclusion** — mark the comp so dashboards can filter it
   from "active paying subscribers". Decision-gated, non-executable snippet:

   ```sql
   -- DECISION REQUIRED — NOT a B53 deliverable, do NOT auto-run.
   -- Tags the reviewer comp so MRR/active-paying queries can exclude it.
   -- BEGIN; UPDATE public.subscriptions
   --   SET metadata = jsonb_set(coalesce(metadata,'{}'::jsonb),
   --                            '{comp_account}', 'true'::jsonb),
   --       updated_at = now()
   --   WHERE id = 'a03266db-9618-4c28-9a06-44594b66524c'
   --     AND customer_id = 'cus_demo_reviewer_2026'   -- guard: only the comp
   --     AND provider_subscription_id IS NULL;        -- guard: not a real sub
   -- ROLLBACK;  -- flip to COMMIT only after Chau approves the schema choice
   ```
   (Requires agreeing a `metadata.comp_account` convention + updating the MRR
   view to honor it — out of B53 scope; raise as a follow-up if wanted.)

## Worktree disposition

`prune` — findings fully captured here; the only executable (placeholder
DELETE) is committed as `REMEDIATION-price-map-placeholders-B53.sql`. The
yearly-reconciliation gap is recorded for B42; nothing in this worktree is
load-bearing once both files are committed.
