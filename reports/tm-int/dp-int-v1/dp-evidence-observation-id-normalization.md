# DP INT v1 F Evidence: Observation ID Normalization

Workpack:
- DP-EVIDENCE-WP-000002

Implementation commit: d04dbfce7

Changed product/test files:
- src/lib/tm-int/runtimeReadiness/evidenceBundle.ts
- src/lib/tm-int/runtimeReadiness/__tests__/evidenceBundle.test.ts

Validation:
- npm test -- --run src/lib/tm-int/runtimeReadiness src/lib/tm-int/runtime: PASS, 13 files, 68 tests
- npm run typecheck: PASS
- npm exec eslint -- src/lib/tm-int/runtimeReadiness/evidenceBundle.ts src/lib/tm-int/runtimeReadiness/__tests__/evidenceBundle.test.ts --format json: PASS, 0 errors, 0 warnings
- git diff --check: PASS

Evidence summary:
- Observation ID normalization now includes OBS packet id, OBS task id, OBS requested audio URL, derived fact ids, and runtime event observation ids.
- Unknown referenced observation protections remain intact because DP/PED/runtime decision references are not treated as source evidence ids.
- Tests cover runtime event and OBS requested URL normalization.
- F wrote only f_done state; verified and Judge ledger remain outside F authority.
