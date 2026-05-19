# RECON — gift→canonical write vs read-fallback: the design answer (B58)

**Agent:** B58 · **Branch:** `b58/gift-write-or-fallback` · off `origin/main` @ `5cfa27e3f` · **No PR** (recon, B16).
**Date:** 2026-05-19 · **Labels:** `silent-failure`, `money-path`, `stale-audit-note`
**Scope:** Fresh diagnostic answering the design question B22 was dispatched for and never
committed (B45 inconsistency #2; B36 reconstructed *observations*, not the *decision*).
**No code change.** Markdown-only — no typecheck/lint/build gate applies; `npm ci` skipped
(no gate to run; per memory `feedback_worktree_gates_node_modules` node_modules is a gate-run
dependency only).

> Reads-of-record: `me-entitlement/index.ts:27-63,146-162` (the live read-fallback),
> `src/lib/useEntitlements.ts:101-129` (client overlay twin),
> `redeem_access_code_atomic` RPC (`migrations/20260510020000`, the W3 writer),
> `stripe-webhook/billing.ts:542-590` (`recomputeAndPersistEntitlement`, the canonical writer),
> `get-subscription-status/index.ts:49-53` (a canonical-only reader).
> Cross-refs (committed): `RECON-billing-architecture-as-built-B45.md` §Known-gaps #1 + §Inconsistencies #2,
> `RECON-gift-entitlement-propagation-B22.md` (B36 salvage), `RECON-profile-trigger-architecture-B27.md` §2-§4,
> `RECON-billing-target-state-B48.md` D1/D3 + invariant 3.

---

## Verdict — the design answer

**The read-fallback is NOT the intended terminal design. It is a confined compensating
patch, and a canonical gift write IS architecturally required — but it must land as
B48's single-writer (Option C), not as a fourth bolt-on writer (Option A).**

Two independently sufficient proofs that the fallback was never meant to be the design:

1. **Its own code calls itself a stopgap.** `me-entitlement/index.ts:27-41`: *"Without
   this fallback, a user with a perfectly valid gift redemption sees Free / Inactive."*
   `useEntitlements.ts:104-106`: *"Until those are bridged **server-side**, gift redeemers
   would otherwise show as Free."* Both comments describe a bridge pending a server-side
   fix — not a chosen architecture.
2. **It is structurally incomplete and cannot be completed in fallback form.** The gift
   fallback exists in exactly **one** server reader (`me-entitlement`) and **one** client
   twin (`useEntitlements`→`src/lib/gift/fetchActiveGiftSubscription.ts`) — verified:
   `grep -rln is_gift_redemption supabase/functions` returns *only* `me-entitlement`.
   Every other reader of the canonical pair sees gift users as **Free**.

---

## Evidence

### What gift redemption actually writes (W3, `redeem_access_code_atomic`)

Reading the RPC body (`migrations/20260510020000`, the final atomic version, `a1/gift-redeem-fix`
ee329ceba, on `main`): a redemption writes **only** `user_subscriptions`
(`is_gift_redemption=true`, `status='active'`, `current_period_end`),
`payment_transactions(status='completed')`, `access_code_redemptions`, and bumps
`access_codes.used_count`. It **never** inserts `subscriptions` and **never** touches
`profiles.premium_status / premium_expires_at / premium_source`. (It does fire **T2** via
the `payment_transactions` INSERT → may set `profiles.tier='vip9'`, the only path that
fires T2 — B27 §2 — but no post-B17/B25 gate reads `tier`, so that signal is inert.)

### Who writes the canonical pair — and gift is not among them

`stripe-webhook/billing.ts:542` `recomputeAndPersistEntitlement` selects **only**
`subscriptions`, derives via `deriveEntitlementFromSubscriptions`, and is the **sole**
writer of `profiles.{premium_status,premium_expires_at,premium_source}` (RevenueCat writes
a partial `premium_status`). A gift user has **zero `subscriptions` rows**, so if recompute
ever runs for them it writes `premium_status='inactive'` — recompute is **gift-blind by
construction** (B22/B36 "recompute path doesn't read gifts", now confirmed at
`billing.ts:545-547`).

### The gap is not "the read path" — it is every canonical reader except one

| Reader | Reads | Gift user result |
|---|---|---|
| `me-entitlement/index.ts:152-162` | `subscriptions` → **gift fallback** `user_subscriptions` | **Premium ✓** (the only place it works) |
| `useEntitlements.ts:115-129` | client twin of the same fallback | **Premium ✓** (UI only) |
| `get-subscription-status/index.ts:53` | `profiles.premium_status ?? 'inactive' === 'active'` | **FREE ✗** (verified read) |
| `_shared/billing.ts toEntitlementResponse` | `profiles.premium_*` status | **FREE ✗** |
| `azure-phoneme` / `mock-interview` (B25 `isPremiumEntitled`) | `premium_status` + expiry | **FREE ✗** |
| any future server gate reading `profiles.premium_*` | canonical pair | **FREE ✗** |

So today a gift redeemer sees Premium on `/account` but is **denied pronunciation scoring,
the paid mock-interview limit, and any server feature that reads the canonical pair
without proxying the heavyweight `me-entitlement` edge fn.** This is precisely the task's
"server-side gates that don't go through me-entitlement see free" and B45 §Known-gaps #1.

### Live blast radius is near-zero today (a quantification B22 lacked)

`migrations/20260510020000` records the *entire* gift population: 30 `GIFT*` codes, and at
authorship **exactly one** redemption existed (trankhuctriet, `5171545f…`) — which was
**hand-patched** (`profiles.tier='vip9'` set manually in SQL Editor, plus a per-row
`user_subscriptions` UPDATE in the migration). Conclusion: **the gap is real and
architectural but currently affects ~1 hand-fixed user → no P0 emergency.** This is the
fact B22's "quantification NOT RECOVERABLE" left open; it removes the case for a rushed
Option-A stopgap.

### Industry pattern

The two reference shapes: **(a) canonical entitlement projection** — one
materialized entitlement row written by webhook/redeem ingestion, every surface (UI *and*
server gates) reads the projection, never re-derives; vs **(b) derive-at-read** — recompute
from raw provider events on every read. RevenueCat's `entitlements`, Stripe's recommended
"store the subscription state you act on" guidance, and Adapty/Superwall all converge on
(a): **one writer, one materialized row, projected outward, never N independent
derivations.** MercyBlade's current state — derive-at-write (stripe-webhook) +
derive-at-read (me-entitlement) + a `profiles.premium_*` projection + a `profiles.tier`
cache + a gift fallback duplicated in 3 places — is the documented anti-pattern (B45/B48).
The read-fallback is not a design; it is the absence of one.

---

## Root cause (by CLAUDE.md layer)

**Ownership + data-shape**, not loading/permissions. Gift redemption was added as a third
write path that lands in a *different* table (`user_subscriptions`) than the canonical
projection's only input (`subscriptions`), with no bridge. The fallback "fixed" the one
reader that complained loudest (`/account`) rather than the projection, so the canonical
pair is now **false for gift users** and every projection reader inherits the lie. Same
"one owner per function" violation as the rest of the billing map: entitlement for gifts
is derived in three divergent places (`me-entitlement`, `useEntitlements`,
`src/lib/gift/*`), none of them the canonical writer.

---

## Impact

**Money-path, silent.** A paid-equivalent (gifted) user is denied paid server features
(azure-phoneme, mock-interview, any premium-gated edge fn) with no error surfaced —
indistinguishable from a free user to every reader except `me-entitlement`. Blast radius
**today ≈ 1 user** (hand-patched) → severity **architectural-high, operational-low**:
fix it correctly on the roadmap, do **not** hot-patch. **Sequencing hazard (new):**
B17/B25 deliberately *retire* `profiles.tier` reads in favour of `premium_status`. Since
gift never writes `premium_status`, **B17/B25 makes the server-gate gift-denial
permanent** for any gate that reads the canonical pair directly — until Option C lands or
every gate proxies `loadEntitlement`. This was not called out in B45/B48.

---

## Fix recommendation

**Reject Option B. Reject Option A as a primary fix. Adopt Option C
(B48's single materialized writer); A is permitted only as a time-boxed P0 carve-out and
the evidence says it is *not* warranted now.**

- **Option B — "keep read-fallback, retire `profiles.tier` reads (B17 PR1/2/3) so the
  fallback is the only path" → REJECT.** B17/B25 repoints gates from `profiles.tier` to
  `profiles.premium_status`+expiry. Gift never writes `premium_status`, so B17/B25 does
  **not** route gates through the fallback — it routes them to a column that is `inactive`
  for gift users. "Make the fallback the only path" is **impossible**: the fallback lives
  only in `me-entitlement`/the client hook, and server gates deliberately must **not** all
  call the heavyweight edge fn (B48 invariant 2). B conflates two distinct stale signals
  (`profiles.tier` vs the `subscriptions`↔`user_subscriptions` split) and would *worsen*
  the gap.
- **Option A — gift writes canonical `premium_*` + gift-revoke unwrites → REJECT as
  primary.** It adds a **fourth** uncoordinated writer to the exact pair B45/B48 identify
  as the disease, needs new re-derivation logic for gift∩Stripe users, and invents a
  *gift-revoke* concept that does not exist (the RPC only redeems; there is no unredeem).
  It actively makes Option C harder. Defensible **only** as a P0 if live harm exists — and
  the evidence (≈1 hand-fixed redeemer) says it does **not**.
- **Option C — B48's materialized `entitlements` table; gift funnels through the single
  `recomputeEntitlement` writer; `profiles.premium_*` becomes a read-only projection →
  ADOPT.** This is the *only* option that (i) fixes **all** readers including server gates,
  (ii) removes the 3-way duplicated gift derivation, (iii) makes revoke fall out for free
  (recompute over the folded-in store; expired/removed gift row → entitlement drops with
  no bespoke unwrite), and (iv) is *already the ratified target* — B48 invariant 3 states
  verbatim "Gift/access-code redemption funnels through the **same** `recomputeEntitlement`
  (this *is* B22's propagation hook)."

**The design question is therefore answered, and it resolves B48's open D3 in the
"fold-in" direction:** keep-the-fallback-forever is not viable because it leaves the
canonical projection *false*, not merely "a patch the read path remembers" — B48 D3's
"keep" wording understates this (flag: `stale-audit-note`, correct D3's "keep" cost).

---

## Sequencing impact on B48's roadmap

Consistent with B48; three sharpenings:

1. **D3 is decided: fold `user_subscriptions` into the single store; do not keep the
   legacy fallback permanently.** B58 supplies the missing argument B48 D3 lacked.
2. **D1 ("table vs pure-derive") — reinforce B48's "table".** Only a materialized row
   lets gift/Stripe/RevenueCat write one entitlement that *all* readers (incl. server
   gates) trust without re-deriving. Pure-derive cannot fix this (gates would each have to
   call `me-entitlement`, which B48 invariant 2 forbids).
3. **B22 stays at B48's P2 "full fold-in (needs D3 + single write path)" — and the P0
   narrow carve-out should stay narrow.** B48 already allows a P0 carve-out for the
   `redeem-gift-code` `ok:true` silent-failure trap; keep *that* (real silent-failure,
   tiny diff), but **do not** expand the P0 to an Option-A canonical write: the ≈1-user
   blast radius does not justify entrenching a fourth writer days before C deletes it.
4. **New guardrail to add to B48 P1.** From the moment B17 PR1/B25 lands (B48 P1) until C
   lands (P2), enforce *"no server gate reads `profiles.premium_*` directly; gates call
   `me-entitlement`/future `loadEntitlement`"* — otherwise any gate added in that window
   silently denies gift users. This makes B48 invariant 2 a **P1 entry condition**, not
   just a P2 outcome.

Net: no new workstream; B58 closes the *decision* B22 left open (C, fold-in), tightens
B48 D1/D3, and adds one P1 guardrail. Depends-on graph unchanged.

---

## Worktree disposition

`prune` — this doc is the decision record that closes B45 §Inconsistencies #2 and B48 D3;
no live state, no follow-up code owned here. The implementation lives on B48's P2
("B22 full fold-in") gated by D1=table. Re-open only to add a `> SUPERSEDED` banner when
the single-writer `recomputeEntitlement` (Option C) lands.
