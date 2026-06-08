import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("Netlify Speak API routing", () => {
  it("routes /api/mercy-ai to the restored Netlify function instead of the SPA fallback", () => {
    const toml = readFileSync("netlify.toml", "utf8");
    const redirects = readFileSync("public/_redirects", "utf8")
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);

    expect(toml).toContain('[functions]');
    expect(toml).toContain('directory = "netlify/functions"');
    expect(toml).toContain('from = "/api/mercy-ai"');
    expect(toml).toContain('to = "/.netlify/functions/api-mercy-ai"');
    expect(toml).toContain('status = 200');
    expect(toml).not.toContain('to = "/.netlify/functions/mercy-ai"');
    expect(toml).not.toContain('path = "/api/mercy-ai"');
    expect(toml).not.toContain('function = "mercy-ai-proxy"');

    const functionRouteIndex = redirects.findIndex((line) =>
      line.startsWith("/api/mercy-ai ")
    );
    const spaFallbackIndex = redirects.findIndex((line) =>
      line.startsWith("/* ")
    );

    expect(functionRouteIndex).toBeGreaterThanOrEqual(0);
    expect(redirects[functionRouteIndex]).toContain(
      "/.netlify/functions/api-mercy-ai"
    );
    expect(redirects[functionRouteIndex]).toContain("200!");
    expect(spaFallbackIndex).toBeGreaterThan(functionRouteIndex);
  });
});
