// vitest.config.ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "node:path";

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(), // ✅ honor tsconfig "paths"
  ],

  resolve: {
    alias: {
      // ✅ fallback alias (won't hurt even with tsconfigPaths)
      "@": path.resolve(__dirname, "./src"),
    },
  },

  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],

    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "**/.{idea,git,cache,output,temp}/**",
      "**/e2e/**",
      "**/playwright/**",
    ],

    // ✅ avoid path/esm weirdness for internal alias imports
    pool: "threads",
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