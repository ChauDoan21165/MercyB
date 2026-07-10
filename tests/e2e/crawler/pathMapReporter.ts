/**
 * Playwright reporter that aggregates the Tier-1 crawl into ONE artifact.
 *
 * Runs in the main process, so it collects every route result across worker
 * restarts — Playwright recycles the worker after a test failure, which would
 * wipe an in-worker collector. Each crawl test attaches its RouteResult as a
 * "route-result" attachment; this reporter drains them and writes the path map
 * on onEnd.
 */
import type {
  FullResult,
  Reporter,
  TestCase,
  TestResult,
} from "@playwright/test/reporter";

import { buildRouteManifest } from "../../../scripts/generate-route-manifest";
import type { RouteResult } from "./crawlRoute";
import { writePathMap } from "./pathMap";

export default class PathMapReporter implements Reporter {
  private results: RouteResult[] = [];

  onTestEnd(_test: TestCase, result: TestResult): void {
    for (const att of result.attachments) {
      if (att.name === "route-result" && att.body) {
        try {
          this.results.push(JSON.parse(att.body.toString("utf8")) as RouteResult);
        } catch {
          /* ignore malformed attachment */
        }
      }
    }
  }

  onEnd(_result: FullResult): void {
    if (!this.results.length) return;
    const manifest = buildRouteManifest();
    // Dedupe by path (a retried test could attach twice); keep the last.
    const byPath = new Map<string, RouteResult>();
    for (const r of this.results) byPath.set(r.path, r);
    const { md } = writePathMap([...byPath.values()], {
      baseURL:
        process.env.CRAWL_BASE_URL ?? process.env.TEST_BASE_URL ?? "https://mercyblade.com",
      crawledAt: new Date().toISOString(),
      authMode: "anonymous",
      skippedRoutes: manifest.routes
        .filter((r) => !r.crawl)
        .map((r) => ({ path: r.path, reason: r.skipReason ?? "unknown" })),
    });
    // eslint-disable-next-line no-console
    console.log("\n" + (md.split("\n").find((l) => l.startsWith("- **Totals:**")) ?? ""));
  }
}
