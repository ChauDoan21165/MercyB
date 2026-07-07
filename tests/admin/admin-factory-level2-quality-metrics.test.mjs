import { describe, it } from "vitest";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import os from "node:os";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const sp = path.join(repoRoot, "scripts/admin/admin-factory-level2-quality-metrics.mjs");

function run() {
  const d = fs.mkdtempSync(path.join(os.tmpdir(), "l2qm-"));
  const r = spawnSync(process.execPath, [sp, d], { encoding: "utf8", cwd: repoRoot });
  let p = null; try { p = JSON.parse((r.stdout || "").trim()); } catch { /* */ }
  return { ...r, parsed: p, tmpDir: d };
}

describe("LEVEL2-QUALITY-METRICS-001", () => {
  it("exits ok", () => { const r = run(); if (!r.parsed?.ok) throw new Error(JSON.stringify(r.parsed)); });
  it("produces level2_quality_metrics.json", () => { const r = run(); if (!fs.existsSync(r.parsed.metrics_json)) throw new Error("Missing"); });
  it("produces level2_quality_report.md", () => { const r = run(); if (!fs.existsSync(r.parsed.metrics_md)) throw new Error("Missing"); });
  it("measures at least 5 metrics", () => {
    const r = run();
    const m = r.parsed.metrics;
    const measured = Object.values(m).filter((v) => v !== "unavailable");
    if (measured.length < 3) throw new Error(`Only ${measured.length} measured`);
  });
  it("is deterministic", () => { const a = run(), b = run(); if (JSON.stringify(a.parsed?.metrics) !== JSON.stringify(b.parsed?.metrics)) throw new Error("Non-deterministic"); });
});
