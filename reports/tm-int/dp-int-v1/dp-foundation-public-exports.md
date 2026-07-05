# DP INT v1 F Evidence: Public DP Exports

Workpack:
- DP-FOUNDATION-WP-000010

Implementation commit: 978054c96

Changed product/test files:
- src/lib/tm-int/dp/__tests__/publicExports.test.ts

Validation:
- npm test -- --run src/lib/tm-int/dp src/lib/tm-int/runtimeReadiness: PASS, 12 files, 84 tests
- npm run typecheck: PASS
- npm exec eslint -- src/lib/tm-int/dp --format json: PASS, 0 errors, 0 warnings
- git diff --check: PASS

Evidence summary:
- DP public index is covered by a test importing the decision contract helpers and validator.
- Test proves downstream code can import schema version, Teacher Context reference helper, PED gate helper, evidence-rationale helper, confidence guard, and validator from `src/lib/tm-int/dp`.
- F wrote only f_done state; verified and Judge ledger remain outside F authority.
