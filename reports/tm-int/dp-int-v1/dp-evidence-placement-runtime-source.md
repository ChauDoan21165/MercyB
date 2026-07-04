# DP INT v1 F Evidence: Placement Runtime Source

Workpack:
- DP-EVIDENCE-WP-000009

Implementation commit: 611374604

Changed product/test files:
- src/components/placement/v3/__tests__/runtimeIntegration.test.ts

Validation:
- npm test -- --run src/components/placement/v3 src/lib/tm-int/dp src/lib/tm-int/runtimeReadiness src/lib/tm-int/runtime: PASS, 18 files, 114 tests
- npm run typecheck: PASS
- npm exec eslint -- src/components/placement/v3/__tests__/runtimeIntegration.test.ts --format json: PASS, 0 errors, 0 warnings
- git diff --check: PASS

Evidence summary:
- Placement runtime test now builds a RuntimeEvidenceBundle from actual placement ObservationPacket and Teacher Context output.
- DP evidence intake validates that placement runtime source through `createDpDecisionFromRuntimeEvidenceBundle`.
- Test proves product audio failure remains a product issue in DP intake.
- F wrote only f_done state; verified and Judge ledger remain outside F authority.
