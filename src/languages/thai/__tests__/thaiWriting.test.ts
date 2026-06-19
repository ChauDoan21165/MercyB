// src/languages/thai/__tests__/thaiWriting.test.ts
//
// Guards for the Thai writing-practice bank (writing.ts): the right COUNT and
// LEVEL spread, every FORM covered, full bilingual VI+EN coverage, romanization
// at lower levels, model answers actually in Thai, and rubric/mistakes present.

import { describe, it, expect } from "vitest";
import writingTasks, {
  writingTasks as named,
  type ThaiWritingTask,
} from "../writing";

const THAI_RE = /[฀-๿]/;
const hasThai = (s: string) => THAI_RE.test(s);

const ALL_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;
// "Lower levels" for the romanization requirement = A1–A2. B1+ paragraph
// model answers are not normally romanized; many short B1 items still carry it.
const LOWER_LEVELS = new Set(["A1", "A2"]);
const REQUIRED_FORMS = [
  "form",
  "message",
  "complaint",
  "apology",
  "work_note",
  "opinion_paragraph",
  "essay_report",
] as const;

describe("Thai writing — module wiring & coverage", () => {
  it("default and named exports are the same array", () => {
    expect(writingTasks).toBe(named);
    expect(Array.isArray(writingTasks)).toBe(true);
  });

  it("ships 40–80 writing tasks", () => {
    expect(writingTasks.length).toBeGreaterThanOrEqual(40);
    expect(writingTasks.length).toBeLessThanOrEqual(80);
  });

  it("every id is unique", () => {
    const ids = writingTasks.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("spans every CEFR level A1–C2", () => {
    const seen = new Set(writingTasks.map((t) => t.level));
    for (const lvl of ALL_LEVELS) expect(seen.has(lvl)).toBe(true);
  });

  it("covers every required writing form", () => {
    const seen = new Set(writingTasks.map((t) => t.form));
    for (const f of REQUIRED_FORMS) expect(seen.has(f)).toBe(true);
  });
});

describe("Thai writing — every task is well-formed", () => {
  it.each(writingTasks.map((t) => [t.id, t] as const))(
    "%s has bilingual prompt, Thai model, glosses, rubric & mistakes",
    (_id, t: ThaiWritingTask) => {
      // Prompt is bilingual instruction.
      expect(t.prompt_vi.trim().length).toBeGreaterThan(0);
      expect(t.prompt_en.trim().length).toBeGreaterThan(0);

      // Model answer is genuinely Thai, with VI + EN glosses.
      expect(hasThai(t.model_th)).toBe(true);
      expect(t.model_vi.trim().length).toBeGreaterThan(0);
      expect(t.model_en.trim().length).toBeGreaterThan(0);

      // Rubric hints and common mistakes, in both languages, parallel length.
      expect(t.rubric_vi.length).toBeGreaterThan(0);
      expect(t.rubric_en.length).toBe(t.rubric_vi.length);
      expect(t.mistakes_vi.length).toBeGreaterThan(0);
      expect(t.mistakes_en.length).toBe(t.mistakes_vi.length);
    },
  );

  it.each(
    writingTasks
      .filter((t) => LOWER_LEVELS.has(t.level))
      .map((t) => [t.id, t] as const),
  )("%s (A1–B1) carries romanization for the model answer", (_id, t) => {
    expect(t.model_romanization).toBeDefined();
    expect(t.model_romanization!.trim().length).toBeGreaterThan(0);
    expect(hasThai(t.model_romanization!)).toBe(false);
  });
});

describe("Thai writing — advanced model answers defer native review", () => {
  it.each(
    writingTasks
      .filter((t) => t.level === "C1" || t.level === "C2")
      .map((t) => [t.id, t] as const),
  )("%s (C1/C2) marks native review deferred", (_id, t) => {
    expect(t.native_review).toBe("deferred");
  });
});
