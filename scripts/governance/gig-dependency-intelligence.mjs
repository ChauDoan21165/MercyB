export function buildDependencyIntelligence(graph) {
  const dependencies = graph.nodes.filter((node) => node.type === "unresolved_dependency");
  return {
    dependencies: dependencies.map((node) => {
      const outgoing = graph.edges.filter((edge) => edge.from === node.id);
      return {
        id: node.id,
        label: node.attributes.label,
        state: node.attributes.state,
        propagation_depth: outgoing.filter((edge) => edge.type === "propagates").length,
        blast_radius: node.attributes.blocked_streams ?? [],
        bottleneck_score: (node.attributes.blocked_streams?.length ?? 0) + outgoing.length,
        minimal_unblock_evidence: `real evidence required for ${node.attributes.label}`,
      };
    }),
    highest_impact_dependencies: dependencies
      .map((node) => ({
        id: node.id,
        label: node.attributes.label,
        impact: (node.attributes.blocked_streams?.length ?? 0) + (node.attributes.propagation_count ?? 0),
      }))
      .sort((a, b) => b.impact - a.impact)
      .slice(0, 5),
    transitive_blockers: graph.edges.filter((edge) => edge.type === "blocks" || edge.type === "propagates"),
  };
}
