import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

let componentTagger: undefined | (() => any);
try {
  // Optional: only exists if lovable-tagger is installed
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  componentTagger = require("lovable-tagger").componentTagger;
} catch {
  componentTagger = undefined;
}

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === "development" && componentTagger ? componentTagger() : undefined,
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    sourcemap: true, // helps you see real errors instead of minified garbage
  },
}));
