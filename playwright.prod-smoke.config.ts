/**
 * Production-smoke Playwright config — the "imitation user" tripwire.
 *
 * Runs tests/prod-smoke/*.spec.ts against REAL production (mercyblade.com)
 * with NO mocks and NO local dev server. This is deliberately isolated from:
 *   - playwright.config.ts        (visual regression on ./e2e, local dev server)
 *   - playwright.smoke.config.ts  (tests/e2e/*, which drive the client STUB)
 * and, critically, from the vitest/esbuild harness — a hang or audio failure
 * in prod must surface here as a loud red, never be masked by a flaky runner.
 *
 * Target override:  PROD_SMOKE_URL=https://staging.example.com
 * Optional canary:  PROD_SMOKE_EMAIL / PROD_SMOKE_PASSWORD / PROD_SMOKE_SUPABASE_ANON_KEY
 *                   (see tests/prod-smoke/placement-imitation-user.spec.ts).
 *
 * retries: 0 on purpose. A prod smoke that retries hides intermittent hangs —
 * exactly the class of bug this suite exists to catch.
 */
import { defineConfig, devices } from "@playwright/test";

const baseURL = process.env.PROD_SMOKE_URL ?? "https://mercyblade.com";

export default defineConfig({
  testDir: "./tests/prod-smoke",
  testMatch: /.*\.spec\.ts$/,

  // A full placement run (start -> answer all 11 items -> score) over real infra,
  // now that listening items carry real audio (3 clips × metadata load), takes
  // longer than the old 180s ceiling — a fresh full session was timing out mid-
  // flow (not hanging: a step-logged walk reaches results). The results-hang
  // assertion keeps its own tighter 30s budget inside the test.
  timeout: 360 * 1000,
  expect: { timeout: 15 * 1000 },

  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,

  reporter: [
    ["list"],
    ["html", { outputFolder: "playwright-prod-smoke-report", open: "never" }],
  ],

  use: {
    baseURL,
    // Rich artifacts so a failure says WHAT broke, not just THAT it broke.
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    // A real user has NOT granted the mic — we answer via text on purpose.
    permissions: [],
  },

  // Mobile-first viewport (CLAUDE.md non-negotiable #3): the demo audience
  // will almost certainly be on a phone.
  projects: [
    {
      name: "chromium-mobile",
      use: { ...devices["Desktop Chrome"], viewport: { width: 390, height: 844 } },
    },
  ],

  // No webServer: this suite ONLY targets deployed environments.
});
