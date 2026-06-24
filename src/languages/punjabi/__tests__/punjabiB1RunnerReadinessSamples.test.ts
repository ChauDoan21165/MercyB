import {
  punjabiB1RunnerReadinessSamples,
  type PunjabiB1RunnerReadinessFocus,
  type PunjabiRunnerReadinessLine,
} from "../b1RunnerReadinessSamples";

const requiredFocuses: PunjabiB1RunnerReadinessFocus[] = [
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

const expectLine = (line: PunjabiRunnerReadinessLine) => {
  expect(line.pa).toBeTruthy();
  expect(hasGurmukhi(line.pa)).toBe(true);
  expect(line.romanization).toBeTruthy();
  expect(hasLatin(line.romanization)).toBe(true);
  expect(line.en).toBeTruthy();
  expect(line.vi).toBeTruthy();
};

describe("punjabiB1RunnerReadinessSamples", () => {
  it("is a compact app-consumable B1 runner-readiness set with unique ids", () => {
    expect(punjabiB1RunnerReadinessSamples.length).toBeGreaterThanOrEqual(8);
    expect(punjabiB1RunnerReadinessSamples.length).toBeLessThanOrEqual(12);
    expect(new Set(punjabiB1RunnerReadinessSamples.map((card) => card.id)).size).toBe(
      punjabiB1RunnerReadinessSamples.length,
    );
    expect(punjabiB1RunnerReadinessSamples.every((card) => card.level === "B1")).toBe(true);
  });

  it("covers every Wave 47 runner-readiness focus", () => {
    const actualFocuses = new Set(
      punjabiB1RunnerReadinessSamples.map((card) => card.focus),
    );

    for (const focus of requiredFocuses) {
      expect(actualFocuses.has(focus)).toBe(true);
    }
  });

  it("keeps guardrail and awareness language visible", () => {
    const serializedCards = JSON.stringify(punjabiB1RunnerReadinessSamples);

    expect(serializedCards).toContain("Language practice only");
    expect(serializedCards).toContain("not medical advice");
    expect(serializedCards).toContain("not legal or financial advice");
    expect(serializedCards).toContain("Shahmukhi");
    expect(serializedCards).toContain("awareness only");
    expect(serializedCards).toContain("Native review is deferred");
  });

  it.each(punjabiB1RunnerReadinessSamples)(
    "$id includes bilingual scenario text and Canada-practical context",
    (card) => {
      expect(card.title_en).toBeTruthy();
      expect(card.title_vi).toBeTruthy();
      expect(card.scenario_en).toBeTruthy();
      expect(card.scenario_vi).toBeTruthy();
      expect(card.canadaContext).toMatch(/Canada|Canadian/i);
    },
  );

  it.each(punjabiB1RunnerReadinessSamples)(
    "$id includes runner-readiness lines with Gurmukhi and romanization",
    (card) => {
      expectLine(card.runnerReadiness.sampleLine);
      expect(card.runnerReadiness.runnerReadinessPrompt_en).toBeTruthy();
      expect(card.runnerReadiness.runnerReadinessPrompt_vi).toBeTruthy();
      expect(card.runnerReadiness.runnerSignals_en.length).toBeGreaterThanOrEqual(3);
      expect(card.runnerReadiness.runnerSignals_vi).toHaveLength(
        card.runnerReadiness.runnerSignals_en.length,
      );
    },
  );

  it.each(punjabiB1RunnerReadinessSamples)(
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

  it.each(punjabiB1RunnerReadinessSamples)(
    "$id includes runner-readiness, pipeline-readiness, CI-readiness, and pre-integration guidance",
    (card) => {
      expect(card.pipelineReadinessNote_en).toMatch(
        /Runner-readiness|pipeline-readiness|CI-readiness|practice|Shahmukhi|Native review/i,
      );
      expect(card.pipelineReadinessNote_vi).toBeTruthy();
      expect(card.preIntegrationRoute_en).toMatch(
        /route|pre-integration|integration|runner|stable/i,
      );
      expect(card.preIntegrationRoute_vi).toBeTruthy();
    },
  );
});
