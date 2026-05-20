# A42 Evidence Dropbox

Place copied B1 or A33 JSON summary artifacts here when canonical repo paths do not contain the source evidence yet.

A42 looks for expected filenames in this directory after canonical paths and before `reports/agent-runs/`.

Expected A33 filenames:

- `endurance-health-summary.json`
- `timeout-risk-forecast.json`

Expected B1 filenames:

- `reliability-health-summary.json`
- `ci-degradation-forecast.json`
- `reliability-recovery-forecast.json`
- `ci-resilience-summary.json`
- `reliability-anomaly-summary.json`

Do not place fabricated evidence here. A42 will keep reports blocked-safe when required inputs are missing, stale, or unsafe.

Safety fields must remain false unless separate verified evidence exists:

- `production_safe`
- `placement_v3_enabled`
- `live_provider_validated`
- `real_user_validated`
