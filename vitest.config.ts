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
      // Nested agent git worktrees live under the main checkout's
      // .claude/worktrees/. Without this, `vitest run` from the repo
      // root re-discovers every test inside each worktree copy and
      // reports hundreds of duplicate "failures". Excludes the copies,
      // not the real src/**/*.test.ts suite.
      ".claude/worktrees/**",
      "**/.claude/**",
    ],

    // stable test execution
    pool: "threads",
    clearMocks: true,
    restoreMocks: true,
    mockReset: true,

    coverage: {
      provider: "v8",
      // json-summary is what scripts/check-coverage-threshold.mjs reads
      // (the CI ratchet gate); text-summary keeps a human-readable summary
      // at the bottom of `npm run test:coverage`; html for local browsing.
      reporter: ["text", "text-summary", "json", "json-summary", "html"],
      exclude: [
        "**/node_modules/**",
        "**/dist/**",
        "scripts/**",
        "public/**",
        "**/*.test.*",
        "**/__tests__/**",
        "**/*.config.{ts,js,mjs,cjs}",
        "src/integrations/supabase/types.ts",
      ],
    },
  },
});