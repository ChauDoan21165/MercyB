export type QuickFixTask = {
  type: 'quickFix';
  focus: string;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
  priority: number;
};

export type ContrastTask = {
  type: 'contrast';
  focus: string;
  question: string;
  examples: string[];
  explanation: string;
  priority: number;
};

export type ProductionTask = {
  type: 'production';
  focus: string;
  instruction: string;
  targetPattern?: string;
  priority: number;
};

export type PracticeTask = QuickFixTask | ContrastTask | ProductionTask;

export type PracticeBlock = {
  mode: 'coach' | 'explain' | 'challenge';
  tasks: PracticeTask[];
  quickFix?: {
    question: string;
    options: string[];
    answer: string;
    explanation: string;
  };
  contrast?: {
    question: string;
    examples: string[];
    explanation: string;
  };
  production?: {
    instruction: string;
  };
};

export type TeachingDecision = {
  primaryFocus: string;
  secondaryFocuses: string[];
  praiseFocus?: string;
  learnerLevelSignal: string;
  responseMode: 'explain' | 'coach' | 'challenge';
  taskPlan: {
    type: 'quickFix' | 'contrast' | 'production' | 'review';
    focus: string;
    priority: number;
    reason: string;
  }[];
  shouldReviewOldIssue: boolean;
  shouldIntroduceStretchTask: boolean;
  shouldReduceExplanation: boolean;
  explanationDepth: 'full' | 'medium' | 'minimal';
  responseTone: 'supportive' | 'balanced' | 'pushing';
};

export type MercyResponse = {
  correctedText: string;
  enhancedText?: string;
  explanation?: string;
  issues?: {
    original: string;
    corrected: string;
    reason: string;
    category?: string;
    grammarPoint?: string;
  }[];
  grammarPoints?: string[];
  tenseAnalysis?: {
    detected: string[];
    likelyMainTense: string | null;
    dominantTenseProfile: {
      primary: string;
      distribution: Record<string, number>;
    };
    notes: string[];
  };
  score?: {
    grammar: number;
    clarity: number;
    naturalness: number;
  };
  practice?: PracticeBlock;
  overallAssessment?: string;
  levelSignal?: string;
  teachingPoints?: string[];
  advancedPatterns?: {
    name: string;
    example: string;
    explanation: string;
    level?: 'basic' | 'intermediate' | 'advanced';
  }[];
  structureAnalysis?: {
    sentenceCount: number;
    complexity: 'basic' | 'intermediate' | 'advanced';
    variety: string[];
  };
  debugServerVersion?: string;
  decision?: TeachingDecision;
};