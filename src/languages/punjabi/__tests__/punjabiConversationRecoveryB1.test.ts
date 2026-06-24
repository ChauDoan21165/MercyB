import {
  punjabiB1ConversationRecovery,
  type PunjabiB1ConversationRecoveryFocus,
  type PunjabiConversationRecoveryLine,
} from "../conversationRecoveryB1";

const requiredFocuses: PunjabiB1ConversationRecoveryFocus[] = [
  "recover_after_misunderstanding",
  "ask_for_clarification",
  "restate_issue",
  "repair_tone",
  "continue_service_conversation",
  "continue_workplace_conversation",
  "continue_housing_conversation",
  "continue_school_community_conversation",
  "register_mistake_repair",
];

const hasGurmukhi = (text: string) => /[\u0A00-\u0A7F]/u.test(text);
const hasLatin = (text: string) => /[A-Za-z]/.test(text);

const expectLine = (line: PunjabiConversationRecoveryLine) => {
  expect(line.pa).toBeTruthy();
  expect(hasGurmukhi(line.pa)).toBe(true);
  expect(line.romanization).toBeTruthy();
  expect(hasLatin(line.romanization)).toBe(true);
  expect(line.en).toBeTruthy();
  expect(line.vi).toBeTruthy();
};

describe("punjabiB1ConversationRecovery", () => {
  it("is a compact app-consumable B1 recovery pack with unique ids", () => {
    expect(punjabiB1ConversationRecovery.length).toBeGreaterThanOrEqual(8);
    expect(punjabiB1ConversationRecovery.length).toBeLessThanOrEqual(12);
    expect(
      new Set(punjabiB1ConversationRecovery.map((card) => card.id)).size,
    ).toBe(punjabiB1ConversationRecovery.length);
    expect(
      punjabiB1ConversationRecovery.every((card) => card.level === "B1"),
    ).toBe(true);
  });

  it("covers every Wave 24 recovery focus", () => {
    const actualFocuses = new Set(
      punjabiB1ConversationRecovery.map((card) => card.focus),
    );
    for (const focus of requiredFocuses) {
      expect(actualFocuses.has(focus)).toBe(true);
    }
  });

  it("keeps guardrail language visible for support-only use", () => {
    const serializedPack = JSON.stringify(punjabiB1ConversationRecovery);

    expect(serializedPack).toContain("Language practice only");
    expect(serializedPack).toContain("language practice only");
    expect(serializedPack).toContain("not medical advice");
    expect(serializedPack).toContain("not legal or financial advice");
    expect(serializedPack).toContain("Shahmukhi");
    expect(serializedPack).toContain("awareness only");
    expect(serializedPack).toContain("Native review is deferred");
  });

  it.each(punjabiB1ConversationRecovery)(
    "$id includes bilingual scenario text and Canada-practical context",
    (card) => {
      expect(card.title_en).toBeTruthy();
      expect(card.title_vi).toBeTruthy();
      expect(card.scenario_en).toBeTruthy();
      expect(card.scenario_vi).toBeTruthy();
      expect(card.canadaContext).toMatch(/Canada|Canadian/i);
    },
  );

  it.each(punjabiB1ConversationRecovery)(
    "$id includes recovery lines with Gurmukhi and romanization",
    (card) => {
      expectLine(card.recoveryPack.recoveryLine);
      expect(card.recoveryPack.finalHardeningPrompt_en).toBeTruthy();
      expect(card.recoveryPack.finalHardeningPrompt_vi).toBeTruthy();
      expect(card.recoveryPack.recoverySignals_en.length).toBeGreaterThanOrEqual(3);
      expect(card.recoveryPack.recoverySignals_vi).toHaveLength(
        card.recoveryPack.recoverySignals_en.length,
      );
    },
  );

  it.each(punjabiB1ConversationRecovery)(
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

  it.each(punjabiB1ConversationRecovery)(
    "$id includes final-hardening and export-readiness notes",
    (card) => {
      expect(card.exportReadiness_en).toMatch(/hardening|export|ready/i);
      expect(card.exportReadiness_vi).toBeTruthy();
      expect(card.finalQa_en).toMatch(/QA|review|Gurmukhi|clarity/i);
      expect(card.finalQa_vi).toBeTruthy();
    },
  );
});
