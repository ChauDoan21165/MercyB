export function buildReplayIntelligence(graph) {
  const replayNodes = graph.nodes.filter((node) => node.type === "replay_lineage" || node.type === "replay_event");
  return {
    replay_lineage_nodes: replayNodes,
    replay_storms: replayNodes.filter((node) => /storm|poison/i.test(`${node.attributes.label} ${node.attributes.replay_state}`)),
    stale_replay_lineage: replayNodes.filter((node) => node.attributes.replay_state === "rejected_non_canonical"),
    replay_rejection_edges: graph.edges.filter((edge) => edge.type === "invalidates" || edge.type === "replays"),
    replay_canonical_state: "rejected_non_canonical",
  };
}
