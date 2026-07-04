# Routing-Onboarding F Artifact: WP-RO-021..025

Worker: F
Lane: routing-onboarding
Batch: 4

## Workpacks

- WP-RO-021: Null primary fallback coverage.
- WP-RO-022: English primary fallback coverage.
- WP-RO-023: TargetSwitcher native-language label coverage.
- WP-RO-024: TargetSwitcher selected-first order coverage.
- WP-RO-025: Public target CTA accessible-name and route coverage.

## Files Changed

- `src/pages/home/__tests__/LanguageTrackHome.test.tsx`

## Summary

- Added fallback route coverage for `primaryTarget=null` and `primaryTarget="en"`.
- Added selected-first persistence assertions for multiple switcher selections.
- Added native-language visible label and bilingual aria-label assertions for TargetSwitcher.
- Existing TARGET_META-derived public language CTA route coverage remained green.
