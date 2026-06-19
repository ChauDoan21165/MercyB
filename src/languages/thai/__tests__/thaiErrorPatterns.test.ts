// src/languages/thai/__tests__/thaiErrorPatterns.test.ts
//
// Structural guard for the Thai learner error-pattern bank. The data is
// teaching content (native review deferred), so these tests pin shape,
// coverage, and bilingual completeness rather than judging Thai correctness.

import { describe, it, expect } from "vitest";

import {
  thaiErrorPatterns,
  THAI_ERROR_CATEGORIES,
  THAI_ERROR_AUDIENCES,
  type ThaiErrorPattern,
} from "@/languages/thai/errorPatterns";

// Matches any Thai-script character (Unicode block U+0E00–U+0E7F).
const THAI_SCRIPT = /[฀-๿]/;

describe("thaiErrorPatterns — size & identity", () => {
  it("holds between 40 and 80 patterns", () => {
    expect(thaiErrorPatterns.length).toBeGreaterThanOrEqual(40);
    expect(thaiErrorPatterns.length).toBeLessThanOrEqual(80);
  });

  it("has unique, kebab-case ids", () => {
    const ids = thaiErrorPatterns.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) {
      expect(id, `id "${id}" should be kebab-case`).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });
});

describe("thaiErrorPatterns — required fields", () => {
  const requiredText: (keyof ThaiErrorPattern)[] = [
    "wrong",
    "wrongRoman",
    "correct",
    "correctRoman",
    "gloss_en",
    "explanation_vi",
    "explanation_en",
    "fix",
  ];

  it("every pattern has non-empty required text fields", () => {
    for (const p of thaiErrorPatterns) {
      for (const key of requiredText) {
        const value = p[key];
        expect(typeof value, `${p.id}.${key} should be a string`).toBe("string");
        expect((value as string).trim().length, `${p.id}.${key} should be non-empty`).toBeGreaterThan(0);
      }
    }
  });

  it("wrong and correct examples contain Thai script", () => {
    for (const p of thaiErrorPatterns) {
      expect(THAI_SCRIPT.test(p.wrong), `${p.id}.wrong should contain Thai script`).toBe(true);
      expect(THAI_SCRIPT.test(p.correct), `${p.id}.correct should contain Thai script`).toBe(true);
    }
  });

  it("Vietnamese and English explanations differ (genuinely bilingual)", () => {
    for (const p of thaiErrorPatterns) {
      expect(p.explanation_vi).not.toBe(p.explanation_en);
    }
  });

  it("wrong and correct forms are not identical (except tone-awareness pairs)", () => {
    for (const p of thaiErrorPatterns) {
      if (p.category === "tone-awareness") continue; // contrast pairs may repeat script intentionally
      expect(p.wrong, `${p.id} should contrast wrong vs correct`).not.toBe(p.correct);
    }
  });
});

describe("thaiErrorPatterns — enums", () => {
  it("uses only valid category tags", () => {
    for (const p of thaiErrorPatterns) {
      expect(THAI_ERROR_CATEGORIES).toContain(p.category);
    }
  });

  it("uses only valid audience tags", () => {
    for (const p of thaiErrorPatterns) {
      expect(THAI_ERROR_AUDIENCES).toContain(p.audience);
    }
  });
});

describe("thaiErrorPatterns — topic coverage", () => {
  it("covers every required topic at least once", () => {
    const present = new Set(thaiErrorPatterns.map((p) => p.category));
    for (const cat of THAI_ERROR_CATEGORIES) {
      expect(present.has(cat), `missing coverage for category "${cat}"`).toBe(true);
    }
  });

  it("addresses Vietnamese-specific and English-specific learner risks separately", () => {
    const audiences = new Set(thaiErrorPatterns.map((p) => p.audience));
    expect(audiences.has("vi"), "expected at least one vi-specific pattern").toBe(true);
    expect(audiences.has("en"), "expected at least one en-specific pattern").toBe(true);
  });
});
