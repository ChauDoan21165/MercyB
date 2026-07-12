import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

import type { R3Failure, R3RunResult } from "./types";

const REPO_ROOT = resolve(dirname(new URL(import.meta.url).pathname), "../..");
const OUT_DIR = resolve(REPO_ROOT, "reports/prod-r3-explorer");

function icon(ok: boolean): string {
  return ok ? "pass" : "FAIL";
}

export function summarizeFailure(failure: R3Failure): string {
  return `${failure.type} ${failure.route}: ${failure.detail}`;
}

export function writeR3Report(result: R3RunResult): { md: string; failed: R3Failure[] } {
  const failed = result.failures;
  const lines: string[] = [];
  lines.push("# R3 Explorer - latest run");
  lines.push("");
  lines.push(`- **Base URL:** ${result.baseURL}`);
  lines.push(`- **Ran at:** ${result.ranAt}`);
  lines.push(`- **Seed:** ${result.seed}`);
  lines.push(`- **Limits:** ${result.limits.maxPages} pages, ${result.limits.maxActions} actions, ${Math.round(result.limits.maxDurationMs / 1000)}s`);
  lines.push(`- **Result:** ${result.ok ? "green: no failures" : `red: ${failed.length} failure(s)`}`);
  lines.push(`- **Visited routes:** ${result.visited.length}`);
  lines.push(`- **Skipped manifest routes:** ${result.skipped.length}`);
  lines.push("");

  if (failed.length) {
    lines.push("## Failures");
    lines.push("");
    for (const f of failed) {
      lines.push(`- **${f.type}** on \`${f.route}\``);
      lines.push(`  - signature: \`${f.signature}\``);
      lines.push(`  - detail: ${f.detail.replace(/\n/g, " ")}`);
      if (f.action) lines.push(`  - action: ${f.action}`);
    }
    lines.push("");
  }

  lines.push("## Visited Routes");
  lines.push("");
  for (const route of result.visited) {
    lines.push(`- \`${route.path}\` (${route.source}) - ${icon(route.failures.length === 0)}, actions: ${route.actions.length}`);
  }
  lines.push("");

  if (result.skipped.length) {
    lines.push("## Skipped Manifest Routes");
    lines.push("");
    for (const skipped of result.skipped.slice(0, 120)) {
      lines.push(`- \`${skipped.path}\` - ${skipped.reason}`);
    }
    if (result.skipped.length > 120) lines.push(`- ... ${result.skipped.length - 120} more`);
    lines.push("");
  }

  const md = lines.join("\n");
  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(resolve(OUT_DIR, "latest.md"), md, "utf8");
  writeFileSync(resolve(OUT_DIR, "latest.json"), JSON.stringify(result, null, 2) + "\n", "utf8");
  return { md, failed };
}
