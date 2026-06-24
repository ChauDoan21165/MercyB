import { describe, expect, it } from "vitest";
import {
  punjabiB1WorkplaceScenarios,
  type PunjabiB1WorkplaceFocus,
  type PunjabiWorkplacePhrase,
} from "../workplaceScenariosB1";

const GURMUKHI_RE = /[\u0A00-\u0A7F]/;
const LATIN_RE = /[a-z]/i;

const REQUIRED_FOCUSES: PunjabiB1WorkplaceFocus[] = [
  "supervisor_clarification",
  "task_handoff",
  "schedule_change",
  "safety_concern",
  "customer_issue",
  "training_question",
  "polite_disagreement",
  "incident_explanation",
];

function expectPhrase(phrase: PunjabiWorkplacePhrase) {
  expect(GURMUKHI_RE.test(phrase.pa)).toBe(true);
  expect(LATIN_RE.test(phrase.romanization)).toBe(true);
  expect(phrase.en.trim().length).toBeGreaterThan(0);
  expect(phrase.vi.trim().length).toBeGreaterThan(0);
}

describe("Punjabi B1 workplace scenarios - batch", () => {
  it("has a compact useful set of B1 workplace scenarios", () => {
    expect(punjabiB1WorkplaceScenarios.length).toBeGreaterThanOrEqual(8);
    expect(punjabiB1WorkplaceScenarios.length).toBeLessThanOrEqual(16);
  });

  it("has unique ids and marks every scenario B1", () => {
    const ids = punjabiB1WorkplaceScenarios.map((scenario) => scenario.id);
    expect(new Set(ids).size).toBe(ids.length);

    for (const scenario of punjabiB1WorkplaceScenarios) {
      expect(scenario.level).toBe("B1");
    }
  });

  it("covers all required workplace focus areas", () => {
    const seen = new Set(punjabiB1WorkplaceScenarios.map((scenario) => scenario.focus));

    for (const focus of REQUIRED_FOCUSES) {
      expect(seen.has(focus)).toBe(true);
    }
  });
});

describe("Punjabi B1 workplace scenarios - learner content", () => {
  for (const scenario of punjabiB1WorkplaceScenarios) {
    describe(scenario.id, () => {
      it("has bilingual title, workplace context, goal, and Canada context", () => {
        expect(scenario.title_en.trim().length).toBeGreaterThan(0);
        expect(scenario.title_vi.trim().length).toBeGreaterThan(0);
        expect(scenario.workplaceContext_en.trim().length).toBeGreaterThan(0);
        expect(scenario.workplaceContext_vi.trim().length).toBeGreaterThan(0);
        expect(scenario.learnerGoal_en.trim().length).toBeGreaterThan(0);
        expect(scenario.learnerGoal_vi.trim().length).toBeGreaterThan(0);
        expect(scenario.canadaContext.trim().length).toBeGreaterThan(0);
      });

      it("has useful phrases with Gurmukhi, romanization, English, and Vietnamese", () => {
        expect(scenario.usefulPhrases.length).toBeGreaterThanOrEqual(3);

        for (const phrase of scenario.usefulPhrases) {
          expectPhrase(phrase);
        }
      });

      it("has a bilingual Gurmukhi model exchange", () => {
        expect(scenario.modelExchange.length).toBeGreaterThanOrEqual(3);

        const speakers = new Set(scenario.modelExchange.map((line) => line.speaker));
        expect(speakers.has("learner")).toBe(true);

        for (const line of scenario.modelExchange) {
          expectPhrase(line);
        }
      });

      it("has an escalation phrase and bilingual follow-up task", () => {
        expectPhrase(scenario.escalationPhrase);
        expect(scenario.followUpTask_en.trim().length).toBeGreaterThan(0);
        expect(scenario.followUpTask_vi.trim().length).toBeGreaterThan(0);
      });

      it("includes common learner traps with better alternatives", () => {
        expect(scenario.commonTraps.length).toBeGreaterThanOrEqual(1);

        for (const trap of scenario.commonTraps) {
          expect(trap.trap_en.trim().length).toBeGreaterThan(0);
          expect(trap.trap_vi.trim().length).toBeGreaterThan(0);
          expectPhrase(trap.better);
        }
      });
    });
  }
});
