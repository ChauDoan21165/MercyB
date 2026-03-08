/**
 * VERSION: mercyHost.ts v6.7
 *
 * Mercy Host - Main Module
 *
 * Central logic for Mercy's hosting behavior across all rooms.
 */

import { FALLBACK_NAMES } from './persona';
import { applyPersonality } from './personalityRules';
import {
  getGreetingByTier,
  formatGreeting,
  getRandomGreeting,
  COLOR_MODE_RESPONSES,
  type GreetingTemplate,
} from './greetings';
import {
  getTeacherTip,
  buildTeacherPlan,
  renderTeacherResponse,
  type TeacherContext,
  type TeacherLevel,
} from './teacherScripts';
import type { LearnerState } from './learnerState';
import type { ResponsePlan } from './responsePlanner';
import type { ToneCalibrationResult } from './toneCalibration';
import {
  buildTeachingStrategy,
  buildCorrectionStrategy,
  type TeachingStrategyResult,
} from './teachingStrategies';
import { getTeachingModeProfile } from './teachingModes';
import {
  loadLessonMemory,
  updateLessonMemory,
  type LessonMemoryState,
} from './lessonMemory';
import {
  loadCurriculumState,
  updateCurriculumTopic,
  getCurriculumRecommendation,
  type CurriculumRecommendation,
  type CurriculumState,
} from './curriculumTracker';
import type { DifficultyLevel, DifficultySnapshot } from './difficultyScaler';
import { detectBossJoke, type HumorStyle } from './humorEngine';
import type { GuardToneSignals } from './guard';
import { buildTeacherDialogue } from './teacherDialogueBuilder';
import type { TeacherEmotionState } from './teacherEmotionModel';
import type { AdaptiveTeachingAdjustment } from './adaptiveTeachingIntelligence';
import { getSpecificPraiseText } from './specificPraise';
import { getTeacherMemoryInsight } from './teacherMemoryEngine';
import { buildTeachingSignals } from './host/buildTeachingSignals';
import buildTeachingPlan from './host/buildTeachingPlan';

export interface MercyHostContext {
  userName: string | null;
  userTier: string;
  roomId: string;
  roomTitle: string;
  language: 'en' | 'vi';
}

export interface MercyGreeting {
  text: string;
  textAlt: string;
  isVip: boolean;
}

export interface MercyTeacherReply {
  text: string;
  textAlt: string;
  move: string;
  tone: string;
}

export interface MercyTeacherReplyInput {
  userName?: string | null;
  language: 'en' | 'vi';
  teacherLevel: TeacherLevel;
  context?: TeacherContext;
  learnerText?: string;
  correction?: {
    mistake: string;
    fix: string;
  };
  explanation?: string;
  nextPrompt?: string;
  repeatedMistake?: boolean;
  wantsChallenge?: boolean;
  wantsExplanation?: boolean;
}

export interface MercyTeachingTurnInput {
  userId?: string | null;
  userName?: string | null;
  userTier?: string;
  language: 'en' | 'vi';
  learnerText: string;
  correction?: {
    mistake: string;
    fix: string;
  };
  explanation?: string;
  nextPrompt?: string;
  concept?: string;
  summary?: string;
  example?: string;
  currentDifficulty?: DifficultyLevel;
  isCorrectiveTurn?: boolean;
  wantsChallenge?: boolean;
  wantsExplanation?: boolean;
  wantsDrill?: boolean;
  wantsRecap?: boolean;
  teacherLevel?: TeacherLevel;
  suppressHumor?: boolean;
  requireDirectness?: boolean;
  softenTone?: boolean;
  humorStyle?: HumorStyle;
  repeatedMistake?: boolean;
}

export interface MercyTeachingTurnResult {
  text: string;
  textAlt: string;
  learnerState: LearnerState;
  emotion: TeacherEmotionState;
  adaptive: AdaptiveTeachingAdjustment;
  plan: ResponsePlan;
  tone: ToneCalibrationResult;
  strategy: TeachingStrategyResult;
  memory: LessonMemoryState;
  curriculum: CurriculumState;
  curriculumRecommendation: CurriculumRecommendation;
  difficulty: DifficultySnapshot;
  guardSignals: GuardToneSignals;
  repeatedMistake: boolean;
  shouldReviewConcept: boolean;
}

const VIP_TIERS = new Set([
  'vip1',
  'vip2',
  'vip3',
  'vip4',
  'vip5',
  'vip6',
  'vip7',
  'vip8',
  'vip9',
]);

function getGreetingPersonalityContext(
  userTier: string
): 'greeting' | 'encouragement' {
  return VIP_TIERS.has(userTier) ? 'encouragement' : 'greeting';
}

function cleanText(text: string): string {
  return String(text ?? '')
    .replace(/\s+/g, ' ')
    .replace(/\s([,.!?;:])/g, '$1')
    .trim();
}

function lower(text?: string): string {
  return cleanText(text || '').toLowerCase();
}

function getResolvedName(
  userName: string | null | undefined,
  language: 'en' | 'vi'
): string {
  return userName || (language === 'vi' ? FALLBACK_NAMES.vi : FALLBACK_NAMES.en);
}

function getAltResolvedName(
  userName: string | null | undefined,
  language: 'en' | 'vi'
): string {
  return userName || (language === 'vi' ? FALLBACK_NAMES.en : FALLBACK_NAMES.vi);
}

function resolveTeacherLevel(
  explicitLevel: TeacherLevel | undefined,
  userTier: string | undefined
): TeacherLevel {
  if (explicitLevel) return explicitLevel;
  return mapTierToTeacherLevel(userTier || 'free');
}

function deriveHumorStyle(input: MercyTeachingTurnInput): HumorStyle {
  if (input.humorStyle) return input.humorStyle;
  if (detectBossJoke(input.learnerText)) return 'teacher_wit';
  if (input.teacherLevel === 'intense') return 'dry';
  return 'teacher_wit';
}

function inferPraiseImprovementType(args: {
  learnerState: LearnerState;
  concept?: string;
  mistake?: string;
  repeatedMistake: boolean;
  isCorrectiveTurn: boolean;
  wantsChallenge?: boolean;
}):
  | 'accuracy'
  | 'clarity'
  | 'confidence'
  | 'consistency'
  | 'retry_success'
  | 'rule_use'
  | 'pronunciation'
  | 'structure'
  | 'momentum'
  | undefined {
  const {
    learnerState,
    concept,
    mistake,
    repeatedMistake,
    isCorrectiveTurn,
    wantsChallenge,
  } = args;

  const conceptText = lower(concept);
  const mistakeText = lower(mistake);
  const hay = `${conceptText} ${mistakeText}`;

  if (repeatedMistake && isCorrectiveTurn) return 'retry_success';
  if (wantsChallenge || learnerState.momentum === 'flowing') return 'momentum';
  if (learnerState.clarity === 'clear') return 'clarity';

  if (
    hay.includes('pronunciation') ||
    hay.includes('stress') ||
    hay.includes('sound') ||
    hay.includes('intonation') ||
    hay.includes('accent')
  ) {
    return 'pronunciation';
  }

  if (
    hay.includes('structure') ||
    hay.includes('grammar') ||
    hay.includes('tense') ||
    hay.includes('word order') ||
    hay.includes('sentence')
  ) {
    return 'structure';
  }

  if (conceptText) return 'rule_use';
  if (mistakeText) return 'accuracy';

  return undefined;
}

function isPastTenseLike(input: MercyTeachingTurnInput): boolean {
  const concept = lower(input.concept);
  const mistake = lower(input.correction?.mistake);
  const learnerText = lower(input.learnerText);

  return (
    concept.includes('past') ||
    concept.includes('tense') ||
    mistake.includes('go') ||
    mistake.includes('went') ||
    learnerText.includes('yesterday') ||
    learnerText.includes('i go') ||
    learnerText.includes('go ')
  );
}

function buildPastTenseFallbackText(args: {
  input: MercyTeachingTurnInput;
  teachingMode: ResponsePlan['teachingMode'];
  repeatedMistake: boolean;
}): { text: string; textAlt: string } | null {
  const { input, teachingMode, repeatedMistake } = args;

  if (!isPastTenseLike(input)) {
    return null;
  }

  const shortFix = input.correction?.fix || 'Say "went to school yesterday".';
  const nextPrompt = cleanText(input.nextPrompt || '');
  const tryLine = 'Try: I went there yesterday.';

  if (teachingMode === 'correct') {
    if (repeatedMistake) {
      return {
        text: `Let's review this once more. Pause here. Focus on past tense. ${tryLine} Keep it simple and clear.`,
        textAlt: `Hãy ôn lại phần này thêm một lần nữa. Dừng lại ở đây nhé. Tập trung vào thì quá khứ. ${tryLine} Giữ cho thật đơn giản và rõ ràng.`,
      };
    }

    const opener = input.userName ? `${input.userName}, you're close.` : "You're close.";
    const promptLine = nextPrompt || tryLine;

    return {
      text: `${opener} Small fix: ${shortFix} ${promptLine}`,
      textAlt: `Nhẹ nhàng thôi, bạn gần đúng rồi. Sửa nhẹ: ${shortFix} ${promptLine}`,
    };
  }

  if (teachingMode === 'review') {
    const prefix = repeatedMistake
      ? `Let's review this once more.`
      : `Good. Let’s stay with this idea one more round.`;

    return {
      text: `${prefix} Focus on past tense. ${tryLine}`,
      textAlt: `${repeatedMistake ? 'Hãy ôn lại phần này thêm một lần nữa.' : 'Tốt. Mình ở lại với ý này thêm một vòng nữa nhé.'} Tập trung vào thì quá khứ. ${tryLine}`,
    };
  }

  return null;
}

export function mapTierToTeacherLevel(userTier: string): TeacherLevel {
  if (userTier === 'vip3' || userTier === 'vip4' || userTier === 'vip5') {
    return 'intense';
  }

  if (userTier === 'vip1' || userTier === 'vip2') {
    return 'normal';
  }

  return 'gentle';
}

export function generateRoomGreeting(context: MercyHostContext): MercyGreeting {
  const { userName, userTier, roomTitle, language } = context;

  const name = getResolvedName(userName, language);
  const altName = getAltResolvedName(userName, language);

  const template = getGreetingByTier(userTier);

  const rawText = formatGreeting(template, name, roomTitle, language);
  const rawTextAlt = formatGreeting(
    template,
    altName,
    roomTitle,
    language === 'vi' ? 'en' : 'vi'
  );

  const styled =
    language === 'vi'
      ? applyPersonality(rawTextAlt, rawText, getGreetingPersonalityContext(userTier))
      : applyPersonality(rawText, rawTextAlt, getGreetingPersonalityContext(userTier));

  return {
    text: language === 'vi' ? cleanText(styled.vi) : cleanText(styled.en),
    textAlt: language === 'vi' ? cleanText(styled.en) : cleanText(styled.vi),
    isVip: VIP_TIERS.has(userTier),
  };
}

export function generateTeacherGreeting(
  context: MercyHostContext,
  teacherLevel?: TeacherLevel
): MercyGreeting {
  const { userName, userTier, language } = context;
  const resolvedLevel = teacherLevel || mapTierToTeacherLevel(userTier);

  const tip = getTeacherTip({
    teacherLevel: resolvedLevel,
    context: 'ef_room_enter',
    userName: userName || undefined,
  });

  return {
    text: language === 'vi' ? cleanText(tip.vi) : cleanText(tip.en),
    textAlt: language === 'vi' ? cleanText(tip.en) : cleanText(tip.vi),
    isVip: VIP_TIERS.has(userTier),
  };
}

export function generateTeacherTip(params: {
  language: 'en' | 'vi';
  teacherLevel: TeacherLevel;
  context: TeacherContext;
  userName?: string | null;
}): MercyGreeting {
  const tip = getTeacherTip({
    teacherLevel: params.teacherLevel,
    context: params.context,
    userName: params.userName || undefined,
  });

  return {
    text: params.language === 'vi' ? cleanText(tip.vi) : cleanText(tip.en),
    textAlt: params.language === 'vi' ? cleanText(tip.en) : cleanText(tip.vi),
    isVip: false,
  };
}

export function generateTeacherReply(
  input: MercyTeacherReplyInput
): MercyTeacherReply {
  const {
    language,
    teacherLevel,
    context,
    learnerText,
    correction,
    explanation,
    nextPrompt,
    repeatedMistake,
    wantsChallenge,
    wantsExplanation,
  } = input;

  const plan = buildTeacherPlan({
    teacherLevel,
    context,
    learnerText,
    correction,
    explanation,
    nextPrompt,
    repeatedMistake,
    wantsChallenge,
    wantsExplanation,
    userName: input.userName || undefined,
  });

  const rendered = renderTeacherResponse({
    teacherLevel,
    context,
    learnerText,
    correction,
    explanation,
    nextPrompt,
    repeatedMistake,
    wantsChallenge,
    wantsExplanation,
    userName: input.userName || undefined,
  });

  return {
    text: language === 'vi' ? cleanText(rendered.vi) : cleanText(rendered.en),
    textAlt: language === 'vi' ? cleanText(rendered.en) : cleanText(rendered.vi),
    move: plan.move,
    tone: plan.tone,
  };
}

export function generateTeachingTurn(
  input: MercyTeachingTurnInput
): MercyTeachingTurnResult {
  const signals = buildTeachingSignals({
    userId: input.userId,
    language: input.language,
    learnerText: input.learnerText,
    concept: input.concept,
    correction: input.correction,
    explanation: input.explanation,
    isCorrectiveTurn: input.isCorrectiveTurn,
    wantsChallenge: input.wantsChallenge,
    wantsExplanation: input.wantsExplanation,
    wantsDrill: input.wantsDrill,
    wantsRecap: input.wantsRecap,
    suppressHumor: input.suppressHumor,
    requireDirectness: input.requireDirectness,
    softenTone: input.softenTone,
    repeatedMistake: input.repeatedMistake,
  });

  const memoryBefore = loadLessonMemory(signals.userId);
  const curriculumBefore = loadCurriculumState();

  const teacherMemoryInsight = getTeacherMemoryInsight({
    userId: signals.userId,
    teachingMode:
      input.isCorrectiveTurn || input.correction
        ? 'correct'
        : input.wantsRecap
          ? 'recap'
          : input.wantsDrill
            ? 'drill'
            : input.wantsChallenge
              ? 'challenge'
              : 'encourage',
    concept: input.concept,
    mistake: input.correction?.mistake,
  });

  const resolvedRepeatedMistake =
    Boolean(input.repeatedMistake) ||
    Boolean(signals.repeatedMistake) ||
    teacherMemoryInsight.shouldReferencePriorMistake;

  const planning = buildTeachingPlan(
    {
      currentDifficulty: input.currentDifficulty,
      memory: memoryBefore,
      correction: input.correction,
      explanation: input.explanation,
      isCorrectiveTurn: input.isCorrectiveTurn,
      wantsChallenge: input.wantsChallenge,
      wantsDrill: input.wantsDrill,
      wantsRecap: input.wantsRecap,
      repeatedMistake: resolvedRepeatedMistake,
    },
    {
      ...signals,
      repeatedMistake: resolvedRepeatedMistake,
    }
  );

  const effectivePlan =
    input.nextPrompt && !planning.plan.addNextStep
      ? { ...planning.plan, addNextStep: true }
      : planning.plan;

  const supportiveRepeatedCorrection =
    resolvedRepeatedMistake &&
    (effectivePlan.teachingMode === 'correct' || effectivePlan.teachingMode === 'review') &&
    (
      signals.learnerState.affect === 'discouraged' ||
      signals.emotion.primarySignal === 'discouraged' ||
      signals.emotion.primarySignal === 'frustrated' ||
      signals.learnerState.confidence === 'low'
    );

  const resolvedToneName =
    supportiveRepeatedCorrection
      ? 'warm'
      : effectivePlan.teachingMode === 'correct' ||
          effectivePlan.teachingMode === 'review' ||
          effectivePlan.teachingMode === 'recap' ||
          effectivePlan.teachingMode === 'drill'
        ? 'calm'
        : planning.calibrated.tone;

  const resolvedShouldBeBrief =
    effectivePlan.teachingMode === 'review' || effectivePlan.teachingMode === 'recap'
      ? false
      : Boolean(planning.calibrated.shouldBeBrief) ||
        Boolean(input.requireDirectness) ||
        signals.learnerState.confidence === 'high';

  const resolvedShouldUseHumor =
    effectivePlan.teachingMode === 'challenge'
      ? resolvedToneName === 'playful' &&
        !resolvedRepeatedMistake &&
        !signals.shouldReviewConcept &&
        !input.requireDirectness &&
        !signals.isSensitiveMoment
      : Boolean(planning.calibrated.shouldUseHumor) &&
        !resolvedRepeatedMistake &&
        !signals.shouldReviewConcept &&
        !input.requireDirectness &&
        !signals.isSensitiveMoment &&
        signals.learnerState.confidence !== 'high';

  const resolvedCorrectionStyle =
    supportiveRepeatedCorrection ? 'gentle' : planning.calibrated.correctionStyle;

  const resolvedTone: ToneCalibrationResult = {
    ...planning.calibrated,
    tone: resolvedToneName,
    correctionStyle: resolvedCorrectionStyle,
    shouldUseHumor: resolvedShouldUseHumor,
    shouldBeBrief: resolvedShouldBeBrief,
  };

  const specificPraise = getSpecificPraiseText({
    language: input.language,
    concept: input.concept,
    mistake: input.correction?.mistake,
    fix: input.correction?.fix,
    learnerText: input.learnerText,
    repeatedMistake: resolvedRepeatedMistake,
    wasCorrectiveTurn: signals.isCorrectiveTurn,
    wantsChallenge: input.wantsChallenge,
    improvementType: inferPraiseImprovementType({
      learnerState: signals.learnerState,
      concept: input.concept,
      mistake: input.correction?.mistake,
      repeatedMistake: resolvedRepeatedMistake,
      isCorrectiveTurn: signals.isCorrectiveTurn,
      wantsChallenge: input.wantsChallenge,
    }),
    length:
      resolvedRepeatedMistake || signals.isSensitiveMoment ? 'short' : 'medium',
  });

  const finalPlan: ResponsePlan = {
    ...effectivePlan,
    shouldUseHumor: resolvedShouldUseHumor,
  };

  const strategy =
    finalPlan.teachingMode === 'correct' && input.correction
      ? buildCorrectionStrategy(resolvedCorrectionStyle, input.correction, {
          tone: resolvedTone.tone,
          nextPrompt: input.nextPrompt,
          specificPraise,
          learnerName: input.userName || undefined,
          concept: input.concept,
          example: input.example,
          repeatedMistake: resolvedRepeatedMistake,
          isSensitiveMoment: signals.isSensitiveMoment,
          wantsChallenge: input.wantsChallenge,
          wantsExplanation: signals.wantsExplanation,
        })
      : buildTeachingStrategy({
          mode: finalPlan.teachingMode,
          tone: resolvedTone.tone,
          correction: input.correction,
          summary: input.summary,
          explanation: input.explanation,
          example: input.example,
          concept: input.concept,
          cue: input.nextPrompt,
          nextPrompt: input.nextPrompt,
          specificPraise,
          learnerName: input.userName || undefined,
          repeatedMistake: resolvedRepeatedMistake,
          isSensitiveMoment: signals.isSensitiveMoment,
          wantsChallenge: input.wantsChallenge,
          wantsExplanation: signals.wantsExplanation,
        });

  const dialogue = buildTeacherDialogue({
    userId: signals.userId,
    userName: input.userName,
    language: input.language,
    learnerText: input.learnerText,
    concept: input.concept,
    mistake: input.correction?.mistake,
    plan: finalPlan,
    tone: resolvedTone,
    strategy,
    humorStyle: deriveHumorStyle(input),
    allowHumor: resolvedTone.shouldUseHumor,
    humorContext:
      finalPlan.teachingMode === 'challenge'
        ? 'challenge'
        : finalPlan.teachingMode === 'correct'
          ? 'correction'
          : finalPlan.teachingMode === 'drill'
            ? 'pronunciation'
            : planning.difficulty.direction === 'up'
              ? 'streak'
              : 'success',
    isConfused: signals.learnerState.clarity === 'lost',
    isFrustrated: signals.learnerState.affect === 'frustrated',
    isSensitiveMoment: signals.isSensitiveMoment,
    repeatedMistake: resolvedRepeatedMistake,
    allowBossJoke: detectBossJoke(input.learnerText),
  });

  const fallbackDialogue = buildPastTenseFallbackText({
    input,
    teachingMode: finalPlan.teachingMode,
    repeatedMistake: resolvedRepeatedMistake,
  });

  const finalText = fallbackDialogue?.text ?? dialogue.text;
  const finalTextAlt = fallbackDialogue?.textAlt ?? dialogue.textAlt;

  const memory = updateLessonMemory(
    {
      correct: !(input.isCorrectiveTurn || input.correction),
      mistake: input.correction?.mistake,
      concept: signals.conceptKey,
    },
    signals.userId
  );

  const curriculum = signals.conceptKey
    ? updateCurriculumTopic({
        topic: signals.conceptKey,
        correct: !(input.isCorrectiveTurn || input.correction),
      })
    : curriculumBefore;

  const curriculumRecommendation = getCurriculumRecommendation();

  const planningAdaptive = planning.adaptive as AdaptiveTeachingAdjustment & {
    preferredTone?: string;
    explanationDepthBias?: number;
    shouldAcknowledgeEffort?: boolean;
  };

  const adaptive: AdaptiveTeachingAdjustment = {
    ...planning.adaptive,
    preferredTone: planningAdaptive.preferredTone ?? resolvedTone.tone,
    explanationDepthBias:
      typeof planningAdaptive.explanationDepthBias === 'number'
        ? planningAdaptive.explanationDepthBias
        : signals.learnerState.clarity === 'lost' || signals.wantsExplanation
          ? 0.85
          : 0.5,
    shouldAcknowledgeEffort:
      planningAdaptive.shouldAcknowledgeEffort ?? resolvedRepeatedMistake,
  };

  const emotion: TeacherEmotionState = {
    ...signals.emotion,
    momentumProtection:
      signals.emotion.momentumProtection || resolvedRepeatedMistake,
  };

  return {
    text: finalText,
    textAlt: finalTextAlt,
    learnerState: signals.learnerState,
    emotion,
    adaptive,
    plan: finalPlan,
    tone: resolvedTone,
    strategy,
    memory,
    curriculum,
    curriculumRecommendation,
    difficulty: planning.difficulty,
    guardSignals: signals.guardSignals,
    repeatedMistake: resolvedRepeatedMistake,
    shouldReviewConcept: signals.shouldReviewConcept,
  };
}

export function generateEnglishFoundationReply(input: {
  userId?: string | null;
  userName?: string | null;
  userTier?: string;
  language: 'en' | 'vi';
  learnerText: string;
  correction?: {
    mistake: string;
    fix: string;
  };
  explanation?: string;
  nextPrompt?: string;
  concept?: string;
  summary?: string;
  example?: string;
  currentDifficulty?: DifficultyLevel;
  wantsChallenge?: boolean;
  wantsExplanation?: boolean;
  wantsDrill?: boolean;
  wantsRecap?: boolean;
  repeatedMistake?: boolean;
}): MercyTeachingTurnResult {
  return generateTeachingTurn({
    ...input,
    teacherLevel: resolveTeacherLevel(undefined, input.userTier),
    isCorrectiveTurn: !!input.correction,
  });
}

export function summarizeTeachingTurn(result: MercyTeachingTurnResult): string {
  const modeProfile = getTeachingModeProfile(result.plan.teachingMode);

  return cleanText(
    [
      `mode=${modeProfile.mode}`,
      `tone=${result.tone.tone}`,
      `reason=${result.plan.reason}`,
      `difficulty=${result.difficulty.direction}`,
      `repeat=${String(result.repeatedMistake)}`,
      `review=${String(result.shouldReviewConcept)}`,
    ].join(' | ')
  );
}

export function generateColorModeResponse(language: 'en' | 'vi'): string | null {
  if (Math.random() > 0.3) {
    return null;
  }

  const template = getRandomGreeting(COLOR_MODE_RESPONSES);
  const styled = applyPersonality(template.en, template.vi, 'default');

  return language === 'vi' ? cleanText(styled.vi) : cleanText(styled.en);
}

export function getGreetingSessionKey(roomId: string): string {
  return `mercy_greeting_shown_${roomId}`;
}

export function wasGreetingShown(roomId: string): boolean {
  try {
    return sessionStorage.getItem(getGreetingSessionKey(roomId)) === 'true';
  } catch {
    return false;
  }
}

export function markGreetingShown(roomId: string): void {
  try {
    sessionStorage.setItem(getGreetingSessionKey(roomId), 'true');
  } catch {
    // Ignore storage errors
  }
}

export type { GreetingTemplate, TeacherContext, TeacherLevel };
export { FALLBACK_NAMES };