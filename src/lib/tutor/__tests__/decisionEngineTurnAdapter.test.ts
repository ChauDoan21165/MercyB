import { describe, it, expect } from "vitest";
import { decideTurnCorrection } from "../decisionEngineTurnAdapter";
import { createDeferredCorrectionQueue } from "../correctionTimingIntegration";
import type { CorrectionTimingResult } from "../teacherMercyCorrectionTiming";

const base = {
  targetLanguage: "en" as const,
  cefrLevel: "A2" as string | null,
  previousCorrectionsThisSession: 0,
};

describe("decisionEngineTurnAdapter — WP-000 wiring", () => {
  describe("routing", () => {
    it("SUPPRESS: clean text with no error → suppress, no correction", () => {
      const out = decideTurnCorrection({ ...base, learnerText: "I went to the market.", isCurrentLessonTarget: true });
      expect(out.shouldSuppress).toBe(true);
      expect(out.shouldShowNow).toBe(false);
      expect(out.shouldDefer).toBe(false);
    });

    it("SHOW NOW: on-target correctable error → show immediately", () => {
      // "I wake up 7 o'clock." is a real correctable error; on-target → CORRECT_NOW.
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
      // Turn N: off-target minor error → the engine DEFERs it.
      const out = decideTurnCorrection({ ...base, learnerText: "I wake up 7 o'clock.", isCurrentLessonTarget: false });
      expect(out.shouldDefer).toBe(true);
      const correctedText = out.correctedText!;
      const delay = out.delayTurns;

      // The turn handler enqueues it on the SAME live deferred-correction queue.
      const queue = createDeferredCorrectionQueue();
      queue.enqueue({
        learnerText: "I wake up 7 o'clock.",
        correctedText,
        timing: { mode: "DELAYED", reason: out.decision.rationaleEn, reasonCode: out.decision.reasonCode, delayTurns: delay, respectsOneCorrectionMax: true } as CorrectionTimingResult,
        remainingTurns: delay,
      });
      expect(queue.size()).toBe(1);

      // Turns N+1 .. N+delay: advance. It must NOT vanish, and it MUST become due.
      let delivered: ReturnType<typeof queue.advanceTurn> = [];
      for (let t = 0; t < delay; t++) {
        expect(queue.size() + delivered.length).toBe(1); // never silently lost
        delivered = queue.advanceTurn();
      }

      // By turn N+delay it is delivered with the exact correction that was deferred.
      expect(delivered).toHaveLength(1);
      expect(delivered[0].correctedText).toBe(correctedText);
      expect(queue.size()).toBe(0); // dequeued on delivery, not dropped
    });

    it("a deferred correction is never dropped before its delay elapses", () => {
      const out = decideTurnCorrection({ ...base, learnerText: "I wake up 7 o'clock.", isCurrentLessonTarget: false });
      const queue = createDeferredCorrectionQueue();
      queue.enqueue({
        learnerText: "x",
        correctedText: out.correctedText!,
        timing: { mode: "DELAYED", reason: "", reasonCode: out.decision.reasonCode, delayTurns: 3, respectsOneCorrectionMax: true } as CorrectionTimingResult,
        remainingTurns: 3,
      });
      expect(queue.advanceTurn()).toHaveLength(0); // turn 1: not yet due, still held
      expect(queue.size()).toBe(1);
      expect(queue.advanceTurn()).toHaveLength(0); // turn 2: still held
      expect(queue.advanceTurn()).toHaveLength(1); // turn 3: delivered
    });
  });
});
