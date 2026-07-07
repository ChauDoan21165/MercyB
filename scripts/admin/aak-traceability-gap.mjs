#!/usr/bin/env node
/**
 * AAK-TRACEABILITY-GAP-REPORT-001 — Traceability Gap Detector
 *
 * Builds a deterministic graph of the Decision → EIP → Execution → Evidence →
 * Judge → Acceptance chain and detects missing links (edges) and orphaned
 * nodes.
 *
 * The expected chain is:
 *   DECISION → EIP → EXECUTION → EVIDENCE → JUDGE → ACCEPTANCE
 *
 * A "gap" is any missing node or edge in this chain for a given package.
 * The analyzer consumes AAK kernel validation reports and produces a gap
 * report with per-package and aggregate diagnostics.
 *
 * Safety: READ_ONLY. No writes outside the configured output directory.
 */

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "../..");
const kernelScript = path.join(repoRoot, "scripts/admin/aak.mjs");

const DEFAULT_OUTPUT_DIR = path.join("/Users/admin/autorun/reports", "aak-traceability-gap");

// ---------------------------------------------------------------------------
// Expected chain definition
// ---------------------------------------------------------------------------

const EXPECTED_CHAIN = [
  { node_type: "DECISION",    index: 0, label: "Decision" },
  { node_type: "EIP",         index: 1, label: "EIP Package" },
  { node_type: "EXECUTION",   index: 2, label: "Execution Record" },
  { node_type: "EVIDENCE",    index: 3, label: "Evidence Bundle" },
  { node_type: "JUDGE",       index: 4, label: "Judge Review" },
  { node_type: "ACCEPTANCE",  index: 5, label: "Acceptance Gate" },
];

const CHAIN_EDGES = [
  { from: "DECISION",   to: "EIP",         relationship: "DECISION_TO_EIP" },
  { from: "EIP",        to: "EXECUTION",   relationship: "EIP_TO_EXECUTION" },
  { from: "EXECUTION",  to: "EVIDENCE",    relationship: "EXECUTION_TO_EVIDENCE" },
  { from: "EVIDENCE",   to: "JUDGE",       relationship: "EVIDENCE_TO_JUDGE" },
  { from: "JUDGE",      to: "ACCEPTANCE",  relationship: "JUDGE_TO_ACCEPTANCE" },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function exists(filePath) {
  return fs.existsSync(filePath);
}

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return null;
  }
}

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function stableId(prefix, seed) {
  return `${prefix}-${crypto.createHash("sha1").update(seed).digest("hex").slice(0, 16)}`;
}

// ---------------------------------------------------------------------------
// Input normalization — consumes same format as aak.mjs normalizeValidationReports
// ---------------------------------------------------------------------------

function scoreInputsFromBoolean(pass) {
  return {
    engineering_health: pass ? 1 : 0,
    evidence_health: pass ? 1 : 0,
    decision_health: pass ? 1 : 0,
    capability_health: pass ? 1 : 0,
    learning_health: pass ? 1 : 0,
  };
}

function normalizeValidationReports(inputs) {
  const reports = [];
  for (const input of inputs) {
    const raw = readJson(input);
    if (!raw) continue;

    if (Array.isArray(raw)) {
      for (const item of raw) {
        reports.push({
          source_file: input,
          package_id: item.package_id ?? item.subject_name ?? null,
          execution_id: item.execution_id ?? null,
          ok: Boolean(item.ok),
          checks: item.checks ?? {},
          errors: item.errors ?? [],
          score_inputs: item.score_inputs ?? scoreInputsFromBoolean(Boolean(item.ok)),
          raw: item,
        });
      }
      continue;
    }

    if (isPlainObject(raw) && Array.isArray(raw.package_reports)) {
      for (const item of raw.package_reports) {
        reports.push({
          source_file: input,
          package_id: item.package_id ?? null,
          execution_id: item.execution_id ?? null,
          ok: Boolean(item.ok),
          checks: item.checks ?? {},
          errors: item.errors ?? [],
          score_inputs: item.score_inputs ?? scoreInputsFromBoolean(Boolean(item.ok)),
          raw: item,
        });
      }
      continue;
    }

    if (isPlainObject(raw)) {
      reports.push({
        source_file: input,
        package_id: raw.package_id ?? raw.subject_name ?? null,
        execution_id: raw.execution_id ?? null,
        ok: Boolean(raw.ok),
        checks: raw.checks ?? {},
        errors: raw.errors ?? [],
        score_inputs: raw.score_inputs ?? scoreInputsFromBoolean(Boolean(raw.ok)),
        raw,
      });
    }
  }
  return reports;
}

// ---------------------------------------------------------------------------
// Node presence detection — what evidence exists for each chain node?
// ---------------------------------------------------------------------------

function detectNodePresence(report) {
  const raw = report.raw;
  const presence = {};

  // DECISION: present if decision_lineage_id or contract_id exists
  presence.DECISION = Boolean(
    raw?.decision_lineage_id || raw?.contract_id || raw?.decision
  );

  // EIP: present if package_id exists (always true for EIPC packages)
  presence.EIP = Boolean(raw?.package_id);

  // EXECUTION: present if execution_id exists
  presence.EXECUTION = Boolean(raw?.execution_id || raw?.execution_record_ref);

  // EVIDENCE: present if evidence_refs or evidence_bundle_ref exists
  presence.EVIDENCE = Boolean(
    (Array.isArray(raw?.evidence_refs) && raw.evidence_refs.length > 0) ||
    raw?.evidence_bundle_ref
  );

  // JUDGE: present if judge_id, judge_package_ref, or a decision field exists
  presence.JUDGE = Boolean(
    raw?.judge_id || raw?.judge_package_ref || raw?.decision
  );

  // ACCEPTANCE: present if status is "approved" or "validated"
  presence.ACCEPTANCE = Boolean(
    raw?.status === "approved" ||
    raw?.status === "validated" ||
    raw?.status === "accepted" ||
    raw?.acceptance_ref
  );

  return presence;
}

// ---------------------------------------------------------------------------
// Edge presence detection — can we trace each link in the chain?
// ---------------------------------------------------------------------------

function detectEdgePresence(report) {
  const raw = report.raw;
  const edges = {};

  // DECISION→EIP: both nodes exist
  edges.DECISION_TO_EIP = Boolean(
    (raw?.decision_lineage_id || raw?.contract_id) && raw?.package_id
  );

  // EIP→EXECUTION: package_id + execution_id both present
  edges.EIP_TO_EXECUTION = Boolean(
    raw?.package_id && (raw?.execution_id || raw?.execution_record_ref)
  );

  // EXECUTION→EVIDENCE: execution + evidence both present
  edges.EXECUTION_TO_EVIDENCE = Boolean(
    (raw?.execution_id || raw?.execution_record_ref) &&
    ((Array.isArray(raw?.evidence_refs) && raw.evidence_refs.length > 0) || raw?.evidence_bundle_ref)
  );

  // EVIDENCE→JUDGE: evidence + judge both present
  edges.EVIDENCE_TO_JUDGE = Boolean(
    ((Array.isArray(raw?.evidence_refs) && raw.evidence_refs.length > 0) || raw?.evidence_bundle_ref) &&
    (raw?.judge_id || raw?.judge_package_ref || raw?.decision)
  );

  // JUDGE→ACCEPTANCE: judge + approved status
  edges.JUDGE_TO_ACCEPTANCE = Boolean(
    (raw?.judge_id || raw?.judge_package_ref || raw?.decision) &&
    (raw?.status === "approved" || raw?.status === "validated" || raw?.status === "accepted" || raw?.acceptance_ref)
  );

  return edges;
}

// ---------------------------------------------------------------------------
// Gap analysis per package
// ---------------------------------------------------------------------------

function analyzePackageGaps(report) {
  const nodePresence = detectNodePresence(report);
  const edgePresence = detectEdgePresence(report);

  const missingNodes = EXPECTED_CHAIN
    .filter((n) => !nodePresence[n.node_type])
    .map((n) => n.node_type);

  const missingEdges = CHAIN_EDGES
    .filter((e) => !edgePresence[e.relationship])
    .map((e) => ({
      from: e.from,
      to: e.to,
      relationship: e.relationship,
    }));

  // Classify severity
  let severity = "none";
  const missingCount = missingNodes.length + missingEdges.length;
  if (missingCount >= 5) severity = "critical";
  else if (missingCount >= 3) severity = "high";
  else if (missingCount >= 1) severity = "medium";

  // Find the first break in the chain
  let firstBreak = null;
  for (const edge of CHAIN_EDGES) {
    if (!edgePresence[edge.relationship]) {
      firstBreak = edge.relationship;
      break;
    }
  }

  // Chain completeness: how far does the trace go?
  let chainDepth = 0;
  for (const edge of CHAIN_EDGES) {
    if (edgePresence[edge.relationship]) {
      chainDepth += 1;
    } else {
      break;
    }
  }

  return {
    package_id: report.package_id ?? "unknown",
    source_file: report.source_file,
    ok: report.ok,
    node_presence: nodePresence,
    edge_presence: edgePresence,
    missing_nodes: missingNodes,
    missing_edges: missingEdges,
    missing_count: missingCount,
    severity,
    first_break: firstBreak,
    chain_depth: chainDepth,
    chain_total: CHAIN_EDGES.length,
    chain_complete: missingCount === 0,
  };
}

// ---------------------------------------------------------------------------
// Aggregate analysis
// ---------------------------------------------------------------------------

function aggregateGaps(packageGaps) {
  const total = packageGaps.length;
  const complete = packageGaps.filter((g) => g.chain_complete).length;
  const incomplete = total - complete;

  // Count missing nodes/edges across all packages
  const nodeMissingCounts = {};
  for (const node of EXPECTED_CHAIN) {
    nodeMissingCounts[node.node_type] = packageGaps.filter(
      (g) => !g.node_presence[node.node_type]
    ).length;
  }

  const edgeMissingCounts = {};
  for (const edge of CHAIN_EDGES) {
    edgeMissingCounts[edge.relationship] = packageGaps.filter(
      (g) => !g.edge_presence[edge.relationship]
    ).length;
  }

  // Most common first break
  const breakCounts = {};
  for (const g of packageGaps) {
    if (g.first_break) {
      breakCounts[g.first_break] = (breakCounts[g.first_break] || 0) + 1;
    }
  }

  // Severity distribution
  const severityDist = { critical: 0, high: 0, medium: 0, none: 0 };
  for (const g of packageGaps) {
    severityDist[g.severity] = (severityDist[g.severity] || 0) + 1;
  }

  // Average chain depth
  const avgDepth = total > 0
    ? Math.round((packageGaps.reduce((sum, g) => sum + g.chain_depth, 0) / total) * 10) / 10
    : 0;

  return {
    total_packages: total,
    complete_chains: complete,
    incomplete_chains: incomplete,
    completeness_percentage: total > 0 ? Math.round((complete / total) * 100) : 0,
    average_chain_depth: avgDepth,
    max_chain_depth: CHAIN_EDGES.length,
    node_missing_counts: nodeMissingCounts,
    edge_missing_counts: edgeMissingCounts,
    most_common_first_break: Object.entries(breakCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([rel, count]) => ({ relationship: rel, count })),
    severity_distribution: severityDist,
  };
}

// ---------------------------------------------------------------------------
// Report generation
// ---------------------------------------------------------------------------

function buildReport(manifest) {
  const lines = [];
  lines.push("# AAK Traceability Gap Report");
  lines.push("");
  lines.push(`runner: ${manifest.runner}`);
  lines.push(`generated_at: ${manifest.generated_at}`);
  lines.push(`input_count: ${manifest.input_count}`);
  lines.push(`package_count: ${manifest.package_count}`);
  lines.push("");
  lines.push("## Aggregate Summary");
  lines.push(`- total_packages: ${manifest.aggregate.total_packages}`);
  lines.push(`- complete_chains: ${manifest.aggregate.complete_chains}`);
  lines.push(`- incomplete_chains: ${manifest.aggregate.incomplete_chains}`);
  lines.push(`- completeness: ${manifest.aggregate.completeness_percentage}%`);
  lines.push(`- average_chain_depth: ${manifest.aggregate.average_chain_depth}/${manifest.aggregate.max_chain_depth}`);
  lines.push("");
  lines.push("## Node Missing Counts");
  for (const [node, count] of Object.entries(manifest.aggregate.node_missing_counts)) {
    const pct = manifest.aggregate.total_packages > 0
      ? Math.round((count / manifest.aggregate.total_packages) * 100)
      : 0;
    lines.push(`- ${node}: ${count} missing (${pct}%)`);
  }
  lines.push("");
  lines.push("## Edge Missing Counts");
  for (const [edge, count] of Object.entries(manifest.aggregate.edge_missing_counts)) {
    const pct = manifest.aggregate.total_packages > 0
      ? Math.round((count / manifest.aggregate.total_packages) * 100)
      : 0;
    lines.push(`- ${edge}: ${count} missing (${pct}%)`);
  }
  lines.push("");
  lines.push("## Most Common First Breaks");
  for (const br of manifest.aggregate.most_common_first_break) {
    lines.push(`- ${br.relationship}: ${br.count} packages`);
  }
  lines.push("");
  lines.push("## Severity Distribution");
  lines.push(`- critical: ${manifest.aggregate.severity_distribution.critical}`);
  lines.push(`- high: ${manifest.aggregate.severity_distribution.high}`);
  lines.push(`- medium: ${manifest.aggregate.severity_distribution.medium}`);
  lines.push(`- none: ${manifest.aggregate.severity_distribution.none}`);
  lines.push("");
  lines.push("## Per-Package Details");
  for (const g of manifest.package_gaps) {
    const status = g.chain_complete ? "✓" : "✗";
    lines.push(`### ${status} ${g.package_id}`);
    lines.push(`- source: ${g.source_file}`);
    lines.push(`- severity: ${g.severity}`);
    lines.push(`- chain_depth: ${g.chain_depth}/${g.chain_total}`);
    lines.push(`- first_break: ${g.first_break ?? "none"}`);
    if (g.missing_nodes.length > 0) {
      lines.push(`- missing_nodes: ${g.missing_nodes.join(", ")}`);
    }
    if (g.missing_edges.length > 0) {
      lines.push(`- missing_edges: ${g.missing_edges.map((e) => e.relationship).join(", ")}`);
    }
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
    help: false,
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--output-dir" || arg === "-o") {
      args.outputDir = path.resolve(argv[++i]);
    } else if (arg === "--help" || arg === "-h") {
      args.help = true;
    } else if (!arg.startsWith("-")) {
      args.inputs.push(path.resolve(arg));
    }
  }

  return args;
}

function discoverDefaultInputs() {
  const inputs = [];

  // Scan state/packets for EIPC packages
  const packetsDir = path.join(repoRoot, "state/packets");
  if (exists(packetsDir)) {
    const walk = (dir) => {
      if (!exists(dir)) return;
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) walk(full);
        else if (entry.isFile() && entry.name.endsWith(".json")) inputs.push(full);
      }
    };
    walk(packetsDir);
  }

  // Add key fixtures as minimum coverage
  const fixtureFiles = [
    path.join(repoRoot, "fixtures/admin/eipc/valid-eip-001.json"),
    path.join(repoRoot, "fixtures/admin/eipc/invalid-missing-required.json"),
    path.join(repoRoot, "fixtures/admin/aak/lifecycle-valid.json"),
    path.join(repoRoot, "fixtures/admin/aak/lifecycle-invalid.json"),
  ];
  for (const fp of fixtureFiles) {
    if (exists(fp) && !inputs.includes(fp)) inputs.push(fp);
  }

  return inputs.sort();
}

function main() {
  const options = parseArgs(process.argv.slice(2).filter((a) => a !== "--"));

  if (options.help) {
    process.stdout.write(
      [
        "usage: node scripts/admin/aak-traceability-gap.mjs [files...] [--output-dir dir]",
        "",
        "Builds a deterministic traceability graph of Decision → EIP → Execution →",
        "Evidence → Judge → Acceptance and detects missing links (gaps).",
        "",
        "If no input files are provided, auto-discovers from state/packets/ and fixtures/.",
      ].join("\n") + "\n",
    );
    return;
  }

  ensureDir(options.outputDir);

  const inputs = options.inputs.length > 0
    ? options.inputs
    : discoverDefaultInputs();

  // Build the graph and analyze gaps
  const reports = normalizeValidationReports(inputs);
  const packageGaps = reports.map(analyzePackageGaps);
  const aggregate = aggregateGaps(packageGaps);

  const manifest = {
    schema_version: "aak-traceability-gap/v1",
    runner: "AAK-TRACEABILITY-GAP-REPORT-001",
    generated_at: new Date().toISOString(),
    input_count: inputs.length,
    package_count: reports.length,
    expected_chain: EXPECTED_CHAIN.map((n) => n.node_type),
    expected_edges: CHAIN_EDGES.map((e) => e.relationship),
    package_gaps: packageGaps,
    aggregate,
    mutation_summary: {
      database_writes: "none",
      runtime_mutations: "none",
      product_changes: "none",
      push_merge_deploy: "none",
    },
  };

  const manifestPath = path.join(options.outputDir, "aak-traceability-gap-manifest.json");
  const reportPath = path.join(options.outputDir, "aak-traceability-gap-report.md");

  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
  fs.writeFileSync(reportPath, buildReport(manifest));

  const result = {
    ok: true,
    runner: "AAK-TRACEABILITY-GAP-REPORT-001",
    input_count: inputs.length,
    package_count: reports.length,
    complete_chains: aggregate.complete_chains,
    incomplete_chains: aggregate.incomplete_chains,
    completeness_percentage: aggregate.completeness_percentage,
    average_chain_depth: aggregate.average_chain_depth,
    severity_distribution: aggregate.severity_distribution,
    manifest_path: manifestPath,
    report_path: reportPath,
  };

  process.stdout.write(JSON.stringify(result, null, 2) + "\n");
}

main();
