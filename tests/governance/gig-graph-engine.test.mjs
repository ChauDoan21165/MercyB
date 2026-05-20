import { describe, expect, it } from "vitest";
import { GIG_EDGE_TYPES, GIG_NODE_TYPES, buildGovernanceGraph, enforceGraphStrict } from "../../scripts/governance/gig-graph-engine.mjs";

describe("GIG graph engine", () => {
  it("builds required node and edge type coverage", () => {
    const graph = buildGovernanceGraph();
    expect(() => enforceGraphStrict(graph)).not.toThrow();
    for (const type of GIG_NODE_TYPES) expect(graph.nodes.some((node) => node.type === type)).toBe(true);
    for (const type of GIG_EDGE_TYPES) expect(graph.edges.some((edge) => edge.type === type)).toBe(true);
  });
});
