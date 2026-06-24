import { describe, expect, it } from "vitest";

import {
  PUNJABI_ERROR_AUDIENCES,
  PUNJABI_ERROR_CATEGORIES,
  punjabiErrorPatterns,
  type PunjabiErrorPattern,
} from "@/languages/punjabi/errorPatterns";

const GURMUKHI_SCRIPT = /[\u0A00-\u0A7F]/;
const VIETNAMESE_MARKS = /[ăâđêôơưàáạảãằắặẳẵầấậẩẫèéẹẻẽềếệểễìíịỉĩòóọỏõồốộổỗờớợởỡùúụủũừứựửữỳýỵỷỹ]/i;

describe("punjabiErrorPatterns - size and identity", () => {
  it("holds between 50 and 100 compact patterns", () => {
    expect(punjabiErrorPatterns.length).toBeGreaterThanOrEqual(50);
    expect(punjabiErrorPatterns.length).toBeLessThanOrEqual(100);
  });

  it("has unique kebab-case ids", () => {
    const ids = punjabiErrorPatterns.map((pattern) => pattern.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) {
      expect(id).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });
});

describe("punjabiErrorPatterns - required teaching fields", () => {
  const requiredText: (keyof PunjabiErrorPattern)[] = [
    "wrongInput",
    "wrongRoman",
    "correctedForm",
    "correctedRoman",
    "meaning_en",
    "whyWrong_vi",
    "whyWrong_en",
    "repairStrategy_vi",
    "repairStrategy_en",
    "practiceItem",
  ];

  it("fills every required text field", () => {
    for (const pattern of punjabiErrorPatterns) {
      for (const key of requiredText) {
        const value = pattern[key];
        expect(typeof value, `${pattern.id}.${key}`).toBe("string");
        expect((value as string).trim().length, `${pattern.id}.${key}`).toBeGreaterThan(0);
      }
    }
  });

  it("uses Gurmukhi in corrected forms and practice items", () => {
    for (const pattern of punjabiErrorPatterns) {
      expect(GURMUKHI_SCRIPT.test(pattern.correctedForm), `${pattern.id}.correctedForm`).toBe(true);
      expect(GURMUKHI_SCRIPT.test(pattern.practiceItem), `${pattern.id}.practiceItem`).toBe(true);
    }
  });

  it("keeps Vietnamese and English explanations genuinely bilingual", () => {
    for (const pattern of punjabiErrorPatterns) {
      expect(pattern.whyWrong_vi).not.toBe(pattern.whyWrong_en);
      expect(pattern.repairStrategy_vi).not.toBe(pattern.repairStrategy_en);
      expect(
        VIETNAMESE_MARKS.test(pattern.whyWrong_vi) || VIETNAMESE_MARKS.test(pattern.repairStrategy_vi),
        `${pattern.id} should include Vietnamese text`,
      ).toBe(true);
    }
  });

  it("contrasts wrong input and corrected form", () => {
    for (const pattern of punjabiErrorPatterns) {
      expect(pattern.wrongInput, pattern.id).not.toBe(pattern.correctedForm);
    }
  });
});

describe("punjabiErrorPatterns - enums and coverage", () => {
  it("uses only valid category tags and covers every required topic", () => {
    const present = new Set<PunjabiErrorPattern["category"]>();
    for (const pattern of punjabiErrorPatterns) {
      expect(PUNJABI_ERROR_CATEGORIES).toContain(pattern.category);
      present.add(pattern.category);
    }
    for (const category of PUNJABI_ERROR_CATEGORIES) {
      expect(present.has(category), `missing category ${category}`).toBe(true);
    }
  });

  it("uses only valid audience tags and includes Vietnamese- and English-specific risks", () => {
    const present = new Set<PunjabiErrorPattern["audience"]>();
    for (const pattern of punjabiErrorPatterns) {
      expect(PUNJABI_ERROR_AUDIENCES).toContain(pattern.audience);
      present.add(pattern.audience);
    }
    expect(present.has("vi")).toBe(true);
    expect(present.has("en")).toBe(true);
    expect(present.has("both")).toBe(true);
  });

  it("mentions Shahmukhi only as awareness, not as full-course content", () => {
    const mentions = punjabiErrorPatterns.filter((pattern) =>
      JSON.stringify(pattern).toLowerCase().includes("shahmukhi"),
    );
    expect(mentions.length).toBe(1);
    expect(JSON.stringify(mentions[0]).toLowerCase()).toContain("awareness");
    expect(JSON.stringify(mentions[0]).toLowerCase()).toContain("not a full course");
  });
});
