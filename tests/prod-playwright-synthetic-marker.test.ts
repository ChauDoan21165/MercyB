import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const repoRoot = resolve(__dirname, "..");

const PROD_TOUCHING_BROWSER_CONFIGS = [
  "playwright.crawler.config.ts",
  "playwright.golden-flows.config.ts",
  "playwright.perf-budget.config.ts",
  "playwright.prod-smoke.config.ts",
  "playwright.r3-explorer.config.ts",
  "playwright.smoke.config.ts",
  "playwright.synthetic-learner.config.ts",
] as const;

function read(relativePath: string): string {
  return readFileSync(resolve(repoRoot, relativePath), "utf8");
}

describe("production Playwright synthetic attribution", () => {
  it.each(PROD_TOUCHING_BROWSER_CONFIGS)(
    "%s seeds correction-source synthetic monitoring before app boot",
    (configPath) => {
      const source = read(configPath);

      expect(source).toContain("CORRECTION_SOURCE_SYNTHETIC_MARKER_KEY");
      expect(source).toContain("storageState");
      expect(source).toContain("localStorage");
      expect(source).toContain('value: "1"');
    },
  );
});
