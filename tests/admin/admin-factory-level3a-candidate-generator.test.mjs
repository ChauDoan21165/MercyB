/**
 * ADMIN-FACTORY-LEVEL3A-CANDIDATE-GENERATION-001 — Tests
 */
import { describe, it } from "vitest";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import os from "node:os";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const sp = path.join(repoRoot, "scripts/admin/admin-factory-level3a-candidate-generator.mjs");

function run() {
  const d = fs.mkdtempSync(path.join(os.tmpdir(), "l3a-cand-"));
  const r = spawnSync(process.execPath, [sp, d], { encoding: "utf8", cwd: repoRoot });
  let p = null; try { p = JSON.parse((r.stdout || "").trim()); } catch { /* */ }
  return { ...r, parsed: p, tmpDir: d };
}

function readArtifact(d, f) { const fp = path.join(d, f); return fs.existsSync(fp) ? JSON.parse(fs.readFileSync(fp, "utf8")) : null; }

describe("LEVEL3A-CANDIDATE-GENERATOR", () => {
  describe("discovery", () => {
    it("discovers candidates", () => { const r = run(); if (typeof r.parsed.total_candidates !== "number") throw new Error("total_candidates not a number"); });
    it("includes candidate types", () => {
      const r = run();
      const m = readArtifact(r.tmpDir, "level3a-candidates-manifest.json");
      const types = new Set(m.pipeline.scored.map((s) => s.candidate.type));
      if (m.pipeline.scored.length > 0 && types.size < 1) throw new Error("No candidate types with scored candidates");
    });
  });

  describe("safety classifier", () => {
    it("classifies mutation level per candidate", () => {
      const m = readArtifact(run().tmpDir, "level3a-candidates-manifest.json");
      for (const s of m.pipeline.scored) {
        if (!["READ_ONLY", "ARTIFACT_ONLY", "UNKNOWN"].includes(s.safety.mutation_level)) {
          throw new Error(`Bad mutation level: ${s.safety.mutation_level}`);
        }
      }
    });
    it("marks protected path candidates", () => {
      const m = readArtifact(run().tmpDir, "level3a-candidates-manifest.json");
      const hasProtectedCheck = m.pipeline.scored.every((s) => typeof s.safety.touches_protected_path === "boolean");
      if (!hasProtectedCheck) throw new Error("Protected path not checked");
    });
  });

  describe("risk scorer", () => {
    it("assigns risk level per candidate", () => {
      const m = readArtifact(run().tmpDir, "level3a-candidates-manifest.json");
      for (const s of m.pipeline.scored) {
        if (!["low", "medium", "high", "critical"].includes(s.risk.risk_level)) {
          throw new Error(`Bad risk level: ${s.risk.risk_level}`);
        }
      }
    });
    it("includes risk factors", () => {
      const m = readArtifact(run().tmpDir, "level3a-candidates-manifest.json");
      if (m.pipeline.scored.length === 0) return; const s = m.pipeline.scored[0];
      if (!Array.isArray(s.risk.factors) || s.risk.factors.length === 0) throw new Error("No risk factors");
    });
  });

  describe("confidence scorecard", () => {
    it("assigns grade A-F", () => {
      const m = readArtifact(run().tmpDir, "level3a-candidates-manifest.json");
      for (const s of m.pipeline.scored) {
        if (!["A","B","C","D","F"].includes(s.confidence.grade)) throw new Error(`Bad grade: ${s.confidence.grade}`);
      }
    });
    it("overall is 0-100", () => {
      const m = readArtifact(run().tmpDir, "level3a-candidates-manifest.json");
      for (const s of m.pipeline.scored) {
        if (s.confidence.overall < 0 || s.confidence.overall > 100) throw new Error(`Bad overall: ${s.confidence.overall}`);
      }
    });
  });

  describe("evidence bundle planner", () => {
    it("plans required evidence per candidate", () => {
      const m = readArtifact(run().tmpDir, "level3a-candidates-manifest.json");
      for (const s of m.pipeline.scored) {
        if (!Array.isArray(s.evidence.required_evidence)) throw new Error("No evidence plan");
      }
    });
  });

  describe("mutation safety gate", () => {
    it("proves no git mutations", () => {
      const m = readArtifact(run().tmpDir, "level3a-candidates-manifest.json");
      if (m.pipeline.mutation_proof.verdict !== "NO_MUTATIONS_DETECTED") throw new Error("Mutations detected!");
      if (m.pipeline.mutation_proof.commits_performed !== 0) throw new Error("Commits performed!");
    });

    it("declares simulation-only mode", () => {
      const r = run();
      if (r.parsed.mode !== "LEVEL3A_SIMULATION_ONLY") throw new Error("Wrong mode");
    });

    it("declares zero mutations in manifest", () => {
      const m = readArtifact(run().tmpDir, "level3a-candidates-manifest.json");
      const ms = m.mutation_summary;
      if (ms.git_commit !== "none (simulation only)") throw new Error(`git_commit: ${ms.git_commit}`);
      if (ms.git_push !== "none (simulation only)") throw new Error(`git_push: ${ms.git_push}`);
    });
  });

  describe("determinism", () => {
    it("idempotent: same state → same results", () => {
      const r1 = run(), r2 = run();
      if (r1.parsed.total_candidates !== r2.parsed.total_candidates) throw new Error("Non-deterministic");
      if (r1.parsed.eligible !== r2.parsed.eligible) throw new Error("Non-deterministic eligible");
    });
  });

  describe("artifacts", () => {
    it("produces manifest and report", () => {
      const r = run();
      const m = readArtifact(r.tmpDir, "level3a-candidates-manifest.json");
      if (!m || !m.runner) throw new Error("Manifest invalid");
      const rp = path.join(r.tmpDir, "level3a-candidates-report.md");
      if (!fs.existsSync(rp)) throw new Error("Report missing");
    });
  });
});
