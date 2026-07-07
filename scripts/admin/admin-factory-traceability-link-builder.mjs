#!/usr/bin/env node
/**
 * ADMIN-FACTORY-TRACEABILITY-LINK-BUILDER-001
 * Builds deterministic Decision→EIP→Execution→Evidence links.
 * Only creates links supported by deterministic metadata. Never infers.
 */
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const EXEC_DIR = path.join("/Users/admin/autorun/reports", "admin-factory-execution-records");
const BUNDLE_DIR = path.join("/Users/admin/autorun/reports", "admin-factory-evidence-bundles");
const OUT = path.join("/Users/admin/autorun/reports", "admin-factory-traceability-links");

function exists(p) { return fs.existsSync(p); }
function ensureDir(dir) { fs.mkdirSync(dir, { recursive: true }); }
function readJson(f) { try { return JSON.parse(fs.readFileSync(f, "utf8")); } catch { return null; } }
function sha256(s) { return crypto.createHash("sha256").update(s).digest("hex"); }

function buildLinks() {
  const links = [];
  const missing = [];

  // Load execution records
  const execRecords = [];
  if (exists(EXEC_DIR)) {
    for (const f of fs.readdirSync(EXEC_DIR)) {
      if (!f.endsWith(".json") || f === "execution-record-manifest.json") continue;
      const d = readJson(path.join(EXEC_DIR, f));
      if (d) execRecords.push(d);
    }
  }

  // Load evidence bundles
  const bundles = [];
  if (exists(BUNDLE_DIR)) {
    for (const f of fs.readdirSync(BUNDLE_DIR)) {
      if (!f.endsWith(".json") || f === "evidence-bundle-manifest.json") continue;
      const d = readJson(path.join(BUNDLE_DIR, f));
      if (d) bundles.push(d);
    }
  }

  // Build bundle lookup by execution_id
  const bundleByExec = new Map();
  for (const b of bundles) bundleByExec.set(b.execution_id, b);

  for (const rec of execRecords) {
    const pkgId = rec.package_id;
    const execId = rec.execution_id;
    const bundle = bundleByExec.get(execId);

    // Decision → EIP: always present (package has contract_id)
    const d2e = {
      from: "DECISION", to: "EIP",
      present: Boolean(rec.contract_id),
      confidence: rec.contract_id ? 1.0 : 0.0,
      evidence: rec.contract_id ? `contract_id=${rec.contract_id}` : null,
    };

    // EIP → Execution: present if execution record exists
    const e2x = {
      from: "EIP", to: "EXECUTION",
      present: true, // we have an execution record
      confidence: 1.0,
      evidence: `execution_id=${execId}`,
    };

    // Execution → Evidence: present if bundle exists with artifacts
    const x2ev = {
      from: "EXECUTION", to: "EVIDENCE",
      present: bundle && bundle.artifact_count > 0,
      confidence: bundle ? (bundle.artifact_count > 0 ? 1.0 : 0.3) : 0.0,
      evidence: bundle ? `bundle_id=${bundle.bundle_id} (${bundle.artifact_count} artifacts)` : null,
    };

    const allLinks = [d2e, e2x, x2ev];
    const presentLinks = allLinks.filter((l) => l.present);
    const missingLinks = allLinks.filter((l) => !l.present);

    links.push({
      package_id: pkgId,
      execution_id: execId,
      links: allLinks,
      present_count: presentLinks.length,
      missing_count: missingLinks.length,
      total_links: allLinks.length,
      completeness: Math.round((presentLinks.length / allLinks.length) * 100),
      chain: `${d2e.present ? "Decision" : "?"}→${e2x.present ? "EIP" : "?"}→${x2ev.present ? "Execution" : "?"}→${x2ev.present ? "Evidence" : "?"}`,
      confidence: Math.round(allLinks.reduce((s, l) => s + l.confidence, 0) / allLinks.length * 100),
    });

    for (const ml of missingLinks) {
      missing.push({ package_id: pkgId, execution_id: execId, missing_link: `${ml.from}→${ml.to}`, reason: ml.evidence ? `insufficient: ${ml.evidence}` : "no_evidence" });
    }
  }

  return { links, missing };
}

function buildReport(manifest) {
  const lines = [];
  lines.push("# Traceability Link Builder Report");
  lines.push("");
  lines.push(`runner: ${manifest.runner}`);
  lines.push(`generated_at: ${manifest.generated_at}`);
  lines.push(`total_packages: ${manifest.total_packages}`);
  lines.push(`links_built: ${manifest.links_built}`);
  lines.push(`missing_links: ${manifest.missing_links}`);
  lines.push(`avg_completeness: ${manifest.avg_completeness}%`);
  lines.push(`avg_confidence: ${manifest.avg_confidence}%`);
  lines.push("");
  lines.push("## Link Details");
  for (const l of manifest.links.slice(0, 20)) {
    lines.push(`- ${l.package_id}: ${l.chain} (completeness=${l.completeness}%, confidence=${l.confidence}%)`);
  }
  lines.push("");
  lines.push("## Mutation Summary");
  lines.push("- database_writes: none");
  return lines.join("\n");
}

function main() {
  const outDir = path.resolve(process.argv.slice(2).find((a) => !a.startsWith("-")) || OUT);
  ensureDir(outDir);

  const { links, missing } = buildLinks();
  const avgCompleteness = links.length > 0 ? Math.round(links.reduce((s, l) => s + l.completeness, 0) / links.length) : 0;
  const avgConfidence = links.length > 0 ? Math.round(links.reduce((s, l) => s + l.confidence, 0) / links.length) : 0;

  const manifest = {
    schema_version: "admin-factory-traceability-links/v1",
    runner: "ADMIN-FACTORY-TRACEABILITY-LINK-BUILDER-001",
    generated_at: new Date().toISOString(),
    total_packages: links.length,
    links_built: links.reduce((s, l) => s + l.present_count, 0),
    missing_links: missing.length,
    avg_completeness: avgCompleteness,
    avg_confidence: avgConfidence,
    links,
    missing,
    mutation_summary: { database_writes: "none", runtime_mutations: "none", product_changes: "none" },
  };

  const lp = path.join(outDir, "traceability_links.json");
  const mp = path.join(outDir, "missing_links.json");
  const rp = path.join(outDir, "traceability-link-report.md");
  const cp = path.join(outDir, "confidence_report.json");

  fs.writeFileSync(lp, JSON.stringify({ links: manifest.links }, null, 2) + "\n");
  fs.writeFileSync(mp, JSON.stringify({ missing_links: manifest.missing, count: missing.length }, null, 2) + "\n");
  fs.writeFileSync(cp, JSON.stringify({ avg_completeness: avgCompleteness, avg_confidence: avgConfidence, per_package: links.map((l) => ({ package_id: l.package_id, completeness: l.completeness, confidence: l.confidence })) }, null, 2) + "\n");
  fs.writeFileSync(rp, buildReport(manifest));

  process.stdout.write(JSON.stringify({
    ok: true, runner: "ADMIN-FACTORY-TRACEABILITY-LINK-BUILDER-001",
    total_packages: links.length, links_built: manifest.links_built,
    missing_links: missing.length, avg_completeness: avgCompleteness,
    traceability_links_path: lp, missing_links_path: mp, confidence_report_path: cp,
  }, null, 2) + "\n");
}
main();
