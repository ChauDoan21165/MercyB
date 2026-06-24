import { describe, expect, it } from "vitest";
import {
  punjabiB1LearnerJourney,
  type PunjabiB1LearnerJourneyFocus,
  type PunjabiLearnerJourneyLine,
} from "../learnerJourneyB1";

const GURMUKHI_RE = /[\u0A00-\u0A7F]/;
const LATIN_RE = /[a-z]/i;

const REQUIRED_FOCUSES: PunjabiB1LearnerJourneyFocus[] = [
  "situation_explanation",
  "event_retelling",
  "clarification_strategy",
  "service_conversation",
  "workplace_task",
  "housing_school_community",
  "register_aware_request",
  "handoff_readiness",
];

function expectLine(line: PunjabiLearnerJourneyLine) {
  expect(GURMUKHI_RE.test(line.pa)).toBe(true);
  expect(LATIN_RE.test(line.romanization)).toBe(true);
  expect(line.en.trim().length).toBeGreaterThan(0);
  expect(line.vi.trim().length).toBeGreaterThan(0);
}

describe("Punjabi B1 learner journey - batch", () => {
  it("has a compact useful learner journey", () => {
    expect(punjabiB1LearnerJourney.length).toBeGreaterThanOrEqual(8);
    expect(punjabiB1LearnerJourney.length).toBeLessThanOrEqual(12);
  });

  it("has unique ordered ids and marks every step B1", () => {
    const ids = punjabiB1LearnerJourney.map((step) => step.id);
    expect(new Set(ids).size).toBe(ids.length);

    const orders = punjabiB1LearnerJourney.map((step) => step.order);
    expect(new Set(orders).size).toBe(orders.length);
    expect([...orders].sort((a, b) => a - b)).toEqual(orders);

    for (const step of punjabiB1LearnerJourney) {
      expect(step.level).toBe("B1");
    }
  });

  it("covers required learner journey focus areas", () => {
    const seen = new Set(punjabiB1LearnerJourney.map((step) => step.focus));

    for (const focus of REQUIRED_FOCUSES) {
      expect(seen.has(focus)).toBe(true);
    }
  });
});

describe("Punjabi B1 learner journey - learner content", () => {
  for (const step of punjabiB1LearnerJourney) {
    describe(step.id, () => {
      it("has bilingual journey framing and Canada-practical context", () => {
        expect(step.title_en.trim().length).toBeGreaterThan(0);
        expect(step.title_vi.trim().length).toBeGreaterThan(0);
        expect(step.journeyMoment_en.trim().length).toBeGreaterThan(0);
        expect(step.journeyMoment_vi.trim().length).toBeGreaterThan(0);
        expect(step.canadaContext.trim().length).toBeGreaterThan(0);
      });

      it("has bilingual checkpoint and readiness evidence", () => {
        expect(step.checkpoint.canDo_en.trim().length).toBeGreaterThan(0);
        expect(step.checkpoint.canDo_vi.trim().length).toBeGreaterThan(0);
        expect(step.checkpoint.learnerAction_en.trim().length).toBeGreaterThan(0);
        expect(step.checkpoint.learnerAction_vi.trim().length).toBeGreaterThan(0);
        expect(step.checkpoint.readyEvidence_en.length).toBeGreaterThanOrEqual(3);
        expect(step.checkpoint.readyEvidence_vi.length).toBe(
          step.checkpoint.readyEvidence_en.length,
        );
      });

      it("has useful Gurmukhi language and a handoff line", () => {
        expect(step.usefulLanguage.length).toBeGreaterThanOrEqual(3);

        for (const phrase of step.usefulLanguage) {
          expectLine(phrase);
        }

        expectLine(step.handoffLine);
      });

      it("includes learner traps and next-step routing", () => {
        expect(step.commonTraps.length).toBeGreaterThanOrEqual(1);

        for (const trap of step.commonTraps) {
          expect(trap.trap_en.trim().length).toBeGreaterThan(0);
          expect(trap.trap_vi.trim().length).toBeGreaterThan(0);
          expectLine(trap.better);
        }

        expect(step.nextStep_en.trim().length).toBeGreaterThan(0);
        expect(step.nextStep_vi.trim().length).toBeGreaterThan(0);
      });

      it("keeps public-service examples as language support only", () => {
        if (step.focus !== "clarification_strategy") return;

        expect(`${step.journeyMoment_en} ${step.canadaContext}`).toMatch(/language support only/i);
        expect(`${step.journeyMoment_vi} ${step.canadaContext}`).toMatch(/Chỉ hỗ trợ ngôn ngữ/i);
      });
    });
  }
});

describe("Punjabi B1 learner journey - scope guardrails", () => {
  it("mentions Shahmukhi only as awareness and defers native review", () => {
    const serialized = JSON.stringify(punjabiB1LearnerJourney);

    expect(serialized).toMatch(/Shahmukhi/);
    expect(serialized).toMatch(/awareness/);
    expect(serialized).toMatch(/Native review is deferred/i);
  });
});
