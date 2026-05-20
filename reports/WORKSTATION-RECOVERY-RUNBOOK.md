# Workstation Recovery Runbook

## If Disk Hits 0 Bytes

1. Stop creating agents, builds, installs, browser sessions, and test runs.
2. Close dev servers and simulators that may be writing logs.
3. Capture the current state if commands still work:

```bash
df -h
git worktree list
git status --short
```

4. Free only obviously disposable cache space first:

```bash
rm -rf "$HOME/Library/Caches/ms-playwright"
npm cache clean --force
pnpm store prune
```

5. If commands fail because there is no space, remove a measured cache directory, not source:

```bash
du -sh "$HOME/Library/Caches/ms-playwright" 2>/dev/null
rm -rf "$HOME/Library/Caches/ms-playwright"
```

6. Once at least `2Gi` is available, run:

```bash
scripts/ops/disk-audit.sh
scripts/ops/safe-cleanup.sh --dry-run
```

## Recover Worktrees

List registered worktrees:

```bash
git worktree list
```

Inspect a worktree before acting:

```bash
git -C <path> status --short
git -C <path> branch --show-current
git -C <path> log -1 --oneline
git -C <path> branch -r --contains HEAD
```

If a registered worktree path is missing:

```bash
git worktree prune --dry-run
git worktree prune
```

If a branch exists but the worktree was removed:

```bash
git worktree add /private/tmp/<new-name> <branch>
```

If the worktree was detached at a PR ref:

```bash
git fetch origin pull/<number>/head:refs/remotes/origin/pr/<number>
git worktree add --detach /private/tmp/pr-<number> origin/pr/<number>
```

## Restore Node Modules

Main repo:

```bash
npm ci
```

If `npm ci` fails because the lockfile is intentionally out of sync, stop and inspect the branch. Do not regenerate lockfiles as part of disk recovery unless the active task requires it.

Temp worktrees:

```bash
cd <worktree>
npm ci
```

## Verify Repo Integrity

Run:

```bash
git status --short
git fsck --full
git log -1 --oneline
git remote -v
```

A dirty status is not corruption. It means files need classification before cleanup.

## Verify Worktree Integrity

Run:

```bash
git worktree list --porcelain
git worktree repair
git worktree prune --dry-run
```

Use `git worktree prune` only after confirming missing paths are actually gone and not mounted elsewhere.

## Recover Interrupted Rebases

Inspect state:

```bash
git status
git rebase --show-current-patch
```

Options:

- Continue after resolving conflicts: `git rebase --continue`
- Stop and restore pre-rebase branch state: `git rebase --abort`
- Skip one problematic commit only after confirming it is safe: `git rebase --skip`

Do not delete `.git/rebase-merge` or `.git/rebase-apply` manually unless git itself cannot recover and the branch has been backed up.

Before risky recovery, create a safety branch:

```bash
git branch recovery/<date>-<purpose>
```

## Identify Safe Deletions

Safe deletion candidates:

- `node_modules` where `package.json` and a lockfile exist.
- `~/Library/Caches/ms-playwright`.
- npm and pnpm caches.
- `~/Library/Developer/Xcode/DerivedData/*`.
- Clean temp worktrees whose HEAD exists on `origin/main` or a remote branch/PR ref.

Not safe without explicit approval:

- Dirty worktrees.
- Branches.
- Reports and docs.
- SQL evidence.
- `.env*`, keys, certs, keystores, and local config.
- Xcode archives.
- Simulator devices and runtimes.
- Large files whose owner/purpose is unknown.
