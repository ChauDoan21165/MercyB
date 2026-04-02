export type ResponseMode = 'explain' | 'coach' | 'challenge';

export type AnalysisResult = {
  grammarPoints: string[];
  issues: string[];
  advancedPatterns: {
    name: string;
    example: string;
    explanation: string;
    level: 'intermediate' | 'advanced';
  }[];
  tenseAnalysis: {
    detected: string[];
    likelyMainTense: string;
    dominantTenseProfile?: {
      primary: string;
      distribution: Record<string, number>;
    };
    notes: string[];
  };
  structureAnalysis: {
    sentenceCount: number;
    complexity: 'basic' | 'intermediate' | 'advanced';
    variety: string[];
  };
  score: {
    grammar: number;
    clarity: number;
    naturalness: number;
  };
  levelSignal?: string;
};

export type LearnerMemory = {
  learnerId: string;
  recurringIssues: Record<string, number>;
  strengths: Record<string, number>;
  recentTasks: {
    type: 'quickFix' | 'contrast' | 'production' | 'review';
    focus: string;
    assignedAt: string;
  }[];
  reviewQueue: {
    focus: string;
    nextReviewAt: string;
    intervalDays: number;
    successCount: number;
  }[];
  levelTrend?: 'rising' | 'stable' | 'struggling';
};

export type TaskPlanItem = {
  type: 'quickFix' | 'contrast' | 'production' | 'review';
  focus: string;
  priority: number;
  reason: string;
};

export type TeachingDecision = {
  primaryFocus: string;
  secondaryFocuses: string[];
  praiseFocus?: string;
  learnerLevelSignal: string;
  responseMode: ResponseMode;
  taskPlan: TaskPlanItem[];
  shouldReviewOldIssue: boolean;
  shouldIntroduceStretchTask: boolean;
  shouldReduceExplanation: boolean;
  explanationDepth: 'full' | 'medium' | 'minimal';
  responseTone: 'supportive' | 'balanced' | 'pushing';
};