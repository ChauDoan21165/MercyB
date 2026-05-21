# Validate Placement V3 Stack

Purpose: run the current merged Placement V3 test/build gates before attempting any future A37 runtime work.

## Exact Commands

```bash
date -u +"%Y-%m-%dT%H:%M:%SZ"
npm run typecheck
npm run typecheck:ci
npm run build
npx vitest run supabase/functions/placement-v3-session/__tests__ supabase/functions/placement-v3-grade-writing/__tests__/core.test.ts src/data/placement/v3/__tests__ src/lib/placement/v3/__tests__
npx playwright test -c playwright.smoke.config.ts tests/e2e/placement-v3-vertical.spec.ts
```

## Expected Outputs

Minimum expected success markers:

```text
Test Files  16 passed
Tests  124 passed
1 passed
```

`npm run build` should finish with:

```text
✓ built
```

## Traces / Logs To Capture

```bash
npm run typecheck 2>&1 | tee reports/a37-shadow-replay-readiness/runtime-validation/typecheck-stack.log
npm run typecheck:ci 2>&1 | tee reports/a37-shadow-replay-readiness/runtime-validation/typecheck-ci-stack.log
npm run build 2>&1 | tee reports/a37-shadow-replay-readiness/runtime-validation/build-stack.log
npx vitest run supabase/functions/placement-v3-session/__tests__ supabase/functions/placement-v3-grade-writing/__tests__/core.test.ts src/data/placement/v3/__tests__ src/lib/placement/v3/__tests__ 2>&1 | tee reports/a37-shadow-replay-readiness/runtime-validation/vitest-placement-stack.log
npx playwright test -c playwright.smoke.config.ts tests/e2e/placement-v3-vertical.spec.ts 2>&1 | tee reports/a37-shadow-replay-readiness/runtime-validation/playwright-placement-stack.log
```

## What Counts As Validated

Placement V3 stack is locally validated when typecheck, CI typecheck, build, focused Vitest, and mocked vertical Playwright all pass.

## What Remains Unproven

- Real provider grading.
- Real Supabase persistence with authenticated users.
- Real Azure/speaking path.
- Shadow capture.
- Replay determinism.
- Production traffic safety.

## Troubleshooting

- Default Playwright config may not discover `tests/e2e`; use `-c playwright.smoke.config.ts`.
- Build warnings from existing Vite chunking do not block validation unless build exits non-zero.
- If lint/tooling fails from a damaged `node_modules`, rerun `npm ci --ignore-scripts` and repeat.
