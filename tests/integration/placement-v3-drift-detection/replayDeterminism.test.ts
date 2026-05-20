import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";

import {
  compareReplayDeterminism,
  validateReplayArtifact,
} from "../../../src/lib/placementDrift/validateReplayArtifact";

describe("Placement V3 replay determinism guardrails", () => {
  it("runs simulation twice with stable ordering, stable drift diffs, and simulated markers", () => {
    const first = runSimulation("vitest-determinism-a");
    const second = runSimulation("vitest-determinism-b");

    const firstRawValidation = validateReplayArtifact(first.raw);
    const secondRawValidation = validateReplayArtifact(second.raw);
    const firstDiffValidation = validateReplayArtifact(first.driftDiff);
    const secondDiffValidation = validateReplayArtifact(second.driftDiff);

    expect(firstRawValidation.errors).toEqual([]);
    expect(secondRawValidation.errors).toEqual([]);
    expect(firstDiffValidation.errors).toEqual([]);
    expect(secondDiffValidation.errors).toEqual([]);
    expect(firstRawValidation.sampleOrder).toEqual(secondRawValidation.sampleOrder);
    expect(firstDiffValidation.sampleOrder).toEqual(secondDiffValidation.sampleOrder);

    const rawComparison = compareReplayDeterminism(first.raw, second.raw);
    const driftComparison = compareReplayDeterminism(first.driftDiff, second.driftDiff);
    expect(rawComparison.errors).toEqual([]);
    expect(rawComparison.ok).toBe(true);
    expect(driftComparison.errors).toEqual([]);
    expect(driftComparison.ok).toBe(true);
  });
});

function runSimulation(batch: string): { raw: unknown; driftDiff: unknown } {
  const outDir = fs.mkdtempSync(path.join(os.tmpdir(), `${batch}-`));
  execFileSync(
    path.join("node_modules", ".bin", "tsx"),
    [
      "scripts/placement-v3/run-grading-replay.ts",
      "--simulate",
      "--batch",
      batch,
      "--limit",
      "12",
      "--outDir",
      outDir,
      "--resume=false",
    ],
    { cwd: process.cwd(), stdio: "pipe" },
  );
  const files = fs.readdirSync(outDir);
  return {
    raw: JSON.parse(fs.readFileSync(findRawRunPath(outDir, files), "utf8")) as unknown,
    driftDiff: JSON.parse(fs.readFileSync(findOnePath(outDir, files, ".drift-diff.json"), "utf8")) as unknown,
  };
}

function findRawRunPath(outDir: string, files: string[]): string {
  const file = files.find(
    (entry) =>
      entry.endsWith(".json") &&
      !entry.endsWith(".summary.json") &&
      !entry.endsWith(".drift-diff.json") &&
      !entry.endsWith(".local-persistence.json") &&
      !entry.endsWith(".dashboard-payload.json") &&
      !entry.endsWith(".pipeline-integrity.json") &&
      !entry.endsWith(".partial.json"),
  );
  if (!file) throw new Error(`No raw replay run found in ${outDir}`);
  return path.join(outDir, file);
}

function findOnePath(outDir: string, files: string[], suffix: string): string {
  const file = files.find((entry) => entry.endsWith(suffix));
  if (!file) throw new Error(`No ${suffix} artifact found in ${outDir}`);
  return path.join(outDir, file);
}
