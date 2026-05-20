#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const EXPECTED_BRANCH = "feat/a42-reliability-forecast-ops";
const A42_ARCHIVE_COMMIT = "15b052e14";
const OUT_DIR = "docs/placement-v3/governance";
const REPORT_BASENAME = "a46-a42-permanent-intake-convergence-reconciliation";
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

main();

function main() {
  if (command !== "auto" && command !== "validate") {
    throw new Error(`Unknown A46 GovernanceRecoveryOps command: ${command}`);
  }

  ensureBranch();
  mkdirSync(OUT_DIR, { recursive: true });

  if (command === "auto") {
    const report = generateReconciliation();
    if (strict) enforceStrict(report);
    scanUnsupportedClaims();
    return;
  }

  const report = readReport();
  enforceStrict(report);
  scanUnsupportedClaims();
  console.log(`[a46] governance validation passed: ${path.join(OUT_DIR, `${REPORT_BASENAME}.json`)}`);
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

function enforceStrict(report) {
  const failures = strictFailures(report);
  if (failures.length > 0) {
    throw new Error(`A46 strict mode blocked:\n${failures.map((failure) => `- ${failure}`).join("\n")}`);
  }
  console.log("[a46] strict mode passed: blocked-safe denial posture preserved");
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

function readReport() {
  return readJson(path.join(OUT_DIR, `${REPORT_BASENAME}.json`));
}

function readJson(file) {
  if (!existsSync(file)) throw new Error(`Missing required governance evidence: ${file}`);
  return JSON.parse(readFileSync(file, "utf8"));
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
  ];
  const forbidden = [
    /\bproduction ready\b/i,
    /\breplay certified\b/i,
    /\bsafe to enable\b/i,
    /\bready for launch\b/i,
    /\blive validation complete\b/i,
  ];
  const violations = [];
  for (const file of files) {
    const text = readFileSync(file, "utf8");
    for (const pattern of forbidden) {
      if (pattern.test(text)) violations.push(`${file}: ${pattern}`);
    }
  }
  if (violations.length > 0) {
    throw new Error(`Unsupported A46 readiness claim detected:\n${violations.join("\n")}`);
  }
}
