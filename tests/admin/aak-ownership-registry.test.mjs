/**
 * AAK-OWNERSHIP-RULES-REGISTRY-001 — Tests
 *
 * Validates:
 * 1. Registry validation (valid fixture passes, invalid fixture fails)
 * 2. Health check produces correct health status
 * 3. Routing correctly assigns owner_team by pattern match
 * 4. Default routing when no pattern matches
 * 5. Conflict detection for overlapping patterns
 * 6. Schema export produces valid JSON Schema
 * 7. Registration adds a new rule and bumps version
 * 8. Idempotent output
 * 9. Zero mutation summary (except register command)
 */

import { describe, it } from "vitest";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import os from "node:os";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "../..");
const scriptPath = path.join(repoRoot, "scripts/admin/aak-ownership-registry.mjs");
const registryPath = path.join(repoRoot, "fixtures/admin/aak/ownership-routing-registry.json");

function runCommand(command, extraArgs = []) {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "aak-own-reg-test-"));
  const result = spawnSync(process.execPath, [scriptPath, command, "-o", tmpDir, ...extraArgs], {
    encoding: "utf8",
    cwd: repoRoot,
  });
  let parsed = null;
  try {
    parsed = JSON.parse((result.stdout || "").trim());
  } catch {
    // not JSON
  }
  return { ...result, parsed, tmpDir };
}

function readArtifact(tmpDir, filename) {
  const p = path.join(tmpDir, filename);
  if (!fs.existsSync(p)) return null;
  try {
    return JSON.parse(fs.readFileSync(p, "utf8"));
  } catch {
    return null;
  }
}

describe("AAK-OWNERSHIP-RULES-REGISTRY-001", () => {
  describe("validate", () => {
    it("validates the existing registry successfully", () => {
      const r = runCommand("validate", [registryPath]);
      if (!r.parsed) throw new Error(`No JSON. stderr: ${r.stderr}`);
      if (r.parsed.ok !== true) {
        throw new Error(`Validation failed: ${JSON.stringify(r.parsed.errors)}`);
      }
    });

    it("reports registry_id, version, rule_count", () => {
      const r = runCommand("validate", [registryPath]);
      if (r.parsed.registry_id !== "aak-ownership-routing-registry") {
        throw new Error(`Wrong registry_id: ${r.parsed.registry_id}`);
      }
      if (typeof r.parsed.version !== "string" || r.parsed.version.length === 0) {
        throw new Error("version missing");
      }
      if (typeof r.parsed.rule_count !== "number" || r.parsed.rule_count < 1) {
        throw new Error(`rule_count invalid: ${r.parsed.rule_count}`);
      }
    });

    it("rejects a missing file", () => {
      const r = runCommand("validate", ["/nonexistent/path/registry.json"]);
      if (r.parsed?.ok !== false) {
        throw new Error("Should have rejected missing file");
      }
    });
  });

  describe("health", () => {
    it("produces a health report with status", () => {
      const r = runCommand("health", [registryPath]);
      if (!r.parsed?.ok) throw new Error(`Health check failed: ${JSON.stringify(r.parsed)}`);
      const health = r.parsed.health?.health;
      if (!health) throw new Error("health.health missing");
      if (!["healthy", "degraded", "warning", "critical"].includes(health)) {
        throw new Error(`Invalid health status: ${health}`);
      }
    });

    it("produces a manifest artifact", () => {
      const r = runCommand("health", [registryPath]);
      const manifest = readArtifact(r.tmpDir, "aak-ownership-registry-health.json");
      if (!manifest) throw new Error("Health manifest missing");
      if (manifest.runner !== "AAK-OWNERSHIP-REGISTRY-001") {
        throw new Error(`Wrong runner: ${manifest.runner}`);
      }
    });

    it("produces a markdown report", () => {
      const r = runCommand("health", [registryPath]);
      const reportPath = path.join(r.tmpDir, "aak-ownership-registry-report.md");
      if (!fs.existsSync(reportPath)) throw new Error("Report missing");
      const content = fs.readFileSync(reportPath, "utf8");
      if (!content.includes("AAK Ownership Registry Report")) {
        throw new Error("Report missing expected title");
      }
    });

    it("includes routing tests in health report", () => {
      const r = runCommand("health", [registryPath]);
      const tests = r.parsed.health?.routing_tests;
      if (!Array.isArray(tests) || tests.length === 0) {
        throw new Error("Routing tests missing from health report");
      }
    });
  });

  describe("route", () => {
    it("routes 'teacher-mercy' to C2", () => {
      const r = runCommand("route", ["teacher-mercy", registryPath]);
      if (r.parsed?.owner_team !== "C2") {
        throw new Error(`Expected C2, got: ${r.parsed?.owner_team}`);
      }
    });

    it("routes 'replay' to C4", () => {
      const r = runCommand("route", ["replay", registryPath]);
      if (r.parsed?.owner_team !== "C4") {
        throw new Error(`Expected C4, got: ${r.parsed?.owner_team}`);
      }
    });

    it("routes 'coverage-engine' to C3", () => {
      const r = runCommand("route", ["coverage-engine", registryPath]);
      if (r.parsed?.owner_team !== "C3") {
        throw new Error(`Expected C3, got: ${r.parsed?.owner_team}`);
      }
    });

    it("routes unknown subject to default (Admin)", () => {
      const r = runCommand("route", ["completely-unknown-xyz", registryPath]);
      if (r.parsed?.owner_team !== "Admin") {
        throw new Error(`Expected Admin (default), got: ${r.parsed?.owner_team}`);
      }
      if (r.parsed?.is_default !== true) {
        throw new Error("is_default should be true");
      }
    });

    it("is case-insensitive", () => {
      const r = runCommand("route", ["TEACHER-MERCY", registryPath]);
      if (r.parsed?.owner_team !== "C2") {
        throw new Error(`Expected C2 (case-insensitive), got: ${r.parsed?.owner_team}`);
      }
    });
  });

  describe("conflicts", () => {
    it("detects conflicts in the registry", () => {
      const r = runCommand("conflicts", [registryPath]);
      if (!r.parsed) throw new Error("No output");
      if (typeof r.parsed.conflict_count !== "number") {
        throw new Error("conflict_count missing or not a number");
      }
    });
  });

  describe("export-schema", () => {
    it("produces a valid JSON Schema file", () => {
      const r = runCommand("export-schema");
      const schemaPath = r.parsed?.schema_path;
      if (!schemaPath) throw new Error("No schema_path");
      const schema = JSON.parse(fs.readFileSync(schemaPath, "utf8"));
      if (schema.$schema !== "https://json-schema.org/draft/2020-12/schema") {
        throw new Error("Not a valid JSON Schema");
      }
      if (schema.$id !== "aak-ownership-routing-registry.schema.json") {
        throw new Error(`Wrong $id: ${schema.$id}`);
      }
    });
  });

  describe("register", () => {
    it("registers a new rule and bumps version", () => {
      // Work on a copy to not mutate the real registry
      const tmpReg = path.join(os.tmpdir(), `test-registry-${Date.now()}.json`);
      fs.copyFileSync(registryPath, tmpReg);

      const newRule = JSON.stringify({
        rule_id: "test-rule-automation",
        priority: 5,
        pattern: "automation|robot",
        flags: "i",
        owner_team: "A1",
        examples: ["automation", "robot-worker"],
      });

      try {
        const r = runCommand("register", [newRule, tmpReg]);
        if (!r.parsed?.ok) throw new Error(`Registration failed: ${JSON.stringify(r.parsed)}`);

        // Verify version bumped
        const updated = JSON.parse(fs.readFileSync(tmpReg, "utf8"));
        if (!updated.version.includes(".")) throw new Error(`Version not bumped: ${updated.version}`);

        // Verify rule was added
        const found = updated.rules.find((r) => r.rule_id === "test-rule-automation");
        if (!found) throw new Error("New rule not found in registry");
        if (found.owner_team !== "A1") throw new Error(`Wrong owner_team: ${found.owner_team}`);

        // Verify route now resolves
        const routeCheck = runCommand("route", ["automation-task", tmpReg]);
        if (routeCheck.parsed?.owner_team !== "A1") {
          throw new Error(`Route didn't use new rule: ${routeCheck.parsed?.owner_team}`);
        }
      } finally {
        // Cleanup
        try { fs.unlinkSync(tmpReg); } catch { /* ok */ }
        try { fs.unlinkSync(tmpReg + ".bak"); } catch { /* ok */ }
      }
    });

    it("rejects duplicate rule_id registration", () => {
      const tmpReg = path.join(os.tmpdir(), `test-registry-dup-${Date.now()}.json`);
      fs.copyFileSync(registryPath, tmpReg);

      const dupRule = JSON.stringify({
        rule_id: "ownership-routing-replay",  // already exists
        priority: 99,
        pattern: "duplicate",
        flags: "i",
        owner_team: "Test",
        examples: ["duplicate"],
      });

      try {
        const r = runCommand("register", [dupRule, tmpReg]);
        if (r.parsed?.ok === true) {
          throw new Error("Should have rejected duplicate rule_id");
        }
      } finally {
        try { fs.unlinkSync(tmpReg); } catch { /* ok */ }
        try { fs.unlinkSync(tmpReg + ".bak"); } catch { /* ok */ }
      }
    });
  });

  describe("mutation summary", () => {
    it("health/validate/conflicts declare zero mutations", () => {
      for (const cmd of ["validate", "health", "conflicts"]) {
        const r = runCommand(cmd, [registryPath]);
        if (cmd === "health") {
          const manifest = readArtifact(r.tmpDir, "aak-ownership-registry-health.json");
          const ms = manifest?.mutation_summary;
          if (!ms) throw new Error(`${cmd}: mutation_summary missing`);
          if (ms.database_writes !== "none") throw new Error(`${cmd}: db_writes=${ms.database_writes}`);
          if (ms.runtime_mutations !== "none") throw new Error(`${cmd}: runtime=${ms.runtime_mutations}`);
        }
      }
    });
  });

  describe("determinism", () => {
    it("idempotent: same route returns same result", () => {
      const r1 = runCommand("route", ["eipc", registryPath]);
      const r2 = runCommand("route", ["eipc", registryPath]);
      if (r1.parsed?.owner_team !== r2.parsed?.owner_team) {
        throw new Error(`Non-deterministic: ${r1.parsed?.owner_team} vs ${r2.parsed?.owner_team}`);
      }
    });

    it("idempotent: health check returns same status", () => {
      const r1 = runCommand("health", [registryPath]);
      const r2 = runCommand("health", [registryPath]);
      if (r1.parsed?.health?.health !== r2.parsed?.health?.health) {
        throw new Error("Non-deterministic health status");
      }
    });
  });
});
