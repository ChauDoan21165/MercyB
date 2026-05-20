# A33 Placement v3 Failure Clusters

Date: 2026-05-20

## Classifier Coverage

Added `src/lib/placement/v3/classifyEnduranceFailures.ts` and
`tests/integration/placement-v3-endurance/classifier.integration.test.ts`.

The classifier clusters:

- retry storms
- timeout clusters
- state corruption
- memory growth
- duplicate submissions
- persistence failures
- UI degradation
- recommendation failures
- unknown failures

Integration coverage: 15 classifier scenarios passed.

## Observed Clusters

The final 100-run campaign produced no failed session executions and no
classified runtime failures.

Synthetic failure paths were still exercised:

- retry storm: 2 runs, 8 counted retries
- fallback grading: 1 direct fallback scenario
- timeout recovery: 1 scenario, 3 timeout observations
- interrupted persistence: 2 runs with retry recovery
- duplicate submission: 2 runs
- partial recommendation failure: 1 run with fallback recommendation

## Deterministic Bugs Found During Burn-In Tooling

1. E2E response helper did not handle radio/listening-style tasks.
   - Fix: answer helper now handles visible radio controls.
2. E2E flow tried to click a stale disabled submit button during result-page
   transition.
   - Fix: the test now treats visible results as completion before another
   submit attempt and asserts the submit button is enabled before clicking.
3. Timeout scenario counted a timeout but local fetch did not honor
   `AbortSignal`.
   - Fix: local fetch delay now rejects with `AbortError` when aborted, so the
   real HTTP grader timeout fallback path executes.

No Placement V3 business logic was changed for these fixes.

