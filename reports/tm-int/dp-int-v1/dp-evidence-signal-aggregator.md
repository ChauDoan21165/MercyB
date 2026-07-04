# DP INT v1 F Evidence: Learning Signal Preservation

Workpack:
- DP-EVIDENCE-WP-000006

Implementation commit: 65d3d5931

Changed product/test files:
- src/lib/tm-int/dp/evidenceIntake.ts
- src/lib/tm-int/dp/__tests__/evidenceIntake.test.ts

Validation:
- npm test -- --run src/lib/tm-int/dp src/lib/tm-int/runtimeReadiness src/lib/tm-int/runtime: PASS, 16 files, 97 tests
- npm run typecheck: PASS
- npm exec eslint -- src/lib/tm-int/dp/evidenceIntake.ts src/lib/tm-int/dp/__tests__/evidenceIntake.test.ts --format json: PASS, 0 errors, 0 warnings
- git diff --check: PASS

Evidence summary:
- DP evidence intake now exposes `learningSignalsForDpEvidence`.
- The helper preserves runtime aggregated learning signals while returning copied signal and alternatives arrays.
- Tests prove emitted learning signal keys and alternatives are preserved without sharing mutable arrays.
- F wrote only f_done state; verified and Judge ledger remain outside F authority.
