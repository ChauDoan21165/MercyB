import {
  punjabiB1ImportReadinessSamples,
  type PunjabiB1ImportReadinessFocus,
  type PunjabiImportReadinessLine,
} from "../b1ImportReadinessSamples";

const requiredFocuses: PunjabiB1ImportReadinessFocus[] = [
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

const expectLine = (line: PunjabiImportReadinessLine) => {
  expect(line.pa).toBeTruthy();
  expect(hasGurmukhi(line.pa)).toBe(true);
  expect(line.romanization).toBeTruthy();
  expect(hasLatin(line.romanization)).toBe(true);
  expect(line.en).toBeTruthy();
  expect(line.vi).toBeTruthy();
};

describe("punjabiB1ImportReadinessSamples", () => {
  it("is a compact app-consumable B1 import-readiness set with unique ids", () => {
    expect(punjabiB1ImportReadinessSamples.length).toBeGreaterThanOrEqual(8);
    expect(punjabiB1ImportReadinessSamples.length).toBeLessThanOrEqual(12);
    expect(
      new Set(punjabiB1ImportReadinessSamples.map((card) => card.id)).size,
    ).toBe(punjabiB1ImportReadinessSamples.length);
    expect(
      punjabiB1ImportReadinessSamples.every((card) => card.level === "B1"),
    ).toBe(true);
  });

  it("covers every Wave 33 import-readiness focus", () => {
    const actualFocuses = new Set(
      punjabiB1ImportReadinessSamples.map((card) => card.focus),
    );
    for (const focus of requiredFocuses) {
      expect(actualFocuses.has(focus)).toBe(true);
    }
  });

  it("keeps guardrail and awareness language visible", () => {
    const serializedCards = JSON.stringify(punjabiB1ImportReadinessSamples);

    expect(serializedCards).toContain("Language practice only");
    expect(serializedCards).toContain("not medical advice");
    expect(serializedCards).toContain("not legal or financial advice");
    expect(serializedCards).toContain("Shahmukhi");
    expect(serializedCards).toContain("awareness only");
    expect(serializedCards).toContain("Native review is deferred");
  });

  it.each(punjabiB1ImportReadinessSamples)(
    "$id includes bilingual scenario text and Canada-practical context",
    (card) => {
      expect(card.title_en).toBeTruthy();
      expect(card.title_vi).toBeTruthy();
      expect(card.scenario_en).toBeTruthy();
      expect(card.scenario_vi).toBeTruthy();
      expect(card.canadaContext).toMatch(/Canada|Canadian/i);
    },
  );

  it.each(punjabiB1ImportReadinessSamples)(
    "$id includes import lines with Gurmukhi and romanization",
    (card) => {
      expectLine(card.importReadiness.sampleLine);
      expect(card.importReadiness.importPrompt_en).toBeTruthy();
      expect(card.importReadiness.importPrompt_vi).toBeTruthy();
      expect(card.importReadiness.readinessSignals_en.length).toBeGreaterThanOrEqual(3);
      expect(card.importReadiness.readinessSignals_vi).toHaveLength(
        card.importReadiness.readinessSignals_en.length,
      );
    },
  );

  it.each(punjabiB1ImportReadinessSamples)(
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

  it.each(punjabiB1ImportReadinessSamples)(
    "$id includes final-regression and pre-integration guidance",
    (card) => {
      expect(card.finalRegressionNote_en).toMatch(
        /import|final|regression|readiness|practice|Shahmukhi|Native review/i,
      );
      expect(card.finalRegressionNote_vi).toBeTruthy();
      expect(card.preIntegrationRoute_en).toMatch(
        /route|pre-integration|integration|final-regression|stable/i,
      );
      expect(card.preIntegrationRoute_vi).toBeTruthy();
    },
  );
});
