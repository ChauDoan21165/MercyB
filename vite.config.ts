import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(({ mode }) => {
  const plugins = [react()];

  // Only attempt lovable-tagger in development, and never crash if missing
  if (mode === "development") {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { componentTagger } = require("lovable-tagger");
      plugins.push(componentTagger());
    } catch {
      // ignore if not available
    }
  }

  return {
    server: { host: "::", port: 8080 },
    plugins,
    resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
  };
});
