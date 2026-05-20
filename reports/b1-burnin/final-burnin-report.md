# B1 Final Sustained Burn-In Report

Branch: `feat/b1-test-stability-burndown`

PR: #950

Evidence window: `2026-05-20T13:49:36Z` through `2026-05-20T14:33:20Z`

## Commands Executed

- `scripts/testing/run-repeat-unit.sh 25`
- `scripts/testing/run-repeat-e2e.sh 25 placement-v3-vertical`
- 10 cycles of `npm run typecheck`, `npm run typecheck:ci`, and `npm run build`
- 5 Placement V3 E2E runs while `npm test` executed simultaneously
- 5 Placement V3 E2E runs while `npm run build` executed simultaneously
- Serial Placement V3 E2E
- Parallel Placement V3 E2E with two workers and `--repeat-each=3`
- Isolated browser Placement V3 E2E invocations
- Reused-worker Placement V3 E2E with `--repeat-each=5`
- Final `npm run typecheck`
- Final `npm run typecheck:ci`
- Final `npm run build`
- Final `scripts/testing/run-repeat-unit.sh 5`
- Final `scripts/testing/run-repeat-e2e.sh 5 placement-v3-vertical`

## Did Nondeterministic Failures Emerge?

No Placement V3 product, test assertion, selector, route, network, browser, disabled-submit, or feature-flag nondeterministic failures emerged.

One detector false positive appeared during unit-contention analysis because background logs were initially co-located with repeat-run logs. The underlying tests passed. After moving background logs under `background/` and rerunning detection, the detector reported no instability.

## Conditions Tested

- Long sequential unit burn-in: 25/25 passed
- Long sequential Placement V3 E2E burn-in: 25/25 passed
- Repeated typecheck/build cycles: 30/30 commands passed
- E2E under full unit-test contention: 5/5 passed
- E2E under build contention: 5/5 passed
- Serial E2E: passed
- Parallel E2E: passed
- Isolated browser E2E invocations: passed
- Reused browser worker E2E: passed
- Final clean unit burn-in: 5/5 passed
- Final clean Placement V3 E2E burn-in: 5/5 passed

## Is Placement V3 Stability Trustworthy?

Yes, for the current harness and current Placement V3 vertical. Confidence is high because the same route survived repeated unit load, repeated E2E load, typecheck/build cycles, contention runs, and parallelism variation without a product failure.

The confidence is not absolute. The main remaining concern is timeout headroom under shared CI runner contention, not incorrect Placement V3 behavior.

## Operational Concerns

- E2E duration can drift under heavy unit-test startup, with one contention run reaching 54 seconds wall time.
- Typecheck/typecheck:ci duration drifted in cycle 10 to 57 and 55 seconds after earlier 9-14 second runs.
- Artifact volume can become large during long burn-in runs.
- Flaky detector inputs must remain scoped to actual repeat-run logs, not background control logs.
- GitHub-hosted runner variability can still create timeout pressure even when local product behavior is stable.

## What Should Block Merge?

- Any true Placement V3 selector, route, disabled-submit, feature-flag, or network failure in CI.
- Any repeated-run detector result showing intermittent failure clusters after scoped log parsing.
- Any failing `npm run typecheck`, `npm run typecheck:ci`, `npm run build`, or required CI job.
- Missing raw logs or artifacts for a claimed burn-in.

## What Should Be Monitored Continuously?

- Placement V3 E2E duration p95 and max duration.
- Wait-for-enabled-submit timing.
- Route-ready and placement-task-ready timing.
- Feature-flag assertion failures.
- Vite dev-server startup time and disconnects.
- Browser startup failures.
- Flaky detector cluster counts by timeout, selector, route, network, disabled button state, and missing element.

## Final Assessment

#950 materially improves Placement V3 reliability confidence. The sustained burn-in did not find hidden nondeterminism. The remaining risk is CI resource variability, which is now observable through the repeat-run scripts, diagnostics artifacts, flaky-pattern detector, and burn-in workflow draft.
