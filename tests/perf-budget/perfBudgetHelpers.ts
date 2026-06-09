import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { gzipSync } from "node:zlib";
import type { Page } from "@playwright/test";

export const PERF_BUDGETS = {
  routeInteractiveMs: Number(process.env.PERF_BUDGET_ROUTE_INTERACTIVE_MS) || 4_000,
  mainBundleGzipBytes: Number(process.env.PERF_BUDGET_MAIN_BUNDLE_GZIP_BYTES) || 250 * 1024,
} as const;

const DIST_DIR = resolve(process.cwd(), "dist");
const INDEX_HTML = join(DIST_DIR, "index.html");

export type MainBundleMeasurement = {
  href: string;
  gzipBytes: number;
  rawBytes: number;
};

export async function applyThrottledProfile(page: Page): Promise<void> {
  const cdp = await page.context().newCDPSession(page);
  await cdp.send("Network.enable");
  await cdp.send("Network.emulateNetworkConditions", {
    offline: false,
    latency: 150,
    downloadThroughput: (1.6 * 1024 * 1024) / 8,
    uploadThroughput: (750 * 1024) / 8,
  });
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
}

export async function measureRouteInteractiveMs(page: Page, routePath: string): Promise<number> {
  await page.goto(routePath, { waitUntil: "domcontentloaded" });
  await page.locator("#root").waitFor({ state: "attached" });

  return page.evaluate(() => {
    const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    if (nav) return Math.round(nav.domInteractive - nav.startTime);

    const timing = performance.timing;
    return timing.domInteractive - timing.navigationStart;
  });
}

export function measureMainBundleGzip(): MainBundleMeasurement {
  if (!existsSync(INDEX_HTML)) {
    throw new Error("dist/index.html not found. The perf budget lane must run against a production build.");
  }

  const html = readFileSync(INDEX_HTML, "utf8");
  const match =
    html.match(/<script\b[^>]*\btype=["']module["'][^>]*\bsrc=["']([^"']+)["']/i) ??
    html.match(/<script\b[^>]*\bsrc=["']([^"']+)["'][^>]*\btype=["']module["']/i);

  if (!match) {
    throw new Error("No entry <script type=\"module\"> found in dist/index.html.");
  }

  const href = match[1];
  const filePath = join(DIST_DIR, href.replace(/^\//, ""));
  if (!existsSync(filePath)) {
    throw new Error(`Entry bundle ${href} does not exist at ${filePath}.`);
  }

  const raw = readFileSync(filePath);
  return {
    href,
    rawBytes: raw.length,
    gzipBytes: gzipSync(raw, { level: 9 }).length,
  };
}
