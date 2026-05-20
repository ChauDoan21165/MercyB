import { describe, expect, it } from "vitest";
import { buildGovernanceGraph } from "../../scripts/governance/gig-graph-engine.mjs";
import { buildGraphQueries, buildGovernanceDecisionIndex } from "../../scripts/governance/gig-query-engine.mjs";

describe("GIG query engine", () => {
  it("answers current blocked governance state and highest impact dependencies", () => {
    const graph = buildGovernanceGraph();
    const queries = buildGraphQueries(graph);
    const index = buildGovernanceDecisionIndex(graph);
    expect(index.current_governance_state.production_safe).toBe(false);
    expect(index.current_governance_state.placement_v3_enablement).toBe("BLOCKED");
    expect(queries.dependency_intelligence.highest_impact_dependencies.length).toBeGreaterThan(0);
    expect(queries.explainability.why_blocked).toContain("Unresolved dependencies");
  });
});
