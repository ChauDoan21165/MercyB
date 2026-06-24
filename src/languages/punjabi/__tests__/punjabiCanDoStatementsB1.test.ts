import { describe, expect, it } from "vitest";
import {
  punjabiB1CanDoStatements,
  type PunjabiB1CanDoFocus,
  type PunjabiCanDoLine,
} from "../canDoStatementsB1";

const GURMUKHI_RE = /[\u0A00-\u0A7F]/;
const LATIN_RE = /[a-z]/i;

const REQUIRED_FOCUSES: PunjabiB1CanDoFocus[] = [
  "explain_situation",
  "retell_event",
  "clarify_next_steps",
  "service_conversation",
  "workplace_issue",
  "housing_school_issue",
  "register_aware_request",
  "readiness_routing",
];

function expectLine(line: PunjabiCanDoLine) {
  expect(GURMUKHI_RE.test(line.pa)).toBe(true);
  expect(LATIN_RE.test(line.romanization)).toBe(true);
  expect(line.en.trim().length).toBeGreaterThan(0);
  expect(line.vi.trim().length).toBeGreaterThan(0);
}

describe("Punjabi B1 can-do statements - batch", () => {
  it("has a compact useful set of B1 can-do statements", () => {
    expect(punjabiB1CanDoStatements.length).toBeGreaterThanOrEqual(8);
    expect(punjabiB1CanDoStatements.length).toBeLessThanOrEqual(12);
  });

  it("has unique ids and marks every statement B1", () => {
    const ids = punjabiB1CanDoStatements.map((statement) => statement.id);
    expect(new Set(ids).size).toBe(ids.length);

    for (const statement of punjabiB1CanDoStatements) {
      expect(statement.level).toBe("B1");
    }
  });

  it("covers required B1 can-do focus areas", () => {
    const seen = new Set(punjabiB1CanDoStatements.map((statement) => statement.focus));

    for (const focus of REQUIRED_FOCUSES) {
      expect(seen.has(focus)).toBe(true);
    }
  });
});

describe("Punjabi B1 can-do statements - learner content", () => {
  for (const statement of punjabiB1CanDoStatements) {
    describe(statement.id, () => {
      it("has bilingual can-do framing and Canada-practical context", () => {
        expect(statement.title_en.trim().length).toBeGreaterThan(0);
        expect(statement.title_vi.trim().length).toBeGreaterThan(0);
        expect(statement.learnerContext_en.trim().length).toBeGreaterThan(0);
        expect(statement.learnerContext_vi.trim().length).toBeGreaterThan(0);
        expect(statement.canadaContext.trim().length).toBeGreaterThan(0);
        expect(statement.checkpoint.canDo_en.trim().length).toBeGreaterThan(0);
        expect(statement.checkpoint.canDo_vi.trim().length).toBeGreaterThan(0);
      });

      it("has evidence prompts, readiness signals, and routing", () => {
        expect(statement.checkpoint.evidencePrompt_en.trim().length).toBeGreaterThan(0);
        expect(statement.checkpoint.evidencePrompt_vi.trim().length).toBeGreaterThan(0);
        expect(statement.checkpoint.readyWhen_en.length).toBeGreaterThanOrEqual(3);
        expect(statement.checkpoint.readyWhen_vi.length).toBe(
          statement.checkpoint.readyWhen_en.length,
        );
        expect(statement.checkpoint.routeIfReady_en.trim().length).toBeGreaterThan(0);
        expect(statement.checkpoint.routeIfReady_vi.trim().length).toBeGreaterThan(0);
        expect(statement.checkpoint.routeIfNeedsPractice_en.trim().length).toBeGreaterThan(0);
        expect(statement.checkpoint.routeIfNeedsPractice_vi.trim().length).toBeGreaterThan(0);
      });

      it("has useful Gurmukhi language and model evidence", () => {
        expect(statement.usefulLanguage.length).toBeGreaterThanOrEqual(3);

        for (const phrase of statement.usefulLanguage) {
          expectLine(phrase);
        }

        expectLine(statement.modelEvidence);
      });

      it("includes common learner traps", () => {
        expect(statement.commonTraps.length).toBeGreaterThanOrEqual(1);

        for (const trap of statement.commonTraps) {
          expect(trap.trap_en.trim().length).toBeGreaterThan(0);
          expect(trap.trap_vi.trim().length).toBeGreaterThan(0);
          expectLine(trap.better);
        }
      });

      it("marks health, legal, and public-service examples as language support only", () => {
        if (statement.focus !== "clarify_next_steps") return;

        expect(`${statement.learnerContext_en} ${statement.checkpoint.canDo_en}`).toMatch(
          /language support only/i,
        );
        expect(`${statement.learnerContext_vi} ${statement.checkpoint.canDo_vi}`).toMatch(
          /Chỉ hỗ trợ ngôn ngữ/i,
        );
      });
    });
  }
});

describe("Punjabi B1 can-do statements - scope guardrails", () => {
  it("mentions Shahmukhi only as awareness and defers native review", () => {
    const serialized = JSON.stringify(punjabiB1CanDoStatements);

    expect(serialized).toMatch(/Shahmukhi/);
    expect(serialized).toMatch(/awareness only/i);
    expect(serialized).toMatch(/Native review is deferred/i);
  });
});
