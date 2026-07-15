# CEO-1 Seat Kit System Manifest

Last updated: 2026-06-12.

This manifest registers host-local components that CEO-1 relies on. If a component is not listed here, it is not part of the durable seat kit.

## Admin Host Hygiene

### `com.mercyb.worktree-reaper`

- LaunchAgent: `/Users/admin/Library/LaunchAgents/com.mercyb.worktree-reaper.plist`
- Script: `/Users/admin/bin/worktree-reaper.sh`
- Schedule: `StartInterval=600`, `RunAtLoad=true`
- Logs: `/Users/admin/Library/Logs/mercyb-worktree-reaper.log`, `/Users/admin/Library/Logs/mercyb-worktree-reaper.launchd.out.log`, `/Users/admin/Library/Logs/mercyb-worktree-reaper.launchd.err.log`
- Purpose: reap stale top-level `/private/tmp` agent worktree candidates older than 60 minutes.
- Safety gates: skip `.mb-keep`, skip non-agent/non-worktree candidates, skip names matching running or pending GitLab pipeline IDs, and skip any directory with an open file or process cwd under it per `lsof +D`.
- Replaces: `com.mercyb.ci-build-reaper`, `com.mercyb.ci-disk-cleanup`, and the disabled `com.mercyb.disk-cleanup` plist.

### `com.mercyb.disk-sweep-guard`

- LaunchAgent: `/Users/admin/Library/LaunchAgents/com.mercyb.disk-sweep-guard.plist`
- Script: `/Users/admin/bin/disk-sweep-guard.sh`
- Heartbeat: `/Users/admin/disk-sweep-guard.heartbeat`
- Purpose: disk heartbeat and low-free-space guard. This remains loaded alongside the worktree reaper.

## CI Disk And Node Modules Cache

Permanent component: mac GitLab runner APFS clone `node_modules` restore.

- Repo implementation: `.gitlab-ci.yml` shared `.node_job` `before_script` invokes `scripts/ci/restore-npm-node-modules-cache.sh`.
- Host state: lockfile-keyed cache under `$MERCYB_NODE_MODULES_CACHE_ROOT`, default `$HOME/.cache/mercyb-node-modules`.
- Scope: all mac-tagged Node job classes that inherit `.node_job`, including reservoir jobs. Non-Node mac jobs intentionally skip `node_modules`.
- Backstop: pre-checkout `DISK_GATE` remains active at 20GB free, but normal operation must be sized so it never fires.
- Owner rule: D3 owns Lighthouse work; CI disk/capacity work stays outside D3 territory.

Capacity invariant:

```text
base_used_gb + (max_concurrent_jobs * worst_case_job_footprint_gb) <= host_capacity_gb - 30
```

Current cap policy:

| Host / runner | Capacity evidence | Applied cap |
|---|---|---:|
| admin / `CD1runner` (`53441166`) | 228Gi Data volume; local config read as `concurrent = 2` on 2026-06-12 | 2 |
| `Chaus-MacBook-Air.local` / `mac-runner-2` (`53419565`) | 228Gi from job `14836779340`; prior disk refusals under 20GB | <=2 until host config verified |
| `mac-runner-3` (`53419663`) | full capacity not measured in this repo/session | <=2 until measured |

Any change above `concurrent = 2` requires updating `docs/ops/mac-runner-node-modules-cache.md` with fresh per-host math in the same MR/change record.

## Application Learning Components

### Cell Runtime v1 contracts

- Repo contracts: `docs/cell-runtime/v1/`.
- Validation script: `scripts/cell-runtime-contracts/v1/validate-cell-runtime-contracts.mjs`.
- Purpose: contract-only schema/interface seed for MercyB anatomy objects, multi-graph edges, and deterministic reasoning results.
- Status: C3 hardening package only; no runtime imports, no product behavior changes, and no generated Admin inventory snapshots.

### Adaptive mastery engine V1

- Repo implementation: `src/lib/mastery/`.
- Design note: `docs/design/adaptive-mastery-engine.md`.
- Purpose: pure engine for per-skill BKT mastery state, `ts-fsrs` review scheduling, and ranked next-item selection with stable reason codes.
- Status: architecture/V1 selector only; parameter tuning remains post-data after real learner histories exist.

### Learner profile spine Phase 1a

- Migration: `supabase/migrations/20260723000000_learner_profile_state.sql`.
- Edge writer: `supabase/functions/learner-profile-write/`.
- Client writer: `src/lib/learner-profile/profileWriter.ts`.
- Purpose: durable server-side skill state and error-pattern counters with text-free writes from correction surfaces.
- Status: schema and write paths only; UI, profile reads, and historical backfill are later phases. Supabase migration and edge deploy are owner-applied.

### Learner profile progress surface Phase 1b

- Route: `src/pages/Progress.tsx` at `/progress`.
- Component: `src/components/learner-profile/LearnerProfileProgressCards.tsx`.
- Data sources: direct own-row Supabase reads from `learner_skill_state`, `learner_error_patterns`, and `study_log`.
- Purpose: learner-facing skill bars, top cause-level error patterns, and existing study-log rollup.
- Status: read-only UI surface; no schema changes or edge deploy.
