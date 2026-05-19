# INVENTORY — Remaining Recon Branch Durability (A10)

**Date:** 2026-05-19
**Agent:** A10
**Purpose:** Durability backstop for local-only recon/remediation branches not covered by B65.
**Status:** Inventory only. **A10 pushed nothing.** Chau runs the push block below after review.

---

## Context

B65 pushed the 7 highest-value branches (`b41`, `b45`, `b47`, `b48`, `b57`, `b42`, `b54`) — those now have `origin/` refs and are excluded here.

This pass swept **all** remaining local branches with no matching `origin/` ref: **33 branches**. (The "~12 operator artifacts" estimate in the brief was low; classification below is by content/intent per the counts-vs-examples rule, not by the estimate.)

Diff method: `git diff origin/main...<branch>` (three-dot / merge-base) to isolate each branch's *own* contribution. Two-dot diff was misleading because `origin/main` has moved far ahead of most branch points.

### Breakdown

| Bucket | Count | Action |
|---|---|---|
| Recon/remediation only — safe to push | 21 | In push block below |
| Code-touching — **flagged, excluded** | 2 | Needs proper PR review, NOT a durability push |
| Empty — no unique commit vs `origin/main` | 10 | No action — nothing at risk |
| **Total swept** | **33** | |

---

## 1. Safe to push — recon / remediation only (21)

All confirmed `nonReportOrRecon = 0` (only `reports/**` or root `RECON-*.md`), **except** two annotated below (`b21`, `a98`) which carry non-`reports/` artifacts that touch **zero prod paths** (root probe scripts / a study doc) — included but flagged for a glance.

| Branch | SHA | Doc added |
|---|---|---|
| `a96/webhook-forensics-scoping` | `6a85b4cc7` | `reports/RECON-A96-webhook-forensics-scoping.md` |
| `b13/isentitling-fix-plan` | `820c6dc07` | `reports/RECON-isentitling-fix-plan-B13.md` |
| `b19/placement-flag-decision` | `13274ba6f` | `reports/RECON-placement-flag-decision-B19.md` |
| `b2/vr-baselines-scoping` | `480e56bcf` | `RECON-vr-baselines-635.md` (root recon doc) |
| `b27/profile-trigger-audit` | `2ad771084` | `reports/RECON-profile-trigger-architecture-B27.md` |
| `b28/unknowable-event-lookup` | `80be83c3a` | `reports/RUNBOOK-evt-1TUxM5-lookup.md` |
| `b32/agent-inventory` | `83b521c4d` | `reports/RECON-session-agent-inventory-B32.md` |
| `b34/a77-recon-retroactive` | `190d9da5b` | `reports/RECON-stripe-webhook-failures-A77-retroactive.md` |
| `b5/mylinh-paid-but-free-diagnostic` | `245d8ec6d` | `reports/RECON-mylinh-paid-but-free-B5.md` |
| `b52/price-map-autoupsert-scoping` | `20e80c1e9` | `reports/RECON-price-map-autoupsert-B52.md` |
| `b53/price-data-quality-diagnostic` | `35ef2ea1c` | `reports/RECON-price-data-quality-B53.md` + `reports/REMEDIATION-price-map-placeholders-B53.sql` |
| `b55/recon-durability-tradeoff` | `272b5ee2d` | `reports/RECON-recon-durability-tradeoff-B55.md` |
| `b58/gift-write-or-fallback` | `0dc77e81a` | `reports/RECON-gift-write-vs-fallback-design-B58.md` |
| `b60/merge-queue-priority` | `d392cca31` | `reports/RECON-B60-merge-queue-priority.md` |
| `b61/out-of-band-schema-audit` | `b51eac418` | `reports/RECON-out-of-band-schema-B61.md` |
| `b62/pr-ci-status` | `bca42770a` | `reports/RECON-pr-ci-status-B62.md` |
| `b64/price-map-repair-sql` | `8472883a7` | `reports/REMEDIATION-price-map-repair-B64.sql` |
| `b66/session-closeout` | `d5d1b79c9` | `reports/FINAL-CLOSEOUT-2026-05-19.md` |
| `b7/money-path-monitoring-scoping` | `412a2e166` | `reports/RECON-money-path-silent-failure-monitoring-B7.md` |
| `b21/failed-deletion-events` ⚠️ | `a84ace451` | `reports/RECON-failed-deletion-events-B21.md` + `reports/REMEDIATION-stripe-deletion-events-B21.sql` **+ root `b21-probe.mjs`, `b21-probe2.mjs`** |
| `a98/study-file-update` ⚠️ | `bb1369baf` | `docs/For_Chau_Study.md` (study notes, not `reports/`) |

**⚠️ Flag notes (still safe to push — zero prod-path code):**
- `b21/failed-deletion-events` — also adds `b21-probe.mjs` + `b21-probe2.mjs` at repo root. These are throwaway diagnostic probe scripts: zero importers, not in `src/`, `api/`, or `supabase/functions/`. No prod path. Recommend a follow-up cleanup to move/delete the probes, but they pose no merge/runtime risk on a durability push.
- `a98/study-file-update` — only `docs/For_Chau_Study.md` (May-19 hardening lessons). Docs, not code, outside `reports/`. Zero prod path.

---

## 2. Code-touching — FLAGGED, excluded from durability push (2)

These have **real changes outside `reports/` that touch prod paths**. They are not recon artifacts and must go through normal PR review — do **not** fold them into a durability push.

| Branch | SHA | Files | Why excluded |
|---|---|---|---|
| `A81-pr687-fix` | `c0960d508` | `src/components/account/TrackingConsentPanel.tsx`, its `__tests__`, `src/pages/AccountPage.tsx` | Real Vitest-3 `vi.fn` single-signature generic fix. 3 prod `src/` files. Needs its own PR + green gates. |
| `chinese-cultural-tips-vi-a1` | `ea9ff1026` | `src/languages/chinese/lessons-a1.ts`, `src/languages/japanese/lessons-a1.ts` | Lesson **content** feature (VI cultural notes, lessons 11–15). Per project rule, language-lesson `.ts` merges auto-sync to prod Supabase — this is a shippable feature, not a recon backstop. Needs its own reviewed PR. |

---

## 3. Empty — no unique commit vs `origin/main` (10)

`git diff origin/main...<branch>` returned **0 files** — the branch tip is already an ancestor of `origin/main` (work merged, or branch created but never committed to). **Nothing at risk; no push needed.**

| Branch | SHA | Tip is |
|---|---|---|
| `a79/newuser-smoke` | `b27001edf` | merged (PR #749) |
| `a91/monotonic-diagnostic` | `530810784` | merged (PR #687) |
| `a94/stale-sub-rows-cleanup` | `629a26cb9` | merged (PR #737) |
| `b3/shared-drift-scoping` | `3e9e41e35` | merged (PR #758) |
| `b5/mylinh-sql-regen` | `5cfa27e3f` | = `origin/main` (no commit) |
| `b67/entitlements-schema-spec` | `5cfa27e3f` | = `origin/main` (no commit) |
| `b68/recompute-entitlement-design` | `5cfa27e3f` | = `origin/main` (no commit) |
| `b69/d4-mrr-source-strategic` | `5cfa27e3f` | = `origin/main` (no commit) |
| `cleanup/b17-pr3-sign-audio-dead` | `5cfa27e3f` | = `origin/main` (no commit) |
| `feat/b7-q1-q4-monitoring` | `5cfa27e3f` | = `origin/main` (no commit) |

> Note: the six `5cfa27e3f` branches have live worktrees in `/private/tmp/` (A2/A3/A4/A5/A6/A8). If a concurrent agent commits there later, those branches will gain content and need a follow-up durability sweep. Re-run this inventory at next session close.

---

## 4. PUSH COMMAND BLOCK — Chau runs after review

Pushes only the **21 safe** recon/remediation branches. Each is `-u` so the local branch starts tracking. Pushing a ref does **not** require the branch to be checked out (several are live in `/private/tmp` worktrees — unaffected).

```bash
#!/usr/bin/env bash
set -euo pipefail
cd /Users/admin/MercyB
git fetch origin --quiet

# --- pure reports/ recon + remediation (19) ---
git push -u origin a96/webhook-forensics-scoping
git push -u origin b13/isentitling-fix-plan
git push -u origin b19/placement-flag-decision
git push -u origin b2/vr-baselines-scoping
git push -u origin b27/profile-trigger-audit
git push -u origin b28/unknowable-event-lookup
git push -u origin b32/agent-inventory
git push -u origin b34/a77-recon-retroactive
git push -u origin b5/mylinh-paid-but-free-diagnostic
git push -u origin b52/price-map-autoupsert-scoping
git push -u origin b53/price-data-quality-diagnostic
git push -u origin b55/recon-durability-tradeoff
git push -u origin b58/gift-write-or-fallback
git push -u origin b60/merge-queue-priority
git push -u origin b61/out-of-band-schema-audit
git push -u origin b62/pr-ci-status
git push -u origin b64/price-map-repair-sql
git push -u origin b66/session-closeout
git push -u origin b7/money-path-monitoring-scoping

# --- safe but carry non-reports/ artifacts (zero prod path) — review then keep/drop ---
git push -u origin b21/failed-deletion-events   # + root b21-probe*.mjs (throwaway diagnostics)
git push -u origin a98/study-file-update        # docs/For_Chau_Study.md (study notes)

echo "A10 durability push complete — 21 branches."
```

**Excluded on purpose (do NOT add to the block):** `A81-pr687-fix`, `chinese-cultural-tips-vi-a1` — code changes, need their own reviewed PRs (§2).

---

## Reproduce

```bash
cd /Users/admin/MercyB && git fetch origin --quiet
# local branches with no matching origin ref:
comm -23 <(git for-each-ref --format='%(refname:short)' refs/heads/ | sort) \
         <(git for-each-ref --format='%(refname:short)' refs/remotes/origin/ | sed 's|^origin/||' | sort)
# per branch, isolate own contribution:
git diff origin/main...<branch> --name-only
```
