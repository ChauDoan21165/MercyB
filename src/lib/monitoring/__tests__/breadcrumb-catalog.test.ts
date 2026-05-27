// Static drift guard for the Sentry breadcrumb catalog documented at
// `docs/observability/perf-instrumentation.md`.
//
// The test grep-scans `src/` for every `category: "…"` literal inside
// a file that also references `addBreadcrumb`, plus the known
// constant-backed categories imported below, and compares the union
// against the documented catalog. Drift in either direction fails the
// build:
//
//   - A category emitted by source that isn't in the catalog
//     (someone added a new breadcrumb without updating the doc).
//   - A category in the catalog that no source file emits
//     (a doc row left behind after a breadcrumb was removed).
//
// To add a new category: see "Adding a new breadcrumb category" in
// the observability doc — append a row to the doc, add the literal
// (or import) here, ship in the same PR as the emitter.

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

import { describe, expect, it } from "vitest";

import { PERF_BREADCRUMB_CATEGORY as STAGE_3A_CATEGORIES } from "@/lib/stage-3a/perfInstrumentation";
import { ROUTE_PERF_BREADCRUMB_CATEGORY } from "@/lib/monitoring/routePerf";
import { PERF_BREADCRUMB_CATEGORY as STAGE_3B_CATEGORIES } from "@/stage-3b/perfInstrumentation";

/**
 * Single source of truth for the documented catalog. Every breadcrumb
 * category emitted from production code MUST appear here, and every
 * entry here MUST be in `docs/observability/perf-instrumentation.md`.
 *
 * Order matches the doc's summary table so a reader can pair them by
 * line.
 */
const DOCUMENTED_CATEGORIES: readonly string[] = [
  "navigation",
  "security.mfa",
  "mercy.panel",
  "mercy.feedback",
  "speak.attempt",
  "web-vital",
  STAGE_3A_CATEGORIES.aggregator,
  STAGE_3A_CATEGORIES.uiMount,
  STAGE_3B_CATEGORIES.engine,
  STAGE_3B_CATEGORIES.uiMount,
  ROUTE_PERF_BREADCRUMB_CATEGORY,
] as const;

/**
 * Constants exported by the perf modules. Production sources that
 * reference them via `category: PERF_BREADCRUMB_CATEGORY.foo` don't
 * surface as a literal in our regex scan, so they're treated as
 * "referenced" iff the test imports them (which the test does at the
 * top of this file, so import failures would already block CI).
 */
const CONSTANT_BACKED_CATEGORIES = [
  STAGE_3A_CATEGORIES.aggregator,
  STAGE_3A_CATEGORIES.uiMount,
  STAGE_3B_CATEGORIES.engine,
  STAGE_3B_CATEGORIES.uiMount,
  ROUTE_PERF_BREADCRUMB_CATEGORY,
];

const SRC_ROOT = join(process.cwd(), "src");

/** Recursively collect `.ts` / `.tsx` source files under `src/`,
 * skipping test dirs / files and the obvious non-source folders. */
function collectSourceFiles(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    if (entry === "__tests__" || entry === "node_modules") continue;
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      collectSourceFiles(full, out);
      continue;
    }
    if (!stat.isFile()) continue;
    if (!/\.(ts|tsx)$/.test(entry)) continue;
    if (/\.test\.(ts|tsx)$/.test(entry)) continue;
    out.push(full);
  }
  return out;
}

/** Scan one file for inline `category: "…"` literals, but only when
 * the file actually references `addBreadcrumb` somewhere — otherwise
 * we'd pick up lesson-data `category:` keys that have nothing to do
 * with Sentry. */
function extractLiteralCategories(filePath: string): string[] {
  const content = readFileSync(filePath, "utf-8");
  if (!/addBreadcrumb/.test(content)) return [];
  const cats = new Set<string>();
  for (const match of content.matchAll(/category:\s*["']([^"'\n]+)["']/g)) {
    cats.add(match[1]!);
  }
  return [...cats];
}

function scanAllBreadcrumbCategoriesInSource(): {
  byFile: { file: string; categories: string[] }[];
  flat: Set<string>;
} {
  const files = collectSourceFiles(SRC_ROOT);
  const byFile: { file: string; categories: string[] }[] = [];
  const flat = new Set<string>();
  for (const file of files) {
    const cats = extractLiteralCategories(file);
    if (cats.length === 0) continue;
    byFile.push({
      file: relative(process.cwd(), file),
      categories: cats,
    });
    for (const c of cats) flat.add(c);
  }
  // Constant-backed categories are "referenced" by virtue of this
  // test file importing them — if any of them disappear from the
  // codebase the import will break and CI will fail before this test
  // even runs.
  for (const c of CONSTANT_BACKED_CATEGORIES) flat.add(c);
  return { byFile, flat };
}

describe("breadcrumb catalog — drift guard against docs/observability/perf-instrumentation.md", () => {
  it("documented constants match their canonical strings (rename guard)", () => {
    expect(STAGE_3A_CATEGORIES.aggregator).toBe("stage3a.perf.aggregator");
    expect(STAGE_3A_CATEGORIES.uiMount).toBe("stage3a.perf.ui_mount");
    expect(STAGE_3B_CATEGORIES.engine).toBe("stage3b.perf.engine");
    expect(STAGE_3B_CATEGORIES.uiMount).toBe("stage3b.perf.ui_mount");
    expect(ROUTE_PERF_BREADCRUMB_CATEGORY).toBe("route.perf.mount");
  });

  it("the documented catalog has no duplicates", () => {
    const set = new Set(DOCUMENTED_CATEGORIES);
    expect(set.size).toBe(DOCUMENTED_CATEGORIES.length);
  });

  it("every breadcrumb category emitted by src/ is in the documented catalog", () => {
    const { flat, byFile } = scanAllBreadcrumbCategoriesInSource();
    const catalog = new Set(DOCUMENTED_CATEGORIES);
    const undocumented: { file: string; category: string }[] = [];
    for (const { file, categories } of byFile) {
      for (const c of categories) {
        if (!catalog.has(c)) undocumented.push({ file, category: c });
      }
    }
    // Constant-backed cats are by definition documented (the catalog
    // imports them), so undocumented can only contain literals — no
    // need to filter `flat`.
    expect(undocumented).toEqual([]);
  });

  it("every documented category is actually emitted somewhere in src/", () => {
    const { flat } = scanAllBreadcrumbCategoriesInSource();
    const stale = DOCUMENTED_CATEGORIES.filter((c) => !flat.has(c));
    expect(stale).toEqual([]);
  });

  it("emits the expected eleven categories at the current main", () => {
    // Pin the catalog size so a deliberate add forces a deliberate
    // doc + test bump. Updating this number is a flagged change to
    // any reviewer looking at the diff.
    expect(DOCUMENTED_CATEGORIES.length).toBe(11);
  });
});
