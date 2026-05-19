# FINAL CLOSEOUT — 2026-05-19 — read this only

**Author:** B66 · **Branch:** `b66/session-closeout` · **No PR** (operator artifact, B16 #768).
**Type:** SESSION-END SWEEP. No code, no DB, no prod re-query. Every status below is
sourced to a committed sibling doc — nothing re-tested live. **Labels:** `stale-audit-note`.

> Source-of-truth order if anything below disagrees with memory/older RECON:
> this doc → B41 primer (B59-freshened, `b41/next-session-primer` @ `6d03e2c4e`) →
> B45 as-built / B48 target-state. Newer wins.
> Full record: B10 `docs/session-summaries/may-19-2026.md` (PR #765, OPEN).

---

## Right now (< 5 min each)

- **Drain PR queue** — run B60's `&&`-chained block: `RECON-B60-merge-queue-priority.md`
  @ `b60/merge-queue-priority` (`d392cca31`), "CHAU ↓↓↓" section. 28 green PRs, 3 tiers,
  Tier-1 `#774` first (unblocks B13). `&&` aborts the train on any failure. ⏱ ~10 min.
  - ⚠️ **B62 caveat 1:** `#782` (B49) is NOT in the block and must NOT be added — hard-gated
    on `#764`, add/add conflict, needs manual post-`#764` rebase (`RECON-pr-ci-status-B62.md`
    @ `b62/pr-ci-status` `bca42770a`).
  - ⚠️ **B62 caveat 2:** the block merges `#776 #777 #780` consecutively in Tier-3 — all edit
    `INDEX.md` and pairwise-conflict. The chain will **correctly halt** at the first collision;
    finish Tier-3 by merging the remaining INDEX PRs **one-at-a-time after rebase** (`#781` too).
- **Worktree prune** — `cd /Users/admin/MercyB && git worktree prune` is the only
  *safe* command (drops stale admin entries for already-deleted dirs; touches no branch/commit).
  ⏱ <1 min. ⚠️ B38's named "36-worktree removal" list is **not on disk** (no B38 worktree/doc/
  sibling ref — delivered out-of-band, NOT recoverable). Do **not** guess a `worktree remove`
  list: B41 primer says salvage **B21/B27/B29/A91/A94** before any removal. Defer the bulk
  removal to next session with a fresh inventory; `prune` alone is risk-free now.
- **Push recon branches** — B65's named push block is **not on disk** (no B65 worktree/doc/
  ref). Per B16 + RECON-local-branch-inventory-B46 (`/Users/admin/MercyB/reports/`), recon
  branches are intentionally **committed-not-PR'd** and durable locally; pushing is optional
  durability, **not required**, and no canonical list survives. **No action** — skip unless
  next session regenerates the list. ⏱ 0 min.

## Before next session (manual, any order)

- **Stripe Dashboard — 3 lookups + price-map confirm.** (1) `evt_1TUxM5…` decision-tree
  lookup — B28 `RUNBOOK-evt-1TUxM5-lookup.md` @ `b28/unknowable-event-lookup` ⏱ ~60 s;
  (2) A91 `evt_1TTo6u…`/`evt_1TTp7V…` active/paid confirm (B41 primer §4) ⏱ ~3 min;
  (3) B42 cross-check price `price_1TCKSF2K1tPxy04uNeKcQWp5` — `RUNBOOK-price-map-row-B42.md`
  §2 @ `b42/price-map-missing-row` ⏱ ~3 min.
- **SQL Editor pastes** (hand-apply once each, read first; never `db push`):
  - **B42/B64 price-map row** 🔴 — paste `REMEDIATION-price-map-repair-B64.sql` @
    `b64/price-map-repair-sql` (`8472883a7`), justified by B42 runbook. 3 yearly subs
    ≈6M VND/yr = 0 MRR until applied. ⏱ 5–30 min.
  - **Anon-view RLS revoke** 🔴 — `20260618000000_revoke_anon_on_internal_views.sql` +
    `20260620000000_revoke_anon_residual_views.sql` (on `origin/main`, PR #750). Keep the
    `weekly_digest_data` carve-out. ⏱ 5–30 min. (B54 PENDING #3.)
  - **A94/B21 phantom rows** 🟡 — A94 canonical SQL lost; apply the surviving cross-checked
    `reports/REMEDIATION-stripe-deletion-events-B21.sql` @ `b21/failed-deletion-events`
    (ROLLBACK→verify→COMMIT). MRR-hygiene, zero paying impact. ⏱ 1–5 min. (B54 PENDING #5.)
  - **mylinh roll-forward** 🔴 — **blocked: SQL lost, must be regenerated** under human
    review before any apply (B5 forbids hand-writing from recon). Real customer underserved
    *now* — dispatch the regenerate next session. (B54 PENDING #1 / B41 primer #1.)
- **Netlify uninstall** — B54 PENDING checked: **no pending Netlify action exists** (prod is
  Vercel-only; brief named it only as an example category). **Nothing to do.** ⏱ 0 min.
- **Real-device smoke test** — touch targets (#760) + native paths; VN legal review of
  privacy/PDPD (#677/#742). B41 primer #6. ⏱ 15–30 min device time.

## Decisions needed before next session starts

- **B48 D1–D6 billing gates** (`RECON-billing-target-state-B48.md` @ `b48/billing-target-state`
  `d46238be0`): **D1** materialized `entitlements` table vs derive-on-read (gates ALL P1/P2 —
  rec: table); **D2** `profiles.tier` DROP vs freeze (gates P3); **D3** fold gift into
  `subscriptions` vs keep fallback (gates B22-full); **D4** MRR truth = price-map join vs
  Stripe amounts (B42 class recurs until decided); **D5** build B7 monitoring before/after
  consolidation (rec: Q1/Q4 before); **D6** confirm "no unattended SQL" gate stays. ⏱ ~20 min.
- **B49 draft PR `#782`** — merge **only after `#764` lands**, then rebase + re-apply the 82
  added lines (add/add resolution, keep #764's version). Decision: ratify "rebase after #764"
  (already Chau-chosen). ⏱ ~5 min post-#764.
- **B13 phase-3 go/no-go** — `RECON-isentitling-fix-plan-B13.md` @ `b13/isentitling-fix-plan`:
  4-gate expiry-blind fix plan. **Hard-gated** behind `#774` (B25) merging to main; decide
  go/no-go *after* `#774` is verified on `origin/main`. ⏱ ~10 min.
- **B22/B58 gift design** — B58 verdict (`RECON-gift-write-vs-fallback-design-B58.md` @
  `b58/gift-write-or-fallback`): read-fallback is a stopgap, not terminal; a canonical gift
  write **is required** but must land as B48's single-writer (Option C / D3), **not** a 4th
  bolt-on writer. **Approve direction before any implementation.** ⏱ ~10 min (couples to D3).

---

*B66 — sweep only. No writes, no PR. This doc is the deliverable.*
*Unrecoverable by design (out-of-band, no surviving artifact): B38 36-worktree removal list,
B65 push block — flagged above, do not reconstruct from guess.*
