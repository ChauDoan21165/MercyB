/**
 * Tier-3 prod synthetic learner config. Runs journeys (a)–(f) against REAL
 * production as the dedicated synthetic account. Isolated from the smoke/crawler
 * configs (its own testDir + *.spec.ts under tests/prod-synthetic-learner).
 *
 * Skips entirely without PROD_SYNTH_* creds (see journeys.spec.ts) so it is safe
 * in any pipeline; it only does real work on the admin-host scheduled run.
 *
 * Run:  npm run test:synthetic-learner
 */
import { defineConfig, devices } from "@playwright/test";

import { CORRECTION_SOURCE_SYNTHETIC_MARKER_KEY } from "./src/lib/ai-tutor/correctionSourceSyntheticMarker";

const baseURL = process.env.PROD_SYNTH_BASE_URL ?? "https://mercyblade.com";
const baseOrigin = new URL(baseURL).origin;

export default defineConfig({
  testDir: "./tests/prod-synthetic-learner",
  testMatch: /.*\.spec\.ts$/,

  timeout: 120 * 1000,
  expect: { timeout: 15 * 1000 },

  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: 0,

  reporter: [["list"], ["./tests/prod-synthetic-learner/syntheticReporter.ts"]],

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
  // No webServer — always real production.
});
