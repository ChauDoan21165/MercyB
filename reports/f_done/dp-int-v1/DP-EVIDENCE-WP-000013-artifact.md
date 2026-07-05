# DP-EVIDENCE-WP-000013 f_done Artifact

## Workpack

- `wp_id`: `DP-EVIDENCE-WP-000013`
- `semantic_key`: `dp.dp.evidence.signal_key_set_replay_01`
- Objective: Add replay evidence for the cited DP invariant so OBS to DP to PED behavior is reproducible.

## Product/Test Change

- Updated `src/lib/tm-int/runtimeReadiness/evidenceBundle.ts` so `signalKeysFromBundle()` returns signal keys emitted by the learning-signal evidence source, not keys cited later by DP, PED, or runtime decisions.
- Updated `src/lib/tm-int/runtimeReadiness/teacherContextValidator.ts` to validate signal references from Teacher Context, DP, PED, and runtime decisions with exact failure paths.
- Added regression coverage in `src/lib/tm-int/runtimeReadiness/__tests__/teacherContextValidator.test.ts` proving a forged DP signal key fails both `validateTeacherContext()` and `judgeRuntimeReadinessEvidence()`.
- Updated `src/lib/tm-int/runtimeReadiness/__tests__/evidenceBundle.test.ts` to lock the emitted-signal-only behavior.

## Validation

- `npm test -- --run src/lib/tm-int/runtimeReadiness src/lib/tm-int/runtime` PASS: 13 files, 76 tests.
- `npm run typecheck` PASS.
- `npm exec eslint -- src/lib/tm-int/runtimeReadiness/evidenceBundle.ts src/lib/tm-int/runtimeReadiness/teacherContextValidator.ts src/lib/tm-int/runtimeReadiness/__tests__/evidenceBundle.test.ts src/lib/tm-int/runtimeReadiness/__tests__/teacherContextValidator.test.ts --format stylish` PASS.
- `git diff --check` PASS.

## Anti-Fake Checks

- Source diff exercises the cited `signalKeysFromBundle` anchor.
- Negative fixture uses the real runtime-readiness bundle shape and Judge rubric path.
- F queue `verified` remains locked to `0`; no Judge ledger write was made.
