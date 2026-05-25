# Adaptive Item Generation Production Readiness

Generated: 2026-05-20T11:44:00Z

## Batch Summary

| Batch | Cycles | Generated | Validated | Accepted | Acceptance Rate | Estimated Cost | Cost / Accepted |
|---|---:|---:|---:|---:|---:|---:|---:|
| baseline-01 | 1 | 30 | 30 | 1 | 3.3% | $0.015375 | $0.015375 |
| tuned-01 partial | 1 partial | 29 | 29 | 3 | 10.3% | $0.021871 | $0.007290 |

## Production Recommendation

Not ready for production replacement. The hard evidence gates were not met in this run.

The partial tuned run improved acceptance from 3.3% to 10.3%, but this is not a complete tuning cycle and cannot be treated as production evidence. The live loop stopped on `fetch failed`; see `a35-blockers.md`.
