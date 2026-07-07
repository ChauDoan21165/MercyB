#!/usr/bin/env node
/**
 * ADMIN-FACTORY-COVERAGE-ANALYZER-001
 * Measures execution, evidence, traceability, bundle, and execution record coverage.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const OUT = path.join("/Users/admin/autorun/reports", "admin-factory-coverage");

function exists(p) { return fs.existsSync(p); }
function ensureDir(dir) { fs.mkdirSync(dir, { recursive: true }); }
function readJson(f) { try { return JSON.parse(fs.readFileSync(f, "utf8")); } catch { return null; } }

function loadData() {
  return {
    execManifest: readJson(path.join("/Users/admin/autorun/reports", "admin-factory-execution-records", "execution-record-manifest.json")),
    bundleManifest: readJson(path.join("/Users/admin/autorun/reports", "admin-factory-evidence-bundles", "evidence-bundle-manifest.json")),
    traceLinks: readJson(path.join("/Users/admin/autorun/reports", "admin-factory-traceability-links", "traceability_links.json")),
    traceMissing: readJson(path.join("/Users/admin/autorun/reports", "admin-factory-traceability-links", "missing_links.json")),
    gapManifest: readJson(path.join("/Users/admin/autorun/reports", "aak-traceability-gap", "aak-traceability-gap-manifest.json")),
  };
}

function computeCoverage(data) {
  const totalEip = data.execManifest?.packages_discovered || 0;
  const recordsGenerated = data.execManifest?.records_generated || 0;
  const withArtifacts = data.execManifest?.with_artifacts || 0;
  const bundlesGenerated = data.bundleManifest?.bundles_generated || 0;
  const nonEmptyBundles = bundlesGenerated - (data.bundleManifest?.empty_bundles || 0);
  const linksBuilt = data.traceLinks?.links_built || 0;
  const totalLinks = totalEip * 3; // 3 links per package
  const avgCompleteness = data.traceLinks?.links ? (data.traceLinks.links.reduce((s, l) => s + (l.completeness || 0), 0) / (data.traceLinks.links.length || 1)) : 0;
  const totalGaps = data.gapManifest?.aggregate?.total_packages || 0;

  return {
    execution_record: {
      eip_packages: totalEip,
      records_generated: recordsGenerated,
      coverage_pct: totalEip > 0 ? Math.round((recordsGenerated / totalEip) * 100) : 0,
      with_artifacts: withArtifacts,
      artifact_coverage_pct: recordsGenerated > 0 ? Math.round((withArtifacts / recordsGenerated) * 100) : 0,
    },
    evidence_bundle: {
      bundles_generated: bundlesGenerated,
      non_empty: nonEmptyBundles,
      empty: data.bundleManifest?.empty_bundles || 0,
      coverage_pct: recordsGenerated > 0 ? Math.round((bundlesGenerated / recordsGenerated) * 100) : 0,
      non_empty_pct: bundlesGenerated > 0 ? Math.round((nonEmptyBundles / bundlesGenerated) * 100) : 0,
    },
    traceability: {
      links_built: linksBuilt,
      total_possible: totalLinks,
      missing: data.traceMissing?.count || 0,
      coverage_pct: totalLinks > 0 ? Math.round((linksBuilt / totalLinks) * 100) : 0,
      avg_completeness: Math.round(avgCompleteness),
    },
    overall: {
      total_packages: totalEip,
      covered_packages: recordsGenerated,
      coverage_pct: totalEip > 0 ? Math.round((recordsGenerated / totalEip) * 100) : 0,
      dimensions_measured: 3,
      note: "Coverage = packages with execution records / total EIP packages",
    },
  };
}

function buildReport(manifest) {
  const lines = [];
  lines.push("# Coverage Analysis Report");
  lines.push("");
  const c = manifest.coverage;
  lines.push("## Execution Record Coverage");
  lines.push(`- coverage: ${c.execution_record.coverage_pct}% (${c.execution_record.records_generated}/${c.execution_record.eip_packages})`);
  lines.push(`- with_artifacts: ${c.execution_record.with_artifacts} (${c.execution_record.artifact_coverage_pct}%)`);
  lines.push("");
  lines.push("## Evidence Bundle Coverage");
  lines.push(`- coverage: ${c.evidence_bundle.coverage_pct}% (${c.evidence_bundle.bundles_generated}/${c.execution_record.records_generated})`);
  lines.push(`- non_empty: ${c.evidence_bundle.non_empty} (${c.evidence_bundle.non_empty_pct}%)`);
  lines.push("");
  lines.push("## Traceability Coverage");
  lines.push(`- coverage: ${c.traceability.coverage_pct}% (${c.traceability.links_built}/${c.traceability.total_possible})`);
  lines.push(`- missing: ${c.traceability.missing}`);
  lines.push(`- avg_completeness: ${c.traceability.avg_completeness}%`);
  lines.push("");
  lines.push("## Overall");
  lines.push(`- ${c.overall.coverage_pct}% of packages have execution records`);
  lines.push("");
  lines.push("## Mutation Summary");
  lines.push("- database_writes: none");
  return lines.join("\n");
}

function main() {
  const outDir = path.resolve(process.argv.slice(2).find((a) => !a.startsWith("-")) || OUT);
  ensureDir(outDir);

  const data = loadData();
  const coverage = computeCoverage(data);

  const manifest = {
    schema_version: "admin-factory-coverage/v1",
    runner: "ADMIN-FACTORY-COVERAGE-ANALYZER-001",
    generated_at: new Date().toISOString(),
    coverage,
    mutation_summary: { database_writes: "none", runtime_mutations: "none" },
  };

  const cp = path.join(outDir, "coverage_report.json");
  const dp = path.join(outDir, "coverage_dashboard.json");
  const rp = path.join(outDir, "coverage-report.md");
  fs.writeFileSync(cp, JSON.stringify(manifest, null, 2) + "\n");
  fs.writeFileSync(dp, JSON.stringify(coverage, null, 2) + "\n");
  fs.writeFileSync(rp, buildReport(manifest));

  process.stdout.write(JSON.stringify({
    ok: true, runner: "ADMIN-FACTORY-COVERAGE-ANALYZER-001",
    execution_coverage: coverage.execution_record.coverage_pct,
    evidence_coverage: coverage.evidence_bundle.coverage_pct,
    traceability_coverage: coverage.traceability.coverage_pct,
    overall_coverage: coverage.overall.coverage_pct,
    coverage_report: cp, coverage_dashboard: dp,
  }, null, 2) + "\n");
}
main();
