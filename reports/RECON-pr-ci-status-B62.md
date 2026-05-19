# RECON — Open-PR CI & Merge-Gate Status (B62)

**Agent:** B62
**Branch:** `b62/pr-ci-status`
**Base:** `origin/main` @ `5cfa27e3f`
**Generated:** 2026-05-19
**Scope:** Pre-merge gate verification for every currently-open PR, so the
ordered queue B60 delivers can be executed without per-PR CI checking.
**Label:** `stale-audit-note` (this is a point-in-time snapshot — CI state and
mergeability recompute on every push/merge; re-verify before acting if stale).

---

## Headline

**All 31 open PRs are CI-green and mergeable.** Zero red, zero pending, zero
unknown. Every PR reports `MERGEABLE` / `mergeStateStatus: CLEAN` and every
status check `SUCCESS` (Build and Test, Lint Code, Validate Rooms, Lighthouse
Mobile, Build Preview, Vercel, plus comment/preview jobs).

**Therefore the actionable risk is NOT CI — it is merge-order collisions.**
GitHub computes `CLEAN` for each PR *independently against current `main`*. Six
docs PRs touch shared files; they are all green today but cannot all merge
without rebases. Details in "Dependency & merge-order hazards" below.

---

## Status table

| PR # | Title (short) | Mergeable | CI | Blocker |
|------|---------------|-----------|----|---------|
| 727 | a11y: label confirm/time inputs + AA contrast /account (A46) | yes | green | — |
| 729 | dead-code: delete 7 orphan mercy-guide hooks (A44) | yes | green | — |
| 730 | types: eliminate 83 no-explicit-any in src/pages (A45) | yes | green | — |
| 731 | email-cron: CRON_SECRET-gated testUserId hook (A49) | yes | green | — |
| 733 | rooms: strict field invariants in validate-rooms:core (A53) | yes | green | — |
| 738 | plc2: re-surface v2 behind flag (PR 11/11) | yes | green | — |
| 739 | seo: static Organization JSON-LD in SPA shell (A61) | yes | green | — |
| 742 | privacy: PDPD compliance fixes (A58) | yes | green | — |
| 743 | docs: rewrite DEPLOYMENT.md Vercel-only (A54) | yes | green | — |
| 751 | assets: rm 54 stale bundled mp3 (A71) | yes | green | — |
| 752 | audit: replace soft-pass guards with loud failures (A74) | yes | green | — |
| 759 | docs: scope anon Mercy feedback — Option B (A89) | yes | green | — |
| 760 | a11y: 4 sub-44px touch targets (#634) | yes | green | — |
| 761 | routing: /signup → LoginPage alias (A79) | yes | green | — |
| 762 | test: mercy-feedback regression #745/A12 (A79) | yes | green | — |
| 764 | docs: preflight verification checklist (B8) | yes | green | ⚠ prerequisite for #782 — merge this **first** |
| 765 | docs: May 19 2026 hardening summary (B10) | yes | green | — |
| 766 | billing: backoff+jitter on monotonic CAS retry (A91) | yes | green | — |
| 769 | docs: decide #757 — Option B (B9) | yes | green | — |
| 771 | test: lock delete-account aal=2 gate wiring (#233) | yes | green | — |
| 773 | billing: symmetric getCurrentPeriodStart fix (B11) | yes | green | — |
| 774 | billing: premium gates read entitlement not tier (B17) | yes | green | — |
| 775 | docs: lesson 11 stacked silent failures (B33) | yes | green | — |
| 776 | docs: SQL remediation convention (B29) | yes | green | 🔶 INDEX.md serial cluster |
| 777 | docs: PR body template (B31) | yes | green | 🔶 INDEX.md serial cluster |
| 778 | docs: B30 money-path query validation | yes | green | — |
| 779 | docs: VR current-state audit (B35) | yes | green | — |
| 780 | docs: dispatch-template enforces recon (B44) | yes | green | 🔶 INDEX.md serial cluster |
| 781 | docs: PR title convention (B50) | yes | green | 🔶 INDEX.md serial cluster |
| 782 | docs: premise correction protocol (B49) | yes | green | ⛔ **HARD-GATED on #764** — do NOT merge before #764 (add/add conflict) |
| 783 | docs: session-end principles refresh (B56) | yes | green | — |

Legend: ⛔ hard blocker (will conflict / must not merge yet) · 🔶 serial-merge
cluster (only the first merges clean, rest need rebase) · ⚠ ordering note.

---

## Transient-vs-genuine CI flag triage

**None.** No PR is red, so there are no failures to classify as
CDN-flake / unrelated-test (transient) vs genuinely broken. If a PR goes red
after this snapshot it is almost certainly a *new* push or a *rebase-induced
conflict* from the clusters below — not a pre-existing flake.

---

## Dependency & merge-order hazards (the real content)

### ⛔ HARD: #782 is gated on #764 — add/add conflict, documented

Verified mechanics:

- `docs/agent-briefs/preflight-checklist.md` **does not exist on `origin/main`.**
- #764 (`b8/brief-preflight-checklist`) **creates** it (+145 lines).
- #782 (`b49/premise-correction-section`) is **not stacked on #764** — it is
  branched independently off `main` and *also creates the same file* (+227
  lines = #764's 145 lines verbatim + 82 new: the premise-correction section
  and one INDEX row).
- Both show `MERGEABLE/CLEAN` only because each is diffed against `main` (where
  the file is absent) — they conflict with **each other**, not with main.
- #782's own PR body states this explicitly:
  > "⚠️ HELD DRAFT — gated on #764. Do not merge before #764."
  > "Rebase contract: after #764 merges, rebase this branch onto new `main`…
  > resolve the add/add by keeping #764's version and re-applying only the 82
  > added lines."
- Chau has already chosen **Option 1: held draft off main, rebase after #764**.

**Action:** Merge **#764 first**. #782 is **NOT safe to merge now** despite the
green badge — it needs a manual post-#764 rebase + add/add resolution before
its button will (or should) be used. This is exactly B49's explicit statement
the B62 brief flagged — confirmed and stronger than "wait": it is a documented
hard conflict, not a soft ordering preference.

### 🔶 SERIAL: #776 / #777 / #780 / #781 all edit `docs/agent-briefs/INDEX.md`

All four append an entry to the same `INDEX.md` table. `git merge-tree`
simulation shows **all 6 pairwise combinations conflict**:

```
CONFLICT: b29 (#776) <-> b31 (#777)
CONFLICT: b29 (#776) <-> b44 (#780)
CONFLICT: b29 (#776) <-> b50 (#781)
CONFLICT: b31 (#777) <-> b44 (#780)
CONFLICT: b31 (#777) <-> b50 (#781)
CONFLICT: b44 (#780) <-> b50 (#781)
```

Each is independently `CLEAN` vs current `main`, so GitHub will green-light
*any one* of them. But **only the first to merge lands clean**; the moment one
merges, the other three flip to a conflicting state and each needs a rebase
before it can merge.

Note: #780's own INDEX.md body text claims "conflicts with neither (distinct
filenames, no shared lines)" — **this is incorrect** (verified false above).
The distinct *new* files don't conflict, but the shared INDEX.md table edits do.

**Action:** No ordering *requirement* (any order is fine), but a strict
**one-at-a-time, rebase-after-each** constraint. Merge one → wait for the next
to be rebased green → merge the next. Do not batch.

### ✅ No-collision docs PRs — freely mergeable, any order

These touch unique files, conflict with nothing open:

- #765 — `docs/session-summaries/may-19-2026.md`
- #775 — `docs/For_Chau_Study.md`
- #778 — `reports/RECON-monitor-query-baseline-B30.md`
- #779 — `reports/RECON-vr-current-state-B35.md`
- #759 — `RECON-anon-feedback-scoping.md`
- #769 — `reports/B9-pronunciation-flag-decision-757.md`
- #783 — `CLAUDE.md` + `PRINCIPLES.md` (central files, but no other open PR
  touches them today → clean now; **watch:** any later CLAUDE.md/PRINCIPLES.md
  edit, including B60's queue doc, would collide — merge #783 early to retire
  the risk).

### Code PRs — out of B62 scope

The ~18 code PRs (#727 #729 #730 #731 #733 #738 #739 #742 #743 #751 #752 #760
#761 #762 #766 #771 #773 #774) are all green/mergeable. Cross-PR *code* file
collision analysis and the prioritized order are **B60's deliverable** — B62
deliberately does not duplicate it. None were flagged here as cross-PR conflicts
at the gate level; B60 owns same-file code-cluster sequencing (e.g. the billing
trio #766/#773/#774 if they share `billing*` modules — for B60 to confirm).

---

## Copy-paste: SAFE TO MERGE RIGHT NOW

These are CI-green, mergeable, and carry **no merge-order hazard** — they can
be merged immediately, in any order, independent of B60's ordering:

```
727 729 730 731 733 738 739 742 743 751 752 759 760 761 762
764 765 766 769 771 773 774 775 778 779 783
```

(#764 included — it is clean to merge now AND is the prerequisite that unblocks
#782; merging it early is strictly good.)

## Copy-paste: MERGE WITH CARE

```
#782            ⛔ ONLY after #764 is merged + this branch is rebased (manual
                   add/add resolution; do not click merge before then)
#776 #777       🔶 INDEX.md cluster — pick ONE, merge it, wait for the others
#780 #781          to be rebased green, then the next. One at a time.
```

---

## Method / reproducibility

```
gh pr list --state open --json number,title,mergeable,mergeStateStatus,statusCheckRollup --limit 50
git cat-file -e origin/main:docs/agent-briefs/preflight-checklist.md   # ABSENT
git merge-base --is-ancestor origin/b8/... origin/b49/...              # NOT stacked
git merge-tree <base> <branchA> <branchB>                              # pairwise conflict sim
gh pr view 782 --json body                                            # documented HELD-DRAFT gate
```

Snapshot taken 2026-05-19 against `origin/main` @ `5cfa27e3f`. Mergeability is
recomputed by GitHub on every merge — after the first INDEX.md PR or #764
lands, re-run the `gh pr list` line before merging the rest.
