#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import os from "node:os";
import process from "node:process";

const WARN_FREE_BYTES = Number(process.env.C3_PREFLIGHT_MIN_FREE_BYTES || 2 * 1024 * 1024 * 1024);

function run(command, args) {
  try {
    return execFileSync(command, args, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
  } catch (error) {
    const stderr = error?.stderr?.toString?.().trim();
    throw new Error(`${command} ${args.join(" ")} failed${stderr ? `: ${stderr}` : ""}`);
  }
}

function formatGb(bytes) {
  return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`;
}

function main() {
  const free = os.freemem();
  const total = os.totalmem();
  console.log(`[host-preflight] memory free=${formatGb(free)} total=${formatGb(total)}`);
  if (free < WARN_FREE_BYTES) {
    console.warn(`[host-preflight] WARN free memory below ${formatGb(WARN_FREE_BYTES)}; run heavy gates strictly one at a time`);
  }

  if (!process.env.TMPDIR) {
    console.warn("[host-preflight] WARN TMPDIR is not set");
  } else {
    console.log(`[host-preflight] TMPDIR=${process.env.TMPDIR}`);
  }

  const desiredNodeOptions = "--max-old-space-size=6144";
  const nodeOptions = process.env.NODE_OPTIONS || "";
  console.log(`[host-preflight] standard NODE_OPTIONS=${desiredNodeOptions}`);
  if (!nodeOptions.includes(desiredNodeOptions)) {
    console.warn(`[host-preflight] WARN current NODE_OPTIONS="${nodeOptions}" does not include ${desiredNodeOptions}`);
  }

  run("git", ["fetch", "origin", "--quiet"]);
  try {
    run("git", ["rev-parse", "--verify", "--quiet", "origin/main"]);
  } catch {
    run("git", ["fetch", "origin", "main:refs/remotes/origin/main", "--quiet"]);
  }
  const branch = run("git", ["rev-parse", "--abbrev-ref", "HEAD"]);
  const head = run("git", ["rev-parse", "--short", "HEAD"]);
  const originMain = run("git", ["rev-parse", "--short", "origin/main"]);
  const relation = run("git", ["rev-list", "--left-right", "--count", "HEAD...origin/main"]);
  const [ahead = "?", behind = "?"] = relation.split(/\s+/);
  console.log(`[host-preflight] branch=${branch} HEAD=${head} origin/main=${originMain} ahead=${ahead} behind=${behind}`);
  if (branch !== "main") console.warn("[host-preflight] WARN checkout is not main");
  if (head !== originMain) console.warn("[host-preflight] WARN HEAD does not match origin/main");
  console.log("[host-preflight] PASS");
}

try {
  main();
} catch (error) {
  console.error(`[host-preflight] FAIL ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
}
