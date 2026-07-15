import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("vite manualChunks route stability", () => {
  it("keeps pronunciation helpers in the tutor engine chunk to avoid a circular chunk split", () => {
    const config = readFileSync("vite.config.ts", "utf8");

    expect(config).toContain("ai-tutor-engine -> ai-tutor-pronunciation");
    expect(config).toMatch(
      /s\.includes\('\/src\/lib\/pronunciation\/'\)\)\s+return 'ai-tutor-engine';/,
    );
    expect(config).not.toMatch(
      /s\.includes\('\/src\/lib\/pronunciation\/'\)\)\s+return 'ai-tutor-pronunciation';/,
    );
  });
});
