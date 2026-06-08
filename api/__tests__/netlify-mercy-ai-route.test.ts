import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("Netlify Speak API routing", () => {
  it("routes /api/mercy-ai to the server-only Netlify function instead of the SPA fallback", () => {
    const toml = readFileSync("netlify.toml", "utf8");

    expect(toml).toContain('[functions]');
    expect(toml).toContain('directory = "netlify/functions"');
    expect(toml).toContain('from = "/api/mercy-ai"');
    expect(toml).toContain('to = "/.netlify/functions/mercy-ai"');
    expect(toml).toContain('status = 200');
  });
});
