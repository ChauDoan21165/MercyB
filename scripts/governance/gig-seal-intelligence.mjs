export function buildSealIntelligence(graph) {
  const seals = graph.nodes.filter((node) => node.type === "governance_seal");
  return {
    seal_nodes: seals,
    degraded_seals: seals.filter((node) => /degraded/i.test(`${node.attributes.seal_state} ${node.attributes.label}`)),
    restored_seals: seals.filter((node) => /preserved|restored/i.test(`${node.attributes.seal_state} ${node.attributes.label}`)),
    seal_edges: graph.edges.filter((edge) => edge.type === "seals" || edge.type === "restores"),
    seal_continuity: "blocked_safe_preserved",
  };
}
