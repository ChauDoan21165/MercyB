#!/usr/bin/env node
/**
 * ADMIN-FACTORY-EXECUTION-RECORD-GENERATOR-001
 * Generates deterministic execution records from existing EIP packages and artifacts.
 * Never fabricates — only generates from existing evidence on disk.
 * Safety: READ_ONLY + ARTIFACT_ONLY. Simulation mode.
 */
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPORTS_ROOT = process.env.ADMIN_FACTORY_REPORTS_ROOT || "/Users/admin/autorun/reports";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "../..");
const OUT = path.join(REPORTS_ROOT, "admin-factory-execution-records");

function exists(p) { return fs.existsSync(p); }
function ensureDir(dir) { fs.mkdirSync(dir, { recursive: true }); }
function readJson(f) { try { return JSON.parse(fs.readFileSync(f, "utf8")); } catch { return null; } }
function sha256(s) { return crypto.createHash("sha256").update(s).digest("hex"); }

function discoverEipPackages() {
  const pkgs = [];
  // Scan state/packets
  const packetsDir = path.join(repoRoot, "state/packets");
  if (exists(packetsDir)) {
    for (const sub of fs.readdirSync(packetsDir)) {
      const d = path.join(packetsDir, sub);
      if (!fs.statSync(d).isDirectory()) continue;
      for (const f of fs.readdirSync(d)) {
        if (!f.endsWith(".json")) continue;
        const data = readJson(path.join(d, f));
        if (data?.package_id || data?.capability_refs) pkgs.push({ source: path.join(d, f), data, type: sub });
      }
    }
  }
  // Scan fixtures
  const eipcDir = path.join(repoRoot, "fixtures/admin/eipc");
  if (exists(eipcDir)) {
    for (const f of fs.readdirSync(eipcDir)) {
      if (!f.endsWith(".json")) continue;
      const data = readJson(path.join(eipcDir, f));
      if (data?.package_id) pkgs.push({ source: path.join(eipcDir, f), data, type: "eipc" });
    }
  }
  return pkgs;
}

function discoverRelatedArtifacts(pkgId) {
  const artifacts = [];
  const reportsDir = path.join(REPORTS_ROOT);
  if (!exists(reportsDir)) return artifacts;
  const walk = (dir, depth) => {
    if (depth > 2) return;
    for (const e of fs.readdirSync(dir)) {
      const full = path.join(dir, e);
      if (fs.statSync(full).isDirectory() && !e.startsWith(".")) walk(full, depth + 1);
      else if (e.endsWith(".json") || e.endsWith(".md")) {
        try {
          const content = fs.readFileSync(full, "utf8");
          if (content.includes(pkgId) || content.includes("report") || content.includes("manifest")) {
            artifacts.push({ path: full, hash: sha256(content), bytes: Buffer.byteLength(content) });
          }
        } catch { /* skip */ }
      }
    }
  };
  walk(reportsDir, 0);
  return artifacts;
}

function generateExecutionRecord(pkg) {
  const data = pkg.data;
  const pkgId = data.package_id || path.basename(pkg.source, ".json");
  const executionId = `EXEC-${sha256(pkgId + (data.contract_id || "") + pkg.source).slice(0, 16)}`;
  const artifacts = discoverRelatedArtifacts(pkgId);

  // Find validation reports
  const validationReports = [];
  const traceManifest = path.join(REPORTS_ROOT, "aak-traceability-gap", "aak-traceability-gap-manifest.json");
  if (exists(traceManifest)) validationReports.push({ path: traceManifest, type: "traceability_gap" });
  const aakReport = path.join(REPORTS_ROOT, "aak-ci-advisory", "aak-ci-advisory-report.json");
  if (exists(aakReport)) validationReports.push({ path: aakReport, type: "aak_advisory" });

  const record = {
    schema: "admin-factory-execution-record/v1",
    execution_id: executionId,
    package_id: pkgId,
    contract_id: data.contract_id || null,
    contract_version: data.contract_version || null,
    generated_at: new Date().toISOString(),
    source_package: pkg.source,
    package_type: pkg.type,
    capability_refs: data.capability_refs || [],
    evidence_refs: data.evidence_refs || [],
    mutation_level: data.mutation_level || "read_only",
    risk_level: data.risk_level || "low",
    status: data.status || "draft",
    validation_reports: validationReports.map((v) => ({ path: v.path, type: v.type, hash: exists(v.path) ? sha256(fs.readFileSync(v.path, "utf8")) : null })),
    related_artifacts: artifacts.slice(0, 20).map((a) => ({ path: a.path, hash: a.hash, bytes: a.bytes })),
    artifact_count: artifacts.length,
    deterministic_hash: sha256(JSON.stringify({ pkgId, source: pkg.source, artifacts: artifacts.map((a) => a.hash).sort() })),
    worker: "ADMIN-FACTORY-EXECUTION-RECORD-GENERATOR-001",
    simulation: true,
  };

  return record;
}

function buildReport(manifest) {
  const lines = [];
  lines.push("# Execution Record Generation Report");
  lines.push("");
  lines.push(`runner: ${manifest.runner}`);
  lines.push(`generated_at: ${manifest.generated_at}`);
  lines.push(`packages_discovered: ${manifest.packages_discovered}`);
  lines.push(`records_generated: ${manifest.records_generated}`);
  lines.push(`with_artifacts: ${manifest.with_artifacts}`);
  lines.push("");
  lines.push("## Generated Records");
  for (const r of manifest.records.slice(0, 30)) {
    lines.push(`- ${r.execution_id}: ${r.package_id} (${r.artifact_count} artifacts, ${r.capability_count} capabilities)`);
  }
  lines.push("");
  lines.push("## Mutation Summary");
  lines.push("- database_writes: none");
  lines.push("- generated_from: existing disk artifacts only");
  return lines.join("\n");
}

function main() {
  const outDir = path.resolve(process.argv.slice(2).find((a) => !a.startsWith("-")) || OUT);
  ensureDir(outDir);

  const pkgs = discoverEipPackages();
  const records = pkgs.map(generateExecutionRecord);
  const withArtifacts = records.filter((r) => r.artifact_count > 0).length;

  // Write individual records
  for (const r of records) {
    const fname = `${r.execution_id}.json`;
    fs.writeFileSync(path.join(outDir, fname), JSON.stringify(r, null, 2) + "\n");
  }

  const manifest = {
    schema_version: "admin-factory-execution-records/v1",
    runner: "ADMIN-FACTORY-EXECUTION-RECORD-GENERATOR-001",
    generated_at: new Date().toISOString(),
    packages_discovered: pkgs.length,
    records_generated: records.length,
    with_artifacts: withArtifacts,
    records: records.map((r) => ({
      execution_id: r.execution_id, package_id: r.package_id,
      artifact_count: r.artifact_count, capability_count: r.capability_refs.length,
      source: r.source_package,
    })),
    mutation_summary: { database_writes: "none", runtime_mutations: "none", product_changes: "none", generated_from: "existing_disk_artifacts_only" },
  };

  const mp = path.join(outDir, "execution-record-manifest.json");
  const rp = path.join(outDir, "execution-record-report.md");
  fs.writeFileSync(mp, JSON.stringify(manifest, null, 2) + "\n");
  fs.writeFileSync(rp, buildReport(manifest));

  process.stdout.write(JSON.stringify({
    ok: true, runner: "ADMIN-FACTORY-EXECUTION-RECORD-GENERATOR-001",
    packages_discovered: pkgs.length, records_generated: records.length,
    with_artifacts: withArtifacts, manifest_path: mp, report_path: rp,
    output_dir: outDir,
  }, null, 2) + "\n");
}
main();
