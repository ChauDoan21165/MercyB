# Routing-Onboarding F Validation: WP-RO-017, WP-RO-018, WP-RO-019, WP-RO-046

## Commands

- `npx eslint src/router/__tests__/publicRouteRegistration.test.tsx src/router/__tests__/AppRouter.routes.test.tsx src/pages/onboarding/__tests__/OnboardingPage.test.tsx src/pages/onboarding/__tests__/OnboardingPage.lang.test.tsx`
  - Result: passed
- `npx vitest run src/router/__tests__/publicRouteRegistration.test.tsx src/router/__tests__/AppRouter.routes.test.tsx src/pages/onboarding/__tests__/OnboardingPage.test.tsx src/pages/onboarding/__tests__/OnboardingPage.lang.test.tsx`
  - Result: passed, 4 files, 91 tests

## Anti-fake checks

- No root route behavior changed.
- No skipped or weakened tests added.
- No excluded files touched.
- F queue `verified` remains 0.
- Full `npm run typecheck` intentionally skipped because the app typecheck is a known compiler hot graph and is not the batch gate for this lane.
