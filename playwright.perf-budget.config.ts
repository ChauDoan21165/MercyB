import { defineConfig, devices } from "@playwright/test";

const ciJobId = Number(process.env.CI_JOB_ID);
const defaultPort = Number.isFinite(ciJobId) ? 3_200 + (ciJobId % 1_000) : 4_173;
const port = Number(process.env.PERF_BUDGET_PORT) || defaultPort;
const baseURL = process.env.TEST_BASE_URL ?? `http://127.0.0.1:${port}`;
const webServerTimeoutMs = Number(process.env.PERF_BUDGET_WEB_SERVER_TIMEOUT_MS) || 480 * 1000;

export default defineConfig({
  testDir: "./tests/perf-budget",
  testMatch: /.*\.pw\.ts$/,

  timeout: 45 * 1000,
  expect: { timeout: 5 * 1000 },

  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,

  reporter: [
    ["list"],
    ["html", { outputFolder: "playwright-perf-budget-report", open: "never" }],
  ],

  use: {
    baseURL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "off",
  },

  projects: [
    {
      name: "chromium-perf-budget",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1280, height: 800 },
      },
    },
  ],

  webServer: {
    command: `npm run build && npx vite preview --host 127.0.0.1 --port ${port} --strictPort`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: webServerTimeoutMs,
    stdout: "ignore",
    stderr: "pipe",
  },
});
