# A38 Vitest Storage/Auth Stabilization

Date: 2026-05-20

## Scope

This was test infrastructure work only. No Placement V3 product behavior, UX, scoring logic, or placement runtime code was changed.

The goal was to remove shared `localStorage`/Supabase auth instability from `npm test` without skipping tests or weakening assertions.

## Baseline Failure

Baseline command:

```bash
npm test
```

Raw log:

```text
reports/a38-vitest-storage/baseline-run-1.log
```

Baseline result:

| Run | Start | Test files | Tests | Errors | Vitest duration | Wall time |
| --- | --- | --- | --- | --- | --- | --- |
| baseline-run-1 | 2026-05-20 06:42:33 | 30 failed / 351 passed / 381 total | 266 failed / 6590 passed / 6856 total | 26 | 29.89s | 30.291s |

Dominant errors:

- `window.localStorage.clear is not a function`
- `localStorage.clear is not a function`
- `localStorage.getItem is not a function`
- `window.localStorage.getItem is not a function`
- Supabase auth background errors: `TypeError: storage.getItem is not a function`

## Root Cause

There were multiple incompatible browser storage mocks in the same Vitest/jsdom environment.

Conflicting patterns found:

| File | Previous behavior | Risk |
| --- | --- | --- |
| `src/__tests__/mercy-emotion-model.test.ts` | Top-level `Object.defineProperty(globalThis, "localStorage", { value: localStorageMock })` | Replaced shared storage with a per-file plain object and did not restore it. |
| `src/__tests__/mercy-rituals.test.ts` | Top-level `Object.defineProperty(global, "localStorage", { value: localStorageMock })` | Same leak risk, using `global` instead of `window/globalThis` consistently. |
| `src/lib/__tests__/streakMigration.test.ts` | `vi.stubGlobal("localStorage", localStorageMock)` | Replaced only the global alias, not necessarily `window.localStorage`. |
| `src/lib/__tests__/streakCache.test.ts` | `vi.stubGlobal("localStorage", localStorageMock)` | Same global/window divergence. |
| `src/__tests__/teacher-mercy-engine.test.ts` | `vi.spyOn(Storage.prototype, ...)` | Order-dependent when another test had replaced storage with a non-`Storage` plain object. |
| `src/__tests__/mercy-integration.test.ts` | `vi.spyOn(Storage.prototype, ...)` plus per-test store | Could not protect tests from already-replaced global storage objects. |

The Supabase singleton made the failure wider. `src/lib/supabaseClient.ts` captured `window.localStorage` once at module import time and passed that object to Supabase auth. If a test had already installed a partial/mock storage object, Supabase auth retained it for the worker. Later auth initialization and auto-refresh work then emitted unhandled background errors from unrelated test files.

This is why many failures appeared far away from the files that installed the broken mocks.

## Fix

Changes made:

- Added `src/test/storageMock.ts` as the canonical Vitest browser storage utility.
- Installed that storage in `src/test/setup.ts` before tests run.
- Reset and re-installed canonical `localStorage` and `sessionStorage` in both `beforeEach` and `afterEach` to remove order dependence.
- Removed per-file storage objects and `Storage.prototype` spies from the affected tests.
- Changed Supabase auth storage from an import-time captured object to a defensive adapter that validates and delegates to the current `window.localStorage` at call time.
- Disabled Supabase auth auto-refresh only under `import.meta.env.MODE === "test"` so Vitest does not create auth refresh timers against placeholder credentials.

Assertions were not weakened and no tests were skipped.

## Post-Fix Evidence

Commands:

```bash
npm run typecheck
npm test
npm test
npm test
```

Raw logs:

```text
reports/a38-vitest-storage/postfix-run-1.log
reports/a38-vitest-storage/postfix-run-2.log
reports/a38-vitest-storage/postfix-run-3.log
```

Consecutive full-suite results:

| Run | Start | Test files | Tests | Status | Vitest duration | Wall time |
| --- | --- | --- | --- | --- | --- | --- |
| postfix-run-1 | 2026-05-20 06:47:07 | 381 passed / 381 total | 6856 passed / 6856 total | pass | 28.89s | 29.57s |
| postfix-run-2 | 2026-05-20 06:47:43 | 381 passed / 381 total | 6856 passed / 6856 total | pass | 33.53s | 33.94s |
| postfix-run-3 | 2026-05-20 06:48:23 | 381 passed / 381 total | 6856 passed / 6856 total | pass | 64.55s | 65.35s |

Before/after failure counts:

| Metric | Before | After |
| --- | ---: | ---: |
| Failed test files | 30 | 0 |
| Failed tests | 266 | 0 |
| Unhandled errors | 26 | 0 |
| Full consecutive passing runs | 0 | 3 |

## Flaky-Test Inventory

Storage/auth-related failures observed before the fix:

- `src/pages/onboarding/__tests__/OnboardingPage.test.tsx`: repeated `window.localStorage.clear is not a function`.
- `src/lib/teacher-mercy/__tests__/generateTeachingTurn.voice.snapshots.test.ts`: `localStorage.clear is not a function`.
- `src/lib/tracking/__tests__/initMarketingTracking.test.ts`: consent initialization assertions failed after storage reads broke.
- `src/__tests__/mercy-logs-and-teacher.test.ts`: logs did not persist because storage access failed.
- `src/lib/writing/__tests__/writing.test.ts`: draft storage setup failed on `window.localStorage.clear`.
- `src/lib/teacher-mercy/learningStyleProfile.test.ts`: profile persistence failed after storage access failed.
- `src/lib/stories/__tests__/storyPromptGate.test.ts`: storage setup failed.
- `src/lib/languagePair/__tests__/anonymousPair.test.ts`: storage setup failed.
- `src/components/home/__tests__/RecommendedDrillCard.test.ts`: `localStorage.clear is not a function`.
- `src/__tests__/navigation.integration.test.tsx`: render path crashed in `BottomMusicBar` at `localStorage.getItem`.
- Supabase-auth importing tests such as `src/lib/__tests__/authHelpers.test.ts`: background `storage.getItem is not a function` from retained broken storage.

After the fix, no flaky storage/auth failures reproduced in three consecutive full `npm test` runs.

Remaining warnings in passing runs are intentional test-path warnings, not storage/auth failures:

- Missing local Supabase env warning from placeholder test config.
- React Router v7 future-flag warnings.
- Expected negative-path console errors in tests that assert fail-soft behavior.
- Missing `VITE_SUPABASE_URL` audio warnings in tests that render room chrome.

## Stabilization Methodology

1. Audited Vitest config, setup files, jsdom setup, direct browser storage mocks, and Supabase browser client initialization.
2. Captured one full baseline run with raw failures and timing.
3. Reduced the cause to storage identity divergence plus Supabase import-time retention.
4. Added a single canonical Storage-shaped in-memory mock.
5. Installed and reset that mock globally from the shared Vitest setup.
6. Removed test-local storage mocks instead of adding more fallback code.
7. Made Supabase auth storage defensive in tests and production by delegating at call time.
8. Ran typecheck.
9. Ran three full `npm test` passes consecutively.

## Hard Gate

Met: `npm test` passed 3 consecutive full runs after the storage/auth stabilization.
