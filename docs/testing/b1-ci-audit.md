# B1 CI Audit

Date: 2026-05-20

## Workflows Inspected

- `.github/workflows/ci.yml`
- `.github/workflows/playwright.yml`
- `.github/workflows/test.yml`
- `.github/workflows/vitest.yml`
- `playwright.smoke.config.ts`

## Current Coverage

- `ci.yml` runs on PRs to `main` and `develop`.
- Required job `Build and Test` runs `npx tsc --noEmit`, edge function checks, build, validators, and `npm test`.
- Required job `Lint Code` runs `npm run lint`.
- Required job `Validate Rooms` runs `npm run validate-rooms`.
- `playwright.yml` runs only on push to `main`, not PRs.
- `playwright.smoke.config.ts` retains traces/screenshots/video on failure.

## Unstable Workflow Risks

- Placement V3 E2E is not part of the required PR CI path.
- The smoke E2E command needs placement Vite env flags; missing flags route Placement V3 off.
- `playwright.yml` invokes `npx playwright test` without explicitly using `playwright.smoke.config.ts`, so it targets the legacy visual-regression config.
- `test.yml` and `vitest.yml` are push-main only and duplicate some test intent without protecting PRs.

## Missing Artifact Uploads

- `ci.yml` does not upload Vitest raw logs on failure.
- `ci.yml` does not upload Playwright artifacts because it does not run Playwright.
- Placement V3 diagnostics under `reports/b1-e2e-diagnostics/` are not uploaded by any current workflow.

## Missing Traces / Screenshots

- `playwright.smoke.config.ts` is configured for traces, screenshots, and video.
- No PR workflow currently runs the Placement V3 smoke spec and uploads `test-results/`, `playwright-smoke-report/`, or `reports/b1-e2e-diagnostics/`.

## Timeout Risks

- Smoke Playwright config timeout is 60s per test, which is acceptable for the current Placement V3 vertical.
- Repeated-run CI should use a larger job timeout because three Placement V3 repeats can include dev-server startup and trace upload time.
- The full `npm test` suite varied from roughly 39s to 65s in final B1 evidence; repeated unit stability jobs should budget several minutes.

## Parallelization Risks

- `playwright.smoke.config.ts` runs `fullyParallel: false` and `workers: 1`, which is correct for shared DB-state smoke specs.
- Vitest uses threaded workers; shared globals must stay explicit in `src/test/setup.ts`.
- Repeated E2E runs should stay sequential because they reuse port `3107` and smoke state assumptions.

## CI Recommendations

- Add a non-required-but-visible Placement V3 stability job first:
  - install Playwright browsers
  - run `scripts/testing/run-repeat-e2e.sh 3 placement-v3-vertical`
  - upload `test-results/`, `playwright-smoke-report/`, `reports/b1-e2e-diagnostics/`, and `docs/testing/b1-raw-runs/`
- Promote the job to required after several green PRs.
- Add raw-log uploads for `npm test` failures in `ci.yml`.
- Keep retries diagnostic-only and artifact-backed.
