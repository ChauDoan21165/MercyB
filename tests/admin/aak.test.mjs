import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const aak = path.join(repoRoot, "scripts/admin/aak.mjs");
const validEipc = path.join(repoRoot, "fixtures/admin/eipc/valid-eip-001.json");
const invalidEipc = path.join(repoRoot, "fixtures/admin/eipc/invalid-missing-required.json");
const lifecycleValid = path.join(repoRoot, "fixtures/admin/aak/lifecycle-valid.json");
const lifecycleInvalid = path.join(repoRoot, "fixtures/admin/aak/lifecycle-invalid.json");
const ownershipValid = path.join(repoRoot, "fixtures/admin/aak/ownership-valid.json");
const ownershipInvalid = path.join(repoRoot, "fixtures/admin/aak/ownership-invalid.json");
const ownershipRegistry = path.join(repoRoot, "fixtures/admin/aak/ownership-routing-registry.json");

function run(args) {
  return spawnSync(process.execPath, [aak, ...args], { encoding: "utf8" });
}

function parse(stdout) {
  return JSON.parse(stdout.trim());
}

describe("Admin Automation Kernel v1", () => {
  it("validates EIPC packages", () => {
    const ok = run(["validate-eip", validEipc]);
    expect(ok.status).toBe(0);
    const okReport = parse(ok.stdout);
    expect(okReport.ok).toBe(true);

    const bad = run(["validate-eip", invalidEipc]);
    expect(bad.status).toBe(1);
    const badReport = parse(bad.stdout);
    expect(badReport.ok).toBe(false);
    expect(badReport.summary.invalid_packages).toBe(1);
  });

  it("validates lifecycle transitions and ownership", () => {
    const lifecyclePass = run(["validate-lifecycle", validEipc, lifecycleValid]);
    expect(lifecyclePass.status).toBe(0);
    expect(parse(lifecyclePass.stdout).ok).toBe(true);

    const lifecycleFail = run(["validate-lifecycle", validEipc, lifecycleInvalid]);
    expect(lifecycleFail.status).toBe(1);
    expect(parse(lifecycleFail.stdout).ok).toBe(false);

    const ownerPass = run(["validate-ownership", ownershipValid]);
    expect(ownerPass.status).toBe(0);
    expect(parse(ownerPass.stdout).expected_owner_team).toBe("C4");

    const ownerFail = run(["validate-ownership", ownershipInvalid]);
    expect(ownerFail.status).toBe(1);
    const ownerFailReport = parse(ownerFail.stdout);
    expect(ownerFailReport.ok).toBe(false);
    expect(ownerFailReport.errors.some((error) => error.reason === "owner_mismatch")).toBe(true);
  });

  it("keeps ownership routing examples in a deterministic registry", () => {
    const registry = JSON.parse(fs.readFileSync(ownershipRegistry, "utf8"));
    expect(registry).toMatchObject({
      registry_id: "aak-ownership-routing-registry",
      default_owner_team: "Admin",
    });

    expect(registry.rules.map((rule) => rule.priority)).toEqual([10, 20, 30, 40, 50, 60]);
    expect(registry.rules.map((rule) => ({
      pattern: rule.pattern,
      flags: rule.flags,
      owner_team: rule.owner_team,
    }))).toEqual([
      { pattern: "replay", flags: "i", owner_team: "C4" },
      { pattern: "teacher.?mercy", flags: "i", owner_team: "C2" },
      { pattern: "coverage", flags: "i", owner_team: "C3" },
      { pattern: "judge|decision", flags: "i", owner_team: "Admin" },
      { pattern: "eipc|oii|governance|admin", flags: "i", owner_team: "Admin" },
      { pattern: "capability", flags: "i", owner_team: "Admin" },
    ]);

    const priorities = new Set(registry.rules.map((rule) => rule.priority));
    expect(priorities.size).toBe(registry.rules.length);
    for (const rule of registry.rules) {
      expect(rule.rule_id).toMatch(/^ownership-routing-/);
      expect(rule.examples.length).toBeGreaterThan(0);
      expect(() => new RegExp(rule.pattern, rule.flags)).not.toThrow();
    }
  });

  it("routes every ownership registry example without hidden policy drift", () => {
    const registry = JSON.parse(fs.readFileSync(ownershipRegistry, "utf8"));
    for (const rule of registry.rules) {
      for (const example of rule.examples) {
        const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "aak-owner-"));
        const subjectPath = path.join(tempDir, "subject.json");
        fs.writeFileSync(subjectPath, JSON.stringify({
          subject_type: example,
          subject_name: example,
          owner_team: rule.owner_team,
        }, null, 2));

        const result = run(["validate-ownership", subjectPath]);
        expect(result.status, `${rule.rule_id} ${example}`).toBe(0);
        expect(parse(result.stdout).expected_owner_team).toBe(rule.owner_team);
        fs.rmSync(tempDir, { recursive: true, force: true });
      }
    }
  });

  it("builds traceability, scorecards, and dashboards deterministically", () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "aak-"));

    const validReport = parse(run(["validate-eip", validEipc]).stdout);
    const invalidReport = parse(run(["validate-eip", invalidEipc]).stdout);
    const lifecycleReport = parse(run(["validate-lifecycle", validEipc, lifecycleValid]).stdout);

    const validPath = path.join(tempDir, "valid.json");
    const invalidPath = path.join(tempDir, "invalid.json");
    const lifecyclePath = path.join(tempDir, "lifecycle.json");
    fs.writeFileSync(validPath, JSON.stringify(validReport, null, 2));
    fs.writeFileSync(invalidPath, JSON.stringify(invalidReport, null, 2));
    fs.writeFileSync(lifecyclePath, JSON.stringify(lifecycleReport, null, 2));

    const graph = parse(run(["build-decision-graph", validPath, invalidPath, lifecyclePath]).stdout);
    expect(graph.graph_type).toBe("DECISION_GRAPH");
    expect(graph.edges).toHaveLength(15);

    const capabilityGraph = parse(run(["build-capability-graph", validPath, invalidPath]).stdout);
    expect(capabilityGraph.graph_type).toBe("CAPABILITY_GRAPH");
    expect(capabilityGraph.capability_count).toBeGreaterThan(0);

    const scorecard = parse(run(["build-ooi-scorecard", validPath, invalidPath, lifecyclePath]).stdout);
    expect(scorecard).toEqual({
      engineering_health: 67,
      evidence_health: 67,
      decision_health: 67,
      capability_health: 67,
      learning_health: 67,
    });

    const evidenceHealth = parse(run(["build-evidence-health", validPath, invalidPath, lifecyclePath]).stdout);
    expect(evidenceHealth.evidence_confidence_distribution.total).toBe(3);

    const learning = parse(run(["analyze-learning", validPath, invalidPath, lifecyclePath]).stdout);
    expect(learning.repeated_failures.length).toBeGreaterThan(0);

    const priority = parse(run(["priority-engine", capabilityGraphPath(capabilityGraph), evidenceHealthPath(evidenceHealth), learningPath(learning)]).stdout);
    expect(priority.priority_engine).toBe("AAK-v1");
    expect(priority.rows[0].safe_to_execute_now).toBe(false);

    const dashboard = parse(run(["dashboard", scorecardPath(scorecard), evidenceHealthPath(evidenceHealth), priorityPath(priority), capabilityGraphPath(capabilityGraph)]).stdout);
    expect(dashboard.engineering_health).toBe(67);
    expect(dashboard.top_priority.safe_to_execute_now).toBe(false);

    fs.rmSync(tempDir, { recursive: true, force: true });
  });
});

function tempJsonPath(prefix, value) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  const file = path.join(dir, "data.json");
  fs.writeFileSync(file, JSON.stringify(value, null, 2));
  return file;
}

function scorecardPath(value) {
  return tempJsonPath("aak-scorecard-", value);
}

function evidenceHealthPath(value) {
  return tempJsonPath("aak-evidence-", value);
}

function capabilityGraphPath(value) {
  return tempJsonPath("aak-capability-", value);
}

function learningPath(value) {
  return tempJsonPath("aak-learning-", value);
}

function priorityPath(value) {
  return tempJsonPath("aak-priority-", value);
}
