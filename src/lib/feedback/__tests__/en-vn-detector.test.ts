/**
 * EN→VN detector consumer test.
 *
 * Exercises the `detectEnVnError` barrel adapter end-to-end against
 * the same engine + EN_VN_RULE_PACK that the AiTutor flow uses on
 * `target === "vi"` (per src/pages/AiTutor.tsx, the EN→VN branch
 * promised by PR #1188's body and wired in the same commit as this
 * test file).
 *
 * Mirrors the VN→EN consumer pattern at `l1-error-detector.test.ts`
 * — a thin `expectHit` helper, fixtures pulled directly from
 * `evals/en-vn-grammar-cases.json`. The rule-pack-specific unit
 * tests live under `rule-packs/en-vn/__tests__/rules.test.ts`;
 * THIS file's job is to verify the consumer entry point (barrel
 * adapter) wires the engine + pack correctly.
 */

import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { detectEnVnError } from "../index.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const FIXTURE_PATH = resolve(
  __dirname,
  "../../../../evals/en-vn-grammar-cases.json",
);

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

type Fixture = { _meta: Record<string, unknown>; cases: FixtureCase[] };

function loadFixture(): Fixture {
  return JSON.parse(readFileSync(FIXTURE_PATH, "utf8")) as Fixture;
}

function fixtureById(cases: FixtureCase[], id: string): FixtureCase {
  const c = cases.find((x) => x.id === id);
  if (!c) throw new Error(`fixture not found: ${id}`);
  return c;
}

function runFromFixture(c: FixtureCase) {
  return detectEnVnError({
    userAnswer: c.input,
    expectedAnswer: c.expected_correction,
  });
}

describe("detectEnVnError — barrel adapter end-to-end", () => {
  const { cases } = loadFixture();

  it("runs end-to-end against a typed input and returns L1DetectionResult", () => {
    const r = detectEnVnError({
      userAnswer: "Tôi là vui.",
      expectedAnswer: "Tôi vui.",
    });
    expect(r).toBeDefined();
    expect(typeof r.matched).toBe("boolean");
    if (r.matched) {
      expect(r.weaknessTag).toMatch(/^en_l1_/);
      expect(r.feedback).not.toBeNull();
      expect(r.feedback!.en.length).toBeGreaterThan(0);
      expect(r.feedback!.vi.length).toBeGreaterThan(0);
    }
  });

  // Three representative fixtures from `evals/en-vn-grammar-cases.json`,
  // one per family the EN→VN pack covers most directly. If the pack
  // regresses on any of these, the consumer wire-in is broken.
  it("fires en_l1_copula_la_adj on en-vn-gram-001 (Tôi là vui → Tôi vui)", () => {
    const c = fixtureById(cases, "en-vn-gram-001");
    const r = runFromFixture(c);
    expect(r.matched).toBe(true);
    if (r.matched) {
      expect(r.weaknessTag).toBe("en_l1_copula_la_adj");
      expect(r.feedback).not.toBeNull();
    }
  });

  it("fires en_l1_classifier_omission on en-vn-gram-004 (Tôi mua một sách → Tôi mua một cuốn sách)", () => {
    const c = fixtureById(cases, "en-vn-gram-004");
    const r = runFromFixture(c);
    expect(r.matched).toBe(true);
    if (r.matched) {
      expect(r.weaknessTag).toBe("en_l1_classifier_omission");
    }
  });

  it("fires en_l1_aspect_overuse_stative on en-vn-gram-007 (Tôi đang muốn ăn phở → Tôi muốn ăn phở)", () => {
    const c = fixtureById(cases, "en-vn-gram-007");
    const r = runFromFixture(c);
    expect(r.matched).toBe(true);
    if (r.matched) {
      expect(r.weaknessTag).toBe("en_l1_aspect_overuse_stative");
    }
  });

  it("does NOT fire when user and expected are identical (engine short-circuit)", () => {
    const r = detectEnVnError({
      userAnswer: "Tôi vui.",
      expectedAnswer: "Tôi vui.",
    });
    expect(r.matched).toBe(false);
  });

  it("does NOT fire when inputs are clean Vietnamese with no transfer pattern", () => {
    const r = detectEnVnError({
      userAnswer: "Hôm nay tôi đi học.",
      expectedAnswer: "Hôm nay tôi đến trường.",
    });
    // Different sentences, but neither input contains a transfer
    // pattern from `src/lib/l1-profiles/en.ts`. The pack should miss
    // cleanly (NOT throw, NOT crash, NOT misfire as an English-pack
    // tag like `vi_l1_third_person_s`).
    expect(r.matched).toBe(false);
    expect(r.weaknessTag).toBeNull();
  });
});
