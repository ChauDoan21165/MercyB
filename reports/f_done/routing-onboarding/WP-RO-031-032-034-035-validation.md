# Routing-Onboarding F Validation: WP-RO-031,032,034,035

Worker: F
Lane: routing-onboarding
Batch: 6

## Commands

```bash
npx eslint src/router/__tests__/signupRouteAlias.test.tsx src/router/__tests__/publicRouteRegistration.test.tsx src/router/__tests__/AppRouter.routes.test.tsx src/router/__tests__/WebOnlyRoute.test.tsx src/lib/__tests__/routeHelper.test.ts
```

Result: passed.

```bash
npx vitest run src/router/__tests__/signupRouteAlias.test.tsx src/router/__tests__/publicRouteRegistration.test.tsx src/router/__tests__/AppRouter.routes.test.tsx src/router/__tests__/WebOnlyRoute.test.tsx src/lib/__tests__/routeHelper.test.ts
```

Result: passed, 5 files, 71 tests.

```bash
git diff --check
```

Result: passed.

## Held

WP-RO-033 was not marked F done. Its expected root `AnonymousOnboardingGate` contract does not match current `AppRouter`; the current root route is the standalone public marketing landing.

## Notes

Full `npm run typecheck` was intentionally skipped because the full app typecheck is a known active compiler hot graph and is not the lane batch gate.
