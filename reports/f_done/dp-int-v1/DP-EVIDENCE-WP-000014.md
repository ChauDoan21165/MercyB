# DP-EVIDENCE-WP-000014 F evidence

## Scope

- Workpack: DP-EVIDENCE-WP-000014
- Source anchor: `src/lib/tm-int/runtimeReadiness/teacherContextValidator.ts` / `validateTeacherContext`
- Objective: require DP evidence intake to pass Teacher Context validation first, with OBS and learning-signal evidence anchored before downstream output changes.

## Implementation

- Added `missing_decision_evidence_reference` to Teacher Context validation failures.
- `validateTeacherContext` now rejects DP, PED, and runtime decisions that omit OBS references.
- When learning signals are present in the bundle or Teacher Context, `validateTeacherContext` now rejects DP, PED, and runtime decisions that omit signal references.
- Added focused tests proving the validator and Judge rubric surface missing DP OBS anchors and dropped runtime learning-signal anchors.

## Validation

- `npm test -- --run src/lib/tm-int/runtimeReadiness src/lib/tm-int/runtime`
  - PASS: 13 files, 79 tests.
- `npm run typecheck`
  - PASS: `tsc -p tsconfig.typecheck.json --noEmit`.
- `npm exec eslint -- scripts src --format json`
  - PASS: exit 0; JSON report contained zero errors and zero warnings.

## Anti-fake checks

- Source diff exists in `src/lib/tm-int/runtimeReadiness/teacherContextValidator.ts`.
- Test diff exists in `src/lib/tm-int/runtimeReadiness/__tests__/teacherContextValidator.test.ts`.
- No Judge ledger was written.
- F queue `verified` remains locked to 0 by factory schema.
