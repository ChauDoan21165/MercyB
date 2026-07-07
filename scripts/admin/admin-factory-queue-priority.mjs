#!/usr/bin/env node
/**
 * ADMIN-FACTORY-QUEUE-PRIORITY-ENGINE-001 — Queue Priority Engine
 *
 * Ranks READY work items automatically using a multi-factor scoring model
 * that incorporates:
 * - Backlog metadata (priority, age, dependencies)
 * - Evidence health (from AAK validation reports)
 * - Retry history (consecutive failures penalize)
 * - Traceability gaps (missing chain links increase priority)
 * - Ownership clarity (unowned items rank higher)
 * - Safety policy compliance (unsafe items are held, not dispatched)
 *
 * Each ranked item includes a comparison explanation showing WHY it outranks
 * the item below it.
 *
 * SIMULATION MODE by default. Never dispatches jobs.
 *
 * Safety: READ_ONLY. Reports rankings without mutating any queue.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "../..");

const DEFAULT_OUTPUT_DIR = path.join("/Users/admin/autorun/reports", "admin-factory-queue-priority");

// ---------------------------------------------------------------------------
// Scoring factors
// ---------------------------------------------------------------------------

const FACTOR_WEIGHTS = {
  base_priority: { weight: 1.0, label: "Base Priority", description: "User-assigned priority (lower = more urgent, inverted)" },
  evidence_gap: { weight: 3.0, label: "Evidence Gap", description: "Missing evidence increases priority" },
  retry_penalty: { weight: 2.0, label: "Retry History", description: "Each retry failure adds urgency" },
  traceability_gap: { weight: 2.5, label: "Traceability Gap", description: "Missing chain links need attention" },
  ownership_clarity: { weight: 1.5, label: "Ownership Clarity", description: "Unclear ownership = higher priority" },
  age_hours: { weight: 0.5, label: "Age", description: "Older items gain priority slowly" },
  safety_hold: { weight: -100, label: "Safety Hold", description: "Unsafe items are deprioritized to bottom" },
};

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
// Scoring engine
// ---------------------------------------------------------------------------

function scoreItem(item, index) {
  const scores = {};
  const sources = {};

  // Base priority (invert: lower number = higher priority → 1000 - priority)
  const basePriority = typeof item.priority === "number" ? item.priority : 100;
  scores.base_priority = Math.max(0, 1000 - basePriority) * FACTOR_WEIGHTS.base_priority.weight;
  sources.base_priority = `priority=${basePriority}`;

  // Evidence gap
  const evidenceGap = item.evidence_gap || item.missing_evidence || 0;
  scores.evidence_gap = evidenceGap * FACTOR_WEIGHTS.evidence_gap.weight;
  sources.evidence_gap = `evidence_gap=${evidenceGap}`;

  // Retry history
  const retries = item.attempt_count || item.retry_count || item.consecutive_failures || 0;
  scores.retry_penalty = retries * FACTOR_WEIGHTS.retry_penalty.weight;
  sources.retry_penalty = `retries=${retries}`;

  // Traceability gap
  const chainDepth = typeof item.chain_depth === "number" ? item.chain_depth : 5;
  const chainTotal = typeof item.chain_total === "number" ? item.chain_total : 5;
  const missingLinks = Math.max(0, chainTotal - chainDepth);
  scores.traceability_gap = missingLinks * FACTOR_WEIGHTS.traceability_gap.weight;
  sources.traceability_gap = `missing_links=${missingLinks} (depth=${chainDepth}/${chainTotal})`;

  // Ownership clarity (unowned or default-owned = higher priority)
  const isDefaultOwned = item.is_default || item.matched_rule === null || !item.owner_team;
  scores.ownership_clarity = isDefaultOwned ? FACTOR_WEIGHTS.ownership_clarity.weight * 5 : 0;
  sources.ownership_clarity = `owned=${!isDefaultOwned}`;

  // Age (hours since creation)
  const createdAt = item.created_at || item.generated_at || null;
  const ageHours = createdAt ? Math.max(0, (Date.now() - new Date(createdAt).getTime()) / (1000 * 3600)) : 0;
  scores.age_hours = Math.min(ageHours * FACTOR_WEIGHTS.age_hours.weight, 50);
  sources.age_hours = `age=${ageHours.toFixed(1)}h`;

  // Safety hold (unsafe items get massive penalty)
  const isUnsafe = item.safety_violation || item.classification === "HUMAN_GATE_REQUIRED" || false;
  scores.safety_hold = isUnsafe ? FACTOR_WEIGHTS.safety_hold.weight : 0;
  sources.safety_hold = `unsafe=${isUnsafe}`;

  // Total score
  const totalScore = Math.round(
    Object.values(scores).reduce((sum, s) => sum + s, 0)
  );

  // Factor breakdown sorted by contribution
  const breakdown = Object.entries(scores)
    .map(([factor, contribution]) => ({
      factor,
      label: FACTOR_WEIGHTS[factor]?.label || factor,
      weight: FACTOR_WEIGHTS[factor]?.weight || 1,
      contribution: Math.round(contribution * 10) / 10,
      source: sources[factor] || "",
    }))
    .sort((a, b) => b.contribution - a.contribution);

  return {
    item_id: item.job_id || item.entity_id || item.id || `ITEM-${index}`,
    title: String(item.title || item.mission_slug || "").slice(0, 100),
    total_score: totalScore,
    is_safe: !isUnsafe,
    dispatchable: !isUnsafe && totalScore > 0,
    breakdown,
    primary_factor: breakdown[0]?.label || "none",
    secondary_factor: breakdown[1]?.label || "none",
    source: item._source || item.source_file || "unknown",
  };
}

// ---------------------------------------------------------------------------
// Ranking with comparison explanations
// ---------------------------------------------------------------------------

function rankItems(scored) {
  const ranked = scored
    .sort((a, b) => b.total_score - a.total_score || a.item_id.localeCompare(b.item_id))
    .map((item, index) => {
      const comparison = index < scored.length - 1
        ? explainComparison(item, scored.filter((s) => s !== item).sort((a, b) => b.total_score - a.total_score)[0])
        : null;
      return { rank: index + 1, ...item, comparison };
    });

  return ranked;
}

function explainComparison(higher, lower) {
  if (!lower) return "Top-ranked item — no comparison.";

  const reasons = [];
  const diff = higher.total_score - lower.total_score;

  if (diff <= 0) return "Scores equal — tie-broken by item_id.";

  // Find which factors contributed most to the difference
  const factorDiffs = [];
  for (const hf of higher.breakdown) {
    const lf = lower.breakdown.find((f) => f.factor === hf.factor);
    const lContribution = lf ? lf.contribution : 0;
    const factorDiff = hf.contribution - lContribution;
    if (Math.abs(factorDiff) > 0.1) {
      factorDiffs.push({ factor: hf.label, diff: Math.round(factorDiff * 10) / 10 });
    }
  }

  factorDiffs.sort((a, b) => Math.abs(b.diff) - Math.abs(a.diff));
  const primaryDiff = factorDiffs[0];

  if (primaryDiff) {
    reasons.push(`"${higher.title}" outranks "${lower.title}" primarily due to ${primaryDiff.factor} (Δ${primaryDiff.diff > 0 ? "+" : ""}${primaryDiff.diff} pts)`);
  }

  if (factorDiffs.length > 1) {
    reasons.push(`Secondary factors: ${factorDiffs.slice(1, 3).map((f) => `${f.factor} (Δ${f.diff > 0 ? "+" : ""}${f.diff})`).join(", ")}`);
  }

  reasons.push(`Total score difference: ${diff} pts`);

  return {
    outranks: lower.item_id,
    outranks_title: lower.title,
    score_difference: diff,
    reasons: reasons.join(". "),
    factor_differences: factorDiffs,
  };
}

// ---------------------------------------------------------------------------
// Input discovery
// ---------------------------------------------------------------------------

function discoverItems() {
  const items = [];

  // From stuck-job recovery
  const stuckPath = path.join("/Users/admin/autorun/reports", "admin-factory-stuck-job-recovery", "stuck-job-recovery-manifest.json");
  if (exists(stuckPath)) {
    const data = readJson(stuckPath);
    if (data?.results) {
      for (const r of data.results) {
        items.push({
          job_id: r.job_id,
          title: r.title,
          priority: r.metrics?.priority || 100,
          attempt_count: r.metrics?.attempt_count || 0,
          chain_depth: 0, chain_total: 5,
        });
      }
    }
  }

  // From exception escalator
  const escPath = path.join("/Users/admin/autorun/reports", "admin-factory-exception-escalator", "exception-escalator-manifest.json");
  if (exists(escPath)) {
    const data = readJson(escPath);
    if (data?.results) {
      for (const r of data.results) {
        items.push({
          entity_id: r.item_id,
          title: r.title,
          classification: r.classification,
          safety_violation: r.classification === "HUMAN_GATE_REQUIRED",
        });
      }
    }
  }

  // From seed manifest
  const seedPath = path.join("/Users/admin/autorun/reports/automation-backlog/factory-seed/seed-manifest.json");
  if (exists(seedPath)) {
    const data = readJson(seedPath);
    if (data?.jobs) items.push(...data.jobs);
  }

  // From traceability gaps
  const tracePath = path.join("/Users/admin/autorun/reports", "aak-traceability-gap", "aak-traceability-gap-manifest.json");
  if (exists(tracePath)) {
    const data = readJson(tracePath);
    if (data?.package_gaps) {
      for (const g of data.package_gaps) {
        items.push({
          entity_id: g.package_id,
          title: `Gap: ${g.package_id}`,
          chain_depth: g.chain_depth || 0,
          chain_total: g.chain_total || 5,
          missing_evidence: g.missing_count || 0,
        });
      }
    }
  }

  return items;
}

// ---------------------------------------------------------------------------
// Simulation report
// ---------------------------------------------------------------------------

function buildSimulationReport(ranked) {
  const dispatchable = ranked.filter((r) => r.dispatchable);
  const held = ranked.filter((r) => !r.dispatchable);

  return {
    simulation_mode: true,
    live_mode: false,
    would_dispatch: dispatchable.slice(0, 5).map((r) => ({
      rank: r.rank,
      item_id: r.item_id,
      score: r.total_score,
      reason: `Top-ranked dispatchable item. ${r.primary_factor} is primary driver.`,
    })),
    would_hold: held.map((r) => ({
      rank: r.rank,
      item_id: r.item_id,
      score: r.total_score,
      reason: r.is_safe ? "Zero or negative score" : "Safety hold — HUMAN_GATE_REQUIRED",
    })),
    would_retry: 0,
    would_escalate: held.length,
    would_ignore: 0,
    queue_mutations: "none (simulation mode)",
  };
}

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------

function buildReport(manifest) {
  const lines = [];
  lines.push("# Admin Factory Queue Priority Report");
  lines.push("");
  lines.push(`runner: ${manifest.runner}`);
  lines.push(`mode: ${manifest.mode}`);
  lines.push(`generated_at: ${manifest.generated_at}`);
  lines.push(`total_items: ${manifest.total_items}`);
  lines.push(`dispatchable: ${manifest.dispatchable_count}`);
  lines.push(`held: ${manifest.held_count}`);
  lines.push("");
  lines.push("## Factor Weights");
  for (const [key, fw] of Object.entries(FACTOR_WEIGHTS)) {
    lines.push(`- **${fw.label}** (×${fw.weight}): ${fw.description}`);
  }
  lines.push("");
  lines.push("## Ranked Queue");
  for (const item of manifest.ranked_items.slice(0, 20)) {
    const status = item.dispatchable ? "READY" : "HELD";
    lines.push(`### #${item.rank} [${status}] ${item.item_id} (score=${item.total_score})`);
    lines.push(`- safe: ${item.is_safe}`);
    lines.push(`- primary_factor: ${item.primary_factor}`);
    lines.push(`- secondary_factor: ${item.secondary_factor}`);
    lines.push("");
    lines.push("| Factor | Contribution | Source |");
    lines.push("|---|---|---|");
    for (const b of item.breakdown) {
      lines.push(`| ${b.label} | ${b.contribution} | ${b.source} |`);
    }
    lines.push("");
    if (item.comparison) {
      lines.push(`**Comparison:** ${item.comparison.reasons}`);
      lines.push("");
    }
  }
  lines.push("## Mutation Summary");
  lines.push("- database_writes: none");
  lines.push("- queue_mutations: none (simulation mode)");
  lines.push("- job_dispatches: none");
  lines.push("- runtime_mutations: none");
  lines.push("- product_changes: none");
  return lines.join("\n");
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function parseArgs(argv) {
  const args = { inputs: [], outputDir: DEFAULT_OUTPUT_DIR, help: false };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--output-dir" || arg === "-o") args.outputDir = path.resolve(argv[++i]);
    else if (arg === "--help" || arg === "-h") args.help = true;
    else if (!arg.startsWith("-")) args.inputs.push(path.resolve(arg));
  }
  return args;
}

function main() {
  const options = parseArgs(process.argv.slice(2).filter((a) => a !== "--"));

  if (options.help) {
    process.stdout.write(
      [
        "usage: node scripts/admin/admin-factory-queue-priority.mjs [options] [files...]",
        "",
        "Ranks READY work items using multi-factor scoring.",
        "Factors: base priority, evidence gaps, retry history, traceability,",
        "ownership clarity, age, safety holds.",
        "",
        "Simulation only — never dispatches jobs.",
      ].join("\n") + "\n",
    );
    return;
  }

  ensureDir(options.outputDir);

  // Load
  let items;
  if (options.inputs.length > 0) {
    items = [];
    for (const fp of options.inputs) {
      const data = readJson(fp);
      if (Array.isArray(data)) items.push(...data);
      else if (data) items.push(data);
    }
  } else {
    items = discoverItems();
  }

  // Score and rank
  const scored = items.map((item, i) => scoreItem(item, i));
  const ranked = rankItems(scored);
  const dispatchable = ranked.filter((r) => r.dispatchable);
  const held = ranked.filter((r) => !r.dispatchable);
  const simReport = buildSimulationReport(ranked);

  const manifest = {
    schema_version: "admin-factory-queue-priority/v1",
    runner: "ADMIN-FACTORY-QUEUE-PRIORITY-ENGINE-001",
    mode: "SIMULATION",
    generated_at: new Date().toISOString(),
    factor_weights: FACTOR_WEIGHTS,
    total_items: ranked.length,
    dispatchable_count: dispatchable.length,
    held_count: held.length,
    ranked_items: ranked,
    simulation: simReport,
    mutation_summary: {
      database_writes: "none",
      queue_mutations: "none (simulation mode)",
      job_dispatches: "none",
      runtime_mutations: "none",
      product_changes: "none",
      push_merge_deploy: "none",
    },
  };

  const manifestPath = path.join(options.outputDir, "queue-priority-manifest.json");
  const reportPath = path.join(options.outputDir, "queue-priority-report.md");
  const simPath = path.join(options.outputDir, "simulation_report.json");

  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
  fs.writeFileSync(reportPath, buildReport(manifest));
  fs.writeFileSync(simPath, JSON.stringify(simReport, null, 2) + "\n");

  process.stdout.write(JSON.stringify({
    ok: true,
    runner: "ADMIN-FACTORY-QUEUE-PRIORITY-ENGINE-001",
    total_items: ranked.length,
    dispatchable: dispatchable.length,
    held: held.length,
    top_item: dispatchable[0] ? { item_id: dispatchable[0].item_id, score: dispatchable[0].total_score } : null,
    simulation_report: simPath,
    manifest_path: manifestPath,
    report_path: reportPath,
  }, null, 2) + "\n");
}

main();
