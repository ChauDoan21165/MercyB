# Lane 2 F Artifact: WP-L2-031..035

Worker: F
Lane: lane2
Batch: 7

## Workpacks

- WP-L2-031: Tutor language registry alignment with public lesson page targets.
- WP-L2-032: LanguageTrackHome route coverage for public language pages.
- WP-L2-033: Profession category `expected_count` cross-checks against local lessons.
- WP-L2-034: Profession lesson ID uniqueness and prefix checks.
- WP-L2-035: Profession lesson detail required-field checks.

## Files Changed

- `src/lib/tutor/__tests__/languageRegistry.test.ts`
- `src/pages/home/__tests__/LanguageTrackHome.test.tsx`
- `src/pages/professions/__tests__/ProfessionsPages.test.tsx`

## Summary

- Added a tutor registry test that checks routed onboarding target languages map to supported tutor language configs where applicable.
- Added rendered LanguageTrackHome route checks for every target with a public `/languages/:slug` page.
- Added profession data tests for category count metadata, unique profession-prefixed lesson IDs, and populated bilingual/detail lesson fields.
