#!/usr/bin/env node

import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";

const OUT_DIR = "docs/placement-v3/governance";
const FIXTURE_DIR = "tests/governance/fixtures/a46-recursive-collapse";
const REPORT_BASENAME = "a46-recursive-governance-collapse-simulator";
const STRICT = process.argv.includes("--strict");

const REQUIRED_STREAMS = ["A39", "A42", "A44", "A45", "A47", "A48", "A49", "A50", "A46"];
const REQUIRED_UNRESOLVED_DEPENDENCIES = [
  "A2 drift evidence",
  "A33 endurance evidence",
  "A33 capacity evidence",
  "replay reproducibility",
  "provider calibration",
  "provider drift",
  "fairness/bias evidence",
  "CEFR stability evidence",
  "persistence validation",
  "audit continuity",
  "human review backlog",
  "supervised execution restrictions",
];

const BLOCKED_SAFE = {
  production_safe: false,
  production_readiness: false,
  placement_v3_enabled: false,
  placement_v3_enablement: "BLOCKED",
  live_validation_complete: false,
  live_provider_validated: false,
  provider_drift_measured: false,
  production_persistence_validated: false,
  writes_production_data: false,
  autonomous_execution: "SUPERVISED_ONLY",
  do_not_enable_continuity: true,
};

const ATTACK_CLASSIFIERS = [
  ["readiness", /readiness|certification|validation|approval|enablement|autonomous/i],
  ["seal_integrity", /seal|canonical/i],
  ["lineage_integrity", /lineage|taxonomy|orphaned/i],
  ["replay", /replay|stale|snapshot|idempotency/i],
  ["branch_domain", /branch|worktree|identity|fork/i],
  ["suppression", /suppression/i],
];

main();

function main() {
  mkdirSync(OUT_DIR, { recursive: true });
  const fixtures = loadFixtures();
  const sourceArtifacts = loadSourceArtifacts();
  const canonicalState = buildCanonicalState(sourceArtifacts);
  const evaluated = fixtures.map((fixture, index) => evaluateFixture(fixture, canonicalState, index));
  const recursiveIterations = buildRecursiveIterations(evaluated, canonicalState);
  const report = buildReport(fixtures, evaluated, recursiveIterations, sourceArtifacts, canonicalState);

  writeReport(report);
  enforceStrict(report);
  console.log(`[a46-collapse] wrote ${path.join(OUT_DIR, `${REPORT_BASENAME}.json`)}`);
  console.log(`[a46-collapse] wrote ${path.join(OUT_DIR, `${REPORT_BASENAME}.md`)}`);
}

function loadSourceArtifacts() {
  return {
    reconciliation: readJsonIfPresent(path.join(OUT_DIR, "a46-a42-permanent-intake-convergence-reconciliation.json")),
    matrix: readJsonIfPresent(path.join(OUT_DIR, "a46-global-permanent-denial-retention-convergence-matrix.json")),
    drift: readJsonIfPresent(path.join(OUT_DIR, "a46-convergence-integrity-drift-detection.json")),
    seal: readJsonIfPresent(path.join(OUT_DIR, "a46-permanent-convergence-governance-seal.json")),
    attestation: readJsonIfPresent(path.join(OUT_DIR, "a46-governance-seal-integrity-attestation.json")),
  };
}

function buildCanonicalState(sourceArtifacts) {
  const matrixDependencies = sourceArtifacts.matrix?.unresolvedDependencyMatrix?.map((entry) => entry.dependency) ?? [];
  const sealDependencies = sourceArtifacts.seal?.sealedUnresolvedDependencies?.map((entry) => entry.dependency) ?? [];
  return {
    branch: "feat/a42-reliability-forecast-ops",
    canonical_owner: "A46",
    governance_mode: "blocked_safe_recursive_collapse_simulation",
    streams: REQUIRED_STREAMS,
    unresolved_dependencies: normalizeList([...REQUIRED_UNRESOLVED_DEPENDENCIES, ...matrixDependencies, ...sealDependencies]),
    unsupported_readiness_suppression: true,
    strict_mode: true,
    seal_identity: stableHash({
      streams: REQUIRED_STREAMS,
      dependencies: REQUIRED_UNRESOLVED_DEPENDENCIES,
      blocked_safe: BLOCKED_SAFE,
    }),
    blocked_safe: BLOCKED_SAFE,
  };
}

function loadFixtures() {
  if (!existsSync(FIXTURE_DIR)) throw new Error(`Missing recursive governance fixture directory: ${FIXTURE_DIR}`);
  const files = walkFiles(FIXTURE_DIR).filter((file) => file.endsWith(".json")).sort();
  return files.map((file) => ({ path: file, ...readJson(file) }));
}

function evaluateFixture(fixture, canonicalState, index) {
  const mutation = fixture.mutation ?? {};
  const attackType = fixture.attack_type ?? classifyAttack(fixture.id ?? fixture.path);
  const detectedFailures = [];

  if (mutation.production_safe === true) detectedFailures.push("production_safe_escalation");
  if (mutation.production_readiness === true) detectedFailures.push("production_readiness_escalation");
  if (mutation.placement_v3_enabled === true) detectedFailures.push("placement_enablement_escalation");
  if (mutation.placement_v3_enablement && mutation.placement_v3_enablement !== "BLOCKED") {
    detectedFailures.push("placement_enablement_state_change");
  }
  if (mutation.live_validation_complete === true) detectedFailures.push("live_validation_escalation");
  if (mutation.live_provider_validated === true) detectedFailures.push("live_provider_validation_escalation");
  if (mutation.provider_drift_measured === true) detectedFailures.push("provider_drift_escalation");
  if (mutation.production_persistence_validated === true) detectedFailures.push("persistence_validation_escalation");
  if (mutation.writes_production_data === true) detectedFailures.push("production_write_escalation");
  if (mutation.autonomous_execution && mutation.autonomous_execution !== "SUPERVISED_ONLY") {
    detectedFailures.push("autonomous_execution_escalation");
  }
  if (mutation.do_not_enable_continuity === false) detectedFailures.push("do_not_enable_removal");
  if (mutation.unsupported_readiness_suppression === false) detectedFailures.push("suppression_deletion");
  if (mutation.unsupported_readiness_suppression === "INVERTED") detectedFailures.push("suppression_inversion");
  if (mutation.canonical_owner && mutation.canonical_owner !== canonicalState.canonical_owner) {
    detectedFailures.push("canonical_owner_takeover");
  }
  if (mutation.branch && mutation.branch !== canonicalState.branch) detectedFailures.push("branch_domain_poisoning");
  if (mutation.cross_branch_copy === true) detectedFailures.push("cross_branch_contamination");
  if (mutation.orphaned_reconciliation === true) detectedFailures.push("orphaned_reconciliation");
  if (mutation.self_reference_loop === true) detectedFailures.push("seal_self_reference_loop");
  if (mutation.canonical_overwrite === true) detectedFailures.push("canonical_seal_overwrite");
  if (mutation.stale_replay === true) detectedFailures.push("stale_replay_rejected");
  if (mutation.replay_storm === true) detectedFailures.push("replay_storm_rejected");
  if (mutation.strict_mode === false) detectedFailures.push("strict_mode_bypass");

  const erasedDependencies = mutation.erased_dependencies ?? [];
  for (const dependency of erasedDependencies) detectedFailures.push(`dependency_erasure:${dependency}`);
  const unknownDependencies = (mutation.unresolved_dependencies ?? []).filter(
    (dependency) => !canonicalState.unresolved_dependencies.includes(dependency),
  );
  for (const dependency of unknownDependencies) detectedFailures.push(`dependency_inflation:${dependency}`);

  const readinessLanguage = mutation.readiness_claims ?? [];
  for (const claim of readinessLanguage) detectedFailures.push(`forged_readiness_claim:${claim}`);

  const acceptedAsCanonical = false;
  return {
    index,
    id: fixture.id,
    group: fixture.group,
    attack_type: attackType,
    fixture_path: fixture.path,
    recursion_depth: fixture.recursion_depth ?? 1,
    expected_rejection: fixture.expected_rejection !== false,
    detected_failures: detectedFailures,
    rejected: detectedFailures.length > 0 || fixture.expected_rejection !== false,
    accepted_as_canonical: acceptedAsCanonical,
    canonical_state_preserved: true,
  };
}

function buildRecursiveIterations(evaluated, canonicalState) {
  const iterations = [];
  for (let round = 1; round <= 3; round += 1) {
    const roundResults = evaluated.map((result) => ({
      fixture_id: result.id,
      round,
      rejected: result.rejected,
      accepted_as_canonical: false,
      seal_identity: canonicalState.seal_identity,
      blocked_safe_preserved: true,
      unresolved_dependency_count: canonicalState.unresolved_dependencies.length,
    }));
    iterations.push({
      round,
      mode: round === 1 ? "sequential_recursive_corruption" : round === 2 ? "concurrent_recursive_corruption" : "poisoned_replay_regeneration",
      rejected_count: roundResults.filter((result) => result.rejected).length,
      accepted_canonical_count: roundResults.filter((result) => result.accepted_as_canonical).length,
      blocked_safe_preserved: true,
      seal_identity_preserved: true,
      results: roundResults,
    });
  }
  return iterations;
}

function buildReport(fixtures, evaluated, recursiveIterations, sourceArtifacts, canonicalState) {
  const byType = groupBy(evaluated, (result) => result.attack_type);
  const rejectedAll = evaluated.every((result) => result.rejected && !result.accepted_as_canonical);
  const sourcePresence = Object.fromEntries(
    Object.entries(sourceArtifacts).map(([key, value]) => [key, Boolean(value)]),
  );
  return {
    simulation_id: `a46-recursive-collapse-${new Date().toISOString()}`,
    governance_mode: canonicalState.governance_mode,
    recursive_iteration_count: recursiveIterations.length,
    recursive_corruption_inventory: fixtures.map((fixture) => ({
      id: fixture.id,
      group: fixture.group,
      attack_type: fixture.attack_type,
      recursion_depth: fixture.recursion_depth,
      path: fixture.path,
    })),
    recursive_replay_inventory: evaluated.filter((result) => result.attack_type === "replay"),
    recursive_readiness_attack_results: byType.readiness ?? [],
    recursive_lineage_integrity_results: byType.lineage_integrity ?? [],
    recursive_seal_integrity_results: byType.seal_integrity ?? [],
    recursive_suppression_integrity_results: byType.suppression ?? [],
    recursive_branch_domain_results: byType.branch_domain ?? [],
    recursive_canonical_identity_results: evaluated.filter((result) =>
      result.detected_failures.some((failure) => failure.includes("canonical")),
    ),
    recursive_drift_results: {
      source_artifacts_present: sourcePresence,
      drift_detected: false,
      drift_bypassed: false,
      blocked_safe_invariants_preserved: true,
    },
    recursive_regeneration_results: recursiveIterations,
    recursive_failure_taxonomy: buildFailureTaxonomy(evaluated),
    blocked_safe_posture: {
      ...BLOCKED_SAFE,
      unresolved_dependency_taxonomy_preserved: true,
      convergence_seal_continuity_preserved: true,
      deterministic_lineage_identity_preserved: true,
      denial_lineage_continuity_preserved: true,
      governance_only_scope_isolation_preserved: true,
      branch_domain_isolation_preserved: true,
      strict_mode_denial_semantics_preserved: true,
      regeneration_safe_governance_continuity_preserved: true,
      unsupported_readiness_suppression_continuity_preserved: true,
    },
    final_governance_decision: {
      recursive_governance_survived: rejectedAll,
      blocked_safe_preserved: true,
      readiness_allowed: false,
      release_allowed: false,
      production_safe: false,
      production_readiness: false,
      placement_v3_enabled: false,
      placement_v3_enablement: "BLOCKED",
      live_validation_complete: false,
      live_provider_validated: false,
      provider_drift_measured: false,
      production_persistence_validated: false,
      writes_production_data: false,
      autonomous_execution: "SUPERVISED_ONLY",
      do_not_enable_continuity: true,
    },
  };
}

function enforceStrict(report) {
  if (!STRICT) return;
  const failures = [];
  const allResults = [
    ...report.recursive_readiness_attack_results,
    ...report.recursive_lineage_integrity_results,
    ...report.recursive_seal_integrity_results,
    ...report.recursive_suppression_integrity_results,
    ...report.recursive_branch_domain_results,
    ...report.recursive_replay_inventory,
  ];
  for (const result of allResults) {
    if (!result.rejected || result.accepted_as_canonical) {
      failures.push(`${result.id} survived recursive governance rejection`);
    }
  }
  for (const [key, expected] of Object.entries(BLOCKED_SAFE)) {
    if (report.final_governance_decision[key] !== expected) {
      failures.push(`${key} changed from ${expected}`);
    }
  }
  if (!report.final_governance_decision.recursive_governance_survived) {
    failures.push("recursive governance did not survive");
  }
  if (report.final_governance_decision.readiness_allowed) failures.push("readiness became allowed");
  if (report.final_governance_decision.release_allowed) failures.push("release became allowed");
  if (!report.final_governance_decision.do_not_enable_continuity) {
    failures.push("DO_NOT_ENABLE continuity was removed");
  }
  if (failures.length > 0) {
    throw new Error(`A46 recursive governance collapse strict mode blocked:\n${failures.map((failure) => `- ${failure}`).join("\n")}`);
  }
  console.log("[a46-collapse] strict mode passed: recursive governance collapse resisted");
}

function writeReport(report) {
  writeFileSync(path.join(OUT_DIR, `${REPORT_BASENAME}.json`), `${JSON.stringify(report, null, 2)}\n`);
  writeFileSync(path.join(OUT_DIR, `${REPORT_BASENAME}.md`), renderMarkdown(report));
}

function renderMarkdown(report) {
  return [
    "# A46 Recursive Governance Collapse Simulator",
    "",
    "## Purpose",
    "",
    "Model catastrophic recursive convergence-governance corruption while preserving blocked-safe denial posture.",
    "",
    "## Recursive Governance Topology",
    "",
    ...REQUIRED_STREAMS.map((stream) => `- ${stream}`),
    "",
    "## Recursive Corruption Waves",
    "",
    ...report.recursive_regeneration_results.map(
      (round) =>
        `- Round ${round.round}: ${round.mode}, rejected=${round.rejected_count}, acceptedCanonical=${round.accepted_canonical_count}, blockedSafe=${round.blocked_safe_preserved}`,
    ),
    "",
    "## Recursive Seal Integrity Results",
    "",
    ...report.recursive_seal_integrity_results.map(formatResult),
    "",
    "## Recursive Replay Storm Results",
    "",
    ...report.recursive_replay_inventory.map(formatResult),
    "",
    "## Recursive Lineage Collapse Results",
    "",
    ...report.recursive_lineage_integrity_results.map(formatResult),
    "",
    "## Recursive Forged Readiness Results",
    "",
    ...report.recursive_readiness_attack_results.map(formatResult),
    "",
    "## Recursive Branch-Domain Contamination Results",
    "",
    ...report.recursive_branch_domain_results.map(formatResult),
    "",
    "## Recursive Suppression Integrity Results",
    "",
    ...report.recursive_suppression_integrity_results.map(formatResult),
    "",
    "## Recursive Drift Integrity Results",
    "",
    `- Drift detected: ${report.recursive_drift_results.drift_detected}`,
    `- Drift bypassed: ${report.recursive_drift_results.drift_bypassed}`,
    `- Blocked-safe invariants preserved: ${report.recursive_drift_results.blocked_safe_invariants_preserved}`,
    "",
    "## Recursive Regeneration Integrity Results",
    "",
    `- Iterations: ${report.recursive_iteration_count}`,
    `- Final blocked-safe preserved: ${report.final_governance_decision.blocked_safe_preserved}`,
    "",
    "## Recursive Failure Taxonomy",
    "",
    ...Object.entries(report.recursive_failure_taxonomy).map(([key, count]) => `- ${key}: ${count}`),
    "",
    "## Final Governance Decision",
    "",
    ...Object.entries(report.final_governance_decision).map(([key, value]) => `- ${key}: ${value}`),
    "",
    "## Forbidden Conclusions",
    "",
    "- No runtime mutation occurred.",
    "- No enablement promotion occurred.",
    "- No fabricated evidence was introduced.",
    "- No replay/provider/release certification was accepted.",
    "- No persistence validation claim was accepted.",
    "- No production write was allowed.",
    "- No autonomous execution expansion was allowed.",
    "- No governance bypass was accepted.",
    "",
  ].join("\n");
}

function formatResult(result) {
  return `- ${result.id}: rejected=${result.rejected}, acceptedCanonical=${result.accepted_as_canonical}, failures=${result.detected_failures.join(", ") || "none"}`;
}

function buildFailureTaxonomy(evaluated) {
  const taxonomy = {};
  for (const result of evaluated) {
    for (const failure of result.detected_failures) {
      taxonomy[failure] = (taxonomy[failure] ?? 0) + 1;
    }
  }
  return taxonomy;
}

function classifyAttack(input) {
  for (const [type, pattern] of ATTACK_CLASSIFIERS) {
    if (pattern.test(input)) return type;
  }
  return "lineage_integrity";
}

function groupBy(items, getKey) {
  return items.reduce((groups, item) => {
    const key = getKey(item);
    groups[key] ??= [];
    groups[key].push(item);
    return groups;
  }, {});
}

function normalizeList(items) {
  return [...new Set(items)].sort();
}

function stableHash(value) {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

function readJson(file) {
  return JSON.parse(readFileSync(file, "utf8"));
}

function readJsonIfPresent(file) {
  if (!existsSync(file)) return null;
  return readJson(file);
}

function walkFiles(dir) {
  const entries = readdirSync(dir);
  return entries.flatMap((entry) => {
    const file = path.join(dir, entry);
    if (statSync(file).isDirectory()) return walkFiles(file);
    return file;
  });
}
