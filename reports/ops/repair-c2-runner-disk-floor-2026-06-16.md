# C2 Runner Disk-Floor Repair - 2026-06-16

## Incident

- Pipeline: `2606802667`
- Ref: `main`
- Failed job: `playwright-perf-budgets`
- Failure reason: `script_failure`
- Runner: `mac-runner-2`
- Machine: `Chaus-MacBook-Air.local` / `C2`
- Build target: `/Users/chaudoanm3/gitlab-runner-builds`

## Root Cause

The job was refused by the runner disk gate before product validation could run:

```text
DISK_GATE: 13.90GB < 14GB floor
```

This is a C2 runner capacity failure. The runner had `13.90GB` free on the build target, below the required `14GB` floor. The failed `playwright-perf-budgets` job should therefore be classified as runner infrastructure pressure, not as an app regression or product-code failure.

## Factory Rule

When a main pipeline fails with a C2 `DISK_GATE` trace below the configured floor:

- Classify the failure as `runner_infrastructure_disk_floor`.
- Do not count it as a product-code failure.
- Quarantine or clean the low-disk runner before retrying.
- Retry the main pipeline only after the runner is above the disk floor.
- Do not advance the success streak until the retried main pipeline is clean.

The rule is encoded for ops tooling in `scripts/ops/c2-runner-disk-floor-rule.mjs`.

## Scope Control

This repair is ops-only. It does not change app product behavior, auth, billing, SQL/RLS, secrets, deploy configuration, or CI topology.

## Verification

Focused test:

```sh
npx vitest run tests/ops/c2-runner-disk-floor-rule.test.mjs
```
