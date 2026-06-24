import {
  punjabiB1MergeReadinessSamples,
  type PunjabiB1MergeReadinessFocus,
  type PunjabiMergeReadinessLine,
} from "../b1MergeReadinessSamples";

const requiredFocuses: PunjabiB1MergeReadinessFocus[] = [
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

const expectLine = (line: PunjabiMergeReadinessLine) => {
  expect(line.pa).toBeTruthy();
  expect(hasGurmukhi(line.pa)).toBe(true);
  expect(line.romanization).toBeTruthy();
  expect(hasLatin(line.romanization)).toBe(true);
  expect(line.en).toBeTruthy();
  expect(line.vi).toBeTruthy();
};

describe("punjabiB1MergeReadinessSamples", () => {
  it("is a compact app-consumable B1 merge-readiness set with unique ids", () => {
    expect(punjabiB1MergeReadinessSamples.length).toBeGreaterThanOrEqual(8);
    expect(punjabiB1MergeReadinessSamples.length).toBeLessThanOrEqual(12);
    expect(
      new Set(punjabiB1MergeReadinessSamples.map((card) => card.id)).size,
    ).toBe(punjabiB1MergeReadinessSamples.length);
    expect(
      punjabiB1MergeReadinessSamples.every((card) => card.level === "B1"),
    ).toBe(true);
  });

  it("covers every Wave 32 merge-readiness focus", () => {
    const actualFocuses = new Set(
      punjabiB1MergeReadinessSamples.map((card) => card.focus),
    );
    for (const focus of requiredFocuses) {
      expect(actualFocuses.has(focus)).toBe(true);
    }
  });

  it("keeps guardrail and awareness language visible", () => {
    const serializedCards = JSON.stringify(punjabiB1MergeReadinessSamples);

    expect(serializedCards).toContain("Language practice only");
    expect(serializedCards).toContain("not medical advice");
    expect(serializedCards).toContain("not legal or financial advice");
    expect(serializedCards).toContain("Shahmukhi");
    expect(serializedCards).toContain("awareness only");
    expect(serializedCards).toContain("Native review is deferred");
  });

  it.each(punjabiB1MergeReadinessSamples)(
    "$id includes bilingual scenario text and Canada-practical context",
    (card) => {
      expect(card.title_en).toBeTruthy();
      expect(card.title_vi).toBeTruthy();
      expect(card.scenario_en).toBeTruthy();
      expect(card.scenario_vi).toBeTruthy();
      expect(card.canadaContext).toMatch(/Canada|Canadian/i);
    },
  );

  it.each(punjabiB1MergeReadinessSamples)(
    "$id includes merge lines with Gurmukhi and romanization",
    (card) => {
      expectLine(card.mergeReadiness.sampleLine);
      expect(card.mergeReadiness.mergePrompt_en).toBeTruthy();
      expect(card.mergeReadiness.mergePrompt_vi).toBeTruthy();
      expect(card.mergeReadiness.verificationSignals_en.length).toBeGreaterThanOrEqual(3);
      expect(card.mergeReadiness.verificationSignals_vi).toHaveLength(
        card.mergeReadiness.verificationSignals_en.length,
      );
    },
  );

  it.each(punjabiB1MergeReadinessSamples)(
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

  it.each(punjabiB1MergeReadinessSamples)(
    "$id includes final-regression and pre-integration guidance",
    (card) => {
      expect(card.finalRegressionNote_en).toMatch(
        /merge|final|regression|readiness|practice|Shahmukhi|Native review/i,
      );
      expect(card.finalRegressionNote_vi).toBeTruthy();
      expect(card.preIntegrationRoute_en).toMatch(
        /route|pre-integration|integration|final-regression|stable/i,
      );
      expect(card.preIntegrationRoute_vi).toBeTruthy();
    },
  );
});
