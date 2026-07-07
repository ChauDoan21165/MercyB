/**
 * ADMIN-FACTORY-STUCK-JOB-RECOVERY-001 — Tests
 *
 * Validates:
 * 1. Healthy RUNNING job with recent heartbeat → not stuck
 * 2. Running 9h no heartbeat → stuck, would retry
 * 3. Running 15h past max → stuck critical, would escalate
 * 4. Max attempts exceeded + critical → escalate
 * 5. Simulation mode produces no queue mutations
 * 6. Historical replay tracks past state
 * 7. Report generation (manifest + markdown + simulation_report.json)
 * 8. Deterministic output
 * 9. Mutation summary is clean
 */

import { describe, it } from "vitest";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import os from "node:os";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "../..");
const scriptPath = path.join(repoRoot, "scripts/admin/admin-factory-stuck-job-recovery.mjs");

function runScript(args = []) {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "stuck-job-test-"));
  const result = spawnSync(process.execPath, [scriptPath, "-o", tmpDir, ...args], {
    encoding: "utf8",
    cwd: repoRoot,
  });
  let parsed = null;
  try { parsed = JSON.parse((result.stdout || "").trim()); } catch { /* not JSON */ }
  return { ...result, parsed, tmpDir };
}

function readArtifact(tmpDir, filename) {
  const p = path.join(tmpDir, filename);
  if (!fs.existsSync(p)) return null;
  try { return JSON.parse(fs.readFileSync(p, "utf8")); } catch { return null; }
}

function writeTempInput(data) {
  const tmpFile = path.join(os.tmpdir(), `stuck-jobs-${Date.now()}.json`);
  fs.writeFileSync(tmpFile, JSON.stringify(data, null, 2));
  return tmpFile;
}

// Helper: create a job state
function job(overrides = {}) {
  const now = new Date();
  return {
    job_id: "JOB-0001",
    title: "test-job",
    mission_slug: "test-mission",
    status: "RUNNING",
    started_at: new Date(now - 9 * 3600 * 1000).toISOString(), // 9 hours ago
    last_heartbeat: new Date(now - 9 * 3600 * 1000).toISOString(), // also 9h ago (= no recent heartbeat)
    worker_id: "worker-1",
    attempt_count: 0,
    max_attempts: 3,
    priority: 50,
    ...overrides,
  };
}

describe("ADMIN-FACTORY-STUCK-JOB-RECOVERY-001", () => {
  describe("stuck detection", () => {
    it("detects job running 9h with no heartbeat as stuck", () => {
      const input = writeTempInput([job()]);
      const r = runScript([input]);
      if (r.parsed?.stuck_jobs < 1) throw new Error("Should detect at least 1 stuck job");
      const manifest = readArtifact(r.tmpDir, "stuck-job-recovery-manifest.json");
      const j = manifest.results[0];
      if (!j.stuck) throw new Error("Should be stuck");
      if (j.severity !== "critical") throw new Error(`Expected critical severity, got ${j.severity}`);
      try { fs.unlinkSync(input); } catch { /* ok */ }
    });

    it("healthy job with recent heartbeat is not stuck", () => {
      const now = new Date();
      const input = writeTempInput([job({
        started_at: new Date(now - 1 * 3600 * 1000).toISOString(),
        last_heartbeat: new Date(now - 5 * 60 * 1000).toISOString(), // 5 min ago
      })]);
      const r = runScript([input]);
      if (r.parsed?.stuck_jobs !== 0) throw new Error("Healthy job should not be stuck");
      try { fs.unlinkSync(input); } catch { /* ok */ }
    });

    it("non-RUNNING jobs are not flagged", () => {
      const input = writeTempInput([job({ status: "DONE" })]);
      const r = runScript([input]);
      if (r.parsed?.stuck_jobs !== 0) throw new Error("DONE job should not be stuck");
      try { fs.unlinkSync(input); } catch { /* ok */ }
    });

    it("detects missing worker as stuck reason", () => {
      const now = new Date();
      const input = writeTempInput([job({
        worker_id: null,
        started_at: new Date(now - 5 * 3600 * 1000).toISOString(),
        last_heartbeat: new Date(now - 5 * 3600 * 1000).toISOString(),
      })]);
      const r = runScript([input]);
      const manifest = readArtifact(r.tmpDir, "stuck-job-recovery-manifest.json");
      const j = manifest.results[0];
      const hasNoWorker = j.stuck_reasons.some((r) => r.code === "NO_WORKER");
      if (!hasNoWorker) throw new Error("Should have NO_WORKER reason");
      try { fs.unlinkSync(input); } catch { /* ok */ }
    });
  });

  describe("recovery planning", () => {
    it("plans RETRY for job with remaining attempts and no heartbeat", () => {
      const input = writeTempInput([job({ attempt_count: 0, max_attempts: 3 })]);
      const manifest = readArtifact(runScript([input]).tmpDir, "stuck-job-recovery-manifest.json");
      const j = manifest.results[0];
      if (j.recovery.action !== "RETRY") {
        throw new Error(`Expected RETRY, got ${j.recovery.action}: ${j.recovery.reason}`);
      }
      if (!j.recovery.would_mutate_queue) throw new Error("RETRY should mutate queue");
      try { fs.unlinkSync(input); } catch { /* ok */ }
    });

    it("plans ESCALATE for job with max attempts exceeded", () => {
      const input = writeTempInput([job({ attempt_count: 3, max_attempts: 3 })]);
      const manifest = readArtifact(runScript([input]).tmpDir, "stuck-job-recovery-manifest.json");
      const j = manifest.results[0];
      if (j.recovery.action !== "ESCALATE") {
        throw new Error(`Expected ESCALATE, got ${j.recovery.action}`);
      }
      if (j.recovery.would_mutate_queue) throw new Error("ESCALATE should NOT mutate queue");
      try { fs.unlinkSync(input); } catch { /* ok */ }
    });

    it("plans HOLD for healthy running job", () => {
      const now = new Date();
      const input = writeTempInput([job({
        started_at: new Date(now - 1 * 3600 * 1000).toISOString(),
        last_heartbeat: new Date(now - 5 * 60 * 1000).toISOString(),
      })]);
      const manifest = readArtifact(runScript([input]).tmpDir, "stuck-job-recovery-manifest.json");
      const j = manifest.results[0];
      if (j.recovery.action !== "HOLD") {
        throw new Error(`Expected HOLD for healthy job, got ${j.recovery.action}`);
      }
      try { fs.unlinkSync(input); } catch { /* ok */ }
    });
  });

  describe("simulation mode", () => {
    it("reports simulation_mode=true by default", () => {
      const input = writeTempInput([job()]);
      const r = runScript([input]);
      const simReport = readArtifact(r.tmpDir, "simulation_report.json");
      if (!simReport?.simulation_mode) throw new Error("Should be simulation mode");
      try { fs.unlinkSync(input); } catch { /* ok */ }
    });

    it("simulation_report includes would_* counts", () => {
      const input = writeTempInput([job()]);
      const r = runScript([input]);
      const simReport = readArtifact(r.tmpDir, "simulation_report.json");
      const fields = ["would_dispatch", "would_retry", "would_hold", "would_escalate", "would_ignore"];
      for (const f of fields) {
        if (typeof simReport[f] !== "number") throw new Error(`${f} missing from simulation_report`);
      }
      try { fs.unlinkSync(input); } catch { /* ok */ }
    });

    it("declares zero queue mutations in simulation mode", () => {
      const input = writeTempInput([job()]);
      const manifest = readArtifact(runScript([input]).tmpDir, "stuck-job-recovery-manifest.json");
      const ms = manifest?.mutation_summary;
      if (ms.queue_mutations !== "none (simulation mode)") {
        throw new Error(`Expected simulation mode, got: ${ms.queue_mutations}`);
      }
      try { fs.unlinkSync(input); } catch { /* ok */ }
    });
  });

  describe("historical replay", () => {
    it("replays detection against historical log", () => {
      const now = new Date();
      const historicalLog = writeTempInput([
        { job_id: "JOB-0001", status: "RUNNING", started_at: new Date(now - 10 * 3600 * 1000).toISOString() },
      ]);
      const input = writeTempInput([job()]);

      const r = runScript([input, "--historical-log", historicalLog]);
      const manifest = readArtifact(r.tmpDir, "stuck-job-recovery-manifest.json");
      const replay = manifest?.historical_replay;
      if (!Array.isArray(replay) || replay.length === 0) throw new Error("Historical replay missing");
      const entry = replay.find((e) => e.job_id === "JOB-0001");
      if (!entry) throw new Error("JOB-0001 not in replay");
      if (entry.was_stuck_before !== true) throw new Error("Should have been stuck before");

      try { fs.unlinkSync(input); } catch { /* ok */ }
      try { fs.unlinkSync(historicalLog); } catch { /* ok */ }
    });
  });

  describe("artifacts", () => {
    it("produces manifest, report, and simulation_report", () => {
      const input = writeTempInput([job()]);
      const r = runScript([input]);
      const manifest = readArtifact(r.tmpDir, "stuck-job-recovery-manifest.json");
      if (!manifest) throw new Error("Manifest missing");
      const reportPath = path.join(r.tmpDir, "stuck-job-recovery-report.md");
      if (!fs.existsSync(reportPath)) throw new Error("Report missing");
      const simReport = readArtifact(r.tmpDir, "simulation_report.json");
      if (!simReport) throw new Error("simulation_report.json missing");
      try { fs.unlinkSync(input); } catch { /* ok */ }
    });
  });

  describe("determinism", () => {
    it("idempotent: same stuck jobs → same actions", () => {
      const input = writeTempInput([job(), job({ job_id: "JOB-0002" })]);
      const r1 = runScript([input]);
      const r2 = runScript([input]);
      if (r1.parsed?.would_retry !== r2.parsed?.would_retry) throw new Error("Non-deterministic retry count");
      if (r1.parsed?.would_escalate !== r2.parsed?.would_escalate) throw new Error("Non-deterministic escalate count");
      try { fs.unlinkSync(input); } catch { /* ok */ }
    });
  });

  describe("mutation summary", () => {
    it("declares zero product-side mutations", () => {
      const input = writeTempInput([job()]);
      const manifest = readArtifact(runScript([input]).tmpDir, "stuck-job-recovery-manifest.json");
      const ms = manifest?.mutation_summary;
      if (!ms) throw new Error("mutation_summary missing");
      if (ms.database_writes !== "none") throw new Error(`db=${ms.database_writes}`);
      if (ms.product_changes !== "none") throw new Error(`product=${ms.product_changes}`);
      if (ms.push_merge_deploy !== "none") throw new Error(`deploy=${ms.push_merge_deploy}`);
      try { fs.unlinkSync(input); } catch { /* ok */ }
    });
  });
});
