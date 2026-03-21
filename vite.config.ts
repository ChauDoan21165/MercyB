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
//
// PATCH 2026-03-21:
// - Add PWA support for installable web app experience on mercyblade.com
// - Keep config conservative and compatible with existing chunking strategy

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";
import { fileURLToPath } from "url";

// ESM-safe __dirname (portable)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function normalizeId(id: string) {
  return id.replace(/\\/g, "/");
}

function isReactPath(s: string) {
  // IMPORTANT:
  // Keep this ONLY to core React packages. Do NOT include react-router here.
  // Router in the "react" bucket has been a common trigger for subtle runtime mismatches.
  return (
    s.includes("/node_modules/react/") ||
    s.includes("/node_modules/react-dom/") ||
    s.includes("/node_modules/react-is/") ||
    s.includes("/node_modules/scheduler/") ||
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

    VitePWA({
      registerType: "autoUpdate",
      includeAssets: [
        "icons/icon-192.png",
        "icons/icon-512.png",
        "icons/icon-maskable-512.png",
      ],
      manifest: {
        name: "Mercy Blade",
        short_name: "Mercy Blade",
        start_url: "/",
        scope: "/",
        display: "standalone",
        background_color: "#0a0a0a",
        theme_color: "#0a0a0a",
        description: "Mercy Blade web app",
        icons: [
          {
            src: "icons/icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "icons/icon-512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "icons/icon-maskable-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
    }),
  ],

  resolve: {
    // IMPORTANT: ensure Vite never bundles a second copy of React/ReactDOM
    dedupe: ["react", "react-dom", "react-router", "react-router-dom"],
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        // Prevent circular vendor chunking by using mutually-exclusive buckets.
        manualChunks(id) {
          const s = normalizeId(id);

          // Keep react core isolated (optional). Safe as long as it stays core-only.
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