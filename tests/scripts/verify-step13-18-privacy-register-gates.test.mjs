import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it, vi } from "vitest";

const C4_PRIVACY_REGISTER_GATE_TIMEOUT_MS = 180_000;
vi.setConfig({ testTimeout: C4_PRIVACY_REGISTER_GATE_TIMEOUT_MS });
const repoRoot = resolve(".");
const verifier = resolve(
  repoRoot,
  "scripts/ci/verify-step13-18-privacy-register-gates.mjs"
);
const artifact = resolve(
  repoRoot,
  "docs/internal/intelligence-ladder/step13-18-privacy-register-gates.md"
);

describe("verify-step13-18-privacy-register-gates", () => {
  it("keeps Step 13/18 privacy, parent-bridge, and register claims verifier-backed", () => {
    expect(existsSync(verifier)).toBe(true);
    expect(existsSync(artifact)).toBe(true);

    const result = spawnSync(process.execPath, [verifier], {
      cwd: repoRoot,
      encoding: "utf8",
    });

    expect(result.status, `${result.stdout}\n${result.stderr}`).toBe(0);
    expect(result.stdout).toContain(
      "[step13-18-privacy-register-gates] verified"
    );
  }, 60_000);
});
