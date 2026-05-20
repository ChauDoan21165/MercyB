# A42 Failover Contradiction Detector

Generated: 2026-05-20T17:10:11.955Z

- Reliability risk classification: BLOCKED_BY_MISSING_A33_ENDURANCE_INPUTS
- Ready: false
- Complete: false
- schema_completeness: false
- autonomous_execution: SUPERVISED_ONLY

- A39: provider burst denial governance -> burst/failover contradiction detection (missing_source_evidence)
- A45: provider validation and drift denial -> provider degradation contradiction detection (missing_source_evidence)
- A46: governance contradiction audits -> failover contradiction closure (missing_source_evidence)
- A47: observability audit continuity -> failover evidence continuity (missing_source_evidence)
- A49: replay contradiction auditing -> replay/failover contradiction traceability (missing_source_evidence)
- A50: supervised execution denial -> supervised-only failover gating (missing_source_evidence)

- provider_burst_denial_lineage: BLOCKED (missing_schema_fields_or_source_evidence)
- provider_degradation_lineage: BLOCKED (missing_schema_fields_or_source_evidence)
- failover_contradictions_unresolved: BLOCKED (missing_schema_fields_or_source_evidence)
- observability_dependencies_for_failover: BLOCKED (missing_schema_fields_or_source_evidence)
- replay_failover_contradiction_trace: BLOCKED (missing_schema_fields_or_source_evidence)
- supervised_execution_dependencies_for_failover: BLOCKED (missing_schema_fields_or_source_evidence)

Failover contradictions remain unresolved until provider, capacity, observability, replay, and supervision evidence is complete.
