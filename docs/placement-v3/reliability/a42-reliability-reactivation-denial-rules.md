# A42 Reliability Reactivation Denial Rules

Generated: 2026-05-20T17:26:18.018Z

- Reliability risk classification: BLOCKED_BY_MISSING_A33_ENDURANCE_INPUTS
- Ready: false
- Complete: false
- production_safe: false
- placement_v3_enabled: false
- live_validation_complete: false
- live_provider_validated: false
- autonomous_execution: SUPERVISED_ONLY

## Denial Rules

- Deny reactivation when endurance evidence is missing.
- Deny reactivation when replay durability or reproducibility evidence is missing.
- Deny reactivation when failover validation, provider degradation lineage, latency, timeout, or observability continuity evidence is missing.
- Deny reactivation when unsupported readiness claims appear or autonomous execution implications are unresolved.
- Deny reactivation when governance-approved sequencing is incomplete.

## Current Rule Evaluation

- a33_endurance_evidence: BLOCKED (missing_schema_fields_or_source_evidence)
- latency_timeout_measurements: BLOCKED (missing_schema_fields_or_source_evidence)
- replay_durability_validation: BLOCKED (missing_schema_fields_or_source_evidence)
- replay_reproducibility_evidence: BLOCKED (missing_schema_fields_or_source_evidence)
- provider_failover_validation: BLOCKED (missing_schema_fields_or_source_evidence)
- provider_degradation_lineage: BLOCKED (missing_schema_fields_or_source_evidence)
- observability_continuity_evidence: BLOCKED (missing_schema_fields_or_source_evidence)
- unsupported_readiness_claim_detection: BLOCKED (missing_schema_fields_or_source_evidence)
- autonomous_execution_implications: BLOCKED (missing_schema_fields_or_source_evidence)
- supervised_execution_governance_approval: BLOCKED (missing_schema_fields_or_source_evidence)
- governance_approved_readiness_sequencing: BLOCKED (missing_schema_fields_or_source_evidence)

All blocked checks deny future reliability reactivation. This artifact does not authorize readiness claims.
