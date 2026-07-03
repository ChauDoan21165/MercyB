import type { TmRiFinding, TmRiRepairPlan, TmRiRepairPlanItem } from "../types";
import { hasFinding } from "../utils";

export class RepairPlanner {
  plan(findings: readonly TmRiFinding[]): TmRiRepairPlan {
    const items: TmRiRepairPlanItem[] = [];

    if (hasFinding(findings, "audio_unavailable") || hasFinding(findings, "unplayable_media")) {
      items.push({
        priority: 1,
        risk: "critical",
        title: "Make listening media availability a scored precondition",
        testsNeeded: ["audio unavailable prevents wrong listening grade", "zero-duration media triggers retry"],
        suggestedFiles: ["placement listening runtime", "assessment integrity tests"],
      });
    }

    if (hasFinding(findings, "mic_unavailable") || hasFinding(findings, "speaking_modality_degraded")) {
      items.push({
        priority: 2,
        risk: "high",
        title: "Separate typed fallback from spoken evidence",
        testsNeeded: ["typed fallback records degraded speaking evidence", "spoken score is not claimed from text"],
        suggestedFiles: ["speaking runtime", "assessment evidence mapper"],
      });
    }

    if (hasFinding(findings, "internal_text_visible") || hasFinding(findings, "product_trust_risk")) {
      items.push({
        priority: 3,
        risk: "medium",
        title: "Remove internal wording from learner-facing assessment copy",
        testsNeeded: ["learner copy excludes internal placeholder wording"],
        suggestedFiles: ["assessment copy registry", "runtime error copy tests"],
      });
    }

    if (hasFinding(findings, "confidence_overclaim_risk") || hasFinding(findings, "invalid_scoring_risk")) {
      items.push({
        priority: 1,
        risk: "critical",
        title: "Lower or withhold placement claims when evidence is degraded",
        testsNeeded: ["degraded evidence lowers confidence", "critical degradation withholds CEFR"],
        suggestedFiles: ["placement result policy", "educational honesty tests"],
      });
    }

    return {
      items: items.sort((left, right) => left.priority - right.priority || left.title.localeCompare(right.title)),
    };
  }
}
