import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const script = path.join(repoRoot, "scripts/admin/aak-ci-advisory.mjs");

function run(outDir) {
  return spawnSync(process.execPath, [script, outDir], { encoding: "utf8" });
}

describe("AAK CI advisory runner", () => {
  it("runs advisory checks and always stays non-blocking", () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "aak-ci-"));
    const result = run(tempDir);
    expect(result.status).toBe(0);

    const summary = JSON.parse(result.stdout.trim());
    expect(summary.ok).toBe(true);
    expect(summary.mode).toBe("ADVISORY_ONLY");
    expect(summary.blocking).toBe(false);
    expect(summary.summary.checks_run).toBeGreaterThan(0);
    expect(summary.summary.advisory_pass + summary.summary.advisory_fail + summary.summary.skipped).toBe(summary.checks.length);

    const jsonPath = path.join(tempDir, "aak-ci-advisory-report.json");
    const mdPath = path.join(tempDir, "aak-ci-advisory-report.md");
    expect(fs.existsSync(jsonPath)).toBe(true);
    expect(fs.existsSync(mdPath)).toBe(true);

    const report = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
    expect(report.ok).toBe(true);
    expect(report.mode).toBe("ADVISORY_ONLY");
    expect(report.blocking).toBe(false);
    expect(report.mutation_summary).toEqual({
      database_writes: "none",
      runtime_mutations: "none",
      product_changes: "none",
      push_merge_deploy: "none",
      coverage_updates: "none",
      verification_updates: "none",
    });

    fs.rmSync(tempDir, { recursive: true, force: true });
  });
});
