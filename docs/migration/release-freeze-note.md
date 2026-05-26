# Release Freeze Note

Last updated: 2026-05-26

## Status

GitHub is suspended. Work is local-only while the GitLab migration is in
progress. Do not use GitHub push, GitHub PRs, GitHub Actions, or `gh` CLI
as the current release source of truth until hosting is restored or the
GitLab remote becomes authoritative.

## Vercel deploy dependency

Vercel production deploys are frozen on the GitHub webhook path. Because
GitHub is suspended, the webhook cannot deliver new main-branch changes to
Vercel for normal auto-deploy.

## Production serving state

Production is still serving the last successful pre-suspension deploy. New
local commits or GitLab-migration work are not production until the deploy
path is restored and a new production deployment is confirmed.

## Release gate

The release gate cannot turn green while the deploy path is frozen. Even if
local checks pass, release readiness still lacks a confirmed production
deployment from the current authoritative branch.

The gate also remains blocked until Chau confirms the Android Studio checks:

- clean sync/build
- merged manifest inspection
- launcher smoke
- deep-link/OAuth smoke
- release AAB verification
- Play Console acceptance

## Build numbers

No build bump is required during this freeze. Do not change Android
`versionCode` or iOS build number unless Chau is ready to archive/upload or
Play Console rejects the existing Android `versionCode`.

## Migration dependency

Release unfreeze depends on completing the GitLab migration or restoring the
GitHub webhook path, then confirming a production deploy from the current
authoritative branch.
