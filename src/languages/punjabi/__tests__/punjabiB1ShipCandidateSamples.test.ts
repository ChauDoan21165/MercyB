import {
  punjabiB1ShipCandidateSamples,
  type PunjabiB1ShipCandidateFocus,
  type PunjabiShipCandidateLine,
} from "../b1ShipCandidateSamples";

const requiredFocuses: PunjabiB1ShipCandidateFocus[] = [
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

const expectLine = (line: PunjabiShipCandidateLine) => {
  expect(line.pa).toBeTruthy();
  expect(hasGurmukhi(line.pa)).toBe(true);
  expect(line.romanization).toBeTruthy();
  expect(hasLatin(line.romanization)).toBe(true);
  expect(line.en).toBeTruthy();
  expect(line.vi).toBeTruthy();
};

describe("punjabiB1ShipCandidateSamples", () => {
  it("is a compact app-consumable B1 ship-candidate set with unique ids", () => {
    expect(punjabiB1ShipCandidateSamples.length).toBeGreaterThanOrEqual(8);
    expect(punjabiB1ShipCandidateSamples.length).toBeLessThanOrEqual(12);
    expect(new Set(punjabiB1ShipCandidateSamples.map((card) => card.id)).size).toBe(
      punjabiB1ShipCandidateSamples.length,
    );
    expect(punjabiB1ShipCandidateSamples.every((card) => card.level === "B1")).toBe(true);
  });

  it("covers every Wave 39 ship-candidate focus", () => {
    const actualFocuses = new Set(
      punjabiB1ShipCandidateSamples.map((card) => card.focus),
    );
    for (const focus of requiredFocuses) {
      expect(actualFocuses.has(focus)).toBe(true);
    }
  });

  it("keeps guardrail and awareness language visible", () => {
    const serializedCards = JSON.stringify(punjabiB1ShipCandidateSamples);

    expect(serializedCards).toContain("Language practice only");
    expect(serializedCards).toContain("not medical advice");
    expect(serializedCards).toContain("not legal or financial advice");
    expect(serializedCards).toContain("Shahmukhi");
    expect(serializedCards).toContain("awareness only");
    expect(serializedCards).toContain("Native review is deferred");
  });

  it.each(punjabiB1ShipCandidateSamples)(
    "$id includes bilingual scenario text and Canada-practical context",
    (card) => {
      expect(card.title_en).toBeTruthy();
      expect(card.title_vi).toBeTruthy();
      expect(card.scenario_en).toBeTruthy();
      expect(card.scenario_vi).toBeTruthy();
      expect(card.canadaContext).toMatch(/Canada|Canadian/i);
    },
  );

  it.each(punjabiB1ShipCandidateSamples)(
    "$id includes ship-candidate lines with Gurmukhi and romanization",
    (card) => {
      expectLine(card.shipCandidate.sampleLine);
      expect(card.shipCandidate.shipCandidatePrompt_en).toBeTruthy();
      expect(card.shipCandidate.shipCandidatePrompt_vi).toBeTruthy();
      expect(card.shipCandidate.readinessSignals_en.length).toBeGreaterThanOrEqual(3);
      expect(card.shipCandidate.readinessSignals_vi).toHaveLength(
        card.shipCandidate.readinessSignals_en.length,
      );
    },
  );

  it.each(punjabiB1ShipCandidateSamples)(
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

  it.each(punjabiB1ShipCandidateSamples)(
    "$id includes go-no-go and pre-integration guidance",
    (card) => {
      expect(card.goNoGoNote_en).toMatch(
        /ship-candidate|go-no-go|practice|Shahmukhi|Native review/i,
      );
      expect(card.goNoGoNote_vi).toBeTruthy();
      expect(card.preIntegrationRoute_en).toMatch(
        /route|pre-integration|integration|ship-candidate|stable/i,
      );
      expect(card.preIntegrationRoute_vi).toBeTruthy();
    },
  );
});
