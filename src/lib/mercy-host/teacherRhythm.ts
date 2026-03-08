/**
 * Mercy Teacher Rhythm
 *
 * Purpose:
 * - make Mercy sound like a real experienced teacher, not just a response generator
 * - shape replies into a natural teaching cadence
 * - keep structure human: observe -> acknowledge -> teach -> action -> encourage
 * - reduce robotic repetition across turns
 *
 * Design rules:
 * - one teaching move at a time
 * - correction should feel calm, not abrupt
 * - explanation should feel guided, not lecture-heavy
 * - challenge should feel confident, not cold
 * - review should feel patient, not punitive
 */

import type { TeachingMode } from './teachingModes';
import type { ToneStyle, ResponsePlan } from './responsePlanner';
import type { TeachingStrategyLine } from './teachingStrategies';

export type TeacherRhythmStage =
  | 'observe'
  | 'acknowledge'
  | 'teach'
  | 'action'
  | 'encourage';

export interface TeacherRhythmBlock {
  stage: TeacherRhythmStage;
  required: boolean;
  preferredLength: 'short' | 'medium';
}

export interface TeacherRhythmProfile {
  mode: TeachingMode;
  label: string;
  blocks: TeacherRhythmBlock[];
  maxSentences: number;
  shouldEndWithAction: boolean;
  shouldEndWithEncouragement: boolean;
}

export interface TeacherRhythmRenderInput {
  mode: TeachingMode;
  tone: ToneStyle;
  plan?: Pick<
    ResponsePlan,
    'shouldBeBrief' | 'acknowledgeEffort' | 'addNextStep' | 'shouldUseHumor'
  >;
  observe?: TeachingStrategyLine;
  acknowledge?: TeachingStrategyLine;
  teach?: TeachingStrategyLine;
  action?: TeachingStrategyLine;
  encourage?: TeachingStrategyLine;
}

export interface TeacherRhythmRenderResult {
  en: string;
  vi: string;
  order: TeacherRhythmStage[];
  sentencesUsed: number;
  trimmedStages: TeacherRhythmStage[];
}

/* -------------------------------------------------------------------------- */
/* Rhythm profiles                                                            */
/* -------------------------------------------------------------------------- */

export const TEACHER_RHYTHM_PROFILES: Record<
  TeachingMode,
  TeacherRhythmProfile
> = {
  explain: {
    mode: 'explain',
    label: 'Guided Explanation',
    blocks: [
      { stage: 'acknowledge', required: false, preferredLength: 'short' },
      { stage: 'teach', required: true, preferredLength: 'medium' },
      { stage: 'action', required: false, preferredLength: 'short' },
      { stage: 'encourage', required: false, preferredLength: 'short' },
    ],
    maxSentences: 4,
    shouldEndWithAction: true,
    shouldEndWithEncouragement: false,
  },

  correct: {
    mode: 'correct',
    label: 'Calm Correction',
    blocks: [
      { stage: 'acknowledge', required: false, preferredLength: 'short' },
      { stage: 'teach', required: true, preferredLength: 'short' },
      { stage: 'action', required: false, preferredLength: 'short' },
      { stage: 'encourage', required: false, preferredLength: 'short' },
    ],
    maxSentences: 4,
    shouldEndWithAction: true,
    shouldEndWithEncouragement: false,
  },

  encourage: {
    mode: 'encourage',
    label: 'Warm Encouragement',
    blocks: [
      { stage: 'observe', required: false, preferredLength: 'short' },
      { stage: 'acknowledge', required: false, preferredLength: 'short' },
      { stage: 'teach', required: false, preferredLength: 'short' },
      { stage: 'action', required: false, preferredLength: 'short' },
      { stage: 'encourage', required: true, preferredLength: 'short' },
    ],
    maxSentences: 4,
    shouldEndWithAction: false,
    shouldEndWithEncouragement: true,
  },

  challenge: {
    mode: 'challenge',
    label: 'Confident Push',
    blocks: [
      { stage: 'acknowledge', required: false, preferredLength: 'short' },
      { stage: 'teach', required: false, preferredLength: 'short' },
      { stage: 'action', required: true, preferredLength: 'short' },
      { stage: 'encourage', required: false, preferredLength: 'short' },
    ],
    maxSentences: 4,
    shouldEndWithAction: true,
    shouldEndWithEncouragement: false,
  },

  drill: {
    mode: 'drill',
    label: 'Practice Rhythm',
    blocks: [
      { stage: 'observe', required: false, preferredLength: 'short' },
      { stage: 'teach', required: true, preferredLength: 'short' },
      { stage: 'action', required: true, preferredLength: 'short' },
      { stage: 'encourage', required: false, preferredLength: 'short' },
    ],
    maxSentences: 4,
    shouldEndWithAction: true,
    shouldEndWithEncouragement: false,
  },

  recap: {
    mode: 'recap',
    label: 'Calm Recap',
    blocks: [
      { stage: 'observe', required: false, preferredLength: 'short' },
      { stage: 'teach', required: true, preferredLength: 'medium' },
      { stage: 'action', required: false, preferredLength: 'short' },
      { stage: 'encourage', required: false, preferredLength: 'short' },
    ],
    maxSentences: 4,
    shouldEndWithAction: false,
    shouldEndWithEncouragement: false,
  },

  review: {
    mode: 'review',
    label: 'Patient Review',
    blocks: [
      { stage: 'acknowledge', required: false, preferredLength: 'short' },
      { stage: 'teach', required: true, preferredLength: 'medium' },
      { stage: 'action', required: true, preferredLength: 'short' },
      { stage: 'encourage', required: false, preferredLength: 'short' },
    ],
    maxSentences: 4,
    shouldEndWithAction: true,
    shouldEndWithEncouragement: false,
  },
};

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function cleanText(text: string): string {
  return String(text ?? '')
    .replace(/\s+/g, ' ')
    .replace(/\s([,.!?;:])/g, '$1')
    .trim();
}

function countSentences(text: string): number {
  const cleaned = cleanText(text);
  if (!cleaned) return 0;
  const matches = cleaned.match(/[.!?]+(?=\s|$)/g);
  return matches?.length || 1;
}

function shortenToSentenceLimit(text: string, maxSentences: number): string {
  const cleaned = cleanText(text);
  if (!cleaned) return '';

  let sentences = 0;
  let index = 0;

  while (index < cleaned.length) {
    const char = cleaned[index];
    if (char === '.' || char === '!' || char === '?') {
      sentences += 1;
      if (sentences >= maxSentences) {
        return cleanText(cleaned.slice(0, index + 1));
      }
    }
    index += 1;
  }

  return cleaned;
}

function buildStageOrder(
  profile: TeacherRhythmProfile,
  input: TeacherRhythmRenderInput
): TeacherRhythmStage[] {
  const order: TeacherRhythmStage[] = [];

  for (const block of profile.blocks) {
    const hasContent =
      block.stage === 'observe'
        ? !!input.observe
        : block.stage === 'acknowledge'
          ? !!input.acknowledge
          : block.stage === 'teach'
            ? !!input.teach
            : block.stage === 'action'
              ? !!input.action
              : !!input.encourage;

    if (block.required || hasContent) {
      order.push(block.stage);
    }
  }

  if (
    profile.shouldEndWithAction &&
    input.action &&
    order.includes('action') &&
    order[order.length - 1] !== 'action'
  ) {
    return order.filter((s) => s !== 'action').concat('action');
  }

  if (
    profile.shouldEndWithEncouragement &&
    input.encourage &&
    order.includes('encourage') &&
    order[order.length - 1] !== 'encourage'
  ) {
    return order.filter((s) => s !== 'encourage').concat('encourage');
  }

  return order;
}

function getStageLine(
  input: TeacherRhythmRenderInput,
  stage: TeacherRhythmStage
): TeachingStrategyLine | undefined {
  switch (stage) {
    case 'observe':
      return input.observe;
    case 'acknowledge':
      return input.acknowledge;
    case 'teach':
      return input.teach;
    case 'action':
      return input.action;
    case 'encourage':
      return input.encourage;
    default:
      return undefined;
  }
}

function shouldKeepStage(
  input: TeacherRhythmRenderInput,
  stage: TeacherRhythmStage
): boolean {
  const brief = input.plan?.shouldBeBrief ?? false;
  const acknowledgeEffort = input.plan?.acknowledgeEffort ?? false;
  const addNextStep = input.plan?.addNextStep ?? false;
  const useHumor = input.plan?.shouldUseHumor ?? false;

  if (!brief) {
    if (stage === 'acknowledge' && !acknowledgeEffort) return false;
    if (stage === 'action' && !addNextStep) return false;

    if (stage === 'encourage' && input.mode !== 'encourage' && !useHumor) {
      return false;
    }

    return true;
  }

  if (stage === 'observe') return false;
  if (stage === 'acknowledge' && !acknowledgeEffort) return false;

  if (
    stage === 'action' &&
    !addNextStep &&
    input.mode !== 'challenge' &&
    input.mode !== 'drill'
  ) {
    return false;
  }

  if (stage === 'encourage' && input.mode !== 'encourage' && !useHumor) {
    return false;
  }

  return true;
}

function joinLines(parts: string[]): string {
  return cleanText(parts.filter(Boolean).join(' '));
}

/* -------------------------------------------------------------------------- */
/* Public API                                                                 */
/* -------------------------------------------------------------------------- */

export function getTeacherRhythmProfile(
  mode: TeachingMode
): TeacherRhythmProfile {
  return TEACHER_RHYTHM_PROFILES[mode];
}

export function getAllTeacherRhythmProfiles(): TeacherRhythmProfile[] {
  return Object.values(TEACHER_RHYTHM_PROFILES);
}

/**
 * Render Mercy's reply in a human teacher cadence.
 *
 * This does not invent teaching content.
 * It only arranges already-generated content into a natural rhythm.
 */
export function renderTeacherRhythm(
  input: TeacherRhythmRenderInput
): TeacherRhythmRenderResult {
  const profile = getTeacherRhythmProfile(input.mode);
  const stageOrder = buildStageOrder(profile, input);

  const enParts: string[] = [];
  const viParts: string[] = [];
  const trimmedStages: TeacherRhythmStage[] = [];
  let usedSentences = 0;

  for (const stage of stageOrder) {
    if (!shouldKeepStage(input, stage)) {
      trimmedStages.push(stage);
      continue;
    }

    const line = getStageLine(input, stage);
    if (!line) continue;

    const enLine = cleanText(line.en);
    const viLine = cleanText(line.vi);

    if (!enLine && !viLine) continue;

    const enSentenceCount = countSentences(enLine);
    const viSentenceCount = countSentences(viLine);
    const stageSentenceCount = Math.max(enSentenceCount, viSentenceCount);

    if (usedSentences >= profile.maxSentences) {
      trimmedStages.push(stage);
      continue;
    }

    const remaining = profile.maxSentences - usedSentences;

    if (stageSentenceCount > remaining) {
      const trimmedEn = shortenToSentenceLimit(enLine, remaining);
      const trimmedVi = shortenToSentenceLimit(viLine, remaining);

      if (trimmedEn || trimmedVi) {
        if (trimmedEn) enParts.push(trimmedEn);
        if (trimmedVi) viParts.push(trimmedVi);
      }

      trimmedStages.push(stage);
      usedSentences = profile.maxSentences;
      continue;
    }

    if (enLine) enParts.push(enLine);
    if (viLine) viParts.push(viLine);
    usedSentences += stageSentenceCount;
  }

  return {
    en: joinLines(enParts),
    vi: joinLines(viParts),
    order: stageOrder,
    sentencesUsed: usedSentences,
    trimmedStages,
  };
}

/**
 * Convenience helper for common teacher structure:
 * acknowledge -> teach -> action
 */
export function renderTeacherCoreRhythm(args: {
  mode: TeachingMode;
  tone: ToneStyle;
  acknowledge?: TeachingStrategyLine;
  teach: TeachingStrategyLine;
  action?: TeachingStrategyLine;
  encourage?: TeachingStrategyLine;
  shouldBeBrief?: boolean;
  acknowledgeEffort?: boolean;
  addNextStep?: boolean;
  shouldUseHumor?: boolean;
}): TeacherRhythmRenderResult {
  return renderTeacherRhythm({
    mode: args.mode,
    tone: args.tone,
    acknowledge: args.acknowledge,
    teach: args.teach,
    action: args.action,
    encourage: args.encourage,
    plan: {
      shouldBeBrief: args.shouldBeBrief ?? false,
      acknowledgeEffort: args.acknowledgeEffort ?? false,
      addNextStep: args.addNextStep ?? false,
      shouldUseHumor: args.shouldUseHumor ?? false,
    },
  });
}