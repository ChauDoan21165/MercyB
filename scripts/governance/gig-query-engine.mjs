import { buildAuthorityIntelligence } from "./gig-authority-engine.mjs";
import { buildGovernanceCausality } from "./gig-causality-engine.mjs";
import { buildGovernanceChronology } from "./gig-chronology-engine.mjs";
import { buildDependencyIntelligence } from "./gig-dependency-intelligence.mjs";
import { buildExplainability } from "./gig-explainability-engine.mjs";
import { buildReplayIntelligence } from "./gig-replay-intelligence.mjs";
import { buildSealIntelligence } from "./gig-seal-intelligence.mjs";

export function buildGovernanceDecisionIndex(graph) {
  const dependencies = buildDependencyIntelligence(graph);
  const replay = buildReplayIntelligence(graph);
  const authority = buildAuthorityIntelligence(graph);
  return {
    current_governance_state: graph.final_graph_decision,
    blocked_reason: "unresolved_dependency_taxonomy_preserved",
    highest_impact_dependencies: dependencies.highest_impact_dependencies,
    canonical_replay_lineage: replay.replay_canonical_state,
    canonical_authority: authority.canonical_owner,
    deterministic_decisions: true,
  };
}

export function buildGraphQueries(graph) {
  const dependencies = buildDependencyIntelligence(graph);
  const replay = buildReplayIntelligence(graph);
  const authority = buildAuthorityIntelligence(graph);
  return {
    dependency_intelligence: dependencies,
    replay_intelligence: replay,
    authority_intelligence: authority,
    seal_intelligence: buildSealIntelligence(graph),
    causality: buildGovernanceCausality(graph),
    chronology: buildGovernanceChronology(graph),
    explainability: buildExplainability(graph, dependencies, replay, authority),
    decision_index: buildGovernanceDecisionIndex(graph),
  };
}
