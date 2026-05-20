export function buildGovernanceChronology(graph) {
  return {
    events: graph.nodes
      .filter((node) => node.id.startsWith("event:"))
      .sort((a, b) => (a.attributes.ordinal ?? 0) - (b.attributes.ordinal ?? 0))
      .map((node) => ({
        id: node.id,
        ordinal: node.attributes.ordinal,
        label: node.attributes.label,
        actor: node.attributes.actor,
        scope: node.attributes.scope,
      })),
    deterministic_ordering: true,
  };
}
