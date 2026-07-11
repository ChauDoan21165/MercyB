import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const repoRoot = resolve(__dirname, "../../..");

function source(path: string): string {
  return readFileSync(resolve(repoRoot, path), "utf8");
}

describe("companion muted-room storage hardening", () => {
  it("keeps learner-facing hooks on the guarded muted-room reader", () => {
    const files = [
      "src/hooks/useMercyRoomIntro.ts",
      "src/hooks/useRoomCompanion.ts",
    ];

    for (const file of files) {
      expect(source(file), file).not.toMatch(
        /JSON\.parse\s*\(\s*localStorage\.getItem\s*\(\s*["']mercy_muted_rooms["']/,
      );
    }
  });
});
