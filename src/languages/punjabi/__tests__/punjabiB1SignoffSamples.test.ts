import {
  punjabiB1SignoffSamples,
  type PunjabiB1SignoffStyle,
} from "../b1SignoffSamples";

const requiredFocuses = [
  "situation_explanation",
  "event_retelling",
  "clarification",
  "service_recovery",
  "issue_resolution",
  "follow_up_message",
  "workplace_task",
  "housing_school_community",
  "register_safe_repair",
] as const;

const requiredStyles: PunjabiB1SignoffStyle[] = [
  "pre_a11_signoff",
  "pre_a11_seal",
  "pre_a11_snapshot",
  "pre_merge",
  "qa",
  "pre_integration",
  "readiness_check",
];

const hasGurmukhi = (text: string) => /[\u0A00-\u0A7F]/u.test(text);
const hasLatin = (text: string) => /[A-Za-z]/.test(text);

describe("punjabiB1SignoffSamples", () => {
  it("is a compact app-consumable B1 signoff set with unique ids", () => {
    expect(punjabiB1SignoffSamples.length).toBeGreaterThanOrEqual(8);
    expect(punjabiB1SignoffSamples.length).toBeLessThanOrEqual(12);
    expect(new Set(punjabiB1SignoffSamples.map((card) => card.id)).size).toBe(
      punjabiB1SignoffSamples.length,
    );
    expect(punjabiB1SignoffSamples.every((card) => card.level === "B1")).toBe(true);
  });

  it("covers every Wave 53 signoff focus", () => {
    const actualFocuses = new Set(punjabiB1SignoffSamples.map((card) => card.focus));

    for (const focus of requiredFocuses) {
      expect(actualFocuses.has(focus)).toBe(true);
    }
  });

  it("covers signoff, seal, snapshot, merge, QA, pre-integration, and readiness styles", () => {
    const styles = new Set(punjabiB1SignoffSamples.map((card) => card.style));
    for (const style of requiredStyles) {
      expect(styles.has(style), `missing style ${style}`).toBe(true);
    }
  });

  it("keeps guardrail and awareness language visible", () => {
    const serializedCards = JSON.stringify(punjabiB1SignoffSamples);

    expect(serializedCards).toContain("Language practice only");
    expect(serializedCards).toContain("not medical advice");
    expect(serializedCards).toContain("not legal or financial advice");
    expect(serializedCards).toContain("Shahmukhi");
    expect(serializedCards).toContain("awareness only");
    expect(serializedCards).toContain("Native review is deferred");
  });

  it.each(punjabiB1SignoffSamples)(
    "$id includes bilingual scenario text and Canada-practical context",
    (card) => {
      expect(card.title_en).toBeTruthy();
      expect(card.title_vi).toBeTruthy();
      expect(card.scenario_en).toBeTruthy();
      expect(card.scenario_vi).toBeTruthy();
      expect(card.canadaContext).toMatch(/Canada|Canadian/i);
    },
  );

  it.each(punjabiB1SignoffSamples)(
    "$id includes signoff lines with Gurmukhi and romanization",
    (card) => {
      expect(hasGurmukhi(card.preA11SignoffCheck.sampleLine.pa)).toBe(true);
      expect(hasLatin(card.preA11SignoffCheck.sampleLine.romanization)).toBe(true);
      expect(card.preA11SignoffCheck.signoffPrompt_en).toBeTruthy();
      expect(card.preA11SignoffCheck.signoffPrompt_vi).toBeTruthy();
      expect(card.preA11SignoffCheck.signoffSignals_en.length).toBeGreaterThanOrEqual(3);
      expect(card.preA11SignoffCheck.signoffSignals_vi).toHaveLength(
        card.preA11SignoffCheck.signoffSignals_en.length,
      );
    },
  );

  it.each(punjabiB1SignoffSamples)(
    "$id includes common learner traps and better alternatives",
    (card) => {
      expect(card.commonTraps.length).toBeGreaterThanOrEqual(1);

      for (const trap of card.commonTraps) {
        expect(trap.trap_en).toBeTruthy();
        expect(trap.trap_vi).toBeTruthy();
        expect(hasGurmukhi(trap.better.pa)).toBe(true);
        expect(hasLatin(trap.better.romanization)).toBe(true);
      }
    },
  );

  it.each(punjabiB1SignoffSamples)(
    "$id includes pre-signoff, runner-readiness, pre-merge, and pre-integration guidance",
    (card) => {
      expect(card.runnerReadinessNote_en).toMatch(
        /pre-A11 signoff|runner-readiness|pipeline-readiness|practice|Shahmukhi|Native review/i,
      );
      expect(card.runnerReadinessNote_vi).toBeTruthy();
      expect(card.preIntegrationRoute_en).toMatch(
        /route|pre-integration|integration|signoff|stable/i,
      );
      expect(card.preIntegrationRoute_vi).toBeTruthy();
    },
  );
});
