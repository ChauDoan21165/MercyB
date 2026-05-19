# Next-Session Start Primer — paste at session start

> Paste-ready, ~1-screen. Full record: B10 `docs/session-summaries/may-19-2026.md` (PR #765, OPEN). This primer + session memory ARE source of truth — where memory/older RECON disagrees, **this file is newer; trust it** (`stale-audit-note`).
> Author: B41 2026-05-19 @ `9548905cd`. **Freshened by B59 2026-05-19** — folds B45 as-built map + B48 target-state + B45's 5 inconsistencies + B36 housekeeping. **No PR has merged since B41 committed; PR queue unchanged.**
> **Billing/entitlement canon (read first for any billing question):** as-built = `reports/RECON-billing-architecture-as-built-B45.md` (`b45/billing-architecture-map` @ `ffa38722b`); 6-month target + D1–D6 gates = `reports/RECON-billing-target-state-B48.md` (`b48/billing-target-state` @ `d46238be0`).

## In one line

~80-PR hardening wave landed; highest-value open thread is **U3 — real paying customer `mylinh.nutrition@gmail.com` paid but at free entitlement** (class bug fixed in code; **her remediation SQL is LOST, not merely pending — must be regenerated under human review**). ~16 CI-green PRs queued; 8 PARKED items + **6 strategic billing gates (B48 D1–D6)** await Chau.

## Tonight's strategically important closeouts

- **mercy-feedback verified live e2e** (#691/#745; A79+A95 prod 200s + real rows); regression lock **#762 open**. "mercy-feedback blocked" memory **CLOSED** — don't reopen.
- **U3 class bug fixed in code:** B11 **#770 MERGED** (invoice `period_end` field-order) + B26 **#773 open** (symmetric `period_start`). *Diagnosis provenance:* B5's raw output was lost; evidence is a **B24 retroactive reconstruction** — subscription status, exact denying reader, and remediation SQL marked **NOT RECOVERABLE** (B45 §incon-5).
- **A91 → B6 #766 open:** 2 lost `livemode=true` events traced to a no-backoff/no-jitter 8-attempt CAS loop (`billing.ts:629–920`); fix scoped.
- **Tier-gating refactor STARTED, not done:** B17 audit → B25 **#774 OPEN** (PR1 — gates read live entitlement not stale `profiles.tier`). **B25 is NOT shipped** (B45 §incon-1) — series, not closed.
- **`/mercy/chat` reframed** (B1 **#763 MERGED**): orphan stub, Option B (honest preview/CTA) decided. **Branch hygiene:** 268 stale remotes deleted (458 remain). **Placement-v2** code-complete; PR 11/11 **#738 open**, gated `PLACEMENT_TEST_ENABLED`.
- **B36 session-end housekeeping:** retroactively committed recon for "silent" agents — **B12** (`f233cd5a0`: 3 affected/1 true orphan/zero paying impact), **B15** (`fb21d49a4`: MRR-drift premise FALSE, view A dead/B canonical), **B22** (`db68dbdff`, `b22/gift-propagation-gap`: gift read-path OK; recompute + redeem-gift-code gaps). On per-agent branches, so B45 §incon-2 ("no B22 doc") is itself superseded.

## Outstanding manual actions only Chau can do

1. **U3 remediation SQL — REGENERATE then apply.** Original lost (B24 reconstruction; B45 §incon-5); re-derive `mylinh.nutrition@gmail.com` roll-forward under human review, SQL Editor (no unattended path). *Real customer underserved now — highest value.*
2. **B42 price-map INSERT** — add missing `price_1TCKSF2K1tPxy04uNeKcQWp5` to `billing_price_map`; **3 real paying yearly subs (≈6M VND/yr) counted as 0 MRR** right now (B30-validated; supersedes B45's "≥2"). Runbook: `RUNBOOK-price-map-row-B42.md`. SQL Editor.
3. **A94 stale-sub cleanup SQL** — **3 phantom-MRR subs incl. mylinh** (B30-confirmed); predicate must be human-confirmed (false-cleanup risk).
4. **Stripe Dashboard lookups** — A77 + A91's `evt_1TTo6u…`/`evt_1TTp7V…` + B28 `evt_1TUxM5` runbook: confirm active/paid → replay vs ignore.
5. **A59 RLS SQL (#744 merged)** — scope legacy PUBLIC writes → `service_role`, SQL Editor (never `db push`).
6. **Netlify uninstall** (#734 removed scaffold); **Real-device smoke** (touch targets #760 + native); **VN legal review** of privacy/PDPD (#677/#742).

## Decisions awaiting Chau (PARKED — unblocking condition)

- **A89 #759** anon-feedback Option B · **A96** webhook-forensics proposal · **B2** #635 VR-baseline strategy · **B7** run 5 money-path queries, decide instrumentation · **B9 #769** ratify #757 Option B · **B13** approve 4-gate expiry-blind plan (**hard-gated behind #774 on main**) · **B19** `PLACEMENT_TEST_ENABLED` (Option B rec.) · **B28** execute `evt_1TUxM5` lookup.
- **B48 strategic billing gates — answer before any billing P1/P2 code:**
  - **D1** materialized `entitlements` table vs pure derive-on-read? **Gates ALL P1/P2 — nothing starts first. Rec: table.**
  - **D2** `profiles.tier` (text) DROP vs freeze-forever? Gates P3.
  - **D3** fold gift `user_subscriptions` into `subscriptions` vs keep legacy fallback? Gates B22-full / P2 scope.
  - **D4** MRR truth = `billing_price_map` join vs Stripe row amounts? (B42 class recurs until decided.)
  - **D5** build B7 monitoring before/after consolidation? Rec: Q1/Q4 before (safety net), Q2/Q3/Q5 never.
  - **D6** confirm standing "no unattended SQL — Chau hand-applies via SQL Editor" gate stays; budget apply-time per phase.

## Next-session FIRST dispatch candidates

1. **Close U3.** Review/merge B26 **#773**; then **regenerate** the `mylinh` roll-forward SQL (original lost) and hand to Chau. Real customer underserved *now* — outcomes over hardening.
2. **Drain ready-PR queue.** ~16 CI-green PRs (#765 #766 #774 #773 #771 #764 #760 #761 #762 #759 + A-series #727 #729 #730 #731 #733 #738 #739 #742 #743 #751 #752). #753/#755 already merged. Merging #774 unblocks B13.
3. **Salvage before pruning** uncommitted `/private/tmp` worktrees: B21, B27, B29, A91, A94 — before any `git worktree prune`.

## Strategic context Claude should know upfront

- **Every money-path miss is one bug class** (billing period-field-order + monotonic-CAS-without-backoff). B11 fixed it; B6/B26 finish it. `mylinh` is the one *confirmed real-customer* instance. Full map/target: B45/B48.
- **Tier-gating half-refactored.** #774 is PR1; gates still read stale `profiles.tier` until it lands; B13 hard-gated behind it. T2 trigger is **confirmed-live but dormant-by-table-mismatch** (never fires for Stripe/RevenueCat — B45 §incon-4).
- **Agent ground-truth repeatedly reversed brief premises** (A97↔A93, B1↔A89, A94 false-cleanup, B45's 5 inconsistencies). Lesson 9: verify vs current `main` + this primer, never stale memory/RECON. Truly-silent agents now only **B31** (PR-body template) + **B35** (VR-state) — B12/B15/B22 documented by B36; B30 produced (cited by B45).
