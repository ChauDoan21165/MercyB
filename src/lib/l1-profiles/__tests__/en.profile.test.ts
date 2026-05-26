import { describe, expect, it } from "vitest";

import { englishL1Profile } from "../en.js";
import { validateL1Profile } from "../validate.js";

describe("englishL1Profile — Axis 2 Bar #1", () => {
  it("identifies the English-speaker learner to Vietnamese target pair", () => {
    expect(englishL1Profile.meta.nativeLangCode).toBe("en");
    expect(englishL1Profile.meta.targetLangCode).toBe("vi");
    expect(englishL1Profile.meta.nativeLangName).toBe("English");
  });

  it("passes the shared structural validator", () => {
    const result = validateL1Profile(englishL1Profile);
    expect(result.errors).toEqual([]);
  });

  it("ships ≥10 grammar families with ≥80 paired examples (Bar #1 floor)", () => {
    const families = englishL1Profile.grammar?.families ?? [];
    expect(families.length).toBeGreaterThanOrEqual(10);

    const totalExamples = families.reduce(
      (sum, fam) => sum + fam.examples.length,
      0,
    );
    expect(totalExamples).toBeGreaterThanOrEqual(80);
  });

  it("uses snake_case for every family id and ruleTags entry", () => {
    const snake = /^[a-z][a-z0-9_]*$/;
    for (const fam of englishL1Profile.grammar?.families ?? []) {
      expect(fam.id, fam.id).toMatch(snake);
      for (const tag of fam.ruleTags ?? []) {
        expect(tag, tag).toMatch(snake);
      }
    }
  });

  it("every example has both learnerProduces and targetForm", () => {
    for (const fam of englishL1Profile.grammar?.families ?? []) {
      for (const ex of fam.examples) {
        expect(ex.learnerProduces.trim().length, fam.id).toBeGreaterThan(0);
        expect(ex.targetForm.trim().length, fam.id).toBeGreaterThan(0);
      }
    }
  });

  it("uses the locked severity vocabulary on every family", () => {
    const SEVERITY = new Set(["low", "medium", "high"]);
    for (const fam of englishL1Profile.grammar?.families ?? []) {
      expect(SEVERITY.has(fam.severity), fam.id).toBe(true);
    }
  });

  it("provides bilingual descriptionEn + descriptionVi on every family", () => {
    for (const fam of englishL1Profile.grammar?.families ?? []) {
      expect(fam.descriptionEn.trim().length, fam.id).toBeGreaterThan(0);
      expect(fam.descriptionVi.trim().length, fam.id).toBeGreaterThan(0);
    }
  });
});
