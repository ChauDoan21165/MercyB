# A18 PR2 SCOPE — R1–R4 call-site wiring for `recomputeEntitlement` (A1i)

> **Agent:** A1i · **Branch:** `docs/a18-pr2-scope` · **Status:** scope
> document for the next code PR. **No production code touched here.**
>
> **Bottom line:** the *PR2 narrowed-scope code change* is a **single
> call-site rewire inside `stripe-webhook/billing.ts`** plus the
> consolidation deletions A18 §10 originally folded into PR1. R1, R2,
> R4 are READ surfaces and need no wiring — they benefit transitively
> once the `profiles.premium_*` projection (the read target of R2) is
> maintained correctly by the new writer. The other three live write
> surfaces named in A18 §9 (revenuecat-webhook, redeem-gift-code,
> redeem-access-code) are explicit follow-up PRs.

---

## 0. State as of authoring (2026-05-20)

Verified via `gh pr view` + `git ls-tree origin/main`:

| Component | State | Where |
|---|---|---|
| #802 — `_shared/entitlement.ts` (shared derive) | **MERGED** | `origin/main` |
| #826 — R1–R4 read-side repoint | **MERGED** | `origin/main` |
| #789 — `entitlements` table migration | **MERGED IN REPO** | `supabase/migrations/20260519230000_create_entitlements_table.sql` |
| #832 — `recompute_entitlement_tx` RPC migration | **MERGED IN REPO** | `supabase/migrations/20260519250000_create_recompute_entitlement_tx_rpc.sql` |
| #854 — `regenerate-db-types.sh` script fix | **MERGED** | `scripts/regenerate-db-types.sh` |
| #864 — A18 PR1 + PR1.5 (writer + downgrade beacon) | **MERGED** @ `228aea8d8` | `supabase/functions/_shared/entitlement/recompute.ts` on `origin/main` |
| **#789 + #832 applied to PROD via SQL Editor** | **UNVERIFIED** — Chau-only path per B48 D6 | requires Chau |
| **`database.types.ts` regenerated post-apply** | **UNVERIFIED** — `gen types` only works after the prod tables/RPC exist | requires Chau via #854 script |

PR2 dispatch is **unblocked the moment those two unverified items go green**. Code-side prerequisites are all met.

---

## 1. The dispatch's "R1–R4" framing vs A18's WRITE-path enumeration

The dispatch asked "for each R1–R4, what's the WRITE path today?" R1–R4 are B13-phase-3 **READ** labels. Most don't have a write path. Honest mapping:

| Label | File | Direction | Write path? |
|---|---|---|---|
| **R1** | `me-entitlement/entitlement.ts` + `index.ts` | READ only | NONE — returns the snapshot to the browser; never persists |
| **R2** | `get-subscription-status/core.ts` + `index.ts` | READ only (deprecated screen) | NONE — reads `profiles.premium_*` projection; never writes |
| **R3** | `stripe-webhook/core.ts` + **`billing.ts:600 recomputeAndPersistEntitlement`** | READ + **WRITE** | **YES — the only existing write path on main.** This is the one PR2 actually rewires. |
| **R4** | `_shared/entitlementResponse.ts` + `billing.ts:toEntitlementResponse` | READ only | NONE — reads `user_entitlements*` views; never writes |

**Conclusion:** the R1–R4 framing maps to a *single* PR2 write rewire (R3). R1, R2, R4 are READ surfaces that become *correct without further code changes* because PR2's new writer maintains a correct `profiles.premium_*` projection (which R2 reads) and a correct `entitlements` row (which R4 will eventually read once the views switch over — that's a P3 follow-up, not PR2).

A18 §9 enumerates **four additional write surfaces** beyond R3, all currently *un*wired (no recompute today). They are explicit PR2-follow-ups, NOT this PR's scope:

| # | Surface | Today | A18 §9 PR | This PR? |
|---|---|---|---|---|
| **W-stripe** | `stripe-webhook` `finalizeSubscriptionProcessing` | Calls seed `recomputeAndPersistEntitlement(supabase, userId, now)`, wrapped in `try/catch + console.warn` swallow (`billing.ts:646-651`) | **PR2 (this PR)** | ✅ |
| **W-revcat** | `revenuecat-webhook` | Writes `subscriptions` row, **no recompute call** | PR3 (follow-up) | ❌ |
| **W-redeem-gift** | `redeem-gift-code` | Inserts into `user_subscriptions`, **no recompute call** | PR4 (follow-up) | ❌ |
| **W-redeem-access** | `redeem-access-code` | Inserts into `user_subscriptions`, **no recompute call** | PR4 (follow-up, batched) | ❌ |
| **W-admin** | manual fix process | `UPDATE profiles.premium_*` by hand in SQL Editor | PR5 (process + thin admin invoke) | ❌ |

PR2 = **just W-stripe** (the only existing call site) + the dead-writer deletions A18 §10 originally folded into PR1.

---

## 2. PR2 scope — file-by-file

### 2.1 EDIT `supabase/functions/stripe-webhook/billing.ts`

**Today** (`billing.ts:599-651`):

```ts
async function recomputeAndPersistEntitlement(
  supabase: DBClient,
  userId: string,
  now: Date | number = new Date(),
): Promise<EntitlementSnapshot> {
  const { data, error } = await supabase
    .from("subscriptions")
    .select("status,current_period_end,provider")
    .eq("user_id", userId)
    .eq("app_id", DEFAULT_APP_ID);
  if (error) throw error;

  const entitlement = deriveEntitlementFromSubscriptions(
    (data ?? []) as Array<…>,
    now,
  );

  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      premium_status: entitlement.status,
      premium_expires_at: entitlement.expires_at,
      premium_source: entitlement.source,
    })
    .eq("id", userId);
  if (profileError) throw profileError;

  return entitlement;
}

export async function finalizeSubscriptionProcessing(params: {
  supabase: DBClient;
  userId: string;
  event: StripeWebhookEvent;
  shouldRecomputeBeforeFinalMark: boolean;
}): Promise<boolean> {
  if (params.shouldRecomputeBeforeFinalMark) {
    try {
      await recomputeAndPersistEntitlement(params.supabase, params.userId);
    } catch (error) {
      console.warn("stripe-webhook entitlement recompute skipped", error);
    }
  }

  return await markEntitlementEventProcessed({…});
}
```

**After PR2**:

```ts
import { recomputeEntitlement } from "../_shared/entitlement/recompute.ts";

// (the private recomputeAndPersistEntitlement function — DELETED)

export async function finalizeSubscriptionProcessing(params: {
  supabase: DBClient;
  userId: string;
  event: StripeWebhookEvent;
  shouldRecomputeBeforeFinalMark: boolean;
}): Promise<boolean> {
  if (params.shouldRecomputeBeforeFinalMark) {
    // No try/catch. recomputeEntitlement throws on any failure;
    // Stripe webhook 5xx → provider retry is the correct upstream
    // behaviour (A18 §7 / B68 §7). The terminal console.warn swallow
    // that lived here was A18 §10 item #4 — gone.
    await recomputeEntitlement(params.supabase, params.userId, {
      reason: "stripe-webhook",
    });
  }

  return await markEntitlementEventProcessed({…});
}
```

**Net delta**: ~−45 LOC (delete seed fn + delete swallow), ~+5 LOC (import + rewired call).

### 2.2 DELETE — A18 §10 dead-writer cleanup (folds into PR2 per narrower PR1 scope)

| Path | Why deleted | Verified |
|---|---|---|
| `src/billing/recomputeAndPersistEntitlement.ts` | Browser dead writer; 0 prod importers (B48 W4) | `grep src/ | grep import` → only its own test |
| `src/billing/recomputeAndPersistEntitlement.test.ts` | Tests the deleted file | Sibling-only consumer |
| `stripe-webhook/billing.ts:600 recomputeAndPersistEntitlement` (the seed fn body itself) | Replaced by `recomputeEntitlement` from `_shared/entitlement/recompute.ts` | Sole caller at `:646` is rewired in §2.1 |
| `stripe-webhook/billing.ts:646-651` (`try/catch` + `console.warn` swallow inside `finalizeSubscriptionProcessing`) | The whole point of A18 §7 — fail loud on the money path | A18 brief §7 / §10 item #4 |

### 2.3 NEW tests

- **Smoke**: `finalizeSubscriptionProcessing` calls `recomputeEntitlement` with `{reason: "stripe-webhook"}` for each of the three webhook events that fan into it (`webhook-events.ts:467, 742, 873`). One test asserting the import path is wired + the reason string is correct.
- **Failure-propagation**: if `recomputeEntitlement` throws, `finalizeSubscriptionProcessing` propagates (no swallow) — proven by removing the `try/catch`. One test mocking `recomputeEntitlement` to reject and asserting the outer call rejects identically.

Recompute's own coverage (idempotency, monotonic guard, gift inconsistency, downgrade beacon — see #864's 26-case suite) is **not duplicated** here.

### 2.4 NO changes — explicitly out of scope

- **R1 `me-entitlement/`**: untouched. R2 reads the projection PR2 maintains; this transitively becomes correct.
- **R2 `get-subscription-status/`**: untouched. Same transitive correctness.
- **R4 `_shared/entitlementResponse.ts`**: untouched.
- **`stripe-webhook/core.ts:194 deriveEntitlementFromSubscriptions`**: untouched. It still wraps the shared `deriveEntitlement` per #826; PR2 doesn't need to remove it (any callers — none today after the rewire — would still work).
- **W-revcat / W-redeem-* / W-admin**: explicitly PR3/PR4/PR5 (see §1 table).
- **No migrations.** PR2 ships zero `supabase/migrations/` files; #789 + #832 already exist in repo.

---

## 3. Hard gates PR2 must verify before dispatch

The implementing agent runs ALL of these and writes the verification block into the PR description. If any fails, **stop and report** — do not write code against a stale premise (project memory: `feedback_preflight_git_log`, `feedback_pause_on_branch_mismatch`).

| # | Gate | Verification command | What "green" looks like |
|---|---|---|---|
| **G1** | #789 applied to PROD `entitlements` table exists | Chau runs in Supabase SQL Editor: `SELECT 1 FROM public.entitlements LIMIT 0;` | Returns 0 rows, no `relation does not exist` error |
| **G2** | #832 applied to PROD `recompute_entitlement_tx` RPC exists | Chau runs: `SELECT p.proname FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace WHERE n.nspname='public' AND p.proname='recompute_entitlement_tx';` | Returns one row |
| **G3** | `database.types.ts` regenerated post-apply (covers #789 + #832) | Chau runs `bash scripts/regenerate-db-types.sh` (per #854) and commits the result; `grep -n recompute_entitlement_tx supabase/functions/_shared/database.types.ts` | One hit, in `Database['public']['Functions']` |
| **G4** | #864 merged on main | `git log origin/main --grep 'A18 PR1.5' --oneline` | Returns `228aea8d8` |
| **G5** | `_shared/entitlement/recompute.ts` actually present on main | `git ls-tree origin/main supabase/functions/_shared/entitlement/recompute.ts` | Returns one blob |
| **G6** | No new live caller of the seed `billing.ts:recomputeAndPersistEntitlement` since #864 | `grep -rn 'recomputeAndPersistEntitlement' supabase/functions/ src/ \| grep -v __tests__ \| grep -v 'feat/a18' branches` | Only the sole caller at `billing.ts:648` and the dead browser file (which PR2 deletes) |

`G1`, `G2`, `G3` are **Chau-only** (B48 D6: no unattended SQL path to this Supabase). The implementing agent CANNOT bypass these — attempting to run the SQL itself is forbidden. The agent's job is to wait until Chau reports the gate green, then proceed.

---

## 4. Rollback plan

PR2 is the highest-blast-radius rewire on the money path. Three layers of rollback:

### 4.1 Pure code revert (preferred — atomic, no data state)

```bash
git revert -m 1 <pr2-merge-sha>
```

Restores `stripe-webhook/billing.ts:recomputeAndPersistEntitlement` (the seed) and its `try/catch + console.warn` swallow. The deleted browser files come back. The dead seed re-becomes the live writer; `recomputeEntitlement` becomes dead code again (it's still on main, just unused).

**No data rollback needed**:
- The new writer wrote both `entitlements` and `profiles.premium_*` (atomically via the RPC).
- The reverted writer writes only `profiles.premium_*` — but the rows it writes are derived from the same `subscriptions` data, so values match.
- `entitlements` rows from the pre-revert period are stale but harmless — no code reads them (R4 still uses the legacy views; the table read-side switchover is a P3).

### 4.2 Forward-fix only (if revert would break something inadvertently)

If a revert is messy (e.g., #864-dependent code landed between PR2 merge and revert), the alternative is a small forward-fix PR that reverts the `finalizeSubscriptionProcessing` body back to the old `try/catch + recomputeAndPersistEntitlement` shape, *importing the seed back from git history*. Same effect, no large diff.

### 4.3 Emergency-only — RPC kill switch

If the RPC itself is misbehaving (PostgREST 500s, lock contention, etc.) and code revert can't be deployed fast enough, Chau can `REVOKE EXECUTE ON FUNCTION public.recompute_entitlement_tx FROM service_role;` in SQL Editor. Every webhook will then `throw`/5xx; Stripe retries until the revoke is reversed or code reverts.

This is the *worst* option (causes webhook 5xx storm) and should be **last resort** — it makes every paying customer's subscription update fail until someone notices. Mention only because it exists; not the default plan.

### 4.4 Rollback triggers (PR body must enumerate)

Trigger an immediate rollback if:
- `stripe-webhook` 5xx rate > 5% (sustained 10 min) — RPC or recompute likely broken.
- Real paying user reports losing premium incorrectly post-deploy. (Check the row's `current_period_end` for B5/#770 field-order legacy data first — that's a *data* fix, not a PR2 regression.)
- `entitlements` table size grows unboundedly or stops growing entirely (writer not running).

**NOT** rollback triggers:
- An expired-but-active user correctly losing premium (§6 of #826 — that's the fix working).
- Sentry breadcrumbs showing `billing.downgrade` events — that's A18 §7 row 6 working.
- One-off `read-prior-entitlement` warnings if #789/#832 weren't applied (gate failure; fix the gate, not the code).

---

## 5. Dispatch primer for the implementing agent

When G1–G6 are all green, dispatch with:

```
To <agent> — A18 PR2: wire stripe-webhook to recomputeEntitlement
                       + delete 4 dead writers (post-#864)

WORKTREE: git worktree add /private/tmp/<agent>-a18-pr2 \
            -b feat/a18-pr2-stripe-rewire origin/main
STAGGER:  sleep $((RANDOM % 60))

CONTEXT: All hard gates green per BILLING-a18-pr2-scope-A1i.md §3:
  - #789 entitlements table applied to prod (Chau-verified <DATE>)
  - #832 recompute_entitlement_tx RPC applied (Chau-verified <DATE>)
  - database.types.ts regenerated + committed (sha <SHA>)
  - #864 merged on main @ 228aea8d8

SCOPE (per BILLING-a18-pr2-scope-A1i.md §2):
  1. supabase/functions/stripe-webhook/billing.ts:
     - DELETE private recomputeAndPersistEntitlement(:599-647)
     - REWIRE finalizeSubscriptionProcessing(:640-657) to call
       recomputeEntitlement(supabase, userId, {reason:"stripe-webhook"})
       with NO try/catch — let it throw so Stripe retries on 5xx.
     - Update imports.
  2. DELETE src/billing/recomputeAndPersistEntitlement.ts +
     .test.ts (browser dead writer, 0 importers per B48 W4).
  3. Tests: smoke + failure-propagation per scope §2.3.
  4. Gates: typecheck:ci + lint + vitest + build all green.

DO NOT touch:
  - revenuecat-webhook, redeem-gift-code, redeem-access-code
    (PR3/PR4 follow-ups)
  - R1 (me-entitlement), R2 (get-subscription-status), R4
    (entitlementResponse) — read-only; transitively benefit.
  - Any migration file.

PR title: "feat(billing): A18 PR2 — wire stripe-webhook to
recomputeEntitlement + delete 4 dead writers"

PR body MUST include the G1–G6 verification table from §3 of the
scope doc (proof each gate was green at dispatch time) and the
§4 rollback plan link.
```

---

## 6. Open questions for Chau (none blocking)

None. Every uncertainty in the original A18 brief is resolved:
- D-G3 (CAS-retry helper): resolved — RPC's WHERE clause + JS accept-fresher pattern, no JS retry loop (cited in #864 PR body).
- B68 §1 derive-co-location contradiction: resolved per O1 — imported from `_shared/entitlement.ts`.
- A18 §10 deletions: split across PRs — PR2 deletes the 4 code-deletable; #5 (`sync_profile_tier_from_latest_payment` RPC) and #6 (`trg_sync_profile_tier_from_payment` trigger) are Chau-only SQL Editor work, NOT in any PR.

If Chau wants to know *when* PR2 dispatches: as soon as G1+G2+G3 are confirmed green. Today (2026-05-20) those three are unverified-pending-Chau; the moment they go green, PR2 is ready to fire.

---

## Sources

- Recompute writer: `git show origin/main:supabase/functions/_shared/entitlement/recompute.ts`
- Seed writer (to be deleted): `git show origin/main:supabase/functions/stripe-webhook/billing.ts` lines 599-657
- Browser dead writer: `git show origin/main:src/billing/recomputeAndPersistEntitlement.ts`
- A18 brief §9–§10: `git show origin/a18/recompute-impl-brief:reports/RECON-recompute-entitlement-impl-brief-A18.md`
- #826 read-side repoint (R1–R4 framing origin): merged at `7da69afc7`
- #864 writer + downgrade beacon: merged at `228aea8d8`
- B48 D6 (no unattended SQL path): `RECON-billing-target-state-B48.md` on `origin/b48`
- #854 type-regen script: merged at `68907f0dc`

---

## Status

- **No code touched.** No `recompute.ts`, no `stripe-webhook/billing.ts`, no `src/billing/*`, no migrations.
- **No SQL executed.**
- **No production data touched.**
- Pure scope document — operator artifact per B16. (PR is opened for visibility; the doc itself makes no code-changing claims.)
