/**
 * Mercy Host - Main Module
 *
 * Central logic for Mercy's hosting behavior across all rooms.
 *
 * Upgrade goals:
 * - calmer, more teacher-like room greetings
 * - support teacher-mode planning without breaking existing callers
 * - keep personality as a rendering layer, not the decision layer
 * - orchestrate Mercy's teaching pipeline in one place
 * - apply teacher rhythm before humor/personality rendering
 * - centralize final dialogue assembly through teacherDialogueBuilder
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
import { inferLearnerState, type LearnerState } from './learnerState';
import {
  buildResponsePlan,
  type ResponsePlan,
  type ToneStyle,
} from './responsePlanner';
import { calibrateTone, type ToneCalibrationResult } from './toneCalibration';
import {
  buildTeachingStrategy,
  buildCorrectionStrategy,
  type TeachingStrategyResult,
} from './teachingStrategies';
import { getTeachingModeProfile } from './teachingModes';
import {
  loadLessonMemory,
  updateLessonMemory,
  isRepeatedMistake,
  shouldReviewConcept,
  type LessonMemoryState,
} from './lessonMemory';
import {
  loadCurriculumState,
  updateCurriculumTopic,
  getCurriculumRecommendation,
  type CurriculumRecommendation,
  type CurriculumState,
} from './curriculumTracker';
import {
  getRecommendedDifficulty,
  type DifficultyLevel,
  type DifficultySnapshot,
} from './difficultyScaler';
import { detectBossJoke, type HumorStyle } from './humorEngine';
import { inferGuardToneSignals, type GuardToneSignals } from './guard';
import { buildTeacherDialogue } from './teacherDialogueBuilder';

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
}

export interface MercyTeachingTurnResult {
  text: string;
  textAlt: string;
  learnerState: LearnerState;
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

function resolveDifficulty(
  currentDifficulty?: DifficultyLevel
): DifficultyLevel {
  return currentDifficulty || 'medium';
}

function deriveHumorStyle(input: MercyTeachingTurnInput): HumorStyle {
  if (input.humorStyle) return input.humorStyle;
  if (detectBossJoke(input.learnerText)) return 'teacher_wit';
  if (input.teacherLevel === 'intense') return 'dry';
  return 'teacher_wit';
}

export function mapTierToTeacherLevel(userTier: string): TeacherLevel {
  if (VIP_TIERS.has(userTier)) {
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
  const userId = input.userId || 'default';
  const learnerState = inferLearnerState(input.learnerText);
  const guardSignals = inferGuardToneSignals(input.learnerText);

  const conceptKey = input.concept || input.correction?.mistake || undefined;
  const repeatedMistake = input.correction?.mistake
    ? isRepeatedMistake(input.correction.mistake, userId)
    : !!input.repeatedMistake;

  const shouldReview = conceptKey
    ? shouldReviewConcept(conceptKey, userId)
    : false;

  const memoryBefore = loadLessonMemory(userId);
  const curriculumBefore = loadCurriculumState();

  const difficulty = getRecommendedDifficulty({
    current: resolveDifficulty(input.currentDifficulty),
    memory: memoryBefore,
    repeatedMistake,
    recentCorrect: !input.isCorrectiveTurn && !input.correction,
    lowConfidence: learnerState.confidence === 'low',
    confused: learnerState.clarity === 'lost',
  });

  const plan = buildResponsePlan({
    learnerState,
    isCorrectiveTurn: input.isCorrectiveTurn || !!input.correction,
    wantsChallenge: input.wantsChallenge,
    wantsExplanation: input.wantsExplanation || !!input.explanation,
    wantsDrill: input.wantsDrill,
    wantsRecap: input.wantsRecap,
    repeatedMistake,
    shouldReviewConcept: shouldReview,
    difficultyDirection: difficulty.direction,
    suppressHumor: input.suppressHumor ?? guardSignals.suppressHumor,
    requireDirectness: input.requireDirectness ?? guardSignals.requireDirectness,
    softenTone: input.softenTone ?? guardSignals.softenTone,
  });

  const calibrated = calibrateTone({
    learnerState,
    plan,
    suppressHumor: input.suppressHumor ?? guardSignals.suppressHumor,
    requireDirectness: input.requireDirectness ?? guardSignals.requireDirectness,
    softenTone: input.softenTone ?? guardSignals.softenTone,
    repeatedMistake,
    shouldReviewConcept: shouldReview,
    wantsExplanation: input.wantsExplanation || !!input.explanation,
    wantsRecap: input.wantsRecap,
    wantsDrill: input.wantsDrill,
  });

  const strategy =
    plan.teachingMode === 'correct' && input.correction
      ? buildCorrectionStrategy(calibrated.correctionStyle, input.correction, {
          tone: calibrated.tone,
          nextPrompt: input.nextPrompt,
          learnerName: input.userName || undefined,
          concept: input.concept,
          example: input.example,
        })
      : buildTeachingStrategy({
          mode: plan.teachingMode,
          tone: calibrated.tone,
          correction: input.correction,
          summary: input.summary,
          explanation: input.explanation,
          example: input.example,
          concept: input.concept,
          cue: input.nextPrompt,
          nextPrompt: input.nextPrompt,
          specificPraise: undefined,
          learnerName: input.userName || undefined,
        });

  const dialogue = buildTeacherDialogue({
    userId,
    userName: input.userName,
    language: input.language,
    learnerText: input.learnerText,
    concept: input.concept,
    mistake: input.correction?.mistake,
    plan,
    tone: calibrated,
    strategy,
    humorStyle: deriveHumorStyle(input),
    allowHumor: calibrated.shouldUseHumor,
    humorContext:
      plan.teachingMode === 'challenge'
        ? 'challenge'
        : plan.teachingMode === 'correct'
          ? 'correction'
          : plan.teachingMode === 'drill'
            ? 'pronunciation'
            : difficulty.direction === 'up'
              ? 'streak'
              : 'success',
    isConfused: learnerState.clarity === 'lost',
    isFrustrated: learnerState.affect === 'frustrated',
    isSensitiveMoment:
      learnerState.affect === 'frustrated' || learnerState.confidence === 'low',
    repeatedMistake,
    allowBossJoke: detectBossJoke(input.learnerText),
  });

  const memory = updateLessonMemory(
    {
      correct: !(input.isCorrectiveTurn || input.correction),
      mistake: input.correction?.mistake,
      concept: conceptKey,
    },
    userId
  );

  const curriculum =
    conceptKey
      ? updateCurriculumTopic({
          topic: conceptKey,
          correct: !(input.isCorrectiveTurn || input.correction),
        })
      : curriculumBefore;

  const curriculumRecommendation = getCurriculumRecommendation();

  return {
    text: dialogue.text,
    textAlt: dialogue.textAlt,
    learnerState,
    plan,
    tone: calibrated,
    strategy,
    memory,
    curriculum,
    curriculumRecommendation,
    difficulty,
    guardSignals,
    repeatedMistake,
    shouldReviewConcept: shouldReview,
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