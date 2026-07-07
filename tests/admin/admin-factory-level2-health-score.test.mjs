import { describe, it } from "vitest";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import os from "node:os";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const sp = path.join(repoRoot, "scripts/admin/admin-factory-level2-health-score.mjs");

function run() {
  const d = fs.mkdtempSync(path.join(os.tmpdir(), "l2hs-"));
  const r = spawnSync(process.execPath, [sp, d], { encoding: "utf8", cwd: repoRoot });
  let p = null; try { p = JSON.parse((r.stdout || "").trim()); } catch { /* */ }
  return { ...r, parsed: p, tmpDir: d };
}

describe("LEVEL2-HEALTH-SCORE-001", () => {
  it("exits ok", () => { const r = run(); if (!r.parsed?.ok) throw new Error(JSON.stringify(r.parsed)); });
  it("produces level2_health.json", () => { const r = run(); if (!fs.existsSync(r.parsed.health_json)) throw new Error("Missing"); });
  it("overall score is 0-100", () => { const r = run(); if (r.parsed.overall < 0 || r.parsed.overall > 100) throw new Error(`Invalid: ${r.parsed.overall}`); });
  it("grade is A/B/C/D/F", () => { const r = run(); if (!["A","B","C","D","F"].includes(r.parsed.grade)) throw new Error(`Invalid grade: ${r.parsed.grade}`); });
  it("has all 8 dimensions", () => {
    const r = run();
    const dims = ["safety","automation","evidence","traceability","queue","recovery","validation","reporting"];
    for (const d of dims) if (typeof r.parsed.dimensions[d] !== "number") throw new Error(`Missing dimension: ${d}`);
  });
  it("is deterministic", () => { const a = run(), b = run(); if (a.parsed?.overall !== b.parsed?.overall) throw new Error("Non-deterministic"); });
});
