/**
 * FILE: src/lib/mercy-host/generateTeachingTurn.ts
 * PATH: src/lib/mercy-host/generateTeachingTurn.ts
 * VERSION: generateTeachingTurn.ts v1.1
 */

import adaptiveTeachingIntelligence, {
  type AdaptiveTeachingAdjustment,
  type AdaptiveTeachingInput,
  type CorrectionStyle,
  type ToneStyle,
} from './adaptiveTeachingIntelligence';
import adaptiveLessonFlowEngine, {
  type AdaptiveLessonFlowInput,
  type AdaptiveLessonFlowResult,
} from './adaptiveLessonFlowEngine';
import type { DifficultyDirection } from './difficultyScaler';
import type { LearnerState } from './learnerState';
import type { TeacherEmotionState } from './teacherEmotionModel';
import type { TeachingMode } from './teachingModes';
import {
  buildVinglishGuidance,
  resolveVinglishFriendlyMode,
  type VinglishGuidance,
} from '../feedback/vinglish-detector';
import {
  MERCY_PERSONA_CONFIG,
  pickAfterMistakeLine,
} from '@/config/mercyPersona';

export interface GenerateTeachingTurnInput {
  learnerState: LearnerState;
  emotion: TeacherEmotionState;

  learnerName?: string | null;
  concept?: string | null;
  mistake?: string | null;
  learnerText?: string | null;

  currentMode?: TeachingMode;
  difficultyDirection?: DifficultyDirection;

  isCorrectiveTurn?: boolean;
  wantsChallenge?: boolean;
  wantsExplanation?: boolean;
  wantsDrill?: boolean;
  wantsRecap?: boolean;
  repeatedMistake?: boolean;
  shouldReviewConcept?: boolean;
  requireDirectness?: boolean;

  recentModes?: TeachingMode[];
  sameConceptStreak?: number;
  recentSuccess?: boolean;

  adaptive?: AdaptiveTeachingAdjustment;
  lessonFlow?: AdaptiveLessonFlowResult;

  // Vinglish (VN-EN code-switching) inputs. Both optional and additive —
  // omitting them preserves the pre-Step-10 behaviour exactly.
  /** User's CEFR level (pre_a1 | a1 | a2 | b1 | b2 | c1 | c2). */
  learnerCefrLevel?: string | null;
  /** profiles.vinglish_friendly_mode override. NULL → infer from CEFR. */
  vinglishFriendlyToggle?: boolean | null;
}

export interface TeachingTurnPlan {
  teachingMode: TeachingMode;
  reason:
    | 'encouragement'
    | 'explanation'
    | 'correction'
    | 'repeated_mistake'
    | 'review_required'
    | 'recap_required'
    | 'drill_requested'
    | 'challenge'
    | 'steady_progress';
  difficultyDirection: DifficultyDirection;
  shouldUseHumor: boolean;
}

export interface TeachingTurnTone {
  tone: ToneStyle;
  correctionStyle: CorrectionStyle;
  shouldUseHumor: boolean;
  shouldBeBrief: boolean;
  notes: string[];
}

export interface GeneratedTeachingTurn {
  text: string;
  textAlt: string;

  plan: TeachingTurnPlan;
  tone: TeachingTurnTone;

  adaptive: AdaptiveTeachingAdjustment;
  lessonFlow: AdaptiveLessonFlowResult;
  emotion: TeacherEmotionState;

  repeatedMistake: boolean;
  shouldReviewConcept: boolean;
  concept?: string | null;
  mistake?: string | null;

  /**
   * Populated when the learner's text contains VN-EN code-switching AND
   * Vinglish-friendly mode is on for this user. Null otherwise. Consumers
   * (UI / chat composer) can render the gentle modeling alongside or
   * instead of `text` without changing the existing strict-correction
   * path. See src/lib/feedback/vinglish-detector.ts.
   */
  vinglishGuidance?: VinglishGuidance | null;
}

export interface TeachingTurnSummary {
  mode: TeachingMode;
  tone: ToneStyle;
  reason: TeachingTurnPlan['reason'];
  shouldUseHumor: boolean;
  shouldBeBrief: boolean;
  repeatedMistake: boolean;
  shouldReviewConcept: boolean;
}

function normalize(value?: string | null): string {
  return (value ?? '').trim().toLowerCase();
}

function chooseCorrectionStyle(
  adaptive: AdaptiveTeachingAdjustment,
  requireDirectness: boolean
): CorrectionStyle {
  if (adaptive.preferredCorrectionStyle) {
    return adaptive.preferredCorrectionStyle;
  }

  return requireDirectness ? 'direct' : 'gentle';
}

function chooseTone(
  mode: TeachingMode,
  adaptive: AdaptiveTeachingAdjustment,
  _emotion: TeacherEmotionState,
  requireDirectness: boolean,
  repeatedMistake: boolean
): ToneStyle {
  if (
    mode === 'correct' ||
    mode === 'review' ||
    mode === 'recap' ||
    mode === 'drill'
  ) {
    return 'calm';
  }

  if (mode === 'explain') {
    return 'warm';
  }

  if (adaptive.preferredTone) {
    if (adaptive.preferredTone === 'playful' && requireDirectness) {
      return 'calm';
    }

    return adaptive.preferredTone;
  }

  if (mode === 'challenge' && !requireDirectness) {
    return 'playful';
  }

  if (repeatedMistake) {
    return 'calm';
  }

  return 'calm';
}

function chooseHumor(
  mode: TeachingMode,
  tone: ToneStyle,
  input: GenerateTeachingTurnInput,
  shouldBeBrief: boolean
): boolean {
  const {
    requireDirectness = false,
    repeatedMistake = false,
    shouldReviewConcept = false,
  } = input;

  if (
    requireDirectness ||
    repeatedMistake ||
    shouldReviewConcept ||
    shouldBeBrief ||
    input.learnerState.confidence === 'high'
  ) {
    return false;
  }

  if (
    input.emotion.primarySignal === 'overwhelmed' ||
    input.emotion.primarySignal === 'discouraged' ||
    input.emotion.primarySignal === 'embarrassed'
  ) {
    return false;
  }

  return mode === 'challenge' && tone === 'playful';
}

function chooseTeachingMode(
  input: GenerateTeachingTurnInput,
  adaptive: AdaptiveTeachingAdjustment,
  lessonFlow: AdaptiveLessonFlowResult
): TeachingMode {
  if (input.wantsRecap) {
    return 'recap';
  }

  if (input.wantsDrill) {
    return 'drill';
  }

  if (input.shouldReviewConcept && !input.wantsExplanation) {
    return 'review';
  }

  if (input.repeatedMistake) {
    const affect: string | undefined = input.learnerState.affect;
    return affect === 'discouraged' ? 'review' : 'correct';
  }

  if (lessonFlow.preferredNextMode) {
    return lessonFlow.preferredNextMode;
  }

  if (adaptive.preferredTeachingMode) {
    return adaptive.preferredTeachingMode;
  }

  if (input.wantsExplanation) {
    return 'explain';
  }

  if (input.wantsChallenge) {
    return 'challenge';
  }

  if (input.isCorrectiveTurn) {
    return 'correct';
  }

  return input.currentMode ?? 'encourage';
}

function chooseReason(
  mode: TeachingMode,
  input: GenerateTeachingTurnInput
): TeachingTurnPlan['reason'] {
  if (input.wantsRecap) {
    return 'recap_required';
  }

  if (input.repeatedMistake) {
    return 'repeated_mistake';
  }

  if (input.shouldReviewConcept) {
    return 'review_required';
  }

  if (input.wantsDrill || mode === 'drill') {
    return 'drill_requested';
  }

  if (input.wantsChallenge || mode === 'challenge') {
    return 'challenge';
  }

  if (input.wantsExplanation || mode === 'explain') {
    return 'explanation';
  }

  if (input.isCorrectiveTurn || mode === 'correct') {
    return 'correction';
  }

  if (mode === 'encourage') {
    return 'encouragement';
  }

  return 'steady_progress';
}

function chooseDifficultyDirection(
  input: GenerateTeachingTurnInput,
  adaptive: AdaptiveTeachingAdjustment,
  lessonFlow: AdaptiveLessonFlowResult
): DifficultyDirection {
  if (input.wantsRecap) {
    return 'hold';
  }

  if (input.repeatedMistake || input.shouldReviewConcept) {
    return 'down';
  }

  if (lessonFlow.preferredDifficultyDirection) {
    return lessonFlow.preferredDifficultyDirection;
  }

  if (adaptive.preferredDifficultyDirection) {
    return adaptive.preferredDifficultyDirection;
  }

  return input.difficultyDirection ?? 'hold';
}

function deriveConcreteFix(input: GenerateTeachingTurnInput): {
  shortFix: string;
  tryLine: string;
  explainLine: string;
  reviewLine: string;
  recapLine: string;
  drillLine: string;
} {
  const learnerText = normalize(input.learnerText);
  const concept = normalize(input.concept);
  const mistake = normalize(input.mistake);

  const looksLikePastTense =
    concept.includes('past') ||
    concept.includes('tense') ||
    mistake.includes('past') ||
    mistake.includes('go') ||
    mistake.includes('went') ||
    mistake.includes('-ed') ||
    learnerText.includes('yesterday') ||
    learnerText.includes('go ') ||
    learnerText.includes('went ') ||
    learnerText.includes('i go') ||
    learnerText.includes('i went');

  if (looksLikePastTense) {
    return {
      shortFix: 'Say "went to school yesterday".',
      tryLine: 'Try: I went there yesterday.',
      explainLine: 'Use "went" because "go" changes in the past tense.',
      reviewLine: 'Focus on past tense.',
      recapLine: 'Use it for past actions connected to the present.',
      drillLine: 'Say: went, saw, had.',
    };
  }

  const looksLikePresentPerfect =
    concept.includes('present perfect') ||
    concept.includes('have + past participle') ||
    mistake.includes('present perfect');

  if (looksLikePresentPerfect) {
    return {
      shortFix: 'Use "have" + past participle.',
      tryLine: 'Try: I have finished my homework.',
      explainLine:
        'Use "have" + past participle for past actions connected to the present.',
      reviewLine: 'Focus on have + past participle.',
      recapLine: 'Use it for past actions connected to the present.',
      drillLine: 'Say: have eaten, has gone, have finished.',
    };
  }

  const looksLikePronunciation =
    concept.includes('pronunciation') ||
    concept.includes('sound') ||
    concept.includes('vowel') ||
    mistake.includes('pronunciation');

  if (looksLikePronunciation) {
    return {
      shortFix: 'Say: cat, hat, late.',
      tryLine: 'Try the set again: cat, hat, late.',
      explainLine: 'Keep the vowel clear and steady.',
      reviewLine: 'Focus on the sound shape.',
      recapLine: 'Keep the sound steady from start to finish.',
      drillLine: 'Say: cat, hat, late.',
    };
  }

  return {
    shortFix: 'Use the corrected form once more.',
    tryLine: 'Try one short sentence with the corrected form.',
    explainLine: 'Here is the key point. Keep the target form simple and stable.',
    reviewLine: 'Focus on the target structure.',
    recapLine: 'Use the form the same way in one short sentence.',
    drillLine: 'Say the target form clearly two times.',
  };
}

function getChallengePrompt(input: GenerateTeachingTurnInput): string {
  const learnerText = (input.learnerText ?? '').trim();

  if (learnerText.startsWith('Rewrite:') || learnerText.startsWith('Translate:')) {
    return learnerText;
  }

  if (learnerText.includes('"') && !learnerText.endsWith('?')) {
    return `Rewrite: ${learnerText}`;
  }

  return 'Translate: If I had known, I would have called.';
}

function buildEnglishText(
  mode: TeachingMode,
  tone: ToneStyle,
  input: GenerateTeachingTurnInput
): string {
  const learnerName = input.learnerName?.trim();
  const fix = deriveConcreteFix(input);
  const persona = MERCY_PERSONA_CONFIG;

  if (mode === 'correct') {
    const opener = pickAfterMistakeLine('en', learnerName ?? null, Boolean(input.repeatedMistake));
    return `${opener} Small fix: ${fix.shortFix} ${fix.tryLine}`;
  }

  if (mode === 'explain') {
    const acknowledgement = persona.fillers.acknowledging.en[0];
    return `Here is the key point. ${fix.explainLine} Now say: I went home early. ${acknowledgement}`;
  }

  if (mode === 'challenge') {
    const prompt = getChallengePrompt(input);
    const playfulTail =
      tone === 'playful'
        ? ' Good. Now let us make the sentence earn its lunch.'
        : '';
    return `Now take it one step further. ${prompt}${playfulTail}`;
  }

  if (mode === 'review') {
    const prefix = input.repeatedMistake
      ? persona.encouragements.afterMistake.enRepeated[0]
      : persona.encouragements.afterStreak.en[0];
    const closing = persona.fillers.acknowledging.en[1]; // "You're doing well."
    return `${prefix} ${fix.reviewLine} ${fix.tryLine} ${closing}`;
  }

  if (mode === 'recap') {
    const filler = persona.fillers.thinking.en[1]; // "Gently."
    const closing = persona.fillers.thinking.en[0]; // "Take your time."
    return `${filler.replace(/\.$/, ',')} ${fix.recapLine} Now make one sentence with have + past participle. ${closing}`;
  }

  if (mode === 'drill') {
    const filler = persona.fillers.thinking.en[1]; // "Gently."
    const closing = persona.fillers.thinking.en[0]; // "Take your time."
    return `${filler.replace(/\.$/, ',')} ${fix.drillLine} ${fix.drillLine} ${closing}`;
  }

  if (mode === 'encourage') {
    return persona.encouragements.afterCorrect.en[0];
  }

  return `Stay with this idea one more round. ${fix.tryLine}`;
}

function buildAltText(
  mode: TeachingMode,
  input: GenerateTeachingTurnInput
): string {
  const learnerName = input.learnerName?.trim();
  const fix = deriveConcreteFix(input);
  const persona = MERCY_PERSONA_CONFIG;
  const NEXT = persona.codeSwitch.vnNextStepMarker;

  if (mode === 'correct') {
    const opener = pickAfterMistakeLine('vi', learnerName ?? null, Boolean(input.repeatedMistake));
    const ack = persona.fillers.acknowledging.vi[0]; // "Mình ở đây với bạn."
    return `${opener} Sửa nhẹ: ${fix.shortFix} ${NEXT} ${fix.tryLine} ${ack}`;
  }

  if (mode === 'explain') {
    const ack = persona.fillers.acknowledging.vi[0]; // "Mình ở đây với bạn."
    return `Đây là điểm chính. ${fix.explainLine} ${NEXT} Now say: I went home early. ${ack}`;
  }

  if (mode === 'challenge') {
    const prompt = getChallengePrompt(input);
    return `Giờ tiến thêm một bước nữa. ${NEXT} ${prompt} Tốt. Giờ hãy làm cho câu này làm việc xứng đáng hơn.`;
  }

  if (mode === 'review') {
    const prefix = input.repeatedMistake
      ? persona.encouragements.afterMistake.viRepeated[0]
      : persona.encouragements.afterStreak.vi[0];
    const closing = persona.fillers.closing.vi[0]; // "Mình sẽ làm cho điều này rõ hơn."
    return `${prefix} ${fix.reviewLine} ${NEXT} ${fix.tryLine} ${closing}`;
  }

  if (mode === 'recap') {
    const opener = persona.fillers.thinking.vi[0]; // "Không vội đâu —"
    const closing = persona.fillers.closing.vi[0]; // "Mình sẽ làm cho điều này rõ hơn."
    return `${opener} ${fix.recapLine} ${NEXT} Now make one sentence with have + past participle. ${closing}`;
  }

  if (mode === 'drill') {
    const opener = persona.fillers.thinking.vi[1]; // "Nhẹ nhàng thôi,"
    const closing = persona.fillers.acknowledging.vi[1]; // "Bạn đang làm tốt lắm."
    return `${opener} ${fix.drillLine} ${NEXT} ${fix.drillLine} ${closing}`;
  }

  if (mode === 'encourage') {
    return persona.encouragements.afterCorrect.vi[0];
  }

  return `Mình ở lại với ý này cùng bạn. ${NEXT} ${fix.tryLine}`;
}

export function generateTeachingTurn(
  input: GenerateTeachingTurnInput
): GeneratedTeachingTurn {
  const adaptiveInput: AdaptiveTeachingInput = {
    learnerState: input.learnerState,
    emotion: input.emotion,
    isCorrectiveTurn: input.isCorrectiveTurn,
    wantsChallenge: input.wantsChallenge,
    wantsExplanation: input.wantsExplanation,
    wantsDrill: input.wantsDrill,
    wantsRecap: input.wantsRecap,
    repeatedMistake: input.repeatedMistake,
    shouldReviewConcept: input.shouldReviewConcept,
    difficultyDirection: input.difficultyDirection,
    requireDirectness: input.requireDirectness,
  };

  const adaptive = input.adaptive ?? adaptiveTeachingIntelligence(adaptiveInput);

  const lessonFlowInput: AdaptiveLessonFlowInput = {
    learnerState: input.learnerState,
    emotion: input.emotion,
    adaptive,
    currentMode: input.currentMode ?? 'encourage',
    repeatedMistake: input.repeatedMistake,
    shouldReviewConcept: input.shouldReviewConcept,
    wantsChallenge: input.wantsChallenge,
    wantsExplanation: input.wantsExplanation,
    wantsDrill: input.wantsDrill,
    wantsRecap: input.wantsRecap,
    recentModes: input.recentModes,
    sameConceptStreak: input.sameConceptStreak,
    recentSuccess: input.recentSuccess,
  };

  const lessonFlow = input.lessonFlow ?? adaptiveLessonFlowEngine(lessonFlowInput);

  const teachingMode = chooseTeachingMode(input, adaptive, lessonFlow);
  const toneStyle = chooseTone(
    teachingMode,
    adaptive,
    input.emotion,
    Boolean(input.requireDirectness),
    Boolean(input.repeatedMistake)
  );
  const correctionStyle = chooseCorrectionStyle(
    adaptive,
    Boolean(input.requireDirectness)
  );
  const difficultyDirection = chooseDifficultyDirection(input, adaptive, lessonFlow);
  const reason = chooseReason(teachingMode, input);

  const shouldBeBrief =
    Boolean(adaptive.shouldStayBrief) ||
    Boolean(input.requireDirectness) ||
    input.learnerState.confidence === 'high';

  const shouldUseHumor = chooseHumor(teachingMode, toneStyle, input, shouldBeBrief);

  const toneNotes: string[] = [];

  if (input.repeatedMistake) {
    toneNotes.push('repeated_mistake_focus');
  }

  if (input.shouldReviewConcept) {
    toneNotes.push('review_focus');
  }

  if (input.requireDirectness) {
    toneNotes.push('directness_required');
  }

  if (
    input.emotion.primarySignal === 'overwhelmed' ||
    input.emotion.primarySignal === 'discouraged' ||
    input.emotion.primarySignal === 'embarrassed'
  ) {
    toneNotes.push('sensitive_moment');
  }

  const plan: TeachingTurnPlan = {
    teachingMode,
    reason,
    difficultyDirection,
    shouldUseHumor,
  };

  const tone: TeachingTurnTone = {
    tone: toneStyle,
    correctionStyle,
    shouldUseHumor,
    shouldBeBrief,
    notes: toneNotes,
  };

  const text = buildEnglishText(teachingMode, toneStyle, input);
  const textAlt = buildAltText(teachingMode, input);

  // Vinglish detection runs unconditionally so we can collect signal even
  // when the toggle is off; the buildVinglishGuidance call returns null
  // when the toggle is off, so consumers see no behavioural change for
  // strict-mode users. See src/lib/feedback/vinglish-detector.ts.
  const vinglishFriendlyEnabled = resolveVinglishFriendlyMode({
    explicitToggle: input.vinglishFriendlyToggle,
    cefrLevel: input.learnerCefrLevel,
  });
  const vinglishGuidance = buildVinglishGuidance({
    learnerText: input.learnerText,
    vinglishFriendlyEnabled,
  });

  return {
    text,
    textAlt,
    plan,
    tone,
    adaptive,
    lessonFlow,
    emotion: input.emotion,
    repeatedMistake: Boolean(input.repeatedMistake),
    shouldReviewConcept: Boolean(input.shouldReviewConcept),
    concept: input.concept ?? null,
    vinglishGuidance,
    mistake: input.mistake ?? null,
  };
}

export function summarizeTeachingTurn(
  result: GeneratedTeachingTurn
): TeachingTurnSummary {
  return {
    mode: result.plan.teachingMode,
    tone: result.tone.tone,
    reason: result.plan.reason,
    shouldUseHumor: result.tone.shouldUseHumor,
    shouldBeBrief: result.tone.shouldBeBrief,
    repeatedMistake: result.repeatedMistake,
    shouldReviewConcept: result.shouldReviewConcept,
  };
}

export function pickStablePlanFields(result: GeneratedTeachingTurn): {
  mode: TeachingMode;
  reason: TeachingTurnPlan['reason'];
  difficultyDirection: DifficultyDirection;
  shouldUseHumor: boolean;
} {
  return {
    mode: result.plan.teachingMode,
    reason: result.plan.reason,
    difficultyDirection: result.plan.difficultyDirection,
    shouldUseHumor: result.plan.shouldUseHumor,
  };
}

export function pickStableToneFields(result: GeneratedTeachingTurn): {
  tone: ToneStyle;
  correctionStyle: CorrectionStyle;
  shouldUseHumor: boolean;
  shouldBeBrief: boolean;
} {
  return {
    tone: result.tone.tone,
    correctionStyle: result.tone.correctionStyle,
    shouldUseHumor: result.tone.shouldUseHumor,
    shouldBeBrief: result.tone.shouldBeBrief,
  };
}

export default generateTeachingTurn;