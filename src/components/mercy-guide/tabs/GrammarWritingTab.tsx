// File: src/components/mercy-guide/tabs/GrammarWritingTab.tsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertCircle,
  BookOpen,
  CheckCircle2,
  Loader2,
  Sparkles,
  Wand2,
  Brain,
  GraduationCap,
  Layers3,
  Target,
  MemoryStick,
  History,
  Repeat,
  TrendingUp,
  ArrowRight,
  PenSquare,
  Link2,
  Replace,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type TeacherWritingTask = {
  taskType: 'rewrite' | 'linking' | 'quickFix' | 'production' | string;
  focus?: string;
  instruction?: string;
  reason?: string;
  prefillText?: string;
  triggerToken?: string;
};

type GrammarWritingTeacherState = {
  latestAnalysisResult: GrammarApiResponse | null;
  currentWritingMode?: WritingMode;
  isTeacherInitiated: boolean;
  isRevisionAttempt: boolean;
  latestSubmittedText: string;
  teacherTask?: TeacherWritingTask;
  revisionSourceText?: string;
};

type GrammarWritingTabProps = {
  roomId?: string;
  roomTitle?: string;
  contentEn?: string;
  englishLevel?: string | null;
  onPracticePronunciation?: (payload: {
    sourceText: string;
    correctedText: string;
    enhancedText?: string;
  }) => void;
  onAnalysisResult?: (result: GrammarApiResponse | null) => void;
  teacherTask?: TeacherWritingTask;
  onTeacherWritingStateChange?: (state: GrammarWritingTeacherState) => void;
};

type GrammarIssue = {
  original: string;
  corrected: string;
  reason: string;
  category?: string;
  grammarPoint?: string;
};

type QuickFixTask = {
  type: 'quickFix';
  focus: string;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
  priority: number;
};

type ContrastTask = {
  type: 'contrast';
  focus: string;
  question: string;
  examples: string[];
  explanation: string;
  priority: number;
};

type ProductionTask = {
  type: 'production';
  focus: string;
  instruction: string;
  targetPattern?: string;
  priority: number;
};

type LinkingTask = {
  type: 'linking';
  focus: string;
  instruction: string;
  pairs?: string[];
  targetPattern?: string;
  explanation?: string;
  priority: number;
};

type RewriteTask = {
  type: 'rewrite';
  focus: string;
  instruction: string;
  sourceText?: string;
  targetPattern?: string;
  explanation?: string;
  priority: number;
};

type ReviewTask = {
  type: 'review';
  focus: string;
  instruction: string;
  targetPattern?: string;
  explanation?: string;
  priority: number;
};

type PracticeTask =
  | QuickFixTask
  | ContrastTask
  | ProductionTask
  | LinkingTask
  | RewriteTask
  | ReviewTask;

type GrammarPractice = {
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

type AdvancedPattern = {
  name: string;
  example: string;
  explanation: string;
  level?: 'basic' | 'intermediate' | 'advanced';
};

type StructureAnalysis = {
  sentenceCount: number;
  complexity: 'basic' | 'intermediate' | 'advanced';
  variety: string[];
};

type TenseProfile = {
  primary: string;
  distribution: Record<string, number>;
};

type TeachingDecision = {
  primaryFocus: string;
  secondaryFocuses: string[];
  praiseFocus?: string;
  learnerLevelSignal: string;
  responseMode: 'explain' | 'coach' | 'challenge';
  taskPlan: {
    type:
      | 'quickFix'
      | 'contrast'
      | 'production'
      | 'review'
      | 'linking'
      | 'rewrite';
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

type LearnerMemory = {
  learnerId: string;
  recurringIssues: Record<string, number>;
  strengths: Record<string, number>;
  recentTasks: {
    type:
      | 'quickFix'
      | 'contrast'
      | 'production'
      | 'review'
      | 'linking'
      | 'rewrite';
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

type ParagraphAnalysis = {
  flow?: string;
  ideaConnection?: string;
  tenseConsistency?: string;
};

type WritingMode = 'sentence' | 'paragraph' | 'essay';

type GrammarApiResponse = {
  correctedText: string;
  enhancedText?: string;
  explanation?: string;
  issues?: GrammarIssue[];
  grammarPoints?: string[];
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

const GRAMMAR_API_ENDPOINT =
  import.meta.env.VITE_MERCY_API_URL || '/api/mercy/grammar';

const SHOW_DEBUG =
  import.meta.env.DEV || import.meta.env.VITE_SHOW_MERCY_DEBUG === 'true';

const GRAMMAR_GLOSS_MAP: Record<string, string> = {
  'simple past': 'quá khứ đơn',
  'present simple': 'hiện tại đơn',
  'present continuous': 'hiện tại tiếp diễn',
  'present perfect': 'hiện tại hoàn thành',
  'present perfect continuous': 'hiện tại hoàn thành tiếp diễn',
  'past continuous': 'quá khứ tiếp diễn',
  'past perfect': 'quá khứ hoàn thành',
  'future simple': 'tương lai đơn',
  'future continuous': 'tương lai tiếp diễn',
  'future perfect': 'tương lai hoàn thành',
  'passive voice': 'câu bị động',
  'relative clause': 'mệnh đề quan hệ',
  conditionals: 'câu điều kiện',
  'first conditional': 'câu điều kiện loại 1',
  'second conditional': 'câu điều kiện loại 2',
  'third conditional': 'câu điều kiện loại 3',
  'modal verbs': 'động từ khiếm khuyết',
  gerund: 'danh động từ',
  infinitive: 'động từ nguyên mẫu',
  article: 'mạo từ',
  articles: 'mạo từ',
  preposition: 'giới từ',
  prepositions: 'giới từ',
  countable: 'danh từ đếm được',
  uncountable: 'danh từ không đếm được',
  comparison: 'so sánh',
  'comparative structure': 'cấu trúc so sánh',
  'superlative structure': 'cấu trúc so sánh nhất',
  'subject-verb agreement': 'hòa hợp chủ ngữ - động từ',
  'reported speech': 'câu tường thuật',
  'question formation': 'cấu trúc câu hỏi',
  'sentence connector': 'từ nối câu',
  connectors: 'từ nối',
  cohesion: 'liên kết ý',
  coherence: 'mạch lạc',
  'linking devices': 'từ nối',
  'inversion structure': 'cấu trúc đảo ngữ',
  'noun phrase': 'cụm danh từ',
  'verb phrase': 'cụm động từ',
  'adverb clause': 'mệnh đề trạng ngữ',
  'mixed tense control': 'kiểm soát phối hợp thì',
};

function capitalizeFirst(text: string) {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function ensureEndingPunctuation(text: string) {
  if (!text.trim()) return text;
  if (/[.!?]$/.test(text.trim())) return text.trim();
  return `${text.trim()}.`;
}

function toTitleCase(value: string) {
  return value
    .split(' ')
    .map((part) => (part ? capitalizeFirst(part) : part))
    .join(' ');
}

function normalizeGlossKey(value: string) {
  return value.trim().toLowerCase();
}

function normalizeMeaningfulText(value: string) {
  return value.replace(/\s+/g, ' ').trim();
}

function hasMeaningfulDifference(a: string, b: string) {
  return normalizeMeaningfulText(a) !== normalizeMeaningfulText(b);
}

function getGrammarGloss(value?: string) {
  if (!value) return null;
  return GRAMMAR_GLOSS_MAP[normalizeGlossKey(value)] ?? null;
}

function getRankLabel(index: number) {
  if (index === 0) return 'Core Focus';
  if (index === 1) return 'Support';
  return 'Stretch';
}

function formatDateTime(value: string) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString();
}

function getTrendTone(trend?: LearnerMemory['levelTrend']) {
  if (trend === 'rising') {
    return 'border-green-200 bg-green-50 text-green-700';
  }
  if (trend === 'struggling') {
    return 'border-amber-200 bg-amber-50 text-amber-700';
  }
  return 'border-slate-200 bg-slate-50 text-slate-700';
}

function getWritingModeTone(mode?: WritingMode) {
  if (mode === 'essay') return 'border-indigo-200 bg-indigo-50 text-indigo-700';
  if (mode === 'paragraph') return 'border-pink-200 bg-pink-50 text-pink-700';
  return 'border-slate-200 bg-slate-50 text-slate-700';
}

function getTeacherTaskTone(taskType?: string) {
  if (taskType === 'rewrite') return 'border-pink-200 bg-pink-50 text-pink-700';
  if (taskType === 'linking') return 'border-indigo-200 bg-indigo-50 text-indigo-700';
  if (taskType === 'quickFix') return 'border-amber-200 bg-amber-50 text-amber-700';
  if (taskType === 'production') return 'border-green-200 bg-green-50 text-green-700';
  return 'border-slate-200 bg-slate-50 text-slate-700';
}

function getTeacherTaskLabel(taskType?: string) {
  if (!taskType) return 'Teacher Task';
  if (taskType === 'quickFix') return 'Teacher Task · Quick Fix';
  return `Teacher Task · ${toTitleCase(taskType)}`;
}

function shouldAutoApplyTeacherPrefill(input: {
  currentDraft: string;
  hasUserEditedDraft: boolean;
  teacherTask?: TeacherWritingTask;
  previousTriggerToken?: string;
}) {
  const { currentDraft, hasUserEditedDraft, teacherTask, previousTriggerToken } = input;

  if (!teacherTask?.prefillText) return false;

  const trimmedDraft = normalizeMeaningfulText(currentDraft);
  const triggerChanged =
    teacherTask.triggerToken &&
    teacherTask.triggerToken !== previousTriggerToken;

  if (!trimmedDraft) return true;
  if (triggerChanged && !hasUserEditedDraft) return true;

  return false;
}

function buildTeacherInstructionText(teacherTask?: TeacherWritingTask) {
  if (!teacherTask) return null;
  if (teacherTask.instruction) return teacherTask.instruction;
  if (teacherTask.focus) {
    return `Mercy wants you to ${teacherTask.taskType} with focus on ${teacherTask.focus}.`;
  }
  return `Mercy sent you here for a ${teacherTask.taskType} task.`;
}

function getTeacherEmphasis(result: GrammarApiResponse | null, teacherTask?: TeacherWritingTask) {
  if (!result || !teacherTask) return null;

  if (teacherTask.taskType === 'rewrite') {
    return {
      title: 'Teacher focus after analysis',
      subtitle: 'Revision quality and idea flow now matter most.',
      body:
        result.paragraphAnalysis?.flow ||
        result.paragraphAnalysis?.ideaConnection ||
        result.practice?.tasks?.find((task) => task.type === 'rewrite')?.instruction ||
        result.explanation ||
        'Mercy wants your revision to feel more connected and natural from one sentence to the next.',
    };
  }

  if (teacherTask.taskType === 'linking') {
    return {
      title: 'Teacher focus after analysis',
      subtitle: 'Connection and transitions now matter most.',
      body:
        result.paragraphAnalysis?.ideaConnection ||
        result.practice?.tasks?.find((task) => task.type === 'linking')?.instruction ||
        result.paragraphAnalysis?.flow ||
        result.explanation ||
        'Mercy wants stronger bridges between your ideas.',
    };
  }

  if (teacherTask.taskType === 'quickFix') {
    const primaryIssue = result.issues?.[0];
    const quickFixTask = result.practice?.tasks?.find((task) => task.type === 'quickFix');

    return {
      title: 'Teacher focus after analysis',
      subtitle: 'Fix the specific grammar problem first.',
      body:
        primaryIssue?.reason ||
        quickFixTask?.question ||
        quickFixTask?.explanation ||
        result.explanation ||
        'Mercy wants one precise grammar correction before moving on.',
    };
  }

  if (teacherTask.taskType === 'production') {
    const productionTask = result.practice?.tasks?.find((task) => task.type === 'production');

    return {
      title: 'Teacher focus after analysis',
      subtitle: 'Natural learner-generated output matters most.',
      body:
        productionTask?.instruction ||
        result.overallAssessment ||
        result.explanation ||
        'Mercy wants you to produce your own sentence naturally, not only copy corrections.',
    };
  }

  return {
    title: 'Teacher focus after analysis',
    subtitle: 'Mercy is still guiding this writing task.',
    body:
      result.explanation ||
      result.overallAssessment ||
      'Mercy is using the analysis to support the assigned task.',
  };
}

function localGrammarFallback(text: string): GrammarApiResponse {
  let corrected = text.trim();
  const issues: GrammarIssue[] = [];
  const grammarPoints: string[] = [];
  const notes: string[] = [];

  const apply = (
    pattern: RegExp,
    replacement: string,
    reason: string,
    category?: string,
    grammarPoint?: string
  ) => {
    if (pattern.test(corrected)) {
      const before = corrected;
      corrected = corrected.replace(pattern, replacement);
      issues.push({
        original: before,
        corrected,
        reason,
        category,
        grammarPoint,
      });
      if (grammarPoint) grammarPoints.push(grammarPoint);
    }
  };

  apply(
    /\bI very like\b/gi,
    'I really like',
    'Use "really like" instead of "very like".',
    'word choice'
  );
  apply(
    /\bI go\b/gi,
    'I went',
    'When talking about the past, use past tense.',
    'tense',
    'simple past'
  );
  apply(
    /\bbuy many thing\b/gi,
    'bought many things',
    'Use past tense and plural noun here.',
    'grammar',
    'simple past'
  );
  apply(
    /\bit help me\b/gi,
    'it helps me',
    'Third-person singular usually takes "helps".',
    'grammar',
    'present simple'
  );
  apply(
    /\bYesterday I buy\b/gi,
    'Yesterday I bought',
    'Use past tense after "Yesterday".',
    'tense',
    'simple past'
  );
  apply(
    /\byesterday, I bought a house\b/gi,
    'Yesterday, I bought a house',
    'Capitalize the first word for a complete sentence.',
    'capitalization'
  );
  apply(
    /\bcan able to\b/gi,
    'can',
    'Do not use "can" and "able to" together like this.',
    'grammar'
  );
  apply(
    /\bdiscuss about\b/gi,
    'discuss',
    'Use "discuss" directly without "about".',
    'grammar'
  );
  apply(/\bmore better\b/gi, 'better', 'Do not use a double comparative.', 'grammar');
  apply(/\badvices\b/gi, 'advice', '"Advice" is usually uncountable.', 'grammar');
  apply(/\bhomeworks\b/gi, 'homework', '"Homework" is usually uncountable.', 'grammar');
  apply(
    /\binformations\b/gi,
    'information',
    '"Information" is usually uncountable.',
    'grammar'
  );
  apply(/\bgara\b/gi, 'garage', 'Corrected spelling: "gara" → "garage".', 'spelling');
  apply(/\bout post\b/gi, 'outpost', 'Corrected spelling: "out post" → "outpost".', 'spelling');

  const lower = corrected.toLowerCase();

  if (/\blast year\b|\byesterday\b|\bago\b|\bthis morning\b/.test(lower)) {
    grammarPoints.push('simple past');
    notes.push('A finished past-time marker often signals simple past.');
  }

  if (/\b(have|has) been [a-z]+ing\b/.test(lower)) {
    grammarPoints.push('present perfect continuous');
    notes.push(
      'Present perfect continuous describes an action that started earlier and is still continuing.'
    );
  }

  if (/\b(am|is|are) [a-z]+ing\b/.test(lower)) {
    grammarPoints.push('present continuous');
    notes.push('Present continuous is often used for an action happening now.');
  }

  if (/\b(have|has) [a-z]+ed\b/.test(lower) || /\b(have|has) done\b/.test(lower)) {
    grammarPoints.push('present perfect');
    notes.push('Present perfect links a past action to the present.');
  }

  const sentenceLikeCount =
    corrected.split(/(?<=[.!?])\s+/).filter(Boolean).length || 1;
  const inferredWritingMode: WritingMode =
    sentenceLikeCount >= 4 ? 'essay' : sentenceLikeCount >= 2 ? 'paragraph' : 'sentence';

  const capitalized = capitalizeFirst(corrected);
  if (capitalized !== corrected) {
    const before = corrected;
    corrected = capitalized;
    issues.push({
      original: before,
      corrected,
      reason: 'Capitalize the first word.',
      category: 'capitalization',
    });
  }

  const punctuated = ensureEndingPunctuation(corrected);
  if (punctuated !== corrected) {
    const before = corrected;
    corrected = punctuated;
    issues.push({
      original: before,
      corrected,
      reason: 'Add ending punctuation for a complete sentence.',
      category: 'punctuation',
    });
  }

  const enhanced = corrected
    .replace(/\bquiet space\b/gi, 'calm space')
    .replace(/\bpractice thinking about\b/gi, 'practice reflecting on')
    .replace(/\bwhere you practice\b/gi, 'where you can practice');

  const uniqueGrammarPoints = [...new Set(grammarPoints)];

  const paragraphTasks: PracticeTask[] =
    inferredWritingMode === 'paragraph' || inferredWritingMode === 'essay'
      ? [
          {
            type: 'linking',
            focus: 'idea connection',
            instruction:
              'Add a linking phrase between your ideas so the paragraph flows more naturally.',
            pairs: ['first idea → supporting detail', 'past event → result now'],
            targetPattern: 'linking devices',
            explanation:
              'Paragraph writing should show clearer connections between sentences, not just correct sentence grammar.',
            priority: 80,
          },
          {
            type: 'rewrite',
            focus: 'paragraph flow',
            instruction:
              'Rewrite your paragraph so each sentence connects more smoothly to the next one.',
            sourceText: corrected,
            targetPattern: 'cohesion',
            explanation:
              'Try improving flow, idea connection, and tense consistency across the whole paragraph.',
            priority: 70,
          },
        ]
      : [
          {
            type: 'production',
            focus: 'tense control',
            instruction:
              'Write one sentence about something you finished yesterday, and one sentence about something you are still doing this year.',
            targetPattern: 'mixed tense control',
            priority: 50,
          },
        ];

  return {
    correctedText: corrected,
    enhancedText: enhanced,
    explanation:
      uniqueGrammarPoints.length > 0
        ? `Mercy checked grammar, tense logic, spelling, and clarity. Detected grammar points: ${uniqueGrammarPoints.join(', ')}.`
        : 'Mercy checked grammar, spelling, and clarity. The sentence is already quite clear.',
    issues,
    grammarPoints: uniqueGrammarPoints,
    tenseAnalysis: {
      detected: uniqueGrammarPoints,
      likelyMainTense: uniqueGrammarPoints[0] ?? null,
      dominantTenseProfile: {
        primary: uniqueGrammarPoints[0] ?? 'mixed',
        distribution: {
          'present simple': uniqueGrammarPoints.includes('present simple') ? 1 : 0,
          'simple past': uniqueGrammarPoints.includes('simple past') ? 1 : 0,
          'present perfect': uniqueGrammarPoints.includes('present perfect') ? 1 : 0,
          'present perfect continuous': uniqueGrammarPoints.includes(
            'present perfect continuous'
          )
            ? 1
            : 0,
          'present continuous': uniqueGrammarPoints.includes('present continuous') ? 1 : 0,
          interrogative: 0,
          'inversion structure': 0,
        },
      },
      notes,
    },
    score: {
      grammar: Math.max(70, 95 - issues.length * 4),
      clarity: Math.max(72, 93 - issues.length * 2),
      naturalness: Math.max(70, 90 - issues.length * 3),
    },
    practice: {
      mode: 'coach',
      tasks: paragraphTasks,
      production:
        inferredWritingMode === 'sentence'
          ? {
              instruction:
                'Write one sentence about something you finished yesterday, and one sentence about something you are still doing this year.',
            }
          : undefined,
    },
    overallAssessment:
      issues.length === 0
        ? 'This writing is already quite strong. Mercy mainly refined clarity and teaching feedback.'
        : 'Mercy found some grammar or phrasing issues and used them to guide the teaching feedback.',
    levelSignal:
      uniqueGrammarPoints.length >= 2
        ? 'Intermediate signal'
        : 'Foundational to intermediate signal',
    teachingPoints:
      uniqueGrammarPoints.length > 0
        ? uniqueGrammarPoints.map(
            (point) =>
              `Focus on ${point.replace(/_/g, ' ')} to make your English more accurate and natural.`
          )
        : ['Your sentence is already fairly clear. Focus on adding more structure variety.'],
    advancedPatterns: [],
    structureAnalysis: {
      sentenceCount: sentenceLikeCount,
      complexity: uniqueGrammarPoints.length >= 2 ? 'intermediate' : 'basic',
      variety: uniqueGrammarPoints,
    },
    writingMode: inferredWritingMode,
    paragraphAnalysis:
      inferredWritingMode === 'paragraph' || inferredWritingMode === 'essay'
        ? {
            flow: 'Some ideas are present, but transitions can be clearer.',
            ideaConnection:
              'Add linking phrases so the reader can follow how one sentence leads to the next.',
            tenseConsistency:
              'Keep the time frame stable unless you intentionally shift from past to present.',
          }
        : undefined,
    source: 'fallback',
  };
}

async function analyzeGrammarWithApi(input: {
  text: string;
  roomId?: string;
  roomTitle?: string;
  englishLevel?: string | null;
  contentEn?: string;
}): Promise<GrammarApiResponse> {
  console.log('🔥 Grammar endpoint:', GRAMMAR_API_ENDPOINT);

  const response = await fetch(GRAMMAR_API_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      mode: 'grammar_writing',
      learnerId: 'demo-learner',
      text: input.text,
      roomId: input.roomId,
      roomTitle: input.roomTitle,
      englishLevel: input.englishLevel,
      contentEn: input.contentEn,
    }),
  });

  if (!response.ok) {
    throw new Error(`Grammar analysis failed (${response.status}).`);
  }

  const payload = await response.json();

  return {
    correctedText:
      payload?.correctedText ??
      payload?.corrected_text ??
      payload?.result?.correctedText ??
      '',
    enhancedText:
      payload?.enhancedText ??
      payload?.enhanced_text ??
      payload?.result?.enhancedText,
    explanation: payload?.explanation ?? payload?.result?.explanation,
    issues: payload?.issues ?? payload?.result?.issues ?? [],
    grammarPoints:
      payload?.grammarPoints ??
      payload?.grammar_points ??
      payload?.result?.grammarPoints ??
      [],
    tenseAnalysis:
      payload?.tenseAnalysis ??
      payload?.tense_analysis ??
      payload?.result?.tenseAnalysis,
    score: payload?.score ?? payload?.result?.score,
    practice: payload?.practice ?? payload?.result?.practice,
    overallAssessment:
      payload?.overallAssessment ??
      payload?.overall_assessment ??
      payload?.result?.overallAssessment,
    levelSignal:
      payload?.levelSignal ??
      payload?.level_signal ??
      payload?.result?.levelSignal,
    teachingPoints:
      payload?.teachingPoints ??
      payload?.teaching_points ??
      payload?.result?.teachingPoints ??
      [],
    advancedPatterns:
      payload?.advancedPatterns ??
      payload?.advanced_patterns ??
      payload?.result?.advancedPatterns ??
      [],
    structureAnalysis:
      payload?.structureAnalysis ??
      payload?.structure_analysis ??
      payload?.result?.structureAnalysis,
    writingMode:
      payload?.writingMode ??
      payload?.writing_mode ??
      payload?.result?.writingMode,
    paragraphAnalysis:
      payload?.paragraphAnalysis ??
      payload?.paragraph_analysis ??
      payload?.result?.paragraphAnalysis,
    debugServerVersion:
      payload?.debugServerVersion ??
      payload?.debug_server_version ??
      payload?.result?.debugServerVersion,
    decision: payload?.decision ?? payload?.result?.decision,
    memory: payload?.memory ?? payload?.result?.memory,
    source: 'api',
  };
}

function ScoreCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border border-border bg-white p-3 shadow-sm">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-lg font-semibold text-foreground">{value}/100</p>
    </div>
  );
}

function SectionTitle({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-3 flex items-start gap-3">
      <div className="mt-0.5 rounded-full bg-muted p-2">{icon}</div>
      <div className="min-w-0">
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
        {subtitle ? (
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        ) : null}
      </div>
    </div>
  );
}

function GrammarGlossChip({ label }: { label: string }) {
  const gloss = getGrammarGloss(label);

  return (
    <div className="inline-flex flex-col items-center rounded-xl border border-pink-200 bg-pink-50 px-3 py-2 text-center">
      <span className="text-xs font-medium text-pink-700">{toTitleCase(label)}</span>
      {gloss ? <span className="mt-1 text-[11px] text-pink-600">{gloss}</span> : null}
    </div>
  );
}

function AdvancedPatternCard({ pattern }: { pattern: AdvancedPattern }) {
  const gloss = getGrammarGloss(pattern.name);

  return (
    <div className="rounded-xl border border-border bg-muted/20 p-3">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <div className="rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-2">
          <div className="text-sm font-semibold text-foreground">{pattern.name}</div>
          {gloss ? <div className="mt-1 text-[11px] text-indigo-700">{gloss}</div> : null}
        </div>

        {pattern.level ? (
          <span className="rounded-full border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-[11px] text-indigo-700">
            {toTitleCase(pattern.level)}
          </span>
        ) : null}
      </div>

      <p className="text-sm text-foreground">
        <span className="font-semibold">Example:</span> {pattern.example}
      </p>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{pattern.explanation}</p>
    </div>
  );
}

function QuickFixTaskCard({
  task,
  label,
}: {
  task: QuickFixTask;
  label: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
      <SectionTitle
        icon={<CheckCircle2 className="h-4 w-4" />}
        title={label}
        subtitle={task.focus}
      />

      <p className="mb-3 text-sm font-medium text-foreground">{task.question}</p>

      <div className="space-y-2">
        {task.options.map((option) => (
          <div
            key={option}
            className={cn(
              'rounded-xl border p-3 text-sm',
              option === task.answer
                ? 'border-green-200 bg-green-50 text-green-800'
                : 'border-border bg-muted/10 text-foreground'
            )}
          >
            {option}
          </div>
        ))}
      </div>

      <p className="mt-3 text-sm text-muted-foreground">{task.explanation}</p>
    </div>
  );
}

function ContrastTaskCard({
  task,
  label,
}: {
  task: ContrastTask;
  label: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
      <SectionTitle
        icon={<Sparkles className="h-4 w-4" />}
        title={label}
        subtitle={task.focus}
      />

      <p className="mb-3 text-sm font-medium text-foreground">{task.question}</p>

      <div className="space-y-2">
        {task.examples.map((example) => (
          <div
            key={example}
            className="rounded-xl border border-border bg-muted/10 p-3 text-sm text-foreground"
          >
            {example}
          </div>
        ))}
      </div>

      <p className="mt-3 text-sm text-muted-foreground">{task.explanation}</p>
    </div>
  );
}

function ProductionTaskCard({
  task,
  label,
}: {
  task: ProductionTask;
  label: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
      <SectionTitle
        icon={<Wand2 className="h-4 w-4" />}
        title={label}
        subtitle={task.focus}
      />

      <p className="text-sm text-foreground">{task.instruction}</p>

      {task.targetPattern && (
        <div className="mt-3 inline-flex rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
          Target pattern: {toTitleCase(task.targetPattern)}
        </div>
      )}
    </div>
  );
}

function LinkingTaskCard({
  task,
  label,
}: {
  task: LinkingTask;
  label: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
      <SectionTitle
        icon={<Link2 className="h-4 w-4" />}
        title={label}
        subtitle={task.focus}
      />

      <p className="text-sm text-foreground">{task.instruction}</p>

      {task.pairs?.length ? (
        <div className="mt-3 space-y-2">
          {task.pairs.map((pair) => (
            <div
              key={pair}
              className="rounded-xl border border-border bg-muted/10 p-3 text-sm text-foreground"
            >
              {pair}
            </div>
          ))}
        </div>
      ) : null}

      {task.targetPattern && (
        <div className="mt-3 inline-flex rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
          Target pattern: {toTitleCase(task.targetPattern)}
        </div>
      )}

      {task.explanation ? (
        <p className="mt-3 text-sm text-muted-foreground">{task.explanation}</p>
      ) : null}
    </div>
  );
}

function RewriteTaskCard({
  task,
  label,
}: {
  task: RewriteTask;
  label: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
      <SectionTitle
        icon={<Replace className="h-4 w-4" />}
        title={label}
        subtitle={task.focus}
      />

      <p className="text-sm text-foreground">{task.instruction}</p>

      {task.sourceText ? (
        <div className="mt-3 rounded-xl border border-border bg-muted/10 p-3 text-sm text-foreground">
          {task.sourceText}
        </div>
      ) : null}

      {task.targetPattern && (
        <div className="mt-3 inline-flex rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
          Target pattern: {toTitleCase(task.targetPattern)}
        </div>
      )}

      {task.explanation ? (
        <p className="mt-3 text-sm text-muted-foreground">{task.explanation}</p>
      ) : null}
    </div>
  );
}

function ReviewTaskCard({
  task,
  label,
}: {
  task: ReviewTask;
  label: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
      <SectionTitle
        icon={<History className="h-4 w-4" />}
        title={label}
        subtitle={task.focus}
      />

      <p className="text-sm text-foreground">{task.instruction}</p>

      {task.targetPattern && (
        <div className="mt-3 inline-flex rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
          Target pattern: {toTitleCase(task.targetPattern)}
        </div>
      )}

      {task.explanation ? (
        <p className="mt-3 text-sm text-muted-foreground">{task.explanation}</p>
      ) : null}
    </div>
  );
}

export function GrammarWritingTab({
  roomId,
  roomTitle,
  contentEn,
  englishLevel,
  onPracticePronunciation,
  onAnalysisResult,
  teacherTask,
  onTeacherWritingStateChange,
}: GrammarWritingTabProps) {
  const [draft, setDraft] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GrammarApiResponse | null>(null);
  const [latestSubmittedText, setLatestSubmittedText] = useState('');
  const [teacherAssignedBaseText, setTeacherAssignedBaseText] = useState('');
  const [isRevisionAttempt, setIsRevisionAttempt] = useState(false);
  const [hasUserEditedDraftSinceTeacherHydration, setHasUserEditedDraftSinceTeacherHydration] =
    useState(false);
  const [teacherPrefillApplied, setTeacherPrefillApplied] = useState(false);

  const lastAppliedTeacherTriggerRef = useRef<string | undefined>(undefined);

  const isTeacherInitiated = Boolean(teacherTask);
  const teacherInstructionText = useMemo(
    () => buildTeacherInstructionText(teacherTask),
    [teacherTask]
  );
  const teacherEmphasis = useMemo(
    () => getTeacherEmphasis(result, teacherTask),
    [result, teacherTask]
  );

  /**
   * Teacher-context hydration:
   * apply teacher prefill only when it is safe, and remember the base text
   * so later submissions can be treated as revision attempts.
   */
  useEffect(() => {
    if (!teacherTask) {
      setTeacherPrefillApplied(false);
      return;
    }

    const previousTriggerToken = lastAppliedTeacherTriggerRef.current;
    const triggerChanged =
      Boolean(teacherTask.triggerToken) &&
      teacherTask.triggerToken !== previousTriggerToken;

    if (triggerChanged) {
      setResult(null);
      setError(null);
      setLatestSubmittedText('');
      setIsRevisionAttempt(false);
      setTeacherPrefillApplied(false);

      if (!teacherTask.prefillText) {
        setHasUserEditedDraftSinceTeacherHydration(false);
      }
    }

    const shouldApplyPrefill = shouldAutoApplyTeacherPrefill({
      currentDraft: draft,
      hasUserEditedDraft: hasUserEditedDraftSinceTeacherHydration,
      teacherTask,
      previousTriggerToken,
    });

    if (shouldApplyPrefill && teacherTask.prefillText) {
      setDraft(teacherTask.prefillText);
      setTeacherAssignedBaseText(teacherTask.prefillText);
      setHasUserEditedDraftSinceTeacherHydration(false);
      setTeacherPrefillApplied(true);
    } else if (!teacherAssignedBaseText && teacherTask.prefillText) {
      setTeacherAssignedBaseText(teacherTask.prefillText);
    }

    if (teacherTask.triggerToken) {
      lastAppliedTeacherTriggerRef.current = teacherTask.triggerToken;
    }
  }, [
    draft,
    teacherAssignedBaseText,
    hasUserEditedDraftSinceTeacherHydration,
    teacherTask,
  ]);

  /**
   * Upward reporting contract for Teacher Mercy / MercyGuide.
   */
  useEffect(() => {
    onTeacherWritingStateChange?.({
      latestAnalysisResult: result,
      currentWritingMode: result?.writingMode,
      isTeacherInitiated,
      isRevisionAttempt,
      latestSubmittedText,
      teacherTask,
      revisionSourceText: teacherAssignedBaseText || undefined,
    });
  }, [
    result,
    isTeacherInitiated,
    isRevisionAttempt,
    latestSubmittedText,
    teacherTask,
    teacherAssignedBaseText,
    onTeacherWritingStateChange,
  ]);

  const charCount = draft.trim().length;
  const canSubmit = charCount > 0 && !isLoading;

  const placeholder = useMemo(() => {
    if (teacherInstructionText) {
      return `${teacherInstructionText}

Paste or write your English here. Mercy will keep the teacher focus while correcting grammar and improving writing.`;
    }

    if (roomTitle) {
      return `Paste 1–2 sentences here and Mercy will fix the grammar, explain the logic, and improve the writing.

Example:
I very like this lesson because it help me understand better.`;
    }

    return `Paste 1–2 sentences here and Mercy will fix the grammar, explain the logic, and improve the writing.

Example:
Yesterday I go to supermarket and buy many thing.`;
  }, [roomTitle, teacherInstructionText]);

  async function handleAnalyze() {
    const text = draft.trim();
    if (!text) return;

    setIsLoading(true);
    setError(null);
    setLatestSubmittedText(text);

    const revisionBaseline = teacherAssignedBaseText.trim();
    const revisionDetected = Boolean(
      teacherTask &&
        revisionBaseline &&
        hasMeaningfulDifference(text, revisionBaseline)
    );
    setIsRevisionAttempt(revisionDetected);

    try {
      const analysis = await analyzeGrammarWithApi({
        text,
        roomId,
        roomTitle,
        englishLevel,
        contentEn,
      });

      if (!analysis.correctedText) {
        throw new Error('Grammar API returned no corrected text.');
      }

      setResult(analysis);
      onAnalysisResult?.(analysis);
    } catch (err) {
      console.error('🔥 Grammar fetch failed:', err);

      const fallback = localGrammarFallback(text);
      setResult(fallback);
      onAnalysisResult?.(fallback);

      const message =
        err instanceof Error
          ? `${err.message} Using local fallback for now.`
          : 'Could not reach grammar API. Using local fallback for now.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }

  function handleClear() {
    setDraft('');
    setResult(null);
    setError(null);
    setLatestSubmittedText('');
    setIsRevisionAttempt(false);
    setHasUserEditedDraftSinceTeacherHydration(false);
    setTeacherPrefillApplied(false);

    if (!teacherTask?.prefillText) {
      setTeacherAssignedBaseText('');
    }

    onAnalysisResult?.(null);
  }

  function handlePracticePronunciation() {
    if (!result?.correctedText) return;

    onPracticePronunciation?.({
      sourceText: draft.trim(),
      correctedText: result.correctedText,
      enhancedText: result.enhancedText,
    });
  }

  const detectedGrammarPoints =
    result?.grammarPoints ?? result?.tenseAnalysis?.detected ?? [];
  const likelyMainTense = result?.tenseAnalysis?.likelyMainTense ?? null;
  const tenseNotes = result?.tenseAnalysis?.notes ?? [];
  const tenseProfile = result?.tenseAnalysis?.dominantTenseProfile;
  const teachingPoints = result?.teachingPoints ?? [];
  const advancedPatterns = result?.advancedPatterns ?? [];
  const structureAnalysis = result?.structureAnalysis;
  const decision = result?.decision;
  const memory = result?.memory;
  const writingMode = result?.writingMode;
  const paragraphAnalysis = result?.paragraphAnalysis;

  const practiceTasks = [...(result?.practice?.tasks ?? [])].sort(
    (a, b) => b.priority - a.priority
  );

  const emphasizedPracticeTasks = useMemo(() => {
    if (!teacherTask || practiceTasks.length === 0) return practiceTasks;

    return [...practiceTasks].sort((a, b) => {
      const aBoost = a.type === teacherTask.taskType ? 1 : 0;
      const bBoost = b.type === teacherTask.taskType ? 1 : 0;

      if (aBoost !== bBoost) return bBoost - aBoost;
      return b.priority - a.priority;
    });
  }, [practiceTasks, teacherTask]);

  const recurringIssues = Object.entries(memory?.recurringIssues ?? {}).sort(
    (a, b) => b[1] - a[1]
  );

  const strengths = Object.entries(memory?.strengths ?? {}).sort(
    (a, b) => b[1] - a[1]
  );

  const recentTasks = [...(memory?.recentTasks ?? [])]
    .sort((a, b) => new Date(b.assignedAt).getTime() - new Date(a.assignedAt).getTime())
    .slice(0, 6);

  const reviewQueue = [...(memory?.reviewQueue ?? [])].sort(
    (a, b) => new Date(a.nextReviewAt).getTime() - new Date(b.nextReviewAt).getTime()
  );

  return (
    <div className="flex h-full min-h-0 flex-col overflow-y-auto px-4 pb-4 pt-3">
      <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
        <SectionTitle
          icon={<BookOpen className="h-4 w-4" />}
          title="Grammar & Writing"
          subtitle="Paste one or two sentences. Mercy will correct grammar, explain the shift, and improve the writing naturally."
        />

        {teacherTask && (
          <div
            className={cn(
              'mb-4 rounded-2xl border p-4',
              getTeacherTaskTone(teacherTask.taskType)
            )}
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-current/20 bg-white/70 px-3 py-1 text-xs font-semibold">
                {getTeacherTaskLabel(teacherTask.taskType)}
              </span>
              {teacherTask.focus ? (
                <span className="rounded-full border border-current/20 bg-white/70 px-3 py-1 text-xs font-medium">
                  Focus: {teacherTask.focus}
                </span>
              ) : null}
              {teacherPrefillApplied ? (
                <span className="rounded-full border border-current/20 bg-white/70 px-3 py-1 text-xs font-medium">
                  Prefill applied from teacher
                </span>
              ) : null}
              {isRevisionAttempt ? (
                <span className="rounded-full border border-current/20 bg-white/70 px-3 py-1 text-xs font-medium">
                  Revision attempt detected
                </span>
              ) : null}
            </div>

            {teacherInstructionText ? (
              <p className="mt-3 text-sm leading-6">{teacherInstructionText}</p>
            ) : null}

            {teacherTask.reason ? (
              <p className="mt-2 text-xs leading-5 opacity-80">{teacherTask.reason}</p>
            ) : null}
          </div>
        )}

        <textarea
          value={draft}
          onChange={(e) => {
            const nextDraft = e.target.value;
            setDraft(nextDraft);

            const meaningfulEdit = teacherTask?.prefillText
              ? hasMeaningfulDifference(nextDraft, teacherTask.prefillText)
              : Boolean(normalizeMeaningfulText(nextDraft));

            setHasUserEditedDraftSinceTeacherHydration(meaningfulEdit);

            if (teacherPrefillApplied && meaningfulEdit) {
              setTeacherPrefillApplied(false);
            }
          }}
          placeholder={placeholder}
          className={cn(
            'min-h-[180px] w-full resize-y rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none',
            'focus:border-pink-300 focus:ring-2 focus:ring-pink-100'
          )}
        />

        <div className="mt-3 flex items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">{charCount} characters</p>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClear}
              disabled={isLoading || (!draft && !result)}
            >
              Clear
            </Button>

            <Button
              type="button"
              onClick={handleAnalyze}
              disabled={!canSubmit}
              className="gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analyzing
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Analyze
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <div className="flex items-start gap-2">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <div>
              <p>{error}</p>
              <p className="mt-1 text-xs">
                API endpoint tried: <code>{GRAMMAR_API_ENDPOINT}</code>
              </p>
            </div>
          </div>
        </div>
      )}

      {result && (
        <div className="mt-4 space-y-4">
          {result.score && (
            <div className="grid grid-cols-3 gap-3">
              <ScoreCard label="Grammar" value={result.score.grammar} />
              <ScoreCard label="Clarity" value={result.score.clarity} />
              <ScoreCard label="Naturalness" value={result.score.naturalness} />
            </div>
          )}

          {teacherEmphasis && (
            <div
              className={cn(
                'rounded-2xl border-2 bg-white p-4 shadow-sm',
                teacherTask ? getTeacherTaskTone(teacherTask.taskType) : 'border-border'
              )}
            >
              <SectionTitle
                icon={<Target className="h-4 w-4" />}
                title={teacherEmphasis.title}
                subtitle={teacherEmphasis.subtitle}
              />
              <p className="text-sm leading-6 text-foreground">{teacherEmphasis.body}</p>
            </div>
          )}

          <div
            className={cn(
              'rounded-2xl border bg-white p-4 shadow-sm',
              teacherTask?.taskType === 'production' ? 'border-green-200' : 'border-border'
            )}
          >
            <div className="mb-2 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Corrected
              </p>
              {result.source && (
                <span className="text-[11px] text-muted-foreground">
                  {result.source === 'api' ? 'API' : 'Local fallback'}
                </span>
              )}
            </div>
            <p className="text-base font-medium text-foreground">{result.correctedText}</p>

            <div className="mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handlePracticePronunciation}
                disabled={!onPracticePronunciation}
                className="gap-2"
              >
                <ArrowRight className="h-4 w-4" />
                Practice this in Pronunciation
              </Button>
            </div>
          </div>

          {result.enhancedText && (
            <div
              className={cn(
                'rounded-2xl border bg-white p-4 shadow-sm',
                teacherTask?.taskType === 'production' ? 'border-green-200' : 'border-border'
              )}
            >
              <SectionTitle
                icon={<Wand2 className="h-4 w-4" />}
                title="Enhanced Writing"
                subtitle="A more polished and natural version."
              />
              <p className="text-base font-medium text-foreground">{result.enhancedText}</p>

              <div className="mt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePracticePronunciation}
                  disabled={!onPracticePronunciation}
                  className="gap-2"
                >
                  <ArrowRight className="h-4 w-4" />
                  Practice this in Pronunciation
                </Button>
              </div>
            </div>
          )}

          {result.explanation && (
            <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Why Mercy changed it
              </p>
              <p className="text-sm leading-6 text-foreground">{result.explanation}</p>
            </div>
          )}

          {(writingMode || paragraphAnalysis) && (
            <div
              className={cn(
                'rounded-2xl border bg-white p-4 shadow-sm',
                teacherTask?.taskType === 'rewrite' || teacherTask?.taskType === 'linking'
                  ? 'border-pink-200'
                  : 'border-border'
              )}
            >
              <SectionTitle
                icon={<PenSquare className="h-4 w-4" />}
                title="Paragraph Coaching"
                subtitle="Mercy now shows writing mode and paragraph-level feedback."
              />

              {writingMode && (
                <div className="mb-4">
                  <span
                    className={cn(
                      'rounded-full border px-3 py-1 text-sm font-medium',
                      getWritingModeTone(writingMode)
                    )}
                  >
                    Writing mode: {toTitleCase(writingMode)}
                  </span>
                </div>
              )}

              {paragraphAnalysis && (
                <div className="grid gap-3 md:grid-cols-3">
                  <div
                    className={cn(
                      'rounded-xl border bg-muted/20 p-3',
                      teacherTask?.taskType === 'rewrite' || teacherTask?.taskType === 'linking'
                        ? 'border-pink-200'
                        : 'border-border'
                    )}
                  >
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Flow
                    </p>
                    <p className="mt-1 text-sm leading-6 text-foreground">
                      {paragraphAnalysis.flow ?? '—'}
                    </p>
                  </div>

                  <div
                    className={cn(
                      'rounded-xl border bg-muted/20 p-3',
                      teacherTask?.taskType === 'rewrite' || teacherTask?.taskType === 'linking'
                        ? 'border-pink-200'
                        : 'border-border'
                    )}
                  >
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Idea Connection
                    </p>
                    <p className="mt-1 text-sm leading-6 text-foreground">
                      {paragraphAnalysis.ideaConnection ?? '—'}
                    </p>
                  </div>

                  <div className="rounded-xl border border-border bg-muted/20 p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Tense Consistency
                    </p>
                    <p className="mt-1 text-sm leading-6 text-foreground">
                      {paragraphAnalysis.tenseConsistency ?? '—'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {decision && (
            <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
              <SectionTitle
                icon={<Target className="h-4 w-4" />}
                title="Teaching Decision"
                subtitle="Mercy now decides what matters most before giving feedback."
              />

              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-xl border border-border bg-muted/20 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Primary Focus
                  </p>
                  <p className="mt-1 text-sm font-medium text-foreground">
                    {decision.primaryFocus}
                  </p>
                </div>

                <div className="rounded-xl border border-border bg-muted/20 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Praise Focus
                  </p>
                  <p className="mt-1 text-sm font-medium text-foreground">
                    {decision.praiseFocus ?? '—'}
                  </p>
                </div>

                <div className="rounded-xl border border-border bg-muted/20 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Response Mode
                  </p>
                  <p className="mt-1 text-sm font-medium text-foreground">
                    {toTitleCase(decision.responseMode)}
                  </p>
                </div>

                <div className="rounded-xl border border-border bg-muted/20 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Explanation Depth
                  </p>
                  <p className="mt-1 text-sm font-medium text-foreground">
                    {toTitleCase(decision.explanationDepth)}
                  </p>
                </div>
              </div>

              {decision.secondaryFocuses.length > 0 && (
                <div className="mt-4">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Supporting Focuses
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {decision.secondaryFocuses.map((focus) => (
                      <span
                        key={focus}
                        className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700"
                      >
                        {focus}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {memory && (
            <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
              <SectionTitle
                icon={<MemoryStick className="h-4 w-4" />}
                title="Memory Snapshot"
                subtitle="Mercy is now remembering patterns across attempts for this learner."
              />

              <div className="grid gap-3 md:grid-cols-3">
                <div className="rounded-xl border border-border bg-muted/20 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Learner ID
                  </p>
                  <p className="mt-1 break-all text-sm font-medium text-foreground">
                    {memory.learnerId}
                  </p>
                </div>

                <div className="rounded-xl border border-border bg-muted/20 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Level Trend
                  </p>
                  <div className="mt-2">
                    <span
                      className={cn(
                        'rounded-full border px-3 py-1 text-xs font-medium',
                        getTrendTone(memory.levelTrend)
                      )}
                    >
                      {toTitleCase(memory.levelTrend ?? 'stable')}
                    </span>
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-muted/20 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Review Items
                  </p>
                  <p className="mt-1 text-sm font-medium text-foreground">
                    {reviewQueue.length}
                  </p>
                </div>
              </div>

              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                <div className="rounded-xl border border-border bg-muted/10 p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <Repeat className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm font-semibold text-foreground">Recurring Issues</p>
                  </div>

                  {recurringIssues.length > 0 ? (
                    <div className="space-y-2">
                      {recurringIssues.map(([focus, count]) => (
                        <div
                          key={focus}
                          className="flex items-center justify-between rounded-lg border border-border bg-white px-3 py-2"
                        >
                          <span className="text-sm text-foreground">{focus}</span>
                          <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
                            {count}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No recurring issues stored yet.
                    </p>
                  )}
                </div>

                <div className="rounded-xl border border-border bg-muted/10 p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm font-semibold text-foreground">Strengths</p>
                  </div>

                  {strengths.length > 0 ? (
                    <div className="space-y-2">
                      {strengths.map(([focus, count]) => (
                        <div
                          key={focus}
                          className="flex items-center justify-between rounded-lg border border-border bg-white px-3 py-2"
                        >
                          <span className="text-sm text-foreground">{focus}</span>
                          <span className="rounded-full border border-green-200 bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">
                            {count}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No strengths stored yet.</p>
                  )}
                </div>
              </div>

              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                <div className="rounded-xl border border-border bg-muted/10 p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <Brain className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm font-semibold text-foreground">Review Queue</p>
                  </div>

                  {reviewQueue.length > 0 ? (
                    <div className="space-y-2">
                      {reviewQueue.map((item) => (
                        <div
                          key={item.focus}
                          className="rounded-lg border border-border bg-white p-3"
                        >
                          <p className="text-sm font-medium text-foreground">{item.focus}</p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            Next review: {formatDateTime(item.nextReviewAt)}
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            Interval: {item.intervalDays} day(s) · Success count:{' '}
                            {item.successCount}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No review items scheduled yet.
                    </p>
                  )}
                </div>

                <div className="rounded-xl border border-border bg-muted/10 p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <History className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm font-semibold text-foreground">Recent Tasks</p>
                  </div>

                  {recentTasks.length > 0 ? (
                    <div className="space-y-2">
                      {recentTasks.map((task, index) => (
                        <div
                          key={`${task.focus}-${task.assignedAt}-${index}`}
                          className="rounded-lg border border-border bg-white p-3"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-sm font-medium text-foreground">
                              {task.focus}
                            </span>
                            <span className="rounded-full border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-[11px] text-indigo-700">
                              {toTitleCase(task.type)}
                            </span>
                          </div>
                          <p className="mt-1 text-xs text-muted-foreground">
                            Assigned: {formatDateTime(task.assignedAt)}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No recent tasks stored yet.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {result.overallAssessment && (
            <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
              <SectionTitle
                icon={<Brain className="h-4 w-4" />}
                title="Overall Assessment"
                subtitle="Mercy evaluates the quality and maturity of your writing."
              />
              <p className="text-sm leading-6 text-foreground">{result.overallAssessment}</p>
            </div>
          )}

          {result.levelSignal && (
            <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
              <SectionTitle
                icon={<GraduationCap className="h-4 w-4" />}
                title="Level Signal"
                subtitle="A rough estimate of the learner signal in this sentence."
              />
              <div className="inline-flex rounded-full border border-pink-200 bg-pink-50 px-3 py-1 text-sm font-medium text-pink-700">
                {result.levelSignal}
              </div>
            </div>
          )}

          {(detectedGrammarPoints.length > 0 || likelyMainTense || tenseProfile) && (
            <div
              className={cn(
                'rounded-2xl border bg-white p-4 shadow-sm',
                teacherTask?.taskType === 'quickFix' ? 'border-amber-200' : 'border-border'
              )}
            >
              <SectionTitle
                icon={<CheckCircle2 className="h-4 w-4" />}
                title="Grammar Points"
                subtitle="Mercy identifies the grammar ideas used in your sentence."
              />

              <div className="flex flex-wrap gap-2">
                {detectedGrammarPoints.map((point) => (
                  <GrammarGlossChip key={point} label={point} />
                ))}
              </div>

              {likelyMainTense && (
                <div className="mt-4 rounded-xl border border-border bg-muted/20 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Main Tense
                  </p>
                  <p className="mt-1 text-sm font-medium text-foreground">
                    {toTitleCase(likelyMainTense)}
                  </p>
                  {getGrammarGloss(likelyMainTense) ? (
                    <p className="mt-1 text-xs text-muted-foreground">
                      {getGrammarGloss(likelyMainTense)}
                    </p>
                  ) : null}
                </div>
              )}

              {tenseProfile && (
                <div className="mt-4 rounded-xl border border-border bg-muted/20 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Tense Profile
                  </p>
                  <p className="mt-1 text-sm font-medium text-foreground">
                    Primary: {toTitleCase(tenseProfile.primary)}
                  </p>
                  {getGrammarGloss(tenseProfile.primary) ? (
                    <p className="mt-1 text-xs text-muted-foreground">
                      {getGrammarGloss(tenseProfile.primary)}
                    </p>
                  ) : null}

                  <div className="mt-3 flex flex-wrap gap-2">
                    {Object.entries(tenseProfile.distribution)
                      .filter(([, count]) => count > 0)
                      .map(([label, count]) => (
                        <div
                          key={label}
                          className="rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-2"
                        >
                          <div className="text-xs font-medium text-indigo-700">
                            {toTitleCase(label)}: {count}
                          </div>
                          {getGrammarGloss(label) ? (
                            <div className="mt-1 text-[11px] text-indigo-600">
                              {getGrammarGloss(label)}
                            </div>
                          ) : null}
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {advancedPatterns.length > 0 && (
            <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
              <SectionTitle
                icon={<Layers3 className="h-4 w-4" />}
                title="Advanced Structures"
                subtitle="Mercy identifies higher-level structures used in your writing."
              />

              <div className="space-y-3">
                {advancedPatterns.map((pattern, index) => (
                  <AdvancedPatternCard key={`${pattern.name}-${index}`} pattern={pattern} />
                ))}
              </div>
            </div>
          )}

          {teachingPoints.length > 0 && (
            <div
              className={cn(
                'rounded-2xl border bg-white p-4 shadow-sm',
                teacherTask?.taskType === 'production' ? 'border-green-200' : 'border-border'
              )}
            >
              <SectionTitle
                icon={<Sparkles className="h-4 w-4" />}
                title="Teaching Points"
                subtitle="These are the most important things Mercy wants you to learn from this sentence."
              />

              <div className="space-y-2">
                {teachingPoints.map((point, index) => (
                  <div
                    key={`${point}-${index}`}
                    className="rounded-xl border border-border bg-muted/20 p-3"
                  >
                    <p className="text-sm leading-6 text-foreground">{point}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {structureAnalysis && (
            <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
              <SectionTitle
                icon={<Brain className="h-4 w-4" />}
                title="Structure Analysis"
                subtitle="Mercy looks at sentence complexity and structure variety."
              />

              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-xl border border-border bg-muted/20 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Sentence Count
                  </p>
                  <p className="mt-1 text-sm font-medium text-foreground">
                    {structureAnalysis.sentenceCount}
                  </p>
                </div>

                <div className="rounded-xl border border-border bg-muted/20 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Complexity
                  </p>
                  <p className="mt-1 text-sm font-medium text-foreground">
                    {toTitleCase(structureAnalysis.complexity)}
                  </p>
                </div>
              </div>

              {structureAnalysis.variety?.length > 0 && (
                <div className="mt-4">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Variety
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {structureAnalysis.variety.map((item) => (
                      <GrammarGlossChip key={item} label={item} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {tenseNotes.length > 0 && (
            <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
              <SectionTitle
                icon={<Sparkles className="h-4 w-4" />}
                title="Why this grammar works"
                subtitle="Mercy explains the tense logic behind your sentence."
              />

              <div className="space-y-2">
                {tenseNotes.map((note, index) => (
                  <div
                    key={`${note}-${index}`}
                    className="rounded-xl border border-border bg-muted/20 p-3"
                  >
                    <p className="text-sm leading-6 text-foreground">{note}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {result.practice && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
                <SectionTitle
                  icon={<Target className="h-4 w-4" />}
                  title="Adaptive Practice"
                  subtitle="Mercy now ranks tasks by teaching priority."
                />

                <div className="grid gap-3 md:grid-cols-3">
                  <div className="rounded-xl border border-border bg-muted/20 p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Main Focus
                    </p>
                    <p className="mt-1 text-sm font-medium text-foreground">
                      {decision?.primaryFocus ?? 'Not available'}
                    </p>
                  </div>

                  <div className="rounded-xl border border-border bg-muted/20 p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Strong Point
                    </p>
                    <p className="mt-1 text-sm font-medium text-foreground">
                      {decision?.praiseFocus ?? '—'}
                    </p>
                  </div>

                  <div className="rounded-xl border border-border bg-muted/20 p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Mode
                    </p>
                    <p className="mt-1 text-sm font-medium text-foreground">
                      {toTitleCase(
                        result.practice.mode ?? decision?.responseMode ?? 'coach'
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {emphasizedPracticeTasks.length > 0 ? (
                <div className="space-y-4">
                  {emphasizedPracticeTasks.map((task, index) => {
                    const label = getRankLabel(index);

                    if (task.type === 'quickFix') {
                      return (
                        <QuickFixTaskCard
                          key={`${task.type}-${task.focus}-${index}`}
                          task={task}
                          label={label}
                        />
                      );
                    }

                    if (task.type === 'contrast') {
                      return (
                        <ContrastTaskCard
                          key={`${task.type}-${task.focus}-${index}`}
                          task={task}
                          label={label}
                        />
                      );
                    }

                    if (task.type === 'linking') {
                      return (
                        <LinkingTaskCard
                          key={`${task.type}-${task.focus}-${index}`}
                          task={task}
                          label={label}
                        />
                      );
                    }

                    if (task.type === 'rewrite') {
                      return (
                        <RewriteTaskCard
                          key={`${task.type}-${task.focus}-${index}`}
                          task={task}
                          label={label}
                        />
                      );
                    }

                    if (task.type === 'review') {
                      return (
                        <ReviewTaskCard
                          key={`${task.type}-${task.focus}-${index}`}
                          task={task}
                          label={label}
                        />
                      );
                    }

                    return (
                      <ProductionTaskCard
                        key={`${task.type}-${task.focus}-${index}`}
                        task={task}
                        label={label}
                      />
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-4">
                  {result.practice.quickFix && (
                    <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
                      <SectionTitle
                        icon={<CheckCircle2 className="h-4 w-4" />}
                        title="Quick Fix"
                        subtitle={result.practice.quickFix.question}
                      />

                      <div className="space-y-2">
                        {result.practice.quickFix.options.map((option) => (
                          <div
                            key={option}
                            className={cn(
                              'rounded-xl border p-3 text-sm',
                              option === result.practice.quickFix?.answer
                                ? 'border-green-200 bg-green-50 text-green-800'
                                : 'border-border bg-muted/10 text-foreground'
                            )}
                          >
                            {option}
                          </div>
                        ))}
                      </div>

                      <p className="mt-3 text-sm text-muted-foreground">
                        {result.practice.quickFix.explanation}
                      </p>
                    </div>
                  )}

                  {result.practice.contrast && (
                    <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
                      <SectionTitle
                        icon={<Sparkles className="h-4 w-4" />}
                        title="Contrast"
                        subtitle={result.practice.contrast.question}
                      />

                      <div className="space-y-2">
                        {result.practice.contrast.examples.map((example) => (
                          <div
                            key={example}
                            className="rounded-xl border border-border bg-muted/10 p-3 text-sm text-foreground"
                          >
                            {example}
                          </div>
                        ))}
                      </div>

                      <p className="mt-3 text-sm text-muted-foreground">
                        {result.practice.contrast.explanation}
                      </p>
                    </div>
                  )}

                  {result.practice.production && (
                    <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
                      <SectionTitle
                        icon={<Wand2 className="h-4 w-4" />}
                        title="Practice"
                        subtitle="Try producing your own English now."
                      />

                      <p className="text-sm text-foreground">
                        {result.practice.production.instruction}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {result.issues && result.issues.length > 0 && (
            <div
              className={cn(
                'rounded-2xl border bg-white p-4 shadow-sm',
                teacherTask?.taskType === 'quickFix' ? 'border-amber-200' : 'border-border'
              )}
            >
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Issue Breakdown
              </p>

              <div className="space-y-3">
                {result.issues.map((issue, index) => (
                  <div
                    key={`${issue.original}-${index}`}
                    className={cn(
                      'rounded-xl border bg-muted/20 p-3',
                      teacherTask?.taskType === 'quickFix' ? 'border-amber-200' : 'border-border'
                    )}
                  >
                    <div className="mb-2 flex flex-wrap gap-2">
                      {issue.category ? (
                        <span className="rounded-full border border-border bg-white px-2 py-0.5 text-[11px] text-muted-foreground">
                          {toTitleCase(issue.category)}
                        </span>
                      ) : null}
                      {issue.grammarPoint ? (
                        <div className="rounded-xl border border-pink-200 bg-pink-50 px-2 py-1">
                          <div className="text-[11px] text-pink-700">
                            {toTitleCase(issue.grammarPoint)}
                          </div>
                          {getGrammarGloss(issue.grammarPoint) ? (
                            <div className="mt-0.5 text-[10px] text-pink-600">
                              {getGrammarGloss(issue.grammarPoint)}
                            </div>
                          ) : null}
                        </div>
                      ) : null}
                    </div>

                    <p className="text-sm">
                      <span className="font-semibold">Original:</span> {issue.original}
                    </p>
                    <p className="mt-1 text-sm">
                      <span className="font-semibold">Corrected:</span> {issue.corrected}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">{issue.reason}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {SHOW_DEBUG && result.debugServerVersion && (
            <div className="rounded-2xl border border-dashed border-border bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Debug
              </p>
              <p className="mt-1 text-sm text-foreground">
                Backend version: {result.debugServerVersion}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}