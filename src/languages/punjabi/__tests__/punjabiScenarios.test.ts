import { describe, expect, it } from "vitest";
import {
  punjabiScenarios,
  type PunjabiCefrLevel,
  type PunjabiScenarioTopic,
  type PunjabiUtterance,
} from "../scenarios";

const GURMUKHI_RE = /[\u0A00-\u0A7F]/;
const LATIN_RE = /[a-z]/i;

const ALL_LEVELS: PunjabiCefrLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];

const REQUIRED_TOPICS: PunjabiScenarioTopic[] = [
  "market",
  "restaurant",
  "taxi_transit",
  "housing",
  "hospital",
  "pharmacy",
  "police_help",
  "immigration_public_office",
  "school",
  "workplace",
  "bank",
  "phone",
  "complaint",
  "meeting",
];

const LEGAL_OR_MEDICAL_TOPICS: PunjabiScenarioTopic[] = [
  "hospital",
  "pharmacy",
  "police_help",
  "immigration_public_office",
];

function expectUtterance(utterance: PunjabiUtterance) {
  expect(GURMUKHI_RE.test(utterance.pa)).toBe(true);
  expect(LATIN_RE.test(utterance.romanization)).toBe(true);
  expect(utterance.en.trim().length).toBeGreaterThan(0);
  expect(utterance.vi.trim().length).toBeGreaterThan(0);
}

describe("Punjabi scenarios - batch", () => {
  it("has 40-80 compact scenarios", () => {
    expect(punjabiScenarios.length).toBeGreaterThanOrEqual(40);
    expect(punjabiScenarios.length).toBeLessThanOrEqual(80);
  });

  it("has unique scenario ids", () => {
    const ids = punjabiScenarios.map((scenario) => scenario.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("covers every CEFR level", () => {
    const seen = new Set(punjabiScenarios.map((scenario) => scenario.level));

    for (const level of ALL_LEVELS) {
      expect(seen.has(level)).toBe(true);
    }
  });

  it("covers every required practical topic", () => {
    const seen = new Set(punjabiScenarios.map((scenario) => scenario.topic));

    for (const topic of REQUIRED_TOPICS) {
      expect(seen.has(topic)).toBe(true);
    }
  });
});

describe("Punjabi scenarios - learner content", () => {
  for (const scenario of punjabiScenarios) {
    describe(scenario.id, () => {
      it("has bilingual title, situation, and learner goal", () => {
        expect(scenario.title_en.trim().length).toBeGreaterThan(0);
        expect(scenario.title_vi.trim().length).toBeGreaterThan(0);
        expect(scenario.situation_en.trim().length).toBeGreaterThan(0);
        expect(scenario.situation_vi.trim().length).toBeGreaterThan(0);
        expect(scenario.goal_en.trim().length).toBeGreaterThan(0);
        expect(scenario.goal_vi.trim().length).toBeGreaterThan(0);
      });

      it("has phrases with Gurmukhi, romanization, vi, and en", () => {
        expect(scenario.phrases.length).toBeGreaterThanOrEqual(2);

        for (const phrase of scenario.phrases) {
          expectUtterance(phrase);
        }
      });

      it("has a model response and escalation phrase", () => {
        expectUtterance(scenario.modelResponse);
        expectUtterance(scenario.escalationPhrase);
      });

      it("has cultural or register notes in English and Vietnamese", () => {
        expect(scenario.note_en.trim().length).toBeGreaterThan(0);
        expect(scenario.note_vi.trim().length).toBeGreaterThan(0);
      });

      it("marks legal and medical topics as language support only", () => {
        if (!LEGAL_OR_MEDICAL_TOPICS.includes(scenario.topic)) return;

        expect(scenario.note_en).toMatch(/Language support only/);
        expect(scenario.note_vi).toMatch(/Chỉ hỗ trợ ngôn ngữ/);
      });
    });
  }
});
