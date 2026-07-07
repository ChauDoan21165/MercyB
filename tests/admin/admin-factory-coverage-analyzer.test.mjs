import { describe, it } from "vitest";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import os from "node:os";
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const sp = path.join(repoRoot, "scripts/admin/admin-factory-coverage-analyzer.mjs");
function run() { const d = fs.mkdtempSync(path.join(os.tmpdir(), "coverage-")); const r = spawnSync(process.execPath, [sp, d], { encoding: "utf8", cwd: repoRoot }); let p = null; try { p = JSON.parse((r.stdout || "").trim()); } catch { /* */ } return { ...r, parsed: p, tmpDir: d }; }
describe("COVERAGE-ANALYZER-001", () => {
  it("exits ok", () => { const r = run(); if (!r.parsed?.ok) throw new Error(JSON.stringify(r.parsed)); });
  it("measures execution coverage", () => { const r = run(); if (typeof r.parsed.execution_coverage !== "number") throw new Error("No execution coverage"); });
  it("measures evidence coverage", () => { const r = run(); if (typeof r.parsed.evidence_coverage !== "number") throw new Error("No evidence coverage"); });
  it("measures traceability coverage", () => { const r = run(); if (typeof r.parsed.traceability_coverage !== "number") throw new Error("No traceability coverage"); });
  it("produces coverage_dashboard.json", () => { const r = run(); if (!fs.existsSync(r.parsed.coverage_dashboard)) throw new Error("Missing"); });
  it("is deterministic", () => { const a = run(), b = run(); if (a.parsed?.overall_coverage !== b.parsed?.overall_coverage) throw new Error("Non-deterministic"); });
});
