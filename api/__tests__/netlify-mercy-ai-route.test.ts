import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("Netlify Speak API routing", () => {
  it("routes /api/mercy-ai to the restored Netlify function in Netlify config", () => {
    const toml = readFileSync("netlify.toml", "utf8");

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
