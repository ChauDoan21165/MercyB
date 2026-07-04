# DP INT v1 Final Verified Promotion

## Result

- total: 260
- verified: 260
- judge_pass: 260
- judge_fail: 0
- verified promotion: authorized final gate

## Evidence

- All F artifacts exist.
- All Judge artifacts exist.
- The 102 repaired Judge rows point to `reports/judge/dp-int-v1/DP-INT-JUDGE-ARTIFACT-GAP-REJUDGE-20260704.md`.
- Missing historical Judge artifact references: 0.
- Judge ledger is consistent: every f_done row has judge_pass and no judge_fail rows exist.
- All F and Judge commit hashes resolve locally.
- SQLite integrity was checked before promotion.
- Dashboard agreed with the DB before promotion.
- No F worker, Judge command, deploy, push, or merge was run by this promotion command.

## Safety

- This report was written by `scripts/tm-int/dp-int-factory.mjs verify-final`.
- Ordinary F/Judge writes remain blocked from setting `verified`; the update used the final verifier authorization gate.
