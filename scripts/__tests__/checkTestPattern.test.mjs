// Unit + integration tests for the non-vacuous test-pattern guard.
//
// Unit tests cover the pure evaluator (scripts/lib/checkTestPattern.mjs).
// Integration tests spawn the CLI (scripts/check-test-pattern.mjs) with
// canned --vitest-json fixtures so the suite does NOT recursively spawn
// vitest. This keeps the suite fast and deterministic.

import { spawnSync } from "node:child_process";
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { resolve as pathResolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import {
  evaluateVitestResult,
  formatEvaluationLine,
} from "../lib/checkTestPattern.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const CLI = pathResolve(__dirname, "..", "check-test-pattern.mjs");

// ---------------------------------------------------------------------------
// Unit tests: evaluateVitestResult
// ---------------------------------------------------------------------------

describe("evaluateVitestResult", () => {
  it("returns passed when passed > 0 and failed === 0", () => {
    const r = evaluateVitestResult({
      numTotalTests: 10,
      numPassedTests: 10,
      numFailedTests: 0,
      numPendingTests: 0,
      numTodoTests: 0,
    });
    expect(r.outcome).toBe("passed");
    expect(r.ok).toBe(true);
    expect(r.numPassed).toBe(10);
  });

  it("returns no_tests_matched when passed === 0 and failed === 0", () => {
    const r = evaluateVitestResult({
      numTotalTests: 7321,
      numPassedTests: 0,
      numFailedTests: 0,
      numPendingTests: 7321,
      numTodoTests: 0,
    });
    expect(r.outcome).toBe("no_tests_matched");
    expect(r.ok).toBe(false);
    expect(r.reason).toMatch(/NOT VALIDATED/);
    expect(r.numSkipped).toBe(7321);
  });

  it("returns tests_failed when failed > 0", () => {
    const r = evaluateVitestResult({
      numTotalTests: 10,
      numPassedTests: 7,
      numFailedTests: 3,
      numPendingTests: 0,
      numTodoTests: 0,
    });
    expect(r.outcome).toBe("tests_failed");
    expect(r.ok).toBe(false);
    expect(r.numFailed).toBe(3);
  });

  it("returns invalid_input on missing fields", () => {
    const r = evaluateVitestResult({ numTotalTestSuites: 5 });
    expect(r.outcome).toBe("invalid_input");
    expect(r.ok).toBe(false);
  });

  it("returns invalid_input on non-object input", () => {
    expect(evaluateVitestResult(null).outcome).toBe("invalid_input");
    expect(evaluateVitestResult(42).outcome).toBe("invalid_input");
    expect(evaluateVitestResult("ok").outcome).toBe("invalid_input");
    expect(evaluateVitestResult(undefined).outcome).toBe("invalid_input");
  });

  it("counts pending+todo as skipped", () => {
    const r = evaluateVitestResult({
      numTotalTests: 100,
      numPassedTests: 10,
      numFailedTests: 0,
      numPendingTests: 80,
      numTodoTests: 10,
    });
    expect(r.outcome).toBe("passed");
    expect(r.numSkipped).toBe(90);
  });

  it("does NOT treat partial pass with skipped remainder as no_tests_matched", () => {
    // 1 pass + 99 skipped = still a real validation (at least one assertion fired).
    const r = evaluateVitestResult({
      numTotalTests: 100,
      numPassedTests: 1,
      numFailedTests: 0,
      numPendingTests: 99,
      numTodoTests: 0,
    });
    expect(r.outcome).toBe("passed");
    expect(r.ok).toBe(true);
  });
});

describe("formatEvaluationLine", () => {
  it("renders the four outcome labels", () => {
    const base = {
      reason: "x",
      numPassed: 1,
      numFailed: 0,
      numTotal: 1,
      numSkipped: 0,
    };
    expect(
      formatEvaluationLine({ outcome: "passed", ok: true, ...base }),
    ).toContain("PASS");
    expect(
      formatEvaluationLine({ outcome: "no_tests_matched", ok: false, ...base }),
    ).toContain("NOT_VALIDATED");
    expect(
      formatEvaluationLine({ outcome: "tests_failed", ok: false, ...base }),
    ).toContain("FAIL");
    expect(
      formatEvaluationLine({ outcome: "invalid_input", ok: false, ...base }),
    ).toContain("INVALID");
  });
});

// ---------------------------------------------------------------------------
// Integration: CLI behaviour using --vitest-json fixture
// ---------------------------------------------------------------------------

describe("check-test-pattern CLI", () => {
  /** @type {string} */
  let workDir;

  beforeEach(() => {
    workDir = mkdtempSync(pathResolve(tmpdir(), "a7-guard-"));
  });

  afterEach(() => {
    rmSync(workDir, { recursive: true, force: true });
  });

  function writeFixture(name, payload) {
    const path = pathResolve(workDir, name);
    writeFileSync(path, JSON.stringify(payload), "utf8");
    return path;
  }

  function runCli(args) {
    return spawnSync("node", [CLI, ...args], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });
  }

  it("exits 0 (PASS) when fixture has passed > 0 and no failures", () => {
    const fixture = writeFixture("passed.json", {
      numTotalTests: 5,
      numPassedTests: 5,
      numFailedTests: 0,
      numPendingTests: 0,
      numTodoTests: 0,
    });
    const result = runCli(["--vitest-json", fixture]);
    expect(result.status).toBe(0);
    expect(result.stdout).toContain("PASS");
  });

  it("exits 2 (NOT_VALIDATED) when fixture has zero passed and zero failed", () => {
    const fixture = writeFixture("vacuous.json", {
      numTotalTests: 7321,
      numPassedTests: 0,
      numFailedTests: 0,
      numPendingTests: 7321,
      numTodoTests: 0,
    });
    const result = runCli(["--vitest-json", fixture]);
    expect(result.status).toBe(2);
    expect(result.stdout).toContain("NOT_VALIDATED");
  });

  it("exits 1 (FAIL) when fixture has any failures", () => {
    const fixture = writeFixture("failed.json", {
      numTotalTests: 10,
      numPassedTests: 7,
      numFailedTests: 3,
      numPendingTests: 0,
      numTodoTests: 0,
    });
    const result = runCli(["--vitest-json", fixture]);
    expect(result.status).toBe(1);
    expect(result.stdout).toContain("FAIL");
  });

  it("exits 3 (INVALID_INPUT) when fixture is missing required fields", () => {
    const fixture = writeFixture("invalid.json", { foo: "bar" });
    const result = runCli(["--vitest-json", fixture]);
    expect(result.status).toBe(3);
    expect(result.stdout).toContain("INVALID");
  });

  it("exits 4 (USAGE_ERROR) when no pattern/file/fixture is provided", () => {
    const result = runCli([]);
    expect(result.status).toBe(4);
  });

  it("emits machine-readable JSON when --json is set", () => {
    const fixture = writeFixture("passed.json", {
      numTotalTests: 5,
      numPassedTests: 5,
      numFailedTests: 0,
      numPendingTests: 0,
      numTodoTests: 0,
    });
    const result = runCli(["--vitest-json", fixture, "--json"]);
    expect(result.status).toBe(0);
    const parsed = JSON.parse(result.stdout.trim());
    expect(parsed.outcome).toBe("passed");
    expect(parsed.ok).toBe(true);
  });
});
