# Next-Session Start Primer — paste at session start

> Paste-ready, 1-screen. The full historical record is B10's
> `docs/session-summaries/may-19-2026.md` (PR #765). This primer + the
> session memory ARE the source of truth — where any memory or older RECON
> disagrees, **this file is newer; trust it** (`stale-audit-note`).
> Author: B41, 2026-05-19. State base: B32 inventory @ `4a64212fb`.

## In one line

~80-PR autonomous hardening wave landed; the single highest-value open
thread is **U3 — a real paying customer (`mylinh.nutrition@gmail.com`)
paid but sits at free entitlement** (root cause diagnosed + class-bug
fixed; her roll-forward SQL still pending Chau). ~16 CI-green PRs are
queued for review/merge and 8 PARKED items await a Chau decision.

## Tonight's strategically important closeouts

- **mercy-feedback verified live end-to-end** (#691/#745; A79+A95 prod 200s + real rows); regression lock **#762 open**. The "mercy-feedback blocked" memory is **CLOSED** — do not reopen.
- **U3 class bug fixed:** B5 diagnosed `mylinh` paid-but-free → **B11 #770 MERGED** (invoice `period_end` field-order bug) + **B26 #773 open** (symmetric `period_start`).
- **A91 → B6 #766 open:** 2 lost `livemode=true` money-path events traced to a no-backoff/no-jitter 8-attempt CAS loop (`billing.ts:629–920`); fix scoped.
- **Tier-gating refactor started:** B17 audit → **B25 #774 open** ("PR1" — premium gates read live entitlement, not stale `profiles.tier`). Series, not done.
- **`/mercy/chat` reframed** (B1 **#763 MERGED**): orphan route, canned-string stub, not a funnel — Option B (honest preview/CTA) decided.
- **Branch hygiene:** 268 stale remote branches deleted (458 remain).
- **Placement-v2 series code-complete;** PR 11/11 **#738 open**, gated on `PLACEMENT_TEST_ENABLED`.

## Outstanding manual actions only Chau can do

1. **U3 remediation SQL** — roll `mylinh.nutrition@gmail.com` forward to paid entitlement (B5 diagnosed; needs SQL-Editor apply). *Real customer underserved now — highest value.*
2. **Stripe Dashboard lookups** — A77 event + A91's 2 events (`evt_1TTo6u…`, `evt_1TTp7V…`) + B28's `evt_1TUxM5` runbook: confirm active/paid to decide replay vs ignore.
3. **A94 stale-sub cleanup SQL** — predicate must be human-confirmed (false-cleanup risk caught tonight).
4. **A59 RLS SQL (#744 merged)** — scope legacy PUBLIC write policies → `service_role` via SQL Editor (never `db push`).
5. **Netlify uninstall** — #734 removed the scaffold; uninstall the Netlify GitHub App so it stops attaching checks.
6. **Real-device smoke** — touch targets (#760) + native status-bar/splash/keyboard/safe-area.
7. **VN legal-translator review** of privacy/PDPD copy (#677/#742) before relying on it.

## Decisions awaiting Chau's input (PARKED — unblocking condition)

1. **A89 #759** — accept/reject Option B for anon Mercy feedback.
2. **A96 RECON** — decision on the Stripe webhook-forensics proposal.
3. **B2** — issue #635 VR-baseline strategy decision.
4. **B7 RECON** — run the 5 money-path monitoring queries; decide on instrumentation.
5. **B9 #769** — ratify Option B for #757 (test-project e2e ON, prod OFF).
6. **B13 RECON** — approve the 4-gate expiry-blind fix plan; **hard-gated behind B25 #774 landing on main.**
7. **B19 RECON** — `PLACEMENT_TEST_ENABLED` decision (Option B recommended).
8. **B28 runbook** — execute the Stripe `evt_1TUxM5` dashboard lookup.

## Next-session FIRST dispatch candidates

1. **Close U3.** Review/merge **B26 #773**, then hand Chau the `mylinh` entitlement roll-forward SQL. A real paying customer is underserved *right now* — outcomes over hardening.
2. **Drain the ready-PR queue.** ~16 CI-green PRs await review/merge (#765 #766 #774 #773 #771 #764 #755 #760 #761 #762 + A-series #727 #729 #730 #731 #733 #738 #739 #742 #743 #751 #752 #753 #759). Merging B25 #774 also **unblocks B13**.
3. **Salvage before pruning.** Uncommitted unrecoverable work sits in `/private/tmp` worktrees: **B21** (remediation SQL), **B27** (recon), **B29** (convention doc), **A91** (recon), **A94** (probes). Salvage these *before* any `git worktree prune`.

## Strategic context Claude should know upfront

- **Every money-path miss this session is one bug class, not isolated incidents:** billing period-field-order + monotonic-CAS-without-backoff. B11 fixed the class; B6/B26 finish it. `mylinh` is the one *confirmed real-customer* instance.
- **Tier-gating is half-refactored, not done.** B25 #774 is PR1 of a series; premium gates still read stale `profiles.tier` until it lands, and B13's expiry-blind fix is hard-gated behind it.
- **Agent ground-truth repeatedly reversed brief premises** (A97↔A93, B1↔A89, A94 false-cleanup). Lesson 9: verify against current `main` + this primer, never stale memory/RECON.
- **6 dispatched-but-silent agents produced nothing** (B12 blast-radius, B15 MRR-view drift, B22 gift-propagation, B30 monitor-query, B31 PR-body template, B35 VR-state) — re-dispatch only if the topic is still wanted.
