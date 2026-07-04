# DP-EVIDENCE-WP-000012 f_done Artifact

## Workpack

- `wp_id`: `DP-EVIDENCE-WP-000012`
- `semantic_key`: `dp.dp.evidence.observation_id_set_negative_path_01`
- Objective: Add a negative-path fixture so unsafe learner claims are rejected when decisions cite observations not present in runtime evidence.

## Product/Test Change

- Updated `src/lib/tm-int/runtimeReadiness/teacherContextValidator.ts` to preserve the exact citation path for observation references from `runtimeEvent`, `dpDecision`, `pedDecision`, `runtimeDecision`, and Teacher Context.
- Added regression coverage in `src/lib/tm-int/runtimeReadiness/__tests__/teacherContextValidator.test.ts` for a forged DP observation id.
- Confirmed the forged DP observation id fails both `validateTeacherContext()` and `judgeRuntimeReadinessEvidence()` before DP evidence is trusted.

## Validation

- `npm test -- --run src/lib/tm-int/runtimeReadiness src/lib/tm-int/runtime` PASS: 13 files, 74 tests.
- `npm run typecheck` PASS.
- `npm exec eslint -- scripts src --format json` PASS: 4,929 files, 0 errors, 0 warnings.

## Anti-Fake Checks

- Source diff exercises the validator path that normalizes evidence-bundle observation ids.
- Negative fixture uses the real runtime-readiness bundle shape and Judge rubric path.
- F queue `verified` remains locked to `0`; no Judge ledger write was made.
