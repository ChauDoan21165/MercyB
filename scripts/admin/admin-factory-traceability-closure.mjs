#!/usr/bin/env node
/**
 * ADMIN-FACTORY-TRACEABILITY-CLOSURE-001 — Traceability Gap Closure Analyzer
 *
 * Analyzes every missing edge in the Decision→EIP→Execution→Evidence→Judge→Acceptance
 * chain and classifies each gap as:
 * - FIXABLE_AUTOMATICALLY: can be resolved by deterministic automation
 * - REQUIRES_HUMAN: needs human judgment, content authoring, or architecture decisions
 *
 * Groups gaps by type and produces a prioritized closure plan.
 *
 * Safety: READ_ONLY. No mutations.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPORTS_ROOT = process.env.ADMIN_FACTORY_REPORTS_ROOT || "/Users/admin/autorun/reports";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "../..");
const DEFAULT_OUTPUT_DIR = path.join(REPORTS_ROOT, "admin-factory-traceability-closure");

function exists(p) { return fs.existsSync(p); }
function ensureDir(dir) { fs.mkdirSync(dir, { recursive: true }); }
function readJson(f) { try { return JSON.parse(fs.readFileSync(f, "utf8")); } catch { return null; } }

// ---------------------------------------------------------------------------
// Edge classification rules
// ---------------------------------------------------------------------------

const AUTO_FIXABLE_PATTERNS = {
  DECISION_TO_EIP: {
    auto_fixable: true,
    reason: "Decision lineage can be generated from package metadata (contract_id, package_id).",
    fix_action: "Generate decision_lineage_id from contract_id + package_id hash.",
  },
  EIP_TO_EXECUTION: {
    auto_fixable: false,
    reason: "Execution records require actual agent runs — cannot be synthesized.",
    fix_action: "Requires agent to produce execution record after running workpack.",
  },
  EXECUTION_TO_EVIDENCE: {
    auto_fixable: false,
    reason: "Evidence bundles require real artifacts from execution — cannot be fabricated.",
    fix_action: "Requires artifact capture during execution.",
  },
  EVIDENCE_TO_JUDGE: {
    auto_fixable: false,
    reason: "Judge review requires human or Judge-agent evaluation of evidence.",
    fix_action: "Requires Judge component review of evidence bundle.",
  },
  JUDGE_TO_ACCEPTANCE: {
    auto_fixable: false,
    reason: "Acceptance requires explicit approval status change.",
    fix_action: "Requires human or automated acceptance gate after judge review.",
  },
};

const NODE_AUTO_FIXABLE = {
  DECISION: { auto_fixable: true, reason: "Can derive from package contract metadata." },
  EIP: { auto_fixable: true, reason: "Package ID is always present in EIPC packages." },
  EXECUTION: { auto_fixable: false, reason: "Requires actual agent execution run." },
  EVIDENCE: { auto_fixable: false, reason: "Requires artifact capture from execution." },
  JUDGE: { auto_fixable: false, reason: "Requires Judge component review." },
  ACCEPTANCE: { auto_fixable: false, reason: "Requires explicit approval gate." },
};

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function loadTraceabilityGaps() {
  const p = path.join(REPORTS_ROOT, "aak-traceability-gap", "aak-traceability-gap-manifest.json");
  if (!exists(p)) return null;
  return readJson(p);
}

function classifyGaps(gapManifest) {
  if (!gapManifest?.package_gaps) return { edges: [], nodes: [], by_edge_type: [], summary: { total_edge_gaps: 0, total_node_gaps: 0, total_gaps: 0, auto_fixable: 0, requires_human: 0 } };

  const edgeGaps = [];
  const nodeGaps = [];

  for (const pkg of gapManifest.package_gaps || []) {
    // Classify missing edges
    for (const edge of (pkg.missing_edges || [])) {
      const classification = AUTO_FIXABLE_PATTERNS[edge.relationship] || { auto_fixable: false, reason: "Unknown edge type.", fix_action: "Investigate." };
      edgeGaps.push({
        package_id: pkg.package_id,
        edge: edge.relationship,
        from: edge.from,
        to: edge.to,
        auto_fixable: classification.auto_fixable,
        classification: classification.auto_fixable ? "FIXABLE_AUTOMATICALLY" : "REQUIRES_HUMAN",
        reason: classification.reason,
        fix_action: classification.fix_action,
      });
    }

    // Classify missing nodes
    for (const node of (pkg.missing_nodes || [])) {
      const classification = NODE_AUTO_FIXABLE[node] || { auto_fixable: false, reason: "Unknown node type." };
      nodeGaps.push({
        package_id: pkg.package_id,
        node,
        auto_fixable: classification.auto_fixable,
        classification: classification.auto_fixable ? "FIXABLE_AUTOMATICALLY" : "REQUIRES_HUMAN",
        reason: classification.reason,
      });
    }
  }

  // Group by edge type
  const byEdgeType = {};
  for (const eg of edgeGaps) {
    const key = eg.edge;
    if (!byEdgeType[key]) byEdgeType[key] = { edge: key, count: 0, auto_fixable: eg.auto_fixable, gaps: [] };
    byEdgeType[key].count += 1;
    byEdgeType[key].gaps.push(eg);
  }

  const autoFixable = edgeGaps.filter((g) => g.auto_fixable).length + nodeGaps.filter((g) => g.auto_fixable).length;
  const requiresHuman = edgeGaps.filter((g) => !g.auto_fixable).length + nodeGaps.filter((g) => !g.auto_fixable).length;

  return {
    edges: edgeGaps,
    nodes: nodeGaps,
    by_edge_type: Object.values(byEdgeType).sort((a, b) => b.count - a.count),
    summary: {
      total_edge_gaps: edgeGaps.length,
      total_node_gaps: nodeGaps.length,
      total_gaps: edgeGaps.length + nodeGaps.length,
      auto_fixable: autoFixable,
      requires_human: requiresHuman,
      auto_fixable_pct: (edgeGaps.length + nodeGaps.length) > 0 ? Math.round((autoFixable / (edgeGaps.length + nodeGaps.length)) * 100) : 0,
      requires_human_pct: (edgeGaps.length + nodeGaps.length) > 0 ? Math.round((requiresHuman / (edgeGaps.length + nodeGaps.length)) * 100) : 0,
    },
  };
}

function buildReport(manifest) {
  const lines = [];
  lines.push("# Traceability Closure Analysis");
  lines.push("");
  lines.push(`runner: ${manifest.runner}`);
  lines.push(`generated_at: ${manifest.generated_at}`);
  lines.push("");
  const s = manifest.closure.summary;
  lines.push("## Summary");
  lines.push(`- total_gaps: ${s.total_gaps}`);
  lines.push(`- auto_fixable: ${s.auto_fixable} (${s.auto_fixable_pct}%)`);
  lines.push(`- requires_human: ${s.requires_human} (${s.requires_human_pct}%)`);
  lines.push("");
  lines.push("## By Edge Type");
  for (const et of manifest.closure.by_edge_type) {
    lines.push(`- **${et.edge}**: ${et.count} gaps — ${et.auto_fixable ? "FIXABLE_AUTOMATICALLY" : "REQUIRES_HUMAN"}`);
  }
  lines.push("");
  lines.push("## Fixable Automatically");
  for (const g of manifest.closure.edges.filter((g) => g.auto_fixable).slice(0, 20)) {
    lines.push(`- ${g.package_id}: ${g.edge} — ${g.fix_action}`);
  }
  lines.push("");
  lines.push("## Requires Human");
  for (const g of manifest.closure.edges.filter((g) => !g.auto_fixable).slice(0, 20)) {
    lines.push(`- ${g.package_id}: ${g.edge} — ${g.reason}`);
  }
  lines.push("");
  lines.push("## Mutation Summary");
  lines.push("- database_writes: none");
  return lines.join("\n");
}

function main() {
  const args = process.argv.slice(2).filter((a) => a !== "--");
  const outputDir = path.resolve(args[0] || DEFAULT_OUTPUT_DIR);
  ensureDir(outputDir);

  const gapManifest = loadTraceabilityGaps();
  const closure = classifyGaps(gapManifest);

  const manifest = {
    schema_version: "admin-factory-traceability-closure/v1",
    runner: "ADMIN-FACTORY-TRACEABILITY-CLOSURE-001",
    generated_at: new Date().toISOString(),
    closure,
    mutation_summary: { database_writes: "none", runtime_mutations: "none", product_changes: "none" },
  };

  const jsonPath = path.join(outputDir, "traceability-closure.json");
  const edgesPath = path.join(outputDir, "missing_edges.json");
  const reportPath = path.join(outputDir, "traceability-closure-report.md");

  fs.writeFileSync(jsonPath, JSON.stringify(manifest, null, 2) + "\n");
  fs.writeFileSync(edgesPath, JSON.stringify({ edges: closure.edges, nodes: closure.nodes, by_edge_type: closure.by_edge_type }, null, 2) + "\n");
  fs.writeFileSync(reportPath, buildReport(manifest));

  process.stdout.write(JSON.stringify({
    ok: true, runner: "ADMIN-FACTORY-TRACEABILITY-CLOSURE-001",
    total_gaps: closure.summary.total_gaps,
    auto_fixable: closure.summary.auto_fixable,
    requires_human: closure.summary.requires_human,
    missing_edges_path: edgesPath,
    manifest_path: jsonPath,
    report_path: reportPath,
  }, null, 2) + "\n");
}

main();
