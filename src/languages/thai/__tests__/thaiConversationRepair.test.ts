// src/languages/thai/__tests__/thaiConversationRepair.test.ts
//
// Structural guards for the Thai conversation-repair pack (A3 Wave 6).
// These pin the card contract — NOT linguistic correctness (native review is
// deferred). They check item count, topic coverage, Thai-script phrases with
// romanization, bilingual glosses + "when to use", and a polite-particle note
// on every item (the pack's defining feature).

import { describe, it, expect } from "vitest";

import { items } from "@/languages/thai/conversationRepair";

const THAI_SCRIPT = /[฀-๿]/;
const hasThai = (s: string) => THAI_SCRIPT.test(s);
const nonEmpty = (s: unknown): s is string =>
  typeof s === "string" && s.trim().length > 0;

const REQUIRED_TOPICS = [
  "ask_repeat",
  "slower_speech",
  "simpler_words",
  "confirm_meaning",
  "correct_misunderstanding",
  "ask_to_write",
  "ask_for_example",
  "admit_limited_thai",
] as const;

describe("Thai conversation repair — batch shape", () => {
  it("ships 50–100 compact items", () => {
    expect(items.length).toBeGreaterThanOrEqual(50);
    expect(items.length).toBeLessThanOrEqual(100);
  });

  it("item ids are unique", () => {
    const ids = items.map((i) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("covers every required topic at least once", () => {
    const present = new Set(items.map((i) => i.topic));
    for (const t of REQUIRED_TOPICS) expect(present.has(t)).toBe(true);
  });

  it("only uses valid topics", () => {
    for (const i of items) {
      expect(REQUIRED_TOPICS.includes(i.topic)).toBe(true);
    }
  });
});

describe("Thai conversation repair — card contract", () => {
  it("each phrase is Thai script with romanization + VI/EN gloss", () => {
    for (const i of items) {
      expect(hasThai(i.phrase_th)).toBe(true);
      expect(nonEmpty(i.phrase_rtgs)).toBe(true);
      expect(nonEmpty(i.phrase_vi)).toBe(true);
      expect(nonEmpty(i.phrase_en)).toBe(true);
    }
  });

  it("each card has a bilingual 'when to use' note", () => {
    for (const i of items) {
      expect(nonEmpty(i.when_to_use_vi)).toBe(true);
      expect(nonEmpty(i.when_to_use_en)).toBe(true);
    }
  });

  it("every card has a bilingual polite-particle note", () => {
    for (const i of items) {
      expect(nonEmpty(i.polite_particle_note_vi)).toBe(true);
      expect(nonEmpty(i.polite_particle_note_en)).toBe(true);
    }
  });

  it("polite-particle notes reference ครับ / ค่ะ / คะ", () => {
    const particle = /ครับ|ค่ะ|คะ/;
    for (const i of items) {
      expect(particle.test(i.polite_particle_note_vi)).toBe(true);
      expect(particle.test(i.polite_particle_note_en)).toBe(true);
    }
  });
});
