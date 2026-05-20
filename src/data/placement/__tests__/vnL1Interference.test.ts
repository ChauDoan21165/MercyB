import { describe, expect, test } from "vitest";

import {
  VN_L1_INTERFERENCE_PATTERNS,
  type CEFRLevel,
  type VNL1Category,
} from "../vnL1Interference";

const VALID_CEFR_LEVELS = new Set<CEFRLevel>([
  "A1",
  "A2",
  "B1",
  "B2",
  "C1",
  "C2",
]);

const VALID_CATEGORIES = new Set<VNL1Category>([
  "phonology",
  "morphology",
  "syntax",
  "lexicon",
  "discourse",
  "pragmatics",
]);

const VALID_SEVERITIES = new Set(["low", "med", "high"]);

describe("VN L1 Interference taxonomy", () => {
  test("all entries have required fields", () => {
    for (const pattern of VN_L1_INTERFERENCE_PATTERNS) {
      expect(pattern.id.trim().length, pattern.id).toBeGreaterThan(0);
      expect(pattern.category.trim().length, pattern.id).toBeGreaterThan(0);
      expect(pattern.name.trim().length, pattern.id).toBeGreaterThan(0);
      expect(pattern.shortDescription.trim().length, pattern.id).toBeGreaterThan(0);
      expect(pattern.longDescription.trim().length, pattern.id).toBeGreaterThan(0);
      expect(pattern.vietnameseRoot.trim().length, pattern.id).toBeGreaterThan(0);
      expect(pattern.examples.length, pattern.id).toBeGreaterThan(0);
      expect(pattern.cefrLevelsObserved.length, pattern.id).toBeGreaterThan(0);
      expect(VALID_SEVERITIES.has(pattern.severity), pattern.id).toBe(true);
      expect(pattern.remediation.trim().length, pattern.id).toBeGreaterThan(0);
      expect(pattern.lessonTags.length, pattern.id).toBeGreaterThan(0);
    }
  });

  test("all IDs are unique", () => {
    const ids = VN_L1_INTERFERENCE_PATTERNS.map((pattern) => pattern.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  test("all IDs are kebab-case", () => {
    for (const pattern of VN_L1_INTERFERENCE_PATTERNS) {
      expect(pattern.id, pattern.id).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    }
  });

  test("each pattern has at least 3 examples", () => {
    for (const pattern of VN_L1_INTERFERENCE_PATTERNS) {
      expect(pattern.examples.length, pattern.id).toBeGreaterThanOrEqual(3);
    }
  });

  test("all CEFR levels referenced are valid", () => {
    for (const pattern of VN_L1_INTERFERENCE_PATTERNS) {
      for (const level of pattern.cefrLevelsObserved) {
        expect(VALID_CEFR_LEVELS.has(level), `${pattern.id} -> ${level}`).toBe(true);
      }
    }
  });

  test("all categories are valid enum values", () => {
    for (const pattern of VN_L1_INTERFERENCE_PATTERNS) {
      expect(VALID_CATEGORIES.has(pattern.category), pattern.id).toBe(true);
    }
  });

  test("coverage: at least 5 patterns per category", () => {
    for (const category of VALID_CATEGORIES) {
      const count = VN_L1_INTERFERENCE_PATTERNS.filter(
        (pattern) => pattern.category === category,
      ).length;
      expect(count, category).toBeGreaterThanOrEqual(5);
    }
  });

  test("coverage: at least 30 patterns total", () => {
    expect(VN_L1_INTERFERENCE_PATTERNS.length).toBeGreaterThanOrEqual(30);
  });

  test("every pattern has non-empty vietnameseRoot (substantive)", () => {
    for (const pattern of VN_L1_INTERFERENCE_PATTERNS) {
      expect(pattern.vietnameseRoot.trim().length, pattern.id).toBeGreaterThan(50);
    }
  });

  test("examples have both incorrect and corrected forms", () => {
    for (const pattern of VN_L1_INTERFERENCE_PATTERNS) {
      for (const [index, example] of pattern.examples.entries()) {
        expect(example.incorrect.trim().length, `${pattern.id} example ${index}`).toBeGreaterThan(0);
        expect(example.corrected.trim().length, `${pattern.id} example ${index}`).toBeGreaterThan(0);
      }
    }
  });
});
