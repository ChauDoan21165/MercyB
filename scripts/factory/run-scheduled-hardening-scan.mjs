#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import process from "node:process";

const BASELINE_PATH = "scripts/factory/hardening-scan-baseline.json";
const REPORT_PATH = process.env.HARDENING_SCAN_REPORT_PATH || "reports/hardening-scan-scheduled.md";

export function parseFindingCounts(report) {
  const line = report.split(/\r?\n/).find((item) => item.startsWith("Finding counts — "));
  if (!line) throw new Error("Scanner output did not include a Finding counts line");
  const totalMatch = line.match(/\(total\s+(\d+)\)/);
  const countsText = line.replace(/^Finding counts —\s*/, "").replace(/\s+\(total.*$/, "");
  const checks = {};
  for (const token of countsText.trim().split(/\s+/)) {
    const [key, value] = token.split(":");
    if (!key || value === undefined) continue;
    checks[key] = Number(value);
  }
  return { checks, total: Number(totalMatch?.[1] ?? 0) };
}

export function compareToBaseline(current, baseline) {
  const failures = [];
  for (const [check, count] of Object.entries(current.checks)) {
    const allowed = Number(baseline.checks?.[check] ?? 0);
    if (count > allowed) failures.push(`${check}:${count}>${allowed}`);
  }
  if (current.total > Number(baseline.total ?? 0)) failures.push(`total:${current.total}>${baseline.total ?? 0}`);
  return failures;
}

function main() {
  mkdirSync("reports", { recursive: true });
  const baseline = JSON.parse(readFileSync(BASELINE_PATH, "utf8"));
  const result = spawnSync(process.execPath, ["scripts/hardening-scan.mjs"], {
    encoding: "utf8",
    env: {
      ...process.env,
      HARDENING_SCAN_REF: process.env.HARDENING_SCAN_REF || baseline.target_ref || "origin/main",
      NODE_OPTIONS: process.env.NODE_OPTIONS || "--max-old-space-size=6144",
    },
    maxBuffer: 50 * 1024 * 1024,
    stdio: ["ignore", "pipe", "inherit"],
  });
  const report = result.stdout || "";
  writeFileSync(REPORT_PATH, report);
  if (result.status !== 0) {
    console.error(`[scheduled-hardening-scan] scanner exited ${result.status}; report=${REPORT_PATH}`);
    process.exit(result.status || 1);
  }
  const current = parseFindingCounts(result.stdout || "");
  const failures = compareToBaseline(current, baseline);
  console.log(`[scheduled-hardening-scan] report=${REPORT_PATH}`);
  console.log(`[scheduled-hardening-scan] counts=${JSON.stringify(current.checks)} total=${current.total}`);
  if (failures.length) {
    console.error(`[scheduled-hardening-scan] baseline exceeded: ${failures.join(", ")}`);
    process.exit(1);
  }
  console.log("[scheduled-hardening-scan] PASS baseline not exceeded");
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
