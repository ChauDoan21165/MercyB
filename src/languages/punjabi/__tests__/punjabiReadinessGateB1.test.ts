import { describe, expect, it } from "vitest";
import {
  punjabiB1ReadinessGate,
  type PunjabiB1ReadinessFocus,
  type PunjabiReadinessLine,
} from "../readinessGateB1";

const GURMUKHI_RE = /[\u0A00-\u0A7F]/;
const LATIN_RE = /[a-z]/i;

const REQUIRED_FOCUSES: PunjabiB1ReadinessFocus[] = [
  "explain_situation",
  "retell_event",
  "ask_clarification",
  "workplace_service",
  "housing_school",
  "healthcare",
  "transfer_register",
  "routing_decision",
];

function expectLine(line: PunjabiReadinessLine) {
  expect(GURMUKHI_RE.test(line.pa)).toBe(true);
  expect(LATIN_RE.test(line.romanization)).toBe(true);
  expect(line.en.trim().length).toBeGreaterThan(0);
  expect(line.vi.trim().length).toBeGreaterThan(0);
}

describe("Punjabi B1 readiness gate - batch", () => {
  it("has a compact useful readiness gate set", () => {
    expect(punjabiB1ReadinessGate.length).toBeGreaterThanOrEqual(8);
    expect(punjabiB1ReadinessGate.length).toBeLessThanOrEqual(12);
  });

  it("has unique ids and marks every item B1", () => {
    const ids = punjabiB1ReadinessGate.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);

    for (const item of punjabiB1ReadinessGate) {
      expect(item.level).toBe("B1");
    }
  });

  it("covers required readiness focus areas", () => {
    const seen = new Set(punjabiB1ReadinessGate.map((item) => item.focus));

    for (const focus of REQUIRED_FOCUSES) {
      expect(seen.has(focus)).toBe(true);
    }
  });
});

describe("Punjabi B1 readiness gate - learner content", () => {
  for (const item of punjabiB1ReadinessGate) {
    describe(item.id, () => {
      it("has bilingual checkpoint framing and Canada-practical context", () => {
        expect(item.checkpoint_en.trim().length).toBeGreaterThan(0);
        expect(item.checkpoint_vi.trim().length).toBeGreaterThan(0);
        expect(item.task_en.trim().length).toBeGreaterThan(0);
        expect(item.task_vi.trim().length).toBeGreaterThan(0);
        expect(item.canadaContext.trim().length).toBeGreaterThan(0);
      });

      it("has bilingual readiness success signals", () => {
        expect(item.successSignals_en.length).toBeGreaterThanOrEqual(3);
        expect(item.successSignals_vi.length).toBe(item.successSignals_en.length);

        for (const signal of item.successSignals_en) {
          expect(signal.trim().length).toBeGreaterThan(0);
        }

        for (const signal of item.successSignals_vi) {
          expect(signal.trim().length).toBeGreaterThan(0);
        }
      });

      it("has useful Gurmukhi language, romanization, English, and Vietnamese", () => {
        expect(item.languageTools.length).toBeGreaterThanOrEqual(3);

        for (const phrase of item.languageTools) {
          expectLine(phrase);
        }

        expectLine(item.sampleResponse);
      });

      it("includes learner traps and routing guidance", () => {
        expect(item.commonTraps.length).toBeGreaterThanOrEqual(1);

        for (const trap of item.commonTraps) {
          expect(trap.trap_en.trim().length).toBeGreaterThan(0);
          expect(trap.trap_vi.trim().length).toBeGreaterThan(0);
          expectLine(trap.better);
        }

        expect(item.routing.ifLearnerCan_en.trim().length).toBeGreaterThan(0);
        expect(item.routing.ifLearnerCan_vi.trim().length).toBeGreaterThan(0);
        expect(item.routing.routeTo_en.trim().length).toBeGreaterThan(0);
        expect(item.routing.routeTo_vi.trim().length).toBeGreaterThan(0);
      });

      it("keeps health and public-service examples as language support only", () => {
        const requiresSupportNote =
          item.focus === "healthcare" || item.focus === "ask_clarification";

        if (!requiresSupportNote) return;

        expect(`${item.checkpoint_en} ${item.task_en}`).toMatch(/language support only/i);
        expect(`${item.checkpoint_vi} ${item.task_vi}`).toMatch(/Chỉ hỗ trợ ngôn ngữ/i);
      });
    });
  }
});

describe("Punjabi B1 readiness gate - scope guardrails", () => {
  it("mentions Shahmukhi only as awareness and defers native review", () => {
    const serialized = JSON.stringify(punjabiB1ReadinessGate);

    expect(serialized).toMatch(/Shahmukhi/);
    expect(serialized).toMatch(/awareness only/i);
    expect(serialized).toMatch(/Native review is deferred/i);
  });
});
