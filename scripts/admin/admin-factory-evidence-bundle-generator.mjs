#!/usr/bin/env node
/**
 * ADMIN-FACTORY-EVIDENCE-BUNDLE-GENERATOR-001
 * Packages completed artifacts into standardized evidence bundles.
 * No Judge verification. Simulation mode. Deterministic.
 */
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPORTS_ROOT = process.env.ADMIN_FACTORY_REPORTS_ROOT || "/Users/admin/autorun/reports";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const EXEC_DIR = path.join(REPORTS_ROOT, "admin-factory-execution-records");
const OUT = path.join(REPORTS_ROOT, "admin-factory-evidence-bundles");

function exists(p) { return fs.existsSync(p); }
function ensureDir(dir) { fs.mkdirSync(dir, { recursive: true }); }
function readJson(f) { try { return JSON.parse(fs.readFileSync(f, "utf8")); } catch { return null; } }
function sha256(s) { return crypto.createHash("sha256").update(s).digest("hex"); }

function discoverExecutionRecords() {
  if (!exists(EXEC_DIR)) return [];
  return fs.readdirSync(EXEC_DIR).filter((f) => f.endsWith(".json") && f !== "execution-record-manifest.json").map((f) => {
    const d = readJson(path.join(EXEC_DIR, f));
    return d ? { file: f, data: d } : null;
  }).filter(Boolean);
}

function collectArtifactsForBundle(execRecord) {
  const artifacts = [];
  // Collect all related artifacts
  for (const a of (execRecord.related_artifacts || [])) {
    if (exists(a.path)) {
      try { artifacts.push({ path: a.path, hash: a.hash || sha256(fs.readFileSync(a.path, "utf8")), bytes: a.bytes, type: path.extname(a.path).replace(".", "") }); }
      catch { /* skip */ }
    }
  }
  // Add validation reports
  for (const v of (execRecord.validation_reports || [])) {
    if (exists(v.path)) {
      try { artifacts.push({ path: v.path, hash: v.hash || sha256(fs.readFileSync(v.path, "utf8")), bytes: fs.statSync(v.path).size, type: "validation" }); }
      catch { /* skip */ }
    }
  }
  return artifacts;
}

function generateBundle(execRecord) {
  const artifacts = collectArtifactsForBundle(execRecord.data);
  const bundleId = `BUNDLE-${sha256(execRecord.data.execution_id + artifacts.map((a) => a.hash).join("")).slice(0, 16)}`;

  const bundle = {
    schema: "admin-factory-evidence-bundle/v1",
    bundle_id: bundleId,
    execution_id: execRecord.data.execution_id,
    package_id: execRecord.data.package_id,
    generated_at: new Date().toISOString(),
    artifacts,
    artifact_count: artifacts.length,
    total_bytes: artifacts.reduce((s, a) => s + (a.bytes || 0), 0),
    artifact_hashes: artifacts.map((a) => a.hash).sort(),
    bundle_hash: sha256(artifacts.map((a) => a.hash).sort().join("")),
    execution_record_ref: path.join(EXEC_DIR, execRecord.file),
    replay_refs: artifacts.filter((a) => a.path.includes("replay")).map((a) => a.path),
    has_replay: artifacts.some((a) => a.path.includes("replay")),
    has_judge_ref: artifacts.some((a) => a.path.includes("judge")),
    has_validation: artifacts.some((a) => a.type === "validation"),
    completeness: artifacts.length > 0 ? (artifacts.some((a) => a.type === "validation") ? "partial" : "minimal") : "empty",
    simulation: true,
  };

  return bundle;
}

function buildReport(manifest) {
  const lines = [];
  lines.push("# Evidence Bundle Generation Report");
  lines.push("");
  lines.push(`runner: ${manifest.runner}`);
  lines.push(`generated_at: ${manifest.generated_at}`);
  lines.push(`bundles_generated: ${manifest.bundles_generated}`);
  lines.push(`total_artifacts: ${manifest.total_artifacts}`);
  lines.push(`total_bytes: ${manifest.total_bytes}`);
  lines.push(`empty: ${manifest.empty_bundles}`);
  lines.push(`with_replay: ${manifest.with_replay}`);
  lines.push(`with_validation: ${manifest.with_validation}`);
  lines.push("");
  lines.push("## Bundles");
  for (const b of manifest.bundles.slice(0, 30)) {
    lines.push(`- ${b.bundle_id}: ${b.artifact_count} artifacts, ${b.total_bytes}B, completeness=${b.completeness}`);
  }
  lines.push("");
  lines.push("## Mutation Summary");
  lines.push("- database_writes: none");
  return lines.join("\n");
}

function main() {
  const outDir = path.resolve(process.argv.slice(2).find((a) => !a.startsWith("-")) || OUT);
  ensureDir(outDir);

  const records = discoverExecutionRecords();
  const bundles = records.map(generateBundle);

  for (const b of bundles) {
    fs.writeFileSync(path.join(outDir, `${b.bundle_id}.json`), JSON.stringify(b, null, 2) + "\n");
  }

  const totalArtifacts = bundles.reduce((s, b) => s + b.artifact_count, 0);
  const totalBytes = bundles.reduce((s, b) => s + b.total_bytes, 0);

  const manifest = {
    schema_version: "admin-factory-evidence-bundles/v1",
    runner: "ADMIN-FACTORY-EVIDENCE-BUNDLE-GENERATOR-001",
    generated_at: new Date().toISOString(),
    bundles_generated: bundles.length,
    total_artifacts: totalArtifacts,
    total_bytes: totalBytes,
    empty_bundles: bundles.filter((b) => b.completeness === "empty").length,
    with_replay: bundles.filter((b) => b.has_replay).length,
    with_validation: bundles.filter((b) => b.has_validation).length,
    bundles: bundles.map((b) => ({
      bundle_id: b.bundle_id, execution_id: b.execution_id,
      artifact_count: b.artifact_count, total_bytes: b.total_bytes,
      completeness: b.completeness, has_replay: b.has_replay,
    })),
    mutation_summary: { database_writes: "none", runtime_mutations: "none", product_changes: "none", generated_from: "existing_execution_records" },
  };

  const mp = path.join(outDir, "evidence-bundle-manifest.json");
  const rp = path.join(outDir, "evidence-bundle-report.md");
  fs.writeFileSync(mp, JSON.stringify(manifest, null, 2) + "\n");
  fs.writeFileSync(rp, buildReport(manifest));

  process.stdout.write(JSON.stringify({
    ok: true, runner: "ADMIN-FACTORY-EVIDENCE-BUNDLE-GENERATOR-001",
    bundles_generated: bundles.length, total_artifacts: totalArtifacts,
    manifest_path: mp, report_path: rp,
  }, null, 2) + "\n");
}
main();
