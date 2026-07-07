#!/usr/bin/env node
/**
 * ADMIN-FACTORY-JUDGE-PACKAGE-GENERATOR-001
 * Auto-prepares Judge-ready packages. Does NOT verify. Judge remains independent.
 */
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPORTS_ROOT = process.env.ADMIN_FACTORY_REPORTS_ROOT || "/Users/admin/autorun/reports";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const EXEC_DIR = path.join(REPORTS_ROOT, "admin-factory-execution-records");
const BUNDLE_DIR = path.join(REPORTS_ROOT, "admin-factory-evidence-bundles");
const LINK_DIR = path.join(REPORTS_ROOT, "admin-factory-traceability-links");
const OUT = path.join(REPORTS_ROOT, "admin-factory-judge-packages");

function exists(p) { return fs.existsSync(p); }
function ensureDir(dir) { fs.mkdirSync(dir, { recursive: true }); }
function readJson(f) { try { return JSON.parse(fs.readFileSync(f, "utf8")); } catch { return null; } }
function sha256(s) { return crypto.createHash("sha256").update(s).digest("hex"); }

function generateJudgePackages() {
  const packages = [];

  if (!exists(EXEC_DIR)) return packages;

  for (const f of fs.readdirSync(EXEC_DIR)) {
    if (!f.endsWith(".json") || f === "execution-record-manifest.json") continue;
    const exec = readJson(path.join(EXEC_DIR, f));
    if (!exec) continue;

    const pkgId = exec.package_id;
    const execId = exec.execution_id;

    // Find bundle
    let bundle = null;
    if (exists(BUNDLE_DIR)) {
      for (const bf of fs.readdirSync(BUNDLE_DIR)) {
        if (!bf.endsWith(".json") || bf === "evidence-bundle-manifest.json") continue;
        const b = readJson(path.join(BUNDLE_DIR, bf));
        if (b?.execution_id === execId) { bundle = b; break; }
      }
    }

    // Find traceability
    let traceability = null;
    const linkPath = path.join(LINK_DIR, "traceability_links.json");
    if (exists(linkPath)) {
      const links = readJson(linkPath);
      if (links?.links) {
        traceability = links.links.find((l) => l.package_id === pkgId) || null;
      }
    }

    // Collect all artifact hashes
    const bundleHashes = bundle?.artifact_hashes || [];
    const execHash = sha256(JSON.stringify(exec));

    const judgePkg = {
      schema: "admin-factory-judge-package/v1",
      judge_package_id: `JUDGE-${sha256(pkgId + execId).slice(0, 16)}`,
      package_id: pkgId,
      execution_id: execId,
      generated_at: new Date().toISOString(),
      execution_record: {
        path: path.join(EXEC_DIR, f),
        execution_id: execId,
        hash: execHash,
        status: exec.status,
        mutation_level: exec.mutation_level,
        risk_level: exec.risk_level,
      },
      evidence_bundle: bundle ? {
        bundle_id: bundle.bundle_id,
        artifact_count: bundle.artifact_count,
        total_bytes: bundle.total_bytes,
        completeness: bundle.completeness,
        bundle_hash: bundle.bundle_hash,
        has_replay: bundle.has_replay,
        has_validation: bundle.has_validation,
      } : null,
      traceability: traceability ? {
        completeness: traceability.completeness,
        confidence: traceability.confidence,
        chain: traceability.chain,
        present_links: traceability.present_count,
        missing_links: traceability.missing_count,
      } : null,
      artifact_hashes: bundleHashes,
      judge_ready: Boolean(bundle && bundle.completeness !== "empty" && traceability && traceability.completeness >= 50),
      readiness_factors: {
        has_execution_record: true,
        has_evidence_bundle: bundle !== null,
        has_non_empty_bundle: bundle ? bundle.completeness !== "empty" : false,
        has_traceability: traceability !== null,
        has_replay: bundle?.has_replay || false,
        has_validation: bundle?.has_validation || false,
        completeness_sufficient: traceability ? traceability.completeness >= 50 : false,
      },
      judge_note: "This package is prepared for Judge review. No verification has been performed. Judge remains independent.",
      simulation: true,
    };

    packages.push(judgePkg);
  }

  return packages;
}

function buildReport(manifest) {
  const lines = [];
  lines.push("# Judge Package Generation Report");
  lines.push("");
  lines.push(`runner: ${manifest.runner}`);
  lines.push(`generated_at: ${manifest.generated_at}`);
  lines.push(`total_packages: ${manifest.total_packages}`);
  lines.push(`judge_ready: ${manifest.judge_ready}`);
  lines.push(`not_ready: ${manifest.total_packages - manifest.judge_ready}`);
  lines.push("");
  lines.push("## Packages");
  for (const p of manifest.packages.slice(0, 20)) {
    const status = p.judge_ready ? "READY" : "NOT_READY";
    lines.push(`- [${status}] ${p.judge_package_id}: ${p.package_id} (bundle=${p.readiness_factors.has_evidence_bundle}, traceability=${p.readiness_factors.has_traceability}, replay=${p.readiness_factors.has_replay})`);
  }
  lines.push("");
  lines.push("## Note");
  lines.push("Judge remains independent. No verification has been performed.");
  lines.push("");
  lines.push("## Mutation Summary");
  lines.push("- database_writes: none");
  return lines.join("\n");
}

function main() {
  const outDir = path.resolve(process.argv.slice(2).find((a) => !a.startsWith("-")) || OUT);
  ensureDir(outDir);

  const packages = generateJudgePackages();
  for (const p of packages) {
    fs.writeFileSync(path.join(outDir, `${p.judge_package_id}.json`), JSON.stringify(p, null, 2) + "\n");
  }

  const judgeReady = packages.filter((p) => p.judge_ready).length;

  const manifest = {
    schema_version: "admin-factory-judge-packages/v1",
    runner: "ADMIN-FACTORY-JUDGE-PACKAGE-GENERATOR-001",
    generated_at: new Date().toISOString(),
    total_packages: packages.length,
    judge_ready: judgeReady,
    packages: packages.map((p) => ({
      judge_package_id: p.judge_package_id, package_id: p.package_id,
      judge_ready: p.judge_ready, readiness_factors: p.readiness_factors,
    })),
    mutation_summary: { database_writes: "none", runtime_mutations: "none", product_changes: "none", judge_independent: true },
  };

  const mp = path.join(outDir, "judge-package-manifest.json");
  const rp = path.join(outDir, "judge-package-report.md");
  fs.writeFileSync(mp, JSON.stringify(manifest, null, 2) + "\n");
  fs.writeFileSync(rp, buildReport(manifest));

  process.stdout.write(JSON.stringify({
    ok: true, runner: "ADMIN-FACTORY-JUDGE-PACKAGE-GENERATOR-001",
    total_packages: packages.length, judge_ready: judgeReady,
    manifest_path: mp, report_path: rp,
  }, null, 2) + "\n");
}
main();
