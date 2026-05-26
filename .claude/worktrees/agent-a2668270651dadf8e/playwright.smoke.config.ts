/**
 * Smoke-test Playwright config. Runs the suite under tests/e2e/ against
 * the real MercyBlade dev server at 127.0.0.1:3107.
 *
 * Kept separate from the legacy `playwright.config.ts` (visual regression
 * on ./e2e) so the two suites don't bleed into each other — different
 * directories, different goals, different browsers.
 */

import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  testMatch: /.*\.spec\.ts$/,

  timeout: 60 * 1000,
  expect: { timeout: 10 * 1000 },

  fullyParallel: false, // sequential — these specs share DB state
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,

  reporter: [
    ["list"],
    ["html", { outputFolder: "playwright-smoke-report", open: "never" }],
  ],

  use: {
    baseURL: process.env.TEST_BASE_URL ?? "http://127.0.0.1:3107",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },

  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1280, height: 800 },
      },
    },
  ],

  // The dev server owns port 3107 via `strictPort`. If it's already up
  // (another terminal), reuse it; otherwise start it.
  webServer: {
    command: "npm run dev:frontend",
    url: process.env.TEST_BASE_URL ?? "http://127.0.0.1:3107",
    reuseExistingServer: !process.env.CI,
    timeout: 180 * 1000,
    stdout: "ignore",
    stderr: "pipe",
  },
});
