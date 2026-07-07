/**
 * AAK-PRIORITY-EXPLAINER-001 — Tests
 *
 * Validates:
 * 1. Score decomposition: each factor has raw_value, weight, contribution
 * 2. Score formula: contribution * weight sums correctly
 * 3. Primary driver identification
 * 4. Explanation generation
 * 5. Ranking by score descending
 * 6. Source evidence tracking
 * 7. Input format compatibility (capability graph, failure reasons, raw rows)
 * 8. Auto-discovery from traceability gaps
 * 9. Idempotent output
 * 10. Zero mutation summary
 */

import { describe, it } from "vitest";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import os from "node:os";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "../..");
const scriptPath = path.join(repoRoot, "scripts/admin/aak-priority-explainer.mjs");

function runScript(args = []) {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "aak-prio-exp-test-"));
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

function writeTempInput(data, prefix = "priority-input") {
  const tmpFile = path.join(os.tmpdir(), `${prefix}-${Date.now()}.json`);
  fs.writeFileSync(tmpFile, JSON.stringify(data, null, 2));
  return tmpFile;
}

describe("AAK-PRIORITY-EXPLAINER-001", () => {
  describe("score decomposition", () => {
    it("decomposes score into all 6 factors", () => {
      const input = writeTempInput([{
        entity_id: "test-entity",
        entity_type: "BUG",
        confidence: 70,
        evidence_gap: 3,
        replay_gap: 2,
        judge_gap: 1,
        engineering_cost: 5,
        estimated_product_impact: 10,
      }]);
      const r = runScript([input]);
      const manifest = readArtifact(r.tmpDir, "aak-priority-explainer-manifest.json");
      const item = manifest?.ranked_items?.[0];
      if (!item) throw new Error("No ranked items");
      const d = item.decomposition;
      const expectedKeys = ["impact", "evidence_gap", "replay_gap", "judge_gap", "confidence_penalty", "cost"];
      for (const k of expectedKeys) {
        if (!d[k]) throw new Error(`Missing factor: ${k}`);
        if (typeof d[k].raw_value !== "number") throw new Error(`${k}.raw_value not a number`);
        if (typeof d[k].weight !== "number") throw new Error(`${k}.weight not a number`);
        if (typeof d[k].contribution !== "number") throw new Error(`${k}.contribution not a number`);
      }
      try { fs.unlinkSync(input); } catch { /* ok */ }
    });

    it("score formula: contributions sum to total_score", () => {
      const input = writeTempInput([{
        entity_id: "formula-test",
        entity_type: "TEST",
        confidence: 50,
        evidence_gap: 5,
        replay_gap: 3,
        judge_gap: 2,
        engineering_cost: 4,
        estimated_product_impact: 8,
      }]);
      const r = runScript([input]);
      const manifest = readArtifact(r.tmpDir, "aak-priority-explainer-manifest.json");
      const item = manifest?.ranked_items?.[0];
      const sum = Object.values(item.decomposition).reduce((s, d) => s + d.contribution, 0);
      // Score should match: 8*1 + 5*3 + 3*2 + 2*2 + (100-50)*1 + 4*1 = 8+15+6+4+50+4 = 87
      const expected = 8 + 15 + 6 + 4 + 50 + 4;
      if (item.total_score !== expected) {
        throw new Error(`Score mismatch: ${item.total_score} vs expected ${expected}`);
      }
      if (Math.round(sum) !== item.total_score) {
        throw new Error(`Contribution sum ${sum} != total_score ${item.total_score}`);
      }
      try { fs.unlinkSync(input); } catch { /* ok */ }
    });

    it("zero-input item has score 0", () => {
      const input = writeTempInput([{
        entity_id: "zero-test",
        entity_type: "TEST",
        confidence: 100,
        evidence_gap: 0,
        replay_gap: 0,
        judge_gap: 0,
        engineering_cost: 0,
        estimated_product_impact: 0,
      }]);
      const r = runScript([input]);
      const manifest = readArtifact(r.tmpDir, "aak-priority-explainer-manifest.json");
      const item = manifest?.ranked_items?.[0];
      if (item.total_score !== 0) throw new Error(`Expected 0, got ${item.total_score}`);
      try { fs.unlinkSync(input); } catch { /* ok */ }
    });
  });

  describe("primary driver", () => {
    it("identifies the factor with highest contribution as primary", () => {
      const input = writeTempInput([{
        entity_id: "driver-test",
        entity_type: "TEST",
        confidence: 0, // confidence_penalty = 100, should dominate
        evidence_gap: 1,
        replay_gap: 0,
        judge_gap: 0,
        engineering_cost: 0,
        estimated_product_impact: 0,
      }]);
      const r = runScript([input]);
      const manifest = readArtifact(r.tmpDir, "aak-priority-explainer-manifest.json");
      const item = manifest?.ranked_items?.[0];
      if (item.primary_driver !== "confidence_penalty") {
        throw new Error(`Expected confidence_penalty as primary, got: ${item.primary_driver}`);
      }
      try { fs.unlinkSync(input); } catch { /* ok */ }
    });

    it("generates human-readable explanation", () => {
      const input = writeTempInput([{
        entity_id: "explain-test",
        entity_type: "TEST",
        confidence: 80,
        evidence_gap: 2,
        replay_gap: 1,
        judge_gap: 0,
        engineering_cost: 3,
        estimated_product_impact: 5,
      }]);
      const r = runScript([input]);
      const manifest = readArtifact(r.tmpDir, "aak-priority-explainer-manifest.json");
      const item = manifest?.ranked_items?.[0];
      if (!item.explanation || item.explanation.length === 0) {
        throw new Error("Explanation missing or empty");
      }
      if (!item.explanation.includes("Primary driver:")) {
        throw new Error("Explanation should mention primary driver");
      }
      try { fs.unlinkSync(input); } catch { /* ok */ }
    });
  });

  describe("ranking", () => {
    it("ranks items by score descending", () => {
      const input = writeTempInput([
        { entity_id: "low", entity_type: "TEST", confidence: 100, evidence_gap: 0, replay_gap: 0, judge_gap: 0, engineering_cost: 0, estimated_product_impact: 1 },
        { entity_id: "high", entity_type: "TEST", confidence: 0, evidence_gap: 5, replay_gap: 5, judge_gap: 5, engineering_cost: 10, estimated_product_impact: 20 },
        { entity_id: "mid", entity_type: "TEST", confidence: 80, evidence_gap: 2, replay_gap: 1, judge_gap: 0, engineering_cost: 3, estimated_product_impact: 5 },
      ]);
      const r = runScript([input]);
      const manifest = readArtifact(r.tmpDir, "aak-priority-explainer-manifest.json");
      const items = manifest?.ranked_items;
      if (items[0].entity_id !== "high") throw new Error(`First should be 'high', got ${items[0].entity_id}`);
      if (items[2].entity_id !== "low") throw new Error(`Last should be 'low', got ${items[2].entity_id}`);
      try { fs.unlinkSync(input); } catch { /* ok */ }
    });
  });

  describe("input format compatibility", () => {
    it("accepts capability graph format", () => {
      const input = writeTempInput({
        graph_type: "CAPABILITY_GRAPH",
        capabilities: [
          { capability_ref: "CAP-ALPHA", package_count: 3, churn_score: 5, valid_count: 2, invalid_count: 1 },
        ],
      });
      const r = runScript([input]);
      if (!r.parsed?.ok) throw new Error("Should handle capability graph format");
      const manifest = readArtifact(r.tmpDir, "aak-priority-explainer-manifest.json");
      const item = manifest?.ranked_items?.[0];
      if (item?.entity_id !== "CAP-ALPHA") throw new Error(`Wrong entity: ${item?.entity_id}`);
      try { fs.unlinkSync(input); } catch { /* ok */ }
    });

    it("accepts failure reasons format", () => {
      const input = writeTempInput({
        repeated_failures: [
          { reason: "missing_required", count: 10 },
          { reason: "type_mismatch", count: 3 },
        ],
      });
      const r = runScript([input]);
      if (!r.parsed?.ok) throw new Error("Should handle failure reasons format");
      try { fs.unlinkSync(input); } catch { /* ok */ }
    });
  });

  describe("auto-discovery", () => {
    it("exits successfully without explicit inputs (auto-discovery)", () => {
      const r = runScript(); // No args = auto-discover
      if (!r.parsed) throw new Error(`No output. stderr: ${r.stderr}`);
      if (r.parsed.ok !== true) throw new Error(`Not ok: ${JSON.stringify(r.parsed)}`);
    });
  });

  describe("artifacts", () => {
    it("produces manifest and report", () => {
      const input = writeTempInput([{
        entity_id: "artifact-test",
        entity_type: "TEST",
        confidence: 50, evidence_gap: 1, replay_gap: 0, judge_gap: 0,
        engineering_cost: 1, estimated_product_impact: 5,
      }]);
      const r = runScript([input]);
      const manifest = readArtifact(r.tmpDir, "aak-priority-explainer-manifest.json");
      if (!manifest) throw new Error("Manifest missing");
      if (manifest.runner !== "AAK-PRIORITY-EXPLAINER-001") throw new Error("Wrong runner");
      const reportPath = path.join(r.tmpDir, "aak-priority-explainer-report.md");
      if (!fs.existsSync(reportPath)) throw new Error("Report missing");
      const content = fs.readFileSync(reportPath, "utf8");
      if (!content.includes("AAK Priority Explainer Report")) throw new Error("Bad report title");
      try { fs.unlinkSync(input); } catch { /* ok */ }
    });
  });

  describe("source evidence", () => {
    it("tracks source_file for each item", () => {
      const input = writeTempInput([{
        entity_id: "source-test",
        entity_type: "TEST",
        confidence: 50, evidence_gap: 0, replay_gap: 0, judge_gap: 0,
        engineering_cost: 0, estimated_product_impact: 1,
      }]);
      const r = runScript([input]);
      const manifest = readArtifact(r.tmpDir, "aak-priority-explainer-manifest.json");
      const item = manifest?.ranked_items?.[0];
      if (!item.source_file) throw new Error("source_file missing");
      if (item.source_type !== "raw_array") throw new Error(`Wrong source_type: ${item.source_type}`);
      try { fs.unlinkSync(input); } catch { /* ok */ }
    });
  });

  describe("determinism", () => {
    it("idempotent: same inputs produce same scores", () => {
      const input = writeTempInput([
        { entity_id: "a", entity_type: "T", confidence: 70, evidence_gap: 2, replay_gap: 1, judge_gap: 0, engineering_cost: 1, estimated_product_impact: 5 },
        { entity_id: "b", entity_type: "T", confidence: 50, evidence_gap: 0, replay_gap: 0, judge_gap: 3, engineering_cost: 2, estimated_product_impact: 10 },
      ]);
      const r1 = runScript([input]);
      const r2 = runScript([input]);
      const m1 = readArtifact(r1.tmpDir, "aak-priority-explainer-manifest.json");
      const m2 = readArtifact(r2.tmpDir, "aak-priority-explainer-manifest.json");
      const ids1 = m1.ranked_items.map((i) => i.entity_id).join(",");
      const ids2 = m2.ranked_items.map((i) => i.entity_id).join(",");
      if (ids1 !== ids2) throw new Error(`Non-deterministic ordering: ${ids1} vs ${ids2}`);
      try { fs.unlinkSync(input); } catch { /* ok */ }
    });
  });

  describe("mutation summary", () => {
    it("declares zero mutations", () => {
      const input = writeTempInput([{ entity_id: "m", entity_type: "T", confidence: 50, evidence_gap: 0, replay_gap: 0, judge_gap: 0, engineering_cost: 0, estimated_product_impact: 1 }]);
      const r = runScript([input]);
      const manifest = readArtifact(r.tmpDir, "aak-priority-explainer-manifest.json");
      const ms = manifest?.mutation_summary;
      if (!ms) throw new Error("mutation_summary missing");
      if (ms.database_writes !== "none") throw new Error(`db=${ms.database_writes}`);
      if (ms.runtime_mutations !== "none") throw new Error(`runtime=${ms.runtime_mutations}`);
      try { fs.unlinkSync(input); } catch { /* ok */ }
    });
  });
});
