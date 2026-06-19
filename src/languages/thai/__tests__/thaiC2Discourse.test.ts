// Thai C2 discourse/nuance lesson batch — structural & content guards.
//
// These tests pin the shape and the bilingual completeness of the C2 discourse
// study-support material. They intentionally do NOT assert linguistic
// correctness (native review is deferred); they guard that every lesson ships
// Thai script + Vietnamese + English, covers the required discourse focuses,
// and carries the "not native-certified" disclaimer.

import { describe, it, expect } from "vitest";

import {
  lessons,
  C2_DISCOURSE_DISCLAIMER,
  type ThaiC2DiscourseLesson,
  type ThaiDiscourseFocus,
} from "@/languages/thai/lessons-c2-discourse";

// Cheap heuristic: does a string contain at least one Thai-script codepoint?
const THAI_RANGE = /[฀-๿]/;
const hasThai = (s: string) => THAI_RANGE.test(s);

const REQUIRED_FOCUSES: ThaiDiscourseFocus[] = [
  "stance",
  "implication",
  "soft_disagreement",
  "register_shifting",
  "politeness_hierarchy",
  "hedging",
  "indirectness",
  "formal_argument",
  "pragmatic_nuance",
];

describe("Thai C2 discourse — batch shape", () => {
  it("ships 10–15 compact lessons", () => {
    expect(lessons.length).toBeGreaterThanOrEqual(10);
    expect(lessons.length).toBeLessThanOrEqual(15);
  });

  it("every lesson is level C2", () => {
    for (const l of lessons) {
      expect(l.level).toBe("C2");
    }
  });

  it("lesson ids are unique and non-empty", () => {
    const ids = lessons.map((l) => l.id);
    expect(ids.every((id) => id.length > 0)).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("covers every required discourse focus at least once", () => {
    const seen = new Set(lessons.map((l) => l.focus));
    for (const f of REQUIRED_FOCUSES) {
      expect(seen.has(f), `missing focus: ${f}`).toBe(true);
    }
  });
});

describe("Thai C2 discourse — bilingual completeness", () => {
  it("each lesson has Vietnamese + English titles and overviews", () => {
    for (const l of lessons) {
      expect(l.title_vi.length, `${l.id} title_vi`).toBeGreaterThan(0);
      expect(l.title_en.length, `${l.id} title_en`).toBeGreaterThan(0);
      expect(l.overview_vi.length, `${l.id} overview_vi`).toBeGreaterThan(0);
      expect(l.overview_en.length, `${l.id} overview_en`).toBeGreaterThan(0);
      expect(l.tip_vi.length, `${l.id} tip_vi`).toBeGreaterThan(0);
      expect(l.tip_en.length, `${l.id} tip_en`).toBeGreaterThan(0);
    }
  });

  it("each lesson carries at least 3 phrases and 2 examples", () => {
    for (const l of lessons) {
      expect(l.phrases.length, `${l.id} phrases`).toBeGreaterThanOrEqual(3);
      expect(l.examples.length, `${l.id} examples`).toBeGreaterThanOrEqual(2);
    }
  });

  it("every phrase has Thai script, romanization, and VI+EN meanings", () => {
    for (const l of lessons) {
      for (const p of l.phrases) {
        expect(hasThai(p.thai), `${l.id} phrase thai: ${p.thai}`).toBe(true);
        expect(p.rtgs.length, `${l.id} phrase rtgs`).toBeGreaterThan(0);
        expect(p.meaning_vi.length, `${l.id} phrase meaning_vi`).toBeGreaterThan(0);
        expect(p.meaning_en.length, `${l.id} phrase meaning_en`).toBeGreaterThan(0);
      }
    }
  });

  it("every example has Thai script + romanization + VI + EN", () => {
    for (const l of lessons) {
      for (const e of l.examples) {
        expect(hasThai(e.thai), `${l.id} example thai: ${e.thai}`).toBe(true);
        expect(e.rtgs.length, `${l.id} example rtgs`).toBeGreaterThan(0);
        expect(e.vi.length, `${l.id} example vi`).toBeGreaterThan(0);
        expect(e.en.length, `${l.id} example en`).toBeGreaterThan(0);
      }
    }
  });
});

describe("Thai C2 discourse — study-support framing", () => {
  it("exposes a bilingual not-native-certified disclaimer", () => {
    expect(C2_DISCOURSE_DISCLAIMER.vi.length).toBeGreaterThan(0);
    expect(C2_DISCOURSE_DISCLAIMER.en.length).toBeGreaterThan(0);
    // Must signal deferred native review, not claim native authority.
    expect(C2_DISCOURSE_DISCLAIMER.en.toLowerCase()).toContain("native");
    expect(C2_DISCOURSE_DISCLAIMER.en.toLowerCase()).toContain("deferred");
  });

  it("does not claim native review anywhere in lesson text", () => {
    const blob = JSON.stringify(lessons).toLowerCase();
    expect(blob).not.toContain("native-reviewed");
    expect(blob).not.toContain("native-certified");
    expect(blob).not.toContain("certified by a native");
  });
});

// Type-level smoke: the exported array is typed as the lesson type.
const _typecheck: ThaiC2DiscourseLesson[] = lessons;
void _typecheck;
