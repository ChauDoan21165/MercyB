import type {
  TeachingDecision,
  ParagraphAnalysis,
  WritingMode,
} from './decision';

type PracticeTask =
  | {
      type: 'quickFix';
      focus: string;
      question: string;
      options: string[];
      answer: string;
      explanation: string;
      priority: number;
    }
  | {
      type: 'contrast';
      focus: string;
      question: string;
      examples: string[];
      explanation: string;
      priority: number;
    }
  | {
      type: 'production';
      focus: string;
      instruction: string;
      targetPattern?: string;
      priority: number;
    }
  | {
      type: 'review';
      focus: string;
      instruction: string;
      targetPattern?: string;
      explanation?: string;
      priority: number;
    }
  | {
      type: 'linking';
      focus: string;
      instruction: string;
      pairs?: string[];
      targetPattern?: string;
      explanation?: string;
      priority: number;
    }
  | {
      type: 'rewrite';
      focus: string;
      instruction: string;
      sourceText?: string;
      targetPattern?: string;
      explanation?: string;
      priority: number;
    };

export function buildPracticeFromDecision(input: {
  decision: TeachingDecision;
  correctedText: string;
  writingMode?: WritingMode;
  paragraphAnalysis?: ParagraphAnalysis;
}): { mode: 'coach'; tasks: PracticeTask[] } {
  const { decision, correctedText, writingMode, paragraphAnalysis } = input;

  const tasks: PracticeTask[] = decision.taskPlan.map((plan) => {
    if (plan.type === 'linking') {
      return {
        type: 'linking',
        focus: plan.focus,
        instruction:
          writingMode === 'paragraph' || writingMode === 'essay'
            ? 'Add linking words or short transition phrases so the paragraph moves more smoothly from one sentence to the next.'
            : 'Connect the ideas more clearly.',
        pairs: [
          'past event → present result',
          'main idea → supporting detail',
        ],
        targetPattern: 'linking devices',
        explanation:
          paragraphAnalysis?.ideaConnection === 'developing' ||
          paragraphAnalysis?.flow === 'developing'
            ? 'Your paragraph is understandable, but the sentences need clearer bridges.'
            : plan.reason,
        priority: plan.priority,
      };
    }

    if (plan.type === 'rewrite') {
      return {
        type: 'rewrite',
        focus: plan.focus,
        instruction:
          writingMode === 'paragraph' || writingMode === 'essay'
            ? 'Rewrite the paragraph so the ideas connect more smoothly and the time frame feels easier to follow.'
            : 'Rewrite this for clearer structure.',
        sourceText: correctedText,
        targetPattern: 'cohesion',
        explanation:
          paragraphAnalysis?.tenseConsistency === 'mixed but controlled'
            ? 'Keep the contrast, but make the transition between past and present feel smoother.'
            : plan.reason,
        priority: plan.priority,
      };
    }

    if (plan.type === 'review') {
      return {
        type: 'review',
        focus: plan.focus,
        instruction:
          'Review the contrast carefully: one action is finished, while the other is ongoing or still connected to the present.',
        targetPattern: 'mixed tense control',
        explanation: plan.reason,
        priority: plan.priority,
      };
    }

    if (plan.type === 'contrast') {
      return {
        type: 'contrast',
        focus: plan.focus,
        question: 'What is the difference between these two meanings?',
        examples: [
          'I built my garage last year.',
          'I have been building my garage this year.',
        ],
        explanation: plan.reason,
        priority: plan.priority,
      };
    }

    if (plan.focus === 'simple past with finished time markers') {
      return {
        type: 'quickFix',
        focus: plan.focus,
        question: 'Choose the correct sentence:',
        options: ['I have built it yesterday.', 'I built it yesterday.'],
        answer: 'I built it yesterday.',
        explanation: 'Use simple past with a finished past-time marker like “yesterday”.',
        priority: plan.priority,
      };
    }

    if (plan.focus === 'present continuous for ongoing action') {
      return {
        type: 'quickFix',
        focus: plan.focus,
        question: 'Choose the better sentence for an action happening now:',
        options: ['Now I have done my homework.', 'Now I am doing my homework.'],
        answer: 'Now I am doing my homework.',
        explanation: 'Present continuous is usually more natural when the action is happening right now.',
        priority: plan.priority,
      };
    }

    return {
      type: 'production',
      focus: plan.focus,
      instruction:
        'Write a short follow-up that keeps the same meaning but improves clarity and connection.',
      targetPattern: 'cohesion',
      priority: plan.priority,
    };
  });

  return {
    mode: 'coach',
    tasks,
  };
}