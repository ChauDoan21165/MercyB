# RECON — Billing / entitlement target state (B48)

> **Strategic scoping. NO code.** Synthesis dispatch: B45 (current-state map)
> + B47 (historical chronology) were to feed this. **Neither had committed
> when B48 started** (no `b45/*` or `b47/*` recon doc on any branch; no B47
> worktree exists). Per the brief's fallback clause, this target state is
> built from *committed sibling recon* (B7/B13/B22/B27/B30/B42 + RECON-tier-trigger),
> live source reads, and memory — not from B45/B47.
>
> Branch: `b48/billing-target-state` · off `origin/main` @ `5cfa27e3f`
> Date: 2026-05-19 · Labels: `silent-failure`, `money-path`, `stale-audit-note`
> Convention: B16 (`reports/RECON-<topic>-<agent>.md`, commit-don't-PR)
> Cross-refs (all committed, quotable without re-run):
> `reports/RECON-isentitling*-B13.md`,
> `reports/RECON-gift-entitlement-propagation-B22.md`,
> `reports/RECON-profile-trigger-architecture-B27.md`,
> `reports/RECON-tier-trigger.md`, `reports/RECON-*-B7.md`,
> `reports/RECON-*-B30.md`, `RUNBOOK-price-map-row-B42.md`.

---

## Verdict

In 6 months billing must answer **"is this user entitled?"** from **one
derived `entitlements` row per `(user_id, app_id)`**, written by **one
server-side `recomputeEntitlement(userId)`** and read by **one
`loadEntitlement()`**. Today the answer is computed **at least four times by
four functions that share the same independent expiry-blind bug** (B13), the
nominal source of truth (`subscriptions`) competes with **five parallel
surfaces** (`profiles.tier` text, `profiles.premium_*`, `payment_transactions`+T2,
`user_subscriptions` gifts, `billing_price_map`), and **every write-path
failure is swallowed with `console.warn`** (B13, B22 — `silent-failure` +
`money-path`). The consolidation is mostly *deletion*: the dead browser
`src/billing/*` stack, the dormant T2 trigger, the dead `sync_profile_tier_from_latest_payment`
RPC, and three of B7's five monitoring queries all disappear once the single
write path exists. **Six strategic decisions (D1–D6) gate code; none should
start before D1.**

---

## Evidence (current state — the thing we are migrating *from*)

### Write surfaces — 6 competing, no single path

| # | Surface | Writes | Status |
|---|---|---|---|
| W1 | `stripe-webhook` → `webhook-events.ts` → `finalizeSubscriptionProcessing` (billing.ts:577) → `recomputeAndPersistEntitlement` (billing.ts:542) → `deriveEntitlementFromSubscriptions` → `isEntitlingSubscription` (core.ts:167) | `profiles.premium_status/premium_expires_at/premium_source` (the MRR source) | **LIVE.** Failure **swallowed — `console.warn` only** (B13 §LIVE chain) |
| W2 | `revenuecat-webhook` (Apple/Google) | `subscriptions` | LIVE |
| W3 | `payment_transactions` INSERT → `trg_sync_profile_tier_from_payment` (T2) → `profiles.tier := subscription_tiers.vip_key::text` | `profiles.tier` (text, e.g. `level3`) | **DORMANT by table-mismatch** — no real-money path inserts into `payment_transactions` (B27 Verdict). Production-only drift, *not in migrations* (RECON-tier-trigger §1–2) |
| W4 | `src/billing/recomputeAndPersistEntitlement.ts` (browser copy) | would write `profiles.premium_*` | **DEAD — zero prod importers, test scaffold only** (B13 §DEAD chain) |
| W5 | `redeem-gift-code` / `redeem-access-code` | `user_subscriptions` | LIVE. **B22:** server recompute path **doesn't read gifts**; `redeem-gift-code` drops `is_gift_redemption=false` rows yet returns `ok:true` (`silent-failure`) |
| W6 | `sync_profile_tier_from_latest_payment(uuid)` RPC | `profiles.tier` | **DEAD — zero callers** (RECON-tier-trigger §1b) |

### Read surfaces — ≥5, four sharing one expiry-blind bug (B13)

| Reader | Path | Defect |
|---|---|---|
| **Live access gate** | `useEntitlements`/`useEntitlementQuery`/`authService:252` → `billing.ts:165` invoke `me-entitlement` → reads `subscriptions` (canonical) + `user_subscriptions` gift fallback → `normalizeStatus` (entitlement.ts:101) | `case "active": return "active"` — **NO expiry check** (blind spot #1) |
| `get-subscription-status` | index.ts:53 `isPremium = profiles.premium_status==='active'` | no expiry re-check; trusts the persisted value W1 wrote (blind spot #2) |
| `isEntitlingSubscription` | `stripe-webhook/core.ts:167` — MRR/persisted-metric writer | status-only (blind spot #3 — B7's function) |
| `_shared/billing.ts` | `toEntitlementResponse` | status-only (blind spot #4) |
| `tierRoomSource.ts`, `roomTierIndex.ts` | direct `SELECT … profiles.tier` | **type-broken** — `tier` is `text` (`free`/`level3`), code path assumes int; per RECON-tier-trigger neither actually consumes T2's output → mislabeled content-mapping, not entitlement |

### Source of truth today

`subscriptions` is the *de-facto* canonical store `me-entitlement` derives
from **on every read**. There is **no `entitlements` table**. Entitlement is
derived twice — on read (`me-entitlement/entitlement.ts normalizeStatus`) and
on write (`stripe-webhook/core.ts isEntitlingSubscription`) — by **two
copies** of the logic with **the same independent bug**. Adjacent money-path
data hazards (committed evidence): `billing_price_map` missing the current
Stripe yearly price id → **3 yearly subs (~6,000,000 VND/yr) invisible to
MRR** (B42); `period_end`/`period_start` field-order class bug fixed in code
(#770 merged, B26/#773 open) but **historical rows written before the fix are
still wrong** (B5/B11/B26 class).

---

## Root cause (by layer, per CLAUDE.md operating discipline)

- **Ownership.** No "one owner per function" for entitlement. Read-derive and
  write-derive are two owners of the same question → they drift (B13 proves
  they already have, identically).
- **Data shape.** `profiles.tier` is `text` but two readers treat it as
  numeric; `subscriptions` vs `user_subscriptions` split forces a gift
  fallback only the read path knows about (W5/B22).
- **Permissions/lifecycle.** Status is treated as a permission without its
  expiry — a lapsed `status='active'` row grants live premium (B13). T1
  freeze trigger correctly protects privileged columns and **must stay**;
  T2 is drift and **does nothing** (B27).
- **External.** MRR correctness depends on a hand-maintained `billing_price_map`
  that Stripe price-id churn silently invalidates (B42, B7-Q5).
- **Silent failure (the through-line).** Every write-path and gift-redeem
  failure degrades to `console.warn` / `ok:true`. The system cannot tell you
  it's losing money.

---

## Fix recommendation — the 6-month target state

### Target invariant 1 — Single source of truth

```
subscriptions        = provider-event store (Stripe/Apple/Google raw truth, append-mostly)
user_subscriptions   = FOLDED IN (gift/access-code rows become subscriptions
                       rows with source='gift_code') — pending D3
        │
        ▼  one shared pure fn:  deriveEntitlement(rows, now)  ── WITH expiry check
        │
entitlements (NEW)   = ONE canonical row per (user_id, app_id):
                       { status, source, expires_at, is_premium, computed_at }
                       ← the only answer to "is this user entitled?"
        │
        ▼  projection (write-only mirror, never authoritative)
profiles.premium_*   = read-only projection of entitlements (UI/legacy convenience)
profiles.tier (text) = FROZEN then DROPPED (pending D2)
```

`deriveEntitlement` is **one function, one copy**, esm.sh-free, imported by
both the read path and the write path (the same discipline already used for
`me-entitlement/entitlement.ts` and `stripe-webhook/idempotency.ts`). B13
phase 3 *is* the creation of this function.

### Target invariant 2 — Single read path

- **Server:** `_shared/entitlement.ts → loadEntitlement(userId, appId)` reads
  the `entitlements` row. **No re-derivation inside any gate.** `me-entitlement`,
  `get-subscription-status`, and the other gate fns all call it.
- **Client:** `getMeEntitlement()` → `me-entitlement` → `loadEntitlement`.
  `useEntitlements`/`useEntitlementQuery` already funnel here — unchanged.
- **Zero direct `profiles.tier` reads anywhere.** `tierRoomSource`/`roomTierIndex`
  either call `loadEntitlement` or, if proven content-mapping, are renamed
  `roomContentTier*` so the name can never again be mistaken for entitlement.

### Target invariant 3 — Single write path

```
stripe-webhook ─┐
revenuecat-webhook ─┤
redeem-gift-code ───┼─→ idempotent ingest into subscriptions
redeem-access-code ─┘            │
                                 ▼
              recomputeEntitlement(userId)   ← THE ONLY WRITER
                                 │
                  ┌──────────────┴──────────────┐  (one transaction)
                  ▼                              ▼
          UPSERT entitlements row      UPDATE profiles.premium_* projection
                                 │
                 failure → LOUD: Sentry beacon + non-200 to provider
                 (forces webhook retry) — NEVER console.warn
```

Gift/access-code redemption funnels through the **same** `recomputeEntitlement`
(this *is* B22's propagation hook). The dead browser `src/billing/*`
entitlement stack and the dead `sync_profile_tier_from_latest_payment` RPC
are **deleted**.

---

## Workstream placement on the target-state roadmap

| Workstream | Current artifact | Role in target state | Phase |
|---|---|---|---|
| **B13 phase 3** — fix the 4 expiry-blind gates | `b13/isentitling-fix-plan` recon (committed) | **Becomes the read-path foundation.** Don't "fix 4 functions" — *extract one `deriveEntitlement` with expiry, point all 4 at it.* This IS target invariant 1's shared fn. | **P1 (foundation)** |
| **B17 PR1** — premium gates read entitlement not stale `profiles.tier` | **PR #774 OPEN** (`b25/tier-gate-fix-pr1`, commit `0c14a206d`) | Precondition for everything tier-related: makes "no gate trusts `profiles.tier`" true. Merge first. | **P1 (foundation)** |
| **B27** — retire T2 dormant trigger + delete B25 numeric `tier>=N` bypass | `b27/profile-trigger-audit` recon (committed) | Removes W3. Tombstone migration; **keep T1 freeze**. Can land only **after** B17 PR1 (nothing may read `tier`). | **P2** |
| **B22** — gift propagation + `redeem-gift-code` silent-failure repair | `reports/RECON-gift-entitlement-propagation-B22.md` (committed by B36) | The recompute-reads-gifts hook = target invariant 3. Two options (D3): narrow standalone fix now, or fold `user_subscriptions` into the single store during P2. | **P2 (or P0 narrow)** |
| **B7** — money-path monitoring (5 queries) | `b7/money-path-monitoring-scoping` recon (committed) | Q1+Q4 = thin push **now** (safety net before surgery). Q2/Q3/Q5 drift classes **disappear** once single write path lands → don't build them. | **P0 (Q1/Q4) + retire Q2/Q3/Q5** |
| **billing_price_map missing-row INSERT** | `RUNBOOK-price-map-row-B42.md` (committed); B30 validated B7-Q5a = 2 real customers | Pure prod-data op, **Chau-applied via SQL Editor** (§D6). No code dependency — ship anytime. Recurs until D4. | **P0 (parallel, data-only)** |
| **period_end / period_start backfill** | code fixed: #770 merged (B5 class), #773 open (B26/B11); **historical bad rows un-backfilled** | Pure prod-data op, Chau-applied. Independent of consolidation. Run **after #773 merges** so the fix exists before backfill. | **P0 (parallel, data-only, after #773)** |
| **B17 PR2** — trial-expiry-emails sender | `reports/a6-trial-expiry-runbook.md`: `trial-expiry-emails` cron categorizes but **no real send**; needs own `trial-expiry-send` fn | Orthogonal to entitlement core (touches `profiles` read-only). Ships fully parallel. Gated by email-unsubscribe system (CLAUDE.md: not built — `legal`). | **Parallel (gated on unsubscribe infra)** |
| **B17 PR3** — sign-audio dead-code | (sign-audio resolver dead path) | Pure dead-code removal, zero entitlement coupling. Ship anytime. | **Parallel (independent)** |
| **B6** — CAS backoff+jitter on monotonic recompute | **PR #766 OPEN** (`b6/cas-backoff-jitter`) | Hardens the *concurrency* of the single write path. Lands cleanly before or with P2. | **P2 (write-path hardening)** |

---

## Sequencing graph

```
                      ┌─────────────────────────────────────────────┐
   D1 (entitlements    │  STRATEGIC GATE — nothing in P1/P2 starts   │
   table?) ───────────▶│  before D1. D2/D3/D4 gate their workstreams.│
                      └─────────────────────────────────────────────┘
                                        │
   P0 — ship NOW, no D1 dependency, fully parallel:
   ┌─ B7 Q1+Q4 thin push (safety net)
   ├─ B42 price-map INSERT ........... Chau SQL Editor (D6)  ┐ data-only,
   ├─ period_end/start backfill ...... after #773 merges ────┘ no code dep
   ├─ B17 PR3 (sign-audio dead-code)
   └─ B22 narrow fix (redeem-gift-code ok:true) ── optional early carve-out
                                        │
                                        ▼  (D1 decided)
   P1 — foundation (serial, this order):
   B17 PR1 (#774 merge) ──▶ B13 phase 3
        "no gate reads tier"      "one deriveEntitlement(+expiry),
                                   all 4 gates point at it"
                                        │
                                        ▼
   P2 — consolidation (parallelizable once P1 lands):
   ┌─ B27 retire T2 + del B25 bypass   (needs B17 PR1)
   ├─ B22 full fold-in                 (needs D3 + single write path)
   ├─ B6 CAS hardening (#766)          (write-path concurrency)
   └─ recomputeEntitlement single writer + entitlements table + delete
      dead src/billing/* + dead sync_profile_tier_from_latest_payment RPC
                                        │
                                        ▼
   P3 — projection + cleanup:
   profiles.premium_* → read-only projection; profiles.tier DROP (D2);
   B7 Q2/Q3/Q5 formally retired (drift classes gone)

   Parallel rail (no entitlement coupling, gated only as noted):
   B17 PR2 trial-expiry sender ── gated on email-unsubscribe infra (legal)
```

**Depends-on:** B13ph3 → B17 PR1; B27 → B17 PR1; B22-full → D3 + P2 writer;
backfill → #773. **Parallel-safe:** all of P0; B17 PR3; B17 PR2 (own gate);
B6. **Strategic-gate:** P1 & P2 → D1.

---

## Effort estimate

| Workstream | Est. (dev-days) | Notes |
|---|---|---|
| B7 Q1+Q4 thin push | 1.5 | B7 scoped ~3 d for all 5; only 2 survive |
| B42 price-map INSERT | 0.25 | runbook done; Chau applies (§2 confirm + INSERT) |
| period_end/start backfill | 0.5 | one-shot UPDATE, Chau-applied, after #773 |
| B17 PR3 sign-audio dead-code | 0.5 | mechanical removal |
| B22 narrow (`ok:true` trap) | 0.5 | standalone silent-failure carve-out |
| **P0 subtotal** | **~3.25** | all parallel → ~1.5 d wall |
| B17 PR1 review/merge (#774) | 0.5 | already authored |
| B13 phase 3 (extract shared `deriveEntitlement`+expiry, repoint 4) | 3–4 | the foundation; highest care (`money-path`, central file) |
| **P1 subtotal** | **~4** | serial |
| B27 retire T2 + del B25 bypass | 1 | tombstone migration + bypass delete |
| B22 full fold-in | 2–3 | depends on D3 scope |
| B6 CAS hardening (#766) | 0.5 | authored |
| `entitlements` table + single `recomputeEntitlement` + delete dead stacks | 4–5 | the core consolidation |
| **P2 subtotal** | **~8–9** | parallelizable to ~4–5 d wall |
| P3 projection + `profiles.tier` DROP + Q-retire | 1.5 | gated on D2 |
| B17 PR2 trial-expiry sender | 1.5 | parallel rail; +unsubscribe infra (separate) |
| **TOTAL (engineering)** | **~18–20 dev-days** | ≈ **3–4 wall-weeks** with the parallelism above |

Excludes the email-unsubscribe infra B17 PR2 sits behind (separate `legal`
workstream, not costed here).

---

## Chau-decision-needed (these gate code — answer before P1 starts)

- **D1 — Materialized `entitlements` table, or keep pure derive-on-read?**
  *Gates all of P1/P2.* A real table makes the write path the single owner,
  enables auditability and cheap reads, but adds a row to keep consistent.
  Pure-derive keeps zero new state but forces every reader through the heavy
  `me-entitlement` path forever and can't fix the "two derivations" problem
  structurally. **Recommend: table.** (Decision needed first; everything waits.)
- **D2 — `profiles.tier` (text): DROP the column, or freeze forever?**
  T1 freeze stays regardless. Dropping needs every reader gone first
  (`tierRoomSource`/`roomTierIndex` reclassified). Freeze-forever is zero-risk
  but leaves a permanently-confusing column. Gates **P3**.
- **D3 — Fold `user_subscriptions` (gifts) into `subscriptions`, or keep the
  legacy fallback permanently?** Fold-in = true single store (B22 fully
  closed). Keep = B22 stays a narrow patch the read path must remember
  forever. Gates **B22-full / P2 scope**.
- **D4 — MRR source of truth: `billing_price_map` join, or trust Stripe
  amounts on the subscription row?** As long as MRR depends on a
  hand-maintained map, the B42 missing-row class **recurs** every Stripe
  price-id change. Strategic, not just a one-row INSERT.
- **D5 — Build B7 monitoring before or after consolidation?** Recommend
  **Q1/Q4 before** (safety net during surgery), **Q2/Q3/Q5 never** (the
  consolidation deletes those drift classes — building them is wasted work).
  Confirm you want the net up *before* P1.
- **D6 — Prod-write authority.** Memory + B42/B27/backfill all confirm: **no
  unattended SQL/catalog path to this Supabase**; every migration, the
  price-map INSERT, the period_end backfill, and the T2 tombstone are
  **Chau-hand-applied via SQL Editor**. This is a standing human-in-the-loop
  gate on the *data* side of every workstream above — confirm it stays, and
  budget Chau's manual-apply time into each phase.

---

## Worktree disposition

**`prune` — strategic spec fully captured in this committed doc.** No code,
no follow-up worktree to keep. This file is the input to the next billing
dispatch; B45/B47, when they commit, should be read alongside it (this doc
flags where it relied on sibling recon instead of B45/B47, so a later reader
can reconcile if B45/B47 diverge — treat any divergence as `stale-audit-note`,
current `main` wins).
