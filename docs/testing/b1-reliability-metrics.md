# B1 Reliability Metrics

Date: 2026-05-20

## Before / After Pass Rates

Before the B1 harness hardening:

- Baseline `npm test`: 1/1 pass.
- Initial Placement V3 E2E gauntlet: 4/5 pass.
- Observed Placement V3 E2E pass rate: 80%.
- Hard gate status: failed because the E2E pass was not five consecutive.

After the B1 harness hardening:

- Final `npm test`: 5/5 consecutive passes.
- Final Placement V3 E2E: 5/5 consecutive passes.
- Follow-up repeated `npm test`: 3/3 passes via `scripts/testing/run-repeat-unit.sh`.
- Follow-up repeated Placement V3 E2E: 3/3 passes via `scripts/testing/run-repeat-e2e.sh`.

## Repeated-Run Timing

Original final gauntlet:

- `npm test` run durations: 39.30s, 47.01s, 49.36s, 46.42s, 64.71s.
- Placement V3 E2E final run durations: 9.6s, 10.2s, 10.4s, 11.2s, 13.6s.

Follow-up repeated runs:

- `scripts/testing/run-repeat-unit.sh 3`: 3/3 passes, 0 failures, 171s total.
  - Run 1: `docs/testing/b1-raw-runs/repeat-unit-20260520-131941-run-1.log`
  - Run 2: `docs/testing/b1-raw-runs/repeat-unit-20260520-132038-run-2.log`
  - Run 3: `docs/testing/b1-raw-runs/repeat-unit-20260520-132131-run-3.log`
- `scripts/testing/run-repeat-e2e.sh 3 placement-v3-vertical`: 3/3 passes, 0 failures, 33s total.
  - Run 1: 11s, `docs/testing/b1-raw-runs/repeat-e2e-20260520-132238-run-1.log`
  - Run 2: 11s, `docs/testing/b1-raw-runs/repeat-e2e-20260520-132249-run-2.log`
  - Run 3: 11s, `docs/testing/b1-raw-runs/repeat-e2e-20260520-132300-run-3.log`

## Observed Flake Patterns

- Submit-disabled race after filling a Placement V3 task.
- Fixed by verifying route settlement, active task readiness, input value, and submit enabled state before clicking.
- Follow-up E2E helpers now persist the retry log, current URL, task id, feature flags, validation errors, submit disabled state, and pending request sample on failure.
- No deterministic unit-test failure cluster was observed in the final B1 runs.

## Remaining Risks

- Placement V3 E2E depends on explicit Vite placement flags in local/CI execution.
- Playwright traces and screenshots are configured, but current PR CI does not run the smoke Placement V3 E2E by default.
- Lint still has existing warnings only; the current gate passes with 0 errors.
- Build still emits existing Vite chunk/dynamic-import warnings.
