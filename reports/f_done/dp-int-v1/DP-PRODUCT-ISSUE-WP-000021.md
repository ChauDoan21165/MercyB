# DP-PRODUCT-ISSUE-WP-000021 f_done

Worker: F-DP-INT-W2
Commit: c4a64c966
Workpack: DP-PRODUCT-ISSUE-WP-000021

## Scope

- Source: `src/lib/tm-int/dp/audio.ts`
- Test: `src/lib/tm-int/__tests__/tc000001PlacementAudioUnavailable.test.ts`

## Implementation

- Exported `PRODUCT_FAILURE_AUDIO_FACT_TYPES` as the DP audio product-failure contract.
- Added `isAudioProductFailureFact` and routed `buildAudioDecisionEvidence` through it.
- Added regression coverage proving all product-failure audio facts are accepted, replay-only facts are ignored, and mixed replay/playback evidence produces only `AudioPlaybackFailed` product-failure DP evidence.

## Validation Evidence

- `npm test -- --run src/lib/tm-int src/components/placement`
  - Passed: 28 test files, 211 tests.
- `npm run typecheck`
  - Passed.
- `npm exec eslint -- scripts src --format json`
  - Passed with exit code 0.

## Factory Notes

- F queue verified remains locked at 0.
- No Judge ledger rows were written.
- No deploy, push, or merge was performed.
