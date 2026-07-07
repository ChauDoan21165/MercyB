/**
 * ADMIN-FACTORY-EXCEPTION-ESCALATOR-001 — Tests
 */

import { describe, it } from "vitest";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import os from "node:os";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "../..");
const scriptPath = path.join(repoRoot, "scripts/admin/admin-factory-exception-escalator.mjs");

function runScript(args = []) {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "escalator-test-"));
  const result = spawnSync(process.execPath, [scriptPath, "-o", tmpDir, ...args], { encoding: "utf8", cwd: repoRoot });
  let parsed = null;
  try { parsed = JSON.parse((result.stdout || "").trim()); } catch { /* */ }
  return { ...result, parsed, tmpDir };
}

function readArtifact(tmpDir, filename) {
  const p = path.join(tmpDir, filename);
  if (!fs.existsSync(p)) return null;
  try { return JSON.parse(fs.readFileSync(p, "utf8")); } catch { return null; }
}

function writeTempInput(data) {
  const f = path.join(os.tmpdir(), `escalator-input-${Date.now()}.json`);
  fs.writeFileSync(f, JSON.stringify(data, null, 2));
  return f;
}

describe("ADMIN-FACTORY-EXCEPTION-ESCALATOR-001", () => {
  describe("classification", () => {
    it("escalates deploy-related items", () => {
      const input = writeTempInput([{ title: "Deploy to production", brief: "Ship the new release" }]);
      const manifest = readArtifact(runScript([input]).tmpDir, "exception-escalator-manifest.json");
      const r = manifest.results[0];
      if (r.classification !== "HUMAN_GATE_REQUIRED") throw new Error("Deploy should escalate");
      if (!r.matched_rules.some((m) => m.rule_id === "ESC-DEPLOY")) throw new Error("Should match ESC-DEPLOY");
      try { fs.unlinkSync(input); } catch { /* ok */ }
    });

    it("escalates merge/PR items", () => {
      const input = writeTempInput([{ title: "Merge PR #123", brief: "Integrate feature branch" }]);
      const manifest = readArtifact(runScript([input]).tmpDir, "exception-escalator-manifest.json");
      if (manifest.results[0].classification !== "HUMAN_GATE_REQUIRED") throw new Error("Merge should escalate");
      try { fs.unlinkSync(input); } catch { /* ok */ }
    });

    it("escalates architecture questions", () => {
      const input = writeTempInput([{ title: "Redesign the architecture", brief: "Architectural changes needed" }]);
      const manifest = readArtifact(runScript([input]).tmpDir, "exception-escalator-manifest.json");
      if (manifest.results[0].classification !== "HUMAN_GATE_REQUIRED") throw new Error("Architecture should escalate");
      try { fs.unlinkSync(input); } catch { /* ok */ }
    });

    it("escalates safety violations", () => {
      const input = writeTempInput([{ title: "Database write without approval", brief: "Unauthorized db mutation" }]);
      const manifest = readArtifact(runScript([input]).tmpDir, "exception-escalator-manifest.json");
      if (manifest.results[0].classification !== "HUMAN_GATE_REQUIRED") throw new Error("Safety violation should escalate");
      try { fs.unlinkSync(input); } catch { /* ok */ }
    });

    it("escalates judge questions", () => {
      const input = writeTempInput([{ title: "Needs human judgment for review", brief: "Subjective decision required" }]);
      const manifest = readArtifact(runScript([input]).tmpDir, "exception-escalator-manifest.json");
      if (manifest.results[0].classification !== "HUMAN_GATE_REQUIRED") throw new Error("Judge question should escalate");
      try { fs.unlinkSync(input); } catch { /* ok */ }
    });

    it("auto-continues benign items", () => {
      const input = writeTempInput([{ title: "Run validation check", brief: "Standard lint and test" }]);
      const manifest = readArtifact(runScript([input]).tmpDir, "exception-escalator-manifest.json");
      if (manifest.results[0].classification !== "AUTO_CONTINUE") throw new Error("Benign item should auto-continue");
      try { fs.unlinkSync(input); } catch { /* ok */ }
    });

    it("tracks severity correctly", () => {
      const input = writeTempInput([
        { title: "Deploy to production" },   // critical
        { title: "Needs approval for judge" }, // high
      ]);
      const manifest = readArtifact(runScript([input]).tmpDir, "exception-escalator-manifest.json");
      const sev = manifest.summary.by_severity;
      if (sev.critical < 1) throw new Error("Should have at least 1 critical");
      if (sev.high < 1) throw new Error("Should have at least 1 high");
      try { fs.unlinkSync(input); } catch { /* ok */ }
    });
  });

  describe("simulation", () => {
    it("produces simulation_report.json", () => {
      const input = writeTempInput([{ title: "Deploy now" }]);
      const r = runScript([input]);
      const sim = readArtifact(r.tmpDir, "simulation_report.json");
      if (!sim?.simulation_mode) throw new Error("Should be simulation mode");
      if (sim.would_escalate < 1) throw new Error("Should escalate at least 1");
      try { fs.unlinkSync(input); } catch { /* ok */ }
    });

    it("auto-discovers items when no inputs given", () => {
      const r = runScript();
      if (!r.parsed?.ok) throw new Error("Auto-discovery should succeed");
    });
  });

  describe("determinism", () => {
    it("idempotent: same items → same classifications", () => {
      const input = writeTempInput([
        { title: "Deploy to production" },
        { title: "Run standard tests" },
        { title: "Merge PR" },
      ]);
      const r1 = runScript([input]);
      const r2 = runScript([input]);
      if (r1.parsed?.human_gate_required !== r2.parsed?.human_gate_required) throw new Error("Non-deterministic");
      try { fs.unlinkSync(input); } catch { /* ok */ }
    });
  });

  describe("mutation summary", () => {
    it("declares zero mutations", () => {
      const input = writeTempInput([{ title: "Test" }]);
      const manifest = readArtifact(runScript([input]).tmpDir, "exception-escalator-manifest.json");
      const ms = manifest?.mutation_summary;
      if (ms.database_writes !== "none") throw new Error("Should be zero mutations");
      try { fs.unlinkSync(input); } catch { /* ok */ }
    });
  });
});
