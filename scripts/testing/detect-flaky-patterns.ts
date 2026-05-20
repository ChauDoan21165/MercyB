#!/usr/bin/env tsx

import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";

type ClusterKind =
  | "selector"
  | "route"
  | "timeout"
  | "network failure"
  | "disabled button state"
  | "missing element"
  | "unknown";

type LogRun = {
  file: string;
  status: "pass" | "fail" | "unknown";
  durationSeconds: number | null;
  route: string | null;
  selectors: string[];
  failureSignatures: string[];
  kinds: ClusterKind[];
};

type Cluster = {
  key: string;
  kind: ClusterKind;
  count: number;
  files: string[];
  example: string;
};

type Summary = {
  generatedAt: string;
  logDir: string;
  runs: LogRun[];
  totals: {
    pass: number;
    fail: number;
    unknown: number;
    durationSeconds: number;
  };
  unstable: boolean;
  intermittentFailure: boolean;
  clusters: Cluster[];
};

const args = process.argv.slice(2);
const logDir = args.find((arg) => !arg.startsWith("--")) ?? "docs/testing/b1-raw-runs";
const jsonArgIndex = args.indexOf("--json");
const jsonPath = jsonArgIndex >= 0 ? args[jsonArgIndex + 1] : null;
const pretty = args.includes("--pretty");

const logs = collectLogs(logDir);
const runs = logs.map(parseLog);
const clusters = clusterRuns(runs);
const totals = runs.reduce(
  (acc, run) => {
    acc[run.status] += 1;
    acc.durationSeconds += run.durationSeconds ?? 0;
    return acc;
  },
  { pass: 0, fail: 0, unknown: 0, durationSeconds: 0 },
);

const summary: Summary = {
  generatedAt: new Date().toISOString(),
  logDir,
  runs,
  totals,
  unstable: totals.fail > 0 || totals.unknown > 0,
  intermittentFailure: totals.fail > 0 && totals.pass > 0,
  clusters,
};

const output = JSON.stringify(summary, null, pretty ? 2 : 0);
if (jsonPath) {
  writeFileSync(jsonPath, `${JSON.stringify(summary, null, 2)}\n`, "utf8");
}
console.log(output);
process.exit(summary.unstable ? 1 : 0);

function collectLogs(dir: string): string[] {
  return readdirSync(dir)
    .filter((file) => file.endsWith(".log"))
    .filter((file) => !/^flaky-pattern-summary\.log$/.test(file))
    .map((file) => path.join(dir, file))
    .filter((file) => statSync(file).isFile())
    .sort();
}

function parseLog(file: string): LogRun {
  const text = readFileSync(file, "utf8");
  const status = parseStatus(text);
  const failureSignatures = extractFailureSignatures(text);
  const selectors = extractSelectors(text);
  const kinds = classify(text, selectors);
  return {
    file,
    status,
    durationSeconds: parseDuration(text),
    route: extractRoute(text),
    selectors,
    failureSignatures,
    kinds,
  };
}

function parseStatus(text: string): LogRun["status"] {
  if (
    /(?:UNIT|E2E) REPEAT RUN \d+ FAIL\b/i.test(text) ||
    /Test Files\s+(?:\d+ failed|\d+ passed\s+\|\s+\d+ failed)/i.test(text) ||
    /Tests\s+(?:\d+ failed|\d+ passed\s+\|\s+\d+ failed)/i.test(text) ||
    /^\s+\d+\s+failed\b/im.test(text) ||
    /repeat-.*summary pass=\d+ fail=[1-9]\d*/i.test(text)
  ) {
    return "fail";
  }
  if (
    /(?:UNIT|E2E) REPEAT RUN \d+ PASS\b/i.test(text) ||
    /Test Files\s+\d+ passed/i.test(text) ||
    /Tests\s+\d+ passed/i.test(text) ||
    /^\s+\d+\s+passed\b/im.test(text) ||
    /repeat-.*summary pass=\d+ fail=0/i.test(text) ||
    /> tsc .*--noEmit/i.test(text) ||
    /✓ built in/i.test(text)
  ) {
    return "pass";
  }
  return "unknown";
}

function parseDuration(text: string): number | null {
  const seconds = text.match(/duration=(\d+)s/i)?.[1] ?? text.match(/total_duration=(\d+)s/i)?.[1];
  if (seconds) return Number(seconds);
  const vitest = text.match(/Duration\s+([\d.]+)s/i)?.[1];
  if (vitest) return Number(vitest);
  return null;
}

function extractRoute(text: string): string | null {
  return (
    text.match(/https?:\/\/[^\s"'<>]+/i)?.[0] ??
    text.match(/\b\/placement\/test\/[^\s"'<>)]*/i)?.[0] ??
    text.match(/\b\/placement\b[^\s"'<>)]*/i)?.[0] ??
    null
  );
}

function extractSelectors(text: string): string[] {
  const selectors = new Set<string>();
  for (const match of text.matchAll(/locator\(['"`]([^'"`]+)['"`]\)/g)) selectors.add(match[1]);
  for (const match of text.matchAll(/getBy(?:Role|Text|Label|Placeholder|TestId)\(([^)\n]+)\)/g)) {
    selectors.add(match[0].slice(0, 160));
  }
  for (const match of text.matchAll(/waiting for (?:selector|locator) [`'"]?([^`'"\n]+)[`'"]?/gi)) {
    selectors.add(match[1].trim().slice(0, 160));
  }
  return [...selectors].sort();
}

function extractFailureSignatures(text: string): string[] {
  const signatures = new Set<string>();
  const patterns = [
    /Timeout \d+ms exceeded[^\n]*/gi,
    /expect\(.*?\)\.toBeEnabled[^\n]*/gi,
    /to be enabled[^\n]*/gi,
    /element\(s\) not found[^\n]*/gi,
    /waiting for [^\n]*/gi,
    /net::[A-Z_]+[^\n]*/gi,
    /request failed[^\n]*/gi,
    /page\.goto:[^\n]*/gi,
    /Error:[^\n]*/gi,
  ];
  for (const pattern of patterns) {
    for (const match of text.matchAll(pattern)) signatures.add(match[0].trim().slice(0, 220));
  }
  return [...signatures].slice(0, 20);
}

function classify(text: string, selectors: string[]): ClusterKind[] {
  const kinds = new Set<ClusterKind>();
  if (/toBeEnabled|to be enabled|disabled|aria-disabled/i.test(text)) kinds.add("disabled button state");
  if (/Timeout \d+ms exceeded|timed out|timeout/i.test(text)) kinds.add("timeout");
  if (/net::|ECONN|ENOTFOUND|ERR_|request failed|network/i.test(text)) kinds.add("network failure");
  if (/not found|not visible|toBeVisible|missing|strict mode violation/i.test(text)) kinds.add("missing element");
  if (/\/placement|page\.goto|waitForURL|toHaveURL|route/i.test(text)) kinds.add("route");
  if (selectors.length > 0 || /locator|getByRole|getByText|getByLabel|selector/i.test(text)) kinds.add("selector");
  if (kinds.size === 0) kinds.add("unknown");
  return [...kinds];
}

function clusterRuns(runs: LogRun[]): Cluster[] {
  const clusters = new Map<string, Cluster>();
  for (const run of runs.filter((item) => item.status !== "pass")) {
    const examples = run.failureSignatures.length > 0 ? run.failureSignatures : ["unknown failure"];
    for (const kind of run.kinds) {
      const basis =
        kind === "selector" && run.selectors[0]
          ? run.selectors[0]
          : kind === "route" && run.route
            ? run.route
            : examples[0];
      const key = `${kind}:${basis}`;
      const existing =
        clusters.get(key) ??
        ({
          key,
          kind,
          count: 0,
          files: [],
          example: examples[0],
        } satisfies Cluster);
      existing.count += 1;
      existing.files.push(run.file);
      clusters.set(key, existing);
    }
  }
  return [...clusters.values()].sort((a, b) => b.count - a.count || a.key.localeCompare(b.key));
}
