#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const SCHEMA_VERSION = "doctor/v1";

export const CHECKS = Object.freeze([
  { name: "node", command: "node", args: ["-v"] },
  { name: "npm", command: "npm", args: ["-v"] },
  { name: "typecheck", command: "npm", args: ["run", "typecheck:app"] },
  { name: "lint", command: "npm", args: ["run", "lint"] },
  { name: "validate-rooms", command: "npm", args: ["run", "validate-rooms"] },
  { name: "build", command: "npm", args: ["run", "build"] },
]);

export function parseArgs(argv = []) {
  const options = { json: false, help: false };
  for (const arg of argv) {
    if (arg === "--json") options.json = true;
    else if (arg === "--help" || arg === "-h") options.help = true;
    else return { ok: false, error: `unknown option: ${arg}` };
  }
  return { ok: true, options };
}

export function helpText() {
  return [
    "Usage",
    "  npm run doctor -- [options]",
    "",
    "Options",
    "  --json        Print JSON only.",
    "  --help        Show this help.",
    "",
    "Exit codes",
    "  0 PASS — all health checks passed",
    "  1 FAIL — one or more health checks failed",
    "  4 USAGE_ERROR",
    "",
    "Examples",
    "  npm run doctor",
    "  npm run doctor -- --json",
    "  npm run doctor -- --help",
    "",
  ].join("\n");
}

export function runCheck({ name, command, args }, { cwd = ROOT, runner = defaultRunner } = {}) {
  const started = Date.now();
  try {
    const stdout = runner(command, args, { cwd, encoding: "utf8", timeout: 300000 }).trim();
    return makeResult(name, command, args, "PASS", 0, Date.now() - started, stdout.split("\n")[0] || "passed", "");
  } catch (error) {
    const exitCode = typeof error.status === "number" ? error.status : 1;
    const stderr = redact((error.stderr || error.message || "").toString().trim());
    return makeResult(name, command, args, "FAIL", exitCode, Date.now() - started, trimDetails(stderr), `Fix ${name} before proceeding.`);
  }
}

export function runAll({ cwd = ROOT, runner = defaultRunner } = {}) {
  const started = Date.now();
  const results = CHECKS.map((check) => runCheck(check, { cwd, runner }));
  const failed = results.filter((r) => r.status === "FAIL");
  return {
    schemaVersion: SCHEMA_VERSION,
    generatedAt: new Date().toISOString(),
    results,
    failedCount: failed.length,
    totalCount: results.length,
    summary: failed.length ? `${failed.length}/${results.length} check(s) failed` : `all ${results.length} checks passed`,
    exitCode: failed.length ? 1 : 0,
    exitReason: failed.length ? "FAIL" : "PASS",
    runtimeMs: Date.now() - started,
  };
}

export function formatTerminal(model) {
  const lines = [
    "Doctor Health Check",
    ...model.results.map((r) =>
      ` ${r.status === "PASS" ? "\u2713" : "\u2717"} ${r.name}: ${r.status}${r.status === "FAIL" ? ` (exit ${r.exitCode}) \u2014 ${r.details}` : ""}`
    ),
    "",
    model.exitCode === 0 ? "\u2705 DOCTOR PASS" : "\u274c DOCTOR FAIL",
    `  ${model.summary}`,
    `  runtime: ${model.runtimeMs}ms`,
  ];
  return lines.join("\n") + "\n";
}

export function formatJson(model) {
  return JSON.stringify(model, null, 2) + "\n";
}

function makeResult(name, command, args, status, exitCode, durationMs, details, action) {
  return { name, command: `${command} ${args.join(" ")}`, status, exitCode, durationMs, details, action };
}

function trimDetails(text) {
  const line = text.split("\n").find((l) => l.trim());
  return line ? line.slice(0, 240) : "no output";
}

function redact(value = "") {
  return String(value)
    .replace(/Bearer\s+\S+/gi, "Bearer [redacted]")
    .replace(/[A-Za-z0-9_\-=]{32,}/g, "[redacted]")
    .replace(/(apikey|authorization|token|key|secret)=([^&\s]+)/gi, "$1=[redacted]");
}

function defaultRunner(command, args, options) {
  return execFileSync(command, args, options);
}

async function main() {
  const parsed = parseArgs(process.argv.slice(2));
  if (!parsed.ok) {
    process.stderr.write(`${parsed.error}\n\n${helpText()}`);
    process.exitCode = 4;
    return;
  }
  if (parsed.options.help) {
    process.stdout.write(helpText());
    process.exitCode = 0;
    return;
  }
  const model = runAll();
  process.stdout.write(parsed.options.json ? formatJson(model) : formatTerminal(model));
  process.exitCode = model.exitCode;
}

const thisFile = fileURLToPath(import.meta.url);
if (process.argv[1] && path.resolve(process.argv[1]) === thisFile) {
  main().catch((error) => {
    process.stderr.write(`Doctor failed: ${redact(error.message)}\n`);
    process.exitCode = 1;
  });
}
