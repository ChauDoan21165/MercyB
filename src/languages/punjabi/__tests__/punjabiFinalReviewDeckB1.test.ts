import { describe, expect, it } from "vitest";
import {
  punjabiB1FinalReviewDeck,
  type PunjabiB1FinalReviewFocus,
  type PunjabiFinalReviewLine,
} from "../finalReviewDeckB1";

const GURMUKHI_RE = /[\u0A00-\u0A7F]/;
const LATIN_RE = /[a-z]/i;

const REQUIRED_FOCUSES: PunjabiB1FinalReviewFocus[] = [
  "explain_situation",
  "retell_event",
  "clarify_next_steps",
  "service_conversation",
  "workplace_issue",
  "school_community_task",
  "health_service_communication",
  "register_transfer_review",
];

function expectLine(line: PunjabiFinalReviewLine) {
  expect(GURMUKHI_RE.test(line.pa)).toBe(true);
  expect(LATIN_RE.test(line.romanization)).toBe(true);
  expect(line.en.trim().length).toBeGreaterThan(0);
  expect(line.vi.trim().length).toBeGreaterThan(0);
}

describe("Punjabi B1 final review deck - batch", () => {
  it("has a compact useful final review deck", () => {
    expect(punjabiB1FinalReviewDeck.length).toBeGreaterThanOrEqual(8);
    expect(punjabiB1FinalReviewDeck.length).toBeLessThanOrEqual(12);
  });

  it("has unique ids and marks every card B1", () => {
    const ids = punjabiB1FinalReviewDeck.map((card) => card.id);
    expect(new Set(ids).size).toBe(ids.length);

    for (const card of punjabiB1FinalReviewDeck) {
      expect(card.level).toBe("B1");
    }
  });

  it("covers required final review focus areas", () => {
    const seen = new Set(punjabiB1FinalReviewDeck.map((card) => card.focus));

    for (const focus of REQUIRED_FOCUSES) {
      expect(seen.has(focus)).toBe(true);
    }
  });
});

describe("Punjabi B1 final review deck - learner content", () => {
  for (const card of punjabiB1FinalReviewDeck) {
    describe(card.id, () => {
      it("has bilingual final-review framing and Canada-practical context", () => {
        expect(card.title_en.trim().length).toBeGreaterThan(0);
        expect(card.title_vi.trim().length).toBeGreaterThan(0);
        expect(card.reviewGoal_en.trim().length).toBeGreaterThan(0);
        expect(card.reviewGoal_vi.trim().length).toBeGreaterThan(0);
        expect(card.canadaContext.trim().length).toBeGreaterThan(0);
      });

      it("has bilingual checkpoint criteria", () => {
        expect(card.checkpointCriteria_en.length).toBeGreaterThanOrEqual(3);
        expect(card.checkpointCriteria_vi.length).toBe(card.checkpointCriteria_en.length);

        for (const criterion of card.checkpointCriteria_en) {
          expect(criterion.trim().length).toBeGreaterThan(0);
        }

        for (const criterion of card.checkpointCriteria_vi) {
          expect(criterion.trim().length).toBeGreaterThan(0);
        }
      });

      it("has useful language and QA model answers", () => {
        expect(card.usefulLanguage.length).toBeGreaterThanOrEqual(3);

        for (const phrase of card.usefulLanguage) {
          expectLine(phrase);
        }

        expect(card.qa.prompt_en.trim().length).toBeGreaterThan(0);
        expect(card.qa.prompt_vi.trim().length).toBeGreaterThan(0);
        expectLine(card.qa.modelAnswer);
        expectLine(card.qa.followUpQuestion);
      });

      it("includes learner traps and final routing", () => {
        expect(card.commonTraps.length).toBeGreaterThanOrEqual(1);

        for (const trap of card.commonTraps) {
          expect(trap.trap_en.trim().length).toBeGreaterThan(0);
          expect(trap.trap_vi.trim().length).toBeGreaterThan(0);
          expectLine(trap.better);
        }

        expect(card.finalRoute_en.trim().length).toBeGreaterThan(0);
        expect(card.finalRoute_vi.trim().length).toBeGreaterThan(0);
      });

      it("keeps health and public-service examples as language support only", () => {
        const requiresSupportNote =
          card.focus === "health_service_communication" ||
          card.focus === "clarify_next_steps";

        if (!requiresSupportNote) return;

        expect(`${card.reviewGoal_en} ${card.canadaContext} ${card.qa.prompt_en}`).toMatch(
          /language support only|language practice only/i,
        );
        expect(`${card.reviewGoal_vi} ${card.canadaContext} ${card.qa.prompt_vi}`).toMatch(
          /Chỉ hỗ trợ ngôn ngữ|chỉ là luyện ngôn ngữ/i,
        );
      });
    });
  }
});

describe("Punjabi B1 final review deck - scope guardrails", () => {
  it("mentions Shahmukhi only as awareness and defers native review", () => {
    const serialized = JSON.stringify(punjabiB1FinalReviewDeck);

    expect(serialized).toMatch(/Shahmukhi/);
    expect(serialized).toMatch(/awareness/);
    expect(serialized).toMatch(/Native review is deferred/i);
  });
});
