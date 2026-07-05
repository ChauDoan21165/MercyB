# DP-EVIDENCE-WP-000017 F evidence

## Scope

- Workpack: DP-EVIDENCE-WP-000017
- Source anchor: `src/lib/tm-int/obs/types.ts` / `ObservationPacket`
- Objective: add deterministic fixtures for ObservationPacket DP citation evidence.

## Implementation

- Added `ObservationPacketFixtureName` with the deterministic `dp-citation` fixture name.
- Added `createObservationPacketFixture("dp-citation")`, generated through existing OBS audio, speech, and learning detectors.
- Added OBS packet tests proving the fixture is valid, stable across calls, and grounded in recorded fact types/task anchors.

## Validation

- `npm test -- --run src/lib/tm-int/runtimeReadiness src/lib/tm-int/runtime src/lib/tm-int/obs/__tests__/observationPacket.test.ts`
  - PASS: 14 files, 82 tests.
- `npm run typecheck`
  - PASS: `tsc -p tsconfig.typecheck.json --noEmit`.
- `npm exec eslint -- scripts src --format json`
  - PASS: exit 0; JSON report contained zero errors and zero warnings.

## Anti-fake checks

- Source diff exists in `src/lib/tm-int/obs/types.ts` and `src/lib/tm-int/obs/evidencePacket.ts`.
- Test diff exists in `src/lib/tm-int/obs/__tests__/observationPacket.test.ts`.
- Fixture data is produced by detectors, not a report-only artifact or UI-only state.
- No Judge ledger was written.
- F queue `verified` remains locked to 0 by factory schema.
