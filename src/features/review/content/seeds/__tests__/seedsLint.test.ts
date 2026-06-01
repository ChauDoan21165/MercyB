// DC4 — the CI-enforced content-lint. CI runs the vitest suite, so this test
// IS the gate: it reads every committed seed under seeds/out/ and fails if any
// card is uncertified or any seed isn't status:"for-review". No uncertified
// card can land on the branch without turning this red.

import { readdirSync, readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, it, expect } from "vitest";

import { lintSeed } from "../lintSeeds";
import type { Seed } from "../buildSeed";

const OUT_DIR = join(dirname(fileURLToPath(import.meta.url)), "..", "out");

function seedFiles(): string[] {
  if (!existsSync(OUT_DIR)) return [];
  return readdirSync(OUT_DIR).filter((f) => f.endsWith(".seed.json"));
}

function load(file: string): Seed {
  return JSON.parse(readFileSync(join(OUT_DIR, file), "utf8")) as Seed;
}

describe("content-lint — committed seeds", () => {
  const files = seedFiles();

  it("has seed artifacts to lint", () => {
    expect(files.length).toBeGreaterThan(0);
  });

  it.each(files)("%s — every card certified + status for-review", async (file) => {
    const seed = load(file);
    const result = await lintSeed(seed);
    // Surface the offending cards in the failure message.
    expect(
      result.failures,
      `${file}: ${JSON.stringify(result.failures, null, 2)}`,
    ).toEqual([]);
    expect(result.statusOk, `${file}: status must be "for-review"`).toBe(true);
  });

  it("covers the expected non-empty flows (de, ko, zh-B2, ja)", () => {
    // The four flows that produced real reviewable seeds. vi-zh.A1 is
    // intentionally empty (documents the generation gap) so it's excluded here.
    const nonEmpty = files
      .filter((f) => f !== "vi-zh.A1.seed.json")
      .map(load)
      .filter((s) => s.cards.length > 0)
      .map((s) => `${s.flow}:${s.level}`)
      .sort();
    expect(nonEmpty).toEqual(["vi-de:A1", "vi-ja:A1", "vi-ko:A1", "vi-zh:B2"]);
  });
});
