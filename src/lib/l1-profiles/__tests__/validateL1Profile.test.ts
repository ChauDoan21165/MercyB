/**
 * validateL1Profile — structural tests.
 *
 * Three categories:
 *   1. The real `vietnameseL1Profile` passes with zero errors.
 *   2. needsReview warnings surface (C2 + C3 authoring flags preserved).
 *   3. Synthetic mutations of the real profile trip each named rule.
 *
 * Synthetic profiles are JSON-clones of the real one — function-valued
 * rule entries are stripped, but the validator only reads
 * `rulePack.explanations[].tag` (strings), so this is safe.
 */

import { describe, expect, it } from "vitest";

import { vietnameseL1Profile, type L1Profile } from "../vi.js";
import { validateL1Profile } from "../validate.js";

function cloneProfile(profile: L1Profile): L1Profile {
  return JSON.parse(JSON.stringify(profile)) as L1Profile;
}

describe("validateL1Profile — real profile", () => {
  it("vietnameseL1Profile passes with zero errors", () => {
    const result = validateL1Profile(vietnameseL1Profile);
    expect(result.errors).toEqual([]);
  });

  it("surfaces needsReview entries as warnings (C2 writing + C3 phonology)", () => {
    const result = validateL1Profile(vietnameseL1Profile);
    expect(result.warnings.length).toBeGreaterThan(0);
    expect(result.warnings.some((w) => w.includes("needsReview"))).toBe(true);
  });
});

describe("validateL1Profile — synthetic failures", () => {
  it("flags duplicate grammar family IDs", () => {
    const p = cloneProfile(vietnameseL1Profile);
    const families = p.grammar?.families;
    if (!families || families.length < 2) {
      throw new Error("test setup: real profile must have ≥2 grammar families");
    }
    families[1].id = families[0].id;
    const result = validateL1Profile(p);
    expect(
      result.errors.some((e) =>
        e.toLowerCase().includes("duplicate grammar family id"),
      ),
    ).toBe(true);
  });

  it("flags duplicate writing pattern IDs", () => {
    const p = cloneProfile(vietnameseL1Profile);
    const patterns = p.writing?.patterns;
    if (!patterns || patterns.length < 2) {
      throw new Error("test setup: real profile must have ≥2 writing patterns");
    }
    patterns[1].id = patterns[0].id;
    const result = validateL1Profile(p);
    expect(
      result.errors.some((e) =>
        e.toLowerCase().includes("duplicate writing pattern id"),
      ),
    ).toBe(true);
  });

  it("flags duplicate phonology gap IDs", () => {
    const p = cloneProfile(vietnameseL1Profile);
    const gaps = p.phonology?.gaps;
    if (!gaps || gaps.length < 2) {
      throw new Error("test setup: real profile must have ≥2 phonology gaps");
    }
    gaps[1].id = gaps[0].id;
    const result = validateL1Profile(p);
    expect(
      result.errors.some((e) =>
        e.toLowerCase().includes("duplicate phonology gap id"),
      ),
    ).toBe(true);
  });

  it("flags 'med' severity (regression check against the codemod)", () => {
    const p = cloneProfile(vietnameseL1Profile);
    const fam = p.grammar?.families?.[0];
    if (!fam) throw new Error("test setup: family[0] missing");
    (fam as { severity: unknown }).severity = "med";
    const result = validateL1Profile(p);
    expect(result.errors.some((e) => e.includes("severity"))).toBe(true);
    expect(result.errors.some((e) => e.includes('"med"'))).toBe(true);
  });

  it("flags kebab-case IDs (regression against snake_case lock)", () => {
    const p = cloneProfile(vietnameseL1Profile);
    const fam = p.grammar?.families?.[0];
    if (!fam) throw new Error("test setup: family[0] missing");
    fam.id = "article-omission-overuse";
    const result = validateL1Profile(p);
    expect(result.errors.some((e) => e.includes("snake_case"))).toBe(true);
  });

  it("flags kebab-case interference pattern IDs", () => {
    const p = cloneProfile(vietnameseL1Profile);
    const pattern = p.interference.patterns[0];
    if (!pattern) throw new Error("test setup: pattern[0] missing");
    pattern.id = "missing-articles";
    const result = validateL1Profile(p);
    expect(
      result.errors.some(
        (e) =>
          e.includes("interference.patterns") && e.includes("snake_case"),
      ),
    ).toBe(true);
  });

  it("flags ruleTags pointing to unknown detector tags (cross-link enforcement)", () => {
    const p = cloneProfile(vietnameseL1Profile);
    const fam = p.grammar?.families?.[0];
    if (!fam) throw new Error("test setup: family[0] missing");
    fam.ruleTags = ["vi_l1_does_not_exist"];
    const result = validateL1Profile(p);
    expect(
      result.errors.some((e) =>
        e.includes("not a tag in grammar.rulePack"),
      ),
    ).toBe(true);
  });

  it("flags bad meta.nativeLangCode (non-ISO-639-1)", () => {
    const p = cloneProfile(vietnameseL1Profile);
    p.meta.nativeLangCode = "VIE";
    const result = validateL1Profile(p);
    expect(result.errors.some((e) => e.includes("nativeLangCode"))).toBe(true);
  });

  it("flags bad meta.targetLangCode (uppercase / wrong length)", () => {
    const p = cloneProfile(vietnameseL1Profile);
    p.meta.targetLangCode = "ENG";
    const result = validateL1Profile(p);
    expect(result.errors.some((e) => e.includes("targetLangCode"))).toBe(true);
  });

  it("flags empty interference.patterns", () => {
    const p = cloneProfile(vietnameseL1Profile);
    p.interference.patterns = [];
    const result = validateL1Profile(p);
    expect(
      result.errors.some((e) => e.includes("interference.patterns")),
    ).toBe(true);
  });

  it("flags bad meta.version (non-semver)", () => {
    const p = cloneProfile(vietnameseL1Profile);
    p.meta.version = "v1";
    const result = validateL1Profile(p);
    expect(result.errors.some((e) => e.includes("version"))).toBe(true);
  });

  it("flags bad meta.lastReviewed (not ISO date)", () => {
    const p = cloneProfile(vietnameseL1Profile);
    p.meta.lastReviewed = "yesterday";
    const result = validateL1Profile(p);
    expect(result.errors.some((e) => e.includes("lastReviewed"))).toBe(true);
  });

  it("flags empty meta.citations", () => {
    const p = cloneProfile(vietnameseL1Profile);
    p.meta.citations = [];
    const result = validateL1Profile(p);
    expect(result.errors.some((e) => e.includes("citations"))).toBe(true);
  });

  it("flags kebab-case grammar phenomenon", () => {
    const p = cloneProfile(vietnameseL1Profile);
    const fam = p.grammar?.families?.[0];
    if (!fam) throw new Error("test setup: family[0] missing");
    fam.phenomenon = "article-definiteness";
    const result = validateL1Profile(p);
    expect(
      result.errors.some(
        (e) => e.includes("phenomenon") && e.includes("snake_case"),
      ),
    ).toBe(true);
  });
});

describe("validateL1Profile — non-object input", () => {
  it("returns a single error for null", () => {
    const result = validateL1Profile(null as unknown as L1Profile);
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.warnings).toEqual([]);
  });

  it("returns errors for an empty object", () => {
    const result = validateL1Profile({} as L1Profile);
    expect(result.errors.length).toBeGreaterThan(0);
  });
});
