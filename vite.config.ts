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
//
// PATCH 2026-01-29:
// - Force single React instance in prod (fixes "Cannot read properties of undefined (reading 'useLayoutEffect')")

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// ESM-safe __dirname
const __dirname = path.dirname(new URL(import.meta.url).pathname);

function normalizeId(id: string) {
  return id.replace(/\\/g, "/");
}

const REACT_PATH = path.resolve(__dirname, "./node_modules/react");
const REACT_DOM_PATH = path.resolve(__dirname, "./node_modules/react-dom");

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: "automatic",
    }),
  ],

  resolve: {
    // IMPORTANT: ensure Vite never bundles a second copy of React/ReactDOM
    // (fixes runtime "useLayoutEffect" undefined / blank page)
    dedupe: ["react", "react-dom"],

    alias: {
      "@": path.resolve(__dirname, "./src"),

      // ✅ HARD PIN: all React entrypoints must resolve to the SAME physical package
      react: REACT_PATH,
      "react-dom": REACT_DOM_PATH,

      // ✅ also pin jsx runtimes (some libs import these directly)
      "react/jsx-runtime": path.resolve(REACT_PATH, "./jsx-runtime.js"),
      "react/jsx-dev-runtime": path.resolve(REACT_PATH, "./jsx-dev-runtime.js"),
    },
  },

  optimizeDeps: {
    // Helps Vite prebundle consistently (dev + prod parity)
    include: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime"],
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
