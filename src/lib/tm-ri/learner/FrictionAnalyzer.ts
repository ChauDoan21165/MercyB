import type { TmRiEducationalFriction, TmRiFinding, TmRiReplayTimeline } from "../types";
import { clampScore, hasFinding } from "../utils";

export class FrictionAnalyzer {
  analyze(findings: readonly TmRiFinding[], timeline: TmRiReplayTimeline): TmRiEducationalFriction {
    let score = 0;
    const reasons: string[] = [];

    if (hasFinding(findings, "audio_unavailable") || hasFinding(findings, "unplayable_media")) {
      score += 35;
      reasons.push("Required media was unavailable or unplayable.");
    }

    if (hasFinding(findings, "mic_unavailable")) {
      score += 25;
      reasons.push("Speaking capture was unavailable.");
    }

    for (const point of timeline.stages) {
      if (point.stage === "guessing") {
        score += 25;
        reasons.push("Learner reported guessing.");
      }
      if (point.stage === "trust_lost") {
        score += 30;
        reasons.push("Learner trust was visibly damaged.");
      }
      if (point.stage === "retrying") {
        score += 10;
        reasons.push("Learner had to retry.");
      }
    }

    return {
      score: clampScore(score),
      reasons: [...new Set(reasons)],
    };
  }
}
