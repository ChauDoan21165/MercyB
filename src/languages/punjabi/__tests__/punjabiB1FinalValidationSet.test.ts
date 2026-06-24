import {
  punjabiB1FinalValidationSet,
  type PunjabiB1FinalValidationFocus,
  type PunjabiFinalValidationLine,
} from "../b1FinalValidationSet";

const requiredFocuses: PunjabiB1FinalValidationFocus[] = [
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

const expectLine = (line: PunjabiFinalValidationLine) => {
  expect(line.pa).toBeTruthy();
  expect(hasGurmukhi(line.pa)).toBe(true);
  expect(line.romanization).toBeTruthy();
  expect(hasLatin(line.romanization)).toBe(true);
  expect(line.en).toBeTruthy();
  expect(line.vi).toBeTruthy();
};

describe("punjabiB1FinalValidationSet", () => {
  it("is a compact app-consumable B1 final-validation set with unique ids", () => {
    expect(punjabiB1FinalValidationSet.length).toBeGreaterThanOrEqual(8);
    expect(punjabiB1FinalValidationSet.length).toBeLessThanOrEqual(12);
    expect(
      new Set(punjabiB1FinalValidationSet.map((card) => card.id)).size,
    ).toBe(punjabiB1FinalValidationSet.length);
    expect(punjabiB1FinalValidationSet.every((card) => card.level === "B1")).toBe(true);
  });

  it("covers every Wave 35 final-validation focus", () => {
    const actualFocuses = new Set(
      punjabiB1FinalValidationSet.map((card) => card.focus),
    );
    for (const focus of requiredFocuses) {
      expect(actualFocuses.has(focus)).toBe(true);
    }
  });

  it("keeps guardrail and awareness language visible", () => {
    const serializedCards = JSON.stringify(punjabiB1FinalValidationSet);

    expect(serializedCards).toContain("Language practice only");
    expect(serializedCards).toContain("not medical advice");
    expect(serializedCards).toContain("not legal or financial advice");
    expect(serializedCards).toContain("Shahmukhi");
    expect(serializedCards).toContain("awareness only");
    expect(serializedCards).toContain("Native review is deferred");
  });

  it.each(punjabiB1FinalValidationSet)(
    "$id includes bilingual scenario text and Canada-practical context",
    (card) => {
      expect(card.title_en).toBeTruthy();
      expect(card.title_vi).toBeTruthy();
      expect(card.scenario_en).toBeTruthy();
      expect(card.scenario_vi).toBeTruthy();
      expect(card.canadaContext).toMatch(/Canada|Canadian/i);
    },
  );

  it.each(punjabiB1FinalValidationSet)(
    "$id includes final-validation lines with Gurmukhi and romanization",
    (card) => {
      expectLine(card.finalValidation.sampleLine);
      expect(card.finalValidation.finalValidationPrompt_en).toBeTruthy();
      expect(card.finalValidation.finalValidationPrompt_vi).toBeTruthy();
      expect(card.finalValidation.validationSignals_en.length).toBeGreaterThanOrEqual(3);
      expect(card.finalValidation.validationSignals_vi).toHaveLength(
        card.finalValidation.validationSignals_en.length,
      );
    },
  );

  it.each(punjabiB1FinalValidationSet)(
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

  it.each(punjabiB1FinalValidationSet)(
    "$id includes cross-check and pre-integration guidance",
    (card) => {
      expect(card.crossCheckNote_en).toMatch(
        /final-validation|cross-check|practice|Shahmukhi|Native review/i,
      );
      expect(card.crossCheckNote_vi).toBeTruthy();
      expect(card.preIntegrationRoute_en).toMatch(
        /route|pre-integration|integration|final-validation|cross-check/i,
      );
      expect(card.preIntegrationRoute_vi).toBeTruthy();
    },
  );
});
