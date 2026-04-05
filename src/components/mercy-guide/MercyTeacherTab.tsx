// PATH: src/components/mercy-guide/MercyTeacherTab.tsx

import React, { useEffect, useMemo, useState } from 'react';
import {
  Wind,
  ArrowRight,
  CheckCircle2,
  PenSquare,
  Mic,
  Replace,
  Repeat,
  Target,
  TrendingUp,
  Sparkles,
  Eye,
  RotateCcw,
  Eraser,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import type { CompanionProfile } from '@/services/companion';
import type { SuggestedItem } from '@/services/suggestions';
import type { StudyLogEntry } from '@/services/studyLog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TabsContent } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import {
  BREATHING_SCRIPT_SHORT,
  POSITIVE_REFRAME_SHORT,
  COMPASSIONATE_HEAVY_MOOD_MESSAGE,
} from '@/data/breathing_scripts_en_vi';
import type {
  GrammarApiResponse,
  GrammarIssue,
  GrammarWritingTeacherState,
  LearnerMemory,
  ParagraphAnalysis,
  PracticeTask,
  TeacherWritingTask,
  TeachingDecision,
  WritingMode,
} from './types';

type PracticeBlock = {
  tasks?: PracticeTask[];
};

type TeacherActionState = 'idle' | 'acting' | 'submitting' | 'feedback';

type TeacherRevisionSubmission = {
  previousText: string;
  newText: string;
  isRevision: boolean;
  taskType?: string;
  focus?: string;
};

type TeacherApiGloss = {
  label?: string;
  glossVi?: string;
};

type TeacherApiView = {
  headline?: string;
  why?: string;
  action?: string;
  taskLabel?: string;
  fixes?: string[];
  editedVersion?: string;
  teacherModelVersion?: string;
  explanation?: string;
  summary?: string;
  nextStep?: string;
  encouragement?: string;
  grammarPoints?: string[];
  grammarGloss?: TeacherApiGloss[];
  issues?: GrammarIssue[];
  paragraphAnalysis?: ParagraphAnalysis;
  tenseAnalysis?: GrammarApiResponse['tenseAnalysis'];
  score?: (GrammarApiResponse['score'] & {
    flow?: number;
    overall?: number;
  }) | undefined;
};

interface MercyTeacherTabProps {
  profile: CompanionProfile;
  yesterdaySummary?: StudyLogEntry;
  todayTotalMinutes: number;
  hasHeavyMoods: boolean;
  suggestions: SuggestedItem[];
  showBreathingScript: boolean;
  breathingStep: number;
  showReframe: boolean;
  setShowBreathingScript: React.Dispatch<React.SetStateAction<boolean>>;
  setBreathingStep: React.Dispatch<React.SetStateAction<number>>;
  setShowReframe: React.Dispatch<React.SetStateAction<boolean>>;
  onNavigateSuggestion: (item: SuggestedItem) => void;
  decision?: TeachingDecision;
  practice?: PracticeBlock;
  writingMode?: WritingMode;
  paragraphAnalysis?: ParagraphAnalysis;
  memory?: LearnerMemory;
  teacherTask?: TeacherWritingTask;
  latestTeacherWritingState?: GrammarWritingTeacherState;
  onOpenPronunciation?: () => void;
  onOpenWriting?: () => void;
  onSubmitTeacherRevision?: (
    payload: TeacherRevisionSubmission
  ) => Promise<GrammarApiResponse | null>;
}

function formatTaskLabel(type: string) {
  switch (type) {
    case 'rewrite':
      return 'Rewrite';
    case 'linking':
      return 'Linking';
    case 'quickFix':
      return 'Quick Fix';
    case 'contrast':
      return 'Contrast';
    case 'review':
      return 'Review';
    case 'production':
      return 'Production';
    default:
      return type;
  }
}

function formatFocusLabel(focus?: string) {
  if (!focus) return 'your next learning focus';
  return focus.charAt(0).toUpperCase() + focus.slice(1);
}

function toTitle(value?: string | null) {
  if (!value) return '';
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function normalizeMeaningfulText(value?: string | null) {
  return (value ?? '').replace(/\s+/g, ' ').trim();
}

function getModeTone(decision?: TeachingDecision) {
  if (decision?.responseMode === 'challenge') {
    return {
      label: 'Challenge',
      description: 'Mercy is pushing you a little more today.',
      badgeClass: 'border-amber-200 bg-amber-50 text-amber-700',
    };
  }

  if (decision?.responseMode === 'explain') {
    return {
      label: 'Explain',
      description: 'Mercy will slow down and explain more clearly.',
      badgeClass: 'border-sky-200 bg-sky-50 text-sky-700',
    };
  }

  return {
    label: 'Coach',
    description: 'Mercy is guiding you step by step.',
    badgeClass: 'border-pink-200 bg-pink-50 text-pink-700',
  };
}

function getTaskIcon(type?: string) {
  switch (type) {
    case 'rewrite':
      return Replace;
    case 'review':
      return Repeat;
    default:
      return PenSquare;
  }
}

function buildOrderedTasks(
  practice?: PracticeBlock,
  decision?: TeachingDecision
): PracticeTask[] {
  const practiceTasks = [...((practice?.tasks as PracticeTask[] | undefined) ?? [])].sort(
    (a, b) => (b.priority ?? 0) - (a.priority ?? 0)
  );

  if (practiceTasks.length > 0) return practiceTasks;

  return [...(((decision?.taskPlan as PracticeTask[] | undefined) ?? []))]
    .sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0))
    .map((task) => ({
      type: task.type,
      focus: task.focus,
      priority: task.priority,
      instruction: task.instruction ?? task.explanation ?? (task as any).reason,
      explanation: task.explanation ?? (task as any).reason,
    }));
}

function deriveTaskFromTeacherTask(
  teacherTask?: TeacherWritingTask
): PracticeTask | undefined {
  if (!teacherTask) return undefined;

  return {
    type: teacherTask.taskType as PracticeTask['type'],
    focus: teacherTask.focus ?? teacherTask.taskType,
    priority: 0,
    instruction: teacherTask.instruction,
    explanation: teacherTask.reason,
  };
}

function getMemoryLine(memory?: LearnerMemory, decision?: TeachingDecision) {
  const recurringEntries = Object.entries(
    (memory?.recurringIssues as Record<string, number> | undefined) ?? {}
  );
  const recurring = recurringEntries.sort((a, b) => b[1] - a[1])[0];

  if (recurring) {
    return `You often need support with ${recurring[0]}, so Mercy is focusing there first today.`;
  }

  const strengthEntries = Object.entries(
    (memory?.strengths as Record<string, number> | undefined) ?? {}
  );
  const strength = strengthEntries.sort((a, b) => b[1] - a[1])[0];

  if (strength) {
    return `You are already showing strength in ${strength[0]}. Mercy wants to build on that.`;
  }

  if (decision?.praiseFocus) {
    return `You are already showing strength in ${decision.praiseFocus}.`;
  }

  return null;
}

function getTrendLabel(memory?: LearnerMemory) {
  if (memory?.levelTrend === 'rising') return 'Progress is rising';
  if (memory?.levelTrend === 'struggling') return 'Needs extra support';
  return 'Steady learning';
}

function formatReviewFocus(memory?: LearnerMemory) {
  const nextReview = [
    ...(((memory?.reviewQueue as Array<{ nextReviewAt: string; focus?: string }> | undefined) ??
      [])),
  ].sort(
    (a, b) => new Date(a.nextReviewAt).getTime() - new Date(b.nextReviewAt).getTime()
  )[0];

  return nextReview?.focus ?? null;
}

function supportsInlineAction(task?: PracticeTask, teacherTask?: TeacherWritingTask) {
  return ['rewrite', 'linking', 'quickFix', 'production'].includes(
    task?.type ?? teacherTask?.taskType ?? ''
  );
}

function getDraftPlaceholder(
  task?: PracticeTask,
  decision?: TeachingDecision,
  teacherTask?: TeacherWritingTask
) {
  switch (task?.type ?? teacherTask?.taskType) {
    case 'rewrite':
      return 'Rewrite your message here so the ideas connect more clearly.';
    case 'linking':
      return 'Revise your message here and add a clearer bridge between the ideas.';
    case 'quickFix':
      return 'Write the corrected version here.';
    case 'production':
      return 'Write one natural sentence using the target pattern here.';
    default:
      return `Write here about ${
        task?.focus ??
        teacherTask?.focus ??
        decision?.primaryFocus ??
        'your day, your life, or one sentence you want Mercy to check'
      }.`;
  }
}

function getInlineActionIntro(task?: PracticeTask, teacherTask?: TeacherWritingTask) {
  switch (task?.type ?? teacherTask?.taskType) {
    case 'rewrite':
      return 'Edit your own writing here first. When you submit, Mercy will wait for the grammar API result and then show the correction, explanation, and teacher model.';
    case 'linking':
      return 'Start from your own text below. Mercy will wait for your edited version, then show the API-based grammar result.';
    case 'quickFix':
      return 'Make one careful correction here first. Mercy will respond only after the grammar API returns a result.';
    case 'production':
      return 'Write your own sentence first. Mercy will wait for the submitted text and then show grammar notes from the API.';
    default:
      return 'Write your own version first. Mercy will wait for the submitted revision before she gives grammar feedback.';
  }
}

function getTeacherLoopSummary(
  teacherTask?: TeacherWritingTask,
  latestTeacherWritingState?: GrammarWritingTeacherState,
  hasApiAnalysis?: boolean
) {
  if (!teacherTask && !latestTeacherWritingState?.latestSubmittedText) return null;

  if (latestTeacherWritingState?.isRevisionAttempt) {
    return {
      title: hasApiAnalysis ? 'Revision checked by Mercy' : 'Revision received',
      body: hasApiAnalysis
        ? 'Mercy is showing the grammar result from the latest submitted revision.'
        : 'Mercy has the revision text. Grammar feedback should appear after the API result is returned.',
    };
  }

  if (latestTeacherWritingState?.isTeacherInitiated) {
    return {
      title: 'Teacher writing step is active',
      body: hasApiAnalysis
        ? 'Mercy is using the latest grammar result to guide the next teaching move.'
        : 'Mercy is waiting for your submitted writing so the grammar API can evaluate it.',
    };
  }

  if (teacherTask) {
    return {
      title: 'Teacher task is active',
      body:
        teacherTask.instruction ||
        teacherTask.reason ||
        `Mercy wants you to work on ${teacherTask.focus ?? teacherTask.taskType}.`,
    };
  }

  return {
    title: 'Latest writing received',
    body: hasApiAnalysis
      ? 'Mercy is showing grammar feedback returned by the API for your latest writing.'
      : 'Mercy has your latest writing. Grammar feedback should come from the API result, not from a prewritten reply.',
  };
}

function getRevisionSeedText(
  latestTeacherWritingState?: GrammarWritingTeacherState,
  teacherTask?: TeacherWritingTask
) {
  return (
    latestTeacherWritingState?.latestSubmittedText ||
    latestTeacherWritingState?.revisionSourceText ||
    teacherTask?.prefillText ||
    ''
  );
}

function hasSubmittedWriting(latestTeacherWritingState?: GrammarWritingTeacherState) {
  return Boolean(normalizeMeaningfulText(latestTeacherWritingState?.latestSubmittedText));
}

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => (typeof item === 'string' ? normalizeMeaningfulText(item) : ''))
    .filter(Boolean);
}

function toIssueArray(value: unknown): GrammarIssue[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item) => item && typeof item === 'object') as GrammarIssue[];
}

function asParagraphAnalysis(value: unknown): ParagraphAnalysis | undefined {
  if (!value || typeof value !== 'object') return undefined;
  return value as ParagraphAnalysis;
}

function asTeacherApiGlossArray(value: unknown): TeacherApiGloss[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item) => item && typeof item === 'object') as TeacherApiGloss[];
}

function asTeacherApiView(value: unknown): TeacherApiView | null {
  if (!value || typeof value !== 'object') return null;
  const raw = value as Record<string, unknown>;

  const nestedResult =
    raw.result && typeof raw.result === 'object'
      ? (raw.result as Record<string, unknown>)
      : null;

  const source = nestedResult ?? raw;

  const correctedText =
    typeof source.correctedText === 'string'
      ? source.correctedText
      : typeof source.corrected === 'string'
        ? source.corrected
        : typeof source.editedVersion === 'string'
          ? source.editedVersion
          : typeof source.edited_version === 'string'
            ? source.edited_version
            : undefined;

  return {
    headline: typeof source.headline === 'string' ? source.headline : undefined,
    why:
      typeof source.why === 'string'
        ? source.why
        : typeof source.overallAssessment === 'string'
          ? source.overallAssessment
          : undefined,
    action: typeof source.action === 'string' ? source.action : undefined,
    taskLabel: typeof source.taskLabel === 'string' ? source.taskLabel : undefined,
    fixes: toStringArray(source.fixes),
    editedVersion: correctedText,
    teacherModelVersion:
      typeof source.teacherModelVersion === 'string'
        ? source.teacherModelVersion
        : typeof source.teacher_model_version === 'string'
          ? source.teacher_model_version
          : typeof source.enhancedText === 'string'
            ? source.enhancedText
            : undefined,
    explanation: typeof source.explanation === 'string' ? source.explanation : undefined,
    summary:
      typeof source.summary === 'string'
        ? source.summary
        : typeof source.overallAssessment === 'string'
          ? source.overallAssessment
          : undefined,
    nextStep:
      typeof source.nextStep === 'string'
        ? source.nextStep
        : typeof source.recommendedNextStep === 'string'
          ? source.recommendedNextStep
          : undefined,
    encouragement:
      typeof source.encouragement === 'string' ? source.encouragement : undefined,
    grammarPoints:
      toStringArray(source.grammarPoints).length > 0
        ? toStringArray(source.grammarPoints)
        : toStringArray(source.grammar_points),
    grammarGloss:
      asTeacherApiGlossArray(source.grammarGloss).length > 0
        ? asTeacherApiGlossArray(source.grammarGloss)
        : asTeacherApiGlossArray(source.grammar_gloss),
    issues:
      toIssueArray(source.issues).length > 0
        ? toIssueArray(source.issues)
        : toIssueArray(source.issue_list),
    paragraphAnalysis:
      asParagraphAnalysis(source.paragraphAnalysis) ??
      asParagraphAnalysis(source.paragraph_analysis),
    tenseAnalysis:
      (source.tenseAnalysis as TeacherApiView['tenseAnalysis']) ??
      (source.tense_analysis as TeacherApiView['tenseAnalysis']) ??
      undefined,
    score: (source.score as TeacherApiView['score']) ?? undefined,
  };
}

function getApiTitle(result: TeacherApiView | null, fallbackFocus?: string) {
  return (
    result?.headline ||
    result?.taskLabel ||
    (fallbackFocus ? `Focus on ${formatFocusLabel(fallbackFocus)}` : 'Grammar feedback')
  );
}

function getApiWhy(result: TeacherApiView | null, fallbackText?: string) {
  return (
    result?.why ||
    result?.summary ||
    result?.explanation ||
    fallbackText ||
    'Mercy will show grammar feedback here after the API returns a result.'
  );
}

function getFixesFromApi(result: TeacherApiView | null) {
  if (!result) return [] as string[];

  const directFixes = result.fixes?.filter(Boolean) ?? [];
  if (directFixes.length > 0) return directFixes;

  return (result.issues ?? [])
    .map((issue) => {
      const corrected = normalizeMeaningfulText((issue as any).corrected);
      const reason = normalizeMeaningfulText((issue as any).reason);
      if (corrected && reason) return `${corrected} — ${reason}`;
      if (corrected) return corrected;
      return reason;
    })
    .filter(Boolean);
}

function getVisibleParagraphAnalysis(
  result: TeacherApiView | null,
  fallback?: ParagraphAnalysis
) {
  return result?.paragraphAnalysis ?? fallback;
}

function getParagraphNotes(value?: ParagraphAnalysis): string[] {
  const raw = (value as (ParagraphAnalysis & { notes?: unknown }) | undefined)?.notes;
  return toStringArray(raw);
}

export function MercyTeacherTab({
  profile,
  yesterdaySummary,
  todayTotalMinutes,
  hasHeavyMoods,
  suggestions,
  showBreathingScript,
  breathingStep,
  showReframe,
  setShowBreathingScript,
  setBreathingStep,
  setShowReframe,
  onNavigateSuggestion,
  decision,
  practice,
  writingMode,
  paragraphAnalysis,
  memory,
  teacherTask,
  latestTeacherWritingState,
  onOpenPronunciation,
  onOpenWriting,
  onSubmitTeacherRevision,
}: MercyTeacherTabProps) {
  const orderedTasks = useMemo(
    () => buildOrderedTasks(practice, decision),
    [practice, decision]
  );
  const derivedTeacherTask = useMemo(
    () => deriveTaskFromTeacherTask(teacherTask),
    [teacherTask]
  );
  const primaryTask = orderedTasks[0] ?? derivedTeacherTask;
  const nextTask = orderedTasks[1];
  const supportTask = orderedTasks[2];
  const modeTone = useMemo(() => getModeTone(decision), [decision]);
  const memoryLine = useMemo(() => getMemoryLine(memory, decision), [memory, decision]);
  const reviewFocus = useMemo(() => formatReviewFocus(memory), [memory]);
  const PrimaryTaskIcon = useMemo(
    () => getTaskIcon(primaryTask?.type ?? teacherTask?.taskType),
    [primaryTask?.type, teacherTask?.taskType]
  );
  const canDoInlineAction =
    supportsInlineAction(primaryTask, teacherTask) && Boolean(onSubmitTeacherRevision);
  const revisionSeedText = useMemo(
    () => getRevisionSeedText(latestTeacherWritingState, teacherTask),
    [latestTeacherWritingState, teacherTask]
  );

  const [actionState, setActionState] = useState<TeacherActionState>('idle');
  const [draftText, setDraftText] = useState(revisionSeedText);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showTeacherVersion, setShowTeacherVersion] = useState(false);
  const [showEditedVersion, setShowEditedVersion] = useState(false);

  const grammarResult = useMemo(
    () => asTeacherApiView(latestTeacherWritingState?.latestAnalysisResult),
    [latestTeacherWritingState]
  );
  const hasApiAnalysis = Boolean(grammarResult);
  const fixes = useMemo(() => getFixesFromApi(grammarResult), [grammarResult]);
  const visibleParagraphAnalysis = useMemo(
    () => getVisibleParagraphAnalysis(grammarResult, paragraphAnalysis),
    [grammarResult, paragraphAnalysis]
  );
  const paragraphNotes = useMemo(
    () => getParagraphNotes(visibleParagraphAnalysis),
    [visibleParagraphAnalysis]
  );
  const submittedWriting = hasSubmittedWriting(latestTeacherWritingState);
  const teacherLoopSummary = useMemo(
    () => getTeacherLoopSummary(teacherTask, latestTeacherWritingState, hasApiAnalysis),
    [teacherTask, latestTeacherWritingState, hasApiAnalysis]
  );

  useEffect(() => {
    setActionState('idle');
    setDraftText(revisionSeedText);
    setSubmitError(null);
    setShowTeacherVersion(false);
    setShowEditedVersion(Boolean(latestTeacherWritingState?.isRevisionAttempt));
  }, [
    primaryTask?.type,
    primaryTask?.focus,
    decision?.primaryFocus,
    teacherTask?.triggerToken,
    latestTeacherWritingState?.latestSubmittedText,
    latestTeacherWritingState?.isRevisionAttempt,
    revisionSeedText,
  ]);

  useEffect(() => {
    if (actionState === 'submitting' && latestTeacherWritingState?.latestAnalysisResult) {
      setSubmitError(null);
      setShowEditedVersion(true);
      setActionState('feedback');
    }
  }, [actionState, latestTeacherWritingState?.latestAnalysisResult]);

  const handlePrimaryAction = () => {
    if (!canDoInlineAction) {
      onOpenWriting?.();
      return;
    }

    if (actionState === 'acting') {
      setActionState('idle');
      return;
    }

    setSubmitError(null);
    setDraftText(revisionSeedText);
    setActionState('acting');
  };

  const handleResetDraft = () => {
    setDraftText(revisionSeedText);
    setSubmitError(null);
    setActionState('acting');
  };

  const handleClearDraft = () => {
    setDraftText('');
    setSubmitError(null);
  };

  const handleSubmitInlineAction = async () => {
    const newText = normalizeMeaningfulText(draftText);
    if (!newText || !onSubmitTeacherRevision) return;

    setActionState('submitting');
    setSubmitError(null);

    try {
      await onSubmitTeacherRevision({
        previousText:
          latestTeacherWritingState?.latestSubmittedText ||
          latestTeacherWritingState?.revisionSourceText ||
          teacherTask?.prefillText ||
          '',
        newText,
        isRevision: Boolean(revisionSeedText),
        taskType: primaryTask?.type ?? teacherTask?.taskType,
        focus: primaryTask?.focus ?? teacherTask?.focus,
      });
    } catch (error) {
      console.error('Teacher revision API failed:', error);
      setSubmitError(
        error instanceof Error
          ? error.message
          : 'Grammar API did not return a valid result.'
      );
      setActionState('acting');
    }
  };

  const showTeacherCoachCard = Boolean(primaryTask || decision || teacherTask || submittedWriting);
  const showEssayMode = writingMode === 'essay';
  const shouldShowGeneralWritingCoach =
    Boolean(showEssayMode || writingMode || visibleParagraphAnalysis) &&
    !submittedWriting &&
    !hasApiAnalysis;

  return (
    <TabsContent value="teacher" className="m-0 flex-1 overflow-hidden">
      <ScrollArea className="h-full bg-white px-4 py-3">
        <div className="space-y-4">
          <div className="space-y-2 rounded-2xl border border-pink-100 bg-gradient-to-b from-pink-50 to-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-pink-700">
                  Teacher Mercy
                </p>
                <p className="text-sm font-medium text-foreground">
                  {profile.preferred_name
                    ? `Hi ${profile.preferred_name}, Mercy is here with you.`
                    : 'Hi, Mercy is here with you.'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {profile.preferred_name
                    ? `Chào ${profile.preferred_name}, Mercy đang ở đây để hướng dẫn bạn.`
                    : 'Chào bạn, Mercy đang ở đây để hướng dẫn bạn.'}
                </p>
              </div>

              <span
                className={cn(
                  'rounded-full border px-3 py-1 text-xs font-semibold',
                  modeTone.badgeClass
                )}
                title={modeTone.description}
              >
                {modeTone.label}
              </span>
            </div>

            <p className="text-sm text-muted-foreground">
              Mercy guides the learning flow here, but grammar feedback must come from the API after you submit your writing.
            </p>
          </div>

          {teacherLoopSummary && (
            <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700">
                Teacher loop
              </p>

              <p className="mt-1 text-sm font-semibold text-foreground">
                {teacherLoopSummary.title}
              </p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                {teacherLoopSummary.body}
              </p>

              {latestTeacherWritingState?.latestSubmittedText && (
                <p className="mt-2 text-xs text-indigo-700">
                  Mercy should show grammar feedback only from the returned API result.
                </p>
              )}

              {teacherTask && (
                <div className="mt-3 rounded-xl border border-indigo-200 bg-white p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700">
                    Active task
                  </p>
                  <p className="mt-1 text-sm text-foreground">
                    {formatTaskLabel(teacherTask.taskType)}
                    {teacherTask.focus ? ` — ${teacherTask.focus}` : ''}
                  </p>
                  {(teacherTask.instruction || teacherTask.reason) && (
                    <p className="mt-2 text-xs leading-5 text-muted-foreground">
                      {teacherTask.instruction || teacherTask.reason}
                    </p>
                  )}
                </div>
              )}

              {latestTeacherWritingState?.latestSubmittedText && (
                <div className="mt-3 rounded-xl border border-indigo-200 bg-white p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700">
                    Latest writing
                  </p>
                  <p className="mt-1 text-sm leading-6 text-foreground">
                    {latestTeacherWritingState.latestSubmittedText}
                  </p>
                </div>
              )}

              {latestTeacherWritingState?.isRevisionAttempt &&
                latestTeacherWritingState.revisionSourceText && (
                  <div className="mt-3 rounded-xl border border-indigo-200 bg-white p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700">
                      Earlier version
                    </p>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      {latestTeacherWritingState.revisionSourceText}
                    </p>
                  </div>
                )}

              {latestTeacherWritingState?.currentWritingMode && (
                <div className="mt-3 inline-flex rounded-full border border-indigo-200 bg-white px-3 py-1 text-xs font-semibold text-indigo-700">
                  Writing mode: {toTitle(latestTeacherWritingState.currentWritingMode)}
                </div>
              )}
            </div>
          )}

          {!submittedWriting && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">
                Daily writing with Mercy
              </p>
              <h3 className="mt-1 text-lg font-semibold text-foreground">
                Write about your day, your life, or one sentence you want to improve
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Mercy encourages real-life writing first. After you submit, grammar feedback should come from the API, not from a prewritten reply.
              </p>
              <div className="mt-3 space-y-2 rounded-xl border border-amber-200 bg-white p-3">
                <p className="text-sm text-foreground">You can write:</p>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• what happened today</p>
                  <p>• a feeling, memory, or life update</p>
                  <p>• one sentence you want to check for grammar</p>
                </div>
              </div>
            </div>
          )}

          {showTeacherCoachCard && (
            <div className="space-y-4 rounded-2xl border border-pink-200 border-l-4 border-l-pink-300 bg-white p-4 shadow-sm">
              <div className="space-y-3">
                <div className="inline-flex items-center rounded-full border border-pink-200 bg-pink-50 px-3 py-1 text-xs font-semibold text-pink-700">
                  <Target className="mr-1.5 h-3.5 w-3.5" />
                  Focus:{' '}
                  {formatFocusLabel(
                    primaryTask?.focus ?? teacherTask?.focus ?? decision?.primaryFocus
                  )}
                </div>

                <div>
                  <h3 className="text-xl font-semibold leading-tight text-foreground">
                    {getApiTitle(
                      grammarResult,
                      primaryTask?.focus ?? teacherTask?.focus ?? decision?.primaryFocus
                    )}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {getApiWhy(
                      grammarResult,
                      teacherTask?.reason ??
                        primaryTask?.explanation ??
                        (decision?.taskPlan?.[0] as any)?.reason ??
                        'Mercy is waiting for the grammar API result.'
                    )}
                  </p>
                </div>

                {memoryLine && (
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <p className="text-sm text-slate-700">{memoryLine}</p>
                  </div>
                )}
              </div>

              <div className="rounded-2xl border border-pink-200 bg-pink-50/60 p-4">
                <div className="flex items-start gap-3">
                  <div className="rounded-xl border border-pink-200 bg-white p-2 shadow-sm">
                    <PrimaryTaskIcon className="h-4 w-4 text-pink-700" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold uppercase tracking-wide text-pink-700">
                      Do this now
                    </p>
                    <p className="mt-1 text-base font-semibold text-foreground">
                      {grammarResult?.taskLabel
                        ? grammarResult.taskLabel
                        : primaryTask
                          ? `${formatTaskLabel(primaryTask.type)}: ${primaryTask.focus}`
                          : teacherTask
                            ? `${formatTaskLabel(teacherTask.taskType)}${teacherTask.focus ? `: ${teacherTask.focus}` : ''}`
                            : `Focus on ${formatFocusLabel(decision?.primaryFocus)}`}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {grammarResult?.action ??
                        teacherTask?.instruction ??
                        primaryTask?.instruction ??
                        'Write your own version first, then submit it so Mercy can show the API-based grammar result.'}
                    </p>
                  </div>
                </div>

                {fixes.length > 0 ? (
                  <div className="mt-4 rounded-2xl border border-pink-200 bg-white p-4 shadow-sm">
                    <p className="text-sm font-semibold text-foreground">Grammar result</p>
                    <div className="mt-3 space-y-2">
                      {fixes.map((fix, index) => (
                        <div
                          key={`${fix}-${index}`}
                          className="rounded-xl border border-border bg-muted/10 p-3"
                        >
                          <p className="text-sm leading-6 text-foreground">
                            {index + 1}. {fix}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}

                {grammarResult?.grammarPoints?.length ? (
                  <div className="mt-4 rounded-2xl border border-sky-200 bg-sky-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-sky-700">
                      Grammar points from API
                    </p>
                    <p className="mt-2 text-sm leading-6 text-foreground">
                      {grammarResult.grammarPoints.join(', ')}
                    </p>
                  </div>
                ) : null}

                {showEditedVersion && grammarResult?.editedVersion && (
                  <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-emerald-700" />
                      <p className="text-sm font-semibold text-emerald-800">
                        Edited version
                      </p>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-foreground">
                      {grammarResult.editedVersion}
                    </p>
                  </div>
                )}

                {grammarResult?.teacherModelVersion && (
                  <div className="mt-4">
                    <Button
                      variant="outline"
                      className="w-full justify-between rounded-xl"
                      onClick={() => setShowTeacherVersion((prev) => !prev)}
                    >
                      {showTeacherVersion ? 'Hide teacher version' : 'Show teacher version'}
                      <Eye className="h-4 w-4" />
                    </Button>

                    {showTeacherVersion && (
                      <div className="mt-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                        <div className="flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-emerald-700" />
                          <p className="text-sm font-semibold text-emerald-800">
                            Teacher model version
                          </p>
                        </div>
                        <p className="mt-2 text-sm leading-6 text-foreground">
                          {grammarResult.teacherModelVersion}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {canDoInlineAction &&
                  (actionState === 'acting' || actionState === 'submitting') && (
                    <div className="mt-4 rounded-2xl border border-pink-200 bg-white p-4 shadow-sm">
                      <div className="space-y-2">
                        <p className="text-sm font-semibold text-foreground">
                          ✍️ Write and submit to Mercy
                        </p>
                        <p className="text-xs leading-5 text-muted-foreground">
                          {getInlineActionIntro(primaryTask, teacherTask)}
                        </p>
                      </div>

                      {revisionSeedText ? (
                        <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                            Your latest writing loaded for editing
                          </p>
                          <p className="mt-1 text-sm leading-6 text-foreground">
                            {revisionSeedText}
                          </p>
                        </div>
                      ) : null}

                      <textarea
                        value={draftText}
                        onChange={(event) => setDraftText(event.target.value)}
                        placeholder={getDraftPlaceholder(primaryTask, decision, teacherTask)}
                        className="mt-3 min-h-[180px] w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      />

                      {submitError ? (
                        <div className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3">
                          <div className="flex items-start gap-2">
                            <AlertCircle className="mt-0.5 h-4 w-4 text-red-700" />
                            <div>
                              <p className="text-sm font-semibold text-red-800">
                                Grammar API error
                              </p>
                              <p className="mt-1 text-sm text-red-700">{submitError}</p>
                            </div>
                          </div>
                        </div>
                      ) : null}

                      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                        <Button
                          className="w-full sm:flex-1"
                          onClick={handleSubmitInlineAction}
                          disabled={!draftText.trim() || actionState === 'submitting'}
                        >
                          {actionState === 'submitting' ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Calling grammar API...
                            </>
                          ) : (
                            <>
                              Submit revision to Teacher Mercy
                              <CheckCircle2 className="ml-2 h-4 w-4" />
                            </>
                          )}
                        </Button>

                        <Button
                          variant="outline"
                          className="w-full sm:flex-1"
                          onClick={handleResetDraft}
                          disabled={!revisionSeedText || actionState === 'submitting'}
                        >
                          Reset to original
                          <RotateCcw className="ml-2 h-4 w-4" />
                        </Button>

                        <Button
                          variant="outline"
                          className="w-full sm:flex-1"
                          onClick={handleClearDraft}
                          disabled={actionState === 'submitting'}
                        >
                          Clear
                          <Eraser className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}

                {actionState === 'feedback' && grammarResult && (
                  <div className="mt-4 rounded-2xl border border-green-200 bg-green-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-green-700">
                      API result loaded
                    </p>
                    <p className="mt-1 text-base font-semibold text-foreground">
                      {grammarResult.headline || 'Mercy received the grammar result'}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {grammarResult.nextStep ||
                        grammarResult.encouragement ||
                        grammarResult.action ||
                        'You can keep revising, start a new piece of writing, or move to speaking practice if you want.'}
                    </p>
                  </div>
                )}

                {(latestTeacherWritingState?.isRevisionAttempt || actionState === 'feedback') && (
                  <div className="mt-4 rounded-2xl border border-sky-200 bg-sky-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-sky-700">
                      After the correction
                    </p>
                    <p className="mt-1 text-sm leading-6 text-foreground">
                      Mercy can encourage you to practice speaking next, but you are free to choose any sentence you want for Pronunciation. You can also continue with a brand new paragraph about your day or send just one sentence you want Mercy to check for grammar.
                    </p>
                  </div>
                )}

                <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <Button
                    className="w-full justify-between rounded-xl"
                    onClick={handlePrimaryAction}
                    disabled={actionState === 'submitting'}
                  >
                    {actionState === 'acting'
                      ? 'Hide revision box'
                      : actionState === 'feedback'
                        ? 'Revise again'
                        : canDoInlineAction
                          ? 'Revise this writing now'
                          : 'Open writing coach'}
                    <ArrowRight className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-between rounded-xl"
                    onClick={onOpenPronunciation}
                  >
                    Open Pronunciation practice
                    <Mic className="h-4 w-4" />
                  </Button>
                </div>

                {actionState === 'feedback' && (
                  <div className="mt-2">
                    <Button
                      variant="ghost"
                      className="w-full justify-between rounded-xl text-pink-700"
                      onClick={onOpenWriting}
                    >
                      Open full writing coach
                      <PenSquare className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div className="rounded-xl border border-border bg-muted/20 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Why this matters
                  </p>
                  <p className="mt-1 text-sm leading-6 text-foreground">
                    {getApiWhy(
                      grammarResult,
                      primaryTask?.explanation ??
                        teacherTask?.reason ??
                        (decision?.taskPlan?.[0] as any)?.reason ??
                        'Mercy is choosing the highest-leverage next action for you.'
                    )}
                  </p>
                </div>

                <div className="rounded-xl border border-border bg-muted/20 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Teaching mode
                  </p>
                  <p className="mt-1 text-sm font-medium text-foreground">
                    {modeTone.label}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {decision?.explanationDepth
                      ? `Explanation depth: ${toTitle(String(decision.explanationDepth))}`
                      : 'Mercy is matching the explanation to your current need.'}
                  </p>
                </div>
              </div>

              {(nextTask || supportTask) && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Next after that
                  </p>

                  {nextTask && (
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                      <p className="text-sm font-semibold text-foreground">
                        {formatTaskLabel(nextTask.type)}: {nextTask.focus}
                      </p>
                      <p className="mt-1 text-xs leading-5 text-muted-foreground">
                        {nextTask.instruction ||
                          nextTask.explanation ||
                          'Continue with the next supporting step.'}
                      </p>
                    </div>
                  )}

                  {supportTask && (
                    <div className="rounded-xl border border-slate-200 bg-white p-3">
                      <p className="text-sm font-semibold text-foreground">
                        Support: {formatTaskLabel(supportTask.type)} — {supportTask.focus}
                      </p>
                      <p className="mt-1 text-xs leading-5 text-muted-foreground">
                        Mercy keeps this in support so the main learning goal stays clear.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {shouldShowGeneralWritingCoach && (
                <div className="space-y-3 rounded-2xl border border-border bg-white p-4">
                  <div className="flex items-center gap-2">
                    <PenSquare className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm font-semibold text-foreground">
                      {showEssayMode ? 'Essay coaching' : 'Writing coaching'}
                    </p>
                  </div>

                  {writingMode && (
                    <div className="inline-flex rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                      Writing mode: {toTitle(String(writingMode))}
                    </div>
                  )}

                  {visibleParagraphAnalysis && (
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                      <div className="rounded-xl border border-border bg-muted/20 p-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          Flow
                        </p>
                        <p className="mt-1 text-sm leading-6 text-foreground">
                          {(visibleParagraphAnalysis as any).flow || '—'}
                        </p>
                      </div>

                      <div className="rounded-xl border border-border bg-muted/20 p-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          Connection
                        </p>
                        <p className="mt-1 text-sm leading-6 text-foreground">
                          {(visibleParagraphAnalysis as any).ideaConnection || '—'}
                        </p>
                      </div>

                      <div className="rounded-xl border border-border bg-muted/20 p-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          Tense
                        </p>
                        <p className="mt-1 text-sm leading-6 text-foreground">
                          {(visibleParagraphAnalysis as any).tenseConsistency || '—'}
                        </p>
                      </div>
                    </div>
                  )}

                  {paragraphNotes.length > 0 ? (
                    <div className="space-y-2">
                      {paragraphNotes.map((note, index) => (
                        <div
                          key={`${note}-${index}`}
                          className="rounded-xl border border-border bg-muted/10 p-3"
                        >
                          <p className="text-sm leading-6 text-foreground">{note}</p>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              )}

              {(decision?.praiseFocus || memory) && (
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div className="rounded-xl border border-green-200 bg-green-50 p-3">
                    <div className="flex items-start gap-2">
                      <TrendingUp className="mt-0.5 h-4 w-4 text-green-700" />
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-green-700">
                          Strong point
                        </p>
                        <p className="mt-1 text-sm text-foreground">
                          {decision?.praiseFocus
                            ? `You are already showing strength in ${decision.praiseFocus}.`
                            : 'Mercy is tracking what is already working well.'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-sky-200 bg-sky-50 p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-sky-700">
                      Progress
                    </p>
                    <p className="mt-1 text-sm font-medium text-foreground">
                      {getTrendLabel(memory)}
                    </p>
                    {reviewFocus ? (
                      <p className="mt-1 text-xs text-muted-foreground">
                        Next review focus: {reviewFocus}
                      </p>
                    ) : (
                      <p className="mt-1 text-xs text-muted-foreground">
                        Mercy will keep adapting as more writing comes in.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="space-y-1 rounded-lg bg-muted p-3">
            <p className="text-xs font-medium uppercase text-muted-foreground">
              Yesterday
            </p>

            {yesterdaySummary ? (
              <>
                <p className="text-sm">
                  You studied:{' '}
                  <span className="font-medium">{(yesterdaySummary as any).topic_en}</span>{' '}
                  {(yesterdaySummary as any).minutes &&
                    ` (about ${(yesterdaySummary as any).minutes} minutes)`}
                </p>
                <p className="text-xs text-muted-foreground">
                  Hôm qua bạn đã học: {(yesterdaySummary as any).topic_vi}
                  {(yesterdaySummary as any).minutes &&
                    ` (khoảng ${(yesterdaySummary as any).minutes} phút)`}
                </p>
              </>
            ) : (
              <>
                <p className="text-sm">
                  We don&apos;t have a study log from yesterday. That&apos;s okay.
                </p>
                <p className="text-xs text-muted-foreground">
                  Hôm qua mình không có ghi nhận buổi học nào. Không sao cả.
                </p>
              </>
            )}
          </div>

          <div className="space-y-1 rounded-lg bg-muted p-3">
            <p className="text-xs font-medium uppercase text-muted-foreground">Today</p>

            {todayTotalMinutes > 0 ? (
              <>
                <p className="text-sm">
                  You already spent about{' '}
                  <span className="font-medium">{todayTotalMinutes} minutes</span> here.
                </p>
                <p className="text-xs text-muted-foreground">
                  Hôm nay bạn đã ở đây khoảng {todayTotalMinutes} phút rồi.
                </p>
              </>
            ) : (
              <>
                <p className="text-sm">Today we can start with just 5–10 minutes.</p>
                <p className="text-xs text-muted-foreground">
                  Hôm nay mình chỉ cần bắt đầu với 5–10 phút thôi.
                </p>
              </>
            )}
          </div>

          {hasHeavyMoods && (
            <div className="rounded-lg bg-primary/10 p-3 text-center">
              <p className="text-sm text-primary">
                {COMPASSIONATE_HEAVY_MOOD_MESSAGE.en}
              </p>
              <p className="mt-1 text-xs text-primary/70">
                {COMPASSIONATE_HEAVY_MOOD_MESSAGE.vi}
              </p>
            </div>
          )}

          {suggestions.length > 0 && (
            <div className="space-y-2 rounded-lg bg-secondary/30 p-3">
              <p className="text-xs font-medium text-foreground">Suggested for today:</p>
              <div>
                <p className="text-sm font-medium">{(suggestions[0] as any).title_en}</p>
                <p className="text-xs text-muted-foreground">{(suggestions[0] as any).title_vi}</p>
              </div>
              <p className="text-xs text-foreground/80">{(suggestions[0] as any).reason_en}</p>
              <p className="text-xs text-muted-foreground">{(suggestions[0] as any).reason_vi}</p>

              <Button
                size="sm"
                className="mt-2 w-full"
                onClick={() => onNavigateSuggestion(suggestions[0])}
              >
                Study this today / Học cái này hôm nay
              </Button>
            </div>
          )}

          <div className="space-y-3 rounded-lg border border-border p-3">
            <div className="text-center">
              <p className="text-sm font-medium text-foreground">
                Feeling heavy or stressed?
              </p>
              <p className="text-xs text-muted-foreground">
                Đang thấy nặng hay căng thẳng?
              </p>
            </div>

            {!showBreathingScript ? (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setShowBreathingScript(true);
                  setBreathingStep(0);
                  setShowReframe(false);
                }}
              >
                <Wind className="mr-2 h-4 w-4" />
                Guide me to breathe for 1 minute
              </Button>
            ) : (
              <div className="space-y-3">
                {!showReframe ? (
                  <>
                    <div className="space-y-2">
                      {BREATHING_SCRIPT_SHORT.en
                        .slice(0, breathingStep + 1)
                        .map((line, idx) => (
                          <div
                            key={idx}
                            className={cn(
                              'rounded p-2 transition-all',
                              idx === breathingStep ? 'bg-primary/10' : 'bg-muted/50'
                            )}
                          >
                            <p className="text-sm">{line}</p>
                            <p className="text-xs text-muted-foreground">
                              {BREATHING_SCRIPT_SHORT.vi[idx]}
                            </p>
                          </div>
                        ))}
                    </div>

                    {breathingStep < BREATHING_SCRIPT_SHORT.en.length - 1 ? (
                      <Button
                        size="sm"
                        variant="secondary"
                        className="w-full"
                        onClick={() => setBreathingStep((prev) => prev + 1)}
                      >
                        Next step / Bước tiếp
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        className="w-full"
                        onClick={() => setShowReframe(true)}
                      >
                        Done / Xong
                      </Button>
                    )}
                  </>
                ) : (
                  <>
                    <div className="space-y-2 rounded-lg bg-primary/5 p-3">
                      {POSITIVE_REFRAME_SHORT.en.map((line, idx) => (
                        <div key={idx}>
                          <p className="text-sm text-primary">{line}</p>
                          <p className="text-xs text-primary/70">
                            {POSITIVE_REFRAME_SHORT.vi[idx]}
                          </p>
                        </div>
                      ))}
                    </div>

                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        setShowBreathingScript(false);
                        setBreathingStep(0);
                        setShowReframe(false);
                      }}
                    >
                      Close / Đóng
                    </Button>
                  </>
                )}
              </div>
            )}

            {!showBreathingScript && (
              <p className="text-center text-xs text-muted-foreground">
                Dẫn mình thở 1 phút
              </p>
            )}
          </div>
        </div>
      </ScrollArea>
    </TabsContent>
  );
}

export default MercyTeacherTab;