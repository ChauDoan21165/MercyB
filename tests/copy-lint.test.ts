import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";

const repoRoot = process.cwd();
const srcRoot = join(repoRoot, "src");
const forbiddenCopy = "từ vững";

function listSourceFiles(dir: string): string[] {
  return readdirSync(dir)
    .flatMap((entry) => {
      const path = join(dir, entry);
      const stat = statSync(path);
      if (stat.isDirectory()) return listSourceFiles(path);
      return stat.isFile() ? [path] : [];
    });
}

describe("learner-facing Vietnamese copy lint", () => {
  it("does not reintroduce the vocabulary typo under src", () => {
    const offenders = listSourceFiles(srcRoot).filter((path) =>
      readFileSync(path, "utf8").includes(forbiddenCopy)
    );

    expect(
      offenders.map((path) => relative(repoRoot, path)),
      `"${forbiddenCopy}" is a typo; use "từ vựng" for vocabulary.`,
    ).toEqual([]);
  });
});
