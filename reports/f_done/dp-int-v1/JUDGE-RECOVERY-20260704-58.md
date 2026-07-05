# DP INT Judge Recovery 2026-07-04

## Scope

- Recovery batch for the 58 rows present in `dp_int_f_done_unjudged` at recovery start.
- Judge source: existing `dp_int_workpacks` `f_done` rows, their `validation_evidence`, and referenced implementation `commit_hash` values.
- Every judged row remains in the F queue with `verified = 0`.

## Verdict

- Intended ledger result: `judge_pass` for all 58 `f_done` rows.
- This artifact is Judge evidence only. It does not set F `verified`, deploy, push, or merge.

## Anti-Fake Checks

- Judge ledger remains separate from F queue verification.
- F `verified` column remains locked at `0`.
- No workpack status is promoted to `verified`.
