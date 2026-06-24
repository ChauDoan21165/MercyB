import {
  punjabiB1MrReadinessEvidence,
  type PunjabiB1MrReadinessFocus,
  type PunjabiMrReadinessLine,
} from "../b1MrReadinessEvidence";

const requiredFocuses: PunjabiB1MrReadinessFocus[] = [
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

const expectLine = (line: PunjabiMrReadinessLine) => {
  expect(line.pa).toBeTruthy();
  expect(hasGurmukhi(line.pa)).toBe(true);
  expect(line.romanization).toBeTruthy();
  expect(hasLatin(line.romanization)).toBe(true);
  expect(line.en).toBeTruthy();
  expect(line.vi).toBeTruthy();
};

describe("punjabiB1MrReadinessEvidence", () => {
  it("is a compact app-consumable B1 MR-readiness evidence set with unique ids", () => {
    expect(punjabiB1MrReadinessEvidence.length).toBeGreaterThanOrEqual(8);
    expect(punjabiB1MrReadinessEvidence.length).toBeLessThanOrEqual(12);
    expect(new Set(punjabiB1MrReadinessEvidence.map((card) => card.id)).size).toBe(
      punjabiB1MrReadinessEvidence.length,
    );
    expect(punjabiB1MrReadinessEvidence.every((card) => card.level === "B1")).toBe(true);
  });

  it("covers every Wave 44 MR-readiness focus", () => {
    const actualFocuses = new Set(
      punjabiB1MrReadinessEvidence.map((card) => card.focus),
    );

    for (const focus of requiredFocuses) {
      expect(actualFocuses.has(focus)).toBe(true);
    }
  });

  it("keeps guardrail and awareness language visible", () => {
    const serializedCards = JSON.stringify(punjabiB1MrReadinessEvidence);

    expect(serializedCards).toContain("Language practice only");
    expect(serializedCards).toContain("not medical advice");
    expect(serializedCards).toContain("not legal or financial advice");
    expect(serializedCards).toContain("Shahmukhi");
    expect(serializedCards).toContain("awareness only");
    expect(serializedCards).toContain("Native review is deferred");
  });

  it.each(punjabiB1MrReadinessEvidence)(
    "$id includes bilingual scenario text and Canada-practical context",
    (card) => {
      expect(card.title_en).toBeTruthy();
      expect(card.title_vi).toBeTruthy();
      expect(card.scenario_en).toBeTruthy();
      expect(card.scenario_vi).toBeTruthy();
      expect(card.canadaContext).toMatch(/Canada|Canadian/i);
    },
  );

  it.each(punjabiB1MrReadinessEvidence)(
    "$id includes MR-readiness evidence lines with Gurmukhi and romanization",
    (card) => {
      expectLine(card.mrReadiness.sampleLine);
      expect(card.mrReadiness.mrReadinessPrompt_en).toBeTruthy();
      expect(card.mrReadiness.mrReadinessPrompt_vi).toBeTruthy();
      expect(card.mrReadiness.evidenceSignals_en.length).toBeGreaterThanOrEqual(3);
      expect(card.mrReadiness.evidenceSignals_vi).toHaveLength(
        card.mrReadiness.evidenceSignals_en.length,
      );
    },
  );

  it.each(punjabiB1MrReadinessEvidence)(
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

  it.each(punjabiB1MrReadinessEvidence)(
    "$id includes MR-readiness, final-freeze, final-lock, and pre-integration guidance",
    (card) => {
      expect(card.finalFreezeNote_en).toMatch(
        /MR-readiness|final-freeze|final-lock|practice|Shahmukhi|Native review/i,
      );
      expect(card.finalFreezeNote_vi).toBeTruthy();
      expect(card.preIntegrationRoute_en).toMatch(
        /route|pre-integration|integration|evidence|stable/i,
      );
      expect(card.preIntegrationRoute_vi).toBeTruthy();
    },
  );
});
