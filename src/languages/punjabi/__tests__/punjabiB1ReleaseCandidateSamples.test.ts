import {
  punjabiB1ReleaseCandidateSamples,
  type PunjabiB1ReleaseCandidateFocus,
  type PunjabiReleaseCandidateLine,
} from "../b1ReleaseCandidateSamples";

const requiredFocuses: PunjabiB1ReleaseCandidateFocus[] = [
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

const expectLine = (line: PunjabiReleaseCandidateLine) => {
  expect(line.pa).toBeTruthy();
  expect(hasGurmukhi(line.pa)).toBe(true);
  expect(line.romanization).toBeTruthy();
  expect(hasLatin(line.romanization)).toBe(true);
  expect(line.en).toBeTruthy();
  expect(line.vi).toBeTruthy();
};

describe("punjabiB1ReleaseCandidateSamples", () => {
  it("is a compact app-consumable B1 release-candidate set with unique ids", () => {
    expect(punjabiB1ReleaseCandidateSamples.length).toBeGreaterThanOrEqual(8);
    expect(punjabiB1ReleaseCandidateSamples.length).toBeLessThanOrEqual(12);
    expect(
      new Set(punjabiB1ReleaseCandidateSamples.map((card) => card.id)).size,
    ).toBe(punjabiB1ReleaseCandidateSamples.length);
    expect(punjabiB1ReleaseCandidateSamples.every((card) => card.level === "B1")).toBe(true);
  });

  it("covers every Wave 37 release-candidate focus", () => {
    const actualFocuses = new Set(
      punjabiB1ReleaseCandidateSamples.map((card) => card.focus),
    );
    for (const focus of requiredFocuses) {
      expect(actualFocuses.has(focus)).toBe(true);
    }
  });

  it("keeps guardrail and awareness language visible", () => {
    const serializedCards = JSON.stringify(punjabiB1ReleaseCandidateSamples);

    expect(serializedCards).toContain("Language practice only");
    expect(serializedCards).toContain("not medical advice");
    expect(serializedCards).toContain("not legal or financial advice");
    expect(serializedCards).toContain("Shahmukhi");
    expect(serializedCards).toContain("awareness only");
    expect(serializedCards).toContain("Native review is deferred");
  });

  it.each(punjabiB1ReleaseCandidateSamples)(
    "$id includes bilingual scenario text and Canada-practical context",
    (card) => {
      expect(card.title_en).toBeTruthy();
      expect(card.title_vi).toBeTruthy();
      expect(card.scenario_en).toBeTruthy();
      expect(card.scenario_vi).toBeTruthy();
      expect(card.canadaContext).toMatch(/Canada|Canadian/i);
    },
  );

  it.each(punjabiB1ReleaseCandidateSamples)(
    "$id includes release-candidate lines with Gurmukhi and romanization",
    (card) => {
      expectLine(card.releaseCandidate.sampleLine);
      expect(card.releaseCandidate.releaseCandidatePrompt_en).toBeTruthy();
      expect(card.releaseCandidate.releaseCandidatePrompt_vi).toBeTruthy();
      expect(card.releaseCandidate.readinessSignals_en.length).toBeGreaterThanOrEqual(3);
      expect(card.releaseCandidate.readinessSignals_vi).toHaveLength(
        card.releaseCandidate.readinessSignals_en.length,
      );
    },
  );

  it.each(punjabiB1ReleaseCandidateSamples)(
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

  it.each(punjabiB1ReleaseCandidateSamples)(
    "$id includes closure-validation and pre-integration guidance",
    (card) => {
      expect(card.closureValidationNote_en).toMatch(
        /release-candidate|closure-validation|practice|Shahmukhi|Native review/i,
      );
      expect(card.closureValidationNote_vi).toBeTruthy();
      expect(card.preIntegrationRoute_en).toMatch(
        /route|pre-integration|integration|release-candidate|stable/i,
      );
      expect(card.preIntegrationRoute_vi).toBeTruthy();
    },
  );
});
