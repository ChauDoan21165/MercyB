// vite.config.ts
// MB-BLUE-97.6b — 2026-01-11 (+0700)
//
// RULES (LOCKED):
// - No port configuration here (port lives in package.json scripts)
// - No SWC (avoids native binding failures on Vercel / CI)
// - Keep alias @ → src
// - Stable, boring, deploy-safe config

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  // ✅ important for Vercel + SPA routing (absolute paths)
  base: "/",

  plugins: [
    react({
      // explicit: avoid surprises
      jsxRuntime: "automatic",
      // ✅ no SWC here
    }),
  ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  build: {
    sourcemap: true,
  },

  // ❌ server.port removed (LOCKED rule)
});

/**
 * New thing to learn:
 * Vite config runs as ESM in many CI environments, so `__dirname` can be undefined.
 * Using `import.meta.url` makes the alias resolution deploy-safe.
 */
