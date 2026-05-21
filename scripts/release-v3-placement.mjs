#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

export const SCHEMA_VERSION = "v3-placement-release/v1";

const REQUIRED_SCRIPTS = ["test:resume", "verify:v3-placement"];
const REQUIRED_FILES = [
  "scripts/verify-v3-placement.mjs",
  "scripts/__tests__/verify-v3-placement.test.mjs",
];

export function parseArgs(argv) {
  const options = { json: false, help: false, skipBuild: false };
  for (const arg of argv) {
    if (arg === "--json") options.json = true;
    else if (arg === "--help" || arg === "-h") options.help = true;
    else if (arg === "--skip-build") options.skipBuild = true;
    else return { error: `Unknown argument: ${arg}` };
  }
  return { options };
}

export function helpText() {
  return [
    "Usage",
    "  npm run release:v3-placement -- [options]",
    "",
    "Options",
    "  --json          Print JSON only.",
    "  --help          Print this help.",
    "  --skip-build    Skip npm run build only.",
    "",
    "Exit codes",
    "  0 READY",
    "  1 NOT_READY",
    "  4 USAGE_ERROR",
    "",
    "Examples",
    "  npm run release:v3-placement",
    "  npm run --silent release:v3-placement -- --json",
    "  npm run release:v3-placement -- --skip-build",
    "",
    "JSON mode",
    "  Use npm run --silent release:v3-placement -- --json for raw JSON through npm.",
  ].join("\n");
}

export function readPackageJson(repoRoot) {
  const file = path.join(repoRoot, "package.json");
  if (!fs.existsSync(file)) return { error: "package.json is missing", packageJson: null };
  try {
    return { packageJson: JSON.parse(fs.readFileSync(file, "utf8")), error: null };
  } catch (error) {
    return { error: `package.json is malformed: ${error.message}`, packageJson: null };
  }
}

function nowMs() {
  return Date.now();
}

export function runCommand(command, args, options = {}) {
  const started = nowMs();
  const result = spawnSync(command, args, {
    cwd: options.repoRoot || process.cwd(),
    encoding: "utf8",
    shell: false,
    timeout: options.timeoutMs || 900000,
    env: { ...process.env, ...(options.env || {}) },
  });
  return {
    command: [command, ...args].join(" "),
    exitCode: typeof result.status === "number" ? result.status : 1,
    stdout: result.stdout || "",
    stderr: result.stderr || "",
    output: `${result.stdout || ""}${result.stderr || ""}`,
    durationMs: Math.max(0, nowMs() - started),
    error: result.error ? result.error.message : null,
  };
}

export function makeCheck(input) {
  return {
    name: input.name,
    command: input.command || "",
    status: input.status,
    exitCode: input.exitCode ?? null,
    durationMs: input.durationMs ?? 0,
    details: input.details || "",
    action: input.action || "",
  };
}

function firstUsefulLine(output) {
  return String(output || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .find(Boolean) || "";
}

function pass(name, command = "") {
  return makeCheck({ name, command, status: "PASS", details: "Ready." });
}

function fail(name, command, details, action = "Fix the blocker and rerun release:v3-placement.") {
  return makeCheck({ name, command, status: "FAIL", details, action });
}

function skipped(name, command) {
  return makeCheck({ name, command, status: "SKIPPED", details: "Skipped by --skip-build." });
}

export function checkRequiredScripts(packageJson) {
  if (!packageJson?.scripts || typeof packageJson.scripts !== "object") {
    return [fail("package scripts", "package.json", "package.json scripts are missing or malformed.", "Restore a valid package.json scripts object.")];
  }
  return REQUIRED_SCRIPTS.map((name) => {
    if (packageJson.scripts[name]) return pass(`script:${name}`, packageJson.scripts[name]);
    return fail(`script:${name}`, "package.json", `${name} script is missing.`, `Restore ${name} before running the release gate.`);
  });
}

export function checkRequiredFiles(repoRoot) {
  return REQUIRED_FILES.map((rel) => {
    if (fs.existsSync(path.join(repoRoot, rel))) return pass(`file:${rel}`, rel);
    return fail(`file:${rel}`, rel, `${rel} is missing.`, `Restore ${rel} before running the release gate.`);
  });
}

export function classifyCommand(name, command, result) {
  if (result.error) {
    return makeCheck({
      name,
      command,
      status: "FAIL",
      exitCode: result.exitCode,
      durationMs: result.durationMs,
      details: result.error,
      action: "Fix the command failure and rerun release:v3-placement.",
    });
  }
  if (result.exitCode !== 0) {
    return makeCheck({
      name,
      command,
      status: "FAIL",
      exitCode: result.exitCode,
      durationMs: result.durationMs,
      details: firstUsefulLine(result.output) || "Command failed.",
      action: "Fix the failing command and rerun release:v3-placement.",
    });
  }
  return makeCheck({
    name,
    command,
    status: "PASS",
    exitCode: result.exitCode,
    durationMs: result.durationMs,
    details: "Command passed.",
  });
}

export function buildStatusModel({ repoRoot, options, runner = runCommand, generatedAt = new Date().toISOString() }) {
  const checks = [];
  const { packageJson, error } = readPackageJson(repoRoot);
  if (error) {
    checks.push(fail("package.json", "package.json", error, "Restore package.json before running the release gate."));
  } else {
    checks.push(...checkRequiredScripts(packageJson));
  }
  checks.push(...checkRequiredFiles(repoRoot));

  const hasPrereqFailure = checks.some((check) => check.status !== "PASS");
  if (!hasPrereqFailure) {
    const commands = [
      ["test:resume", ["npm", ["run", "test:resume"]]],
      ["verify:v3-placement", ["npm", ["run", "verify:v3-placement"]]],
      ["typecheck:app", ["npm", ["run", "typecheck:app"]]],
      ["build", ["npm", ["run", "build"]]],
      ["git diff check", ["git", ["diff", "--check"]]],
    ];
    for (const [name, [command, args]] of commands) {
      const label = [command, ...args].join(" ");
      if (name === "build" && options.skipBuild) {
        checks.push(skipped(name, label));
        continue;
      }
      checks.push(classifyCommand(name, label, runner(command, args, { repoRoot })));
    }
  }

  if (checks.length === 0) {
    checks.push(fail("release checks", "release:v3-placement", "No release checks were produced.", "Restore release gate checks before using this command."));
  }

  const blockers = checks
    .filter((check) => check.status === "FAIL")
    .slice(0, 5)
    .map((check) => ({ check: check.name, status: check.status, action: check.action }));
  const exitCode = blockers.length > 0 ? 1 : 0;
  return {
    schemaVersion: SCHEMA_VERSION,
    generatedAt,
    repoRoot,
    checks,
    topBlockers: blockers,
    exitCode,
    exitReason: exitCode === 0 ? "READY" : "NOT_READY",
  };
}

export function formatTerminal(model) {
  const lines = [
    "V3 Placement Release Gate",
    "",
    "Run Info",
    `repo root: ${model.repoRoot}`,
    `generated timestamp: ${model.generatedAt}`,
    "",
    "Checks",
  ];
  for (const check of model.checks) {
    const exit = check.exitCode === null ? "-" : check.exitCode;
    lines.push(`- ${check.name}: ${check.status} | command: ${check.command} | exit code: ${exit} | duration ms: ${check.durationMs} | details: ${check.details}`);
  }
  lines.push("", "Top Blockers");
  if (model.topBlockers.length === 0) lines.push("None");
  else model.topBlockers.forEach((blocker) => lines.push(`- ${blocker.check}: ${blocker.status} | action: ${blocker.action}`));
  lines.push("", "Exit Summary", `exit code: ${model.exitCode}`, `exit reason: ${model.exitReason}`);
  return `${lines.join("\n")}\n`;
}

export function formatJson(model) {
  return `${JSON.stringify({
    schemaVersion: model.schemaVersion,
    generatedAt: model.generatedAt,
    repoRoot: model.repoRoot,
    checks: model.checks,
    topBlockers: model.topBlockers,
    exitCode: model.exitCode,
    exitReason: model.exitReason,
  }, null, 2)}\n`;
}

export function main(argv = process.argv.slice(2), deps = {}) {
  const parsed = parseArgs(argv);
  const stdout = deps.stdout || process.stdout;
  const stderr = deps.stderr || process.stderr;
  if (parsed.error) {
    stderr.write(`${parsed.error}\n\n${helpText()}\n`);
    return 4;
  }
  if (parsed.options.help) {
    stdout.write(`${helpText()}\n`);
    return 0;
  }
  const repoRoot = deps.repoRoot || process.cwd();
  const model = buildStatusModel({
    repoRoot,
    options: parsed.options,
    runner: deps.runner || runCommand,
    generatedAt: deps.generatedAt,
  });
  stdout.write(parsed.options.json ? formatJson(model) : formatTerminal(model));
  return model.exitCode;
}

const isDirectRun = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isDirectRun) {
  process.exitCode = main();
}
