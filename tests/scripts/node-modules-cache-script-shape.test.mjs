import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const REPO_ROOT = path.resolve(__dirname, "..", "..");
const SCRIPT = readFileSync(path.join(REPO_ROOT, "scripts/ci/restore-npm-node-modules-cache.sh"), "utf8");

describe("node_modules APFS cache restore script", () => {
  it("falls back to npm ci when the clone-copy restore fails", () => {
    expect(SCRIPT).toMatch(/if ! cp -cR "\$CACHE_DIR\/node_modules" node_modules; then/);
    expect(SCRIPT).toMatch(/restore copy failed; falling back to npm ci/);
    expect(SCRIPT).toMatch(/rm -rf node_modules\s+return 1/);
  });
});
