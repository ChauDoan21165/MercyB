import {
  punjabiB1FinalLockSamples,
  type PunjabiB1FinalLockFocus,
  type PunjabiFinalLockLine,
} from "../b1FinalLockSamples";

const requiredFocuses: PunjabiB1FinalLockFocus[] = [
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

const expectLine = (line: PunjabiFinalLockLine) => {
  expect(line.pa).toBeTruthy();
  expect(hasGurmukhi(line.pa)).toBe(true);
  expect(line.romanization).toBeTruthy();
  expect(hasLatin(line.romanization)).toBe(true);
  expect(line.en).toBeTruthy();
  expect(line.vi).toBeTruthy();
};

describe("punjabiB1FinalLockSamples", () => {
  it("is a compact app-consumable B1 final-lock set with unique ids", () => {
    expect(punjabiB1FinalLockSamples.length).toBeGreaterThanOrEqual(8);
    expect(punjabiB1FinalLockSamples.length).toBeLessThanOrEqual(12);
    expect(new Set(punjabiB1FinalLockSamples.map((card) => card.id)).size).toBe(
      punjabiB1FinalLockSamples.length,
    );
    expect(punjabiB1FinalLockSamples.every((card) => card.level === "B1")).toBe(true);
  });

  it("covers every Wave 42 final-lock focus", () => {
    const actualFocuses = new Set(
      punjabiB1FinalLockSamples.map((card) => card.focus),
    );

    for (const focus of requiredFocuses) {
      expect(actualFocuses.has(focus)).toBe(true);
    }
  });

  it("keeps guardrail and awareness language visible", () => {
    const serializedCards = JSON.stringify(punjabiB1FinalLockSamples);

    expect(serializedCards).toContain("Language practice only");
    expect(serializedCards).toContain("not medical advice");
    expect(serializedCards).toContain("not legal or financial advice");
    expect(serializedCards).toContain("Shahmukhi");
    expect(serializedCards).toContain("awareness only");
    expect(serializedCards).toContain("Native review is deferred");
  });

  it.each(punjabiB1FinalLockSamples)(
    "$id includes bilingual scenario text and Canada-practical context",
    (card) => {
      expect(card.title_en).toBeTruthy();
      expect(card.title_vi).toBeTruthy();
      expect(card.scenario_en).toBeTruthy();
      expect(card.scenario_vi).toBeTruthy();
      expect(card.canadaContext).toMatch(/Canada|Canadian/i);
    },
  );

  it.each(punjabiB1FinalLockSamples)(
    "$id includes final-lock lines with Gurmukhi and romanization",
    (card) => {
      expectLine(card.finalLock.sampleLine);
      expect(card.finalLock.finalLockPrompt_en).toBeTruthy();
      expect(card.finalLock.finalLockPrompt_vi).toBeTruthy();
      expect(card.finalLock.lockSignals_en.length).toBeGreaterThanOrEqual(3);
      expect(card.finalLock.lockSignals_vi).toHaveLength(
        card.finalLock.lockSignals_en.length,
      );
    },
  );

  it.each(punjabiB1FinalLockSamples)(
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

  it.each(punjabiB1FinalLockSamples)(
    "$id includes final-lock, owner-acceptance, final-acceptance, and pre-integration guidance",
    (card) => {
      expect(card.ownerAcceptanceNote_en).toMatch(
        /final-lock|owner-acceptance|final-acceptance|practice|Shahmukhi|Native review/i,
      );
      expect(card.ownerAcceptanceNote_vi).toBeTruthy();
      expect(card.preIntegrationRoute_en).toMatch(
        /route|pre-integration|integration|locked|stable/i,
      );
      expect(card.preIntegrationRoute_vi).toBeTruthy();
    },
  );
});
