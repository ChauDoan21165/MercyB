# Lane 2 F Artifact: WP-L2-006 through WP-L2-010

Worker: F
Lane: lane2
Workpacks:
- WP-L2-006: profession router registration coverage
- WP-L2-007: languages index all public cards coverage
- WP-L2-008: app router all language lesson routes coverage
- WP-L2-009: no Supabase loader common coverage for local language pages
- WP-L2-010: no fake media/AI common coverage for local language pages

Files changed:
- `src/pages/professions/__tests__/ProfessionsPages.test.tsx`
- `src/pages/languages/__tests__/LanguagePairRouting.test.tsx`

Implemented changes:
- Added a profession route registration guard that source-checks `src/router/AppRouter.tsx` for every active profession route and page component used by the professions hub.
- Added language hub coverage that renders `LanguagesIndexPage` with `UiLanguageProvider` and verifies every public language lesson href and default visible label.
- Added AppRouter source coverage for all public language lesson routes and component registrations.
- Added common source-boundary coverage for local-content language pages to reject Supabase lesson loaders, placeholder Promise media/tutor patterns, and fake audio/AI/tutor markers.

Acceptance:
- All five workpacks produced real focused test coverage.
- No product page, router, database, deployment, Thai gate, or Thai queue behavior was changed.
- F did not mark any row verified.
