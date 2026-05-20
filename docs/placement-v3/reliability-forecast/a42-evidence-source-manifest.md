# A42 Evidence Source Manifest

Generated: 2026-05-20T16:29:33.868Z

- Found inputs: reliability_health, ci_degradation_forecast, reliability_recovery_forecast, ci_resilience_summary, reliability_anomaly_summary
- Missing inputs: a33_endurance_health, a33_timeout_risk_forecast
- Rejected inputs: none
- Evidence freshness: blocked_missing_inputs

## Resolution Order

1. canonical repo paths
2. docs/placement-v3/reliability-forecast/evidence-dropbox
3. reports/agent-runs
4. blocked-safe missing input state

## Selected Sources

- reliability_health: canonical -> docs/placement-v3/reliability/reliability-health-summary.json
- ci_degradation_forecast: canonical -> docs/placement-v3/reliability/ci-degradation-forecast.json
- reliability_recovery_forecast: canonical -> docs/placement-v3/reliability/reliability-recovery-forecast.json
- ci_resilience_summary: canonical -> docs/placement-v3/reliability/ci-resilience-summary.json
- reliability_anomaly_summary: canonical -> docs/placement-v3/reliability/reliability-anomaly-summary.json
- a33_endurance_health: missing -> docs/placement-v3/endurance/endurance-health-summary.json
- a33_timeout_risk_forecast: missing -> docs/placement-v3/endurance/timeout-risk-forecast.json

A42 rejects or blocks unsafe imported evidence instead of treating it as merge or enablement authority.
