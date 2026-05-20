# A3 Remediation Priority Queue

Timestamp: 2026-05-20T14:25:00Z

## P0

None for A3 infrastructure merge.

Rationale: current remaining findings are not malformed runtime data, invalid references, or audit blockers.

## P1

Missing remediation links for any taxonomy ID that can drive learner-facing recommendations.

Rationale: wrong remediation routing can actively mislead learners. These IDs must be reviewed before public claims that Placement V3 produces complete, trustworthy next-step learning paths.

Conversation prompt calibration gaps if conversation assessment is enabled for scored placement.

Rationale: uncalibrated conversation prompts can create scoring blind spots across CEFR bands.

## P2

Unused V3 ID `negation-no-not-placement`.

Rationale: it is not currently causing invalid references, but it blocks clean full-coverage claims for the V3 L1 taxonomy.

Unused legacy taxonomy IDs.

Rationale: they may be future coverage, detector-only categories, or stale content. They should be classified before public documentation claims all taxonomy categories are active.

## Informational

Docs-only folder absence for `docs/placement-v3/calibration/`, `docs/placement-v3/taxonomy/`, and `docs/placement-v3/prompt-library/`.

Rationale: runtime V3 files are the audited source today. Backfilling docs folders can improve reviewer navigation but should not be confused with runtime correctness.

Existing non-A3 build and lint warnings.

Rationale: verification passes; warnings are not introduced by this governance pass.

## Recommended Work Order

1. Review remediation links for learner-facing recommendation paths.
2. Decide whether conversation prompts are launch-scope for scored placement.
3. Add approved conversation calibration entries if conversation scoring is in scope.
4. Classify unused taxonomy IDs as active, detector-only, future, or deprecated-candidate.
5. Backfill docs-only reference folders if Chau wants docs parity with runtime sources.
