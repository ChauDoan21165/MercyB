import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";

export const GIG_OUT_DIR = "docs/placement-v3/governance";
export const GIG_BLOCKED_SAFE = {
  production_safe: false,
  production_readiness: false,
  placement_v3_enabled: false,
  placement_v3_enablement: "BLOCKED",
  writes_production_data: false,
  autonomous_execution: "SUPERVISED_ONLY",
  do_not_enable_continuity: true,
};

export const GIG_NODE_TYPES = [
  "unresolved_dependency",
  "governance_decision",
  "replay_lineage",
  "denial_lineage",
  "governance_seal",
  "strict_mode_rule",
  "branch_domain",
  "canonical_authority",
  "adversarial_fixture",
  "governance_event",
  "replay_event",
  "recovery_event",
  "contamination_event",
  "stale_artifact",
  "poisoned_lineage",
  "deterministic_identity",
];

export const GIG_EDGE_TYPES = [
  "blocks",
  "propagates",
  "supersedes",
  "canonicalizes",
  "invalidates",
  "contaminates",
  "fragments",
  "replays",
  "restores",
  "seals",
  "rejects",
  "explains",
  "depends_on",
  "originates_from",
];

export function buildGovernanceGraph() {
  const sources = loadSources();
  const nodes = [];
  const edges = [];

  const timeline = sources.timeline ?? {};
  const dependencies = sources.dependencies?.dependencies ?? [];
  const events = timeline.events ?? [];
  const replayEvents = sources.replay?.replay_events ?? [];
  const recoveryEvents = sources.recovery?.recovery_events ?? [];
  const fixtures = sources.collapse?.recursive_corruption_inventory ?? [];

  addNode(nodes, "canonical-authority:a46", "canonical_authority", {
    label: "A46 convergence governance",
    state: "canonical",
  });
  addNode(nodes, "branch-domain:feat-a42-reliability-forecast-ops", "branch_domain", {
    label: "feat/a42-reliability-forecast-ops",
    authority: "canonical_branch_domain",
  });
  addEdge(edges, "branch-domain:feat-a42-reliability-forecast-ops", "canonical-authority:a46", "canonicalizes");
  addEdge(edges, "canonical-authority:a46", "decision:blocked-safe", "supersedes");
  addEdge(edges, "branch-domain:feat-a42-reliability-forecast-ops", "decision:blocked-safe", "fragments");
  addNode(nodes, "contamination:cross-branch-rejected", "contamination_event", {
    label: "cross-branch contamination attempt",
    state: "rejected",
  });
  addNode(nodes, "poisoned-lineage:canonical-identity-fork", "poisoned_lineage", {
    label: "canonical identity fork attempt",
    state: "rejected",
  });
  addEdge(edges, "contamination:cross-branch-rejected", "branch-domain:feat-a42-reliability-forecast-ops", "contaminates");
  addEdge(edges, "contamination:cross-branch-rejected", "decision:blocked-safe", "rejects");
  addEdge(edges, "poisoned-lineage:canonical-identity-fork", "canonical-authority:a46", "invalidates");
  addEdge(edges, "poisoned-lineage:canonical-identity-fork", "branch-domain:feat-a42-reliability-forecast-ops", "fragments");

  for (const dependency of dependencies) {
    const id = `dependency:${slug(dependency.dependency)}`;
    addNode(nodes, id, "unresolved_dependency", {
      label: dependency.dependency,
      state: dependency.current_state,
      propagation_count: dependency.propagated_event_ids.length,
      blocked_streams: dependency.blocked_streams,
    });
    addEdge(edges, id, "decision:blocked-safe", "blocks");
    for (const eventId of dependency.propagated_event_ids) addEdge(edges, id, `event:${eventId}`, "propagates");
  }

  addNode(nodes, "decision:blocked-safe", "governance_decision", {
    label: "blocked-safe governance decision",
    ...GIG_BLOCKED_SAFE,
    readiness_allowed: false,
    release_allowed: false,
  });

  for (const event of events) {
    const type = classifyEventNode(event);
    const id = `event:${event.event_id}`;
    addNode(nodes, id, type, {
      label: event.type,
      actor: event.actor,
      scope: event.scope,
      ordinal: event.ordinal,
      summary: event.summary,
    });
    addEdge(edges, id, "decision:blocked-safe", "explains");
    for (const cause of event.caused_by ?? []) {
      const causeEvent = events.find((candidate) => candidate.type === cause);
      if (causeEvent) addEdge(edges, `event:${causeEvent.event_id}`, id, "originates_from");
    }
  }

  for (const event of replayEvents) {
    const id = `replay:${event.event_id}`;
    addNode(nodes, id, "replay_lineage", {
      label: event.type,
      replay_state: event.replay_state,
      ordinal: event.ordinal,
    });
    addEdge(edges, id, "canonical-authority:a46", "invalidates");
    addEdge(edges, id, "decision:blocked-safe", "explains");
  }

  for (const event of recoveryEvents) {
    const id = `recovery:${event.event_id}`;
    addNode(nodes, id, "recovery_event", {
      label: event.type,
      recovery_action: event.recovery_action,
      blocked_safe_restored: event.blocked_safe_restored,
    });
    addEdge(edges, id, "decision:blocked-safe", "restores");
  }

  for (const sealEvent of sources.seal?.seal_events ?? []) {
    const id = `seal:${sealEvent.event_id}`;
    addNode(nodes, id, "governance_seal", {
      label: sealEvent.type,
      seal_state: sealEvent.seal_state,
      connected_to_recovery: sealEvent.connected_to_recovery,
    });
    addEdge(edges, id, "decision:blocked-safe", "seals");
  }

  for (const fixture of fixtures) {
    const id = `fixture:${fixture.id}`;
    addNode(nodes, id, "adversarial_fixture", {
      label: fixture.id,
      group: fixture.group,
      attack_type: fixture.attack_type,
      recursion_depth: fixture.recursion_depth,
    });
    addEdge(edges, id, "decision:blocked-safe", "rejects");
  }

  addNode(nodes, "strict-mode:denial-preserving", "strict_mode_rule", {
    label: "denial-preserving strict mode",
    state: "active",
  });
  addNode(nodes, "identity:deterministic-governance", "deterministic_identity", {
    label: "deterministic governance identity",
    state: "preserved",
  });
  addNode(nodes, "stale-artifact:replayed-governance-snapshot", "stale_artifact", {
    label: "replayed governance snapshot",
    state: "rejected_non_canonical",
  });
  addEdge(edges, "strict-mode:denial-preserving", "decision:blocked-safe", "explains");
  addEdge(edges, "identity:deterministic-governance", "canonical-authority:a46", "depends_on");
  addEdge(edges, "identity:deterministic-governance", "decision:blocked-safe", "replays");
  addEdge(edges, "stale-artifact:replayed-governance-snapshot", "canonical-authority:a46", "invalidates");

  const graph = {
    graph_id: stableHash(nodes.map((node) => node.id).sort().join("|"), edges.map((edge) => edge.id).sort().join("|")),
    governance_mode: "blocked_safe_governance_intelligence_graph",
    source_artifacts: Object.fromEntries(Object.entries(sources).map(([key, value]) => [key, Boolean(value)])),
    node_types: GIG_NODE_TYPES,
    edge_types: GIG_EDGE_TYPES,
    nodes: sortById(nodes),
    edges: sortById(edges),
    blocked_safe_posture: GIG_BLOCKED_SAFE,
    final_graph_decision: {
      graph_queryable: true,
      temporal_reasoning_integrated: true,
      replay_chronology_explorable: true,
      unresolved_dependency_propagation_computable: true,
      governance_causality_machine_readable: true,
      canonical_authority_explainable: true,
      blocked_safe_introspectable: true,
      readiness_allowed: false,
      release_allowed: false,
      ...GIG_BLOCKED_SAFE,
    },
  };
  enforceGraphStrict(graph);
  return graph;
}

export function enforceGraphStrict(graph) {
  const failures = [];
  const nodeIds = new Set(graph.nodes.map((node) => node.id));
  if (nodeIds.size !== graph.nodes.length) failures.push("duplicate graph node identity detected");
  if (new Set(graph.edges.map((edge) => edge.id)).size !== graph.edges.length) failures.push("duplicate graph edge identity detected");
  for (const type of GIG_NODE_TYPES) if (!graph.nodes.some((node) => node.type === type)) failures.push(`missing node type: ${type}`);
  for (const type of GIG_EDGE_TYPES) if (!graph.edges.some((edge) => edge.type === type)) failures.push(`missing edge type: ${type}`);
  for (const edge of graph.edges) {
    if (!nodeIds.has(edge.from)) failures.push(`dangling edge source: ${edge.id}:${edge.from}`);
    if (!nodeIds.has(edge.to)) failures.push(`dangling edge target: ${edge.id}:${edge.to}`);
    if (!GIG_EDGE_TYPES.includes(edge.type)) failures.push(`unknown edge type: ${edge.type}`);
  }
  for (const node of graph.nodes) {
    if (!GIG_NODE_TYPES.includes(node.type)) failures.push(`unknown node type: ${node.type}`);
    const connected = graph.edges.some((edge) => edge.from === node.id || edge.to === node.id);
    if (!connected) failures.push(`orphan graph node: ${node.id}`);
    if (hasUnsafeEnablementMarker(node.attributes)) failures.push(`unsafe marker on node: ${node.id}`);
  }
  for (const edge of graph.edges.filter((item) => item.type === "contaminates")) {
    if (!edge.from.startsWith("contamination:")) failures.push(`contamination edge does not originate from rejected contamination event: ${edge.id}`);
  }
  for (const [key, expected] of Object.entries(GIG_BLOCKED_SAFE)) {
    if (graph.final_graph_decision[key] !== expected) failures.push(`${key} changed from ${expected}`);
  }
  if (!graph.final_graph_decision.graph_queryable) failures.push("graph is not queryable");
  if (failures.length > 0) throw new Error(`GIG graph strict mode blocked:\n${failures.map((failure) => `- ${failure}`).join("\n")}`);
}

function loadSources() {
  return {
    timeline: readJson("tghee-governance-timeline.json"),
    dependencies: readJson("tghee-unresolved-dependency-history.json"),
    replay: readJson("tghee-replay-chronology.json"),
    causality: readJson("tghee-governance-causality-timeline.json"),
    seal: readJson("tghee-seal-evolution-history.json"),
    recovery: readJson("tghee-recovery-history.json"),
    canonical: readJson("tghee-canonical-authority-history.json"),
    collapse: readJson("a46-recursive-governance-collapse-simulator.json"),
  };
}

function addNode(nodes, id, type, attributes) {
  if (!nodes.some((node) => node.id === id)) nodes.push({ id, type, attributes });
}

function addEdge(edges, from, to, type) {
  const id = stableHash(from, to, type);
  if (!edges.some((edge) => edge.id === id)) edges.push({ id, from, to, type });
}

function classifyEventNode(event) {
  if (/replay|stale/i.test(`${event.type} ${event.scope}`)) return "replay_event";
  if (/recovery|restored|regeneration/i.test(`${event.type} ${event.scope}`)) return "recovery_event";
  if (/branch|contamination/i.test(`${event.type} ${event.scope}`)) return "contamination_event";
  if (/orphaned|poisoning/i.test(`${event.type} ${event.scope}`)) return "poisoned_lineage";
  if (/lineage|denial/i.test(`${event.type} ${event.scope}`)) return "denial_lineage";
  if (/strict/i.test(`${event.type} ${event.scope}`)) return "strict_mode_rule";
  if (/seal/i.test(`${event.type} ${event.scope}`)) return "governance_seal";
  if (/canonical/i.test(`${event.type} ${event.scope}`)) return "canonical_authority";
  if (/stale/i.test(`${event.type} ${event.scope}`)) return "stale_artifact";
  return "governance_event";
}

function readJson(file) {
  const fullPath = `${GIG_OUT_DIR}/${file}`;
  if (!existsSync(fullPath)) return null;
  return JSON.parse(readFileSync(fullPath, "utf8"));
}

function sortById(items) {
  return [...items].sort((a, b) => a.id.localeCompare(b.id));
}

function slug(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function stableHash(...parts) {
  return createHash("sha256").update(parts.join("|")).digest("hex").slice(0, 16);
}

function hasUnsafeEnablementMarker(value) {
  if (!value || typeof value !== "object") return false;
  return Object.entries(value).some(([key, item]) => {
    if (key === "production_safe" && item === true) return true;
    if (key === "production_readiness" && item === true) return true;
    if (key === "placement_v3_enabled" && item === true) return true;
    if (key === "placement_v3_enablement" && item !== "BLOCKED") return true;
    if (key === "writes_production_data" && item === true) return true;
    if (key === "autonomous_execution" && item !== "SUPERVISED_ONLY") return true;
    if (key === "do_not_enable_continuity" && item === false) return true;
    return typeof item === "object" && hasUnsafeEnablementMarker(item);
  });
}
