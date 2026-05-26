# Local Work Status

GitHub is suspended. Work is local-only until the GitLab migration is complete
and an owner explicitly approves commit/push.

Last updated: 2026-05-26

## Rules

- Do not rely on GitHub PR state while the account is suspended.
- Do not push.
- Do not use `gh`.
- Do not touch Kids work from this migration tracker.
- Keep source patches isolated until an owner decides whether to commit them.

## Completed Local Artifacts

| Artifact | Status | Purpose | Checks / evidence | Ready to commit later |
|---|---|---|---|---|
| `docs/migration/github-to-gitlab.md` | Complete local audit | GitHub-to-GitLab reference inventory, replacement map, Vercel implication, remote URL | File exists; 212 lines; local-only audit | Yes |
| `.gitlab-ci.yml` | Draft complete | First-pass GitLab CI conversion from active GitHub Actions gates | File exists; 303 lines; deploy jobs are manual/guarded by variables | Yes, after owner reviews secret mapping |
| `docs/migration/pr-archive/` | Partial archive scaffold complete | Local PR recovery notes for critical migrated PRs | Contains `README.md`, `pr-1169.md`, `pr-1197.md`, `pr-1200.md`, `pr-1206.md`, `pr-1208.md` | Yes as partial archive |
| `docs/migration/local-work-status.md` | Updated | Tracker for local-only migration outputs and pending owner calls | This file | Yes |
| `docs/migration/local-patches/sentry-chunk-reload.md` | Complete local note | Documents the local Sentry/chunk reload patch | File exists; 38 lines | Yes |
| `docs/axis-2/spike-results.md` | Complete local spike result | Bar #2 Option B F0 spike findings and redesign recommendation | File exists; 75 lines; concludes Option B as designed is not viable | Yes |
| `docs/axis-2/bar2-option-b-redesign.md` | Complete local redesign memo | Captures the revised Bar #2 Option B path after the F0 spike result | File exists locally | Yes, after owner review |
| `docs/axis-2/bar2-owner-decision.md` | Complete local owner-decision note | Records owner decision/tick criteria for Bar #2 if accepted | File exists locally | Yes, if A2/owner confirms final |
| `scripts/spikes/analyze_tone_f0.py` | Complete local spike tool | Offline fixture F0 contour analysis for Bar #2 | File exists; 415 lines; spike script only | Yes, if owner wants to preserve spike tooling |
| `STRATEGY.md` | Updated local strategy audit | Reflects Axis 2 code ticks, Bar #2 open state, Stage 3A design/adapters status, GitHub suspension/GitLab migration, and §15 snapshot | Local modification present; owner-provided audit says Axis 2 is 3/5 ticked, §15 is nine ticked/four open | Yes |
| `src/main.tsx` local Sentry patch | Local source patch present | Passes chunk-load failure text into global fatal handling when `window.error` lacks usable `error` | Local diff only; no checks recorded in this tracker | Owner decision before commit |
| `docs/migration/gitlab-ci-secrets-checklist.md` | Complete local checklist | Lists GitLab CI/CD variables/secrets that must be configured before enabling CI/deploy parity | File exists locally | Yes, after owner review |
| `docs/migration/release-freeze-note.md` | Complete local freeze note | Documents release/merge freeze assumptions during GitHub suspension and migration | File exists locally | Yes |

## Latest STRATEGY Audit Result

- Axis 2 is 3/5 ticked in code.
- Bar #2 remains open and needs redesign/tick criteria before closure.
- Stage 3A has design plus three adapter PRs merged; screen implementation is not landed.
- GitHub is suspended and GitLab migration is in progress.
- §15 snapshot is nine ticked and four open.
- `STRATEGY.md` is a ready-to-commit local artifact.

## Ready To Commit Later

Ready without further code validation:

- `docs/migration/github-to-gitlab.md`
- `docs/migration/local-work-status.md`
- `docs/migration/local-patches/sentry-chunk-reload.md`
- `docs/migration/pr-archive/`
- `docs/axis-2/spike-results.md`
- `docs/axis-2/bar2-option-b-redesign.md` after owner review
- `docs/axis-2/bar2-owner-decision.md` if A2/owner confirms final
- `STRATEGY.md`
- `scripts/spikes/analyze_tone_f0.py` if spike tooling should be retained
- `docs/migration/gitlab-ci-secrets-checklist.md` after owner review
- `docs/migration/release-freeze-note.md`

Ready after owner review:

- `.gitlab-ci.yml` after GitLab CI/CD secret names, protected-variable policy, runner availability, and deploy strategy are confirmed.
- `src/main.tsx` Sentry chunk patch after owner approval and focused test/build pass.

## Owner Decisions Required

| Decision | Needed from owner | Current local recommendation |
|---|---|---|
| Bar #2 redesign / tick criteria | Decide whether Bar #2 Option B is redesigned, narrowed to fixture/listen-compare, or replaced | Do not tick Bar #2 from the current spike; `docs/axis-2/spike-results.md` says Option B as designed is not viable |
| GitLab CI secrets | Confirm GitLab CI/CD variables and protection/masking rules for Supabase, Vercel, Sentry, Codecov, Azure, and any deploy credentials | Keep `.gitlab-ci.yml` draft local until secrets and protected branch behavior are agreed |
| Vercel GitLab reconnect | Decide Vercel project ownership model after GitLab migration: GitLab integration previews, CI-owned production deploy, duplicate deploy prevention | Reconnect Vercel to `gitlab.com/cd12536/mercyB` before enabling production deploy jobs |
| PR archive manual recovery | Decide whether partial local PR archive is enough or whether someone should manually recover GitHub PR text/check evidence from browser/cache/team notes | Treat `docs/migration/pr-archive/` as partial; do not claim complete PR history |
| Sentry chunk patch | Decide whether to keep the `src/main.tsx` patch in the migration commit set or split into a focused fix commit | Split if possible; source behavior change should not be buried in migration docs |

## Remaining Local Work

| Item | Status | Blocker / next step |
|---|---|---|
| Bar #2 redesign memo | Local memo present | Owner must approve revised Bar #2 design and tick criteria after the F0 spike failed the current Option B viability bar |
| Bar #2 owner decision | Local decision note present | A2/owner must confirm whether the decision note is final before commit |
| Sentry chunk reload patch note | Complete note, source patch pending decision | Owner must decide whether `src/main.tsx` patch is committed as focused fix or held |
| GitLab CI review | Draft complete | Needs GitLab CI secrets, protected-variable policy, runner availability, and deploy model review |
| GitLab CI secrets checklist | Local checklist present | Owner must confirm values/scopes before enabling CI/deploy parity |
| Migration runbook | Complete local audit | Needs owner review before applying replacements beyond docs |
| PR archive placeholders | Partial scaffold complete | Needs manual recovery decision for missing GitHub PR text/check evidence |
| Release freeze note | Local note present | Owner must confirm freeze policy remains active during migration |

## Current Local Workspace Notes

- GitLab target is `git@gitlab.com:cd12536/mercyB.git`.
- Existing suspended GitHub remote may remain as `old-origin` until owners retire it.
- Untracked audio fixtures under `public/audio/tones/` are input data for the local Bar #2 spike and are not listed as ready to commit from this tracker.
- Existing unrelated local modifications outside this tracker should remain untouched unless separately assigned.
