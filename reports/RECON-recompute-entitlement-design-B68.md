# RECON — `recomputeEntitlement(userId)` single-writer design (B68)

> **Design spec. NO code.** Realizes B48 *target invariant 3* (single write
> path) + the persistence half of *target invariant 1* (one `entitlements`
> row per `(user_id, app_id)`). Implementation is **B13 phase 3 / B48 P2** —
> a future dispatch gated on this design + A5's `entitlements` schema landing.
>
> Branch: `b68/recompute-entitlement-design` · off `origin/main` @ `5cfa27e3f`
> Date: 2026-05-19 · Agent: A6 · Labels: `money-path`, `silent-failure`
> Convention: B16 (`reports/RECON-<topic>-<id>.md`, commit-don't-PR)
> Inputs read (committed, quotable): `RECON-billing-target-state-B48.md`
> (P1/P2/invariants, origin/b48), `RECON-isentitling-fix-plan-B13.md`
> (expiry-blind derivation, refs/heads/b13). Live source read:
> `stripe-webhook/{billing.ts:542,577,629 · core.ts:167,177}`,
> `_shared/sentry.ts`, `stripe-webhook/types.ts:53`.

---

## Verdict

One server-side `recomputeEntitlement(userId, opts?)` becomes the **only**
writer of derived entitlement state. It (1) reads the canonical
`subscriptions` rows + the B22 `user_subscriptions` gift fallback, (2) runs
**one pure `deriveEntitlement(rows, now)`** that fixes B13's expiry-blind bug
in a single place, (3) upserts **one `entitlements` row** per `(user_id,
app_id)`, and (4) **surfaces every failure to Sentry — never `console.warn`**.
All five entitlement-adjacent writers (stripe-webhook, revenuecat-webhook,
redeem-gift-code, redeem-access-code, admin manual-fix) stop writing
`profiles.premium_*` / tier directly and call this instead. The current
`recomputeAndPersistEntitlement` (`billing.ts:542`) is the seed — but it has
the B13 bug (status-only derive), no gift read, no `entitlements` table, and
its sole caller swallows failure with `console.warn` (`billing.ts:587`).

---

## 1. Function signature (TypeScript)

```ts
// supabase/functions/_shared/entitlement/recompute.ts  (NEW shared module — Deno edge)

import type { SupabaseClient } from "...";   // service-role client (server-only)

export type RecomputeReason =
  | "stripe-webhook"
  | "revenuecat-webhook"
  | "redeem-gift-code"
  | "redeem-access-code"
  | "admin-manual-fix"
  | "backfill";

export interface RecomputeOptions {
  /** Defaults to DEFAULT_APP_ID = "mercy_blade". */
  appId?: string;
  /** Injected clock. Captured ONCE per call. Tests/backfill pass a fixed Date.
   *  Production omits → `new Date()` at call entry. Idempotency hinges on this
   *  being a parameter, never `Date.now()` read inside derive. */
  now?: Date;
  /** Provenance for Sentry tags + the downgrade beacon. Required so a money
   *  incident can be traced to the triggering path. */
  reason: RecomputeReason;
}

/** THE ONLY writer of `entitlements` / `profiles.premium_*`.
 *  Throws on any read/write failure (caller returns non-200 → provider retry).
 *  Never swallows. */
export async function recomputeEntitlement(
  supabase: SupabaseClient,
  userId: string,
  opts: RecomputeOptions,
): Promise<EntitlementRow>;

/** PURE. Same `rows` + same `now` → same output. No I/O, no Date.now(),
 *  no global state. The single home of B13's expiry logic. */
export function deriveEntitlement(
  rows: EntitlementInputRow[],
  now: Date,
  opts?: { graceMs?: number },   // default 48h — webhook-lag tolerance (B13 §risk 2)
): DerivedEntitlement;

export interface EntitlementInputRow {
  kind: "subscription" | "gift";
  status: SharedSubscriptionStatus;     // active|trialing|past_due|grace_period|canceled|revoked|incomplete|...
  period_end: string | null;            // ISO — current_period_end (sub) | expires_at (gift)
  source: BillingProvider | "gift_code";
}

export interface DerivedEntitlement {
  is_premium: boolean;
  status: "active" | "inactive";
  expires_at: string | null;
  source: BillingProvider | "gift_code" | null;
}

/** Shape of the persisted row (A5 owns the DDL). */
export interface EntitlementRow extends DerivedEntitlement {
  user_id: string;
  app_id: string;
  computed_at: string;                  // = opts.now ISO
}
```

**Inputs:** `userId` (required), `opts.appId` (optional, default
`DEFAULT_APP_ID="mercy_blade"`), `opts.now` (optional injected clock — see
Idempotency), `opts.reason` (required provenance).

---

## 2. Reads

| # | Source | Query | Status |
|---|---|---|---|
| R1 | `subscriptions` (**canonical**) | `SELECT status, current_period_end, provider FROM subscriptions WHERE user_id=$1 AND app_id=$2` | extends the existing `billing.ts:545` read with no shape change |
| R2 | `user_subscriptions` (**gift fallback**, B22) | `SELECT status, current_period_end /* or expires_at */, is_gift_redemption FROM user_subscriptions WHERE user_id=$1 AND app_id=$2` | required **until D3**. Per B22, `redeem-gift-code` drops `is_gift_redemption=false` rows yet returns `ok:true` — recompute filters non-gift / malformed rows but **reports their presence to Sentry** (see Failure modes) rather than silently dropping |

> **D3 note (fold-in):** when `user_subscriptions` is folded into
> `subscriptions` (`source='gift_code'`), **R2 disappears** and R1 alone
> covers gifts. The spec isolates R2 + its row-mapper into one clearly-labelled
> `// --- gift fallback (delete on D3) ---` block so the D3 transition is a
> single localized deletion, not a scattered refactor. **D3 is a future
> change, not part of B68 impl.**

Both reads map into `EntitlementInputRow[]` (subscription rows → `kind:"sub"`,
`period_end = current_period_end`; gift rows → `kind:"gift"`, `period_end =
the gift expiry column`, `source:"gift_code"`).

---

## 3. Derivation — one pure `deriveEntitlement(rows, now)` (fixes B13 ×4)

Today entitlement is derived **≥4 times** by status-only functions that all
share the identical expiry-blind bug (B13 §callsite map: `isEntitlingSubscription`
`core.ts:167`, `me-entitlement normalizeStatus`, `_shared/billing.ts
toEntitlementResponse`, `get-subscription-status`). This is the **single
home** that replaces all four — B48 P1: *"don't fix 4 functions — extract one
`deriveEntitlement` with expiry, point all 4 at it."*

**Per-row entitling test (B13 §risk 3 + §phase-3 semantics):**

| status | entitling? | expiry rule |
|---|---|---|
| `active`, `trialing` | yes **iff** non-expired | `period_end != null AND period_end > now − grace` (grace default 48h). `period_end == null` on active/trialing → **NOT entitling** (fail-closed) + Sentry data-hazard breadcrumb (a real paid sub always has a period_end) |
| `past_due`, `grace_period` | **yes, unconditionally** | NO expiry check — this is the dunning window Stripe is still retrying; enforcing expiry here revokes users mid-recovery (B13 §risk 3) |
| `canceled`, `revoked`, `incomplete`, `inactive`, expired gift | no | — |

**Winner selection:** among entitling rows pick the furthest `period_end`
(`past_due`/`grace_period` with null `period_end` → treated as "+∞ while
dunning", can win → `expires_at=null` meaning *entitled, no fixed expiry*).
Deterministic tie-break: `subscription` before `gift`, then provider order,
then first-seen — so identical input always yields one stable winner.

**Output:** winner → `{ is_premium:true, status:"active", expires_at:winner.period_end, source:winner.source }`;
no winner → `{ is_premium:false, status:"inactive", expires_at:null, source:null }`.

(Current `EntitlementSnapshot` (`types.ts:53`) is `{status,expires_at,source}`
— B68/A5 extends the *persisted* shape with `is_premium` + `computed_at`;
`deriveEntitlement`'s pure output adds only `is_premium`.)

---

## 4. Write — one upsert to `entitlements`

```
UPSERT INTO entitlements (user_id, app_id, status, source, expires_at,
                          is_premium, computed_at)
VALUES ($userId, $appId, derived.status, derived.source, derived.expires_at,
        derived.is_premium, $now)
ON CONFLICT (user_id, app_id) DO UPDATE …            ← see §6 monotonic guard
```

Plus a **write-only projection** to `profiles.premium_status /
premium_expires_at / premium_source` (legacy/UI convenience; never
authoritative — B48 invariant 1). To stop the table and the projection from
diverging, the spec recommends a single Postgres function
`recompute_entitlement_tx(...)` that does the `entitlements` upsert **and** the
`profiles` projection in **one transaction** (the edge runtime has no
cross-table txn otherwise). **The RPC + the `entitlements` DDL are A5/Chau-applied
via SQL Editor — D6 standing gate, never `db push`.**

---

## 5. Idempotency

- `now` is captured **once** at call entry and threaded into `deriveEntitlement`
  — never read via `Date.now()` inside derive. So **same input rows + same
  `now` ⇒ byte-identical `DerivedEntitlement`**.
- The write is an **upsert keyed on `(user_id, app_id)`** — N calls with the
  same derived value converge to one row, no duplicates, no append.
- `deriveEntitlement` is pure (no I/O, no globals): unit-testable with frozen
  `now`; safe to call repeatedly from retries, backfill, and admin replay.
- Net: `recomputeEntitlement` is **safe to call any number of times** for a
  user; it always re-derives from current rows and converges. This property is
  what makes the concurrency story (§6) self-healing.

---

## 6. Concurrency — interaction with B6 CAS backoff (#766)

**What #766 guards (and what it does NOT):** B6/#766 adds backoff+jitter to
`upsertSharedSubscriptionMonotonic`'s retry loop (`billing.ts:629`,
`for (attempt < MAX_MONOTONIC_RETRIES)`) — a CAS on the **`subscriptions`
ingest row**. It runs *before* recompute in the webhook path and does **not**
touch `entitlements`. So recompute always reads a `subscriptions` snapshot
that #766 has already settled.

**The residual hazard recompute introduces:** two concurrent triggers for the
same user (Stripe + RevenueCat, or two Stripe events) call
`recomputeEntitlement(userId)` concurrently. Because `deriveEntitlement` is a
**pure function of *all* current rows** (not of the triggering event), any
recompute that reads *after* the last `subscriptions` write produces the
correct answer regardless of which event woke it — the system is naturally
**convergent**. The *only* failure is a recompute that read an **old**
snapshot then writes its `entitlements` upsert **late**, clobbering a fresher
value (stale-overwrite — the exact class #766 solved one table upstream).

**Design decision (flag for impl dispatch — O4):**
- **(recommended)** Make the `entitlements` `ON CONFLICT` upsert
  **monotonic on `computed_at`**: `DO UPDATE … WHERE
  excluded.computed_at >= entitlements.computed_at`, wrapped in the **same
  `casRetry` helper #766 introduces**. One owner for backoff+jitter — do not
  fork a second implementation.
- Plus the natural convergence above as the self-heal: even a lost race
  re-converges on the next event's recompute.

**Hard depends-on:** #766 merged, so the shared CAS helper exists to reuse
(see Depends-on D-B6).

---

## 7. Failure modes — every failure surfaces to Sentry, none `console.warn`

`_shared/sentry.ts` already exports `captureEdgeError(error, { tags, extra })`
+ `wrapHandler`. Recompute uses it; the current
`finalizeSubscriptionProcessing` `catch { console.warn(...) }`
(`billing.ts:587`) is **deleted**.

| Failure | Detection | Behavior |
|---|---|---|
| `subscriptions` read error (R1) | supabase error | `captureEdgeError(err,{tags:{fn:"recomputeEntitlement",phase:"read-subscriptions",reason},extra:{userId,appId}})` → **throw** → webhook 5xx → provider retry |
| `user_subscriptions` gift read error (R2) | supabase error | same, `phase:"read-gifts"` → **throw**. Do **not** degrade to "no gifts" — that is a B22-class money-path silent failure |
| Gift rows inconsistent (`is_gift_redemption=false` present, or null expiry on a redeemed gift — B22) | post-read invariant check | filter from derive input **and** `captureEdgeError`-as-message, `level:"warning"`, with offending row ids → **surface, don't throw** (the rest of derive is still correct; silent drop is the B22 failure we exist to kill) |
| `entitlements` upsert error | supabase error | `captureEdgeError`, `phase:"upsert-entitlements"` → **throw** |
| `profiles` projection error | supabase error | if via the single `recompute_entitlement_tx` RPC → atomic with the upsert (both roll back, one throw). If implemented as a separate call → **throw**, `level:"error"` (entitlements written but projection stale = critical drift, never lost) |
| active→inactive transition (a *downgrade*) | compare prior `entitlements.is_premium` vs new | **not a failure** — emit the **B13 downgrade beacon** (Sentry breadcrumb + structured log, tags `reason`, `userId`) on every active→inactive flip so the rollout is observable & reversible (B13 §phase-3, §defense 5). Mandatory observability |

No terminal `console.warn` anywhere in the path.

---

## 8. Caller list — every entitlement-adjacent writer calls this, stops writing directly

| Current writer | Direct write today | B68 change |
|---|---|---|
| `stripe-webhook` → `finalizeSubscriptionProcessing` → `recomputeAndPersistEntitlement` (`billing.ts:542/577`) | `profiles.premium_*` | replace body with `recomputeEntitlement(supabase,userId,{reason:"stripe-webhook"})`; **delete the `console.warn` swallow** (`billing.ts:587`) |
| `revenuecat-webhook` (Apple/Google) | `subscriptions` (no recompute today) | after its monotonic subscriptions upsert, call `recomputeEntitlement(...,{reason:"revenuecat-webhook"})` |
| `redeem-gift-code` | `user_subscriptions` insert; returns `ok:true` even on dropped rows (B22) | after insert, call `recomputeEntitlement(...,{reason:"redeem-gift-code"})`; the `ok:true`-on-drop trap is closed by recompute's gift-inconsistency Sentry surface + a real error return |
| `redeem-access-code` | `user_subscriptions` | same as redeem-gift-code, `reason:"redeem-access-code"` |
| admin manual-fix | ad-hoc `profiles.premium_*` / `subscriptions` SQL Editor edits | manual fix becomes: edit the *input* rows, then invoke an `admin-recompute-entitlement` path (`reason:"admin-manual-fix"`). **Never a hand `profiles.premium_*` UPDATE.** |
| `src/billing/recomputeAndPersistEntitlement.ts` (browser, **DEAD** — B13/B48 W4) | would write `profiles.premium_*` | **delete** (zero prod importers) |
| `sync_profile_tier_from_latest_payment(uuid)` RPC (**DEAD** — B48 W6) | `profiles.tier` | **delete** |
| `trg_sync_profile_tier_from_payment` T2 trigger (**DORMANT** — B27/B48 W3) | `profiles.tier` | tombstone via B27 (out of B68 scope; listed because *nothing* may write entitlement state outside recompute) |

**Post-B68 invariant:** the only writer of `entitlements` / `profiles.premium_*`
is `recomputeEntitlement`. Everything else writes only the **inputs**
(`subscriptions`, gift rows) and then calls it.

---

## 9. Open design decisions for the implementation dispatch

| # | Decision | Recommendation |
|---|---|---|
| O1 | Who owns the pure `deriveEntitlement`(+expiry) — **B13 phase 3** or **B68 impl**? Both must not ship a copy (that *is* the B13 bug class). | One module, imported by all 4 readers **and** recompute. Dispatcher must assign single ownership; B48 says B13 ph3 "IS the creation of this function" → B68 impl *imports* it. |
| O2 | `profiles` projection: single `recompute_entitlement_tx` RPC (atomic) vs two edge calls (drift risk) | RPC — atomic, one Chau-applied DDL |
| O3 | Gift read (R2) removal | tied to **D3**; isolate R2 as a deletable block now |
| O4 | `entitlements` monotonic guard | reuse #766 `casRetry` on `computed_at` + natural convergence |
| O5 | Multi-app | `appId` defaults to `DEFAULT_APP_ID`; multi-app = per-app call, out of B68 scope (note only) |

---

## 10. Depends-on — gates before implementation can start

| Gate | Why | Status |
|---|---|---|
| **A5 — `entitlements` schema landed** | recompute cannot upsert a table that doesn't exist; A5 owns the DDL + `(user_id,app_id)` unique. Chau-applied (D6). | named in dispatch — **blocking** |
| **D1 = "materialized `entitlements` table"** (B48) | if D1 = pure-derive, the entire single-writer-table approach is void | **strategic, blocking** |
| **B13 phase 3** (shared `deriveEntitlement`+expiry) | recompute embeds it; B48 P1 says B13 ph3 creates it (see O1) | gated on Chau go + B13 P3.G1–G3 = 0 |
| **B17 PR1 / #774 merged** | "no gate reads `profiles.tier`" must be true before recompute is authoritative (B48 P1) | PR #774 OPEN |
| **B6 / #766 merged** | reuse its CAS+backoff+jitter helper for the `entitlements` upsert (§6) | PR #766 OPEN |
| **B11 + B12** (period_end field-order fix + historical backfill) | expiry derivation off `current_period_end` is only safe post-B11 (new writes) + B12 (old rows); B13 P1.G/P2.G/P3.G pre-flight gates must = 0 | reference-only upstream |
| **D3** (fold `user_subscriptions` → `subscriptions`) | changes the read shape (R2 disappears); spec is written so it's a localized deletion | strategic, future |
| **D6** (no unattended SQL path) | A5 schema + `recompute_entitlement_tx` RPC are Chau-hand-applied via SQL Editor | standing human gate |

**Implementation phase:** B13 phase 3 / B48 P2 *"recomputeEntitlement single
writer + entitlements table + delete dead `src/billing/*` + dead
`sync_profile_tier_from_latest_payment` RPC"*. This doc is its input. A future
dispatch — **not** this one.

---

## Worktree disposition

**`prune` — design fully captured here. No code, no follow-up worktree.**
Operator artifact, committed not PR'd (B16). Read alongside
`RECON-billing-target-state-B48.md` (origin/b48) and
`RECON-isentitling-fix-plan-B13.md` (refs/heads/b13) by the B13-phase-3 /
B48-P2 implementation dispatch.
