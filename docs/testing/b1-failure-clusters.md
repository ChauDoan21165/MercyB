# B1 Failure Clusters

This document is updated after each failed run.

## Baseline

- `2026-05-20T12:48:11Z` command: `npm test`
- Log: `docs/testing/b1-raw-runs/20260520-124811-npm-test.log`
- Result: pass
- Summary: 381 test files passed, 6,856 tests passed.
- Failure clusters: none observed in the baseline run.
- No code changes applied from this run.

## Placement V3 Vertical E2E Flake

- `2026-05-20T12:54:30Z` command: `VITE_PLACEMENT_TEST_ENABLED=true VITE_PLACEMENT_V3_UI_ENABLED=true VITE_SUPABASE_URL=https://placeholder.invalid.supabase.co VITE_SUPABASE_ANON_KEY=placeholder-anon-key-not-real npm run test:e2e -- placement-v3-vertical`
- Log: `docs/testing/b1-raw-runs/final-placement-e2e-run-1.log`
- Result: fail
- Failed file: `tests/e2e/placement-v3-vertical.spec.ts`
- Failed test: `placement v3 end-to-end vertical > runs UI client, session orchestrator, graders, recommender, results, and persistence`
- Symptom: `expect(getByRole('button', { name: /Submit answer/i })).toBeEnabled()` timed out because the submit button stayed disabled.
- Cluster: E2E harness answer helper race/input coverage. `answerCurrentTask` returned after setting a visible text field even when that did not actually satisfy the current active task, so the caller attempted to submit with no valid answer.
- Determinism: flaky. The immediate subsequent runs 2-5 passed, but this invalidates the five-consecutive E2E hard gate.
