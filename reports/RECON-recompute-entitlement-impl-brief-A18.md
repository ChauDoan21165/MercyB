# IMPL BRIEF — `recomputeEntitlement()` single-writer build (A18)

> **Implementation-ready dispatch brief. The brief itself contains NO product
> code** — it is the executable spec a *future* agent runs to write the
> writer, its tests, and the dead-writer deletions in one PR.
>
> Branch: `a18/recompute-impl-brief` · off `origin/main` @ `5cfa27e3f`
> Date: 2026-05-19 · Agent: A18 · Labels: `money-path`, `silent-failure`
> Convention: B16 (`reports/RECON-<topic>-<id>.md`, **commit — do NOT PR**;
> operator artifact)
>
> **Design inputs (read both before starting — committed, quotable):**
> - `reports/RECON-recompute-entitlement-design-B68.md` (A6 — the design;
>   from merged commit `8bbc27f4f`)
> - `reports/RECON-entitlements-table-schema-A5.md` (A5 — the table schema;
>   from `origin/b67/entitlements-schema-spec`)
> - Upstream, **not on main** — read at impl time:
>   `RECON-billing-target-state-B48.md` (`origin/b48`, the W-dead-writer
>   ledger + invariants), `RECON-isentitling-fix-plan-B13.md`
>   (`refs/heads/b13`, the expiry-blind derivation B13 ph3 fixes).
>
> Live source verified by A18 at `5cfa27e3f` (file:line anchors below are
> real, not paraphrased).

---

## 0. TL;DR for the implementing agent

Build `recomputeEntitlement(supabase, userId, opts)` as the **single
server-side writer** of `entitlements` (+ the legacy `profiles.premium_*`
projection). It reads `subscriptions` + the B22 `user_subscriptions` gift
fallback, runs the **imported** pure `deriveEntitlement(rows, now)` (owned by
B13 phase 3), upserts one `entitlements` row, and routes **every** failure to
`captureEdgeError` — no `console.warn` survives in the path. Delete the 4
code-deletable dead writers in the same PR; rewire the 3 other live callers in
follow-up PRs; the dead RPC/trigger are Chau SQL-Editor DROPs (D6), not repo
deletions.

**You may not start until the gate table in §1 is fully green.** Two gates are
hard blockers: B13 phase 3's `_shared/entitlement.ts` does not exist yet
(verified absent), and A17's `entitlements` migration must be applied to prod
(no table = nowhere to write).

---

## 1. Prerequisites — gate table (ALL must be green before a line is written)

| Gate | What it unblocks | Status @ 2026-05-19 (A18-verified) | Hard? |
|---|---|---|---|
| **G1 — A17 `entitlements` migration applied to prod** | the UPSERT target table + `(user_id,app_id)` PK + RLS + generated `is_premium`. DDL is A5's spec; A17 turns it into the migration; **Chau-applied via SQL Editor (D6 — no unattended SQL path to this Supabase)**. | **NOT applied.** No `entitlements` table; no migration file for it on main. | **BLOCKER** |
| **G2 — B13 phase 3 landed: `supabase/functions/_shared/entitlement.ts`** exporting pure `deriveEntitlement(rows, now, opts?)` (+ `loadEntitlement`) | recompute *imports* derive; it must not ship its own copy (a 2nd copy IS the B13 bug class — B68 O1). | **NOT present.** `ls supabase/functions/_shared/` @ `5cfa27e3f` → no `entitlement.ts` (only `billing.ts`, `sentry.ts`, … 30 files). | **BLOCKER** |
| **G3 — #766 / B6 merged** (CAS+backoff+jitter helper) | the `entitlements` monotonic-on-`computed_at` guard reuses #766's helper, not a fork (B68 §6/O4). | **OPEN** (B68 §10). Today only an *inline* loop exists: `billing.ts:629 for (attempt < MAX_MONOTONIC_RETRIES=8)`; **no extracted reusable `casRetry`**. See §6 decision D-G3. | conditional — see §6 |
| **G4 — B17 PR1 / #774 merged** ("no gate reads `profiles.tier`") | recompute is only *authoritative* once nothing reads stale `profiles.tier` (B48 P1). | #774 **OPEN**. | soft — writer can land; do not flip reads to the table until green |
| **G5 — B11 + B12** (period_end field-order fix + historical backfill) | expiry derivation off `current_period_end` is only correct post-B11 (new rows) + B12 (old rows); B13 P1/P2/P3 pre-flight gates = 0. | reference-only upstream — confirm B13 ph3 shipped behind these. | inherited via G2 |
| **G6 — D1 confirmed = materialised `entitlements` table** | if D1 flips to pure-derive, the whole single-writer-table approach is void. | A5 states D1 decided = materialised. Re-confirm not reversed before starting. | strategic |

> **Start condition:** G1 ∧ G2 true; G3 resolved per §6; G6 still = materialised.
> If any blocker is red, the implementing agent must **stop and report**, not
> stub around it (project memory: never stub infra owned by an upstream agent).

---

## 2. File layout — exactly what this PR creates / edits / deletes

```
CREATE  supabase/functions/_shared/entitlement/recompute.ts      ← the writer (B68 §1 path)
CREATE  supabase/functions/_shared/entitlement/__tests__/recompute.test.ts  ← unit suite (§8)
EDIT    supabase/functions/stripe-webhook/billing.ts             ← rewire finalize, delete seed + swallow (§7)
DELETE  src/billing/recomputeAndPersistEntitlement.ts            ← dead browser writer, 0 prod importers (§7)
DELETE  src/billing/recomputeAndPersistEntitlement.test.ts       ← its orphaned test (§7)
```

> B68 §1 specifies the module path `supabase/functions/_shared/entitlement/recompute.ts`
> (a new `entitlement/` subdir, sibling to B13 ph3's `_shared/entitlement.ts`).
> Keep `recompute.ts` *importing* derive from `../entitlement.ts`; do **not**
> collapse them into one file (B68 O1: single ownership of derive = B13 ph3).
> **Contradiction flagged:** B68 §1's signature block colocates
> `deriveEntitlement` *inside* `recompute.ts`; B68 O1 + the A18 task brief say
> import it from B13 ph3's `_shared/entitlement.ts`. **Resolved per O1 (the
> doc's own recommendation): import, do not redefine.** Cite this decision in
> the PR description.

---

## 3. The writer — signature (build to this exactly)

From B68 §1 (verbatim contract; types resolved against verified live code):

```ts
// supabase/functions/_shared/entitlement/recompute.ts
import { deriveEntitlement } from "../entitlement.ts";          // B13 ph3 — pure, +expiry
import { captureEdgeError } from "../sentry.ts";                 // verified export
// CAS helper import — see §6 (path depends on #766's final shape)

export type RecomputeReason =
  | "stripe-webhook" | "revenuecat-webhook" | "redeem-gift-code"
  | "redeem-access-code" | "admin-manual-fix" | "backfill";

export interface RecomputeOptions {
  appId?: string;          // default DEFAULT_APP_ID = "mercy_blade"
  now?: Date;              // injected clock, captured ONCE at entry; tests/backfill pass fixed
  reason: RecomputeReason; // REQUIRED — provenance for Sentry tags + downgrade beacon
}

export async function recomputeEntitlement(
  supabase: SupabaseClient,            // service-role, server-only
  userId: string,
  opts: RecomputeOptions,
): Promise<EntitlementRow>;            // throws on any read/write failure — never swallows
```

`EntitlementInputRow` / `DerivedEntitlement` / `EntitlementRow` shapes: B68
§1 lines 80–100. `is_premium` and `computed_at` are part of the **persisted**
`EntitlementRow`; `deriveEntitlement`'s pure output adds only `is_premium`
(B68 §3 close). `now` MUST be a parameter threaded into `deriveEntitlement`,
never `Date.now()` read inside derive — idempotency hinges on this (B68 §5).

---

## 4. Reads — build these two queries

| # | Source | Exact query | Anchor / notes |
|---|---|---|---|
| **R1** | `subscriptions` (canonical) | `select status,current_period_end,provider from subscriptions where user_id=$1 and app_id=$2` | Extends the **seed's** existing read verbatim — `billing.ts:546-549` already does exactly `.select("status,current_period_end,provider").eq("user_id",userId).eq("app_id",DEFAULT_APP_ID)`. No shape change. |
| **R2** | `user_subscriptions` (B22 gift fallback) | port `fetchActiveGiftSubscription` logic: `select current_period_end from user_subscriptions where user_id=$1 and status='active' and is_gift_redemption=true and current_period_end > now order by current_period_end desc limit 1` | Live pattern at `me-entitlement/index.ts:42-63` (verified). Move it **server-side into the writer**. Map gift row → `EntitlementInputRow{ kind:"gift", period_end:current_period_end, source:"gift_code", status:"active" }`. |

Wrap R2 + its row-mapper in a single clearly-labelled block:
`// --- gift fallback (delete on D3) ---` … `// --- end gift fallback ---`
so the future D3 fold-in is one localized deletion, not a scattered refactor
(B68 §2 D3-note; A5 §D3 confirms the entitlements row shape is D3-agnostic).
**D3 is NOT part of this PR.**

R2 inconsistency handling (B22 silent-failure killer): if a row has
`is_gift_redemption=false` or a redeemed gift has null expiry, **filter it
from derive input AND surface it** — `captureEdgeError(..., level/warning,
offending row ids)` — never silently drop (B68 §7 row 3). Do not degrade R2
errors to "no gifts": a read error throws (B68 §7 row 2).

---

## 5. Derive — IMPORT, never reimplement

```ts
const now = opts.now ?? new Date();                 // captured ONCE
const rows: EntitlementInputRow[] = [...r1Rows, ...r2GiftRows];
const derived = deriveEntitlement(rows, now);       // B13 ph3 — the single home
```

`deriveEntitlement` already encodes the entitling/expiry table (B68 §3:
`active`/`trialing` entitling **iff** non-expired w/ 48h grace; `past_due`/
`grace_period` entitling **unconditionally** — the dunning window; null
`period_end` on active/trialing → fail-closed + data-hazard breadcrumb;
winner = furthest `period_end`, deterministic tie-break sub-before-gift).
**The implementing agent must NOT re-encode any of this** — if B13 ph3's
export does not match B68 §3, that is a B13-ph3 defect to report, not to
work around in recompute (B68 O1 — two copies of derive *is* the bug class).
Today's seed calls `deriveEntitlementFromSubscriptions` (`core.ts:178`) which
is the expiry-blind write-derive being retired — do **not** reuse it.

---

## 6. Write — one upsert + the monotonic guard

```sql
UPSERT INTO entitlements
  (user_id, app_id, status, source, expires_at, computed_at)
VALUES ($userId, $appId, derived.status, derived.source,
        derived.expires_at, $now /* = opts.now ISO */)
ON CONFLICT (user_id, app_id) DO UPDATE
  SET status=excluded.status, source=excluded.source,
      expires_at=excluded.expires_at, computed_at=excluded.computed_at
  WHERE excluded.computed_at >= entitlements.computed_at      -- monotonic guard (B68 §6/O4)
```

- **Do NOT write `is_premium`** — it is `GENERATED ALWAYS … STORED` in A5's
  schema; writing it errors. **Do NOT write `updated_at`** — A5's
  `entitlements_touch_updated_at` trigger owns it.
- `computed_at` is bumped on **every** run including a no-op recompute (A5
  liveness clock; drives B7 staleness). So pass `opts.now` ISO every call.
- **Profiles projection (B48 invariant 1 — legacy/UI convenience, never
  authoritative):** also write `profiles.premium_status/premium_expires_at/
  premium_source`. B68 §4 + O2 + A5 §relationship: do this in **one Postgres
  transaction with the entitlements upsert** via a single
  `recompute_entitlement_tx(...)` RPC, because the Deno edge runtime has no
  cross-table txn. **The `recompute_entitlement_tx` RPC DDL is part of A17's
  Chau-applied SQL-Editor scope (D6), same gate as G1.** If, at impl time,
  the RPC is not yet applied: implement against it anyway and **block on G1**
  — do *not* fall back to two separate edge writes (drift risk; B68 §7 row 5
  rates a stale projection "critical drift").

**Decision D-G3 (concurrency helper):** B68 §6/O4 mandates the `entitlements`
upsert be monotonic-on-`computed_at` **and** reuse #766's CAS+backoff+jitter
helper — *not* a fork. A18 verified #766 has **not** extracted a reusable
helper (only inline `billing.ts:629`). Two acceptable paths — the implementing
agent picks one and **states it in the PR**:
- **(preferred) Hard-gate on #766** providing a shared `casRetry` export;
  block until G3 green; import and reuse it.
- **(fallback, only if #766 is deprioritised)** Extract `casRetry` from the
  `billing.ts:629` loop into `_shared/` as part of *this* PR, and refactor
  the existing inline caller to use it (so there is still exactly one owner).
  Never copy-paste a second backoff loop.
Natural convergence is the self-heal regardless: `deriveEntitlement` is a pure
function of *all* current rows, so a lost race re-converges on the next
event's recompute (B68 §6).

---

## 7. Failure modes — use the REAL `captureEdgeError` signature, zero `console.warn`

A18 read `_shared/sentry.ts:107-135`. The **real** export is **not** the
`{tags, extra}` shorthand B68 §7 sketched — build to this:

```ts
export interface CaptureOptions {
  functionName: string;                 // ALWAYS "recomputeEntitlement"
  userId?: string | null;
  extra?: Record<string, unknown>;      // NOT indexed — ids/context here
  tags?: Record<string, string>;        // INDEXED, low-cardinality — phase, reason here
}
await captureEdgeError(err, {
  functionName: "recomputeEntitlement",
  userId,
  tags: { phase: "read-subscriptions", reason: opts.reason },
  extra: { appId },
});
```

Failure matrix (B68 §7 — behaviour column is binding):

| Failure | `tags.phase` | Behaviour |
|---|---|---|
| R1 `subscriptions` read error | `read-subscriptions` | capture → **throw** (webhook 5xx → provider retry) |
| R2 gift read error | `read-gifts` | capture → **throw**. Never degrade to "no gifts" (B22-class money silent-failure) |
| Gift rows inconsistent (`is_gift_redemption=false` / null expiry on redeemed) | `gift-inconsistency` | capture as **warning** w/ offending row ids, filter from derive, **do NOT throw** (rest of derive still correct) |
| `entitlements` upsert error | `upsert-entitlements` | capture → **throw** |
| `profiles` projection error | `projection` | via the RPC → atomic rollback, one throw. (No separate-call path exists — RPC is mandated) |
| active→inactive transition (a downgrade) | `downgrade-beacon` | **NOT a failure** — emit the B13 downgrade beacon (Sentry breadcrumb + structured log, tags `reason`,`userId`) on every flip. Mandatory observability for a reversible rollout (B13 §phase-3 defense 5) |

**Delete** the terminal swallow at `billing.ts:587`
(`console.warn("stripe-webhook entitlement recompute skipped", error)`)
and its enclosing `try/catch` in `finalizeSubscriptionProcessing`
(`billing.ts:583-589`). After this PR there is **no terminal `console.warn`
in the recompute path** (the other `console.warn`s in `billing.ts`/`core.ts`
listed by A18's grep are unrelated CAS/lookup paths — leave them).

---

## 8. Test suite — required, pure unit (idempotency + concurrency)

Create `supabase/functions/_shared/entitlement/__tests__/recompute.test.ts`.
Model on the existing seed test `src/billing/recomputeAndPersistEntitlement.test.ts`
(fake supabase client w/ scripted `.from().select()/.upsert()` results) — but
that file is **deleted** by this PR (§7), so the new suite stands alone.

Mandatory cases:
1. **Idempotency** — same input rows + same `opts.now` ⇒ byte-identical
   `EntitlementRow` across N calls; the upsert is keyed `(user_id,app_id)` so
   N calls converge to one logical row (assert single upsert payload, no
   append).
2. **Injected clock** — derive output is a pure function of `opts.now`;
   passing a frozen `Date` yields deterministic `expires_at`/`status`;
   omitting `opts.now` uses `new Date()` exactly once (assert not re-read).
3. **Monotonic guard** — a recompute carrying an older `computed_at` does NOT
   clobber a fresher row (the `WHERE excluded.computed_at >= …` no-ops);
   a newer one wins. (Simulate the stale-overwrite race B68 §6 describes.)
4. **Convergence** — out-of-order concurrent triggers (Stripe then
   RevenueCat) both reading post-write snapshots produce the same final row.
5. **Failure paths fail loud** — R1 error throws; R2 error throws (NOT
   "no gifts"); upsert error throws; each calls `captureEdgeError` with the
   correct `tags.phase`. Mock `captureEdgeError`, assert invoked — never
   asserts a swallow. (Testing discipline memory: test fallbacks before happy
   paths; fail loud, never silently patch.)
6. **Gift-inconsistency** — `is_gift_redemption=false` row present ⇒ filtered
   from derive **and** `captureEdgeError` warning emitted, function still
   returns the correct non-gift entitlement (does not throw).
7. **Downgrade beacon** — prior `is_premium=true` → new `false` emits the
   beacon with `reason`,`userId`; no beacon on no-op.

`deriveEntitlement` itself is B13 ph3's to test — do **not** re-test its
expiry table here (that would be the duplicate-derivation smell). Mock/inject
it where a case needs a specific derived value.

Run gates in an isolated worktree (project memory:
`feedback_worktree_gates_node_modules` / `stale_shared_node_modules_false_RED`):
`npm run typecheck:ci` + `npm run lint` + `npx vitest run …recompute.test.ts`.
Deno edge code: confirm it typechecks under the edge tsconfig path the repo
uses for `supabase/functions/**`.

---

## 9. Caller rewiring — PR-split decision (task asked A18 to decide)

A6/B68 §8 enumerates **8** entitlement-adjacent writers. They span Edge
Functions **and** browser code **and** DB objects — so per the task's own
guidance ("recommend follow-up if call sites span Edge Functions + browser
code"), **split**:

| PR | Scope | Why here |
|---|---|---|
| **PR1 (this brief)** | new `recompute.ts` + tests + delete 4 code-dead writers (§10) + **rewire only `stripe-webhook` `finalizeSubscriptionProcessing`** | The seed `recomputeAndPersistEntitlement` deleted in §10 **is** stripe-webhook's own (`billing.ts:542`, sole caller `billing.ts:585`). You cannot delete it without rewiring its one caller in the same PR or the function won't build. This rewire is unavoidable and self-contained. Replace the `try/catch+console.warn` body with `await recomputeEntitlement(params.supabase, params.userId, { reason:"stripe-webhook" })` (let it throw → webhook 5xx → Stripe retry). |
| **PR2 (follow-up)** | rewire `revenuecat-webhook`: after its monotonic `subscriptions` upsert, call `recomputeEntitlement(..., {reason:"revenuecat-webhook"})` | Distinct live money path, independently reviewable/revertible. Today it writes `subscriptions` with no recompute. |
| **PR3 (follow-up)** | rewire `redeem-gift-code` + `redeem-access-code`: call `recomputeEntitlement` after the `user_subscriptions` insert; the `ok:true`-on-dropped-row trap (B22) is closed by recompute's gift-inconsistency surface | Two paths, same shape; the B22 fix rides here. |
| **PR4 (process, not code-heavy)** | admin manual-fix becomes "edit input rows → invoke `admin-recompute-entitlement` (`reason:"admin-manual-fix"`)"; **never a hand `profiles.premium_*` UPDATE** again | Process + a thin admin invoke; minimal code. |
| **Chau SQL-Editor (D6)** | DROP dead RPC; B27 trigger tombstone (§10 items 5–6) | Not a repo PR — DB drift, human-applied. |

Rationale: rewiring live money webhooks is the highest-blast-radius work; one
webhook per PR keeps each revert atomic (project memory: small safe diffs on
unstable money paths; B48 invariant 3). PR1 stays self-contained and buildable.

---

## 10. Dead-writer deletion list (A6's 6 — split by removal mechanism)

A6's design (B68 §8 + the B48 `W#` ledger it cites — `W3/W4/W6`; full ledger
lives in `RECON-billing-target-state-B48.md` on `origin/b48`, **read it at
impl time to reconcile the canonical W-list**). A18-verified state and the
**mechanism** each removal requires:

| # | Dead writer | A18 verification @ `5cfa27e3f` | Removal mechanism |
|---|---|---|---|
| 1 | `src/billing/recomputeAndPersistEntitlement.ts` (browser; B48 **W4**) | grep: **0 prod importers** (only its own test) | **DELETE file — PR1** |
| 2 | `src/billing/recomputeAndPersistEntitlement.test.ts` | tests only the deleted #1 | **DELETE file — PR1** |
| 3 | `stripe-webhook/billing.ts:542` private `recomputeAndPersistEntitlement` (the seed) | sole caller `billing.ts:585` | **DELETE function — PR1** (caller rewired §9) |
| 4 | `stripe-webhook/billing.ts:583-589` the `try/catch + console.warn:587` swallow | verified at line 587 | **DELETE try/catch — PR1** |
| 5 | `sync_profile_tier_from_latest_payment(uuid)` RPC (DEAD; B48 **W6**) | **NOT in any repo migration** (`grep supabase/migrations` → 0 hits) — live prod SQL-Editor drift | **Chau SQL-Editor `DROP FUNCTION` (D6)** — *not* a repo deletion. Brief it; do not attempt unattended. |
| 6 | `trg_sync_profile_tier_from_payment` T2 trigger (DORMANT; B48 **W3**) | **NOT in any repo migration** (0 hits) — drift | **Chau SQL-Editor tombstone via B27 — explicitly OUT OF B68 SCOPE** (B68 §8 last row). List only; do **not** drop in this PR. |

> **Contradiction flagged (cite in PR):** the A18 task says "the 6-dead-writers
> … get removed in the same PR as the new writer." A6's own B68 §8 scopes the
> trigger (#6) **out** of B68 and the RPC/trigger are DB drift with **no
> unattended SQL path** (D6 / project memory `db-schema-drift-audit`,
> `agent-infra-access`). **Resolved per A6's authoritative design + D6:** PR1
> deletes only the 4 code-deletable writers (#1–#4); #5 is a Chau SQL-Editor
> DROP briefed alongside G1's migration; #6 is deferred to B27. Removing all 6
> "in one PR" is mechanically impossible for a code PR — the brief makes the
> split explicit rather than pretend otherwise (operating discipline: don't
> solve uncertainty with more code; permissions/DB are product logic).

---

## 11. Hard dependency restated — A17 migration MUST be applied to prod first

`recomputeEntitlement`'s entire reason to exist is the UPSERT into
`entitlements`. **No table = nowhere to write = the writer cannot run.** A17
owns turning A5's schema spec into the migration; **Chau applies it via SQL
Editor (D6 standing gate — there is no unattended SQL/catalog path to this
Supabase; project memory: `agent-infra-access`, `db-schema-drift-audit`,
`pg_indexes-preflight`).** The same Chau-applied batch must include the
`recompute_entitlement_tx` RPC (§6) and ideally formally introduce the
untracked `subscriptions.app_id` drift column (A5 §Open-Q1).

**Sequencing the implementing agent must respect:**
`G2 (B13 ph3 derive) ── then ──► A17 migration + RPC applied to prod (G1)
── then ──► PR1 (writer + tests + deletions + stripe rewire)
── then ──► backfill run (A5 §8: `recomputeEntitlement` over all profiles,
gift-path active, idempotent, verification gate) ── then ──► flip
`loadEntitlement` reads to the table (gated additionally on G4/#774).`
Writing the writer before G1 is wasted work that cannot be tested end-to-end;
unit tests (§8) mock the client so they *can* land first, but no integration
/ backfill until G1.

---

## 12. Estimated PR size

**PR1 (this brief's deliverable):** **Medium.**
- New `recompute.ts`: ~160–200 LOC (signature + R1/R2 reads + gift-fallback
  block + derive call + RPC upsert + 6-row failure matrix + downgrade beacon).
- New `recompute.test.ts`: ~250–320 LOC (7 mandatory case groups, fake client).
- `billing.ts` edit: ~ −35 LOC (delete seed fn `542-573` + swallow `583-589`)
  / +5 LOC (rewired finalize call).
- 2 file deletions: −~330 LOC (`src/billing/recomputeAndPersistEntitlement.{ts,test.ts}`).
- **Net ≈ +420 / −370, ~5 files touched.** Single reviewable money-path PR.

Follow-ups (separate, smaller): PR2 ~+15/-5 (revenuecat), PR3 ~+30/-15
(2 redeem fns), PR4 thin admin invoke + process note. Chau SQL-Editor: dead
RPC DROP (1 stmt) + B27 trigger tombstone (B27's scope, not estimated here).

---

## 13. Report-back checklist for the implementing agent

When PR1 is up, the agent's report must state: (a) G1+G2+G3 confirmed green
with evidence (table exists in prod / `_shared/entitlement.ts` present /
casRetry path chosen); (b) the 3 flagged contradictions resolved per this
brief and cited in the PR body; (c) unit suite green in an isolated worktree
(not the shared symlinked node_modules); (d) the 4 deletions done, the 2 SQL
DROPs (#5/#6) handed to Chau as a separate briefed SQL block, NOT attempted
unattended; (e) follow-up PR2–PR4 enumerated as issues/TODOs so the live
caller rewiring isn't dropped.

---

## Worktree disposition

**`prune` — brief fully captured here. Operator artifact: committed on
`a18/recompute-impl-brief`, NOT PR'd (B16 / task step 9).** Read alongside
`RECON-recompute-entitlement-design-B68.md` (A6) and
`RECON-entitlements-table-schema-A5.md` (A5) by the B13-phase-3 / B48-P2
implementation dispatch this brief exists to enable.
