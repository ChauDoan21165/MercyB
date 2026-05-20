import { describe, expect, it } from "vitest";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const artifact = "docs/placement-v3/governance/a46-a42-permanent-intake-convergence-reconciliation.json";
const globalMatrixArtifact =
  "docs/placement-v3/governance/a46-global-permanent-denial-retention-convergence-matrix.json";

function runNpm(script, args = []) {
  return spawnSync("npm", ["run", script, "--", ...args], {
    cwd: repoRoot,
    encoding: "utf8",
  });
}

function readArtifact() {
  return JSON.parse(fs.readFileSync(path.join(repoRoot, artifact), "utf8"));
}

function readGlobalMatrixArtifact() {
  return JSON.parse(fs.readFileSync(path.join(repoRoot, globalMatrixArtifact), "utf8"));
}

function expectBlockedSafe(report) {
  expect(report.riskClassification).toBe("BLOCKED_BY_MISSING_A33_ENDURANCE_INPUTS");
  expect(report.ready).toBe(false);
  expect(report.complete).toBe(false);
  expect(report.schema_completeness).toBe(false);
  expect(report.production_safe).toBe(false);
  expect(report.placement_v3_enabled).toBe(false);
  expect(report.live_validation_complete).toBe(false);
  expect(report.live_provider_validated).toBe(false);
  expect(report.autonomous_execution).toBe("SUPERVISED_ONLY");
  expect(report.globalPosture).toBe("DO_NOT_ENABLE");
}

function expectGlobalBlockedSafe(report) {
  expect(report.production_safe).toBe(false);
  expect(report.production_readiness).toBe(false);
  expect(report.placement_v3_enabled).toBe(false);
  expect(report.placement_v3_enablement).toBe("BLOCKED");
  expect(report.live_validation_complete).toBe(false);
  expect(report.live_provider_validated).toBe(false);
  expect(report.provider_drift_measured).toBe(false);
  expect(report.production_persistence_validated).toBe(false);
  expect(report.writes_production_data).toBe(false);
  expect(report.autonomous_execution).toBe("SUPERVISED_ONLY");
  expect(report.globalPosture).toBe("DO_NOT_ENABLE");
  expect(report.doNotEnableContinuity).toBe(true);
}

describe("A46 GovernanceRecoveryOps A42 convergence reconciliation", () => {
  it("generates a blocked-safe convergence artifact referencing A42 permanent intake archive", () => {
    const result = runNpm("placement:a46:auto");
    expect(result.status, result.stderr || result.stdout).toBe(0);
    expect(fs.existsSync(path.join(repoRoot, artifact))).toBe(true);
    expect(fs.existsSync(path.join(repoRoot, artifact.replace(".json", ".md")))).toBe(true);

    const report = readArtifact();
    expectBlockedSafe(report);
    expect(report.referencedA42Commit).toBe("15b052e14");
    expect(report.a42PermanentIntakeArtifactsIndexed).toBe(true);
    expect(report.indexedArtifacts.map((item) => item.key)).toEqual(
      expect.arrayContaining([
        "permanentIntakeArchive",
        "futureEvidenceIntake",
        "permanentPrerequisites",
        "permanentDenialRules",
        "permanentSequencing",
        "replayDurabilityContinuity",
        "failoverContradictionDetector",
      ]),
    );
  });

  it("preserves global reliability, replay, failover, and unsupported-readiness denials", () => {
    const result = runNpm("placement:a46:auto");
    expect(result.status, result.stderr || result.stdout).toBe(0);
    const report = readArtifact();

    expect(report.reliabilityDenialLineage.preservedGlobally).toBe(true);
    expect(report.reliabilityDenialLineage.unresolvedRisk).toBe("BLOCKED_BY_MISSING_A33_ENDURANCE_INPUTS");
    expect(report.reliabilityDenialLineage.a42ReadinessImplied).toBe(false);
    expect(report.replayDurabilityContinuity.state).toBe("blocked_safe_incomplete");
    expect(report.replayDurabilityContinuity.certified).toBe(false);
    expect(report.failoverContradictionLineage.traceable).toBe(true);
    expect(report.failoverContradictionLineage.resolved).toBe(false);
    expect(report.failoverContradictionLineage.unresolvedOnlyBecauseUpstreamEvidenceIncomplete).toBe(true);
    expect(report.unsupportedReadinessSuppression.coversA42PermanentIntakeArtifacts).toBe(true);
    expect(report.unsupportedReadinessSuppression.unsupportedReadinessClaimsAllowed).toBe(false);
    expect(report.a46ConvergenceArchiveMarksReliabilityComplete).toBe(false);
    expect(report.globalDoNotEnablePostureUnchanged).toBe(true);
  });

  it("passes A46 strict mode only while blocked-safe denial posture is intact", () => {
    const result = runNpm("placement:a46:auto", ["--strict"]);
    expect(result.status, result.stderr || result.stdout).toBe(0);
    expect(`${result.stdout}\n${result.stderr}`).toContain("strict mode passed");
  });

  it("validates generated governance convergence artifacts", () => {
    runNpm("placement:a46:auto");
    const result = runNpm("governance:validate");
    expect(result.status, result.stderr || result.stdout).toBe(0);
    expect(`${result.stdout}\n${result.stderr}`).toContain("governance validation passed");
  });

  it("generates the global permanent denial-retention convergence matrix", () => {
    const result = runNpm("governance:a46:global-denial-retention-matrix");
    expect(result.status, result.stderr || result.stdout).toBe(0);
    expect(fs.existsSync(path.join(repoRoot, globalMatrixArtifact))).toBe(true);
    expect(fs.existsSync(path.join(repoRoot, globalMatrixArtifact.replace(".json", ".md")))).toBe(true);

    const matrix = readGlobalMatrixArtifact();
    expectGlobalBlockedSafe(matrix);
    expect(matrix.referencedA42Commit).toBe("15b052e14");
    expect(matrix.streamMatrix.map((stream) => stream.agent)).toEqual([
      "A39",
      "A42",
      "A44",
      "A45",
      "A47",
      "A48",
      "A49",
      "A50",
    ]);
    expect(matrix.streamMatrix.find((stream) => stream.agent === "A42").archiveStatus).toBe("indexed");
    expect(matrix.streamMatrix.find((stream) => stream.agent === "A39").archiveStatus).toBe(
      "missing_external_evidence",
    );
    expect(matrix.unsupportedReadinessSuppression.global).toBe(true);
    expect(matrix.regenerationSafeArchivalContinuity.preserved).toBe(true);
  });

  it("preserves all required unresolved dependency lineage in the global matrix", () => {
    const result = runNpm("placement:a46:auto");
    expect(result.status, result.stderr || result.stdout).toBe(0);
    const matrix = readGlobalMatrixArtifact();

    expect(matrix.unresolvedDependencyMatrix.map((entry) => entry.dependency)).toEqual(
      expect.arrayContaining([
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
      ]),
    );
    expect(matrix.unresolvedDependencyMatrix.every((entry) => entry.resolved === false)).toBe(true);
    expect(matrix.certificationImplications).toEqual({
      replay: false,
      provider: false,
      release: false,
      observability: false,
      persistence: false,
    });
    expect(matrix.unsupportedReadinessSuppression.weakened).toBe(false);
  });

  it("includes the global matrix in A46 strict auto and governance validation", () => {
    const strictResult = runNpm("placement:a46:auto", ["--strict"]);
    expect(strictResult.status, strictResult.stderr || strictResult.stdout).toBe(0);
    expect(`${strictResult.stdout}\n${strictResult.stderr}`).toContain(
      "global denial-retention matrix strict mode passed",
    );

    const validateResult = runNpm("governance:validate");
    expect(validateResult.status, validateResult.stderr || validateResult.stdout).toBe(0);
    expect(`${validateResult.stdout}\n${validateResult.stderr}`).toContain(
      "global denial-retention matrix validation passed",
    );
  });
});
