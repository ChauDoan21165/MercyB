// PATH: src/components/mercy-guide/tabs/grammar-writing/types.ts

export type TeacherTaskType =
  | 'quickFix'
  | 'contrast'
  | 'rewrite'
  | 'linking'
  | 'production'
  | 'review';

export type WritingMode = 'sentence' | 'paragraph' | 'essay';

export type GrammarIssue = {
  original?: string;
  corrected?: string;
  reason?: string;
  category?: string;
  grammarPoint?: string;
};

export type TenseProfile = {
  primary?: string;
  distribution?: Record<string, number>;
  name?: string;
  confidence?: number;
};

export type AdvancedPattern = {
  label?: string;
  name?: string;
  explanation?: string;
  example?: string;
  level?: 'basic' | 'intermediate' | 'advanced';
};

export type StructureAnalysis = {
  sentenceCount?: number;
  complexity?: 'basic' | 'intermediate' | 'advanced';
  variety?: string[];
  strengths?: string[];
  weaknesses?: string[];
  recommendations?: string[];
};

export type GrammarGloss = {
  label?: string;
  glossVi?: string;
};

export type PracticeTaskBase = {
  priority: number;
  focus?: string;
  instruction?: string;
  explanation?: string;
};

export type QuickFixTask = PracticeTaskBase & {
  type: 'quickFix';
  question?: string;
  options?: string[];
  answer?: string;
};

export type ContrastTask = PracticeTaskBase & {
  type: 'contrast';
  question?: string;
  examples?: string[];
};

export type RewriteTask = PracticeTaskBase & {
  type: 'rewrite';
  sourceText?: string;
  targetPattern?: string;
};

export type LinkingTask = PracticeTaskBase & {
  type: 'linking';
  pairs?: string[];
  targetPattern?: string;
};

export type ProductionTask = PracticeTaskBase & {
  type: 'production';
  targetPattern?: string;
};

export type ReviewTask = PracticeTaskBase & {
  type: 'review';
  targetPattern?: string;
};

export type PracticeTask =
  | QuickFixTask
  | ContrastTask
  | RewriteTask
  | LinkingTask
  | ProductionTask
  | ReviewTask;

export type GrammarPractice = {
  mode?: 'coach' | 'explain' | 'challenge';
  tasks?: PracticeTask[];
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
  primaryFocus?: string;
  secondaryFocuses?: string[];
  praiseFocus?: string;
  learnerLevelSignal?: string;
  responseMode?: 'explain' | 'coach' | 'challenge';
  taskPlan?: Array<{
    type?: TeacherTaskType;
    focus?: string;
    priority?: number;
    reason?: string;
  }>;
  shouldReviewOldIssue?: boolean;
  shouldIntroduceStretchTask?: boolean;
  shouldReduceExplanation?: boolean;
  explanationDepth?: 'full' | 'medium' | 'minimal';
  responseTone?: 'supportive' | 'balanced' | 'pushing';
};

export type LearnerMemory = {
  learnerId?: string;
  recurringIssues?: Record<string, number>;
  strengths?: Record<string, number>;
  recentTasks?: Array<{
    type: TeacherTaskType;
    focus: string;
    assignedAt: string;
  }>;
  reviewQueue?: Array<{
    focus: string;
    nextReviewAt: string;
    intervalDays: number;
    successCount: number;
  }>;
  levelTrend?: 'rising' | 'steady' | 'stable' | 'struggling';
  notes?: string[];
};

export type ParagraphAnalysis = {
  flow?: string;
  ideaConnection?: string;
  tenseConsistency?: string;
  notes?: string[];
};

export type TeacherWritingTask = {
  taskType: TeacherTaskType | string;
  focus?: string;
  instruction?: string;
  reason?: string;
  prefillText?: string;
  triggerToken?: string;
};

export type GrammarWritingTeacherState = {
  latestAnalysisResult: GrammarApiResponse | null;
  currentWritingMode?: WritingMode;
  isTeacherInitiated: boolean;
  isRevisionAttempt: boolean;
  latestSubmittedText: string;
  teacherTask?: TeacherWritingTask;
  revisionSourceText?: string;
};

export type GrammarApiResponse = {
  correctedText: string;
  enhancedText?: string;
  editedVersion?: string;
  teacherModelVersion?: string;
  explanation?: string;
  summary?: string;
  nextStep?: string;
  encouragement?: string;
  headline?: string;
  action?: string;
  taskLabel?: string;
  issues?: GrammarIssue[];
  grammarPoints?: string[];
  grammarGloss?: GrammarGloss[];
  fixes?: string[];
  tenseAnalysis?: {
    detected: string[];
    likelyMainTense: string | null;
    dominantTenseProfile?: TenseProfile;
    notes: string[];
  };
  score?: {
    grammar: number;
    clarity: number;
    naturalness: number;
    flow?: number;
    overall?: number;
  };
  practice?: GrammarPractice;
  overallAssessment?: string;
  levelSignal?: string;
  teachingPoints?: string[];
  advancedPatterns?: AdvancedPattern[];
  structureAnalysis?: StructureAnalysis;
  writingMode?: WritingMode;
  paragraphAnalysis?: ParagraphAnalysis;
  debugServerVersion?: string;
  decision?: TeachingDecision;
  memory?: LearnerMemory;
  source?: 'api' | 'fallback';
};

export type AnalyzeGrammarInput = {
  text: string;
  roomId?: string;
  roomTitle?: string;
  englishLevel?: string | null;
  contentEn?: string;
};

export type PronunciationLaunchPayload = {
  sourceText: string;
  correctedText: string;
  enhancedText?: string;
};