/**
 * Mercy Teacher Dialogue Builder
 *
 * Purpose:
 * - assemble Mercy's final teaching reply in one place
 * - combine continuity, strategy, rhythm, humor, repetition control, and personality
 * - keep teaching decisions separate from rendering decisions
 * - make Mercy sound like one experienced teacher across turns
 *
 * Pipeline:
 * 1. continuity lead / bridge
 * 2. strategy content
 * 3. rhythm shaping
 * 4. optional humor
 * 5. repetition guard
 * 6. final personality pass
 *
 * Design rules:
 * - do not invent pedagogy here
 * - do not override planner decisions aggressively
 * - favor continuity in light touches, not hard control
 * - keep sensitive moments warm and low-humor
 */

import { applyPersonality } from './personalityRules';
import type { TeachingMode } from './teachingModes';
import type { ResponsePlan } from './responsePlanner';
import type { ToneCalibrationResult } from './toneCalibration';
import type { TeachingStrategyLine, TeachingStrategyResult } from './teachingStrategies';
import { renderTeacherRhythm, type TeacherRhythmRenderResult } from './teacherRhythm';
import {
  getTeacherContinuitySuggestion,
  getContinuityLeadLine,
  getContinuityBridgeLine,
  updateTeacherContinuity,
  type TeacherContinuitySuggestion,
} from './teacherContinuity';
import { appendHumor, type HumorStyle } from './humorEngine';
import {
  pickLeastRepeatedCandidate,
  recordRepetitionSample,
} from './repetitionGuard';

export interface TeacherDialogueBuilderInput {
  userId?: string | null;
  userName?: string | null;
  language: 'en' | 'vi';

  learnerText?: string;
  concept?: string;
  mistake?: string;

  plan: ResponsePlan;
  tone: ToneCalibrationResult;
  strategy: TeachingStrategyResult;

  humorStyle?: HumorStyle;
  allowHumor?: boolean;
  humorContext?:
    | 'success'
    | 'correction'
    | 'challenge'
    | 'pronunciation'
    | 'streak';

  isConfused?: boolean;
  isFrustrated?: boolean;
  isSensitiveMoment?: boolean;
  repeatedMistake?: boolean;
  allowBossJoke?: boolean;

  personalityOverride?:
    | 'default'
    | 'greeting'
    | 'encouragement'
    | 'teacher_wit'
    | 'gentle_authority'
    | 'returning_user';
}

export interface TeacherDialogueBuilderResult {
  text: string;
  textAlt: string;
  continuity: TeacherContinuitySuggestion;
  rhythm: TeacherRhythmRenderResult;
  preHumor: {
    en: string;
    vi: string;
  };
  postHumor: {
    en: string;
    vi: string;
  };
}

function cleanText(text: string): string {
  return String(text ?? '')
    .replace(/\s+/g, ' ')
    .replace(/\s([,.!?;:])/g, '$1')
    .trim();
}

function mapModeToPersonalityContext(
  mode: TeachingMode,
  override?: TeacherDialogueBuilderInput['personalityOverride']
): 'default' | 'greeting' | 'encouragement' | 'teacher_wit' | 'gentle_authority' | 'returning_user' {
  if (override) return override;

  if (mode === 'challenge') return 'gentle_authority';
  if (mode === 'encourage') return 'encouragement';
  if (mode === 'correct' || mode === 'explain') return 'teacher_wit';
  if (mode === 'review') return 'returning_user';

  return 'default';
}

function mergeLineParts(
  ...lines: Array<TeachingStrategyLine | undefined>
): TeachingStrategyLine | undefined {
  const en = cleanText(lines.map((line) => line?.en || '').filter(Boolean).join(' '));
  const vi = cleanText(lines.map((line) => line?.vi || '').filter(Boolean).join(' '));

  if (!en && !vi) return undefined;

  return { en, vi };
}

function buildRhythmInput(args: {
  strategy: TeachingStrategyResult;
  plan: ResponsePlan;
  tone: ToneCalibrationResult;
  continuity: TeacherContinuitySuggestion;
}): Parameters<typeof renderTeacherRhythm>[0] {
  const { strategy, plan, tone, continuity } = args;

  const continuityLead = getContinuityLeadLine(continuity);
  const continuityBridge = getContinuityBridgeLine(continuity);

  const acknowledge =
    continuity.shouldReferencePreviousTurn
      ? mergeLineParts(continuityLead, strategy.opening)
      : strategy.opening;

  const action =
    continuity.shouldReferencePreviousTurn
      ? mergeLineParts(strategy.nextStep, continuityBridge)
      : strategy.nextStep;

  return {
    mode: plan.teachingMode,
    tone: tone.tone,
    plan: {
      shouldBeBrief: tone.shouldBeBrief,
      acknowledgeEffort: tone.acknowledgeEffort,
      addNextStep: tone.addNextStep,
      shouldUseHumor: tone.shouldUseHumor,
    },
    acknowledge,
    teach: strategy.teaching,
    action,
    encourage:
      plan.teachingMode === 'encourage'
        ? strategy.opening || strategy.teaching
        : undefined,
  };
}

function buildHumorOutput(
  input: TeacherDialogueBuilderInput,
  text: { en: string; vi: string }
): { en: string; vi: string } {
  if (!input.allowHumor || !input.tone.shouldUseHumor || !input.humorStyle) {
    return text;
  }

  return appendHumor(text, {
    style: input.humorStyle,
    context: input.humorContext || 'success',
    learnerText: input.learnerText || '',
    isConfused: !!input.isConfused,
    isFrustrated: !!input.isFrustrated,
    isSensitiveMoment: !!input.isSensitiveMoment,
    repeatedMistake: !!input.repeatedMistake,
    allowBossJoke: !!input.allowBossJoke,
    userName: input.userName || undefined,
  });
}

/**
 * Build Mercy's final teacher dialogue from already-decided teaching components.
 */
export function buildTeacherDialogue(
  input: TeacherDialogueBuilderInput
): TeacherDialogueBuilderResult {
  const continuity = getTeacherContinuitySuggestion({
    userId: input.userId,
    nextMode: input.plan.teachingMode,
    nextConcept: input.concept,
    nextMistake: input.mistake,
  });

  const rhythm = renderTeacherRhythm(
    buildRhythmInput({
      strategy: input.strategy,
      plan: input.plan,
      tone: input.tone,
      continuity,
    })
  );

  const preHumor = {
    en: cleanText(rhythm.en),
    vi: cleanText(rhythm.vi),
  };

  const postHumor = buildHumorOutput(input, preHumor);

  const personalityContext = mapModeToPersonalityContext(
    input.plan.teachingMode,
    input.personalityOverride
  );

  const styled = applyPersonality(postHumor.en, postHumor.vi, personalityContext);

  let text = input.language === 'vi' ? cleanText(styled.vi) : cleanText(styled.en);
  let textAlt = input.language === 'vi' ? cleanText(styled.en) : cleanText(styled.vi);

  text = pickLeastRepeatedCandidate({
    userId: input.userId,
    channel: 'full_reply',
    candidates: [text],
  });

  textAlt = pickLeastRepeatedCandidate({
    userId: input.userId,
    channel: 'full_reply',
    candidates: [textAlt],
  });

  recordRepetitionSample({
    userId: input.userId,
    channel: 'full_reply',
    text,
  });

  updateTeacherContinuity(
    {
      mode: input.plan.teachingMode,
      tone: input.tone.tone,
      concept: input.concept,
      mistake: input.mistake,
      learnerText: input.learnerText,
      usedHumor: !!(input.allowHumor && input.tone.shouldUseHumor),
    },
    input.userId
  );

  return {
    text,
    textAlt,
    continuity,
    rhythm,
    preHumor,
    postHumor,
  };
}