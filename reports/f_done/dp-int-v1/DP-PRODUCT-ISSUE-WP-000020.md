# F Done: DP-PRODUCT-ISSUE-WP-000020

Worker: F-DP-INT-W4
Workpack: DP-PRODUCT-ISSUE-WP-000020
Semantic key: dp.dp.product.issue.readiness_learner_weakness_replay_02

## Scope

- Source: src/lib/tm-int/runtimeReadiness/judgeRubric.ts
- Test: src/lib/tm-int/runtimeReadiness/__tests__/judgeRubric.test.ts

## Implementation

- Added createProductFailureLearnerWeaknessReplayEvidence to produce deterministic replay evidence for the no_product_failure_as_learner_weakness invariant.
- The replay evidence records product failure facts, Teacher Context product issue sources, DP/PED product failure flags, learner weakness flags, and learner weakness language paths.
- Reused that replay evidence inside judgeRuntimeReadinessEvidence so product failure replay failures continue to block runtime readiness.
- Added passing and failing replay assertions for product failure evidence that must not be recast as learner weakness.

## Validation Evidence

- npm test -- --run src/lib/tm-int/runtimeReadiness/__tests__/judgeRubric.test.ts
  - PASS: 1 file, 14 tests
- npm test -- --run src/lib/tm-int src/components/placement
  - PASS: 28 files, 205 tests
- npm run typecheck
  - PASS
- npm exec eslint -- scripts src --format json
  - PASS: exit 0, zero errorCount/fatalErrorCount/warningCount in JSON output

## Commit

Commit hash is recorded in the DP INT factory f_done row after this artifact is committed.
