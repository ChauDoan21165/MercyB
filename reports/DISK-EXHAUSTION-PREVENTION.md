# Disk Exhaustion Prevention

## Node Modules Policy

- Keep `node_modules` out of durable archives.
- It is safe to remove `node_modules` only when `package.json` and a lockfile exist and reinstall is acceptable.
- Temp worktree `node_modules` are disposable after verification.
- Main repo `node_modules` should be removed only when local development can pause for reinstall.
- After cleanup, restore with `npm ci`.

## Worktree Policy

- Use `/private/tmp/<agent-or-task>-<purpose>` for temporary worktrees.
- Keep durable reports under repo `reports/`, not inside temp-only scratch paths.
- Remove clean temp worktrees after PR merge, branch parking, or task cancellation.
- Never remove dirty worktrees automatically.
- Run `git worktree prune` after registered worktree removals.

## Cache Policy

Disposable by default:

- npm cache.
- pnpm store cache.
- Playwright browser cache.
- Xcode DerivedData.

Not disposable by default:

- Xcode archives.
- Simulator runtimes/devices.
- Browser profile data.
- Unknown application support files.

## Giant-File Policy

Files over `500M` require owner classification before deletion.

Classify each as:

- Reinstallable cache.
- Generated artifact.
- Simulator or Xcode asset.
- Browser-managed asset.
- Evidence/report artifact.
- Unknown.

Delete only the first two categories automatically. Everything else needs explicit review.

## Report Retention Policy

- Keep reports and docs unless superseded and explicitly archived.
- Move stale-but-useful reports to `reports/archive/`, not `/tmp`.
- Never delete customer-impact evidence as part of disk cleanup.
- Store cleanup logs under `reports/disk-cleanup-evidence/` when they support an operational decision.

## Backup Recommendations

- Push branches before deleting worktrees.
- Keep important local-only work in commits, stashes with clear names, or durable reports.
- For risky cleanup, create a branch named `recovery/<date>-<purpose>` before editing.
- Keep external backups for keystores, signing assets, and env templates.

## Pre-Merge Cleanup Recommendations

Before merging or closing a task branch:

1. Move evidence into `reports/` or the relevant doc path.
2. Remove generated coverage/build output that is not meant to ship.
3. Confirm `git status --short` is clean or intentionally dirty.
4. Confirm any worktree can be recreated from remote refs.
5. Run `scripts/ops/disk-audit.sh` after large test or build jobs.
