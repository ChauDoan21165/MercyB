import { describe, expect, it } from "vitest";
import {
  punjabiB1FollowUpMessages,
  type PunjabiB1FollowUpFocus,
  type PunjabiFollowUpLine,
} from "../followUpMessagesB1";

const GURMUKHI_RE = /[\u0A00-\u0A7F]/;
const LATIN_RE = /[a-z]/i;

const REQUIRED_FOCUSES: PunjabiB1FollowUpFocus[] = [
  "workplace_update",
  "school_next_step",
  "housing_repair",
  "clinic_clarification",
  "public_service_document",
  "community_program",
  "thank_and_confirm",
  "readiness_remediation",
];

function expectLine(line: PunjabiFollowUpLine) {
  expect(GURMUKHI_RE.test(line.pa)).toBe(true);
  expect(LATIN_RE.test(line.romanization)).toBe(true);
  expect(line.en.trim().length).toBeGreaterThan(0);
  expect(line.vi.trim().length).toBeGreaterThan(0);
}

describe("Punjabi B1 follow-up messages - batch", () => {
  it("has a compact useful follow-up message set", () => {
    expect(punjabiB1FollowUpMessages.length).toBeGreaterThanOrEqual(8);
    expect(punjabiB1FollowUpMessages.length).toBeLessThanOrEqual(12);
  });

  it("has unique ids and marks every message B1", () => {
    const ids = punjabiB1FollowUpMessages.map((message) => message.id);
    expect(new Set(ids).size).toBe(ids.length);

    for (const message of punjabiB1FollowUpMessages) {
      expect(message.level).toBe("B1");
    }
  });

  it("covers required follow-up focus areas", () => {
    const seen = new Set(punjabiB1FollowUpMessages.map((message) => message.focus));

    for (const focus of REQUIRED_FOCUSES) {
      expect(seen.has(focus)).toBe(true);
    }
  });
});

describe("Punjabi B1 follow-up messages - learner content", () => {
  for (const message of punjabiB1FollowUpMessages) {
    describe(message.id, () => {
      it("has bilingual message framing and Canada-practical context", () => {
        expect(message.title_en.trim().length).toBeGreaterThan(0);
        expect(message.title_vi.trim().length).toBeGreaterThan(0);
        expect(message.context_en.trim().length).toBeGreaterThan(0);
        expect(message.context_vi.trim().length).toBeGreaterThan(0);
        expect(message.canadaContext.trim().length).toBeGreaterThan(0);
        expect(message.messagePurpose_en.trim().length).toBeGreaterThan(0);
        expect(message.messagePurpose_vi.trim().length).toBeGreaterThan(0);
      });

      it("has bilingual message moves", () => {
        expect(message.messageMoves_en.length).toBeGreaterThanOrEqual(3);
        expect(message.messageMoves_vi.length).toBe(message.messageMoves_en.length);
      });

      it("has useful Gurmukhi language and a model message", () => {
        expect(message.usefulLanguage.length).toBeGreaterThanOrEqual(3);

        for (const phrase of message.usefulLanguage) {
          expectLine(phrase);
        }

        expectLine(message.modelMessage);
      });

      it("includes traps and final-quality review/remediation guidance", () => {
        expect(message.commonTraps.length).toBeGreaterThanOrEqual(1);

        for (const trap of message.commonTraps) {
          expect(trap.trap_en.trim().length).toBeGreaterThan(0);
          expect(trap.trap_vi.trim().length).toBeGreaterThan(0);
          expectLine(trap.better);
        }

        expect(message.review.qualityCheck_en.length).toBeGreaterThanOrEqual(3);
        expect(message.review.qualityCheck_vi.length).toBe(message.review.qualityCheck_en.length);
        expect(message.review.ifClear_en.trim().length).toBeGreaterThan(0);
        expect(message.review.ifClear_vi.trim().length).toBeGreaterThan(0);
        expect(message.review.remediation_en.trim().length).toBeGreaterThan(0);
        expect(message.review.remediation_vi.trim().length).toBeGreaterThan(0);
      });

      it("keeps clinic and public-service examples as language support only", () => {
        const requiresSupportNote =
          message.focus === "clinic_clarification" ||
          message.focus === "public_service_document";

        if (!requiresSupportNote) return;

        expect(`${message.context_en} ${message.canadaContext}`).toMatch(
          /language support only|language practice only/i,
        );
        expect(`${message.context_vi} ${message.canadaContext}`).toMatch(
          /Chỉ hỗ trợ ngôn ngữ|luyện ngôn ngữ/i,
        );
      });
    });
  }
});

describe("Punjabi B1 follow-up messages - scope guardrails", () => {
  it("mentions Shahmukhi only as awareness and defers native review", () => {
    const serialized = JSON.stringify(punjabiB1FollowUpMessages);

    expect(serialized).toMatch(/Shahmukhi/);
    expect(serialized).toMatch(/awareness/);
    expect(serialized).toMatch(/Native review is deferred/i);
  });
});
