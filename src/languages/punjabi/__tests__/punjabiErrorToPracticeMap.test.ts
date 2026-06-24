import { describe, expect, it } from "vitest";

import {
  PUNJABI_ERROR_TO_PRACTICE_NOTICE,
  PUNJABI_PRACTICE_AUDIENCES,
  PUNJABI_PRACTICE_ERROR_TYPES,
  punjabiErrorToPracticeMap,
  type PunjabiErrorPracticeMapEntry,
} from "@/languages/punjabi/errorToPracticeMap";

const GURMUKHI_SCRIPT = /[\u0A00-\u0A7F]/;
const VIETNAMESE_MARKS = /[ăâđêôơưàáạảãằắặẳẵầấậẩẫèéẹẻẽềếệểễìíịỉĩòóọỏõồốộổỗờớợởỡùúụủũừứựửữỳýỵỷỹ]/i;

describe("punjabiErrorToPracticeMap - size and identity", () => {
  it("keeps a compact useful map", () => {
    expect(punjabiErrorToPracticeMap.length).toBeGreaterThanOrEqual(14);
    expect(punjabiErrorToPracticeMap.length).toBeLessThanOrEqual(50);
  });

  it("has unique kebab-case ids", () => {
    const ids = punjabiErrorToPracticeMap.map((entry) => entry.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) {
      expect(id).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });
});

describe("punjabiErrorToPracticeMap - app fields", () => {
  const requiredText: (keyof PunjabiErrorPracticeMapEntry)[] = [
    "observedError",
    "corrected_pa",
    "meaning_en",
    "explanation_vi",
    "explanation_en",
    "practiceType",
    "practicePrompt_vi",
    "practicePrompt_en",
  ];

  it("fills every required text field", () => {
    for (const entry of punjabiErrorToPracticeMap) {
      for (const key of requiredText) {
        const value = entry[key];
        expect(typeof value, `${entry.id}.${key}`).toBe("string");
        expect((value as string).trim().length, `${entry.id}.${key}`).toBeGreaterThan(0);
      }
      expect(entry.routeIds.length, `${entry.id}.routeIds`).toBeGreaterThan(0);
    }
  });

  it("uses Gurmukhi primary in corrected forms", () => {
    for (const entry of punjabiErrorToPracticeMap) {
      expect(GURMUKHI_SCRIPT.test(entry.corrected_pa), `${entry.id}.corrected_pa`).toBe(true);
    }
  });

  it("keeps Vietnamese and English explanations genuinely bilingual", () => {
    for (const entry of punjabiErrorToPracticeMap) {
      expect(entry.explanation_vi).not.toBe(entry.explanation_en);
      expect(entry.practicePrompt_vi).not.toBe(entry.practicePrompt_en);
      expect(
        VIETNAMESE_MARKS.test(entry.explanation_vi) || VIETNAMESE_MARKS.test(entry.practicePrompt_vi),
        `${entry.id} should include Vietnamese text`,
      ).toBe(true);
    }
  });
});

describe("punjabiErrorToPracticeMap - coverage and guardrails", () => {
  it("uses only valid error types and covers every required type", () => {
    const present = new Set<PunjabiErrorPracticeMapEntry["errorType"]>();
    for (const entry of punjabiErrorToPracticeMap) {
      expect(PUNJABI_PRACTICE_ERROR_TYPES).toContain(entry.errorType);
      present.add(entry.errorType);
    }
    for (const type of PUNJABI_PRACTICE_ERROR_TYPES) {
      expect(present.has(type), `missing error type ${type}`).toBe(true);
    }
  });

  it("uses only valid audiences and includes Vietnamese/English-specific mapping", () => {
    const present = new Set<PunjabiErrorPracticeMapEntry["audience"]>();
    for (const entry of punjabiErrorToPracticeMap) {
      expect(PUNJABI_PRACTICE_AUDIENCES).toContain(entry.audience);
      present.add(entry.audience);
    }
    expect(present.has("en")).toBe(true);
    expect(present.has("both")).toBe(true);
  });

  it("includes Canada-practical examples", () => {
    expect(punjabiErrorToPracticeMap.filter((entry) => entry.canadaPractical).length).toBeGreaterThanOrEqual(5);
  });

  it("mentions Shahmukhi only as awareness, not a full course", () => {
    const serialized = `${PUNJABI_ERROR_TO_PRACTICE_NOTICE} ${JSON.stringify(punjabiErrorToPracticeMap)}`.toLowerCase();
    expect(serialized).toContain("shahmukhi");
    expect(serialized).toContain("awareness");
    expect(serialized).toContain("not a full course");
  });

  it("does not claim native review", () => {
    const notice = PUNJABI_ERROR_TO_PRACTICE_NOTICE.toLowerCase();
    expect(notice).toContain("native review deferred");
    expect(notice).not.toContain("native reviewed");
  });
});
