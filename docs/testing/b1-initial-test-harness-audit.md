# B1 Initial Test Harness Audit

Start: 2026-05-20T12:47:33Z
Branch: `feat/b1-test-stability-burndown`
Base: `origin/main`

## Required Files Read

- `package.json`
- `vite.config.ts`
- `vitest.config.ts`
- `src/test/setup.ts`
- `tests/e2e/`
- `playwright.config.ts`
- `playwright.smoke.config.ts`
- `src/router/AppRouter.tsx`
- `src/lib/featureFlags.ts`

Requested path mismatch:

- `src/config/featureFlags.ts` (actual file is `src/lib/featureFlags.ts`)

Placement v3 docs read after the broader repo inventory:

- `docs/placement-v3-integration-status.md`
- `docs/placement-v3-integration-bugs.md`

## Test Setup Files Found

- `vitest.config.ts`
  - Uses `@vitejs/plugin-react` and `vite-tsconfig-paths`.
  - Test environment is `jsdom`.
  - Setup file is `./src/test/setup.ts`.
  - Excludes `tests/e2e`, Playwright paths, `dist`, `node_modules`, and nested `.claude/worktrees`.
  - Runs with `pool: "threads"`, `clearMocks: true`, `restoreMocks: true`, and `mockReset: true`.
  - Test timeout is 15 seconds.
- `src/test/setup.ts`
  - Imports `@testing-library/jest-dom/vitest`.
  - Patches CommonJS `require("@/...")` resolution to the repo `src` directory with `.ts/.tsx/.js/.jsx` fallback.
  - Adds jsdom stubs for `window.matchMedia`, `ResizeObserver`, global `ResizeObserver`, and `window.scrollTo` when absent.
- `playwright.config.ts`
  - Legacy visual regression config for `./e2e`.
  - Starts `npm run dev:frontend` on `127.0.0.1:3107`.
  - Runs chromium, firefox, webkit, mobile-chrome, and mobile-safari.
- `playwright.smoke.config.ts`
  - Smoke suite config for `./tests/e2e`.
  - `npm run test:e2e` uses this config.
  - Runs one Chromium worker, non-parallel, against `TEST_BASE_URL` or `http://127.0.0.1:3107`.
  - Starts `npm run dev:frontend` and reuses an existing dev server outside CI.

## Storage Mocks Found

- Vitest setup does not replace `localStorage` or `sessionStorage`; jsdom's storage implementation is used.
- E2E tests read Supabase auth session data directly from browser `localStorage` keys matching `sb-*-auth-token`.
- Web Speech and external paid services are stubbed in `tests/e2e/fixtures/mocks.ts`.
  - `SpeechRecognition` and `webkitSpeechRecognition` are deterministic browser-side stubs.
  - `speechSynthesis.speak` is replaced with a no-op that fires `onend`.
  - OpenAI, Anthropic, and Stripe URLs are fulfilled with local JSON responses.

## Supabase Auth Test Behavior

- Vitest has a reusable mock at `src/test/mocks/supabaseMock.ts`, but the global setup does not auto-mock Supabase.
- E2E uses real Supabase credentials from environment variables:
  - `TEST_SUPABASE_URL`
  - `TEST_SUPABASE_ANON_KEY`
  - `TEST_SUPABASE_SERVICE_KEY`
  - `TEST_USER_EMAIL` / `TEST_USER_PASSWORD`
  - `TEST_ADMIN_EMAIL` / `TEST_ADMIN_PASSWORD`
- `tests/e2e/fixtures/db.ts` creates anon and service-role clients with `persistSession: false` and `autoRefreshToken: false`.
- Missing E2E credentials cause suite-level skips via Playwright `test.skip(...)`.
- Signup and signin helpers drive the real UI, then tests inspect browser storage or DB state.

## Playwright Configs Found

- `playwright.config.ts`: legacy visual regression suite under `e2e`.
- `playwright.smoke.config.ts`: smoke suite under `tests/e2e`, used by `npm run test:e2e`.

## Placement / Feature Flag Routing

- `src/router/AppRouter.tsx` gates Placement v3 routes on `FEATURE_FLAGS.PLACEMENT_V3_UI_ENABLED`; if that is off and `PLACEMENT_TEST_ENABLED` is on, the legacy v2 page is used.
- `src/lib/featureFlags.ts` reads `VITE_PLACEMENT_TEST_ENABLED` and `VITE_PLACEMENT_V3_UI_ENABLED`, defaulting both placement surfaces off.
- The current Placement v3 vertical is `tests/e2e/placement-v3-vertical.spec.ts`.
- The working E2E invocation needs placement Vite env flags:
  - `VITE_PLACEMENT_TEST_ENABLED=true`
  - `VITE_PLACEMENT_V3_UI_ENABLED=true`
  - placeholder Supabase URL/key values for the smoke server bundle.

## Known Fragile Areas

- E2E depends on external test Supabase project configuration and seeded accounts.
- E2E signup/signin selectors are intentionally broad and may fail on auth UI copy or form markup changes.
- Placement E2E expectations conflict with compile-time `PLACEMENT_TEST_ENABLED: false` unless the target branch or environment changes that flag.
- Some E2E tests intentionally skip when required env vars or feature cohorts are missing, which can hide lack of real vertical coverage unless the raw logs are reviewed.
- Full `npm test` stability can be affected by shared browser globals because Vitest uses threaded workers and jsdom.
- `npm run build` runs `prebuild` via `rooms:check`, so build verification also depends on room registry generation and room validation.
