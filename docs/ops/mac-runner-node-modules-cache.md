# Mac Runner Node Modules Cache

Last updated: 2026-06-12.

## Purpose

Mac-tagged Node jobs restore `node_modules` from a host-local, lockfile-keyed APFS clone cache before falling back to `npm ci`. The restore path is implemented by `scripts/ci/restore-npm-node-modules-cache.sh` and called from the shared `.node_job` `before_script`, so it covers every local mac Node job class that inherits `.node_job`, including reservoir jobs.

Non-Node mac jobs stay out of this path: `check-new-orphans`, `ci-job-tags-guard`, `post-merge-worktree-reaper`, and `flywheel-mine` intentionally do not install dependencies.

## Behavior

- Cache key: SHA-256 of `package-lock.json`.
- Cache root: `$MERCYB_NODE_MODULES_CACHE_ROOT`, default `$HOME/.cache/mercyb-node-modules`.
- Hit path: remove any job-local `node_modules`, run `cp -cR` from the host cache, remove `node_modules/.deno`, and validate expected bins.
- Miss path: run the existing `npm ci --legacy-peer-deps --cache .npm --prefer-offline ${NPM_CI_EXTRA_FLAGS:-}`, then seed the host cache atomically under a per-key lock.
- Fallbacks: non-Darwin hosts, disabled cache, missing lockfile, missing APFS clone support, validation failure, or lock timeout all run plain `npm ci`.
- GitLab cache archives only `.npm`; `node_modules` is no longer zipped by GitLab cache.
- Disk gate remains a backstop only: the pre-checkout `DISK_GATE` still refuses hosts below 20GB free.

Disable for one job by setting `MERCYB_NODE_MODULES_CLONE_CACHE=0`.

## Capacity Rule

For every mac runner host:

```text
base_used_gb + (max_concurrent_jobs * worst_case_job_footprint_gb) <= host_capacity_gb - 30
```

Where:

- `host_capacity_gb` is the APFS data/build volume capacity from `df -g`.
- `base_used_gb` is measured after stale build dirs are reaped and while no jobs are running.
- `worst_case_job_footprint_gb` must include checkout, generated outputs, the logical `node_modules` restore, `.npm`, Playwright/browser artifacts, and cache headroom. Use 4GB until a larger measured class appears.
- The 30GB reserve is above the 20GB `DISK_GATE` floor so normal operation should not touch the gate.

## Current Caps

| Host / runner | Evidence | Capacity | Base used | Worst-case per job | Cap from inequality | Applied cap |
|---|---|---:|---:|---:|---:|---:|
| admin / `CD1runner` (`53441166`) | local `df -h` on 2026-06-12: 228Gi size, 161Gi used, 32Gi avail on Data volume; `~/.gitlab-runner/config.toml` read as `concurrent = 2` | 228GB | 161GB | 4GB | floor((228-30-161)/4)=9 | 2 |
| `Chaus-MacBook-Air.local` / `mac-runner-2` (`53419565`) | job `14836779340` trace on 2026-06-12: 228Gi size, 17Gi used, 87Gi avail after recovery; prior refusals at 18GB free | 228GB | 17GB measured after recovery | 4GB | floor((228-30-17)/4)=45 | 2 required until host-local config is verified |
| `mac-runner-3` (`53419663`) | board says runner recovered, but no current full `df` line is available in this repo/session | unknown | unknown | 4GB | unknown | keep <=2 until measured |

Policy:

- No mac runner may exceed `concurrent = 2` without a fresh table update in this file and `docs/ops/ceo1-seat-kit/SYSTEM-MANIFEST.md`.
- If a host has unknown capacity/base usage, keep it at or below 2 and treat `DISK_GATE` refusals as a stop-the-line infra incident.
- Runner-wide cap is still only one layer. Reservoir pipelines can create many eligible jobs, so every Node job must use clone restore; the gate is not a capacity planning mechanism.

## Verification

Expected CI logs on a mac Node job:

- Cache miss: `[node-modules-cache] miss key=...; running npm ci and seeding`
- Cache hit: `[node-modules-cache] hit key=... restore_seconds=... free_delta_mb=...`
- Backstop: `DISK_GATE: ... >= 20GB floor`

Interim DONE-WHEN: cache hit/miss logs appear across normal MR jobs and reservoir jobs within one day, caps stay at or below this table, and `DISK_GATE` appears only as a backstop.

Final DONE-WHEN: one week with zero `DISK_GATE` refusals and zero manual runner pauses.
