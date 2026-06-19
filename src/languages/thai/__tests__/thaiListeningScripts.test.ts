// src/languages/thai/__tests__/thaiListeningScripts.test.ts
//
// Structural + content guards for Thai listening-script practice data.
// Validates the WAVE2 brief: 30–60 scripts, all CEFR levels covered,
// Thai script everywhere, romanization on lower-level lines/vocab,
// Vietnamese + English explanations, listening goals, key vocab,
// questions, and an answer key.

import { describe, it, expect } from "vitest";
import {
  thaiListeningScripts,
  LOWER_LEVELS,
  type ThaiCefrLevel,
  type ThaiListeningTopic,
} from "../listeningScripts";

const THAI_RE = /[฀-๿]/;
const LATIN_RE = /[a-z]/i;

const ALL_LEVELS: ThaiCefrLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];

const REQUIRED_TOPICS: ThaiListeningTopic[] = [
  "slow_speech",
  "market",
  "taxi",
  "phone",
  "workplace",
  "announcement",
  "interview",
  "lecture_news",
];

describe("Thai listening scripts — batch", () => {
  it("has 30–60 scripts", () => {
    expect(thaiListeningScripts.length).toBeGreaterThanOrEqual(30);
    expect(thaiListeningScripts.length).toBeLessThanOrEqual(60);
  });

  it("has unique script ids", () => {
    const ids = thaiListeningScripts.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("covers every CEFR level A1–C2", () => {
    const seen = new Set(thaiListeningScripts.map((s) => s.level));
    for (const lvl of ALL_LEVELS) {
      expect(seen.has(lvl)).toBe(true);
    }
  });

  it("covers every required topic at least once", () => {
    const seen = new Set(thaiListeningScripts.map((s) => s.topic));
    for (const t of REQUIRED_TOPICS) {
      expect(seen.has(t)).toBe(true);
    }
  });
});

describe("Thai listening scripts — per-script content", () => {
  for (const s of thaiListeningScripts) {
    describe(s.id, () => {
      const isLower = LOWER_LEVELS.includes(s.level);

      it("has bilingual titles and listening goals", () => {
        expect(s.title_en.trim().length).toBeGreaterThan(0);
        expect(s.title_vi.trim().length).toBeGreaterThan(0);
        expect(s.goal_en.trim().length).toBeGreaterThan(0);
        expect(s.goal_vi.trim().length).toBeGreaterThan(0);
      });

      it("has at least 2 script lines, each in Thai with vi + en", () => {
        expect(s.script.length).toBeGreaterThanOrEqual(2);
        for (const line of s.script) {
          expect(THAI_RE.test(line.th)).toBe(true);
          expect(line.en.trim().length).toBeGreaterThan(0);
          expect(line.vi.trim().length).toBeGreaterThan(0);
        }
      });

      it("includes romanization on every line for lower levels (A1/A2/B1)", () => {
        if (!isLower) return;
        for (const line of s.script) {
          expect(line.rtgs && LATIN_RE.test(line.rtgs)).toBeTruthy();
        }
      });

      it("has key vocab with Thai + vi + en", () => {
        expect(s.key_vocab.length).toBeGreaterThanOrEqual(2);
        for (const v of s.key_vocab) {
          expect(THAI_RE.test(v.th)).toBe(true);
          expect(v.en.trim().length).toBeGreaterThan(0);
          expect(v.vi.trim().length).toBeGreaterThan(0);
          if (isLower) {
            expect(v.rtgs && LATIN_RE.test(v.rtgs)).toBeTruthy();
          }
        }
      });

      it("has questions, each with a vi + en answer key", () => {
        expect(s.questions.length).toBeGreaterThanOrEqual(1);
        for (const q of s.questions) {
          expect(q.q_en.trim().length).toBeGreaterThan(0);
          expect(q.q_vi.trim().length).toBeGreaterThan(0);
          expect(q.answer_en.trim().length).toBeGreaterThan(0);
          expect(q.answer_vi.trim().length).toBeGreaterThan(0);
        }
      });
    });
  }
});
