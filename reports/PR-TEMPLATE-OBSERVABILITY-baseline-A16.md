# PR Template Observability — soft-then-hard rollout baseline (A16)

**Author:** A16
**Date:** 2026-05-19
**Status:** Phase 1 (observe) — this PR ships the observation layer.

---

## Context

PR #890 codified PRINCIPLES §3 (real-device verification gate) into
`.github/PULL_REQUEST_TEMPLATE.md`. The template is now visible in the
GitHub PR composer on every new PR. The next question is empirical,
not aesthetic: **are operators actually filling it in?**

Two failure modes we want to avoid:

1. **Decorative template.** Operators paste a blank PR body or leave
   every checkbox unticked. The gate becomes ceremony.
2. **Premature hard fail.** We flip the gate to CI-required on day 1,
   it red-bars every legitimate PR (including docs-only ones whose
   author hasn't memorized the N/A escape), and people work around it.

This PR ships the middle path: a soft observability layer that posts
helpful comments and tracks weekly compliance, with a clearly-defined
promotion path to a hard gate.

---

## What ships in this PR

| File | Purpose |
| --- | --- |
| `scripts/check-pr-template.mjs` | Per-PR observer. Parses body, scores against template gates, posts informational comment. Always exits 0. |
| `scripts/pr-template-weekly-report.mjs` | Monday rollup. Queries last 7 days of merged PRs, writes `reports/PR-TEMPLATE-compliance-weekly.md`. |
| `.github/workflows/pr-template-observe.yml` | Runs the observer on every PR. `continue-on-error: true`. Job name has "(observe)" suffix — must NOT be added to required-checks ruleset. |
| `.github/workflows/pr-template-weekly.yml` | Cron-fires Monday 09:00 UTC. Opens a PR with the rollup (does NOT push to main). |
| `reports/PR-TEMPLATE-OBSERVABILITY-baseline-A16.md` | This file — the why and the promotion plan. |

Zero blast radius on runtime code, runtime config, or the build. All
five files are CI/process artifacts.

---

## What the observer checks

For every PR opened/edited/reopened/synchronized:

1. **Surface declared** — at least one box ticked under "Surface(s) this PR ships to" (Web / iOS / Android / edge fn / Vercel fn / CI-only / docs-only).
2. **Verified by Chau** — at least one box ticked under that section. The three options are ✅ tested / ⏸️ gated / N/A-with-reason. Any one of them passes.
3. **Diagnose-Before-Patching** — only required when the PR labels itself a bug fix (label match `bug|fix` OR the "🐛 Bug fix" checkbox under Type of Change). The block needs at least one of Symptom / Root cause / Fix to have content past the colon (HTML-comment placeholder doesn't count).
4. **Five Non-Negotiables** — at least one box ticked. (Soft check; warning, not missing-field.)

PRs that score 100% get a 👍 reaction; everyone else gets a heads-up
comment linking to the template. The comment is replaceable — if the
operator edits the PR body and the next observer run finds it
compliant, the prior comment is patched to the green message.

---

## What the weekly report tells us

Sample structure (rendered into `reports/PR-TEMPLATE-compliance-weekly.md`):

```
# PR Template Compliance — week ending 2026-05-26

Window: PRs merged since `2026-05-19` (UTC).

## Headline
- Merged PRs in window: 47
- Fully compliant: 31 / 47 = 66%

## Per-gate breakdown
| Gate | Filled | Total | % |
| Surface declared          | 42 | 47 | 89% |
| Verified by Chau          | 33 | 47 | 70% |
| Diagnose (bug fixes only) | 11 | 14 | 79% |
```

The "Phase-2 readiness" line is computed deterministically:

- 🟢 if overall compliance ≥ 80% → eligible for Phase 2
- 🟡 if < 80% → stay in observe mode another week

---

## Phase 2 — the promotion plan

**Trigger:** any weekly report where the headline compliance is ≥ 80%
AND the per-gate breakdown shows Verified-by-Chau ≥ 80%.

**Dispatch for the Phase-2 PR** (do NOT ship it now — this PR is Phase 1
only):

> Title: `chore(process): PR template hard gate (A16 Phase 2)`
>
> Changes:
> 1. In `scripts/check-pr-template.mjs`: flip `EXIT_ON_NONCOMPLIANT = false` → `true`.
> 2. In `.github/workflows/pr-template-observe.yml`:
>    - Drop `continue-on-error: true`
>    - Rename job from `PR Template Compliance (observe)` to `PR Template Compliance`
> 3. Update `reports/PR-TEMPLATE-OBSERVABILITY-baseline-A16.md` "Status" to "Phase 2 (hard gate)."
> 4. Open a follow-up issue to add the check to the branch protection ruleset on main (Chau-applied; agent cannot edit branch protection).
>
> Surface: CI-only — runtime unaffected.
> Verified by Chau: N/A — non-runtime change.

**Rollback path:** If Phase 2 misfires (false positives), flip
`EXIT_ON_NONCOMPLIANT` back to `false` in a single-line revert PR.
The observer keeps running; we lose the gate, not the observability.

---

## Why this is the smallest safe path

- **No new runtime code.** Five files, all under `scripts/`, `.github/`, or `reports/`.
- **No new dependencies.** Pure Node.js built-ins + `gh` CLI (already on the runner).
- **No CI minute spike.** The observer is a single ~3-second Node script on `pull_request` only. The weekly is one cron job.
- **No push-to-main path.** The weekly proposes a PR; the observer only comments. The classifier flagged an earlier draft of the weekly workflow that pushed directly to main; that was fixed to a PR-based delivery before this PR shipped.
- **Reversible.** Deleting the two `.yml` files in `.github/workflows/` ends the system. Zero state outside the repo.

---

## Open questions for Chau

1. **Cadence of the weekly cron** — Monday 09:00 UTC. Move it if you prefer a different review slot.
2. **Should the observer-PR comments be deletable by Chau without leaving a marker?** Current behavior: any comment edits its own previous version (idempotent), but it doesn't delete itself on green. If you'd rather have green PRs stay silent, that's a one-line change to `check-pr-template.mjs`.
3. **Required-check timing.** Phase 2 promotion is keyed to ≥ 80% compliance. If you want a stricter bar (say, ≥ 95% with verified-by-Chau ≥ 90%), that's a constant edit in `pr-template-weekly-report.mjs` and the dispatch above.

---

## Last updated

2026-05-19 — initial baseline shipped alongside the Phase-1 observer.
