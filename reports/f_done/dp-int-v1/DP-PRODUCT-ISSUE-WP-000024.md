# DP-PRODUCT-ISSUE-WP-000024 f_done

Worker: F-DP-INT-W2
Commit: 51a8467bf
Workpack: DP-PRODUCT-ISSUE-WP-000024

## Scope

- Source: `src/lib/tm-int/dp/speech.ts`
- Test: `src/lib/tm-int/__tests__/tc000002MicrophoneDenied.test.ts`

## Implementation

- Added `createSpeechProductBlockDpFixture` as a deterministic DP-owned fixture for microphone permission blocks.
- The fixture builds a real OBS packet and DP packet for `MicPermissionDenied`.
- Added regression coverage proving the fixture is deterministic, emits `product_or_permission_block`, sets `invalid_speaking`, cites its source fact, and avoids learner-weakness or verified language.

## Validation Evidence

- `npm test -- --run src/lib/tm-int src/components/placement`
  - Passed: 28 test files, 212 tests.
- `npm run typecheck`
  - Passed.
- `npm exec eslint -- scripts src --format json`
  - Passed with exit code 0.

## Factory Notes

- F queue verified remains locked at 0.
- No Judge ledger rows were written.
- No deploy, push, or merge was performed.
