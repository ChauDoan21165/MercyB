import { describe, expect, it } from "vitest";

import punjabiA1MicroLessons, {
  microLessonScriptAwareness,
  punjabiA1MicroLessons as namedMicroLessons,
  type PunjabiMicroLessonTopic,
} from "@/languages/punjabi/microLessonsA1";

const GURMUKHI_SCRIPT = /[\u0A00-\u0A7F]/;
const LATIN = /[a-zA-Z]/;

describe("Punjabi A1 micro lessons", () => {
  it("exports the same named and default app-consumable data", () => {
    expect(punjabiA1MicroLessons).toBe(namedMicroLessons);
    expect(Array.isArray(punjabiA1MicroLessons)).toBe(true);
  });

  it("covers the required compact beginner topics", () => {
    expect(punjabiA1MicroLessons.length).toBeGreaterThanOrEqual(9);
    expect(punjabiA1MicroLessons.length).toBeLessThanOrEqual(16);

    const requiredTopics: PunjabiMicroLessonTopic[] = [
      "greetings",
      "identity",
      "family",
      "numbers",
      "food",
      "directions",
      "time",
      "polite_requests",
      "canada_survival",
    ];
    const topics = new Set(punjabiA1MicroLessons.map((lesson) => lesson.topic));

    for (const topic of requiredTopics) {
      expect(topics, `missing topic ${topic}`).toContain(topic);
    }
  });

  it("uses Gurmukhi primary with romanization and bilingual explanations", () => {
    for (const lesson of punjabiA1MicroLessons) {
      expect(lesson.id).toMatch(/^pa_a1_micro_/);
      expect(lesson.title_vi.trim().length).toBeGreaterThan(0);
      expect(lesson.title_en.trim().length).toBeGreaterThan(0);
      expect(lesson.goal_vi.trim().length).toBeGreaterThan(0);
      expect(lesson.goal_en.trim().length).toBeGreaterThan(0);
      expect(lesson.key_phrase.pa).toMatch(GURMUKHI_SCRIPT);
      expect(lesson.key_phrase.romanization).toMatch(LATIN);
      expect(lesson.key_phrase.vi.trim().length).toBeGreaterThan(0);
      expect(lesson.key_phrase.en.trim().length).toBeGreaterThan(0);
      expect(lesson.explanation_vi.trim().length).toBeGreaterThan(0);
      expect(lesson.explanation_en.trim().length).toBeGreaterThan(0);
    }
  });

  it("includes examples, learner traps, and quick checks", () => {
    for (const lesson of punjabiA1MicroLessons) {
      expect(lesson.examples.length).toBeGreaterThanOrEqual(2);
      expect(lesson.learner_traps.length).toBeGreaterThanOrEqual(1);
      expect(lesson.quick_check.answer_pa).toMatch(GURMUKHI_SCRIPT);
      expect(lesson.quick_check.answer_romanization).toMatch(LATIN);

      for (const example of lesson.examples) {
        expect(example.pa).toMatch(GURMUKHI_SCRIPT);
        expect(example.romanization).toMatch(LATIN);
        expect(example.vi.trim().length).toBeGreaterThan(0);
        expect(example.en.trim().length).toBeGreaterThan(0);
      }

      for (const trap of lesson.learner_traps) {
        expect(["vi", "en", "both"]).toContain(trap.audience);
        expect(trap.vi.trim().length).toBeGreaterThan(0);
        expect(trap.en.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it("includes Canada-practical examples where useful", () => {
    const canadaExamples = punjabiA1MicroLessons.flatMap((lesson) =>
      lesson.examples.filter((example) => example.canada_practical),
    );

    expect(canadaExamples.length).toBeGreaterThanOrEqual(6);
    expect(JSON.stringify(canadaExamples)).toMatch(/ਟਿਕਟ|ਬੱਸ|ਫਾਰਮ|ਅਪਾਇੰਟਮੈਂਟ|ਪਛਾਣ/);
  });

  it("keeps Shahmukhi as awareness only and does not claim native review", () => {
    const allText = `${microLessonScriptAwareness} ${JSON.stringify(punjabiA1MicroLessons)}`;

    expect(microLessonScriptAwareness).toContain("Shahmukhi");
    expect(microLessonScriptAwareness).toContain("awareness only");
    expect(allText).not.toMatch(/native[- ]speaker review|native reviewed/i);
  });
});
