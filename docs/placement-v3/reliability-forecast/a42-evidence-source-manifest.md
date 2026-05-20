# A42 Evidence Source Manifest

Generated: 2026-05-20T16:45:04.785Z

- Found inputs: reliability_health, ci_degradation_forecast, reliability_recovery_forecast, ci_resilience_summary, reliability_anomaly_summary
- Missing inputs: a33_endurance_health, a33_timeout_risk_forecast, a39_capacity_projections, a45_provider_calibration_dependencies, a47_observability_retention_drift_telemetry, a49_replay_reproducibility_thresholds, a50_supervised_execution_constraints
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
- a39_capacity_projections: missing -> docs/placement-v3/capacity/a39-capacity-projections.json
- a45_provider_calibration_dependencies: missing -> docs/placement-v3/provider-calibration/a45-provider-calibration-dependencies.json
- a47_observability_retention_drift_telemetry: missing -> docs/placement-v3/observability/a47-observability-retention-drift-telemetry.json
- a49_replay_reproducibility_thresholds: missing -> docs/placement-v3/replay/a49-replay-reproducibility-thresholds.json
- a50_supervised_execution_constraints: missing -> docs/placement-v3/supervision/a50-supervised-execution-constraints.json

A42 rejects or blocks unsafe imported evidence instead of treating it as merge or enablement authority.
