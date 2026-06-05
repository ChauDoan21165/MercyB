# GitHub to GitLab Migration Audit

Date: 2026-05-26

Target GitLab project: `gitlab.com/cd12536/mercyB`

Local remotes observed:

```text
origin     git@gitlab.com:cd12536/mercyB.git
old-origin git@github.com-chau:ChauDoan21165/MercyB.git
```

No push was performed for this audit.

## Executive Summary

The repo already has the GitLab target configured as `origin`. The suspended GitHub remote is retained as `old-origin`, which is useful during migration audit but should not be used for normal fetch/push work.

The highest-risk references are:

1. `.github/workflows/*`: GitHub Actions workflows will not run from GitLab. These need a GitLab CI migration rather than simple string replacement.
2. `scripts/morning-status.mjs` and related tests: call GitHub REST APIs and classify "GitHub" / "Actions" health. These need GitLab project/MR/pipeline API replacements.
3. Vercel docs/workflows: production and preview deployment docs describe Vercel's GitHub integration. Vercel must be reconnected to GitLab, and any webhook/deploy hook assumptions must be checked.
4. Operator clone/runbook references: `https://github.com/ChauDoan21165/MercyB.git` must become `git@gitlab.com:cd12536/mercyB.git` or `https://gitlab.com/cd12536/mercyB.git`.
5. `package-lock.json`: many third-party GitHub sponsor/source links exist. These are dependency metadata and should not be rewritten.

## Replacement Map

| Current reference | Must change? | Replacement | Safe now? |
|---|---:|---|---|
| `https://github.com/ChauDoan21165/MercyB` | Yes | `https://gitlab.com/cd12536/mercyB` | Yes for live docs/runbooks; preserve historical reports |
| `https://github.com/ChauDoan21165/MercyB.git` | Yes | `https://gitlab.com/cd12536/mercyB.git` | Yes |
| `git@github.com-chau:ChauDoan21165/MercyB.git` | Yes | `git@gitlab.com:cd12536/mercyB.git` | Yes after operators agree to retire `old-origin` |
| `.github/workflows/...` | Yes for active CI | `.gitlab-ci.yml` jobs/stages, or `docs/ci/...` for migrated docs | Wait until GitLab CI design is final |
| `actions/checkout`, `actions/setup-node`, `actions/upload-artifact`, `actions/github-script`, `tj-actions/changed-files` | Yes | GitLab runner checkout, `image: node:*`, `artifacts:`, GitLab API scripts, `rules:changes` | Wait until CI migration |
| `${{ github.* }}` | Yes | GitLab CI variables such as `$CI_COMMIT_SHA`, `$CI_COMMIT_REF_NAME`, `$CI_MERGE_REQUEST_IID`, `$CI_PROJECT_PATH`, `$CI_PIPELINE_URL` | Wait until CI migration |
| `$GITHUB_OUTPUT`, `$GITHUB_STEP_SUMMARY`, `GITHUB_TOKEN`, `GH_TOKEN` | Yes | dotenv artifacts/job artifacts, job logs, `$CI_JOB_TOKEN` or project access token | Wait until CI migration |
| `https://api.github.com/repos/ChauDoan21165/MercyB/...` | Yes | `https://gitlab.com/api/v4/projects/cd12536%2FmercyB/...` | Wait until token/scopes are defined |
| GitHub PR links in historical reports | No | Preserve as historical evidence | Safe to leave |
| Third-party GitHub docs/sponsor URLs | No | Preserve upstream links | Safe to leave |
| Vercel GitHub integration URLs/docs | Yes for live deployment docs | Vercel GitLab integration or explicit deploy hook docs | Wait until Vercel project is reconnected |

## Vercel Webhook Implication

The current docs and workflow comments assume Vercel is connected through GitHub. After the GitLab migration:

- Reconnect the Vercel project to `gitlab.com/cd12536/mercyB`.
- Confirm preview deployments trigger from GitLab merge requests.
- Confirm production deployments still follow the intended owner model. If production remains CI-owned, use GitLab CI with Vercel CLI and disable duplicate Vercel production auto-deploys.
- Replace any "Vercel Preview Comments" GitHub check/status expectation with GitLab MR status/comment behavior.
- Rotate any GitHub-only webhook or integration token. Do not reuse `GITHUB_TOKEN` assumptions.

## File Audit

Legend:

- `Change now`: safe content-only replacement.
- `Wait`: needs GitLab CI/Vercel/API design first.
- `Leave`: historical, third-party, or package metadata.

| File | Current GitHub reference | Must change? | Replacement | Timing |
|---|---|---:|---|---|
| `README.md` | `.github/workflows/DEPLOYMENT.md`, `.github/workflows/ROLLBACK.md` | Yes | point to migrated GitLab CI/deploy docs | Wait |
| `SETUP.md` | "GitHub Actions", `.github/workflows/validate-and-update-registry.yml` | Yes | GitLab CI pipeline/job names | Wait |
| `PRINCIPLES.md` | `git clone --depth 1 https://github.com/ChauDoan21165/MercyB.git ...`; A6 specialty mentions GitHub PR state | Yes | `git clone --depth 1 git@gitlab.com:cd12536/mercyB.git ...`; "GitLab MR state" | Change now for clone; role wording after queue moves |
| `.env.example` | GitHub Actions secret references and `.github/workflows/*` comments | Yes | GitLab CI/CD variables and migrated pipeline paths | Wait |
| `package.json` | No direct GitHub reference found | No | None | Leave |
| `package-lock.json` | third-party `github.com/sponsors`, package source metadata, `github-from-package` package | No | None | Leave |
| `vercel.json` | No direct GitHub reference found | No | None | Leave; Vercel project settings still need manual audit |
| `supabase/config.toml` | No direct GitHub reference found | No | None | Leave |
| `STRATEGY.md` | No direct GitHub reference found in tracked current file | No | None | Leave |
| `ROADMAP.md` (deleted; now `layer-model.md`) | No direct GitHub reference found | No | None | Leave |
| `.dependency-cruiser.cjs` | comments referencing `.github/workflows/ci.yml` | Yes | migrated GitLab CI job path/name | Wait |
| `.github/workflows/*.yml` | GitHub Actions syntax, actions, `${{ github.* }}`, `GITHUB_TOKEN`, `$GITHUB_OUTPUT`, `$GITHUB_STEP_SUMMARY` | Yes | `.gitlab-ci.yml` stages/jobs/rules/artifacts/API calls | Wait |
| `.github/workflows/DEPLOYMENT.md` | GitHub Actions and Vercel GitHub integration deployment model | Yes | GitLab CI deployment model and Vercel GitLab integration | Wait |
| `.github/workflows/ROLLBACK.md` | GitHub Actions rollback process, GitHub UI/CLI, GitHub issue automation | Yes | GitLab pipeline rollback, GitLab UI/API issue flow | Wait |
| `docs/CI_DEFERRED.md` | retired workflow references and GitHub Actions examples | Maybe | GitLab CI equivalents if resurrected | Wait |
| `docs/ICON_REGEN.md` | third-party `ionic-team/capacitor-assets` GitHub URL | No | None | Leave |
| `docs/IOS-DSYM-UPLOAD.md` | `.github/workflows/production-deploy.yml` | Yes | migrated GitLab production deploy job | Wait |
| `docs/REACT_PERFORMANCE_OPTIMIZATION.md` | `.github/workflows/performance-ci.yml`, `actions/setup-node` | Yes | GitLab performance job/cache docs | Wait |
| `docs/audio-system.md` | `.github/workflows/` path references | Yes | GitLab CI pipeline docs | Wait |
| `docs/agent-briefs/pr-body-template.md` | GitHub PR links and review examples | No for historical examples | None, or add GitLab MR examples later | Leave |
| `docs/billing/apple-verification-and-ios-wiring.md` | Apple API path includes `/transactions/`; false positive for GitHub not migration-owned | No | None | Leave |
| `docs/placement-v3/a2-automation-runbook.md` | scheduled `.github/workflows/a2-observability-simulation.yml` | Yes | GitLab scheduled pipeline | Wait |
| `docs/placement/v5/V5_BOUNDARY_RULES.md` | `.github/workflows/` boundary mention | Yes | `.gitlab-ci.yml` / CI config boundary | Wait |
| `e2e/README.md` | GitHub Actions example with checkout/setup/upload-artifact | Yes | GitLab CI Playwright example with artifacts | Wait |
| `.claude/skills/supabase/SKILL.md` | Supabase CLI GitHub releases link | No | None | Leave |
| `.claude/skills/supabase/references/skill-feedback.md` | upstream `supabase/agent-skills` GitHub issue link | No | None | Leave |
| `.agents/skills/email-marketing-bible/*` and `.claude/skills/email-marketing-bible/*` | upstream external GitHub links | No | None | Leave |
| `scripts/morning-status.mjs` | `GITHUB_TOKEN`/`GH_TOKEN`, GitHub and Actions health, `https://api.github.com` calls | Yes | GitLab token/project API; pipeline health checks | Wait |
| `scripts/__tests__/morning-status.test.mjs` | GitHub token/API expectations | Yes | GitLab token/API expectations | Wait with script migration |
| `scripts/ops-morning.mjs` and tests | status labels include GitHub/Actions | Yes | GitLab/Pipelines labels | Wait |
| `scripts/full-room-sync-audit.ts` | names local repo JSON source as `github` | Maybe | rename to `repo` or `gitlab` | Safe after consumers checked |
| `scripts/setup-room-management.sh` | "GitHub Actions" and workflow path output | Yes | GitLab CI job/path output | Wait |
| `scripts/validate-room-links.cjs` | `.github/workflows/validate-json.yml` integration comment | Yes | GitLab validation job comment | Wait |
| `scripts/cleanup-root-batched.js` | log says pushed to GitHub in workflow step | Yes | GitLab or remote | Change when workflow migrates |
| `scripts/validate-single-room.js` | GitHub upload/push/auto-register wording | Yes | GitLab push / repository push wording | Change now if docs-only acceptable |
| `scripts/VIP4_VALIDATION.md` | GitHub Actions workflow suggestion | Yes | GitLab CI example | Wait |
| `scripts/audit-v4-safe-shield.ts` | "GitHub repo (local JSON files)" wording | Maybe | "repo/local JSON files" | Change now |
| `scripts/observability/a2-branch-guard.sh` | `GITHUB_HEAD_REF`, `GITHUB_REF_NAME` | Yes | `CI_MERGE_REQUEST_SOURCE_BRANCH_NAME`, `CI_COMMIT_REF_NAME` | Wait |
| `supabase/functions/get-source-file/index.ts` | `.github/workflows/ci.yml`; suggestion says GitHub raw content | Yes | migrated CI path; GitLab raw file or local tools | Wait |
| `supabase/functions/weekly-progress-email/index.ts` | comment: GitHub Actions cron | Yes | GitLab scheduled pipeline | Wait |
| `supabase/functions/streak-reminder-email/index.ts` | comment: GitHub Actions cron | Yes | GitLab scheduled pipeline | Wait |
| `supabase/functions/mfa-backup-codes/index.ts` | comment references GitHub as product example | No | None | Leave |
| `supabase/functions/_shared/apple-api.ts` | Apple API URL contains no GitHub migration reference | No | None | Leave |
| `supabase/migrations/20260608000000_2fa_phase_2.sql` | comment references GitHub as product example | No | None | Leave |
| `src/lib/perf/webVitalsTracking.ts` | upstream GoogleChrome web-vitals GitHub doc URL | No | None | Leave |
| `android/.gitignore`, `android/gradlew` | generic Gradle/GitHub generated references | No | None | Leave |

## Historical Reports and Evidence

The `reports/**`, `reports/archive/**`, and `reports/placement-v3-readiness-evidence/**` matches are mostly historical PR URLs, GitHub check payloads, and old workflow diagnostics. These should be preserved unless the specific document is promoted into a live runbook.

Examples include:

- `reports/REVIEW-pr-*.md`
- `reports/placement-v3-readiness-evidence/*.json`
- `reports/archive/*`
- `reports/BOOT-SEQUENCE-2026-05-20.md`
- `reports/RECON-migration-drift.md`

Disposition: `Leave` for history. If copied into current ops docs, replace GitHub PR URLs with GitLab MR URLs only when the corresponding migrated MR exists.

## Active Workflow Files Requiring CI Migration

All active files under `.github/workflows/` should be treated as GitHub Actions-specific and not mechanically moved line-for-line:

```text
.github/workflows/a2-observability-simulation.yml
.github/workflows/audio-bytes-weekly.yml
.github/workflows/audio-manifest.yml
.github/workflows/auto-fix-json.yml
.github/workflows/check-edge-function-drift.yml
.github/workflows/ci.yml
.github/workflows/cleanup-root.yml
.github/workflows/deploy-edge-functions.yml
.github/workflows/ensure-lockfile.yml
.github/workflows/lighthouse-mobile-pr.yml
.github/workflows/move-root-json-mp3-to-del.yml
.github/workflows/mutation-testing.yml
.github/workflows/performance-ci.yml
.github/workflows/playwright.yml
.github/workflows/preview-deployment.yml
.github/workflows/production-deploy.yml
.github/workflows/roommaster.yml
.github/workflows/sentry-auto-fix.yml
.github/workflows/streak-reminder-email.yml
.github/workflows/supabase-db-staging-prod.yml
.github/workflows/supabase-migrations.yml
.github/workflows/sync-data.yml
.github/workflows/sync-lessons.yml
.github/workflows/system-health.yml
.github/workflows/test.yml
.github/workflows/validate-and-update-registry.yml
.github/workflows/validate-data.yml
.github/workflows/validate-edge-functions.yml
.github/workflows/validate-json.yml
.github/workflows/validate-single-room.yml
.github/workflows/validate.yml
.github/workflows/vitest.yml
.github/workflows/weekly-progress-email.yml
```

Recommended GitLab CI first pass:

1. Create `.gitlab-ci.yml` with stages `validate`, `test`, `build`, `deploy`, `scheduled`.
2. Port non-deploying checks first: lockfile, JSON validation, RoomMaster, Vitest, Test Suite, Performance, Playwright.
3. Port Supabase Edge validation/deploy jobs after GitLab variables are configured.
4. Port Vercel production deployment last, after Vercel is connected to GitLab and duplicate deploy behavior is confirmed.

## GitLab Remote Commands

Current local state already points `origin` to GitLab:

```sh
git remote -v
```

Expected final state:

```text
origin git@gitlab.com:cd12536/mercyB.git
```

If operators want to remove the suspended GitHub remote after migration:

```sh
git remote remove old-origin
```

Do this only after the GitLab project is confirmed as the source of truth and all agents have stopped relying on `old-origin`.

## Safe Immediate Changes

Safe now:

- Update live clone instructions from `https://github.com/ChauDoan21165/MercyB.git` to `git@gitlab.com:cd12536/mercyB.git`.
- Update "GitHub PR" operator wording to "GitLab MR" in live runbooks, not historical reports.
- Rename local content-audit labels from `github` to `repo` if no serialized outputs depend on that exact key.

Wait:

- Any `.github/workflows` replacement.
- Any GitHub REST API replacement.
- Any Vercel deployment comment/check/status replacement.
- Any `GITHUB_TOKEN`/`GH_TOKEN` replacement.

Leave:

- Third-party GitHub links in dependency metadata, upstream documentation, and package sponsorship.
- Historical PR/report evidence.
