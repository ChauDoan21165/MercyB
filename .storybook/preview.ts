import type { Preview } from "@storybook/react";

// Pull in the app's global Tailwind layer so shared components render with the
// same tokens/utilities they use in production.
import "../src/index.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      // Report violations in the a11y panel without failing the build; the
      // formal a11y gap list is Lane E6's deliverable.
      test: "todo",
    },
    layout: "centered",
  },
};

export default preview;
