// WP-001 keystone — SHADOW MODE byte-identical regression test.
//
// Proves that prediction-error capture is a strict side-channel: the learner-facing
// decision returned by runTurnWithPredictionCapture is byte-identical whether capture is
// ON or OFF, and identical to calling the underlying decide() directly. Same regression
// pattern as WP-000's wp000FlagOffByteIdentical (toStrictEqual + JSON.stringify equality).
import { describe, it, expect } from "vitest";
import { FEATURE_FLAGS } from "@/lib/featureFlags";
import { runTurnWithPredictionCapture, resolveTurnPrediction } from "@/lib/tm-int/pred/shadowRunner";
import type { TurnFeatures } from "@/lib/tm-int/pred/types";

// A stand-in learner-facing decision. In production this is the real correction turn
// (routeTurnCorrection); here we only need SOME structured value to prove non-mutation.
type Decision = {
  correction: { status: "corrected" | "unchanged" | "needs_ai" | "abstained"; text: string };
  shouldShowNow: boolean;
  meta: { ruleId: string | null; issueCount: number; cefr: "A" | "B" | "C" | "unknown"; onTarget: boolean };
};

const FIXTURES: { name: string; decision: Decision }[] = [
  {
    name: "corrected/clean",
    decision: { correction: { status: "corrected", text: "I went to school yesterday." }, shouldShowNow: true, meta: { ruleId: "l1:past-tense", issueCount: 1, cefr: "B", onTarget: true } },
  },
  {
    name: "unchanged/persistent",
    decision: { correction: { status: "unchanged", text: "She don't like coffee." }, shouldShowNow: false, meta: { ruleId: "l1:sva", issueCount: 3, cefr: "A", onTarget: false } },
  },
  {
    name: "needs_ai",
    decision: { correction: { status: "needs_ai", text: "I bought a head." }, shouldShowNow: true, meta: { ruleId: null, issueCount: 2, cefr: "unknown", onTarget: false } },
  },
];

const extract = (d: Decision): { turnAddress: { sessionId: string; turnIndex: number; msgId: string }; features: TurnFeatures } => ({
  turnAddress: { sessionId: "sess-keystone", turnIndex: 0, msgId: "m0" },
  features: {
    correctionStatus: d.correction.status,
    issueCount: d.meta.issueCount,
    ruleId: d.meta.ruleId,
    cefrBucket: d.meta.cefr,
    isCurrentLessonTarget: d.meta.onTarget,
  },
});

describe("WP-001: prediction capture is byte-identical shadow mode", () => {
  it("the prediction-capture flag defaults OFF", () => {
    expect(FEATURE_FLAGS.TUTOR_PREDICTION_CAPTURE_ENABLED).toBe(false);
  });

  it.each(FIXTURES)("capture ON vs OFF → byte-identical learner-facing decision: $name", ({ decision }) => {
    // Fresh decision object per run so we can prove capture never mutates it.
    const decide = () => JSON.parse(JSON.stringify(decision)) as Decision;

    const off = runTurnWithPredictionCapture(decide, extract, { enabled: false, predictedAtMs: 1_000, emitObservation: false });
    const on = runTurnWithPredictionCapture(decide, extract, { enabled: true, predictedAtMs: 1_000, recorder: () => null, emitObservation: false });
    const raw = decide();

    // Learner-facing value: identical value-for-value AND as serialized bytes.
    expect(on.decision).toStrictEqual(off.decision);
    expect(on.decision).toStrictEqual(raw);
    expect(JSON.stringify(on.decision)).toBe(JSON.stringify(raw));
    expect(JSON.stringify(off.decision)).toBe(JSON.stringify(raw));

    // Capture actually happened when ON, and did not when OFF (proves the flag gates).
    expect(off.prediction).toBeNull();
    expect(on.prediction).not.toBeNull();
    expect(on.prediction?.prediction.predictorVersion).toBe("pred-lut-v1");
  });

  it("resolution is a pure side-channel — returns null when OFF, never affects a caller's value", () => {
    const decide = () => JSON.parse(JSON.stringify(FIXTURES[0].decision)) as Decision;
    const { prediction } = runTurnWithPredictionCapture(decide, extract, { enabled: true, predictedAtMs: 1_000, recorder: () => null, emitObservation: false });
    expect(prediction).not.toBeNull();

    const offResolution = resolveTurnPrediction(prediction!, { resolved: true, outcomeAtMs: 2_000 }, { enabled: false, recorder: () => null, emitObservation: false });
    expect(offResolution).toBeNull();

    const onResolution = resolveTurnPrediction(prediction!, { resolved: true, outcomeAtMs: 2_000 }, { enabled: true, recorder: () => null, emitObservation: false });
    expect(onResolution?.hindsightRejected).toBe(false);
  });
});
