# Routing-Onboarding F Artifact: WP-RO-027..030

Worker: F
Lane: routing-onboarding
Batch: 5

## Workpacks

- WP-RO-027: Malformed stored pair gate coverage.
- WP-RO-028: Invalid-native stored pair gate coverage.
- WP-RO-029: CTA query-param escape hatch variants.
- WP-RO-030: Auth loading cache behavior.

## Files Changed

- `src/router/__tests__/AnonymousOnboardingGate.test.tsx`

## Summary

- Added tests proving malformed and invalid-native anonymous pair blobs do not bypass first-time anonymous landing behavior.
- Added tests for empty and repeated `trypron` CTA query-param signals.
- Added a rerender test proving a resolved signed-in user stays on Home during a later auth loading flip.
