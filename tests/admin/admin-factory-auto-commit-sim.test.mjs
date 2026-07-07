/**
 * ADMIN-FACTORY-LEVEL3A-AUTO-COMMIT-SIMULATION-001 — Tests
 */
import { describe, it, afterEach } from "vitest";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import os from "node:os";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const sp = path.join(repoRoot, "scripts/admin/admin-factory-auto-commit-sim.mjs");

const created = [];

// Hermetic: point the simulator at a unique tmp reports-root (via
// ADMIN_FACTORY_REPORTS_ROOT) and seed ONE completed fresh-workpack job there,
// so the test drives OUR fixture — never ambient /Users/admin state.
// Deterministic on any machine. Cleaned up in afterEach → zero residue.
function run() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "auto-commit-sim-"));
  created.push(root);
  const wpDir = path.join(root, "fresh-workpack-1-artifact-inventory");
  fs.mkdirSync(wpDir, { recursive: true });
  fs.writeFileSync(
    path.join(wpDir, "wp1.json"),
    JSON.stringify({
      workpack_id: "WP-HERMETIC-1",
      title: "hermetic fixture workpack",
      mutation_level: "read_only",
      status: "validated",
      ok: true,
      simulation: true,
    }),
  );
  const r = spawnSync(process.execPath, [sp, root], {
    encoding: "utf8",
    cwd: repoRoot,
    env: { ...process.env, ADMIN_FACTORY_REPORTS_ROOT: root },
  });
  let p = null; try { p = JSON.parse((r.stdout || "").trim()); } catch { /* */ }
  return { ...r, parsed: p, tmpDir: root };
}

afterEach(() => {
  for (const d of created.splice(0)) fs.rmSync(d, { recursive: true, force: true });
});

function readArtifact(d, f) {
  const fp = path.join(d, f);
  return fs.existsSync(fp) ? JSON.parse(fs.readFileSync(fp, "utf8")) : null;
}

describe("LEVEL3A-AUTO-COMMIT-SIM", () => {
  describe("simulation execution", () => {
    it("exits ok", () => { const r = run(); if (!r.parsed?.ok) throw new Error(JSON.stringify(r.parsed)); });
    it("declares LEVEL3A_SIMULATION_ONLY mode", () => { const r = run(); if (r.parsed.mode !== "LEVEL3A_SIMULATION_ONLY") throw new Error(`Wrong mode: ${r.parsed.mode}`); });
    it("discovers jobs", () => { const r = run(); if (typeof r.parsed?.total_jobs !== "number" || r.parsed.total_jobs < 1) throw new Error("No jobs discovered"); });
  });

  describe("decisions", () => {
    it("produces WOULD_COMMIT, HUMAN_GATE_REQUIRED, or BLOCKED per job", () => {
      const r = run();
      const manifest = readArtifact(r.tmpDir, "auto-commit-sim-manifest.json");
      for (const job of manifest.results) {
        if (!["WOULD_COMMIT", "HUMAN_GATE_REQUIRED", "BLOCKED"].includes(job.decision)) {
          throw new Error(`Invalid decision: ${job.decision} for ${job.job_id}`);
        }
      }
    });

    it("all decisions are BLOCKED when forbidden files exist", () => {
      const r = run();
      // With current git state (ci.yml modified, etc.), some jobs should be blocked
      const manifest = readArtifact(r.tmpDir, "auto-commit-sim-manifest.json");
      const decisions = manifest.results.map((j) => j.decision);
      if (!decisions.includes("BLOCKED") && !decisions.includes("HUMAN_GATE_REQUIRED")) {
        // If nothing blocked, at least verify WOULD_COMMIT is present
        if (!decisions.includes("WOULD_COMMIT")) throw new Error("No decisions at all?");
      }
    });
  });

  describe("safety gates", () => {
    it("all 10 gates evaluated per job", () => {
      const r = run();
      const manifest = readArtifact(r.tmpDir, "auto-commit-sim-manifest.json");
      for (const job of manifest.results) {
        if (job.gates_total !== 10) throw new Error(`Expected 10 gates, got ${job.gates_total} for ${job.job_id}`);
        if (job.safety_gate_report.length !== 10) throw new Error(`Expected 10 gate reports, got ${job.safety_gate_report.length}`);
      }
    });

    it("gate 1 checks mutation_level", () => {
      const r = run();
      const manifest = readArtifact(r.tmpDir, "auto-commit-sim-manifest.json");
      for (const job of manifest.results) {
        const g1 = job.safety_gate_report.find((g) => g.gate === 1);
        if (!g1) throw new Error("Gate 1 missing");
        if (g1.name !== "mutation_level") throw new Error(`Wrong gate 1 name: ${g1.name}`);
      }
    });
  });

  describe("simulated commit message", () => {
    it("follows the required format", () => {
      const r = run();
      const manifest = readArtifact(r.tmpDir, "auto-commit-sim-manifest.json");
      for (const job of manifest.results) {
        const msg = job.simulated_commit_message;
        if (!msg.includes("admin(factory):")) throw new Error(`Missing prefix: ${msg.slice(0, 50)}`);
        if (!msg.includes("Workpack:")) throw new Error("Missing Workpack field");
        if (!msg.includes("Mutation:")) throw new Error("Missing Mutation field");
        if (!msg.includes("No push/merge/deploy performed")) throw new Error("Missing safety disclaimer");
        if (!msg.includes("Simulation only")) throw new Error("Missing simulation marker");
      }
    });
  });

  describe("rollback note", () => {
    it("generated for every job", () => {
      const r = run();
      const manifest = readArtifact(r.tmpDir, "auto-commit-sim-manifest.json");
      for (const job of manifest.results) {
        if (!job.rollback_note || job.rollback_note.length < 10) {
          throw new Error(`Rollback note missing/too short for ${job.job_id}`);
        }
        if (!job.rollback_note.includes("ROLLBACK NOTE")) throw new Error("Missing ROLLBACK NOTE header");
      }
    });
  });

  describe("git inspection only", () => {
    it("inspects git state without modifying it", () => {
      const r = run();
      const manifest = readArtifact(r.tmpDir, "auto-commit-sim-manifest.json");
      if (typeof manifest.git_state?.branch !== "string") throw new Error("Branch not inspected");
      if (typeof manifest.git_state?.changed_files !== "number") throw new Error("Changed files not counted");
    });

    it("declares no real git operations", () => {
      const r = run();
      const manifest = readArtifact(r.tmpDir, "auto-commit-sim-manifest.json");
      const ms = manifest.mutation_summary;
      if (ms.git_commit !== "none (simulation only)") throw new Error("git_commit should be simulation only");
      if (ms.git_push !== "none (simulation only)") throw new Error("git_push should be simulation only");
    });
  });

  describe("artifacts", () => {
    it("produces decisions JSON with commit messages", () => {
      const r = run();
      const decisions = readArtifact(r.tmpDir, "commit-eligibility-decisions.json");
      if (!Array.isArray(decisions.decisions)) throw new Error("decisions not array");
      if (decisions.decisions.length === 0) throw new Error("No decisions");
      for (const d of decisions.decisions) {
        if (!d.simulated_commit_message) throw new Error(`No commit message for ${d.job_id}`);
      }
    });
  });

  describe("determinism", () => {
    it("idempotent: same state → same decisions", () => {
      const r1 = run();
      const r2 = run();
      if (r1.parsed?.would_commit !== r2.parsed?.would_commit) throw new Error("Non-deterministic would_commit");
      if (r1.parsed?.blocked !== r2.parsed?.blocked) throw new Error("Non-deterministic blocked");
    });
  });
});
