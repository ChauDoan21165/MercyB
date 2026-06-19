// src/languages/thai/__tests__/thaiCollocations.test.ts
//
// Structural guards for the Thai collocation bank (A9, Wave 6). Pins size,
// shape, topic coverage, the literal/natural components, and the no-audio
// scope. Does NOT assert linguistic correctness (native review is deferred).

import { describe, it, expect } from "vitest";

import { THAI_COLLOCATIONS } from "@/languages/thai/collocations";
import type { ThaiCollocationTopic } from "@/languages/thai/collocations";

const THAI_RANGE = /[฀-๿]/;
const LEVELS = new Set(["A1", "A2", "B1", "B2"]);
const TOPICS: ThaiCollocationTopic[] = [
  "make-do", "take-give", "have-be", "feelings", "work",
  "food", "travel", "health", "study", "money",
];
const TOPIC_SET = new Set<string>(TOPICS);
const ALLOWED_KEYS = new Set(["th", "rom", "vi", "en", "literal", "topic", "level"]);

describe("Thai collocation bank", () => {
  it("has 200–400 compact entries", () => {
    expect(THAI_COLLOCATIONS.length).toBeGreaterThanOrEqual(200);
    expect(THAI_COLLOCATIONS.length).toBeLessThanOrEqual(400);
  });

  it("every entry has Thai script, romanization, and natural VI + EN meanings", () => {
    for (const v of THAI_COLLOCATIONS) {
      expect(THAI_RANGE.test(v.th), `Thai script: ${v.th}`).toBe(true);
      expect(v.rom.trim().length, `rom ${v.th}`).toBeGreaterThan(0);
      expect(v.vi.trim().length, `vi ${v.th}`).toBeGreaterThan(0);
      expect(v.en.trim().length, `en ${v.th}`).toBeGreaterThan(0);
    }
  });

  it("romanization is a plain reading aid (ascii, no tone diacritics)", () => {
    for (const v of THAI_COLLOCATIONS) {
      expect(/^[a-z ]+$/.test(v.rom), `rom should be plain ascii: "${v.rom}" (${v.th})`).toBe(true);
    }
  });

  it("every entry has a known topic and level", () => {
    for (const v of THAI_COLLOCATIONS) {
      expect(TOPIC_SET.has(v.topic), `topic ${v.topic} for ${v.th}`).toBe(true);
      expect(LEVELS.has(v.level), `level ${v.level} for ${v.th}`).toBe(true);
    }
  });

  it("phrases (th) are unique within the file", () => {
    const seen = new Set<string>();
    for (const v of THAI_COLLOCATIONS) {
      expect(seen.has(v.th), `duplicate th: ${v.th}`).toBe(false);
      seen.add(v.th);
    }
  });

  it("covers all 10 required topics, each with a solid count", () => {
    const counts = new Map<ThaiCollocationTopic, number>();
    for (const v of THAI_COLLOCATIONS) {
      counts.set(v.topic, (counts.get(v.topic) ?? 0) + 1);
    }
    for (const t of TOPICS) {
      expect(counts.get(t) ?? 0, `topic "${t}" count`).toBeGreaterThanOrEqual(15);
    }
  });

  it("includes literal glosses on a meaningful set of idioms (where helpful)", () => {
    const withLiteral = THAI_COLLOCATIONS.filter((v) => typeof v.literal === "string");
    expect(withLiteral.length).toBeGreaterThanOrEqual(20);
    for (const v of withLiteral) {
      expect(v.literal!.trim().length, `literal ${v.th}`).toBeGreaterThan(0);
    }
  });

  it("carries no audio/scoring field on any entry (no-audio scope)", () => {
    for (const v of THAI_COLLOCATIONS) {
      for (const k of Object.keys(v)) {
        expect(ALLOWED_KEYS.has(k), `unexpected key "${k}" in ${v.th}`).toBe(true);
      }
    }
  });
});
