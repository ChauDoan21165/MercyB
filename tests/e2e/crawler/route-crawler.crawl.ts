/**
 * TIER 1 — deterministic route crawler (zero AI cost).
 *
 * Enumerates EVERY registered route from src/router/AppRouter.tsx (via
 * scripts/generate-route-manifest.ts — no hand list, new pages covered
 * automatically), then loads each one and records 404s, JS crashes, console
 * errors, network failures, and blank/dead-end renders. Output is ONE artifact:
 * reports/app-test-factory/tier1-path-map.{md,json}.
 *
 * Runs anonymously by default against prod (or CRAWL_BASE_URL / a local build).
 * Auth-gated routes that bounce to /signin are recorded as "gated" (expected),
 * not failures. A creds-gated pass re-crawls them signed-in as a synthetic
 * throwaway account (never a real/canary account).
 *
 * CI stays green on a healthy app: the per-route hard assertion fires ONLY on
 * unambiguous breakage (unexpected 404 / JS crash / blank render). Console and
 * network findings are recorded in the artifact for admin, not gated on.
 *
 * Run:  npm run test:crawl
 *       CRAWL_BASE_URL=http://127.0.0.1:3107 CRAWL_LIMIT=20 npm run test:crawl
 */
import { test, expect } from "@playwright/test";

import { buildRouteManifest } from "../../../scripts/generate-route-manifest";
import { hasSupabaseTestCreds, newUserEmail } from "../fixtures/env";
import { signUpThroughUi } from "../fixtures/auth";
import { crawlRoute, type RouteResult } from "./crawlRoute";
import { writePathMap } from "./pathMap";

const BASE_URL =
  process.env.CRAWL_BASE_URL ?? process.env.TEST_BASE_URL ?? "https://mercyblade.com";

const manifest = buildRouteManifest();
const crawlableAll = manifest.routes.filter((r) => r.crawl);
const crawlable = process.env.CRAWL_LIMIT
  ? crawlableAll.slice(0, Number(process.env.CRAWL_LIMIT))
  : crawlableAll;

const SEVERE: ReadonlyArray<string> = ["not-found-404", "js-crash", "blank-render"];

// The path-map artifact is assembled by PathMapReporter (registered in
// playwright.crawler.config.ts). Each test ATTACHES its RouteResult rather than
// pushing to a module array: Playwright recycles the worker after a failure,
// which would wipe an in-worker collector — the reporter runs in the main
// process and survives that. Deliberately NOT `mode: "serial"` — a severe
// failure on one route must not skip the rest; we want the full map.

// Reproduction of the seeded, admin-found defects is proven deterministically
// in the fast vitest suite (tests/crawler/knownDefects.reproduction.test.ts),
// which runs in the main CI shards. This spec is the live crawl.

// ── Anonymous crawl of the whole route table ─────────────────────────────────
test.describe("Tier-1 crawler — anonymous route sweep", () => {
  for (const route of crawlable) {
    test(`crawl ${route.path}`, async ({ page }, testInfo) => {
      const res = await crawlRoute(page, BASE_URL, route.path, route.kind);
      await testInfo.attach("route-result", {
        body: JSON.stringify(res),
        contentType: "application/json",
      });
      const severe = res.failures.filter((f) => SEVERE.includes(f.type));
      expect(
        severe,
        `SEVERE breakage on ${route.path}:\n${severe.map((f) => `- ${f.type}: ${f.detail}`).join("\n")}`,
      ).toEqual([]);
    });
  }
});

// ── Authenticated re-crawl of gated routes (synthetic throwaway account) ──────
// Creds-gated exactly like the rest of the e2e harness: skips cleanly (green)
// when TEST_SUPABASE_* is absent, so this file never reddens CI without a test
// project configured.
test.describe("Tier-1 crawler — authenticated gated routes", () => {
  test.skip(
    !hasSupabaseTestCreds(),
    "Set TEST_SUPABASE_URL + TEST_SUPABASE_ANON_KEY (dedicated test project). See tests/e2e/README.md.",
  );

  const gatedRoutes = crawlableAll.filter((r) => r.kind === "auth").slice(0, Number(process.env.CRAWL_LIMIT ?? 25));

  test("sign up a synthetic learner, then re-crawl gated routes", async ({ page }) => {
    const email = newUserEmail("crawl");
    await signUpThroughUi(page, email, "crawl-test-Password-42!");

    const authResults: RouteResult[] = [];
    for (const route of gatedRoutes) {
      authResults.push(await crawlRoute(page, BASE_URL, route.path, "public")); // treat as non-gated now
    }
    writePathMap(authResults, {
      baseURL: BASE_URL,
      crawledAt: new Date().toISOString(),
      authMode: "authenticated",
      skippedRoutes: [],
    });

    const severe = authResults.flatMap((r) =>
      r.failures.filter((f) => SEVERE.includes(f.type)).map((f) => `${r.path}: ${f.type} — ${f.detail}`),
    );
    expect(severe, `SEVERE breakage on gated routes:\n${severe.join("\n")}`).toEqual([]);
  });
});
