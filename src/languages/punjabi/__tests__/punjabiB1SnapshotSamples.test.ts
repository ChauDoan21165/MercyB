import {
  punjabiB1SnapshotSamples,
  type PunjabiB1SnapshotFocus,
  type PunjabiSnapshotLine,
} from "../b1SnapshotSamples";

const requiredFocuses: PunjabiB1SnapshotFocus[] = [
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

const expectLine = (line: PunjabiSnapshotLine) => {
  expect(line.pa).toBeTruthy();
  expect(hasGurmukhi(line.pa)).toBe(true);
  expect(line.romanization).toBeTruthy();
  expect(hasLatin(line.romanization)).toBe(true);
  expect(line.en).toBeTruthy();
  expect(line.vi).toBeTruthy();
};

describe("punjabiB1SnapshotSamples", () => {
  it("is a compact app-consumable B1 snapshot set with unique ids", () => {
    expect(punjabiB1SnapshotSamples.length).toBeGreaterThanOrEqual(8);
    expect(punjabiB1SnapshotSamples.length).toBeLessThanOrEqual(12);
    expect(new Set(punjabiB1SnapshotSamples.map((card) => card.id)).size).toBe(
      punjabiB1SnapshotSamples.length,
    );
    expect(punjabiB1SnapshotSamples.every((card) => card.level === "B1")).toBe(true);
  });

  it("covers every Wave 51 snapshot focus", () => {
    const actualFocuses = new Set(punjabiB1SnapshotSamples.map((card) => card.focus));

    for (const focus of requiredFocuses) {
      expect(actualFocuses.has(focus)).toBe(true);
    }
  });

  it("keeps guardrail and awareness language visible", () => {
    const serializedCards = JSON.stringify(punjabiB1SnapshotSamples);

    expect(serializedCards).toContain("Language practice only");
    expect(serializedCards).toContain("not medical advice");
    expect(serializedCards).toContain("not legal or financial advice");
    expect(serializedCards).toContain("Shahmukhi");
    expect(serializedCards).toContain("awareness only");
    expect(serializedCards).toContain("Native review is deferred");
  });

  it.each(punjabiB1SnapshotSamples)(
    "$id includes bilingual scenario text and Canada-practical context",
    (card) => {
      expect(card.title_en).toBeTruthy();
      expect(card.title_vi).toBeTruthy();
      expect(card.scenario_en).toBeTruthy();
      expect(card.scenario_vi).toBeTruthy();
      expect(card.canadaContext).toMatch(/Canada|Canadian/i);
    },
  );

  it.each(punjabiB1SnapshotSamples)(
    "$id includes snapshot lines with Gurmukhi and romanization",
    (card) => {
      expectLine(card.preA11SnapshotCheck.sampleLine);
      expect(card.preA11SnapshotCheck.snapshotPrompt_en).toBeTruthy();
      expect(card.preA11SnapshotCheck.snapshotPrompt_vi).toBeTruthy();
      expect(card.preA11SnapshotCheck.snapshotSignals_en.length).toBeGreaterThanOrEqual(3);
      expect(card.preA11SnapshotCheck.snapshotSignals_vi).toHaveLength(
        card.preA11SnapshotCheck.snapshotSignals_en.length,
      );
    },
  );

  it.each(punjabiB1SnapshotSamples)(
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

  it.each(punjabiB1SnapshotSamples)(
    "$id includes pre-snapshot, runner-readiness, pipeline-readiness, and pre-integration guidance",
    (card) => {
      expect(card.runnerReadinessNote_en).toMatch(
        /pre-A11 snapshot|runner-readiness|pipeline-readiness|practice|Shahmukhi|Native review/i,
      );
      expect(card.runnerReadinessNote_vi).toBeTruthy();
      expect(card.preIntegrationRoute_en).toMatch(
        /route|pre-integration|integration|snapshot|stable/i,
      );
      expect(card.preIntegrationRoute_vi).toBeTruthy();
    },
  );
});
