// vitest.config.ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "node:path";

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(), // honor tsconfig "paths"
  ],

  resolve: {
    alias: {
      // fallback alias (safe even with tsconfigPaths)
      "@": path.resolve(__dirname, "./src"),
    },
  },

  test: {
    // __PUNJABI_CI_ESBUILD_STABILITY_WORKER_CAP__
    ...(process.env.CI ? { maxWorkers: 2, minWorkers: 1 } : {}),
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],

    // ✅ prevent slow async tests from failing
    testTimeout: 15000,

    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "**/.{idea,git,cache,output,temp}/**",
      "**/e2e/**",
      "**/playwright/**",
      // Playwright prod-smoke specs use @playwright/test's test.describe(), which
      // throws under vitest ("two versions of @playwright/test" at collection).
      // They run in their own lane — CI job `production-placement-smoke` →
      // `npm run test:prod-smoke` → playwright.prod-smoke.config.ts (testDir
      // ./tests/prod-smoke) — against real prod, NOT vitest/jsdom. Exclude here
      // so vitest stops mis-collecting them; coverage stays in the Playwright lane.
      "tests/prod-smoke/**",
      // Nested agent git worktrees live under the main checkout's
      // .claude/worktrees/. Without this, `vitest run` from the repo
      // root re-discovers every test inside each worktree copy and
      // reports hundreds of duplicate "failures". Excludes the copies,
      // not the real src/**/*.test.ts suite.
      ".claude/worktrees/**",
      "**/.claude/**",
    ],

    // stable test execution
    pool: process.env.CI ? "forks" : "threads",
    clearMocks: true,
    restoreMocks: true,
    mockReset: true,

    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "**/node_modules/**",
        "**/dist/**",
        "src/integrations/supabase/types.ts",
        "**/*.config.{ts,js}",
      ],
    },
  },
});