/**
 * ADMIN-FACTORY-QUEUE-PRIORITY-ENGINE-001 — Tests
 */

import { describe, it } from "vitest";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import os from "node:os";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "../..");
const scriptPath = path.join(repoRoot, "scripts/admin/admin-factory-queue-priority.mjs");

function runScript(args = []) {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "queue-prio-test-"));
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
  const f = path.join(os.tmpdir(), `queue-prio-input-${Date.now()}.json`);
  fs.writeFileSync(f, JSON.stringify(data, null, 2));
  return f;
}

describe("ADMIN-FACTORY-QUEUE-PRIORITY-ENGINE-001", () => {
  describe("scoring", () => {
    it("higher evidence gap → higher score", () => {
      const input = writeTempInput([
        { entity_id: "low-gap", title: "Low gap", evidence_gap: 0, priority: 100 },
        { entity_id: "high-gap", title: "High gap", evidence_gap: 5, priority: 100 },
      ]);
      const manifest = readArtifact(runScript([input]).tmpDir, "queue-priority-manifest.json");
      const items = manifest.ranked_items;
      if (items[0].item_id !== "high-gap") throw new Error("High gap should rank first");
      try { fs.unlinkSync(input); } catch { /* ok */ }
    });

    it("retry history increases priority", () => {
      const input = writeTempInput([
        { entity_id: "fresh", title: "Fresh", attempt_count: 0, priority: 100 },
        { entity_id: "retried", title: "Retried", attempt_count: 3, priority: 100 },
      ]);
      const manifest = readArtifact(runScript([input]).tmpDir, "queue-priority-manifest.json");
      if (manifest.ranked_items[0].item_id !== "retried") throw new Error("Retried should rank first");
      try { fs.unlinkSync(input); } catch { /* ok */ }
    });

    it("safety violations are held (deprioritized)", () => {
      const input = writeTempInput([
        { entity_id: "safe", title: "Safe job", priority: 50 },
        { entity_id: "unsafe", title: "Unsafe job", priority: 10, safety_violation: true },
      ]);
      const manifest = readArtifact(runScript([input]).tmpDir, "queue-priority-manifest.json");
      const unsafe = manifest.ranked_items.find((r) => r.item_id === "unsafe");
      if (unsafe.dispatchable) throw new Error("Unsafe item should not be dispatchable");
      try { fs.unlinkSync(input); } catch { /* ok */ }
    });

    it("produces comparison explanations", () => {
      const input = writeTempInput([
        { entity_id: "A", title: "Job A", evidence_gap: 5, priority: 10 },
        { entity_id: "B", title: "Job B", evidence_gap: 1, priority: 50 },
      ]);
      const manifest = readArtifact(runScript([input]).tmpDir, "queue-priority-manifest.json");
      const top = manifest.ranked_items[0];
      if (!top.comparison) throw new Error("Top item should have comparison");
      if (!top.comparison.reasons.includes("outranks")) throw new Error("Comparison should explain ranking");
      try { fs.unlinkSync(input); } catch { /* ok */ }
    });
  });

  describe("ranking", () => {
    it("ranks by score descending", () => {
      const input = writeTempInput([
        { entity_id: "low", title: "Low", evidence_gap: 0, priority: 500 },
        { entity_id: "mid", title: "Mid", evidence_gap: 2, priority: 200 },
        { entity_id: "high", title: "High", evidence_gap: 5, priority: 50, attempt_count: 2 },
      ]);
      const manifest = readArtifact(runScript([input]).tmpDir, "queue-priority-manifest.json");
      const scores = manifest.ranked_items.map((r) => r.total_score);
      for (let i = 1; i < scores.length; i++) {
        if (scores[i] > scores[i - 1]) throw new Error("Not sorted descending");
      }
      try { fs.unlinkSync(input); } catch { /* ok */ }
    });
  });

  describe("simulation", () => {
    it("produces simulation_report.json", () => {
      const input = writeTempInput([{ entity_id: "test", title: "Test", priority: 100 }]);
      const r = runScript([input]);
      const sim = readArtifact(r.tmpDir, "simulation_report.json");
      if (!sim?.simulation_mode) throw new Error("Should be simulation mode");
      if (sim.would_dispatch.length < 1) throw new Error("Should have dispatchable items");
      try { fs.unlinkSync(input); } catch { /* ok */ }
    });
  });

  describe("determinism", () => {
    it("idempotent: same items → same ranking", () => {
      const input = writeTempInput([
        { entity_id: "a", evidence_gap: 3, priority: 50 },
        { entity_id: "b", evidence_gap: 1, priority: 100 },
      ]);
      const r1 = runScript([input]);
      const r2 = runScript([input]);
      const m1 = readArtifact(r1.tmpDir, "queue-priority-manifest.json");
      const m2 = readArtifact(r2.tmpDir, "queue-priority-manifest.json");
      const ids1 = m1.ranked_items.map((i) => i.item_id).join(",");
      const ids2 = m2.ranked_items.map((i) => i.item_id).join(",");
      if (ids1 !== ids2) throw new Error("Non-deterministic ranking");
      try { fs.unlinkSync(input); } catch { /* ok */ }
    });
  });

  describe("mutation summary", () => {
    it("declares zero mutations", () => {
      const input = writeTempInput([{ entity_id: "t", priority: 100 }]);
      const manifest = readArtifact(runScript([input]).tmpDir, "queue-priority-manifest.json");
      const ms = manifest?.mutation_summary;
      if (ms.queue_mutations !== "none (simulation mode)") throw new Error("Should be simulation");
      try { fs.unlinkSync(input); } catch { /* ok */ }
    });
  });
});
