# DP INT v1 Judge Artifact Gap Re-Judge 2026-07-04

## Status

This is a re-judge artifact, not a reconstruction of the missing files.

Exact reconstruction of the missing Judge artifacts was not possible from the
current checkout, worker worktrees, or git path history. The affected Judge
ledger rows are therefore re-judged through the authorized Judge mechanism.

## Missing Judge Artifacts

- `reports/f_done/dp-int-v1/JUDGE-CLOSEOUT-20260704-FINAL.md`
- `reports/judge/dp-int-v1/JUDGE-BATCH-20260704.md`

## Affected Rows

- Total affected Judge rows: 102
- Rows referencing `reports/f_done/dp-int-v1/JUDGE-CLOSEOUT-20260704-FINAL.md`: 50
- Rows referencing `reports/judge/dp-int-v1/JUDGE-BATCH-20260704.md`: 52
- Full affected-row inventory: `reports/judge/dp-int-v1/DP-INT-JUDGE-ARTIFACT-GAP-AFFECTED-20260704.csv`

## Evidence Used For Re-Judge

- SQLite source rows from `dp_int_workpacks` and `dp_int_judge_results`
- F artifact path recorded per affected workpack
- F validation evidence recorded per affected workpack
- F implementation commit hash recorded per affected workpack
- Local git commit object resolution for each recorded F commit
- DB commit evidence for prior ledger writes:
  - `d1a640a0403eff57c40a0c477547931e578e268e` introduced the final closeout Judge ledger rows.
  - Earlier Judge ledger rows are present in SQLite but the referenced batch artifact is absent.

## Re-Judge Decision

Each affected row is re-judged as `judge_pass` only after confirming:

- The workpack remains `f_done`.
- The F artifact path is present in the checkout or worker worktrees.
- The recorded F validation evidence is non-empty.
- The recorded F commit hash resolves as a local commit object.
- The Judge ledger remains separate from F queue verification.
- `verified` remains `0`.

## Anti-Fake Checks

- Did not set `verified`.
- Did not deploy, push, or merge.
- Did not fabricate either missing artifact.
- Did not claim exact reconstruction of missing content.
- Re-judge writes are performed through `scripts/tm-int/dp-int-factory.mjs judge-pass`.
