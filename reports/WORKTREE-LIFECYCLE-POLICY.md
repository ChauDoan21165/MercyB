# Worktree Lifecycle Policy

## Purpose

MercyB uses many temporary git worktrees for parallel review, repair, and documentation work. The policy is to keep source history and evidence durable while making local worktrees disposable once their branch state is recoverable from git remotes.

## When To Create Worktrees

Create a worktree when work needs isolation from the main checkout:

- Parallel implementation or review on a different branch.
- PR verification that needs a detached or checked-out PR ref.
- Evidence gathering that may generate local logs, screenshots, coverage, or temporary build output.
- Long-running agent work where branch switching in the main checkout would disturb dirty files.

Do not create a new worktree for quick read-only inspection that can be done in the current checkout without changing files.

## Naming Conventions

Use predictable names under `/private/tmp` unless a durable location is explicitly needed:

- Feature work: `/private/tmp/aNN-short-purpose`
- PR verification: `/private/tmp/pr-NNN-short-purpose`
- Reports-only work: `/private/tmp/reports-short-purpose`
- Read-only review: `/private/tmp/review-NNN-agent`
- Recovery work: `/private/tmp/recovery-YYYYMMDD-purpose`

The branch should identify ownership and purpose, for example:

- `feat/a33-placement-benchmarking`
- `fix/a16-http-status-admin-management`
- `docs/workstation-maintenance`
- `reports/disk-cleanup-audit`

Avoid anonymous names such as `tmp`, `test`, `new`, or `agent`.

## Concurrent Worktree Limit

Recommended local ceiling:

- Normal development: 8 to 12 active worktrees.
- Heavy multi-agent sessions: 20 active worktrees with a cleanup review at the end of the session.
- Emergency ceiling: 30 active worktrees. Above this, pause new work and run `scripts/ops/disk-audit.sh`.

The May 20 audit found far more than this. That is allowed only as a temporary recovery state while PR disposition is being checked.

## Stale Worktree Rules

A worktree is stale when all are true:

- It lives in `/private/tmp` or `/tmp`.
- It has had no useful activity for at least 14 days.
- `git status --short` is empty.
- Its HEAD is contained in `origin/main` or a remote branch/PR ref.
- It contains no unique evidence files that need to be moved into `reports/`.

A stale worktree is not safe to remove when any are true:

- It is dirty.
- It has untracked files.
- The branch is not pushed.
- The branch/PR disposition is unknown.
- It contains reports, screenshots, SQL, logs, or customer evidence not copied into a durable report path.

## Removal Policy

Before removing a worktree:

1. Run `git -C <path> status --short`.
2. Run `git -C <path> branch --show-current`.
3. Run `git -C <path> log -1 --oneline`.
4. Confirm `git -C <path> branch -r --contains HEAD` or `git -C <path> merge-base --is-ancestor HEAD origin/main`.
5. Measure `du -sh <path>`.
6. Remove only with `git worktree remove <path>`.
7. Run `git worktree prune` after a removal batch.

Do not use `rm -rf <worktree>` for registered worktrees.

## Archive Rules

Durable evidence belongs in the repo under `reports/`, `docs/`, or another reviewed path. Temporary evidence under `/tmp` must be copied or summarized into a report before deleting the worktree.

Archive, rather than delete, when:

- The worktree contains customer-impact evidence.
- The worktree contains SQL or migration investigation notes.
- The PR branch is abandoned but the diagnostic is still referenced by planning docs.
- The worktree has local files that are too risky to classify quickly.

Archive target: `reports/archive/` for durable docs. Do not archive `node_modules`, caches, build output, or browser downloads.

## Cleanup Cadence

- Daily during active multi-agent sessions: run `scripts/ops/disk-audit.sh`.
- Weekly: review stale clean worktrees and run `scripts/ops/safe-cleanup.sh --dry-run`.
- After major merge batches: remove clean temp worktrees whose branch/PR has landed or is parked on remote.
- Before starting more than five new agents: confirm `/System/Volumes/Data` has at least `20Gi` free.

## Dirty Worktree Protection

Dirty worktrees are protected by default. A dirty worktree can only be cleaned after a human decision to commit, stash, archive, or discard specific files.

Never auto-delete:

- Dirty worktrees.
- Branches.
- `.env*`, keys, credentials, or local config.
- `reports/`, `docs/`, evidence folders, or customer artifacts.
- Xcode archives.
- Simulator devices unless explicitly approved.
