#!/usr/bin/env node
import { appendFileSync, mkdirSync } from "node:fs";

const summary = process.argv.slice(2).join(" ").trim();
if (!summary) {
  console.error('Usage: node scripts/factory/runlog.mjs "<summary; MRs=...; gates=...; oom=...; stalls=...>"');
  process.exit(1);
}
mkdirSync("reports", { recursive: true });
appendFileSync("reports/factory-runlog.md", `- ${new Date().toISOString()} | ${summary}\n`);
console.log("[runlog] appended reports/factory-runlog.md");
