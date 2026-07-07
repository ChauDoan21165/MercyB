#!/usr/bin/env node
/**
 * ADMIN-FACTORY-LEVEL2-HEALTH-SCORE-001 — Level 2 Health Score
 *
 * Produces a deterministic health score across 8 dimensions:
 * - Safety, Automation, Evidence, Traceability, Queue, Recovery, Validation, Reporting
 *
 * Each dimension scored 0–100. Overall = weighted average.
 *
 * Safety: READ_ONLY.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_OUTPUT_DIR = path.join("/Users/admin/autorun/reports", "admin-factory-level2-health");

function exists(p) { return fs.existsSync(p); }
function ensureDir(dir) { fs.mkdirSync(dir, { recursive: true }); }
function readJson(f) { try { return JSON.parse(fs.readFileSync(f, "utf8")); } catch { return null; } }

const DIMENSIONS = {
  safety: { weight: 1.5, label: "Safety Compliance", description: "Violation count, policy adherence, AAK blocking status." },
  automation: { weight: 1.2, label: "Automation Coverage", description: "Percentage of work that is AUTO_CONTINUE vs HUMAN_GATE_REQUIRED." },
  evidence: { weight: 1.0, label: "Evidence Health", description: "Replay coverage, judge backing, source anchor validity." },
  traceability: { weight: 1.0, label: "Traceability", description: "Chain completeness, gap count, average depth." },
  queue: { weight: 0.8, label: "Queue Health", description: "Stuck jobs, retry storms, dispatchable ratio." },
  recovery: { weight: 0.8, label: "Recovery Readiness", description: "Stuck job detection coverage, recovery action confidence." },
  validation: { weight: 1.0, label: "Validation Success", description: "Test pass rate, schema validation, AAK advisory pass rate." },
  reporting: { weight: 0.7, label: "Reporting Completeness", description: "Artifact availability, report freshness, dashboard currency." },
};

function loadComponentData() {
  return {
    escalator: readJson(path.join("/Users/admin/autorun/reports", "admin-factory-exception-escalator", "exception-escalator-manifest.json")),
    stuck: readJson(path.join("/Users/admin/autorun/reports", "admin-factory-stuck-job-recovery", "stuck-job-recovery-manifest.json")),
    queue: readJson(path.join("/Users/admin/autorun/reports", "admin-factory-queue-priority", "queue-priority-manifest.json")),
    traceability: readJson(path.join("/Users/admin/autorun/reports", "aak-traceability-gap", "aak-traceability-gap-manifest.json")),
    ownership: readJson(path.join("/Users/admin/autorun/reports", "aak-ownership-registry", "aak-ownership-registry-health.json")),
    aak: readJson(path.join("/Users/admin/autorun/reports", "aak-ci-advisory", "aak-ci-advisory-report.json")),
    dashboard: readJson(path.join("/Users/admin/autorun/reports", "admin-factory-autonomy-dashboard", "autonomy-dashboard.json")),
  };
}

function scoreSafety(data) {
  let score = 100;
  const details = [];

  if (data.escalator) {
    const critical = data.escalator.summary?.by_severity?.critical || 0;
    if (critical > 5) { score -= 30; details.push(`critical_violations=${critical} (-30)`); }
    else if (critical > 0) { score -= critical * 5; details.push(`critical_violations=${critical} (-${critical * 5})`); }
  }

  if (data.aak?.blocking) { score -= 20; details.push("aak_blocking=true (-20)"); }

  if (data.stuck?.summary?.stuck_jobs > 0) {
    score -= 10;
    details.push(`stuck_jobs_present (-10)`);
  }

  return { score: Math.max(0, score), details };
}

function scoreAutomation(data) {
  let score = 50;
  const details = [];

  if (data.escalator) {
    const auto = data.escalator.summary?.auto_continue || 0;
    const total = data.escalator.summary?.total_items || 1;
    const pct = Math.round((auto / total) * 100);
    score = pct;
    details.push(`auto_continue_rate=${pct}%`);
  }

  return { score: Math.min(100, Math.max(0, score)), details };
}

function scoreEvidence(data) {
  let score = 50;
  const details = [];

  if (data.traceability) {
    const completeness = data.traceability.aggregate?.completeness_percentage || 0;
    score = completeness;
    details.push(`chain_completeness=${completeness}%`);
  }

  return { score, details };
}

function scoreTraceability(data) {
  let score = 50;
  const details = [];

  if (data.traceability) {
    const avgDepth = data.traceability.aggregate?.average_chain_depth || 0;
    const maxDepth = data.traceability.aggregate?.max_chain_depth || 5;
    score = Math.round((avgDepth / maxDepth) * 100);
    details.push(`avg_depth=${avgDepth}/${maxDepth} (${score}%)`);
  }

  return { score, details };
}

function scoreQueue(data) {
  let score = 80;
  const details = [];

  if (data.stuck) {
    const stuck = data.stuck.summary?.stuck_jobs || 0;
    if (stuck > 0) { score -= stuck * 15; details.push(`stuck_jobs=${stuck} (-${stuck * 15})`); }
  }

  if (data.queue) {
    const held = data.queue.held_count || 0;
    const total = data.queue.total_items || 1;
    if (held === total && total > 0) { score -= 20; details.push("all_items_held (-20)"); }
  }

  return { score: Math.max(0, score), details };
}

function scoreRecovery(data) {
  let score = 70;
  const details = [];

  if (data.stuck) {
    const hasDetection = (data.stuck.results || []).length > 0;
    if (hasDetection) { score += 20; details.push("detection_active (+20)"); }
    const wouldRetry = data.stuck.summary?.would_retry || 0;
    if (wouldRetry === 0 && data.stuck.summary?.stuck_jobs === 0) {
      score += 10;
      details.push("no_stuck_jobs (+10)");
    }
  }

  return { score: Math.min(100, score), details };
}

function scoreValidation(data) {
  let score = 90;
  const details = [];

  if (data.aak) {
    const fail = data.aak.summary?.advisory_fail || 0;
    if (fail > 0) { score -= fail * 10; details.push(`advisory_fail=${fail} (-${fail * 10})`); }
    const pass = data.aak.summary?.advisory_pass || 0;
    details.push(`advisory_pass=${pass}`);
  }

  if (data.ownership?.health?.health === "healthy") {
    score += 10;
    details.push("ownership_healthy (+10)");
  }

  return { score: Math.min(100, Math.max(0, score)), details };
}

function scoreReporting(data) {
  let score = 60;
  const details = [];
  const expected = ["escalator", "stuck", "queue", "traceability", "ownership", "aak", "dashboard"];
  const present = expected.filter((k) => data[k] !== null);

  score = Math.round((present.length / expected.length) * 100);
  details.push(`reports_present=${present.length}/${expected.length}`);
  if (present.length < expected.length) {
    details.push(`missing=${expected.filter((k) => !present.includes(k)).join(", ")}`);
  }

  return { score, details };
}

function computeHealthScore(data) {
  const scorers = { safety: scoreSafety, automation: scoreAutomation, evidence: scoreEvidence, traceability: scoreTraceability, queue: scoreQueue, recovery: scoreRecovery, validation: scoreValidation, reporting: scoreReporting };

  const dimensions = {};
  let weightedSum = 0;
  let totalWeight = 0;

  for (const [key, scorer] of Object.entries(scorers)) {
    const result = scorer(data);
    const dim = DIMENSIONS[key];
    dimensions[key] = { ...dim, ...result, weighted_contribution: Math.round(result.score * dim.weight * 10) / 10 };
    weightedSum += result.score * dim.weight;
    totalWeight += dim.weight;
  }

  const overall = totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0;

  let grade;
  if (overall >= 85) grade = "A";
  else if (overall >= 70) grade = "B";
  else if (overall >= 55) grade = "C";
  else if (overall >= 40) grade = "D";
  else grade = "F";

  return { dimensions, overall, grade, total_weight: totalWeight };
}

function buildReport(manifest) {
  const lines = [];
  lines.push("# Level 2 Health Score Report");
  lines.push("");
  lines.push(`runner: ${manifest.runner}`);
  lines.push(`generated_at: ${manifest.generated_at}`);
  lines.push(`overall_score: ${manifest.health.overall}/100`);
  lines.push(`grade: ${manifest.health.grade}`);
  lines.push("");
  lines.push("## Dimension Scores");
  lines.push("");
  lines.push("| Dimension | Score | Weight | Weighted |");
  lines.push("|---|---|---|---|");
  for (const [key, dim] of Object.entries(manifest.health.dimensions)) {
    lines.push(`| ${dim.label} | ${dim.score}/100 | ×${dim.weight} | ${dim.weighted_contribution} |`);
  }
  lines.push(`| **Overall** | **${manifest.health.overall}/100** | | |`);
  lines.push("");
  lines.push("## Dimension Details");
  for (const [key, dim] of Object.entries(manifest.health.dimensions)) {
    lines.push(`### ${dim.label} (${dim.score}/100)`);
    lines.push(`- ${dim.description}`);
    for (const d of dim.details) lines.push(`  - ${d}`);
    lines.push("");
  }
  lines.push("## Mutation Summary");
  lines.push("- database_writes: none");
  return lines.join("\n");
}

function main() {
  const args = process.argv.slice(2).filter((a) => a !== "--");
  const outputDir = path.resolve(args[0] || DEFAULT_OUTPUT_DIR);
  ensureDir(outputDir);

  const data = loadComponentData();
  const health = computeHealthScore(data);

  const manifest = {
    schema_version: "admin-factory-level2-health/v1",
    runner: "ADMIN-FACTORY-LEVEL2-HEALTH-SCORE-001",
    generated_at: new Date().toISOString(),
    health,
    mutation_summary: { database_writes: "none", runtime_mutations: "none", product_changes: "none" },
  };

  const jsonPath = path.join(outputDir, "level2_health.json");
  const reportPath = path.join(outputDir, "level2_health.md");
  fs.writeFileSync(jsonPath, JSON.stringify(manifest, null, 2) + "\n");
  fs.writeFileSync(reportPath, buildReport(manifest));

  process.stdout.write(JSON.stringify({
    ok: true, runner: "ADMIN-FACTORY-LEVEL2-HEALTH-SCORE-001",
    overall: health.overall, grade: health.grade,
    dimensions: Object.fromEntries(Object.entries(health.dimensions).map(([k, d]) => [k, d.score])),
    health_json: jsonPath, health_md: reportPath,
  }, null, 2) + "\n");
}

main();
