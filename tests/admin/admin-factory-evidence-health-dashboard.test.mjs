import { describe, it } from "vitest";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import os from "node:os";
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const sp = path.join(repoRoot, "scripts/admin/admin-factory-evidence-health-dashboard.mjs");
function run() { const d = fs.mkdtempSync(path.join(os.tmpdir(), "ev-health-")); const r = spawnSync(process.execPath, [sp, d], { encoding: "utf8", cwd: repoRoot }); let p = null; try { p = JSON.parse((r.stdout || "").trim()); } catch { /* */ } return { ...r, parsed: p, tmpDir: d }; }
describe("EVIDENCE-HEALTH-DASHBOARD-001", () => {
  it("exits ok", () => { const r = run(); if (!r.parsed?.ok) throw new Error(JSON.stringify(r.parsed)); });
  it("reports evidence_health score", () => { const r = run(); if (typeof r.parsed.evidence_health !== "number") throw new Error("No score"); });
  it("reports delta from previous health", () => { const r = run(); if (typeof r.parsed.delta !== "number") throw new Error("No delta"); });
  it("produces dashboard JSON and MD", () => { const r = run(); if (!fs.existsSync(r.parsed.dashboard_json)) throw new Error("Missing JSON"); if (!fs.existsSync(r.parsed.dashboard_md)) throw new Error("Missing MD"); });
  it("is deterministic", () => { const a = run(), b = run(); if (a.parsed?.evidence_health !== b.parsed?.evidence_health) throw new Error("Non-deterministic"); });
});
