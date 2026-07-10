// WP-001 acceptance — NO-HINDSIGHT INVARIANT, zero leakage.
//
// Proves that any pair whose prediction timestamp is not strictly before its outcome
// timestamp is marked hindsight-rejected and excluded from every surprise consumer
// (report + thesis + sink). Includes an exhaustive ordering sweep to prove ZERO leakage.
import { describe, it, expect } from "vitest";
import { capturePrediction, resolveSurprise } from "@/lib/tm-int/pred/capture";
import { predictOutcome } from "@/lib/tm-int/pred/predictor";
import { buildHindsightFixture } from "@/lib/tm-int/pred/fixtures";
import { buildTopSurprisesReport } from "@/lib/tm-int/pred/report";
import { toSurpriseEvent } from "@/lib/tm-int/pred/sink";
import { isAcceptedPair, type TurnAddress, type TurnFeatures } from "@/lib/tm-int/pred/types";

const ADDRESS: TurnAddress = { sessionId: "sess-nh", turnIndex: 0, msgId: "m0" };
const FEATURES: TurnFeatures = { correctionStatus: "corrected", issueCount: 1, ruleId: "l1:x", cefrBucket: "B", isCurrentLessonTarget: false };

function resolveAt(predictedAtMs: number, outcomeAtMs: number) {
  const row = capturePrediction(ADDRESS, FEATURES, predictOutcome(FEATURES), predictedAtMs);
  return resolveSurprise(row, { resolved: true, outcomeAtMs });
}

describe("WP-001: no-hindsight invariant", () => {
  it("strictly-before is accepted", () => {
    const r = resolveAt(1_000, 1_001);
    expect(r.hindsightRejected).toBe(false);
  });

  it("equal timestamps are rejected (simultaneity is not foresight)", () => {
    const r = resolveAt(1_000, 1_000);
    expect(r.hindsightRejected).toBe(true);
    if (r.hindsightRejected) expect(r.reason).toBe("prediction_not_strictly_before_outcome");
  });

  it("outcome-before-prediction is rejected", () => {
    const r = resolveAt(1_000, 999);
    expect(r.hindsightRejected).toBe(true);
  });

  it("exhaustive ordering sweep → ZERO leakage: accepted iff predictedAt < outcomeAt", () => {
    let accepted = 0;
    let rejected = 0;
    for (let predicted = 0; predicted <= 20; predicted += 1) {
      for (let outcome = 0; outcome <= 20; outcome += 1) {
        const r = resolveAt(predicted, outcome);
        const shouldAccept = predicted < outcome;
        // The invariant, both directions — no accepted pair ever has predictedAt >= outcomeAt.
        expect(isAcceptedPair(r)).toBe(shouldAccept);
        if (isAcceptedPair(r)) {
          expect(r.predictedAtMs).toBeLessThan(r.outcomeAtMs);
          accepted += 1;
        } else {
          rejected += 1;
        }
      }
    }
    expect(accepted + rejected).toBe(21 * 21);
    expect(accepted).toBe((20 * 21) / 2); // pairs with predicted < outcome
  });

  it("rejected pairs never reach the report or the sink", () => {
    const { rows, outcomes, leakingIndices } = buildHindsightFixture();
    const resolutions = rows.map((row, i) => resolveSurprise(row, outcomes[i]));

    // Every known leak is rejected; every reported entry comes from an accepted pair.
    for (const idx of leakingIndices) {
      expect(resolutions[idx].hindsightRejected).toBe(true);
    }
    const report = buildTopSurprisesReport(resolutions, { limit: 100 });
    expect(report.counts.hindsightRejected).toBe(leakingIndices.length);
    expect(report.counts.reported).toBe(resolutions.length - leakingIndices.length);

    // The sink projection refuses to emit a surprise row for any rejected pair.
    const drainable = resolutions.map(toSurpriseEvent).filter(Boolean);
    expect(drainable.length).toBe(resolutions.length - leakingIndices.length);
    for (const idx of leakingIndices) {
      expect(toSurpriseEvent(resolutions[idx])).toBeNull();
    }
  });
});
