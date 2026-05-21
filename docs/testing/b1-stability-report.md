# B1 Stability Report

Start time: 2026-05-20T12:47:33Z
End time: 2026-05-20T13:03:45Z
Total elapsed time: 16m 12s

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

## Root Causes Fixed

- Placement v3 vertical E2E answer helper flake: `answerCurrentTask` could return after filling a text field without proving the current active task accepted the answer. It now uses visible Playwright locators, verifies submit is enabled, and falls back to visible radio/direct input events only when needed.

## Files Changed

- `docs/testing/b1-initial-test-harness-audit.md`
- `docs/testing/b1-failure-clusters.md`
- `docs/testing/b1-fixes-applied.md`
- `docs/testing/b1-stability-report.md`
- `docs/testing/b1-raw-runs/`
- `tests/e2e/placement-v3-vertical.spec.ts`

Unrelated pre-existing or concurrent working-tree changes were left untouched.

## Remaining Risks

- Placement v3 E2E still requires explicit Vite placement flags and placeholder Supabase env values; default `npm run test:e2e -- placement-v3-vertical` without those flags compiles the route off.
- Build still emits existing Vite warnings around a dynamic kids-data import, circular manual chunks, and mixed static/dynamic `slos.ts` import.
- Lint still has 627 existing warnings, all warnings and no errors.
- The task did not run for a literal 8-hour wall clock block in this environment; evidence is repeated execution within this session.

## Merge Recommendation For #941/#942

Safer to merge than the starting point: the full Vitest suite has 5 consecutive passes, the Placement v3 vertical has 5 consecutive post-fix passes, and typecheck/typecheck:ci/build/lint all pass under saved raw logs.
