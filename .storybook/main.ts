import type { StorybookConfig } from "@storybook/react-vite";

/**
 * Lane E (test + Storybook hardening) — additive Storybook setup.
 *
 * Stories live next to their components as `*.stories.tsx`. This config is
 * intentionally minimal: it reuses the app's existing Vite pipeline
 * (vite-tsconfig-paths resolves the "@/..." alias) and does not modify any
 * application source. Stories are documentation + visual contracts for the
 * shared component library ahead of market scaling.
 */
const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(ts|tsx)"],
  addons: [
    "@storybook/addon-essentials",
    "@storybook/addon-a11y",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  core: {
    disableTelemetry: true,
  },
  typescript: {
    // Keep story authoring fast; do not run react-docgen type analysis on the
    // whole graph (heavy on a ~600-component app).
    reactDocgen: "react-docgen",
  },
};

export default config;
