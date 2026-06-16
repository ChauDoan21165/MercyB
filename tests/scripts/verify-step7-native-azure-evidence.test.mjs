import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const repoRoot = resolve(".");
const verifier = resolve(repoRoot, "scripts/ci/verify-step7-native-azure-evidence.mjs");
const artifact = resolve(
  repoRoot,
  "docs/internal/intelligence-ladder/step7-native-azure-evidence.md",
);

describe("verify-step7-native-azure-evidence", () => {
  it("keeps the Step 7 evidence ledger CI-verifiable", () => {
    expect(existsSync(verifier)).toBe(true);
    expect(existsSync(artifact)).toBe(true);

    const result = spawnSync(process.execPath, [verifier], {
      cwd: repoRoot,
      encoding: "utf8",
    });

    expect(result.status, `${result.stdout}\n${result.stderr}`).toBe(0);
    expect(result.stdout).toContain("[step7-native-azure-evidence] verified");
  });
});
