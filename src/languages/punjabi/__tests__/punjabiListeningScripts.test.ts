import { describe, expect, it } from "vitest";
import {
  punjabiListeningScripts,
  type PunjabiCefrLevel,
  type PunjabiListeningTopic,
} from "../listeningScripts";

const GURMUKHI_RE = /[\u0A00-\u0A7F]/;
const LATIN_RE = /[a-z]/i;

const ALL_LEVELS: PunjabiCefrLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];

const REQUIRED_TOPICS: PunjabiListeningTopic[] = [
  "greetings",
  "market",
  "transit",
  "phone",
  "workplace",
  "appointment",
  "public_service",
  "housing",
  "health",
  "school",
];

describe("Punjabi listening scripts - batch", () => {
  it("has 30-60 text-only listening scripts", () => {
    expect(punjabiListeningScripts.length).toBeGreaterThanOrEqual(30);
    expect(punjabiListeningScripts.length).toBeLessThanOrEqual(60);
  });

  it("has unique script ids", () => {
    const ids = punjabiListeningScripts.map((script) => script.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("covers every CEFR level", () => {
    const seen = new Set(punjabiListeningScripts.map((script) => script.level));

    for (const level of ALL_LEVELS) {
      expect(seen.has(level)).toBe(true);
    }
  });

  it("covers required listening contexts", () => {
    const seen = new Set(punjabiListeningScripts.map((script) => script.topic));

    for (const topic of REQUIRED_TOPICS) {
      expect(seen.has(topic)).toBe(true);
    }
  });
});

describe("Punjabi listening scripts - learner content", () => {
  for (const script of punjabiListeningScripts) {
    describe(script.id, () => {
      it("has bilingual titles and listening goals", () => {
        expect(script.title_en.trim().length).toBeGreaterThan(0);
        expect(script.title_vi.trim().length).toBeGreaterThan(0);
        expect(script.goal_en.trim().length).toBeGreaterThan(0);
        expect(script.goal_vi.trim().length).toBeGreaterThan(0);
      });

      it("has a Gurmukhi transcript with romanization plus vi and en", () => {
        expect(script.transcript.length).toBeGreaterThanOrEqual(2);

        for (const line of script.transcript) {
          expect(GURMUKHI_RE.test(line.pa)).toBe(true);
          expect(LATIN_RE.test(line.romanization)).toBe(true);
          expect(line.en.trim().length).toBeGreaterThan(0);
          expect(line.vi.trim().length).toBeGreaterThan(0);
        }
      });

      it("has key phrases with Gurmukhi, romanization, vi, and en", () => {
        expect(script.keyPhrases.length).toBeGreaterThanOrEqual(2);

        for (const phrase of script.keyPhrases) {
          expect(GURMUKHI_RE.test(phrase.pa)).toBe(true);
          expect(LATIN_RE.test(phrase.romanization)).toBe(true);
          expect(phrase.en.trim().length).toBeGreaterThan(0);
          expect(phrase.vi.trim().length).toBeGreaterThan(0);
        }
      });

      it("has comprehension questions with bilingual answer keys", () => {
        expect(script.questions.length).toBeGreaterThanOrEqual(1);

        for (const question of script.questions) {
          expect(question.q_en.trim().length).toBeGreaterThan(0);
          expect(question.q_vi.trim().length).toBeGreaterThan(0);
          expect(question.answer_en.trim().length).toBeGreaterThan(0);
          expect(question.answer_vi.trim().length).toBeGreaterThan(0);
        }
      });

      it("explains likely confusion in English and Vietnamese", () => {
        expect(script.likelyConfusion_en.trim().length).toBeGreaterThan(0);
        expect(script.likelyConfusion_vi.trim().length).toBeGreaterThan(0);
      });
    });
  }
});
