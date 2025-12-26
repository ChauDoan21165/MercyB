import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(() => ({
  server: {
    host: "127.0.0.1", // ✅ lock to localhost only (not IPv6 "::")
    port: 8080,
    strictPort: true, // 🔒 required: fail instead of auto-jump to 8081
    open: false,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    sourcemap: true,
  },
}));
