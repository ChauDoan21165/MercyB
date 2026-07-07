#!/usr/bin/env node
/**
 * ADMIN-FACTORY-LEVEL2-QUALITY-METRICS-001 — Level 2 Quality Metrics
 *
 * Generates deterministic quality metrics across:
 * - Prediction accuracy
 * - Retry success potential
 * - Escalation accuracy
 * - Queue efficiency
 * - Artifact completeness
 * - Validation success
 * - Report completeness
 *
 * Safety: READ_ONLY.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_OUTPUT_DIR = path.join("/Users/admin/autorun/reports", "admin-factory-level2-quality");

function exists(p) { return fs.existsSync(p); }
function ensureDir(dir) { fs.mkdirSync(dir, { recursive: true }); }
function readJson(f) { try { return JSON.parse(fs.readFileSync(f, "utf8")); } catch { return null; } }

function loadAllData() {
  const base = "/Users/admin/autorun/reports";
  return {
    replay: readJson(path.join(base, "admin-factory-level2-replay", "prediction_accuracy.json")),
    stuck: readJson(path.join(base, "admin-factory-stuck-job-recovery", "stuck-job-recovery-manifest.json")),
    escalator: readJson(path.join(base, "admin-factory-exception-escalator", "exception-escalator-manifest.json")),
    queue: readJson(path.join(base, "admin-factory-queue-priority", "queue-priority-manifest.json")),
    traceability: readJson(path.join(base, "aak-traceability-gap", "aak-traceability-gap-manifest.json")),
    aak: readJson(path.join(base, "aak-ci-advisory", "aak-ci-advisory-report.json")),
    health: readJson(path.join(base, "admin-factory-level2-health", "level2_health.json")),
    artifact_consumer: readJson(path.join(base, "aak-ci-artifact-consumer", "aak-ci-artifact-inventory-v2.json")),
  };
}

function computeMetrics(data) {
  const metrics = {};

  // 1. Prediction accuracy
  metrics.prediction_accuracy = {
    score: data.replay?.accuracy_rate ?? null,
    agreement: data.replay?.agreement ?? null,
    disagreement: data.replay?.disagreement ?? null,
    status: data.replay ? "measured" : "unavailable",
  };

  // 2. Retry success potential
  const totalRunning = data.stuck?.job_count || 0;
  const stuckCount = data.stuck?.summary?.stuck_jobs || 0;
  metrics.retry_success = {
    stuck_ratio: totalRunning > 0 ? Math.round((1 - stuckCount / totalRunning) * 100) : 100,
    stuck_jobs: stuckCount,
    total_running: totalRunning,
    status: data.stuck ? "measured" : "unavailable",
  };

  // 3. Escalation accuracy
  const totalItems = data.escalator?.summary?.total_items || 0;
  const escalated = data.escalator?.summary?.human_gate_required || 0;
  metrics.escalation_accuracy = {
    escalation_rate: totalItems > 0 ? Math.round((escalated / totalItems) * 100) : 0,
    auto_continue_rate: totalItems > 0 ? Math.round(((totalItems - escalated) / totalItems) * 100) : 0,
    status: data.escalator ? "measured" : "unavailable",
  };

  // 4. Queue efficiency
  const queueTotal = data.queue?.total_items || 0;
  const dispatchable = data.queue?.dispatchable_count || 0;
  metrics.queue_efficiency = {
    dispatchable_rate: queueTotal > 0 ? Math.round((dispatchable / queueTotal) * 100) : 0,
    held_count: data.queue?.held_count || 0,
    status: data.queue ? "measured" : "unavailable",
  };

  // 5. Artifact completeness
  const artifactTotal = data.artifact_consumer?.availability?.total_discovered || 0;
  const artifactPresent = data.artifact_consumer?.availability?.present_count || 0;
  metrics.artifact_completeness = {
    completeness_pct: artifactTotal > 0 ? Math.round((artifactPresent / artifactTotal) * 100) : 0,
    present: artifactPresent,
    total: artifactTotal,
    status: data.artifact_consumer ? "measured" : "unavailable",
  };

  // 6. Validation success
  const aakChecks = data.aak?.summary?.checks_run || 0;
  const aakPass = data.aak?.summary?.advisory_pass || 0;
  metrics.validation_success = {
    pass_rate: aakChecks > 0 ? Math.round((aakPass / aakChecks) * 100) : 100,
    checks_run: aakChecks,
    checks_passed: aakPass,
    status: data.aak ? "measured" : "unavailable",
  };

  // 7. Report completeness
  const dataSources = ["replay", "stuck", "escalator", "queue", "traceability", "aak", "health", "artifact_consumer"];
  const presentSources = dataSources.filter((k) => data[k] !== null);
  metrics.report_completeness = {
    completeness_pct: Math.round((presentSources.length / dataSources.length) * 100),
    present: presentSources.length,
    total: dataSources.length,
    missing: dataSources.filter((k) => !presentSources.includes(k)),
    status: "measured",
  };

  return metrics;
}

function buildReport(manifest) {
  const lines = [];
  lines.push("# Level 2 Quality Metrics Report");
  lines.push("");
  lines.push(`runner: ${manifest.runner}`);
  lines.push(`generated_at: ${manifest.generated_at}`);
  lines.push("");
  lines.push("## Metrics");
  for (const [key, m] of Object.entries(manifest.metrics)) {
    lines.push(`### ${key}`);
    lines.push(`- status: ${m.status}`);
    for (const [k, v] of Object.entries(m)) {
      if (k !== "status") lines.push(`- ${k}: ${v}`);
    }
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

  const data = loadAllData();
  const metrics = computeMetrics(data);

  const manifest = {
    schema_version: "admin-factory-level2-quality/v1",
    runner: "ADMIN-FACTORY-LEVEL2-QUALITY-METRICS-001",
    generated_at: new Date().toISOString(),
    metrics,
    mutation_summary: { database_writes: "none", runtime_mutations: "none", product_changes: "none" },
  };

  const jsonPath = path.join(outputDir, "level2_quality_metrics.json");
  const reportPath = path.join(outputDir, "level2_quality_report.md");
  fs.writeFileSync(jsonPath, JSON.stringify(manifest, null, 2) + "\n");
  fs.writeFileSync(reportPath, buildReport(manifest));

  process.stdout.write(JSON.stringify({
    ok: true, runner: "ADMIN-FACTORY-LEVEL2-QUALITY-METRICS-001",
    metrics: Object.fromEntries(Object.entries(metrics).map(([k, m]) => [k, m.status === "measured" ? (m.score ?? m.completeness_pct ?? m.pass_rate ?? "measured") : "unavailable"])),
    metrics_json: jsonPath, metrics_md: reportPath,
  }, null, 2) + "\n");
}

main();
