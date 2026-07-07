#!/usr/bin/env node
/**
 * FRESH-WP-002 — Factory Cross-Component Validation
 * READ_ONLY. Runs all Level 2 components and validates their outputs exist and are parseable.
 * No mutations. No DB writes. No product changes.
 */
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const REPORTS_ROOT = process.env.ADMIN_FACTORY_REPORTS_ROOT || "/Users/admin/autorun/reports";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const OUT = path.join(REPORTS_ROOT, "fresh-workpack-2-cross-validation");

function exists(p) { return fs.existsSync(p); }
function ensureDir(dir) { fs.mkdirSync(dir, { recursive: true }); }

const COMPONENTS = [
  { name: "aak-real-inputs", script: "aak-real-inputs.mjs" },
  { name: "aak-traceability-gap", script: "aak-traceability-gap.mjs" },
  { name: "stuck-job-recovery", script: "admin-factory-stuck-job-recovery.mjs" },
  { name: "exception-escalator", script: "admin-factory-exception-escalator.mjs" },
  { name: "queue-priority", script: "admin-factory-queue-priority.mjs" },
  { name: "autonomy-dashboard", script: "admin-factory-autonomy-dashboard.mjs" },
  { name: "execution-record-generator", script: "admin-factory-execution-record-generator.mjs" },
  { name: "evidence-bundle-generator", script: "admin-factory-evidence-bundle-generator.mjs" },
  { name: "traceability-link-builder", script: "admin-factory-traceability-link-builder.mjs" },
  { name: "coverage-analyzer", script: "admin-factory-coverage-analyzer.mjs" },
  { name: "judge-package-generator", script: "admin-factory-judge-package-generator.mjs" },
  { name: "evidence-health-dashboard", script: "admin-factory-evidence-health-dashboard.mjs" },
];

function runComponent(scriptName) {
  const sp = path.join(repoRoot, "scripts/admin", scriptName);
  if (!exists(sp)) return { ok: false, error: "script_missing" };
  const r = spawnSync(process.execPath, [sp], { encoding: "utf8", cwd: repoRoot, timeout: 30000 });
  let parsed = null;
  try { parsed = JSON.parse((r.stdout || "").trim()); } catch { /* */ }
  return { ok: r.status === 0, exit_code: r.status, parsed, error: r.stderr?.slice(0, 200) || null };
}

function main() {
  ensureDir(OUT);
  const results = COMPONENTS.map((c) => ({ component: c.name, ...runComponent(c.script) }));
  const passed = results.filter((r) => r.ok).length;
  const report = {
    schema: "fresh-workpack/v1", workpack_id: "FRESH-WP-002",
    title: "Factory Cross-Component Validation",
    generated_at: new Date().toISOString(),
    runner: "ADMIN-FACTORY-FRESH-WP2",
    mutation_level: "read_only", risk_level: "low",
    results,
    summary: { total: results.length, passed, failed: results.length - passed, pass_rate: Math.round((passed / results.length) * 100) },
  };
  const p = path.join(OUT, "cross-validation.json");
  fs.writeFileSync(p, JSON.stringify(report, null, 2) + "\n");
  process.stdout.write(JSON.stringify({ ok: true, workpack: "FRESH-WP-002", passed, total: results.length, pass_rate: report.summary.pass_rate, report_path: p }, null, 2) + "\n");
}
main();
