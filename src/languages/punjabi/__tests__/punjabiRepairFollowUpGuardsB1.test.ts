import {
  punjabiB1RepairFollowUpGuards,
  type PunjabiB1RepairFollowUpGuardFocus,
  type PunjabiRepairFollowUpGuardLine,
} from "../repairFollowUpGuardsB1";

const requiredFocuses: PunjabiB1RepairFollowUpGuardFocus[] = [
  "clarify_next_steps",
  "restate_issue",
  "repair_misunderstanding",
  "follow_up_polite",
  "workplace_conversation",
  "housing_conversation",
  "school_community_conversation",
  "service_conversation",
  "register_mistake_repair",
];

const hasGurmukhi = (text: string) => /[\u0A00-\u0A7F]/u.test(text);
const hasLatin = (text: string) => /[A-Za-z]/.test(text);

const expectLine = (line: PunjabiRepairFollowUpGuardLine) => {
  expect(line.pa).toBeTruthy();
  expect(hasGurmukhi(line.pa)).toBe(true);
  expect(line.romanization).toBeTruthy();
  expect(hasLatin(line.romanization)).toBe(true);
  expect(line.en).toBeTruthy();
  expect(line.vi).toBeTruthy();
};

describe("punjabiB1RepairFollowUpGuards", () => {
  it("is a compact app-consumable B1 guard pack with unique ids", () => {
    expect(punjabiB1RepairFollowUpGuards.length).toBeGreaterThanOrEqual(8);
    expect(punjabiB1RepairFollowUpGuards.length).toBeLessThanOrEqual(12);
    expect(new Set(punjabiB1RepairFollowUpGuards.map((card) => card.id)).size).toBe(
      punjabiB1RepairFollowUpGuards.length,
    );
    expect(
      punjabiB1RepairFollowUpGuards.every((card) => card.level === "B1"),
    ).toBe(true);
  });

  it("covers every Wave 25 guard focus", () => {
    const actualFocuses = new Set(
      punjabiB1RepairFollowUpGuards.map((card) => card.focus),
    );
    for (const focus of requiredFocuses) {
      expect(actualFocuses.has(focus)).toBe(true);
    }
  });

  it("keeps support-only guardrail language visible", () => {
    const serializedCards = JSON.stringify(punjabiB1RepairFollowUpGuards);

    expect(serializedCards).toContain("Language practice only");
    expect(serializedCards).toContain("language practice only");
    expect(serializedCards).toContain("not medical advice");
    expect(serializedCards).toContain("not legal or financial advice");
    expect(serializedCards).toContain("Shahmukhi");
    expect(serializedCards).toContain("awareness only");
    expect(serializedCards).toContain("Native review is deferred");
  });

  it.each(punjabiB1RepairFollowUpGuards)(
    "$id includes bilingual scenario text and Canada-practical context",
    (card) => {
      expect(card.title_en).toBeTruthy();
      expect(card.title_vi).toBeTruthy();
      expect(card.scenario_en).toBeTruthy();
      expect(card.scenario_vi).toBeTruthy();
      expect(card.canadaContext).toMatch(/Canada|Canadian/i);
    },
  );

  it.each(punjabiB1RepairFollowUpGuards)(
    "$id includes Gurmukhi-primary guard lines with romanization",
    (card) => {
      expectLine(card.guardPack.guardLine);
      expect(card.guardPack.finalSafetyPrompt_en).toBeTruthy();
      expect(card.guardPack.finalSafetyPrompt_vi).toBeTruthy();
      expect(card.guardPack.guardSignals_en.length).toBeGreaterThanOrEqual(3);
      expect(card.guardPack.guardSignals_vi).toHaveLength(
        card.guardPack.guardSignals_en.length,
      );
    },
  );

  it.each(punjabiB1RepairFollowUpGuards)(
    "$id includes common traps and repairs",
    (card) => {
      expect(card.commonTraps.length).toBeGreaterThanOrEqual(1);
      for (const trap of card.commonTraps) {
        expect(trap.trap_en).toBeTruthy();
        expect(trap.trap_vi).toBeTruthy();
        expectLine(trap.guard);
      }
    },
  );

  it.each(punjabiB1RepairFollowUpGuards)(
    "$id includes export-readiness and quality notes",
    (card) => {
      expect(card.exportReadiness_en).toMatch(/ready|export|safety|practice/i);
      expect(card.exportReadiness_vi).toBeTruthy();
      expect(card.finalQuality_en).toMatch(/quality|QA|review|Gurmukhi/i);
      expect(card.finalQuality_vi).toBeTruthy();
    },
  );
});
