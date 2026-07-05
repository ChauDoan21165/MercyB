# F Done: DP-PRODUCT-ISSUE-WP-000030

Worker: F-DP-INT-W4
Workpack: DP-PRODUCT-ISSUE-WP-000030
Semantic key: dp.dp.product.issue.readiness_learner_weakness_integration_03

## Scope

- Source: src/lib/tm-int/runtimeReadiness/judgeRubric.ts
- Test: src/lib/tm-int/runtimeReadiness/__tests__/judgeRubric.test.ts

## Implementation

- Extended ProductFailureLearnerWeaknessReplayEvidence with runtimeIntegration evidence.
- Runtime integration evidence records the expected contract path, runtime route, and whether the evidence is connected to the placement or lesson path instead of crossing those product surfaces silently.
- judgeRuntimeReadinessEvidence now emits runtime_integration_path_mismatch when product-failure evidence contradicts the contract runtime path.
- Added coverage proving RR-001 product-failure evidence is connected to /placement and fails when replayed on a /lesson route.

## Validation Evidence

- npm test -- --run src/lib/tm-int/runtimeReadiness/__tests__/judgeRubric.test.ts
  - PASS: 1 file, 15 tests
- npm test -- --run src/lib/tm-int/runtimeReadiness/__tests__/crossFlowReplay.test.ts
  - PASS: 1 file, 8 tests
- npm test -- --run src/lib/tm-int src/components/placement
  - PASS: 28 files, 208 tests
- npm run typecheck
  - PASS
- npm exec eslint -- scripts src --format json
  - PASS: exit 0, zero errorCount/fatalErrorCount/warningCount in JSON output

## Commit

Commit hash is recorded in the DP INT factory f_done row after this artifact is committed.
