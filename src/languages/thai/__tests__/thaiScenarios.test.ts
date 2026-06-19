// src/languages/thai/__tests__/thaiScenarios.test.ts
//
// Structural + content guards for Thai scenario packs.
// Validates the WAVE3 brief: 40–80 scenarios, all CEFR levels, all required
// topics, Thai script + romanization on every utterance, Vietnamese + English
// guidance, and the required parts: situation, learner goal, phrases, model
// response, escalation phrase, and a cultural/register note.

import { describe, it, expect } from "vitest";
import {
  thaiScenarios,
  type ThaiCefrLevel,
  type ThaiScenarioTopic,
} from "../scenarios";

const THAI_RE = /[฀-๿]/;
const LATIN_RE = /[a-z]/i;

const ALL_LEVELS: ThaiCefrLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];

const REQUIRED_TOPICS: ThaiScenarioTopic[] = [
  "market",
  "restaurant",
  "taxi",
  "hotel",
  "hospital",
  "pharmacy",
  "police",
  "immigration",
  "school",
  "workplace",
  "neighbor",
  "bank",
  "phone",
  "complaint",
  "meeting",
];

/** Asserts a Thai utterance has script, romanization, and both explanations. */
function expectUtterance(u: { th: string; rtgs: string; en: string; vi: string }) {
  expect(THAI_RE.test(u.th)).toBe(true);
  expect(u.rtgs && LATIN_RE.test(u.rtgs)).toBeTruthy();
  expect(u.en.trim().length).toBeGreaterThan(0);
  expect(u.vi.trim().length).toBeGreaterThan(0);
}

describe("Thai scenarios — batch", () => {
  it("has 40–80 scenarios", () => {
    expect(thaiScenarios.length).toBeGreaterThanOrEqual(40);
    expect(thaiScenarios.length).toBeLessThanOrEqual(80);
  });

  it("has unique scenario ids", () => {
    const ids = thaiScenarios.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("covers every CEFR level A1–C2", () => {
    const seen = new Set(thaiScenarios.map((s) => s.level));
    for (const lvl of ALL_LEVELS) {
      expect(seen.has(lvl)).toBe(true);
    }
  });

  it("covers every required topic at least once", () => {
    const seen = new Set(thaiScenarios.map((s) => s.topic));
    for (const t of REQUIRED_TOPICS) {
      expect(seen.has(t)).toBe(true);
    }
  });
});

describe("Thai scenarios — per-scenario content", () => {
  for (const s of thaiScenarios) {
    describe(s.id, () => {
      it("has bilingual title, situation, and learner goal", () => {
        expect(s.title_en.trim().length).toBeGreaterThan(0);
        expect(s.title_vi.trim().length).toBeGreaterThan(0);
        expect(s.situation_en.trim().length).toBeGreaterThan(0);
        expect(s.situation_vi.trim().length).toBeGreaterThan(0);
        expect(s.goal_en.trim().length).toBeGreaterThan(0);
        expect(s.goal_vi.trim().length).toBeGreaterThan(0);
      });

      it("has at least 2 phrases, each Thai + romanization + vi + en", () => {
        expect(s.phrases.length).toBeGreaterThanOrEqual(2);
        for (const p of s.phrases) expectUtterance(p);
      });

      it("has a full model response utterance", () => {
        expectUtterance(s.model_response);
      });

      it("has an escalation phrase utterance", () => {
        expectUtterance(s.escalation);
      });

      it("has a cultural/register note in vi + en", () => {
        expect(s.note_en.trim().length).toBeGreaterThan(0);
        expect(s.note_vi.trim().length).toBeGreaterThan(0);
      });
    });
  }
});
