# Local Commit Bundle Manifest

Date: 2026-05-26

GitHub is suspended. This manifest groups local-only work into suggested future
commits once the owner approves commit/push sequencing. No push was performed.

## Suggested Future Commits

| Order | Suggested commit | Files | Purpose | Checks needed before commit | Owner decision needed |
|---:|---|---|---|---|---|
| 1 | Axis 2 Bar #2 spike/redesign docs | `docs/axis-2/spike-results.md`; `docs/axis-2/bar2-option-b-redesign.md`; `docs/axis-2/bar2-owner-decision.md` if final; `scripts/spikes/analyze_tone_f0.py`; optional `public/audio/tones/*.mp3` fixtures | Preserve the local F0 spike result, redesign memo, and owner decision/tick criteria for Bar #2 | `git diff --check`; run the spike script if fixtures are retained; confirm no production code touched; owner read-through of redesign/decision docs | Yes: confirm redesign/tick criteria, whether `bar2-owner-decision.md` is final, and whether audio fixtures belong in repo |
| 2 | Sentry chunk reload patch | `src/main.tsx`; `docs/migration/local-patches/sentry-chunk-reload.md` | Keep chunk-load failure text available to fatal handling when `window.error` does not expose a useful `error` object | `git diff --check`; focused build/typecheck; Sentry/chunk reload smoke if available | Yes: decide whether to commit as focused source fix or hold/split later |
| 3 | GitHub to GitLab migration docs and CI draft | `docs/migration/github-to-gitlab.md`; `docs/migration/local-work-status.md`; `docs/migration/local-commit-bundle.md`; `docs/migration/gitlab-ci-secrets-checklist.md`; `docs/migration/release-freeze-note.md`; `.gitlab-ci.yml` | Document GitHub reference audit, GitLab replacement map, Vercel implication, local work tracker, release freeze state, secrets checklist, and draft GitLab CI conversion | `git diff --check`; YAML lint for `.gitlab-ci.yml`; owner review of secret names/protected variables/deploy jobs; owner confirmation of release freeze note | Yes: GitLab CI secrets, runner, deploy model, Vercel reconnect, and release freeze decisions |
| 4 | PR archive placeholders | `docs/migration/pr-archive/README.md`; `docs/migration/pr-archive/pr-1169.md`; `docs/migration/pr-archive/pr-1197.md`; `docs/migration/pr-archive/pr-1200.md`; `docs/migration/pr-archive/pr-1206.md`; `docs/migration/pr-archive/pr-1208.md` | Preserve local placeholders for critical PR context while GitHub access is unavailable | `git diff --check`; manual review that placeholders do not claim complete recovered PR text | Yes: decide whether partial placeholders are acceptable or manual recovery is required |
| 5 | STRATEGY truth refresh | `STRATEGY.md` | Reflect current truth: Axis 2 is 3/5 ticked in code, Bar #2 open, Stage 3A design plus three adapters merged with no screen implementation, GitHub suspended/GitLab migration in progress, §15 is nine ticked/four open | `git diff --check`; owner read-through for strategy wording | No, if the provided audit facts remain accepted |

## Blockers Before Any Commit

- GitLab migration push/commit sequencing is not yet approved.
- GitLab CI draft needs secrets, protected variable policy, runner availability, and deploy ownership confirmed.
- `docs/migration/gitlab-ci-secrets-checklist.md` needs owner confirmation before secrets are configured.
- Vercel must be reconnected to GitLab before deploy assumptions are treated as final.
- Bar #2 redesign/tick criteria are not decided.
- `docs/axis-2/bar2-owner-decision.md` must be confirmed final by A2/owner before it is treated as authoritative.
- PR archive recovery is partial while GitHub access is unavailable.
- `docs/migration/release-freeze-note.md` needs owner confirmation if freeze policy changes.
- The Sentry chunk reload source patch should not be buried in a docs-only migration commit.

## Current Local Notes

- Do not push while GitHub suspension/migration ownership is unresolved.
- Do not use `gh`.
- Do not touch Kids.
- Keep `public/audio/tones/*.mp3` out of the ready list unless the owner explicitly wants spike fixtures committed.
