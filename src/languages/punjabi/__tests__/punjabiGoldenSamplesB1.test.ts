import { describe, expect, it } from "vitest";
import {
  punjabiB1GoldenSamples,
  type PunjabiB1GoldenSampleFocus,
  type PunjabiGoldenSampleLine,
} from "../goldenSamplesB1";

const GURMUKHI_RE = /[\u0A00-\u0A7F]/;
const LATIN_RE = /[a-z]/i;

const REQUIRED_FOCUSES: PunjabiB1GoldenSampleFocus[] = [
  "explain_situation",
  "retell_event",
  "ask_clarification",
  "polite_complaint",
  "service_conversation",
  "workplace_task",
  "housing_school_community",
  "register_readiness",
];

function expectLine(line: PunjabiGoldenSampleLine) {
  expect(GURMUKHI_RE.test(line.pa)).toBe(true);
  expect(LATIN_RE.test(line.romanization)).toBe(true);
  expect(line.en.trim().length).toBeGreaterThan(0);
  expect(line.vi.trim().length).toBeGreaterThan(0);
}

describe("Punjabi B1 golden samples - batch", () => {
  it("has a compact useful golden sample set", () => {
    expect(punjabiB1GoldenSamples.length).toBeGreaterThanOrEqual(8);
    expect(punjabiB1GoldenSamples.length).toBeLessThanOrEqual(12);
  });

  it("has unique ids and marks every sample B1", () => {
    const ids = punjabiB1GoldenSamples.map((sample) => sample.id);
    expect(new Set(ids).size).toBe(ids.length);

    for (const sample of punjabiB1GoldenSamples) {
      expect(sample.level).toBe("B1");
    }
  });

  it("covers required golden sample focus areas", () => {
    const seen = new Set(punjabiB1GoldenSamples.map((sample) => sample.focus));

    for (const focus of REQUIRED_FOCUSES) {
      expect(seen.has(focus)).toBe(true);
    }
  });
});

describe("Punjabi B1 golden samples - learner content", () => {
  for (const sample of punjabiB1GoldenSamples) {
    describe(sample.id, () => {
      it("has bilingual final-QA framing and Canada-practical context", () => {
        expect(sample.title_en.trim().length).toBeGreaterThan(0);
        expect(sample.title_vi.trim().length).toBeGreaterThan(0);
        expect(sample.scenario_en.trim().length).toBeGreaterThan(0);
        expect(sample.scenario_vi.trim().length).toBeGreaterThan(0);
        expect(sample.canadaContext.trim().length).toBeGreaterThan(0);
      });

      it("has useful Gurmukhi language and a golden answer", () => {
        expect(sample.usefulLanguage.length).toBeGreaterThanOrEqual(3);

        for (const phrase of sample.usefulLanguage) {
          expectLine(phrase);
        }

        expect(sample.qa.finalPrompt_en.trim().length).toBeGreaterThan(0);
        expect(sample.qa.finalPrompt_vi.trim().length).toBeGreaterThan(0);
        expectLine(sample.qa.sampleAnswer);
      });

      it("explains why each sample works in English and Vietnamese", () => {
        expect(sample.qa.whyItWorks_en.length).toBeGreaterThanOrEqual(3);
        expect(sample.qa.whyItWorks_vi.length).toBe(sample.qa.whyItWorks_en.length);
      });

      it("includes common learner traps and integration readiness", () => {
        expect(sample.commonTraps.length).toBeGreaterThanOrEqual(1);

        for (const trap of sample.commonTraps) {
          expect(trap.trap_en.trim().length).toBeGreaterThan(0);
          expect(trap.trap_vi.trim().length).toBeGreaterThan(0);
          expectLine(trap.better);
        }

        expect(sample.integrationReadiness_en.trim().length).toBeGreaterThan(0);
        expect(sample.integrationReadiness_vi.trim().length).toBeGreaterThan(0);
      });

      it("keeps public-service examples as language support only", () => {
        if (sample.focus !== "ask_clarification") return;

        expect(`${sample.scenario_en} ${sample.canadaContext}`).toMatch(
          /language support only|language practice only/i,
        );
        expect(`${sample.scenario_vi} ${sample.canadaContext}`).toMatch(
          /Chỉ hỗ trợ ngôn ngữ|luyện ngôn ngữ/i,
        );
      });
    });
  }
});

describe("Punjabi B1 golden samples - scope guardrails", () => {
  it("mentions Shahmukhi only as awareness and defers native review", () => {
    const serialized = JSON.stringify(punjabiB1GoldenSamples);

    expect(serialized).toMatch(/Shahmukhi/);
    expect(serialized).toMatch(/awareness/);
    expect(serialized).toMatch(/Native review is deferred/i);
  });
});
