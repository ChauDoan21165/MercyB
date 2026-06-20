#!/usr/bin/env node
import { readFileSync } from "node:fs";

const CLASSIFICATIONS = [
  {
    classification: "infra_oom",
    retryRecommended: true,
    holdForHuman: false,
    reason: "Node/V8 heap exhaustion matched CI log.",
    patterns: [
      /JavaScript heap out of memory/i,
      /FATAL ERROR:\s*Ineffective mark-compacts near heap limit/i,
    ],
  },
  {
    classification: "infra_runner_disk",
    retryRecommended: false,
    holdForHuman: true,
    reason: "Runner disk gate matched CI log.",
    patterns: [/DISK_GATE/i],
  },
  {
    classification: "infra_playwright_timeout",
    retryRecommended: true,
    holdForHuman: false,
    reason: "Playwright/browser transient timeout matched CI log.",
    patterns: [
      /playwright[\s\S]*Test timeout/i,
      /Test timeout[\s\S]*playwright/i,
      /browserContext\.close/i,
      /CVDisplayLinkCreateWithCGDisplay/i,
      /ContextResult::kTransientFailure/i,
    ],
  },
  {
    classification: "real_orphan",
    retryRecommended: false,
    holdForHuman: true,
    reason: "New-orphans gate matched CI log.",
    patterns: [/check-new-orphans/i],
  },
  {
    classification: "real_type_error",
    retryRecommended: false,
    holdForHuman: true,
    reason: "TypeScript/typecheck failure matched CI log.",
    patterns: [/\bType error\b/i, /\berror TS\d{4}\b/i],
  },
  {
    classification: "real_lint_error",
    retryRecommended: false,
    holdForHuman: true,
    reason: "ESLint failure matched CI log.",
    patterns: [
      /\beslint\b[\s\S]*(?:\berror\b|problems?)/i,
      /\b\d+:\d+\s+error\s+.+\s{2,}@[\w/-]+/i,
      /\b✖\s+\d+\s+problems?\s+\(\d+\s+errors?/i,
    ],
  },
];

export function classifyCiFailure(input) {
  const text = String(input ?? "");
  for (const rule of CLASSIFICATIONS) {
    if (rule.patterns.some((pattern) => pattern.test(text))) {
      const { classification, retryRecommended, holdForHuman, reason } = rule;
      return { classification, retryRecommended, holdForHuman, reason };
    }
  }

  return {
    classification: "unknown",
    retryRecommended: false,
    holdForHuman: true,
    reason: "No known factory CI failure signature matched.",
  };
}

function readStdin() {
  return readFileSync(0, "utf8");
}

function main(argv = process.argv.slice(2)) {
  if (argv.length > 1 || argv.includes("--help") || argv.includes("-h")) {
    console.error("Usage: classify-ci-failure.mjs [log-file]");
    process.exit(argv.includes("--help") || argv.includes("-h") ? 0 : 2);
  }

  const input = argv[0] ? readFileSync(argv[0], "utf8") : readStdin();
  process.stdout.write(`${JSON.stringify(classifyCiFailure(input), null, 2)}\n`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
