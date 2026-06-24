import {
  punjabiB1InteractionStressTests,
  type PunjabiB1InteractionStressFocus,
  type PunjabiInteractionStressLine,
} from "../interactionStressTestsB1";

const requiredFocuses: PunjabiB1InteractionStressFocus[] = [
  "unclear_service_answer",
  "workplace_misunderstanding",
  "housing_delay",
  "school_community_follow_up",
  "clinic_service_problem",
  "polite_complaint",
  "register_repair",
];

const hasGurmukhi = (text: string) => /[\u0A00-\u0A7F]/u.test(text);
const hasLatin = (text: string) => /[A-Za-z]/.test(text);

const expectLine = (line: PunjabiInteractionStressLine) => {
  expect(line.pa).toBeTruthy();
  expect(hasGurmukhi(line.pa)).toBe(true);
  expect(line.romanization).toBeTruthy();
  expect(hasLatin(line.romanization)).toBe(true);
  expect(line.en).toBeTruthy();
  expect(line.vi).toBeTruthy();
};

describe("punjabiB1InteractionStressTests", () => {
  it("is a compact app-consumable B1 stress-test set with unique ids", () => {
    expect(punjabiB1InteractionStressTests.length).toBeGreaterThanOrEqual(7);
    expect(punjabiB1InteractionStressTests.length).toBeLessThanOrEqual(12);
    expect(
      new Set(punjabiB1InteractionStressTests.map((card) => card.id)).size,
    ).toBe(punjabiB1InteractionStressTests.length);
    expect(
      punjabiB1InteractionStressTests.every((card) => card.level === "B1"),
    ).toBe(true);
  });

  it("covers every Wave 23 stress-test focus", () => {
    const actualFocuses = new Set(
      punjabiB1InteractionStressTests.map((card) => card.focus),
    );
    for (const focus of requiredFocuses) {
      expect(actualFocuses.has(focus)).toBe(true);
    }
  });

  it("keeps service and clinic problems inside support-only guardrails", () => {
    const serializedCards = JSON.stringify(punjabiB1InteractionStressTests);

    expect(serializedCards).toContain("Language practice only");
    expect(serializedCards).toContain("language practice only");
    expect(serializedCards).toContain("not medical advice");
    expect(serializedCards).toContain("not legal or financial advice");
    expect(serializedCards).toContain("Shahmukhi");
    expect(serializedCards).toContain("awareness only");
    expect(serializedCards).toContain("Native review is deferred");
  });

  it.each(punjabiB1InteractionStressTests)(
    "$id includes bilingual scenario text and Canada-practical context",
    (card) => {
      expect(card.title_en).toBeTruthy();
      expect(card.title_vi).toBeTruthy();
      expect(card.scenario_en).toBeTruthy();
      expect(card.scenario_vi).toBeTruthy();
      expect(card.canadaContext).toMatch(/Canada|Canadian/i);
    },
  );

  it.each(punjabiB1InteractionStressTests)(
    "$id includes Gurmukhi-primary stress-pack lines with romanization",
    (card) => {
      expectLine(card.stressPack.sampleResponse);
      expect(card.stressPack.stressPrompt_en).toBeTruthy();
      expect(card.stressPack.stressPrompt_vi).toBeTruthy();
      expect(card.stressPack.riskSignals_en.length).toBeGreaterThanOrEqual(3);
      expect(card.stressPack.riskSignals_vi).toHaveLength(
        card.stressPack.riskSignals_en.length,
      );
    },
  );

  it.each(punjabiB1InteractionStressTests)(
    "$id includes common traps and fixes",
    (card) => {
      expect(card.commonTraps.length).toBeGreaterThanOrEqual(1);
      for (const trap of card.commonTraps) {
        expect(trap.trap_en).toBeTruthy();
        expect(trap.trap_vi).toBeTruthy();
        expectLine(trap.fix);
      }
    },
  );

  it.each(punjabiB1InteractionStressTests)(
    "$id includes final-risk and final-QA notes",
    (card) => {
      expect(card.finalRisk_en).toMatch(/risk|review|support/i);
      expect(card.finalRisk_vi).toBeTruthy();
      expect(card.finalQa_en).toMatch(/QA|check|review|writing/i);
      expect(card.finalQa_vi).toBeTruthy();
    },
  );
});
