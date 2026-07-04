# Routing-Onboarding F Artifact: WP-RO-010, WP-RO-020, WP-RO-037

Worker: F
Lane: routing-onboarding

## Workpacks completed

- WP-RO-010: added anonymous-pair no-window coverage so read/write/clear paths are safe when browser globals are unavailable.
- WP-RO-020: added rendered onboarding copy-matrix coverage for VI-native and EN-native target menus, including badge language and unavailable Spanish behavior.
- WP-RO-037: extended the profile RLS contract test so `native_language` and `target_languages` remain legitimate writable profile fields.

## Files changed

- `src/lib/languagePair/__tests__/anonymousPair.test.ts`
- `src/pages/onboarding/__tests__/OnboardingPage.focus.test.tsx`
- `src/lib/profile/__tests__/rlsContract.test.ts`

## Non-progress workpacks

- WP-RO-016 was marked `bad_workpack`, not completed, because its expected behavior is stale. Current product truth intentionally soft-fails onboarding profile-write errors and navigates after local pair persistence.
