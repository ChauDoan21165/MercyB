# AUDIT — Worktree Prune Verification (A9)

**Dispatched:** B66 follow-up — verify B38's lost worktree-removal list before bulk removal.
**Constraint:** Read-only. **Zero worktree removals performed.** Chau decides what to prune.
**Auditor:** A9 · **Date:** 2026-05-19 · **Snapshot:** `2026-05-19T19:43:14Z` (main repo `/Users/admin/MercyB`)
**Branch:** `a9/worktree-prune-audit` · Operator artifact, no PR.

---

## ⚠️ BLOCKER — cross-reference could not be performed

The dispatch instructs (steps 4, 5, 8, 9) cross-referencing against **"the 36 paths in
Chau's paste worktree-prune block."** **No paste was present in the dispatch input** I
received. Per PRINCIPLES.md #15 — the principle this very task cites — I will **not invent,
infer, or assume the 36 paths** (assuming "the paste == the current list" would silently
defeat the entire purpose of the audit, which exists to detect divergence between them).

**What is BLOCKED, pending the paste:**

- Step 4 — cross-reference current state against the paste's 36 paths
- Step 5 (partial) — "exists in paste?" per-path matching
- Step 8 — STALE-PASTE detection (paths in paste, absent from current state)
- Step 9 — ORPHANED detection (worktrees in current state, absent from the paste)

**What is COMPLETE and verifiable below:** the full current-state inventory of every
live worktree with clean/branch status and a per-worktree prune-safety verdict. This is
the authoritative half. To finish the cross-reference, re-run A9 **with the paste's 36
paths pasted into the dispatch body**, or hand this inventory to Chau to diff against the
paste manually.

---

## 🔴 TOP FINDING — the worktree set is mutating live; a frozen path list is structurally unsafe

Three reads of `git worktree list` within a single audit window returned **36 → 38 → 39
entries**. New worktrees `A1-formatmoney-vnd`, `A11-t2-retire-plan`, `A12-b13ph3-brief`
appeared mid-audit (active fleet agents creating theirs).

**Implication:** Any static prune list — B38's lost list, Chau's paste, or this report —
is stale the moment it is captured. A 36-path paste is **already numerically inconsistent**
with the current 39 live worktrees: at least 3 worktrees (A1/A11/A12, all fresh & empty)
would be **orphaned** by a 36-path block, and more are appearing continuously.

**Recommendation:** Do not prune from a frozen path list. Prune by a **computed predicate**,
re-evaluated at execution time:

```
PRUNE IFF: path != main repo
       AND not locked
       AND no uncommitted/untracked files (no --force)
       AND ( branch fully merged to origin/main  OR  branch pushed to origin )
```

The SAFE column below is exactly this predicate evaluated at the snapshot time.

---

## Safety model (how the verdict is derived)

`git worktree remove` (no `--force`) **refuses** if the worktree has uncommitted *or*
untracked files. A bulk prune that uses `--force`, or that pairs removal with
`git branch -D`, has two distinct loss vectors:

- **NOT-SAFE-REMOVE** — dirty/untracked uncommitted work. `--force` removal destroys it.
- **NOT-SAFE-BRANCH-DEL** — worktree is clean, but the branch has unique commits **never
  pushed to origin**. Worktree removal alone keeps the branch ref (recoverable); a paired
  `git branch -D` permanently loses those commits (no remote copy exists).

`commits_vs_main` = `git rev-list --count origin/main..HEAD`.

---

## Full current-state inventory (39 entries @ 2026-05-19T19:43:14Z)

| # | path | in WT list | clean | branch status | SAFE to prune |
|---|------|-----------|-------|---------------|---------------|
| 1 | `/Users/admin/MercyB` | yes | n/a | `b54/pending-chau-actions` PUSHED | **DO-NOT-PRUNE — primary repo** |
| 2 | `/private/tmp/A1-formatmoney-vnd` | yes (appeared mid-audit) | clean | `fix/formatmoney-zero-decimal` 0c UNPUSHED | ✅ SAFE (empty: 0 commits vs main) |
| 3 | `/private/tmp/A11-t2-retire-plan` | yes (appeared mid-audit) | clean | `b70/t2-retirement-design` 0c UNPUSHED | ✅ SAFE (empty) |
| 4 | `/private/tmp/A12-b13ph3-brief` | yes (appeared mid-audit) | clean | `b71/b13-phase3-brief` 0c UNPUSHED | ✅ SAFE (empty) |
| 5 | `/private/tmp/A2-mylinh-regen` | yes | **DIRTY** | `b5/mylinh-sql-regen` 0c UNPUSHED | 🔴 **NOT-SAFE-REMOVE (HIGH)** — 2 *staged but uncommitted* tracked files: `reports/RECON-mylinh-paid-but-free-B5.md`, `reports/REMEDIATION-mylinh-paid-but-free-B5.sql`. Remediation SQL, never committed/pushed → total loss. |
| 6 | `/private/tmp/A3-b7-monitoring` | yes | **DIRTY** | `feat/b7-q1-q4-monitoring` 0c UNPUSHED | 🔴 **NOT-SAFE-REMOVE** — untracked `_b7_recon_source.md`; 0 commits → this file IS all the work. |
| 7 | `/private/tmp/A4-b17-pr3-sign-audio` | yes | clean | `cleanup/b17-pr3-sign-audio-dead` 0c UNPUSHED | ✅ SAFE (empty) |
| 8 | `/private/tmp/A46-a11y-next` | yes | dirty(untracked) | `a46/account-a11y` 1c **PUSHED** | 🟡 SAFE-WITH-NOTE — commit on origin; untracked `a46-axe/` is regenerable axe output (LOW). |
| 9 | `/private/tmp/A5-entitlements-schema` | yes | clean | `b67/entitlements-schema-spec` 0c UNPUSHED | ✅ SAFE (empty) |
| 10 | `/private/tmp/A6-recompute-design` | yes | clean | `b68/recompute-entitlement-design` 0c UNPUSHED | ✅ SAFE (empty) |
| 11 | `/private/tmp/A61-seo-audit` | yes | **DIRTY** | `a61/seo-jsonld` 1c **PUSHED** | 🔴 **NOT-SAFE-REMOVE** — untracked `RECON-seo-public-surfaces.md` (uncommitted recon, lost on `--force`). Committed work is safe on origin. |
| 12 | `/private/tmp/A68-feedback-livetest` | yes | dirty(untracked) | `a68/mercy-feedback-config-diagnostics` 1c **PUSHED** | 🟡 SAFE-WITH-NOTE — commit on origin; untracked `a68-livefire.mjs` (MEDIUM — confirm not needed before `--force`). |
| 13 | `/private/tmp/A79-newuser-smoke` | yes | **DIRTY** | `a79/newuser-smoke` 0c UNPUSHED | 🔴 **NOT-SAFE-REMOVE** — untracked smoke artifacts (`a79-results.json`, `a79-step1-result.json`, `shots/`, `a79-smoke/`, `.install.log`); 0 commits → results ARE the work. |
| 14 | `/private/tmp/A8-d4-mrr-source` | yes | clean | `b69/d4-mrr-source-strategic` 0c UNPUSHED | ✅ SAFE (empty) |
| 15 | `/private/tmp/A91-monotonic-concurrent` | yes | **DIRTY** | `a91/monotonic-diagnostic` 0c UNPUSHED | 🔴 **NOT-SAFE-REMOVE** — untracked `RECON-monotonic-concurrent-modification-A91.md`; 0 commits → the recon IS the work. |
| 16 | `/private/tmp/A94-stale-sub-cleanup` | yes | **DIRTY** | `a94/stale-sub-rows-cleanup` 0c UNPUSHED | 🔴 **NOT-SAFE-REMOVE** — untracked `probe.mjs`/`probe2.mjs`/`probe3.mjs`; 0 commits → probes ARE the work. |
| 17 | `/private/tmp/B21-failed-deletions` | yes | clean | `b21/failed-deletion-events` **1c UNPUSHED** | 🔴 **NOT-SAFE-BRANCH-DEL** — 1 commit, branch never on origin. Worktree removal OK; do **not** `branch -D`. |
| 18 | `/private/tmp/B27-profile-triggers` | yes | clean | `b27/profile-trigger-audit` **2c UNPUSHED** | 🔴 **NOT-SAFE-BRANCH-DEL** — 2 unpushed commits. |
| 19 | `/private/tmp/B41-next-session-primer` | yes | clean | `b41/next-session-primer` 2c **PUSHED** | ✅ SAFE (on origin) |
| 20 | `/private/tmp/B42-price-map-fix` | yes | clean | `b42/price-map-missing-row` 1c **PUSHED** | ✅ SAFE (on origin) |
| 21 | `/private/tmp/B44-dispatch-template-update` | yes | clean | `b44/dispatch-template-enforce-recon` 1c **PUSHED** | ✅ SAFE (on origin) |
| 22 | `/private/tmp/B45-billing-architecture-map` | yes | clean | `b45/billing-architecture-map` 1c **PUSHED** | ✅ SAFE (on origin) |
| 23 | `/private/tmp/B47-billing-history` | yes | clean | `b47/billing-architecture-history` 1c **PUSHED** | ✅ SAFE (on origin) |
| 24 | `/private/tmp/B48-billing-target-state` | yes | clean | `b48/billing-target-state` 1c **PUSHED** | ✅ SAFE (on origin) |
| 25 | `/private/tmp/B49-premise-correction` | yes | dirty(untracked) | `b49/premise-correction-section` 1c **PUSHED** | 🟡 SAFE-WITH-NOTE — commit on origin; untracked `.pr-body.md` is ephemeral (LOW). |
| 26 | `/private/tmp/B5-mylinh-paid-but-free` | yes | **DIRTY** | `b5/mylinh-paid-but-free-diagnostic` **1c UNPUSHED** | 🔴 **NOT-SAFE (HIGH — both vectors)** — 1 unpushed commit **and** untracked `b5-deep.mjs`/`b5-diagnostic.mjs`. |
| 27 | `/private/tmp/B50-pr-title-convention` | yes | clean | `b50/pr-title-convention` 1c **PUSHED** | ✅ SAFE (on origin) |
| 28 | `/private/tmp/B52-price-map-autoupsert` | yes | clean | `b52/price-map-autoupsert-scoping` **1c UNPUSHED** | 🔴 **NOT-SAFE-BRANCH-DEL** — 1 unpushed commit. |
| 29 | `/private/tmp/B53-price-data-quality` | yes | clean | `b53/price-data-quality-diagnostic` **1c UNPUSHED** | 🔴 **NOT-SAFE-BRANCH-DEL** — 1 unpushed commit. |
| 30 | `/private/tmp/B55-recon-durability` | yes | clean | `b55/recon-durability-tradeoff` **1c UNPUSHED** | 🔴 **NOT-SAFE-BRANCH-DEL** — 1 unpushed commit. |
| 31 | `/private/tmp/B56-principles-update` | yes | clean | `b56/principles-session-update` 1c **PUSHED** | ✅ SAFE (on origin) |
| 32 | `/private/tmp/B57-mylinh-sql-salvage` | yes | clean | `b57/mylinh-sql-salvage` 1c **PUSHED** | ✅ SAFE (on origin) |
| 33 | `/private/tmp/B58-gift-write-or-fallback` | yes | clean | `b58/gift-write-or-fallback` **1c UNPUSHED** | 🔴 **NOT-SAFE-BRANCH-DEL** — 1 unpushed commit. |
| 34 | `/private/tmp/B60-merge-queue` | yes | clean | `b60/merge-queue-priority` **1c UNPUSHED** | 🔴 **NOT-SAFE-BRANCH-DEL** — 1 unpushed commit. |
| 35 | `/private/tmp/B61-out-of-band-schema` | yes | clean | `b61/out-of-band-schema-audit` **1c UNPUSHED** | 🔴 **NOT-SAFE-BRANCH-DEL** — 1 unpushed commit. |
| 36 | `/private/tmp/B62-pr-ci-status` | yes | clean | `b62/pr-ci-status` **1c UNPUSHED** | 🔴 **NOT-SAFE-BRANCH-DEL** — 1 unpushed commit. |
| 37 | `/private/tmp/B64-price-map-sql` | yes | clean | `b64/price-map-repair-sql` **1c UNPUSHED** | 🔴 **NOT-SAFE-BRANCH-DEL** — 1 unpushed commit (price-map repair SQL). |
| 38 | `/private/tmp/B66-session-closeout` | yes | clean | `b66/session-closeout` **1c UNPUSHED** | 🔴 **NOT-SAFE-BRANCH-DEL** — 1 unpushed commit (this is the B66 closeout work that spawned this audit). |
| 39 | `/Users/admin/MercyB/.claude/worktrees/agent-a2668270651dadf8e` | yes | clean | `fix/guide-assistant-restore-safety-guards` 1c **PUSHED** | **DO-NOT-PRUNE — LOCKED** (in-use by active agent harness) |

---

## Summary verdict

| verdict | count | entries |
|---------|-------|---------|
| **DO-NOT-PRUNE** | 2 | main repo (#1); locked agent worktree (#39) |
| ✅ SAFE | 15 | A1, A11, A12, A4, A5, A6, A8 (empty) · B41, B42, B44, B45, B47, B48, B50, B56, B57 (pushed+clean) |
| 🟡 SAFE-WITH-NOTE | 3 | A46 (axe output), A68 (untracked .mjs — MEDIUM), B49 (.pr-body.md) — committed work is on origin; only the untracked file is at risk under `--force` |
| 🔴 NOT-SAFE-REMOVE (dirty/untracked = the work) | 6 | **A2 (HIGH: staged remediation SQL)**, A3, A61, A79, A91, A94 |
| 🔴 NOT-SAFE-BRANCH-DEL (unpushed unique commits) | 13 | B21, B27, **B5 (HIGH: also dirty)**, B52, B53, B55, B58, B60, B61, B62, B64, B66 — *worktree removal is fine; do NOT pair with `git branch -D`* |

(15 + 3 + 6 + 13 + 2 = 39. B5 counted once in NOT-SAFE-BRANCH-DEL row as HIGH/both-vectors.)

### Highest-risk — escalate before any bulk prune touches these
- **#5 A2-mylinh-regen** — staged-but-uncommitted `REMEDIATION-mylinh-paid-but-free-B5.sql`. Never committed, never pushed. A `--force` prune destroys remediation SQL outright.
- **#26 B5-mylinh-paid-but-free** — unpushed commit **plus** untracked diagnostics. Both loss vectors.
- 11 other B-track branches carry **unpushed unique commits** (B21/B27/B52/B53/B55/B58/B60/B61/B62/B64/B66). Safe to *remove the worktree*, NOT safe to *delete the branch* — a combined `worktree remove --force && branch -D` loop would permanently destroy all of them.

---

## What Chau needs to do next

1. **To complete the BLOCKED cross-reference:** paste the 36-path prune block into a fresh
   A9 re-dispatch (or diff it yourself against the inventory above). Without it, STALE-PASTE
   and ORPHANED-by-prune cannot be determined.
2. **Recommended:** abandon the frozen-list approach. Prune via the predicate in the TOP
   FINDING section, evaluated at execution time — the set is provably volatile.
3. **Before any `--force` or `branch -D` prune:** exclude the 6 NOT-SAFE-REMOVE and 13
   NOT-SAFE-BRANCH-DEL entries above, or rescue their work first (commit + push, or copy
   the untracked recon/SQL/results out).

No worktrees were removed. No branches were deleted. Read-only audit.
