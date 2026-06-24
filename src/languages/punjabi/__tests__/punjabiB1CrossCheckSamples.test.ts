import {
  punjabiB1CrossCheckSamples,
  type PunjabiB1CrossCheckFocus,
  type PunjabiCrossCheckLine,
} from "../b1CrossCheckSamples";

const requiredFocuses: PunjabiB1CrossCheckFocus[] = [
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

const expectLine = (line: PunjabiCrossCheckLine) => {
  expect(line.pa).toBeTruthy();
  expect(hasGurmukhi(line.pa)).toBe(true);
  expect(line.romanization).toBeTruthy();
  expect(hasLatin(line.romanization)).toBe(true);
  expect(line.en).toBeTruthy();
  expect(line.vi).toBeTruthy();
};

describe("punjabiB1CrossCheckSamples", () => {
  it("is a compact app-consumable B1 cross-check set with unique ids", () => {
    expect(punjabiB1CrossCheckSamples.length).toBeGreaterThanOrEqual(8);
    expect(punjabiB1CrossCheckSamples.length).toBeLessThanOrEqual(12);
    expect(
      new Set(punjabiB1CrossCheckSamples.map((card) => card.id)).size,
    ).toBe(punjabiB1CrossCheckSamples.length);
    expect(punjabiB1CrossCheckSamples.every((card) => card.level === "B1")).toBe(true);
  });

  it("covers every Wave 34 cross-check focus", () => {
    const actualFocuses = new Set(
      punjabiB1CrossCheckSamples.map((card) => card.focus),
    );
    for (const focus of requiredFocuses) {
      expect(actualFocuses.has(focus)).toBe(true);
    }
  });

  it("keeps guardrail and awareness language visible", () => {
    const serializedCards = JSON.stringify(punjabiB1CrossCheckSamples);

    expect(serializedCards).toContain("Language practice only");
    expect(serializedCards).toContain("not medical advice");
    expect(serializedCards).toContain("not legal or financial advice");
    expect(serializedCards).toContain("Shahmukhi");
    expect(serializedCards).toContain("awareness only");
    expect(serializedCards).toContain("Native review is deferred");
  });

  it.each(punjabiB1CrossCheckSamples)(
    "$id includes bilingual scenario text and Canada-practical context",
    (card) => {
      expect(card.title_en).toBeTruthy();
      expect(card.title_vi).toBeTruthy();
      expect(card.scenario_en).toBeTruthy();
      expect(card.scenario_vi).toBeTruthy();
      expect(card.canadaContext).toMatch(/Canada|Canadian/i);
    },
  );

  it.each(punjabiB1CrossCheckSamples)(
    "$id includes cross-check lines with Gurmukhi and romanization",
    (card) => {
      expectLine(card.crossCheck.sampleLine);
      expect(card.crossCheck.crossCheckPrompt_en).toBeTruthy();
      expect(card.crossCheck.crossCheckPrompt_vi).toBeTruthy();
      expect(card.crossCheck.verificationSignals_en.length).toBeGreaterThanOrEqual(3);
      expect(card.crossCheck.verificationSignals_vi).toHaveLength(
        card.crossCheck.verificationSignals_en.length,
      );
    },
  );

  it.each(punjabiB1CrossCheckSamples)(
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

  it.each(punjabiB1CrossCheckSamples)(
    "$id includes verification and pre-integration guidance",
    (card) => {
      expect(card.preIntegrationNote_en).toMatch(
        /cross-check|verification|pre-integration|practice|Shahmukhi|Native review/i,
      );
      expect(card.preIntegrationNote_vi).toBeTruthy();
      expect(card.verificationRoute_en).toMatch(
        /route|verification|pre-integration|integration|final-regression/i,
      );
      expect(card.verificationRoute_vi).toBeTruthy();
    },
  );
});
