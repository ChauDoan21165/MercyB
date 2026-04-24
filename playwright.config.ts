import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for the legacy visual-regression suite
 * under ./e2e. Runs against the MercyBlade dev server on
 * 127.0.0.1:3107 (strict port — see package.json `dev` / `dev:frontend`
 * scripts and CLAUDE.md).
 *
 * For the newer end-to-end smoke suite under ./tests/e2e, see
 * playwright.smoke.config.ts. The two configs are intentionally
 * separate — different goals (visual regression vs feature flow) and
 * different directories.
 */
export default defineConfig({
  testDir: './e2e',
  
  // Maximum time one test can run
  timeout: 30 * 1000,
  
  // Test configuration
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  
  // Reporter configuration
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['list'],
  ],
  
  // Shared settings for all tests
  use: {
    // Base URL for tests — matches the dev server in package.json
    baseURL: 'http://127.0.0.1:3107',

    // Collect trace when retrying failed test
    trace: 'on-first-retry',

    // Screenshot on failure
    screenshot: 'only-on-failure',

    // Video on failure
    video: 'retain-on-failure',
  },

  // Configure projects for different browsers
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 },
      },
    },
    {
      name: 'firefox',
      use: { 
        ...devices['Desktop Firefox'],
        viewport: { width: 1280, height: 720 },
      },
    },
    {
      name: 'webkit',
      use: { 
        ...devices['Desktop Safari'],
        viewport: { width: 1280, height: 720 },
      },
    },
    // Mobile viewports
    {
      name: 'mobile-chrome',
      use: { 
        ...devices['Pixel 5'],
      },
    },
    {
      name: 'mobile-safari',
      use: { 
        ...devices['iPhone 12'],
      },
    },
  ],

  // Run local dev server before starting tests. Use dev:frontend (Vite
  // only) — the grammar server on :3001 isn't needed for visual
  // regression and skipping it avoids concurrent-process teardown issues.
  webServer: {
    command: 'npm run dev:frontend',
    url: 'http://127.0.0.1:3107',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
