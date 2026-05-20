# B1 Fixes Applied

## Placement V3 Vertical E2E Answer Helper

- File: `tests/e2e/placement-v3-vertical.spec.ts`
- Cause: `answerCurrentTask` treated "filled a text node" as success without proving the active task accepted that answer.
- Fix: use visible Playwright locators first, verify the submit button becomes enabled, then fall back to a visible radio or direct DOM input events only if needed.
- Verification:
  - `2026-05-20T12:56Z` targeted `npm run test:e2e -- placement-v3-vertical` with required placement env flags passed: 1 test passed.
