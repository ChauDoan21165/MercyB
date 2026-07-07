import { describe, it } from "vitest";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import os from "node:os";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const orch = path.join(repoRoot, "scripts/admin/admin-factory-live-validation-orchestrator.mjs");
const wp1 = path.join(repoRoot, "scripts/admin/admin-factory-fresh-wp1-artifact-inventory.mjs");
const wp2 = path.join(repoRoot, "scripts/admin/admin-factory-fresh-wp2-cross-validation.mjs");
const wp3 = path.join(repoRoot, "scripts/admin/admin-factory-fresh-wp3-readiness-checklist.mjs");

function run(script) {
  const r = spawnSync(process.execPath, [script], { encoding: "utf8", cwd: repoRoot, timeout: 120000 });
  let p = null; try { p = JSON.parse((r.stdout || "").trim()); } catch { /* */ }
  return { ok: r.status === 0, parsed: p };
}

describe("LIVE-VALIDATION", () => {
  describe("fresh workpacks execute", () => {
    it("WP1 artifact inventory runs ok", () => { const r = run(wp1); if (!r.ok) throw new Error("WP1 failed"); if (!r.parsed?.ok) throw new Error(JSON.stringify(r.parsed)); });
    it("WP2 cross-validation runs ok", () => { const r = run(wp2); if (!r.ok) throw new Error("WP2 failed"); if (!r.parsed?.ok) throw new Error(JSON.stringify(r.parsed)); });
    it("WP3 readiness checklist runs ok", () => { const r = run(wp3); if (!r.ok) throw new Error("WP3 failed"); if (!r.parsed?.ok) throw new Error(JSON.stringify(r.parsed)); });
    it("WP1 is READ_ONLY", () => { const r = run(wp1); if (r.parsed?.workpack !== "FRESH-WP-001") throw new Error("Wrong WP"); });
    it("WP2 reports component pass rate", () => { const r = run(wp2); if (typeof r.parsed?.pass_rate !== "number") throw new Error("No pass_rate"); });
    it("WP3 produces recommendation", () => { const r = run(wp3); if (!r.parsed?.recommendation) throw new Error("No recommendation"); });
  });

  describe("orchestrator proves evidence automation", () => {
    it("orchestrator runs 3 workpacks", () => {
      const r = run(orch);
      if (!r.parsed?.ok) throw new Error("Orchestrator failed: " + JSON.stringify(r.parsed));
      if (r.parsed.workpacks_executed !== 3) throw new Error(`Expected 3, got ${r.parsed.workpacks_executed}`);
    });
    it("all proofs pass", () => { const r = run(orch); if (!r.parsed?.all_proofs_pass) throw new Error("Not all proofs pass"); });
    it("all workpacks ok", () => { const r = run(orch); if (!r.parsed?.all_workpacks_ok) throw new Error("Not all workpacks ok"); });
    it("evidence health >= 75", () => { const r = run(orch); if ((r.parsed?.final_evidence_health || 0) < 75) throw new Error(`Evidence health ${r.parsed?.final_evidence_health} < 75`); });
    it("recommendation is READY_FOR_LEVEL3_REVIEW_AFTER_LIVE_VALIDATION", () => {
      const r = run(orch);
      if (r.parsed?.recommendation !== "READY_FOR_LEVEL3_REVIEW_AFTER_LIVE_VALIDATION") throw new Error(`Bad recommendation: ${r.parsed?.recommendation}`);
    });
  });

  describe("no mutations", () => {
    it("orchestrator declares zero mutations", () => {
      const r = run(orch);
      const m = JSON.parse(fs.readFileSync(r.parsed.manifest_path, "utf8"));
      if (m.mutation_summary.database_writes !== "none") throw new Error("Should be zero mutations");
    });
  });
});
