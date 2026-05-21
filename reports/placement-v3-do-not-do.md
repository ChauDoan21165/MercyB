# Placement V3 Do Not Do List

Hard release-management constraints. Violating these invalidates #949 as a trustworthy decision record.

## Do Not Enable Flags

- Do not set `VITE_PLACEMENT_TEST_ENABLED=true` for production users.
- Do not set `VITE_PLACEMENT_V3_UI_ENABLED=true` for production users.
- Do not route public users into `/placement` for Placement V3 until founder signoff exists.

Evidence reference: `reports/placement-v3-readiness-evidence/flag-audit.md`.

## Do Not Merge Live-Validation-Dependent PRs As Production-Ready

- Do not merge #943 as drift-proof without live replay metrics.
- Do not merge #944 as benchmark-proof without live p95/cost/failover metrics.
- Do not merge #953 as observability-proof without live/queryable events.
- Do not treat #952 readiness docs as shadow replay execution.

Evidence reference: `reports/placement-v3-launch-control-board.md`.

## Do Not Describe Simulated Evidence As Live

- Mocked Playwright routes are simulation/local validation.
- Scaffolded benchmark/drift/replay tools are not live runtime evidence.
- Green CI is not production readiness.
- Static native permission config is not real-device speaking validation.

Evidence reference: `reports/placement-v3-runtime-validation-scoreboard.md`.

## Do Not Let Agents Switch Branches/Domains

- A2 stays on observability.
- A3 stays on data quality.
- A33 benchmarking/endurance stays on benchmark/endurance scope.
- A36 stays on drift replay.
- A37 stays on shadow replay ops.
- B1 stays on reliability guardrails.
- Report stays on release readiness.

Evidence reference: `reports/placement-v3-next-agent-queue.md`.

## Do Not Delete Dirty Worktrees

- Audit with `git worktree list` and `git status --short` first.
- Never delete a dirty worktree unless Chau explicitly approves.
- Do not remove benchmark/replay artifacts unless they are duplicated and documented.

Evidence reference: `reports/placement-v3-unblock-command-sheet.md`.

## Do Not Merge If PR Body Overclaims

Hold any PR that claims:

- production readiness,
- live benchmark metrics without raw artifacts,
- live drift stability without replay output,
- native speaking success without real-device evidence,
- shadow replay coverage without actual replay runs,
- adaptive generation launch readiness while hard gates are failed.

Evidence reference: `reports/placement-v3-evidence-index.md`.

## Current Default

When uncertain, the recommendation remains: DO NOT ENABLE.
