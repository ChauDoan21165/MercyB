/**
 * VERSION: teacherTimingEngine.ts v1.1
 *
 * Teacher Timing Engine
 *
 * Purpose:
 * - shape how Mercy paces a reply like a real teacher
 * - decide when Mercy should be brief, when to pause, and when to chunk
 * - reduce the "wall of explanation" feeling
 *
 * Why this matters:
 * - real teachers slow down under confusion
 * - they speak in shorter chunks during correction
 * - they use slightly longer flow only when the learner is stable
 *
 * Design rules:
 * - timing is a rendering aid, not pedagogy itself
 * - sensitive moments should feel lighter and easier to process
 * - challenge moments can be tighter and more energetic
 * - recap should be compact and clean
 */

import type { TeachingMode } from './teachingModes';
import type { LearnerState } from './learnerState';
import type { TeacherEmotionState } from './teacherEmotionModel';
import type { AdaptiveLessonFlowResult } from './adaptiveLessonFlowEngine';

export type TeacherTimingStyle =
  | 'soft_pause'
  | 'tight_compact'
  | 'steady_guided'
  | 'worked_example'
  | 'recap_compact'
  | 'challenge_push';

export interface TeacherTimingInput {
  learnerState: LearnerState;
  emotion: TeacherEmotionState;
  lessonFlow: AdaptiveLessonFlowResult;
  teachingMode: TeachingMode;

  isSensitiveMoment?: boolean;
  repeatedMistake?: boolean;
  shouldUseWorkedExample?: boolean;
  shouldForceRecap?: boolean;
}

export interface TeacherTimingResult {
  style: TeacherTimingStyle;

  maxSentences: number;
  shouldSplitTeachAndAction: boolean;
  shouldUseMicroPause: boolean;
  shouldUseStepNumbers: boolean;
  shouldFrontloadReassurance: boolean;
  shouldTrimEncouragement: boolean;

  rationale: string[];
}

export interface TeacherTimingApplyInput {
  text: string;
  timing: TeacherTimingResult;
}

function cleanText(text: string): string {
  return String(text ?? '')
    .replace(/\s+/g, ' ')
    .replace(/\s([,.!?;:])/g, '$1')
    .trim();
}

function splitSentences(text: string): string[] {
  const cleaned = cleanText(text);
  if (!cleaned) return [];

  const parts = cleaned.match(/[^.!?]+[.!?]?/g) || [];
  return parts.map((part) => cleanText(part)).filter(Boolean);
}

function ensureTerminalPunctuation(text: string): string {
  const cleaned = cleanText(text);
  if (!cleaned) return '';
  return /[.!?]$/.test(cleaned) ? cleaned : `${cleaned}.`;
}

export function teacherTimingEngine(
  input: TeacherTimingInput
): TeacherTimingResult {
  const {
    learnerState,
    emotion,
    lessonFlow,
    teachingMode,
    isSensitiveMoment = false,
    repeatedMistake = false,
    shouldUseWorkedExample = false,
    shouldForceRecap = false,
  } = input;

  let style: TeacherTimingStyle = 'steady_guided';
  let maxSentences = 3;
  let shouldSplitTeachAndAction = false;
  let shouldUseMicroPause = false;
  let shouldUseStepNumbers = false;
  let shouldFrontloadReassurance = false;
  let shouldTrimEncouragement = false;

  const rationale: string[] = [];

  if (
    learnerState.clarity === 'lost' ||
    emotion.primarySignal === 'overwhelmed' ||
    emotion.cognitiveLoadLevel === 'high'
  ) {
    style = 'soft_pause';
    // Bug fix:
    // 2 sentences was clipping the action / next-step line in confused explanation turns.
    maxSentences = 3;
    shouldSplitTeachAndAction = true;
    shouldUseMicroPause = true;
    shouldFrontloadReassurance = true;
    shouldTrimEncouragement = false;
    rationale.push('overload_soft_pause');
  } else if (shouldUseWorkedExample || lessonFlow.shouldUseWorkedExample) {
    style = 'worked_example';
    maxSentences = 4;
    shouldSplitTeachAndAction = true;
    shouldUseMicroPause = true;
    shouldUseStepNumbers = true;
    shouldFrontloadReassurance = isSensitiveMoment;
    shouldTrimEncouragement = true;
    rationale.push('worked_example_shape');
  } else if (
    shouldForceRecap ||
    lessonFlow.shouldForceRecap ||
    teachingMode === 'recap'
  ) {
    style = 'recap_compact';
    maxSentences = 2;
    shouldSplitTeachAndAction = false;
    shouldUseMicroPause = false;
    shouldTrimEncouragement = true;
    rationale.push('recap_compact_shape');
  } else if (teachingMode === 'review') {
    // Bug fix:
    // review turns need room for the concept reminder plus the retry/action line.
    style = 'steady_guided';
    maxSentences = 3;
    shouldSplitTeachAndAction = true;
    shouldUseMicroPause = false;
    shouldFrontloadReassurance = isSensitiveMoment || repeatedMistake;
    shouldTrimEncouragement = true;
    rationale.push('review_guided_shape');
  } else if (teachingMode === 'challenge' || lessonFlow.stage === 'advance') {
    style = 'challenge_push';
    maxSentences = 2;
    shouldSplitTeachAndAction = false;
    shouldUseMicroPause = false;
    shouldTrimEncouragement = true;
    rationale.push('challenge_push_shape');
  } else if (
    teachingMode === 'correct' ||
    repeatedMistake ||
    lessonFlow.stage === 'retry'
  ) {
    style = 'tight_compact';
    // Bug fix:
    // 2 sentences was dropping the retry / next-step instruction on correction turns.
    maxSentences = 3;
    shouldSplitTeachAndAction = true;
    shouldUseMicroPause = false;
    shouldFrontloadReassurance = isSensitiveMoment;
    shouldTrimEncouragement = true;
    rationale.push('correction_compact_shape');
  } else {
    style = 'steady_guided';
    maxSentences = learnerState.clarity === 'clear' ? 3 : 2;
    shouldSplitTeachAndAction = learnerState.clarity !== 'clear';
    shouldUseMicroPause = learnerState.clarity === 'shaky';
    shouldTrimEncouragement = false;
    rationale.push('steady_guided_shape');
  }

  if (
    emotion.primarySignal === 'embarrassed' ||
    emotion.primarySignal === 'discouraged'
  ) {
    shouldFrontloadReassurance = true;
    shouldUseMicroPause = true;
    rationale.push('protect_dignity_timing');
  }

  return {
    style,
    maxSentences,
    shouldSplitTeachAndAction,
    shouldUseMicroPause,
    shouldUseStepNumbers,
    shouldFrontloadReassurance,
    shouldTrimEncouragement,
    rationale,
  };
}

export function applyTeacherTiming(
  input: TeacherTimingApplyInput
): string {
  const { text, timing } = input;
  const sentences = splitSentences(text);

  if (sentences.length === 0) return '';

  const limited = sentences.slice(0, timing.maxSentences);

  if (timing.shouldUseStepNumbers && limited.length >= 2) {
    const numbered = limited.map((sentence, index) => {
      const cleaned = sentence.replace(/^\d+[\).\s-]*/, '');
      return `${index + 1}. ${ensureTerminalPunctuation(cleaned)}`;
    });

    return cleanText(numbered.join(' '));
  }

  if (timing.shouldSplitTeachAndAction && limited.length >= 2) {
    const first = ensureTerminalPunctuation(limited[0]!);
    const rest = limited.slice(1).map(ensureTerminalPunctuation).join(' ');

    if (timing.shouldUseMicroPause) {
      return cleanText(`${first} ${rest ? 'Pause here. ' : ''}${rest}`);
    }

    return cleanText(`${first} ${rest}`);
  }

  return cleanText(limited.map(ensureTerminalPunctuation).join(' '));
}

export default teacherTimingEngine;