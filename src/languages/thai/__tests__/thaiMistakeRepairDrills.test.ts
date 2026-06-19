// src/languages/thai/__tests__/thaiMistakeRepairDrills.test.ts
//
// Structural guard for the Thai mistake-repair drill bank. Teaching content
// (native review deferred) — these tests pin shape, topic coverage, and
// bilingual completeness, not Thai correctness.

import { describe, it, expect } from "vitest";

import {
  thaiMistakeRepairDrills,
  THAI_REPAIR_TOPICS,
  THAI_REPAIR_AUDIENCES,
  type ThaiRepairDrill,
} from "@/languages/thai/mistakeRepairDrills";

// Matches any Thai-script character (Unicode block U+0E00–U+0E7F).
const THAI_SCRIPT = /[฀-๿]/;

describe("thaiMistakeRepairDrills — size & identity", () => {
  it("holds between 60 and 120 drills", () => {
    expect(thaiMistakeRepairDrills.length).toBeGreaterThanOrEqual(60);
    expect(thaiMistakeRepairDrills.length).toBeLessThanOrEqual(120);
  });

  it("has unique, kebab-case ids", () => {
    const ids = thaiMistakeRepairDrills.map((d) => d.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) {
      expect(id, `id "${id}" should be kebab-case`).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });
});

describe("thaiMistakeRepairDrills — required fields", () => {
  const requiredText: (keyof ThaiRepairDrill)[] = [
    "wrong",
    "corrected",
    "gloss_en",
    "whyWrong_vi",
    "whyWrong_en",
    "repairStrategy",
    "practice",
  ];

  it("every drill has non-empty required text fields", () => {
    for (const d of thaiMistakeRepairDrills) {
      for (const key of requiredText) {
        const value = d[key];
        expect(typeof value, `${d.id}.${key} should be a string`).toBe("string");
        expect((value as string).trim().length, `${d.id}.${key} should be non-empty`).toBeGreaterThan(0);
      }
    }
  });

  it("corrected form always contains Thai script", () => {
    for (const d of thaiMistakeRepairDrills) {
      expect(THAI_SCRIPT.test(d.corrected), `${d.id}.corrected should contain Thai script`).toBe(true);
    }
  });

  it("wrong and corrected forms differ", () => {
    for (const d of thaiMistakeRepairDrills) {
      expect(d.wrong, `${d.id} should contrast wrong vs corrected`).not.toBe(d.corrected);
    }
  });

  it("Vietnamese and English explanations differ (genuinely bilingual)", () => {
    for (const d of thaiMistakeRepairDrills) {
      expect(d.whyWrong_vi).not.toBe(d.whyWrong_en);
    }
  });
});

describe("thaiMistakeRepairDrills — enums", () => {
  it("uses only valid topic tags", () => {
    for (const d of thaiMistakeRepairDrills) {
      expect(THAI_REPAIR_TOPICS).toContain(d.topic);
    }
  });

  it("uses only valid audience tags", () => {
    for (const d of thaiMistakeRepairDrills) {
      expect(THAI_REPAIR_AUDIENCES).toContain(d.audience);
    }
  });
});

describe("thaiMistakeRepairDrills — coverage", () => {
  it("covers every required topic at least once", () => {
    const present = new Set(thaiMistakeRepairDrills.map((d) => d.topic));
    for (const topic of THAI_REPAIR_TOPICS) {
      expect(present.has(topic), `missing coverage for topic "${topic}"`).toBe(true);
    }
  });

  it("addresses both Vietnamese-specific and English-specific learners", () => {
    const audiences = new Set(thaiMistakeRepairDrills.map((d) => d.audience));
    expect(audiences.has("vi"), "expected at least one vi-specific drill").toBe(true);
    expect(audiences.has("en"), "expected at least one en-specific drill").toBe(true);
  });
});
