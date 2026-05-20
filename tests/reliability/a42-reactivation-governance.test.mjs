import { afterEach, describe, expect, it } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const repoRoot = process.cwd();
const tempRoots = [];

function makeOutputEnv() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "a42-reactivation-"));
  tempRoots.push(root);
  return {
    root,
    env: {
      ...process.env,
      A42_OUT_DIR: path.join(root, "forecast"),
      A42_RELIABILITY_OUT_DIR: path.join(root, "reliability"),
    },
  };
}

function runNpm(script, args = [], env) {
  return spawnSync("npm", ["run", script, "--", ...args], {
    cwd: repoRoot,
    env,
    encoding: "utf8",
  });
}

function readJson(root, name) {
  return JSON.parse(fs.readFileSync(path.join(root, "reliability", `${name}.json`), "utf8"));
}

function expectBlockedSafe(report) {
  expect(report.riskClassification).toBe("BLOCKED_BY_MISSING_A33_ENDURANCE_INPUTS");
  expect(report.ready).toBe(false);
  expect(report.complete).toBe(false);
  expect(report.production_safe).toBe(false);
  expect(report.placement_v3_enabled).toBe(false);
  expect(report.live_validation_complete).toBe(false);
  expect(report.live_provider_validated).toBe(false);
  expect(report.autonomous_execution).toBe("SUPERVISED_ONLY");
}

function checkNames(report) {
  return new Set(report.checks.map((check) => check.name));
}

afterEach(() => {
  for (const root of tempRoots.splice(0)) {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

describe("A42 reliability reactivation governance gates", () => {
  it.each([
    ["placement:a42:reactivation-gate", "a42-reactivation-readiness-gate"],
    ["placement:a42:required-evidence", "a42-required-reliability-evidence-index"],
    ["placement:a42:denial-rules", "a42-reliability-reactivation-denial-rules"],
    ["placement:a42:validation-sequencing", "a42-reliability-validation-sequencing"],
  ])("generates %s with blocked-safe posture", (script, artifact) => {
    const { root, env } = makeOutputEnv();
    const result = runNpm(script, [], env);

    expect(result.status, result.stderr || result.stdout).toBe(0);
    expect(fs.existsSync(path.join(root, "reliability", `${artifact}.json`))).toBe(true);
    expect(fs.existsSync(path.join(root, "reliability", `${artifact}.md`))).toBe(true);
    expectBlockedSafe(readJson(root, artifact));
  });

  it("keeps reactivation blocked without required real evidence", () => {
    const { root, env } = makeOutputEnv();
    const result = runNpm("placement:a42:reactivation-gate", [], env);
    expect(result.status, result.stderr || result.stdout).toBe(0);

    const report = readJson(root, "a42-reactivation-readiness-gate");
    expectBlockedSafe(report);
    expect(report.incompleteChecks).toEqual(
      expect.arrayContaining([
        "a33_endurance_evidence",
        "latency_timeout_measurements",
        "replay_durability_validation",
        "replay_reproducibility_evidence",
        "provider_failover_validation",
        "provider_degradation_lineage",
        "observability_continuity_evidence",
        "autonomous_execution_implications",
        "supervised_execution_governance_approval",
        "governance_approved_readiness_sequencing",
      ]),
    );

    const checks = checkNames(report);
    expect(checks.has("unsupported_readiness_claim_detection")).toBe(true);
  });

  it("auto generation includes all reactivation artifacts", () => {
    const { root, env } = makeOutputEnv();
    const result = runNpm("placement:a42:auto", [], env);
    expect(result.status, result.stderr || result.stdout).toBe(0);

    for (const artifact of [
      "a42-reactivation-readiness-gate",
      "a42-required-reliability-evidence-index",
      "a42-reliability-reactivation-denial-rules",
      "a42-reliability-validation-sequencing",
    ]) {
      const jsonPath = path.join(root, "reliability", `${artifact}.json`);
      const mdPath = path.join(root, "reliability", `${artifact}.md`);
      expect(fs.existsSync(jsonPath)).toBe(true);
      expect(fs.existsSync(mdPath)).toBe(true);
      expectBlockedSafe(JSON.parse(fs.readFileSync(jsonPath, "utf8")));
    }
  });

  it("strict mode denies reactivation while endurance and reliability evidence remain incomplete", () => {
    const { env } = makeOutputEnv();
    const result = runNpm("placement:a42:auto", ["--strict"], env);

    expect(result.status).not.toBe(0);
    const output = `${result.stdout}\n${result.stderr}`;
    expect(output).toContain("missing required A33 input: a33_endurance_health");
    expect(output).toContain("missing required A33 input: a33_timeout_risk_forecast");
    expect(output).toContain("reactivation readiness gate blocked: BLOCKED_BY_MISSING_A33_ENDURANCE_INPUTS");
    expect(output).toContain("endurance evidence missing");
    expect(output).toContain("replay durability evidence missing");
    expect(output).toContain("failover validation missing");
    expect(output).toContain("provider degradation lineage incomplete for reactivation");
    expect(output).toContain("observability continuity undefined");
    expect(output).toContain("autonomous execution implications unresolved");
    expect(output).toContain("reliability reactivation sequencing incomplete");
  });
});
