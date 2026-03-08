/**
 * FILE: src/lib/mercy-host/host/buildDialogueLayer.ts
 * VERSION: buildDialogueLayer.ts v1.1
 *
 * Purpose:
 * - centralize Mercy's dialogue-layer assembly after signals + planning + strategy are known
 * - keep mercyHost.ts focused on orchestration
 * - reduce host size without changing behavior
 */

import { detectBossJoke } from '../humorEngine';
import {
  buildTeacherDialogue,
  type TeacherDialogueBuilderResult,
} from '../teacherDialogueBuilder';
import type { MercyTeachingTurnInput } from '../mercyHost';
import type { TeachingSignalsResult } from './buildTeachingSignals';
import type { TeachingPlanLayerResult } from './buildTeachingPlan';
import type { TeachingStrategyLayerResult } from './buildTeachingStrategyLayer';

export interface TeachingDialogueLayerResult {
  dialogue: TeacherDialogueBuilderResult;
}

function deriveHumorStyle(input: MercyTeachingTurnInput) {
  if (input.humorStyle) return input.humorStyle;
  if (detectBossJoke(input.learnerText)) return 'teacher_wit';
  if (input.teacherLevel === 'intense') return 'dry';
  return 'teacher_wit';
}

export function buildDialogueLayer(
  input: MercyTeachingTurnInput,
  signals: TeachingSignalsResult,
  planning: TeachingPlanLayerResult,
  strategyLayer: TeachingStrategyLayerResult
): TeachingDialogueLayerResult {
  const dialogue = buildTeacherDialogue({
    userId: signals.userId,
    userName: input.userName,
    language: input.language,
    learnerText: input.learnerText,
    concept: input.concept,
    mistake: input.correction?.mistake,
    plan: planning.plan,
    tone: planning.calibrated,
    strategy: strategyLayer.strategy,
    humorStyle: deriveHumorStyle(input),
    allowHumor: planning.calibrated.shouldUseHumor,
    humorContext:
      planning.plan.teachingMode === 'challenge'
        ? 'challenge'
        : planning.plan.teachingMode === 'correct'
          ? 'correction'
          : planning.plan.teachingMode === 'drill'
            ? 'pronunciation'
            : planning.difficulty.direction === 'up'
              ? 'streak'
              : 'success',
    isConfused: signals.learnerState.clarity === 'lost',
    isFrustrated: signals.learnerState.affect === 'frustrated',
    isSensitiveMoment: signals.isSensitiveMoment,
    repeatedMistake: signals.repeatedMistake,
    allowBossJoke: detectBossJoke(input.learnerText),
  });

  return { dialogue };
}

export default buildDialogueLayer;