#!/usr/bin/env node
// scripts/check-test-pattern.mjs
//
// Non-vacuous test-pattern guard.
//
// Wraps `vitest run --reporter=json [-t <pattern> | <path>]` and exits with
// a non-zero code if the pattern matched zero tests. The point: prevent
// "433 skipped, 7321 skipped, exit 0" from being misread as a green
// validation in PR reports.
//
// Usage:
//   node scripts/check-test-pattern.mjs --pattern <name>
//   node scripts/check-test-pattern.mjs --file <path>
//   node scripts/check-test-pattern.mjs --vitest-json <fixture.json>
//   node scripts/check-test-pattern.mjs --pattern <name> --vitest-bin <cmd>
//   node scripts/check-test-pattern.mjs --pattern <name> --json
//
// Exit codes:
//   0  — PASS           (passed > 0, failed = 0)
//   1  — FAIL           (one or more failures)
//   2  — NOT_VALIDATED  (0 tests matched the pattern)
//   3  — INVALID_INPUT  (vitest output was unreadable)
//   4  — USAGE_ERROR    (invalid args)

import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { resolve as pathResolve } from "node:path";
import { fileURLToPath } from "node:url";

import {
  evaluateVitestResult,
  formatEvaluationLine,
} from "./lib/checkTestPattern.mjs";

const EXIT = Object.freeze({
  PASS: 0,
  FAIL: 1,
  NOT_VALIDATED: 2,
  INVALID_INPUT: 3,
  USAGE_ERROR: 4,
});

/** @returns {{ pattern?: string, file?: string, vitestJson?: string, vitestBin: string, emitJson: boolean }} */
function parseArgs(argv) {
  const args = {
    /** @type {string | undefined} */ pattern: undefined,
    /** @type {string | undefined} */ file: undefined,
    /** @type {string | undefined} */ vitestJson: undefined,
    /** @type {string} */ vitestBin: "npx",
    emitJson: false,
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    switch (a) {
      case "--pattern":
        args.pattern = argv[++i];
        break;
      case "--file":
        args.file = argv[++i];
        break;
      case "--vitest-json":
        args.vitestJson = argv[++i];
        break;
      case "--vitest-bin":
        args.vitestBin = argv[++i];
        break;
      case "--json":
        args.emitJson = true;
        break;
      case "--help":
      case "-h":
        printUsage();
        process.exit(EXIT.PASS);
        break;
      default:
        if (a && a.startsWith("--")) {
          process.stderr.write(`Unknown argument: ${a}\n`);
          process.exit(EXIT.USAGE_ERROR);
        }
        break;
    }
  }
  if (!args.pattern && !args.file && !args.vitestJson) {
    process.stderr.write(
      "Must supply at least one of: --pattern <name>, --file <path>, --vitest-json <fixture>\n",
    );
    process.exit(EXIT.USAGE_ERROR);
  }
  return args;
}

function printUsage() {
  process.stdout.write(
    `check-test-pattern — non-vacuous test-pattern guard\n\n` +
      `Required (one of):\n` +
      `  --pattern <name>      filter tests by name (vitest -t)\n` +
      `  --file <path>         filter tests by file path\n` +
      `  --vitest-json <path>  read a pre-captured JSON payload (for tests)\n\n` +
      `Optional:\n` +
      `  --vitest-bin <bin>    binary to invoke vitest with (default: npx)\n` +
      `  --json                emit machine-readable JSON to stdout\n` +
      `  -h, --help            show this help\n\n` +
      `Exit codes:\n` +
      `  0 PASS\n` +
      `  1 FAIL\n` +
      `  2 NOT_VALIDATED\n` +
      `  3 INVALID_INPUT\n` +
      `  4 USAGE_ERROR\n`,
  );
}

/** @param {{ pattern?: string, file?: string, vitestBin: string }} args */
function runVitest(args) {
  /** @type {string[]} */
  const cli = ["vitest", "run", "--reporter=json"];
  if (args.pattern) {
    cli.push("-t", args.pattern);
  }
  if (args.file) {
    cli.push(args.file);
  }
  const result = spawnSync(args.vitestBin, cli, {
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
    stdio: ["ignore", "pipe", "pipe"],
  });
  return {
    stdout: result.stdout ?? "",
    stderr: result.stderr ?? "",
    status: result.status ?? null,
    error: result.error,
  };
}

/** @param {string} stdout */
function extractJsonFromStdout(stdout) {
  // Vitest can emit non-JSON lines (warnings, prep logs) before/after the
  // JSON payload. The payload is a single top-level object — find the first
  // `{` and last `}` and try to parse.
  const start = stdout.indexOf("{");
  const end = stdout.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return null;
  try {
    return JSON.parse(stdout.slice(start, end + 1));
  } catch {
    return null;
  }
}

function main() {
  const args = parseArgs(process.argv.slice(2));

  /** @type {unknown} */
  let parsed = null;
  if (args.vitestJson) {
    try {
      const raw = readFileSync(pathResolve(args.vitestJson), "utf8");
      parsed = JSON.parse(raw);
    } catch (err) {
      process.stderr.write(
        `Failed to read --vitest-json fixture: ${err instanceof Error ? err.message : String(err)}\n`,
      );
      process.exit(EXIT.INVALID_INPUT);
    }
  } else {
    const run = runVitest(args);
    parsed = extractJsonFromStdout(run.stdout);
    if (!parsed) {
      process.stderr.write(
        `Could not parse vitest JSON output. stderr=\n${run.stderr}\n`,
      );
      process.exit(EXIT.INVALID_INPUT);
    }
  }

  const evalResult = evaluateVitestResult(parsed);
  const line = formatEvaluationLine(evalResult);

  if (args.emitJson) {
    process.stdout.write(JSON.stringify(evalResult) + "\n");
  } else {
    process.stdout.write(line + "\n");
  }

  switch (evalResult.outcome) {
    case "passed":
      process.exit(EXIT.PASS);
    case "tests_failed":
      process.exit(EXIT.FAIL);
    case "no_tests_matched":
      process.exit(EXIT.NOT_VALIDATED);
    case "invalid_input":
      process.exit(EXIT.INVALID_INPUT);
  }
}

// Run when invoked directly (not when imported).
const invokedDirectly =
  process.argv[1] && fileURLToPath(import.meta.url) === pathResolve(process.argv[1]);
if (invokedDirectly) {
  main();
}

export { EXIT, parseArgs, extractJsonFromStdout };
