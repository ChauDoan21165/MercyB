// vite.config.ts
// MB-BLUE-97.6 — 2025-12-29 (+0700)

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "127.0.0.1",
    port: 3107,
    strictPort: true,
  },
  preview: {
    host: "127.0.0.1",
    port: 3107,
    strictPort: true,
  },
});
