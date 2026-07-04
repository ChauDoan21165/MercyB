# DP-PRODUCT-ISSUE-WP-000025 f_done

Worker: F-DP-INT-W2
Commit: a26fff6a2
Workpack: DP-PRODUCT-ISSUE-WP-000025

## Scope

- Source: `src/lib/tm-int/obs/detectors/speech.ts`
- Test: `src/lib/tm-int/obs/__tests__/observationPacket.test.ts`

## Implementation

- Added `productEvidence: 1` to `SpeechTimeout` observation metrics while preserving `timeoutMs`.
- Added regression coverage that builds a real OBS packet from `detectSpeechObservations` and verifies DP emits `product_or_permission_block` with `invalid_speaking`.
- Asserted the speech-timeout OBS-to-DP path does not emit weak-speaking, learner-weakness, or verified language.

## Validation Evidence

- `npm test -- --run src/lib/tm-int src/components/placement`
  - Passed: 28 test files, 213 tests.
- `npm run typecheck`
  - Passed.
- `npm exec eslint -- scripts src --format json`
  - Passed with exit code 0.

## Factory Notes

- F queue verified remains locked at 0.
- No Judge ledger rows were written.
- No deploy, push, or merge was performed.
