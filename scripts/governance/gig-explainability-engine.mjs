export function buildExplainability(graph, dependency, replay, authority) {
  return {
    why_blocked: "Unresolved dependencies still block readiness; blocked-safe invariants remain active.",
    why_stale: "Stale artifacts lack current seal, lineage, and unresolved dependency continuity.",
    why_rejected: "Strict-mode and simulator outcomes reject readiness, certification, replay poisoning, branch contamination, and autonomous escalation.",
    why_canonical: "A46 convergence governance is the canonical authority because it preserves current seal, lineage, and denial continuity.",
    why_fragmented: "Branch-domain and orphaned lineage fragments are rejected without canonical ancestry.",
    why_unresolved: dependency.highest_impact_dependencies.map((item) => `${item.label}: missing real validation evidence`),
    why_strict_mode_failed: "Strict mode rejects any drift from blocked-safe invariants or unsupported readiness implications.",
    minimum_evidence_to_reduce_risk: dependency.highest_impact_dependencies.map((item) => item.minimal_unblock_evidence ?? `real evidence required for ${item.label}`),
    replay_state: replay.replay_canonical_state,
    canonical_authority: authority.canonical_owner,
    blocked_safe_introspection: graph.final_graph_decision,
  };
}
