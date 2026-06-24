import {
  punjabiB1SealSamples,
  type PunjabiB1SealFocus,
  type PunjabiSealLine,
} from "../b1SealSamples";

const requiredFocuses: PunjabiB1SealFocus[] = [
  "situation_explanation",
  "event_retelling",
  "clarification",
  "service_recovery",
  "issue_resolution",
  "follow_up_message",
  "workplace_task",
  "housing_school_community",
  "register_safe_repair",
];

const hasGurmukhi = (text: string) => /[\u0A00-\u0A7F]/u.test(text);
const hasLatin = (text: string) => /[A-Za-z]/.test(text);

const expectLine = (line: PunjabiSealLine) => {
  expect(line.pa).toBeTruthy();
  expect(hasGurmukhi(line.pa)).toBe(true);
  expect(line.romanization).toBeTruthy();
  expect(hasLatin(line.romanization)).toBe(true);
  expect(line.en).toBeTruthy();
  expect(line.vi).toBeTruthy();
};

describe("punjabiB1SealSamples", () => {
  it("is a compact app-consumable B1 seal set with unique ids", () => {
    expect(punjabiB1SealSamples.length).toBeGreaterThanOrEqual(8);
    expect(punjabiB1SealSamples.length).toBeLessThanOrEqual(12);
    expect(new Set(punjabiB1SealSamples.map((card) => card.id)).size).toBe(
      punjabiB1SealSamples.length,
    );
    expect(punjabiB1SealSamples.every((card) => card.level === "B1")).toBe(true);
  });

  it("covers every Wave 52 seal focus", () => {
    const actualFocuses = new Set(punjabiB1SealSamples.map((card) => card.focus));

    for (const focus of requiredFocuses) {
      expect(actualFocuses.has(focus)).toBe(true);
    }
  });

  it("keeps guardrail and awareness language visible", () => {
    const serializedCards = JSON.stringify(punjabiB1SealSamples);

    expect(serializedCards).toContain("Language practice only");
    expect(serializedCards).toContain("not medical advice");
    expect(serializedCards).toContain("not legal or financial advice");
    expect(serializedCards).toContain("Shahmukhi");
    expect(serializedCards).toContain("awareness only");
    expect(serializedCards).toContain("Native review is deferred");
  });

  it.each(punjabiB1SealSamples)(
    "$id includes bilingual scenario text and Canada-practical context",
    (card) => {
      expect(card.title_en).toBeTruthy();
      expect(card.title_vi).toBeTruthy();
      expect(card.scenario_en).toBeTruthy();
      expect(card.scenario_vi).toBeTruthy();
      expect(card.canadaContext).toMatch(/Canada|Canadian/i);
    },
  );

  it.each(punjabiB1SealSamples)(
    "$id includes seal lines with Gurmukhi and romanization",
    (card) => {
      expectLine(card.preA11SealCheck.sampleLine);
      expect(card.preA11SealCheck.sealPrompt_en).toBeTruthy();
      expect(card.preA11SealCheck.sealPrompt_vi).toBeTruthy();
      expect(card.preA11SealCheck.sealSignals_en.length).toBeGreaterThanOrEqual(3);
      expect(card.preA11SealCheck.sealSignals_vi).toHaveLength(
        card.preA11SealCheck.sealSignals_en.length,
      );
    },
  );

  it.each(punjabiB1SealSamples)(
    "$id includes common learner traps and better alternatives",
    (card) => {
      expect(card.commonTraps.length).toBeGreaterThanOrEqual(1);

      for (const trap of card.commonTraps) {
        expect(trap.trap_en).toBeTruthy();
        expect(trap.trap_vi).toBeTruthy();
        expectLine(trap.better);
      }
    },
  );

  it.each(punjabiB1SealSamples)(
    "$id includes pre-seal, runner-readiness, pipeline-readiness, and pre-integration guidance",
    (card) => {
      expect(card.runnerReadinessNote_en).toMatch(
        /pre-A11 seal|runner-readiness|pipeline-readiness|practice|Shahmukhi|Native review/i,
      );
      expect(card.runnerReadinessNote_vi).toBeTruthy();
      expect(card.preIntegrationRoute_en).toMatch(
        /route|pre-integration|integration|seal|stable/i,
      );
      expect(card.preIntegrationRoute_vi).toBeTruthy();
    },
  );
});
