import {
  punjabiB1SmokeDeck,
  type PunjabiB1SmokeDeckFocus,
  type PunjabiSmokeDeckLine,
} from "../smokeDeckB1";

const requiredFocuses: PunjabiB1SmokeDeckFocus[] = [
  "explain_situation",
  "retell_event",
  "clarify_next_steps",
  "service_conversation",
  "workplace_issue",
  "housing_issue",
  "school_community_task",
  "register_aware_request",
];

const hasGurmukhi = (text: string) => /[\u0A00-\u0A7F]/u.test(text);
const hasLatin = (text: string) => /[A-Za-z]/.test(text);

const expectLine = (line: PunjabiSmokeDeckLine) => {
  expect(line.pa).toBeTruthy();
  expect(hasGurmukhi(line.pa)).toBe(true);
  expect(line.romanization).toBeTruthy();
  expect(hasLatin(line.romanization)).toBe(true);
  expect(line.en).toBeTruthy();
  expect(line.vi).toBeTruthy();
};

describe("punjabiB1SmokeDeck", () => {
  it("is a compact app-consumable B1 deck with unique ids", () => {
    expect(punjabiB1SmokeDeck.length).toBeGreaterThanOrEqual(8);
    expect(punjabiB1SmokeDeck.length).toBeLessThanOrEqual(12);
    expect(new Set(punjabiB1SmokeDeck.map((card) => card.id)).size).toBe(
      punjabiB1SmokeDeck.length,
    );
    expect(punjabiB1SmokeDeck.every((card) => card.level === "B1")).toBe(true);
  });

  it("covers every Wave 19 smoke-deck focus", () => {
    const actualFocuses = new Set(punjabiB1SmokeDeck.map((card) => card.focus));
    for (const focus of requiredFocuses) {
      expect(actualFocuses.has(focus)).toBe(true);
    }
  });

  it("keeps clarification tasks inside language support guardrails", () => {
    const clarifyCard = punjabiB1SmokeDeck.find(
      (card) => card.focus === "clarify_next_steps",
    );

    expect(clarifyCard?.scenario_en).toContain("Language support only");
    expect(clarifyCard?.scenario_en).toContain("not legal or medical advice");
    expect(clarifyCard?.scenario_vi).toContain("Chỉ hỗ trợ ngôn ngữ");
    expect(clarifyCard?.scenario_vi).toContain(
      "không phải tư vấn pháp lý hoặc y tế",
    );
    expect(clarifyCard?.canadaContext).toContain("language practice only");
  });

  it.each(punjabiB1SmokeDeck)(
    "$id includes bilingual scenario and Canada-practical context",
    (card) => {
      expect(card.title_en).toBeTruthy();
      expect(card.title_vi).toBeTruthy();
      expect(card.scenario_en).toBeTruthy();
      expect(card.scenario_vi).toBeTruthy();
      expect(card.canadaContext).toMatch(/Canada|Canadian/i);
    },
  );

  it.each(punjabiB1SmokeDeck)(
    "$id includes Gurmukhi-primary useful language with romanization",
    (card) => {
      expect(card.usefulLanguage.length).toBeGreaterThanOrEqual(3);
      for (const line of card.usefulLanguage) {
        expectLine(line);
      }
    },
  );

  it.each(punjabiB1SmokeDeck)("$id includes final QA signals", (card) => {
    expect(card.qa.smokePrompt_en).toBeTruthy();
    expect(card.qa.smokePrompt_vi).toBeTruthy();
    expectLine(card.qa.sampleAnswer);
    expect(card.qa.passSignals_en.length).toBeGreaterThanOrEqual(3);
    expect(card.qa.passSignals_vi).toHaveLength(card.qa.passSignals_en.length);
  });

  it.each(punjabiB1SmokeDeck)(
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

  it.each(punjabiB1SmokeDeck)(
    "$id includes integration-readiness notes",
    (card) => {
      expect(card.integrationReadiness_en).toBeTruthy();
      expect(card.integrationReadiness_vi).toBeTruthy();
    },
  );

  it("mentions Shahmukhi only as awareness and defers native review", () => {
    const serializedDeck = JSON.stringify(punjabiB1SmokeDeck);

    expect(serializedDeck).toContain("Shahmukhi");
    expect(serializedDeck).toContain("awareness");
    expect(serializedDeck).toContain("Native review is deferred");
    expect(serializedDeck).not.toContain("native-reviewed");
    expect(serializedDeck).not.toContain("native approved");
  });
});
