# DP-PRODUCT-ISSUE-WP-000003 f_done

Worker: F-DP-INT-W2
Commit: 223e2fb42
Workpack: DP-PRODUCT-ISSUE-WP-000003

## Scope

- Source: `src/lib/tm-int/obs/detectors/audio.ts`
- Test: `src/lib/tm-int/obs/__tests__/audioObservation.test.ts`

## Implementation

- Marked `AudioPlaybackFailed` observations with `metrics.productEvidence = 1`.
- Added regression coverage that creates a real OBS packet from `detectAudioObservations` and verifies DP emits `product_failure_audio`, `invalid_listening`, and `retest_required`.
- Asserted the playback-failure OBS-to-DP path does not emit learner-weakness or verified language.

## Validation Evidence

- `npm test -- --run src/lib/tm-int src/components/placement`
  - Passed: 28 test files, 210 tests.
- `npm run typecheck`
  - Passed.
- `npm exec eslint -- scripts src --format json`
  - Passed with exit code 0.

## Factory Notes

- F queue verified remains locked at 0.
- No Judge ledger rows were written.
- No deploy, push, or merge was performed.
