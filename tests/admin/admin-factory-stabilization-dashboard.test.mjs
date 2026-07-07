import { describe, it } from "vitest";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import os from "node:os";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const sp = path.join(repoRoot, "scripts/admin/admin-factory-stabilization-dashboard.mjs");

function run() {
  const d = fs.mkdtempSync(path.join(os.tmpdir(), "l2sd-"));
  const r = spawnSync(process.execPath, [sp, d], { encoding: "utf8", cwd: repoRoot });
  let p = null; try { p = JSON.parse((r.stdout || "").trim()); } catch { /* */ }
  return { ...r, parsed: p, tmpDir: d };
}

describe("STABILIZATION-DASHBOARD-001", () => {
  it("exits ok", () => { const r = run(); if (!r.parsed?.ok) throw new Error(JSON.stringify(r.parsed)); });
  it("produces stabilization-dashboard.json", () => { const r = run(); if (!fs.existsSync(r.parsed.dashboard_json)) throw new Error("Missing"); });
  it("produces stabilization-dashboard.md", () => { const r = run(); if (!fs.existsSync(r.parsed.dashboard_md)) throw new Error("Missing"); });
  it("includes all sections", () => {
    const r = run();
    const d = JSON.parse(fs.readFileSync(r.parsed.dashboard_json, "utf8"));
    const sections = ["autonomy","health","prediction_accuracy","human_gates","queue","recovery","traceability","recommendation"];
    for (const s of sections) if (!d[s]) throw new Error(`Missing section: ${s}`);
  });
  it("recommendation is REMAIN_LEVEL2 or READY_FOR_LEVEL3_REVIEW", () => {
    const r = run();
    if (!["REMAIN_LEVEL2","READY_FOR_LEVEL3_REVIEW"].includes(r.parsed.recommendation)) throw new Error(`Bad recommendation: ${r.parsed.recommendation}`);
  });
  it("is deterministic", () => { const a = run(), b = run(); if (a.parsed?.health_score !== b.parsed?.health_score) throw new Error("Non-deterministic"); });
});
