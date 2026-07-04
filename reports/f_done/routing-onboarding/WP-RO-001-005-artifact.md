# Routing-Onboarding F Artifact: WP-RO-001..005

Worker: F
Lane: routing-onboarding
Batch: 1

## Workpacks

- WP-RO-001: Native-domain parser coverage.
- WP-RO-002: Target-domain parser coverage derived from `TARGET_META`.
- WP-RO-003: `withPrimary` no-mutation coverage.
- WP-RO-004: Malformed target value parser defense.
- WP-RO-005: Primary-target invariant coverage after invalid/duplicate filtering.

## Files Changed

- `reports/routing-onboarding-workpacks.json`
- `src/lib/languagePair/__tests__/languagePair.test.ts`

## Summary

- Created 45 real routing/onboarding workpacks and imported them into the reusable Factory Runtime as `routing-onboarding`.
- Strengthened `parseLanguagePair` tests for onboarding native options, target metadata alignment, malformed target data, and primary-target derivation.
- Strengthened `withPrimary` tests to prove the caller-owned target array is not mutated.
