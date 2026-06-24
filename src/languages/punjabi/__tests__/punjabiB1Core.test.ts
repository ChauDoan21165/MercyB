import { describe, expect, it } from "vitest";
import {
  punjabiB1CoreLessons,
  type PunjabiB1Focus,
} from "../lessons-b1-core";

const GURMUKHI_RE = /[\u0A00-\u0A7F]/;
const LATIN_RE = /[a-z]/i;

const REQUIRED_FOCUSES: PunjabiB1Focus[] = [
  "storytelling",
  "workplace_basics",
  "phone_calls",
  "appointments",
  "explaining_problems",
  "giving_reasons",
  "comparison",
  "plans",
  "public_services",
];

describe("Punjabi B1 core lessons - batch", () => {
  it("has 10-16 compact B1 lessons", () => {
    expect(punjabiB1CoreLessons.length).toBeGreaterThanOrEqual(10);
    expect(punjabiB1CoreLessons.length).toBeLessThanOrEqual(16);
  });

  it("has unique lesson ids and marks every lesson B1", () => {
    const ids = punjabiB1CoreLessons.map((lesson) => lesson.id);
    expect(new Set(ids).size).toBe(ids.length);

    for (const lesson of punjabiB1CoreLessons) {
      expect(lesson.level).toBe("B1");
    }
  });

  it("covers the required B1 communication areas", () => {
    const seen = new Set(punjabiB1CoreLessons.map((lesson) => lesson.focus));

    for (const focus of REQUIRED_FOCUSES) {
      expect(seen.has(focus)).toBe(true);
    }
  });
});

describe("Punjabi B1 core lessons - learner content", () => {
  for (const lesson of punjabiB1CoreLessons) {
    describe(lesson.id, () => {
      it("has Vietnamese and English titles and notes", () => {
        expect(lesson.title_en.trim().length).toBeGreaterThan(0);
        expect(lesson.title_vi.trim().length).toBeGreaterThan(0);
        expect(lesson.note_en.trim().length).toBeGreaterThan(0);
        expect(lesson.note_vi.trim().length).toBeGreaterThan(0);
      });

      it("uses Gurmukhi primary text plus romanization in every example", () => {
        expect(lesson.examples.length).toBeGreaterThanOrEqual(2);

        for (const example of lesson.examples) {
          expect(GURMUKHI_RE.test(example.pa)).toBe(true);
          expect(LATIN_RE.test(example.romanization)).toBe(true);
          expect(example.en.trim().length).toBeGreaterThan(0);
          expect(example.vi.trim().length).toBeGreaterThan(0);
        }
      });

      it("includes bilingual practice prompts with answer examples", () => {
        expect(lesson.practice.length).toBeGreaterThanOrEqual(1);

        for (const prompt of lesson.practice) {
          expect(prompt.prompt_en.trim().length).toBeGreaterThan(0);
          expect(prompt.prompt_vi.trim().length).toBeGreaterThan(0);
          expect(prompt.answers.length).toBeGreaterThanOrEqual(1);

          for (const answer of prompt.answers) {
            expect(GURMUKHI_RE.test(answer.pa)).toBe(true);
            expect(LATIN_RE.test(answer.romanization)).toBe(true);
            expect(answer.en.trim().length).toBeGreaterThan(0);
            expect(answer.vi.trim().length).toBeGreaterThan(0);
          }
        }
      });

      it("includes common mistakes with bilingual explanations", () => {
        expect(lesson.commonMistakes.length).toBeGreaterThanOrEqual(1);

        for (const mistake of lesson.commonMistakes) {
          expect(mistake.mistake_en.trim().length).toBeGreaterThan(0);
          expect(mistake.mistake_vi.trim().length).toBeGreaterThan(0);
          expect(GURMUKHI_RE.test(mistake.correction.pa)).toBe(true);
          expect(LATIN_RE.test(mistake.correction.romanization)).toBe(true);
          expect(mistake.correction.en.trim().length).toBeGreaterThan(0);
          expect(mistake.correction.vi.trim().length).toBeGreaterThan(0);
        }
      });
    });
  }
});
