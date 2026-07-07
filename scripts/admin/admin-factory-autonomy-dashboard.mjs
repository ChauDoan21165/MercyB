#!/usr/bin/env node
/**
 * ADMIN-FACTORY-AUTONOMY-DASHBOARD-001 — Autonomy Dashboard
 *
 * Aggregates data from all Admin Factory components into a single
 * deterministic autonomy status dashboard (JSON + Markdown).
 *
 * Dashboard sections:
 * - Autonomy Level & Status
 * - Queue Health (total, running, done, retries, stuck, held)
 * - Workers (active, idle, missing)
 * - Simulation Actions (would retry, escalate, hold, dispatch)
 * - Human Gates (open, resolved, by category)
 * - Traceability Health (chain completeness, gaps)
 * - Ownership Coverage (rules, defaults, conflicts)
 * - Safety Policy (violations, compliance)
 *
 * No browser/UI required. Produces deterministic JSON/MD only.
 *
 * Safety: READ_ONLY. Aggregates reports without mutating anything.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "../..");

const DEFAULT_OUTPUT_DIR = path.join("/Users/admin/autorun/reports", "admin-factory-autonomy-dashboard");

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function exists(p) { return fs.existsSync(p); }
function ensureDir(dir) { fs.mkdirSync(dir, { recursive: true }); }

function readJson(filePath) {
  try { return JSON.parse(fs.readFileSync(filePath, "utf8")); }
  catch { return null; }
}

// ---------------------------------------------------------------------------
// Data collectors — each reads from a known artifact path
// ---------------------------------------------------------------------------

function collectStuckJobData() {
  const p = path.join("/Users/admin/autorun/reports", "admin-factory-stuck-job-recovery", "stuck-job-recovery-manifest.json");
  if (!exists(p)) return null;
  const d = readJson(p);
  if (!d) return null;
  return {
    source: p,
    total_jobs: d.job_count || d.summary?.total_jobs || 0,
    running_jobs: d.summary?.running_jobs || 0,
    stuck_jobs: d.summary?.stuck_jobs || 0,
    healthy_jobs: d.summary?.healthy_jobs || 0,
    would_retry: d.summary?.would_retry || 0,
    would_escalate: d.summary?.would_escalate || 0,
    would_hold: d.summary?.would_hold || 0,
    mode: d.mode || "SIMULATION",
    stuck_details: (d.results || []).filter((r) => r.stuck).map((r) => ({
      job_id: r.job_id, severity: r.severity, action: r.recovery?.action,
    })),
  };
}

function collectEscalatorData() {
  const p = path.join("/Users/admin/autorun/reports", "admin-factory-exception-escalator", "exception-escalator-manifest.json");
  if (!exists(p)) return null;
  const d = readJson(p);
  if (!d) return null;
  return {
    source: p,
    total_items: d.summary?.total_items || 0,
    auto_continue: d.summary?.auto_continue || 0,
    human_gate_required: d.summary?.human_gate_required || 0,
    by_severity: d.summary?.by_severity || {},
    by_category: d.summary?.by_category || {},
    escalated_items: (d.results || []).filter((r) => r.classification === "HUMAN_GATE_REQUIRED").map((r) => ({
      item_id: r.item_id, severity: r.severity, matched_categories: r.matched_rules?.map((m) => m.category) || [],
    })),
  };
}

function collectQueuePriorityData() {
  const p = path.join("/Users/admin/autorun/reports", "admin-factory-queue-priority", "queue-priority-manifest.json");
  if (!exists(p)) return null;
  const d = readJson(p);
  if (!d) return null;
  return {
    source: p,
    total_items: d.total_items || 0,
    dispatchable: d.dispatchable_count || 0,
    held: d.held_count || 0,
    top_dispatchable: (d.ranked_items || []).filter((r) => r.dispatchable).slice(0, 5).map((r) => ({
      rank: r.rank, item_id: r.item_id, score: r.total_score, primary_factor: r.primary_factor,
    })),
    held_items: (d.ranked_items || []).filter((r) => !r.dispatchable).slice(0, 5).map((r) => ({
      rank: r.rank, item_id: r.item_id, score: r.total_score,
    })),
  };
}

function collectTraceabilityData() {
  const p = path.join("/Users/admin/autorun/reports", "aak-traceability-gap", "aak-traceability-gap-manifest.json");
  if (!exists(p)) return null;
  const d = readJson(p);
  if (!d) return null;
  const agg = d.aggregate || {};
  return {
    source: p,
    total_packages: agg.total_packages || 0,
    complete_chains: agg.complete_chains || 0,
    incomplete_chains: agg.incomplete_chains || 0,
    completeness_pct: agg.completeness_percentage || 0,
    avg_chain_depth: agg.average_chain_depth || 0,
    max_chain_depth: agg.max_chain_depth || 5,
    severity_distribution: agg.severity_distribution || {},
    top_gaps: (agg.most_common_first_break || []).slice(0, 5),
  };
}

function collectOwnershipData() {
  const p = path.join("/Users/admin/autorun/reports", "aak-ownership-registry", "aak-ownership-registry-health.json");
  if (!exists(p)) return null;
  const d = readJson(p);
  if (!d) return null;
  return {
    source: p,
    rule_count: d.validation?.rule_count || 0,
    conflict_count: d.validation?.conflict_count || 0,
    health: d.health?.health || "unknown",
    issue_count: d.health?.issue_count || 0,
    default_owner: d.validation?.default_owner_team || "unknown",
  };
}

function collectAAKAdvisoryData() {
  const p = path.join("/Users/admin/autorun/reports", "aak-ci-advisory", "aak-ci-advisory-report.json");
  if (!exists(p)) return null;
  const d = readJson(p);
  if (!d) return null;
  return {
    source: p,
    mode: d.mode || "unknown",
    blocking: d.blocking || false,
    checks_run: d.summary?.checks_run || 0,
    advisory_pass: d.summary?.advisory_pass || 0,
    advisory_fail: d.summary?.advisory_fail || 0,
  };
}

// ---------------------------------------------------------------------------
// Dashboard assembly
// ---------------------------------------------------------------------------

function buildDashboard() {
  const stuck = collectStuckJobData();
  const escalator = collectEscalatorData();
  const queue = collectQueuePriorityData();
  const traceability = collectTraceabilityData();
  const ownership = collectOwnershipData();
  const aak = collectAAKAdvisoryData();

  // Determine autonomy level
  const hasStuckJobs = stuck && stuck.stuck_jobs > 0;
  const hasOpenGates = escalator && escalator.human_gate_required > 0;
  const hasHeldItems = queue && queue.held > 0;
  const hasTraceabilityGaps = traceability && traceability.incomplete_chains > 0;

  let autonomyLevel = "LEVEL_2_AUTO_EXECUTE_SAFE";
  const limiters = [];
  if (hasStuckJobs) limiters.push("stuck_jobs");
  if (hasOpenGates) limiters.push("human_gates_open");
  if (hasHeldItems) limiters.push("held_items");
  if (hasTraceabilityGaps) limiters.push("traceability_gaps");
  if (limiters.length >= 3) autonomyLevel = "LEVEL_1_ADVISORY_ONLY";

  // Worker summary
  const workerSummary = {
    simulated_workers: 3,
    active: stuck ? stuck.running_jobs - stuck.stuck_jobs : 0,
    idle: 0,
    missing: stuck ? stuck.stuck_jobs : 0,
    note: "Worker count is simulated — actual workers are Claude Code instances",
  };

  // Queue summary
  const queueSummary = {
    total_items: (queue?.total_items || 0) + (escalator?.total_items || 0),
    ready: queue?.dispatchable || 0,
    running: stuck?.running_jobs || 0,
    done: 0,
    retries: stuck?.would_retry || 0,
    stuck: stuck?.stuck_jobs || 0,
    held: queue?.held || 0,
  };

  // Simulation actions
  const simulationActions = {
    would_retry: stuck?.would_retry || 0,
    would_escalate: stuck?.would_escalate || 0,
    would_hold: stuck?.would_hold || 0,
    would_dispatch: queue?.dispatchable || 0,
    would_ignore: stuck?.healthy_jobs || 0,
    mode: "SIMULATION",
    live_actions_taken: 0,
  };

  // Human gates
  const humanGates = {
    open: escalator?.human_gate_required || 0,
    resolved: 0,
    by_category: escalator?.by_category || {},
    critical: escalator?.by_severity?.critical || 0,
    high: escalator?.by_severity?.high || 0,
    items: escalator?.escalated_items?.slice(0, 10) || [],
  };

  // Safety compliance
  const safetyCompliance = {
    violations: humanGates.critical || 0,
    compliant: (escalator?.total_items || 0) - (humanGates.critical || 0),
    policy: "LEVEL_2_AUTO_EXECUTE_SAFE",
    aak_blocking: aak?.blocking || false,
    aak_mode: aak?.mode || "unknown",
  };

  return {
    dashboard_version: "admin-factory-autonomy-dashboard/v1",
    runner: "ADMIN-FACTORY-AUTONOMY-DASHBOARD-001",
    generated_at: new Date().toISOString(),
    autonomy: {
      level: autonomyLevel,
      limiters,
      description: autonomyLevel === "LEVEL_2_AUTO_EXECUTE_SAFE"
        ? "Safe autonomous execution with human gates for critical actions."
        : "Advisory only — multiple limiters require human attention.",
    },
    workers: workerSummary,
    queue: queueSummary,
    simulation_actions: simulationActions,
    human_gates: humanGates,
    traceability: traceability || { status: "unavailable" },
    ownership: ownership || { status: "unavailable" },
    aak_advisory: aak || { status: "unavailable" },
    safety_compliance: safetyCompliance,
    data_sources: {
      stuck_jobs: stuck?.source || "unavailable",
      escalator: escalator?.source || "unavailable",
      queue_priority: queue?.source || "unavailable",
      traceability: traceability?.source || "unavailable",
      ownership: ownership?.source || "unavailable",
      aak_advisory: aak?.source || "unavailable",
    },
  };
}

// ---------------------------------------------------------------------------
// Markdown report
// ---------------------------------------------------------------------------

function buildMarkdown(dashboard) {
  const lines = [];
  lines.push("# Admin Factory Autonomy Dashboard");
  lines.push("");
  lines.push(`generated_at: ${dashboard.generated_at}`);
  lines.push(`autonomy_level: ${dashboard.autonomy.level}`);
  lines.push("");
  lines.push("## Autonomy Status");
  lines.push(`- **Level:** ${dashboard.autonomy.level}`);
  lines.push(`- **Description:** ${dashboard.autonomy.description}`);
  lines.push(`- **Limiters:** ${dashboard.autonomy.limiters.join(", ") || "none"}`);
  lines.push("");
  lines.push("## Workers");
  const w = dashboard.workers;
  lines.push(`- total_simulated: ${w.simulated_workers}`);
  lines.push(`- active: ${w.active}`);
  lines.push(`- missing: ${w.missing}`);
  lines.push(`- note: ${w.note}`);
  lines.push("");
  lines.push("## Queue");
  const q = dashboard.queue;
  lines.push(`- total_items: ${q.total_items}`);
  lines.push(`- ready: ${q.ready}`);
  lines.push(`- running: ${q.running}`);
  lines.push(`- stuck: ${q.stuck}`);
  lines.push(`- held: ${q.held}`);
  lines.push(`- retries_needed: ${q.retries}`);
  lines.push("");
  lines.push("## Simulation Actions");
  const sa = dashboard.simulation_actions;
  lines.push(`- would_retry: ${sa.would_retry}`);
  lines.push(`- would_escalate: ${sa.would_escalate}`);
  lines.push(`- would_hold: ${sa.would_hold}`);
  lines.push(`- would_dispatch: ${sa.would_dispatch}`);
  lines.push(`- mode: ${sa.mode}`);
  lines.push("");
  lines.push("## Human Gates");
  const hg = dashboard.human_gates;
  lines.push(`- open: ${hg.open}`);
  lines.push(`- critical: ${hg.critical}`);
  lines.push(`- high: ${hg.high}`);
  if (hg.items.length > 0) {
    lines.push("");
    for (const item of hg.items.slice(0, 10)) {
      lines.push(`- [${item.severity}] ${item.item_id}: ${(item.matched_categories || []).join(", ")}`);
    }
  }
  lines.push("");
  if (dashboard.traceability && dashboard.traceability !== "unavailable") {
    lines.push("## Traceability Health");
    const t = dashboard.traceability;
    lines.push(`- completeness: ${t.completeness_pct}%`);
    lines.push(`- complete_chains: ${t.complete_chains}/${t.total_packages}`);
    lines.push(`- avg_chain_depth: ${t.avg_chain_depth}/${t.max_chain_depth}`);
    lines.push("");
  }
  if (dashboard.ownership && dashboard.ownership !== "unavailable") {
    lines.push("## Ownership Coverage");
    const o = dashboard.ownership;
    lines.push(`- rules: ${o.rule_count}`);
    lines.push(`- conflicts: ${o.conflict_count}`);
    lines.push(`- health: ${o.health}`);
    lines.push("");
  }
  lines.push("## Safety Compliance");
  lines.push(`- violations: ${dashboard.safety_compliance.violations}`);
  lines.push(`- policy: ${dashboard.safety_compliance.policy}`);
  lines.push(`- aak_blocking: ${dashboard.safety_compliance.aak_blocking}`);
  lines.push("");
  lines.push("## Mutation Summary");
  lines.push("- database_writes: none");
  lines.push("- queue_mutations: none");
  lines.push("- worker_restarts: none");
  lines.push("- runtime_mutations: none");
  lines.push("- product_changes: none");
  return lines.join("\n");
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function parseArgs(argv) {
  const args = { outputDir: DEFAULT_OUTPUT_DIR, help: false };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--output-dir" || arg === "-o") args.outputDir = path.resolve(argv[++i]);
    else if (arg === "--help" || arg === "-h") args.help = true;
  }
  return args;
}

function main() {
  const options = parseArgs(process.argv.slice(2).filter((a) => a !== "--"));

  if (options.help) {
    process.stdout.write(
      [
        "usage: node scripts/admin/admin-factory-autonomy-dashboard.mjs [--output-dir dir]",
        "",
        "Aggregates all Admin Factory component data into an autonomy dashboard.",
        "Produces deterministic JSON and Markdown reports.",
        "No browser/UI required.",
      ].join("\n") + "\n",
    );
    return;
  }

  ensureDir(options.outputDir);

  const dashboard = buildDashboard();

  const jsonPath = path.join(options.outputDir, "autonomy-dashboard.json");
  const mdPath = path.join(options.outputDir, "autonomy-dashboard.md");

  fs.writeFileSync(jsonPath, JSON.stringify(dashboard, null, 2) + "\n");
  fs.writeFileSync(mdPath, buildMarkdown(dashboard));

  process.stdout.write(JSON.stringify({
    ok: true,
    runner: "ADMIN-FACTORY-AUTONOMY-DASHBOARD-001",
    autonomy_level: dashboard.autonomy.level,
    limiters: dashboard.autonomy.limiters,
    queue_total: dashboard.queue.total_items,
    human_gates_open: dashboard.human_gates.open,
    dashboard_json: jsonPath,
    dashboard_md: mdPath,
  }, null, 2) + "\n");
}

main();
