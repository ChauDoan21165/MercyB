#!/usr/bin/env node
/**
 * ADMIN-FACTORY-EVIDENCE-HEALTH-DASHBOARD-001
 * Publishes unified evidence health: execution, bundles, traceability, coverage, judge readiness.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPORTS_ROOT = process.env.ADMIN_FACTORY_REPORTS_ROOT || "/Users/admin/autorun/reports";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const OUT = path.join(REPORTS_ROOT, "admin-factory-evidence-health");

function exists(p) { return fs.existsSync(p); }
function ensureDir(dir) { fs.mkdirSync(dir, { recursive: true }); }
function readJson(f) { try { return JSON.parse(fs.readFileSync(f, "utf8")); } catch { return null; } }

function loadAll() {
  const base = REPORTS_ROOT;
  return {
    exec: readJson(path.join(base, "admin-factory-execution-records", "execution-record-manifest.json")),
    bundle: readJson(path.join(base, "admin-factory-evidence-bundles", "evidence-bundle-manifest.json")),
    traceLinks: readJson(path.join(base, "admin-factory-traceability-links", "traceability_links.json")),
    traceMissing: readJson(path.join(base, "admin-factory-traceability-links", "missing_links.json")),
    coverage: readJson(path.join(base, "admin-factory-coverage", "coverage_report.json")),
    judge: readJson(path.join(base, "admin-factory-judge-packages", "judge-package-manifest.json")),
    prevHealth: readJson(path.join(base, "admin-factory-level2-health", "level2_health.json")),
  };
}

function buildDashboard(data) {
  const exec = data.exec || {};
  const bundle = data.bundle || {};
  const coverage = data.coverage?.coverage || {};
  const judge = data.judge || {};
  const prevHealth = data.prevHealth?.health || {};

  // Evidence health score: weighted average of sub-scores
  const execScore = coverage?.execution_record?.coverage_pct || 0;
  const bundleScore = coverage?.evidence_bundle?.non_empty_pct || 0;
  const traceScore = coverage?.traceability?.avg_completeness || 0;
  const judgeScore = data.judge ? Math.round((judge.judge_ready / (judge.total_packages || 1)) * 100) : 0;

  const evidenceHealth = Math.round((execScore * 0.3 + bundleScore * 0.3 + traceScore * 0.25 + judgeScore * 0.15));

  const prevOverall = prevHealth?.overall || 57;
  const delta = evidenceHealth - prevOverall;

  return {
    dashboard: "admin-factory-evidence-health-dashboard/v1",
    runner: "ADMIN-FACTORY-EVIDENCE-HEALTH-DASHBOARD-001",
    generated_at: new Date().toISOString(),
    evidence_health: {
      score: evidenceHealth,
      previous_health: prevOverall,
      delta,
      improved: delta > 0,
    },
    execution: {
      records: exec.records_generated || 0,
      packages: exec.packages_discovered || 0,
      coverage_pct: execScore,
      with_artifacts: exec.with_artifacts || 0,
    },
    evidence_bundles: {
      generated: bundle.bundles_generated || 0,
      non_empty: (bundle.bundles_generated || 0) - (bundle.empty_bundles || 0),
      coverage_pct: bundleScore,
    },
    traceability: {
      links_built: data.traceLinks?.links_built || 0,
      missing: data.traceMissing?.count || 0,
      avg_completeness: traceScore,
    },
    judge_readiness: {
      packages: judge.total_packages || 0,
      ready: judge.judge_ready || 0,
      readiness_pct: judgeScore,
    },
    overall: {
      evidence_health: evidenceHealth,
      previous_health_score: prevOverall,
      delta,
      trend: delta > 0 ? "improving" : delta < 0 ? "declining" : "stable",
    },
    recommendation: evidenceHealth >= 75 ? "Evidence health sufficient for Level 3 review consideration." : `Evidence health at ${evidenceHealth}/100. Continue building execution records and evidence bundles. Target: 75+.`,
    mutation_summary: { database_writes: "none", runtime_mutations: "none", product_changes: "none" },
  };
}

function buildMarkdown(d) {
  const lines = [];
  lines.push("# Evidence Health Dashboard");
  lines.push("");
  lines.push(`generated_at: ${d.generated_at}`);
  lines.push(`evidence_health: ${d.evidence_health.score}/100`);
  lines.push(`previous_health: ${d.evidence_health.previous_health}/100`);
  lines.push(`delta: ${d.evidence_health.delta >= 0 ? "+" : ""}${d.evidence_health.delta}`);
  lines.push(`trend: ${d.overall.trend}`);
  lines.push("");
  lines.push("## Execution Records");
  lines.push(`- ${d.execution.coverage_pct}% — ${d.execution.records} records for ${d.execution.packages} packages`);
  lines.push("");
  lines.push("## Evidence Bundles");
  lines.push(`- ${d.evidence_bundles.coverage_pct}% non-empty — ${d.evidence_bundles.non_empty}/${d.evidence_bundles.generated} bundles`);
  lines.push("");
  lines.push("## Traceability");
  lines.push(`- ${d.traceability.avg_completeness}% avg completeness — ${d.traceability.links_built} links built, ${d.traceability.missing} missing`);
  lines.push("");
  lines.push("## Judge Package Readiness");
  lines.push(`- ${d.judge_readiness.readiness_pct}% — ${d.judge_readiness.ready}/${d.judge_readiness.packages} ready`);
  lines.push("");
  lines.push("## Recommendation");
  lines.push(d.recommendation);
  lines.push("");
  lines.push("## Mutation Summary");
  lines.push("- database_writes: none");
  return lines.join("\n");
}

function main() {
  const outDir = path.resolve(process.argv.slice(2).find((a) => !a.startsWith("-")) || OUT);
  ensureDir(outDir);

  const data = loadAll();
  const dashboard = buildDashboard(data);

  const jp = path.join(outDir, "evidence-health-dashboard.json");
  const mp = path.join(outDir, "evidence-health-dashboard.md");
  fs.writeFileSync(jp, JSON.stringify(dashboard, null, 2) + "\n");
  fs.writeFileSync(mp, buildMarkdown(dashboard));

  process.stdout.write(JSON.stringify({
    ok: true, runner: "ADMIN-FACTORY-EVIDENCE-HEALTH-DASHBOARD-001",
    evidence_health: dashboard.evidence_health.score,
    previous_health: dashboard.evidence_health.previous_health,
    delta: dashboard.evidence_health.delta,
    improved: dashboard.evidence_health.improved,
    dashboard_json: jp, dashboard_md: mp,
  }, null, 2) + "\n");
}
main();
