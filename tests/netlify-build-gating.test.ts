import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const script = "scripts/netlify-ignore-build.sh";

function runIgnore(env: Record<string, string | undefined> = {}) {
  return spawnSync("bash", [script], {
    cwd: process.cwd(),
    env: {
      ...process.env,
      CACHED_COMMIT_REF: undefined,
      COMMIT_REF: undefined,
      MERCYB_ALLOW_NETLIFY_BUILD: undefined,
      NETLIFY_IGNORE_CHANGED_FILES: undefined,
      ...env,
    },
    encoding: "utf8",
  });
}

describe("Netlify build gating", () => {
  it("skips by default before inspecting changed files", () => {
    const result = runIgnore({ NETLIFY_CONTEXT: "deploy-preview" });

    expect(result.status).toBe(0);
    expect(result.stderr).toContain("netlify builds disabled by policy");
  });

  it("allows a human override and still skips docs-only changes", () => {
    const result = runIgnore({
      MERCYB_ALLOW_NETLIFY_BUILD: "1",
      NETLIFY_IGNORE_CHANGED_FILES: "docs/ops/netlify-ship-to-prod.md\n",
    });

    expect(result.status).toBe(0);
    expect(result.stderr).toContain("docs/report/root-Markdown-only");
  });

  it("allows a human override and builds app changes", () => {
    const result = runIgnore({
      MERCYB_ALLOW_NETLIFY_BUILD: "1",
      NETLIFY_IGNORE_CHANGED_FILES: "src/main.tsx\n",
    });

    expect(result.status).toBe(1);
    expect(result.stderr).toContain("build required: src/main.tsx");
  });

  it("routes production and preview contexts through the ignore script", () => {
    const toml = readFileSync("netlify.toml", "utf8");

    for (const context of [
      "[context.production]",
      "[context.deploy-preview]",
      "[context.branch-deploy]",
    ]) {
      const index = toml.indexOf(context);
      expect(index).toBeGreaterThan(-1);
      const nextContext = toml.indexOf("\n[", index + context.length);
      const block = toml.slice(
        index,
        nextContext === -1 ? undefined : nextContext,
      );
      expect(block).toContain('command = "npm run build"');
      expect(block).toContain(
        'ignore = "bash scripts/netlify-ignore-build.sh"',
      );
    }

    expect(toml).toContain('functions = "netlify/functions"');
    expect(toml).toContain('from = "/api/mercy-ai"');
    expect(toml).toContain('to = "/.netlify/functions/api-mercy-ai"');
  });
});
