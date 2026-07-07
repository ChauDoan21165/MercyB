#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const defaultCurrentReport = path.join("/Users/admin/autorun/reports", "aak-ci-advisory", "aak-ci-advisory-report.json");
const defaultPreviousReport = path.join("/Users/admin/autorun/reports", "aak-ci-advisory", "previous", "aak-ci-advisory-report.json");
const summarySnapshotFile = "aak-ci-advisory-summary.json";

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function exists(filePath) {
  return filePath ? fs.existsSync(filePath) : false;
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function safeSummary(report) {
  const summary = report?.summary ?? {};
  return {
    checks_run: typeof summary.checks_run === "number" ? summary.checks_run : null,
    advisory_pass: typeof summary.advisory_pass === "number" ? summary.advisory_pass : null,
    advisory_fail: typeof summary.advisory_fail === "number" ? summary.advisory_fail : null,
    skipped: typeof summary.skipped === "number" ? summary.skipped : null,
  };
}

function resolvePreviousReportPath(explicitPath, outDir) {
  if (explicitPath) return path.resolve(explicitPath);

  const previousDir = path.join(outDir, "previous");
  const candidates = [
    path.join(previousDir, "aak-ci-advisory-report.json"),
    path.join(previousDir, "history", summarySnapshotFile),
    path.join(previousDir, summarySnapshotFile),
    defaultPreviousReport,
  ];
  return candidates.find(exists) ?? path.join(previousDir, "aak-ci-advisory-report.json");
}

function delta(current, previous) {
  if (typeof current !== "number" || typeof previous !== "number") return null;
  return current - previous;
}

function loadReport(filePath) {
  if (!exists(filePath)) {
    return { present: false, path: filePath ?? null, report: null, summary: safeSummary(null) };
  }
  try {
    const report = readJson(filePath);
    return {
      present: true,
      path: filePath,
      report,
      summary: safeSummary(report),
    };
  } catch (error) {
    return {
      present: false,
      path: filePath,
      report: null,
      summary: safeSummary(null),
      error: String(error?.message ?? error),
    };
  }
}

function buildMarkdown(result) {
  const lines = [];
  lines.push(`# AAK CI Advisory Delta Report`);
  lines.push(``);
  lines.push(`current_report: ${result.current_report.path ?? "unknown"}`);
  lines.push(`previous_report: ${result.previous_report.path ?? "missing"}`);
  lines.push(`comparison_available: ${result.comparison_available}`);
  lines.push(``);
  lines.push(`## Current Summary`);
  lines.push(`- checks_run: ${result.current_report.summary.checks_run ?? "null"}`);
  lines.push(`- advisory_pass: ${result.current_report.summary.advisory_pass ?? "null"}`);
  lines.push(`- advisory_fail: ${result.current_report.summary.advisory_fail ?? "null"}`);
  lines.push(`- skipped: ${result.current_report.summary.skipped ?? "null"}`);
  lines.push(``);
  lines.push(`## Previous Summary`);
  if (result.previous_report.present) {
    lines.push(`- checks_run: ${result.previous_report.summary.checks_run ?? "null"}`);
    lines.push(`- advisory_pass: ${result.previous_report.summary.advisory_pass ?? "null"}`);
    lines.push(`- advisory_fail: ${result.previous_report.summary.advisory_fail ?? "null"}`);
    lines.push(`- skipped: ${result.previous_report.summary.skipped ?? "null"}`);
  } else {
    lines.push(`- unavailable`);
  }
  lines.push(``);
  lines.push(`## Deltas`);
  lines.push(`- checks_run_delta: ${result.delta.checks_run_delta ?? "null"}`);
  lines.push(`- advisory_pass_delta: ${result.delta.advisory_pass_delta ?? "null"}`);
  lines.push(`- advisory_fail_delta: ${result.delta.advisory_fail_delta ?? "null"}`);
  lines.push(`- skipped_delta: ${result.delta.skipped_delta ?? "null"}`);
  lines.push(``);
  lines.push(`## Mutation Summary`);
  lines.push(`- database_writes: none`);
  lines.push(`- runtime_mutations: none`);
  lines.push(`- product_changes: none`);
  lines.push(`- push_merge_deploy: none`);
  lines.push(`- coverage_updates: none`);
  lines.push(`- verification_updates: none`);
  return lines.join("\n");
}

function writeCurrentSummarySnapshot(outDir, currentReport) {
  const historyDir = path.join(outDir, "history");
  ensureDir(historyDir);
  const snapshotPath = path.join(historyDir, summarySnapshotFile);
  const snapshot = {
    schema_version: "aak-ci-advisory-summary/v1",
    generated_at: new Date().toISOString(),
    source_report: currentReport.path,
    present: currentReport.present,
    summary: currentReport.summary,
    error: currentReport.error ?? null,
  };
  fs.writeFileSync(snapshotPath, `${JSON.stringify(snapshot, null, 2)}\n`);
  return snapshotPath;
}

function main() {
  const argv = process.argv.slice(2).filter((arg) => arg !== "--");
  const currentReportPath = path.resolve(argv[0] ?? defaultCurrentReport);
  const outDir = path.resolve(argv[2] ?? path.dirname(currentReportPath));
  const previousReportPath = resolvePreviousReportPath(argv[1], outDir);
  ensureDir(outDir);

  const current_report = loadReport(currentReportPath);
  const previous_report = loadReport(previousReportPath);
  const comparison_available = current_report.present && previous_report.present;

  const currentSummary = current_report.summary;
  const previousSummary = previous_report.summary;
  const deltaSummary = {
    checks_run_delta: comparison_available ? delta(currentSummary.checks_run, previousSummary.checks_run) : null,
    advisory_pass_delta: comparison_available ? delta(currentSummary.advisory_pass, previousSummary.advisory_pass) : null,
    advisory_fail_delta: comparison_available ? delta(currentSummary.advisory_fail, previousSummary.advisory_fail) : null,
    skipped_delta: comparison_available ? delta(currentSummary.skipped, previousSummary.skipped) : null,
  };

  const report = {
    ok: current_report.present,
    mode: "ADVISORY_DELTA",
    blocking: false,
    runner: "ADMIN-AAK-CI-ADVISORY-DELTA-001",
    current_report: {
      path: current_report.path,
      present: current_report.present,
      summary: currentSummary,
      error: current_report.error ?? null,
    },
    previous_report: {
      path: previous_report.path,
      present: previous_report.present,
      summary: previousSummary,
      error: previous_report.error ?? null,
    },
    comparison_available,
    delta: deltaSummary,
    mutation_summary: {
      database_writes: "none",
      runtime_mutations: "none",
      product_changes: "none",
      push_merge_deploy: "none",
      coverage_updates: "none",
      verification_updates: "none",
    },
  };

  const jsonPath = path.join(outDir, "aak-ci-advisory-delta-report.json");
  const mdPath = path.join(outDir, "aak-ci-advisory-delta-report.md");
  const currentSummarySnapshotPath = writeCurrentSummarySnapshot(outDir, current_report);
  report.report_paths = {
    json: jsonPath,
    markdown: mdPath,
    current_summary_snapshot: currentSummarySnapshotPath,
  };

  fs.writeFileSync(jsonPath, `${JSON.stringify(report, null, 2)}\n`);
  fs.writeFileSync(mdPath, `${buildMarkdown(report)}\n`);
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
}

main();
