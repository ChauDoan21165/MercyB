// src/languages/punjabi/__tests__/punjabiVocabScriptBasics.test.ts
//
// Structural guards for Punjabi vocabulary + Gurmukhi basics.
// These tests do not assert native-level linguistic review; that is deferred.

import { describe, expect, it } from "vitest";

import {
  PUNJABI_VOCABULARY,
  type PunjabiVocabEntry,
} from "@/languages/punjabi/vocabulary";
import {
  GURMUKHI_COMMON_LETTERS,
  GURMUKHI_OVERVIEW,
  GURMUKHI_STARTER_NOTES,
  GURMUKHI_VOWEL_SIGNS,
} from "@/languages/punjabi/scriptBasics";

const GURMUKHI_RANGE = /[\u0A00-\u0A7F]/;
const LEVELS = new Set(["A1", "A2", "B1"]);
const TOPICS = new Set([
  "greetings",
  "pronouns",
  "numbers",
  "time",
  "family",
  "food",
  "verbs",
  "adjectives",
  "questions",
  "places",
]);

describe("Punjabi vocabulary", () => {
  it("has 200-400 compact entries", () => {
    expect(PUNJABI_VOCABULARY.length).toBeGreaterThanOrEqual(200);
    expect(PUNJABI_VOCABULARY.length).toBeLessThanOrEqual(400);
  });

  it("uses Gurmukhi primary with romanization plus VI and EN glosses", () => {
    for (const entry of PUNJABI_VOCABULARY) {
      expect(GURMUKHI_RANGE.test(entry.gurmukhi), `Gurmukhi: ${entry.gurmukhi}`).toBe(true);
      expect(entry.romanization.trim().length, `romanization for ${entry.gurmukhi}`).toBeGreaterThan(0);
      expect(entry.vi.trim().length, `vi for ${entry.gurmukhi}`).toBeGreaterThan(0);
      expect(entry.en.trim().length, `en for ${entry.gurmukhi}`).toBeGreaterThan(0);
    }
  });

  it("assigns every entry a known topic and level", () => {
    for (const entry of PUNJABI_VOCABULARY) {
      expect(TOPICS.has(entry.topic), `topic ${entry.topic}`).toBe(true);
      expect(LEVELS.has(entry.level), `level ${entry.level}`).toBe(true);
    }
  });

  it("keeps Gurmukhi headwords unique", () => {
    const seen = new Set<string>();
    for (const entry of PUNJABI_VOCABULARY) {
      expect(seen.has(entry.gurmukhi), `duplicate headword: ${entry.gurmukhi}`).toBe(false);
      seen.add(entry.gurmukhi);
    }
  });

  it("covers the core beginner topic spread", () => {
    const used = new Set<PunjabiVocabEntry["topic"]>(PUNJABI_VOCABULARY.map((entry) => entry.topic));
    expect(used).toEqual(TOPICS);
  });
});

describe("Gurmukhi script basics", () => {
  it("has bilingual overview notes for direction and basic script behavior", () => {
    expect(GURMUKHI_OVERVIEW.vi).toMatch(/trái sang phải/);
    expect(GURMUKHI_OVERVIEW.en).toMatch(/left to right/);
    expect(GURMUKHI_OVERVIEW.vi.length).toBeGreaterThan(80);
    expect(GURMUKHI_OVERVIEW.en.length).toBeGreaterThan(80);
  });

  it("includes common Gurmukhi letters with examples", () => {
    expect(GURMUKHI_COMMON_LETTERS.length).toBeGreaterThanOrEqual(20);
    for (const letter of GURMUKHI_COMMON_LETTERS) {
      expect(GURMUKHI_RANGE.test(letter.gurmukhi)).toBe(true);
      expect(GURMUKHI_RANGE.test(letter.example)).toBe(true);
      expect(letter.romanization.trim().length).toBeGreaterThan(0);
      expect(letter.vi.trim().length).toBeGreaterThan(0);
      expect(letter.en.trim().length).toBeGreaterThan(0);
    }
  });

  it("includes vowel signs with placement examples", () => {
    expect(GURMUKHI_VOWEL_SIGNS.length).toBeGreaterThanOrEqual(8);
    for (const vowel of GURMUKHI_VOWEL_SIGNS) {
      expect(GURMUKHI_RANGE.test(vowel.sign)).toBe(true);
      expect(GURMUKHI_RANGE.test(vowel.example)).toBe(true);
      expect(vowel.vi.trim().length).toBeGreaterThan(0);
      expect(vowel.en.trim().length).toBeGreaterThan(0);
    }
  });

  it("has starter notes for direction, vowels, letters, signs, pronunciation awareness, and Shahmukhi awareness", () => {
    const kinds = new Set(GURMUKHI_STARTER_NOTES.map((note) => note.kind));
    expect(kinds.has("direction")).toBe(true);
    expect(kinds.has("letters")).toBe(true);
    expect(kinds.has("vowels")).toBe(true);
    expect(kinds.has("signs")).toBe(true);
    expect(kinds.has("pronunciation_awareness")).toBe(true);
    expect(kinds.has("shahmukhi_awareness")).toBe(true);

    for (const note of GURMUKHI_STARTER_NOTES) {
      expect(note.title_vi.trim().length).toBeGreaterThan(0);
      expect(note.title_en.trim().length).toBeGreaterThan(0);
      expect(note.explanation_vi.trim().length).toBeGreaterThan(20);
      expect(note.explanation_en.trim().length).toBeGreaterThan(20);
    }
  });

  it("keeps Shahmukhi as awareness only, not a full course", () => {
    const shahmukhiNotes = GURMUKHI_STARTER_NOTES.filter((note) => note.kind === "shahmukhi_awareness");
    expect(shahmukhiNotes.length).toBe(1);
    const blob = `${shahmukhiNotes[0].explanation_vi} ${shahmukhiNotes[0].explanation_en}`.toLowerCase();
    expect(blob).toMatch(/not a full shahmukhi course|không phải khóa shahmukhi đầy đủ/);
  });

  it("states the no audio and no pronunciation-scoring scope", () => {
    const blob = GURMUKHI_STARTER_NOTES.map((note) => `${note.explanation_vi} ${note.explanation_en}`).join(" ").toLowerCase();
    expect(blob).toMatch(/no pronunciation scoring|không chấm phát âm/);
  });
});
