/**
 * EN→VN rule pack — unit tests.
 *
 * Each detector is exercised against its fixture cases from
 * `evals/en-vn-grammar-cases.json`. Until a parallel detector entry
 * point exists (`detectEnVnError()`, separate follow-up PR), this
 * test is the only runtime verification that the rule functions
 * fire as authored.
 */

import { describe, expect, it } from "vitest";

import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { EN_VN_RULE_PACK, EN_VN_RULES, EN_VN_EXPLANATIONS } from "../index.js";
import type { RuleArgs } from "../../../rule-pack-types.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const FIXTURE_PATH = resolve(__dirname, "../../../../../../evals/en-vn-grammar-cases.json");

type FixtureCase = {
  id: string;
  family: string;
  expected_rule_id: string;
  expected_phenomenon: string;
  severity: "low" | "medium" | "high";
  input: string;
  expected_correction: string;
  expected_category: "expected_pass" | "expected_partial" | "expected_failure";
  source: string;
  notes?: string;
};

type Fixture = {
  _meta: Record<string, unknown>;
  cases: FixtureCase[];
};

function loadFixture(): Fixture {
  return JSON.parse(readFileSync(FIXTURE_PATH, "utf8")) as Fixture;
}

// Mirror of the detector's tokenize(); kept local because the
// detector module doesn't export it and this pack is intentionally
// isolated from `l1-error-detector.ts`.
function tokenize(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/[.,;:!"'()[\]{}]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function makeArgs(input: string, expected: string): RuleArgs {
  return {
    userTokens: tokenize(input),
    expectedTokens: tokenize(expected),
    userText: input.toLowerCase(),
    expectedText: expected.toLowerCase(),
    rawUser: input,
    rawExpected: expected,
    ctx: {},
  };
}

function runRegistry(args: RuleArgs): { tag: string } | null {
  for (const rule of EN_VN_RULES) {
    const hit = rule(args);
    if (hit) return hit;
  }
  return null;
}

describe("EN_VN_RULE_PACK — assembly", () => {
  it("ships 8 rules", () => {
    expect(EN_VN_RULES.length).toBe(8);
  });

  it("ships 8 explanations, one per rule tag", () => {
    expect(EN_VN_EXPLANATIONS.length).toBe(8);
  });

  it("every explanation tag has a matching detector tag set (loose)", () => {
    // We can't iterate rules to read tags (rules are functions), but we
    // can assert the explanation tags follow the en_l1_* namespace.
    for (const exp of EN_VN_EXPLANATIONS) {
      expect(exp.tag).toMatch(/^en_l1_/);
      expect(exp.en.length).toBeGreaterThan(0);
      expect(exp.vi.length).toBeGreaterThan(0);
    }
  });

  it("pack metadata identifies the EN→VN direction", () => {
    expect(EN_VN_RULE_PACK.l1Code).toBe("en");
    expect(EN_VN_RULE_PACK.version).toBe("0.1");
  });
});

describe("EN_VN_RULES — fixture pass rate", () => {
  const fixture = loadFixture();
  const passCases = fixture.cases.filter(
    (c) => c.expected_category === "expected_pass",
  );

  it("ships ≥24 fixture cases (≥3 per rule × 8 rules)", () => {
    expect(fixture.cases.length).toBeGreaterThanOrEqual(24);
  });

  it("every expected_pass case fires SOMETHING (any tag, first-match-wins)", () => {
    const misses: string[] = [];
    for (const c of passCases) {
      const hit = runRegistry(makeArgs(c.input, c.expected_correction));
      if (!hit) misses.push(`${c.id} (${c.family}): ${c.input}`);
    }
    expect(misses, `Misses:\n${misses.join("\n")}`).toEqual([]);
  });

  it("every expected_pass case fires the EXACT expected tag", () => {
    const mismatches: string[] = [];
    for (const c of passCases) {
      const hit = runRegistry(makeArgs(c.input, c.expected_correction));
      if (!hit) continue; // already counted in the prior assertion
      if (hit.tag !== c.expected_rule_id) {
        mismatches.push(
          `${c.id}: expected ${c.expected_rule_id} got ${hit.tag} (input: ${c.input})`,
        );
      }
    }
    expect(mismatches, `Tag mismatches:\n${mismatches.join("\n")}`).toEqual([]);
  });

  it("at least 3 fixture cases per detector tag", () => {
    const tagCounts = new Map<string, number>();
    for (const c of passCases) {
      tagCounts.set(c.expected_rule_id, (tagCounts.get(c.expected_rule_id) ?? 0) + 1);
    }
    const shortfalls = [...tagCounts.entries()].filter(([, n]) => n < 3);
    expect(shortfalls, `Tags with <3 cases:\n${JSON.stringify(shortfalls)}`).toEqual([]);
  });
});
