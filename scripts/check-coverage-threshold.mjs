#!/usr/bin/env node
// scripts/check-coverage-threshold.mjs
//
// Reads vitest's coverage-summary.json (emitted by --reporter=json-summary)
// and enforces the per-folder thresholds in scripts/coverage-thresholds.json.
//
// Per the A12 coverage-ratchet principle: thresholds in coverage-thresholds.json
// only move UP. PRs that lower a threshold need explicit justification in the
// PR body. This script is the gate; the ratchet discipline is editorial.

import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..");

const SUMMARY_PATH = resolve(REPO_ROOT, "coverage", "coverage-summary.json");
const THRESHOLD_PATH = resolve(REPO_ROOT, "scripts", "coverage-thresholds.json");

if (!existsSync(SUMMARY_PATH)) {
  console.error(`❌ ${SUMMARY_PATH} not found.`);
  console.error("   Run `npm run test:coverage` first (emits json-summary).");
  process.exit(2);
}
if (!existsSync(THRESHOLD_PATH)) {
  console.error(`❌ ${THRESHOLD_PATH} not found.`);
  process.exit(2);
}

const summary = JSON.parse(readFileSync(SUMMARY_PATH, "utf8"));
const thresholds = JSON.parse(readFileSync(THRESHOLD_PATH, "utf8"));

// A file's coverage % is reported per-file in `summary`. We aggregate by
// path prefix to compute a folder %. Aggregation uses total/covered counters
// (NOT the per-file averaged %) so a folder with one tiny well-tested file
// can't mask many uncovered ones.
function aggregate(prefix) {
  let lTotal = 0, lCovered = 0;
  let bTotal = 0, bCovered = 0;
  let fTotal = 0, fCovered = 0;
  let sTotal = 0, sCovered = 0;
  const absPrefix = resolve(REPO_ROOT, prefix);

  for (const [filePath, data] of Object.entries(summary)) {
    if (filePath === "total") continue;
    const abs = resolve(filePath);
    if (!abs.startsWith(absPrefix)) continue;
    lTotal   += data.lines?.total    ?? 0;
    lCovered += data.lines?.covered  ?? 0;
    bTotal   += data.branches?.total   ?? 0;
    bCovered += data.branches?.covered ?? 0;
    fTotal   += data.functions?.total   ?? 0;
    fCovered += data.functions?.covered ?? 0;
    sTotal   += data.statements?.total   ?? 0;
    sCovered += data.statements?.covered ?? 0;
  }

  return {
    lines:      lTotal ? (lCovered / lTotal) * 100 : 0,
    branches:   bTotal ? (bCovered / bTotal) * 100 : 0,
    functions:  fTotal ? (fCovered / fTotal) * 100 : 0,
    statements: sTotal ? (sCovered / sTotal) * 100 : 0,
    fileCount: Object.keys(summary).filter(f => f !== "total" && resolve(f).startsWith(absPrefix)).length,
  };
}

const violations = [];

// Global threshold (uses summary.total as-emitted by vitest)
if (thresholds.global) {
  const total = summary.total;
  for (const metric of ["lines", "branches", "functions", "statements"]) {
    const threshold = thresholds.global[metric];
    if (threshold == null) continue;
    const actual = total[metric]?.pct ?? 0;
    if (actual < threshold) {
      violations.push(
        `global.${metric}: ${actual.toFixed(2)}% < threshold ${threshold}%`
      );
    }
  }
}

// Per-folder thresholds
for (const [folder, perFolder] of Object.entries(thresholds.folders ?? {})) {
  const agg = aggregate(folder);
  for (const metric of ["lines", "branches", "functions", "statements"]) {
    const threshold = perFolder[metric];
    if (threshold == null) continue;
    const actual = agg[metric];
    if (actual < threshold) {
      violations.push(
        `${folder}.${metric}: ${actual.toFixed(2)}% < threshold ${threshold}% (${agg.fileCount} files)`
      );
    }
  }
}

// Report
console.log("Coverage threshold check");
console.log("------------------------");
console.log(`global.lines      : ${(summary.total.lines?.pct      ?? 0).toFixed(2)}%`);
console.log(`global.branches   : ${(summary.total.branches?.pct   ?? 0).toFixed(2)}%`);
console.log(`global.functions  : ${(summary.total.functions?.pct  ?? 0).toFixed(2)}%`);
console.log(`global.statements : ${(summary.total.statements?.pct ?? 0).toFixed(2)}%`);
console.log();

for (const folder of Object.keys(thresholds.folders ?? {})) {
  const agg = aggregate(folder);
  console.log(`${folder}`);
  console.log(`  lines      : ${agg.lines.toFixed(2)}%  (${agg.fileCount} files)`);
  console.log(`  branches   : ${agg.branches.toFixed(2)}%`);
  console.log(`  functions  : ${agg.functions.toFixed(2)}%`);
  console.log(`  statements : ${agg.statements.toFixed(2)}%`);
}

console.log();
if (violations.length > 0) {
  console.error(`❌ ${violations.length} threshold violation(s):`);
  for (const v of violations) console.error(`   ${v}`);
  console.error();
  console.error("To intentionally LOWER a threshold, edit scripts/coverage-thresholds.json");
  console.error("AND justify in the PR body (PRINCIPLES.md P19 — coverage ratchet only moves UP).");
  process.exit(1);
}

console.log("✅ All coverage thresholds met.");
