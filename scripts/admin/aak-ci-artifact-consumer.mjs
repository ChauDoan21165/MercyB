#!/usr/bin/env node
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const defaultInputDir = path.join("/Users/admin/autorun/reports", "aak-ci-advisory");

const expectedArtifacts = [
  {
    id: "advisory_report_json",
    kind: "report",
    format: "json",
    relative_path: "aak-ci-advisory-report.json",
  },
  {
    id: "advisory_report_markdown",
    kind: "report",
    format: "markdown",
    relative_path: "aak-ci-advisory-report.md",
  },
  {
    id: "advisory_delta_json",
    kind: "delta",
    format: "json",
    relative_path: "aak-ci-advisory-delta-report.json",
  },
  {
    id: "advisory_delta_markdown",
    kind: "delta",
    format: "markdown",
    relative_path: "aak-ci-advisory-delta-report.md",
  },
  {
    id: "advisory_summary_snapshot",
    kind: "delta",
    format: "json",
    relative_path: path.join("history", "aak-ci-advisory-summary.json"),
  },
];

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function writeText(filePath, value) {
  fs.writeFileSync(filePath, value.endsWith("\n") ? value : `${value}\n`);
}

function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function stableJson(value) {
  if (Array.isArray(value)) return value.map(stableJson);
  if (!value || typeof value !== "object") return value;
  return Object.keys(value)
    .sort()
    .reduce((acc, key) => {
      acc[key] = stableJson(value[key]);
      return acc;
    }, {});
}

function numberOrNull(value) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function summaryOrNull(report) {
  const summary = report && typeof report === "object" ? report.summary : null;
  if (!summary || typeof summary !== "object") return null;
  return {
    advisory_fail: numberOrNull(summary.advisory_fail),
    advisory_pass: numberOrNull(summary.advisory_pass),
    checks_run: numberOrNull(summary.checks_run),
    skipped: numberOrNull(summary.skipped),
  };
}

function deltaOrNull(report) {
  const delta = report && typeof report === "object" ? report.delta : null;
  if (!delta || typeof delta !== "object") return null;
  return {
    advisory_fail_delta: numberOrNull(delta.advisory_fail_delta),
    advisory_pass_delta: numberOrNull(delta.advisory_pass_delta),
    checks_run_delta: numberOrNull(delta.checks_run_delta),
    skipped_delta: numberOrNull(delta.skipped_delta),
  };
}

function readArtifact(inputDir, spec) {
  const filePath = path.join(inputDir, spec.relative_path);
  if (!fs.existsSync(filePath)) {
    return {
      ...spec,
      present: false,
      readable: false,
      bytes: 0,
      sha256: null,
      json_parse_ok: spec.format === "json" ? false : null,
      error: "missing",
    };
  }

  let raw;
  try {
    raw = fs.readFileSync(filePath, "utf8");
  } catch (error) {
    return {
      ...spec,
      present: true,
      readable: false,
      bytes: 0,
      sha256: null,
      json_parse_ok: spec.format === "json" ? false : null,
      error: `read_error:${String(error?.code ?? error?.message ?? error)}`,
    };
  }

  const artifact = {
    ...spec,
    present: true,
    readable: true,
    bytes: Buffer.byteLength(raw),
    sha256: sha256(raw),
    json_parse_ok: spec.format === "json" ? null : null,
    error: null,
  };

  if (spec.format === "markdown") {
    return {
      ...artifact,
      line_count: raw.length === 0 ? 0 : raw.split(/\r?\n/).length,
    };
  }

  try {
    const parsed = JSON.parse(raw);
    return {
      ...artifact,
      json_parse_ok: true,
      mode: typeof parsed?.mode === "string" ? parsed.mode : null,
      ok: typeof parsed?.ok === "boolean" ? parsed.ok : null,
      blocking: typeof parsed?.blocking === "boolean" ? parsed.blocking : null,
      summary: summaryOrNull(parsed),
      comparison_available: typeof parsed?.comparison_available === "boolean" ? parsed.comparison_available : null,
      delta: deltaOrNull(parsed),
    };
  } catch (error) {
    return {
      ...artifact,
      json_parse_ok: false,
      error: `invalid_json:${String(error?.message ?? error)}`,
    };
  }
}

function buildAvailability(artifacts) {
  const present = artifacts.filter((artifact) => artifact.present);
  const missing = artifacts.filter((artifact) => !artifact.present);
  const unreadable = artifacts.filter((artifact) => artifact.present && !artifact.readable);
  const unparseable = artifacts.filter((artifact) => artifact.format === "json" && artifact.present && artifact.json_parse_ok === false);
  return {
    ok: true,
    workflow_safe: true,
    expected_count: artifacts.length,
    present_count: present.length,
    missing_count: missing.length,
    unreadable_count: unreadable.length,
    unparseable_json_count: unparseable.length,
    report_artifacts_present: present.filter((artifact) => artifact.kind === "report").length,
    delta_artifacts_present: present.filter((artifact) => artifact.kind === "delta").length,
    missing_artifacts: missing.map((artifact) => artifact.id).sort(),
    unreadable_artifacts: unreadable.map((artifact) => artifact.id).sort(),
    unparseable_json_artifacts: unparseable.map((artifact) => artifact.id).sort(),
  };
}

function buildMarkdown(inventory, availability) {
  const lines = [];
  lines.push("# AAK CI Artifact Consumer Summary");
  lines.push("");
  lines.push(`schema_version: ${inventory.schema_version}`);
  lines.push(`input_dir: ${inventory.input_dir}`);
  lines.push(`workflow_safe: ${availability.workflow_safe}`);
  lines.push(`expected_count: ${availability.expected_count}`);
  lines.push(`present_count: ${availability.present_count}`);
  lines.push(`missing_count: ${availability.missing_count}`);
  lines.push(`unparseable_json_count: ${availability.unparseable_json_count}`);
  lines.push("");
  lines.push("## Availability");
  lines.push(`- report_artifacts_present: ${availability.report_artifacts_present}`);
  lines.push(`- delta_artifacts_present: ${availability.delta_artifacts_present}`);
  lines.push(`- missing_artifacts: ${availability.missing_artifacts.length ? availability.missing_artifacts.join(", ") : "none"}`);
  lines.push(`- unreadable_artifacts: ${availability.unreadable_artifacts.length ? availability.unreadable_artifacts.join(", ") : "none"}`);
  lines.push(`- unparseable_json_artifacts: ${availability.unparseable_json_artifacts.length ? availability.unparseable_json_artifacts.join(", ") : "none"}`);
  lines.push("");
  lines.push("## Artifacts");
  for (const artifact of inventory.artifacts) {
    const status = artifact.present ? artifact.readable ? "present" : "unreadable" : "missing";
    const parseStatus = artifact.format === "json" ? ` json_parse_ok=${artifact.json_parse_ok}` : "";
    lines.push(`- ${artifact.id}: ${status}; kind=${artifact.kind}; format=${artifact.format}; bytes=${artifact.bytes}; sha256=${artifact.sha256 ?? "null"};${parseStatus} path=${artifact.relative_path}`);
  }
  lines.push("");
  lines.push("## Mutation Summary");
  lines.push("- database_writes: none");
  lines.push("- runtime_mutations: none");
  lines.push("- product_changes: none");
  lines.push("- push_merge_deploy: none");
  return lines.join("\n");
}

function main() {
  const argv = process.argv.slice(2).filter((arg) => arg !== "--");
  const inputDir = path.resolve(argv[0] ?? defaultInputDir);
  const outputDir = path.resolve(argv[1] ?? path.join(inputDir, "consumer"));
  ensureDir(outputDir);

  const artifacts = expectedArtifacts.map((spec) => readArtifact(inputDir, spec)).sort((a, b) => a.id.localeCompare(b.id));
  const availability = buildAvailability(artifacts);
  const inventory = stableJson({
    schema_version: "aak-ci-artifact-inventory/v1",
    runner: "ADMIN-AAK-CI-ARTIFACT-CONSUMER-001",
    input_dir: inputDir,
    artifacts,
    availability,
    mutation_summary: {
      database_writes: "none",
      runtime_mutations: "none",
      product_changes: "none",
      push_merge_deploy: "none",
    },
  });

  const inventoryPath = path.join(outputDir, "aak-ci-artifact-inventory.json");
  const availabilityPath = path.join(outputDir, "aak-ci-artifact-availability.json");
  const markdownPath = path.join(outputDir, "aak-ci-artifact-consumer-summary.md");
  writeJson(inventoryPath, inventory);
  writeJson(availabilityPath, stableJson(availability));
  writeText(markdownPath, buildMarkdown(inventory, availability));

  process.stdout.write(`${JSON.stringify({
    ok: true,
    workflow_safe: true,
    inventory_path: inventoryPath,
    availability_path: availabilityPath,
    markdown_path: markdownPath,
    availability,
  }, null, 2)}\n`);
}

main();
