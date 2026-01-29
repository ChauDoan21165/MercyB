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
import { fileURLToPath } from "url";
import { createRequire } from "module";

// ESM-safe __dirname (portable)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Resolver that matches installed packages (Vercel-safe)
const require = createRequire(import.meta.url);
const REACT_ENTRY = require.resolve("react");
const REACT_DOM_ENTRY = require.resolve("react-dom");
const REACT_JSX_RUNTIME = require.resolve("react/jsx-runtime");
const REACT_JSX_DEV_RUNTIME = require.resolve("react/jsx-dev-runtime");

function normalizeId(id: string) {
  return id.replace(/\\/g, "/");
}

function isReactPath(s: string) {
  return (
    s.includes("/node_modules/react/") ||
    s.includes("/node_modules/react-dom/") ||
    s.includes("/node_modules/react-is/") ||
    s.includes("/node_modules/scheduler/") ||
    s.includes("/node_modules/react-router/") ||
    s.includes("/node_modules/react-router-dom/") ||
    // catch non-trailing-slash forms
    s.includes("/node_modules/react/jsx-runtime") ||
    s.includes("/node_modules/react/jsx-dev-runtime") ||
    s.includes("/node_modules/react-dom/client") ||
    s.includes("/node_modules/react-dom/server") ||
    s.includes("/node_modules/react-dom/index") ||
    s.includes("/node_modules/react/index")
  );
}

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: "automatic",
    }),
  ],

  resolve: {
    // IMPORTANT: ensure Vite never bundles a second copy of React/ReactDOM
    // (Your build failed because this line was cut into: ["react", "  <-- unterminated string)
    dedupe: ["react", "react-dom", "react-router", "react-router-dom"],
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // Hard pinning React entrypoints helps when monorepo/lockfile weirdness causes duplicate React.
      react: REACT_ENTRY,
      "react-dom": REACT_DOM_ENTRY,
      "react/jsx-runtime": REACT_JSX_RUNTIME,
      "react/jsx-dev-runtime": REACT_JSX_DEV_RUNTIME,
    },
  },

  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        // Prevent circular vendor chunking by using mutually-exclusive buckets.
        manualChunks(id) {
          const s = normalizeId(id);

          if (isReactPath(s)) return "react";

          // Supabase bucket
          if (s.includes("/node_modules/@supabase/")) return "supabase";

          // UI bucket (common UI libs; keep conservative)
          if (
            s.includes("/node_modules/@radix-ui/") ||
            s.includes("/node_modules/lucide-react/") ||
            s.includes("/node_modules/class-variance-authority/") ||
            s.includes("/node_modules/clsx/") ||
            s.includes("/node_modules/tailwind-merge/")
          ) {
            return "ui";
          }

          // Everything else in node_modules -> vendor
          if (s.includes("/node_modules/")) return "vendor";

          // app code: let Rollup decide
          return undefined;
        },
      },
    },
  },
});
