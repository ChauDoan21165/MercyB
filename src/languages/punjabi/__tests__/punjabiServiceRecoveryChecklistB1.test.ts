import {
  punjabiB1ServiceRecoveryChecklist,
  type PunjabiB1ServiceRecoveryChecklistFocus,
  type PunjabiServiceRecoveryChecklistLine,
} from "../serviceRecoveryChecklistB1";

const requiredFocuses: PunjabiB1ServiceRecoveryChecklistFocus[] = [
  "clarify_issue",
  "restate_facts",
  "ask_next_steps",
  "polite_follow_up",
  "repair_misunderstanding",
  "workplace_conversation",
  "housing_conversation",
  "school_community_conversation",
  "service_conversation",
];

const hasGurmukhi = (text: string) => /[\u0A00-\u0A7F]/u.test(text);
const hasLatin = (text: string) => /[A-Za-z]/.test(text);

const expectLine = (line: PunjabiServiceRecoveryChecklistLine) => {
  expect(line.pa).toBeTruthy();
  expect(hasGurmukhi(line.pa)).toBe(true);
  expect(line.romanization).toBeTruthy();
  expect(hasLatin(line.romanization)).toBe(true);
  expect(line.en).toBeTruthy();
  expect(line.vi).toBeTruthy();
};

describe("punjabiB1ServiceRecoveryChecklist", () => {
  it("is a compact app-consumable B1 checklist pack with unique ids", () => {
    expect(punjabiB1ServiceRecoveryChecklist.length).toBeGreaterThanOrEqual(8);
    expect(punjabiB1ServiceRecoveryChecklist.length).toBeLessThanOrEqual(12);
    expect(
      new Set(punjabiB1ServiceRecoveryChecklist.map((card) => card.id)).size,
    ).toBe(punjabiB1ServiceRecoveryChecklist.length);
    expect(
      punjabiB1ServiceRecoveryChecklist.every((card) => card.level === "B1"),
    ).toBe(true);
  });

  it("covers every Wave 26 checklist focus", () => {
    const actualFocuses = new Set(
      punjabiB1ServiceRecoveryChecklist.map((card) => card.focus),
    );
    for (const focus of requiredFocuses) {
      expect(actualFocuses.has(focus)).toBe(true);
    }
  });

  it("keeps support-only guardrail language visible", () => {
    const serializedCards = JSON.stringify(punjabiB1ServiceRecoveryChecklist);

    expect(serializedCards).toContain("Language practice only");
    expect(serializedCards).toContain("language practice only");
    expect(serializedCards).toContain("not medical advice");
    expect(serializedCards).toContain("not legal or financial advice");
    expect(serializedCards).toContain("Shahmukhi");
    expect(serializedCards).toContain("awareness only");
    expect(serializedCards).toContain("Native review is deferred");
  });

  it.each(punjabiB1ServiceRecoveryChecklist)(
    "$id includes bilingual scenario text and Canada-practical context",
    (card) => {
      expect(card.title_en).toBeTruthy();
      expect(card.title_vi).toBeTruthy();
      expect(card.scenario_en).toBeTruthy();
      expect(card.scenario_vi).toBeTruthy();
      expect(card.canadaContext).toMatch(/Canada|Canadian/i);
    },
  );

  it.each(punjabiB1ServiceRecoveryChecklist)(
    "$id includes Gurmukhi-primary checklist lines with romanization",
    (card) => {
      expectLine(card.checklistPack.checklistLine);
      expect(card.checklistPack.finalStabilityPrompt_en).toBeTruthy();
      expect(card.checklistPack.finalStabilityPrompt_vi).toBeTruthy();
      expect(card.checklistPack.checklistSignals_en.length).toBeGreaterThanOrEqual(3);
      expect(card.checklistPack.checklistSignals_vi).toHaveLength(
        card.checklistPack.checklistSignals_en.length,
      );
    },
  );

  it.each(punjabiB1ServiceRecoveryChecklist)(
    "$id includes common traps and repairs",
    (card) => {
      expect(card.commonTraps.length).toBeGreaterThanOrEqual(1);
      for (const trap of card.commonTraps) {
        expect(trap.trap_en).toBeTruthy();
        expect(trap.trap_vi).toBeTruthy();
        expectLine(trap.repair);
      }
    },
  );

  it.each(punjabiB1ServiceRecoveryChecklist)(
    "$id includes export-readiness and quality notes",
    (card) => {
      expect(card.exportReadiness_en).toMatch(
        /ready|export|stability|boundary|checklist|practice/i,
      );
      expect(card.exportReadiness_vi).toBeTruthy();
      expect(card.finalQuality_en).toMatch(
        /quality|QA|review|checklist|boundary|regression|Gurmukhi/i,
      );
      expect(card.finalQuality_vi).toBeTruthy();
    },
  );
});
