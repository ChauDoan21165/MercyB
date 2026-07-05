# DP-EVIDENCE-WP-000019 F evidence

## Scope

- Workpack: DP-EVIDENCE-WP-000019
- Source anchor: `src/lib/placement/v3/runtimeIntegration.ts` / `buildPlacementTeacherContext`
- Objective: treat placement runtime integration as a real DP evidence source and reject unsafe learner-weakness claims.

## Implementation

- Added `buildPlacementRuntimeEvidenceBundle` to assemble RR-001 runtime evidence directly from placement OBS timeline and Teacher Context output.
- Updated placement DP intake coverage to use the integration helper instead of a hand-built test bundle.
- Added a negative-path test proving placement product failures are rejected when classified as learner weakness.

## Validation

- `npm test -- --run src/lib/tm-int/runtimeReadiness src/lib/tm-int/runtime src/components/placement/v3/__tests__/runtimeIntegration.test.ts`
  - PASS: 14 files, 87 tests.
- `npm run typecheck`
  - PASS: `tsc -p tsconfig.typecheck.json --noEmit`.
- `npm exec eslint -- scripts src --format json`
  - PASS: exit 0; JSON report contained zero errors and zero warnings.

## Anti-fake checks

- Source diff exists in `src/lib/placement/v3/runtimeIntegration.ts`.
- Test diff exists in `src/components/placement/v3/__tests__/runtimeIntegration.test.ts`.
- Negative path uses real placement OBS timeline, Teacher Context, DP intake validation, and `product_failure_as_learner_weakness`.
- No Judge ledger was written.
- F queue `verified` remains locked to 0 by factory schema.
