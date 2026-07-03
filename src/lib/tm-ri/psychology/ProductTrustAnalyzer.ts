import type { TmRiFinding, TmRiReplayTimeline, TmRiTrustCurve, TmRiTrustPoint } from "../types";
import { clampScore, hasFinding } from "../utils";

export class ProductTrustAnalyzer {
  analyze(findings: readonly TmRiFinding[], timeline: TmRiReplayTimeline): TmRiTrustCurve {
    const points: TmRiTrustPoint[] = [];
    let trust = 100;

    if (hasFinding(findings, "internal_text_visible") || hasFinding(findings, "product_trust_risk")) {
      trust -= 25;
      points.push({ timestampMs: 0, score: clampScore(trust), reason: "Learner saw non-product wording." });
    }

    if (hasFinding(findings, "audio_unavailable") || hasFinding(findings, "unplayable_media")) {
      trust -= 45;
      points.push({ timestampMs: 0, score: clampScore(trust), reason: "Required media failed." });
    }

    if (hasFinding(findings, "mic_unavailable")) {
      trust -= 25;
      points.push({ timestampMs: 0, score: clampScore(trust), reason: "Speaking capture failed." });
    }

    for (const point of timeline.stages) {
      if (point.stage === "guessing") {
        trust -= 30;
        points.push({ timestampMs: point.timestampMs, score: clampScore(trust), reason: "Learner guessed to finish." });
      }
      if (point.stage === "trust_lost") {
        trust -= 45;
        points.push({ timestampMs: point.timestampMs, score: clampScore(trust), reason: "Learner expressed lost trust." });
      }
      if (point.stage === "recovered") {
        trust += 20;
        points.push({ timestampMs: point.timestampMs, score: clampScore(trust), reason: "Learner recovered some confidence." });
      }
    }

    const finalPoints = points.length > 0 ? points : [{ timestampMs: 0, score: 100, reason: "No trust degradation detected." }];

    return {
      points: finalPoints,
      collapsePoint: finalPoints.find((point) => point.score <= 30),
    };
  }
}
