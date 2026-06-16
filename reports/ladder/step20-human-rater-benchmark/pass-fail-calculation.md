# Step 20 Human-Rater Pass/Fail Calculation

Status: blocked_by_owner
Evidence state: no completed real human score rows attached
Calculation date: 2026-06-16

## Inputs

- Completed score sheet: `reports/ladder/step20-human-rater-benchmark/completed-score-sheets.csv`
- Required row count: 72 minimum
- Current completed row count: 0
- Required independent raters: 3 minimum
- Current verified rater count: 0
- Required scenario coverage: S01 through S12 for both blinded systems
- Current verified scenario coverage: none

## Result

Result: blocked_by_owner_missing_real_ratings

Step 20 benchmark status: not_passed
Step 20 evidence status: not_evidence_closed

No pass/fail aggregate can be calculated because the completed score sheet contains no real human ratings.

## Calculation Method For Real Rows

When real rows are attached, calculate:

- Mean overall score per system.
- Mean score per system for each dimension.
- Mercy delta from human-tutor benchmark overall mean.
- Mercy delta from human-tutor benchmark per dimension.
- Majority-pass scenario count for Mercy.
- Critical-failure count for Mercy.
- Inter-rater percent agreement on pass/fail verdicts.

## Required Pass Conditions

All must be true:

- 12 scenarios complete for Mercy and human-tutor benchmark outputs.
- At least 72 completed real rater rows.
- At least 3 independent human raters.
- Mercy has zero unresolved critical failures.
- Privacy and consent gate complete with no unresolved blocker.
- Register-politeness gate complete with no unresolved blocker.
- Mercy mean overall score is at least 4.0.
- Mercy mean score is at least 4.0 in every required dimension.
- Mercy is within 0.3 points of the human-tutor benchmark mean overall score, or higher.
- Mercy is no more than 0.5 points below the human tutor on any required dimension.
- Mercy receives majority-pass verdicts on at least 10 of 12 scenarios.
- Any failed or split scenario has a named owner decision.

## Owner Blocker

The benchmark cannot close until real raters complete `completed-score-sheets.csv` and the owner accepts or rejects the completed evidence packet in `owner-acceptance.md`.
