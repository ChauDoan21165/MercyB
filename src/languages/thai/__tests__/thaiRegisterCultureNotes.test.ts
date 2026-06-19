// Thai register & culture notes — structural, coverage, and safety guards.
//
// These tests pin the SHAPE and completeness of the safe-communication notes,
// not their linguistic correctness (native review is deferred). They guard:
// count (40–80), level range (A2–C2), topic coverage, bilingual explanations,
// a Thai-script "safer phrase" per note, optional bilingual `avoid` blocks,
// and the not-native-certified / no-stereotype framing.

import { describe, it, expect } from "vitest";

import {
  notes,
  notesByTopic,
  TOPIC_ORDER,
  REGISTER_CULTURE_DISCLAIMER,
  type ThaiCefrLevel,
  type RegisterTopic,
} from "@/languages/thai/registerCultureNotes";

const THAI_RANGE = /[฀-๿]/;
const hasThai = (s: string) => THAI_RANGE.test(s);

const ALLOWED_LEVELS: ThaiCefrLevel[] = ["A2", "B1", "B2", "C1", "C2"];

const REQUIRED_TOPICS: RegisterTopic[] = [
  "politeness_particles",
  "pronouns",
  "status_age_hierarchy",
  "indirect_refusal",
  "softening",
  "apologies",
  "requests",
  "taboo_risky",
  "temple_royal_formal",
  "customer_service",
  "workplace_respect",
];

describe("Thai register/culture — batch size & coverage", () => {
  it("contains 40–80 notes", () => {
    expect(notes.length).toBeGreaterThanOrEqual(40);
    expect(notes.length).toBeLessThanOrEqual(80);
  });

  it("every note level is within A2–C2", () => {
    for (const n of notes) {
      expect(ALLOWED_LEVELS.includes(n.level), `${n.id} bad level ${n.level}`).toBe(true);
    }
  });

  it("covers every required topic at least once", () => {
    const seen = new Set(notes.map((n) => n.topic));
    for (const t of REQUIRED_TOPICS) {
      expect(seen.has(t), `missing topic: ${t}`).toBe(true);
    }
  });

  it("TOPIC_ORDER lists exactly the required topics", () => {
    expect([...TOPIC_ORDER].sort()).toEqual([...REQUIRED_TOPICS].sort());
  });

  it("notesByTopic returns only matching notes", () => {
    for (const t of REQUIRED_TOPICS) {
      const subset = notesByTopic(t);
      expect(subset.length).toBeGreaterThan(0);
      expect(subset.every((n) => n.topic === t)).toBe(true);
    }
  });
});

describe("Thai register/culture — per-note integrity", () => {
  it("ids are unique and non-empty", () => {
    const ids = notes.map((n) => n.id);
    expect(ids.every((id) => id.length > 0)).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("each note has VI+EN titles and explanations", () => {
    for (const n of notes) {
      expect(n.title_vi.length, `${n.id} title_vi`).toBeGreaterThan(0);
      expect(n.title_en.length, `${n.id} title_en`).toBeGreaterThan(0);
      expect(n.note_vi.length, `${n.id} note_vi`).toBeGreaterThan(0);
      expect(n.note_en.length, `${n.id} note_en`).toBeGreaterThan(0);
    }
  });

  it("each note ships a safer_phrase with Thai script + VI + EN", () => {
    for (const n of notes) {
      const p = n.safer_phrase;
      expect(hasThai(p.thai), `${n.id} safer_phrase thai: ${p.thai}`).toBe(true);
      expect(p.vi.length, `${n.id} safer_phrase vi`).toBeGreaterThan(0);
      expect(p.en.length, `${n.id} safer_phrase en`).toBeGreaterThan(0);
    }
  });

  it("when present, `avoid` carries Thai script + VI + EN", () => {
    for (const n of notes) {
      if (n.avoid) {
        expect(hasThai(n.avoid.thai), `${n.id} avoid thai`).toBe(true);
        expect(n.avoid.vi.length, `${n.id} avoid vi`).toBeGreaterThan(0);
        expect(n.avoid.en.length, `${n.id} avoid en`).toBeGreaterThan(0);
      }
    }
  });

  it("at least a quarter of notes include an `avoid` contrast", () => {
    const withAvoid = notes.filter((n) => n.avoid).length;
    expect(withAvoid).toBeGreaterThanOrEqual(Math.floor(notes.length / 4));
  });
});

describe("Thai register/culture — safe framing", () => {
  it("exposes a bilingual not-native-certified, no-stereotype disclaimer", () => {
    expect(REGISTER_CULTURE_DISCLAIMER.vi.length).toBeGreaterThan(0);
    expect(REGISTER_CULTURE_DISCLAIMER.en.length).toBeGreaterThan(0);
    const en = REGISTER_CULTURE_DISCLAIMER.en.toLowerCase();
    expect(en).toContain("not native-certified");
    expect(en).toContain("deferred");
    expect(en).toContain("stereotype");
  });

  it("makes no native-review claim in note text", () => {
    const blob = JSON.stringify(notes).toLowerCase();
    expect(blob).not.toContain("native-reviewed");
    expect(blob).not.toContain("native-certified");
    expect(blob).not.toContain("certified by a native");
  });
});
