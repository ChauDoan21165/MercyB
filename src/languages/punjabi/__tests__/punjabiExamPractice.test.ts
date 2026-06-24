import { describe, expect, it } from "vitest";

import {
  PUNJABI_EXAM_LEVELS,
  PUNJABI_EXAM_NOTICE,
  PUNJABI_EXAM_TASK_TYPES,
  punjabiExamTasks,
  type PunjabiExamTask,
} from "@/languages/punjabi/examPractice";

const GURMUKHI_SCRIPT = /[\u0A00-\u0A7F]/;
const VIETNAMESE_MARKS = /[ăâđêôơưàáạảãằắặẳẵầấậẩẫèéẹẻẽềếệểễìíịỉĩòóọỏõồốộổỗờớợởỡùúụủũừứựửữỳýỵỷỹ]/i;

describe("punjabiExamTasks - size and identity", () => {
  it("holds between 40 and 80 compact tasks", () => {
    expect(punjabiExamTasks.length).toBeGreaterThanOrEqual(40);
    expect(punjabiExamTasks.length).toBeLessThanOrEqual(80);
  });

  it("has unique kebab-case ids", () => {
    const ids = punjabiExamTasks.map((task) => task.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) {
      expect(id).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });
});

describe("punjabiExamTasks - required teaching fields", () => {
  const requiredText: (keyof PunjabiExamTask)[] = [
    "instruction_vi",
    "instruction_en",
    "question",
    "answer",
    "explanation_vi",
    "explanation_en",
    "studyNote",
  ];

  it("fills every required text field", () => {
    for (const task of punjabiExamTasks) {
      for (const key of requiredText) {
        const value = task[key];
        expect(typeof value, `${task.id}.${key}`).toBe("string");
        expect((value as string).trim().length, `${task.id}.${key}`).toBeGreaterThan(0);
      }
    }
  });

  it("keeps Vietnamese and English explanations genuinely bilingual", () => {
    for (const task of punjabiExamTasks) {
      expect(task.instruction_vi).not.toBe(task.instruction_en);
      expect(task.explanation_vi).not.toBe(task.explanation_en);
      expect(
        VIETNAMESE_MARKS.test(task.instruction_vi) || VIETNAMESE_MARKS.test(task.explanation_vi),
        `${task.id} should include Vietnamese text`,
      ).toBe(true);
    }
  });

  it("uses Gurmukhi in each task", () => {
    for (const task of punjabiExamTasks) {
      const serialized = JSON.stringify(task);
      expect(GURMUKHI_SCRIPT.test(serialized), `${task.id} should include Gurmukhi`).toBe(true);
    }
  });

  it("multiple-choice options, when present, have at least two choices", () => {
    for (const task of punjabiExamTasks) {
      if (task.options) {
        expect(task.options.length, `${task.id}.options`).toBeGreaterThanOrEqual(2);
      }
    }
  });
});

describe("punjabiExamTasks - levels, types, and certification notice", () => {
  it("uses only valid levels and covers every level", () => {
    const present = new Set<PunjabiExamTask["level"]>();
    for (const task of punjabiExamTasks) {
      expect(PUNJABI_EXAM_LEVELS).toContain(task.level);
      present.add(task.level);
    }
    for (const level of PUNJABI_EXAM_LEVELS) {
      expect(present.has(level), `missing level ${level}`).toBe(true);
    }
  });

  it("uses only valid task types and covers every required task family", () => {
    const present = new Set<PunjabiExamTask["type"]>();
    for (const task of punjabiExamTasks) {
      expect(PUNJABI_EXAM_TASK_TYPES).toContain(task.type);
      present.add(task.type);
    }
    for (const type of PUNJABI_EXAM_TASK_TYPES) {
      expect(present.has(type), `missing type ${type}`).toBe(true);
    }
  });

  it("states study support only and not official certification", () => {
    expect(PUNJABI_EXAM_NOTICE.toLowerCase()).toContain("study support only");
    expect(PUNJABI_EXAM_NOTICE.toLowerCase()).toContain("not official certification");
    expect(PUNJABI_EXAM_NOTICE.toLowerCase()).toContain("native review deferred");
  });
});
