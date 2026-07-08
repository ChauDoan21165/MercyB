import { describe, it, expect } from "vitest";
import {
  decideTurnCorrection,
  buildDeferredTurnCorrection,
} from "../decisionEngineTurnAdapter";
import {
  createDeferredCorrectionQueue,
  type TimingIntegrationResult,
} from "../../tutor/correctionTimingIntegration";
import type { CorrectionTimingResult } from "../../tutor/teacherMercyCorrectionTiming";

const base = {
  targetLanguage: "en" as const,
  cefrLevel: "A2" as string | null,
  previousCorrectionsThisSession: 0,
};

describe("decisionEngineTurnAdapter — WP-000 wiring (reworked, in tm-int)", () => {
  describe("routing", () => {
    it("SUPPRESS: clean text with no error → suppress, no correction", () => {
      const out = decideTurnCorrection({ ...base, learnerText: "I went to the market.", isCurrentLessonTarget: true });
      expect(out.shouldSuppress).toBe(true);
      expect(out.shouldShowNow).toBe(false);
      expect(out.shouldDefer).toBe(false);
    });

    it("SHOW NOW: on-target correctable error → show immediately", () => {
      const out = decideTurnCorrection({ ...base, learnerText: "I wake up 7 o'clock.", isCurrentLessonTarget: true });
      expect(out.shouldShowNow).toBe(true);
      expect(out.shouldDefer).toBe(false);
      expect(out.shouldSuppress).toBe(false);
      expect(out.correctedText).toBeTruthy();
    });

    it("DEFER: off-target beginner-minor error → defer (not drop), correction preserved", () => {
      const out = decideTurnCorrection({ ...base, learnerText: "I wake up 7 o'clock.", isCurrentLessonTarget: false });
      expect(out.shouldDefer).toBe(true);
      expect(out.shouldShowNow).toBe(false);
      expect(out.decision.action).toBe("DEFER");
      expect(out.correctedText).toBeTruthy();
      expect(out.delayTurns).toBeGreaterThanOrEqual(1);
    });
  });

  describe("HARD REQUIREMENT: a deferred correction RESURFACES on a later turn (not a silent drop)", () => {
    it("enqueue an adapter DEFER, then advanceTurn until it is delivered", () => {
      const out = decideTurnCorrection({ ...base, learnerText: "I wake up 7 o'clock.", isCurrentLessonTarget: false });
      expect(out.shouldDefer).toBe(true);
      const correctedText = out.correctedText!;
      const delay = out.delayTurns;

      const queue = createDeferredCorrectionQueue();
      queue.enqueue({
        learnerText: "I wake up 7 o'clock.",
        correctedText,
        timing: { mode: "DELAYED", reason: out.decision.rationaleEn, reasonCode: out.decision.reasonCode, delayTurns: delay, respectsOneCorrectionMax: true } as CorrectionTimingResult,
        remainingTurns: delay,
      });
      expect(queue.size()).toBe(1);

      let delivered: ReturnType<typeof queue.advanceTurn> = [];
      for (let t = 0; t < delay; t++) {
        expect(queue.size() + delivered.length).toBe(1);
        delivered = queue.advanceTurn();
      }
      expect(delivered).toHaveLength(1);
      expect(delivered[0].correctedText).toBe(correctedText);
      expect(queue.size()).toBe(0);
    });
  });

  describe("BLOCKER 2: needs_ai deferral persists-and-resurfaces the LOCAL correction (never empty, never dropped)", () => {
    // When the decision engine's internal correctWithTutorRules returns needs_ai,
    // its TeacherDecision carries an EMPTY correction. The turn handler must NOT
    // enqueue that empty item (surfaces blank) nor drop it (guard `status==="corrected"`).
    // buildDeferredTurnCorrection carries the guaranteed-corrected LOCAL text instead.
    const needsAiResult = {
      correction: { status: "needs_ai", corrected: "", appliedRuleIds: [] },
      timing: { mode: "DELAYED", reason: "needs AI", reasonCode: "needs_ai_deferred", delayTurns: 1, respectsOneCorrectionMax: true } as CorrectionTimingResult,
      shouldShowNow: false,
      shouldDefer: true,
      shouldSuppress: false,
      enrichment: null,
    } as unknown as TimingIntegrationResult;

    it("the deferred item carries the non-empty LOCAL correction, not the engine's empty needs_ai text", () => {
      const item = buildDeferredTurnCorrection("He said me the news", "He told me the news.", needsAiResult);
      expect(item.correctedText).toBe("He told me the news.");
      expect(item.correctedText).not.toBe(""); // never the engine's empty needs_ai correction
      expect(item.remainingTurns).toBe(1);
    });

    it("a needs_ai deferral RESURFACES the real local correction via advanceTurn (not dropped, not empty)", () => {
      const queue = createDeferredCorrectionQueue();
      queue.enqueue(buildDeferredTurnCorrection("He said me the news", "He told me the news.", needsAiResult));
      expect(queue.size()).toBe(1); // parked, not dropped
      const due = queue.advanceTurn();
      expect(due).toHaveLength(1);
      expect(due[0].correctedText).toBe("He told me the news."); // real correction resurfaces, non-empty
      expect(queue.size()).toBe(0);
    });
  });
});
