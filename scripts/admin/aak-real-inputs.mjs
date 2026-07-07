#!/usr/bin/env node
/**
 * AAK-REAL-INPUTS-001 — Real Input Discovery
 *
 * Replaces bundled fixture references with deterministic discovery of real
 * EIP/EIPC packages, validation reports, ownership subjects, and lifecycle
 * execution records from the live repository state.
 *
 * Falls back to fixtures when no real inputs exist in any category.
 * Selection is deterministic: sorted by path, deduplicated by content hash.
 *
 * Safety: READ_ONLY. No writes outside the configured output directory.
 */

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "../..");

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const DISCOVERY_ROOTS = {
  packets: path.join(repoRoot, "state/packets"),
  reports: path.join(repoRoot, "reports"),
  artifacts: path.join(repoRoot, "artifacts"),
  fixtures: path.join(repoRoot, "fixtures/admin"),
};

const FIXTURE_FALLBACKS = {
  eipcValid: path.join(repoRoot, "fixtures/admin/eipc/valid-eip-001.json"),
  eipcInvalid: path.join(repoRoot, "fixtures/admin/eipc/invalid-missing-required.json"),
  lifecycleValid: path.join(repoRoot, "fixtures/admin/aak/lifecycle-valid.json"),
  lifecycleInvalid: path.join(repoRoot, "fixtures/admin/aak/lifecycle-invalid.json"),
  ownershipValid: path.join(repoRoot, "fixtures/admin/aak/ownership-valid.json"),
  ownershipInvalid: path.join(repoRoot, "fixtures/admin/aak/ownership-invalid.json"),
};

const DEFAULT_OUTPUT_DIR = path.join("/Users/admin/autorun/reports", "aak-real-inputs");

// Categories we try to fill with real inputs
const INPUT_CATEGORIES = [
  "eipc",
  "lifecycle_execution",
  "ownership_subject",
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function exists(filePath) {
  return fs.existsSync(filePath);
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return null;
  }
}

function sha256(content) {
  return crypto.createHash("sha256").update(content).digest("hex");
}

function fileHash(filePath) {
  try {
    return sha256(fs.readFileSync(filePath, "utf8"));
  } catch {
    return null;
  }
}

function walkJsonFiles(rootDir) {
  const results = [];
  if (!exists(rootDir)) return results;

  const stack = [rootDir];
  while (stack.length > 0) {
    const dir = stack.pop();
    let entries;
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        stack.push(fullPath);
      } else if (entry.isFile() && entry.name.endsWith(".json")) {
        results.push(fullPath);
      }
    }
  }
  return results.sort();
}

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

// ---------------------------------------------------------------------------
// Classifiers — determine what kind of input a JSON file is
// ---------------------------------------------------------------------------

function classifyFile(filePath) {
  const data = readJson(filePath);
  if (!data) return { path: filePath, categories: [], confidence: 0 };

  const categories = [];

  // EIPC package: has package_id, contract_id, capability_refs, mutation_level
  if (
    typeof data.package_id === "string" &&
    typeof data.contract_id === "string" &&
    (Array.isArray(data.capability_refs) || typeof data.mutation_level === "string")
  ) {
    categories.push("eipc");
  }

  // Lifecycle execution record: has execution_id, transition, package_id
  if (
    typeof data.execution_id === "string" &&
    (isPlainObject(data.transition) || typeof data.transition === "string")
  ) {
    categories.push("lifecycle_execution");
  }

  // Ownership subject: has subject_type, owner_team
  if (
    typeof data.subject_type === "string" &&
    typeof data.owner_team === "string"
  ) {
    categories.push("ownership_subject");
  }

  // AAK advisory report: has mode, checks array
  if (
    typeof data.mode === "string" &&
    Array.isArray(data.checks)
  ) {
    categories.push("aak_advisory");
  }

  // Validation report: has validator field, ok boolean
  if (
    typeof data.validator === "string" &&
    typeof data.ok === "boolean"
  ) {
    categories.push("validation_report");
  }

  return {
    path: filePath,
    categories,
    confidence: categories.length,
    package_id: data.package_id ?? null,
    execution_id: data.execution_id ?? null,
    subject_type: data.subject_type ?? null,
    ok: typeof data.ok === "boolean" ? data.ok : null,
    hash: fileHash(filePath),
  };
}

// ---------------------------------------------------------------------------
// Deterministic selection
// ---------------------------------------------------------------------------

function selectByCategory(classified, category, preferOk = null) {
  const matches = classified
    .filter((c) => c.categories.includes(category))
    .sort((a, b) => a.path.localeCompare(b.path));

  // Deduplicate by content hash
  const seen = new Set();
  const unique = [];
  for (const match of matches) {
    if (match.hash && !seen.has(match.hash)) {
      seen.add(match.hash);
      unique.push(match);
    }
  }

  if (preferOk === true) return unique.filter((m) => m.ok === true);
  if (preferOk === false) return unique.filter((m) => m.ok === false);
  return unique;
}

function pickInputs(classified) {
  const result = {};

  // EIPC: prefer valid first, then invalid
  const eipcAll = selectByCategory(classified, "eipc");
  const eipcOk = eipcAll.filter((m) => m.ok !== false);
  const eipcFail = eipcAll.filter((m) => m.ok === false);

  result.eipcValid = eipcOk.length > 0 ? eipcOk[0].path : FIXTURE_FALLBACKS.eipcValid;
  result.eipcInvalid = eipcFail.length > 0 ? eipcFail[0].path : FIXTURE_FALLBACKS.eipcInvalid;

  // Lifecycle: prefer those with execution_id, valid first
  const lifecycleAll = selectByCategory(classified, "lifecycle_execution");
  const lifecycleOk = lifecycleAll.filter((m) => m.ok !== false);
  const lifecycleFail = lifecycleAll.filter((m) => m.ok === false);

  result.lifecycleValid = lifecycleOk.length > 0 ? lifecycleOk[0].path : FIXTURE_FALLBACKS.lifecycleValid;
  result.lifecycleInvalid = lifecycleFail.length > 0 ? lifecycleFail[0].path : FIXTURE_FALLBACKS.lifecycleInvalid;

  // Ownership: valid first
  const ownershipAll = selectByCategory(classified, "ownership_subject");
  const ownershipOk = ownershipAll.filter((m) => m.ok !== false);
  const ownershipFail = ownershipAll.filter((m) => m.ok === false);

  result.ownershipValid = ownershipOk.length > 0 ? ownershipOk[0].path : FIXTURE_FALLBACKS.ownershipValid;
  result.ownershipInvalid = ownershipFail.length > 0 ? ownershipFail[0].path : FIXTURE_FALLBACKS.ownershipInvalid;

  return result;
}

// ---------------------------------------------------------------------------
// Discovery manifest
// ---------------------------------------------------------------------------

function buildDiscoveryManifest(classified, selected, options) {
  const byCategory = {};
  for (const cat of INPUT_CATEGORIES) {
    byCategory[cat] = selectByCategory(classified, cat).map((c) => ({
      path: c.path,
      hash: c.hash,
      ok: c.ok,
      package_id: c.package_id,
      execution_id: c.execution_id,
    }));
  }

  const fallbackUsed = {};
  for (const [key, fixturePath] of Object.entries(FIXTURE_FALLBACKS)) {
    fallbackUsed[key] = selected[key] === fixturePath;
  }

  const realCount = Object.values(fallbackUsed).filter((v) => !v).length;
  const fixtureCount = Object.values(fallbackUsed).filter((v) => v).length;

  return {
    schema_version: "aak-real-inputs-manifest/v1",
    runner: "AAK-REAL-INPUTS-001",
    generated_at: new Date().toISOString(),
    scan_roots: Object.entries(DISCOVERY_ROOTS).map(([name, dir]) => ({
      name,
      path: dir,
      exists: exists(dir),
    })),
    total_files_scanned: classified.length,
    files_by_category: Object.fromEntries(
      INPUT_CATEGORIES.map((cat) => [cat, byCategory[cat].length]),
    ),
    selected_inputs: selected,
    fallback_used: fallbackUsed,
    real_input_count: realCount,
    fixture_fallback_count: fixtureCount,
    all_real: fixtureCount === 0,
    discovery_by_category: byCategory,
    classified_files: classified.map((c) => ({
      path: c.path,
      categories: c.categories,
      ok: c.ok,
      package_id: c.package_id,
    })),
    mutation_summary: {
      database_writes: "none",
      runtime_mutations: "none",
      product_changes: "none",
      push_merge_deploy: "none",
    },
  };
}

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------

function buildReport(manifest) {
  const lines = [];
  lines.push("# AAK Real Inputs Discovery Report");
  lines.push("");
  lines.push(`runner: ${manifest.runner}`);
  lines.push(`generated_at: ${manifest.generated_at}`);
  lines.push(`total_files_scanned: ${manifest.total_files_scanned}`);
  lines.push(`real_input_count: ${manifest.real_input_count}`);
  lines.push(`fixture_fallback_count: ${manifest.fixture_fallback_count}`);
  lines.push(`all_real: ${manifest.all_real}`);
  lines.push("");
  lines.push("## Scan Roots");
  for (const root of manifest.scan_roots) {
    lines.push(`- ${root.name}: ${root.path} (exists=${root.exists})`);
  }
  lines.push("");
  lines.push("## Selected Inputs");
  for (const [key, filePath] of Object.entries(manifest.selected_inputs)) {
    const fallback = manifest.fallback_used[key] ? " (FIXTURE FALLBACK)" : " (REAL)";
    lines.push(`- ${key}: ${filePath}${fallback}`);
  }
  lines.push("");
  lines.push("## Files by Category");
  for (const [cat, count] of Object.entries(manifest.files_by_category)) {
    lines.push(`- ${cat}: ${count} files`);
  }
  lines.push("");
  lines.push("## Category Details");
  for (const [cat, files] of Object.entries(manifest.discovery_by_category)) {
    lines.push(`### ${cat} (${files.length} files)`);
    if (files.length === 0) {
      lines.push("- none found");
    } else {
      for (const f of files.slice(0, 20)) {
        lines.push(`- ${f.path} (ok=${f.ok}, package_id=${f.package_id ?? "null"})`);
      }
      if (files.length > 20) lines.push(`- ... and ${files.length - 20} more`);
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
    outputDir: DEFAULT_OUTPUT_DIR,
    format: "json",
    help: false,
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--output-dir" || arg === "-o") {
      args.outputDir = path.resolve(argv[++i]);
    } else if (arg === "--format" || arg === "-f") {
      args.format = argv[++i];
    } else if (arg === "--help" || arg === "-h") {
      args.help = true;
    }
  }

  return args;
}

function main() {
  const options = parseArgs(process.argv.slice(2).filter((a) => a !== "--"));

  if (options.help) {
    process.stdout.write(
      [
        "usage: node scripts/admin/aak-real-inputs.mjs [--output-dir dir] [--format json|markdown]",
        "",
        "Discovers real EIP/EIPC packages, lifecycle records, and ownership subjects",
        "from the live repository state. Falls back to fixtures when no real inputs exist.",
        "Selection is deterministic: sorted by path, deduplicated by content hash.",
      ].join("\n") + "\n",
    );
    return;
  }

  ensureDir(options.outputDir);

  // Step 1: Walk all discovery roots and classify every JSON file
  const classified = [];
  for (const [name, rootDir] of Object.entries(DISCOVERY_ROOTS)) {
    if (!exists(rootDir)) continue;
    for (const filePath of walkJsonFiles(rootDir)) {
      classified.push(classifyFile(filePath));
    }
  }

  // Step 2: Deterministic selection
  const selected = pickInputs(classified);

  // Step 3: Build manifest
  const manifest = buildDiscoveryManifest(classified, selected, options);

  // Step 4: Write artifacts
  const manifestPath = path.join(options.outputDir, "aak-real-inputs-manifest.json");
  const reportPath = path.join(options.outputDir, "aak-real-inputs-report.md");
  const selectedPath = path.join(options.outputDir, "aak-real-inputs-selected.json");

  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
  fs.writeFileSync(reportPath, buildReport(manifest));
  fs.writeFileSync(selectedPath, JSON.stringify(selected, null, 2) + "\n");

  // Step 5: Output result
  const result = {
    ok: true,
    runner: "AAK-REAL-INPUTS-001",
    total_files_scanned: manifest.total_files_scanned,
    real_input_count: manifest.real_input_count,
    fixture_fallback_count: manifest.fixture_fallback_count,
    all_real: manifest.all_real,
    manifest_path: manifestPath,
    report_path: reportPath,
    selected_path: selectedPath,
    selected_inputs: selected,
    fallback_used: manifest.fallback_used,
  };

  if (options.format === "markdown") {
    process.stdout.write(buildReport(manifest));
  } else {
    process.stdout.write(JSON.stringify(result, null, 2) + "\n");
  }
}

main();
