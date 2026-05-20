export function buildAuthorityIntelligence(graph) {
  return {
    canonical_authority_nodes: graph.nodes.filter((node) => node.type === "canonical_authority"),
    branch_domain_nodes: graph.nodes.filter((node) => node.type === "branch_domain"),
    stale_authority_rejection: graph.edges.filter((edge) => edge.type === "invalidates" || edge.type === "supersedes"),
    canonical_owner: "A46 convergence governance",
    branch_domain_isolation: "preserved",
    forked_identity_policy: "reject_without_current_A46_lineage",
  };
}
