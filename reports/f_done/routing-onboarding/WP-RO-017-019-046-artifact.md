# Routing-Onboarding F Artifact: WP-RO-017, WP-RO-018, WP-RO-019, WP-RO-046

Worker: F
Lane: routing-onboarding

## Workpacks completed

- WP-RO-017: strengthened onboarding Back navigation coverage so returning from target to native and re-picking English resets targets from the new native choice.
- WP-RO-018: strengthened `?direction=vn` multi-target coverage so English native is preserved and target order is primary-first after selecting Spanish.
- WP-RO-019: strengthened onboarding language-attribute coverage so EN-native target headings cannot inherit stale Vietnamese `lang` or copy.
- WP-RO-046: replacement for stale WP-RO-033. Protected current product truth that `/` remains `MarketingLandingPage`, `/onboarding` remains `OnboardingPage`, and root is not wrapped in `AnonymousOnboardingGate`.

## Files changed

- `reports/routing-onboarding-workpacks.json`
- `src/pages/onboarding/__tests__/OnboardingPage.test.tsx`
- `src/pages/onboarding/__tests__/OnboardingPage.lang.test.tsx`
- `src/router/__tests__/AppRouter.routes.test.tsx`
- `src/router/__tests__/publicRouteRegistration.test.tsx`

## Notes

WP-RO-033 was not completed. The runtime does not provide a held or bad-workpack status, so it remains `running` and unverified. WP-RO-046 is the replacement workpack for the corrected current root/onboarding product truth.
