import { describe, expect, it } from "vitest";

import sentencePatterns, {
  sentencePatternScriptAwareness,
  sentencePatterns as namedSentencePatterns,
  type PunjabiPatternTopic,
} from "@/languages/punjabi/sentencePatterns";

const GURMUKHI_SCRIPT = /[\u0A00-\u0A7F]/;
const LATIN = /[a-zA-Z]/;

describe("Punjabi sentence pattern bank", () => {
  it("exports the same named and default data array", () => {
    expect(sentencePatterns).toBe(namedSentencePatterns);
    expect(Array.isArray(sentencePatterns)).toBe(true);
  });

  it("contains 80-150 compact patterns", () => {
    expect(sentencePatterns.length).toBeGreaterThanOrEqual(80);
    expect(sentencePatterns.length).toBeLessThanOrEqual(150);
  });

  it("uses unique ids and required topics", () => {
    const ids = sentencePatterns.map((pattern) => pattern.id);
    expect(new Set(ids).size).toBe(ids.length);

    const requiredTopics: PunjabiPatternTopic[] = [
      "greeting",
      "want_need",
      "can_cannot",
      "location",
      "time",
      "buying",
      "asking",
      "giving_reason",
      "comparing",
      "polite_request",
      "complaint",
      "opinion",
      "family",
      "workplace",
      "clinic",
      "public_office",
    ];
    const topics = new Set(sentencePatterns.map((pattern) => pattern.topic));

    for (const topic of requiredTopics) {
      expect(topics, `missing topic ${topic}`).toContain(topic);
    }
  });

  it("keeps every pattern Gurmukhi-first with romanization and bilingual meaning", () => {
    for (const item of sentencePatterns) {
      expect(item.id).toMatch(/^pa_pattern_\d{3}$/);
      expect(["A1", "A2"]).toContain(item.level);
      expect(item.pattern).toMatch(GURMUKHI_SCRIPT);
      expect(item.romanization).toMatch(LATIN);
      expect(item.meaning_vi.trim().length).toBeGreaterThan(0);
      expect(item.meaning_en.trim().length).toBeGreaterThan(0);
      expect(item.substitution_slots.length).toBeGreaterThanOrEqual(1);
      expect(item.common_mistake.vi.trim().length).toBeGreaterThan(0);
      expect(item.common_mistake.en.trim().length).toBeGreaterThan(0);
    }
  });

  it("includes examples with Gurmukhi, romanization, Vietnamese, and English", () => {
    for (const item of sentencePatterns) {
      expect(item.examples.length).toBeGreaterThanOrEqual(1);
      for (const example of item.examples) {
        expect(example.pa).toMatch(GURMUKHI_SCRIPT);
        expect(example.romanization).toMatch(LATIN);
        expect(example.vi.trim().length).toBeGreaterThan(0);
        expect(example.en.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it("supports Vietnamese-speaking and English-speaking learner mistakes", () => {
    const audiences = new Set(sentencePatterns.map((pattern) => pattern.common_mistake.audience));
    expect(audiences.has("vi") || audiences.has("both")).toBe(true);
    expect(audiences.has("en") || audiences.has("both")).toBe(true);
  });

  it("mentions Shahmukhi only as awareness, not a full course", () => {
    const allText = `${sentencePatternScriptAwareness} ${JSON.stringify(sentencePatterns)}`;
    expect(sentencePatternScriptAwareness).toContain("Shahmukhi");
    expect(sentencePatternScriptAwareness).toContain("awareness only");
    expect(allText).not.toMatch(/native[- ]speaker review|native reviewed/i);
  });
});
