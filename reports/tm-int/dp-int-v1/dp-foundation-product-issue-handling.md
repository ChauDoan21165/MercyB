# DP INT v1 F Evidence: Product Issue Handling

Workpack:
- DP-FOUNDATION-WP-000004

Implementation commit: 7ad84f5ed

Changed product/test files:
- src/lib/tm-int/dp/decisionContract.ts
- src/lib/tm-int/dp/dpValidator.ts
- src/lib/tm-int/dp/__tests__/dpValidator.test.ts

Validation:
- npm test -- --run src/lib/tm-int/dp src/lib/tm-int/runtimeReadiness: PASS, 11 files, 76 tests
- npm run typecheck: PASS
- npm exec eslint -- src/lib/tm-int/dp/decisionContract.ts src/lib/tm-int/dp/dpValidator.ts src/lib/tm-int/dp/__tests__/dpValidator.test.ts --format json: PASS, 0 errors, 0 warnings
- git diff --check: PASS

Evidence summary:
- DP product issue types are now typed from Teacher Context product issue values.
- DP validation fails when product issues are present but issue types are omitted.
- DP validation fails when product issue rationale is empty.
- Product failures remain product issues and are not learner weakness.
- F wrote only f_done state; verified and Judge ledger remain outside F authority.
