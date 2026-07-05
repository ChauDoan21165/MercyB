# DP INT v1 F Evidence: Signal Key Normalization

Workpack:
- DP-EVIDENCE-WP-000003

Implementation commit: 8980f3c0f

Changed product/test files:
- src/lib/tm-int/runtimeReadiness/evidenceBundle.ts
- src/lib/tm-int/runtimeReadiness/__tests__/evidenceBundle.test.ts

Validation:
- npm test -- --run src/lib/tm-int/runtimeReadiness src/lib/tm-int/runtime: PASS, 13 files, 69 tests
- npm run typecheck: PASS
- npm exec eslint -- src/lib/tm-int/runtimeReadiness/evidenceBundle.ts src/lib/tm-int/runtimeReadiness/__tests__/evidenceBundle.test.ts --format json: PASS, 0 errors, 0 warnings
- git diff --check: PASS

Evidence summary:
- `signalKeysFromBundle` now normalizes emitted learning signals plus DP, PED, and runtime decision signal references.
- Tests cover source signal and decision-stage signal key normalization.
- F wrote only f_done state; verified and Judge ledger remain outside F authority.
