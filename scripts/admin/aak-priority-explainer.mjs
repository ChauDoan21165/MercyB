#!/usr/bin/env node
/**
 * AAK-PRIORITY-EXPLAINER-001 — Explainable Priority Engine
 *
 * Makes the AAK priority engine explainable by decomposing each priority
 * score into its constituent factors with source evidence references.
 *
 * The priority score formula (from aak.mjs):
 *   score = impact + evidenceGap*3 + replayGap*2 + judgeGap*2
 *           + (100 - confidence) + cost
 *
 * Each score is decomposed into:
 * - impact: estimated_product_impact (user-provided)
 * - evidence_gap_contribution: missing_evidence * 3
 * - replay_gap_contribution: missing_replay * 2
 * - judge_gap_contribution: missing_judge * 2
 * - confidence_penalty: 100 - confidence
 * - cost_contribution: engineering_cost
 *
 * Safety: READ_ONLY. No writes outside the configured output directory.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "../..");

const DEFAULT_OUTPUT_DIR = path.join("/Users/admin/autorun/reports", "aak-priority-explainer");

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function exists(p) { return fs.existsSync(p); }
function ensureDir(dir) { fs.mkdirSync(dir, { recursive: true }); }

function readJson(filePath) {
  try { return JSON.parse(fs.readFileSync(filePath, "utf8")); }
  catch { return null; }
}

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

// ---------------------------------------------------------------------------
// Priority score formula (mirrors aak.mjs)
// ---------------------------------------------------------------------------

const FACTOR_DEFINITIONS = {
  impact: {
    label: "Product Impact",
    weight: 1,
    description: "Estimated product impact of fixing/addressing this item.",
    source_field: "estimated_product_impact",
  },
  evidence_gap: {
    label: "Evidence Gap",
    weight: 3,
    description: "Missing evidence multiplies priority. Each missing piece adds 3 points.",
    source_field: "evidence_gap",
    alt_field: "missing_evidence",
  },
  replay_gap: {
    label: "Replay Gap",
    weight: 2,
    description: "Missing replay coverage. Each gap adds 2 points.",
    source_field: "replay_gap",
    alt_field: "missing_replay",
  },
  judge_gap: {
    label: "Judge Gap",
    weight: 2,
    description: "Missing judge review. Each gap adds 2 points.",
    source_field: "judge_gap",
    alt_field: "missing_judge",
  },
  confidence_penalty: {
    label: "Confidence Penalty",
    weight: 1,
    description: "Lower confidence increases priority. Penalty = 100 - confidence.",
    source_field: "confidence",
  },
  cost: {
    label: "Engineering Cost",
    weight: 1,
    description: "Higher engineering cost increases priority (risk-weighted).",
    source_field: "engineering_cost",
  },
};

function computeScore(row) {
  const confidence = Number(row.confidence ?? 0);
  const evidenceGap = Number(row.evidence_gap ?? row.missing_evidence ?? 0);
  const replayGap = Number(row.replay_gap ?? row.missing_replay ?? 0);
  const judgeGap = Number(row.judge_gap ?? row.missing_judge ?? 0);
  const cost = Number(row.engineering_cost ?? 0);
  const impact = Number(row.estimated_product_impact ?? 0);

  const decomposition = {
    impact: {
      raw_value: impact,
      weight: FACTOR_DEFINITIONS.impact.weight,
      contribution: impact * FACTOR_DEFINITIONS.impact.weight,
      source_field: "estimated_product_impact",
      source_value: impact,
    },
    evidence_gap: {
      raw_value: evidenceGap,
      weight: FACTOR_DEFINITIONS.evidence_gap.weight,
      contribution: evidenceGap * FACTOR_DEFINITIONS.evidence_gap.weight,
      source_field: row.evidence_gap !== undefined ? "evidence_gap" : "missing_evidence",
      source_value: evidenceGap,
    },
    replay_gap: {
      raw_value: replayGap,
      weight: FACTOR_DEFINITIONS.replay_gap.weight,
      contribution: replayGap * FACTOR_DEFINITIONS.replay_gap.weight,
      source_field: row.replay_gap !== undefined ? "replay_gap" : "missing_replay",
      source_value: replayGap,
    },
    judge_gap: {
      raw_value: judgeGap,
      weight: FACTOR_DEFINITIONS.judge_gap.weight,
      contribution: judgeGap * FACTOR_DEFINITIONS.judge_gap.weight,
      source_field: row.judge_gap !== undefined ? "judge_gap" : "missing_judge",
      source_value: judgeGap,
    },
    confidence_penalty: {
      raw_value: 100 - confidence,
      confidence,
      weight: FACTOR_DEFINITIONS.confidence_penalty.weight,
      contribution: (100 - confidence) * FACTOR_DEFINITIONS.confidence_penalty.weight,
      source_field: "confidence",
      source_value: confidence,
    },
    cost: {
      raw_value: cost,
      weight: FACTOR_DEFINITIONS.cost.weight,
      contribution: cost * FACTOR_DEFINITIONS.cost.weight,
      source_field: "engineering_cost",
      source_value: cost,
    },
  };

  const score = Math.round(
    decomposition.impact.contribution +
    decomposition.evidence_gap.contribution +
    decomposition.replay_gap.contribution +
    decomposition.judge_gap.contribution +
    decomposition.confidence_penalty.contribution +
    decomposition.cost.contribution,
  );

  // Primary driver: which factor contributes most?
  const contributions = Object.entries(decomposition)
    .map(([key, d]) => ({ factor: key, ...d }))
    .sort((a, b) => b.contribution - a.contribution);

  const primaryDriver = contributions[0];
  const secondaryDriver = contributions[1];

  // Generate human-readable explanation
  const explanationParts = [];
  if (primaryDriver.contribution > 0) {
    explanationParts.push(
      `Primary driver: ${FACTOR_DEFINITIONS[primaryDriver.factor].label} ` +
      `(${primaryDriver.contribution} pts, weight=${primaryDriver.weight}×${primaryDriver.raw_value})`,
    );
  }
  if (secondaryDriver.contribution > 0) {
    explanationParts.push(
      `Secondary: ${FACTOR_DEFINITIONS[secondaryDriver.factor].label} ` +
      `(${secondaryDriver.contribution} pts)`,
    );
  }
  if (contributions.every((c) => c.contribution === 0)) {
    explanationParts.push("All factors at zero — item has no risk signals.");
  }

  return {
    score,
    decomposition,
    contributions,
    primary_driver: primaryDriver.factor,
    primary_driver_label: FACTOR_DEFINITIONS[primaryDriver.factor].label,
    explanation: explanationParts.join(". "),
  };
}

// ---------------------------------------------------------------------------
// Input loading — consumes same formats as aak.mjs priorityEngineCommand
// ---------------------------------------------------------------------------

function loadPriorityRows(inputs) {
  const rows = [];
  for (const input of inputs) {
    const raw = readJson(input);
    if (!raw) continue;

    if (Array.isArray(raw)) {
      rows.push(...raw.map((r) => ({ ...r, source_file: input, source_type: "raw_array" })));
    } else if (isPlainObject(raw) && Array.isArray(raw.capabilities)) {
      rows.push(...raw.capabilities.map((c) => ({
        entity_id: c.capability_ref,
        entity_type: "CAPABILITY",
        confidence: c.package_count ? Math.max(0, 100 - c.churn_score * 10) : 0,
        evidence_gap: c.invalid_count || 0,
        replay_gap: c.invalid_count || 0,
        judge_gap: c.package_count === 0 ? 1 : 0,
        engineering_cost: c.package_count || 0,
        estimated_product_impact: c.package_count * 5,
        source_file: input,
        source_type: "capability_graph",
      })));
    } else if (isPlainObject(raw) && Array.isArray(raw.repeated_failures)) {
      rows.push(...raw.repeated_failures.map((f) => ({
        entity_id: f.reason,
        entity_type: "FAILURE_REASON",
        confidence: 50,
        evidence_gap: f.count,
        replay_gap: 0,
        judge_gap: 0,
        engineering_cost: f.count,
        estimated_product_impact: f.count * 2,
        source_file: input,
        source_type: "learning_analysis",
      })));
    } else if (isPlainObject(raw) && Array.isArray(raw.rows)) {
      // Already in priority format
      rows.push(...raw.rows.map((r) => ({ ...r, source_file: input, source_type: "priority_input" })));
    } else if (isPlainObject(raw) && typeof raw.entity_id === "string") {
      rows.push({ ...raw, source_file: input, source_type: "single_entity" });
    }
  }
  return rows;
}

// ---------------------------------------------------------------------------
// Discover default inputs
// ---------------------------------------------------------------------------

function discoverDefaultInputs() {
  const inputs = [];

  // Try capability graph from traceability output
  const capGraphPath = path.join("/Users/admin/autorun/reports", "aak-traceability-gap", "aak-traceability-gap-manifest.json");
  if (exists(capGraphPath)) inputs.push(capGraphPath);

  // Try learning analysis from aak reports
  const learningPaths = [
    path.join("/Users/admin/autorun/reports", "aak-ci-advisory", "aak-ci-advisory-report.json"),
    path.join(repoRoot, "reports", "AUDIO_COVERAGE_REPORT.md"), // not JSON but shows available data
  ];

  // Add traceability aggregate as a priority input
  const traceManifest = path.join("/Users/admin/autorun/reports", "aak-traceability-gap", "aak-traceability-gap-manifest.json");
  if (exists(traceManifest)) {
    const tm = readJson(traceManifest);
    if (tm && tm.aggregate) {
      // Synthesize priority rows from traceability gaps
      const gapRows = [];
      if (tm.aggregate.edge_missing_counts) {
        for (const [edge, count] of Object.entries(tm.aggregate.edge_missing_counts)) {
          if (count > 0) {
            gapRows.push({
              entity_id: `gap:${edge}`,
              entity_type: "TRACEABILITY_GAP",
              confidence: 100 - (count / (tm.package_count || 1)) * 100,
              evidence_gap: count,
              replay_gap: 0,
              judge_gap: 0,
              engineering_cost: 1,
              estimated_product_impact: count * 3,
              source_file: traceManifest,
              source_type: "traceability_gap",
            });
          }
        }
      }
      if (tm.aggregate.node_missing_counts) {
        for (const [node, count] of Object.entries(tm.aggregate.node_missing_counts)) {
          if (count > 0) {
            gapRows.push({
              entity_id: `missing_node:${node}`,
              entity_type: "MISSING_CHAIN_NODE",
              confidence: 100 - (count / (tm.package_count || 1)) * 100,
              evidence_gap: count * 2,
              replay_gap: count,
              judge_gap: count,
              engineering_cost: 2,
              estimated_product_impact: count * 4,
              source_file: traceManifest,
              source_type: "traceability_gap",
            });
          }
        }
      }
      return gapRows;
    }
  }

  return [];
}

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------

function buildReport(manifest) {
  const lines = [];
  lines.push("# AAK Priority Explainer Report");
  lines.push("");
  lines.push(`runner: ${manifest.runner}`);
  lines.push(`generated_at: ${manifest.generated_at}`);
  lines.push(`total_items: ${manifest.total_items}`);
  lines.push(`score_formula: impact + evidenceGap*3 + replayGap*2 + judgeGap*2 + (100-confidence) + cost`);
  lines.push("");
  lines.push("## Factor Definitions");
  for (const [key, def] of Object.entries(FACTOR_DEFINITIONS)) {
    lines.push(`- **${def.label}** (weight=${def.weight}): ${def.description}`);
  }
  lines.push("");
  lines.push("## Ranked Items");
  for (const item of manifest.ranked_items.slice(0, 30)) {
    lines.push(`### #${item.rank}: ${item.entity_id} (score=${item.total_score})`);
    lines.push(`- type: ${item.entity_type}`);
    lines.push(`- primary_driver: ${item.primary_driver_label}`);
    lines.push(`- explanation: ${item.explanation}`);
    lines.push(`- safe_to_execute_now: ${item.safe_to_execute_now}`);
    lines.push("");
    lines.push("| Factor | Raw Value | Weight | Contribution |");
    lines.push("|---|---|---|---|");
    for (const [key, d] of Object.entries(item.decomposition)) {
      lines.push(`| ${FACTOR_DEFINITIONS[key].label} | ${d.raw_value} | ${d.weight} | ${d.contribution} |`);
    }
    lines.push("");
    lines.push(`**Source evidence:** ${item.source_file} (${item.source_type})`);
    lines.push("");
  }
  if (manifest.ranked_items.length > 30) {
    lines.push(`... and ${manifest.ranked_items.length - 30} more items`);
    lines.push("");
  }
  lines.push("## Mutation Summary");
  lines.push("- database_writes: none");
  lines.push("- runtime_mutations: none");
  lines.push("- product_changes: none");
  lines.push("- push_merge_deploy: none");
  return lines.join("\n");
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function parseArgs(argv) {
  const args = {
    inputs: [],
    outputDir: DEFAULT_OUTPUT_DIR,
    topN: 50,
    help: false,
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--output-dir" || arg === "-o") {
      args.outputDir = path.resolve(argv[++i]);
    } else if (arg === "--top" || arg === "-n") {
      args.topN = parseInt(argv[++i], 10) || 50;
    } else if (arg === "--help" || arg === "-h") {
      args.help = true;
    } else if (!arg.startsWith("-")) {
      args.inputs.push(path.resolve(arg));
    }
  }
  return args;
}

function main() {
  const options = parseArgs(process.argv.slice(2).filter((a) => a !== "--"));

  if (options.help) {
    process.stdout.write(
      [
        "usage: node scripts/admin/aak-priority-explainer.mjs [files...] [--top N] [--output-dir dir]",
        "",
        "Explainable priority engine. Decomposes each priority score into its",
        "constituent factors with source evidence references.",
        "",
        "If no input files, auto-discovers from traceability gaps and other AAK outputs.",
        "",
        "Score formula: impact + evidenceGap*3 + replayGap*2 + judgeGap*2 + (100-confidence) + cost",
      ].join("\n") + "\n",
    );
    return;
  }

  ensureDir(options.outputDir);

  // Load or discover inputs
  let rows;
  if (options.inputs.length > 0) {
    rows = loadPriorityRows(options.inputs);
  } else {
    rows = discoverDefaultInputs();
    // Also try loading from priority inputs
    if (rows.length === 0) {
      // Synthesize from known state
      rows = loadPriorityRows(options.inputs);
    }
  }

  // Compute scores with explanations
  const explained = rows.map((row, index) => {
    const { score, decomposition, contributions, primary_driver, primary_driver_label, explanation } = computeScore(row);
    return {
      ...row,
      total_score: score,
      decomposition,
      contributions: contributions.map((c) => ({ factor: c.factor, contribution: c.contribution, raw_value: c.raw_value })),
      primary_driver,
      primary_driver_label,
      explanation,
      safe_to_execute_now: false, // All items require human gate in LEVEL_2
      original_index: index,
    };
  });

  // Sort by score descending
  const ranked = explained
    .sort((a, b) => b.total_score - a.total_score || String(a.entity_id).localeCompare(String(b.entity_id)))
    .slice(0, options.topN)
    .map((item, index) => ({ ...item, rank: index + 1 }));

  // Build manifest
  const manifest = {
    schema_version: "aak-priority-explainer/v1",
    runner: "AAK-PRIORITY-EXPLAINER-001",
    generated_at: new Date().toISOString(),
    score_formula: "impact + evidenceGap*3 + replayGap*2 + judgeGap*2 + (100-confidence) + cost",
    factor_definitions: FACTOR_DEFINITIONS,
    total_items: rows.length,
    ranked_count: ranked.length,
    top_n: options.topN,
    ranked_items: ranked,
    mutation_summary: {
      database_writes: "none",
      runtime_mutations: "none",
      product_changes: "none",
      push_merge_deploy: "none",
    },
  };

  const manifestPath = path.join(options.outputDir, "aak-priority-explainer-manifest.json");
  const reportPath = path.join(options.outputDir, "aak-priority-explainer-report.md");

  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
  fs.writeFileSync(reportPath, buildReport(manifest));

  process.stdout.write(JSON.stringify({
    ok: true,
    runner: "AAK-PRIORITY-EXPLAINER-001",
    total_items: rows.length,
    ranked_count: ranked.length,
    top_item: ranked.length > 0 ? {
      entity_id: ranked[0].entity_id,
      score: ranked[0].total_score,
      primary_driver: ranked[0].primary_driver_label,
      explanation: ranked[0].explanation,
    } : null,
    manifest_path: manifestPath,
    report_path: reportPath,
  }, null, 2) + "\n");
}

main();
