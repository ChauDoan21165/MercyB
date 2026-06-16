import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const repoRoot = resolve(".");
const verifier = resolve(
  repoRoot,
  "scripts/ci/verify-step17-never-breaks-taxonomy.mjs",
);
const artifact = resolve(
  repoRoot,
  "docs/internal/intelligence-ladder/step17-never-breaks-taxonomy.md",
);

describe("verify-step17-never-breaks-taxonomy", () => {
  it("keeps Step 17 mapped to real tests and honest missing coverage", () => {
    expect(existsSync(verifier)).toBe(true);
    expect(existsSync(artifact)).toBe(true);

    const result = spawnSync(process.execPath, [verifier], {
      cwd: repoRoot,
      encoding: "utf8",
    });

    expect(result.status, `${result.stdout}\n${result.stderr}`).toBe(0);
    expect(result.stdout).toContain("[step17-never-breaks-taxonomy] verified");
  }, 240000);
});
