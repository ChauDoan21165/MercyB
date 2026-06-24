import {
  punjabiB1PipelineReadinessSamples,
  type PunjabiB1PipelineReadinessFocus,
  type PunjabiPipelineReadinessLine,
} from "../b1PipelineReadinessSamples";

const requiredFocuses: PunjabiB1PipelineReadinessFocus[] = [
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

const expectLine = (line: PunjabiPipelineReadinessLine) => {
  expect(line.pa).toBeTruthy();
  expect(hasGurmukhi(line.pa)).toBe(true);
  expect(line.romanization).toBeTruthy();
  expect(hasLatin(line.romanization)).toBe(true);
  expect(line.en).toBeTruthy();
  expect(line.vi).toBeTruthy();
};

describe("punjabiB1PipelineReadinessSamples", () => {
  it("is a compact app-consumable B1 pipeline-readiness set with unique ids", () => {
    expect(punjabiB1PipelineReadinessSamples.length).toBeGreaterThanOrEqual(8);
    expect(punjabiB1PipelineReadinessSamples.length).toBeLessThanOrEqual(12);
    expect(new Set(punjabiB1PipelineReadinessSamples.map((card) => card.id)).size).toBe(
      punjabiB1PipelineReadinessSamples.length,
    );
    expect(punjabiB1PipelineReadinessSamples.every((card) => card.level === "B1")).toBe(true);
  });

  it("covers every Wave 46 pipeline-readiness focus", () => {
    const actualFocuses = new Set(
      punjabiB1PipelineReadinessSamples.map((card) => card.focus),
    );

    for (const focus of requiredFocuses) {
      expect(actualFocuses.has(focus)).toBe(true);
    }
  });

  it("keeps guardrail and awareness language visible", () => {
    const serializedCards = JSON.stringify(punjabiB1PipelineReadinessSamples);

    expect(serializedCards).toContain("Language practice only");
    expect(serializedCards).toContain("not medical advice");
    expect(serializedCards).toContain("not legal or financial advice");
    expect(serializedCards).toContain("Shahmukhi");
    expect(serializedCards).toContain("awareness only");
    expect(serializedCards).toContain("Native review is deferred");
  });

  it.each(punjabiB1PipelineReadinessSamples)(
    "$id includes bilingual scenario text and Canada-practical context",
    (card) => {
      expect(card.title_en).toBeTruthy();
      expect(card.title_vi).toBeTruthy();
      expect(card.scenario_en).toBeTruthy();
      expect(card.scenario_vi).toBeTruthy();
      expect(card.canadaContext).toMatch(/Canada|Canadian/i);
    },
  );

  it.each(punjabiB1PipelineReadinessSamples)(
    "$id includes pipeline-readiness lines with Gurmukhi and romanization",
    (card) => {
      expectLine(card.pipelineReadiness.sampleLine);
      expect(card.pipelineReadiness.pipelineReadinessPrompt_en).toBeTruthy();
      expect(card.pipelineReadiness.pipelineReadinessPrompt_vi).toBeTruthy();
      expect(card.pipelineReadiness.pipelineSignals_en.length).toBeGreaterThanOrEqual(3);
      expect(card.pipelineReadiness.pipelineSignals_vi).toHaveLength(
        card.pipelineReadiness.pipelineSignals_en.length,
      );
    },
  );

  it.each(punjabiB1PipelineReadinessSamples)(
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

  it.each(punjabiB1PipelineReadinessSamples)(
    "$id includes pipeline-readiness, CI-readiness, MR-readiness, and pre-integration guidance",
    (card) => {
      expect(card.ciReadinessNote_en).toMatch(
        /Pipeline-readiness|CI-readiness|MR-readiness|practice|Shahmukhi|Native review/i,
      );
      expect(card.ciReadinessNote_vi).toBeTruthy();
      expect(card.preIntegrationRoute_en).toMatch(
        /route|pre-integration|integration|pipeline|stable/i,
      );
      expect(card.preIntegrationRoute_vi).toBeTruthy();
    },
  );
});
