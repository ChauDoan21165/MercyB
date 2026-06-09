import { defineConfig, devices } from "@playwright/test";

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
    baseURL: process.env.GOLDEN_FLOW_BASE_URL ?? "https://mercyblade.com",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    ...devices["Desktop Chrome"],
  },
});
