import { describe, it } from "vitest";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import os from "node:os";
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const sp = path.join(repoRoot, "scripts/admin/admin-factory-traceability-link-builder.mjs");
function run() { const d = fs.mkdtempSync(path.join(os.tmpdir(), "tr-link-")); const r = spawnSync(process.execPath, [sp, d], { encoding: "utf8", cwd: repoRoot }); let p = null; try { p = JSON.parse((r.stdout || "").trim()); } catch { /* */ } return { ...r, parsed: p, tmpDir: d }; }
describe("TRACEABILITY-LINK-BUILDER-001", () => {
  it("exits ok", () => { const r = run(); if (!r.parsed?.ok) throw new Error(JSON.stringify(r.parsed)); });
  it("builds links", () => { const r = run(); if (typeof r.parsed?.links_built !== "number") throw new Error("No links"); });
  it("produces missing_links.json", () => { const r = run(); if (!fs.existsSync(r.parsed.missing_links_path)) throw new Error("Missing"); });
  it("produces confidence_report.json", () => { const r = run(); if (!fs.existsSync(r.parsed.confidence_report_path)) throw new Error("Missing"); });
  it("avg_completeness is 0-100", () => { const r = run(); if (r.parsed.avg_completeness < 0 || r.parsed.avg_completeness > 100) throw new Error(`Invalid: ${r.parsed.avg_completeness}`); });
  it("is deterministic", () => { const a = run(), b = run(); if (a.parsed?.links_built !== b.parsed?.links_built) throw new Error("Non-deterministic"); });
});
