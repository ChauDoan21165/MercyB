# RECON — Subscription-amount column scheme (A42)

> **Design recon only. NO migration, NO code, NO PR.** Defines the persisted
> data model that A8's D4 end-state **(b2)** ("retire `billing_price_map`,
> move MRR to a normalized amount on the subscription row") depends on. A
> future dispatch implements per this spec.
>
> Branch: `a42/subscription-amount-schema` off `origin/main` @ `4fbc3a41f`
> Date: 2026-05-19 · Labels: `money-path`, `schema`, `silent-failure`, `design`
> Convention: B16 (`reports/RECON-<topic>-<agent>.md`, commit-don't-PR — operator artifact)
> Sources (read from their branches, quoted so this doc stands alone):
> `RECON-mrr-source-D4-A8.md` (`origin/b69/d4-mrr-source-strategic`),
> `RECON-revenuecat-mrr-projection-A21.md` (`origin/a21/revenuecat-mrr-projection-scope`),
> `RECON-billing-architecture-as-built-B45.md` (`origin/b45/billing-architecture-map`).
> **Every column / DDL / call claim below was re-verified against live source
> in this worktree**, not inferred from the sibling recons.

---

## TL;DR — the scheme in one paragraph

Add **one** new column `subscriptions.unit_amount_minor INTEGER` (nullable,
`CHECK (… >= 0)`), and finally **wire the three dead columns that already
exist**: `currency_code TEXT`, `billing_interval TEXT`,
`billing_interval_count INTEGER` (all shipped by migration `20260319000000`,
never populated by any writer). Persisted value = the recurring price **in the
currency's own minor units, exactly as the provider reports it** (Stripe
`price.unit_amount`; RevenueCat `Math.round(event.price*100)` with a hard
literal `currency_code='USD'`). **Storage is integer minor-units → zero-decimal
currencies (VND/JPY/KRW) are correct by construction with no ÷100 anywhere.**
All major-unit conversion and yearly→monthly normalization lives in **one
shared immutable SQL function** that both `billing_mrr_inputs_v` and
`admin_users_dashboard_v1` call — so the two MRR surfaces can never drift, and
neither edge-fn consumer changes a line.

---

## 1. As-built ground truth (re-verified, not quoted)

`public.subscriptions` columns relevant to amount, after both DDL migrations:

| Column | DDL origin | Type / constraint (verified) | Written today? |
|---|---|---|---|
| `provider` | `20260315211233` + `20260319000000` | `text`, CHECK ∈ `(stripe,apple,google)` | ✅ Stripe `"stripe"`; RC `"apple"` hardcoded |
| `provider_price_id` | `20260319000000:50` | `text` | ✅ Stripe only; RC never (correct) |
| `raw_payload` | `20260315211233:29` | `jsonb` | ✅ Stripe (full obj); ❌ RC never |
| `currency_code` | `20260319000000:52` | `text`, **no default, no CHECK** | ❌ **never written — dead schema** |
| `billing_interval` | `20260319000000:53` | `text`, CHECK `IS NULL OR ∈ (day,week,month,year)` (`:189`) | ❌ **never written — dead** |
| `billing_interval_count` | `20260319000000:54` | `integer`, CHECK `IS NULL OR > 0` (`:204`) | ❌ **never written — dead** |
| `quantity` | `20260319000000:55` | `integer`, CHECK `IS NULL OR > 0` (`:216`) | ❌ never written |
| **any amount / `unit_amount`** | — | **does not exist in any migration** | — |

> Independently confirmed A8/A21's "no amount column exists anywhere": a grep
> of *every* `supabase/migrations/*.sql` for an `amount`/`unit_amount` column
> add on `public.subscriptions` returns **zero**. The economic truth for a
> Stripe sub lives **only** inside
> `raw_payload -> items -> data -> 0 -> price -> {unit_amount, currency, recurring.interval, recurring.interval_count}`
> (extractor precedent: `stripe-webhook/core.ts:564`
> `subscription?.items?.data?.[0]?.price`, invoice-shape fallback
> `invoice?.lines?.data?.[0]?.price` at `core.ts:562`). For RC it is **thrown
> away before the DB** (`revenuecat-webhook/types.ts:32-33` declares
> `price?: number; currency?: string;`; `projection.ts:65-83` `subRow` never
> references either).

**Live MRR consumer (unchanged by this scheme):**
`billing_mrr_inputs_v` (migration `20260403000000`) =
`subscriptions LEFT JOIN billing_price_map ON (provider, provider_price_id) WHERE status IN (active,trialing,past_due)`
→ exposes `bpm.monthly_amount AS mapped_monthly_amount`
(**`numeric(12,2)`, major units** — prod rows: VIP Monthly `200000.00`,
VIP Yearly `166666.67` = 2 000 000 ÷ 12 pre-normalized) →
`admin-billing-metrics/index.ts:225-226` `mrr = Σ safeNumber(mapped_monthly_amount,0)`,
provider split at `:296`.

**Second consumer (A20's "written-as-null" surface):**
`admin_users_dashboard_v1` — **SQL-Editor drift**, no CREATE in any tracked
migration (only referenced by `20260622000000_revoke_anon_on_internal_views.sql:86`).
Its client `src/pages/admin/AdminUsersPage.tsx:22-58` **already types the row**:
```
plan_interval: string;  currency_code: string;  amount_cents: number;
quantity: number;  unknown_amount: boolean;  unknown_plan: boolean;
KPI: estimated_mrr, estimated_arr   (RPC admin_users_dashboard_kpis_v1)
```
Today these are null because the view selects subscription columns the
webhooks never populate. **The client contract already speaks minor-units
("cents") — this scheme makes those columns real instead of null.**

---

## 2. Design decisions

### 2a. Column name & type — `unit_amount_minor INTEGER` (nullable)

**Decision: `unit_amount_minor integer` — minor units, Stripe convention,
currency-neutral name. NOT `numeric`. NOT named `*_cents`.**

- **Integer minor units, not `numeric` major units.** Stripe's
  `price.unit_amount` is already an integer in the currency's minor unit. A
  currency's minor unit is, by ISO 4217 definition, the *smallest indivisible
  amount* of that currency — so it is **always an exact integer, for every
  currency, including VND** (VND's minor-unit exponent is `0`: 1 minor = 1 VND;
  200 000 VND → `unit_amount_minor = 200000`, no fraction *ever*). The only
  reason the current map needs `numeric(12,2)` is that it stores *major*
  units already divided by 12 (`166666.67`). Persisting **minor integer** and
  doing the ÷12 once in the view eliminates that fudge and the rounding-noise
  it bakes into every yearly sub.
- **Reject `unit_amount_decimal numeric`.** That field shape (Stripe's
  `unit_amount_decimal` string) exists only for sub-minor-unit pricing
  (fractional cents, metered usage). MercyBlade has two flat plans
  (200 000 / 2 000 000 VND); no sub-minor pricing. `unit_amount` (integer)
  is what Stripe actually sends for these prices — verified
  `core.ts:564` reads `price` whole. *Documented assumption:* if a future
  metered/fractional price is introduced, that is a schema amendment
  (`unit_amount_minor` → `numeric`), not silently lossy today. The backfill
  extractor should `assert raw_payload…unit_amount_decimal is null OR == unit_amount::text`
  and flag a row rather than truncate.
- **Reject the name `amount_cents`.** "Cents" is factually wrong for VND/JPY
  (no cents). The honest, provider-aligned name is `unit_amount_minor`. The
  *existing* `AdminUsersPage` client field `amount_cents` is preserved by a
  **view alias** (`unit_amount_minor AS amount_cents`) so **zero client code
  changes** — see §5. A later non-blocking rename of the client field to
  `amount_minor` is flagged, not gated.
- **Nullable, no default.** `NULL` is meaningful: "amount not yet resolved"
  (RC rows pre-projection-patch; Stripe rows pending backfill; any extractor
  miss). This is the seam that turns A20's *silent* null into an **explicit
  `unknown_amount` flag** (§5) instead of a 0 that silently understates MRR.
  A `DEFAULT 0` would re-introduce exactly the silent-zero class B45 and B42
  document. Constraint: `CHECK (unit_amount_minor IS NULL OR unit_amount_minor >= 0)`
  (trial/intro legitimately = `0`; negative is impossible and must hard-fail).
- **No new index.** `unit_amount_minor` is never a filter predicate (the MRR
  view filters on `status`, groups by `provider`/`currency_code`). Adding an
  index would be scope creep and — per the `pg_indexes preflight + tier_id
  index` memory — index changes are Chau-applied via SQL Editor, not part of
  this DDL. Documented: none required.

### 2b. Currency column — wire the existing `currency_code`

**Decision: reuse `currency_code text` (already exists, nullable, no default,
no CHECK — verified). Add `CHECK (currency_code IS NULL OR currency_code ~ '^[A-Z]{3}$')`.**

- Add a **shape** CHECK (uppercase 3-letter ISO-4217), **not an enum** of
  allowed currencies — enumerating is brittle and a deploy hazard when a new
  store currency appears. Shape-validate, don't allowlist.
- **Hard invariant (the A21 trap, §4 below):** `currency_code` is *always the
  denomination of `unit_amount_minor` on the same row* — never a different
  currency. Stripe: both come from the same `price` object
  (`price.currency` + `price.unit_amount`, same denomination by Stripe's
  model). RC: `unit_amount_minor` from the **USD-normalized** `event.price`,
  so `currency_code` is the **literal `'USD'`**, *never* `event.currency`.
- No DEFAULT. A row with `unit_amount_minor` set MUST have `currency_code`
  set (enforced by the writer + a paired-NULL note; a table-level
  `CHECK ((unit_amount_minor IS NULL) = (currency_code IS NULL OR …))` is
  *recommended but optional* — see §7 open question, because RC `currency`
  semantics make a strict biconditional risky).

### 2c. Interval columns — wire `billing_interval` + `billing_interval_count`

**Decision: reuse both existing dead columns as-is (their CHECKs are already
correct). No DDL change to them — they only need a writer.**

| Field | Stripe source | RevenueCat source |
|---|---|---|
| `billing_interval` | `price.recurring.interval` (invoice-line price `??` subscription-items price — mirror `core.ts:562-573` / B11 precedence) | product id → `mercy.premium.monthly`=`'month'`, `mercy.premium.yearly`=`'year'` (`projection.ts:21-22`, already in scope as `productIdToTier`) |
| `billing_interval_count` | `price.recurring.interval_count` (same precedence; `?? 1`) | literal `1` |

Both columns' CHECKs (`∈ day,week,month,year`; `> 0`) already match these
sources exactly — verified `20260319000000:189,204`.

### 2d. Per-row vs per-event semantics

**Decision: per-row, current-state, last-write-wins. The column tracks the
*current recurring price of the active subscription*, not an event ledger.**

- `subscriptions` is already a current-state projection (upsert keyed by
  `(provider, provider_subscription_id)` — `subscriptions_provider_subscription_id_key`,
  `20260315211233:40`; RC `onConflict:"subscription_id"`
  `projection.ts:87`). The amount columns inherit that: the **most recent
  price-bearing event wins**. No new ledger table. This is correct for MRR —
  "what is this sub worth per month *now*", not its history.
- **Amount changes mid-subscription:** Stripe price `unit_amount` is
  immutable; a real change ships a *new* `price_id` carried on the next
  event → last-write-wins captures it on the next renewal/update. Strictly
  more accurate than the map (the map can't see it until hand-curated).
- **Discount / coupon — explicitly out of scope, documented:**
  `price.unit_amount` is **list price**. Net-of-discount lives on
  `invoice.lines[].amount` *after* discount and needs an invoice /
  `billing_facts` model — that is **A8 flip-condition #1**, escalates *past*
  D4, and is *not* what this column is. Persisted invariant (documentation,
  no column): **`unit_amount_minor` is gross list price.** This is correct
  for the KPI which is labelled "Estimated MRR" (A8 §confidence,
  A21 §7.4). If net MRR ever becomes a requirement, it is a new model, not a
  patch to this column.
- **Trial / intro:** RC `TRIAL`/`INTRO` events carry `price:0` →
  `unit_amount_minor=0` (legitimate: a free trial *is* 0 MRR). The `RENEWAL`
  event carries the real recurring price and overwrites via last-write-wins —
  **no state machine needed** (A21 §3). Stripe `trialing` subs: `price.unit_amount`
  is the post-trial recurring price (Stripe puts the real price on the
  trialing sub) → correct forward MRR; rows still counted at full price by
  the existing `status IN (active,trialing,past_due)` filter — **unchanged**.
- **Quantity:** monthly amount = `unit_amount_minor * COALESCE(quantity, 1)`.
  `quantity` already exists with `CHECK > 0`; the normalization function
  (§4) multiplies by it. (All current plans are qty 1; the multiply is
  defensive, free, and prevents a future seat-based plan silently
  under-counting.)

### 2e. Backfill of existing rows

**Decision: provider-split. Stripe → backfill from `raw_payload`. RevenueCat →
do NOT backfill from DB (impossible); self-heal on next event.**

- **Stripe (~5 rows tonight, linear):** one-shot UPDATE extracting from
  `raw_payload`, **gated on A8 flip-condition #4** — Chau runs this read-only
  count *first* (no unattended catalog path to this DB — memory
  `pg_indexes preflight`, `DB schema-drift audit`):
  ```sql
  select count(*) from public.subscriptions
  where status in ('active','trialing','past_due') and provider='stripe'
    and (raw_payload is null
         or raw_payload #> '{items,data,0,price,unit_amount}' is null);
  ```
  Expect `0`. Extractor must coalesce **subscription shape then invoice
  shape** (mirror `core.ts:562-573`):
  `coalesce(raw #>> '{items,data,0,price,unit_amount}', raw #>> '{lines,data,0,price,unit_amount}')`
  for amount, same for `currency`, `recurring.interval`,
  `recurring.interval_count`. **Fallback if the count is non-zero:** Stripe
  REST API refetch of the subscription (linear, ~5 calls) — A8
  flip-condition #4's documented path. Either way: Chau-applied via SQL
  Editor, human-reviewed, **never `supabase db push`** (migration drift —
  A8 §migration-drift, memory `Edge-fn CI deploy`).
- **RevenueCat: backfill from `raw_payload` is impossible** — RC never
  persisted it (A21 §1, re-verified `projection.ts:65-83`). Options:
  (i) leave `NULL` + `unknown_amount=true`; self-heals on the next
  `RENEWAL` (≤ one billing cycle) once the projection patch (A21 §4)
  ships; or (ii) one-shot RevenueCat REST API refetch.
  **Recommend (i)** — web-only today ⇒ ≈0 real RC rows (memory
  `Native work phasing`), so the self-heal window is immaterial and a
  RC-API backfill job is unjustified effort now. Revisit only post-store-launch.

### 2f. Zero-decimal currencies (VND, JPY, KRW, …)

**Decision: the storage layer never represents them specially — minor-unit
INTEGER makes them correct by construction. ALL exponent/÷ logic lives in ONE
SQL function (§4), never in `core.ts`.**

- ISO-4217 minor-unit exponent: `VND=0, JPY=0, KRW=0` (no minor unit — the
  minor unit *is* the major unit), `USD=2, EUR=2`, Gulf `BHD/KWD/OMR=3`.
- Because providers report `unit_amount` *in the currency's own minor units*,
  the integer is **already correct for every currency with no branch**:
  Stripe sends VND `unit_amount=200000` (200 000 VND, exponent 0) and USD
  `unit_amount=999` ($9.99, exponent 2). `unit_amount_minor` stores exactly
  that integer. **There is no ÷100 at write time, ever.**
- The ÷10^exponent (minor→major, for human display / MRR numeric) and the
  ÷months (yearly→monthly) happen **exactly once**, in the shared SQL
  function (§4) via a tiny `currency_minor_exponent(code)` immutable lookup.
  This **structurally retires** the `core.ts:221 formatMoney` unconditional
  `minor/100` bug (A8 §end-state-b zero-decimal row, B52 §7.1): there is
  one canonical conversion site instead of scattered guesses.
- Documented exponent table the implementing dispatch must encode:
  `VND,JPY,KRW,CLP,ISK,… → 0`; `USD,EUR,GBP,VND-anything-2dp,… → 2`;
  `BHD,KWD,OMR,JOD,TND → 3`. Default unknown → `2` **and set
  `unknown_amount`/log** (fail loud, not silently wrong — memory
  `Testing discipline`).

---

## 3. Final column scheme (the spec a future dispatch implements)

```
ALTER TABLE public.subscriptions
  ADD COLUMN IF NOT EXISTS unit_amount_minor integer;

ALTER TABLE public.subscriptions
  ADD CONSTRAINT subscriptions_unit_amount_minor_chk
  CHECK (unit_amount_minor IS NULL OR unit_amount_minor >= 0);

ALTER TABLE public.subscriptions
  ADD CONSTRAINT subscriptions_currency_code_shape_chk
  CHECK (currency_code IS NULL OR currency_code ~ '^[A-Z]{3}$');
-- billing_interval / billing_interval_count / quantity: NO DDL — CHECKs
-- already correct (20260319000000:189,204,216); they only lack a writer.
```
*(DDL shown to make the scheme unambiguous — this doc ships **no migration**;
the implementing dispatch authors it, Chau applies via SQL Editor.)*

**Writer contract (the future projection changes — spec, not code):**

| Row field | Stripe (`mapStripeSubscription`, `subscription-insert.ts:50`) | RevenueCat (`projection.ts` grant-path `subRow:65-83`) |
|---|---|---|
| `unit_amount_minor` | `price.unit_amount` (invoice-line `??` items, int) | `Math.round((event.price ?? 0) * 100)` |
| `currency_code` | `price.currency`.toUpperCase() | **literal `'USD'`** (NOT `event.currency`) |
| `billing_interval` | `price.recurring.interval` | product-id → `month`/`year` |
| `billing_interval_count` | `price.recurring.interval_count ?? 1` | `1` |
| `raw_payload` | already persisted | **add it** (audit parity; not the MRR source) |

Per-row self-consistency invariant: **`currency_code` is the denomination of
`unit_amount_minor` on that row.** Stripe ⇒ both from one `price`. RC ⇒ amount
is USD-normalized so currency is hard `'USD'`. This is the §4 trap defense.

---

## 4. The single normalization function — anti-drift core of the scheme

The decisive design choice: **one immutable SQL function, called by every MRR
surface, so they cannot drift** (A8 §migration-drift documents *two*
historical `billing_mrr_inputs_v` defs; the only durable fix is one shared
math site, not duplicated `CASE`s).

```
-- spec, not shipped:
public.subscription_monthly_amount(
  unit_amount_minor int, currency_code text,
  billing_interval text, billing_interval_count int, quantity int
) RETURNS numeric(12,2)  LANGUAGE sql IMMUTABLE
  -- returns NULL when unit_amount_minor IS NULL  (=> unknown_amount upstream)
  -- major  = unit_amount_minor / 10 ^ currency_minor_exponent(currency_code)
  -- monthly = major * coalesce(quantity,1)
  --           / months_in(billing_interval, billing_interval_count)
  --   months_in: day→ /30.4, week→ /4.345, month→ *count⁻¹, year→ *12·count⁻¹
  -- rounds to 2dp ONCE, at the end (matches numeric(12,2) the map emits today)
```
plus `public.currency_minor_exponent(text) RETURNS int IMMUTABLE` (the §2f
table; unknown → 2 + caller flags). Both views and the KPI RPC call **only**
this function. No `CASE` is ever copy-pasted into a view again.

---

## 5. How D4 = retire `billing_price_map` reads this (A8 step-6)

`billing_mrr_inputs_v` is rewritten (Chau, SQL Editor — migration-drift hazard,
A8 §migration-drift) to **drop the `LEFT JOIN billing_price_map`** and source
the amount from the row:

```
-- conceptual; output column NAMES unchanged so consumers don't move:
select s.user_id, s.provider, s.provider_subscription_id,
       s.provider_price_id, s.provider_product_id, s.product_id, s.status,
       s.current_period_start, s.current_period_end, s.cancel_at_period_end,
       <synthetic plan_name>                    as plan_name,
       s.billing_interval, s.billing_interval_count, s.currency_code as currency,
       public.subscription_monthly_amount(
         s.unit_amount_minor, s.currency_code,
         s.billing_interval, s.billing_interval_count, s.quantity
       )                                        as mapped_monthly_amount,
       null::numeric                            as mapped_yearly_amount
from public.subscriptions s
where s.status in ('active','trialing','past_due');
```

- **Output is `mapped_monthly_amount` as `numeric(12,2)` major-unit monthly —
  byte-compatible with what `bpm.monthly_amount` emits today**, so
  `admin-billing-metrics/index.ts:226` `Σ mapped_monthly_amount` and the
  provider split at `:296` keep working with **zero edge-fn code change**.
  That compatibility is the contract: *persisted = minor integer; view
  output = the exact major-unit monthly numeric the map emits now.*
- **`plan_name`** is the one human-curated field with no per-row source. A8
  flip-condition #2. Recommend a **synthetic label** (`billing_interval ||
  ' · ' || currency`, e.g. "month · VND") for the number-only KPI. If admin
  wants curated marketing names, keep a *thin* `price_id → display_name`
  lookup (hybrid, A8 flip-#2) — flagged, not chosen here; the MRR *math*
  leaves the map regardless.
- **Staged retirement (A8 "staged"):** transition window the view emits
  `COALESCE(subscription_monthly_amount(...), bpm.monthly_amount)` — new
  column wins, map is the safety net — *then* the join and ultimately the
  table are dropped once `unknown_amount` count holds at 0. Reversible:
  re-add the join; `raw_payload` is retained so nothing is lost.
- B52 Option A is **not built** (A8 §recommendation, A21 §7.1) — its
  self-heal target (the map) is on death row; the same extractor logic is
  written once here, against the durable column.

---

## 6. How `admin_users_dashboard_v1` stops returning nulls (A20)

This view is SQL-Editor drift (no tracked CREATE). Its client
`AdminUsersPage.tsx:22-58` **already** types `plan_interval`,
`currency_code`, `amount_cents`, `quantity`, `unknown_amount`,
`unknown_plan`, and KPI `estimated_mrr`/`estimated_arr`. The redefinition
(Chau, SQL Editor) maps the now-populated columns:

| Client field (no client change) | Source |
|---|---|
| `amount_cents` | `subscriptions.unit_amount_minor` **AS `amount_cents`** (alias preserves contract; "cents" misnomer for VND — non-blocking rename to `amount_minor` flagged) |
| `currency_code` | `subscriptions.currency_code` |
| `plan_interval` | `subscriptions.billing_interval` |
| `quantity` | `subscriptions.quantity` |
| `unknown_amount` | **`(unit_amount_minor IS NULL)`** — the explicit honest-degradation flag that replaces A20's silent null (memory `M4 empty-VI fallback` honest-badge precedent; B45 "silent by design" anti-pattern) |
| `estimated_mrr` / `estimated_arr` (RPC `admin_users_dashboard_kpis_v1`) | `Σ subscription_monthly_amount(...)` ; ARR = ×12 — **the same §4 function** as `billing_mrr_inputs_v`, so the two MRR numbers structurally cannot diverge |

Both surfaces calling the *one* §4 function is the load-bearing decision: it
closes the A8 "two historical view defs drifted" failure class permanently.

---

## 7. The currency-mislabel trap — persisted shape that avoids it (A21 §3, step-8)

**The trap:** RevenueCat `event.price` is **USD-normalized** (2-dp float,
e.g. `9.99`); `event.currency` is the **local purchase** currency (the
currency of `price_in_purchased_currency`, *not* of `price`). Persisting
`(event.price, event.currency)` writes a **USD amount labelled VND** → the
MRR Σ adds `9.99` ("VND") to `200000` (VND): silent garbage, exactly the
B45/B42 silent-money class.

**Persisted shape that is immune (frozen here):**

- RC: `unit_amount_minor = Math.round((event.price ?? 0) * 100)` —
  the `*100` is valid **only because `event.price` is USD (2-decimal)**;
  `currency_code = 'USD'` **literal**, *never* `event.currency`.
- Stripe: `unit_amount_minor = price.unit_amount`, `currency_code =
  price.currency` — trap-free, both from one `price` object, same
  denomination by Stripe's model.
- **Row invariant (the defense):** `currency_code` is *always* the
  denomination of `unit_amount_minor` on the same row. One row, one
  currency, self-consistent. The shape-CHECK won't catch a USD-vs-VND
  mislabel (both are valid ISO codes) — enforcement is the **frozen writer
  rule above** + this documented invariant; the implementing projection
  patch (A21 §4) owns it, and a unit test must assert RC writes `'USD'`
  + `Math.round(price*100)`, never `event.currency` (memory
  `Testing discipline`: test the trap before the happy path).

**Downstream gap this scheme deliberately does NOT solve (flag for Chau):**
once RC (USD) and Stripe (VND) rows coexist, `Σ mapped_monthly_amount`
**mixes currencies** — meaningless without FX. No FX table exists
(A21 §3.1). The column scheme is correct (each row self-consistent); the
*aggregation* needs either a per-`currency_code` MRR breakdown or a
documented static FX constant until an FX source exists. **Today this is
latent** (web-only ⇒ ~100% VND Stripe, ~0 RC — memory `Native work
phasing`), but it goes live the moment the stores ship. **Open decision for
Chau, not resolvable by the column scheme alone:** does the headline KPI
report per-currency rows, or convert via a fixed FX constant? Recommend
per-currency rows + a clearly-labelled "(FX est.)" single headline. This is
an A8-flip-#1-adjacent escalation, noted so it is not discovered in prod.

---

## 8. Open questions the implementing dispatch must resolve first

1. **Gross-list MRR confirmed acceptable?** (A8 flip-#1 / A21 §7.4) The KPI
   is labelled "Estimated"; this scheme persists list price. If net-of-
   discount is required → invoice/`billing_facts` model, *not* this column.
   Must be confirmed before implementation, else the scheme is wrong-shaped.
2. **A8 flip-condition #4** (`raw_payload` complete on historical Stripe
   rows) — Chau's read-only count (§2e) **before** any backfill. Non-zero ⇒
   Stripe-API refetch path.
3. **Cross-currency aggregation policy** (§7) — per-currency vs fixed-FX.
   Latent today; decide before store launch.
4. **Strict paired-NULL CHECK?** A table CHECK
   `((unit_amount_minor IS NULL) = (currency_code IS NULL))` is tempting but
   risky if any non-amount path legitimately sets `currency_code` alone —
   recommend **soft** (writer-enforced + the `unknown_amount` flag), revisit
   after the projection patches land. Documented, not decided here.
5. **`plan_name` after map retirement** — synthetic label (recommended) vs
   thin display-name lookup (A8 flip-#2 hybrid). Product call, not schema.

---

## 9. Sequencing (where this sits — does not change A8/A21)

This is the **data-model contract** for A8 D4 end-state (b2). It does not
ship anything. The implementation order (A8 §4, A21 §6, B45 §fix-sequencing)
is unchanged: it slots into **B48-P2**, *after* P1 (single
`deriveEntitlement`); B42's one-row map INSERT + the #700 cleanup still ship
first as P0 (free, stops today's bleed, not wasted). The future
implementation dispatch:
1. authors the migration in §3 + the §4 functions (human-reviewed, Chau
   applies via SQL Editor — no unattended catalog path);
2. patches `mapStripeSubscription` + RC `projection.ts` per the §3 writer
   contract (the A21 §4 patch is *one item inside this*, never standalone);
3. runs the §2e backfill gated on flip-#4;
4. rewrites `billing_mrr_inputs_v` + `admin_users_dashboard_v1` /
   `_kpis_v1` to call the §4 function;
5. stages map retirement (§5 COALESCE → drop).

---

## Worktree disposition

**`keep`** — this is the implementation contract a future B48-P2 dispatch
codes against, not a one-shot finding. Commit on
`a42/subscription-amount-schema`, **no PR** (operator artifact, B16). Re-open
to add a `> SUPERSEDED`/`> IMPLEMENTED` banner when the (b2) migration lands.

---

*A42 — design recon only. No DB writes. No migration. No code. No PR.
Branch `a42/subscription-amount-schema`. Consumed by the A8 D4 (b2)
implementation dispatch; depends on the D4 = retire-the-map decision and
B48-P1.*
