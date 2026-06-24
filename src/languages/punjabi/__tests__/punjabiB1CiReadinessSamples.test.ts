import {
  punjabiB1CiReadinessSamples,
  type PunjabiB1CiReadinessFocus,
  type PunjabiCiReadinessLine,
} from "../b1CiReadinessSamples";

const requiredFocuses: PunjabiB1CiReadinessFocus[] = [
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

const expectLine = (line: PunjabiCiReadinessLine) => {
  expect(line.pa).toBeTruthy();
  expect(hasGurmukhi(line.pa)).toBe(true);
  expect(line.romanization).toBeTruthy();
  expect(hasLatin(line.romanization)).toBe(true);
  expect(line.en).toBeTruthy();
  expect(line.vi).toBeTruthy();
};

describe("punjabiB1CiReadinessSamples", () => {
  it("is a compact app-consumable B1 CI-readiness set with unique ids", () => {
    expect(punjabiB1CiReadinessSamples.length).toBeGreaterThanOrEqual(8);
    expect(punjabiB1CiReadinessSamples.length).toBeLessThanOrEqual(12);
    expect(new Set(punjabiB1CiReadinessSamples.map((card) => card.id)).size).toBe(
      punjabiB1CiReadinessSamples.length,
    );
    expect(punjabiB1CiReadinessSamples.every((card) => card.level === "B1")).toBe(true);
  });

  it("covers every Wave 45 CI-readiness focus", () => {
    const actualFocuses = new Set(
      punjabiB1CiReadinessSamples.map((card) => card.focus),
    );

    for (const focus of requiredFocuses) {
      expect(actualFocuses.has(focus)).toBe(true);
    }
  });

  it("keeps guardrail and awareness language visible", () => {
    const serializedCards = JSON.stringify(punjabiB1CiReadinessSamples);

    expect(serializedCards).toContain("Language practice only");
    expect(serializedCards).toContain("not medical advice");
    expect(serializedCards).toContain("not legal or financial advice");
    expect(serializedCards).toContain("Shahmukhi");
    expect(serializedCards).toContain("awareness only");
    expect(serializedCards).toContain("Native review is deferred");
  });

  it.each(punjabiB1CiReadinessSamples)(
    "$id includes bilingual scenario text and Canada-practical context",
    (card) => {
      expect(card.title_en).toBeTruthy();
      expect(card.title_vi).toBeTruthy();
      expect(card.scenario_en).toBeTruthy();
      expect(card.scenario_vi).toBeTruthy();
      expect(card.canadaContext).toMatch(/Canada|Canadian/i);
    },
  );

  it.each(punjabiB1CiReadinessSamples)(
    "$id includes CI-readiness lines with Gurmukhi and romanization",
    (card) => {
      expectLine(card.ciReadiness.sampleLine);
      expect(card.ciReadiness.ciReadinessPrompt_en).toBeTruthy();
      expect(card.ciReadiness.ciReadinessPrompt_vi).toBeTruthy();
      expect(card.ciReadiness.testSignals_en.length).toBeGreaterThanOrEqual(3);
      expect(card.ciReadiness.testSignals_vi).toHaveLength(
        card.ciReadiness.testSignals_en.length,
      );
    },
  );

  it.each(punjabiB1CiReadinessSamples)(
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

  it.each(punjabiB1CiReadinessSamples)(
    "$id includes CI-readiness, MR-readiness, final-freeze, and pre-integration guidance",
    (card) => {
      expect(card.mrReadinessNote_en).toMatch(
        /CI-readiness|MR-readiness|final-freeze|practice|Shahmukhi|Native review/i,
      );
      expect(card.mrReadinessNote_vi).toBeTruthy();
      expect(card.preIntegrationRoute_en).toMatch(
        /route|pre-integration|integration|tested|stable/i,
      );
      expect(card.preIntegrationRoute_vi).toBeTruthy();
    },
  );
});
