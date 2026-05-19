# DISPATCH SPEC — B13 Phase 3: the single `deriveEntitlement` foundation (A12)

> **What this is.** The implementation brief for the highest-blast-radius PR of
> the billing consolidation: extract one expiry-aware `deriveEntitlement`,
> repoint all four expiry-blind readers at it, and make the write path persist
> a correct projection. Authored as meta-work by A12 (2026-05-19), grounded in
> live source reads of `origin/main @ 5cfa27e3f`, not in memory.
>
> **Status: BLOCKED — do not write code until §0 passes.** As of authoring,
> *none* of the four stated prerequisites is met on the ground. This is by
> design a runnable brief: §0 is the gate, §1–§9 are the plan once it opens.
>
> Branch: `b71/b13-phase3-brief` · Operator artifact, **commit-don't-PR**
> (explicit dispatch override of the recon-convention "spec → draft PR"
> exception — keep it commit-only).
> Convention: B16 `reports/RECON-<topic>-<agent>.md`. Labels the eventual PR
> should carry: `money-path`, `silent-failure`, `restore-before-redesign`.

---

## 0. PREREQUISITE GATE — verify all four, in writing, before any edit

The dispatching premise was *"D1 decided + A5 schema + A6 recompute design
collectively unblock B13 phase 3, and B17 PR1 (#774) is merged."* A12 checked
each against `origin/main` and every remote branch on 2026-05-19. **Current
reality:**

| Prereq | Claimed | Verified state (2026-05-19) | Gate |
|---|---|---|---|
| **D1** — `entitlements` table vs pure derive-on-read, *confirmed in writing by Chau* | "decided" | **NOT FOUND.** `RECON-billing-target-state-B48.md` only *recommends* "table"; it lists D1 as open in its own "Chau-decision-needed". No D1 record in `PENDING-CHAU-ACTIONS-2026-05-19.md` or any branch. | **HARD** |
| **A5** — entitlements schema spec | "landed" | **NOT FOUND** as a committed spec. `origin/investigate/a5-subscription-tracking` exists (content unverified); the `reports/a5-*.md` files are audio/offline/memory, unrelated. | Soft† |
| **A6** — recompute design | "landed" | **NOT FOUND.** `reports/a6-*.md` are email/sentry/trial-expiry runbooks, not a recompute design. | Soft† |
| **B17 PR1 (#774)** — premium gates read entitlement not stale `profiles.tier` | "merged" | **OPEN.** `gh pr view 774` → `state:OPEN`, head `b25/tier-gate-fix-pr1`, base `main`, `mergedAt:null`. | **HARD** |

† **A5/A6 are soft for *Phase 3 specifically*.** Phase 3 as scoped here (§2)
introduces **no `entitlements` table and no schema migration** — it is a
pure-logic refactor of the *existing* derive paths to respect expiry. The
table/schema (A5) and the single-writer recompute redesign (A6) are P2 per
B48, *downstream* of this PR, not inputs to it. Phase 3 makes the table
*adoptable later* by collapsing four derivations into one; it does not require
the table to exist. **If you can confirm that scoping with Chau, A5/A6 stop
being blockers for Phase 3.** D1 still gates whether the *next* phase builds a
table — but Phase 3's shared function is correct and useful under *either* D1
outcome (pure-derive keeps it as the read fn; table makes it the recompute
fn). That is the argument to put to Chau in the gate question.

### Gate procedure (the future agent runs this verbatim, first thing)

```bash
gh pr view 774 --json state,mergedAt,mergeCommit -q '.state,.mergedAt'
# REQUIRED: state == MERGED. If OPEN → STOP. B17 PR1 makes "no gate trusts
# profiles.tier" true; repointing readers before it merges means reader #2
# (get-subscription-status) and the tier readers contradict each other.
```

Then **ask Chau exactly this** (do not proceed on assumption — this is a
money-path PR; the For-Chau preflight discipline applies, ~1 in 3 briefs
carries a stale load-bearing claim and this one's premise is already stale):

> "Phase 3 = pure expiry-fix refactor, **no entitlements table, no
> migration** (that's P2/D1). Under that scope A5/A6 aren't inputs. Confirm:
> (a) D1 direction so the shared fn's home is right, (b) you accept the
> mid-deploy entitlement flip in §6, (c) #774 is merged. Yes to all three →
> I implement. Any no → I stop and report."

**If the gate does not fully pass: STOP. Write findings to
`reports/RECON-b13-phase3-blocked-<your-id>.md`, commit, report. Do not
write production code against an unconfirmed money-path premise.** That
failure (patch-and-retry without evidence on the billing path) is the exact
class CLAUDE.md and `docs/For_Chau_Study.md` name.

---

## 1. The canonical source of truth for this work

The B13 recon doc the dispatch named (`reports/RECON-isentitling*-B13.md`)
**does not exist as a committed file on any branch** (verified: `git
ls-tree` across all remotes). B13's findings survive *only* synthesized into
**`reports/RECON-billing-target-state-B48.md`** on `origin/b48/billing-target-state`
(commit-don't-PR recon branch, not on `main`). Read it first:

```bash
git show origin/b48/billing-target-state:reports/RECON-billing-target-state-B48.md
```

That doc is authoritative for *target state and sequencing*. **This brief is
authoritative for *what Phase 3 changes, file-by-file*** — A12 re-derived
every claim below from live code (`origin/main @ 5cfa27e3f`), so you do not
need to re-run the diagnostic. Where this brief and B48 agree, act; where a
later B45/B47 (still uncommitted per B48) diverges, `main` wins and the doc
is a `stale-audit-note`.

---

## 2. Scope — exactly what Phase 3 is and is NOT

**IS:** one new pure module `deriveEntitlement(rows, now)` with the expiry
check; the four expiry-blind readers repointed at it; the write-path derive
made expiry-correct so the persisted `profiles.premium_*` projection stops
lying; a post-merge one-time recompute so existing wrong projections are
corrected; exhaustive tests; real-device verification.

**IS NOT** (scope-creep tripwires — if you find yourself doing any of these,
STOP, you have left Phase 3):

- ❌ Creating an `entitlements` table or **any** SQL migration. Phase 3 ships
  zero files under `supabase/migrations/`. (This is what makes rollback a
  pure code revert — §7.)
- ❌ Deleting the dead browser stack `src/billing/*`
  (`recomputeAndPersistEntitlement.ts`, `computeEntitlement.ts`). Verified
  **zero prod importers** — it is W4/DEAD in B48, a *P2 deletion*, not Phase
  3. Do not "fix" it (dead-code-wiring trap, CLAUDE.md).
- ❌ Folding `user_subscriptions` gifts into `subscriptions` (B22/D3, P2).
- ❌ Retiring the T2 trigger / `profiles.tier` (B27/D2, P2).
- ❌ Building B7 monitoring queries.
- ❌ Touching `b6/cas-backoff-jitter` (#766) write-path concurrency — orthogonal.

Phase 3 is **logic only**, in `supabase/functions/`. "Small diffs over smart
diffs" — this is the most central money-path file set; the diff must be
minimal and the behavior change must be *exactly* "expired rows stop granting
premium," nothing else.

---

## 3. The four expiry-blind readers — verified file:line (live code)

All four share one independent bug: an entitling *status* grants premium with
**no check that the row hasn't expired**. The fix already exists, correctly,
in *one* place — `me-entitlement/entitlement.ts` `normalizeStatus`'s `default`
and `canceled` branches (`if (expiresAtMs !== null && expiresAtMs <= now)
return "expired"`, lines 145 & 148). Phase 3 = **generalize that exact,
already-correct, already-shipped rule to all entitling statuses and to all
four readers.** This is `restore-before-redesign`, not new design.

| # | File:line | Defect (quoted) | Derives over |
|---|---|---|---|
| **R1** | `supabase/functions/me-entitlement/entitlement.ts:113` (`normalizeStatus`); decision consumed at `:206` `normalizeEntitlement` → `:223` `is_premium: isPremiumStatus(status)` | `case "active": return "active";` — explicit `active/trialing/grace_period/past_due` cases skip the expiry check that the `default`/`canceled` cases (`:145`,`:148`) *do* apply. | N subscription rows (winner-select via `compareRows`) |
| **R2** | `supabase/functions/get-subscription-status/index.ts:50` | `const isPremium = premiumStatus === "active";` — `premiumExpiresAt` is read at `:49` and **never used**. | 1 persisted projection row (`profiles.premium_*`) |
| **R3** | `supabase/functions/stripe-webhook/core.ts:167` `isEntitlingSubscription` + `:178` `deriveEntitlementFromSubscriptions` | status-only (`status === "active" || ...`); winner emitted as `status:"active", expires_at: winner.current_period_end` with **no** `> now` test. **This is the WRITE-path derive** — persisted by `stripe-webhook/billing.ts:542 recomputeAndPersistEntitlement` → `profiles.premium_*`. | N subscription rows |
| **R4** | `supabase/functions/_shared/billing.ts:81` `toEntitlementResponse` (+ `:63 normalizeEntitlementStatus`) | `is_premium = status === "active" || ...`; `expires_at` is received at `:84`/`:93` and **passed through, never gated on**. | 1 row (via `readEntitlementForUser` `:207`, which probes `user_entitlements*`/`my_entitlements*` views) |

Consumption confirmed: `me-entitlement/index.ts:146 normalizeEntitlement(subscriptions ?? [])` (R1 is the live access gate); R3 persists via `recomputeAndPersistEntitlement` whose failure is **swallowed at `billing.ts:587 console.warn`** (the `silent-failure` through-line — out of scope to fix the swallow here, but note it in the PR body as the reason the post-merge recompute in §6 is *manual/verified*, not "trust the webhook").

---

## 4. The shared module — where it lives, what it exports

Create **`supabase/functions/_shared/entitlement.ts`** (NEW). Rationale:

- `_shared/` is the established cross-function home (already imported by
  multiple functions; `_shared/billing.ts`, `_shared/__tests__/` exist).
  R1 lives in `me-entitlement/`, R3 in `stripe-webhook/` — only `_shared/`
  can be cleanly imported by both (B48 invariant 1: *one copy, both paths*).
- **esm.sh-free** (no top-level network import) so `vitest` can import it
  directly — the exact discipline already used by
  `me-entitlement/entitlement.ts` and `stripe-webhook/idempotency.ts`. Tests
  land in `supabase/functions/_shared/__tests__/entitlement.test.ts`
  (directory already exists and runs under the existing runner).

**Exports (the contract — implement to this):**

```ts
export type EntitlementStatus =      // single source for the union (R4's
  | "active" | "trialing"            // _shared/billing.ts re-exports from here
  | "grace_period" | "past_due"
  | "paused" | "expired" | "revoked" | "inactive";
export type EntitlementSource = "stripe" | "apple" | "google" | "gift_code" | null;
export interface EntitlementInput {  // structurally accepts both a raw
  status?: unknown;                  // subscription row and a persisted
  expires_at?: unknown;              // projection row — readers pass either
  current_period_end?: unknown;
  source?: unknown; provider?: unknown;
  // …the loose fields the existing getExpiresAt/normalizeSource already read
}
export interface EntitlementSnapshot {
  is_premium: boolean;
  status: EntitlementStatus;
  source: EntitlementSource;
  expires_at: string | null;
}

/** THE canonical derive. Pure. `now` is INJECTED — never call Date.now()
 *  inside (mandatory for the expiry-edge unit suite; mirrors the
 *  recompute-injectable discipline, PR #580). */
export function deriveEntitlement(
  rows: EntitlementInput[],
  now: Date | number,
): EntitlementSnapshot;

// Leaf helpers (also exported, also pure, also tested):
export function getExpiresAt(row: EntitlementInput): string | null;
export function normalizeStatus(row: EntitlementInput, nowMs: number): EntitlementStatus;
export function isEntitled(status: EntitlementStatus, expiresAtMs: number | null, nowMs: number): boolean;
```

### The expiry rule — specify it exactly so the agent does not guess

`isEntitled(status, expiresAtMs, nowMs)`:

1. If `status` ∉ `{active, trialing, grace_period, past_due}` → **false**
   (unchanged: `paused/expired/revoked/inactive` were never premium).
2. Else if `expiresAtMs === null` → **true**. *Absent expiry stays
   entitling.* Lifetime/gift grants legitimately have null end; the proven
   bug is "active **+ past** expiry," not "absent expiry." Introducing a
   lockout for null-expiry would be new design and would flip legitimate
   users — forbidden (`restore-before-redesign`).
3. Else → **`expiresAtMs > nowMs`** (strict). At-exactly-`now` = **expired**.
   Document this boundary in the test; it matches the existing
   `expiresAtMs <= now ⇒ expired` at `entitlement.ts:148`. **No clock-skew
   grace** in Phase 3 (a skew tolerance is itself a policy decision — log it
   as a follow-up, do not invent one here).

`normalizeStatus` keeps the existing raw→canonical *string* mapping verbatim
(including the existing correct `canceled + future expiry ⇒ active` at
`:145`) — Phase 3 changes only *who decides `is_premium`*, by routing every
reader's `is_premium` through `isEntitled`. Winner-selection (`compareRows`/
`statusRank`) is **lifted into this module unchanged** and reused by R1/R3 so
the two multi-row readers stop carrying divergent sort logic — but its output
must be **byte-identical** to the old path for non-expired inputs (parity
test, §5). The only intended behavioral delta anywhere is rule (3).

---

## 5. The four repoint operations (one PR — see §8)

Repoint all four in a **single PR** so read-derive and write-derive flip
together. Splitting them across PRs creates a window where the read path and
write path disagree about the same users — that is exactly the drift B13
proved; do not reintroduce it.

- **R1 `me-entitlement/entitlement.ts`** — thread `now` from `index.ts`
  (`index.ts:146` becomes `normalizeEntitlement(rows, now)`); replace
  `:223 is_premium: isPremiumStatus(status)` with the shared
  `deriveEntitlement(rows, now).is_premium`. Keep the `status` string in the
  response (back-compat for downstream consumers). `computeTrialStatus`
  (`:237`) is **untouched** — it is time-based, not status-based, no
  interaction; assert that in a test.
- **R2 `get-subscription-status/index.ts`** — this file is one `Deno.serve`
  with a top-level esm.sh import → **not vitest-importable**. Required
  sub-step: extract the entitling decision into
  `get-subscription-status/core.ts` (esm.sh-free), exactly the split pattern
  already applied to `me-entitlement` (index → entitlement.ts). `index.ts`
  then calls `core.ts`; `core.ts` calls `deriveEntitlement([{status:
  premiumStatus, expires_at: premiumExpiresAt, source: premiumSource}],
  now).is_premium`. Without this extraction R2 has no integration test —
  non-negotiable for a money-path reader.
- **R3 `stripe-webhook/core.ts`** — reimplement `deriveEntitlementFromSubscriptions`
  to delegate to `deriveEntitlement(rows, now)`; delete `isEntitlingSubscription`
  or make it a one-line delegate. **`now` must be injected**: thread it from
  the caller `stripe-webhook/billing.ts:542 recomputeAndPersistEntitlement`
  (add a `now` param defaulting to `new Date()` at the webhook entrypoint,
  injectable in tests). This fixes what gets *persisted* to `profiles.premium_*`.
- **R4 `_shared/billing.ts`** — `toEntitlementResponse` recomputes
  `is_premium` via `deriveEntitlement([{status, expires_at, source}],
  now).is_premium` (it already receives `expires_at` at `:84`/`:93`). Move
  the `EntitlementStatus` union to `_shared/entitlement.ts` and re-export to
  avoid two definitions drifting. `now` defaults to `new Date()` at the call
  boundary, injectable for tests.

### Test requirements (gate the PR — `fake-green-test` is a named class here)

1. **`deriveEntitlement` unit suite** — full matrix:
   `{status: all 8 canonical} × {expiry: null | past | exactly-now | future |
   unparseable} × {0 rows | 1 row | multi-row winner contention}`. Explicit
   named cases: `active + past expiry ⇒ NOT premium` (the bug); `active +
   null expiry ⇒ premium` (no new lockout); `expiry === now ⇒ expired`
   (boundary); `canceled + future expiry ⇒ active` (parity with old `:145`);
   empty rows ⇒ `inactive/false`.
2. **Per-reader integration test** — one each for R1–R4 asserting: an
   expired-but-`active` input now returns non-premium **and** a valid
   unexpired input still returns premium. This is the regression lock that
   the leak is closed *at that surface* (R2 needs its new `core.ts` to exist
   first).
3. **Behavioral-parity tests** — for non-expired inputs, each repointed
   reader's full output is unchanged vs. captured pre-PR output. Locks that
   the refactor changed *only* rule (3) and nothing else (this is what makes
   the central-file change safe).
4. Runner check: after adding `_shared/__tests__/entitlement.test.ts`, run
   the single file and confirm the existing runner actually collects it
   (`_shared/__tests__/*.test.ts` siblings already run — verify, don't
   assume). Both gates green before commit: `npm run typecheck:ci` (bare
   tsc, catches config files CI rejects) **and** `npm run lint`.

---

## 6. Failure mode — in-flight users mid-deploy (decide before coding)

B13 proves read-derive and write-derive **already drift identically** (same
bug, both sides). Making both correct *consistently* means: **every user
currently shown premium *solely* because of an entitling-status row whose
expiry is already in the past will flip to non-premium the moment Phase 3
deploys.** That is the *correct* state — they are not entitled — but it is a
user-visible money-path change and must be handled deliberately, not
discovered in production.

**Mandatory pre-merge quantification (Chau-run — per B48 D6 there is *no
unattended SQL path* to this Supabase; provide the exact read-only queries):**

```sql
-- A. projection readers (R2/R4 surface) — users who will flip:
select count(*) from profiles
 where premium_status in ('active','trialing','grace_period','past_due')
   and premium_expires_at is not null
   and premium_expires_at <= now();

-- B. derive readers (R1/R3 surface) — entitling sub rows already expired:
select count(*) from subscriptions
 where app_id = 'mercy_blade'
   and status in ('active','trialing','grace_period','past_due')
   and current_period_end is not null
   and current_period_end <= now();
```

**Decision (decided here so the future agent need not ask — confirm with
Chau, do not silently rug-pull):** these users **should** lose premium
(correctness; they are not paying). Ship the fix as-is. **Do NOT add a grace
fudge / skew window to soften the flip** — that re-introduces the exact bug.
If count A or B is non-trivial, the handling is *communication*, not code:
Chau decides whether a one-time courtesy email / re-offer goes out (separate
workstream, not Phase 3). The PR description must state the measured counts.

**Deploy-order hazard.** Edge functions deploy via CI and may land at
different times. Correctness is order-independent (all paths move to the same
rule), but R2/R4 read the *persisted* `profiles.premium_*`, so stale
`premium_status='active'` rows keep granting premium until R3's fixed write
path runs *and* a recompute touches each user. Therefore Phase 3's
definition-of-done includes a **one-time post-merge recompute**: for the
users in query A/B, re-derive and rewrite `profiles.premium_*` with the new
logic. Deliver this as a Chau-run admin invocation or a one-shot read-only-
verified SQL `UPDATE` script in the PR (not an unattended job — the webhook
failure swallow at `billing.ts:587` means "let the next webhook fix it" is
not a guarantee). State it as an explicit checklist item, not a footnote.

---

## 7. Rollback

Because Phase 3 ships **zero migrations** (§2) and is pure derivation logic in
edge functions, rollback is total and clean:

1. `git revert -m 1 <phase3-merge-sha>` → restores the prior (buggy but
   known) behavior exactly.
2. Redeploy the affected edge functions (`me-entitlement`,
   `get-subscription-status`, `stripe-webhook`, anything importing
   `_shared/billing.ts` / `_shared/entitlement.ts`).
3. The post-merge recompute (§6) is **forward-only** but harmless to leave:
   it wrote *correct* projections; reverting the code reverts the *reading*
   of them, so behavior returns to baseline. No data rollback needed —
   another reason Phase 3 carries no migration.

Rollback trigger criteria to put in the PR body: a real paying user reported
losing premium incorrectly (i.e., a *false* expiry — investigate the row,
likely a `period_end` field-order legacy bad row, B5/#770 class, *not* a
Phase 3 logic fault), or the `me-entitlement` error rate rises post-deploy.
A correct flip of an expired user (§6) is **not** a rollback trigger — it is
the fix working.

---

## 8. Real-device verification (mandatory before merge — Chau-run)

Vietnamese flagship-device, real money path. Exact checklist for Chau:

- [ ] A genuinely-active paid account → still sees premium (no false lockout).
- [ ] A known-expired account (or a test sub with `current_period_end` in the
      past) → correctly **loses** premium across all surfaces: the in-app
      access gate (R1), the subscription-status screen (R2).
- [ ] A null-expiry / gift account → **keeps** premium (rule 2 holds).
- [ ] Kids mode unaffected (it is offline-first, not entitlement-gated —
      sanity only).

Merge is blocked until this checklist returns clean. "Compiles + unit-green"
is not "verified" on the money path (`feedback_testing_discipline`).

---

## 9. Dispatch size & sequencing recommendation

**Estimate: ~3–4 dev-days** (matches B48's line item: *"B13 phase 3 — extract
shared `deriveEntitlement`+expiry, repoint 4 — 3–4 — the foundation; highest
care, `money-path`, central file"*).

**Split into 2 PRs, in this order:**

- **PR-A — additive shared module + exhaustive unit suite.**
  `supabase/functions/_shared/entitlement.ts` + `_shared/__tests__/entitlement.test.ts`
  only. **Zero importers, zero behavior change** → trivially reviewable in
  isolation, trivially revertable, zero blast radius. Reviewer can scrutinize
  the expiry rule and the parity-with-`:145` claim without a money-path diff.
- **PR-B — atomic repoint of all four + integration/parity tests +
  post-merge recompute script.** Depends on PR-A. The four repoints
  (R1–R4) stay **together in PR-B** — never split the four across PRs (the
  read/write drift window, §5). This is the `money-path` PR; it carries the
  real-device gate (§8) and the §6 quantification.

Single-PR is *defensible* (atomicity) but rejected here: it puts the
zero-risk module and the highest-risk repoint in one diff, defeating the
point of isolating the risky change. Two PRs, PR-A→PR-B, is the
`small-diffs-over-smart-diffs` choice.

Both PRs base on `origin/main` (not stacked on each other's branch — PR-B
branches from `origin/main` *after* PR-A merges, then `git log origin/main`
confirms PR-A's sha is actually on main before PR-B starts; the stacked-PR
squash-orphan trap, `feedback_stacked_pr_squash_orphan`).

---

## 10. Worktree disposition

**`keep — spec for the B13-phase-3 implementation dispatch.`** This file *is*
the implementation spec; it must outlive this worktree. Committed to
`b71/b13-phase3-brief`, no PR (operator artifact, explicit override). The
implementing agent reads this + `git show
origin/b48/billing-target-state:reports/RECON-billing-target-state-B48.md` and
needs nothing else from Chau beyond the three §0 gate confirmations.
