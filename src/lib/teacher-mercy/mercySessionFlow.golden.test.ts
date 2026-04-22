/**
 * VERSION: mercySessionFlow.golden.test.ts v5
 *
 * Why this version:
 * - responsePlanner.ts should be imported as a NAMED export (`buildResponsePlan`)
 *   because your earlier source file exported `export function buildResponsePlan(...)`
 * - teacherEmotionModel.ts and adaptiveTeachingIntelligence.ts are kept as default imports
 * - removes the runtime export-resolution helper that was likely picking the wrong thing
 */

import { beforeEach, describe, expect, it } from 'vitest';
import type { LearnerState } from './learnerState';
import { buildResponsePlan } from './responsePlanner';
import teacherEmotionModel from './teacherEmotionModel';
import adaptiveTeachingIntelligence from './adaptiveTeachingIntelligence';
import {
  clearTeacherContinuity,
  getTeacherContinuitySuggestion,
  updateTeacherContinuity,
} from './teacherContinuity';
import {
  checkRepetition,
  clearRepetitionGuardState,
  pickLeastRepeatedCandidate,
  recordReplyParts,
} from './repetitionGuard';
import {
  clearLearningStyleProfile,
  getLearningStyleSignals,
  loadLearningStyleProfile,
  updateLearningStyleProfile,
} from './learningStyleProfile';

type GoldenTurn = {
  turn: number;
  label:
    | 'confusion'
    | 'explanation_followup'
    | 'correction'
    | 'retry'
    | 'success'
    | 'challenge'
    | 'recap'
    | 'return_after_mistake';
  learnerState: LearnerState;
  plan: ReturnType<typeof buildResponsePlan>;
  emotion: ReturnType<typeof teacherEmotionModel>;
  adaptive: ReturnType<typeof adaptiveTeachingIntelligence>;
  continuity: ReturnType<typeof getTeacherContinuitySuggestion>;
  opening: string;
  encouragement?: string;
  action: string;
};

function makeLearnerState(overrides: Partial<LearnerState> = {}): LearnerState {
  return {
    confidence: 'medium',
    clarity: 'shaky',
    momentum: 'steady',
    affect: 'neutral',
    ...overrides,
  };
}

describe('Mercy session-flow golden test', () => {
  const userId = 'golden-session-user';

  const openingPool = {
    confusion: [
      'Okay, let’s slow this down.',
      'Alright, let’s take this one carefully.',
      'No rush. Let’s make this clear.',
    ],
    correction: [
      'Good catch. Let’s clean up the exact point.',
      'Almost there. Let’s fix the exact step.',
      'Okay, same target — cleaner this time.',
    ],
    progress: [
      'Good. That moved forward.',
      'Nice. That got cleaner.',
      'Yes. That’s more solid now.',
    ],
    challenge: [
      'Good. Now we can push one step further.',
      'Nice. Let’s raise it a little.',
      'You’ve got enough footing for one harder rep.',
    ],
    recap: [
      'Let’s lock in what just changed.',
      'Before we move on, let’s recap the pattern.',
      'Good. Now let’s compress the lesson.',
    ],
  };

  const encouragementPool = [
    'You’re still on track.',
    'This is still moving in the right direction.',
    'You’re closer than you think.',
    'That was a real improvement.',
  ];

  const actionPool = {
    explain: [
      'Focus only on the denominator first.',
      'Watch the sign change in just this step.',
      'Track one variable at a time here.',
    ],
    retry: [
      'Try the same move once more.',
      'Do one clean retry on the same idea.',
      'Take one more pass at that exact step.',
    ],
    challenge: [
      'Try one slightly harder version now.',
      'Take the next harder rep.',
      'Push one step beyond the last success.',
    ],
    recap: [
      'Say the rule back in one sentence.',
      'Summarize the pattern in your own words.',
      'Give the clean rule before the next problem.',
    ],
  };

  beforeEach(() => {
    clearTeacherContinuity(userId);
    clearRepetitionGuardState(userId);
    clearLearningStyleProfile(userId);
  });

  function chooseParts(args: {
    openingCandidates: string[];
    encouragementCandidates?: string[];
    actionCandidates: string[];
  }) {
    const opening = pickLeastRepeatedCandidate({
      userId,
      channel: 'opening',
      candidates: args.openingCandidates,
    });

    const encouragement =
      args.encouragementCandidates && args.encouragementCandidates.length > 0
        ? pickLeastRepeatedCandidate({
            userId,
            channel: 'encouragement',
            candidates: args.encouragementCandidates,
          })
        : '';

    const action = pickLeastRepeatedCandidate({
      userId,
      channel: 'action',
      candidates: args.actionCandidates,
    });

    const fullReply = [opening, encouragement, action].filter(Boolean).join(' ');

    recordReplyParts({
      userId,
      opening,
      encouragement,
      action,
      fullReply,
    });

    return {
      opening,
      encouragement,
      action,
      fullReply,
    };
  }

  it('keeps Mercy feeling like one teacher across an 8-turn learning arc', () => {
    expect(typeof buildResponsePlan).toBe('function');
    expect(typeof teacherEmotionModel).toBe('function');
    expect(typeof adaptiveTeachingIntelligence).toBe('function');

    const timeline: GoldenTurn[] = [];

    // 1) confusion
    {
      const learnerState = makeLearnerState({
        clarity: 'lost',
        affect: 'frustrated',
        confidence: 'low',
        momentum: 'stuck',
      });

      updateLearningStyleProfile({
        userId,
        wantsExplanation: true,
        confused: true,
        frustrated: true,
      });

      const emotion = teacherEmotionModel({
        learnerState,
        wantsExplanation: true,
      });

      const adaptive = adaptiveTeachingIntelligence({
        learnerState,
        emotion,
        wantsExplanation: true,
      });

      const plan = buildResponsePlan({
        learnerState,
        wantsExplanation: true,
      });

      const continuity = getTeacherContinuitySuggestion({
        userId,
        nextMode: plan.teachingMode,
        nextConcept: 'fractions',
        nextMistake: 'denominator confusion',
      });

      const parts = chooseParts({
        openingCandidates: openingPool.confusion,
        encouragementCandidates: encouragementPool,
        actionCandidates: actionPool.explain,
      });

      updateTeacherContinuity(
        {
          mode: plan.teachingMode,
          tone: plan.tone,
          concept: 'fractions',
          mistake: 'denominator confusion',
          learnerText: 'I do not get this at all',
          usedHumor: plan.shouldUseHumor,
        },
        userId
      );

      expect(plan.teachingMode).toBe('explain');
      expect(plan.tone).toBe('warm');
      expect(plan.shouldUseHumor).toBe(false);
      expect(plan.difficultyDirection).toBe('down');

      expect(emotion.primarySignal).toBe('overwhelmed');
      expect(emotion.cognitiveLoadLevel).toBe('high');
      expect(emotion.paceAdjustment).toBe('slow');

      expect(adaptive.preferredTone).toBe('warm');
      expect(adaptive.explanationDepthBias).toBeGreaterThan(0.7);
      expect(continuity.reason).toBe('no_prior_turn');

      timeline.push({
        turn: 1,
        label: 'confusion',
        learnerState,
        plan,
        emotion,
        adaptive,
        continuity,
        opening: parts.opening,
        encouragement: parts.encouragement,
        action: parts.action,
      });
    }

    // 2) explanation follow-up
    {
      const learnerState = makeLearnerState({
        clarity: 'lost',
        affect: 'neutral',
        confidence: 'low',
        momentum: 'stuck',
      });

      updateLearningStyleProfile({
        userId,
        wantsExplanation: true,
        confused: true,
      });

      const emotion = teacherEmotionModel({
        learnerState,
        wantsExplanation: true,
      });

      const adaptive = adaptiveTeachingIntelligence({
        learnerState,
        emotion,
        wantsExplanation: true,
      });

      const plan = buildResponsePlan({
        learnerState,
        wantsExplanation: true,
      });

      const continuity = getTeacherContinuitySuggestion({
        userId,
        nextMode: plan.teachingMode,
        nextConcept: 'fractions',
        nextMistake: 'denominator confusion',
      });

      const parts = chooseParts({
        openingCandidates: openingPool.confusion,
        encouragementCandidates: encouragementPool,
        actionCandidates: actionPool.explain,
      });

      updateTeacherContinuity(
        {
          mode: plan.teachingMode,
          tone: plan.tone,
          concept: 'fractions',
          mistake: 'denominator confusion',
          learnerText: 'Wait, why do the denominators have to match?',
          usedHumor: plan.shouldUseHumor,
        },
        userId
      );

      expect(plan.teachingMode).toBe('explain');
      expect(continuity.shouldReferencePreviousTurn).toBe(true);
      expect(continuity.shouldStayWithConcept).toBe(true);
      expect(continuity.reason).toBe('same_concept_followup');

      timeline.push({
        turn: 2,
        label: 'explanation_followup',
        learnerState,
        plan,
        emotion,
        adaptive,
        continuity,
        opening: parts.opening,
        encouragement: parts.encouragement,
        action: parts.action,
      });
    }

    // 3) correction
    {
      const learnerState = makeLearnerState({
        clarity: 'clear',
        affect: 'neutral',
        confidence: 'low',
        momentum: 'stuck',
      });

      const emotion = teacherEmotionModel({
        learnerState,
        isCorrectiveTurn: true,
        repeatedMistake: true,
      });

      const adaptive = adaptiveTeachingIntelligence({
        learnerState,
        emotion,
        isCorrectiveTurn: true,
        repeatedMistake: true,
      });

      const plan = buildResponsePlan({
        learnerState,
        isCorrectiveTurn: true,
        repeatedMistake: true,
      });

      const continuity = getTeacherContinuitySuggestion({
        userId,
        nextMode: plan.teachingMode,
        nextConcept: 'fractions',
        nextMistake: 'denominator confusion',
      });

      const parts = chooseParts({
        openingCandidates: openingPool.correction,
        encouragementCandidates: encouragementPool,
        actionCandidates: actionPool.retry,
      });

      updateTeacherContinuity(
        {
          mode: plan.teachingMode,
          tone: plan.tone,
          concept: 'fractions',
          mistake: 'denominator confusion',
          learnerText: 'So I can just add the top numbers?',
          usedHumor: plan.shouldUseHumor,
        },
        userId
      );

      expect(plan.teachingMode).toBe('correct');
      expect(plan.correctionStyle).not.toBe('direct');
      expect(plan.shouldUseHumor).toBe(false);
      expect(emotion.momentumProtection).toBe(true);
      expect(adaptive.shouldAcknowledgeEffort).toBe(true);

      timeline.push({
        turn: 3,
        label: 'correction',
        learnerState,
        plan,
        emotion,
        adaptive,
        continuity,
        opening: parts.opening,
        encouragement: parts.encouragement,
        action: parts.action,
      });
    }

    // 4) retry
    {
      const learnerState = makeLearnerState({
        clarity: 'clear',
        affect: 'neutral',
        confidence: 'low',
        momentum: 'stuck',
      });

      const emotion = teacherEmotionModel({
        learnerState,
        isCorrectiveTurn: true,
        repeatedMistake: true,
        wantsDrill: true,
      });

      const adaptive = adaptiveTeachingIntelligence({
        learnerState,
        emotion,
        isCorrectiveTurn: true,
        repeatedMistake: true,
        wantsDrill: true,
      });

      const plan = buildResponsePlan({
        learnerState,
        isCorrectiveTurn: true,
        repeatedMistake: true,
        wantsDrill: true,
      });

      const continuity = getTeacherContinuitySuggestion({
        userId,
        nextMode: plan.teachingMode,
        nextConcept: 'fractions',
        nextMistake: 'denominator confusion',
      });

      const parts = chooseParts({
        openingCandidates: openingPool.correction,
        encouragementCandidates: encouragementPool,
        actionCandidates: actionPool.retry,
      });

      updateTeacherContinuity(
        {
          mode: plan.teachingMode,
          tone: plan.tone,
          concept: 'fractions',
          mistake: 'denominator confusion',
          learnerText: 'Okay, I will try that step again',
          usedHumor: plan.shouldUseHumor,
        },
        userId
      );

      expect(continuity.reason).toBe('post_correction_retry');
      expect(continuity.preferredLead).toBe('resume_correction');
      expect(continuity.preferredBridge).toBe('one_more_try');

      timeline.push({
        turn: 4,
        label: 'retry',
        learnerState,
        plan,
        emotion,
        adaptive,
        continuity,
        opening: parts.opening,
        encouragement: parts.encouragement,
        action: parts.action,
      });
    }

    // 5) success
    {
      const learnerState = makeLearnerState({
        clarity: 'clear',
        affect: 'engaged',
        confidence: 'medium',
        momentum: 'flowing',
      });

      updateLearningStyleProfile({
        userId,
        wantsDrill: true,
        correct: true,
      });

      const emotion = teacherEmotionModel({
        learnerState,
      });

      const adaptive = adaptiveTeachingIntelligence({
        learnerState,
        emotion,
      });

      const plan = buildResponsePlan({
        learnerState,
      });

      const continuity = getTeacherContinuitySuggestion({
        userId,
        nextMode: plan.teachingMode,
        nextConcept: 'fractions',
      });

      const parts = chooseParts({
        openingCandidates: openingPool.progress,
        encouragementCandidates: encouragementPool,
        actionCandidates: actionPool.challenge,
      });

      updateTeacherContinuity(
        {
          mode: plan.teachingMode,
          tone: plan.tone,
          concept: 'fractions',
          learnerText: 'Oh, okay, that one worked',
          usedHumor: plan.shouldUseHumor,
        },
        userId
      );

      expect(emotion.challengeReadiness).toBeGreaterThan(0.6);
      expect(adaptive.shouldProtectMomentum).toBe(true);

      timeline.push({
        turn: 5,
        label: 'success',
        learnerState,
        plan,
        emotion,
        adaptive,
        continuity,
        opening: parts.opening,
        encouragement: parts.encouragement,
        action: parts.action,
      });
    }

    // 6) challenge
    {
      const learnerState = makeLearnerState({
        clarity: 'clear',
        affect: 'playful',
        confidence: 'high',
        momentum: 'flowing',
      });

      updateLearningStyleProfile({
        userId,
        wantsChallenge: true,
        correct: true,
      });

      const emotion = teacherEmotionModel({
        learnerState,
        wantsChallenge: true,
      });

      const adaptive = adaptiveTeachingIntelligence({
        learnerState,
        emotion,
        wantsChallenge: true,
        difficultyDirection: 'hold',
      });

      const plan = buildResponsePlan({
        learnerState,
        wantsChallenge: true,
      });

      const continuity = getTeacherContinuitySuggestion({
        userId,
        nextMode: plan.teachingMode,
        nextConcept: 'fractions',
      });

      const parts = chooseParts({
        openingCandidates: openingPool.challenge,
        encouragementCandidates: encouragementPool,
        actionCandidates: actionPool.challenge,
      });

      updateTeacherContinuity(
        {
          mode: plan.teachingMode,
          tone: plan.tone,
          concept: 'fractions',
          learnerText: 'Give me a harder one',
          usedHumor: plan.shouldUseHumor,
        },
        userId
      );

      expect(plan.teachingMode).toBe('challenge');
      expect(plan.difficultyDirection).toBe('up');
      expect(['proud', 'curious']).toContain(emotion.primarySignal ?? '');
      expect(adaptive.preferredDifficultyDirection).toBe('up');

      timeline.push({
        turn: 6,
        label: 'challenge',
        learnerState,
        plan,
        emotion,
        adaptive,
        continuity,
        opening: parts.opening,
        encouragement: parts.encouragement,
        action: parts.action,
      });
    }

    // 7) recap
    {
      const learnerState = makeLearnerState({
        clarity: 'clear',
        affect: 'engaged',
        confidence: 'medium',
        momentum: 'flowing',
      });

      const emotion = teacherEmotionModel({
        learnerState,
        wantsRecap: true,
      });

      const adaptive = adaptiveTeachingIntelligence({
        learnerState,
        emotion,
        wantsRecap: true,
      });

      const plan = buildResponsePlan({
        learnerState,
        wantsRecap: true,
      });

      const continuity = getTeacherContinuitySuggestion({
        userId,
        nextMode: plan.teachingMode,
        nextConcept: 'fractions',
      });

      const parts = chooseParts({
        openingCandidates: openingPool.recap,
        encouragementCandidates: encouragementPool,
        actionCandidates: actionPool.recap,
      });

      updateTeacherContinuity(
        {
          mode: plan.teachingMode,
          tone: plan.tone,
          concept: 'fractions',
          learnerText: 'Can we summarize the rule?',
          usedHumor: plan.shouldUseHumor,
        },
        userId
      );

      expect(plan.teachingMode).toBe('recap');
      expect(plan.difficultyDirection).toBe('hold');
      expect(adaptive.preferredTeachingMode).toBe('recap');

      timeline.push({
        turn: 7,
        label: 'recap',
        learnerState,
        plan,
        emotion,
        adaptive,
        continuity,
        opening: parts.opening,
        encouragement: parts.encouragement,
        action: parts.action,
      });
    }

    // 8) return after mistake
    {
      const learnerState = makeLearnerState({
        clarity: 'clear',
        affect: 'neutral',
        confidence: 'low',
        momentum: 'stuck',
      });

      updateLearningStyleProfile({
        userId,
        confused: true,
      });

      const emotion = teacherEmotionModel({
        learnerState,
        isCorrectiveTurn: true,
        repeatedMistake: true,
      });

      const adaptive = adaptiveTeachingIntelligence({
        learnerState,
        emotion,
        isCorrectiveTurn: true,
        repeatedMistake: true,
      });

      const plan = buildResponsePlan({
        learnerState,
        isCorrectiveTurn: true,
        repeatedMistake: true,
      });

      const continuity = getTeacherContinuitySuggestion({
        userId,
        nextMode: plan.teachingMode,
        nextConcept: 'fractions',
        nextMistake: 'denominator confusion',
      });

      const parts = chooseParts({
        openingCandidates: openingPool.correction,
        encouragementCandidates: encouragementPool,
        actionCandidates: actionPool.retry,
      });

      updateTeacherContinuity(
        {
          mode: plan.teachingMode,
          tone: plan.tone,
          concept: 'fractions',
          mistake: 'denominator confusion',
          learnerText: 'I messed that part up again',
          usedHumor: plan.shouldUseHumor,
        },
        userId
      );

      expect(plan.teachingMode).toBe('correct');
      expect(continuity.shouldReferencePreviousTurn).toBe(true);
      expect(continuity.shouldStayWithConcept).toBe(true);
      expect(continuity.shouldReduceRepetition).toBe(true);

      timeline.push({
        turn: 8,
        label: 'return_after_mistake',
        learnerState,
        plan,
        emotion,
        adaptive,
        continuity,
        opening: parts.opening,
        encouragement: parts.encouragement,
        action: parts.action,
      });
    }

    expect(timeline).toHaveLength(8);

    expect(timeline.map((t) => t.label)).toEqual([
      'confusion',
      'explanation_followup',
      'correction',
      'retry',
      'success',
      'challenge',
      'recap',
      'return_after_mistake',
    ]);

    const openings = timeline.map((t) => t.opening);
    expect(new Set(openings).size).toBeGreaterThanOrEqual(5);

    expect(timeline[0]?.plan.shouldUseHumor).toBe(false);
    expect(timeline[2]?.plan.shouldUseHumor).toBe(false);
    expect(timeline[3]?.plan.shouldUseHumor).toBe(false);
    expect(timeline[7]?.plan.shouldUseHumor).toBe(false);

    expect(timeline[5]?.plan.teachingMode).toBe('challenge');
    expect((timeline[4]?.emotion.challengeReadiness ?? 0)).toBeGreaterThan(0.6);
    expect(timeline[6]?.plan.difficultyDirection).toBe('hold');

    const fullReplies = timeline.map((t) =>
      [t.opening, t.encouragement, t.action].filter(Boolean).join(' ')
    );

    for (const reply of fullReplies) {
      const repetition = checkRepetition({
        userId,
        channel: 'full_reply',
        text: reply,
      });
      expect(['soft_avoid', 'avoid']).toContain(repetition.suggestion);
    }

    const learningProfile = loadLearningStyleProfile(userId);
    const signals = getLearningStyleSignals(learningProfile);

    expect(learningProfile.explanationAffinity).toBeGreaterThan(1);
    expect(learningProfile.challengeAffinity).toBeGreaterThan(1);
    expect(learningProfile.reassuranceNeed).toBeGreaterThan(2);
    expect(signals).toContain('needs_reassurance');
  });
});