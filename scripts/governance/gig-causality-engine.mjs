export function buildGovernanceCausality(graph) {
  const explainEdges = graph.edges.filter((edge) => edge.type === "explains" || edge.type === "originates_from");
  return {
    causality_edges: explainEdges,
    current_denial_causes: graph.nodes
      .filter((node) => ["governance_event", "denial_lineage", "strict_mode_rule", "recovery_event"].includes(node.type))
      .map((node) => ({
        id: node.id,
        label: node.attributes.label,
        summary: node.attributes.summary,
      })),
    machine_readable: true,
  };
}
