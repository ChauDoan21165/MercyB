# DP-EVIDENCE-WP-000020 F evidence

## Scope

- Workpack: DP-EVIDENCE-WP-000020
- Source anchor: `src/lib/tm-int/runtimeReadiness/contracts.ts` / `RuntimeGateId`
- Objective: add replay evidence tying DP validation to known runtime gate contracts.

## Implementation

- Added `RuntimeGateContractReplayEvidence`.
- Added `createRuntimeGateContractReplayEvidence()` to replay gate id, status, required evidence fields, and required invariants from canonical runtime contracts.
- Exported the helper and added judge-rubric coverage proving promoted/candidate gates are distinguishable from planned future flows.

## Validation

- `npm test -- --run src/lib/tm-int/runtimeReadiness src/lib/tm-int/runtime`
  - PASS: 13 files, 81 tests.
- `npm run typecheck`
  - PASS: `tsc -p tsconfig.typecheck.json --noEmit`.
- `npm exec eslint -- scripts src --format json`
  - PASS: exit 0; JSON report contained zero errors and zero warnings.

## Anti-fake checks

- Source diff exists in `src/lib/tm-int/runtimeReadiness/contracts.ts` and public export diff in `src/lib/tm-int/runtimeReadiness/index.ts`.
- Test diff exists in `src/lib/tm-int/runtimeReadiness/__tests__/judgeRubric.test.ts`.
- Replay evidence is derived from canonical contracts instead of copied report text.
- No Judge ledger was written.
- F queue `verified` remains locked to 0 by factory schema.
