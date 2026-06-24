import {
  punjabiB1FinalIntegrationSelectors,
  type PunjabiB1FinalIntegrationSelectorFocus,
  type PunjabiFinalIntegrationSelectorLine,
} from "../b1FinalIntegrationSelectors";

const requiredFocuses: PunjabiB1FinalIntegrationSelectorFocus[] = [
  "scenario_packs",
  "service_recovery",
  "issue_resolution",
  "follow_up_message",
  "conversation_recovery",
  "workplace_task",
  "housing_task",
  "school_community_task",
  "register_safe_repair",
];

const hasGurmukhi = (text: string) => /[\u0A00-\u0A7F]/u.test(text);
const hasLatin = (text: string) => /[A-Za-z]/.test(text);

const expectLine = (line: PunjabiFinalIntegrationSelectorLine) => {
  expect(line.pa).toBeTruthy();
  expect(hasGurmukhi(line.pa)).toBe(true);
  expect(line.romanization).toBeTruthy();
  expect(hasLatin(line.romanization)).toBe(true);
  expect(line.en).toBeTruthy();
  expect(line.vi).toBeTruthy();
};

describe("punjabiB1FinalIntegrationSelectors", () => {
  it("is a compact app-consumable B1 selector pack with unique ids", () => {
    expect(punjabiB1FinalIntegrationSelectors.length).toBeGreaterThanOrEqual(8);
    expect(punjabiB1FinalIntegrationSelectors.length).toBeLessThanOrEqual(12);
    expect(
      new Set(punjabiB1FinalIntegrationSelectors.map((card) => card.id)).size,
    ).toBe(punjabiB1FinalIntegrationSelectors.length);
    expect(
      punjabiB1FinalIntegrationSelectors.every((card) => card.level === "B1"),
    ).toBe(true);
  });

  it("covers every Wave 28 selector focus", () => {
    const actualFocuses = new Set(
      punjabiB1FinalIntegrationSelectors.map((card) => card.focus),
    );
    for (const focus of requiredFocuses) {
      expect(actualFocuses.has(focus)).toBe(true);
    }
  });

  it("keeps support-only guardrail language visible", () => {
    const serializedCards = JSON.stringify(punjabiB1FinalIntegrationSelectors);

    expect(serializedCards).toContain("Language practice only");
    expect(serializedCards).toContain("language practice only");
    expect(serializedCards).toContain("not medical advice");
    expect(serializedCards).toContain("not legal or financial advice");
    expect(serializedCards).toContain("Shahmukhi");
    expect(serializedCards).toContain("awareness only");
    expect(serializedCards).toContain("Native review is deferred");
  });

  it.each(punjabiB1FinalIntegrationSelectors)(
    "$id includes bilingual scenario text and Canada-practical context",
    (card) => {
      expect(card.title_en).toBeTruthy();
      expect(card.title_vi).toBeTruthy();
      expect(card.scenario_en).toBeTruthy();
      expect(card.scenario_vi).toBeTruthy();
      expect(card.canadaContext).toMatch(/Canada|Canadian/i);
    },
  );

  it.each(punjabiB1FinalIntegrationSelectors)(
    "$id includes selector lines with Gurmukhi and romanization",
    (card) => {
      expectLine(card.selectorPack.selectorLine);
      expect(card.selectorPack.preIntegrationPrompt_en).toBeTruthy();
      expect(card.selectorPack.preIntegrationPrompt_vi).toBeTruthy();
      expect(card.selectorPack.selectorSignals_en.length).toBeGreaterThanOrEqual(3);
      expect(card.selectorPack.selectorSignals_vi).toHaveLength(
        card.selectorPack.selectorSignals_en.length,
      );
    },
  );

  it.each(punjabiB1FinalIntegrationSelectors)(
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

  it.each(punjabiB1FinalIntegrationSelectors)(
    "$id includes final-readiness and integration-route notes",
    (card) => {
      expect(card.finalReadiness_en).toMatch(
        /ready|final|integration|stability|selector|practice/i,
      );
      expect(card.finalReadiness_vi).toBeTruthy();
      expect(card.integrationRoute_en).toMatch(
        /route|B2|integration|stable|selector/i,
      );
      expect(card.integrationRoute_vi).toBeTruthy();
    },
  );
});
