/**
 * Writes the single Tier-1 artifact: a pass/fail map of every crawled path with
 * per-failure reproduction steps. Emits both machine-readable JSON and a
 * human Markdown report for admin.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

import type { RouteResult } from "./crawlRoute";

const REPO_ROOT = resolve(dirname(new URL(import.meta.url).pathname), "../../..");
const OUT_DIR = resolve(REPO_ROOT, "reports/app-test-factory");

export interface PathMapMeta {
  baseURL: string;
  crawledAt: string;
  authMode: "anonymous" | "authenticated";
  skippedRoutes: { path: string; reason: string }[];
}

export function writePathMap(results: RouteResult[], meta: PathMapMeta): { md: string } {
  const pass = results.filter((r) => r.outcome === "pass");
  const gated = results.filter((r) => r.outcome === "gated");
  const fail = results.filter((r) => r.outcome === "fail");
  const knownHit = new Set<string>();
  const newFailures: RouteResult[] = [];
  for (const r of fail) {
    const onlyKnown = r.failures.every((f) => f.type === "known-defect");
    r.knownDefectsHit.forEach((id) => knownHit.add(id));
    if (!onlyKnown) newFailures.push(r);
  }

  const lines: string[] = [];
  lines.push(`# Tier-1 path map — app-test factory (SL-001)`);
  lines.push("");
  lines.push(`- **Base URL:** ${meta.baseURL}`);
  lines.push(`- **Crawled at:** ${meta.crawledAt}`);
  lines.push(`- **Auth mode:** ${meta.authMode}`);
  lines.push(
    `- **Totals:** ${results.length} crawled — ✅ ${pass.length} pass · ` +
      `🔒 ${gated.length} gated (expected) · ❌ ${fail.length} fail ` +
      `(of which ${newFailures.length} are NEW, non-known-defect)`,
  );
  lines.push(`- **Known defects reproduced:** ${[...knownHit].join(", ") || "(none this run)"}`);
  lines.push(`- **Un-crawlable routes (explicit gaps):** ${meta.skippedRoutes.length}`);
  lines.push("");

  if (newFailures.length) {
    lines.push(`## ❌ NEW failures (not previously known) — action needed`);
    lines.push("");
    for (const r of newFailures) {
      lines.push(`### \`${r.path}\`  _(kind: ${r.kind}, landed: ${r.landedOn})_`);
      for (const f of r.failures.filter((x) => x.type !== "known-defect")) {
        lines.push(`- **${f.type}** — ${f.detail}`);
        lines.push(`  - repro: ${f.repro}`);
      }
      lines.push("");
    }
  } else {
    lines.push(`## ❌ NEW failures — none 🎉`);
    lines.push("");
  }

  lines.push(`## 🔁 Known-defect reproductions (seeded fixtures)`);
  lines.push("");
  const knownRows = fail.filter((r) => r.knownDefectsHit.length);
  if (knownRows.length) {
    for (const r of knownRows) {
      lines.push(`- \`${r.path}\` → ${r.knownDefectsHit.join(", ")}`);
    }
  } else {
    lines.push(`_(no seeded known defect fired on the crawled routes this run)_`);
  }
  lines.push("");

  lines.push(`## 🔒 Gated routes (redirected to sign-in as expected)`);
  lines.push("");
  lines.push(gated.map((r) => `\`${r.path}\``).join(", ") || "_(none)_");
  lines.push("");

  lines.push(`## ✅ Passing routes`);
  lines.push("");
  lines.push(pass.map((r) => `\`${r.path}\``).join(", ") || "_(none)_");
  lines.push("");

  if (meta.skippedRoutes.length) {
    lines.push(`## ⏭️ Un-crawlable routes (reported, not silently dropped)`);
    lines.push("");
    for (const s of meta.skippedRoutes) lines.push(`- \`${s.path}\` — ${s.reason}`);
    lines.push("");
  }

  const md = lines.join("\n");
  const suffix = meta.authMode === "authenticated" ? ".authenticated" : "";
  const outMd = resolve(OUT_DIR, `tier1-path-map${suffix}.md`);
  const outJson = resolve(OUT_DIR, `tier1-path-map${suffix}.json`);
  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(outMd, md, "utf8");
  writeFileSync(
    outJson,
    JSON.stringify({ meta, summary: { pass: pass.length, gated: gated.length, fail: fail.length, newFailures: newFailures.length, knownReproduced: [...knownHit] }, results }, null, 2) + "\n",
    "utf8",
  );
  return { md };
}
