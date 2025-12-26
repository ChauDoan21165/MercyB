import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(() => ({
  server: {
    host: true,        // ✅ binds to 0.0.0.0 (IPv4 + IPv6 safe)
    port: 8080,
    strictPort: true,  // 🔒 NEVER jump to 8081
    open: false,       // 🔒 do not auto-open random tabs
  },
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    sourcemap: true,
  },
}));
