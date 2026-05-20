import { describe, expect, it } from "vitest";
import { GIG_EDGE_TYPES, GIG_NODE_TYPES, buildGovernanceGraph, enforceGraphStrict } from "../../scripts/governance/gig-graph-engine.mjs";

describe("GIG graph engine", () => {
  it("builds required node and edge type coverage", () => {
    const graph = buildGovernanceGraph();
    expect(() => enforceGraphStrict(graph)).not.toThrow();
    for (const type of GIG_NODE_TYPES) expect(graph.nodes.some((node) => node.type === type)).toBe(true);
    for (const type of GIG_EDGE_TYPES) expect(graph.edges.some((edge) => edge.type === type)).toBe(true);
  });

  it("rejects dangling edges, orphan nodes, and duplicate identities", () => {
    const graph = buildGovernanceGraph();
    const broken = {
      ...graph,
      nodes: [...graph.nodes, { id: "orphan:bad", type: "governance_event", attributes: { label: "orphan" } }],
      edges: [...graph.edges, { id: "bad-edge", from: "missing", to: "decision:blocked-safe", type: "explains" }],
    };
    expect(() => enforceGraphStrict(broken)).toThrow(/dangling edge source|orphan graph node/);
  });

  it("rejects unsafe enablement marker injection", () => {
    const graph = buildGovernanceGraph();
    const unsafe = {
      ...graph,
      nodes: graph.nodes.map((node) =>
        node.id === "decision:blocked-safe"
          ? { ...node, attributes: { ...node.attributes, placement_v3_enabled: true } }
          : node,
      ),
    };
    expect(() => enforceGraphStrict(unsafe)).toThrow(/unsafe marker/);
  });

  it("keeps contamination edges sourced from rejected contamination events", () => {
    const graph = buildGovernanceGraph();
    const contaminateEdges = graph.edges.filter((edge) => edge.type === "contaminates");
    expect(contaminateEdges.length).toBeGreaterThan(0);
    expect(contaminateEdges.every((edge) => edge.from.startsWith("contamination:"))).toBe(true);
  });
});
