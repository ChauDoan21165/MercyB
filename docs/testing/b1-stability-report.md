# B1 Stability Report

Start time: 2026-05-20T12:47:33Z
End time: 2026-05-20T13:03:45Z
Total elapsed time: 16m 12s

Follow-up guardrail block: 2026-05-20T13:19:41Z to 2026-05-20T13:24:45Z.

## Commands Run

- `git fetch origin && git switch -c feat/b1-test-stability-burndown origin/main` - pass
- `npm test 2>&1 | tee docs/testing/b1-raw-runs/20260520-124811-npm-test.log` - pass
- Final full test gauntlet: `for i in 1 2 3 4 5; do ... npm test ... final-npm-test-run-$i.log; done` - pass 5/5
- Initial Placement E2E gauntlet: `npm run test:e2e -- placement-v3-vertical` with required placement env flags - run 1 failed, runs 2-5 passed; used for failure clustering.
- Targeted Placement E2E after helper fix: `npm run test:e2e -- placement-v3-vertical` with required placement env flags - pass
- Final Placement E2E gauntlet after helper fix: `for i in 1 2 3 4 5; do ... npm run test:e2e -- placement-v3-vertical ... final-placement-e2e-run-$i.log; done` - pass 5/5
- `npm run typecheck 2>&1 | tee docs/testing/b1-raw-runs/final-typecheck.log` - pass
- `npm run typecheck:ci 2>&1 | tee docs/testing/b1-raw-runs/final-typecheck-ci.log` - pass
- `npm run build 2>&1 | tee docs/testing/b1-raw-runs/final-build.log` - pass
- `npm run lint 2>&1 | tee docs/testing/b1-raw-runs/final-lint.log` - pass with existing warnings
- `scripts/testing/run-repeat-unit.sh 3 2>&1 | tee docs/testing/b1-raw-runs/followup-repeat-unit-wrapper.log` - pass 3/3
- `scripts/testing/run-repeat-e2e.sh 3 placement-v3-vertical 2>&1 | tee docs/testing/b1-raw-runs/followup-repeat-e2e-wrapper.log` - pass 3/3
- `npm run typecheck 2>&1 | tee docs/testing/b1-raw-runs/followup-final-typecheck.log` - pass
- `npm run typecheck:ci 2>&1 | tee docs/testing/b1-raw-runs/followup-final-typecheck-ci.log` - pass
- `npm run build 2>&1 | tee docs/testing/b1-raw-runs/followup-final-build.log` - pass
- `npm run lint 2>&1 | tee docs/testing/b1-raw-runs/followup-final-lint.log` - pass with existing warnings

## Results

- Full `npm test` runs: 6 total, including 5 consecutive final passes.
- Final `npm test` logs:
  - `docs/testing/b1-raw-runs/final-npm-test-run-1.log`: 381 files, 6,856 tests passed.
  - `docs/testing/b1-raw-runs/final-npm-test-run-2.log`: 381 files, 6,856 tests passed.
  - `docs/testing/b1-raw-runs/final-npm-test-run-3.log`: 381 files, 6,856 tests passed.
  - `docs/testing/b1-raw-runs/final-npm-test-run-4.log`: 381 files, 6,856 tests passed.
  - `docs/testing/b1-raw-runs/final-npm-test-run-5.log`: 381 files, 6,856 tests passed.
- Placement E2E runs: 12 total, including one pre-fix failure and 5 consecutive post-fix final passes.
- Final Placement E2E logs:
  - `docs/testing/b1-raw-runs/final-placement-e2e-run-1.log`: 1 passed.
  - `docs/testing/b1-raw-runs/final-placement-e2e-run-2.log`: 1 passed.
  - `docs/testing/b1-raw-runs/final-placement-e2e-run-3.log`: 1 passed.
  - `docs/testing/b1-raw-runs/final-placement-e2e-run-4.log`: 1 passed.
  - `docs/testing/b1-raw-runs/final-placement-e2e-run-5.log`: 1 passed.
- `npm run typecheck`: passed.
- `npm run typecheck:ci`: passed.
- `npm run build`: passed; room validation had 30 non-fatal `PLACEHOLDER_EN_TITLE` warnings and Vite emitted existing chunk/dynamic-import warnings.
- `npm run lint`: passed with 627 existing `@typescript-eslint/no-explicit-any` warnings and 0 errors.
- Follow-up repeated `npm test` runs through `scripts/testing/run-repeat-unit.sh`: 3/3 passed, 407 files and 7,070 tests passed per run on the current base, 171s total.
- Follow-up Placement V3 E2E runs through `scripts/testing/run-repeat-e2e.sh`: 3/3 passed, 33s total.

## Root Causes Fixed

- Placement v3 vertical E2E answer helper flake: `answerCurrentTask` could return after filling a text field without proving the current active task accepted the answer. It now uses visible Playwright locators, verifies submit is enabled, and falls back to visible radio/direct input events only when needed.
- Follow-up guardrails converted that fix into shared test harness helpers: route-settled detection, task-ready detection, stable input fill, enabled-submit wait, feature-flag assertion, retry trace logging, pending-network tracking, and Placement V3 diagnostics capture.

## CI Guardrails Added

- `tests/e2e/utils/stability.ts` centralizes the Placement V3 E2E stability primitives so future specs do not reintroduce the submit-disabled race.
- `reports/b1-e2e-diagnostics/README.md` reserves the failure artifact location for Placement V3 diagnostics.
- `scripts/testing/run-repeat-unit.sh` gives maintainers a local repeated `npm test` loop with pass/fail counts and timing metrics.
- `scripts/testing/run-repeat-e2e.sh` gives maintainers a local repeated Placement V3 E2E loop with timestamps, failure stop, per-run logs, and artifact directory setup.
- `docs/testing/b1-ci-stability-guardrails.md`, `docs/testing/b1-ci-audit.md`, and `docs/testing/b1-reliability-metrics.md` document the root cause, correct patterns, anti-patterns, CI risks, and current reliability evidence.

## CI Recommendations

- Add a PR workflow job that runs `scripts/testing/run-repeat-e2e.sh 3 placement-v3-vertical` with placement flags enabled and uploads `docs/testing/b1-raw-runs/`, `reports/b1-e2e-diagnostics/`, `test-results/`, and `playwright-report/`.
- Keep the repeated Placement V3 job non-blocking for one observation window if runtime is a concern, then promote it to required once runtime is stable.
- Upload Vitest raw logs on unit failures so future shared-storage or setup regressions have persistent artifacts.
- Keep Playwright traces/screenshots enabled for failure or retry paths, and avoid parallelizing Placement V3 E2E until seeded test users and backend state are isolated.

## Files Changed

- `docs/testing/b1-initial-test-harness-audit.md`
- `docs/testing/b1-failure-clusters.md`
- `docs/testing/b1-fixes-applied.md`
- `docs/testing/b1-stability-report.md`
- `docs/testing/b1-raw-runs/`
- `docs/testing/b1-ci-audit.md`
- `docs/testing/b1-ci-stability-guardrails.md`
- `docs/testing/b1-reliability-metrics.md`
- `reports/b1-e2e-diagnostics/README.md`
- `scripts/testing/run-repeat-e2e.sh`
- `scripts/testing/run-repeat-unit.sh`
- `tests/e2e/placement-v3-vertical.spec.ts`
- `tests/e2e/utils/stability.ts`

Unrelated pre-existing or concurrent working-tree changes were left untouched.

## Remaining Risks

- Placement v3 E2E still requires explicit Vite placement flags and placeholder Supabase env values; default `npm run test:e2e -- placement-v3-vertical` without those flags compiles the route off.
- Build still emits existing Vite warnings around a dynamic kids-data import, circular manual chunks, and mixed static/dynamic `slos.ts` import.
- Lint still has 627 existing warnings, all warnings and no errors.
- The task did not run for a literal 8-hour wall clock block in this environment; evidence is repeated execution within this session.

## Merge Recommendation For #941/#942

Safer to merge than the starting point: the full Vitest suite has 5 consecutive passes, the Placement v3 vertical has 5 consecutive post-fix passes, and typecheck/typecheck:ci/build/lint all pass under saved raw logs.
