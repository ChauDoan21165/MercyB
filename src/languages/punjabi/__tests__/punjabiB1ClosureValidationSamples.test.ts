import {
  punjabiB1ClosureValidationSamples,
  type PunjabiB1ClosureValidationFocus,
  type PunjabiClosureValidationLine,
} from "../b1ClosureValidationSamples";

const requiredFocuses: PunjabiB1ClosureValidationFocus[] = [
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

const expectLine = (line: PunjabiClosureValidationLine) => {
  expect(line.pa).toBeTruthy();
  expect(hasGurmukhi(line.pa)).toBe(true);
  expect(line.romanization).toBeTruthy();
  expect(hasLatin(line.romanization)).toBe(true);
  expect(line.en).toBeTruthy();
  expect(line.vi).toBeTruthy();
};

describe("punjabiB1ClosureValidationSamples", () => {
  it("is a compact app-consumable B1 closure-validation set with unique ids", () => {
    expect(punjabiB1ClosureValidationSamples.length).toBeGreaterThanOrEqual(8);
    expect(punjabiB1ClosureValidationSamples.length).toBeLessThanOrEqual(12);
    expect(
      new Set(punjabiB1ClosureValidationSamples.map((card) => card.id)).size,
    ).toBe(punjabiB1ClosureValidationSamples.length);
    expect(punjabiB1ClosureValidationSamples.every((card) => card.level === "B1")).toBe(true);
  });

  it("covers every Wave 36 closure-validation focus", () => {
    const actualFocuses = new Set(
      punjabiB1ClosureValidationSamples.map((card) => card.focus),
    );
    for (const focus of requiredFocuses) {
      expect(actualFocuses.has(focus)).toBe(true);
    }
  });

  it("keeps guardrail and awareness language visible", () => {
    const serializedCards = JSON.stringify(punjabiB1ClosureValidationSamples);

    expect(serializedCards).toContain("Language practice only");
    expect(serializedCards).toContain("not medical advice");
    expect(serializedCards).toContain("not legal or financial advice");
    expect(serializedCards).toContain("Shahmukhi");
    expect(serializedCards).toContain("awareness only");
    expect(serializedCards).toContain("Native review is deferred");
  });

  it.each(punjabiB1ClosureValidationSamples)(
    "$id includes bilingual scenario text and Canada-practical context",
    (card) => {
      expect(card.title_en).toBeTruthy();
      expect(card.title_vi).toBeTruthy();
      expect(card.scenario_en).toBeTruthy();
      expect(card.scenario_vi).toBeTruthy();
      expect(card.canadaContext).toMatch(/Canada|Canadian/i);
    },
  );

  it.each(punjabiB1ClosureValidationSamples)(
    "$id includes closure-validation lines with Gurmukhi and romanization",
    (card) => {
      expectLine(card.closureValidation.sampleLine);
      expect(card.closureValidation.closureValidationPrompt_en).toBeTruthy();
      expect(card.closureValidation.closureValidationPrompt_vi).toBeTruthy();
      expect(card.closureValidation.closureSignals_en.length).toBeGreaterThanOrEqual(3);
      expect(card.closureValidation.closureSignals_vi).toHaveLength(
        card.closureValidation.closureSignals_en.length,
      );
    },
  );

  it.each(punjabiB1ClosureValidationSamples)(
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

  it.each(punjabiB1ClosureValidationSamples)(
    "$id includes final-cross-check and pre-integration guidance",
    (card) => {
      expect(card.finalCrossCheckNote_en).toMatch(
        /closure-validation|final-cross-check|practice|Shahmukhi|Native review/i,
      );
      expect(card.finalCrossCheckNote_vi).toBeTruthy();
      expect(card.preIntegrationRoute_en).toMatch(
        /route|pre-integration|integration|final-cross-check|closure/i,
      );
      expect(card.preIntegrationRoute_vi).toBeTruthy();
    },
  );
});
