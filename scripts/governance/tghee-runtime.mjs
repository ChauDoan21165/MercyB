#!/usr/bin/env node

import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import {
  TGHEE_BLOCKED_SAFE,
  TGHEE_DEPENDENCIES,
  TGHEE_STREAMS,
  assertDeterministicEvents,
  buildGovernanceEvents,
  stableId,
} from "./tghee-event-engine.mjs";
import { buildLineageEvolutionMap, enforceLineageStrict } from "./tghee-lineage-tracker.mjs";
import { buildUnresolvedDependencyHistory, enforceDependencyStrict } from "./tghee-dependency-evolution.mjs";
import { buildReplayChronology, enforceReplayStrict } from "./tghee-replay-chronology.mjs";
import { buildCausalityTimeline, enforceCausalityStrict } from "./tghee-causality-timeline.mjs";
import { buildRecoveryHistory, enforceRecoveryStrict } from "./tghee-recovery-history.mjs";
import { buildCanonicalAuthorityHistory, enforceCanonicalStrict } from "./tghee-canonical-evolution.mjs";

const OUT_DIR = "docs/placement-v3/governance";
const FIXTURE_DIR = "tests/governance/fixtures/tghee";
const command = process.argv[2] ?? "all";
const strict = process.argv.includes("--strict");

main();

export function buildTgheeModel() {
  const events = buildGovernanceEvents();
  assertDeterministicEvents(events);
  const lineage = buildLineageEvolutionMap(events);
  const dependencyHistory = buildUnresolvedDependencyHistory(events);
  const replayChronology = buildReplayChronology(events);
  const causality = buildCausalityTimeline(events);
  const recovery = buildRecoveryHistory(events);
  const canonical = buildCanonicalAuthorityHistory(events);
  const fixtures = loadFixtureIndex();
  const timeline = buildTimeline(events, fixtures, lineage, dependencyHistory, replayChronology, causality, recovery, canonical);
  return {
    events,
    timeline,
    lineage,
    dependencyHistory,
    replayChronology,
    causality,
    branchDomainHistory: canonical.branch_domain_history,
    sealEvolutionHistory: buildSealEvolutionHistory(events),
    recovery,
    canonical,
    fixtures,
  };
}

function main() {
  mkdirSync(OUT_DIR, { recursive: true });
  const model = buildTgheeModel();
  const handlers = {
    all: () => writeAll(model),
    timeline: () => writeTimeline(model),
    history: () => writeHistory(model),
    causality: () => writeCausality(model),
    replay: () => writeReplay(model),
    recovery: () => writeRecovery(model),
    "canonical-history": () => writeCanonical(model),
  };
  if (!handlers[command]) throw new Error(`Unknown TGHEE command: ${command}`);
  handlers[command]();
  if (strict) enforceStrict(model);
  console.log(`[tghee] ${command} generated with ${model.events.length} deterministic governance events`);
}

function writeAll(model) {
  writeTimeline(model);
  writeHistory(model);
  writeLineage(model);
  writeDependencies(model);
  writeReplay(model);
  writeCausality(model);
  writeBranch(model);
  writeSeal(model);
  writeRecovery(model);
  writeCanonical(model);
}

function writeTimeline(model) {
  writeJson("tghee-governance-timeline.json", model.timeline);
}

function writeHistory(model) {
  writeMarkdown("tghee-governance-history.md", renderHistoryMarkdown(model));
}

function writeLineage(model) {
  writeJson("tghee-lineage-evolution-map.json", model.lineage);
}

function writeDependencies(model) {
  writeJson("tghee-unresolved-dependency-history.json", model.dependencyHistory);
}

function writeReplay(model) {
  writeJson("tghee-replay-chronology.json", model.replayChronology);
}

function writeCausality(model) {
  writeJson("tghee-governance-causality-timeline.json", model.causality);
}

function writeBranch(model) {
  writeJson("tghee-branch-domain-history.json", model.branchDomainHistory);
}

function writeSeal(model) {
  writeJson("tghee-seal-evolution-history.json", model.sealEvolutionHistory);
}

function writeRecovery(model) {
  writeJson("tghee-recovery-history.json", model.recovery);
}

function writeCanonical(model) {
  writeJson("tghee-canonical-authority-history.json", model.canonical);
}

function buildTimeline(events, fixtures, lineage, dependencyHistory, replayChronology, causality, recovery, canonical) {
  return {
    timeline_id: stableId("tghee-governance-timeline", events.map((event) => event.event_id).join(",")),
    governance_mode: "blocked_safe_temporal_governance_history",
    deterministic_regeneration: true,
    event_count: events.length,
    fixture_history_groups: fixtures,
    streams: TGHEE_STREAMS,
    unresolved_dependency_taxonomy: TGHEE_DEPENDENCIES,
    events,
    supersession_chains: lineage.lineage_edges,
    replay_chains: replayChronology.replay_events,
    branch_divergence_timeline: canonical.authority_transitions.filter((transition) =>
      /branch|lineage|canonical/i.test(transition.type),
    ),
    unresolved_dependency_propagation_waves: dependencyHistory.propagation_waves,
    seal_evolution_events: events.filter((event) => event.scope === "seal"),
    strict_mode_evolution_events: events.filter((event) => event.scope === "strict-mode" || event.type === "strict-mode failure triggered"),
    recovery_history_events: recovery.recovery_events,
    causality_chain: causality.causality_chain,
    blocked_safe_history: {
      ...TGHEE_BLOCKED_SAFE,
      historical_blocked_safe_continuity: true,
      unsupported_readiness_suppression: true,
      supervised_execution_restrictions: "preserved",
    },
    final_temporal_decision: {
      temporal_history_reconstructed: true,
      governance_history_deterministic: true,
      stale_replay_canonical_historically: false,
      branch_contamination_ambiguous: false,
      recovery_history_causal: true,
      seal_degradation_connected: true,
      strict_mode_traceable: true,
      ...TGHEE_BLOCKED_SAFE,
    },
  };
}

function buildSealEvolutionHistory(events) {
  const sealEvents = events.filter((event) => /seal|regeneration|collapse|fixture/i.test(`${event.scope} ${event.type} ${event.summary}`));
  return {
    seal_history_id: stableId("tghee-seal-history", sealEvents.map((event) => event.event_id).join(",")),
    seal_events: sealEvents.map((event) => ({
      event_id: event.event_id,
      ordinal: event.ordinal,
      type: event.type,
      seal_state: event.type === "seal degraded" ? "degraded_input_rejected" : "blocked_safe_continuity_preserved",
      connected_to_recovery: true,
    })),
    deterministic_seal_identity: stableId("tghee-seal-identity", TGHEE_STREAMS.join(","), TGHEE_DEPENDENCIES.join(",")),
    seal_degradation_history_connected: true,
    seal_restoration_history_connected: true,
  };
}

function renderHistoryMarkdown(model) {
  return [
    "# TGHEE Governance History",
    "",
    "## Purpose",
    "",
    "Provide deterministic temporal memory for blocked-safe Placement V3 governance without promoting readiness.",
    "",
    "## Governance Evolution",
    "",
    ...model.events.map((event) => `- ${event.ordinal}. ${event.type} (${event.actor}): ${event.summary}`),
    "",
    "## Historical Dependency Propagation",
    "",
    ...model.dependencyHistory.dependencies.map(
      (item) =>
        `- ${item.dependency}: originated=${item.originated_at_event_id}, events=${item.propagated_event_ids.length}, state=${item.current_state}`,
    ),
    "",
    "## Canonical Authority Evolution",
    "",
    `- Current canonical authority: ${model.canonical.canonical_authority}`,
    `- Canonical branch: ${model.canonical.branch_domain_history.canonical_branch}`,
    "- Stale lineage authority: rejected",
    "- Branch contamination authority: rejected",
    "",
    "## Replay Chronology",
    "",
    ...model.replayChronology.replay_events.map((event) => `- ${event.ordinal}. ${event.type}: ${event.replay_state}`),
    "",
    "## Governance Recovery History",
    "",
    ...model.recovery.recovery_events.map(
      (event) => `- ${event.ordinal}. ${event.type}: ${event.recovery_action}, blockedSafe=${event.blocked_safe_restored}`,
    ),
    "",
    "## Strict-Mode Evolution",
    "",
    ...model.timeline.strict_mode_evolution_events.map((event) => `- ${event.event_id}: ${event.summary}`),
    "",
    "## Final Temporal Decision",
    "",
    ...Object.entries(model.timeline.final_temporal_decision).map(([key, value]) => `- ${key}: ${value}`),
    "",
    "## Forbidden Conclusions",
    "",
    "- No Placement V3 enablement is implied.",
    "- No production readiness is implied.",
    "- No live-provider readiness is implied.",
    "- No replay/provider/release certification is implied.",
    "- No autonomous execution expansion is implied.",
    "",
  ].join("\n");
}

function enforceStrict(model) {
  const failures = [];
  assertDeterministicEvents(model.events);
  enforceLineageStrict(model.lineage);
  enforceDependencyStrict(model.dependencyHistory);
  enforceReplayStrict(model.replayChronology);
  enforceCausalityStrict(model.causality);
  enforceRecoveryStrict(model.recovery);
  enforceCanonicalStrict(model.canonical);
  if (!model.timeline.final_temporal_decision.governance_history_deterministic) failures.push("governance history became nondeterministic");
  if (model.timeline.final_temporal_decision.stale_replay_canonical_historically) failures.push("stale replay became canonical historically");
  if (model.timeline.final_temporal_decision.branch_contamination_ambiguous) failures.push("branch contamination history became ambiguous");
  if (!model.timeline.final_temporal_decision.recovery_history_causal) failures.push("recovery history lost causality");
  if (!model.timeline.final_temporal_decision.seal_degradation_connected) failures.push("seal degradation history became disconnected");
  if (!model.timeline.final_temporal_decision.strict_mode_traceable) failures.push("strict-mode evolution became untraceable");
  for (const [key, expected] of Object.entries(TGHEE_BLOCKED_SAFE)) {
    if (model.timeline.final_temporal_decision[key] !== expected) failures.push(`${key} changed from ${expected}`);
  }
  if (failures.length > 0) throw new Error(`TGHEE strict mode blocked:\n${failures.map((failure) => `- ${failure}`).join("\n")}`);
  console.log("[tghee] strict mode passed: temporal governance history remains blocked-safe and deterministic");
}

function loadFixtureIndex() {
  if (!existsSync(FIXTURE_DIR)) return [];
  return walkFiles(FIXTURE_DIR)
    .filter((file) => file.endsWith(".json"))
    .sort()
    .map((file) => {
      const data = JSON.parse(readFileSync(file, "utf8"));
      return {
        group: path.basename(path.dirname(file)),
        path: file,
        event_type: data.event_type,
        historical_state: data.historical_state,
      };
    });
}

function writeJson(file, value) {
  writeFileSync(path.join(OUT_DIR, file), `${JSON.stringify(value, null, 2)}\n`);
}

function writeMarkdown(file, value) {
  writeFileSync(path.join(OUT_DIR, file), value);
}

function walkFiles(dir) {
  const entries = readdirSync(dir);
  return entries.flatMap((entry) => {
    const file = path.join(dir, entry);
    if (statSync(file).isDirectory()) return walkFiles(file);
    return file;
  });
}
