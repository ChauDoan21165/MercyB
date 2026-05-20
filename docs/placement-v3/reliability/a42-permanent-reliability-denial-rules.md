# A42 Permanent Reliability Denial Rules

Generated: 2026-05-20T17:43:08.430Z

- Reliability risk classification: BLOCKED_BY_MISSING_A33_ENDURANCE_INPUTS
- Ready: false
- Complete: false
- production_safe: false
- placement_v3_enabled: false
- live_validation_complete: false
- live_provider_validated: false
- autonomous_execution: SUPERVISED_ONLY

## Denial Rules

- Deny reliability reactivation when endurance evidence is missing.
- Deny reliability reactivation when replay durability, replay reproducibility, failover validation, provider degradation, latency, timeout, or observability evidence is missing.
- Deny reliability reactivation when unsupported readiness claims appear, autonomous execution implications are unresolved, or governance-approved sequencing is incomplete.
- Deny reliability reactivation when safety fields are unsafe, absent, stale, or lack source lineage.

## Current Denial Evaluation

- endurance_validation_evidence: BLOCKED (missing_schema_fields_or_source_evidence)
- replay_durability_validation_evidence: BLOCKED (missing_schema_fields_or_source_evidence)
- failover_validation_evidence: BLOCKED (missing_schema_fields_or_source_evidence)
- provider_degradation_validation_evidence: BLOCKED (missing_schema_fields_or_source_evidence)
- latency_timeout_validation_evidence: BLOCKED (missing_schema_fields_or_source_evidence)
- observability_continuity_evidence: BLOCKED (missing_schema_fields_or_source_evidence)
- replay_reproducibility_evidence: BLOCKED (missing_schema_fields_or_source_evidence)
- supervised_execution_governance_approval: BLOCKED (missing_schema_fields_or_source_evidence)
- unsupported_readiness_claim_detection: BLOCKED (missing_schema_fields_or_source_evidence)
- autonomous_execution_implications: BLOCKED (missing_schema_fields_or_source_evidence)
- governance_approved_readiness_sequencing: BLOCKED (missing_schema_fields_or_source_evidence)

All blocked checks preserve A42 archival denial. This artifact does not authorize reactivation, enablement, provider execution, or readiness claims.
