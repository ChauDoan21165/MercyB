# B60 — Session-End Merge Queue Priority

**Date:** 2026-05-19
**Type:** META + SEQUENCING (no code)
**Snapshot:** 29 open PRs, `gh pr list` at session end. All 29 base on `main` (verified — no stacked PRs → no squash-orphan risk *inside* the queue).
**CI truth:** 28 are `mergeStateStatus: CLEAN` (green). 1 is `BLOCKED` (#781) — pending checks, not red. **Zero truly-red PRs.**

> Label note (`stale-audit-note`): ~10 PRs carry it. For *already-written* PRs it's a content caveat for the reviewer, **not** a merge blocker — it does not change tier.

---

## Tier breakdown

| Tier | # | PR | Type | Blast radius | CI | Dependency / why this tier |
|------|---|----|------|--------------|----|----------------------------|
| **1** | 1 | #774 | fix(billing) tier-gate reads entitlement (B17 PR1) | **HIGH** money-path | 🟢 | **Unblocks B13 phase 3** — merge first so B13 can branch off main |
| **1** | 2 | #773 | fix(billing) getCurrentPeriodStart symmetric (B11 f/u) | **HIGH** money-path | 🟢 | Period math; independent file from #774 |
| **1** | 3 | #766 | fix(billing) CAS backoff+jitter (A91 fix A) | **HIGH** money-path | 🟢 | Retry path; independent file |
| **1** | 4 | #742 | fix(privacy) PDPD compliance | **HIGH** legal | 🟢 | Consent withdrawal / data rights — compliance |
| **1** | 5 | #771 | test(security) delete-account aal=2 wiring (#233) | guards HIGH auth | 🟢 | Test-only (own blast LOW) but locks a security invariant |
| **2** | 6 | #761 | fix(routing) /signup→LoginPage alias | MED (auth route) | 🟢 | Small alias on auth entry path |
| **2** | 7 | #727 | fix(a11y) /account labels + AA contrast | MED UX | 🟢 | Touches src/pages — merge before #730 |
| **2** | 8 | #760 | fix(a11y) 4 sub-44px touch targets | MED UX | 🟢 | Touches src/pages — merge before #730 |
| **2** | 9 | #762 | test(mercy-feedback) regression #745/A12 | MED (test) | 🟢 | Guards already-resolved feedback API |
| **2** | 10 | #738 | feat(plc2) re-surface v2 behind flag (11/11) | MED | 🟢 | Flag-gated OFF → low runtime risk; series complete |
| **2** | 11 | #731 | feat(email-cron) CRON_SECRET-gated test hook | MED | 🟢 | Secret-gated |
| **2** | 12 | #739 | feat(seo) static JSON-LD in SPA shell | MED | 🟢 | Touches index.html shell |
| **2** | 13 | #729 | chore(dead-code) delete 7 orphan mercy-guide hooks | MED (deletion) | 🟢 | Verified-orphan |
| **2** | 14 | #751 | chore(assets) rm 54 stale mp3 (28.3 MB) | MED (deletion) | 🟢 | Resolver has /audio fallback |
| **2** | 15 | #752 | test(audit) loud failures vs soft-pass guards | MED (test) | 🟢 | **Makes hidden failures loud — merge late so new red is attributable** |
| **2** | 16 | #733 | test(rooms) strict validate-rooms:core | MED→HIGH op | 🟢 | **Runs in PREBUILD — over-strict could block ALL future builds; merge late, eyes open** |
| **2** | 17 | #730 | chore(types) 83 any + forward-lock | MED (broad diff) | 🟢 | **Forward-lock lint + broad src/pages — merge AFTER #727/#760 to avoid forcing their rebases. LAST in tier.** |
| **3** | 18 | #759 | docs(feedback) anon scope Option B | LOW docs | 🟢 | Cheap, no runtime |
| **3** | 19 | #769 | docs(testing) decide #757 Option B | LOW docs | 🟢 | Decision doc |
| **3** | 20 | #779 | docs(recon) VR current-state audit | LOW docs | 🟢 | Recon |
| **3** | 21 | #778 | docs(recon) B30 phase-0 of B7 money queries | LOW docs | 🟢 | Recon (money-path *topic*, zero runtime) |
| **3** | 22 | #780 | docs(agent-briefs) dispatch-brief template | LOW docs | 🟢 | |
| **3** | 23 | #777 | docs(agent-briefs) PR body template | LOW docs | 🟢 | |
| **3** | 24 | #776 | docs(agent-briefs) SQL remediation convention | LOW docs | 🟢 | money-path *label*, docs-only |
| **3** | 25 | #775 | docs(study) lesson 11 stacked failures | LOW docs | 🟢 | |
| **3** | 26 | #765 | docs(session) May 19 summary | LOW docs | 🟢 | |
| **3** | 27 | #764 | docs(agent-briefs) preflight checklist | LOW docs | 🟢 | |
| **3** | 28 | #743 | docs(deploy) rewrite DEPLOYMENT.md | LOW docs | 🟢 | |
| **4** | — | #781 | docs(agent-briefs) PR title convention | LOW docs | ⏳ | **EXCLUDED — `BLOCKED`: Build/Lighthouse checks still pending (NOT red). Merge after green.** |

Totals: Tier 1 = 5 · Tier 2 = 12 · Tier 3 = 11 · Excluded = 1 · **Red = 0**

---

## Squash-orphan discipline (chaining convention)

This repo **squash-merges**. The chained block below:
- Uses `&&` between every step so **a failed merge or verify aborts the rest** (never `;` through failures).
- All 29 PRs base on `main`, so no in-queue rebase is needed — but **downstream chains must NOT stack on these branches**:
  - **B13 phase 3** must branch off `origin/main` *after* #774 lands and is verified on main — never off `b25/tier-gate-fix-pr1`.
  - Any **B17 PR2 / B11 / A91** follow-up: re-branch off `origin/main` post-merge, re-apply the parent change if absent. Squash orphans stacks.
- Tier 1 ends with an explicit `git fetch + grep origin/main` gate on the money-path commits before declaring B13 unblocked.

---

## CHAU ↓↓↓ COPY FROM HERE

```bash
cd /Users/admin/MercyB

# ═══ TIER 1 — HIGH blast radius, green, dependencies waiting (merge FIRST) ═══
gh pr merge 774 --squash --delete-branch \
  && gh pr merge 773 --squash --delete-branch \
  && gh pr merge 766 --squash --delete-branch \
  && gh pr merge 742 --squash --delete-branch \
  && gh pr merge 771 --squash --delete-branch \
  && git fetch -q origin main \
  && echo "Tier1 money-path on main? (expect 3 shas):" \
  && git log origin/main --oneline -20 | grep -Ei 'entitlement|getCurrentPeriodStart|backoff|jitter|tier-gate' \
  `# ↑ B13 phase 3 unblocked ONLY if #774 line appears above` \
  \
  `# ═══ TIER 2 — MEDIUM blast radius, green ═══` \
  && gh pr merge 761 --squash --delete-branch  `# auth route alias` \
  && gh pr merge 727 --squash --delete-branch  `# a11y /account — src/pages, before #730` \
  && gh pr merge 760 --squash --delete-branch  `# a11y touch targets — src/pages, before #730` \
  && gh pr merge 762 --squash --delete-branch  `# feedback regression test` \
  && gh pr merge 738 --squash --delete-branch  `# plc2 — flag-gated OFF` \
  && gh pr merge 731 --squash --delete-branch  `# email-cron — secret-gated` \
  && gh pr merge 739 --squash --delete-branch  `# seo JSON-LD shell` \
  && gh pr merge 729 --squash --delete-branch  `# delete orphan hooks` \
  && gh pr merge 751 --squash --delete-branch  `# rm stale mp3` \
  && gh pr merge 752 --squash --delete-branch  `# loud test failures — late so new red attributable` \
  && gh pr merge 733 --squash --delete-branch  `# strict room validator — runs in PREBUILD, eyes open` \
  && gh pr merge 730 --squash --delete-branch  `# type forward-lock — LAST: after #727/#760` \
  && git fetch -q origin main \
  \
  `# ═══ TIER 3 — docs-only, green (cheap, no risk, merge last) ═══` \
  && gh pr merge 759 --squash --delete-branch \
  && gh pr merge 769 --squash --delete-branch \
  && gh pr merge 779 --squash --delete-branch \
  && gh pr merge 778 --squash --delete-branch \
  && gh pr merge 780 --squash --delete-branch \
  && gh pr merge 777 --squash --delete-branch \
  && gh pr merge 776 --squash --delete-branch \
  && gh pr merge 775 --squash --delete-branch \
  && gh pr merge 765 --squash --delete-branch \
  && gh pr merge 764 --squash --delete-branch \
  && gh pr merge 743 --squash --delete-branch \
  && echo "✅ Queue drained. Excluded: #781 (pending checks)."

# ═══ TIER 4 — EXCLUDED, do NOT merge above ═══
# #781  docs(agent-briefs) PR title convention — mergeStateStatus BLOCKED.
#       Cause: Build Preview / Build and Test / Lighthouse Mobile checks PENDING
#       (in-progress), NOT failing. Docs-only, harmless once green.
#       Re-check, then merge solo:
#   gh pr checks 781 && gh pr merge 781 --squash --delete-branch
```

---

## Explicitly excluded

| PR | Reason | Action |
|----|--------|--------|
| #781 | `mergeStateStatus: BLOCKED` — Build Preview + Build and Test + Lighthouse Mobile checks **pending** (newest PR, checks not finished). Lint/Validate Rooms already pass. **Not red.** | Wait for checks → `gh pr checks 781` → merge solo. Docs-only, zero risk once green. |

**No PR is excluded for red CI** — the queue is unusually clean. The only real ordering risks are *self-inflicted-after-merge*: #752 (loud failures), #733 (prebuild validator), #730 (forward-lock) — all sequenced late in Tier 2 with rationale above.

---

## One-line summary

Drain in tier order; Tier-1 #774 first (unblocks B13 phase 3) → verify money-path shas on main before trusting the unblock; everything green except #781 (pending, not red) which merges solo after checks finish; `&&`-chained so any failure halts the train.
