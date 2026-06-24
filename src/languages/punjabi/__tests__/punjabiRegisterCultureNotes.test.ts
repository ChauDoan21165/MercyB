// Punjabi register/culture note guards. These validate structure and scope,
// not native-level linguistic authority; native review is deferred.

import { describe, expect, it } from "vitest";

import {
  REGISTER_CULTURE_DISCLAIMER,
  TOPIC_ORDER,
  notes,
  notesByTopic,
  type PunjabiCefrLevel,
  type PunjabiRegisterCultureNote,
  type PunjabiRegisterTopic,
} from "@/languages/punjabi/registerCultureNotes";

const GURMUKHI_RANGE = /[\u0A00-\u0A7F]/;
const hasGurmukhi = (s: string) => GURMUKHI_RANGE.test(s);

const ALLOWED_LEVELS: PunjabiCefrLevel[] = ["A2", "B1", "B2", "C1", "C2"];

const REQUIRED_TOPICS: PunjabiRegisterTopic[] = [
  "respect",
  "elder_younger_address",
  "honorifics",
  "indirect_refusal",
  "softening",
  "apologies",
  "requests",
  "too_direct_phrasing",
  "family_community_context",
  "customer_service",
  "workplace_respect",
  "script_awareness",
];

describe("Punjabi register/culture notes — coverage", () => {
  it("contains 40-80 compact notes", () => {
    expect(notes.length).toBeGreaterThanOrEqual(40);
    expect(notes.length).toBeLessThanOrEqual(80);
  });

  it("uses levels A2-C2 only", () => {
    for (const note of notes) {
      expect(ALLOWED_LEVELS.includes(note.level), `${note.id} level`).toBe(true);
    }
  });

  it("covers every required topic", () => {
    const seen = new Set(notes.map((note) => note.topic));
    for (const topic of REQUIRED_TOPICS) {
      expect(seen.has(topic), `missing topic ${topic}`).toBe(true);
    }
  });

  it("TOPIC_ORDER matches required topics", () => {
    expect([...TOPIC_ORDER].sort()).toEqual([...REQUIRED_TOPICS].sort());
  });

  it("notesByTopic returns only matching notes", () => {
    for (const topic of REQUIRED_TOPICS) {
      const subset = notesByTopic(topic);
      expect(subset.length, topic).toBeGreaterThan(0);
      expect(subset.every((note) => note.topic === topic), topic).toBe(true);
    }
  });
});

describe("Punjabi register/culture notes — per-note integrity", () => {
  it("ids are unique and non-empty", () => {
    const ids = notes.map((note) => note.id);
    expect(ids.every((id) => id.length > 0)).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("each note has Vietnamese and English titles and explanations", () => {
    for (const note of notes) {
      expect(note.title_vi.length, `${note.id} title_vi`).toBeGreaterThan(0);
      expect(note.title_en.length, `${note.id} title_en`).toBeGreaterThan(0);
      expect(note.note_vi.length, `${note.id} note_vi`).toBeGreaterThan(0);
      expect(note.note_en.length, `${note.id} note_en`).toBeGreaterThan(0);
    }
  });

  it("each note has a safer Gurmukhi phrase with VI+EN meaning", () => {
    for (const note of notes) {
      expect(hasGurmukhi(note.safer_phrase.gurmukhi), `${note.id} safer phrase`).toBe(true);
      expect(note.safer_phrase.vi.length, `${note.id} safer vi`).toBeGreaterThan(0);
      expect(note.safer_phrase.en.length, `${note.id} safer en`).toBeGreaterThan(0);
    }
  });

  it("uses romanization where useful on most safer phrases", () => {
    const withRomanization = notes.filter((note) => note.safer_phrase.romanization).length;
    expect(withRomanization).toBeGreaterThanOrEqual(Math.floor(notes.length * 0.75));
  });

  it("avoid examples, when present, are bilingual and Gurmukhi-based", () => {
    for (const note of notes) {
      if (note.avoid) {
        expect(hasGurmukhi(note.avoid.gurmukhi), `${note.id} avoid Gurmukhi`).toBe(true);
        expect(note.avoid.vi.length, `${note.id} avoid vi`).toBeGreaterThan(0);
        expect(note.avoid.en.length, `${note.id} avoid en`).toBeGreaterThan(0);
      }
    }
  });

  it("includes a useful number of avoid contrasts", () => {
    const withAvoid = notes.filter((note) => note.avoid).length;
    expect(withAvoid).toBeGreaterThanOrEqual(8);
  });
});

describe("Punjabi register/culture notes — safe framing", () => {
  it("exposes bilingual deferred-review and no-stereotype framing", () => {
    expect(REGISTER_CULTURE_DISCLAIMER.vi.length).toBeGreaterThan(0);
    expect(REGISTER_CULTURE_DISCLAIMER.en.length).toBeGreaterThan(0);
    const en = REGISTER_CULTURE_DISCLAIMER.en.toLowerCase();
    expect(en).toContain("not native-certified");
    expect(en).toContain("native review is deferred");
    expect(en).toContain("not fixed traits");
  });

  it("mentions Shahmukhi only as script awareness", () => {
    const disclaimer = `${REGISTER_CULTURE_DISCLAIMER.vi} ${REGISTER_CULTURE_DISCLAIMER.en}`.toLowerCase();
    expect(disclaimer).toContain("shahmukhi");
    expect(disclaimer).toContain("awareness");
    expect(disclaimer).not.toContain("full shahmukhi course");
  });

  it("does not claim native review in note text", () => {
    const blob = JSON.stringify(notes).toLowerCase();
    expect(blob).not.toContain("native-reviewed");
    expect(blob).not.toContain("native-certified");
    expect(blob).not.toContain("certified by a native");
  });
});

const _typecheck: PunjabiRegisterCultureNote[] = notes;
void _typecheck;
