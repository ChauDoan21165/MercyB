/**
 * Mercy Teacher Dialogue Builder
 *
 * Purpose:
 * - convert planner decisions into natural teacher dialogue
 * - combine strategies, tone calibration, and optional humor
 * - keep Mercy responses structured and consistent
 *
 * Flow:
 * planner -> tone calibration -> strategy -> dialogue
 */

import type { ResponsePlan } from './responsePlanner';
import type { TeachingStrategyLine } from './teachingStrategies';
import {
  renderTeachingStrategy,
  buildCorrectionStrategy,
  explainRule,
  oneStepChallenge,
  confidenceRepair,
  microRecap,
  pronunciationNudge,
  praiseThenPush,
} from './teachingStrategies';

import type { CorrectionStyle } from './types';

export interface DialogueBuilderInput {
  plan: ResponsePlan;

  correction?: {
    mistake: string;
    fix: string;
  };

  explanation?: string;

  summary?: string;

  pronunciationCue?: string;

  nextPrompt?: string;

  specificPraise?: string;

  humorLine?: string;
}

export interface DialogueBuilderResult {
  en: string;
  vi: string;
}

/**
 * Clean sentence flow
 */
function cleanText(text: string): string {
  return text.replace(/\s+/g, ' ').replace(/\s([,.!?;:])/g, '$1').trim();
}

/**
 * Combine bilingual parts
 */
function joinLines(
  parts: TeachingStrategyLine[],
  humor?: string
): DialogueBuilderResult {
  const enParts: string[] = [];
  const viParts: string[] = [];

  for (const p of parts) {
    if (p.en) enParts.push(p.en);
    if (p.vi) viParts.push(p.vi);
  }

  if (humor) {
    enParts.push(humor);
  }

  return {
    en: cleanText(enParts.join(' ')),
    vi: cleanText(viParts.join(' ')),
  };
}

/**
 * Build dialogue from response plan
 */
export function buildTeacherDialogue(
  input: DialogueBuilderInput
): DialogueBuilderResult {
  const { plan } = input;

  const strategies: TeachingStrategyLine[] = [];

  switch (plan.teachingMode) {
    case 'correct': {
      if (input.correction) {
        const strategy = buildCorrectionStrategy(
          plan.correctionStyle as CorrectionStyle,
          input.correction,
          {
            nextPrompt: plan.addNextStep ? input.nextPrompt : undefined,
          }
        );

        strategies.push(renderTeachingStrategy(strategy));
      }
      break;
    }

    case 'explain': {
      const strategy = explainRule(input.explanation || 'Key idea.', {
        nextPrompt: plan.addNextStep ? input.nextPrompt : undefined,
      });

      strategies.push(renderTeachingStrategy(strategy));
      break;
    }

    case 'challenge': {
      const strategy = oneStepChallenge(input.nextPrompt);

      strategies.push(renderTeachingStrategy(strategy));
      break;
    }

    case 'recap': {
      const strategy = microRecap(input.summary || 'Quick recap.', {
        nextPrompt: plan.addNextStep ? input.nextPrompt : undefined,
      });

      strategies.push(renderTeachingStrategy(strategy));
      break;
    }

    case 'drill': {
      const strategy = pronunciationNudge(input.pronunciationCue || 'Repeat the sound.');

      strategies.push(renderTeachingStrategy(strategy));
      break;
    }

    case 'encourage': {
      if (input.specificPraise) {
        const strategy = praiseThenPush(
          input.specificPraise,
          input.nextPrompt
        );

        strategies.push(renderTeachingStrategy(strategy));
      } else {
        const strategy = confidenceRepair({
          nextPrompt: plan.addNextStep ? input.nextPrompt : undefined,
        });

        strategies.push(renderTeachingStrategy(strategy));
      }
      break;
    }

    case 'review': {
      const strategy = microRecap(input.summary || 'Let’s revisit this concept.', {
        nextPrompt: plan.addNextStep ? input.nextPrompt : undefined,
      });

      strategies.push(renderTeachingStrategy(strategy));
      break;
    }
  }

  return joinLines(
    strategies,
    plan.shouldUseHumor ? input.humorLine : undefined
  );
}