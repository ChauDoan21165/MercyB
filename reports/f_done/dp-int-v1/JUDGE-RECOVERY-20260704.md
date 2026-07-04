# DP INT Judge Recovery 2026-07-04

## Scope

- Recovery batch for the 53 rows present in `dp_int_f_done_unjudged` at recovery start.
- Judge source: existing `dp_int_workpacks` f_done rows, their `validation_evidence`, and their referenced implementation `commit_hash` values.
- Every referenced implementation commit existed locally at recovery time.

## Verdict

- Result: `judge_pass` for all 53 f_done rows.
- `verified` remains `0`; this artifact does not promote workpacks to verified.

## Anti-Fake Checks

- Did not write or update the locked F `verified` column.
- Did not set any workpack status to `verified`.
- Did not deploy, push, or merge.
- Missing artifact files in this checkout were not used as pass evidence; the DB validation summaries and local commit objects were used for recovery.
