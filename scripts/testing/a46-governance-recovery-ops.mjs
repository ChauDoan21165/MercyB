#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";

const EXPECTED_BRANCH = "feat/a42-reliability-forecast-ops";
const A42_ARCHIVE_COMMIT = "15b052e14";
const OUT_DIR = "docs/placement-v3/governance";
const REPORT_BASENAME = "a46-a42-permanent-intake-convergence-reconciliation";
const GLOBAL_MATRIX_BASENAME = "a46-global-permanent-denial-retention-convergence-matrix";
const DRIFT_DETECTION_BASENAME = "a46-convergence-integrity-drift-detection";
const CONVERGENCE_SEAL_BASENAME = "a46-permanent-convergence-governance-seal";
const SEAL_ATTESTATION_BASENAME = "a46-governance-seal-integrity-attestation";
const RECURSIVE_COLLAPSE_BASENAME = "a46-recursive-governance-collapse-simulator";
const RECURSIVE_COLLAPSE_SCRIPT = "scripts/governance/a46-recursive-governance-collapse-simulator.mjs";
const TGHEE_SCRIPT = "scripts/governance/tghee-runtime.mjs";
const TGHEE_ARTIFACTS = [
  "tghee-governance-timeline",
  "tghee-lineage-evolution-map",
  "tghee-unresolved-dependency-history",
  "tghee-replay-chronology",
  "tghee-governance-causality-timeline",
  "tghee-branch-domain-history",
  "tghee-seal-evolution-history",
  "tghee-recovery-history",
  "tghee-canonical-authority-history",
];
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
  if (
    command !== "auto" &&
    command !== "validate" &&
    command !== "global-denial-retention-matrix" &&
    command !== "detect-convergence-drift" &&
    command !== "permanent-convergence-seal" &&
    command !== "seal-integrity-attestation"
  ) {
    throw new Error(`Unknown A46 GovernanceRecoveryOps command: ${command}`);
  }

  ensureBranch();
  mkdirSync(OUT_DIR, { recursive: true });

  if (command === "auto") {
    const report = generateReconciliation();
    const matrix = generateGlobalDenialRetentionMatrix();
    const drift = generateConvergenceIntegrityDriftDetection(matrix);
    const seal = generatePermanentConvergenceGovernanceSeal(matrix, drift);
    const attestation = generateGovernanceSealIntegrityAttestation(report, matrix, drift, seal);
    runRecursiveCollapseSimulator(strict);
    runTgheeRuntime("all", strict);
    if (strict) {
      enforceStrict(report);
      enforceGlobalMatrixStrict(matrix);
      enforceDriftDetectionStrict(drift);
      enforceConvergenceSealStrict(seal);
      enforceSealAttestationStrict(attestation);
    }
    scanUnsupportedClaims();
    return;
  }

  if (command === "seal-integrity-attestation") {
    const report = existsSync(path.join(OUT_DIR, `${REPORT_BASENAME}.json`))
      ? readReport()
      : generateReconciliation();
    const matrix = existsSync(path.join(OUT_DIR, `${GLOBAL_MATRIX_BASENAME}.json`))
      ? readGlobalMatrix()
      : generateGlobalDenialRetentionMatrix();
    const drift = existsSync(path.join(OUT_DIR, `${DRIFT_DETECTION_BASENAME}.json`))
      ? readDriftDetection()
      : generateConvergenceIntegrityDriftDetection(matrix);
    const seal = existsSync(path.join(OUT_DIR, `${CONVERGENCE_SEAL_BASENAME}.json`))
      ? readConvergenceSeal()
      : generatePermanentConvergenceGovernanceSeal(matrix, drift);
    const attestation = generateGovernanceSealIntegrityAttestation(report, matrix, drift, seal);
    if (strict) enforceSealAttestationStrict(attestation);
    scanUnsupportedClaims();
    return;
  }

  if (command === "global-denial-retention-matrix") {
    const matrix = generateGlobalDenialRetentionMatrix();
    if (strict) enforceGlobalMatrixStrict(matrix);
    scanUnsupportedClaims();
    return;
  }

  if (command === "detect-convergence-drift") {
    const matrix = existsSync(path.join(OUT_DIR, `${GLOBAL_MATRIX_BASENAME}.json`))
      ? readGlobalMatrix()
      : generateGlobalDenialRetentionMatrix();
    const drift = generateConvergenceIntegrityDriftDetection(matrix);
    if (strict) enforceDriftDetectionStrict(drift);
    scanUnsupportedClaims();
    return;
  }

  if (command === "permanent-convergence-seal") {
    const matrix = existsSync(path.join(OUT_DIR, `${GLOBAL_MATRIX_BASENAME}.json`))
      ? readGlobalMatrix()
      : generateGlobalDenialRetentionMatrix();
    const drift = existsSync(path.join(OUT_DIR, `${DRIFT_DETECTION_BASENAME}.json`))
      ? readDriftDetection()
      : generateConvergenceIntegrityDriftDetection(matrix);
    const seal = generatePermanentConvergenceGovernanceSeal(matrix, drift);
    if (strict) enforceConvergenceSealStrict(seal);
    scanUnsupportedClaims();
    return;
  }

  const report = readReport();
  const matrix = readGlobalMatrix();
  const drift = existsSync(path.join(OUT_DIR, `${DRIFT_DETECTION_BASENAME}.json`))
    ? readDriftDetection()
    : generateConvergenceIntegrityDriftDetection(matrix);
  const seal = existsSync(path.join(OUT_DIR, `${CONVERGENCE_SEAL_BASENAME}.json`))
    ? readConvergenceSeal()
    : generatePermanentConvergenceGovernanceSeal(matrix, drift);
  const attestation = existsSync(path.join(OUT_DIR, `${SEAL_ATTESTATION_BASENAME}.json`))
    ? readSealAttestation()
    : generateGovernanceSealIntegrityAttestation(report, matrix, drift, seal);
  enforceStrict(report);
  enforceGlobalMatrixStrict(matrix);
  enforceDriftDetectionStrict(drift);
  enforceConvergenceSealStrict(seal);
  enforceSealAttestationStrict(attestation);
  runRecursiveCollapseSimulator(true);
  runTgheeRuntime("all", true);
  scanUnsupportedClaims();
  console.log(`[a46] governance validation passed: ${path.join(OUT_DIR, `${REPORT_BASENAME}.json`)}`);
  console.log(`[a46] global denial-retention matrix validation passed: ${path.join(OUT_DIR, `${GLOBAL_MATRIX_BASENAME}.json`)}`);
  console.log(`[a46] convergence-integrity drift validation passed: ${path.join(OUT_DIR, `${DRIFT_DETECTION_BASENAME}.json`)}`);
  console.log(`[a46] permanent convergence governance seal validation passed: ${path.join(OUT_DIR, `${CONVERGENCE_SEAL_BASENAME}.json`)}`);
  console.log(`[a46] governance seal integrity attestation validation passed: ${path.join(OUT_DIR, `${SEAL_ATTESTATION_BASENAME}.json`)}`);
  console.log(`[a46] recursive governance collapse simulator validation passed: ${path.join(OUT_DIR, `${RECURSIVE_COLLAPSE_BASENAME}.json`)}`);
  console.log(`[a46] temporal governance history validation passed: ${path.join(OUT_DIR, "tghee-governance-timeline.json")}`);
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
        path.join(OUT_DIR, `${DRIFT_DETECTION_BASENAME}.json`),
        path.join(OUT_DIR, `${DRIFT_DETECTION_BASENAME}.md`),
        path.join(OUT_DIR, `${CONVERGENCE_SEAL_BASENAME}.json`),
        path.join(OUT_DIR, `${CONVERGENCE_SEAL_BASENAME}.md`),
        path.join(OUT_DIR, `${SEAL_ATTESTATION_BASENAME}.json`),
        path.join(OUT_DIR, `${SEAL_ATTESTATION_BASENAME}.md`),
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

function generateConvergenceIntegrityDriftDetection(matrix = readGlobalMatrix()) {
  const checks = [
    checkUnresolvedDependencyRemoval(matrix),
    checkDenialLineageWeakening(matrix),
    checkUnsupportedReadinessSuppressionRegression(matrix),
    checkStrictModeEnforcementRegression(matrix),
    checkBlockedSafeInvariantDrift(matrix),
    checkReconciliationCoverageGaps(matrix),
    checkStreamOmissionFromMatrix(matrix),
    checkUnauthorizedReadinessTerminology(),
    checkEnablementLanguageInsertion(),
    checkSupervisedExecutionPostureDrift(matrix),
    checkRegenerationSafeConvergenceContinuity(matrix),
  ];

  const driftFindings = checks.filter((check) => check.status !== "pass");
  const report = {
    generatedAt: new Date().toISOString(),
    agent: "A46",
    name: "GovernanceRecoveryOps",
    branch: EXPECTED_BRANCH,
    governanceOnly: true,
    evidenceOnly: true,
    sourceMatrix: path.join(OUT_DIR, `${GLOBAL_MATRIX_BASENAME}.json`),
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
    doNotEnableContinuity: true,
    requiredStreams: STREAMS.map((stream) => stream.agent),
    requiredUnresolvedDependencies: REQUIRED_UNRESOLVED_DEPENDENCIES,
    driftDetectionRequirements: [
      "unresolved dependency removal",
      "denial-lineage weakening",
      "unsupported-readiness suppression regression",
      "strict-mode enforcement regression",
      "blocked-safe invariant drift",
      "reconciliation coverage gaps",
      "stream omission from convergence matrix",
      "unauthorized readiness terminology",
      "enablement-language insertion",
      "supervised-execution posture drift",
      "regeneration-safe convergence continuity",
    ],
    checks,
    driftDetected: driftFindings.length > 0,
    driftFindings,
    strictModeExpectation: {
      failIfUnresolvedDependenciesDisappear: true,
      failIfDenialLineageWeakens: true,
      failIfUnsupportedReadinessSuppressionWeakens: true,
      failIfBlockedSafeInvariantsDrift: true,
      failIfReadinessOrCertificationLanguageAppears: true,
      failIfPlacementV3EnablementChangesFromBlocked: true,
      failIfWritesProductionDataBecomesTrue: true,
      failIfAutonomousExecutionChangesFromSupervisedOnly: true,
      failIfDoNotEnableContinuityRemoved: true,
    },
    regenerationSafeConvergenceContinuity: {
      preserved: true,
      sourceMatrixGenerated: existsSync(path.join(OUT_DIR, `${GLOBAL_MATRIX_BASENAME}.json`)),
      driftArtifactGenerated: true,
      missingInputsRemainUnresolved: matrix.regenerationSafeArchivalContinuity?.missingInputsRemainUnresolved === true,
    },
    conclusion:
      driftFindings.length === 0
        ? "No convergence-governance drift detected; all unresolved dependency, blocked-safe invariant, denial lineage, and supervised-execution restrictions remain preserved."
        : "Convergence-governance drift detected; strict mode must block until all findings are resolved.",
  };

  writeDriftDetectionJsonAndMarkdown(report);
  console.log(`[a46] wrote ${path.join(OUT_DIR, `${DRIFT_DETECTION_BASENAME}.json`)}`);
  console.log(`[a46] wrote ${path.join(OUT_DIR, `${DRIFT_DETECTION_BASENAME}.md`)}`);
  return report;
}

function generatePermanentConvergenceGovernanceSeal(matrix = readGlobalMatrix(), drift = readDriftDetection()) {
  const sealedStreams = STREAMS.map((stream) => {
    const matrixStream = (matrix.streamMatrix ?? []).find((entry) => entry.agent === stream.agent);
    return {
      agent: stream.agent,
      name: stream.name,
      sealed: Boolean(matrixStream),
      archiveStatus: matrixStream?.archiveStatus ?? "missing_from_matrix",
      denialLineagePreserved: matrixStream?.denialLineagePreserved === true,
      unsupportedReadinessSuppressionActive: matrixStream?.unsupportedReadinessSuppressionActive === true,
      regenerationSafeArchivalContinuity: matrixStream?.regenerationSafeArchivalContinuity === true,
      marksReadinessComplete: matrixStream?.marksReadinessComplete === true,
      certificationImplied: matrixStream?.certificationImplied === true,
      unresolvedDependencies: (matrixStream?.unresolvedDependencies ?? []).map((dependency) => ({
        dependency: dependency.dependency,
        sealedState: dependency.status,
        resolved: dependency.resolved,
      })),
    };
  });

  const sealedUnresolvedDependencies = REQUIRED_UNRESOLVED_DEPENDENCIES.map((dependency) => {
    const matrixDependency = (matrix.unresolvedDependencyMatrix ?? []).find((entry) => entry.dependency === dependency);
    return {
      dependency,
      sealedState: matrixDependency?.status ?? "missing",
      resolved: matrixDependency?.resolved ?? null,
      immutable: matrixDependency?.status === "unresolved" && matrixDependency?.resolved === false,
      linkedStreams: matrixDependency?.linkedStreams ?? [],
    };
  });

  const report = {
    generatedAt: new Date().toISOString(),
    agent: "A46",
    name: "GovernanceRecoveryOps",
    branch: EXPECTED_BRANCH,
    governanceOnly: true,
    evidenceOnly: true,
    seal: "permanent convergence governance seal",
    sourceArtifacts: {
      a42Reconciliation: path.join(OUT_DIR, `${REPORT_BASENAME}.json`),
      globalMatrix: path.join(OUT_DIR, `${GLOBAL_MATRIX_BASENAME}.json`),
      driftDetection: path.join(OUT_DIR, `${DRIFT_DETECTION_BASENAME}.json`),
    },
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
    doNotEnableContinuity: true,
    sealedStreams,
    sealedUnresolvedDependencies,
    unresolvedDependencyTaxonomyImmutable: sealedUnresolvedDependencies.every(
      (dependency) => dependency.immutable === true,
    ),
    convergenceIntegrityDriftEnforcement: {
      preserved: drift.driftDetected === false,
      sourceDriftDetected: drift.driftDetected,
      checksPassed: (drift.checks ?? []).every((check) => check.status === "pass"),
      checkCount: drift.checks?.length ?? 0,
    },
    unsupportedReadinessSuppression: {
      permanent: true,
      active: matrix.unsupportedReadinessSuppression?.active === true,
      global: matrix.unsupportedReadinessSuppression?.global === true,
      weakened: matrix.unsupportedReadinessSuppression?.weakened === true,
      unsupportedReadinessClaimsAllowed: false,
      sealedAcrossStreams: sealedStreams.every((stream) => stream.unsupportedReadinessSuppressionActive === true),
    },
    strictModeGovernanceSemantics: {
      preserved: matrix.strictModeConvergenceGovernance?.preserved === true,
      failOnResolvedUnverifiedDependencies:
        matrix.strictModeConvergenceGovernance?.failOnResolvedUnverifiedDependencies === true,
      failOnReadinessPromotion: matrix.strictModeConvergenceGovernance?.failOnReadinessPromotion === true,
      failOnCertificationImplication: matrix.strictModeConvergenceGovernance?.failOnCertificationImplication === true,
      failOnDoNotEnableRemoval: matrix.strictModeConvergenceGovernance?.failOnDoNotEnableRemoval === true,
    },
    regenerationSafeArchivalContinuity: {
      preserved: matrix.regenerationSafeArchivalContinuity?.preserved === true,
      missingInputsRemainUnresolved: matrix.regenerationSafeArchivalContinuity?.missingInputsRemainUnresolved === true,
      generatedArtifacts: [
        ...(matrix.regenerationSafeArchivalContinuity?.generatedArtifacts ?? []),
        path.join(OUT_DIR, `${CONVERGENCE_SEAL_BASENAME}.json`),
        path.join(OUT_DIR, `${CONVERGENCE_SEAL_BASENAME}.md`),
      ],
    },
    convergenceMatrixContinuity: {
      preserved: true,
      sourceMatrix: path.join(OUT_DIR, `${GLOBAL_MATRIX_BASENAME}.json`),
      requiredStreamsPresent: sealedStreams.every((stream) => stream.sealed === true),
      streamCount: sealedStreams.length,
    },
    supervisedExecutionDenialContinuity: {
      preserved: matrix.autonomous_execution === "SUPERVISED_ONLY",
      autonomous_execution: "SUPERVISED_ONLY",
    },
    doNotEnableContinuity: true,
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
    conclusion:
      "A46 permanently seals convergence governance across reconciled denial-retention archives while preserving unresolved dependencies, blocked-safe invariants, strict-mode guards, supervised-only execution, and DO_NOT_ENABLE continuity.",
  };

  writeConvergenceSealJsonAndMarkdown(report);
  console.log(`[a46] wrote ${path.join(OUT_DIR, `${CONVERGENCE_SEAL_BASENAME}.json`)}`);
  console.log(`[a46] wrote ${path.join(OUT_DIR, `${CONVERGENCE_SEAL_BASENAME}.md`)}`);
  return report;
}

function generateGovernanceSealIntegrityAttestation(
  reconciliation = readReport(),
  matrix = readGlobalMatrix(),
  drift = readDriftDetection(),
  seal = readConvergenceSeal(),
) {
  const artifactPresence = {
    permanentConvergenceGovernanceSeal: attestArtifact(path.join(OUT_DIR, `${CONVERGENCE_SEAL_BASENAME}.json`)),
    convergenceDriftDetector: attestArtifact(path.join(OUT_DIR, `${DRIFT_DETECTION_BASENAME}.json`)),
    strictModeRegressionSentinel: attestArtifact(path.join(OUT_DIR, `${CONVERGENCE_SEAL_BASENAME}.json`)),
    globalDenialRetentionMatrix: attestArtifact(path.join(OUT_DIR, `${GLOBAL_MATRIX_BASENAME}.json`)),
    unresolvedDependencyNormalization: attestArtifact(path.join(OUT_DIR, `${GLOBAL_MATRIX_BASENAME}.json`)),
    denialRetentionReconciliationLedgers: attestArtifact(path.join(OUT_DIR, `${REPORT_BASENAME}.json`)),
    unsupportedReadinessSuppressionContinuity: attestArtifact(path.join(OUT_DIR, `${CONVERGENCE_SEAL_BASENAME}.json`)),
    supervisedExecutionDenialContinuity: attestArtifact(path.join(OUT_DIR, `${CONVERGENCE_SEAL_BASENAME}.json`)),
  };

  const streamAttestation = STREAMS.map((stream) => {
    const sealedStream = (seal.sealedStreams ?? []).find((entry) => entry.agent === stream.agent);
    const matrixStream = (matrix.streamMatrix ?? []).find((entry) => entry.agent === stream.agent);
    return {
      agent: stream.agent,
      name: stream.name,
      presentInMatrix: Boolean(matrixStream),
      sealed: sealedStream?.sealed === true,
      denialLineagePreserved: sealedStream?.denialLineagePreserved === true,
      unsupportedReadinessSuppressionActive: sealedStream?.unsupportedReadinessSuppressionActive === true,
      supervisedExecutionDenied: seal.autonomous_execution === "SUPERVISED_ONLY",
      unresolvedDependenciesAttested: (sealedStream?.unresolvedDependencies ?? []).every(
        (dependency) => dependency.sealedState === "unresolved" && dependency.resolved === false,
      ),
    };
  });

  const invariantAttestation = {
    production_safe: seal.production_safe === false,
    production_readiness: seal.production_readiness === false,
    placement_v3_enabled: seal.placement_v3_enabled === false,
    placement_v3_enablement: seal.placement_v3_enablement === "BLOCKED",
    live_validation_complete: seal.live_validation_complete === false,
    live_provider_validated: seal.live_provider_validated === false,
    provider_drift_measured: seal.provider_drift_measured === false,
    production_persistence_validated: seal.production_persistence_validated === false,
    writes_production_data: seal.writes_production_data === false,
    autonomous_execution: seal.autonomous_execution === "SUPERVISED_ONLY",
    doNotEnableContinuity: seal.doNotEnableContinuity === true && seal.globalPosture === "DO_NOT_ENABLE",
  };

  const unresolvedDependencyAttestation = REQUIRED_UNRESOLVED_DEPENDENCIES.map((dependency) => {
    const sealedDependency = (seal.sealedUnresolvedDependencies ?? []).find((entry) => entry.dependency === dependency);
    return {
      dependency,
      present: Boolean(sealedDependency),
      normalized: sealedDependency?.sealedState === "unresolved",
      resolved: sealedDependency?.resolved ?? null,
      immutable: sealedDependency?.immutable === true,
    };
  });

  const report = {
    generatedAt: new Date().toISOString(),
    agent: "A46",
    name: "GovernanceRecoveryOps",
    branch: EXPECTED_BRANCH,
    governanceOnly: true,
    evidenceOnly: true,
    attestation: "governance seal integrity attestation",
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
    doNotEnableContinuity: true,
    sourceArtifacts: {
      reconciliation: path.join(OUT_DIR, `${REPORT_BASENAME}.json`),
      globalMatrix: path.join(OUT_DIR, `${GLOBAL_MATRIX_BASENAME}.json`),
      driftDetection: path.join(OUT_DIR, `${DRIFT_DETECTION_BASENAME}.json`),
      permanentConvergenceSeal: path.join(OUT_DIR, `${CONVERGENCE_SEAL_BASENAME}.json`),
    },
    artifactPresence,
    streamAttestation,
    invariantAttestation,
    unresolvedDependencyAttestation,
    strictModeRegressionSentinel: {
      present: seal.strictModeGovernanceSemantics?.preserved === true,
      preserved: Object.values(seal.strictModeGovernanceSemantics ?? {}).every((value) => value === true),
      failOnResolvedUnverifiedDependencies: seal.strictModeGovernanceSemantics?.failOnResolvedUnverifiedDependencies === true,
      failOnReadinessPromotion: seal.strictModeGovernanceSemantics?.failOnReadinessPromotion === true,
      failOnCertificationImplication: seal.strictModeGovernanceSemantics?.failOnCertificationImplication === true,
      failOnDoNotEnableRemoval: seal.strictModeGovernanceSemantics?.failOnDoNotEnableRemoval === true,
    },
    convergenceDriftDetection: {
      present: existsSync(path.join(OUT_DIR, `${DRIFT_DETECTION_BASENAME}.json`)),
      enforced: seal.convergenceIntegrityDriftEnforcement?.preserved === true,
      bypassed: false,
      sourceDriftDetected: drift.driftDetected,
      checksPassed: (drift.checks ?? []).every((check) => check.status === "pass"),
    },
    unsupportedReadinessSuppressionContinuity: {
      present: seal.unsupportedReadinessSuppression?.active === true,
      permanent: seal.unsupportedReadinessSuppression?.permanent === true,
      weakened: seal.unsupportedReadinessSuppression?.weakened === true,
      unsupportedReadinessClaimsAllowed: false,
      sealedAcrossStreams: seal.unsupportedReadinessSuppression?.sealedAcrossStreams === true,
    },
    supervisedExecutionDenialContinuity: {
      present: seal.supervisedExecutionDenialContinuity?.preserved === true,
      autonomous_execution: "SUPERVISED_ONLY",
    },
    regenerationSafeAttestationContinuity: {
      preserved: true,
      sealContinuityPreserved: seal.regenerationSafeArchivalContinuity?.preserved === true,
      matrixContinuityPreserved: matrix.regenerationSafeArchivalContinuity?.preserved === true,
      missingInputsRemainUnresolved:
        seal.regenerationSafeArchivalContinuity?.missingInputsRemainUnresolved === true &&
        matrix.regenerationSafeArchivalContinuity?.missingInputsRemainUnresolved === true,
      generatedArtifacts: [
        ...(seal.regenerationSafeArchivalContinuity?.generatedArtifacts ?? []),
        path.join(OUT_DIR, `${SEAL_ATTESTATION_BASENAME}.json`),
        path.join(OUT_DIR, `${SEAL_ATTESTATION_BASENAME}.md`),
      ],
    },
    denialLineageImmutability: {
      preserved: reconciliation.reliabilityDenialLineage?.preservedGlobally === true,
      matrixDenialLineagePreserved: (matrix.streamMatrix ?? []).every((stream) => stream.denialLineagePreserved === true),
      sealDenialLineagePreserved: (seal.sealedStreams ?? []).every((stream) => stream.denialLineagePreserved === true),
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
      certificationClaims: false,
      persistenceValidationClaims: false,
      governanceBypass: false,
      unrelatedWorktreeCleanup: false,
    },
    conclusion:
      "A46 attests sealed convergence-governance artifact integrity while preserving unresolved dependencies, blocked-safe invariants, strict-mode guards, supervised-only execution, and DO_NOT_ENABLE continuity.",
  };

  writeSealAttestationJsonAndMarkdown(report);
  console.log(`[a46] wrote ${path.join(OUT_DIR, `${SEAL_ATTESTATION_BASENAME}.json`)}`);
  console.log(`[a46] wrote ${path.join(OUT_DIR, `${SEAL_ATTESTATION_BASENAME}.md`)}`);
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

function enforceDriftDetectionStrict(report) {
  const failures = driftDetectionStrictFailures(report);
  if (failures.length > 0) {
    throw new Error(`A46 convergence-integrity drift detection strict mode blocked:\n${failures.map((failure) => `- ${failure}`).join("\n")}`);
  }
  console.log("[a46] convergence-integrity drift detection strict mode passed: no governance drift detected");
}

function enforceConvergenceSealStrict(report) {
  const failures = convergenceSealStrictFailures(report);
  if (failures.length > 0) {
    throw new Error(`A46 permanent convergence governance seal strict mode blocked:\n${failures.map((failure) => `- ${failure}`).join("\n")}`);
  }
  console.log("[a46] permanent convergence governance seal strict mode passed: sealed blocked-safe governance preserved");
}

function enforceSealAttestationStrict(report) {
  const failures = sealAttestationStrictFailures(report);
  if (failures.length > 0) {
    throw new Error(`A46 governance seal integrity attestation strict mode blocked:\n${failures.map((failure) => `- ${failure}`).join("\n")}`);
  }
  console.log("[a46] governance seal integrity attestation strict mode passed: sealed artifact integrity preserved");
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

function driftDetectionStrictFailures(report) {
  const failures = [];
  if (report.driftDetected) {
    for (const finding of report.driftFindings ?? []) {
      failures.push(`${finding.id}: ${finding.message}`);
    }
  }
  if (report.production_safe !== false) failures.push("production_safe became true or non-false");
  if (report.production_readiness !== false) failures.push("production_readiness became true or non-false");
  if (report.placement_v3_enabled !== false) failures.push("placement_v3_enabled became true or non-false");
  if (report.placement_v3_enablement !== "BLOCKED") failures.push("placement_v3_enablement changed from BLOCKED");
  if (report.writes_production_data !== false) failures.push("writes_production_data became true or non-false");
  if (report.autonomous_execution !== "SUPERVISED_ONLY") failures.push("autonomous_execution changed from SUPERVISED_ONLY");
  if (report.globalPosture !== "DO_NOT_ENABLE" || !report.doNotEnableContinuity) {
    failures.push("DO_NOT_ENABLE continuity was removed");
  }
  return failures;
}

function convergenceSealStrictFailures(report) {
  const failures = [];
  if (!report.unresolvedDependencyTaxonomyImmutable) {
    failures.push("sealed unresolved dependency taxonomy changed state");
  }
  for (const dependency of report.sealedUnresolvedDependencies ?? []) {
    if (dependency.sealedState !== "unresolved" || dependency.resolved !== false || dependency.immutable !== true) {
      failures.push(`${dependency.dependency} sealed state changed`);
    }
  }
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
  if (
    !report.convergenceIntegrityDriftEnforcement?.preserved ||
    report.convergenceIntegrityDriftEnforcement?.sourceDriftDetected !== false ||
    report.convergenceIntegrityDriftEnforcement?.checksPassed !== true
  ) {
    failures.push("convergence drift detection is bypassed or failing");
  }
  if (
    report.unsupportedReadinessSuppression?.permanent !== true ||
    report.unsupportedReadinessSuppression?.active !== true ||
    report.unsupportedReadinessSuppression?.global !== true ||
    report.unsupportedReadinessSuppression?.weakened === true ||
    report.unsupportedReadinessSuppression?.unsupportedReadinessClaimsAllowed !== false
  ) {
    failures.push("unsupported-readiness suppression is weakened");
  }
  if (!Object.values(report.strictModeGovernanceSemantics ?? {}).every((value) => value === true)) {
    failures.push("strict-mode governance semantics are not preserved");
  }
  if (
    report.regenerationSafeArchivalContinuity?.preserved !== true ||
    report.regenerationSafeArchivalContinuity?.missingInputsRemainUnresolved !== true
  ) {
    failures.push("regeneration-safe governance continuity is not preserved");
  }
  if (
    report.convergenceMatrixContinuity?.preserved !== true ||
    report.convergenceMatrixContinuity?.requiredStreamsPresent !== true
  ) {
    failures.push("convergence matrix continuity is not preserved");
  }
  if (report.supervisedExecutionDenialContinuity?.preserved !== true) {
    failures.push("supervised-execution denial continuity is not preserved");
  }
  for (const stream of report.sealedStreams ?? []) {
    if (!stream.sealed) failures.push(`${stream.agent} is not sealed`);
    if (!stream.denialLineagePreserved) failures.push(`${stream.agent} denial lineage is not preserved in seal`);
    if (!stream.unsupportedReadinessSuppressionActive) {
      failures.push(`${stream.agent} unsupported-readiness suppression is not active in seal`);
    }
    if (!stream.regenerationSafeArchivalContinuity) {
      failures.push(`${stream.agent} regeneration-safe archival continuity is not sealed`);
    }
    if (stream.marksReadinessComplete) failures.push(`${stream.agent} marks readiness complete in seal`);
    if (stream.certificationImplied) failures.push(`${stream.agent} implies certification in seal`);
  }
  if (Object.values(report.certificationImplications ?? {}).some((value) => value !== false)) {
    failures.push("replay/provider/release/observability certification is implied");
  }
  return failures;
}

function sealAttestationStrictFailures(report) {
  const failures = [];
  for (const [key, artifact] of Object.entries(report.artifactPresence ?? {})) {
    if (!artifact.present) failures.push(`${key} artifact is missing`);
  }
  for (const [key, passed] of Object.entries(report.invariantAttestation ?? {})) {
    if (passed !== true) failures.push(`${key} invariant attestation changed`);
  }
  for (const dependency of report.unresolvedDependencyAttestation ?? []) {
    if (!dependency.present || !dependency.normalized || dependency.resolved !== false || !dependency.immutable) {
      failures.push(`${dependency.dependency} unresolved dependency taxonomy changed`);
    }
  }
  if (
    report.unsupportedReadinessSuppressionContinuity?.present !== true ||
    report.unsupportedReadinessSuppressionContinuity?.permanent !== true ||
    report.unsupportedReadinessSuppressionContinuity?.weakened === true ||
    report.unsupportedReadinessSuppressionContinuity?.unsupportedReadinessClaimsAllowed !== false
  ) {
    failures.push("unsupported-readiness suppression is weakened");
  }
  if (
    report.convergenceDriftDetection?.present !== true ||
    report.convergenceDriftDetection?.enforced !== true ||
    report.convergenceDriftDetection?.bypassed === true ||
    report.convergenceDriftDetection?.sourceDriftDetected !== false ||
    report.convergenceDriftDetection?.checksPassed !== true
  ) {
    failures.push("convergence drift detection is bypassed or failing");
  }
  if (!Object.values(report.strictModeRegressionSentinel ?? {}).every((value) => value === true)) {
    failures.push("strict-mode regression sentinel is not preserved");
  }
  if (report.production_safe !== false) failures.push("production_safe became true or non-false");
  if (report.production_readiness !== false) failures.push("production_readiness became true or non-false");
  if (report.placement_v3_enabled !== false) failures.push("placement_v3_enabled became true or non-false");
  if (report.placement_v3_enablement !== "BLOCKED") failures.push("placement_v3_enablement changed from BLOCKED");
  if (report.writes_production_data !== false) failures.push("writes_production_data became true or non-false");
  if (report.autonomous_execution !== "SUPERVISED_ONLY") failures.push("autonomous_execution changed from SUPERVISED_ONLY");
  if (report.globalPosture !== "DO_NOT_ENABLE" || !report.doNotEnableContinuity) {
    failures.push("DO_NOT_ENABLE continuity was removed");
  }
  for (const stream of report.streamAttestation ?? []) {
    if (!stream.presentInMatrix) failures.push(`${stream.agent} missing from matrix`);
    if (!stream.sealed) failures.push(`${stream.agent} not sealed`);
    if (!stream.denialLineagePreserved) failures.push(`${stream.agent} denial lineage is weakened`);
    if (!stream.unsupportedReadinessSuppressionActive) {
      failures.push(`${stream.agent} unsupported-readiness suppression is weakened`);
    }
    if (!stream.supervisedExecutionDenied) failures.push(`${stream.agent} supervised execution denial is not attested`);
    if (!stream.unresolvedDependenciesAttested) {
      failures.push(`${stream.agent} unresolved dependency attestation is incomplete`);
    }
  }
  if (
    report.regenerationSafeAttestationContinuity?.preserved !== true ||
    report.regenerationSafeAttestationContinuity?.sealContinuityPreserved !== true ||
    report.regenerationSafeAttestationContinuity?.matrixContinuityPreserved !== true ||
    report.regenerationSafeAttestationContinuity?.missingInputsRemainUnresolved !== true
  ) {
    failures.push("regeneration-safe attestation continuity is not preserved");
  }
  if (
    report.denialLineageImmutability?.preserved !== true ||
    report.denialLineageImmutability?.matrixDenialLineagePreserved !== true ||
    report.denialLineageImmutability?.sealDenialLineagePreserved !== true
  ) {
    failures.push("denial-lineage immutability is not preserved");
  }
  if (Object.values(report.certificationImplications ?? {}).some((value) => value !== false)) {
    failures.push("certification is implied");
  }
  return failures;
}

function checkUnresolvedDependencyRemoval(matrix) {
  const present = new Set((matrix.unresolvedDependencyMatrix ?? []).map((entry) => entry.dependency));
  const missing = REQUIRED_UNRESOLVED_DEPENDENCIES.filter((dependency) => !present.has(dependency));
  const resolved = (matrix.unresolvedDependencyMatrix ?? [])
    .filter((entry) => entry.resolved !== false || entry.status !== "unresolved")
    .map((entry) => entry.dependency);
  return driftCheck(
    "unresolved_dependency_removal",
    missing.length === 0 && resolved.length === 0,
    "Unresolved dependency taxonomy is preserved.",
    `Unresolved dependency taxonomy drifted. missing=${missing.join(", ") || "none"} resolved=${resolved.join(", ") || "none"}`,
    { missing, resolved },
  );
}

function checkDenialLineageWeakening(matrix) {
  const weakened = (matrix.streamMatrix ?? [])
    .filter((stream) => stream.denialLineagePreserved !== true || stream.marksReadinessComplete || stream.certificationImplied)
    .map((stream) => stream.agent);
  return driftCheck(
    "denial_lineage_weakening",
    weakened.length === 0,
    "Denial lineage remains preserved across all streams.",
    `Denial lineage weakened for streams: ${weakened.join(", ")}`,
    { weakened },
  );
}

function checkUnsupportedReadinessSuppressionRegression(matrix) {
  const streamRegressions = (matrix.streamMatrix ?? [])
    .filter((stream) => stream.unsupportedReadinessSuppressionActive !== true)
    .map((stream) => stream.agent);
  const globalRegression =
    matrix.unsupportedReadinessSuppression?.active !== true ||
    matrix.unsupportedReadinessSuppression?.global !== true ||
    matrix.unsupportedReadinessSuppression?.weakened === true ||
    matrix.unsupportedReadinessSuppression?.unsupportedReadinessClaimsAllowed !== false;
  return driftCheck(
    "unsupported_readiness_suppression_regression",
    !globalRegression && streamRegressions.length === 0,
    "Unsupported-readiness suppression remains active globally and per stream.",
    `Unsupported-readiness suppression regressed. global=${globalRegression} streams=${streamRegressions.join(", ") || "none"}`,
    { globalRegression, streamRegressions },
  );
}

function checkStrictModeEnforcementRegression(matrix) {
  const strict = matrix.strictModeConvergenceGovernance ?? {};
  const failed = [
    ["preserved", strict.preserved === true],
    ["failOnResolvedUnverifiedDependencies", strict.failOnResolvedUnverifiedDependencies === true],
    ["failOnReadinessPromotion", strict.failOnReadinessPromotion === true],
    ["failOnCertificationImplication", strict.failOnCertificationImplication === true],
    ["failOnDoNotEnableRemoval", strict.failOnDoNotEnableRemoval === true],
  ]
    .filter(([, ok]) => !ok)
    .map(([name]) => name);
  return driftCheck(
    "strict_mode_enforcement_regression",
    failed.length === 0,
    "Strict-mode convergence governance remains enforced.",
    `Strict-mode convergence governance regressed: ${failed.join(", ")}`,
    { failed },
  );
}

function checkBlockedSafeInvariantDrift(matrix) {
  const expected = {
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
  };
  const drifted = Object.entries(expected)
    .filter(([key, value]) => matrix[key] !== value)
    .map(([key, value]) => ({ key, expected: value, actual: matrix[key] }));
  if (!matrix.doNotEnableContinuity) {
    drifted.push({ key: "doNotEnableContinuity", expected: true, actual: matrix.doNotEnableContinuity });
  }
  return driftCheck(
    "blocked_safe_invariant_drift",
    drifted.length === 0,
    "Blocked-safe invariants remain unchanged.",
    `Blocked-safe invariants drifted: ${drifted.map((entry) => entry.key).join(", ")}`,
    { drifted },
  );
}

function checkReconciliationCoverageGaps(matrix) {
  const coverageGaps = (matrix.streamMatrix ?? [])
    .filter(
      (stream) =>
        !Array.isArray(stream.archives) ||
        stream.archives.length === 0 ||
        !Array.isArray(stream.unresolvedDependencies) ||
        stream.unresolvedDependencies.length === 0,
    )
    .map((stream) => stream.agent);
  return driftCheck(
    "reconciliation_coverage_gaps",
    coverageGaps.length === 0,
    "Each stream retains archive indexing and unresolved dependency coverage.",
    `Reconciliation coverage gaps detected for streams: ${coverageGaps.join(", ")}`,
    { coverageGaps },
  );
}

function checkStreamOmissionFromMatrix(matrix) {
  const present = new Set((matrix.streamMatrix ?? []).map((stream) => stream.agent));
  const missing = STREAMS.map((stream) => stream.agent).filter((agent) => !present.has(agent));
  return driftCheck(
    "stream_omission_from_convergence_matrix",
    missing.length === 0,
    "All required streams remain present in the convergence matrix.",
    `Streams omitted from convergence matrix: ${missing.join(", ")}`,
    { missing },
  );
}

function checkUnauthorizedReadinessTerminology() {
  const files = convergenceArtifactFiles().filter((file) => existsSync(file));
  const forbidden = [
    /\bproduction\s+ready\b/i,
    /\bproduction\s+readiness\s*[:=]\s*true\b/i,
    /\breplay\s+certified\b/i,
    /\bprovider\s+certified\b/i,
    /\brelease\s+certified\b/i,
    /\bobservability\s+certified\b/i,
    /\bready\s+for\s+launch\b/i,
    /\bfully\s+ready\b/i,
  ];
  const violations = scanFilesForPatterns(files, forbidden);
  return driftCheck(
    "unauthorized_readiness_terminology",
    violations.length === 0,
    "No unauthorized readiness or certification terminology was detected.",
    `Unauthorized readiness or certification terminology detected: ${violations.join("; ")}`,
    { violations },
  );
}

function checkEnablementLanguageInsertion() {
  const files = convergenceArtifactFiles().filter((file) => existsSync(file));
  const forbidden = [
    /\bsafe\s+to\s+enable\b/i,
    /\benablement\s+approved\b/i,
    /\bplacement_v3_enabled\s*[:=]\s*true\b/i,
    /\bplacement_v3_enablement\s*[:=]\s*(?!BLOCKED\b)[A-Z_]+\b/i,
    /\bDO_NOT_ENABLE\s+removed\b/i,
  ];
  const violations = scanFilesForPatterns(files, forbidden);
  return driftCheck(
    "enablement_language_insertion",
    violations.length === 0,
    "No unauthorized enablement language was inserted.",
    `Unauthorized enablement language detected: ${violations.join("; ")}`,
    { violations },
  );
}

function checkSupervisedExecutionPostureDrift(matrix) {
  const streamDrift = (matrix.streamMatrix ?? [])
    .flatMap((stream) => stream.archives ?? [])
    .filter((archive) => archive.autonomous_execution && archive.autonomous_execution !== "SUPERVISED_ONLY")
    .map((archive) => archive.path);
  return driftCheck(
    "supervised_execution_posture_drift",
    matrix.autonomous_execution === "SUPERVISED_ONLY" && streamDrift.length === 0,
    "Supervised execution posture remains SUPERVISED_ONLY.",
    `Supervised execution posture drift detected: matrix=${matrix.autonomous_execution}, archives=${streamDrift.join(", ") || "none"}`,
    { streamDrift },
  );
}

function checkRegenerationSafeConvergenceContinuity(matrix) {
  const continuity = matrix.regenerationSafeArchivalContinuity ?? {};
  const generatedArtifacts = continuity.generatedArtifacts ?? [];
  const requiredArtifacts = [
    path.join(OUT_DIR, `${REPORT_BASENAME}.json`),
    path.join(OUT_DIR, `${GLOBAL_MATRIX_BASENAME}.json`),
    path.join(OUT_DIR, `${DRIFT_DETECTION_BASENAME}.json`),
  ];
  const missing = requiredArtifacts.filter((artifact) => !generatedArtifacts.includes(artifact) && !existsSync(artifact));
  return driftCheck(
    "regeneration_safe_convergence_continuity",
    continuity.preserved === true && continuity.missingInputsRemainUnresolved === true && missing.length === 0,
    "Regeneration-safe convergence continuity remains preserved.",
    `Regeneration-safe convergence continuity drifted. missingArtifacts=${missing.join(", ") || "none"}`,
    { missing },
  );
}

function driftCheck(id, ok, passMessage, failMessage, details = {}) {
  return {
    id,
    status: ok ? "pass" : "drift_detected",
    message: ok ? passMessage : failMessage,
    details,
  };
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

function writeDriftDetectionJsonAndMarkdown(report) {
  writeFileSync(path.join(OUT_DIR, `${DRIFT_DETECTION_BASENAME}.json`), `${JSON.stringify(report, null, 2)}\n`);
  writeFileSync(
    path.join(OUT_DIR, `${DRIFT_DETECTION_BASENAME}.md`),
    [
      "# A46 Convergence Integrity Drift Detection",
      "",
      `Generated: ${report.generatedAt}`,
      "",
      `- Source matrix: ${report.sourceMatrix}`,
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
      `- Drift detected: ${report.driftDetected}`,
      "",
      "## Required Streams",
      "",
      ...report.requiredStreams.map((stream) => `- ${stream}`),
      "",
      "## Required Unresolved Dependencies",
      "",
      ...report.requiredUnresolvedDependencies.map((dependency) => `- ${dependency}`),
      "",
      "## Drift Checks",
      "",
      ...report.checks.map((check) => `- ${check.id}: ${check.status} - ${check.message}`),
      "",
      "## Strict-Mode Expectations",
      "",
      ...Object.entries(report.strictModeExpectation).map(([key, value]) => `- ${key}: ${value}`),
      "",
      "## Conclusion",
      "",
      report.conclusion,
      "",
      "A46 drift detection preserves governance-only, evidence-only convergence continuity. It does not mutate runtime behavior, promote enablement, fabricate evidence, assert certification, claim persistence validation, bypass governance, or clean unrelated worktree files.",
    ].join("\n") + "\n",
  );
}

function writeConvergenceSealJsonAndMarkdown(report) {
  writeFileSync(path.join(OUT_DIR, `${CONVERGENCE_SEAL_BASENAME}.json`), `${JSON.stringify(report, null, 2)}\n`);
  writeFileSync(
    path.join(OUT_DIR, `${CONVERGENCE_SEAL_BASENAME}.md`),
    [
      "# A46 Permanent Convergence Governance Seal",
      "",
      `Generated: ${report.generatedAt}`,
      "",
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
      `- DO_NOT_ENABLE continuity: ${report.doNotEnableContinuity}`,
      "",
      "## Sealed Streams",
      "",
      ...report.sealedStreams.map(
        (stream) =>
          `- ${stream.agent} ${stream.name}: sealed=${stream.sealed}, archiveStatus=${stream.archiveStatus}, denialLineagePreserved=${stream.denialLineagePreserved}, unsupportedReadinessSuppressionActive=${stream.unsupportedReadinessSuppressionActive}`,
      ),
      "",
      "## Sealed Unresolved Dependencies",
      "",
      ...report.sealedUnresolvedDependencies.map(
        (dependency) =>
          `- ${dependency.dependency}: sealedState=${dependency.sealedState}, resolved=${dependency.resolved}, immutable=${dependency.immutable}, linkedStreams=${dependency.linkedStreams.join(", ") || "none"}`,
      ),
      "",
      "## Seal Enforcement",
      "",
      `- Unresolved dependency taxonomy immutable: ${report.unresolvedDependencyTaxonomyImmutable}`,
      `- Convergence-integrity drift enforcement preserved: ${report.convergenceIntegrityDriftEnforcement.preserved}`,
      `- Unsupported-readiness suppression permanent: ${report.unsupportedReadinessSuppression.permanent}`,
      `- Strict-mode governance semantics preserved: ${report.strictModeGovernanceSemantics.preserved}`,
      `- Regeneration-safe archival continuity preserved: ${report.regenerationSafeArchivalContinuity.preserved}`,
      `- Convergence matrix continuity preserved: ${report.convergenceMatrixContinuity.preserved}`,
      `- Supervised-execution denial continuity preserved: ${report.supervisedExecutionDenialContinuity.preserved}`,
      "",
      "## Conclusion",
      "",
      report.conclusion,
      "",
      "A46 seal enforcement remains governance-only and evidence-only. It does not mutate runtime behavior, promote enablement, fabricate evidence, assert certification, claim persistence validation, bypass governance, or clean unrelated worktree files.",
    ].join("\n") + "\n",
  );
}

function writeSealAttestationJsonAndMarkdown(report) {
  writeFileSync(path.join(OUT_DIR, `${SEAL_ATTESTATION_BASENAME}.json`), `${JSON.stringify(report, null, 2)}\n`);
  writeFileSync(
    path.join(OUT_DIR, `${SEAL_ATTESTATION_BASENAME}.md`),
    [
      "# A46 Governance Seal Integrity Attestation",
      "",
      `Generated: ${report.generatedAt}`,
      "",
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
      "## Artifact Presence",
      "",
      ...Object.entries(report.artifactPresence).map(
        ([key, artifact]) => `- ${key}: present=${artifact.present}, path=${artifact.path}`,
      ),
      "",
      "## Stream Attestation",
      "",
      ...report.streamAttestation.map(
        (stream) =>
          `- ${stream.agent} ${stream.name}: presentInMatrix=${stream.presentInMatrix}, sealed=${stream.sealed}, denialLineagePreserved=${stream.denialLineagePreserved}, supervisedExecutionDenied=${stream.supervisedExecutionDenied}`,
      ),
      "",
      "## Invariant Attestation",
      "",
      ...Object.entries(report.invariantAttestation).map(([key, value]) => `- invariant ${key} preserved: ${value}`),
      "",
      "## Unresolved Dependency Attestation",
      "",
      ...report.unresolvedDependencyAttestation.map(
        (dependency) =>
          `- ${dependency.dependency}: present=${dependency.present}, normalized=${dependency.normalized}, resolved=${dependency.resolved}, immutable=${dependency.immutable}`,
      ),
      "",
      "## Continuity Attestation",
      "",
      `- Strict-mode regression sentinel preserved: ${report.strictModeRegressionSentinel.preserved}`,
      `- Convergence drift detection enforced: ${report.convergenceDriftDetection.enforced}`,
      `- Unsupported-readiness suppression permanent: ${report.unsupportedReadinessSuppressionContinuity.permanent}`,
      `- Supervised-execution denial continuity present: ${report.supervisedExecutionDenialContinuity.present}`,
      `- Regeneration-safe attestation continuity preserved: ${report.regenerationSafeAttestationContinuity.preserved}`,
      `- Denial-lineage immutability preserved: ${report.denialLineageImmutability.preserved}`,
      "",
      "## Conclusion",
      "",
      report.conclusion,
      "",
      "A46 seal integrity attestation remains governance-only and evidence-only. It does not mutate runtime behavior, promote enablement, fabricate evidence, assert certification, claim persistence validation, bypass governance, or clean unrelated worktree files.",
    ].join("\n") + "\n",
  );
}

function readReport() {
  return readJson(path.join(OUT_DIR, `${REPORT_BASENAME}.json`));
}

function readGlobalMatrix() {
  return readJson(path.join(OUT_DIR, `${GLOBAL_MATRIX_BASENAME}.json`));
}

function readDriftDetection() {
  return readJson(path.join(OUT_DIR, `${DRIFT_DETECTION_BASENAME}.json`));
}

function readConvergenceSeal() {
  return readJson(path.join(OUT_DIR, `${CONVERGENCE_SEAL_BASENAME}.json`));
}

function readSealAttestation() {
  return readJson(path.join(OUT_DIR, `${SEAL_ATTESTATION_BASENAME}.json`));
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

function attestArtifact(file) {
  return {
    path: file,
    present: existsSync(file),
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

function convergenceArtifactFiles() {
  return [
    path.join(OUT_DIR, `${REPORT_BASENAME}.json`),
    path.join(OUT_DIR, `${REPORT_BASENAME}.md`),
    path.join(OUT_DIR, `${GLOBAL_MATRIX_BASENAME}.json`),
    path.join(OUT_DIR, `${GLOBAL_MATRIX_BASENAME}.md`),
    path.join(OUT_DIR, `${DRIFT_DETECTION_BASENAME}.json`),
    path.join(OUT_DIR, `${DRIFT_DETECTION_BASENAME}.md`),
    path.join(OUT_DIR, `${CONVERGENCE_SEAL_BASENAME}.json`),
    path.join(OUT_DIR, `${CONVERGENCE_SEAL_BASENAME}.md`),
    path.join(OUT_DIR, `${SEAL_ATTESTATION_BASENAME}.json`),
    path.join(OUT_DIR, `${SEAL_ATTESTATION_BASENAME}.md`),
    path.join(OUT_DIR, `${RECURSIVE_COLLAPSE_BASENAME}.json`),
    path.join(OUT_DIR, `${RECURSIVE_COLLAPSE_BASENAME}.md`),
    path.join(OUT_DIR, "tghee-governance-history.md"),
    ...TGHEE_ARTIFACTS.map((basename) => path.join(OUT_DIR, `${basename}.json`)),
  ];
}

function runRecursiveCollapseSimulator(useStrict) {
  const args = [RECURSIVE_COLLAPSE_SCRIPT];
  if (useStrict) args.push("--strict");
  const output = execFileSync("node", args, { encoding: "utf8" });
  process.stdout.write(output);
}

function runTgheeRuntime(subcommand, useStrict) {
  const args = [TGHEE_SCRIPT, subcommand];
  if (useStrict) args.push("--strict");
  const output = execFileSync("node", args, { encoding: "utf8" });
  process.stdout.write(output);
}

function scanFilesForPatterns(files, patterns) {
  const violations = [];
  for (const file of files) {
    const text = readFileSync(file, "utf8");
    for (const pattern of patterns) {
      if (pattern.test(text)) violations.push(`${file}: ${pattern}`);
    }
  }
  return violations;
}

function ensureBranch() {
  const branch = execFileSync("git", ["rev-parse", "--abbrev-ref", "HEAD"], { encoding: "utf8" }).trim();
  if (branch !== EXPECTED_BRANCH) {
    throw new Error(`A46 automation must run on ${EXPECTED_BRANCH}; current branch is ${branch}`);
  }
}

function scanUnsupportedClaims() {
  const files = convergenceArtifactFiles();
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
