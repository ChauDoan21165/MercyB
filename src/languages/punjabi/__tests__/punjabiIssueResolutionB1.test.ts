import { describe, expect, it } from "vitest";
import {
  punjabiB1IssueResolutionPack,
  type PunjabiB1IssueResolutionFocus,
  type PunjabiIssueResolutionLine,
} from "../issueResolutionB1";

const GURMUKHI_RE = /[\u0A00-\u0A7F]/;
const LATIN_RE = /[a-z]/i;

const REQUIRED_FOCUSES: PunjabiB1IssueResolutionFocus[] = [
  "explain_problem",
  "describe_happened",
  "ask_options",
  "clarify_next_step",
  "polite_follow_up",
  "workplace_resolution",
  "housing_school_resolution",
  "service_readiness_review",
];

function expectLine(line: PunjabiIssueResolutionLine) {
  expect(GURMUKHI_RE.test(line.pa)).toBe(true);
  expect(LATIN_RE.test(line.romanization)).toBe(true);
  expect(line.en.trim().length).toBeGreaterThan(0);
  expect(line.vi.trim().length).toBeGreaterThan(0);
}

describe("Punjabi B1 issue resolution pack - batch", () => {
  it("has a compact useful issue-resolution pack", () => {
    expect(punjabiB1IssueResolutionPack.length).toBeGreaterThanOrEqual(8);
    expect(punjabiB1IssueResolutionPack.length).toBeLessThanOrEqual(12);
  });

  it("has unique ids and marks every card B1", () => {
    const ids = punjabiB1IssueResolutionPack.map((card) => card.id);
    expect(new Set(ids).size).toBe(ids.length);

    for (const card of punjabiB1IssueResolutionPack) {
      expect(card.level).toBe("B1");
    }
  });

  it("covers required issue-resolution focus areas", () => {
    const seen = new Set(punjabiB1IssueResolutionPack.map((card) => card.focus));

    for (const focus of REQUIRED_FOCUSES) {
      expect(seen.has(focus)).toBe(true);
    }
  });
});

describe("Punjabi B1 issue resolution pack - learner content", () => {
  for (const card of punjabiB1IssueResolutionPack) {
    describe(card.id, () => {
      it("has bilingual issue framing and Canada-practical context", () => {
        expect(card.title_en.trim().length).toBeGreaterThan(0);
        expect(card.title_vi.trim().length).toBeGreaterThan(0);
        expect(card.situation_en.trim().length).toBeGreaterThan(0);
        expect(card.situation_vi.trim().length).toBeGreaterThan(0);
        expect(card.canadaContext.trim().length).toBeGreaterThan(0);
        expect(card.resolutionGoal_en.trim().length).toBeGreaterThan(0);
        expect(card.resolutionGoal_vi.trim().length).toBeGreaterThan(0);
      });

      it("has bilingual resolution steps", () => {
        expect(card.steps_en.length).toBeGreaterThanOrEqual(3);
        expect(card.steps_vi.length).toBe(card.steps_en.length);

        for (const step of card.steps_en) {
          expect(step.trim().length).toBeGreaterThan(0);
        }

        for (const step of card.steps_vi) {
          expect(step.trim().length).toBeGreaterThan(0);
        }
      });

      it("has useful Gurmukhi language and model resolution", () => {
        expect(card.usefulLanguage.length).toBeGreaterThanOrEqual(3);

        for (const phrase of card.usefulLanguage) {
          expectLine(phrase);
        }

        expectLine(card.modelResolution);
      });

      it("includes learner traps and navigation/remediation guidance", () => {
        expect(card.commonTraps.length).toBeGreaterThanOrEqual(1);

        for (const trap of card.commonTraps) {
          expect(trap.trap_en.trim().length).toBeGreaterThan(0);
          expect(trap.trap_vi.trim().length).toBeGreaterThan(0);
          expectLine(trap.better);
        }

        expect(card.navigation.ifResolved_en.trim().length).toBeGreaterThan(0);
        expect(card.navigation.ifResolved_vi.trim().length).toBeGreaterThan(0);
        expect(card.navigation.ifStuck_en.trim().length).toBeGreaterThan(0);
        expect(card.navigation.ifStuck_vi.trim().length).toBeGreaterThan(0);
        expect(card.navigation.remediation_en.trim().length).toBeGreaterThan(0);
        expect(card.navigation.remediation_vi.trim().length).toBeGreaterThan(0);
      });

      it("keeps public-service examples as language support only", () => {
        if (card.focus !== "clarify_next_step") return;

        expect(`${card.situation_en} ${card.canadaContext}`).toMatch(/language support only/i);
        expect(`${card.situation_vi} ${card.canadaContext}`).toMatch(/Chỉ hỗ trợ ngôn ngữ/i);
      });
    });
  }
});

describe("Punjabi B1 issue resolution pack - scope guardrails", () => {
  it("mentions Shahmukhi only as awareness and defers native review", () => {
    const serialized = JSON.stringify(punjabiB1IssueResolutionPack);

    expect(serialized).toMatch(/Shahmukhi/);
    expect(serialized).toMatch(/awareness/);
    expect(serialized).toMatch(/Native review is deferred/i);
  });
});
