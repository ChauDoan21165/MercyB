/**
 * Smoke-test Playwright config. Runs the suite under tests/e2e/ against
 * production by default. Set TEST_BASE_URL=http://127.0.0.1:3107 to run
 * against a local Vite server.
 *
 * Kept separate from the legacy `playwright.config.ts` (visual regression
 * on ./e2e) so the two suites don't bleed into each other — different
 * directories, different goals, different browsers.
 */

import { defineConfig, devices } from "@playwright/test";

const baseURL = process.env.TEST_BASE_URL ?? "https://mercyblade.com";
const shouldStartLocalServer =
  baseURL.startsWith("http://127.0.0.1:") ||
  baseURL.startsWith("http://localhost:");
const reuseExistingServer =
  process.env.PLAYWRIGHT_REUSE_EXISTING_SERVER === "1" || !process.env.CI;

export default defineConfig({
  testDir: "./tests/e2e",
  testMatch: /.*\.spec\.ts$/,

  timeout: 30 * 1000,
  expect: { timeout: 10 * 1000 },

  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,

  reporter: [
    ["list"],
    ["html", { outputFolder: "playwright-smoke-report", open: "never" }],
  ],

  use: {
    baseURL,
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

  webServer: shouldStartLocalServer
    ? {
        command: "npm run dev:frontend",
        url: baseURL,
        reuseExistingServer,
        timeout: 180 * 1000,
        stdout: "ignore",
        stderr: "pipe",
      }
    : undefined,
});
