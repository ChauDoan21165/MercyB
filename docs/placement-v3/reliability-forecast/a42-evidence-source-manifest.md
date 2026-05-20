# A42 Evidence Source Manifest

Generated: 2026-05-20T17:04:11.750Z

- Found inputs: reliability_health, ci_degradation_forecast, reliability_recovery_forecast, ci_resilience_summary, reliability_anomaly_summary
- Missing inputs: a33_endurance_health, a33_timeout_risk_forecast, a39_capacity_projections, a39_capacity_denial_provider_burst_governance, a44_human_review_backlog_approval_denial, a45_provider_calibration_dependencies, a45_provider_validation_drift_denial, a46_governance_contradiction_audits, a47_observability_retention_drift_telemetry, a47_observability_reconciliation_audit_continuity, a48_release_canary_denial_governance, a49_replay_reproducibility_thresholds, a49_replay_reproducibility_contradiction_auditing, a50_supervised_execution_constraints, a50_supervised_execution_denial_governance
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
- a39_capacity_denial_provider_burst_governance: missing -> docs/placement-v3/capacity/a39-capacity-denial-provider-burst-governance.json
- a44_human_review_backlog_approval_denial: missing -> docs/placement-v3/human-review/a44-human-review-backlog-approval-denial.json
- a45_provider_calibration_dependencies: missing -> docs/placement-v3/provider-calibration/a45-provider-calibration-dependencies.json
- a45_provider_validation_drift_denial: missing -> docs/placement-v3/provider-calibration/a45-provider-validation-drift-denial.json
- a46_governance_contradiction_audits: missing -> docs/placement-v3/governance/a46-governance-contradiction-audits.json
- a47_observability_retention_drift_telemetry: missing -> docs/placement-v3/observability/a47-observability-retention-drift-telemetry.json
- a47_observability_reconciliation_audit_continuity: missing -> docs/placement-v3/observability/a47-observability-reconciliation-audit-continuity.json
- a48_release_canary_denial_governance: missing -> docs/placement-v3/release/a48-release-canary-denial-governance.json
- a49_replay_reproducibility_thresholds: missing -> docs/placement-v3/replay/a49-replay-reproducibility-thresholds.json
- a49_replay_reproducibility_contradiction_auditing: missing -> docs/placement-v3/replay/a49-replay-reproducibility-contradiction-auditing.json
- a50_supervised_execution_constraints: missing -> docs/placement-v3/supervision/a50-supervised-execution-constraints.json
- a50_supervised_execution_denial_governance: missing -> docs/placement-v3/supervision/a50-supervised-execution-denial-governance.json

A42 rejects or blocks unsafe imported evidence instead of treating it as merge or enablement authority.
