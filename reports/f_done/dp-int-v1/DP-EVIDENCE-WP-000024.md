# DP-EVIDENCE-WP-000024 F evidence

## Scope

- Workpack: DP-EVIDENCE-WP-000024
- Source anchor: `src/lib/tm-int/runtimeReadiness/teacherContextValidator.ts` / `validateTeacherContext`
- Objective: add deterministic fixtures for the cited DP invariant so tests do not depend on hand-built samples.

## Implementation

- Added `createTeacherContextValidatorFixture()` in `src/lib/tm-int/runtimeReadiness/fixtureBuilder.ts`.
- Exported the fixture helper from the runtime-readiness public index.
- Added coverage proving the deterministic fixture passes Teacher Context validation.
- Added coverage proving the fixture is rejected when DP recasts a product issue as learner weakness.

## Validation

- `npm run typecheck`
  - PASS: `tsc -p tsconfig.typecheck.json --noEmit`.
- `npm test -- --run src/lib/tm-int/runtimeReadiness/__tests__/fixtureBuilder.test.ts src/lib/tm-int/runtimeReadiness/__tests__/teacherContextValidator.test.ts`
  - PASS: 2 files, 27 tests.
- `npm exec eslint -- src/lib/tm-int/runtimeReadiness/fixtureBuilder.ts src/lib/tm-int/runtimeReadiness/index.ts src/lib/tm-int/runtimeReadiness/__tests__/fixtureBuilder.test.ts src/lib/tm-int/runtimeReadiness/__tests__/teacherContextValidator.test.ts --format stylish`
  - PASS: exit 0.
- `git diff --check`
  - PASS.

## Recovery Note

- Recovery fixed only the learning-signal key mismatch by using canonical `productive_hesitation`.
- No Judge ledger was written.
- F queue `verified` remains locked to 0 by factory schema.
