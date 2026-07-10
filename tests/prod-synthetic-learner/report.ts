/**
 * Tier-3 artifact writer: reports/prod-synthetic-learner/latest.{md,json}.
 * A per-journey pass/fail map with timestamps + reproduction detail.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

export interface JourneyResult {
  id: "a" | "b" | "c" | "d" | "e" | "f";
  name: string;
  ok: boolean;
  detail: string;
  ms: number;
}

const REPO_ROOT = resolve(dirname(new URL(import.meta.url).pathname), "../..");
const OUT_DIR = resolve(REPO_ROOT, "reports/prod-synthetic-learner");

export interface RunMeta {
  baseURL: string;
  ranAt: string;
  liveVersionHash: string | null;
}

export function writeSyntheticReport(results: JourneyResult[], meta: RunMeta): { md: string; failed: JourneyResult[] } {
  const ordered = ["a", "b", "c", "d", "e", "f"]
    .map((id) => results.find((r) => r.id === id))
    .filter(Boolean) as JourneyResult[];
  const failed = ordered.filter((r) => !r.ok);

  const lines: string[] = [];
  lines.push(`# Prod Synthetic Learner — latest run`);
  lines.push("");
  lines.push(`- **Base URL:** ${meta.baseURL}`);
  lines.push(`- **Ran at:** ${meta.ranAt}`);
  lines.push(`- **Live version.json hash:** ${meta.liveVersionHash ?? "(unknown)"}`);
  lines.push(`- **Result:** ${failed.length ? `🔴 ${failed.length} FAILED` : "🟢 all journeys passed"}`);
  lines.push("");
  lines.push(`| Journey | Result | ms | Detail |`);
  lines.push(`| --- | --- | --- | --- |`);
  for (const r of ordered) {
    lines.push(`| (${r.id}) ${r.name} | ${r.ok ? "🟢 pass" : "🔴 FAIL"} | ${r.ms} | ${r.detail.replace(/\|/g, "\\|")} |`);
  }
  lines.push("");
  if (failed.length) {
    lines.push(`## 🔴 Failures`);
    lines.push("");
    for (const r of failed) lines.push(`- **(${r.id}) ${r.name}** — ${r.detail}`);
    lines.push("");
  }

  const md = lines.join("\n");
  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(resolve(OUT_DIR, "latest.md"), md, "utf8");
  writeFileSync(
    resolve(OUT_DIR, "latest.json"),
    JSON.stringify({ meta, passed: ordered.length - failed.length, failed: failed.length, results: ordered }, null, 2) + "\n",
    "utf8",
  );
  return { md, failed };
}
