# DP INT v1 F Evidence: Learner Performance Claims

Workpack:
- DP-FOUNDATION-WP-000005

Implementation commit: 4e5ff9184

Changed product/test files:
- src/lib/tm-int/dp/decisionContract.ts
- src/lib/tm-int/dp/dpValidator.ts
- src/lib/tm-int/dp/__tests__/dpValidator.test.ts

Validation:
- npm test -- --run src/lib/tm-int/dp src/lib/tm-int/runtimeReadiness: PASS, 11 files, 77 tests
- npm run typecheck: PASS
- npm exec eslint -- src/lib/tm-int/dp/decisionContract.ts src/lib/tm-int/dp/dpValidator.ts src/lib/tm-int/dp/__tests__/dpValidator.test.ts --format json: PASS, 0 errors, 0 warnings
- git diff --check: PASS

Evidence summary:
- Learner performance claim type is now an explicit DP contract export.
- DP validation fails learner performance claims without a stable id, statement, rationale, or evidence citation.
- Learner weakness claims still require support, evidence, and rationale.
- Product failures remain separated from learner performance claims.
- F wrote only f_done state; verified and Judge ledger remain outside F authority.
