#!/usr/bin/env node

import { mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import { GIG_BLOCKED_SAFE, GIG_OUT_DIR, buildGovernanceGraph, enforceGraphStrict } from "./gig-graph-engine.mjs";
import { buildAuthorityIntelligence } from "./gig-authority-engine.mjs";
import { buildGovernanceCausality } from "./gig-causality-engine.mjs";
import { buildGovernanceChronology } from "./gig-chronology-engine.mjs";
import { buildDependencyIntelligence } from "./gig-dependency-intelligence.mjs";
import { buildExplainability } from "./gig-explainability-engine.mjs";
import { buildGraphQueries, buildGovernanceDecisionIndex } from "./gig-query-engine.mjs";
import { buildReplayIntelligence } from "./gig-replay-intelligence.mjs";
import { buildSealIntelligence } from "./gig-seal-intelligence.mjs";

const command = process.argv[2] ?? "runtime";
const strict = process.argv.includes("--strict");
const FIXTURE_DIR = "tests/governance/fixtures/gig";

main();

export function buildGigModel() {
  const graph = buildGovernanceGraph();
  const dependency = buildDependencyIntelligence(graph);
  const replay = buildReplayIntelligence(graph);
  const authority = buildAuthorityIntelligence(graph);
  const seal = buildSealIntelligence(graph);
  const causality = buildGovernanceCausality(graph);
  const chronology = buildGovernanceChronology(graph);
  const decision = buildGovernanceDecisionIndex(graph);
  const explainability = buildExplainability(graph, dependency, replay, authority);
  const fixtures = loadFixtureIndex();
  return { graph, dependency, replay, authority, seal, causality, chronology, decision, explainability, fixtures };
}

function main() {
  mkdirSync(GIG_OUT_DIR, { recursive: true });
  const model = buildGigModel();
  const handlers = {
    runtime: () => writeAll(model),
    query: () => writeQuery(model),
    causality: () => writeCausality(model),
    chronology: () => writeChronology(model),
    replay: () => writeReplay(model),
    dependencies: () => writeDependencies(model),
    authority: () => writeAuthority(model),
    explain: () => writeExplain(model),
  };
  if (!handlers[command]) throw new Error(`Unknown GIG command: ${command}`);
  handlers[command]();
  if (strict) enforceGigStrict(model);
  console.log(`[gig] ${command} generated graph=${model.graph.nodes.length} nodes/${model.graph.edges.length} edges`);
}

function writeAll(model) {
  writeJson("gig-governance-intelligence-graph.json", {
    ...model.graph,
    fixture_history_groups: model.fixtures,
  });
  writeTopology(model);
  writeAuthority(model);
  writeDependencies(model);
  writeChronology(model);
  writeReplay(model);
  writeCausality(model);
  writeSeal(model);
  writeQuery(model);
  writeBranch(model);
  writeExplain(model);
}

function writeQuery(model) {
  writeJson("gig-governance-decision-index.json", model.decision);
}

function writeCausality(model) {
  writeJson("gig-governance-causality-map.json", model.causality);
}

function writeChronology(model) {
  writeJson("gig-governance-chronology.json", model.chronology);
}

function writeReplay(model) {
  writeJson("gig-replay-intelligence-map.json", model.replay);
}

function writeDependencies(model) {
  writeJson("gig-unresolved-dependency-propagation.json", model.dependency);
}

function writeAuthority(model) {
  writeJson("gig-canonical-authority-map.json", model.authority);
}

function writeSeal(model) {
  writeJson("gig-seal-intelligence-map.json", model.seal);
}

function writeBranch(model) {
  writeJson("gig-branch-domain-authority-map.json", {
    branch_domain_nodes: model.authority.branch_domain_nodes,
    branch_domain_isolation: model.authority.branch_domain_isolation,
    forked_identity_policy: model.authority.forked_identity_policy,
  });
}

function writeExplain(model) {
  writeMarkdown("gig-blocked-safe-governance-intelligence.md", renderExplainMarkdown(model));
}

function writeTopology(model) {
  writeMarkdown("gig-governance-topology.md", [
    "# GIG Governance Topology",
    "",
    "## Purpose",
    "",
    "Unify A46 convergence governance, TGHEE temporal history, replay chronology, dependency propagation, seal integrity, branch-domain provenance, and strict-mode semantics into one queryable blocked-safe graph.",
    "",
    "## Graph Summary",
    "",
    `- Graph ID: ${model.graph.graph_id}`,
    `- Nodes: ${model.graph.nodes.length}`,
    `- Edges: ${model.graph.edges.length}`,
    `- Governance mode: ${model.graph.governance_mode}`,
    "",
    "## Node Types",
    "",
    ...model.graph.node_types.map((type) => `- ${type}`),
    "",
    "## Edge Types",
    "",
    ...model.graph.edge_types.map((type) => `- ${type}`),
    "",
  ].join("\n"));
}

function renderExplainMarkdown(model) {
  return [
    "# GIG Blocked-Safe Governance Intelligence",
    "",
    "## Why Blocked",
    "",
    model.explainability.why_blocked,
    "",
    "## Highest Impact Dependencies",
    "",
    ...model.dependency.highest_impact_dependencies.map((item) => `- ${item.label}: impact=${item.impact}`),
    "",
    "## Replay Intelligence",
    "",
    `- Replay state: ${model.replay.replay_canonical_state}`,
    `- Replay lineage nodes: ${model.replay.replay_lineage_nodes.length}`,
    "",
    "## Canonical Authority",
    "",
    `- Authority: ${model.authority.canonical_owner}`,
    `- Branch-domain isolation: ${model.authority.branch_domain_isolation}`,
    "",
    "## Strict-Mode Explainability",
    "",
    model.explainability.why_strict_mode_failed,
    "",
    "## Final Graph Decision",
    "",
    ...Object.entries(model.graph.final_graph_decision).map(([key, value]) => `- ${key}: ${value}`),
    "",
    "## Forbidden Conclusions",
    "",
    "- No Placement V3 enablement is implied.",
    "- No production readiness is implied.",
    "- No replay/provider/release certification is implied.",
    "- No autonomous execution expansion is implied.",
    "",
  ].join("\n");
}

function enforceGigStrict(model) {
  const failures = [];
  enforceGraphStrict(model.graph);
  if (model.dependency.highest_impact_dependencies.length === 0) failures.push("dependency intelligence disappeared");
  if (model.replay.replay_canonical_state !== "rejected_non_canonical") failures.push("replay lineage became canonical");
  if (model.authority.canonical_owner !== "A46 convergence governance") failures.push("canonical authority changed");
  if (model.seal.seal_continuity !== "blocked_safe_preserved") failures.push("seal continuity changed");
  if (!model.decision.deterministic_decisions) failures.push("governance decisions became nondeterministic");
  for (const [key, expected] of Object.entries(GIG_BLOCKED_SAFE)) {
    if (model.graph.final_graph_decision[key] !== expected) failures.push(`${key} changed from ${expected}`);
  }
  if (failures.length > 0) throw new Error(`GIG strict mode blocked:\n${failures.map((failure) => `- ${failure}`).join("\n")}`);
  console.log("[gig] strict mode passed: graph intelligence remains blocked-safe and deterministic");
}

function loadFixtureIndex() {
  try {
    return walkFiles(FIXTURE_DIR)
      .filter((file) => file.endsWith(".json"))
      .sort()
      .map((file) => {
        const data = JSON.parse(readFileSync(file, "utf8"));
        return { group: path.basename(path.dirname(file)), path: file, graph_node_type: data.graph_node_type };
      });
  } catch {
    return [];
  }
}

function writeJson(file, value) {
  writeFileSync(path.join(GIG_OUT_DIR, file), `${JSON.stringify(value, null, 2)}\n`);
}

function writeMarkdown(file, value) {
  writeFileSync(path.join(GIG_OUT_DIR, file), value);
}

function walkFiles(dir) {
  return readdirSync(dir).flatMap((entry) => {
    const file = path.join(dir, entry);
    return statSync(file).isDirectory() ? walkFiles(file) : file;
  });
}
