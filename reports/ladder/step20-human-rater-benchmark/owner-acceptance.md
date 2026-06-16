# Step 20 Owner Acceptance

Status: blocked_by_owner
Evidence state: awaiting real completed human-rater score sheets

## Owner Decision Fields

- Owner ID:
- Owner role:
- Decision date UTC:
- Decision: pending
- Accepted evidence packet path:
- Completed score sheet path:
- Pass/fail calculation path:
- Notes:

## Required Owner Decision Values

Use exactly one:

- `accept_step20_closeout`
- `reject_step20_closeout`
- `blocked_pending_real_ratings`
- `blocked_pending_fixes`

## Current Decision

Decision: blocked_pending_real_ratings

Reason: `completed-score-sheets.csv` contains no real human-rater rows. Step 20 cannot be evidence-closed or passed until real completed score sheets and the aggregate pass/fail calculation are attached.

## Acceptance Gate

The owner may accept Step 20 closeout only after reviewing:

- real rater roster and qualifications
- blinded output evidence
- completed score sheets
- aggregate calculation
- critical-failure audit
- privacy and consent review
- register-politeness review
- split-scenario resolution notes
