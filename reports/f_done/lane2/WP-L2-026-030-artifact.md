# Lane 2 F Artifact: WP-L2-026..030

Worker: F
Lane: lane2
Batch: 6

## Workpacks

- WP-L2-026: Korean page route, hub, and local lesson source coverage.
- WP-L2-027: Italian page rendered local-content coverage plus route/hub assertions.
- WP-L2-028: English language index chrome coverage for additional public language cards.
- WP-L2-029: Hero subtitle coverage for Portuguese and Turkish EN/VI behavior.
- WP-L2-030: Unsupported learn-target routing coverage.

## Files Changed

- `src/pages/languages/__tests__/KoreanLessonsPage.test.tsx`
- `src/pages/languages/__tests__/ItalianLessonsPage.test.tsx`
- `src/pages/languages/__tests__/uiChromeEn.smoke.test.tsx`
- `src/pages/languages/__tests__/heroSubtitle.smoke.test.tsx`
- `src/pages/languages/__tests__/LanguagePairRouting.test.tsx`

## Summary

- Replaced broad Korean source walking with exact AppRouter and LanguagesIndexPage assertions.
- Added rendered Italian page assertions for local lesson content and list semantics.
- Extended EN language hub smoke coverage to additional public language cards.
- Extended hero subtitle smoke coverage to Portuguese and Turkish.
- Added unsupported `/learn/vietnamese/:target` redirect coverage.
