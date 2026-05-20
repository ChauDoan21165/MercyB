# A33 Placement v3 Latency Trends

Date: 2026-05-20

## Evidence

- Raw run: `docs/placement-v3/endurance/raw-runs/a33-local-100-final/`
- Final stability run: `docs/placement-v3/endurance/raw-runs/a33-final-stability-25-final/`
- Browser E2E endurance flows: `tests/e2e/placement-v3-endurance.spec.ts`

## 100-Run Local Session Campaign

- Executions: 100
- Passed: 100
- Failed: 0
- Sum of measured session durations: 408 ms
- p50 per-session duration: 1 ms
- p95 per-session duration: 1 ms
- Retry count: 8
- Fallback count: 9
- Timeout count: 3

Scenario mix:

- baseline: 53
- resume: 5
- browser_refresh: 4
- abandon: 2
- duplicate_submission: 2
- retry_storm: 2
- interrupted_persistence: 2
- delayed_grading: 2
- fallback_grading: 1
- partial_recommendation_failure: 1
- timeout_recovery: 1
- final_stability: 25

## Final 25-Run Stability Batch

- Executions: 25
- Passed: 25
- Failed: 0
- Sum of measured session durations: 65 ms
- p50 per-session duration: 1 ms
- p95 per-session duration: 2 ms
- Retry count: 0
- Fallback count: 0
- Timeout count: 0

## Interpretation

No local/session-mode latency degradation was observed across the final
100-run campaign. The final 25 uninterrupted executions also stayed flat.

This does not measure production provider latency. The local runner uses the
real orchestrator and grader HTTP client path with deterministic local fetch
fixtures, so provider/network latency remains unverifiable in this environment.

