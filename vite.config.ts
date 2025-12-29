// vite.config.ts
// MB-BLUE-97.6 — 2025-12-29 (+0700)
//
// RULES (LOCKED):
// - No port configuration here (port lives in package.json scripts)
// - No SWC (avoids native binding failures on Vercel / CI)
// - Keep alias @ → src
// - Stable, boring, deploy-safe config

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [
    react({
      // explicit: avoid surprises
      jsxRuntime: "automatic",
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
});
