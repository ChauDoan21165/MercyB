// src/languages/thai/__tests__/thaiB1Core.test.ts
//
// Structural + content guards for the Thai B1 "core" lesson batch.
// These validate shape and the task brief's content requirements
// (Thai script, romanization, Vietnamese + English explanations,
// the required focus areas, and practice prompts with answer examples).

import { describe, it, expect } from "vitest";
import {
  thaiB1CoreLessons,
  type ThaiB1Focus,
} from "../lessons-b1-core";

// Matches any Thai script codepoint (U+0E00–U+0E7F).
const THAI_RE = /[฀-๿]/;
// Latin letters → presence of romanization.
const LATIN_RE = /[a-z]/i;

const REQUIRED_FOCUSES: ThaiB1Focus[] = [
  "connected_speech",
  "because_so",
  "if_when",
  "comparisons",
  "giving_reasons",
  "workplace_service",
  "telling_stories",
  "polite_disagreement",
  "problem_solving",
];

describe("Thai B1 core lessons — batch", () => {
  it("has 10–15 lessons", () => {
    expect(thaiB1CoreLessons.length).toBeGreaterThanOrEqual(10);
    expect(thaiB1CoreLessons.length).toBeLessThanOrEqual(15);
  });

  it("has unique lesson ids", () => {
    const ids = thaiB1CoreLessons.map((l) => l.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("marks every lesson as level B1", () => {
    for (const l of thaiB1CoreLessons) {
      expect(l.level).toBe("B1");
    }
  });

  it("covers every required focus area at least once", () => {
    const seen = new Set(thaiB1CoreLessons.map((l) => l.focus));
    for (const f of REQUIRED_FOCUSES) {
      expect(seen.has(f)).toBe(true);
    }
  });
});

describe("Thai B1 core lessons — per-lesson content", () => {
  for (const lesson of thaiB1CoreLessons) {
    describe(lesson.id, () => {
      it("has Vietnamese + English titles and notes", () => {
        expect(lesson.title_en.trim().length).toBeGreaterThan(0);
        expect(lesson.title_vi.trim().length).toBeGreaterThan(0);
        expect(lesson.note_en.trim().length).toBeGreaterThan(0);
        expect(lesson.note_vi.trim().length).toBeGreaterThan(0);
      });

      it("has at least 2 examples, each with Thai script, romanization, vi + en", () => {
        expect(lesson.examples.length).toBeGreaterThanOrEqual(2);
        for (const ex of lesson.examples) {
          expect(THAI_RE.test(ex.th)).toBe(true);
          expect(LATIN_RE.test(ex.rtgs)).toBe(true);
          expect(ex.en.trim().length).toBeGreaterThan(0);
          expect(ex.vi.trim().length).toBeGreaterThan(0);
        }
      });

      it("has at least one practice prompt with vi + en wording", () => {
        expect(lesson.practice.length).toBeGreaterThanOrEqual(1);
        for (const p of lesson.practice) {
          expect(p.prompt_en.trim().length).toBeGreaterThan(0);
          expect(p.prompt_vi.trim().length).toBeGreaterThan(0);
        }
      });

      it("ships at least one answer example per practice prompt", () => {
        for (const p of lesson.practice) {
          expect(p.answers.length).toBeGreaterThanOrEqual(1);
          for (const a of p.answers) {
            expect(THAI_RE.test(a.th)).toBe(true);
            expect(LATIN_RE.test(a.rtgs)).toBe(true);
            expect(a.en.trim().length).toBeGreaterThan(0);
            expect(a.vi.trim().length).toBeGreaterThan(0);
          }
        }
      });
    });
  }
});
