# DP INT v1 F Evidence: Recommendation Rationale

Workpack:
- DP-FOUNDATION-WP-000008

Implementation commit: 72a8bcbff

Changed product/test files:
- src/lib/tm-int/dp/decisionContract.ts
- src/lib/tm-int/dp/dpValidator.ts
- src/lib/tm-int/dp/__tests__/dpValidator.test.ts

Validation:
- npm test -- --run src/lib/tm-int/dp src/lib/tm-int/runtimeReadiness: PASS, 11 files, 81 tests
- npm run typecheck: PASS
- npm exec eslint -- src/lib/tm-int/dp/decisionContract.ts src/lib/tm-int/dp/dpValidator.ts src/lib/tm-int/dp/__tests__/dpValidator.test.ts --format json: PASS, 0 errors, 0 warnings
- git diff --check: PASS

Evidence summary:
- DP contract now exposes `dpRecommendationHasEvidenceRationale`.
- Recommendation rationale must be non-empty, have cited evidence, and use evidence-oriented rationale language.
- Validator rejects generic recommendation rationale detached from evidence.
- Tests cover generic rationale failure and valid evidence rationale pass.
- F wrote only f_done state; verified and Judge ledger remain outside F authority.
