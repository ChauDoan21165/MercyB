# Module Boundaries — Promotion to Required-Check Ruleset (A13-promote)

**Author:** A13
**Status:** PR open as DRAFT — flips to ready-for-review only after the A13 cascade lands on `main` AND a live depcruise run on `main` shows 0 errors + 0 warnings.

This doc is the **promotion package** — it does NOT auto-promote the gate. The actual branch-protection edit is Chau's action (via `gh api` or GitHub UI). This file documents the exact commands, the pre-flight verification, the rollback path, and adds a defensive verifier script that catches future ruleset drift.

---

## What this PR adds

1. `PRINCIPLES.md` §3 — one bullet noting Module Boundaries is now a required CI gate (the architectural contract that justifies the ruleset edit Chau will run).
2. `scripts/check-required-checks.mjs` — a Chau-run defensive verifier that reads the live ruleset via `gh api` and asserts the 4 expected checks are present. Catches ruleset drift (accidental UI edits, name typos, ruleset disablement).
3. `reports/MODULE-BOUNDARIES-PROMOTION-A13.md` — this doc.

**No code changed. No CI workflow modified. No behavior change in the repo.** The PR self-passes all 4 required gates including the very gate it documents promoting.

---

## Pre-flight verification (REQUIRED before flipping ready-for-review)

These conditions MUST be true before this PR is marked ready-for-review and BEFORE Chau runs the ruleset edit:

### 1. All 7 prior A13 PRs landed on `main`

The expected cascade:

| PR | Purpose | Required on main |
|---|---|---|
| **#887** | Base — Module Boundaries CI job + `.dependency-cruiser.cjs` config | ✓ |
| **#898** | Cleanup 1 — use-toast type-only narrowing | ✓ |
| **#899** | Cleanup 2 — delete orphan `useTeacherMercy` hook | ✓ |
| **#919** | FP — `viaNot` filter for 7 type-only false positives + `tsPreCompilationDeps: 'specify'` mode | ✓ |
| **#912** | True cycle #1 — stripe-webhook `env` extraction | ✓ |
| **#921** | True cycle #8 — `parseLanguagePair` leaf extraction | ✓ |

Verify with:

```bash
for pr in 887 898 899 919 912 921; do
  state=$(gh pr view "$pr" --json state --jq .state)
  echo "#$pr: $state"
done
```

All 6 should report `MERGED`. (The earlier A13 inventory listed 7 PRs including a Track B placeholder; the live count after deduplication is 6 substantive PRs + this Track A promotion PR.)

### 2. Live depcruise on `main` shows 0 errors + 0 warnings

This is the "the gate is meaningful to promote" precondition.

```bash
git checkout main && git pull
npm ci --legacy-peer-deps
npm run depcruise:validate
```

Expected output:

```
✔ no dependency violations found (1639 modules, 3174 dependencies cruised)
```

If anything other than 0/0 prints, **STOP** — promoting a required check that flags warnings would block legitimate PRs. Resolve the new warning first (refactor, narrow the rule with documented justification, or revert the regression), then re-verify.

### 3. CI history clean for 1+ days

Per A13's original brief: *"Module Boundaries has been green for a full day"* on every PR merged since #887 landed. Spot-check:

```bash
gh run list --workflow=ci.yml --limit 50 --json conclusion,name,createdAt \
  | jq '[.[] | select(.name == "Module Boundaries")] | .[0:10]'
```

Expect zero `failure` conclusions in the last 10+ runs of the Module Boundaries job. A single transient failure (e.g., an esm.sh CDN 522 in `npm ci`) is acceptable if the re-run was green; sustained failure is not.

---

## The promotion command (Chau's action — NOT this PR)

The PR doesn't auto-promote the ruleset. Chau runs this after pre-flight passes:

```bash
# 1. Read the current ruleset state (backup before edit)
gh api repos/ChauDoan21165/MercyB/rulesets/16546337 > /tmp/ruleset-16546337-pre-A13-promote.json

# 2. Inspect what's currently required
gh api repos/ChauDoan21165/MercyB/rulesets/16546337 \
  --jq '.rules[] | select(.type=="required_status_checks") | .parameters.required_status_checks[].context'

# Expect (pre-promotion):
#   "Build and Test"
#   "Lint Code"
#   "Validate Rooms"

# 3. Add "Module Boundaries" to the required-checks list.
#    Easiest: GitHub UI → repo Settings → Rules → ruleset 16546337 →
#    Require status checks → search "Module Boundaries" → add.
#
#    Programmatic alternative (PATCH the whole ruleset):
#    Edit the backup JSON from step 1 to add the new entry under
#    .rules[] -> required_status_checks. The exact JSON shape:
#
#        {
#          "context": "Module Boundaries",
#          "integration_id": null
#        }
#
#    Then PATCH it back:
#
#    gh api -X PATCH repos/ChauDoan21165/MercyB/rulesets/16546337 \
#      --input /tmp/ruleset-16546337-post-A13-promote.json

# 4. Verify it took effect
node scripts/check-required-checks.mjs
```

Expected output of `node scripts/check-required-checks.mjs`:

```
✅ ruleset 16546337 (<ruleset name>) enforces all 4 required checks:
     - Build and Test
     - Lint Code
     - Validate Rooms
     - Module Boundaries
```

---

## Rollback path

If a regression hits `main` AFTER promotion and you need to take Module Boundaries off the required list while fixing it:

```bash
# Easiest: GitHub UI → Settings → Rules → ruleset 16546337 →
# Require status checks → click the trash icon next to "Module Boundaries".

# Programmatic: restore from backup
gh api -X PATCH repos/ChauDoan21165/MercyB/rulesets/16546337 \
  --input /tmp/ruleset-16546337-pre-A13-promote.json
```

Rolling back is non-destructive — it doesn't touch existing PRs, doesn't revert any merged commits, just changes which checks block future merges. Re-promote when the underlying issue is fixed.

---

## Defensive verifier — `scripts/check-required-checks.mjs`

The script reads ruleset 16546337's live state via `gh api` and asserts:

- All 4 expected checks (`Build and Test`, `Lint Code`, `Validate Rooms`, `Module Boundaries`) are in the required list
- No unexpected checks have been added (drift the other direction)

Exit codes:

| Exit | Meaning |
|---|---|
| 0 | All 4 expected checks present, no unexpected ones — ruleset healthy |
| 1 | One or more expected checks missing OR unexpected checks present |
| 2 | `gh` CLI not authenticated |
| 3 | Ruleset 16546337 not found (deleted? wrong repo?) |

Run quarterly or whenever branch-protection state feels off:

```bash
node scripts/check-required-checks.mjs
```

The script is read-only — it never edits the ruleset. If it reports drift, fix via the promotion-command flow above.

---

## Why this PR is doc-only, not config-as-code

Some projects keep branch-protection state in a config file (e.g., Terraform, branch-protection-ruleset YAML). MercyBlade doesn't — the ruleset lives in GitHub's UI/API. That's fine for a project this size, BUT it means:

- No way to git-revert a bad ruleset edit
- No PR review for ruleset changes
- The ruleset can silently drift if someone with admin clicks the wrong thing

This PR mitigates that via:
- `PRINCIPLES.md` §3 — documents the contract so future agents/contributors know the 4 required checks are load-bearing
- `scripts/check-required-checks.mjs` — gives Chau a one-command drift check
- This report — preserves the exact `gh api` commands for re-application if the ruleset ever resets

A future hardening pass could move ruleset state to IaC (Terraform, Pulumi, or GitHub's own ruleset-as-code beta). That's out of scope here; the goal of A13-promote is to flip the existing gate from "shadow" to "required" with operational hygiene intact.

---

## Sibling tracks

- **A13's Track B** (the cycles) — the 6 cascade PRs above. This Track A is the architectural counterpart, making the gate enforceable rather than just observable.
- **A16's process discipline track** (#890, #896, #905 per Chau's brief) — also about making things enforceable rather than aspirational. Compose well: A13 hardens the architectural gate; A16 hardens the process gate.

---

## When this PR flips to ready-for-review

After both pre-flight checks pass (cascade landed + depcruise on main = 0/0), I (A13) will:

1. Re-run `npm run depcruise:validate` on a fresh `main` checkout
2. Paste the verbatim output (showing 0 errors + 0 warnings) as a PR comment
3. Flip the PR from DRAFT to ready-for-review
4. Tag Chau

Until then, this PR stays draft and the ruleset edit stays pending Chau's go-signal.

---

## References

- A13 base / inventory: PR **#887**
- A13 Track B (cycle resolutions): PRs #898, #899, #919, #912, #921
- A13 Track A (this PR): #TBD-on-creation
- Memory: `project_ci_workflow_consolidation` — the 3 existing required-check job names are LOCKED (don't rename); this PR adds a 4th
- `.github/workflows/ci.yml` — the "Module Boundaries" job definition (added in #887)
- `.dependency-cruiser.cjs` — the rule config (added in #887, narrowed in #898 and #919)
