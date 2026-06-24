import {
  punjabiB1OwnerAcceptanceSamples,
  type PunjabiB1OwnerAcceptanceFocus,
  type PunjabiOwnerAcceptanceLine,
} from "../b1OwnerAcceptanceSamples";

const requiredFocuses: PunjabiB1OwnerAcceptanceFocus[] = [
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

const expectLine = (line: PunjabiOwnerAcceptanceLine) => {
  expect(line.pa).toBeTruthy();
  expect(hasGurmukhi(line.pa)).toBe(true);
  expect(line.romanization).toBeTruthy();
  expect(hasLatin(line.romanization)).toBe(true);
  expect(line.en).toBeTruthy();
  expect(line.vi).toBeTruthy();
};

describe("punjabiB1OwnerAcceptanceSamples", () => {
  it("is a compact app-consumable B1 owner-acceptance set with unique ids", () => {
    expect(punjabiB1OwnerAcceptanceSamples.length).toBeGreaterThanOrEqual(8);
    expect(punjabiB1OwnerAcceptanceSamples.length).toBeLessThanOrEqual(12);
    expect(new Set(punjabiB1OwnerAcceptanceSamples.map((card) => card.id)).size).toBe(
      punjabiB1OwnerAcceptanceSamples.length,
    );
    expect(punjabiB1OwnerAcceptanceSamples.every((card) => card.level === "B1")).toBe(true);
  });

  it("covers every Wave 41 owner-acceptance focus", () => {
    const actualFocuses = new Set(
      punjabiB1OwnerAcceptanceSamples.map((card) => card.focus),
    );

    for (const focus of requiredFocuses) {
      expect(actualFocuses.has(focus)).toBe(true);
    }
  });

  it("keeps guardrail and awareness language visible", () => {
    const serializedCards = JSON.stringify(punjabiB1OwnerAcceptanceSamples);

    expect(serializedCards).toContain("Language practice only");
    expect(serializedCards).toContain("not medical advice");
    expect(serializedCards).toContain("not legal or financial advice");
    expect(serializedCards).toContain("Shahmukhi");
    expect(serializedCards).toContain("awareness only");
    expect(serializedCards).toContain("Native review is deferred");
  });

  it.each(punjabiB1OwnerAcceptanceSamples)(
    "$id includes bilingual scenario text and Canada-practical context",
    (card) => {
      expect(card.title_en).toBeTruthy();
      expect(card.title_vi).toBeTruthy();
      expect(card.scenario_en).toBeTruthy();
      expect(card.scenario_vi).toBeTruthy();
      expect(card.canadaContext).toMatch(/Canada|Canadian/i);
    },
  );

  it.each(punjabiB1OwnerAcceptanceSamples)(
    "$id includes owner-acceptance lines with Gurmukhi and romanization",
    (card) => {
      expectLine(card.ownerAcceptance.sampleLine);
      expect(card.ownerAcceptance.ownerAcceptancePrompt_en).toBeTruthy();
      expect(card.ownerAcceptance.ownerAcceptancePrompt_vi).toBeTruthy();
      expect(card.ownerAcceptance.finalAcceptanceSignals_en.length).toBeGreaterThanOrEqual(3);
      expect(card.ownerAcceptance.finalAcceptanceSignals_vi).toHaveLength(
        card.ownerAcceptance.finalAcceptanceSignals_en.length,
      );
    },
  );

  it.each(punjabiB1OwnerAcceptanceSamples)(
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

  it.each(punjabiB1OwnerAcceptanceSamples)(
    "$id includes owner-acceptance, final-acceptance, ship-candidate, and pre-integration guidance",
    (card) => {
      expect(card.finalAcceptanceNote_en).toMatch(
        /owner-acceptance|final-acceptance|ship-candidate|practice|Shahmukhi|Native review/i,
      );
      expect(card.finalAcceptanceNote_vi).toBeTruthy();
      expect(card.preIntegrationRoute_en).toMatch(
        /route|pre-integration|integration|owner|stable/i,
      );
      expect(card.preIntegrationRoute_vi).toBeTruthy();
    },
  );
});
