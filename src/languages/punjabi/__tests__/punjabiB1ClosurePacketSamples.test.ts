import {
  punjabiB1ClosurePacketSamples,
  type PunjabiB1ClosurePacketFocus,
  type PunjabiClosurePacketLine,
} from "../b1ClosurePacketSamples";

const requiredFocuses: PunjabiB1ClosurePacketFocus[] = [
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

const expectLine = (line: PunjabiClosurePacketLine) => {
  expect(line.pa).toBeTruthy();
  expect(hasGurmukhi(line.pa)).toBe(true);
  expect(line.romanization).toBeTruthy();
  expect(hasLatin(line.romanization)).toBe(true);
  expect(line.en).toBeTruthy();
  expect(line.vi).toBeTruthy();
};

describe("punjabiB1ClosurePacketSamples", () => {
  it("is a compact app-consumable B1 closure packet set with unique ids", () => {
    expect(punjabiB1ClosurePacketSamples.length).toBeGreaterThanOrEqual(8);
    expect(punjabiB1ClosurePacketSamples.length).toBeLessThanOrEqual(12);
    expect(new Set(punjabiB1ClosurePacketSamples.map((card) => card.id)).size).toBe(
      punjabiB1ClosurePacketSamples.length,
    );
    expect(punjabiB1ClosurePacketSamples.every((card) => card.level === "B1")).toBe(true);
  });

  it("covers every Wave 50 closure focus", () => {
    const actualFocuses = new Set(
      punjabiB1ClosurePacketSamples.map((card) => card.focus),
    );

    for (const focus of requiredFocuses) {
      expect(actualFocuses.has(focus)).toBe(true);
    }
  });

  it("keeps guardrail and awareness language visible", () => {
    const serializedCards = JSON.stringify(punjabiB1ClosurePacketSamples);

    expect(serializedCards).toContain("Language practice only");
    expect(serializedCards).toContain("not medical advice");
    expect(serializedCards).toContain("not legal or financial advice");
    expect(serializedCards).toContain("Shahmukhi");
    expect(serializedCards).toContain("awareness only");
    expect(serializedCards).toContain("Native review is deferred");
  });

  it.each(punjabiB1ClosurePacketSamples)(
    "$id includes bilingual scenario text and Canada-practical context",
    (card) => {
      expect(card.title_en).toBeTruthy();
      expect(card.title_vi).toBeTruthy();
      expect(card.scenario_en).toBeTruthy();
      expect(card.scenario_vi).toBeTruthy();
      expect(card.canadaContext).toMatch(/Canada|Canadian/i);
    },
  );

  it.each(punjabiB1ClosurePacketSamples)(
    "$id includes closure lines with Gurmukhi and romanization",
    (card) => {
      expectLine(card.preClosureCheck.sampleLine);
      expect(card.preClosureCheck.closurePrompt_en).toBeTruthy();
      expect(card.preClosureCheck.closurePrompt_vi).toBeTruthy();
      expect(card.preClosureCheck.closureSignals_en.length).toBeGreaterThanOrEqual(3);
      expect(card.preClosureCheck.closureSignals_vi).toHaveLength(
        card.preClosureCheck.closureSignals_en.length,
      );
    },
  );

  it.each(punjabiB1ClosurePacketSamples)(
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

  it.each(punjabiB1ClosurePacketSamples)(
    "$id includes pre-closure, runner-readiness, pipeline-readiness, and pre-integration guidance",
    (card) => {
      expect(card.runnerReadinessNote_en).toMatch(
        /pre-A11 closure|runner-readiness|pipeline-readiness|practice|Shahmukhi|Native review/i,
      );
      expect(card.runnerReadinessNote_vi).toBeTruthy();
      expect(card.preIntegrationRoute_en).toMatch(
        /route|pre-integration|integration|closure|stable/i,
      );
      expect(card.preIntegrationRoute_vi).toBeTruthy();
    },
  );
});
