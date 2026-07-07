#!/usr/bin/env node
/**
 * ADMIN-FACTORY-EXCEPTION-ESCALATOR-001 — Exception Escalator
 *
 * Automatically classifies work items into:
 *   AUTO_CONTINUE  — safe for autonomous execution
 *   HUMAN_GATE_REQUIRED — must stop automation, requires human decision
 *
 * Escalation triggers:
 * - Architecture questions or proposals
 * - Ownership conflicts (two teams claim same subject)
 * - Judge questions (requires human judgment)
 * - Deploy requests (never auto-deploy)
 * - Merge requests (never auto-merge)
 * - Repeated retry failures (>3 consecutive failures on same job)
 * - Safety violations (DB writes, runtime mutations, product changes)
 *
 * Operates in SIMULATION MODE by default.
 *
 * Safety: READ_ONLY. Classifies but never blocks, deploys, or mutates.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "../..");

const DEFAULT_OUTPUT_DIR = path.join("/Users/admin/autorun/reports", "admin-factory-exception-escalator");

// ---------------------------------------------------------------------------
// Escalation rule definitions
// ---------------------------------------------------------------------------

const ESCALATION_RULES = [
  {
    rule_id: "ESC-ARCHITECTURE",
    category: "architecture",
    patterns: [
      /architecture/i, /redesign/i, /refactor.*pattern/i,
      /new.*system/i, /restructure/i, /architectural/i,
    ],
    description: "Architecture questions or proposals require human review.",
    severity: "critical",
  },
  {
    rule_id: "ESC-OWNERSHIP-CONFLICT",
    category: "ownership",
    patterns: [
      /ownership.*conflict/i, /two.*teams/i, /ambiguous.*owner/i,
      /owner.*mismatch/i, /unclear.*responsibility/i,
    ],
    description: "Ownership conflicts require human resolution.",
    severity: "critical",
  },
  {
    rule_id: "ESC-JUDGE-QUESTION",
    category: "judge",
    patterns: [
      /judge/i, /human.*judgment/i, /subjective/i,
      /requires.*review/i, /needs.*approval/i, /sign.?off/i,
    ],
    description: "Questions requiring Judge authority must be escalated.",
    severity: "high",
  },
  {
    rule_id: "ESC-DEPLOY",
    category: "deploy",
    patterns: [
      /\bdeploy\b/i, /\bpush\b.*\bmain\b/i, /\brelease\b/i,
      /\bship\b/i, /production.*deploy/i, /go.*live/i,
    ],
    description: "Deploy requests are never auto-executed.",
    severity: "critical",
  },
  {
    rule_id: "ESC-MERGE",
    category: "merge",
    patterns: [
      /\bmerge\b/i, /pull.*request/i, /\bPR\b/,
      /integrate.*branch/i, /combine/i,
    ],
    description: "Merge requests require human approval.",
    severity: "critical",
  },
  {
    rule_id: "ESC-RETRY-STORM",
    category: "retry",
    patterns: [
      /retry.*fail/i, /repeated.*failure/i, /consecutive.*fail/i,
      /stuck.*again/i, /still.*failing/i,
    ],
    description: "Repeated retry failures indicate a deeper problem.",
    severity: "high",
    threshold: { consecutive_failures: 3 },
  },
  {
    rule_id: "ESC-SAFETY-VIOLATION",
    category: "safety",
    patterns: [
      /database.*write/i, /db.*mutation/i, /runtime.*change/i,
      /product.*change/i, /unsafe/i, /security/i, /bypass/i,
      /without.*approval/i, /unauthorized/i,
    ],
    description: "Any safety policy violation must be escalated immediately.",
    severity: "critical",
  },
  {
    rule_id: "ESC-BLOCKING-CHANGE",
    category: "blocking",
    patterns: [
      /\bblocking\b/i, /would.*block/i, /gate.*change/i,
      /permission.*change/i, /policy.*change/i,
    ],
    description: "Changes to blocking/gating behavior need human sign-off.",
    severity: "high",
  },
];

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
// Classification engine
// ---------------------------------------------------------------------------

function classifyItem(item) {
  const title = String(item.title || item.mission_slug || item.entity_id || item.id || "");
  const brief = String(item.brief || item.scope || item.description || "");
  const action = String(item.action || item.recovery_action || "");
  const reasons = Array.isArray(item.stuck_reasons)
    ? item.stuck_reasons.map((r) => typeof r === "string" ? r : (r.code || r.reason || "")).join(" ")
    : "";
  const attemptInfo = `attempts=${item.attempt_count || 0}/${item.max_attempts || 0}`;
  const fullText = [title, brief, action, reasons, attemptInfo].join(" ");

  const matchedRules = [];
  for (const rule of ESCALATION_RULES) {
    let matched = false;
    const matchDetails = [];

    for (const pattern of rule.patterns) {
      if (pattern.test(fullText)) {
        matched = true;
        matchDetails.push(pattern.source);
      }
    }

    // Special threshold check for retry storm
    if (rule.rule_id === "ESC-RETRY-STORM") {
      const consecutive = item.consecutive_failures || item.retry_count || item.attempt_count || 0;
      if (consecutive < (rule.threshold?.consecutive_failures || 3)) {
        matched = false;
      }
    }

    if (matched) {
      matchedRules.push({
        rule_id: rule.rule_id,
        category: rule.category,
        severity: rule.severity,
        description: rule.description,
        matched_patterns: matchDetails,
      });
    }
  }

  const requiresHumanGate = matchedRules.length > 0;
  const highestSeverity = matchedRules.length > 0
    ? matchedRules.some((r) => r.severity === "critical") ? "critical"
      : matchedRules.some((r) => r.severity === "high") ? "high" : "medium"
    : "none";

  return {
    item_id: item.job_id || item.entity_id || item.id || "unknown",
    title: title.slice(0, 120),
    classification: requiresHumanGate ? "HUMAN_GATE_REQUIRED" : "AUTO_CONTINUE",
    requires_human_gate: requiresHumanGate,
    severity: highestSeverity,
    matched_rules: matchedRules,
    match_count: matchedRules.length,
    explanation: requiresHumanGate
      ? `Escalated due to: ${matchedRules.map((r) => `${r.category}(${r.severity})`).join(", ")}.`
      : "No escalation triggers matched. Safe for autonomous execution.",
  };
}

// ---------------------------------------------------------------------------
// Batch classification
// ---------------------------------------------------------------------------

function classifyBatch(items) {
  const results = items.map(classifyItem);

  const summary = {
    total_items: results.length,
    auto_continue: results.filter((r) => r.classification === "AUTO_CONTINUE").length,
    human_gate_required: results.filter((r) => r.classification === "HUMAN_GATE_REQUIRED").length,
    by_severity: {
      critical: results.filter((r) => r.severity === "critical").length,
      high: results.filter((r) => r.severity === "high").length,
      medium: results.filter((r) => r.severity === "medium").length,
      none: results.filter((r) => r.severity === "none").length,
    },
    by_category: {},
  };

  for (const r of results) {
    for (const rule of r.matched_rules) {
      const cat = rule.category;
      summary.by_category[cat] = (summary.by_category[cat] || 0) + 1;
    }
  }

  return { results, summary };
}

// ---------------------------------------------------------------------------
// Input discovery
// ---------------------------------------------------------------------------

function discoverItems() {
  const items = [];

  // Load from stuck-job recovery if available
  const stuckPath = path.join("/Users/admin/autorun/reports", "admin-factory-stuck-job-recovery", "stuck-job-recovery-manifest.json");
  if (exists(stuckPath)) {
    const data = readJson(stuckPath);
    if (data?.results) items.push(...data.results.map((r) => ({
      job_id: r.job_id,
      title: r.title,
      action: r.recovery?.action,
      stuck_reasons: r.stuck_reasons,
    })));
  }

  // Load from traceability gaps
  const tracePath = path.join("/Users/admin/autorun/reports", "aak-traceability-gap", "aak-traceability-gap-manifest.json");
  if (exists(tracePath)) {
    const data = readJson(tracePath);
    if (data?.package_gaps) {
      for (const g of data.package_gaps) {
        items.push({
          entity_id: g.package_id,
          title: `Traceability gap: ${g.package_id} (${g.severity})`,
          scope: `Missing nodes: ${(g.missing_nodes || []).join(", ")}. Missing edges: ${(g.missing_edges || []).map((e) => e.relationship).join(", ")}.`,
        });
      }
    }
  }

  // Load from seed manifest
  const seedPath = path.join("/Users/admin/autorun/reports/automation-backlog/factory-seed/seed-manifest.json");
  if (exists(seedPath)) {
    const data = readJson(seedPath);
    if (data?.jobs) items.push(...data.jobs);
  }

  return items;
}

// ---------------------------------------------------------------------------
// Simulation report
// ---------------------------------------------------------------------------

function buildSimulationReport(batchResult) {
  return {
    simulation_mode: true,
    live_mode: false,
    would_escalate: batchResult.summary.human_gate_required,
    would_continue: batchResult.summary.auto_continue,
    would_ignore: 0,
    escalated_items: batchResult.results
      .filter((r) => r.classification === "HUMAN_GATE_REQUIRED")
      .map((r) => ({
        item_id: r.item_id,
        severity: r.severity,
        categories: r.matched_rules.map((m) => m.category),
        explanation: r.explanation,
      })),
    auto_continue_items: batchResult.results
      .filter((r) => r.classification === "AUTO_CONTINUE")
      .map((r) => ({ item_id: r.item_id, title: r.title })),
  };
}

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------

function buildReport(manifest) {
  const lines = [];
  lines.push("# Admin Factory Exception Escalator Report");
  lines.push("");
  lines.push(`runner: ${manifest.runner}`);
  lines.push(`mode: ${manifest.mode}`);
  lines.push(`generated_at: ${manifest.generated_at}`);
  lines.push(`rule_count: ${ESCALATION_RULES.length}`);
  lines.push("");
  lines.push("## Summary");
  lines.push(`- total_items: ${manifest.summary.total_items}`);
  lines.push(`- auto_continue: ${manifest.summary.auto_continue}`);
  lines.push(`- human_gate_required: ${manifest.summary.human_gate_required}`);
  lines.push("");
  lines.push("## By Severity");
  for (const [sev, count] of Object.entries(manifest.summary.by_severity)) {
    lines.push(`- ${sev}: ${count}`);
  }
  lines.push("");
  lines.push("## Escalated Items");
  for (const r of manifest.results) {
    if (r.classification !== "HUMAN_GATE_REQUIRED") continue;
    lines.push(`### [${r.severity.toUpperCase()}] ${r.item_id}`);
    lines.push(`- classification: ${r.classification}`);
    lines.push(`- explanation: ${r.explanation}`);
    lines.push(`- matched_rules:`);
    for (const rule of r.matched_rules) {
      lines.push(`  - ${rule.rule_id} (${rule.category}/${rule.severity}): ${rule.description}`);
    }
    lines.push("");
  }
  lines.push("## Escalation Rules Reference");
  for (const rule of ESCALATION_RULES) {
    lines.push(`- **${rule.rule_id}** [${rule.category}/${rule.severity}]: ${rule.description}`);
  }
  lines.push("");
  lines.push("## Mutation Summary");
  lines.push("- database_writes: none");
  lines.push("- queue_mutations: none");
  lines.push("- runtime_mutations: none");
  lines.push("- product_changes: none");
  lines.push("- push_merge_deploy: none");
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
        "usage: node scripts/admin/admin-factory-exception-escalator.mjs [options] [files...]",
        "",
        "Classifies work items as AUTO_CONTINUE or HUMAN_GATE_REQUIRED.",
        "Escalation triggers: architecture, ownership, judge, deploy, merge,",
        "retry storms, safety violations, blocking changes.",
        "",
        "Simulation only — never blocks, deploys, or mutates.",
      ].join("\n") + "\n",
    );
    return;
  }

  ensureDir(options.outputDir);

  // Load items
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

  // Classify
  const batchResult = classifyBatch(items);
  const simReport = buildSimulationReport(batchResult);

  // Build manifest
  const manifest = {
    schema_version: "admin-factory-exception-escalator/v1",
    runner: "ADMIN-FACTORY-EXCEPTION-ESCALATOR-001",
    mode: "SIMULATION",
    generated_at: new Date().toISOString(),
    escalation_rules_count: ESCALATION_RULES.length,
    escalation_rules: ESCALATION_RULES.map((r) => ({
      rule_id: r.rule_id, category: r.category, severity: r.severity, description: r.description,
    })),
    results: batchResult.results,
    summary: batchResult.summary,
    simulation: simReport,
    mutation_summary: {
      database_writes: "none",
      queue_mutations: "none",
      runtime_mutations: "none",
      product_changes: "none",
      push_merge_deploy: "none",
    },
  };

  const manifestPath = path.join(options.outputDir, "exception-escalator-manifest.json");
  const reportPath = path.join(options.outputDir, "exception-escalator-report.md");
  const simPath = path.join(options.outputDir, "simulation_report.json");

  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
  fs.writeFileSync(reportPath, buildReport(manifest));
  fs.writeFileSync(simPath, JSON.stringify(simReport, null, 2) + "\n");

  process.stdout.write(JSON.stringify({
    ok: true,
    runner: "ADMIN-FACTORY-EXCEPTION-ESCALATOR-001",
    total_items: batchResult.summary.total_items,
    auto_continue: batchResult.summary.auto_continue,
    human_gate_required: batchResult.summary.human_gate_required,
    simulation_report: simPath,
    manifest_path: manifestPath,
    report_path: reportPath,
  }, null, 2) + "\n");
}

main();
