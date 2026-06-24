import { describe, expect, it } from "vitest";
import {
  punjabiB1EvidenceReceiptSamples,
  punjabiB1EvidenceReceiptScope,
  type PunjabiEvidenceReceiptLine,
  type PunjabiB1EvidenceReceiptFocus,
} from "../b1EvidenceReceiptSamples";

const GURMUKHI_RE = /[\u0A00-\u0A7F]/;
const LATIN_RE = /[a-z]/i;

const REQUIRED_FOCUSES: PunjabiB1EvidenceReceiptFocus[] = [
  "explain_situation",
  "retell_event",
  "clarify_next_steps",
  "service_recovery",
  "issue_resolution",
  "follow_up_message",
  "workplace_housing_school_community",
  "register_safe_repair",
  "evidence_receipt_signoff",
];

function expectLine(line: PunjabiEvidenceReceiptLine) {
  expect(GURMUKHI_RE.test(line.pa)).toBe(true);
  expect(LATIN_RE.test(line.romanization)).toBe(true);
  expect(line.en.trim().length).toBeGreaterThan(0);
  expect(line.vi.trim().length).toBeGreaterThan(0);
}

describe("Punjabi B1 evidence receipt samples - batch", () => {
  it("has a compact useful evidence receipt pack", () => {
    expect(punjabiB1EvidenceReceiptSamples.length).toBeGreaterThanOrEqual(8);
    expect(punjabiB1EvidenceReceiptSamples.length).toBeLessThanOrEqual(10);
  });

  it("has unique ids and marks every card B1", () => {
    const ids = punjabiB1EvidenceReceiptSamples.map((card) => card.id);
    expect(new Set(ids).size).toBe(ids.length);

    for (const card of punjabiB1EvidenceReceiptSamples) {
      expect(card.level).toBe("B1");
    }
  });

  it("covers the required evidence receipt focus areas", () => {
    const seen = new Set(punjabiB1EvidenceReceiptSamples.map((card) => card.focus));

    for (const focus of REQUIRED_FOCUSES) {
      expect(seen.has(focus)).toBe(true);
    }
  });
});

describe("Punjabi B1 evidence receipt samples - learner content", () => {
  for (const card of punjabiB1EvidenceReceiptSamples) {
    describe(card.id, () => {
      it("has bilingual evidence receipt framing and Canada context", () => {
        expect(card.title_en.trim().length).toBeGreaterThan(0);
        expect(card.title_vi.trim().length).toBeGreaterThan(0);
        expect(card.evidenceReceiptPurpose_en.trim().length).toBeGreaterThan(0);
        expect(card.evidenceReceiptPurpose_vi.trim().length).toBeGreaterThan(0);
        expect(card.canadaContext.trim().length).toBeGreaterThan(0);
        expect(card.evidenceReceiptNote_en.trim().length).toBeGreaterThan(0);
        expect(card.evidenceReceiptNote_vi.trim().length).toBeGreaterThan(0);
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

      it("includes learner traps and keeps evidence receipt repair language concrete", () => {
        expect(card.commonTraps.length).toBeGreaterThanOrEqual(1);

        for (const trap of card.commonTraps) {
          expect(trap.trap_en.trim().length).toBeGreaterThan(0);
          expect(trap.trap_vi.trim().length).toBeGreaterThan(0);
          expectLine(trap.better);
        }

        if (card.focus === "service_recovery" || card.focus === "issue_resolution") {
          expect(`${card.evidenceReceiptPurpose_en} ${card.evidenceReceiptPurpose_vi} ${card.qa.prompt_en}`).toMatch(
            /correct|refund|repair|replacement|adjust/i,
          );
        }
      });

      it("keeps register-safe and signoff items clearly evidence-receipt-ready", () => {
        if (card.focus !== "register_safe_repair" && card.focus !== "evidence_receipt_signoff") return;

        const serialized = JSON.stringify(card);
        expect(serialized).toMatch(/evidence receipt|evidence-receipt/i);

        if (card.focus === "register_safe_repair") {
          expect(serialized).toMatch(/repair|request|clarification/i);
          return;
        }

        expect(serialized).toMatch(/pre-A11/i);
        expect(serialized).toMatch(/Shahmukhi/);
        expect(serialized).toMatch(/sign-off|signoff/i);
      });
    });
  }
});

describe("Punjabi B1 evidence receipt scope", () => {
  it("states deferred native review and Shahmukhi awareness", () => {
    const serialized = JSON.stringify({
      scope: punjabiB1EvidenceReceiptScope,
      samples: punjabiB1EvidenceReceiptSamples,
    });

    expect(serialized).toMatch(/Native review is deferred/i);
    expect(serialized).toMatch(/Shahmukhi/);
    expect(serialized).toMatch(/awareness only/i);
    expect(serialized).toMatch(/pre-A11/i);
  });
});
