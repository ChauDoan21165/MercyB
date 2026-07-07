#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "../..");
const scorecardSchemaPath = path.join(repoRoot, "schemas/oii-scorecard-v1.schema.json");

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function flattenReports(raw) {
  if (Array.isArray(raw)) return raw.flatMap(flattenReports);
  if (raw && typeof raw === "object" && Array.isArray(raw.package_reports)) return raw.package_reports;
  if (raw && typeof raw === "object" && raw.score_inputs) return [raw];
  return [];
}

function scoreMean(reports, key) {
  if (reports.length === 0) return 0;
  const sum = reports.reduce((total, report) => total + (report.score_inputs?.[key] ? 1 : 0), 0);
  return Math.round((sum / reports.length) * 100);
}

function main() {
  const reportFiles = process.argv.slice(2);
  if (reportFiles.length === 0) {
    console.error("usage: node scripts/admin/build-oii-scorecard.mjs <validation-report.json> [more.json]");
    process.exit(1);
  }

  const reports = [];
  for (const file of reportFiles) {
    const raw = readJson(path.resolve(file));
    reports.push(...flattenReports(raw));
  }

  if (reports.length === 0) {
    console.error("no validation reports were found in the provided inputs");
    process.exit(1);
  }

  const scorecard = {
    engineering_health: scoreMean(reports, "engineering_health"),
    evidence_health: scoreMean(reports, "evidence_health"),
    decision_health: scoreMean(reports, "decision_health"),
    capability_health: scoreMean(reports, "capability_health"),
    learning_health: scoreMean(reports, "learning_health"),
  };

  const schema = readJson(scorecardSchemaPath);
  const required = schema.required || [];
  const missing = required.filter((key) => !(key in scorecard));
  if (missing.length > 0) {
    console.error(`scorecard output missing required fields: ${missing.join(", ")}`);
    process.exit(1);
  }

  console.log(JSON.stringify(scorecard, null, 2));
}

main();
