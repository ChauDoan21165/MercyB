#!/usr/bin/env node
/**
 * AAK-CI-ARTIFACT-CONSUMER-001 — Integrated Artifact Consumer v2
 *
 * Integrates aak-real-inputs discovery with CI artifact consumption.
 * Instead of a single hardcoded input directory, this consumer:
 *
 * 1. Discovers real advisory artifact locations using the same scan roots
 *    as aak-real-inputs (state/packets, reports, artifacts, fixtures)
 * 2. Collects all JSON/MD artifacts matching known advisory patterns
 * 3. Deduplicates by content hash (deterministic)
 * 4. Produces a normalized, unified artifact manifest
 *
 * Backward-compatible: also accepts a single --input-dir for the legacy path.
 *
 * Safety: READ_ONLY. No writes outside the configured output directory.
 */

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "../..");

const DEFAULT_OUTPUT_DIR = path.join("/Users/admin/autorun/reports", "aak-ci-artifact-consumer");

// ---------------------------------------------------------------------------
// Scan roots — mirrors aak-real-inputs discovery roots
// ---------------------------------------------------------------------------

const SCAN_ROOTS = [
  { name: "reports", path: path.join(repoRoot, "reports") },
  { name: "artifacts", path: path.join(repoRoot, "artifacts") },
  { name: "state_packets", path: path.join(repoRoot, "state/packets") },
];

// ---------------------------------------------------------------------------
// Known advisory artifact filename patterns
// ---------------------------------------------------------------------------

const ADVISORY_PATTERNS = [
  { pattern: /^aak-ci-advisory-report\.json$/, kind: "report", format: "json" },
  { pattern: /^aak-ci-advisory-report\.md$/, kind: "report", format: "markdown" },
  { pattern: /^aak-ci-advisory-delta-report\.json$/, kind: "delta", format: "json" },
  { pattern: /^aak-ci-advisory-delta-report\.md$/, kind: "delta", format: "markdown" },
  { pattern: /^aak-ci-advisory-summary\.json$/, kind: "delta", format: "json" },
  // Extended patterns — catch real-inputs, traceability, ownership artifacts too
  { pattern: /^aak-real-inputs-manifest\.json$/, kind: "discovery", format: "json" },
  { pattern: /^aak-real-inputs-report\.md$/, kind: "discovery", format: "markdown" },
  { pattern: /^aak-traceability-gap-manifest\.json$/, kind: "traceability", format: "json" },
  { pattern: /^aak-traceability-gap-report\.md$/, kind: "traceability", format: "markdown" },
  { pattern: /^aak-ownership-registry-health\.json$/, kind: "ownership", format: "json" },
  { pattern: /^aak-ownership-registry-report\.md$/, kind: "ownership", format: "markdown" },
  { pattern: /^FACTORY_REPORT_FOR_CHATGPT\.md$/, kind: "factory_report", format: "markdown" },
];

const LEGACY_EXPECTED = [
  { id: "advisory_report_json", kind: "report", format: "json", filename: "aak-ci-advisory-report.json" },
  { id: "advisory_report_markdown", kind: "report", format: "markdown", filename: "aak-ci-advisory-report.md" },
  { id: "advisory_delta_json", kind: "delta", format: "json", filename: "aak-ci-advisory-delta-report.json" },
  { id: "advisory_delta_markdown", kind: "delta", format: "markdown", filename: "aak-ci-advisory-delta-report.md" },
  { id: "advisory_summary_snapshot", kind: "delta", format: "json", filename: "aak-ci-advisory-summary.json", altDir: "history" },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function exists(p) { return fs.existsSync(p); }
function ensureDir(dir) { fs.mkdirSync(dir, { recursive: true }); }

function sha256(content) {
  return crypto.createHash("sha256").update(content).digest("hex");
}

function readJson(filePath) {
  try { return JSON.parse(fs.readFileSync(filePath, "utf8")); }
  catch { return null; }
}

function numberOrNull(value) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function summaryOrNull(report) {
  const s = report && typeof report === "object" ? report.summary : null;
  if (!s || typeof s !== "object") return null;
  return {
    advisory_fail: numberOrNull(s.advisory_fail),
    advisory_pass: numberOrNull(s.advisory_pass),
    checks_run: numberOrNull(s.checks_run),
    skipped: numberOrNull(s.skipped),
  };
}

function deltaOrNull(report) {
  const d = report && typeof report === "object" ? report.delta : null;
  if (!d || typeof d !== "object") return null;
  return {
    advisory_fail_delta: numberOrNull(d.advisory_fail_delta),
    advisory_pass_delta: numberOrNull(d.advisory_pass_delta),
    checks_run_delta: numberOrNull(d.checks_run_delta),
    skipped_delta: numberOrNull(d.skipped_delta),
  };
}

function stableJson(value) {
  if (Array.isArray(value)) return value.map(stableJson);
  if (!value || typeof value !== "object") return value;
  return Object.keys(value).sort().reduce((acc, key) => {
    acc[key] = stableJson(value[key]);
    return acc;
  }, {});
}

// ---------------------------------------------------------------------------
// Discovery — walk scan roots for advisory artifacts
// ---------------------------------------------------------------------------

function walkJsonFiles(rootDir) {
  const results = [];
  if (!exists(rootDir)) return results;
  const stack = [rootDir];
  while (stack.length > 0) {
    const dir = stack.pop();
    let entries;
    try { entries = fs.readdirSync(dir, { withFileTypes: true }); }
    catch { continue; }
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        // Skip node_modules, .git, history subdirs deeper than 1 level
        if (entry.name === "node_modules" || entry.name === ".git") continue;
        stack.push(full);
      } else if (entry.isFile() && (entry.name.endsWith(".json") || entry.name.endsWith(".md"))) {
        results.push(full);
      }
    }
  }
  return results.sort();
}

function classifyDiscoveredFile(filePath) {
  const basename = path.basename(filePath);
  for (const ap of ADVISORY_PATTERNS) {
    if (ap.pattern.test(basename)) {
      return { ...ap, filePath, basename };
    }
  }
  return null;
}

function readDiscoveredArtifact(filePath, classification) {
  let raw;
  try { raw = fs.readFileSync(filePath, "utf8"); }
  catch (e) {
    return {
      path: filePath,
      kind: classification.kind,
      format: classification.format,
      present: true,
      readable: false,
      bytes: 0,
      sha256: null,
      error: `read_error:${String(e.code ?? e.message ?? e)}`,
    };
  }

  const artifact = {
    path: filePath,
    kind: classification.kind,
    format: classification.format,
    present: true,
    readable: true,
    bytes: Buffer.byteLength(raw),
    sha256: sha256(raw),
  };

  if (classification.format === "markdown") {
    return {
      ...artifact,
      line_count: raw.length === 0 ? 0 : raw.split(/\r?\n/).length,
      content_preview: raw.slice(0, 200),
    };
  }

  // JSON — parse and extract metadata
  try {
    const parsed = JSON.parse(raw);
    return {
      ...artifact,
      json_parse_ok: true,
      mode: typeof parsed?.mode === "string" ? parsed.mode : null,
      ok: typeof parsed?.ok === "boolean" ? parsed.ok : null,
      blocking: typeof parsed?.blocking === "boolean" ? parsed.blocking : null,
      runner: typeof parsed?.runner === "string" ? parsed.runner : null,
      schema_version: typeof parsed?.schema_version === "string" ? parsed.schema_version : null,
      summary: summaryOrNull(parsed),
      comparison_available: typeof parsed?.comparison_available === "boolean" ? parsed.comparison_available : null,
      delta: deltaOrNull(parsed),
      generated_at: typeof parsed?.generated_at === "string" ? parsed.generated_at : null,
    };
  } catch (e) {
    return {
      ...artifact,
      json_parse_ok: false,
      error: `invalid_json:${String(e.message ?? e)}`,
    };
  }
}

// ---------------------------------------------------------------------------
// Legacy directory scan — for backward compatibility
// ---------------------------------------------------------------------------

function scanLegacyDir(inputDir) {
  return LEGACY_EXPECTED.map((spec) => {
    // Check primary path first, then altDir if specified
    const primaryPath = path.join(inputDir, spec.filename);
    const altPath = spec.altDir ? path.join(inputDir, spec.altDir, spec.filename) : null;

    let filePath = null;
    if (exists(primaryPath)) filePath = primaryPath;
    else if (altPath && exists(altPath)) filePath = altPath;

    if (!filePath) {
      return { ...spec, present: false, readable: false, bytes: 0, sha256: null, error: "missing" };
    }
    return readDiscoveredArtifact(filePath, { kind: spec.kind, format: spec.format });
  });
}

// ---------------------------------------------------------------------------
// Deduplication
// ---------------------------------------------------------------------------

function deduplicateArtifacts(artifacts) {
  const seen = new Map(); // sha256 -> artifact
  const duplicates = [];

  for (const art of artifacts) {
    if (!art.sha256) continue;
    if (seen.has(art.sha256)) {
      duplicates.push({
        kept: seen.get(art.sha256).path,
        dropped: art.path,
        sha256: art.sha256,
        kind: art.kind,
      });
    } else {
      seen.set(art.sha256, art);
    }
  }

  return {
    unique: [...seen.values()].sort((a, b) => (a.path || "").localeCompare(b.path || "")),
    duplicates,
    duplicate_count: duplicates.length,
  };
}

// ---------------------------------------------------------------------------
// Availability
// ---------------------------------------------------------------------------

function buildAvailability(artifacts, legacyExpected) {
  const present = artifacts.filter((a) => a.present);
  const missing = legacyExpected.filter((le) => !artifacts.some((a) => a.present && path.basename(a.path) === le.filename));
  const unreadable = artifacts.filter((a) => a.present && !a.readable);
  const unparseable = artifacts.filter((a) => a.format === "json" && a.present && a.json_parse_ok === false);

  return {
    ok: true,
    workflow_safe: true,
    total_discovered: artifacts.length,
    present_count: present.length,
    legacy_expected_count: legacyExpected.length,
    legacy_missing_count: missing.length,
    unreadable_count: unreadable.length,
    unparseable_json_count: unparseable.length,
    report_artifacts_present: present.filter((a) => a.kind === "report").length,
    delta_artifacts_present: present.filter((a) => a.kind === "delta").length,
    discovery_artifacts_present: present.filter((a) => a.kind === "discovery").length,
    traceability_artifacts_present: present.filter((a) => a.kind === "traceability").length,
    ownership_artifacts_present: present.filter((a) => a.kind === "ownership").length,
    legacy_missing: missing.map((m) => m.filename).sort(),
    unreadable_paths: unreadable.map((a) => a.path).sort(),
    unparseable_paths: unparseable.map((a) => a.path).sort(),
  };
}

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------

function buildReport(manifest) {
  const lines = [];
  lines.push("# AAK CI Artifact Consumer Report (v2 — Integrated)");
  lines.push("");
  lines.push(`runner: ${manifest.runner}`);
  lines.push(`schema_version: ${manifest.schema_version}`);
  lines.push(`generated_at: ${manifest.generated_at}`);
  lines.push(`scan_roots: ${manifest.scan_roots.map((r) => r.name).join(", ")}`);
  lines.push(`discovery_mode: ${manifest.discovery_mode}`);
  lines.push("");
  lines.push("## Availability");
  const a = manifest.availability;
  lines.push(`- total_discovered: ${a.total_discovered}`);
  lines.push(`- present_count: ${a.present_count}`);
  lines.push(`- legacy_missing_count: ${a.legacy_missing_count}`);
  lines.push(`- unreadable_count: ${a.unreadable_count}`);
  lines.push(`- unparseable_json_count: ${a.unparseable_json_count}`);
  lines.push(`- duplicates_dropped: ${manifest.duplicate_count}`);
  lines.push("");
  lines.push("## By Kind");
  lines.push(`- report: ${a.report_artifacts_present}`);
  lines.push(`- delta: ${a.delta_artifacts_present}`);
  lines.push(`- discovery: ${a.discovery_artifacts_present}`);
  lines.push(`- traceability: ${a.traceability_artifacts_present}`);
  lines.push(`- ownership: ${a.ownership_artifacts_present}`);
  lines.push("");
  if (a.legacy_missing.length > 0) {
    lines.push("## Legacy Missing");
    for (const m of a.legacy_missing) lines.push(`- ${m}`);
    lines.push("");
  }
  lines.push("## Discovered Artifacts");
  for (const art of manifest.artifacts.slice(0, 50)) {
    const status = art.present ? (art.readable ? "OK" : "UNREADABLE") : "MISSING";
    const parseInfo = art.format === "json" ? ` parse=${art.json_parse_ok ?? "N/A"}` : "";
    lines.push(`- [${status}] ${art.kind}/${art.format}: ${art.path} (${art.bytes ?? 0}B, sha256=${(art.sha256 ?? "").slice(0, 12)})${parseInfo}`);
  }
  if (manifest.artifacts.length > 50) {
    lines.push(`- ... and ${manifest.artifacts.length - 50} more`);
  }
  lines.push("");
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
    inputDir: null,
    outputDir: DEFAULT_OUTPUT_DIR,
    discover: false,
    legacyOnly: false,
    help: false,
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--input-dir" || arg === "-i") {
      args.inputDir = path.resolve(argv[++i]);
    } else if (arg === "--output-dir" || arg === "-o") {
      args.outputDir = path.resolve(argv[++i]);
    } else if (arg === "--discover" || arg === "-d") {
      args.discover = true;
    } else if (arg === "--legacy-only") {
      args.legacyOnly = true;
    } else if (arg === "--help" || arg === "-h") {
      args.help = true;
    } else if (!arg.startsWith("-")) {
      // First positional = input dir (backward compat)
      if (!args.inputDir) args.inputDir = path.resolve(arg);
      else args.outputDir = path.resolve(arg);
    }
  }

  return args;
}

function main() {
  const options = parseArgs(process.argv.slice(2).filter((a) => a !== "--"));

  if (options.help) {
    process.stdout.write(
      [
        "usage: node scripts/admin/aak-ci-artifact-consumer-v2.mjs [options]",
        "",
        "Integrated CI artifact consumer with real-inputs discovery.",
        "",
        "options:",
        "  --discover, -d        Enable discovery mode (scan all known roots)",
        "  --input-dir, -i <dir> Single input directory (legacy mode)",
        "  --output-dir, -o <dir> Output directory for artifacts",
        "  --legacy-only          Only check legacy 5 expected artifacts",
        "",
        "Without --discover, behaves like the v1 consumer (single input dir).",
        "With --discover, scans state/packets, reports, artifacts, and autorun/reports.",
      ].join("\n") + "\n",
    );
    return;
  }

  ensureDir(options.outputDir);

  // Determine discovery mode
  const discoveryMode = options.discover || !options.inputDir;

  let allArtifacts = [];
  const scanRootsUsed = [];

  if (discoveryMode) {
    // Discovery mode: walk all scan roots
    for (const root of SCAN_ROOTS) {
      if (!exists(root.path)) continue;
      scanRootsUsed.push(root);
      for (const filePath of walkJsonFiles(root.path)) {
        const classification = classifyDiscoveredFile(filePath);
        if (classification) {
          allArtifacts.push(readDiscoveredArtifact(filePath, classification));
        }
      }
    }
  }

  // Also scan legacy input dir if provided
  if (options.inputDir && exists(options.inputDir)) {
    const legacy = scanLegacyDir(options.inputDir);
    allArtifacts.push(...legacy);
  }

  // If no discovery and no input dir, fall back to default legacy path
  if (!discoveryMode && !options.inputDir) {
    const defaultLegacyDir = path.join("/Users/admin/autorun/reports", "aak-ci-advisory");
    if (exists(defaultLegacyDir)) {
      allArtifacts.push(...scanLegacyDir(defaultLegacyDir));
    }
  }

  // Deduplicate
  const { unique, duplicates, duplicate_count } = deduplicateArtifacts(allArtifacts);

  // Build availability
  const availability = buildAvailability(unique, LEGACY_EXPECTED);

  // Build manifest
  const manifest = stableJson({
    schema_version: "aak-ci-artifact-inventory/v2",
    runner: "AAK-CI-ARTIFACT-CONSUMER-001",
    generated_at: new Date().toISOString(),
    discovery_mode: discoveryMode,
    scan_roots: scanRootsUsed.map((r) => ({ name: r.name, path: r.path })),
    artifacts: unique,
    duplicates,
    duplicate_count,
    availability,
    legacy_spec: LEGACY_EXPECTED.map((le) => le.filename),
    mutation_summary: {
      database_writes: "none",
      runtime_mutations: "none",
      product_changes: "none",
      push_merge_deploy: "none",
    },
  });

  // Write artifacts
  const inventoryPath = path.join(options.outputDir, "aak-ci-artifact-inventory-v2.json");
  const availabilityPath = path.join(options.outputDir, "aak-ci-artifact-availability-v2.json");
  const reportPath = path.join(options.outputDir, "aak-ci-artifact-consumer-v2-report.md");

  fs.writeFileSync(inventoryPath, JSON.stringify(manifest, null, 2) + "\n");
  fs.writeFileSync(availabilityPath, JSON.stringify(stableJson(availability), null, 2) + "\n");
  fs.writeFileSync(reportPath, buildReport(manifest));

  // Output
  process.stdout.write(JSON.stringify({
    ok: true,
    workflow_safe: true,
    runner: "AAK-CI-ARTIFACT-CONSUMER-001",
    discovery_mode: discoveryMode,
    total_discovered: unique.length,
    duplicate_count,
    inventory_path: inventoryPath,
    availability_path: availabilityPath,
    report_path: reportPath,
    availability,
  }, null, 2) + "\n");
}

main();
