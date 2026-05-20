import { describe, expect, it } from "vitest";
import { buildDependencyIntelligence } from "../../scripts/governance/gig-dependency-intelligence.mjs";
import { buildGovernanceGraph } from "../../scripts/governance/gig-graph-engine.mjs";

describe("GIG dependency intelligence", () => {
  it("computes dependency blast radius and minimal unblock evidence", () => {
    const dependency = buildDependencyIntelligence(buildGovernanceGraph());
    const endurance = dependency.dependencies.find((item) => item.label === "A33 endurance evidence");
    expect(endurance.blast_radius).toContain("A42");
    expect(endurance.minimal_unblock_evidence).toContain("real evidence");
    expect(dependency.highest_impact_dependencies.length).toBeGreaterThan(0);
  });
});
