#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

export const BLOCKED_PROCESS_PATTERNS = [
  "remote-worker-ci-feeder",
  "ci-pump",
  "ci-pending-pump",
  "ci-backlog-controller",
  "c2-strict-ci-worthy",
];

function argValue(args, name) {
  const exact = `--${name}`;
  const prefix = `${exact}=`;
  const index = args.indexOf(exact);
  if (index >= 0) return args[index + 1] ?? "";
  const match = args.find((arg) => arg.startsWith(prefix));
  return match ? match.slice(prefix.length) : "";
}

export function parseProcessTable(processTable) {
  return processTable
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export function findBlockedProcesses(processCommands, blockedPatterns = BLOCKED_PROCESS_PATTERNS) {
  return processCommands.flatMap((command) => {
    const matches = blockedPatterns.filter((pattern) => command.includes(pattern));
    return matches.map((pattern) => ({ pattern, command }));
  });
}

function readProcessTable() {
  if (process.env.FACTORY_RELEASE_GUARD_PS_FILE) {
    return readFileSync(process.env.FACTORY_RELEASE_GUARD_PS_FILE, "utf8");
  }

  return execFileSync("ps", ["-axo", "pid=,command="], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
}

export function evaluateRelease({ mode, processTable }) {
  const normalizedMode = String(mode || "").trim().toLowerCase();
  if (normalizedMode !== "testing") {
    return {
      allowed: true,
      mode: normalizedMode || "unset",
      blocked: [],
      reason: "guard only applies in testing mode",
    };
  }

  const blocked = findBlockedProcesses(parseProcessTable(processTable));
  return {
    allowed: blocked.length === 0,
    mode: normalizedMode,
    blocked,
    reason: blocked.length === 0 ? "no blocked feeder or CI pump process found" : "blocked process alive",
  };
}

function main() {
  const mode = argValue(process.argv.slice(2), "mode") || process.env.FACTORY_MODE || "";
  const result = evaluateRelease({ mode, processTable: readProcessTable() });

  if (result.allowed) {
    console.log(`[factory-release-guard] allow: ${result.reason} (mode=${result.mode})`);
    return 0;
  }

  console.error(`[factory-release-guard] deny release: ${result.reason} (mode=${result.mode})`);
  for (const item of result.blocked) {
    console.error(`- ${item.pattern}: ${item.command}`);
  }
  return 1;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  process.exitCode = main();
}
