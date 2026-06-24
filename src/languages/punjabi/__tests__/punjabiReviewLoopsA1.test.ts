import { describe, expect, it } from "vitest";

import punjabiA1ReviewLoops, {
  punjabiA1ReviewLoops as namedReviewLoops,
  reviewLoopScriptAwareness,
  type PunjabiReviewLoopTopic,
} from "@/languages/punjabi/reviewLoopsA1";

const GURMUKHI_SCRIPT = /[\u0A00-\u0A7F]/;
const LATIN = /[a-zA-Z]/;

describe("Punjabi A1 review loops", () => {
  it("exports app-consumable named and default arrays", () => {
    expect(punjabiA1ReviewLoops).toBe(namedReviewLoops);
    expect(Array.isArray(punjabiA1ReviewLoops)).toBe(true);
  });

  it("is compact and covers required A1 review topics", () => {
    expect(punjabiA1ReviewLoops.length).toBeGreaterThanOrEqual(20);
    expect(punjabiA1ReviewLoops.length).toBeLessThanOrEqual(36);

    const requiredTopics: PunjabiReviewLoopTopic[] = [
      "greetings",
      "numbers",
      "identity",
      "family",
      "food",
      "directions",
      "help_phrases",
      "polite_requests",
      "gurmukhi_recognition",
      "canada_service",
    ];
    const topics = new Set(punjabiA1ReviewLoops.map((loop) => loop.topic));

    for (const topic of requiredTopics) {
      expect(topics, `missing topic ${topic}`).toContain(topic);
    }
  });

  it("uses spaced intervals and complete bilingual prompts", () => {
    const intervals = new Set(punjabiA1ReviewLoops.map((loop) => loop.interval));
    for (const interval of ["same_day", "next_day", "three_days", "one_week"]) {
      expect(intervals).toContain(interval);
    }

    for (const loop of punjabiA1ReviewLoops) {
      expect(loop.id).toMatch(/^pa_a1_review_/);
      expect(loop.prompt_vi.trim().length).toBeGreaterThan(0);
      expect(loop.prompt_en.trim().length).toBeGreaterThan(0);
      expect(loop.answer_vi.trim().length).toBeGreaterThan(0);
      expect(loop.answer_en.trim().length).toBeGreaterThan(0);
      expect(loop.explanation_vi.trim().length).toBeGreaterThan(0);
      expect(loop.explanation_en.trim().length).toBeGreaterThan(0);
    }
  });

  it("keeps Gurmukhi primary with romanization support and Gurmukhi distractors", () => {
    for (const loop of punjabiA1ReviewLoops) {
      expect(loop.answer_pa).toMatch(GURMUKHI_SCRIPT);
      expect(loop.romanization).toMatch(LATIN);
      expect(loop.distractors_pa.length).toBeGreaterThanOrEqual(3);
      for (const distractor of loop.distractors_pa) {
        expect(distractor).toMatch(GURMUKHI_SCRIPT);
      }
    }
  });

  it("includes learner traps and Canada-practical review", () => {
    const traps = punjabiA1ReviewLoops.flatMap((loop) => loop.learner_trap ? [loop.learner_trap] : []);
    const trapAudiences = new Set(traps.map((trap) => trap.audience));
    const canadaLoops = punjabiA1ReviewLoops.filter((loop) => loop.canada_practical);

    expect(traps.length).toBeGreaterThanOrEqual(8);
    expect(trapAudiences.has("vi") || trapAudiences.has("both")).toBe(true);
    expect(trapAudiences.has("en") || trapAudiences.has("both")).toBe(true);
    expect(canadaLoops.length).toBeGreaterThanOrEqual(7);
    expect(JSON.stringify(canadaLoops)).toMatch(/ਟਿਕਟ|ਕਲਿਨਿਕ|ਫਾਰਮ|ਅਪਾਇੰਟਮੈਂਟ|ਪਛਾਣ|ਬੱਸ/);
  });

  it("mentions Shahmukhi only as awareness and does not claim native review", () => {
    const allText = `${reviewLoopScriptAwareness} ${JSON.stringify(punjabiA1ReviewLoops)}`;

    expect(reviewLoopScriptAwareness).toContain("Shahmukhi");
    expect(reviewLoopScriptAwareness).toContain("awareness only");
    expect(allText).not.toMatch(/native[- ]speaker review|native reviewed/i);
    expect(allText).not.toMatch(/audioUrl|pronunciationScore|Azure/i);
  });
});
