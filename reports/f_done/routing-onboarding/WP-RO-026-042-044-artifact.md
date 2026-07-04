# Routing-Onboarding F Artifact: WP-RO-026, WP-RO-042, WP-RO-043, WP-RO-044

Worker: F
Lane: routing-onboarding

## Workpacks completed

- WP-RO-026: strengthened Home placement CTA coverage by asserting the canonical home path before routing to `/placement`.
- WP-RO-042: added unsupported learn-pair fallback coverage for unknown native/target combinations.
- WP-RO-043: added TARGET_META-derived learn-pair redirect coverage for public target slugs.
- WP-RO-044: added LanguageTrackHome CTA label cross-checks against TARGET_META and targetLabel.

## Files changed

- `src/pages/home/__tests__/HomePlacementCta.test.tsx`
- `src/pages/home/__tests__/LanguageTrackHome.test.tsx`
- `src/pages/languages/__tests__/LanguagePairRouting.test.tsx`
