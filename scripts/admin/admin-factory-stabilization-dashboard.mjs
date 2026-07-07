#!/usr/bin/env node
/**
 * ADMIN-FACTORY-STABILIZATION-DASHBOARD-001 — Level 2 Stabilization Dashboard
 *
 * Unified dashboard aggregating all Level 2 stabilization metrics:
 * - Autonomy status
 * - Health score
 * - Prediction accuracy
 * - Human gates
 * - Queue health
 * - Recovery readiness
 * - Traceability
 *
 * Produces deterministic JSON + Markdown only. No UI.
 *
 * Safety: READ_ONLY.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_OUTPUT_DIR = path.join("/Users/admin/autorun/reports", "admin-factory-stabilization-dashboard");

function exists(p) { return fs.existsSync(p); }
function ensureDir(dir) { fs.mkdirSync(dir, { recursive: true }); }
function readJson(f) { try { return JSON.parse(fs.readFileSync(f, "utf8")); } catch { return null; } }

function loadAllData() {
  const base = "/Users/admin/autorun/reports";
  return {
    autonomy: readJson(path.join(base, "admin-factory-autonomy-dashboard", "autonomy-dashboard.json")),
    health: readJson(path.join(base, "admin-factory-level2-health", "level2_health.json")),
    replay: readJson(path.join(base, "admin-factory-level2-replay", "prediction_accuracy.json")),
    human_gates: readJson(path.join(base, "admin-factory-human-gate-analyzer", "human-gate-analysis.json")),
    traceability_closure: readJson(path.join(base, "admin-factory-traceability-closure", "traceability-closure.json")),
    queue: readJson(path.join(base, "admin-factory-queue-priority", "queue-priority-manifest.json")),
    stuck: readJson(path.join(base, "admin-factory-stuck-job-recovery", "stuck-job-recovery-manifest.json")),
  };
}

function buildDashboard(data) {
  const autonomy = data.autonomy || {};
  const health = data.health?.health || {};
  const replay = data.replay || {};
  const gates = data.human_gates?.analysis || {};
  const closure = data.traceability_closure?.closure || {};
  const queue = data.queue || {};
  const stuck = data.stuck || {};

  return {
    dashboard: "admin-factory-stabilization-dashboard/v1",
    runner: "ADMIN-FACTORY-STABILIZATION-DASHBOARD-001",
    generated_at: new Date().toISOString(),
    autonomy: {
      level: autonomy.autonomy?.level || "LEVEL_2_AUTO_EXECUTE_SAFE",
      limiters: autonomy.autonomy?.limiters || [],
      description: autonomy.autonomy?.description || "",
    },
    health: {
      overall: health.overall || 0,
      grade: health.grade || "N/A",
      dimensions: health.dimensions ? Object.fromEntries(Object.entries(health.dimensions).map(([k, d]) => [k, d.score])) : {},
    },
    prediction_accuracy: {
      accuracy_rate: replay.accuracy_rate ?? null,
      agreement: replay.agreement ?? null,
      disagreement: replay.disagreement ?? null,
      false_positive: replay.false_positive ?? null,
      false_negative: replay.false_negative ?? null,
    },
    human_gates: {
      total: gates.summary?.total_gates || 0,
      potentially_deterministic: gates.summary?.potentially_deterministic || 0,
      always_requires_human: gates.summary?.always_requires_human || 0,
      categories: (gates.categories || []).map((c) => ({ category: c.category, count: c.count, can_be_deterministic: c.can_be_deterministic })),
    },
    queue: {
      total_items: queue.total_items || 0,
      dispatchable: queue.dispatchable_count || 0,
      held: queue.held_count || 0,
      stuck_jobs: stuck.summary?.stuck_jobs || 0,
    },
    recovery: {
      would_retry: stuck.summary?.would_retry || 0,
      would_escalate: stuck.summary?.would_escalate || 0,
      would_hold: stuck.summary?.would_hold || 0,
    },
    traceability: {
      total_gaps: closure.summary?.total_gaps || 0,
      auto_fixable: closure.summary?.auto_fixable || 0,
      requires_human: closure.summary?.requires_human || 0,
    },
    recommendation: buildRecommendation(data),
    mutation_summary: { database_writes: "none", queue_mutations: "none", runtime_mutations: "none", product_changes: "none" },
  };
}

function buildRecommendation(data) {
  const health = data.health?.health || {};
  const gates = data.human_gates?.analysis?.summary || {};
  const overall = health.overall || 0;

  if (overall >= 75 && (gates.potentially_deterministic || 0) > (gates.always_requires_human || 0)) {
    return {
      recommendation: "READY_FOR_LEVEL3_REVIEW",
      confidence: overall >= 85 ? "high" : "medium",
      rationale: `Health score ${overall}/100 with majority of human gates potentially deterministic. Level 2 is stable. Consider Level 3 review.`,
      prerequisites: [
        "Close auto-fixable traceability gaps",
        "Codify remaining deterministic human gate policies",
        "Achieve 80+ health score",
        "Run 3 consecutive clean simulation passes",
      ],
    };
  }

  return {
    recommendation: "REMAIN_LEVEL2",
    confidence: "high",
    rationale: `Health score ${overall}/100. Continue hardening Level 2 before increasing autonomy.`,
    prerequisites: [
      "Improve health score to 75+",
      "Reduce human gates by codifying deterministic policies",
      "Close auto-fixable traceability gaps",
      "Verify prediction accuracy > 90%",
    ],
  };
}

function buildMarkdown(d) {
  const lines = [];
  lines.push("# Admin Factory Stabilization Dashboard");
  lines.push("");
  lines.push(`generated_at: ${d.generated_at}`);
  lines.push(`autonomy: ${d.autonomy.level}`);
  lines.push(`health: ${d.health.overall}/100 (${d.health.grade})`);
  lines.push(`recommendation: ${d.recommendation.recommendation}`);
  lines.push("");
  lines.push("## Autonomy");
  lines.push(`- level: ${d.autonomy.level}`);
  lines.push(`- limiters: ${d.autonomy.limiters.join(", ") || "none"}`);
  lines.push("");
  lines.push("## Health Score");
  lines.push(`- overall: ${d.health.overall}/100 (Grade ${d.health.grade})`);
  for (const [key, score] of Object.entries(d.health.dimensions)) {
    lines.push(`- ${key}: ${score}/100`);
  }
  lines.push("");
  lines.push("## Prediction Accuracy");
  const pa = d.prediction_accuracy;
  lines.push(`- accuracy_rate: ${pa.accuracy_rate ?? "N/A"}%`);
  lines.push(`- agreement: ${pa.agreement ?? "N/A"}`);
  lines.push(`- disagreement: ${pa.disagreement ?? "N/A"}`);
  lines.push("");
  lines.push("## Human Gates");
  const hg = d.human_gates;
  lines.push(`- total: ${hg.total}`);
  lines.push(`- potentially_deterministic: ${hg.potentially_deterministic}`);
  lines.push(`- always_requires_human: ${hg.always_requires_human}`);
  for (const cat of hg.categories) {
    lines.push(`  - ${cat.category}: ${cat.count} (deterministic=${cat.can_be_deterministic})`);
  }
  lines.push("");
  lines.push("## Queue");
  lines.push(`- total: ${d.queue.total_items}`);
  lines.push(`- dispatchable: ${d.queue.dispatchable}`);
  lines.push(`- held: ${d.queue.held}`);
  lines.push(`- stuck: ${d.queue.stuck_jobs}`);
  lines.push("");
  lines.push("## Recovery");
  lines.push(`- would_retry: ${d.recovery.would_retry}`);
  lines.push(`- would_escalate: ${d.recovery.would_escalate}`);
  lines.push("");
  lines.push("## Traceability");
  lines.push(`- total_gaps: ${d.traceability.total_gaps}`);
  lines.push(`- auto_fixable: ${d.traceability.auto_fixable}`);
  lines.push(`- requires_human: ${d.traceability.requires_human}`);
  lines.push("");
  lines.push("## Recommendation");
  lines.push(`- **${d.recommendation.recommendation}** (confidence: ${d.recommendation.confidence})`);
  lines.push(`- rationale: ${d.recommendation.rationale}`);
  lines.push("- prerequisites:");
  for (const p of d.recommendation.prerequisites) lines.push(`  - ${p}`);
  lines.push("");
  lines.push("## Mutation Summary");
  lines.push("- database_writes: none");
  lines.push("- queue_mutations: none");
  return lines.join("\n");
}

function main() {
  const args = process.argv.slice(2).filter((a) => a !== "--");
  const outputDir = path.resolve(args[0] || DEFAULT_OUTPUT_DIR);
  ensureDir(outputDir);

  const data = loadAllData();
  const dashboard = buildDashboard(data);

  const jsonPath = path.join(outputDir, "stabilization-dashboard.json");
  const mdPath = path.join(outputDir, "stabilization-dashboard.md");
  fs.writeFileSync(jsonPath, JSON.stringify(dashboard, null, 2) + "\n");
  fs.writeFileSync(mdPath, buildMarkdown(dashboard));

  process.stdout.write(JSON.stringify({
    ok: true, runner: "ADMIN-FACTORY-STABILIZATION-DASHBOARD-001",
    health_score: dashboard.health.overall,
    health_grade: dashboard.health.grade,
    recommendation: dashboard.recommendation.recommendation,
    dashboard_json: jsonPath,
    dashboard_md: mdPath,
  }, null, 2) + "\n");
}

main();
