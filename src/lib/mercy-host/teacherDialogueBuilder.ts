/**
 * VERSION: teacherDialogueBuilder.ts v3.3
 *
 * Mercy Teacher Dialogue Builder
 *
 * Purpose:
 * - assemble Mercy's final teaching reply in one place
 * - combine continuity, strategy, rhythm, timing, humor, repetition control, and personality
 * - keep teaching decisions separate from rendering decisions
 * - make Mercy sound like one experienced teacher across turns
 *
 * Pipeline:
 * 1. continuity lead / bridge
 * 2. strategy content
 * 3. rhythm shaping
 * 4. timing shaping
 * 5. optional humor
 * 6. repetition guard
 * 7. final personality pass
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
import type {
  TeachingStrategyLine,
  TeachingStrategyResult,
} from './teachingStrategies';
import {
  renderTeacherRhythm,
  type TeacherRhythmRenderResult,
} from './teacherRhythm';
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
  recordReplyParts,
} from './repetitionGuard';
import teacherTimingEngine, {
  applyTeacherTiming,
  type TeacherTimingResult,
} from './teacherTimingEngine';

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
  timing: TeacherTimingResult;
  preHumor: {
    en: string;
    vi: string;
  };
  timedPreHumor: {
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

function normalizeForMatch(text: string): string {
  return cleanText(text)
    .toLowerCase()
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'");
}

function appendTextIfMissing(base: string, addition?: string): string {
  const cleanBase = cleanText(base);
  const cleanAddition = cleanText(addition || '');

  if (!cleanAddition) return cleanBase;
  if (normalizeForMatch(cleanBase).includes(normalizeForMatch(cleanAddition))) {
    return cleanBase;
  }

  return cleanText(`${cleanBase} ${cleanAddition}`);
}

function preserveCoreTeachingContent(args: {
  text: string;
  language: 'en' | 'vi';
  plan: ResponsePlan;
  chosenTeaching?: TeachingStrategyLine;
  chosenAction?: TeachingStrategyLine;
}): string {
  const { text, language, plan, chosenTeaching, chosenAction } = args;

  let result = cleanText(text);

  const teachingText = cleanText(
    language === 'vi' ? chosenTeaching?.vi || '' : chosenTeaching?.en || ''
  );
  const actionText = cleanText(
    language === 'vi' ? chosenAction?.vi || '' : chosenAction?.en || ''
  );

  const mustPreserveTeaching =
    plan.teachingMode === 'explain' || plan.teachingMode === 'correct';

  const mustPreserveAction =
    plan.addNextStep &&
    (plan.teachingMode === 'correct' ||
      plan.teachingMode === 'explain' ||
      plan.teachingMode === 'challenge' ||
      plan.teachingMode === 'drill');

  if (mustPreserveTeaching && teachingText) {
    result = appendTextIfMissing(result, teachingText);
  }

  if (mustPreserveAction && actionText) {
    result = appendTextIfMissing(result, actionText);
  }

  return result;
}

function mapModeToPersonalityContext(
  mode: TeachingMode,
  override?: TeacherDialogueBuilderInput['personalityOverride']
):
  | 'default'
  | 'greeting'
  | 'encouragement'
  | 'teacher_wit'
  | 'gentle_authority'
  | 'returning_user' {
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
  const en = cleanText(
    lines
      .map((line) => line?.en || '')
      .filter(Boolean)
      .join(' ')
  );
  const vi = cleanText(
    lines
      .map((line) => line?.vi || '')
      .filter(Boolean)
      .join(' ')
  );

  if (!en && !vi) return undefined;

  return { en, vi };
}

function uniqueLineCandidates(
  lines: Array<TeachingStrategyLine | undefined>
): TeachingStrategyLine[] {
  const seen = new Set<string>();
  const result: TeachingStrategyLine[] = [];

  for (const line of lines) {
    if (!line) continue;

    const en = cleanText(line.en);
    const vi = cleanText(line.vi);

    if (!en && !vi) continue;

    const key = `${en}|||${vi}`;
    if (seen.has(key)) continue;

    seen.add(key);
    result.push({ en, vi });
  }

  return result;
}

function pickLineCandidate(args: {
  userId?: string | null;
  language: 'en' | 'vi';
  channel: 'opening' | 'teaching' | 'action' | 'encouragement';
  candidates: TeachingStrategyLine[];
}): TeachingStrategyLine | undefined {
  const { userId, language, channel, candidates } = args;
  if (candidates.length === 0) return undefined;
  if (candidates.length === 1) return candidates[0];

  const textToCandidate = new Map<string, TeachingStrategyLine>();

  for (const candidate of candidates) {
    const text = cleanText(language === 'vi' ? candidate.vi : candidate.en);
    if (text) {
      textToCandidate.set(text, candidate);
    }
  }

  const chosenText = pickLeastRepeatedCandidate({
    userId,
    channel,
    candidates: Array.from(textToCandidate.keys()),
  });

  return textToCandidate.get(chosenText) ?? candidates[0];
}

function getDisplayText(
  line: TeachingStrategyLine | undefined,
  language: 'en' | 'vi'
): string {
  if (!line) return '';
  return cleanText(language === 'vi' ? line.vi : line.en);
}

function buildRhythmInput(args: {
  plan: ResponsePlan;
  tone: ToneCalibrationResult;
  acknowledge?: TeachingStrategyLine;
  teach?: TeachingStrategyLine;
  action?: TeachingStrategyLine;
  encourage?: TeachingStrategyLine;
}): Parameters<typeof renderTeacherRhythm>[0] {
  const { plan, tone, acknowledge, teach, action, encourage } = args;

  return {
    mode: plan.teachingMode,
    tone: tone.tone,
    plan: {
      shouldBeBrief: tone.shouldBeBrief,
      acknowledgeEffort: tone.acknowledgeEffort,
      addNextStep: Boolean(plan.addNextStep || tone.addNextStep || action),
      shouldUseHumor: tone.shouldUseHumor,
    },
    acknowledge,
    teach,
    action,
    encourage,
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

function extractAppendedSegment(base: string, full: string): string {
  const cleanBase = cleanText(base);
  const cleanFull = cleanText(full);

  if (!cleanFull || cleanFull === cleanBase) return '';
  if (!cleanBase) return cleanFull;

  if (cleanFull.startsWith(cleanBase)) {
    return cleanText(cleanFull.slice(cleanBase.length));
  }

  return '';
}

function buildTiming(input: TeacherDialogueBuilderInput): TeacherTimingResult {
  return teacherTimingEngine({
    learnerState: {
      confidence: input.isSensitiveMoment ? 'low' : 'medium',
      clarity: input.isConfused ? 'lost' : 'clear',
      momentum: input.plan.teachingMode === 'challenge' ? 'flowing' : 'steady',
      affect: input.isFrustrated ? 'frustrated' : 'neutral',
    },
    emotion: {
      primarySignal: input.isConfused
        ? 'overwhelmed'
        : input.isFrustrated
          ? 'frustrated'
          : 'neutral',
      humorAllowance: input.allowHumor ? 0.5 : 0,
      warmthLevel: input.isSensitiveMoment ? 0.8 : 0.55,
      paceAdjustment: input.isSensitiveMoment ? 'slow' : 'normal',
      cognitiveLoadLevel: input.isConfused ? 'high' : 'moderate',
      momentumProtection: !!input.repeatedMistake,
      correctionSoftnessBias: 0.5,
      encouragementBias: 0.5,
      challengeReadiness: input.plan.teachingMode === 'challenge' ? 0.8 : 0.5,
    },
    lessonFlow: {
      stage:
        input.plan.teachingMode === 'recap'
          ? 'recap'
          : input.plan.teachingMode === 'challenge'
            ? 'advance'
            : input.plan.teachingMode === 'correct'
              ? 'retry'
              : 'clarify',
      preferredNextMode: undefined,
      preferredDifficultyDirection: undefined,
      shouldHoldConcept: !!input.repeatedMistake,
      shouldSwitchTeachingMove: false,
      shouldUseWorkedExample:
        input.plan.teachingMode === 'explain' && !!input.isConfused,
      shouldAskGuidedQuestion: false,
      shouldForceRecap: input.plan.teachingMode === 'recap',
      shouldAdvanceLesson: input.plan.teachingMode === 'challenge',
      lessonConfidence: 0.5,
      rationale: [],
    },
    teachingMode: input.plan.teachingMode,
    isSensitiveMoment: !!input.isSensitiveMoment,
    repeatedMistake: !!input.repeatedMistake,
    shouldUseWorkedExample:
      input.plan.teachingMode === 'explain' && !!input.isConfused,
    shouldForceRecap: input.plan.teachingMode === 'recap',
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

  const continuityLead = getContinuityLeadLine(continuity);
  const continuityBridge = getContinuityBridgeLine(continuity);

  const openingCandidates = uniqueLineCandidates([
    input.strategy.opening,
    continuity.shouldReferencePreviousTurn
      ? mergeLineParts(continuityLead, input.strategy.opening)
      : undefined,
    continuityLead,
  ]);

  const teachingCandidates = uniqueLineCandidates([input.strategy.teaching]);

  const actionCandidates = uniqueLineCandidates([
    input.strategy.nextStep,
    input.plan.addNextStep && continuity.shouldReferencePreviousTurn
      ? mergeLineParts(continuityBridge, input.strategy.nextStep)
      : undefined,
  ]);

  const encouragementCandidates = uniqueLineCandidates([
    input.plan.teachingMode === 'encourage'
      ? input.strategy.opening || input.strategy.teaching
      : undefined,
  ]);

  const chosenOpening = pickLineCandidate({
    userId: input.userId,
    language: input.language,
    channel: 'opening',
    candidates: openingCandidates,
  });

  const chosenTeaching = pickLineCandidate({
    userId: input.userId,
    language: input.language,
    channel: 'teaching',
    candidates: teachingCandidates,
  });

  const chosenAction = pickLineCandidate({
    userId: input.userId,
    language: input.language,
    channel: 'action',
    candidates: actionCandidates,
  });

  const chosenEncouragement = pickLineCandidate({
    userId: input.userId,
    language: input.language,
    channel: 'encouragement',
    candidates: encouragementCandidates,
  });

  const rhythm = renderTeacherRhythm(
    buildRhythmInput({
      plan: input.plan,
      tone: input.tone,
      acknowledge: chosenOpening,
      teach: chosenTeaching,
      action: chosenAction,
      encourage: chosenEncouragement,
    })
  );

  const preHumor = {
    en: cleanText(rhythm.en),
    vi: cleanText(rhythm.vi),
  };

  const timing = buildTiming(input);

  const timedPreHumor = {
    en: applyTeacherTiming({ text: preHumor.en, timing }),
    vi: applyTeacherTiming({ text: preHumor.vi, timing }),
  };

  const postHumor = buildHumorOutput(input, timedPreHumor);

  const personalityContext = mapModeToPersonalityContext(
    input.plan.teachingMode,
    input.personalityOverride
  );

  const styled = applyPersonality(postHumor.en, postHumor.vi, personalityContext);

  let text = input.language === 'vi' ? cleanText(styled.vi) : cleanText(styled.en);
  let textAlt = input.language === 'vi' ? cleanText(styled.en) : cleanText(styled.vi);

  text = preserveCoreTeachingContent({
    text,
    language: input.language,
    plan: input.plan,
    chosenTeaching,
    chosenAction,
  });

  textAlt = preserveCoreTeachingContent({
    text: textAlt,
    language: input.language === 'vi' ? 'en' : 'vi',
    plan: input.plan,
    chosenTeaching,
    chosenAction,
  });

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

  const humorText =
    input.language === 'vi'
      ? extractAppendedSegment(timedPreHumor.vi, postHumor.vi)
      : extractAppendedSegment(timedPreHumor.en, postHumor.en);

  recordReplyParts({
    userId: input.userId,
    opening: getDisplayText(chosenOpening, input.language),
    teaching: getDisplayText(chosenTeaching, input.language),
    action: getDisplayText(chosenAction, input.language),
    encouragement: getDisplayText(chosenEncouragement, input.language),
    humor: humorText,
    fullReply: text,
  });

  updateTeacherContinuity(
    {
      mode: input.plan.teachingMode,
      tone: input.tone.tone,
      concept: input.concept,
      mistake: input.mistake,
      learnerText: input.learnerText,
      usedHumor: !!humorText,
    },
    input.userId
  );

  return {
    text,
    textAlt,
    continuity,
    rhythm,
    timing,
    preHumor,
    timedPreHumor,
    postHumor,
  };
}

export default buildTeacherDialogue;