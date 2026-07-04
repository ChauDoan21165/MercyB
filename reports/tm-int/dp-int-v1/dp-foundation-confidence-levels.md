# DP INT v1 F Evidence: Confidence Levels

Workpack:
- DP-FOUNDATION-WP-000006

Implementation commit: af40e5375

Changed product/test files:
- src/lib/tm-int/dp/decisionContract.ts
- src/lib/tm-int/dp/dpValidator.ts
- src/lib/tm-int/dp/__tests__/dpValidator.test.ts

Validation:
- npm test -- --run src/lib/tm-int/dp src/lib/tm-int/runtimeReadiness: PASS, 11 files, 78 tests
- npm run typecheck: PASS
- npm exec eslint -- src/lib/tm-int/dp/decisionContract.ts src/lib/tm-int/dp/dpValidator.ts src/lib/tm-int/dp/__tests__/dpValidator.test.ts --format json: PASS, 0 errors, 0 warnings
- git diff --check: PASS

Evidence summary:
- DP confidence levels are centralized as `DP_DECISION_CONFIDENCE_LEVELS`.
- DP validation uses the exported confidence type guard instead of duplicating allowed values.
- Tests prove low, medium, and high pass, while non-canonical confidence still fails.
- F wrote only f_done state; verified and Judge ledger remain outside F authority.
