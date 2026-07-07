import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const script = path.join(repoRoot, "scripts/admin/aak-ci-artifact-consumer.mjs");

function run(inputDir, outputDir) {
  return spawnSync(process.execPath, [script, inputDir, outputDir], { encoding: "utf8" });
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function writeText(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, value.endsWith("\n") ? value : `${value}\n`);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

describe("AAK CI artifact consumer", () => {
  it("reads report and delta artifacts into deterministic inventory outputs", () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "aak-ci-consumer-"));
    const inputDir = path.join(tempDir, "input");
    const outputDir = path.join(tempDir, "out");

    writeJson(path.join(inputDir, "aak-ci-advisory-report.json"), {
      ok: true,
      mode: "ADVISORY_ONLY",
      blocking: false,
      summary: { checks_run: 6, advisory_pass: 4, advisory_fail: 1, skipped: 1 },
    });
    writeText(path.join(inputDir, "aak-ci-advisory-report.md"), "# AAK CI Advisory Report\n");
    writeJson(path.join(inputDir, "aak-ci-advisory-delta-report.json"), {
      ok: true,
      mode: "ADVISORY_DELTA",
      blocking: false,
      comparison_available: true,
      summary: { checks_run: 6, advisory_pass: 4, advisory_fail: 1, skipped: 1 },
      delta: { checks_run_delta: 1, advisory_pass_delta: 1, advisory_fail_delta: 0, skipped_delta: 0 },
    });
    writeText(path.join(inputDir, "aak-ci-advisory-delta-report.md"), "# AAK CI Advisory Delta Report\n");
    writeJson(path.join(inputDir, "history", "aak-ci-advisory-summary.json"), {
      schema_version: "aak-ci-advisory-summary/v1",
      summary: { checks_run: 6, advisory_pass: 4, advisory_fail: 1, skipped: 1 },
    });

    const first = run(inputDir, outputDir);
    expect(first.status).toBe(0);
    const firstStdout = JSON.parse(first.stdout.trim());
    expect(firstStdout.workflow_safe).toBe(true);
    expect(firstStdout.availability.present_count).toBe(5);
    expect(firstStdout.availability.missing_count).toBe(0);

    const inventoryPath = path.join(outputDir, "aak-ci-artifact-inventory.json");
    const availabilityPath = path.join(outputDir, "aak-ci-artifact-availability.json");
    const markdownPath = path.join(outputDir, "aak-ci-artifact-consumer-summary.md");
    expect(fs.existsSync(inventoryPath)).toBe(true);
    expect(fs.existsSync(availabilityPath)).toBe(true);
    expect(fs.existsSync(markdownPath)).toBe(true);

    const firstInventory = fs.readFileSync(inventoryPath, "utf8");
    const second = run(inputDir, outputDir);
    expect(second.status).toBe(0);
    expect(fs.readFileSync(inventoryPath, "utf8")).toBe(firstInventory);

    const inventory = readJson(inventoryPath);
    expect(inventory.artifacts.map((artifact) => artifact.id)).toEqual([
      "advisory_delta_json",
      "advisory_delta_markdown",
      "advisory_report_json",
      "advisory_report_markdown",
      "advisory_summary_snapshot",
    ]);
    expect(inventory.artifacts.find((artifact) => artifact.id === "advisory_report_json").summary).toEqual({
      advisory_fail: 1,
      advisory_pass: 4,
      checks_run: 6,
      skipped: 1,
    });
    expect(inventory.artifacts.find((artifact) => artifact.id === "advisory_delta_json").delta).toEqual({
      advisory_fail_delta: 0,
      advisory_pass_delta: 1,
      checks_run_delta: 1,
      skipped_delta: 0,
    });

    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it("handles missing artifacts without failing", () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "aak-ci-consumer-missing-"));
    const inputDir = path.join(tempDir, "input");
    const outputDir = path.join(tempDir, "out");
    fs.mkdirSync(inputDir, { recursive: true });

    const result = run(inputDir, outputDir);
    expect(result.status).toBe(0);
    const stdout = JSON.parse(result.stdout.trim());
    expect(stdout.ok).toBe(true);
    expect(stdout.workflow_safe).toBe(true);
    expect(stdout.availability.present_count).toBe(0);
    expect(stdout.availability.missing_count).toBe(5);

    const availability = readJson(path.join(outputDir, "aak-ci-artifact-availability.json"));
    expect(availability.missing_artifacts).toEqual([
      "advisory_delta_json",
      "advisory_delta_markdown",
      "advisory_report_json",
      "advisory_report_markdown",
      "advisory_summary_snapshot",
    ]);

    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it("reports invalid JSON as availability data without failing", () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "aak-ci-consumer-invalid-"));
    const inputDir = path.join(tempDir, "input");
    const outputDir = path.join(tempDir, "out");
    writeText(path.join(inputDir, "aak-ci-advisory-report.json"), "{not-json");

    const result = run(inputDir, outputDir);
    expect(result.status).toBe(0);
    const stdout = JSON.parse(result.stdout.trim());
    expect(stdout.availability.unparseable_json_artifacts).toEqual(["advisory_report_json"]);

    const inventory = readJson(path.join(outputDir, "aak-ci-artifact-inventory.json"));
    const reportJson = inventory.artifacts.find((artifact) => artifact.id === "advisory_report_json");
    expect(reportJson.present).toBe(true);
    expect(reportJson.json_parse_ok).toBe(false);
    expect(reportJson.error).toMatch(/^invalid_json:/);

    fs.rmSync(tempDir, { recursive: true, force: true });
  });
});
