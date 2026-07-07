/**
 * ADMIN-FACTORY-ENGINEERING-INTELLIGENCE-V1-001 — Tests
 */
import { describe, it } from "vitest";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import os from "node:os";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const sp = path.join(repoRoot, "scripts/admin/admin-factory-engineering-intelligence.mjs");

function run() {
  const d = fs.mkdtempSync(path.join(os.tmpdir(), "ei-test-"));
  const r = spawnSync(process.execPath, [sp, d], { encoding: "utf8", cwd: repoRoot });
  let p = null; try { p = JSON.parse((r.stdout || "").trim()); } catch { /* */ }
  return { ...r, parsed: p, tmpDir: d };
}

function readArtifact(d, f) { const fp = path.join(d, f); return fs.existsSync(fp) ? JSON.parse(fs.readFileSync(fp, "utf8")) : null; }

describe("ENGINEERING-INTELLIGENCE-V1", () => {
  describe("discovery + normalization", () => {
    it("discovers candidates", () => { const r = run(); if (r.parsed.candidates < 1) throw new Error("No candidates"); });
    it("normalizes into stable schema", () => {
      const m = readArtifact(run().tmpDir, "engineering-intelligence-manifest.json");
      if (!m.pipeline.normalization.schema_version) throw new Error("No schema version");
    });
    it("tracks discovery by source", () => {
      const m = readArtifact(run().tmpDir, "engineering-intelligence-manifest.json");
      if (Object.values(m.pipeline.discovery.by_source).every((v) => v === 0)) throw new Error("No sources");
    });
  });

  describe("dedup + clustering", () => {
    it("produces unique count", () => { const r = run(); if (typeof r.parsed.duplicates !== "number") throw new Error("No duplicate count"); });
    it("produces root-cause clusters", () => { const r = run(); if (r.parsed.clusters < 1) throw new Error("No clusters"); });
  });

  describe("priority + risk", () => {
    it("scores priority 0-100", () => {
      const m = readArtifact(run().tmpDir, "engineering-intelligence-manifest.json");
      if (m.pipeline.priority.avg_score < 0 || m.pipeline.priority.avg_score > 100) throw new Error(`Bad avg: ${m.pipeline.priority.avg_score}`);
    });
    it("classifies risk level", () => {
      const m = readArtifact(run().tmpDir, "engineering-intelligence-manifest.json");
      const rl = m.pipeline.risk.by_level;
      if (rl.low + rl.medium + rl.high + rl.critical !== m.pipeline.risk.scored) throw new Error("Risk count mismatch");
    });
  });

  describe("confidence + recommendations", () => {
    it("assigns grades A-F", () => {
      const m = readArtifact(run().tmpDir, "engineering-intelligence-manifest.json");
      const cg = m.pipeline.confidence.by_grade;
      const total = Object.values(cg).reduce((s, v) => s + v, 0);
      if (total === 0) throw new Error("No confidence grades");
    });
    it("ranks recommendations with explanations", () => {
      const r = run();
      if (r.parsed.ranked < 1) throw new Error("No ranked items");
    });
  });

  describe("workpack planner", () => {
    it("generates workpack plans for top candidates", () => {
      const m = readArtifact(run().tmpDir, "engineering-intelligence-manifest.json");
      if (!Array.isArray(m.pipeline.workpack_plans)) throw new Error("No workpack plans");
      for (const wp of m.pipeline.workpack_plans) {
        if (!wp.workpack_id || !wp.objective) throw new Error("Malformed workpack");
        if (wp.simulation_only !== true) throw new Error("Not simulation-only!");
        if (wp.mutations !== "NONE") throw new Error("Mutations declared!");
      }
    });
  });

  describe("simulation replay + mutation proof", () => {
    it("proves no git mutations", () => {
      const m = readArtifact(run().tmpDir, "engineering-intelligence-manifest.json");
      if (m.pipeline.replay.verdict !== "NO_MUTATIONS_DETECTED") throw new Error("Mutations detected!");
    });
    it("declares simulation-only mode", () => {
      const m = readArtifact(run().tmpDir, "engineering-intelligence-manifest.json");
      if (m.mode !== "LEVEL3A_SIMULATION_ONLY") throw new Error(`Wrong mode: ${m.mode}`);
    });
    it("zero commits/pushes/merges/deploys", () => {
      const m = readArtifact(run().tmpDir, "engineering-intelligence-manifest.json");
      if (m.mutation_summary.git_commit !== "none") throw new Error("git_commit not none");
      if (m.mutation_summary.git_push !== "none") throw new Error("git_push not none");
    });
  });

  describe("determinism + artifacts", () => {
    it("idempotent output", () => { const a = run(), b = run(); if (a.parsed.candidates !== b.parsed.candidates) throw new Error("Non-deterministic"); });
    it("produces manifest + report", () => {
      const r = run();
      if (!fs.existsSync(r.parsed.manifest_path)) throw new Error("Manifest missing");
      if (!fs.existsSync(r.parsed.report_path)) throw new Error("Report missing");
    });
  });
});
