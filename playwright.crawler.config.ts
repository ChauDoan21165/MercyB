/**
 * Tier-1 route-crawler Playwright config. Isolated from playwright.smoke.config
 * (which matches *.spec.ts) — this only runs the *.crawl.ts crawler so the
 * 170-route sweep never bloats the smoke job.
 *
 * Target: prod by default; set CRAWL_BASE_URL=http://127.0.0.1:3107 to crawl a
 * local build (a webServer is started automatically for localhost).
 *
 * Run:  npm run test:crawl
 *       CRAWL_BASE_URL=http://127.0.0.1:3107 CRAWL_LIMIT=20 npm run test:crawl
 */
import { defineConfig, devices } from "@playwright/test";

import { CORRECTION_SOURCE_SYNTHETIC_MARKER_KEY } from "./src/lib/ai-tutor/correctionSourceSyntheticMarker";

const baseURL =
  process.env.CRAWL_BASE_URL ?? process.env.TEST_BASE_URL ?? "https://mercyblade.com";
const baseOrigin = new URL(baseURL).origin;
const startLocal =
  baseURL.startsWith("http://127.0.0.1:") || baseURL.startsWith("http://localhost:");

export default defineConfig({
  testDir: "./tests/e2e/crawler",
  testMatch: /.*\.crawl\.ts$/,

  timeout: 45 * 1000,
  expect: { timeout: 10 * 1000 },

  // Serial: the crawl accumulates into one shared collector → one artifact.
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: 0,

  reporter: [
    ["list"],
    ["./tests/e2e/crawler/pathMapReporter.ts"],
    ["json", { outputFile: "playwright-crawler-report.json" }],
  ],

  use: {
    baseURL,
    storageState: {
      cookies: [],
      origins: [
        {
          origin: baseOrigin,
          localStorage: [
            {
              name: CORRECTION_SOURCE_SYNTHETIC_MARKER_KEY,
              value: "1",
            },
          ],
        },
      ],
    },
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 800 } },
    },
  ],

  webServer: startLocal
    ? {
        command: "npm run dev:frontend",
        url: baseURL,
        reuseExistingServer: process.env.PLAYWRIGHT_REUSE_EXISTING_SERVER === "1" || !process.env.CI,
        timeout: 180 * 1000,
        stdout: "ignore",
        stderr: "pipe",
      }
    : undefined,
});
