# RECON — Stripe duplicate-subscription fix (stale-branch resurrection)

**Agent:** stripe-dupe-fix-agent
**Branch:** `stripe-duplicate-sub-fix` (off fresh `origin/main` @ `68855a29`, #556)
**Date:** 2026-05-17
**Source task:** resurrect/audit/ship the "unmerged" `origin/fix/stripe-duplicate-subscription` money-path fix
**Reference:** RECON-stripe-audit.md (branch `stripe-payment-audit`)

---

## TL;DR — verdict: NOTHING TO SHIP

**The bug is not present on `origin/main`. The fix is already live, byte-identical, shipped via merged PR #215.** The "unmerged branch" flag in today's Stripe audit is a `git branch --merged` false-positive: PR #215 squash-landed the branch's two commits with rewritten SHAs, so `--merged` SHA-matching reports the branch as unmerged even though its *content* is in production.

Resurrecting / rebasing / cherry-picking the branch would produce an **empty no-op patch**. Per locked **#5** (diagnose before patching) and CLAUDE.md operating discipline ("Don't solve uncertainty with more code"), **Phase 2 "apply the fix" is void.**

The only real residual is a **test-coverage gap**: the shipped money-path duplicate-subscription guard has **zero automated test coverage**.

---

## 1. Original branch summary

`origin/fix/stripe-duplicate-subscription` — 2 commits unique vs main, merge-base `a3c34fbb` (PR #317 era — ancient divergence, ~240 commits behind):

| Commit | Author date | File | Δ | What |
|---|---|---|---|---|
| `d8b69982` | 2026-04-27 | `src/lib/billing.ts` | +9/−2 | Frontend: add `action === "already_subscribed"` to the portal-redirect duplicate guard (alongside existing `manage_billing` + `already_subscribed:true`) |
| `f5e09918` | 2026-04-27 | `supabase/functions/billing-stripe-change-plan/index.ts` | +55 | Backend: Stripe-direct last-line duplicate guard inside `createCheckoutSessionForFreeUser`, after `ensureValidStripeCustomer`, before `checkout.sessions.create`. Lists subs directly from Stripe; bails with `manage_billing` shape if any `active/trialing/past_due/unpaid`. **Fail-open** on Stripe list error (defense-in-depth, canonical check upstream stays primary). |

Branch committer date `2026-05-06 18:52` (rebased that day). Approach: defense-in-depth against stale/missing canonical Supabase subscription row while Stripe still has a live sub → duplicate checkout.

## 2. Bug-still-present verification on `origin/main` — **NOT PRESENT**

- Backend `billing-stripe-change-plan/index.ts` @ origin/main lines **790–845**: `// === LAST-LINE DUPLICATE GUARD (Stripe-direct) ===`, `subscriptions.list` (807), `logInfo("Stripe-direct duplicate guard fired"` (816), fail-open `logError` (837). Present.
- Frontend `src/lib/billing.ts` @ origin/main lines **265–267**: `action === "manage_billing" || action === "already_subscribed" || already_subscribed`. Present.
- `git diff origin/main origin/fix/stripe-duplicate-subscription -- src/lib/billing.ts supabase/functions/billing-stripe-change-plan/index.ts` → **empty (byte-identical)**.
- Introducing commit on main: **`918aaba7` `fix(billing): prevent duplicate Stripe subscriptions (#215)`**, merged 2026-05-06 19:06, confirmed ancestor of `origin/main`. #215's PR body contains the verbatim commit messages of `d8b69982` + `f5e09918` → **PR #215 *is* this branch, squash-merged.** Branch ref was never deleted; `--merged` misses it due to SHA rewrite.

Nothing "since #553" silently fixed it — it was fixed **before** the audit even ran, via #215 (2026-05-06), ~10 days before this task.

## 3. Rebase result — **N/A (superseded, no-op)**

Not clean, not conflicted, not cherry-pickable — **void**. Both fix hunks already exist verbatim on main. A cherry-pick of `d8b69982`/`f5e09918` resolves to an empty patch. No rebase/cherry-pick will be performed.

## 4. Test coverage assessment — **REAL GAP**

Billing tests on main: `computeEntitlement*`, `familyEntitlement`, `mapStripeSubscription`, `verifyAppleJws`, `verifyGoogleJwt`, `stripe-webhook/eventTypes`, `stripe-webhook/parseWebhookSecrets`.

**None exercise the duplicate-subscription guard.** Zero coverage for:
- Backend: `createCheckoutSessionForFreeUser` Stripe-direct guard — blocks on `active/trialing/past_due/unpaid`; **fail-open** on `subscriptions.list` throw; correct `manage_billing` response shape.
- Frontend: `startCheckoutOrOpenPortal` routing all three signals (`action==='manage_billing'`, `action==='already_subscribed'`, `already_subscribed:true`) → `openBillingPortal()`.

Recommended new tests (the only legitimate Phase 2 work):
1. `supabase/functions/billing-stripe-change-plan/__tests__/duplicateGuard.test.ts` — mock `stripe.subscriptions.list`: (a) active sub → returns `manage_billing`, no `checkout.sessions.create`; (b) only `canceled`/`incomplete_expired` → proceeds; (c) `list` throws → **fails open**, proceeds (regression guard for the fail-open invariant).
2. `src/lib/__tests__/billing.dupeGuard.test.ts` — `startCheckoutOrOpenPortal` returns portal mode for each of the 3 backend signal shapes; starts checkout when none present.

## 5. Risk assessment + cleanup (locked #1)

- **Resurrecting the branch as code = rejected.** No-op patch; reintroduces nothing; adds confusion (CLAUDE.md anti-patterns "Dead-code wiring", "Patch-and-retry without evidence"). Locked #4/#5 say stop here.
- **Residual production risk:** a live money-path guard (duplicate billing → double-charge) with **no test**. A future refactor of `createCheckoutSessionForFreeUser` could silently drop the guard or the fail-open behavior with nothing red. This is the actionable risk, not the branch.
- **Cleanup per locked #1:** delete stale remote `origin/fix/stripe-duplicate-subscription` — it shipped via #215 and is the exact trap that generated this task (audit re-flagging a superseded branch). **Remote-branch deletion needs explicit Chau approval.**

## Recommendation (awaiting approval — scope changed, locked #4)

The premise ("unmerged, bug still present") is false. Proposed Phase 2, drastically reduced:

- **A.** Add the two test files in §4 (money-path coverage for the already-shipped guard) — single PR per locked #16, PR body explaining the branch was superseded by #215.
- **B.** Delete stale `origin/fix/stripe-duplicate-subscription` (needs approval).
- **Do NOT** rebase/cherry-pick anything.
