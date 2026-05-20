# Workstation Maintenance Schedule

## Frequency

- Daily during multi-agent bursts: run `scripts/ops/disk-audit.sh`.
- Weekly: run `scripts/ops/safe-cleanup.sh --dry-run` and review the output.
- Biweekly or after major merge waves: execute reviewed cleanup with `scripts/ops/safe-cleanup.sh --execute`.
- Before running more than five agents: confirm `/System/Volumes/Data` has at least `20Gi` free.
- Before Xcode or simulator-heavy work: confirm at least `30Gi` free.

## Safe Cron Usage

Cron or launchd may run audit-only jobs automatically. Cleanup jobs should default to dry-run and write logs for manual review.

Recommended cron for audit only:

```cron
0 9 * * * cd /private/tmp/mercyb-disk-cleanup-audit && scripts/ops/disk-audit.sh >> ~/mercyb-disk-audit.log 2>&1
```

Optional weekly dry-run cleanup:

```cron
0 10 * * 1 cd /private/tmp/mercyb-disk-cleanup-audit && scripts/ops/safe-cleanup.sh --dry-run >> ~/mercyb-safe-cleanup-dry-run.log 2>&1
```

Do not schedule `--execute` cleanup without a manual review checkpoint.

## What Should Never Be Auto-Deleted

- Branches.
- Dirty worktrees.
- Reports, docs, SQL evidence, screenshots, or customer artifacts.
- `.env*`, keys, certificates, keystores, and local config.
- Xcode archives.
- Simulator devices or runtimes.
- Main repo source files.
- Unknown large files.

## Manual Review Checkpoints

Review before execute-mode cleanup:

- Disk audit log under `reports/disk-cleanup-evidence/`.
- `git worktree list`.
- Any worktree marked dirty by `git status --short`.
- Any stale worktree with no remote branch containing HEAD.
- Large files over `500M`.
- Current PR queue and active agent assignments.

## Warning Signs Of Repo Corruption

- `git status` fails with object or index errors.
- `git fsck --full` reports missing or corrupt objects.
- `git worktree list` shows paths that exist but cannot run git commands.
- Rebase metadata remains after a completed rebase.
- `git worktree remove` refuses a clean worktree because the admin files are inconsistent.
- Commands report no space while git is writing packfiles, index files, or rebase state.

Response: stop cleanup, capture command output, run `git fsck --full`, and avoid manual `.git` edits until the repo is backed up.
