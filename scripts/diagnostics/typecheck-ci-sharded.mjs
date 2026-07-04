#!/usr/bin/env node

import { spawn } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import process from "node:process";

const repoRoot = process.cwd();
const defaultTimeoutMs = 240_000;
const commonAmbientIncludes = ["src/vite-env.d.ts", "src/types/**/*.d.ts"];

const ciShards = [
  {
    name: "src-root-platform",
    description: "Non-component, non-lib, non-language, non-page app support directories.",
    includes: [
      "src/billing/**/*.ts",
      "src/billing/**/*.tsx",
      "src/config/**/*.ts",
      "src/config/**/*.tsx",
      "src/content-factory/**/*.ts",
      "src/content-factory/**/*.tsx",
      "src/contexts/**/*.ts",
      "src/contexts/**/*.tsx",
      "src/core/**/*.ts",
      "src/core/**/*.tsx",
      "src/data/**/*.ts",
      "src/data/**/*.tsx",
      "src/design-system/**/*.ts",
      "src/design-system/**/*.tsx",
      "src/emails/**/*.ts",
      "src/emails/**/*.tsx",
      "src/integrations/**/*.ts",
      "src/integrations/**/*.tsx",
      "src/layouts/**/*.ts",
      "src/layouts/**/*.tsx",
      "src/mercy/**/*.ts",
      "src/mercy/**/*.tsx",
      "src/middleware/**/*.ts",
      "src/middleware/**/*.tsx",
      "src/notificationEngine/**/*.ts",
      "src/notificationEngine/**/*.tsx",
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
  },
  {
    name: "app-entry",
    description: "Root application entry files, including main.tsx integration coverage.",
    includes: [
      "src/*.ts",
      "src/*.tsx",
      "src/main/**/*.ts",
      "src/main/**/*.tsx",
    ],
  },
  {
    name: "components",
    description: "All component source covered by tsconfig.typecheck excludes.",
    includes: ["src/components/**/*.ts", "src/components/**/*.tsx"],
  },
  {
    name: "lib",
    description: "All library source covered by tsconfig.typecheck excludes.",
    includes: ["src/lib/**/*.ts", "src/lib/**/*.tsx"],
  },
  {
    name: "languages",
    description: "All language lesson source covered by tsconfig.typecheck excludes.",
    includes: ["src/languages/**/*.ts", "src/languages/**/*.tsx"],
  },
  {
    name: "pages-features-hooks",
    description: "Pages, feature modules, and hooks covered by tsconfig.typecheck excludes.",
    includes: [
      "src/pages/**/*.ts",
      "src/pages/**/*.tsx",
      "src/features/**/*.ts",
      "src/features/**/*.tsx",
      "src/hooks/**/*.ts",
      "src/hooks/**/*.tsx",
    ],
  },
];

const ciShardNames = new Set(ciShards.map((shard) => shard.name));

function parseArgs(argv) {
  const args = {
    dryRun: false,
    list: false,
    coverageReport: false,
    timeoutMs: defaultTimeoutMs,
    shards: [],
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--dry-run") {
      args.dryRun = true;
      continue;
    }
    if (arg === "--list") {
      args.list = true;
      continue;
    }
    if (arg === "--coverage-report") {
      args.coverageReport = true;
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
    if (!ciShardNames.has(arg)) {
      throw new Error(`Unknown CI typecheck shard: ${arg}`);
    }
    args.shards.push(arg);
  }

  return args;
}

function loadTypecheckConfig() {
  return JSON.parse(fs.readFileSync(path.join(repoRoot, "tsconfig.typecheck.json"), "utf8"));
}

function writeShardConfig(tempDir, shard) {
  const configPath = path.join(tempDir, `tsconfig.${shard.name}.json`);
  const relativeIncludes = [...commonAmbientIncludes, ...shard.includes].map((include) =>
    path.relative(tempDir, path.join(repoRoot, include)),
  );
  const config = {
    extends: path.relative(tempDir, path.join(repoRoot, "tsconfig.typecheck.json")),
    include: relativeIncludes,
  };
  fs.writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`);
  return configPath;
}

function walkSourceFiles(dir) {
  const files = [];
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkSourceFiles(fullPath));
      continue;
    }
    if (entry.isFile() && /\.(tsx?|d\.ts)$/.test(entry.name)) {
      files.push(path.relative(repoRoot, fullPath).split(path.sep).join("/"));
    }
  }
  return files;
}

function patternToRegExp(pattern) {
  let source = "";
  for (let index = 0; index < pattern.length; index += 1) {
    const char = pattern[index];
    const next = pattern[index + 1];
    const afterNext = pattern[index + 2];
    if (char === "*" && next === "*" && afterNext === "/") {
      source += "(?:.*/)?";
      index += 2;
      continue;
    }
    if (char === "*" && next === "*") {
      source += ".*";
      index += 1;
      continue;
    }
    if (char === "*") {
      source += "[^/]*";
      continue;
    }
    source += /[.+^${}()|[\]\\]/.test(char) ? `\\${char}` : char;
  }
  return new RegExp(`^${source}$`);
}

function isExcludedByTypecheck(file, excludes) {
  return excludes.some((pattern) => {
    if (pattern.endsWith("/**")) {
      return file.startsWith(pattern.slice(0, -3));
    }
    return patternToRegExp(pattern).test(file);
  });
}

function matchesInclude(file, include) {
  return patternToRegExp(include).test(file);
}

function printCoverageReport() {
  const config = loadTypecheckConfig();
  const excludes = config.exclude ?? [];
  const intendedFiles = walkSourceFiles(path.join(repoRoot, "src"))
    .filter((file) => !isExcludedByTypecheck(file, excludes))
    .sort();
  const covered = new Set();
  const duplicateClaims = new Map();

  for (const shard of ciShards) {
    const shardFiles = intendedFiles.filter((file) =>
      shard.includes.some((include) => matchesInclude(file, include)),
    );
    for (const file of shardFiles) {
      if (covered.has(file)) {
        duplicateClaims.set(file, (duplicateClaims.get(file) ?? 1) + 1);
      }
      covered.add(file);
    }
    console.log(`- ${shard.name}: ${shardFiles.length} intended source files`);
    console.log(`  ${shard.description}`);
  }

  const uncovered = intendedFiles.filter((file) => !covered.has(file));
  console.log("");
  console.log(`intended_files=${intendedFiles.length}`);
  console.log(`covered_files=${covered.size}`);
  console.log(`uncovered_files=${uncovered.length}`);
  console.log(`duplicate_file_claims=${duplicateClaims.size}`);
  if (uncovered.length > 0) {
    console.log("uncovered:");
    for (const file of uncovered) console.log(`  ${file}`);
  }
}

function sampleProcess(pid) {
  const result = spawn("ps", ["-p", String(pid), "-o", "pcpu=,rss=,etime="], {
    stdio: ["ignore", "pipe", "ignore"],
  });

  return new Promise((resolve) => {
    let output = "";
    result.stdout.on("data", (chunk) => {
      output += chunk.toString();
    });
    result.on("close", () => {
      const [pcpuRaw, rssRaw, elapsedRaw] = output.trim().split(/\s+/);
      resolve({
        cpu: Number(pcpuRaw) || 0,
        rssKb: Number(rssRaw) || 0,
        elapsed: elapsedRaw || "",
      });
    });
  });
}

function extractMemoryUsed(output) {
  const match = output.match(/Memory used:\s+(\d+)K/);
  return match ? Number(match[1]) : null;
}

function runShard(shard, timeoutMs, tempDir) {
  return new Promise((resolve) => {
    const configPath = writeShardConfig(tempDir, shard);
    const startedAt = Date.now();
    let stdout = "";
    let stderr = "";
    let peakRssKb = 0;
    let peakCpu = 0;
    let timedOut = false;

    console.log(`\n### ${shard.name}`);
    console.log(`description=${shard.description}`);

    const child = spawn(
      path.join(repoRoot, "node_modules/.bin/tsc"),
      ["-p", configPath, "--noEmit", "--extendedDiagnostics"],
      { cwd: repoRoot, stdio: ["ignore", "pipe", "pipe"] },
    );

    const timeout = setTimeout(() => {
      timedOut = true;
      child.kill("SIGTERM");
    }, timeoutMs);

    const sampler = setInterval(async () => {
      const sample = await sampleProcess(child.pid);
      peakRssKb = Math.max(peakRssKb, sample.rssKb);
      peakCpu = Math.max(peakCpu, sample.cpu);
    }, 1_000);

    child.stdout.on("data", (chunk) => {
      const text = chunk.toString();
      stdout += text;
      process.stdout.write(text);
    });
    child.stderr.on("data", (chunk) => {
      const text = chunk.toString();
      stderr += text;
      process.stderr.write(text);
    });
    child.on("close", (code, signal) => {
      clearTimeout(timeout);
      clearInterval(sampler);
      const elapsedMs = Date.now() - startedAt;
      const memoryUsedKb = extractMemoryUsed(stdout);
      const status = timedOut ? "timeout" : code === 0 ? "pass" : "fail";
      console.log(`status=${status}`);
      console.log(`exitCode=${code ?? ""}`);
      console.log(`signal=${signal ?? ""}`);
      console.log(`elapsedMs=${elapsedMs}`);
      console.log(`peakRssKb=${peakRssKb}`);
      console.log(`peakCpu=${peakCpu.toFixed(1)}`);
      if (memoryUsedKb !== null) console.log(`tscMemoryUsedKb=${memoryUsedKb}`);
      resolve({ status, code, signal, elapsedMs, stdout, stderr });
    });
  });
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const selected = args.shards.length > 0
    ? ciShards.filter((shard) => args.shards.includes(shard.name))
    : ciShards;

  if (args.list) {
    for (const shard of ciShards) {
      console.log(`${shard.name}: ${shard.includes.join(", ")}`);
    }
    return;
  }

  if (args.coverageReport) {
    printCoverageReport();
    return;
  }

  if (args.dryRun) {
    console.log("CI typecheck shards:");
    for (const shard of selected) {
      console.log(`- ${shard.name}`);
      for (const include of shard.includes) console.log(`  ${include}`);
    }
    return;
  }

  const tempDir = fs.mkdtempSync(path.join(repoRoot, ".typecheck-ci-shards-"));
  try {
    for (const shard of selected) {
      const result = await runShard(shard, args.timeoutMs, tempDir);
      if (result.status !== "pass") {
        process.exitCode = 1;
        return;
      }
    }
  } finally {
    fs.rmSync(tempDir, { force: true, recursive: true });
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
