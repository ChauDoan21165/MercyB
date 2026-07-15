/**
 * R3 EXPLORER: authenticated, read-only production crawler.
 *
 * Runs only with PROD_SYNTH_* credentials and the R3_EXPLORER_ENABLED gate.
 * Uses the same dedicated synthetic production account as R0.
 */
import { defineConfig, devices } from "@playwright/test";

import { CORRECTION_SOURCE_SYNTHETIC_MARKER_KEY } from "./src/lib/ai-tutor/correctionSourceSyntheticMarker";

const baseURL = process.env.PROD_SYNTH_BASE_URL ?? "https://mercyblade.com";
const baseOrigin = new URL(baseURL).origin;

export default defineConfig({
  testDir: "./tests/prod-r3-explorer",
  testMatch: /.*\.pw\.ts$/,

  timeout: 11 * 60 * 1000,
  expect: { timeout: 10 * 1000 },

  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: 0,

  reporter: [["list"], ["./tests/prod-r3-explorer/explorerReporter.ts"]],

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
    { name: "chromium", use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 800 } } },
  ],
});
