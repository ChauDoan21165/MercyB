import {
  punjabiB1FinalRegressionSamples,
  type PunjabiB1FinalRegressionFocus,
  type PunjabiFinalRegressionLine,
} from "../b1FinalRegressionSamples";

const requiredFocuses: PunjabiB1FinalRegressionFocus[] = [
  "situation_explanation",
  "event_retelling",
  "clarification_strategy",
  "service_recovery",
  "issue_resolution",
  "follow_up_message",
  "workplace_task",
  "housing_school_community",
  "register_safe_repair",
];

const hasGurmukhi = (text: string) => /[\u0A00-\u0A7F]/u.test(text);
const hasLatin = (text: string) => /[A-Za-z]/.test(text);

const expectLine = (line: PunjabiFinalRegressionLine) => {
  expect(line.pa).toBeTruthy();
  expect(hasGurmukhi(line.pa)).toBe(true);
  expect(line.romanization).toBeTruthy();
  expect(hasLatin(line.romanization)).toBe(true);
  expect(line.en).toBeTruthy();
  expect(line.vi).toBeTruthy();
};

describe("punjabiB1FinalRegressionSamples", () => {
  it("is a compact app-consumable B1 regression pack with unique ids", () => {
    expect(punjabiB1FinalRegressionSamples.length).toBeGreaterThanOrEqual(8);
    expect(punjabiB1FinalRegressionSamples.length).toBeLessThanOrEqual(12);
    expect(
      new Set(punjabiB1FinalRegressionSamples.map((card) => card.id)).size,
    ).toBe(punjabiB1FinalRegressionSamples.length);
    expect(
      punjabiB1FinalRegressionSamples.every((card) => card.level === "B1"),
    ).toBe(true);
  });

  it("covers every Wave 31 regression focus", () => {
    const actualFocuses = new Set(
      punjabiB1FinalRegressionSamples.map((card) => card.focus),
    );
    for (const focus of requiredFocuses) {
      expect(actualFocuses.has(focus)).toBe(true);
    }
  });

  it("keeps support-only guardrail language visible", () => {
    const serializedCards = JSON.stringify(punjabiB1FinalRegressionSamples);

    expect(serializedCards).toContain("Language practice only");
    expect(serializedCards).toContain("language practice only");
    expect(serializedCards).toContain("not medical advice");
    expect(serializedCards).toContain("not legal or financial advice");
    expect(serializedCards).toContain("Shahmukhi");
    expect(serializedCards).toContain("awareness only");
    expect(serializedCards).toContain("Native review is deferred");
  });

  it.each(punjabiB1FinalRegressionSamples)(
    "$id includes bilingual scenario text and Canada-practical context",
    (card) => {
      expect(card.title_en).toBeTruthy();
      expect(card.title_vi).toBeTruthy();
      expect(card.scenario_en).toBeTruthy();
      expect(card.scenario_vi).toBeTruthy();
      expect(card.canadaContext).toMatch(/Canada|Canadian/i);
    },
  );

  it.each(punjabiB1FinalRegressionSamples)(
    "$id includes regression lines with Gurmukhi and romanization",
    (card) => {
      expectLine(card.regressionPack.regressionLine);
      expect(card.regressionPack.finalRegressionPrompt_en).toBeTruthy();
      expect(card.regressionPack.finalRegressionPrompt_vi).toBeTruthy();
      expect(card.regressionPack.regressionSignals_en.length).toBeGreaterThanOrEqual(3);
      expect(card.regressionPack.regressionSignals_vi).toHaveLength(
        card.regressionPack.regressionSignals_en.length,
      );
    },
  );

  it.each(punjabiB1FinalRegressionSamples)(
    "$id includes common traps and better alternatives",
    (card) => {
      expect(card.commonTraps.length).toBeGreaterThanOrEqual(1);
      for (const trap of card.commonTraps) {
        expect(trap.trap_en).toBeTruthy();
        expect(trap.trap_vi).toBeTruthy();
        expectLine(trap.better);
      }
    },
  );

  it.each(punjabiB1FinalRegressionSamples)(
    "$id includes final-readiness and integration-route notes",
    (card) => {
      expect(card.finalReadiness_en).toMatch(
        /ready|final|regression|integration|stability|practice/i,
      );
      expect(card.finalReadiness_vi).toBeTruthy();
      expect(card.integrationRoute_en).toMatch(
        /route|B2|integration|stable|regression/i,
      );
      expect(card.integrationRoute_vi).toBeTruthy();
    },
  );
});
