# B1 Burn-In Flaky Failure Forensics

Branch: `feat/b1-test-stability-burndown`

Evidence window: `2026-05-20T13:49:36Z` through `2026-05-20T14:33:20Z`

## Summary

No Placement V3 product, assertion, selector, route, disabled-submit, browser, or feature-flag nondeterministic failures emerged during the sustained burn-in.

The only instability-like signal was a flaky-detector input hygiene false positive during the `e2e-while-unit` contention run. The E2E runs themselves passed 5/5 and the simultaneous background `npm test` passed. The detector initially saw unrelated background process logs in the same log directory as repeat-run logs; after moving background logs under `background/` and keeping detector output outside the detector input set, the detector returned `unstable: false`.

## Instability Record: Detector Input Hygiene False Positive

- Failing selector: none
- Failing route: none
- Failing test file: none
- Exact timing: after `reports/b1-burnin/contention/unit-contention/e2e-while-unit-summary.json` recorded 5/5 E2E passes while a background `npm test` ran
- Browser state: all Placement V3 E2E executions passed
- Feature flag state: Placement V3 route remained reachable through the smoke config and reliability helpers
- Concurrent workload: one background `npm test` plus five sequential Placement V3 E2E invocations
- Reproducibility: reproducible only when non-repeat-run logs were co-located in the detector log directory
- Likely root cause: detector input scope included background/pid/self-output logs rather than only run logs
- Mitigation applied: moved background logs to `reports/b1-burnin/contention/unit-contention/background/` and reran detector with output captured outside the parsed `.log` set
- Confidence: high that this was tooling/log-layout noise, not a product or E2E flake

## Product Flake Findings

- Disabled submit races: none observed
- Async hydration races: none observed
- Route-settle races: none observed
- Feature-flag timing races: none observed
- Lazy import races: none observed
- Missing element failures: none observed
- Network failures: none observed
- Browser startup failures: none observed

## Evidence Paths

- Unit burn-in: `reports/b1-burnin/unit-runs/`
- E2E burn-in: `reports/b1-burnin/e2e-runs/`
- Unit-contention run: `reports/b1-burnin/contention/unit-contention/`
- Build-contention run: `reports/b1-burnin/contention/build-contention/`
- Parallelism variation: `reports/b1-burnin/parallelism/`
- Final clean verification: `reports/b1-burnin/final-clean/`
