import {
  punjabiB1AcceptanceSamples,
  type PunjabiAcceptanceLine,
  type PunjabiB1AcceptanceFocus,
} from "../b1AcceptanceSamples";

const requiredFocuses: PunjabiB1AcceptanceFocus[] = [
  "situation_explanation",
  "event_retelling",
  "clarification",
  "service_recovery",
  "issue_resolution",
  "follow_up_message",
  "workplace_task",
  "housing_task",
  "register_safe_repair",
];

const hasGurmukhi = (text: string) => /[\u0A00-\u0A7F]/u.test(text);
const hasLatin = (text: string) => /[A-Za-z]/.test(text);

const expectLine = (line: PunjabiAcceptanceLine) => {
  expect(line.pa).toBeTruthy();
  expect(hasGurmukhi(line.pa)).toBe(true);
  expect(line.romanization).toBeTruthy();
  expect(hasLatin(line.romanization)).toBe(true);
  expect(line.en).toBeTruthy();
  expect(line.vi).toBeTruthy();
};

describe("punjabiB1AcceptanceSamples", () => {
  it("is a compact app-consumable B1 acceptance set with unique ids", () => {
    expect(punjabiB1AcceptanceSamples.length).toBeGreaterThanOrEqual(8);
    expect(punjabiB1AcceptanceSamples.length).toBeLessThanOrEqual(12);
    expect(new Set(punjabiB1AcceptanceSamples.map((card) => card.id)).size).toBe(
      punjabiB1AcceptanceSamples.length,
    );
    expect(punjabiB1AcceptanceSamples.every((card) => card.level === "B1")).toBe(true);
  });

  it("covers every Wave 40 acceptance focus", () => {
    const actualFocuses = new Set(
      punjabiB1AcceptanceSamples.map((card) => card.focus),
    );

    for (const focus of requiredFocuses) {
      expect(actualFocuses.has(focus)).toBe(true);
    }
  });

  it("keeps guardrail and awareness language visible", () => {
    const serializedCards = JSON.stringify(punjabiB1AcceptanceSamples);

    expect(serializedCards).toContain("Language practice only");
    expect(serializedCards).toContain("not medical advice");
    expect(serializedCards).toContain("not legal or financial advice");
    expect(serializedCards).toContain("Shahmukhi");
    expect(serializedCards).toContain("awareness only");
    expect(serializedCards).toContain("Native review is deferred");
  });

  it.each(punjabiB1AcceptanceSamples)(
    "$id includes bilingual scenario text and Canada-practical context",
    (card) => {
      expect(card.title_en).toBeTruthy();
      expect(card.title_vi).toBeTruthy();
      expect(card.scenario_en).toBeTruthy();
      expect(card.scenario_vi).toBeTruthy();
      expect(card.canadaContext).toMatch(/Canada|Canadian/i);
    },
  );

  it.each(punjabiB1AcceptanceSamples)(
    "$id includes acceptance lines with Gurmukhi and romanization",
    (card) => {
      expectLine(card.acceptance.sampleLine);
      expect(card.acceptance.acceptancePrompt_en).toBeTruthy();
      expect(card.acceptance.acceptancePrompt_vi).toBeTruthy();
      expect(card.acceptance.acceptanceSignals_en.length).toBeGreaterThanOrEqual(3);
      expect(card.acceptance.acceptanceSignals_vi).toHaveLength(
        card.acceptance.acceptanceSignals_en.length,
      );
    },
  );

  it.each(punjabiB1AcceptanceSamples)(
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

  it.each(punjabiB1AcceptanceSamples)(
    "$id includes acceptance, ship-candidate, go-no-go, and pre-integration guidance",
    (card) => {
      expect(card.shipCandidateNote_en).toMatch(
        /acceptance|ship-candidate|go-no-go|practice|Shahmukhi|Native review/i,
      );
      expect(card.shipCandidateNote_vi).toBeTruthy();
      expect(card.preIntegrationRoute_en).toMatch(
        /route|pre-integration|integration|acceptance|stable/i,
      );
      expect(card.preIntegrationRoute_vi).toBeTruthy();
    },
  );
});
