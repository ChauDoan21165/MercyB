// File: src/components/mercy-guide/MercyTeacherTab.tsx
import React, { useEffect, useMemo, useState } from 'react';
import {
  Wind,
  ArrowRight,
  CheckCircle2,
  PenSquare,
  Mic,
  Link2,
  Replace,
  Repeat,
  Target,
  TrendingUp,
} from 'lucide-react';
import { CompanionProfile } from '@/services/companion';
import { SuggestedItem } from '@/services/suggestions';
import { StudyLogEntry } from '@/services/studyLog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TabsContent } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import {
  BREATHING_SCRIPT_SHORT,
  POSITIVE_REFRAME_SHORT,
  COMPASSIONATE_HEAVY_MOOD_MESSAGE,
} from '@/data/breathing_scripts_en_vi';

type TeacherDecisionTask = {
  type: string;
  focus: string;
  priority?: number;
  reason?: string;
};

type TeacherDecision = {
  primaryFocus?: string;
  secondaryFocuses?: string[];
  praiseFocus?: string;
  responseMode?: string;
  explanationDepth?: string;
  taskPlan?: TeacherDecisionTask[];
};

type PracticeTask = {
  type: string;
  focus: string;
  priority?: number;
  instruction?: string;
  explanation?: string;
  question?: string;
};

type PracticeBlock = {
  mode?: string;
  tasks?: PracticeTask[];
};

type ParagraphAnalysis = {
  flow?: string;
  ideaConnection?: string;
  tenseConsistency?: string;
  notes?: string[];
};

type LearnerMemory = {
  learnerId: string;
  recurringIssues: Record<string, number>;
  strengths: Record<string, number>;
  recentTasks: {
    type: string;
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

type TeacherWritingTask = {
  taskType: 'rewrite' | 'linking' | 'quickFix' | 'production' | string;
  focus?: string;
  instruction?: string;
  reason?: string;
  prefillText?: string;
  triggerToken?: string;
};

type GrammarWritingTeacherState = {
  latestAnalysisResult: unknown | null;
  currentWritingMode?: string;
  isTeacherInitiated: boolean;
  isRevisionAttempt: boolean;
  latestSubmittedText: string;
  teacherTask?: TeacherWritingTask;
  revisionSourceText?: string;
};

type TeacherActionState = 'idle' | 'acting' | 'feedback';

type TeacherMicroFeedback = {
  title: string;
  body: string;
  nextStep: string;
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
  decision?: TeacherDecision;
  practice?: PracticeBlock;
  writingMode?: string;
  paragraphAnalysis?: ParagraphAnalysis;
  memory?: LearnerMemory;
  teacherTask?: TeacherWritingTask;
  latestTeacherWritingState?: GrammarWritingTeacherState;
  onOpenPronunciation?: () => void;
  onOpenWriting?: () => void;
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

function toTitle(value?: string) {
  if (!value) return '';
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function getModeTone(decision?: TeacherDecision) {
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
    case 'linking':
      return Link2;
    case 'quickFix':
      return CheckCircle2;
    case 'review':
      return Repeat;
    default:
      return PenSquare;
  }
}

function getActionText(task?: PracticeTask, teacherTask?: TeacherWritingTask) {
  if (task) {
    switch (task.type) {
      case 'rewrite':
        return (
          task.instruction ||
          'Rewrite your paragraph so the ideas connect more smoothly.'
        );
      case 'linking':
        return (
          task.instruction ||
          'Add linking words so one sentence clearly leads to the next.'
        );
      case 'quickFix':
        return (
          task.instruction ||
          'Do one quick grammar fix to support the main writing goal.'
        );
      case 'contrast':
        return (
          task.instruction ||
          'Compare the meanings carefully before you write again.'
        );
      case 'review':
        return (
          task.instruction ||
          'Review this pattern before moving to the next step.'
        );
      case 'production':
        return (
          task.instruction ||
          'Write one more sentence that uses the target pattern naturally.'
        );
      default:
        return task.instruction || 'Continue with the next teacher task.';
    }
  }

  if (teacherTask) {
    return (
      teacherTask.instruction ||
      teacherTask.reason ||
      `Continue the ${formatTaskLabel(teacherTask.taskType)} task${teacherTask.focus ? ` with focus on ${teacherTask.focus}` : ''}.`
    );
  }

  return 'Start your next practice step.';
}

function getPrimaryHeadline(
  task?: PracticeTask,
  decision?: TeacherDecision,
  teacherTask?: TeacherWritingTask
) {
  if (task) {
    switch (task.type) {
      case 'rewrite':
        return 'Connect your ideas more clearly';
      case 'linking':
        return 'Make your paragraph flow naturally';
      case 'quickFix':
        return 'Strengthen the sentence with one key fix';
      case 'contrast':
        return 'Choose the clearer meaning before writing again';
      case 'review':
        return 'Review this pattern before the next step';
      case 'production':
        return 'Use the target pattern in your own sentence';
      default:
        return `Focus on ${formatFocusLabel(task.focus)}`;
    }
  }

  if (teacherTask) {
    switch (teacherTask.taskType) {
      case 'rewrite':
        return 'Return with a stronger rewrite';
      case 'linking':
        return 'Make the ideas connect more smoothly';
      case 'quickFix':
        return 'Fix one key issue clearly';
      case 'production':
        return 'Produce your own stronger version';
      default:
        return `Focus on ${formatFocusLabel(teacherTask.focus)}`;
    }
  }

  return `Focus on ${formatFocusLabel(decision?.primaryFocus)}`;
}

function getWhyLine(
  task?: PracticeTask,
  decision?: TeacherDecision,
  teacherTask?: TeacherWritingTask,
  latestTeacherWritingState?: GrammarWritingTeacherState
) {
  if (task?.explanation) return task.explanation;
  if (task?.question) return task.question;
  if (decision?.taskPlan?.[0]?.reason) return decision.taskPlan[0].reason;

  if (latestTeacherWritingState?.isRevisionAttempt) {
    return teacherTask?.taskType === 'linking'
      ? 'Mercy is now comparing your revised version against the earlier one to see whether the ideas connect more clearly.'
      : 'Mercy is now comparing your revised version against the earlier one to see whether the writing got stronger.';
  }

  if (teacherTask?.reason) return teacherTask.reason;
  if (teacherTask?.instruction) return teacherTask.instruction;

  switch (task?.type ?? teacherTask?.taskType) {
    case 'rewrite':
      return 'Your ideas are there already. Mercy wants them to feel like one connected message.';
    case 'linking':
      return 'The meaning becomes easier to follow when each sentence clearly leads to the next.';
    case 'quickFix':
      return 'This small grammar fix supports the bigger writing goal.';
    default:
      return 'Mercy is choosing the one next step that gives you the biggest improvement now.';
  }
}

function getPrimaryButtonLabel(
  task?: PracticeTask,
  actionState: TeacherActionState = 'idle',
  teacherTask?: TeacherWritingTask
) {
  if (actionState === 'acting') return 'Hide quick practice';
  if (actionState === 'feedback') return 'Try one better version';

  switch (task?.type ?? teacherTask?.taskType) {
    case 'rewrite':
      return 'Rewrite here';
    case 'linking':
      return 'Practice flow here';
    case 'quickFix':
      return 'Fix it here';
    case 'contrast':
      return 'Compare and choose';
    case 'review':
      return 'Review now';
    case 'production':
      return 'Write one here';
    default:
      return 'Open writing coach';
  }
}

function buildOrderedTasks(
  practice?: PracticeBlock,
  decision?: TeacherDecision
): PracticeTask[] {
  const practiceTasks = [...(practice?.tasks ?? [])].sort(
    (a, b) => (b.priority ?? 0) - (a.priority ?? 0)
  );

  if (practiceTasks.length > 0) return practiceTasks;

  return [...(decision?.taskPlan ?? [])]
    .sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0))
    .map((task) => ({
      type: task.type,
      focus: task.focus,
      priority: task.priority,
      instruction: task.reason,
      explanation: task.reason,
    }));
}

function buildFallbackTask(teacherTask?: TeacherWritingTask): PracticeTask | undefined {
  if (!teacherTask) return undefined;

  return {
    type: teacherTask.taskType,
    focus: teacherTask.focus ?? teacherTask.taskType,
    priority: 0,
    instruction: teacherTask.instruction,
    explanation: teacherTask.reason,
  };
}

function getMemoryLine(memory?: LearnerMemory, decision?: TeacherDecision) {
  const recurring = Object.entries(memory?.recurringIssues ?? {}).sort(
    (a, b) => b[1] - a[1]
  )[0];

  if (recurring) {
    return `You often need support with ${recurring[0]}, so Mercy is focusing there first today.`;
  }

  const strength = Object.entries(memory?.strengths ?? {}).sort(
    (a, b) => b[1] - a[1]
  )[0];

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
  const nextReview = [...(memory?.reviewQueue ?? [])].sort(
    (a, b) =>
      new Date(a.nextReviewAt).getTime() - new Date(b.nextReviewAt).getTime()
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
  decision?: TeacherDecision,
  teacherTask?: TeacherWritingTask
) {
  switch (task?.type ?? teacherTask?.taskType) {
    case 'rewrite':
      return 'Rewrite your sentence or paragraph here so the ideas connect more clearly.';
    case 'linking':
      return 'Write a smoother version here and add linking words between your ideas.';
    case 'quickFix':
      return 'Write the corrected version here.';
    case 'production':
      return 'Write one natural sentence using the target pattern here.';
    default:
      return `Write here about ${task?.focus ?? teacherTask?.focus ?? decision?.primaryFocus ?? 'your next learning focus'}.`;
  }
}

function getInlineActionIntro(task?: PracticeTask, teacherTask?: TeacherWritingTask) {
  switch (task?.type ?? teacherTask?.taskType) {
    case 'rewrite':
      return 'Mercy wants one better rewrite right now inside this tab.';
    case 'linking':
      return 'Mercy wants one version with clearer bridges between ideas.';
    case 'quickFix':
      return 'Mercy wants one clean correction before you move on.';
    case 'production':
      return 'Mercy wants you to produce your own sentence, not just read feedback.';
    default:
      return 'Mercy is giving you a quick guided action here first.';
  }
}

function buildMicroFeedback(
  draft: string,
  task?: PracticeTask,
  teacherTask?: TeacherWritingTask
): TeacherMicroFeedback {
  const trimmed = draft.trim();
  const sentences = trimmed
    .split(/[.!?]+/)
    .map((part) => part.trim())
    .filter(Boolean);
  const wordCount = trimmed.split(/\s+/).filter(Boolean).length;
  const taskType = task?.type ?? teacherTask?.taskType;

  if (trimmed.length === 0) {
    return {
      title: 'Start with one small sentence',
      body: 'Mercy needs one written attempt before she can guide the next step.',
      nextStep: 'Write one sentence first, then submit again.',
    };
  }

  if (taskType === 'rewrite') {
    if (sentences.length >= 2 && wordCount >= 12) {
      return {
        title: 'This rewrite is stronger',
        body: 'You gave Mercy a fuller second version. The next improvement is to make each sentence lead naturally to the next.',
        nextStep: 'Read it once and improve one transition word or phrase.',
      };
    }

    return {
      title: 'Good first rewrite',
      body: 'You started the revision. Mercy now wants a little more connection between the ideas.',
      nextStep: 'Add one more sentence or one linking phrase so the message feels smoother.',
    };
  }

  if (taskType === 'linking') {
    const hasLinkingWord =
      /\b(because|so|but|and|then|however|therefore|first|next|finally|also)\b/i.test(
        trimmed
      );

    return hasLinkingWord
      ? {
          title: 'Your flow is getting clearer',
          body: 'Mercy can already see a bridge between ideas in your new version.',
          nextStep: 'Read it aloud once and check whether the order of ideas still feels natural.',
        }
      : {
          title: 'Nice start',
          body: 'You rewrote the idea, but Mercy still wants a clearer bridge between one sentence and the next.',
          nextStep: 'Add one linking word such as because, so, but, then, or however.',
        };
  }

  if (taskType === 'quickFix') {
    return {
      title: 'Good correction step',
      body: 'You focused on one small change, which is exactly how Mercy wants to build accuracy.',
      nextStep: 'Read the sentence aloud once and check if every word form still matches your meaning.',
    };
  }

  if (taskType === 'production') {
    return {
      title: 'You used the pattern yourself',
      body: 'That is the right direction. Mercy wants you producing language, not only reading feedback.',
      nextStep: 'Write one more example with the same pattern in a different meaning.',
    };
  }

  return {
    title: 'Good work',
    body: 'You completed the next teacher action inside this tab.',
    nextStep: 'Open the writing coach if you want a deeper correction pass.',
  };
}

function getTeacherLoopSummary(
  teacherTask?: TeacherWritingTask,
  latestTeacherWritingState?: GrammarWritingTeacherState
) {
  if (!teacherTask && !latestTeacherWritingState?.latestSubmittedText) return null;

  if (latestTeacherWritingState?.isRevisionAttempt) {
    return {
      title: 'You came back with a revision',
      body:
        teacherTask?.taskType === 'linking'
          ? 'Mercy can now coach whether your new version connects ideas more clearly.'
          : 'Mercy can now coach whether your new version is stronger than the first one.',
    };
  }

  if (latestTeacherWritingState?.isTeacherInitiated) {
    return {
      title: 'You completed the teacher writing step',
      body: 'Mercy now uses your latest writing attempt to decide the next best step.',
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
    body: 'Mercy can now react to what you just wrote.',
  };
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
}: MercyTeacherTabProps) {
  const orderedTasks = useMemo(
    () => buildOrderedTasks(practice, decision),
    [practice, decision]
  );
  const fallbackTeacherTask = useMemo(
    () => buildFallbackTask(teacherTask),
    [teacherTask]
  );
  const primaryTask = orderedTasks[0] ?? fallbackTeacherTask;
  const nextTask = orderedTasks[1];
  const supportTask = orderedTasks[2];
  const modeTone = useMemo(() => getModeTone(decision), [decision]);
  const memoryLine = useMemo(() => getMemoryLine(memory, decision), [memory, decision]);
  const reviewFocus = useMemo(() => formatReviewFocus(memory), [memory]);
  const PrimaryTaskIcon = useMemo(
    () => getTaskIcon(primaryTask?.type ?? teacherTask?.taskType),
    [primaryTask?.type, teacherTask?.taskType]
  );
  const canDoInlineAction = supportsInlineAction(primaryTask, teacherTask);
  const teacherLoopSummary = useMemo(
    () => getTeacherLoopSummary(teacherTask, latestTeacherWritingState),
    [teacherTask, latestTeacherWritingState]
  );

  const [actionState, setActionState] = useState<TeacherActionState>('idle');
  const [draftText, setDraftText] = useState('');
  const [microFeedback, setMicroFeedback] = useState<TeacherMicroFeedback | null>(
    null
  );

  useEffect(() => {
    setActionState('idle');
    setDraftText('');
    setMicroFeedback(null);
  }, [
    primaryTask?.type,
    primaryTask?.focus,
    decision?.primaryFocus,
    teacherTask?.triggerToken,
  ]);

  const handlePrimaryAction = () => {
    if (!canDoInlineAction) {
      onOpenWriting?.();
      return;
    }

    if (actionState === 'acting') {
      setActionState('idle');
      return;
    }

    setActionState('acting');
  };

  const handleSubmitInlineAction = () => {
    const feedback = buildMicroFeedback(draftText, primaryTask, teacherTask);
    setMicroFeedback(feedback);
    setActionState('feedback');
  };

  const showTeacherCoachCard = Boolean(primaryTask || decision || teacherTask);

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
              >
                {modeTone.label}
              </span>
            </div>

            <p className="text-sm text-muted-foreground">{modeTone.description}</p>
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

          {showTeacherCoachCard && (
            <div className="space-y-4 rounded-2xl border border-pink-200 bg-white p-4 shadow-sm">
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
                    {getPrimaryHeadline(primaryTask, decision, teacherTask)}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {getWhyLine(
                      primaryTask,
                      decision,
                      teacherTask,
                      latestTeacherWritingState
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
                      {primaryTask
                        ? `${formatTaskLabel(primaryTask.type)}: ${primaryTask.focus}`
                        : teacherTask
                          ? `${formatTaskLabel(teacherTask.taskType)}${teacherTask.focus ? `: ${teacherTask.focus}` : ''}`
                          : `Focus on ${formatFocusLabel(decision?.primaryFocus)}`}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {getActionText(primaryTask, teacherTask)}
                    </p>
                  </div>
                </div>

                {canDoInlineAction && actionState === 'acting' && (
                  <div className="mt-4 rounded-2xl border border-pink-200 bg-white p-4 shadow-sm">
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-foreground">
                        Try it here first
                      </p>
                      <p className="text-xs leading-5 text-muted-foreground">
                        {getInlineActionIntro(primaryTask, teacherTask)}
                      </p>
                    </div>

                    <textarea
                      value={draftText}
                      onChange={(event) => setDraftText(event.target.value)}
                      placeholder={getDraftPlaceholder(primaryTask, decision, teacherTask)}
                      className="mt-3 min-h-[140px] w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    />

                    <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                      <Button
                        className="w-full sm:flex-1"
                        onClick={handleSubmitInlineAction}
                        disabled={!draftText.trim()}
                      >
                        Submit to Mercy
                        <CheckCircle2 className="ml-2 h-4 w-4" />
                      </Button>

                      <Button
                        variant="outline"
                        className="w-full sm:flex-1"
                        onClick={() => {
                          setDraftText('');
                          setMicroFeedback(null);
                        }}
                      >
                        Clear draft
                      </Button>
                    </div>
                  </div>
                )}

                {canDoInlineAction && actionState === 'feedback' && microFeedback && (
                  <div className="mt-4 rounded-2xl border border-green-200 bg-green-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-green-700">
                      Mercy feedback
                    </p>
                    <p className="mt-1 text-base font-semibold text-foreground">
                      {microFeedback.title}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {microFeedback.body}
                    </p>

                    <div className="mt-3 rounded-xl border border-green-200 bg-white p-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-green-700">
                        Next step
                      </p>
                      <p className="mt-1 text-sm text-foreground">
                        {microFeedback.nextStep}
                      </p>
                    </div>
                  </div>
                )}

                <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <Button
                    className="w-full justify-between rounded-xl"
                    onClick={handlePrimaryAction}
                  >
                    {getPrimaryButtonLabel(primaryTask, actionState, teacherTask)}
                    <ArrowRight className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-between rounded-xl"
                    onClick={onOpenPronunciation}
                  >
                    {latestTeacherWritingState?.isRevisionAttempt
                      ? 'Say your revised version'
                      : latestTeacherWritingState?.latestSubmittedText
                        ? 'Say your latest version'
                        : 'Say it aloud'}
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
                    {primaryTask?.explanation ||
                      teacherTask?.reason ||
                      decision?.taskPlan?.[0]?.reason ||
                      'Mercy is choosing the highest-leverage next action for you.'}
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
                      ? `Explanation depth: ${toTitle(decision.explanationDepth)}`
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
                        {getActionText(nextTask)}
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

              {(writingMode || paragraphAnalysis) && (
                <div className="space-y-3 rounded-2xl border border-border bg-white p-4">
                  <div className="flex items-center gap-2">
                    <PenSquare className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm font-semibold text-foreground">
                      Writing coaching
                    </p>
                  </div>

                  {writingMode && (
                    <div className="inline-flex rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                      Writing mode: {toTitle(writingMode)}
                    </div>
                  )}

                  {paragraphAnalysis && (
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                      <div className="rounded-xl border border-border bg-muted/20 p-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          Flow
                        </p>
                        <p className="mt-1 text-sm leading-6 text-foreground">
                          {paragraphAnalysis.flow || '—'}
                        </p>
                      </div>

                      <div className="rounded-xl border border-border bg-muted/20 p-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          Connection
                        </p>
                        <p className="mt-1 text-sm leading-6 text-foreground">
                          {paragraphAnalysis.ideaConnection || '—'}
                        </p>
                      </div>

                      <div className="rounded-xl border border-border bg-muted/20 p-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          Tense
                        </p>
                        <p className="mt-1 text-sm leading-6 text-foreground">
                          {paragraphAnalysis.tenseConsistency || '—'}
                        </p>
                      </div>
                    </div>
                  )}
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
                  <span className="font-medium">{yesterdaySummary.topic_en}</span>{' '}
                  {yesterdaySummary.minutes &&
                    ` (about ${yesterdaySummary.minutes} minutes)`}
                </p>
                <p className="text-xs text-muted-foreground">
                  Hôm qua bạn đã học: {yesterdaySummary.topic_vi}
                  {yesterdaySummary.minutes &&
                    ` (khoảng ${yesterdaySummary.minutes} phút)`}
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
                <p className="text-sm font-medium">{suggestions[0].title_en}</p>
                <p className="text-xs text-muted-foreground">{suggestions[0].title_vi}</p>
              </div>
              <p className="text-xs text-foreground/80">{suggestions[0].reason_en}</p>
              <p className="text-xs text-muted-foreground">{suggestions[0].reason_vi}</p>

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