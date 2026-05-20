import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import process from "node:process";

import {
  compareReplayDeterminism,
  stableStringify,
  validateReplayArtifact,
} from "../../src/lib/placementDrift/validateReplayArtifact.js";

interface RunArtifacts {
  label: string;
  outDir: string;
  raw: unknown;
  driftDiff: unknown;
  stdout: string;
}

const args = readArgs();
const runs = Number(args.get("runs") ?? 3);
const limit = args.get("limit");
const keepDir = args.get("outDir");
const fixturePath = args.get("fixtures");
const rootOutDir = keepDir ?? fs.mkdtempSync(path.join(os.tmpdir(), "placement-replay-determinism-"));
const artifacts: RunArtifacts[] = [];

if (!Number.isInteger(runs) || runs < 2) {
  fail(["--runs must be an integer >= 2"]);
}

for (let index = 0; index < runs; index += 1) {
  const label = `determinism-${String(index + 1).padStart(2, "0")}`;
  const outDir = path.join(rootOutDir, label);
  fs.mkdirSync(outDir, { recursive: true });
  const commandArgs = [
    "scripts/placement-v3/run-grading-replay.ts",
    "--simulate",
    "--batch",
    label,
    "--outDir",
    outDir,
    "--resume=false",
  ];
  if (limit) commandArgs.push("--limit", limit);
  if (fixturePath) commandArgs.push("--fixtures", fixturePath);

  const stdout = execFileSync(path.join("node_modules", ".bin", "tsx"), commandArgs, {
    cwd: process.cwd(),
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  const files = fs.readdirSync(outDir);
  const rawPath = findRawRunPath(outDir, files);
  const driftDiffPath = findOnePath(outDir, files, ".drift-diff.json");
  artifacts.push({
    label,
    outDir,
    raw: JSON.parse(fs.readFileSync(rawPath, "utf8")) as unknown,
    driftDiff: JSON.parse(fs.readFileSync(driftDiffPath, "utf8")) as unknown,
    stdout,
  });
}

const errors: string[] = [];
for (const artifact of artifacts) {
  const rawValidation = validateReplayArtifact(artifact.raw);
  const diffValidation = validateReplayArtifact(artifact.driftDiff);
  errors.push(...rawValidation.errors.map((error) => `${artifact.label} raw: ${error}`));
  errors.push(...diffValidation.errors.map((error) => `${artifact.label} diff: ${error}`));
}

const baseline = artifacts[0];
for (const artifact of artifacts.slice(1)) {
  const rawComparison = compareReplayDeterminism(baseline.raw, artifact.raw);
  const diffComparison = compareReplayDeterminism(baseline.driftDiff, artifact.driftDiff);
  if (!rawComparison.ok) {
    errors.push(`${artifact.label} raw output differs from ${baseline.label}`);
    errors.push(...rawComparison.errors);
    writeDiff(rootOutDir, `${artifact.label}-raw.expected.json`, rawComparison.expected);
    writeDiff(rootOutDir, `${artifact.label}-raw.actual.json`, rawComparison.actual);
  }
  if (!diffComparison.ok) {
    errors.push(`${artifact.label} drift diff differs from ${baseline.label}`);
    errors.push(...diffComparison.errors);
    writeDiff(rootOutDir, `${artifact.label}-diff.expected.json`, diffComparison.expected);
    writeDiff(rootOutDir, `${artifact.label}-diff.actual.json`, diffComparison.actual);
  }
}

if (errors.length) fail(errors);

const sampleCount = validateReplayArtifact(baseline.raw).sampleOrder.length;
console.log(
  [
    "[placement-drift] replay determinism check passed",
    `runs=${runs}`,
    `samples=${sampleCount}`,
    `outDir=${rootOutDir}`,
    "simulated=true",
  ].join(" "),
);

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

function writeDiff(outDir: string, fileName: string, body: unknown) {
  fs.writeFileSync(path.join(outDir, fileName), `${stableStringify(body)}\n`);
}

function fail(errors: string[]): never {
  console.error("[placement-drift] replay determinism check failed");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

function readArgs(): Map<string, string> {
  const out = new Map<string, string>();
  const raw = process.argv.slice(2);
  for (let i = 0; i < raw.length; i += 1) {
    const arg = raw[i];
    if (!arg.startsWith("--")) continue;
    const stripped = arg.slice(2);
    if (stripped.includes("=")) {
      const [key, value = "true"] = stripped.split("=");
      out.set(key, value);
      continue;
    }
    const next = raw[i + 1];
    if (next && !next.startsWith("--")) {
      out.set(stripped, next);
      i += 1;
    } else {
      out.set(stripped, "true");
    }
  }
  return out;
}
