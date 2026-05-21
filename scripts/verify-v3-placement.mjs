#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

export const SCHEMA_VERSION = "v3-placement-verification/v1";
export const STATUSES = new Set([
  "PASS",
  "FAIL",
  "MISSING",
  "NOT_VALIDATED",
  "SKIPPED",
  "FALSE_GREEN_RISK",
  "INVALID_CONFIGURATION",
]);

const READY = "READY";
const NOT_READY = "NOT_READY";
const NOT_VALIDATED = "NOT_VALIDATED";
const INVALID_CONFIGURATION = "INVALID_CONFIGURATION";
const USAGE_ERROR = "USAGE_ERROR";

const REQUIRED_RESUME_FILE = "src/pages/placement/v3/__tests__/ResultsPage.resumeSmoke.test.tsx";
const ALT_RESUME_FILE = "src/pages/placement/v3/__tests__/resumeSmoke.test.tsx";
const PLACEMENT_SESSION_FILE = "supabase/functions/placement-v3-session/__tests__/resumePolicy.test.ts";
const DEFAULT_BASE = "origin/main";
const DEFAULT_MIN_RESUME_TESTS = 42;
const MAX_BLOCKERS = 5;

const ALLOWED_CHANGED_PATHS = new Set([
  "package.json",
  "scripts/verify-v3-placement.mjs",
  "scripts/__tests__/verify-v3-placement.test.mjs",
  "scripts/release-v3-placement.mjs",
  "scripts/__tests__/release-v3-placement.test.mjs",
  "src/pages/placement/v3/ResultsPage.tsx",
  REQUIRED_RESUME_FILE,
  ALT_RESUME_FILE,
  "src/components/room/RoomRenderer.tsx",
]);

const BANNED_TERMS = [
  "placement/" + "v4",
  "re" + "play",
  "govern" + "ance",
  "auth" + "ority",
  "re" + "hearsal",
  "sover" + "eignty",
];

const DRIFT_FIXTURE_PATH = "scripts/__tests__/verify-v3-placement.test.mjs";

export function parseArgs(argv) {
  const options = {
    json: false,
    help: false,
    skipBuild: false,
    skipOptional: false,
    baseRef: DEFAULT_BASE,
    minResumeTests: DEFAULT_MIN_RESUME_TESTS,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--json") {
      options.json = true;
    } else if (arg === "--help" || arg === "-h") {
      options.help = true;
    } else if (arg === "--skip-build") {
      options.skipBuild = true;
    } else if (arg === "--skip-optional") {
      options.skipOptional = true;
    } else if (arg === "--base") {
      const value = argv[index + 1];
      if (!value || value.startsWith("-")) {
        return { error: "Missing value for --base" };
      }
      options.baseRef = value;
      index += 1;
    } else if (arg === "--min-resume-tests") {
      const value = argv[index + 1];
      const parsed = Number(value);
      if (!value || value.startsWith("-") || !Number.isInteger(parsed) || parsed <= 0) {
        return { error: "Invalid value for --min-resume-tests" };
      }
      options.minResumeTests = parsed;
      index += 1;
    } else {
      return { error: `Unknown argument: ${arg}` };
    }
  }

  return { options };
}

export function helpText() {
  return [
    "Usage",
    "  npm run verify:v3-placement -- [options]",
    "",
    "Options",
    "  --json                    Print JSON only.",
    "  --help                    Print this help.",
    "  --skip-build              Skip npm run build only.",
    "  --skip-optional           Skip optional checks.",
    "  --base <ref>              Base ref for branch checks. Default: origin/main.",
    "  --min-resume-tests <n>    Minimum resume tests. Default: 42.",
    "",
    "Exit codes",
    "  0 READY",
    "  1 NOT_READY",
    "  2 NOT_VALIDATED",
    "  3 INVALID_CONFIGURATION",
    "  4 USAGE_ERROR",
    "",
    "Examples",
    "  npm run verify:v3-placement",
    "  npm run --silent verify:v3-placement -- --json",
    "  npm run verify:v3-placement -- --skip-build",
    "  npm run verify:v3-placement -- --base origin/main",
    "  npm run verify:v3-placement -- --min-resume-tests 42",
    "",
    "JSON mode",
    "  Use npm run --silent verify:v3-placement -- --json for raw JSON through npm.",
    "  Direct node invocation also emits raw JSON: node scripts/verify-v3-placement.mjs --json",
  ].join("\n");
}

export function readPackageJson(repoRoot) {
  const file = path.join(repoRoot, "package.json");
  if (!fs.existsSync(file)) {
    return { error: "package.json is missing", packageJson: null };
  }
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
  const check = {
    name: input.name,
    command: input.command || "",
    required: Boolean(input.required),
    status: input.status,
    exitCode: input.exitCode ?? null,
    durationMs: input.durationMs ?? 0,
    testCount: input.testCount ?? null,
    details: input.details || "",
    action: input.action || "",
  };
  return check;
}

export function validateCheckShape(check) {
  return (
    check &&
    typeof check.name === "string" &&
    typeof check.command === "string" &&
    typeof check.required === "boolean" &&
    STATUSES.has(check.status) &&
    (check.exitCode === null || typeof check.exitCode === "number") &&
    typeof check.durationMs === "number" &&
    (check.testCount === null || typeof check.testCount === "number") &&
    typeof check.details === "string" &&
    typeof check.action === "string"
  );
}

export function detectTestCount(output) {
  const text = String(output || "");
  const jsonMatch = text.trim().match(/^\{[\s\S]*\}$/);
  if (jsonMatch) {
    try {
      const parsed = JSON.parse(jsonMatch[0]);
      if (Number.isFinite(parsed.numTotalTests)) return parsed.numTotalTests;
      if (Number.isFinite(parsed.numPassedTests)) return parsed.numPassedTests;
      if (Array.isArray(parsed.testResults)) {
        return parsed.testResults.reduce((sum, item) => sum + (Number(item.numPassingTests) || 0) + (Number(item.numFailingTests) || 0), 0);
      }
    } catch {
      // Fall through to text parsing.
    }
  }

  const patterns = [
    /Tests\s+(\d+)\s+passed\s+\((\d+)\)/i,
    /Tests\s+(\d+)\s+failed\s+\|\s+(\d+)\s+passed\s+\((\d+)\)/i,
    /\((\d+)\s+tests?\)/i,
    /(\d+)\s+tests?\s+passed/i,
    /Tests\s+(\d+)\s+passed/i,
    /(\d+)\s+passed/i,
  ];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (!match) continue;
    const numbers = match.slice(1).map(Number).filter(Number.isFinite);
    if (numbers.length > 0) return Math.max(...numbers);
  }
  if (/(^|\n)\s*0\s+tests?\b/i.test(text) || /(^|\n)\s*0\s+passed\b/i.test(text)) return 0;
  return null;
}

export function detectNotValidated(output, testCount = detectTestCount(output)) {
  const lower = String(output || "").toLowerCase();
  if (testCount === 0) return true;
  if (lower.includes("no test files found")) return true;
  if (lower.includes("no matching test files")) return true;
  if (/(^|\n)\s*0\s+tests?\b/.test(lower)) return true;
  if (/(^|\n)\s*0\s+passed\b/.test(lower)) return true;
  if (/tests\s+0\s+passed/.test(lower)) return true;
  if (lower.includes("all skipped")) return true;
  if (lower.includes("skipped=total")) return true;
  try {
    const parsed = JSON.parse(String(output || "").trim());
    const total = Number(parsed.numTotalTests);
    const passed = Number(parsed.numPassedTests);
    const pending = Number(parsed.numPendingTests) || 0;
    if (Number.isFinite(total) && total > 0 && passed === 0 && pending >= total) return true;
  } catch {
    // Ignore non-JSON output.
  }
  return false;
}

export function inspectResumeScript(packageJson, repoRoot) {
  if (!packageJson || !packageJson.scripts || typeof packageJson.scripts !== "object") {
    return makeCheck({
      name: "resume script",
      required: true,
      status: "INVALID_CONFIGURATION",
      details: "package.json scripts are missing or malformed.",
      action: "Restore a valid package.json scripts object.",
    });
  }

  const script = packageJson.scripts["test:resume"];
  if (!script) {
    return makeCheck({
      name: "resume script",
      required: true,
      status: "MISSING",
      details: "test:resume script is missing.",
      action: "Add test:resume targeting the exact resume test file.",
    });
  }

  const requiredExists = fs.existsSync(path.join(repoRoot, REQUIRED_RESUME_FILE));
  const altExists = fs.existsSync(path.join(repoRoot, ALT_RESUME_FILE));
  const accepted = [];
  if (requiredExists) accepted.push(`vitest run ${REQUIRED_RESUME_FILE}`);
  if (altExists) accepted.push(`vitest run ${ALT_RESUME_FILE}`);

  if (accepted.length === 0) {
    return makeCheck({
      name: "resume script",
      command: script,
      required: true,
      status: "MISSING",
      details: "Resume test file is missing.",
      action: "Restore the PR #972 resume test file before running this gate.",
    });
  }

  const trimmed = script.trim();
  if (!accepted.includes(trimmed)) {
    return makeCheck({
      name: "resume script",
      command: script,
      required: true,
      status: "INVALID_CONFIGURATION",
      details: `test:resume must target the exact resume test file. Current: ${script}`,
      action: "Replace broad test:resume with the exact resume smoke test path.",
    });
  }

  return makeCheck({
    name: "resume script",
    command: script,
    required: true,
    status: "PASS",
    details: "test:resume targets the exact resume suite.",
  });
}

export function resolveResumeTestFile(repoRoot) {
  if (fs.existsSync(path.join(repoRoot, REQUIRED_RESUME_FILE))) return REQUIRED_RESUME_FILE;
  if (fs.existsSync(path.join(repoRoot, ALT_RESUME_FILE))) return ALT_RESUME_FILE;
  return null;
}

export function inspectResumeTestStructure(repoRoot) {
  const rel = resolveResumeTestFile(repoRoot);
  if (!rel) {
    return makeCheck({
      name: "resume suite structure",
      required: true,
      status: "MISSING",
      details: "Resume test file is missing.",
      action: "Restore the resume reliability suite before running this gate.",
    });
  }

  const text = fs.readFileSync(path.join(repoRoot, rel), "utf8").toLowerCase();
  const groups = [
    ["route normalization", [/route/, /normal id/, /room-prefixed|nested room prefix|encoded colon/]],
    ["marker lifecycle", [/marker/, /stale marker|valid marker|completed marker|different placement\/session/]],
    ["resume behavior", [/resume/, /resumes same lesson|resume target|return-to-resultspage/]],
    ["duplicate actions", [/duplicate|double-click|triple-click/, /double-navigate/]],
    ["completion ownership", [/completion|completing inactive room|completing active room/]],
    ["localStorage corruption", [/localstorage/, /malformed marker|stale localstorage/]],
    ["learner-safe recovery", [/learner-safe/, /technical copy|scary|resultspage copy/]],
  ];
  const missing = groups
    .filter(([, patterns]) => !patterns.every((pattern) => pattern.test(text)))
    .map(([name]) => name);

  if (missing.length > 0) {
    return makeCheck({
      name: "resume suite structure",
      command: rel,
      required: true,
      status: "NOT_VALIDATED",
      details: `Missing coverage grouping or test names: ${missing.join(", ")}`,
      action: "Add focused resume coverage for the missing grouping before using this gate.",
    });
  }

  return makeCheck({
    name: "resume suite structure",
    command: rel,
    required: true,
    status: "PASS",
    details: "Resume suite structure includes the expected coverage groups.",
  });
}

export function classifyCommandResult({ name, command, required, result, minTests = null, isTest = false }) {
  const testCount = isTest ? detectTestCount(result.output) : null;
  if (result.error) {
    return makeCheck({
      name,
      command,
      required,
      status: "FAIL",
      exitCode: result.exitCode,
      durationMs: result.durationMs,
      testCount,
      details: result.error,
      action: "Fix the command failure and rerun the verifier.",
    });
  }
  if (result.exitCode !== 0) {
    return makeCheck({
      name,
      command,
      required,
      status: "FAIL",
      exitCode: result.exitCode,
      durationMs: result.durationMs,
      testCount,
      details: firstUsefulLine(result.output) || "Command failed.",
      action: "Fix the failing check and rerun the verifier.",
    });
  }
  if (isTest && detectNotValidated(result.output, testCount)) {
    return makeCheck({
      name,
      command,
      required,
      status: "NOT_VALIDATED",
      exitCode: result.exitCode,
      durationMs: result.durationMs,
      testCount,
      details: "Test command exited successfully but did not prove real tests ran.",
      action: "Ensure the test command matches real test files and executes at least one test.",
    });
  }
  if (isTest && minTests !== null && (testCount === null || testCount < minTests)) {
    return makeCheck({
      name,
      command,
      required,
      status: "NOT_VALIDATED",
      exitCode: result.exitCode,
      durationMs: result.durationMs,
      testCount,
      details: `Detected ${testCount ?? "unknown"} tests; expected at least ${minTests}.`,
      action: `Ensure npm run test:resume targets the exact resume test file and executes at least ${minTests} tests.`,
    });
  }
  return makeCheck({
    name,
    command,
    required,
    status: "PASS",
    exitCode: result.exitCode,
    durationMs: result.durationMs,
    testCount,
    details: "Command passed.",
  });
}

function firstUsefulLine(output) {
  return String(output || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .find(Boolean) || "";
}

function hasScript(packageJson, name) {
  return Boolean(packageJson?.scripts && Object.prototype.hasOwnProperty.call(packageJson.scripts, name));
}

function missingOptional(name, command) {
  return makeCheck({
    name,
    command,
    required: false,
    status: "MISSING",
    details: "Optional check is not present in this checkout.",
    action: "",
  });
}

export function classifyValidateTestsResult(result) {
  const command = "npm run validate:tests -- --pattern definitelyNoSuchMercyPattern";
  if (result.exitCode === 2) {
    return makeCheck({
      name: "validate tests impossible pattern",
      command,
      required: false,
      status: "PASS",
      exitCode: result.exitCode,
      durationMs: result.durationMs,
      details: "Impossible pattern correctly failed validation.",
    });
  }
  if (result.exitCode === 0) {
    return makeCheck({
      name: "validate tests impossible pattern",
      command,
      required: false,
      status: "FALSE_GREEN_RISK",
      exitCode: result.exitCode,
      durationMs: result.durationMs,
      details: "Impossible pattern passed, so this validator may be a false green.",
      action: "Fix validate:tests so impossible patterns fail.",
    });
  }
  return makeCheck({
    name: "validate tests impossible pattern",
    command,
    required: false,
    status: "FAIL",
    exitCode: result.exitCode,
    durationMs: result.durationMs,
    details: firstUsefulLine(result.output) || "Optional validator failed.",
    action: "Fix validate:tests or skip optional checks only for local diagnosis.",
  });
}

export function parseStatusCounts(statusOutput) {
  const counts = { staged: 0, unstaged: 0, untracked: 0 };
  for (const line of String(statusOutput || "").split(/\r?\n/).filter(Boolean)) {
    if (line.startsWith("??")) {
      counts.untracked += 1;
      continue;
    }
    const indexStatus = line[0];
    const worktreeStatus = line[1];
    if (indexStatus && indexStatus !== " " && indexStatus !== "?") counts.staged += 1;
    if (worktreeStatus && worktreeStatus !== " " && worktreeStatus !== "?") counts.unstaged += 1;
  }
  return counts;
}

export function checkBranchSafety({ baseRef, repoRoot, runner }) {
  const status = runner("git", ["status", "--porcelain"], { repoRoot });
  const branch = runner("git", ["branch", "--show-current"], { repoRoot });
  const commit = runner("git", ["rev-parse", "--short", "HEAD"], { repoRoot });
  const changed = runner("git", ["diff", "--name-only", `${baseRef}...HEAD`], { repoRoot });
  const unstaged = runner("git", ["diff", "--name-only"], { repoRoot });
  const staged = runner("git", ["diff", "--cached", "--name-only"], { repoRoot });
  const untracked = runner("git", ["ls-files", "--others", "--exclude-standard"], { repoRoot });
  const counts = parseStatusCounts(status.stdout);
  const branchFiles = uniqueLines(changed.stdout);
  const dirtyFiles = uniqueLines(`${unstaged.stdout}\n${staged.stdout}\n${untracked.stdout}`);
  const files = uniqueLines(`${changed.stdout}\n${unstaged.stdout}\n${staged.stdout}\n${untracked.stdout}`);
  const disallowedBranchFiles = branchFiles.filter((file) => file && !ALLOWED_CHANGED_PATHS.has(file));
  const disallowedDirtyFiles = dirtyFiles.filter((file) => file && !branchFiles.includes(file) && !ALLOWED_CHANGED_PATHS.has(file));
  const dirtyState = counts.staged + counts.unstaged + counts.untracked === 0 ? "clean" : "dirty";
  const details = [
    `base ref: ${baseRef}`,
    `branch: ${branch.stdout.trim() || "<unknown>"}`,
    `commit: ${commit.stdout.trim() || "<unknown>"}`,
    `state: ${dirtyState}`,
    `staged: ${counts.staged}`,
    `unstaged: ${counts.unstaged}`,
    `untracked: ${counts.untracked}`,
    `changed files: ${files.length}`,
    `branch files: ${branchFiles.length}`,
    `dirty files: ${dirtyFiles.length}`,
  ].join("; ");
  if (disallowedBranchFiles.length > 0 || disallowedDirtyFiles.length > 0) {
    const branchDetail = disallowedBranchFiles.length ? `unrelated branch files: ${disallowedBranchFiles.join(", ")}` : "";
    const dirtyDetail = disallowedDirtyFiles.length ? `worktree dirty outside branch diff: ${disallowedDirtyFiles.join(", ")}` : "";
    return makeCheck({
      name: "branch safety",
      command: `git diff --name-only ${baseRef}...HEAD`,
      required: true,
      status: "FAIL",
      exitCode: changed.exitCode,
      durationMs: status.durationMs + changed.durationMs + unstaged.durationMs + staged.durationMs + untracked.durationMs,
      details: [details, branchDetail, dirtyDetail].filter(Boolean).join("; "),
      action: "Remove unrelated files from this PR or split them into a separate PR.",
    });
  }
  return makeCheck({
    name: "branch safety",
    command: `git diff --name-only ${baseRef}...HEAD`,
    required: true,
    status: "PASS",
    exitCode: changed.exitCode,
    durationMs: status.durationMs + changed.durationMs + unstaged.durationMs + staged.durationMs + untracked.durationMs,
    details,
  });
}

function uniqueLines(text) {
  return [...new Set(String(text || "").split(/\r?\n/).map((line) => line.trim()).filter(Boolean))].sort();
}

export function scanDrift({ baseRef, repoRoot, runner }) {
  const paths = runner("git", ["diff", "--name-only", `${baseRef}...HEAD`], { repoRoot });
  const diff = runner("git", ["diff", `${baseRef}...HEAD`], { repoRoot });
  const pathHits = uniqueLines(paths.stdout).filter((file) => BANNED_TERMS.some((term) => file.includes(term)));
  const lineHits = [];
  let currentFile = "";
  for (const line of String(diff.stdout || "").split(/\r?\n/)) {
    if (line.startsWith("+++ b/")) {
      currentFile = line.slice(6);
      continue;
    }
    if (!line.startsWith("+") || line.startsWith("+++")) continue;
    if (currentFile === DRIFT_FIXTURE_PATH) continue;
    const hit = BANNED_TERMS.find((term) => line.includes(term));
    if (hit) lineHits.push(`${currentFile}: ${hit}`);
  }
  if (pathHits.length > 0 || lineHits.length > 0) {
    return makeCheck({
      name: "drift guard",
      command: `git diff ${baseRef}...HEAD`,
      required: true,
      status: "FAIL",
      exitCode: diff.exitCode,
      durationMs: paths.durationMs + diff.durationMs,
      details: [...pathHits, ...lineHits].join(", "),
      action: "Remove banned architecture drift from this branch.",
    });
  }
  return makeCheck({
    name: "drift guard",
    command: `git diff ${baseRef}...HEAD`,
    required: true,
    status: "PASS",
    exitCode: diff.exitCode,
    durationMs: paths.durationMs + diff.durationMs,
    details: "No banned drift found.",
  });
}

export function checkPackageDiff({ baseRef, repoRoot, runner }) {
  const diff = runner("git", ["diff", `${baseRef}...HEAD`, "--", "package.json"], { repoRoot });
  const addedScripts = [];
  for (const line of String(diff.stdout || "").split(/\r?\n/)) {
    const match = line.match(/^\+\s*"([^"]+)":\s*"[^"]+"/);
    if (match) addedScripts.push(match[1]);
  }
  const unrelated = addedScripts.filter((name) => !["test:resume", "verify:v3-placement", "release:v3-placement"].includes(name));
  if (unrelated.length > 0) {
    return makeCheck({
      name: "package diff",
      command: `git diff ${baseRef}...HEAD -- package.json`,
      required: true,
      status: "FAIL",
      exitCode: diff.exitCode,
      durationMs: diff.durationMs,
      details: `Unexpected package script additions: ${unrelated.join(", ")}`,
      action: "Remove unrelated package.json changes from this branch.",
    });
  }
  return makeCheck({
    name: "package diff",
    command: `git diff ${baseRef}...HEAD -- package.json`,
    required: true,
    status: "PASS",
    exitCode: diff.exitCode,
    durationMs: diff.durationMs,
    details: "Only test:resume, verify:v3-placement, and release:v3-placement script additions are present.",
  });
}

export function extractBlockers(checks) {
  const blockers = [];
  const seen = new Set();
  for (const check of checks) {
    if (check.status === "PASS" || check.status === "SKIPPED") continue;
    if (!check.required && check.status === "MISSING") continue;
    if (seen.has(check.name)) continue;
    blockers.push({
      check: check.name,
      status: check.status,
      action: check.action || defaultActionFor(check),
    });
    seen.add(check.name);
    if (blockers.length >= MAX_BLOCKERS) break;
  }
  return blockers;
}

function defaultActionFor(check) {
  if (check.status === "MISSING") return "Restore the missing required check and rerun the verifier.";
  if (check.status === "NOT_VALIDATED") return "Fix the check so it proves real tests ran.";
  if (check.status === "INVALID_CONFIGURATION") return "Fix the malformed verifier configuration.";
  if (check.status === "FALSE_GREEN_RISK") return "Fix the validator that returned a false green.";
  return "Fix this blocker and rerun the verifier.";
}

export function decideExit(checks) {
  if (checks.some((check) => !validateCheckShape(check))) {
    return { exitCode: 3, exitReason: INVALID_CONFIGURATION };
  }
  if (checks.some((check) => check.status === "INVALID_CONFIGURATION")) {
    return { exitCode: 3, exitReason: INVALID_CONFIGURATION };
  }
  if (checks.some((check) => check.required && check.status === "NOT_VALIDATED")) {
    return { exitCode: 2, exitReason: NOT_VALIDATED };
  }
  if (checks.some((check) => check.required && check.status === "MISSING")) {
    return { exitCode: 1, exitReason: NOT_READY };
  }
  if (checks.some((check) => check.status === "FAIL" || check.status === "FALSE_GREEN_RISK")) {
    return { exitCode: 1, exitReason: NOT_READY };
  }
  return { exitCode: 0, exitReason: READY };
}

function skippedCheck(name, command, required) {
  return makeCheck({
    name,
    command,
    required,
    status: "SKIPPED",
    details: "Skipped by CLI option.",
  });
}

export function buildStatusModel(input = {}) {
  const repoRoot = input.repoRoot || process.cwd();
  const options = {
    baseRef: DEFAULT_BASE,
    minResumeTests: DEFAULT_MIN_RESUME_TESTS,
    skipBuild: false,
    skipOptional: false,
    ...(input.options || {}),
  };
  const runner = input.runner || runCommand;
  const generatedAt = input.generatedAt || new Date().toISOString();
  const packageRead = readPackageJson(repoRoot);
  const packageJson = packageRead.packageJson;
  const requiredChecks = [];
  const optionalChecks = [];

  if (packageRead.error) {
    requiredChecks.push(makeCheck({
      name: "package config",
      command: "package.json",
      required: true,
      status: "INVALID_CONFIGURATION",
      details: packageRead.error,
      action: "Restore valid package.json before running this gate.",
    }));
  } else {
    requiredChecks.push(inspectResumeScript(packageJson, repoRoot));
    requiredChecks.push(inspectResumeTestStructure(repoRoot));
  }

  const requiredCommands = [
    ["resume reliability", ["npm", ["run", "test:resume"]], true, options.minResumeTests],
    ["resume filter", ["npm", ["run", "test", "--", "resumeSmoke"]], true, options.minResumeTests],
    ["typecheck:app", ["npm", ["run", "typecheck:app"]], false, null],
  ];
  for (const [name, [cmd, args], isTest, minTests] of requiredCommands) {
    const command = [cmd, ...args].join(" ");
    if (packageJson && cmd === "npm") {
      const scriptName = args[1] === "test" ? "test" : args[1];
      if (args[0] === "run" && !hasScript(packageJson, scriptName)) {
        requiredChecks.push(makeCheck({
          name,
          command,
          required: true,
          status: "MISSING",
          details: `${scriptName} script is missing.`,
          action: `Restore npm script ${scriptName} before running this gate.`,
        }));
        continue;
      }
    }
    requiredChecks.push(classifyCommandResult({
      name,
      command,
      required: true,
      result: runner(cmd, args, { repoRoot }),
      isTest,
      minTests,
    }));
  }

  if (options.skipBuild) {
    requiredChecks.push(skippedCheck("build", "npm run build", true));
  } else if (packageJson && !hasScript(packageJson, "build")) {
    requiredChecks.push(makeCheck({
      name: "build",
      command: "npm run build",
      required: true,
      status: "MISSING",
      details: "build script is missing.",
      action: "Restore npm run build before running this gate.",
    }));
  } else {
    requiredChecks.push(classifyCommandResult({
      name: "build",
      command: "npm run build",
      required: true,
      result: runner("npm", ["run", "build"], { repoRoot }),
    }));
  }

  requiredChecks.push(classifyCommandResult({
    name: "git diff check",
    command: "git diff --check",
    required: true,
    result: runner("git", ["diff", "--check"], { repoRoot }),
  }));

  const branchSafety = checkBranchSafety({ baseRef: options.baseRef, repoRoot, runner });
  const driftGuard = scanDrift({ baseRef: options.baseRef, repoRoot, runner });
  const packageDiff = checkPackageDiff({ baseRef: options.baseRef, repoRoot, runner });
  requiredChecks.push(branchSafety, driftGuard, packageDiff);

  if (options.skipOptional) {
    optionalChecks.push(skippedCheck("validate tests impossible pattern", "npm run validate:tests -- --pattern definitelyNoSuchMercyPattern", false));
    optionalChecks.push(skippedCheck("mb status", "npm run mb:status", false));
    optionalChecks.push(skippedCheck("mobile audio", "npm run test:mobile-audio", false));
    optionalChecks.push(skippedCheck("placement session", `npm run test -- ${PLACEMENT_SESSION_FILE}`, false));
  } else if (packageJson) {
    if (hasScript(packageJson, "validate:tests")) {
      optionalChecks.push(classifyValidateTestsResult(runner("npm", ["run", "validate:tests", "--", "--pattern", "definitelyNoSuchMercyPattern"], { repoRoot })));
    } else {
      optionalChecks.push(missingOptional("validate tests impossible pattern", "npm run validate:tests -- --pattern definitelyNoSuchMercyPattern"));
    }
    if (hasScript(packageJson, "mb:status")) {
      optionalChecks.push(classifyCommandResult({ name: "mb status", command: "npm run mb:status", required: false, result: runner("npm", ["run", "mb:status"], { repoRoot }) }));
    } else {
      optionalChecks.push(missingOptional("mb status", "npm run mb:status"));
    }
    if (hasScript(packageJson, "test:mobile-audio")) {
      optionalChecks.push(classifyCommandResult({ name: "mobile audio", command: "npm run test:mobile-audio", required: false, result: runner("npm", ["run", "test:mobile-audio"], { repoRoot }), isTest: true }));
    } else {
      optionalChecks.push(missingOptional("mobile audio", "npm run test:mobile-audio"));
    }
    if (fs.existsSync(path.join(repoRoot, PLACEMENT_SESSION_FILE))) {
      optionalChecks.push(classifyCommandResult({
        name: "placement session",
        command: `npm run test -- ${PLACEMENT_SESSION_FILE}`,
        required: false,
        result: runner("npm", ["run", "test", "--", PLACEMENT_SESSION_FILE], { repoRoot }),
        isTest: true,
        minTests: 1,
      }));
    } else {
      optionalChecks.push(missingOptional("placement session", `npm run test -- ${PLACEMENT_SESSION_FILE}`));
    }
  }

  const branch = runner("git", ["branch", "--show-current"], { repoRoot });
  const commit = runner("git", ["rev-parse", "--short", "HEAD"], { repoRoot });
  const checks = [...requiredChecks, ...optionalChecks];
  const topBlockers = extractBlockers(checks);
  const nextActions = topBlockers.map((blocker) => ({ check: blocker.check, action: blocker.action }));
  const decision = decideExit(checks);
  const resumeSuite = {
    file: resolveResumeTestFile(repoRoot),
    checks: requiredChecks.filter((check) => check.name.includes("resume")),
  };
  const placementSession = optionalChecks.find((check) => check.name === "placement session") || null;
  const buildReadiness = {
    checks: requiredChecks.filter((check) => ["typecheck:app", "build", "git diff check"].includes(check.name)),
  };
  return {
    schemaVersion: SCHEMA_VERSION,
    generatedAt,
    repoRoot,
    baseRef: options.baseRef,
    branch: branch.stdout.trim() || "<unknown>",
    commit: commit.stdout.trim() || "<unknown>",
    requiredChecks,
    optionalChecks,
    resumeSuite,
    placementSession,
    buildReadiness,
    branchSafety,
    driftGuard,
    packageDiff,
    topBlockers,
    nextActions,
    exitCode: decision.exitCode,
    exitReason: decision.exitReason,
  };
}

export function formatTerminal(model) {
  const lines = [];
  lines.push("V3 Placement Verification");
  lines.push("");
  lines.push("Run Info");
  lines.push(`repo root: ${model.repoRoot}`);
  lines.push(`base ref: ${model.baseRef}`);
  lines.push(`branch: ${model.branch}`);
  lines.push(`commit: ${model.commit}`);
  lines.push(`node version: ${process.version}`);
  lines.push(`generated timestamp: ${model.generatedAt}`);
  lines.push("");
  lines.push("Required Checks");
  model.requiredChecks.forEach((check) => lines.push(formatCheckLine(check)));
  lines.push("");
  lines.push("Optional Checks");
  model.optionalChecks.forEach((check) => lines.push(formatCheckLine(check)));
  lines.push("");
  lines.push("Resume Suite");
  lines.push(`file: ${model.resumeSuite.file || "<missing>"}`);
  model.resumeSuite.checks.forEach((check) => lines.push(formatCheckLine(check)));
  lines.push("");
  lines.push("Placement Session");
  lines.push(model.placementSession ? formatCheckLine(model.placementSession) : "status: MISSING");
  lines.push("");
  lines.push("Build Readiness");
  model.buildReadiness.checks.forEach((check) => lines.push(formatCheckLine(check)));
  lines.push("");
  lines.push("Branch Safety");
  lines.push(formatCheckLine(model.branchSafety));
  lines.push("");
  lines.push("Drift Guard");
  lines.push(formatCheckLine(model.driftGuard));
  lines.push("");
  lines.push("Package Diff");
  lines.push(formatCheckLine(model.packageDiff));
  lines.push("");
  lines.push("Top Blockers");
  if (model.topBlockers.length === 0) {
    lines.push("None");
  } else {
    model.topBlockers.forEach((blocker) => lines.push(`- ${blocker.check}: ${blocker.status} | action: ${blocker.action}`));
  }
  lines.push("");
  lines.push("Next Actions");
  if (model.nextActions.length === 0) {
    lines.push("None");
  } else {
    model.nextActions.forEach((action) => lines.push(`- ${action.check}: ${action.action}`));
  }
  lines.push("");
  lines.push("Exit Summary");
  lines.push(`exit code: ${model.exitCode}`);
  lines.push(`exit reason: ${model.exitReason}`);
  return `${lines.join("\n")}\n`;
}

function formatCheckLine(check) {
  const tests = check.testCount === null ? "" : ` | test count: ${check.testCount}`;
  return `- ${check.name}: ${check.status} | command: ${check.command || "-"} | exit code: ${check.exitCode ?? "-"} | duration ms: ${check.durationMs}${tests} | details: ${check.details || "-"}`;
}

export function formatJson(model) {
  return `${JSON.stringify({
    schemaVersion: model.schemaVersion,
    generatedAt: model.generatedAt,
    repoRoot: model.repoRoot,
    baseRef: model.baseRef,
    branch: model.branch,
    commit: model.commit,
    requiredChecks: model.requiredChecks,
    optionalChecks: model.optionalChecks,
    resumeSuite: model.resumeSuite,
    placementSession: model.placementSession,
    buildReadiness: model.buildReadiness,
    branchSafety: model.branchSafety,
    driftGuard: model.driftGuard,
    packageDiff: model.packageDiff,
    topBlockers: model.topBlockers,
    nextActions: model.nextActions,
    exitCode: model.exitCode,
    exitReason: model.exitReason,
  }, null, 2)}\n`;
}

export async function main(argv = process.argv.slice(2), deps = {}) {
  const parsed = parseArgs(argv);
  if (parsed.error) {
    const message = `${parsed.error}\n\n${helpText()}\n`;
    (deps.stderr || process.stderr).write(message);
    return 4;
  }
  if (parsed.options.help) {
    (deps.stdout || process.stdout).write(`${helpText()}\n`);
    return 0;
  }
  if (process.env.VERIFY_V3_PLACEMENT_MOCK === "ready" && !deps.forceReal) {
    const model = mockedReadyModel(parsed.options);
    (deps.stdout || process.stdout).write(parsed.options.json ? formatJson(model) : formatTerminal(model));
    return model.exitCode;
  }
  const model = buildStatusModel({
    repoRoot: deps.repoRoot || process.cwd(),
    options: parsed.options,
    runner: deps.runner || runCommand,
    generatedAt: deps.generatedAt,
  });
  (deps.stdout || process.stdout).write(parsed.options.json ? formatJson(model) : formatTerminal(model));
  return model.exitCode;
}

function mockedReadyModel(options) {
  const pass = (name, command, required, testCount = null) => makeCheck({
    name,
    command,
    required,
    status: "PASS",
    exitCode: 0,
    durationMs: 1,
    testCount,
    details: "Mocked pass.",
  });
  const requiredChecks = [
    pass("resume script", "vitest run " + REQUIRED_RESUME_FILE, true),
    pass("resume suite structure", REQUIRED_RESUME_FILE, true),
    pass("resume reliability", "npm run test:resume", true, options.minResumeTests),
    pass("resume filter", "npm run test -- resumeSmoke", true, options.minResumeTests),
    pass("typecheck:app", "npm run typecheck:app", true),
    options.skipBuild ? skippedCheck("build", "npm run build", true) : pass("build", "npm run build", true),
    pass("git diff check", "git diff --check", true),
  ];
  const branchSafety = pass("branch safety", `git diff --name-only ${options.baseRef}...HEAD`, true);
  const driftGuard = pass("drift guard", `git diff ${options.baseRef}...HEAD`, true);
  const packageDiff = pass("package diff", `git diff ${options.baseRef}...HEAD -- package.json`, true);
  requiredChecks.push(branchSafety, driftGuard, packageDiff);
  const optionalChecks = options.skipOptional
    ? [
      skippedCheck("validate tests impossible pattern", "npm run validate:tests -- --pattern definitelyNoSuchMercyPattern", false),
      skippedCheck("mb status", "npm run mb:status", false),
      skippedCheck("mobile audio", "npm run test:mobile-audio", false),
      skippedCheck("placement session", `npm run test -- ${PLACEMENT_SESSION_FILE}`, false),
    ]
    : [pass("placement session", `npm run test -- ${PLACEMENT_SESSION_FILE}`, false, 1)];
  const checks = [...requiredChecks, ...optionalChecks];
  const topBlockers = extractBlockers(checks);
  const decision = decideExit(checks);
  return {
    schemaVersion: SCHEMA_VERSION,
    generatedAt: "2026-05-21T00:00:00.000Z",
    repoRoot: "/mock/repo",
    baseRef: options.baseRef,
    branch: "mock-branch",
    commit: "mock",
    requiredChecks,
    optionalChecks,
    resumeSuite: { file: REQUIRED_RESUME_FILE, checks: requiredChecks.filter((check) => check.name.includes("resume")) },
    placementSession: optionalChecks.find((check) => check.name === "placement session") || null,
    buildReadiness: { checks: requiredChecks.filter((check) => ["typecheck:app", "build", "git diff check"].includes(check.name)) },
    branchSafety,
    driftGuard,
    packageDiff,
    topBlockers,
    nextActions: topBlockers.map((blocker) => ({ check: blocker.check, action: blocker.action })),
    exitCode: decision.exitCode,
    exitReason: decision.exitReason,
  };
}

const currentFile = fileURLToPath(import.meta.url);
if (process.argv[1] && path.resolve(process.argv[1]) === currentFile) {
  main().then((code) => {
    process.exitCode = code;
  });
}
