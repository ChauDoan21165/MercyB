# DP INT v1 F Evidence: Validator Entrypoint

Workpack:
- DP-FOUNDATION-WP-000009

Implementation commit: 23ad61dd6

Changed product/test files:
- src/lib/tm-int/dp/decisionContract.ts
- src/lib/tm-int/dp/dpValidator.ts
- src/lib/tm-int/dp/__tests__/dpValidator.test.ts

Validation:
- npm test -- --run src/lib/tm-int/dp src/lib/tm-int/runtimeReadiness: PASS, 11 files, 83 tests
- npm run typecheck: PASS
- npm exec eslint -- src/lib/tm-int/dp/decisionContract.ts src/lib/tm-int/dp/dpValidator.ts src/lib/tm-int/dp/__tests__/dpValidator.test.ts --format json: PASS, 0 errors, 0 warnings
- git diff --check: PASS

Evidence summary:
- DP decision schema version is centralized as `DP_EVIDENCE_BASED_DECISION_SCHEMA_VERSION`.
- The single `validateDpDecision` entrypoint rejects decisions with a mismatched schema version.
- Tests cover canonical schema pass and invalid schema failure.
- F wrote only f_done state; verified and Judge ledger remain outside F authority.
