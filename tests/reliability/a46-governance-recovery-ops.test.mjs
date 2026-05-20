import { describe, expect, it } from "vitest";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const artifact = "docs/placement-v3/governance/a46-a42-permanent-intake-convergence-reconciliation.json";

function runNpm(script, args = []) {
  return spawnSync("npm", ["run", script, "--", ...args], {
    cwd: repoRoot,
    encoding: "utf8",
  });
}

function readArtifact() {
  return JSON.parse(fs.readFileSync(path.join(repoRoot, artifact), "utf8"));
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
});
