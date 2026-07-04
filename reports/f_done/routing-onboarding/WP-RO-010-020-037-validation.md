# Routing-Onboarding F Validation: WP-RO-010, WP-RO-020, WP-RO-037

## Commands

- `npx eslint scripts/factory/factory-runtime.mjs scripts/__tests__/factory-runtime.test.mjs src/lib/languagePair/__tests__/anonymousPair.test.ts src/pages/onboarding/__tests__/OnboardingPage.focus.test.tsx src/lib/profile/__tests__/rlsContract.test.ts`
  - Result: passed with ignored-script warnings for the `.mjs` runtime files.
- `npx vitest run scripts/__tests__/factory-runtime.test.mjs src/lib/languagePair/__tests__/anonymousPair.test.ts src/pages/onboarding/__tests__/OnboardingPage.focus.test.tsx src/lib/profile/__tests__/rlsContract.test.ts`
  - Result: passed, 4 files, 68 tests.

## Anti-fake checks

- No product behavior changed for root, onboarding, or profile writes.
- No skipped or weakened tests added.
- `held` and `bad_workpack` are non-success statuses and are not counted as `f_done` or Judge verification.
- F queue `verified` remains 0.
- Full `npm run typecheck` intentionally skipped because the app typecheck is a known compiler hot graph and is not the batch gate for this lane.
