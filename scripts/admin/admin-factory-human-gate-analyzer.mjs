#!/usr/bin/env node
/**
 * ADMIN-FACTORY-HUMAN-GATE-ANALYZER-001 — Human Gate Analyzer
 *
 * Analyzes all current HUMAN_GATE_REQUIRED cases, groups by category
 * (Architecture, Ownership, Judge, Safety, Deploy, Unknown), and assesses
 * how many could eventually become deterministic.
 *
 * No policy changes. Classification only.
 *
 * Safety: READ_ONLY.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_OUTPUT_DIR = path.join("/Users/admin/autorun/reports", "admin-factory-human-gate-analyzer");

function exists(p) { return fs.existsSync(p); }
function ensureDir(dir) { fs.mkdirSync(dir, { recursive: true }); }
function readJson(f) { try { return JSON.parse(fs.readFileSync(f, "utf8")); } catch { return null; } }

const CATEGORY_DETERMINISM_POTENTIAL = {
  architecture: { can_be_deterministic: false, reason: "Architecture decisions inherently require human design judgment. Cannot be automated." },
  ownership: { can_be_deterministic: true, reason: "Ownership routing is already deterministic via registry. Conflicts are rare edge cases that can be auto-resolved by registry precedence." },
  judge: { can_be_deterministic: false, reason: "Judge questions involve subjective quality assessment. Partial automation possible but full determinism not achievable." },
  deploy: { can_be_deterministic: true, reason: "Deploy gates can be automated with pre-approved safety checks. Currently requires human as safety precaution." },
  merge: { can_be_deterministic: true, reason: "Merge gates can be automated with CI checks. Currently requires human for code review quality." },
  safety: { can_be_deterministic: false, reason: "Safety violations indicate policy breaches. Must always require human review." },
  retry: { can_be_deterministic: true, reason: "Retry limits are deterministic. After threshold, auto-escalation can follow policy without human gate." },
  blocking: { can_be_deterministic: true, reason: "Blocking changes can be pre-approved via policy rules. Current gates exist because policy is not yet fully codified." },
  unknown: { can_be_deterministic: false, reason: "Unknown categories require investigation before automation." },
};

function loadEscalatorData() {
  const p = path.join("/Users/admin/autorun/reports", "admin-factory-exception-escalator", "exception-escalator-manifest.json");
  return exists(p) ? readJson(p) : null;
}

function analyzeGates(escalatorData) {
  if (!escalatorData?.results) return { categories: {}, summary: { total_gates: 0, potentially_deterministic: 0, always_requires_human: 0 } };

  const escalated = escalatorData.results.filter((r) => r.classification === "HUMAN_GATE_REQUIRED");
  const byCategory = {};

  for (const item of escalated) {
    const cats = item.matched_rules?.map((r) => r.category) || ["unknown"];
    for (const cat of cats) {
      if (!byCategory[cat]) {
        byCategory[cat] = {
          category: cat,
          count: 0,
          items: [],
          ...(CATEGORY_DETERMINISM_POTENTIAL[cat] || CATEGORY_DETERMINISM_POTENTIAL.unknown),
        };
      }
      byCategory[cat].count += 1;
      byCategory[cat].items.push({ item_id: item.item_id, severity: item.severity });
    }
  }

  const potentiallyDeterministic = Object.values(byCategory)
    .filter((c) => c.can_be_deterministic)
    .reduce((sum, c) => sum + c.count, 0);

  const alwaysRequiresHuman = Object.values(byCategory)
    .filter((c) => !c.can_be_deterministic)
    .reduce((sum, c) => sum + c.count, 0);

  return {
    categories: Object.values(byCategory).sort((a, b) => b.count - a.count),
    summary: {
      total_gates: escalated.length,
      total_categories: Object.keys(byCategory).length,
      potentially_deterministic: potentiallyDeterministic,
      always_requires_human: alwaysRequiresHuman,
      determinism_potential_pct: escalated.length > 0 ? Math.round((potentiallyDeterministic / escalated.length) * 100) : 0,
      human_required_pct: escalated.length > 0 ? Math.round((alwaysRequiresHuman / escalated.length) * 100) : 0,
    },
  };
}

function buildReport(manifest) {
  const lines = [];
  lines.push("# Human Gate Analysis Report");
  lines.push("");
  lines.push(`runner: ${manifest.runner}`);
  lines.push(`generated_at: ${manifest.generated_at}`);
  lines.push("");
  const s = manifest.analysis.summary;
  lines.push("## Summary");
  lines.push(`- total_gates: ${s.total_gates}`);
  lines.push(`- potentially_deterministic: ${s.potentially_deterministic} (${s.determinism_potential_pct}%)`);
  lines.push(`- always_requires_human: ${s.always_requires_human} (${s.human_required_pct}%)`);
  lines.push("");
  lines.push("## By Category");
  for (const cat of manifest.analysis.categories) {
    lines.push(`### ${cat.category} (${cat.count} items) — ${cat.can_be_deterministic ? "POTENTIALLY DETERMINISTIC" : "ALWAYS REQUIRES HUMAN"}`);
    lines.push(`- reason: ${cat.reason}`);
    for (const item of cat.items.slice(0, 5)) {
      lines.push(`  - ${item.item_id} [${item.severity}]`);
    }
    lines.push("");
  }
  lines.push("## Mutation Summary");
  lines.push("- database_writes: none");
  lines.push("- policy_changes: none");
  return lines.join("\n");
}

function main() {
  const args = process.argv.slice(2).filter((a) => a !== "--");
  const outputDir = path.resolve(args[0] || DEFAULT_OUTPUT_DIR);
  ensureDir(outputDir);

  const escalatorData = loadEscalatorData();
  const analysis = analyzeGates(escalatorData);

  const manifest = {
    schema_version: "admin-factory-human-gate-analyzer/v1",
    runner: "ADMIN-FACTORY-HUMAN-GATE-ANALYZER-001",
    generated_at: new Date().toISOString(),
    analysis,
    mutation_summary: { database_writes: "none", policy_changes: "none", runtime_mutations: "none", product_changes: "none" },
  };

  const jsonPath = path.join(outputDir, "human-gate-analysis.json");
  const reportPath = path.join(outputDir, "human-gate-analysis-report.md");
  fs.writeFileSync(jsonPath, JSON.stringify(manifest, null, 2) + "\n");
  fs.writeFileSync(reportPath, buildReport(manifest));

  process.stdout.write(JSON.stringify({
    ok: true, runner: "ADMIN-FACTORY-HUMAN-GATE-ANALYZER-001",
    total_gates: analysis.summary.total_gates,
    potentially_deterministic: analysis.summary.potentially_deterministic,
    always_requires_human: analysis.summary.always_requires_human,
    manifest_path: jsonPath,
    report_path: reportPath,
  }, null, 2) + "\n");
}

main();
