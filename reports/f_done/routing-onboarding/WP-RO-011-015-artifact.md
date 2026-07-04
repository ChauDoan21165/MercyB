# Routing-Onboarding F Artifact: WP-RO-011..015

Worker: F
Lane: routing-onboarding
Batch: 3

## Workpacks

- WP-RO-011: Native target-menu matrix coverage.
- WP-RO-012: Recommended/default target coverage.
- WP-RO-013: Multi-target start-with flow coverage.
- WP-RO-014: Anonymous finish local-persistence coverage.
- WP-RO-015: Profile invalidation scope coverage.

## Files Changed

- `src/pages/onboarding/__tests__/OnboardingPage.test.tsx`

## Summary

- Added TARGET_MENU-derived rendered coverage for VI-native and EN-native target menus.
- Added recommended-target/preselected-target assertions for default and `direction=vn` entry paths.
- Added anonymous single-target completion coverage proving localStorage persistence, native mirror write, no Supabase write, and no profile invalidation.
- Existing multi-target and signed-in invalidation coverage remained green under the expanded focused suite.
