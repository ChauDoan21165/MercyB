# Routing-Onboarding F Validation: WP-RO-026, WP-RO-042, WP-RO-043, WP-RO-044

## Commands

- `npx eslint src/pages/home/__tests__/HomePlacementCta.test.tsx src/pages/home/__tests__/LanguageTrackHome.test.tsx src/pages/languages/__tests__/LanguagePairRouting.test.tsx`
  - Result: passed.
- `npx vitest run src/pages/home/__tests__/HomePlacementCta.test.tsx src/pages/home/__tests__/LanguageTrackHome.test.tsx src/pages/languages/__tests__/LanguagePairRouting.test.tsx`
  - Result: passed, 3 files, 37 tests.

## Anti-fake checks

- No product behavior changed.
- No skipped or weakened tests added.
- Bad workpacks remain excluded from progress.
- F queue `verified` remains 0.
- Full `npm run typecheck` intentionally skipped because the app typecheck is a known compiler hot graph.
