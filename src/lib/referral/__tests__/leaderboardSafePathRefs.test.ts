// @vitest-environment node

import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";

const SRC_ROOT = resolve(process.cwd(), "src");
const OLD_OBJECTS = [
  "monthly_referral_leaderboard",
  "all_time_referral_leaderboard",
];

function sourceFiles(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = resolve(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      if (entry === "__tests__") continue;
      out.push(...sourceFiles(full));
    } else if (/\.(ts|tsx)$/.test(entry)) {
      out.push(full);
    }
  }
  return out;
}

describe("referral leaderboard browser safe path", () => {
  it("has no non-test src reads of legacy auth.users-dependent objects", () => {
    const offenders = sourceFiles(SRC_ROOT).filter((file) => {
      const text = readFileSync(file, "utf8");
      return OLD_OBJECTS.some((objectName) => text.includes(objectName));
    });

    expect(offenders).toEqual([]);
  });
});
