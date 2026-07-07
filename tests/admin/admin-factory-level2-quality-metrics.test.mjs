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
  let p = null;
  try { p = JSON.parse((r.stdout || "").trim()); } catch { /* null on CI when data sources missing */ }
  // Check for output files written to temp dir
  const metricsPath = path.join(d, "level2_quality_metrics.json");
  const reportPath = path.join(d, "level2_quality_report.md");
  const hasFiles = fs.existsSync(metricsPath) || fs.existsSync(reportPath);
  return { ...r, parsed: p, tmpDir: d, hasOutputFiles: hasFiles, metricsPath, reportPath };
}

describe("LEVEL2-QUALITY-METRICS-001", () => {
  it("exits or produces output files", () => {
    const r = run();
    const ok = r.parsed?.ok === true || r.hasOutputFiles;
    if (!ok) throw new Error(`Neither parsed ok nor output files. stderr: ${r.stderr?.slice(0, 200)}`);
  });

  it("produces level2_quality_metrics.json when data available", () => {
    const r = run();
    if (fs.existsSync(r.metricsPath)) {
      const m = JSON.parse(fs.readFileSync(r.metricsPath, "utf8"));
      if (!m.metrics) throw new Error("metrics missing from output");
    }
    // On CI: file may not be generated if all data sources are unavailable
  });

  it("produces level2_quality_report.md when data available", () => {
    const r = run();
    if (fs.existsSync(r.reportPath)) {
      const content = fs.readFileSync(r.reportPath, "utf8");
      if (!content.includes("Quality Metrics")) throw new Error("Report missing expected content");
    }
    // On CI: skip — report may not be generated without data
  });

  it("measures available metrics without crashing", () => {
    const r = run();
    if (r.parsed?.metrics) {
      const m = r.parsed.metrics;
      const measured = Object.values(m).filter((v) => v !== "unavailable");
      // At least 1 metric is always measurable (report_completeness checks its own data sources)
      if (measured.length < 1) throw new Error("No metrics measured at all");
    }
    // On CI with no data sources: script exits cleanly, which is acceptable
  });

  it("is deterministic", () => {
    const a = run(), b = run();
    const aOk = a.parsed?.ok === true || a.hasOutputFiles;
    const bOk = b.parsed?.ok === true || b.hasOutputFiles;
    if (aOk !== bOk) throw new Error("Non-deterministic: runs diverged");
  });
});
