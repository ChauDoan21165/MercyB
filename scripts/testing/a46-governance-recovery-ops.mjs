#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";

const EXPECTED_BRANCH = "feat/a42-reliability-forecast-ops";
const A42_ARCHIVE_COMMIT = "15b052e14";
const OUT_DIR = "docs/placement-v3/governance";
const REPORT_BASENAME = "a46-a42-permanent-intake-convergence-reconciliation";
const GLOBAL_MATRIX_BASENAME = "a46-global-permanent-denial-retention-convergence-matrix";
const command = process.argv[2] ?? "auto";
const strict = process.argv.includes("--strict");

const A42_INPUTS = {
  permanentIntakeArchive: "docs/placement-v3/reliability/a42-permanent-intake-archive-summary.json",
  futureEvidenceIntake: "docs/placement-v3/reliability/a42-future-reliability-evidence-intake-contract.json",
  permanentPrerequisites: "docs/placement-v3/reliability/a42-permanent-reliability-prerequisite-index.json",
  permanentDenialRules: "docs/placement-v3/reliability/a42-permanent-reliability-denial-rules.json",
  permanentSequencing: "docs/placement-v3/reliability/a42-permanent-reliability-sequencing.json",
  replayDurabilityContinuity: "docs/placement-v3/reliability/a42-replay-durability-continuity-map.json",
  failoverContradictionDetector: "docs/placement-v3/reliability/a42-failover-contradiction-detector.json",
};

const STREAMS = [
  {
    agent: "A39",
    name: "CapacityPlanningOps",
    archiveHints: [
      "docs/placement-v3/capacity/a39-permanent-denial-retention-archive.json",
      "docs/placement-v3/governance/a39-permanent-denial-retention-archive.json",
    ],
    unresolvedDependencies: ["A33 capacity evidence", "provider calibration", "provider drift"],
  },
  {
    agent: "A42",
    name: "ReliabilityForecastOps",
    archiveHints: [
      "docs/placement-v3/reliability/a42-permanent-intake-archive-summary.json",
      "docs/placement-v3/reliability/a42-permanent-reliability-denial-rules.json",
      "docs/placement-v3/reliability/a42-permanent-reliability-prerequisite-index.json",
      "docs/placement-v3/reliability/a42-permanent-reliability-sequencing.json",
      "docs/placement-v3/reliability/a42-final-archival-governance-retention-summary.json",
      "docs/placement-v3/reliability/a42-long-term-governance-retention-summary.json",
    ],
    unresolvedDependencies: ["A33 endurance evidence", "replay reproducibility", "provider calibration", "audit continuity"],
  },
  {
    agent: "A44",
    name: "HumanReviewExecutionOps",
    archiveHints: [
      "docs/placement-v3/human-review/a44-permanent-denial-retention-archive.json",
      "docs/placement-v3/governance/a44-permanent-denial-retention-archive.json",
    ],
    unresolvedDependencies: ["human review backlog", "fairness/bias evidence"],
  },
  {
    agent: "A45",
    name: "ProviderValidationOps",
    archiveHints: [
      "docs/placement-v3/provider-validation/a45-permanent-denial-retention-archive.json",
      "docs/placement-v3/governance/a45-permanent-denial-retention-archive.json",
    ],
    unresolvedDependencies: ["provider calibration", "provider drift", "CEFR stability evidence"],
  },
  {
    agent: "A47",
    name: "ObservabilityEvidenceOps",
    archiveHints: [
      "docs/placement-v3/observability/a47-permanent-denial-retention-archive.json",
      "docs/placement-v3/governance/a47-permanent-denial-retention-archive.json",
    ],
    unresolvedDependencies: ["audit continuity", "A2 drift evidence", "persistence validation"],
  },
  {
    agent: "A48",
    name: "ReleaseHistoryOps",
    archiveHints: [
      "docs/placement-v3/release/a48-permanent-denial-retention-archive.json",
      "docs/placement-v3/governance/a48-permanent-denial-retention-archive.json",
    ],
    unresolvedDependencies: ["persistence validation", "supervised execution restrictions"],
  },
  {
    agent: "A49",
    name: "ReplayEvidenceOps",
    archiveHints: [
      "docs/placement-v3/replay/a49-permanent-denial-retention-archive.json",
      "docs/placement-v3/governance/a49-permanent-denial-retention-archive.json",
    ],
    unresolvedDependencies: ["replay reproducibility", "audit continuity", "CEFR stability evidence"],
  },
  {
    agent: "A50",
    name: "SupervisedExecutionOps",
    archiveHints: [
      "docs/placement-v3/supervision/a50-permanent-denial-retention-archive.json",
      "docs/placement-v3/governance/a50-permanent-denial-retention-archive.json",
    ],
    unresolvedDependencies: ["supervised execution restrictions", "human review backlog"],
  },
];

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

main();

function main() {
  if (command !== "auto" && command !== "validate" && command !== "global-denial-retention-matrix") {
    throw new Error(`Unknown A46 GovernanceRecoveryOps command: ${command}`);
  }

  ensureBranch();
  mkdirSync(OUT_DIR, { recursive: true });

  if (command === "auto") {
    const report = generateReconciliation();
    const matrix = generateGlobalDenialRetentionMatrix();
    if (strict) {
      enforceStrict(report);
      enforceGlobalMatrixStrict(matrix);
    }
    scanUnsupportedClaims();
    return;
  }

  if (command === "global-denial-retention-matrix") {
    const matrix = generateGlobalDenialRetentionMatrix();
    if (strict) enforceGlobalMatrixStrict(matrix);
    scanUnsupportedClaims();
    return;
  }

  const report = readReport();
  const matrix = readGlobalMatrix();
  enforceStrict(report);
  enforceGlobalMatrixStrict(matrix);
  scanUnsupportedClaims();
  console.log(`[a46] governance validation passed: ${path.join(OUT_DIR, `${REPORT_BASENAME}.json`)}`);
  console.log(`[a46] global denial-retention matrix validation passed: ${path.join(OUT_DIR, `${GLOBAL_MATRIX_BASENAME}.json`)}`);
}

function generateReconciliation() {
  const inputs = Object.fromEntries(
    Object.entries(A42_INPUTS).map(([key, file]) => [key, readJson(file)]),
  );
  const archive = inputs.permanentIntakeArchive;
  const replay = inputs.replayDurabilityContinuity;
  const failover = inputs.failoverContradictionDetector;

  const indexedArtifacts = Object.entries(A42_INPUTS).map(([key, file]) => ({
    key,
    path: file,
    present: existsSync(file),
    riskClassification: inputs[key]?.riskClassification ?? null,
    ready: inputs[key]?.ready ?? null,
    complete: inputs[key]?.complete ?? null,
    production_safe: inputs[key]?.production_safe ?? null,
    placement_v3_enabled: inputs[key]?.placement_v3_enabled ?? null,
    live_validation_complete: inputs[key]?.live_validation_complete ?? null,
    live_provider_validated: inputs[key]?.live_provider_validated ?? null,
    autonomous_execution: inputs[key]?.autonomous_execution ?? null,
  }));

  const report = {
    generatedAt: new Date().toISOString(),
    agent: "A46",
    name: "GovernanceRecoveryOps",
    branch: EXPECTED_BRANCH,
    governanceOnly: true,
    evidenceOnly: true,
    reconciles: "A42 permanent reliability intake archive with global blocked-safe convergence archive",
    referencedA42Commit: A42_ARCHIVE_COMMIT,
    a42PermanentIntakeArchiveCommitRecordedByArtifact: archive.archivedCommit ?? null,
    riskClassification: "BLOCKED_BY_MISSING_A33_ENDURANCE_INPUTS",
    ready: false,
    complete: false,
    schema_completeness: false,
    production_safe: false,
    placement_v3_enabled: false,
    placement_test_enabled: false,
    placement_v3_ui_enabled: false,
    live_validation_complete: false,
    live_provider_validated: false,
    autonomous_execution: "SUPERVISED_ONLY",
    globalPosture: "DO_NOT_ENABLE",
    a42PermanentIntakeArtifactsIndexed: indexedArtifacts.every((artifact) => artifact.present),
    indexedArtifacts,
    a42StrictModeFailureExpected: true,
    a46ConvergenceArchiveMarksReliabilityComplete: false,
    globalDoNotEnablePostureUnchanged: true,
    reliabilityDenialLineage: {
      preservedGlobally: true,
      unresolvedRisk: "BLOCKED_BY_MISSING_A33_ENDURANCE_INPUTS",
      unresolvedOnlyBecauseA33EnduranceEvidenceIncomplete: true,
      a42ReadinessImplied: false,
      productionReadinessImplied: false,
      reason: "A46 imports A42 archive evidence as denial lineage only and does not resolve missing A33 endurance or validation evidence.",
    },
    replayDurabilityContinuity: {
      state: archive.replayDurabilityContinuity?.state ?? "blocked_safe_incomplete",
      blocked_safe_incomplete: archive.replayDurabilityContinuity?.state === "blocked_safe_incomplete",
      certified: false,
      sourceReady: replay.ready,
      sourceComplete: replay.complete,
      reason: "Replay durability continuity remains explicitly incomplete and uncertified pending real A33, replay, observability, review, and supervision evidence.",
    },
    failoverContradictionLineage: {
      traceable: archive.failoverContradictionLineage?.traceable === true,
      resolved: false,
      closedWithoutRealA33Evidence: false,
      unresolvedOnlyBecauseUpstreamEvidenceIncomplete:
        archive.failoverContradictionLineage?.unresolvedOnlyBecauseUpstreamEvidenceIncomplete === true,
      sourceReady: failover.ready,
      sourceComplete: failover.complete,
      reason: "Failover contradiction lineage remains traceable and unresolved only because upstream provider, capacity, observability, replay, supervision, and A33 evidence is incomplete.",
    },
    unsupportedReadinessSuppression: {
      coversA42PermanentIntakeArtifacts: archive.unsupportedReadinessSuppression?.claimScanCoversArchiveArtifacts === true,
      active: archive.unsupportedReadinessSuppression?.active === true,
      unsupportedReadinessClaimsAllowed: false,
      reason: "A46 preserves A42 unsupported-readiness suppression and scans the convergence artifact for unsupported readiness language.",
    },
    strictModeGuards: [
      "fail if A42 reliability readiness is implied",
      "fail if replay durability is marked certified",
      "fail if failover contradiction lineage is closed without real A33 evidence",
      "fail if production_safe becomes true",
      "fail if placement_v3_enabled becomes true",
      "fail if live_validation_complete becomes true",
      "fail if autonomous_execution changes from SUPERVISED_ONLY",
    ],
    forbiddenActionsPreserved: {
      runtimeMutation: false,
      providerExecutionChanges: false,
      liveValidation: false,
      replayCertification: false,
      safetyGateReduction: false,
      fabricatedA33EnduranceEvidence: false,
    },
  };

  writeJsonAndMarkdown(report);
  console.log(`[a46] wrote ${path.join(OUT_DIR, `${REPORT_BASENAME}.json`)}`);
  console.log(`[a46] wrote ${path.join(OUT_DIR, `${REPORT_BASENAME}.md`)}`);
  return report;
}

function generateGlobalDenialRetentionMatrix() {
  const committedArchives = discoverCommittedDenialRetentionArchives();
  const streamMatrix = STREAMS.map((stream) => {
    const hintedArchives = stream.archiveHints.map((file) => indexedArchive(file));
    const discoveredArchives = committedArchives
      .filter((file) => file.includes(`/${stream.agent.toLowerCase()}-`) || file.includes(`/${stream.agent.toUpperCase()}-`))
      .filter((file) => !stream.archiveHints.includes(file))
      .map((file) => indexedArchive(file));
    const archives = [...hintedArchives, ...discoveredArchives];
    const presentArchives = archives.filter((archive) => archive.present);
    const safetyViolations = presentArchives.flatMap((archive) => archive.safetyViolations);

    return {
      agent: stream.agent,
      name: stream.name,
      archiveStatus: presentArchives.length > 0 ? "indexed" : "missing_external_evidence",
      archives,
      unresolvedDependencies: stream.unresolvedDependencies.map((dependency) => ({
        dependency,
        resolved: false,
        status: "unresolved",
        reason: "A46 preserves permanent denial-retention lineage and does not resolve dependencies without committed source evidence.",
      })),
      denialLineagePreserved: true,
      unsupportedReadinessSuppressionActive: true,
      regenerationSafeArchivalContinuity: true,
      strictModeExpectation: "blocked_safe_denial_preserved",
      marksReadinessComplete: false,
      certificationImplied: false,
      safetyViolations,
    };
  });

  const unresolvedDependencyMatrix = REQUIRED_UNRESOLVED_DEPENDENCIES.map((dependency) => ({
    dependency,
    resolved: false,
    status: "unresolved",
    linkedStreams: streamMatrix
      .filter((stream) => stream.unresolvedDependencies.some((entry) => entry.dependency === dependency))
      .map((stream) => stream.agent),
    reason: "Dependency remains unresolved until real cross-stream validation evidence is committed and accepted.",
  }));

  const report = {
    generatedAt: new Date().toISOString(),
    agent: "A46",
    name: "GovernanceRecoveryOps",
    branch: EXPECTED_BRANCH,
    governanceOnly: true,
    evidenceOnly: true,
    reconciles: "multi-stream permanent denial-retention archives into global blocked-safe convergence matrix",
    referencedA42Commit: A42_ARCHIVE_COMMIT,
    production_safe: false,
    production_readiness: false,
    placement_v3_enabled: false,
    placement_v3_enablement: "BLOCKED",
    placement_test_enabled: false,
    placement_v3_ui_enabled: false,
    live_validation_complete: false,
    live_provider_validated: false,
    provider_drift_measured: false,
    production_persistence_validated: false,
    writes_production_data: false,
    autonomous_execution: "SUPERVISED_ONLY",
    globalPosture: "DO_NOT_ENABLE",
    doNotEnableContinuity: true,
    unsupportedReadinessSuppression: {
      active: true,
      global: true,
      weakened: false,
      coversStreams: streamMatrix.map((stream) => stream.agent),
      coversA42PermanentIntakeArtifacts: true,
      unsupportedReadinessClaimsAllowed: false,
    },
    regenerationSafeArchivalContinuity: {
      preserved: true,
      generatedArtifacts: [
        path.join(OUT_DIR, `${REPORT_BASENAME}.json`),
        path.join(OUT_DIR, `${REPORT_BASENAME}.md`),
        path.join(OUT_DIR, `${GLOBAL_MATRIX_BASENAME}.json`),
        path.join(OUT_DIR, `${GLOBAL_MATRIX_BASENAME}.md`),
      ],
      deterministicInputs: STREAMS.flatMap((stream) => stream.archiveHints),
      missingInputsRemainUnresolved: true,
    },
    strictModeConvergenceGovernance: {
      preserved: true,
      a42StrictModeFailureExpected: true,
      a46StrictModeRequiresBlockedSafeInvariants: true,
      failOnResolvedUnverifiedDependencies: true,
      failOnReadinessPromotion: true,
      failOnCertificationImplication: true,
      failOnDoNotEnableRemoval: true,
    },
    streamMatrix,
    committedPermanentDenialRetentionArchives: committedArchives.map((file) => indexedArchive(file)),
    unresolvedDependencyMatrix,
    blockedSafeInvariants: {
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
      globalPosture: "DO_NOT_ENABLE",
    },
    certificationImplications: {
      replay: false,
      provider: false,
      release: false,
      observability: false,
      persistence: false,
    },
    forbiddenActionsPreserved: {
      runtimeMutation: false,
      enablementPromotion: false,
      fabricatedEvidence: false,
      replayProviderReleaseObservabilityCertificationClaims: false,
      persistenceValidationClaims: false,
      governanceBypass: false,
      unrelatedWorktreeCleanup: false,
    },
    convergenceConclusion:
      "All present permanent denial-retention archives are indexed, absent stream archives remain missing external evidence, every required dependency remains unresolved, and global DO_NOT_ENABLE continuity is preserved.",
  };

  writeGlobalMatrixJsonAndMarkdown(report);
  console.log(`[a46] wrote ${path.join(OUT_DIR, `${GLOBAL_MATRIX_BASENAME}.json`)}`);
  console.log(`[a46] wrote ${path.join(OUT_DIR, `${GLOBAL_MATRIX_BASENAME}.md`)}`);
  return report;
}

function enforceStrict(report) {
  const failures = strictFailures(report);
  if (failures.length > 0) {
    throw new Error(`A46 strict mode blocked:\n${failures.map((failure) => `- ${failure}`).join("\n")}`);
  }
  console.log("[a46] strict mode passed: blocked-safe denial posture preserved");
}

function enforceGlobalMatrixStrict(report) {
  const failures = globalMatrixStrictFailures(report);
  if (failures.length > 0) {
    throw new Error(`A46 global denial-retention matrix strict mode blocked:\n${failures.map((failure) => `- ${failure}`).join("\n")}`);
  }
  console.log("[a46] global denial-retention matrix strict mode passed: blocked-safe convergence posture preserved");
}

function strictFailures(report) {
  const failures = [];
  if (report.reliabilityDenialLineage?.a42ReadinessImplied) failures.push("A42 reliability readiness is implied");
  if (report.replayDurabilityContinuity?.certified) failures.push("replay durability is marked certified");
  if (report.failoverContradictionLineage?.closedWithoutRealA33Evidence) {
    failures.push("failover contradiction lineage is closed without real A33 evidence");
  }
  if (report.riskClassification !== "BLOCKED_BY_MISSING_A33_ENDURANCE_INPUTS") {
    failures.push("BLOCKED_BY_MISSING_A33_ENDURANCE_INPUTS is not preserved");
  }
  if (report.ready !== false || report.complete !== false || report.schema_completeness !== false) {
    failures.push("reliability completion state is not blocked-safe false");
  }
  if (report.production_safe !== false) failures.push("production_safe became true or non-false");
  if (report.placement_v3_enabled !== false) failures.push("placement_v3_enabled became true or non-false");
  if (report.live_validation_complete !== false) failures.push("live_validation_complete became true or non-false");
  if (report.live_provider_validated !== false) failures.push("live_provider_validated became true or non-false");
  if (report.autonomous_execution !== "SUPERVISED_ONLY") failures.push("autonomous_execution changed from SUPERVISED_ONLY");
  if (report.globalPosture !== "DO_NOT_ENABLE") failures.push("global DO_NOT_ENABLE posture changed");
  if (!report.a42PermanentIntakeArtifactsIndexed) failures.push("A42 permanent intake archive artifacts are not indexed");
  if (!report.a42StrictModeFailureExpected) failures.push("A42 strict-mode failure is not recorded as expected");
  if (report.a46ConvergenceArchiveMarksReliabilityComplete) failures.push("A46 convergence archive marks reliability complete");
  if (!report.reliabilityDenialLineage?.preservedGlobally) failures.push("A42 reliability denial lineage is not globally preserved");
  if (report.replayDurabilityContinuity?.state !== "blocked_safe_incomplete") {
    failures.push("replay durability continuity is not blocked_safe_incomplete");
  }
  if (!report.failoverContradictionLineage?.traceable || report.failoverContradictionLineage?.resolved) {
    failures.push("failover contradiction lineage is not traceable unresolved");
  }
  if (!report.unsupportedReadinessSuppression?.coversA42PermanentIntakeArtifacts) {
    failures.push("unsupported-readiness suppression does not cover A42 permanent intake artifacts");
  }
  return failures;
}

function globalMatrixStrictFailures(report) {
  const failures = [];
  if (report.production_safe !== false) failures.push("production_safe became true or non-false");
  if (report.production_readiness !== false) failures.push("production_readiness became true or non-false");
  if (report.placement_v3_enabled !== false) failures.push("placement_v3_enabled became true or non-false");
  if (report.placement_v3_enablement !== "BLOCKED") failures.push("placement_v3_enablement changed from BLOCKED");
  if (report.live_validation_complete !== false) failures.push("live_validation_complete became true or non-false");
  if (report.live_provider_validated !== false) failures.push("live_provider_validated became true or non-false");
  if (report.provider_drift_measured !== false) failures.push("provider_drift_measured became true or non-false");
  if (report.production_persistence_validated !== false) {
    failures.push("production_persistence_validated became true or non-false");
  }
  if (report.writes_production_data !== false) failures.push("writes_production_data became true or non-false");
  if (report.autonomous_execution !== "SUPERVISED_ONLY") failures.push("autonomous_execution changed from SUPERVISED_ONLY");
  if (report.globalPosture !== "DO_NOT_ENABLE" || !report.doNotEnableContinuity) {
    failures.push("DO_NOT_ENABLE continuity was removed");
  }
  if (report.unsupportedReadinessSuppression?.weakened || !report.unsupportedReadinessSuppression?.active) {
    failures.push("unsupported-readiness suppression is weakened");
  }
  for (const dependency of report.unresolvedDependencyMatrix ?? []) {
    if (dependency.resolved) failures.push(`${dependency.dependency} is marked resolved`);
  }
  for (const stream of report.streamMatrix ?? []) {
    if (stream.marksReadinessComplete) failures.push(`${stream.agent} marks readiness complete`);
    if (stream.certificationImplied) failures.push(`${stream.agent} implies certification`);
    if (!stream.denialLineagePreserved) failures.push(`${stream.agent} denial lineage is not preserved`);
    if (!stream.unsupportedReadinessSuppressionActive) {
      failures.push(`${stream.agent} unsupported-readiness suppression is not active`);
    }
    for (const dependency of stream.unresolvedDependencies ?? []) {
      if (dependency.resolved) failures.push(`${stream.agent} dependency ${dependency.dependency} is marked resolved`);
    }
    for (const violation of stream.safetyViolations ?? []) failures.push(`${stream.agent} unsafe archive field: ${violation}`);
  }
  if (Object.values(report.certificationImplications ?? {}).some((value) => value !== false)) {
    failures.push("replay/provider/release/observability certification is implied");
  }
  return failures;
}

function writeJsonAndMarkdown(report) {
  writeFileSync(path.join(OUT_DIR, `${REPORT_BASENAME}.json`), `${JSON.stringify(report, null, 2)}\n`);
  writeFileSync(
    path.join(OUT_DIR, `${REPORT_BASENAME}.md`),
    [
      "# A46 A42 Permanent Intake Convergence Reconciliation",
      "",
      `Generated: ${report.generatedAt}`,
      "",
      `- Referenced A42 commit: ${report.referencedA42Commit}`,
      `- A42 artifact recorded commit: ${report.a42PermanentIntakeArchiveCommitRecordedByArtifact ?? "unknown"}`,
      `- Risk classification: ${report.riskClassification}`,
      `- Ready: ${report.ready}`,
      `- Complete: ${report.complete}`,
      `- Schema completeness: ${report.schema_completeness}`,
      `- production_safe: ${report.production_safe}`,
      `- placement_v3_enabled: ${report.placement_v3_enabled}`,
      `- live_validation_complete: ${report.live_validation_complete}`,
      `- live_provider_validated: ${report.live_provider_validated}`,
      `- autonomous_execution: ${report.autonomous_execution}`,
      `- Global posture: ${report.globalPosture}`,
      "",
      "## Indexed A42 Permanent Intake Artifacts",
      "",
      ...report.indexedArtifacts.map(
        (artifact) =>
          `- ${artifact.key}: present=${artifact.present}, risk=${artifact.riskClassification}, ready=${artifact.ready}, complete=${artifact.complete}, path=${artifact.path}`,
      ),
      "",
      "## Reconciliation Findings",
      "",
      `- A42 reliability denial lineage preserved globally: ${report.reliabilityDenialLineage.preservedGlobally}`,
      `- BLOCKED_BY_MISSING_A33_ENDURANCE_INPUTS unresolved: ${report.reliabilityDenialLineage.unresolvedRisk === "BLOCKED_BY_MISSING_A33_ENDURANCE_INPUTS"}`,
      `- Replay durability continuity: ${report.replayDurabilityContinuity.state}`,
      `- Replay durability certified: ${report.replayDurabilityContinuity.certified}`,
      `- Failover contradiction lineage traceable: ${report.failoverContradictionLineage.traceable}`,
      `- Failover contradiction lineage resolved: ${report.failoverContradictionLineage.resolved}`,
      `- Unsupported-readiness suppression covers A42 permanent intake artifacts: ${report.unsupportedReadinessSuppression.coversA42PermanentIntakeArtifacts}`,
      `- A42 strict-mode failure remains expected: ${report.a42StrictModeFailureExpected}`,
      `- A46 convergence archive marks reliability complete: ${report.a46ConvergenceArchiveMarksReliabilityComplete}`,
      `- Global DO_NOT_ENABLE posture unchanged: ${report.globalDoNotEnablePostureUnchanged}`,
      "",
      "A46 reconciles A42 permanent reliability intake archive evidence into global blocked-safe convergence governance. It does not enable Placement V3, change provider execution, perform live validation, certify replay behavior, fabricate A33 endurance evidence, reduce safety gates, or mark reliability complete.",
    ].join("\n") + "\n",
  );
}

function writeGlobalMatrixJsonAndMarkdown(report) {
  writeFileSync(path.join(OUT_DIR, `${GLOBAL_MATRIX_BASENAME}.json`), `${JSON.stringify(report, null, 2)}\n`);
  writeFileSync(
    path.join(OUT_DIR, `${GLOBAL_MATRIX_BASENAME}.md`),
    [
      "# A46 Global Permanent Denial-Retention Convergence Matrix",
      "",
      `Generated: ${report.generatedAt}`,
      "",
      `- Referenced A42 commit: ${report.referencedA42Commit}`,
      `- production_safe: ${report.production_safe}`,
      `- production_readiness: ${report.production_readiness}`,
      `- placement_v3_enabled: ${report.placement_v3_enabled}`,
      `- placement_v3_enablement: ${report.placement_v3_enablement}`,
      `- live_validation_complete: ${report.live_validation_complete}`,
      `- live_provider_validated: ${report.live_provider_validated}`,
      `- provider_drift_measured: ${report.provider_drift_measured}`,
      `- production_persistence_validated: ${report.production_persistence_validated}`,
      `- writes_production_data: ${report.writes_production_data}`,
      `- autonomous_execution: ${report.autonomous_execution}`,
      `- Global posture: ${report.globalPosture}`,
      "",
      "## Stream Matrix",
      "",
      ...report.streamMatrix.map(
        (stream) =>
          `- ${stream.agent} ${stream.name}: archiveStatus=${stream.archiveStatus}, denialLineagePreserved=${stream.denialLineagePreserved}, marksReadinessComplete=${stream.marksReadinessComplete}, certificationImplied=${stream.certificationImplied}`,
      ),
      "",
      "## Unresolved Dependencies",
      "",
      ...report.unresolvedDependencyMatrix.map(
        (dependency) =>
          `- ${dependency.dependency}: status=${dependency.status}, resolved=${dependency.resolved}, linkedStreams=${dependency.linkedStreams.join(", ") || "none"}`,
      ),
      "",
      "## Present Permanent Denial-Retention Archives",
      "",
      ...(report.committedPermanentDenialRetentionArchives.length > 0
        ? report.committedPermanentDenialRetentionArchives.map(
            (archive) =>
              `- ${archive.path}: present=${archive.present}, risk=${archive.riskClassification}, ready=${archive.ready}, complete=${archive.complete}`,
          )
        : ["- none"]),
      "",
      "## Strict-Mode Convergence Governance",
      "",
      `- A42 strict-mode failure remains expected: ${report.strictModeConvergenceGovernance.a42StrictModeFailureExpected}`,
      `- Fail on resolved unverified dependencies: ${report.strictModeConvergenceGovernance.failOnResolvedUnverifiedDependencies}`,
      `- Fail on readiness promotion: ${report.strictModeConvergenceGovernance.failOnReadinessPromotion}`,
      `- Fail on certification implication: ${report.strictModeConvergenceGovernance.failOnCertificationImplication}`,
      `- Fail on DO_NOT_ENABLE removal: ${report.strictModeConvergenceGovernance.failOnDoNotEnableRemoval}`,
      "",
      "## Conclusion",
      "",
      report.convergenceConclusion,
      "",
      "A46 does not mutate runtime behavior, promote enablement, fabricate evidence, assert replay/provider/release/observability certification, claim persistence validation, bypass governance, or clean unrelated worktree files.",
    ].join("\n") + "\n",
  );
}

function readReport() {
  return readJson(path.join(OUT_DIR, `${REPORT_BASENAME}.json`));
}

function readGlobalMatrix() {
  return readJson(path.join(OUT_DIR, `${GLOBAL_MATRIX_BASENAME}.json`));
}

function readJson(file) {
  if (!existsSync(file)) throw new Error(`Missing required governance evidence: ${file}`);
  return JSON.parse(readFileSync(file, "utf8"));
}

function readJsonIfPresent(file) {
  if (!existsSync(file)) return null;
  return JSON.parse(readFileSync(file, "utf8"));
}

function indexedArchive(file) {
  const data = readJsonIfPresent(file);
  const safetyViolations = [];
  if (data) {
    if (data.production_safe === true) safetyViolations.push(`${file} sets production_safe=true`);
    if (data.production_readiness === true) safetyViolations.push(`${file} sets production_readiness=true`);
    if (data.placement_v3_enabled === true) safetyViolations.push(`${file} sets placement_v3_enabled=true`);
    if (data.placement_v3_enablement && data.placement_v3_enablement !== "BLOCKED") {
      safetyViolations.push(`${file} changes placement_v3_enablement from BLOCKED`);
    }
    if (data.live_validation_complete === true) safetyViolations.push(`${file} sets live_validation_complete=true`);
    if (data.live_provider_validated === true) safetyViolations.push(`${file} sets live_provider_validated=true`);
    if (data.provider_drift_measured === true) safetyViolations.push(`${file} sets provider_drift_measured=true`);
    if (data.production_persistence_validated === true) {
      safetyViolations.push(`${file} sets production_persistence_validated=true`);
    }
    if (data.writes_production_data === true) safetyViolations.push(`${file} sets writes_production_data=true`);
    if (data.autonomous_execution && data.autonomous_execution !== "SUPERVISED_ONLY") {
      safetyViolations.push(`${file} changes autonomous_execution from SUPERVISED_ONLY`);
    }
  }
  return {
    path: file,
    present: Boolean(data),
    riskClassification: data?.riskClassification ?? data?.risk ?? null,
    ready: data?.ready ?? null,
    complete: data?.complete ?? null,
    schema_completeness: data?.schema_completeness ?? null,
    production_safe: data?.production_safe ?? null,
    production_readiness: data?.production_readiness ?? null,
    placement_v3_enabled: data?.placement_v3_enabled ?? null,
    placement_v3_enablement: data?.placement_v3_enablement ?? null,
    live_validation_complete: data?.live_validation_complete ?? null,
    live_provider_validated: data?.live_provider_validated ?? null,
    provider_drift_measured: data?.provider_drift_measured ?? null,
    production_persistence_validated: data?.production_persistence_validated ?? null,
    writes_production_data: data?.writes_production_data ?? null,
    autonomous_execution: data?.autonomous_execution ?? null,
    safetyViolations,
  };
}

function discoverCommittedDenialRetentionArchives() {
  const root = "docs/placement-v3";
  if (!existsSync(root)) return [];
  return walkFiles(root)
    .filter((file) => file.endsWith(".json"))
    .filter((file) => /(?:permanent|retention|denial|archive)/i.test(path.basename(file)))
    .sort();
}

function walkFiles(dir) {
  const entries = readdirSync(dir);
  return entries.flatMap((entry) => {
    const file = path.join(dir, entry);
    if (statSync(file).isDirectory()) return walkFiles(file);
    return file;
  });
}

function ensureBranch() {
  const branch = execFileSync("git", ["rev-parse", "--abbrev-ref", "HEAD"], { encoding: "utf8" }).trim();
  if (branch !== EXPECTED_BRANCH) {
    throw new Error(`A46 automation must run on ${EXPECTED_BRANCH}; current branch is ${branch}`);
  }
}

function scanUnsupportedClaims() {
  const files = [
    path.join(OUT_DIR, `${REPORT_BASENAME}.json`),
    path.join(OUT_DIR, `${REPORT_BASENAME}.md`),
    path.join(OUT_DIR, `${GLOBAL_MATRIX_BASENAME}.json`),
    path.join(OUT_DIR, `${GLOBAL_MATRIX_BASENAME}.md`),
  ];
  const forbidden = [
    /\bproduction ready\b/i,
    /\breplay certified\b/i,
    /\breplay certification claim\b/i,
    /\bsafe to enable\b/i,
    /\bready for launch\b/i,
    /\blive validation complete\b/i,
  ];
  const violations = [];
  for (const file of files) {
    if (!existsSync(file)) continue;
    const text = readFileSync(file, "utf8");
    for (const pattern of forbidden) {
      if (pattern.test(text)) violations.push(`${file}: ${pattern}`);
    }
  }
  if (violations.length > 0) {
    throw new Error(`Unsupported A46 readiness claim detected:\n${violations.join("\n")}`);
  }
}
