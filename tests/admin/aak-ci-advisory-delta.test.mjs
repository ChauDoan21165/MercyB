import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const script = path.join(repoRoot, "scripts/admin/aak-ci-advisory-delta.mjs");

function run(args) {
  return spawnSync(process.execPath, [script, ...args], { encoding: "utf8" });
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

describe("AAK CI advisory delta runner", () => {
  it("computes deltas when a previous report exists", () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "aak-ci-delta-"));
    const currentPath = path.join(tempDir, "current.json");
    const previousPath = path.join(tempDir, "previous.json");
    const outDir = path.join(tempDir, "out");

    writeJson(currentPath, {
      summary: { checks_run: 6, advisory_pass: 4, advisory_fail: 1, skipped: 1 },
    });
    writeJson(previousPath, {
      summary: { checks_run: 4, advisory_pass: 2, advisory_fail: 1, skipped: 1 },
    });

    const result = run([currentPath, previousPath, outDir]);
    expect(result.status).toBe(0);

    const report = JSON.parse(result.stdout.trim());
    expect(report.ok).toBe(true);
    expect(report.mode).toBe("ADVISORY_DELTA");
    expect(report.comparison_available).toBe(true);
    expect(report.delta).toEqual({
      checks_run_delta: 2,
      advisory_pass_delta: 2,
      advisory_fail_delta: 0,
      skipped_delta: 0,
    });

    expect(fs.existsSync(path.join(outDir, "aak-ci-advisory-delta-report.json"))).toBe(true);
    expect(fs.existsSync(path.join(outDir, "aak-ci-advisory-delta-report.md"))).toBe(true);
    expect(fs.existsSync(path.join(outDir, "history", "aak-ci-advisory-summary.json"))).toBe(true);

    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it("compares against a persisted previous summary snapshot when no previous path is supplied", () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "aak-ci-delta-history-"));
    const outDir = path.join(tempDir, "out");
    const previousDir = path.join(outDir, "previous", "history");
    const currentPath = path.join(outDir, "aak-ci-advisory-report.json");
    fs.mkdirSync(previousDir, { recursive: true });

    writeJson(currentPath, {
      summary: { checks_run: 6, advisory_pass: 5, advisory_fail: 1, skipped: 0 },
    });
    writeJson(path.join(previousDir, "aak-ci-advisory-summary.json"), {
      schema_version: "aak-ci-advisory-summary/v1",
      summary: { checks_run: 6, advisory_pass: 4, advisory_fail: 1, skipped: 1 },
    });

    const result = run([currentPath]);
    expect(result.status).toBe(0);

    const report = JSON.parse(result.stdout.trim());
    expect(report.comparison_available).toBe(true);
    expect(report.previous_report.path).toBe(path.join(previousDir, "aak-ci-advisory-summary.json"));
    expect(report.delta).toEqual({
      checks_run_delta: 0,
      advisory_pass_delta: 1,
      advisory_fail_delta: 0,
      skipped_delta: -1,
    });
    expect(report.report_paths.current_summary_snapshot).toBe(path.join(outDir, "history", "aak-ci-advisory-summary.json"));

    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it("stays non-blocking when the previous report is missing", () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "aak-ci-delta-missing-"));
    const currentPath = path.join(tempDir, "current.json");
    const missingPreviousPath = path.join(tempDir, "missing.json");
    const outDir = path.join(tempDir, "out");

    writeJson(currentPath, {
      summary: { checks_run: 3, advisory_pass: 2, advisory_fail: 1, skipped: 0 },
    });

    const result = run([currentPath, missingPreviousPath, outDir]);
    expect(result.status).toBe(0);

    const report = JSON.parse(result.stdout.trim());
    expect(report.ok).toBe(true);
    expect(report.comparison_available).toBe(false);
    expect(report.delta).toEqual({
      checks_run_delta: null,
      advisory_pass_delta: null,
      advisory_fail_delta: null,
      skipped_delta: null,
    });

    fs.rmSync(tempDir, { recursive: true, force: true });
  });
});
