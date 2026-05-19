# OPS — full /private/tmp worktree audit + RED push (A10b)

**Date:** 2026-05-19
**Agent:** A10 (second dispatch)
**Scope:** Push-durability audit of all 86 git worktrees under `/private/tmp/`, push every RED branch with commits-at-risk.
**Mode:** Read-only sweep; push only RED-with-salvage-value; no PRs; no worktree content modifications.

## Headline

- **86 worktrees** under `/private/tmp/` total.
- **8 SKIP-INFLIGHT** (current in-flight b-suffix dispatches: A2b/A3b/A4b/A5b/A6b/A7b/A8b/A9b).
- **64 GREEN** (branch on origin, HEAD matches, working tree clean-or-untracked-only).
- **14 RED** (branch never pushed to origin).
  - **11 of 14 pushed** for durability (real commits ahead of main).
  - **3 of 14 NOT pushed** — branch HEAD is already on `origin/main` (zero commits ahead, no salvage value).
- **0 YELLOW** (no diverged/dirty in-flight cases outside the skip list).
- **0 PRs opened** (durability-only per B16).

## RED branches — pushed (11)

| Worktree | Branch | Last commit SHA | Ahead of main | Action |
|---|---|---|---|---|
| `A7-b22-narrow` | `fix/b22-redeem-gift-honest-errors` | `45c600310` | 1 | PUSHED |
| `B27-profile-triggers` | `b27/profile-trigger-audit` | `2ad771084` | 2 | PUSHED |
| `B5-mylinh-paid-but-free` | `b5/mylinh-paid-but-free-diagnostic` | `245d8ec6d` | 1 | PUSHED |
| `B52-price-map-autoupsert` | `b52/price-map-autoupsert-scoping` | `20e80c1e9` | 1 | PUSHED |
| `B53-price-data-quality` | `b53/price-data-quality-diagnostic` | `35ef2ea1c` | 1 | PUSHED |
| `B55-recon-durability` | `b55/recon-durability-tradeoff` | `272b5ee2d` | 1 | PUSHED |
| `B58-gift-write-or-fallback` | `b58/gift-write-or-fallback` | `0dc77e81a` | 1 | PUSHED |
| `B60-merge-queue` | `b60/merge-queue-priority` | `d392cca31` | 1 | PUSHED |
| `B61-out-of-band-schema` | `b61/out-of-band-schema-audit` | `b51eac418` | 1 | PUSHED |
| `B62-pr-ci-status` | `b62/pr-ci-status` | `bca42770a` | 1 | PUSHED |
| `B66-session-closeout` | `b66/session-closeout` | `d5d1b79c9` | 1 | PUSHED |

All 11 pushes used `git push -u origin <branch>`. All succeeded as `* [new branch]`. PR scan post-push confirmed **NO** accidental PR was opened for any of these.

## RED branches — NOT pushed (3, zero salvage value)

These worktrees hold branches whose HEAD SHA is already on `origin/main` (the branch refs were never pushed but contain no unique commits). Strict RED definition is *"branch never pushed AND has commits at risk"* — these have **0 commits at risk**.

| Worktree | Branch | HEAD SHA | Status | Action |
|---|---|---|---|---|
| `A79-newuser-smoke` | `a79/newuser-smoke` | `b27001edf` (#749 merge commit on main) | 0 ahead of main | SKIP — branch ref redundant with main |
| `A91-monotonic-concurrent` | `a91/monotonic-diagnostic` | `530810784` (#687 merge commit on main) | 0 ahead of main | SKIP — branch ref redundant with main |
| `A94-stale-sub-cleanup` | `a94/stale-sub-rows-cleanup` | `629a26cb9` (#737 merge commit on main) | 0 ahead of main | SKIP — branch ref redundant with main |

Recommend leaving these alone or pruning the worktrees per `feedback_worktree_prune_check.md`.

## SKIP — in-flight b-suffix dispatches (8, untouched)

| Worktree | Reason |
|---|---|
| `A2b-mylinh-preflight` | A2b in-flight |
| `A3b-gift-outreach-ops` | A3b in-flight |
| `A4b-b1-manifest-fix` | A4b in-flight |
| `A5b-bundle-budget` | A5b in-flight |
| `A6b-796-device-verify` | A6b in-flight |
| `A7b-sourcemap-smoke` | A7b in-flight |
| `A8b-raw-payload-query` | A8b in-flight |
| `A9b-phantom-verify` | A9b in-flight |

## GREEN — already pushed and clean (64)

All 64 GREEN worktrees have `LOCAL_SHA == REMOTE_SHA` for their branch on origin. 7 of them carry untracked files (recon scratch, log outputs) but no staged/modified tracked changes — durability is unaffected.

<details>
<summary>Full GREEN list</summary>

| Worktree | Branch | Status | HEAD SHA |
|---|---|---|---|
| `A1-b13ph3-pra` | `feat/b13ph3-pr-a` | clean | 8a2e68b21 |
| `A1-formatmoney-vnd` | `fix/formatmoney-zero-decimal` | clean | 794738b7e |
| `A10-remaining-recon` | `a10/remaining-recon-push` | clean | 604674936 |
| `A11-t2-retire-plan` | `b70/t2-retirement-design` | clean | f38dc530f |
| `A12-b13ph3-brief` | `b71/b13-phase3-brief` | clean | 7cc351b64 |
| `A13-gift-victims` | `a13/gift-redemption-victims` | clean | e91396f44 |
| `A14-webhook-payload-audit` | `a14/webhook-payload-type-audit` | clean | ffa205899 |
| `A15-raw-payload-backfill` | `a15/raw-payload-backfill-sql` | clean | ea51abc1c |
| `A16-expiry-flip-count` | `a16/expiry-flip-baseline` | clean | d3b12d6e5 |
| `A17-entitlements-migration` | `feat/entitlements-table-migration` | clean | 49d6f866e |
| `A18-recompute-impl-brief` | `a18/recompute-impl-brief` | untracked(2) | c56663e7d |
| `A19-b25-bypass-delete` | `cleanup/delete-b25-numeric-tier-bypass` | clean | f35b69253 |
| `A2-mylinh-package` | `chore/mylinh-apply-package` | clean | 2e1ba1cf2 |
| `A2-mylinh-regen` | `b5/mylinh-sql-regen` | clean | d70cd6d27 |
| `A21-revenuecat-mrr-scope` | `a21/revenuecat-mrr-projection-scope` | clean | 1f3853ef8 |
| `A22-prune-script` | `a22/safe-prune-script` | clean | 9d758b815 |
| `A23-naming-collision` | `a23/agent-id-naming-collision` | clean | 4ad193903 |
| `A24-northstar-strategy` | `cleanup/northstar-strategy-naming` | clean | e469a90e4 |
| `A25-bundle-audit` | `a25/bundle-audit-fresh` | clean | c6f0f352b |
| `A26-mylinh-apply-runbook` | `a26/mylinh-apply-runbook` | clean | 7c0ab0aed |
| `A27-next-session-primer` | `a27/next-session-primer-may20` | clean | f3026f4ad |
| `A28-gift-victim-repair` | `a28/gift-victim-repair-sql` | clean | 4d5e75112 |
| `A29-webhook-payload-fix` | `fix/webhook-monotonic-object-quality` | clean | 353cedc97 |
| `A3-b7-monitoring` | `feat/b7-q1-q4-monitoring` | clean | 60fca5cef |
| `A3-gift-victims` | `chore/gift-victims-package` | clean | c09c05b59 |
| `A30-mercyguide-lazy` | `perf/lazy-mercyguide-panel` | clean | 0b71189ce |
| `A32-currency-interval-fix-scope` | `a32/currency-interval-fix-scope` | clean | 168c4782b |
| `A33-t2-retirement-migration` | `feat/t2-retirement-migration` | clean | 5cd269a95 |
| `A34-tierc-archive` | `cleanup/agent-id-tierc-archive` | clean | d8dbd2bf5 |
| `A36-mylinh-postapply-verify` | `a36/mylinh-postapply-verify` | untracked(3) | 5ddcccdea |
| `A37-vendor-split-measure` | `a37/vendor-split-measure` | clean | 4a55690ac |
| `A38-native-sentry-audit` | `a38/native-sentry-audit` | clean | 492943cb7 |
| `A39-support-inbox-audit` | `a39/support-inbox-gift-audit` | clean | 9ba49d2c7 |
| `A4-b17-pr3-sign-audio` | `cleanup/b17-pr3-sign-audio-dead` | clean | c2783118d |
| `A4-review-db-prs` | `review/db-prs-readonly` | clean | b7cb12f0e |
| `A40-account-deletion-reaudit` | `a40/account-deletion-reaudit` | clean | 117ee98af |
| `A41-appstore-reaudit` | `a41/appstore-reaudit-may19` | clean | 11a55f657 |
| `A42-subscription-amount-schema` | `a42/subscription-amount-schema` | clean | 75fd10e12 |
| `A43-stripe-env-check` | `a43/stripe-env-verification` | clean | b795fa456 |
| `A46-a11y-next` | `a46/account-a11y` | untracked(1) | cb4db2f66 |
| `A46-primer-refresh` | `a46/primer-refresh-may19-late` | clean | 706983a93 |
| `A5-entitlements-schema` | `b67/entitlements-schema-spec` | clean | 0aaec34f4 |
| `A5-review-perf-prs` | `review/perf-prs-readonly` | clean | 5454d7d3e |
| `A6-recompute-design` | `b68/recompute-entitlement-design` | clean | 8bbc27f4f |
| `A6-review-cleanup-prs` | `review/cleanup-prs-readonly` | clean | 6b8c39df8 |
| `A61-seo-audit` | `a61/seo-jsonld` | untracked(1) | 32b92fb71 |
| `A68-feedback-livetest` | `a68/mercy-feedback-config-diagnostics` | untracked(1) | 654f0dad3 |
| `A7-b2-ci-wire` | `fix/b2-wire-delete-coverage-ci` | clean | 291bba2c8 |
| `A8-d4-mrr-source` | `b69/d4-mrr-source-strategic` | clean | 499967d23 |
| `A8-price-map-insert` | `chore/price-map-insert-package` | clean | 9ae78abd8 |
| `A9-rls-phantom` | `chore/rls-phantom-package` | clean | cc4ee88a2 |
| `A9-worktree-prune-audit` | `a9/worktree-prune-audit` | clean | c3655ddd2 |
| `B21-failed-deletions` | `b21/failed-deletion-events` | clean | a84ace451 |
| `B41-next-session-primer` | `b41/next-session-primer` | clean | 6d03e2c4e |
| `B42-price-map-fix` | `b42/price-map-missing-row` | clean | 202bfffa5 |
| `B44-dispatch-template-update` | `b44/dispatch-template-enforce-recon` | clean | 273a89ad8 |
| `B45-billing-architecture-map` | `b45/billing-architecture-map` | clean | ffa38722b |
| `B47-billing-history` | `b47/billing-architecture-history` | clean | 9cfb4a184 |
| `B48-billing-target-state` | `b48/billing-target-state` | clean | d46238be0 |
| `B49-premise-correction` | `b49/premise-correction-section` | untracked(1) | 3e99abec1 |
| `B50-pr-title-convention` | `b50/pr-title-convention` | clean | e135fff54 |
| `B56-principles-update` | `b56/principles-session-update` | clean | 11b11f6c9 |
| `B57-mylinh-sql-salvage` | `b57/mylinh-sql-salvage` | clean | 7e06fb59f |
| `B64-price-map-sql` | `b64/price-map-repair-sql` | clean | 8472883a7 |

</details>

## Verification

- `git fetch origin` run before audit to ensure remote ref freshness.
- Final PR scan (`gh pr list --state open`) post-push confirmed 0 PRs opened for any of the 11 pushed branches.
- All 8 SKIP-INFLIGHT worktrees were untouched (no read of working tree contents, no push attempted).

## Conclusion

**11 RED branches pushed for durability.** No salvage gaps remain in the audited set. The 3 zero-ahead-of-main branches are flagged as "no salvage value" and left for prune review per `feedback_worktree_prune_check.md`. The 8 b-suffix worktrees remain in-flight and reserved for their owning agents.

## Prune follow-up — 2026-05-19 (A10c)

Dispatch directed deletion of the 3 zero-salvage RED branches from `origin`:
- `a79/newuser-smoke`
- `a91/monotonic-diagnostic`
- `a94/stale-sub-rows-cleanup`

**Result: NO-OP — nothing to delete on origin.**

Verification (post-fetch, against `origin/main = cff975a54d28c3265eac848642b0225db332c7c1`):

```
$ git ls-remote origin refs/heads/a79/newuser-smoke \
                     refs/heads/a91/monotonic-diagnostic \
                     refs/heads/a94/stale-sub-rows-cleanup
(empty — none of the 3 refs exist on origin)
```

Reason: the A10b audit classified these as `RED-never-pushed` precisely because the branches were never pushed to origin. They exist only as local refs inside their worktrees, pointing at SHAs that are already part of `origin/main`:

| Branch (local-only) | HEAD SHA | On origin? | Ancestor of `origin/main`? |
|---|---|---|---|
| `a79/newuser-smoke` | `b27001edf` | NO | YES |
| `a91/monotonic-diagnostic` | `530810784` | NO | YES |
| `a94/stale-sub-rows-cleanup` | `629a26cb9` | NO | YES |

`git push origin --delete <branch>` was NOT executed — it would have errored with `remote ref does not exist`. No PRs touched, no remote state changed.

Local-only cleanup (pruning the worktrees themselves) was out of scope per dispatch ("DO NOT touch any worktree contents"). If desired, those 3 worktrees can be removed in a future sweep via `git worktree remove /private/tmp/<dir>`. The A9b dispatch's note that `a94/stale-sub-rows-cleanup` is superseded by B21 still holds.
