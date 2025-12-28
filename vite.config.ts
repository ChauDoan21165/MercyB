// vite.config.ts
// MB-BLUE-95.8 — 2025-12-27 (+0700)
// RULE: No port configuration here. Port is owned by package.json only.

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    sourcemap: true,
  },
});
