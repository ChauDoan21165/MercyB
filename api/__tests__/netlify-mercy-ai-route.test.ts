import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();

describe("Netlify Speak API routing", () => {
  it("routes /api/mercy-ai to the restored Netlify function in Netlify config", () => {
    // Bare relative path fails in vitest thread workers when CWD
    // shifts between module-load and test-body execution in CI;
    // path.join(process.cwd(), ...) captured at module load is stable.
    const toml = readFileSync(join(root, "netlify.toml"), "utf8");

    expect(toml).toContain('[functions]');
    expect(toml).toContain('directory = "netlify/functions"');
    expect(toml).toContain('from = "/api/mercy-ai"');
    expect(toml).toContain('to = "/.netlify/functions/api-mercy-ai"');
    expect(toml).toContain('status = 200');
    expect(toml).not.toContain('to = "/.netlify/functions/mercy-ai"');
    expect(toml).not.toContain('path = "/api/mercy-ai"');
    expect(toml).not.toContain('function = "mercy-ai-proxy"');
  });
});
