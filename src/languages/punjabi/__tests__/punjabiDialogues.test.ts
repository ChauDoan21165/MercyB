// src/languages/punjabi/__tests__/punjabiDialogues.test.ts
//
// Guards the Punjabi dialogue/roleplay batch.

import { describe, expect, it } from "vitest";

import {
  PUNJABI_DIALOGUE_SCRIPT_NOTE,
  PUNJABI_DIALOGUE_TOPICS,
  punjabiDialogues,
  type PunjabiDialogueTopic,
} from "../dialogues";

const GURMUKHI = /[\u0A00-\u0A7F]/;
const SHAHMUKHI = /[\u0600-\u06FF]/;
const CJK = /[\u4E00-\u9FFF]/;
const HANGUL = /[\uAC00-\uD7AF]/;
const KANA = /[\u3040-\u30FF]/;
const CYRILLIC = /[\u0400-\u04FF]/;

const VALID_LEVELS = new Set(["A1", "A2", "B1", "B2", "C1", "C2"]);
const REQUIRED_TOPICS: PunjabiDialogueTopic[] = [
  "greetings",
  "family",
  "food",
  "shopping",
  "transit",
  "phone",
  "clinic",
  "school",
  "workplace",
  "public_office",
];

function allStrings(): string[] {
  const out: string[] = [];
  const walk = (v: unknown): void => {
    if (typeof v === "string") out.push(v);
    else if (Array.isArray(v)) v.forEach(walk);
    else if (v && typeof v === "object") Object.values(v).forEach(walk);
  };
  walk(punjabiDialogues);
  walk(PUNJABI_DIALOGUE_SCRIPT_NOTE);
  return out;
}

describe("Punjabi dialogues - batch shape", () => {
  it("ships 30-60 compact dialogues", () => {
    expect(punjabiDialogues.length).toBeGreaterThanOrEqual(30);
    expect(punjabiDialogues.length).toBeLessThanOrEqual(60);
  });

  it("has unique ids and valid CEFR levels", () => {
    const ids = punjabiDialogues.map((d) => d.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const d of punjabiDialogues) expect(VALID_LEVELS.has(d.level)).toBe(true);
  });

  it("spans beginner through advanced roleplay levels", () => {
    const levels = new Set(punjabiDialogues.map((d) => d.level));
    expect(levels.has("A1")).toBe(true);
    expect(levels.has("B1")).toBe(true);
    expect(levels.has("C1")).toBe(true);
  });
});

describe("Punjabi dialogues - topic coverage", () => {
  it("covers all required Wave 2 topics", () => {
    const present = new Set(punjabiDialogues.map((d) => d.topic));
    for (const t of REQUIRED_TOPICS) expect(present.has(t)).toBe(true);
  });

  it("topic constant lists exactly the required topics", () => {
    expect(new Set(PUNJABI_DIALOGUE_TOPICS)).toEqual(new Set(REQUIRED_TOPICS));
  });
});

describe("Punjabi dialogues - Gurmukhi, romanization, VI, EN", () => {
  it("every dialogue line uses Gurmukhi primary with romanization", () => {
    for (const d of punjabiDialogues) {
      expect(d.lines.length).toBeGreaterThan(0);
      for (const line of d.lines) {
        expect(line.gurmukhi).toMatch(GURMUKHI);
        expect(line.romanization.length).toBeGreaterThan(0);
        expect(line.speaker.length).toBeGreaterThan(0);
      }
    }
  });

  it("every line and title has Vietnamese and English text", () => {
    for (const d of punjabiDialogues) {
      expect(d.title_vi.length).toBeGreaterThan(0);
      expect(d.title_en.length).toBeGreaterThan(0);
      for (const line of d.lines) {
        expect(line.vi.length).toBeGreaterThan(0);
        expect(line.en.length).toBeGreaterThan(0);
      }
    }
  });

  it("every dialogue has learner goals, useful phrases, and a common mistake", () => {
    for (const d of punjabiDialogues) {
      expect(d.learner_goal_vi.length).toBeGreaterThan(0);
      expect(d.learner_goal_en.length).toBeGreaterThan(0);
      expect(d.useful_phrases.length).toBeGreaterThanOrEqual(2);
      for (const phrase of d.useful_phrases) {
        expect(phrase.gurmukhi).toMatch(GURMUKHI);
        expect(phrase.romanization.length).toBeGreaterThan(0);
        expect(phrase.vi.length).toBeGreaterThan(0);
        expect(phrase.en.length).toBeGreaterThan(0);
      }
      expect(d.common_mistake.vi.length).toBeGreaterThan(0);
      expect(d.common_mistake.en.length).toBeGreaterThan(0);
    }
  });
});

describe("Punjabi dialogues - script scope and unrelated scripts", () => {
  const strings = allStrings();

  it("mentions Shahmukhi only as awareness text, without Shahmukhi script content", () => {
    expect(PUNJABI_DIALOGUE_SCRIPT_NOTE.vi.toLowerCase()).toContain("shahmukhi");
    expect(PUNJABI_DIALOGUE_SCRIPT_NOTE.en.toLowerCase()).toContain("awareness");
    for (const s of strings) expect(s).not.toMatch(SHAHMUKHI);
  });

  it("contains no unrelated CJK, Hangul, kana, or Cyrillic script", () => {
    for (const s of strings) {
      expect(s).not.toMatch(CJK);
      expect(s).not.toMatch(HANGUL);
      expect(s).not.toMatch(KANA);
      expect(s).not.toMatch(CYRILLIC);
    }
  });
});
