# OPS — merged-branch cleanup (A10e)

**Date:** 2026-05-19 (post-22:00 UTC)
**Agent:** A10 (fifth dispatch — branch hygiene track)
**Scope:** Delete lingering merged-but-not-auto-deleted remote branches from `origin` to reduce noise for future `git ls-remote` sweeps.

## Headline

| Metric | Count |
|---|---|
| Merged PRs scanned (since 2026-05-19T00:00Z) | 98 |
| Branches deleted from origin | **68** |
| Branches skipped (open PR / worktree / protected / already-gone) | 30 |
| Origin branch count: before → after | **581 → 515** |

Net reduction: 66 branches (68 deletes + 2 pre-existing prune-discoveries).

## Guardrails honored

- **Open PRs:** 63 open PR head-refs cross-referenced — none touched.
- **Worktrees:** 117 worktree-checked-out branch refs cross-referenced (`git worktree list --porcelain`) — none touched.
- **Protected branches:** `main`, `a46/primer-refresh-may19-late`, `docs/next-session-primer-may20-v2` — none touched.
- **Already-deleted from origin:** detected via `git ls-remote` snapshot pre-delete — skipped silently.

## Pipeline

1. `git fetch origin --prune --quiet`
2. `gh pr list --state open --limit 100 --json number,headRefName` → 63 protected refs.
3. `gh pr list --state merged --search "merged:>=2026-05-19T00:00:00Z" --limit 100` → 98 merged PR records.
4. `git worktree list --porcelain` → 117 in-use branch refs.
5. `git ls-remote --heads origin` → 581 origin refs (pre-delete).
6. For each merged-PR branch: apply skip-rules → candidate or skip.
7. Batched `git push origin --delete <br1> <br2> …` (15-ref batches).
8. Re-fetch + re-snapshot origin → 515 refs; 0 survivors in candidate set.

## Deleted (68)

| PR | Branch | Merged at | Status | Skip reason |
|---|---|---|---|---|
| #671 | `feat/plc2-irt-core` | 2026-05-19T00:24Z | DELETED | — |
| #673 | `fix/user-subscriptions-tier-id-index` | 2026-05-19T02:50Z | DELETED | — |
| #674 | `feat/plc2-item-bank` | 2026-05-19T00:23Z | DELETED | — |
| #676 | `fix/revoke-anon-on-internal-views` | 2026-05-19T01:55Z | DELETED | — |
| #677 | `chore/update-privacy-policy-disclosures` | 2026-05-19T01:54Z | DELETED | — |
| #678 | `feat/plc2-session-schema` | 2026-05-19T00:23Z | DELETED | — |
| #679 | `chore/ios-deploy-target-15-6` | 2026-05-19T02:49Z | DELETED | — |
| #680 | `chore/n7b-capacitor-v8-android-sentry` | 2026-05-19T01:18Z | DELETED | — |
| #681 | `chore/disable-vercel-double-deploy` | 2026-05-19T01:34Z | DELETED | — |
| #682 | `chore/bump-ci-node-22` | 2026-05-19T01:54Z | DELETED | — |
| #683 | `chore/cap-sync-ios-n4-plugins` | 2026-05-19T01:41Z | DELETED | — |
| #684 | `feat/sentry-webhook-instrumentation` | 2026-05-19T01:54Z | DELETED | — |
| #685 | `chore/tombstone-dead-rbac-migration-blocks` | 2026-05-19T01:55Z | DELETED | — |
| #686 | `docs/honest-readme-update` | 2026-05-19T02:12Z | DELETED | — |
| #688 | `fix/onboarding-direction-handler-and-deadclicks` | 2026-05-19T02:12Z | DELETED | — |
| #689 | `chore/lovable-residue-cleanup` | 2026-05-19T02:15Z | DELETED | — |
| #690 | `feat/mercy-ws1-guide-assistant-contract` | 2026-05-19T02:48Z | DELETED | — |
| #691 | `fix/mercy-feedback-supabase-url-fallback` | 2026-05-19T02:48Z | DELETED | — |
| #692 | `fix/login-wordmark-404` | 2026-05-19T02:29Z | DELETED | — |
| #693 | `fix/html-lang-vi-screen-reader` | 2026-05-19T02:32Z | DELETED | — |
| #695 | `fix/room-renderer-paywall-typesafety` | 2026-05-19T02:33Z | DELETED | — |
| #696 | `ops/disable-broken-cron-emails` | 2026-05-19T02:47Z | DELETED | — |
| #697 | `fix/wire-telemetry-ga4-clarity` | 2026-05-19T02:47Z | DELETED | — |
| #698 | `chore/delete-ssr-host-dead-code` | 2026-05-19T02:47Z | DELETED | — |
| #699 | `fix/auth-input-focus-visible` | 2026-05-19T02:47Z | DELETED | — |
| #700 | `feat/stripe-yearly-price-reconciliation` | 2026-05-19T02:44Z | DELETED | — |
| #701 | `chore/brand-asset-quick-wins` | 2026-05-19T13:23Z | DELETED | — |
| #704 | `feat/plc2-theta-estimator` | 2026-05-19T04:11Z | DELETED | — |
| #705 | `chore/eslint-no-explicit-any-error-allowlist` | 2026-05-19T04:43Z | DELETED | — |
| #706 | `fix/a11y-auth-livestatus-home-nested` | 2026-05-19T04:43Z | DELETED | — |
| #707 | `perf/mercy-avatar-avif-room-surface` | 2026-05-19T05:35Z | DELETED | — |
| #708 | `chore/schema-catchup-prod-ahead` | 2026-05-19T05:34Z | DELETED | — |
| #709 | `test/entitlement-persist-coverage` | 2026-05-19T05:52Z | DELETED | — |
| #710 | `fix/revoke-anon-residual-views` | 2026-05-19T05:54Z | DELETED | — |
| #711 | `A27-room-spec-cache` | 2026-05-19T05:53Z | DELETED | — |
| #712 | `A1-plc2-item-selector` | 2026-05-19T05:34Z | DELETED | — |
| #713 | `a26/vnd-pricing-consolidation` | 2026-05-19T05:42Z | DELETED | — |
| #714 | `a33/sentry-sourcemap-ci-secrets` | 2026-05-19T06:16Z | DELETED | — |
| #715 | `A25-payment-edge-tests` | 2026-05-19T05:38Z | DELETED | — |
| #716 | `fix/search-coldstart-and-keyword-recall` | 2026-05-19T05:56Z | DELETED | — |
| #717 | `fix/email-unsubscribe-cron-resume` | 2026-05-19T05:43Z | DELETED | — |
| #718 | `A1-plc2-pr6` | 2026-05-19T05:49Z | DELETED | — |
| #719 | `fix/home-avatar-640-regen` | 2026-05-19T05:49Z | DELETED | — |
| #720 | `a20/sentry-route-gate` | 2026-05-19T06:16Z | DELETED | — |
| #722 | `chore/dead-code-r3-a37` | 2026-05-19T13:03Z | DELETED | — |
| #723 | `a33/sentry-sourcemap-reland` | 2026-05-19T13:02Z | DELETED | — |
| #724 | `A1-plc2-pr8` | 2026-05-19T13:03Z | DELETED | — |
| #725 | `ci/edge-function-deno-check-gate` | 2026-05-19T13:03Z | DELETED | — |
| #726 | `fix/stripe-webhook-type-drift` | 2026-05-19T13:38Z | DELETED | — |
| #728 | `feat/plc2-edge-orchestrator` | 2026-05-19T13:39Z | DELETED | — |
| #732 | `feat/plc2-browser-client` | 2026-05-19T13:59Z | DELETED | — |
| #735 | `a51/pr1-auth-a11y-quickwins` | 2026-05-19T14:23Z | DELETED | — |
| #736 | `a52/mercy-register-revert` | 2026-05-19T14:14Z | DELETED | — |
| #737 | `a51/pr2-phoneotp-i18n-reset-live` | 2026-05-19T15:33Z | DELETED | — |
| #740 | `a56/confighealth-sentry-gate` | 2026-05-19T14:31Z | DELETED | — |
| #744 | `a59/storage-and-hygiene` | 2026-05-19T14:44Z | DELETED | — |
| #746 | `a64/type-safety-wave2` | 2026-05-19T14:58Z | DELETED | — |
| #747 | `a63/seo-canonical-hreflang` | 2026-05-19T14:58Z | DELETED | — |
| #749 | `a69/rm-dead-static-assets` | 2026-05-19T15:01Z | DELETED | — |
| #750 | `a75/migration-timestamp-collisions` | 2026-05-19T15:19Z | DELETED | — |
| #754 | `A72-secdef-wrappers` | 2026-05-19T15:25Z | DELETED | — |
| #755 | `a80/persona-regression-tests` | 2026-05-19T16:42Z | DELETED | — |
| #758 | `a85/fix-referral-signup-link` | 2026-05-19T15:39Z | DELETED | — |
| #767 | `b14/shared-dead-code-cleanup` | 2026-05-19T16:13Z | DELETED | — |
| #768 | `b16/recon-doc-convention` | 2026-05-19T16:14Z | DELETED | — |
| #770 | `b11/period-end-field-order` | 2026-05-19T16:21Z | DELETED | — |
| #772 | `b20/process-index` | 2026-05-19T16:24Z | DELETED | — |
| #795 | `perf/vendor-split-zod-sonner-datefns` | 2026-05-19T21:48Z | DELETED | — |

## Skipped (30) — by reason

### Worktree-checked-out (17)

Branches still live in a `/private/tmp/A*` worktree. Future cleanup can prune them once the worktrees themselves are removed (`git worktree remove <path>`).

| PR | Branch | Reason |
|---|---|---|
| #745 | `a68/mercy-feedback-config-diagnostics` | worktree-checked-out |
| #787 | `fix/b22-redeem-gift-honest-errors` | worktree-checked-out |
| #791 | `cleanup/agent-id-tierc-archive` | worktree-checked-out |
| #793 | `fix/webhook-monotonic-object-quality` | worktree-checked-out |
| #794 | `perf/lazy-mercyguide-panel` | worktree-checked-out |
| #802 | `feat/b13ph3-pr-a` | worktree-checked-out |
| #809 | `ci/bundle-size-budget` | worktree-checked-out |
| #810 | `docs/principles-immediate-dispatch` | worktree-checked-out |
| #812 | `docs/strategy-drift-audit` | worktree-checked-out |
| #813 | `docs/pr-review-backlog-sequencing` | worktree-checked-out |
| #814 | `docs/pending-actions-consolidation` | worktree-checked-out |
| #815 | `docs/a18-recompute-impl-prep` | worktree-checked-out |
| #816 | `docs/native-sentry-init-audit` | worktree-checked-out |
| #817 | `docs/strategy-v31` | worktree-checked-out |
| #820 | `docs/789-migration-verify` | worktree-checked-out |
| #823 | `docs/principles-audit` | worktree-checked-out |
| #825 | `docs/red-branch-pr-candidates` | worktree-checked-out |

### Already deleted from origin (13)

Branches whose merge auto-deleted them, or that were pruned in an earlier sweep. No action.

| PR | Branch | Reason |
|---|---|---|
| #656 | `fix/placement-test-virevealed-discount` | already-deleted-from-origin |
| #658 | `chore/hide-placement-test-from-onboarding` | already-deleted-from-origin |
| #665 | `fix/n7a-stale-sw-comment-safe-area` | already-deleted-from-origin |
| #675 | `feat/marketing-landing-page-bilingual` | already-deleted-from-origin |
| #687 | `feat/tracking-consent-toggle` | already-deleted-from-origin |
| #702 | `chore/eslint-no-explicit-any-warn` | already-deleted-from-origin |
| #703 | `chore/delete-dead-code-sweep-r2` | already-deleted-from-origin |
| #721 | `A1-plc2-pr7` | already-deleted-from-origin |
| #734 | `a54/netlify-scaffold-removal` | already-deleted-from-origin |
| #748 | `a65/delete-account-aal2` | already-deleted-from-origin |
| #753 | `docs/for-chau-study` | already-deleted-from-origin |
| #763 | `b1/mercy-chat-strategy-scoping` | already-deleted-from-origin |
| #774 | `b25/tier-gate-fix-pr1` | already-deleted-from-origin |

## Verification

```
$ git fetch origin --prune --quiet
$ git ls-remote --heads origin | wc -l
515
$ comm -12 <(deleted-candidates) <(post-delete-origin) | wc -l
0  # all 68 candidates confirmed absent
```

## Conclusion

68 merged-but-lingering branches pruned from origin. No PR closed, no open PR touched, no worktree-checked-out branch deleted. Cleanup is purely on the remote — local worktrees and local branches untouched. The 17 worktree-blocked entries are eligible for a future sweep once their worktrees are pruned.
