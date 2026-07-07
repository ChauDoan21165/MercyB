import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const validatorScript = path.join(repoRoot, "scripts/admin/validate-eipc-package.mjs");
const builderScript = path.join(repoRoot, "scripts/admin/build-oii-scorecard.mjs");
const validFixture = path.join(repoRoot, "fixtures/admin/eipc/valid-eip-001.json");
const invalidFixture = path.join(repoRoot, "fixtures/admin/eipc/invalid-missing-required.json");

function runNode(script, args) {
  return spawnSync(process.execPath, [script, ...args], { encoding: "utf8" });
}

function parseJson(stdout) {
  return JSON.parse(stdout.trim());
}

describe("ADMIN OII/EIPC contract artifacts", () => {
  it("validates the good fixture", () => {
    const result = runNode(validatorScript, [validFixture]);
    expect(result.status).toBe(0);
    const report = parseJson(result.stdout);
    expect(report.ok).toBe(true);
    expect(report.package_reports).toHaveLength(1);
    expect(report.package_reports[0].errors).toEqual([]);
    expect(report.package_reports[0].score_inputs).toEqual({
      engineering_health: 1,
      evidence_health: 1,
      decision_health: 1,
      capability_health: 1,
      learning_health: 1,
    });
  });

  it("rejects the bad fixture", () => {
    const result = runNode(validatorScript, [invalidFixture]);
    expect(result.status).toBe(1);
    const report = parseJson(result.stdout);
    expect(report.ok).toBe(false);
    expect(report.package_reports).toHaveLength(1);
    expect(report.package_reports[0].errors.length).toBeGreaterThan(0);
    expect(report.package_reports[0].errors.some((error) => error.reason === "missing_required")).toBe(true);
    expect(report.package_reports[0].errors.some((error) => error.reason === "enum_mismatch")).toBe(true);
  });

  it("builds a deterministic scorecard from validation reports", () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "eipc-"));
    const validReportPath = path.join(tempDir, "valid-report.json");
    const invalidReportPath = path.join(tempDir, "invalid-report.json");

    const validReport = parseJson(runNode(validatorScript, [validFixture]).stdout);
    const invalidReport = parseJson(runNode(validatorScript, [invalidFixture]).stdout);
    fs.writeFileSync(validReportPath, JSON.stringify(validReport, null, 2));
    fs.writeFileSync(invalidReportPath, JSON.stringify(invalidReport, null, 2));

    const builder = runNode(builderScript, [validReportPath, invalidReportPath]);
    expect(builder.status).toBe(0);

    const scorecard = parseJson(builder.stdout);
    expect(scorecard).toEqual({
      engineering_health: 50,
      evidence_health: 50,
      decision_health: 50,
      capability_health: 50,
      learning_health: 50,
    });

    fs.rmSync(tempDir, { recursive: true, force: true });
  });
});
