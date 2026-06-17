# C2 Disk-Floor Misclassification Repair - 2026-06-16

## Incident

- MR: `!1911`
- Pipeline: `2606917935`
- Failed jobs:
  - `module-boundaries` on `mac-runner-2`
  - `playwright-perf-budgets` on `mac-runner-2`
- Machine: `C2` / `Chaus-MacBook-Air.local`
- Trace evidence:
  - `DISK_GATE 11.18GB < 14GB floor`
  - `DISK_GATE 11.34GB < 14GB floor`

## Root Cause

The failure observer classified the failed jobs by job-name family, producing `code_or_test_failure` for `module-boundaries` and `expensive_or_browser_failure` for `playwright-perf-budgets`.

Those classifications were wrong for this incident. Both traces show the runner disk gate refusing work below the configured `14GB` floor before product validation could run.

## Rule

Any job trace containing `DISK_GATE` or `GB < 14GB floor` is classified as `runner_disk_floor`, regardless of job name.

This means:

- `module-boundaries` with `DISK_GATE 11.18GB < 14GB floor` is `runner_disk_floor`, not `code_or_test_failure`.
- `playwright-perf-budgets` with `DISK_GATE 11.34GB < 14GB floor` is `runner_disk_floor`, not `expensive_or_browser_failure`.
- The failure is runner infrastructure pressure, not a product-code failure.
- The success streak must not advance until a clean retry completes after the runner condition is corrected.

## Repair

- Updated `scripts/ops/c2-runner-disk-floor-rule.mjs` to emit the canonical factory class `runner_disk_floor`.
- Expanded the disk-floor trace pattern to match both `DISK_GATE ...GB < 14GB floor` and bare `...GB < 14GB floor` evidence.
- Added focused regression coverage for the exact `module-boundaries` and `playwright-perf-budgets` C2 traces from pipeline `2606917935`.
- Updated `~/bin/mercy-failure-observer.sh` so `runner_disk_floor` creates a dedicated runner disk-floor adaptive repair job instead of falling through to unknown failure handling.

## Recommendation

Retry MR `!1911` only after C2 is paused or the runner disk is above the configured `14GB` threshold. If C2 remains below the threshold, clean or quarantine `mac-runner-2` first and avoid spending another pipeline retry on a known runner-capacity failure.

## Scope Control

This repair is ops-only. It does not change app product behavior, auth, billing, SQL/RLS, secrets, deploy configuration, or CI topology.

## Verification

Focused test:

```sh
npx vitest run tests/ops/c2-runner-disk-floor-rule.test.mjs
```
