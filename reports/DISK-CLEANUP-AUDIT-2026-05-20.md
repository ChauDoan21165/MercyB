# Disk Cleanup Audit - 2026-05-20

## Summary

- Baseline `/System/Volumes/Data`: `204Gi` used, `1.5Gi` available, `100%` capacity.
- After cleanup `/System/Volumes/Data`: `172Gi` used, `33Gi` available, `84%` capacity.
- Estimated recovered space: about `31.5Gi` by available-space delta, about `32Gi` by used-space delta.
- No git branches were deleted.
- No dirty git worktrees were deleted.
- No reports, docs, env files, keys, archives, or local config were deleted.

## Disk Before

From `/tmp/disk-before.log`:

```text
/dev/disk2s1     228Gi   204Gi   1.5Gi   100%    5.8M   16M   27%   /System/Volumes/Data
```

Home top-level before, from `/tmp/home-size-before.log`:

```text
8.3G    /Users/admin/MercyB
31G     /Users/admin/Library
```

## Disk After

From `/tmp/disk-after.log`:

```text
/dev/disk2s1     228Gi   172Gi    33Gi    84%    3.3M  347M    1%   /System/Volumes/Data
```

Home top-level after, from `/tmp/home-size-after.log`:

```text
7.8G    /Users/admin/MercyB
30G     /Users/admin/Library
```

## Worktrees Removed

Removed only clean worktrees whose HEAD was present on a remote branch or PR ref:

| Path | Branch | Clean/dirty | Last commit | Safe reason | Size |
| --- | --- | --- | --- | --- | --- |
| `/private/tmp/a33-placement-benchmarking` | `feat/a33-placement-benchmarking` | clean | `f2696b913 feat(placement-v3): add benchmarking infrastructure scaffold` | HEAD on `origin/feat/a33-placement-benchmarking` | `287M` |
| `/private/tmp/a35-adaptive-item-generation` | `feat/a35-adaptive-item-generation` | clean | `fc692e860 feat(placement-v3): add adaptive item generation gauntlet` | HEAD on `origin/feat/a35-adaptive-item-generation` and `origin/pr/946` | `366M` |
| `/private/tmp/a36-grading-drift-detection` | `feat/a36-grading-drift-detection` | clean | `2af675915 feat(placement-v3): add grading drift replay harness` | HEAD on `origin/feat/a36-grading-drift-detection` | `287M` |
| `/private/tmp/mercyb-a38-test-storage` | `feat/a38-stabilize-vitest-storage` | clean | `1b77b9e4e test: stabilize Vitest web storage harness` | HEAD on `origin/feat/a38-stabilize-vitest-storage` | `366M` |

`/private/tmp/placement-v3-integration` was listed as a likely candidate but was not present.
`/tmp/mercyb-a38-test-storage` resolved to the same macOS temp location as `/private/tmp/mercyb-a38-test-storage`.

## Worktrees Kept

- Main checkout was kept because it had unrelated uncommitted/untracked work at audit time.
- Locked `.claude` worktree was kept.
- Remaining `/private/tmp` worktrees were kept because they were dirty, represented open feature/report/review branches, had PR refs needing more disposition checking, or were not part of the verified candidate set.
- `178` worktrees remained after the cleanup pass and before creating this report worktree.

Audit artifacts:

- `/tmp/worktrees.log`
- `/tmp/worktree-audit.log`
- `/tmp/worktree-sizes-before.log`
- `/tmp/worktrees-after.log`

## Node Modules Removed

- Removed `/Users/admin/MercyB/node_modules` after verifying `package.json` and `package-lock.json` existed. Measured size: `1.5G`.
- Removed `node_modules` under `/private/tmp` and `/tmp` worktrees/project directories.
- A final post-sweep check found one remaining measured temp dependency directory, `/private/tmp/a37-readiness-main/node_modules` at `946M`; it was removed separately.
- Final `/tmp/tmp-node-modules-after.log` contained no remaining entries.

Initial notable `node_modules` outside temp that were measured but not removed:

- `/Users/admin/mercy-ai-builder/node_modules` - `999M`
- `/Users/admin/projects/mercy-signal/node_modules` - `417M`
- `/Users/admin/MercyB-icons/node_modules` - `380M`
- `/Users/admin/.local/share/fnm/node-versions/v22.22.1/installation/lib/node_modules` - `1.2G`

## Package And Tool Caches Cleaned

- Ran `npm cache verify`; it reported `1,442,194,173` bytes of verified content and garbage-collected `262,689,773` bytes.
- Ran `npm cache clean --force`.
- Ran `pnpm store prune`; it removed `24,494` files and `404` packages.
- Measured and removed `~/Library/Caches/ms-playwright`: `1.0G`.
- Measured and cleared `~/Library/Developer/Xcode/DerivedData`: `92K`.
- Xcode archives were not touched.

## Temp Files

Measured largest temp entries before and after:

- `/tmp/private-tmp-before.log`
- `/tmp/tmp-largest.log`
- `/tmp/private-tmp-largest.log`
- `/tmp/private-tmp-largest-after-final.log`

No arbitrary temp reports/docs/logs were deleted. Cleanup was limited to verified worktrees and dependency/cache directories.

## Large Files Found But Not Deleted

From `/tmp/large-files-over-500m-with-sizes.log`:

| Size | Path | Recommendation |
| --- | --- | --- |
| `4.0G` | `/Users/admin/Library/Application Support/Google/Chrome/OptGuideOnDeviceModel/2025.8.8.1141/weights.bin` | Browser-managed model asset; delete only if Chrome cache/model reset is acceptable. |
| `689M` | `/Users/admin/Library/Application Support/Google/GoogleUpdater/crx_cache/25a7f27441de8c2446fb8cf1b4c0596a2a8a846f9d74aa52c03ced2f0606cc29` | Google updater cache; likely disposable, but not deleted automatically. |
| `648M` | `/Users/admin/Library/Developer/CoreSimulator/Devices/C1E473C3-2DCF-4382-A852-2C67A130E413/data/private/var/MobileAsset/AssetsV2/com_apple_MobileAsset_UAF_Siri_Understanding/purpose_auto/c079bfa6b8856202dc8cb2135fef3b06229ced6e.asset/AssetData/Restore/UC_SIRI_ASR_ASSISTANT_EN_US_EN_US_H18P_Cryptex.dmg` | Simulator mobile asset; can be reviewed with simulator/device cleanup, but not deleted automatically. |

## Risks And Follow-Up

- There are still many `/private/tmp` worktrees around `300M-443M` each. They were kept because branch/PR disposition was not fully proven safe beyond the requested candidates.
- Two mounted CoreSimulator runtime volumes remain near full, each with about `444M-447M` available. This cleanup did not remove simulator runtimes or archives.
- Reinstall required before local Node commands in the main repo: run `npm install` or `npm ci` as appropriate.
- This report was created in a separate worktree at `/private/tmp/mercyb-disk-cleanup-audit` on branch `reports/disk-cleanup-audit` to avoid disturbing unrelated dirty work in the main checkout.

## Sustainable Maintenance Plan

Operational tooling and policy added on this branch:

- `scripts/ops/disk-audit.sh` - read-only workstation audit with timestamped logs under `reports/disk-cleanup-evidence/`.
- `scripts/ops/safe-cleanup.sh` - dry-run-by-default cleanup wrapper with `--dry-run` and `--execute`.
- `reports/WORKTREE-LIFECYCLE-POLICY.md` - worktree creation, naming, stale handling, archive, cadence, and dirty-protection rules.
- `reports/WORKSTATION-RECOVERY-RUNBOOK.md` - recovery steps for 0-byte disk incidents, git/worktree integrity, node restore, and interrupted rebases.
- `reports/MULTI-AGENT-WORKSPACE-MAP.md` - current worktree snapshot strategy and cleanup-order guidance.
- `reports/WORKSTATION-MAINTENANCE-SCHEDULE.md` - cron/launchd guidance, manual checkpoints, and never-auto-delete list.
- `reports/DISK-EXHAUSTION-PREVENTION.md` - node_modules, cache, giant-file, report-retention, backup, and pre-merge policies.

Recommended cadence:

- Run `scripts/ops/disk-audit.sh` daily during multi-agent sessions.
- Run `scripts/ops/safe-cleanup.sh --dry-run` weekly.
- Execute cleanup only after reviewing dirty worktrees, PR disposition, and evidence paths.
- Keep at least `20Gi` free before starting broad agent fan-out and `30Gi` free before simulator/Xcode-heavy work.

Future cleanup policy:

- Never delete dirty worktrees.
- Never delete branches.
- Never delete reports, docs, SQL evidence, env files, keys, local config, Xcode archives, or unknown large files automatically.
- Remove temp `node_modules`, npm/pnpm caches, Playwright cache, Xcode DerivedData, and clean stale temp worktrees only after measurement.
- Use `git worktree remove`, not `rm -rf`, for registered worktrees.

Validation evidence saved:

- `reports/disk-cleanup-evidence/shellcheck-20260520.log` - shellcheck was not installed.
- `reports/disk-cleanup-evidence/bash-n-20260520-final.log` - shell syntax validation passed with no output.
- `reports/disk-cleanup-evidence/safe-cleanup-dry-run-20260520.log` - dry-run completed without deleting files.
- `reports/disk-cleanup-evidence/disk-audit-20260520-073305.log` - full audit completed with timestamped output.
- `reports/disk-cleanup-evidence/worktree-map-20260520-072053.tsv` - worktree map evidence.

This follow-up changed only operations scripts and documentation/evidence. No production app code was changed.
