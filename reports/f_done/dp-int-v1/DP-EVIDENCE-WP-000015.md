# DP-EVIDENCE-WP-000015 F evidence

## Scope

- Workpack: DP-EVIDENCE-WP-000015
- Source anchor: `src/lib/tm-int/runtime/contextBuilder.ts` / `buildTeacherContext`
- Objective: expose runtime Teacher Context builder evidence so DP intake remains anchored to OBS packets.

## Implementation

- Added builder-emitted `observationSummary.factTypeCounts`.
- Extended the Teacher Context type so downstream review surfaces can read OBS fact counts without recomputing from raw packets.
- Added pipeline coverage proving repeated OBS facts remain reviewable as counts in Teacher Context evidence.

## Validation

- `npm test -- --run src/lib/tm-int/runtimeReadiness src/lib/tm-int/runtime`
  - PASS: 13 files, 79 tests.
- `npm run typecheck`
  - PASS: `tsc -p tsconfig.typecheck.json --noEmit`.
- `npm exec eslint -- scripts src --format json`
  - PASS: exit 0; JSON report contained zero errors and zero warnings.

## Anti-fake checks

- Source diff exists in `src/lib/tm-int/runtime/contextBuilder.ts` and `src/lib/tm-int/runtime/types.ts`.
- Test diff exists in `src/lib/tm-int/runtime/__tests__/teacherContextPipeline.test.ts`.
- No Judge ledger was written.
- F queue `verified` remains locked to 0 by factory schema.
