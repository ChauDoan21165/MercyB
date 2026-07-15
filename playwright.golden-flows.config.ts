import { defineConfig, devices } from "@playwright/test";

import { CORRECTION_SOURCE_SYNTHETIC_MARKER_KEY } from "./src/lib/ai-tutor/correctionSourceSyntheticMarker";

const baseURL = process.env.GOLDEN_FLOW_BASE_URL ?? "https://mercyblade.com";
const baseOrigin = new URL(baseURL).origin;

export default defineConfig({
  testDir: "./tests/golden-flows",
  testMatch: /.*\.pw\.ts$/,

  timeout: 60 * 1000,
  expect: { timeout: 10 * 1000 },

  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,

  reporter: [
    ["list"],
    ["html", { outputFolder: "playwright-golden-flows-report", open: "never" }],
  ],

  use: {
    baseURL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
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
    ...devices["Desktop Chrome"],
  },
});
