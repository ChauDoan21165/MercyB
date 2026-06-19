// src/languages/thai/__tests__/thaiExamPractice.test.ts
//
// Structural guard for the Thai exam-style practice bank. Practice material
// only (no certification claim, native review deferred) — these tests pin
// shape, level/type coverage, and bilingual completeness, not Thai accuracy.

import { describe, it, expect } from "vitest";

import {
  thaiExamTasks,
  THAI_EXAM_LEVELS,
  THAI_EXAM_TASK_TYPES,
  type ThaiExamTask,
} from "@/languages/thai/examPractice";

// Matches any Thai-script character (Unicode block U+0E00–U+0E7F).
const THAI_SCRIPT = /[฀-๿]/;

describe("thaiExamTasks — size & identity", () => {
  it("holds between 30 and 60 tasks", () => {
    expect(thaiExamTasks.length).toBeGreaterThanOrEqual(30);
    expect(thaiExamTasks.length).toBeLessThanOrEqual(60);
  });

  it("has unique, kebab-case ids", () => {
    const ids = thaiExamTasks.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) {
      expect(id, `id "${id}" should be kebab-case`).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });
});

describe("thaiExamTasks — required fields", () => {
  const requiredText: (keyof ThaiExamTask)[] = [
    "instruction_vi",
    "instruction_en",
    "question",
    "answer",
    "rubric",
    "commonMistakes",
  ];

  it("every task has non-empty required text fields", () => {
    for (const t of thaiExamTasks) {
      for (const key of requiredText) {
        const value = t[key];
        expect(typeof value, `${t.id}.${key} should be a string`).toBe("string");
        expect((value as string).trim().length, `${t.id}.${key} should be non-empty`).toBeGreaterThan(0);
      }
    }
  });

  it("Vietnamese and English instructions differ (genuinely bilingual)", () => {
    for (const t of thaiExamTasks) {
      expect(t.instruction_vi).not.toBe(t.instruction_en);
    }
  });

  it("every task includes Thai script somewhere (prompt or answer)", () => {
    for (const t of thaiExamTasks) {
      const hasThai =
        (t.prompt_th && THAI_SCRIPT.test(t.prompt_th)) ||
        THAI_SCRIPT.test(t.question) ||
        THAI_SCRIPT.test(t.answer);
      expect(hasThai, `${t.id} should contain Thai script`).toBe(true);
    }
  });

  it("multiple-choice options (when present) have at least 2 choices", () => {
    for (const t of thaiExamTasks) {
      if (t.options) {
        expect(t.options.length, `${t.id} options`).toBeGreaterThanOrEqual(2);
      }
    }
  });
});

describe("thaiExamTasks — enums & lower-level romanization", () => {
  it("uses only valid levels", () => {
    for (const t of thaiExamTasks) {
      expect(THAI_EXAM_LEVELS).toContain(t.level);
    }
  });

  it("uses only valid task types", () => {
    for (const t of thaiExamTasks) {
      expect(THAI_EXAM_TASK_TYPES).toContain(t.type);
    }
  });

  it("lower-level (A1/A2) Thai stimuli include romanization", () => {
    for (const t of thaiExamTasks) {
      if ((t.level === "A1" || t.level === "A2") && t.prompt_th) {
        expect(
          t.prompt_roman && t.prompt_roman.trim().length > 0,
          `${t.id} (lower level) should romanize its Thai stimulus`,
        ).toBe(true);
      }
    }
  });
});

describe("thaiExamTasks — coverage", () => {
  it("covers all six CEFR levels", () => {
    const present = new Set(thaiExamTasks.map((t) => t.level));
    for (const level of THAI_EXAM_LEVELS) {
      expect(present.has(level), `missing tasks for level ${level}`).toBe(true);
    }
  });

  it("covers all six task types", () => {
    const present = new Set(thaiExamTasks.map((t) => t.type));
    for (const type of THAI_EXAM_TASK_TYPES) {
      expect(present.has(type), `missing task type ${type}`).toBe(true);
    }
  });
});
