# B1 Fixes Applied

## Placement V3 Vertical E2E Answer Helper

- File: `tests/e2e/placement-v3-vertical.spec.ts`
- Cause: `answerCurrentTask` treated "filled a text node" as success without proving the active task accepted that answer.
- Fix: use visible Playwright locators first, verify the submit button becomes enabled, then fall back to a visible radio or direct DOM input events only if needed.
- Verification:
  - `2026-05-20T12:56Z` targeted `npm run test:e2e -- placement-v3-vertical` with required placement env flags passed: 1 test passed.

## Reusable Placement V3 Stability Guardrails

- Files:
  - `tests/e2e/utils/stability.ts`
  - `tests/e2e/placement-v3-vertical.spec.ts`
- Fix: extracted durable E2E primitives for route settlement, task readiness, stable input fill, enabled-submit waiting, feature-flag assertion, retry logging, pending-network tracking, and Placement V3 diagnostic capture.
- Verification:
  - `scripts/testing/run-repeat-e2e.sh 3 placement-v3-vertical`: 3/3 passes.
  - `npm run typecheck`: pass.
  - `npm run typecheck:ci`: pass.
  - `npm run build`: pass.
  - `npm run lint`: pass with existing warnings only.

## Repeated-Run Local Scripts

- Files:
  - `scripts/testing/run-repeat-unit.sh`
  - `scripts/testing/run-repeat-e2e.sh`
- Fix: added reusable local CI-style loops with timestamps, failure-stop behavior, raw log collection, pass/fail summary, and timing metrics.
- Verification:
  - `scripts/testing/run-repeat-unit.sh 3`: 3/3 passes.
  - `scripts/testing/run-repeat-e2e.sh 3 placement-v3-vertical`: 3/3 passes.
