# B1 Reliability Thresholds

Date: 2026-05-20

## Acceptable Flake Rate

For Placement V3 merge-readiness evidence, acceptable flake rate is 0% across the required repeated-run window.

For exploratory burn-in runs, any intermittent failure is treated as instability even if a later run passes.

## Minimum Repeat-Run Count

- Standard merge evidence: 5 consecutive `npm test` passes.
- Standard Placement V3 E2E evidence: 5 consecutive `placement-v3-vertical` passes.
- Local diagnostic check after a narrow harness change: minimum 3 consecutive runs.
- CI burn-in workflow: default 5 repeated unit runs and 5 repeated Placement V3 E2E runs.

## CI Should Block Merge When

- Any repeated run fails.
- The flaky-pattern detector reports `unstable: true`.
- The detector reports failures mixed with passes in the same burn-in set.
- Required artifact summaries are missing.
- Typecheck or build fails.
- A failure cluster points to disabled submit state, missing route UI, network failures, missing selectors, or timeouts.

## Requires Investigation

- A test passes after retry but the retry log shows a failed first attempt.
- Runtime increases enough to suggest route hydration or network settling slowed materially.
- The same selector appears in repeated timeout diagnostics.
- Placement V3 route assertions fail under expected Vite flags.
- Playwright produces screenshots or traces in `reports/b1-e2e-diagnostics/`.

## Nondeterministic Failure Definition

A failure is nondeterministic when the same command and code revision produce both pass and fail results across repeated runs without an intentional environment change.

Examples:

- Run 1 fails on disabled submit, runs 2-5 pass.
- A selector timeout appears once and disappears on rerun.
- A route wait times out only under repeated execution.
- A network request fails intermittently while local mocks and routes are unchanged.
