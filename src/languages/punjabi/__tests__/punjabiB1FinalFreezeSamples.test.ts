import {
  punjabiB1FinalFreezeSamples,
  type PunjabiB1FinalFreezeFocus,
  type PunjabiFinalFreezeLine,
} from "../b1FinalFreezeSamples";

const requiredFocuses: PunjabiB1FinalFreezeFocus[] = [
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

const expectLine = (line: PunjabiFinalFreezeLine) => {
  expect(line.pa).toBeTruthy();
  expect(hasGurmukhi(line.pa)).toBe(true);
  expect(line.romanization).toBeTruthy();
  expect(hasLatin(line.romanization)).toBe(true);
  expect(line.en).toBeTruthy();
  expect(line.vi).toBeTruthy();
};

describe("punjabiB1FinalFreezeSamples", () => {
  it("is a compact app-consumable B1 final-freeze set with unique ids", () => {
    expect(punjabiB1FinalFreezeSamples.length).toBeGreaterThanOrEqual(8);
    expect(punjabiB1FinalFreezeSamples.length).toBeLessThanOrEqual(12);
    expect(new Set(punjabiB1FinalFreezeSamples.map((card) => card.id)).size).toBe(
      punjabiB1FinalFreezeSamples.length,
    );
    expect(punjabiB1FinalFreezeSamples.every((card) => card.level === "B1")).toBe(true);
  });

  it("covers every Wave 43 final-freeze focus", () => {
    const actualFocuses = new Set(
      punjabiB1FinalFreezeSamples.map((card) => card.focus),
    );

    for (const focus of requiredFocuses) {
      expect(actualFocuses.has(focus)).toBe(true);
    }
  });

  it("keeps guardrail and awareness language visible", () => {
    const serializedCards = JSON.stringify(punjabiB1FinalFreezeSamples);

    expect(serializedCards).toContain("Language practice only");
    expect(serializedCards).toContain("not medical advice");
    expect(serializedCards).toContain("not legal or financial advice");
    expect(serializedCards).toContain("Shahmukhi");
    expect(serializedCards).toContain("awareness only");
    expect(serializedCards).toContain("Native review is deferred");
  });

  it.each(punjabiB1FinalFreezeSamples)(
    "$id includes bilingual scenario text and Canada-practical context",
    (card) => {
      expect(card.title_en).toBeTruthy();
      expect(card.title_vi).toBeTruthy();
      expect(card.scenario_en).toBeTruthy();
      expect(card.scenario_vi).toBeTruthy();
      expect(card.canadaContext).toMatch(/Canada|Canadian/i);
    },
  );

  it.each(punjabiB1FinalFreezeSamples)(
    "$id includes final-freeze lines with Gurmukhi and romanization",
    (card) => {
      expectLine(card.finalFreeze.sampleLine);
      expect(card.finalFreeze.finalFreezePrompt_en).toBeTruthy();
      expect(card.finalFreeze.finalFreezePrompt_vi).toBeTruthy();
      expect(card.finalFreeze.freezeSignals_en.length).toBeGreaterThanOrEqual(3);
      expect(card.finalFreeze.freezeSignals_vi).toHaveLength(
        card.finalFreeze.freezeSignals_en.length,
      );
    },
  );

  it.each(punjabiB1FinalFreezeSamples)(
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

  it.each(punjabiB1FinalFreezeSamples)(
    "$id includes final-freeze, final-lock, owner-acceptance, and pre-integration guidance",
    (card) => {
      expect(card.finalLockNote_en).toMatch(
        /final-freeze|final-lock|owner-acceptance|practice|Shahmukhi|Native review/i,
      );
      expect(card.finalLockNote_vi).toBeTruthy();
      expect(card.preIntegrationRoute_en).toMatch(
        /route|pre-integration|integration|frozen|stable/i,
      );
      expect(card.preIntegrationRoute_vi).toBeTruthy();
    },
  );
});
