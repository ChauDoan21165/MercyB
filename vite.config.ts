// vite.config.ts
// MB-BLUE-97.7 — 2026-01-12 (+0700)
//
// RULES (LOCKED):
// - No port configuration here (port lives in package.json scripts)
// - No SWC (avoids native binding failures on Vercel / CI)
// - Keep alias @ → src
// - Stable, boring, deploy-safe config
//
// FIX 97.7:
// - Prevent "Circular chunk: vendor-react -> vendor -> vendor-react"
// - Use mutually-exclusive manualChunks buckets: react / supabase / ui / vendor

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// ESM-safe __dirname
const __dirname = path.dirname(new URL(import.meta.url).pathname);

function normalizeId(id: string) {
  return id.replace(/\\/g, "/");
}

export default defineConfig({
  plugins: [
    react({
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

    rollupOptions: {
      output: {
        // IMPORTANT: buckets must be mutually exclusive (no overlaps), or Rollup can warn cycles.
        manualChunks(id) {
          const s = normalizeId(id);
          if (!s.includes("/node_modules/")) return;

          // 1) React ecosystem (ONLY here)
          if (
            s.includes("/node_modules/react/") ||
            s.includes("/node_modules/react-dom/") ||
            s.includes("/node_modules/scheduler/") ||
            s.includes("/node_modules/react-router/") ||
            s.includes("/node_modules/react-router-dom/")
          ) {
            return "vendor-react";
          }

          // 2) Supabase (ONLY here)
          if (s.includes("/node_modules/@supabase/") || s.includes("/node_modules/ws/")) {
            return "vendor-supabase";
          }

          // 3) UI / icons / helpers (ONLY here)
          if (
            s.includes("/node_modules/@radix-ui/") ||
            s.includes("/node_modules/lucide-react/") ||
            s.includes("/node_modules/class-variance-authority/") ||
            s.includes("/node_modules/clsx/") ||
            s.includes("/node_modules/tailwind-merge/") ||
            s.includes("/node_modules/cmdk/")
          ) {
            return "vendor-ui";
          }

          // 4) Everything else
          return "vendor";
        },
      },
    },
  },
});
