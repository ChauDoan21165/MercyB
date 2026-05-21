#!/usr/bin/env node
import { execFileSync, spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SCHEMA_VERSION = "pr-ready/v2";
const ALLOWED_FILES = new Set(["package.json", "scripts/pr-ready.mjs", "scripts/__tests__/pr-ready.test.mjs"]);
const REQUIRED_SCRIPTS = ["pr:ready", "typecheck:app", "build"];
const OPTIONAL_SCRIPTS = ["mb:status"];
const EXIT = { READY: 0, NOT_READY: 1, INVALID_CONFIGURATION: 3, USAGE_ERROR: 4 };

export function parseArgs(argv = []) {
  const options = { json: false, help: false, base: "origin/main" };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--json") options.json = true;
    else if (arg === "--help" || arg === "-h") options.help = true;
    else if (arg === "--base") {
      const value = argv[++index];
      if (!value || value.startsWith("-") || /[\s~^:?*[\\]/.test(value)) return { ok: false, error: "invalid --base" };
      options.base = value;
    } else {
      return { ok: false, error: `unknown option ${arg}` };
    }
  }
  return { ok: true, options };
}

export function helpText() {
  return `Usage
  npm run pr:ready -- [options]

Options
  --json        Print JSON from the script.
  --help        Show this help.
  --base <ref>  Base ref for changed-file checks. Default: origin/main.

Exit codes
  0 READY
  1 NOT_READY
  3 INVALID_CONFIGURATION
  4 USAGE_ERROR

Examples
  npm run pr:ready
  npm run pr:ready -- --json
  npm run pr:ready -- --help
  npm run pr:ready -- --base origin/main
`;
}

export function readPackage(root = ROOT) {
  try {
    const parsed = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
    if (!parsed?.scripts || typeof parsed.scripts !== "object" || Array.isArray(parsed.scripts)) {
      return { ok: false, scripts: {}, error: "package.json scripts object missing" };
    }
    return { ok: true, scripts: parsed.scripts, error: "" };
  } catch (error) {
    return { ok: false, scripts: {}, error: redact(error.message) };
  }
}

export function getGitInfo({ root = ROOT, execFile = execFileSync } = {}) {
  const git = (args, { preserveStatusColumns = false } = {}) => {
    try {
      const output = execFile("git", args, { cwd: root, encoding: "utf8" });
      return preserveStatusColumns ? output.replace(/\r?\n$/, "") : output.trim();
    } catch {
      return "";
    }
  };
  const porcelain = git(["status", "--porcelain"], { preserveStatusColumns: true });
  const lines = porcelain ? porcelain.split(/\r?\n/).filter(Boolean) : [];
  return {
    branch: git(["branch", "--show-current"]) || "DETACHED",
    commit: git(["rev-parse", "--short", "HEAD"]) || "UNKNOWN",
    dirty: lines.length > 0,
    staged: lines.filter((line) => !line.startsWith("??") && line[0] !== " ").length,
    unstaged: lines.filter((line) => !line.startsWith("??") && line[1] !== " ").length,
    untracked: lines.filter((line) => line.startsWith("??")).length,
    statusLines: lines,
  };
}

export function changedFiles({ root = ROOT, base = "origin/main", execFile = execFileSync } = {}) {
  try {
    const output = execFile("git", ["diff", "--name-only", `${base}...HEAD`], { cwd: root, encoding: "utf8" });
    return output.split(/\r?\n/).filter(Boolean);
  } catch {
    return [];
  }
}

export function currentWorktreeFiles(gitInfo) {
  return gitInfo.statusLines.map((line) => line.slice(3).trim()).filter(Boolean);
}

export function runCommand(command, args, { root = ROOT, runner = spawnSync } = {}) {
  const started = Date.now();
  const result = runner(command, args, { cwd: root, encoding: "utf8", shell: false, maxBuffer: 10 * 1024 * 1024 });
  return {
    command: [command, ...args].join(" "),
    exitCode: typeof result.status === "number" ? result.status : 1,
    durationMs: Date.now() - started,
    output: `${result.stdout || ""}\n${result.stderr || ""}`.trim(),
  };
}

export function checkPackageScripts(scripts) {
  const checks = [];
  for (const name of REQUIRED_SCRIPTS) {
    checks.push({
      name: `script:${name}`,
      status: scripts[name] ? "PASS" : "FAIL",
      details: scripts[name] ? "present" : "missing required package script",
      action: scripts[name] ? "" : `Add package script ${name}.`,
    });
  }
  for (const name of OPTIONAL_SCRIPTS) {
    checks.push({
      name: `script:${name}`,
      status: scripts[name] ? "PASS" : "MISSING",
      details: scripts[name] ? "present" : "optional script missing",
      action: "",
    });
  }
  return checks;
}

export function checkScope({ baseFiles = [], worktreeFiles = [] } = {}) {
  const all = Array.from(new Set([...baseFiles, ...worktreeFiles])).sort();
  const unexpected = all.filter((file) => !ALLOWED_FILES.has(file));
  return {
    status: unexpected.length ? "FAIL" : "PASS",
    files: all,
    unexpected,
    details: unexpected.length ? `unexpected files: ${unexpected.join(", ")}` : "changed files are scoped",
    action: unexpected.length ? "Remove unrelated files from this PR or split them into a separate PR." : "",
  };
}

export function classifyDiffCheck(result) {
  return {
    name: "git diff --check",
    status: result.exitCode === 0 ? "PASS" : "FAIL",
    exitCode: result.exitCode,
    durationMs: result.durationMs,
    details: result.exitCode === 0 ? "no whitespace errors" : result.output,
    action: result.exitCode === 0 ? "" : "Fix whitespace errors reported by git diff --check.",
  };
}

export function buildModel({
  root = ROOT,
  base = "origin/main",
  packageRead = readPackage(root),
  gitInfo = getGitInfo({ root }),
  baseFiles = changedFiles({ root, base }),
  commandRunner = runCommand,
  generatedAt = new Date().toISOString(),
} = {}) {
  const started = Date.now();
  const configStatus = packageRead.ok ? "PASS" : "INVALID_CONFIGURATION";
  const packageChecks = packageRead.ok ? checkPackageScripts(packageRead.scripts) : [];
  const scope = checkScope({ baseFiles, worktreeFiles: currentWorktreeFiles(gitInfo) });
  const diffCheck = classifyDiffCheck(commandRunner("git", ["diff", "--check"], { root }));
  const checks = [
    { name: "package.json", status: configStatus, details: packageRead.error || "valid package config", action: packageRead.ok ? "" : "Fix package.json." },
    ...packageChecks,
    { name: "worktree scope", status: scope.status, details: scope.details, action: scope.action },
    diffCheck,
  ];
  const blockers = checks
    .filter((check) => check.status === "FAIL" || check.status === "INVALID_CONFIGURATION")
    .map((check) => ({ check: check.name, status: check.status, action: check.action || `Fix ${check.name}.` }))
    .slice(0, 5);
  const exitCode = checks.some((check) => check.status === "INVALID_CONFIGURATION") ? EXIT.INVALID_CONFIGURATION : blockers.length ? EXIT.NOT_READY : EXIT.READY;
  return {
    schemaVersion: SCHEMA_VERSION,
    generatedAt,
    repoRoot: root,
    baseRef: base,
    branch: gitInfo.branch,
    commit: gitInfo.commit,
    worktree: {
      dirty: gitInfo.dirty,
      staged: gitInfo.staged,
      unstaged: gitInfo.unstaged,
      untracked: gitInfo.untracked,
    },
    changedFiles: scope.files,
    unexpectedFiles: scope.unexpected,
    checks,
    topBlockers: blockers,
    nextActions: blockers.map(({ check, status, action }) => ({ check, status, action })),
    exitCode,
    exitReason: exitCode === 0 ? "READY" : exitCode === 3 ? "INVALID_CONFIGURATION" : "NOT_READY",
    runtimeMs: Date.now() - started,
  };
}

export function formatTerminal(model) {
  return [
    "MercyB PR Readiness",
    "Run Info",
    `repo root: ${model.repoRoot}`,
    `base ref: ${model.baseRef}`,
    `branch: ${model.branch}`,
    `commit: ${model.commit}`,
    `generated timestamp: ${model.generatedAt}`,
    `runtime ms: ${model.runtimeMs}`,
    "Worktree",
    `dirty: ${model.worktree.dirty}`,
    `staged: ${model.worktree.staged}`,
    `unstaged: ${model.worktree.unstaged}`,
    `untracked: ${model.worktree.untracked}`,
    "Changed Files",
    ...(model.changedFiles.length ? model.changedFiles : ["None"]),
    "Checks",
    ...model.checks.map((check) => `${check.name}: ${check.status}${check.exitCode == null ? "" : `, exit ${check.exitCode}`}${check.details ? `, ${check.details}` : ""}`),
    "Top Blockers",
    ...(model.topBlockers.length ? model.topBlockers.map((item, index) => `${index + 1}. ${item.check}: ${item.status} - ${item.action}`) : ["None"]),
    "Next Actions",
    ...(model.nextActions.length ? model.nextActions.map((item, index) => `${index + 1}. ${item.action}`) : ["None"]),
    "Exit Summary",
    `Exit Code: ${model.exitCode}`,
    `Exit Reason: ${model.exitReason}`,
  ].join("\n");
}

export function formatJson(model) {
  return `${JSON.stringify(model, null, 2)}\n`;
}

async function main() {
  const parsed = parseArgs(process.argv.slice(2));
  if (!parsed.ok) {
    console.error(`USAGE_ERROR: ${parsed.error}`);
    process.exitCode = EXIT.USAGE_ERROR;
    return;
  }
  if (parsed.options.help) {
    console.log(helpText());
    process.exitCode = 0;
    return;
  }
  const model = buildModel({ base: parsed.options.base });
  if (parsed.options.json) process.stdout.write(formatJson(model));
  else console.log(formatTerminal(model));
  process.exitCode = model.exitCode;
}

function redact(value = "") {
  return String(value).replace(/[A-Za-z0-9_=-]{32,}/g, "[redacted]");
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error(`INVALID_CONFIGURATION: ${redact(error.message)}`);
    process.exitCode = EXIT.INVALID_CONFIGURATION;
  });
}
