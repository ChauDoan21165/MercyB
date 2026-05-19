# RECON — MRR source of truth: `billing_price_map` join vs. Stripe amount on the row (D4 / A8)

> **Strategic comparison. NO code, NO migration.** Resolves B48's strategic
> decision **D4** ("MRR source of truth: `billing_price_map` join, or trust
> Stripe amounts on the subscription row?") and tells us whether implementing
> **B52 Option A is even worth it**.
>
> Branch: `b69/d4-mrr-source-strategic` off `origin/main` @ `5cfa27e3f`
> Date: 2026-05-19 · Labels: `silent-failure`, `money-path`, `strategic`
> Convention: B16 (`reports/RECON-<topic>-<agent>.md`, commit-don't-PR)
> Cross-refs (committed, quotable): `RUNBOOK-price-map-row-B42.md`,
> `RECON-price-map-autoupsert-B52.md`, `RECON-billing-target-state-B48.md` §D4.
> **Grounded in live source reads, not only the sibling recons** — every
> column/call claim below was verified against the worktree, not inferred.

---

## Verdict

**Retire `billing_price_map`. Move MRR to a normalized amount persisted on
the subscription row (end-state b, variant b2), staged.** The map has *two*
documented silent drift incidents (#700, then B42), zero structural defense
against the next one, and a single decisive weakness: it is keyed by a Stripe
price id that Stripe rotates. The amount Stripe charges already arrives on
**every price-bearing event** and is already persisted in
`subscriptions.raw_payload` for Stripe subs — the data is in the building; the
map is a hand-maintained index on top of it that exists only because no one
projected the amount into a queryable shape.

**Is B52 Option A worth implementing? Conditional NO.** Option A (~70 prod +
~80 test LOC on the money path) self-heals *the map*. If D4 commits to
retiring the map, that entire value evaporates on retirement — its own author
flagged it "deleted in the same change if D4 kills the map." The effort is
better spent on the `unit_amount` persistence + one-shot backfill that
end-state (b2) needs anyway. Ship Option A **only** as a bridge if (b2) is
>1 sprint out *and* the B42 class is actively recurring. B42's one-row INSERT
still ships now regardless (free, stops today's bleed, not wasted).

Confidence: **Medium-High (0.7).** Four named conditions below would flip it.

---

## Where MRR is computed today (full call graph, code-verified)

```
subscriptions (raw truth: provider_price_id + raw_payload)
      │  LEFT JOIN on (provider, provider_price_id) WHERE is_active
      ▼
billing_price_map  (hand-curated; ONE writer = seed migration
                    20260403000000; B52 Option A would add a 2nd)
      │
      ▼
billing_mrr_inputs_v   (SQL view: exposes bpm.monthly_amount
                        AS mapped_monthly_amount, WHERE status
                        IN (active,trialing,past_due))
      │
      ▼
admin-billing-metrics/index.ts:226  mrr = Σ mapped_monthly_amount
                              :296  same Σ, split by provider
      │
      ▼
AdminUsersPage.tsx:1256 / AdminUsersKpiGrid.tsx:77
  "Estimated MRR" KPI card  ("Yearly plans normalized to monthly.")
```

**Sole consumers:** the `billing_mrr_inputs_v` view → `admin-billing-metrics`
edge fn → the admin "Estimated MRR" KPI. Nothing else. `delete-account`
explicitly skips the view (`user-data-manifest.ts:297 action: skip_view`).
Entitlement derives from `subscriptions.status`, **never** the map.
**Blast radius = admin reporting only** (confirms B52 "money-visibility
integrity, not revenue-loss or paywall"). This severity framing is unchanged
by D4 — both end-states keep MRR a reporting projection.

**Migration-drift hazard worth one line:** there are *two* historical
definitions of `billing_mrr_inputs_v`. The older `20260402000000` joined
`subscription_tiers` via an `ilike '%level1%'` heuristic on
`provider_price_id`; `20260403000000` does `drop view if exists` then
recreates it on `billing_price_map`. The price-map version is live (later
migration). A `supabase db push` that replayed migrations out of order could
silently resurrect the dead heuristic view — per memory, this DB has known
CLI/migration drift and **no unattended catalog path**, so a view rebuild is
Chau-hand-applied. Note it; do not act on it from D4.

---

## What is actually persisted on a subscription row (decisive — code-verified)

`subscriptions` schema (from `20260315211233` + `20260319000000` team_c)
*defines* these economic columns:

| Column | Schema exists? | **Stripe webhook writes it?** | **RevenueCat writes it?** |
|---|---|---|---|
| `provider` | ✅ | ✅ `"stripe"` | ✅ `"apple"` (hardcoded — even for Google) |
| `provider_price_id` | ✅ | ✅ (`subscription-insert.ts:65`) | ❌ (no Stripe price id exists — correct) |
| `provider_product_id` / `product_id` | ✅ | ✅ | ✅ (store product id) |
| `raw_payload` (jsonb) | ✅ | ✅ (full Stripe payload — **carries `price.unit_amount`/`currency`/`recurring.interval`**) | ❌ **not persisted** |
| `currency_code` | ✅ (team_c) | ❌ **never written** | ❌ |
| `billing_interval` / `billing_interval_count` | ✅ (team_c) | ❌ **never written** | ❌ |
| any `amount` / `unit_amount` column | ❌ **does not exist** | — | — |

Two load-bearing facts:

1. **There is no amount column on `subscriptions`, anywhere.** The economic
   truth for a Stripe sub lives *only* inside
   `raw_payload -> ... -> price.{unit_amount, currency, recurring.interval,
   recurring.interval_count}` (B42 §1 confirmed all 3 yearly subs are
   byte-identical here). `currency_code` / `billing_interval` are **dead
   schema** — DDL shipped, the webhook never populates them. Any "end-state
   (b) = just read the column" assumption is a trap: today there is no column,
   only JSON.
2. **The Stripe payload already carries the amount on every price-bearing
   event** (B52 §"What Stripe sends" table — `created/updated`,
   `checkout.session.completed`, `invoice.paid`, `subscription.deleted`,
   `payment_failed` all carry currency+unit_amount+interval). The handler
   reads `price.id`/`price.product` and **discards the economics** — but
   `raw_payload` retains the whole object, so for Stripe the data is *already
   persisted*, just not projected.

---

## End-state (a): keep `billing_price_map` (+ B52 Option A fill-gap)

**MRR = the join.** Needs persisted on every sub: `provider` +
`provider_price_id` (Stripe path already does; RevenueCat path does not — see
cross-cutting §). Map rows hand-curated; B52 Option A self-heals missing
Stripe rows from payload on first paid event.

| Concern | Behavior |
|---|---|
| **Stripe rotates a price id** | New price → no map row → that sub = 0 MRR. *With* Option A: self-heals on the first paid event (window ≈ one webhook). *Without*: silent until a B42-class manual INSERT. This is the recurrence — **already 2 occurrences** (#700, B42). |
| **Amount changes mid-subscription** | Stripe prices are immutable in amount; a real change = a *new* price_id → handled exactly like rotation. Option A's mandated `ON CONFLICT DO NOTHING` correctly will *not* rewrite a curated row (non-issue: there is nothing to rewrite, the id changed). |
| **Discount / coupon** | `billing_price_map.monthly_amount` is **list price**. The join cannot see Stripe `discount`/`coupon`. MRR **overstates** by the discount. Structurally unfixable in (a) — the map has no per-customer dimension. |
| **Migration cost** | ≈0 for existing Stripe subs (price_ids already persisted). Entire backlog = B42's one-row INSERT + the deferred #700 placeholder cleanup. |
| **Operator effort** | **Ongoing & recurring.** Every new Stripe price = Dashboard lookup + SQL Editor INSERT (B42 RUNBOOK), Chau-hand-applied (D6). Option A removes this *for any price a user actually pays on* (= every price that matters for MRR by definition). Curated `plan_name` stays human. |
| **Reversibility** | **High.** Map + view + Option A are all pure-delete. Flipping to (b) later = a view rewrite + a backfill; no data lost (raw_payload retained). |

---

## End-state (b): retire the map; MRR from amount on the sub/event

Two variants:

**(b1) JSON-extract in the view.** Rewrite `billing_mrr_inputs_v` to compute
`mapped_monthly_amount` from the `raw_payload` price path + a zero-decimal
currency `CASE` + interval normalization (`year → /12`). No schema change, no
backfill (raw_payload already on every Stripe sub).

**(b2) Persist a normalized amount column.** Add `unit_amount_minor` (and
finally populate the dead `currency_code` / `billing_interval` /
`billing_interval_count`) on every webhook write; one-shot backfill historical
rows from `raw_payload`; view becomes
`CASE billing_interval WHEN 'year' THEN amount/12 ... END` with a zero-decimal
`CASE`. Highest correctness, highest cost.

| Concern | Behavior |
|---|---|
| **Stripe rotates a price id** | **Immune.** Amount travels with the event/row, not a side table. This is end-state (b)'s single decisive win and the entire reason D4 leans this way — it structurally extinguishes the B42/#700 class. |
| **Amount changes mid-subscription** | Captured on the next event (renewal/update writes the then-current amount). Strictly more accurate than (a). |
| **Discount / coupon** | Still the hard case. `price.unit_amount` is list price; net charged sits on `invoice.lines[].amount` *after* discount. Neither end-state gets net MRR for free — but (b) *can* read the discounted invoice line; (a) structurally cannot. (See flip-condition #1.) |
| **Zero-decimal currency (VND/JPY/KRW)** | The `÷100` vs `÷1` decision moves from a *curated number* (a) into *live code/SQL* (b). B52 §7.1 already documents `core.ts:221 formatMoney` shipping this exact bug today (`minor/100` unconditional → VND 100× understated). (b) widens the surface this trap can fire — but also creates **one** canonical amount field that fixes `formatMoney` *and* the `resolvePlan()` price-id-string heuristic (B52 §7.2) from a single source. |
| **Migration cost** | (b1): low — view-only, no backfill, but normalization/zero-decimal logic now lives untested in SQL. (b2): **high** — schema + webhook change *on the money path* + one-shot historical backfill from `raw_payload` (Chau-applied, D6) + RevenueCat projection change. |
| **Operator effort** | **≈0 ongoing.** No map, no per-price INSERT, B42 class extinct. The durable operator win. |
| **Reversibility** | (b1): high (re-create map + old view). (b2): **medium** — new columns + backfill persist even if the map is re-added; non-destructive (raw_payload kept) but a one-shot data migration you can't cleanly un-apply without another. |

---

## Cross-cutting: the RevenueCat (Apple/Google) truth — D4 does NOT fix it

`revenuecat-webhook/projection.ts` writes the sub row with `provider:"apple"`
(hardcoded, even for Google), `provider_product_id`/`product_id` = store
product id, `tier`, `status`, period end. It writes **no `provider_price_id`**
(correct — no Stripe price), and it **discards `price` and `currency`** even
though `RcEvent` carries `price?: number` / `currency?: string`
(`types.ts:32-33`) — and it **does not persist `raw_payload` at all**.

Consequence, today, for every RevenueCat sub:

- End-state **(a)**: join = NULL (no `(apple|google, …)` map rows; no writer
  creates them; B42 RUNBOOK is Stripe-only) → **0 MRR**.
- End-state **(b)**: still **0 MRR** *until the projection is changed to
  persist `price`/`currency`* — the data arrives in the RcEvent and is thrown
  away before it touches the DB.

**Therefore D4, by itself, fixes nothing for RevenueCat under either
end-state — a RevenueCat projection change is required regardless.** This is a
pre-existing blind spot, not introduced by D4. It is *latent* right now
(per memory: web-only, native iOS/Android not shipped → ≈0 RevenueCat subs in
practice today) but goes live the moment the app ships on the stores. The
clean place to fix it is exactly (b2): persisting a normalized amount on the
row gives **one consistent "amount on the row" model across all three
providers** — Stripe (from raw_payload), Apple, Google (from the RcEvent
`price`/`currency` the projection currently discards). End-state (a) leaves
RevenueCat permanently unmappable without inventing a second curation surface.

---

## Recommendation

1. **Decide D4 = retire the map → end-state (b), variant (b2), staged.**
   Rationale: price-rotation immunity extinguishes the only recurring
   silent-failure class (2 incidents, no structural defense); the amount is
   already in `raw_payload` for every Stripe sub (low extraction risk); (b2)
   gives one amount model across all 3 providers and is the natural home to
   also kill the `formatMoney` zero-decimal bug and the `resolvePlan()`
   heuristic; operator effort drops to ≈0 ongoing.
2. **B42's one-row INSERT still ships now** (free, Chau-applied, stops the
   ~6,000,000 VND/yr invisibility today). Retirement is a multi-step
   migration; the 3 yearly subs stay invisible until it lands. Not wasted.
3. **Skip B52 Option A** *unless* (b2) is >1 sprint out **and** the B42 class
   is actively recurring before then. Option A is ~70 prod + ~80 test LOC on
   the money path whose entire value is deleted on map retirement (B52's own
   "low sunk cost / deleted with the map" caveat). Redirect that effort into
   (b2)'s `unit_amount` persistence + backfill — the same extractor B52 Option
   A would build for the map is reused, but writing to a durable column
   instead of a side table that's about to be retired.
4. **Sequencing vs. B48:** (b2) is a money-path schema + webhook change with a
   one-shot backfill — it slots into B48's **P2** (write-path consolidation),
   *after* B48-P1 (the single `deriveEntitlement`), not before. B42 INSERT +
   #700 cleanup remain B48-**P0** (data-only, parallel). D4's answer does not
   gate P1; it gates the MRR-projection workstream inside P2.

---

## Confidence & what would flip it

**Medium-High (0.7).** The architecture clearly favors amount-on-row: the data
already lands on every Stripe event, price-rotation immunity is decisive, the
map has two drift incidents and zero structural defense. Held below "High"
because (b2) is a money-path migration with a historical backfill whose
feasibility rests on one unverified assumption (#4 below).

Any **one** of these flips the recommendation:

1. **Net-of-discount MRR is a hard requirement.** Then *neither* "trust the
   row" nor "trust the map" suffices — net revenue lives on
   `invoice.lines[].amount`, not on `price`. That escalates past D4 into a
   proper `billing_facts`/invoice-line model. If Chau confirms gross-list MRR
   is acceptable for the admin KPI (it is labeled "Estimated"), (b2) stands.
2. **A curated human plan taxonomy is a product requirement** (admin wants
   named plans, not just a number). Then keep a *thin* map purely as a
   `price_id → display_name` lookup (or B52 Option C's cron with real product
   names) while MRR math moves to amount-on-row — a hybrid, not pure (a).
3. **Chau wants zero new code on the money path until B48 P1/P2 lands.** Then
   the holding pattern is (a) + B52 Option A as the bridge, (b2) deferred into
   P2; in that world **B52 Option A *is* worth implementing** as the
   stop-the-bleed bridge. (This is the one scenario that revives Option A.)
4. **`raw_payload` is not reliably populated on older historical Stripe
   subs** (pre-`team_c`/pre-`20260319` rows). Then (b2)'s backfill has gaps
   the map (a) doesn't, forcing a Stripe-API backfill and materially raising
   (b2) cost. **Concrete pre-commit check (Chau, SQL Editor, read-only):**
   `select count(*) from public.subscriptions where status in
   ('active','trialing','past_due') and provider='stripe' and (raw_payload is
   null or raw_payload #> '{items,data,0,price,unit_amount}' is null);`
   Expect 0. A non-zero count flips toward (a)+Option A as the bridge until
   the historical rows are repaired.

---

## Does this unblock B52 Option A?

**Yes — and the answer is "don't build it yet."** B52 recommended Option A as
D4-agnostic insurance. This recon resolves D4: the map should be retired, so
Option A's self-heal target is on death row. Build Option A only in flip-state
#3 (zero money-path code until P2) — otherwise its extractor logic should be
written once, against a durable `unit_amount` column (b2), not against a side
table scheduled for deletion.

---

## Worktree disposition

**`prune` — strategic decision fully captured in this committed doc.** No
code, no follow-up worktree. This file resolves B48-D4 and is the go/no-go
input for the B52 Option A implementation dispatch (recommendation: no-go
pending flip-state #3). The (b2) implementation, if approved, is a B48-P2
workstream gated behind P1; it must re-confirm flip-condition #4's
`raw_payload` completeness query before any backfill.

---

*A8 — read-only strategic comparison. No DB writes. No code. No PR.
Branch `b69/d4-mrr-source-strategic`. Awaiting Chau D4 decision.*
