#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import process from "node:process";

const repoRoot = process.cwd();
const defaultTimeoutMs = 90_000;
const commonAmbientIncludes = ["src/vite-env.d.ts", "src/types/**/*.d.ts"];

const shardDefinitions = {
  languages: ["src/languages/**/*.ts", "src/languages/**/*.tsx"],
  "languages-punjabi": [
    "src/languages/punjabi/**/*.ts",
    "src/languages/punjabi/**/*.tsx",
  ],
  "languages-thai": [
    "src/languages/thai/**/*.ts",
    "src/languages/thai/**/*.tsx",
  ],
  lib: ["src/lib/**/*.ts", "src/lib/**/*.tsx"],
  components: ["src/components/**/*.ts", "src/components/**/*.tsx"],
  "pages-features-hooks": [
    "src/pages/**/*.ts",
    "src/pages/**/*.tsx",
    "src/features/**/*.ts",
    "src/features/**/*.tsx",
    "src/hooks/**/*.ts",
    "src/hooks/**/*.tsx",
  ],
  "no-languages": [
    "src/billing/**/*.ts",
    "src/billing/**/*.tsx",
    "src/components/**/*.ts",
    "src/components/**/*.tsx",
    "src/config/**/*.ts",
    "src/config/**/*.tsx",
    "src/contexts/**/*.ts",
    "src/contexts/**/*.tsx",
    "src/core/**/*.ts",
    "src/core/**/*.tsx",
    "src/data/**/*.ts",
    "src/data/**/*.tsx",
    "src/design-system/**/*.ts",
    "src/design-system/**/*.tsx",
    "src/features/**/*.ts",
    "src/features/**/*.tsx",
    "src/hooks/**/*.ts",
    "src/hooks/**/*.tsx",
    "src/lib/**/*.ts",
    "src/lib/**/*.tsx",
    "src/layouts/**/*.ts",
    "src/layouts/**/*.tsx",
    "src/mercy/**/*.ts",
    "src/mercy/**/*.tsx",
    "src/middleware/**/*.ts",
    "src/middleware/**/*.tsx",
    "src/notificationEngine/**/*.ts",
    "src/notificationEngine/**/*.tsx",
    "src/pages/**/*.ts",
    "src/pages/**/*.tsx",
    "src/pages-functions/**/*.ts",
    "src/pages-functions/**/*.tsx",
    "src/providers/**/*.ts",
    "src/providers/**/*.tsx",
    "src/router/**/*.ts",
    "src/router/**/*.tsx",
    "src/security/**/*.ts",
    "src/security/**/*.tsx",
    "src/services/**/*.ts",
    "src/services/**/*.tsx",
    "src/speech/**/*.ts",
    "src/speech/**/*.tsx",
    "src/stage-3b/**/*.ts",
    "src/stage-3b/**/*.tsx",
    "src/store/**/*.ts",
    "src/store/**/*.tsx",
    "src/styles/**/*.ts",
    "src/styles/**/*.tsx",
    "src/types/**/*.ts",
    "src/types/**/*.tsx",
    "src/utils/**/*.ts",
    "src/utils/**/*.tsx",
  ],
};

function parseArgs(argv) {
  const args = {
    list: false,
    timeoutMs: defaultTimeoutMs,
    shards: [],
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--list") {
      args.list = true;
      continue;
    }
    if (arg === "--timeout-ms") {
      const raw = argv[index + 1];
      index += 1;
      const parsed = Number(raw);
      if (!Number.isFinite(parsed) || parsed <= 0) {
        throw new Error(`Invalid --timeout-ms value: ${raw}`);
      }
      args.timeoutMs = parsed;
      continue;
    }
    args.shards.push(arg);
  }

  return args;
}

function writeShardConfig(tempDir, shardName, includes) {
  const configPath = path.join(tempDir, `tsconfig.${shardName}.json`);
  const relativeIncludes = [...commonAmbientIncludes, ...includes].map((include) =>
    path.relative(tempDir, path.join(repoRoot, include)),
  );
  const config = {
    extends: path.relative(tempDir, path.join(repoRoot, "tsconfig.typecheck.json")),
    include: relativeIncludes,
  };
  fs.writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`);
  return configPath;
}

function tail(text, maxLines = 80) {
  const lines = text.trimEnd().split("\n");
  return lines.slice(Math.max(0, lines.length - maxLines)).join("\n");
}

function runShard(shardName, timeoutMs, tempDir) {
  const includes = shardDefinitions[shardName];
  if (!includes) {
    throw new Error(`Unknown shard: ${shardName}`);
  }

  const configPath = writeShardConfig(tempDir, shardName, includes);
  const startedAt = Date.now();
  const result = spawnSync(
    path.join(repoRoot, "node_modules/.bin/tsc"),
    ["-p", configPath, "--noEmit", "--extendedDiagnostics"],
    {
      cwd: repoRoot,
      encoding: "utf8",
      timeout: timeoutMs,
      maxBuffer: 16 * 1024 * 1024,
    },
  );
  const elapsedMs = Date.now() - startedAt;

  const status = result.error?.code === "ETIMEDOUT"
    ? "timeout"
    : result.status === 0
      ? "pass"
      : "fail";

  return {
    shardName,
    status,
    exitCode: result.status,
    signal: result.signal,
    elapsedMs,
    stdout: tail(result.stdout || ""),
    stderr: tail(result.stderr || ""),
  };
}

function printResult(result) {
  console.log(`\n### ${result.shardName}`);
  console.log(`status=${result.status}`);
  console.log(`exitCode=${result.exitCode ?? ""}`);
  console.log(`signal=${result.signal ?? ""}`);
  console.log(`elapsedMs=${result.elapsedMs}`);
  if (result.stdout) {
    console.log("\nstdout_tail:");
    console.log(result.stdout);
  }
  if (result.stderr) {
    console.log("\nstderr_tail:");
    console.log(result.stderr);
  }
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const shardNames = Object.keys(shardDefinitions);

  if (args.list) {
    console.log(shardNames.join("\n"));
    return;
  }

  const selectedShards = args.shards.length > 0 ? args.shards : shardNames;
  const tempDir = fs.mkdtempSync(path.join(repoRoot, ".typecheck-shards-"));

  try {
    for (const shardName of selectedShards) {
      printResult(runShard(shardName, args.timeoutMs, tempDir));
    }
  } finally {
    fs.rmSync(tempDir, { force: true, recursive: true });
  }
}

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
