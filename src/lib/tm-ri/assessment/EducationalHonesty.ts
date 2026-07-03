import type { TmRiAssessmentIntegrity, TmRiEducationalHonestyDecision, TmRiFinding } from "../types";
import { hasFinding } from "../utils";

export class EducationalHonesty {
  recommend(
    integrity: TmRiAssessmentIntegrity,
    allFindings: readonly TmRiFinding[],
  ): TmRiEducationalHonestyDecision {
    const recommendations = new Set<TmRiEducationalHonestyDecision["recommendations"][number]>();

    if (integrity.degradedEvidence) {
      recommendations.add("lower_confidence");
      recommendations.add("explain_degraded");
    }

    if (integrity.invalidScoringRisk || integrity.confidenceOverclaimRisk || hasFinding(allFindings, "guessing_to_escape")) {
      recommendations.add("withhold_cefr");
    }

    if (integrity.listeningNotGradableAsWrong || hasFinding(allFindings, "audio_unavailable")) {
      recommendations.add("retry_required");
    }

    if (recommendations.size === 0) {
      recommendations.add("show_result");
    }

    return {
      recommendations: [...recommendations],
      resultConfidence: recommendations.has("withhold_cefr")
        ? "withheld"
        : recommendations.has("lower_confidence")
          ? "lowered"
          : "normal",
      inputModeRecommendation: integrity.speakingModalityDegraded ? "text" : integrity.listeningNotGradableAsWrong ? "retry" : undefined,
    };
  }
}
