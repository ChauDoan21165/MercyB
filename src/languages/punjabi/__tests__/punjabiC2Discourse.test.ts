// Punjabi C2 discourse/nuance lesson batch — structural & scope guards.

import { describe, expect, it } from "vitest";

import {
  C2_DISCOURSE_DISCLAIMER,
  lessons,
  type PunjabiC2DiscourseLesson,
  type PunjabiDiscourseFocus,
} from "@/languages/punjabi/lessons-c2-discourse";

const GURMUKHI_RANGE = /[\u0A00-\u0A7F]/;
const hasGurmukhi = (s: string) => GURMUKHI_RANGE.test(s);

const REQUIRED_FOCUSES: PunjabiDiscourseFocus[] = [
  "nuance",
  "register",
  "softening",
  "indirect_refusal",
  "respectful_disagreement",
  "idiom_awareness",
  "community_context",
  "formal_context",
  "rhetorical_framing",
];

describe("Punjabi C2 discourse — batch shape", () => {
  it("ships 10-16 compact lessons", () => {
    expect(lessons.length).toBeGreaterThanOrEqual(10);
    expect(lessons.length).toBeLessThanOrEqual(16);
  });

  it("every lesson is level C2", () => {
    for (const lesson of lessons) {
      expect(lesson.level).toBe("C2");
    }
  });

  it("lesson ids are unique and non-empty", () => {
    const ids = lessons.map((lesson) => lesson.id);
    expect(ids.every((id) => id.length > 0)).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("covers every required discourse focus at least once", () => {
    const seen = new Set(lessons.map((lesson) => lesson.focus));
    for (const focus of REQUIRED_FOCUSES) {
      expect(seen.has(focus), `missing focus: ${focus}`).toBe(true);
    }
  });
});

describe("Punjabi C2 discourse — bilingual completeness", () => {
  it("each lesson has Vietnamese + English titles, overviews, and tips", () => {
    for (const lesson of lessons) {
      expect(lesson.title_vi.length, `${lesson.id} title_vi`).toBeGreaterThan(0);
      expect(lesson.title_en.length, `${lesson.id} title_en`).toBeGreaterThan(0);
      expect(lesson.overview_vi.length, `${lesson.id} overview_vi`).toBeGreaterThan(0);
      expect(lesson.overview_en.length, `${lesson.id} overview_en`).toBeGreaterThan(0);
      expect(lesson.tip_vi.length, `${lesson.id} tip_vi`).toBeGreaterThan(0);
      expect(lesson.tip_en.length, `${lesson.id} tip_en`).toBeGreaterThan(0);
    }
  });

  it("each lesson carries at least 3 phrases and 2 examples", () => {
    for (const lesson of lessons) {
      expect(lesson.phrases.length, `${lesson.id} phrases`).toBeGreaterThanOrEqual(3);
      expect(lesson.examples.length, `${lesson.id} examples`).toBeGreaterThanOrEqual(2);
    }
  });

  it("every phrase has Gurmukhi, romanization, and VI+EN meanings", () => {
    for (const lesson of lessons) {
      for (const phrase of lesson.phrases) {
        expect(hasGurmukhi(phrase.gurmukhi), `${lesson.id} phrase: ${phrase.gurmukhi}`).toBe(true);
        expect(phrase.romanization.length, `${lesson.id} phrase romanization`).toBeGreaterThan(0);
        expect(phrase.meaning_vi.length, `${lesson.id} phrase meaning_vi`).toBeGreaterThan(0);
        expect(phrase.meaning_en.length, `${lesson.id} phrase meaning_en`).toBeGreaterThan(0);
      }
    }
  });

  it("every example has Gurmukhi + romanization + VI + EN", () => {
    for (const lesson of lessons) {
      for (const example of lesson.examples) {
        expect(hasGurmukhi(example.gurmukhi), `${lesson.id} example: ${example.gurmukhi}`).toBe(true);
        expect(example.romanization.length, `${lesson.id} example romanization`).toBeGreaterThan(0);
        expect(example.vi.length, `${lesson.id} example vi`).toBeGreaterThan(0);
        expect(example.en.length, `${lesson.id} example en`).toBeGreaterThan(0);
      }
    }
  });
});

describe("Punjabi C2 discourse — scope and review framing", () => {
  it("exposes bilingual study-support disclaimer with deferred native review", () => {
    expect(C2_DISCOURSE_DISCLAIMER.vi.length).toBeGreaterThan(0);
    expect(C2_DISCOURSE_DISCLAIMER.en.length).toBeGreaterThan(0);
    expect(C2_DISCOURSE_DISCLAIMER.en.toLowerCase()).toContain("native review is deferred");
  });

  it("keeps Gurmukhi primary and mentions Shahmukhi only as awareness", () => {
    const disclaimer = `${C2_DISCOURSE_DISCLAIMER.vi} ${C2_DISCOURSE_DISCLAIMER.en}`.toLowerCase();
    expect(disclaimer).toContain("gurmukhi");
    expect(disclaimer).toContain("shahmukhi");
    expect(disclaimer).toContain("awareness");
    expect(disclaimer).not.toContain("full shahmukhi course");
  });

  it("does not claim native review anywhere in lesson text", () => {
    const blob = JSON.stringify(lessons).toLowerCase();
    expect(blob).not.toContain("native-reviewed");
    expect(blob).not.toContain("native-certified");
    expect(blob).not.toContain("certified by a native");
  });
});

const _typecheck: PunjabiC2DiscourseLesson[] = lessons;
void _typecheck;
