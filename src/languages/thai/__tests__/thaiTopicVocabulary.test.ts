// src/languages/thai/__tests__/thaiTopicVocabulary.test.ts
//
// Structural guards for the Thai topic vocabulary expansion (A9, Wave 5).
// Pins size, shape, topic coverage, and the no-audio scope. Does NOT assert
// linguistic correctness (native review is deferred).

import { describe, it, expect } from "vitest";

import { THAI_TOPIC_VOCABULARY } from "@/languages/thai/topicVocabulary";
import type { ThaiTopic } from "@/languages/thai/topicVocabulary";

const THAI_RANGE = /[฀-๿]/;
const LEVELS = new Set(["A1", "A2", "B1", "B2"]);
const TOPICS: ThaiTopic[] = [
  "food", "transport", "hotel", "health", "work", "school", "family",
  "shopping", "public-services", "emotions", "technology", "weather", "money",
];
const TOPIC_SET = new Set<string>(TOPICS);

describe("Thai topic vocabulary", () => {
  it("has 300–600 curated entries", () => {
    expect(THAI_TOPIC_VOCABULARY.length).toBeGreaterThanOrEqual(300);
    expect(THAI_TOPIC_VOCABULARY.length).toBeLessThanOrEqual(600);
  });

  it("every entry has Thai script, romanization, VI gloss, EN gloss", () => {
    for (const v of THAI_TOPIC_VOCABULARY) {
      expect(THAI_RANGE.test(v.th), `Thai script: ${v.th}`).toBe(true);
      expect(v.rom.trim().length, `rom ${v.th}`).toBeGreaterThan(0);
      expect(v.vi.trim().length, `vi ${v.th}`).toBeGreaterThan(0);
      expect(v.en.trim().length, `en ${v.th}`).toBeGreaterThan(0);
    }
  });

  it("every entry has a known level and topic", () => {
    for (const v of THAI_TOPIC_VOCABULARY) {
      expect(LEVELS.has(v.level), `level ${v.level} for ${v.th}`).toBe(true);
      expect(TOPIC_SET.has(v.topic), `topic ${v.topic} for ${v.th}`).toBe(true);
    }
  });

  it("romanization is a plain reading aid (ascii, no tone diacritics)", () => {
    for (const v of THAI_TOPIC_VOCABULARY) {
      expect(/^[a-z ]+$/.test(v.rom), `rom should be plain ascii: "${v.rom}" (${v.th})`).toBe(true);
    }
  });

  it("Thai headwords are unique within the file", () => {
    const seen = new Set<string>();
    for (const v of THAI_TOPIC_VOCABULARY) {
      expect(seen.has(v.th), `duplicate th: ${v.th}`).toBe(false);
      seen.add(v.th);
    }
  });

  it("covers all 13 required topics, each with a solid count", () => {
    const counts = new Map<ThaiTopic, number>();
    for (const v of THAI_TOPIC_VOCABULARY) {
      counts.set(v.topic, (counts.get(v.topic) ?? 0) + 1);
    }
    for (const t of TOPICS) {
      expect(counts.get(t) ?? 0, `topic "${t}" count`).toBeGreaterThanOrEqual(15);
    }
  });

  it("carries no audio/scoring field on any entry (no-audio scope)", () => {
    const allowed = new Set(["th", "rom", "vi", "en", "level", "topic"]);
    for (const v of THAI_TOPIC_VOCABULARY) {
      for (const k of Object.keys(v)) {
        expect(allowed.has(k), `unexpected key "${k}" in ${v.th}`).toBe(true);
      }
    }
  });
});
