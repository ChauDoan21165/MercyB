# B1 Long-Run Burn-In Metrics

Branch: `feat/b1-test-stability-burndown`

Evidence window: `2026-05-20T13:49:36Z` through `2026-05-20T14:33:20Z`

## Pass Rate Over Time

| Area | Runs | Passed | Failed | Pass rate | Evidence |
| --- | ---: | ---: | ---: | ---: | --- |
| Long-run `npm test` | 25 | 25 | 0 | 100% | `reports/b1-burnin/unit-runs/repeat-unit-25-summary.json` |
| Long-run Placement V3 E2E | 25 | 25 | 0 | 100% | `reports/b1-burnin/e2e-runs/repeat-e2e-25-summary.json` |
| Typecheck/build cycles | 30 commands | 30 | 0 | 100% | `reports/b1-burnin/typecheck-build/typecheck-build-10-summary.tsv` |
| E2E while `npm test` ran | 5 | 5 | 0 | 100% | `reports/b1-burnin/contention/unit-contention/e2e-while-unit-summary.json` |
| E2E while `npm run build` ran | 5 | 5 | 0 | 100% | `reports/b1-burnin/contention/build-contention/e2e-while-build-summary.json` |
| Parallelism variation | 12 E2E executions | 12 | 0 | 100% | `reports/b1-burnin/parallelism/parallelism-summary.tsv` |
| Final clean `npm test` | 5 | 5 | 0 | 100% | `reports/b1-burnin/final-clean/final-unit-summary.json` |
| Final clean Placement V3 E2E | 5 | 5 | 0 | 100% | `reports/b1-burnin/final-clean/final-e2e-summary.json` |

## Long-Run Unit Metrics

- Command: `scripts/testing/run-repeat-unit.sh 25`
- Result: 25/25 passed
- Total duration: 1182 seconds
- Per-run duration range: 32 to 69 seconds
- Per-run result volume: 407 passed files, 7070 passed tests in observed output
- Flaky detector result: no intermittent failures reported
- Memory observations: no visible out-of-memory or worker-crash signature in saved logs

## Long-Run E2E Metrics

- Command: `scripts/testing/run-repeat-e2e.sh 25 placement-v3-vertical`
- Result: 25/25 passed
- Total duration: 242 seconds
- Per-run duration range: 9 to 12 seconds
- Selector timing drift: no failed or missing selector signature observed
- E2E duration drift: low; most runs remained 9-10 seconds, with a 12 second maximum
- Flaky detector result: no intermittent failures reported

## Typecheck/Build Metrics

- Command group: 10 cycles of `npm run typecheck`, `npm run typecheck:ci`, `npm run build`
- Result: 30/30 commands passed
- Cycles 1-9:
  - `typecheck`: 9-12 seconds
  - `typecheck:ci`: 10-14 seconds
  - `build`: 10-13 seconds
- Cycle 10:
  - `typecheck`: 57 seconds
  - `typecheck:ci`: 55 seconds
  - `build`: 16 seconds
- Interpretation: deterministic pass behavior with visible host/resource runtime drift late in the cycle.

## Resource Contention Metrics

### E2E While `npm test` Ran

- E2E result: 5/5 passed
- Background `npm test`: passed
- E2E total duration: 91 seconds
- E2E durations: 54, 10, 8, 9, 10 seconds
- Slowest observed selector/test path: first E2E invocation under simultaneous unit-test startup, with Playwright reporting 1 passed in 52.7 seconds and the test body around 28.9 seconds
- Disabled submit races: none observed
- Route hydration delays: slowdown observed, no failure
- Vite disconnects: none observed
- Browser instability: none observed

### E2E While `npm run build` Ran

- E2E result: 5/5 passed
- Background build loop: passed
- E2E total duration: 64 seconds
- E2E durations: 12, 12, 11, 12, 16 seconds
- Disabled submit races: none observed
- Route hydration delays: mild slowdown observed, no failure
- Vite disconnects: none observed
- Browser instability: none observed

## Parallelism Variation Metrics

| Scenario | Result | Duration | Notes |
| --- | --- | ---: | --- |
| Serial E2E, one worker | pass | 12s | Baseline serial execution |
| Parallel E2E, two workers, repeat each 3 | pass | 17s | 3 E2E executions passed |
| Isolated browser invocations | pass | 46s | 3 separate repeat-run invocations passed |
| Reused worker repeat-each 5 | pass | 36s | 5 E2E executions passed |

## Final Clean Verification Metrics

- Final `npm run typecheck`: passed
- Final `npm run typecheck:ci`: passed
- Final `npm run build`: passed
- Final clean `npm test`: 5/5 passed, 189 seconds total
- Final clean Placement V3 E2E: 5/5 passed, 48 seconds total

## Stability Trend

The burn-in showed stable pass behavior across normal, repeated, contended, serial, parallel, isolated-browser, and reused-worker execution. Runtime drift is the main operational signal: tests remained correct, but contention can push E2E duration from a 9-12 second baseline to a 54 second first run when full unit tests are starting simultaneously.
