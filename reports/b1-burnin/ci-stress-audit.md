# B1 CI Stress Audit

Branch: `feat/b1-test-stability-burndown`

## CI Flake Surface

Placement V3 remained stable during the sustained burn-in, but CI still has operational risk from shared-runner contention and timeout budget. The strongest signal was not a failed assertion; it was runtime drift under simultaneous work.

## Timeout Risks

- Placement V3 E2E baseline stayed around 9-12 seconds.
- The first E2E run while `npm test` was also starting took 54 seconds wall time, with Playwright reporting 1 passed in 52.7 seconds.
- This is close enough to common per-test timeout budgets that GitHub Actions runner contention could convert a passing local run into a CI timeout.
- Recommendation: do not run the long Placement V3 E2E burn-in concurrently with full unit tests on the same runner unless the workflow has explicit timeout headroom and artifact capture.

## Artifact Upload Risks

- Long repeat-run logs are large because full Vitest output is verbose.
- E2E artifacts can grow quickly when traces and screenshots are collected repeatedly.
- Recommendation: upload compressed `reports/b1-burnin/`, `reports/b1-e2e-diagnostics/`, and Playwright trace artifacts on failure and on manual burn-in runs.
- Recommendation: keep detector output outside the detector input log set, or scope detector parsing to run-log prefixes.

## Browser Startup Instability

- No Chromium startup failures occurred in the burn-in.
- The repeat E2E helper used isolated ports, reducing dev-server collision risk.
- Recommendation: keep `TEST_PORT`/base URL isolation for repeat-run jobs and avoid reusing a fixed port across parallel jobs.

## Vite Instability

- No Vite disconnects occurred.
- Build warnings remained non-fatal and existing:
  - room validation placeholder-title warnings
  - dynamic import warning in `kidsDataLoader`
  - circular chunk warnings
  - mixed static/dynamic `slos.ts` import warning
- Recommendation: continue treating new Vite startup disconnects, transform crashes, or route-load timeouts as CI-blocking reliability signals.

## Worker Contention

- Unit-test startup plus E2E startup caused the largest E2E slowdown.
- Build contention caused only mild E2E slowdown, up to 16 seconds.
- Serial, parallel, isolated-browser, and reused-worker E2E modes all passed.
- Recommendation: if CI adds a required burn-in job later, start with sequential execution on one runner before introducing parallel contention.

## GitHub Actions Variability

- GitHub-hosted runners can vary materially in CPU and I/O availability.
- The local burn-in did not expose product nondeterminism, but CI could still expose timeout-sensitive behavior if multiple heavy jobs share a runner.
- Recommendation: use the manual `reliability-burnin` workflow as a pre-merge stress tool for Placement V3 follow-up PRs, and promote it to required only after the timeout/artifact budget is tuned from actual CI timings.

## Merge-Relevant Assessment

No observed Placement V3 failure should block #950. The remaining CI risk is operational: timeout headroom under runner contention. That risk is manageable with the repeat-run scripts, artifact upload, flaky-pattern detector, and the new burn-in evidence captured in this report set.
