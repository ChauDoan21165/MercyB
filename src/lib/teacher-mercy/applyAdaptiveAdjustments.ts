/**
 * VERSION: applyAdaptiveAdjustments.ts v1
 *
 * Purpose
 * Merge adaptiveTeachingIntelligence output into a response plan.
 *
 * This keeps the planner simple while allowing adaptive intelligence
 * to override tone, teaching mode, pacing, and difficulty when needed.
 */

import type { ResponsePlan } from './responsePlanner';
import type { AdaptiveTeachingAdjustment } from './adaptiveTeachingIntelligence';

export function applyAdaptiveAdjustments(
  plan: ResponsePlan,
  adaptive: AdaptiveTeachingAdjustment
): ResponsePlan {
  let updated: ResponsePlan = { ...plan };

  /* -----------------------------
     teaching mode override
  ----------------------------- */

  if (adaptive.preferredTeachingMode) {
    updated.teachingMode = adaptive.preferredTeachingMode;
  }

  /* -----------------------------
     tone override
  ----------------------------- */

  if (adaptive.preferredTone) {
    updated.tone = adaptive.preferredTone;
  }

  /* -----------------------------
     correction style override
  ----------------------------- */

  if (adaptive.preferredCorrectionStyle) {
    updated.correctionStyle = adaptive.preferredCorrectionStyle;
  }

  /* -----------------------------
     difficulty override
  ----------------------------- */

  if (adaptive.preferredDifficultyDirection) {
    updated.difficultyDirection = adaptive.preferredDifficultyDirection;
  }

  /* -----------------------------
     pacing / brevity
  ----------------------------- */

  if (adaptive.shouldStayBrief) {
    updated.shouldBeBrief = true;
  }

  /* -----------------------------
     encouragement
  ----------------------------- */

  if (adaptive.shouldAcknowledgeEffort) {
    updated.acknowledgeEffort = true;
  }

  /* -----------------------------
     momentum protection
  ----------------------------- */

  if (adaptive.shouldProtectMomentum) {
    updated.addNextStep = true;
  }

  return updated;
}

export default applyAdaptiveAdjustments;