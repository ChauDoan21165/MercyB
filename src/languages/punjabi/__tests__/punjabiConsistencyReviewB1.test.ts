import {
  punjabiB1ConsistencyReview,
  type PunjabiB1ConsistencyReviewFocus,
  type PunjabiConsistencyReviewLine,
} from "../consistencyReviewB1";

const requiredFocuses: PunjabiB1ConsistencyReviewFocus[] = [
  "explain_situation",
  "retell_event",
  "service_recovery",
  "follow_up_message",
  "workplace_conversation",
  "housing_conversation",
  "school_community_conversation",
  "register_safe_repair",
  "consistency_review",
];

const hasGurmukhi = (text: string) => /[\u0A00-\u0A7F]/u.test(text);
const hasLatin = (text: string) => /[A-Za-z]/.test(text);

const expectLine = (line: PunjabiConsistencyReviewLine) => {
  expect(line.pa).toBeTruthy();
  expect(hasGurmukhi(line.pa)).toBe(true);
  expect(line.romanization).toBeTruthy();
  expect(hasLatin(line.romanization)).toBe(true);
  expect(line.en).toBeTruthy();
  expect(line.vi).toBeTruthy();
};

describe("punjabiB1ConsistencyReview", () => {
  it("is a compact app-consumable B1 review pack with unique ids", () => {
    expect(punjabiB1ConsistencyReview.length).toBeGreaterThanOrEqual(8);
    expect(punjabiB1ConsistencyReview.length).toBeLessThanOrEqual(12);
    expect(
      new Set(punjabiB1ConsistencyReview.map((card) => card.id)).size,
    ).toBe(punjabiB1ConsistencyReview.length);
    expect(
      punjabiB1ConsistencyReview.every((card) => card.level === "B1"),
    ).toBe(true);
  });

  it("covers every Wave 27 consistency focus", () => {
    const actualFocuses = new Set(
      punjabiB1ConsistencyReview.map((card) => card.focus),
    );
    for (const focus of requiredFocuses) {
      expect(actualFocuses.has(focus)).toBe(true);
    }
  });

  it("keeps support-only guardrail language visible", () => {
    const serializedCards = JSON.stringify(punjabiB1ConsistencyReview);

    expect(serializedCards).toContain("Language practice only");
    expect(serializedCards).toContain("language practice only");
    expect(serializedCards).toContain("not medical advice");
    expect(serializedCards).toContain("not legal or financial advice");
    expect(serializedCards).toContain("Shahmukhi");
    expect(serializedCards).toContain("awareness only");
    expect(serializedCards).toContain("Native review is deferred");
  });

  it.each(punjabiB1ConsistencyReview)(
    "$id includes bilingual scenario text and Canada-practical context",
    (card) => {
      expect(card.title_en).toBeTruthy();
      expect(card.title_vi).toBeTruthy();
      expect(card.scenario_en).toBeTruthy();
      expect(card.scenario_vi).toBeTruthy();
      expect(card.canadaContext).toMatch(/Canada|Canadian/i);
    },
  );

  it.each(punjabiB1ConsistencyReview)(
    "$id includes Gurmukhi-primary consistency lines with romanization",
    (card) => {
      expectLine(card.consistencyPack.consistencyLine);
      expect(card.consistencyPack.finalGuardrailPrompt_en).toBeTruthy();
      expect(card.consistencyPack.finalGuardrailPrompt_vi).toBeTruthy();
      expect(card.consistencyPack.consistencySignals_en.length).toBeGreaterThanOrEqual(3);
      expect(card.consistencyPack.consistencySignals_vi).toHaveLength(
        card.consistencyPack.consistencySignals_en.length,
      );
    },
  );

  it.each(punjabiB1ConsistencyReview)(
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

  it.each(punjabiB1ConsistencyReview)(
    "$id includes integration-readiness and final-quality notes",
    (card) => {
      expect(card.integrationReadiness_en).toMatch(
        /ready|integration|stability|consistency|practice/i,
      );
      expect(card.integrationReadiness_vi).toBeTruthy();
      expect(card.finalQuality_en).toMatch(
        /quality|QA|review|consistency|checklist|boundary|Gurmukhi/i,
      );
      expect(card.finalQuality_vi).toBeTruthy();
    },
  );
});
