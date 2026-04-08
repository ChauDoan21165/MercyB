/**
 * File: MercyTeacherTab.tsx
 * Path: src/components/mercy-guide/MercyTeacherTab.tsx
 */

import React, { useMemo } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  Brain,
  CheckCircle2,
  Clock3,
  Crown,
  Lightbulb,
  Lock,
  MessageCircleHeart,
  Mic,
  PenSquare,
  Sparkles,
  Target,
} from 'lucide-react';
import type {
  GrammarApiResponse,
  GrammarWritingTeacherState,
  TeacherMemorySummaryItem,
} from './types';

interface Props {
  latestTeacherWritingState?: GrammarWritingTeacherState | null;
  latestAnalysisResult?: GrammarApiResponse | null;
  teacherMemorySummary?: TeacherMemorySummaryItem[];
  onOpenPronunciation?: () => void;
  onOpenWriting?: () => void;
  isLocked?: boolean;
  onUnlock?: () => void;
  unlockTitle?: string;
  unlockDescription?: string;
  unlockButtonLabel?: string;
}

type BilingualText = {
  vi?: string;
  en?: string;
};

type TeacherDisplayResult = {
  correctedText?: unknown;
  enhancedText?: unknown;
  explanation?: unknown;
  grammarPoints: unknown[];
  tense?: unknown;
};

type JourneyStepStatus = {
  key: 'express' | 'improve' | 'speak' | 'understand';
  title: string;
  caption: string;
  done: boolean;
};

type ProgressNote = {
  title: string;
  body: string;
};

const PROMPTS = [
  'My mood today is...',
  'Something happened today that made me...',
  'I keep thinking about...',
  'Today I realized...',
  'I want to say this in English...',
];

function asText(value: unknown): string {
  if (typeof value === 'string') return value;

  if (Array.isArray(value)) {
    return value.map(asText).filter(Boolean).join(', ');
  }

  if (value && typeof value === 'object') {
    const maybeBilingual = value as BilingualText;

    if (typeof maybeBilingual.en === 'string' && maybeBilingual.en.trim()) {
      return maybeBilingual.en;
    }

    if (typeof maybeBilingual.vi === 'string' && maybeBilingual.vi.trim()) {
      return maybeBilingual.vi;
    }
  }

  if (value == null) return '';

  try {
    return String(value);
  } catch {
    return '';
  }
}

function cleanText(value: unknown): string {
  return asText(value).replace(/\s+/g, ' ').trim();
}

function mapResult(value?: GrammarApiResponse | null): TeacherDisplayResult | null {
  if (!value) return null;

  return {
    correctedText: value.correctedText,
    enhancedText: value.enhancedText,
    explanation: value.explanation,
    grammarPoints: Array.isArray((value as any).grammarPoints)
      ? (value as any).grammarPoints
      : [],
    tense: (value as any).tenseAnalysis?.likelyMainTense,
  };
}

function formatWritingMode(value?: string): string {
  if (!value) return '';
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function getMemoryIcon(type: TeacherMemorySummaryItem['type']) {
  switch (type) {
    case 'strength':
      return <Sparkles className="mt-0.5 h-4.5 w-4.5 shrink-0 text-amber-500" />;
    case 'focus':
      return <Target className="mt-0.5 h-4.5 w-4.5 shrink-0 text-emerald-500" />;
    case 'logic':
      return <Brain className="mt-0.5 h-4.5 w-4.5 shrink-0 text-violet-500" />;
    case 'pronunciation':
      return <Mic className="mt-0.5 h-4.5 w-4.5 shrink-0 text-sky-500" />;
    default:
      return <Sparkles className="mt-0.5 h-4.5 w-4.5 shrink-0 text-amber-500" />;
  }
}

function getStepCardStyles(step: 'express' | 'improve' | 'speak' | 'understand') {
  switch (step) {
    case 'express':
      return {
        border: 'border-l-[#FF8A65]',
        label: 'text-[#D66A4E]',
        badge: 'bg-[#FFF1EC] text-[#D66A4E] border-[#FFD4C6]',
      };
    case 'improve':
      return {
        border: 'border-l-[#34D399]',
        label: 'text-[#0F9F6E]',
        badge: 'bg-[#ECFDF5] text-[#0F9F6E] border-[#B7F0D3]',
      };
    case 'speak':
      return {
        border: 'border-l-[#60A5FA]',
        label: 'text-[#2563EB]',
        badge: 'bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]',
      };
    case 'understand':
      return {
        border: 'border-l-[#C084FC]',
        label: 'text-[#9333EA]',
        badge: 'bg-[#F5F3FF] text-[#9333EA] border-[#DDD6FE]',
      };
    default:
      return {
        border: 'border-l-slate-300',
        label: 'text-slate-600',
        badge: 'bg-slate-50 text-slate-600 border-slate-200',
      };
  }
}

function getJourneySteps(params: {
  latestWriting: string;
  hasAnalysis: boolean;
  hasLogicMemory: boolean;
  hasPronunciationMemory: boolean;
}): JourneyStepStatus[] {
  const { latestWriting, hasAnalysis, hasLogicMemory, hasPronunciationMemory } = params;

  return [
    {
      key: 'express',
      title: 'Express',
      caption: latestWriting ? 'You gave Mercy a real sentence.' : 'Write one real sentence.',
      done: Boolean(latestWriting),
    },
    {
      key: 'improve',
      title: 'Improve',
      caption: hasAnalysis
        ? 'Mercy already shaped the sentence.'
        : 'Open Grammar to improve it.',
      done: hasAnalysis,
    },
    {
      key: 'speak',
      title: 'Speak',
      caption: hasPronunciationMemory
        ? 'Mercy already remembers a speaking pattern here.'
        : hasAnalysis
          ? 'Practice the improved line aloud.'
          : 'Speak becomes stronger after Grammar.',
      done: hasPronunciationMemory,
    },
    {
      key: 'understand',
      title: 'Understand',
      caption: hasLogicMemory
        ? 'Mercy already remembers the sentence pattern.'
        : 'Logic will explain the sentence pattern.',
      done: hasLogicMemory,
    },
  ];
}

function pickFirstMemoryLabel(
  items: TeacherMemorySummaryItem[],
  type: TeacherMemorySummaryItem['type'],
): string {
  return cleanText(items.find((item) => item.type === type)?.label);
}

function buildProgressNotes(params: {
  latestWriting: string;
  correctedText: string;
  enhancedText: string;
  focusText: string;
  explanationText: string;
  grammarPoints: string[];
  writingMode: string;
  teacherMemorySummary: TeacherMemorySummaryItem[];
}): ProgressNote[] {
  const {
    latestWriting,
    correctedText,
    enhancedText,
    focusText,
    explanationText,
    grammarPoints,
    writingMode,
    teacherMemorySummary,
  } = params;

  const notes: ProgressNote[] = [];

  const latestSentence = enhancedText || correctedText || latestWriting;
  const strengthLabel = pickFirstMemoryLabel(teacherMemorySummary, 'strength');
  const focusLabel = pickFirstMemoryLabel(teacherMemorySummary, 'focus');
  const logicLabel = pickFirstMemoryLabel(teacherMemorySummary, 'logic');
  const pronunciationLabel = pickFirstMemoryLabel(teacherMemorySummary, 'pronunciation');

  if (latestSentence) {
    notes.push({
      title: 'Latest sentence',
      body: latestSentence,
    });
  }

  if (enhancedText && latestWriting && enhancedText !== latestWriting) {
    notes.push({
      title: 'What improved',
      body: `Mercy helped turn the original sentence into a more natural English line. ${
        focusLabel || focusText
          ? `This round mainly focused on ${focusLabel || focusText}.`
          : 'This round focused on making the sentence clearer.'
      }`,
    });
  } else if (correctedText && latestWriting && correctedText !== latestWriting) {
    notes.push({
      title: 'What Mercy corrected',
      body: `Mercy cleaned the sentence so the meaning stays the same but the English feels stronger.${
        focusLabel || focusText ? ` Main focus: ${focusLabel || focusText}.` : ''
      }`,
    });
  }

  if (logicLabel || explanationText) {
    notes.push({
      title: 'What Mercy noticed',
      body:
        logicLabel ||
        explanationText ||
        'Mercy noticed an English pattern in this sentence and turned it into a teachable moment.',
    });
  }

  if (pronunciationLabel) {
    notes.push({
      title: 'Speaking note',
      body: pronunciationLabel,
    });
  }

  if (strengthLabel) {
    notes.push({
      title: 'Growing strength',
      body: strengthLabel,
    });
  }

  if (!notes.length && writingMode) {
    notes.push({
      title: 'Current writing mode',
      body: writingMode,
    });
  }

  const nextStepSource =
    pronunciationLabel
      ? 'Say the improved sentence again slowly and clearly, then try one new sentence with the same pattern.'
      : enhancedText || correctedText
        ? 'Take the improved sentence into Speak, then open Logic so Mercy can remember the lesson.'
        : latestWriting
          ? 'Open Grammar first so Mercy can improve the same sentence before speaking practice.'
          : 'Write one honest sentence so Mercy can begin your learning history.';

  notes.push({
    title: 'Next step',
    body: nextStepSource,
  });

  const compactNotes = notes
    .map((note) => ({
      title: cleanText(note.title),
      body: cleanText(note.body),
    }))
    .filter((note) => note.title && note.body);

  const deduped: ProgressNote[] = [];
  const seen = new Set<string>();

  for (const note of compactNotes) {
    const key = `${note.title.toLowerCase()}::${note.body.toLowerCase()}`;
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(note);
  }

  const grammarFallback =
    grammarPoints.length > 0
      ? {
          title: 'Grammar focus',
          body: grammarPoints[0],
        }
      : null;

  if (
    grammarFallback &&
    !deduped.some((note) => note.title.toLowerCase() === 'grammar focus')
  ) {
    deduped.splice(Math.min(2, deduped.length), 0, grammarFallback);
  }

  return deduped.slice(0, 6);
}

function buildLockedJourneyPreview(params: {
  latestWriting: string;
  focusText: string;
  hasAnalysis: boolean;
  hasMemory: boolean;
  enhancedText: string;
  correctedText: string;
}): ProgressNote[] {
  const { latestWriting, focusText, hasAnalysis, hasMemory, enhancedText, correctedText } = params;

  return [
    {
      title: 'Your sentence',
      body: latestWriting || 'Start with one honest sentence and Mercy will build from there.',
    },
    {
      title: 'What Journey unlocks',
      body:
        enhancedText || correctedText
          ? 'See your improved sentence, your teacher progress note, and the next best step in one place.'
          : 'See your latest sentence turn into a guided lesson with coaching, speaking direction, and understanding support.',
    },
    {
      title: 'What Mercy remembers',
      body: hasMemory
        ? 'Journey brings together strengths, focus patterns, and sentence logic so learning does not reset each time.'
        : 'As you use Grammar, Speak, and Logic, Journey starts remembering your patterns and coaching you personally.',
    },
    {
      title: 'Next step',
      body: hasAnalysis
        ? 'Unlock Journey to keep this sentence moving through memory-based coaching.'
        : focusText
          ? `Unlock Journey to turn ${focusText} into a guided learning path.`
          : 'Unlock Journey to see the full teacher layer, not just separate tools.',
    },
  ];
}

export function MercyTeacherTab({
  latestTeacherWritingState,
  latestAnalysisResult,
  teacherMemorySummary = [],
  onOpenPronunciation,
  onOpenWriting,
  isLocked = false,
  onUnlock,
  unlockTitle = 'Unlock Mercy Journey',
  unlockDescription = 'Journey turns one real sentence into a personal teacher loop with memory, progress notes, and next-step coaching.',
  unlockButtonLabel = 'Unlock Journey',
}: Props) {
  const analysisSource =
    latestAnalysisResult ?? latestTeacherWritingState?.latestAnalysisResult ?? null;

  const result = useMemo(() => mapResult(analysisSource), [analysisSource]);

  const correctedText = cleanText(result?.correctedText);
  const enhancedText = cleanText(result?.enhancedText);
  const explanationText = cleanText(result?.explanation);
  const tenseText = cleanText(result?.tense);
  const grammarPoints = (result?.grammarPoints ?? []).map(cleanText).filter(Boolean);

  const latestWriting = cleanText(latestTeacherWritingState?.latestSubmittedText);
  const writingMode = formatWritingMode(latestTeacherWritingState?.currentWritingMode);

  const hasAnalysis =
    Boolean(correctedText) ||
    Boolean(enhancedText) ||
    Boolean(explanationText) ||
    grammarPoints.length > 0 ||
    Boolean(tenseText);

  const hasMemory = teacherMemorySummary.length > 0;
  const hasLogicMemory = teacherMemorySummary.some((item) => item.type === 'logic');
  const hasPronunciationMemory = teacherMemorySummary.some(
    (item) => item.type === 'pronunciation',
  );

  const focusText = useMemo(() => {
    const teacherTask = latestTeacherWritingState?.teacherTask as
      | { focus?: unknown; emphasis?: unknown }
      | undefined;

    const explicitFocus = cleanText(teacherTask?.focus);
    if (explicitFocus) return explicitFocus;

    const emphasis = cleanText(teacherTask?.emphasis);
    if (emphasis) return emphasis;

    const focusLabel = pickFirstMemoryLabel(teacherMemorySummary, 'focus');
    if (focusLabel) return focusLabel;

    if (grammarPoints.length > 0) return grammarPoints[0];
    if (tenseText) return `${tenseText} tense`;
    return 'real English from your real thought';
  }, [grammarPoints, latestTeacherWritingState?.teacherTask, teacherMemorySummary, tenseText]);

  const encouragementText = useMemo(() => {
    if (latestWriting) {
      return 'You already gave Mercy something real. Keep the same sentence moving through Grammar, Speak, and Logic so one idea becomes a full learning loop.';
    }

    return 'Start with one honest thought. It does not need to be perfect. Mercy will help you shape it into natural English, then help you say it and understand it.';
  }, [latestWriting]);

  const coachingLead = useMemo(() => {
    if (teacherMemorySummary.length > 0) {
      const focusItem = teacherMemorySummary.find((item) => item.type === 'focus');
      if (focusItem?.label) return focusItem.label;
    }

    if (focusText) return `Today’s focus: ${focusText}.`;

    return 'Start with one real thought, not a perfect sentence.';
  }, [focusText, teacherMemorySummary]);

  const quickCoach = useMemo(() => {
    if (!latestWriting) {
      return 'A short honest sentence is enough. Mercy will guide it step by step.';
    }

    if (enhancedText) {
      return 'Good. Mercy already has a stronger version ready. Now keep this same sentence moving through the full flow.';
    }

    return 'You already started. Open Grammar and let Mercy shape the same sentence.';
  }, [enhancedText, latestWriting]);

  const primarySentence = enhancedText || correctedText || latestWriting;

  const journeySteps = useMemo(
    () =>
      getJourneySteps({
        latestWriting,
        hasAnalysis,
        hasLogicMemory,
        hasPronunciationMemory,
      }),
    [hasAnalysis, hasLogicMemory, hasPronunciationMemory, latestWriting],
  );

  const progressNotes = useMemo(
    () =>
      buildProgressNotes({
        latestWriting,
        correctedText,
        enhancedText,
        focusText,
        explanationText,
        grammarPoints,
        writingMode,
        teacherMemorySummary,
      }),
    [
      correctedText,
      enhancedText,
      explanationText,
      focusText,
      grammarPoints,
      latestWriting,
      teacherMemorySummary,
      writingMode,
    ],
  );

  const lockedPreviewNotes = useMemo(
    () =>
      buildLockedJourneyPreview({
        latestWriting,
        focusText,
        hasAnalysis,
        hasMemory,
        enhancedText,
        correctedText,
      }),
    [correctedText, enhancedText, focusText, hasAnalysis, hasMemory, latestWriting],
  );

  const expressStyles = getStepCardStyles('express');
  const improveStyles = getStepCardStyles('improve');
  const speakStyles = getStepCardStyles('speak');
  const understandStyles = getStepCardStyles('understand');

  const showWritingButton = typeof onOpenWriting === 'function';
  const showPronunciationButton = typeof onOpenPronunciation === 'function';

  return (
    <div className="m-0 flex-1 overflow-hidden">
      <ScrollArea className="h-full bg-gradient-to-br from-[#FFF7F0] via-[#F8FAFF] to-[#F0F4FF]">
        <div className="relative p-5 md:p-6">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top,_rgba(255,138,101,0.10),_rgba(192,132,252,0.05)_45%,_transparent_75%)]" />

          <div className="relative space-y-5">
            <section className="overflow-hidden rounded-3xl border border-white/80 bg-white/90 p-6 shadow-[0_12px_36px_rgba(255,138,101,0.08)] backdrop-blur-sm md:p-7">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="max-w-3xl">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-rose-100/90 p-2.5">
                      {isLocked ? (
                        <Lock className="h-5.5 w-5.5 text-rose-500" />
                      ) : (
                        <MessageCircleHeart className="h-5.5 w-5.5 text-rose-500" />
                      )}
                    </div>

                    <div>
                      <h2 className="text-xl font-semibold tracking-tight text-slate-900 md:text-2xl">
                        {isLocked
                          ? 'Journey is Mercy’s premium teacher layer'
                          : 'Journey is where Mercy stays with your learning'}
                      </h2>
                      <div className="mt-2 h-[2px] w-24 rounded-full bg-gradient-to-r from-[#FFB199] via-[#FDBA74] to-[#C4B5FD] opacity-80" />
                    </div>
                  </div>

                  <p className="mt-5 text-base leading-7 text-slate-700">
                    {isLocked
                      ? 'Unlock Journey to turn one real student sentence into coaching, memory, progress notes, and a clear next step.'
                      : encouragementText}
                  </p>
                </div>

                <div className="rounded-2xl border border-amber-100/80 bg-gradient-to-r from-[#FFF8F1] via-white to-[#F8FAFF] p-4 md:max-w-sm">
                  <div className="flex items-start gap-3">
                    {isLocked ? (
                      <Crown className="mt-0.5 h-4.5 w-4.5 shrink-0 text-amber-500" />
                    ) : (
                      <Lightbulb className="mt-0.5 h-4.5 w-4.5 shrink-0 text-amber-500" />
                    )}
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {isLocked ? 'Why learners unlock Journey' : 'Mercy’s gentle focus'}
                      </p>
                      <p className="mt-1 text-sm leading-6 text-slate-700">
                        {isLocked
                          ? 'Journey keeps the sentence, the lesson, and the teacher note together so English feels guided instead of fragmented.'
                          : coachingLead}
                      </p>
                      <p className="mt-1 text-sm leading-6 text-slate-600">
                        {isLocked
                          ? 'Students can see what Mercy remembers, what improved, and exactly what to do next.'
                          : quickCoach}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid gap-3 md:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Current sentence
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-700">
                    {primarySentence || 'No sentence yet. Start with one honest thought.'}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Current focus
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-700">{focusText}</p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    {isLocked ? 'Unlocked value' : 'Next step'}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-700">
                    {isLocked
                      ? 'Progress notes, memory-based coaching, and a clear next action for this same sentence.'
                      : hasAnalysis
                        ? 'Say the improved sentence aloud, then open Logic to understand it.'
                        : 'Open Grammar and let Mercy shape the same sentence first.'}
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-rose-100/80 bg-gradient-to-br from-white to-rose-50/50 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-600">
                  Good ways to begin
                </p>

                <div className="mt-4 flex flex-wrap gap-2.5">
                  {PROMPTS.map((prompt) => (
                    <span
                      key={prompt}
                      className="rounded-full border border-rose-200/80 bg-white px-4 py-2 text-sm font-medium text-rose-700 transition-colors hover:border-rose-300 hover:bg-rose-50"
                    >
                      {prompt}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                {showWritingButton ? (
                  <Button
                    type="button"
                    onClick={onOpenWriting}
                    className="h-11 rounded-2xl border-0 bg-gradient-to-r from-[#FF8A65] to-[#FF6F61] px-6 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(255,111,97,0.22)] hover:brightness-[1.03]"
                  >
                    <PenSquare className="mr-2.5 h-4.5 w-4.5" />
                    {latestWriting ? 'Continue in Grammar' : 'Open Grammar & Writing'}
                  </Button>
                ) : null}

                {!isLocked && hasAnalysis && showPronunciationButton ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onOpenPronunciation}
                    className="h-11 rounded-2xl border-sky-200 bg-white text-sky-700 hover:bg-sky-50"
                  >
                    <Mic className="mr-2.5 h-4.5 w-4.5" />
                    Continue to Speak
                  </Button>
                ) : null}

                {isLocked && onUnlock ? (
                  <Button
                    type="button"
                    onClick={onUnlock}
                    className="h-11 rounded-2xl border-0 bg-gradient-to-r from-violet-600 via-fuchsia-500 to-rose-500 px-6 text-sm font-semibold text-white shadow-[0_10px_26px_rgba(168,85,247,0.24)] hover:brightness-[1.03]"
                  >
                    <Crown className="mr-2.5 h-4.5 w-4.5" />
                    {unlockButtonLabel}
                  </Button>
                ) : null}
              </div>
            </section>

            {isLocked ? (
              <>
                <section className="rounded-3xl border border-violet-100/80 bg-gradient-to-br from-white via-violet-50/50 to-rose-50/40 p-5 shadow-[0_10px_28px_rgba(168,85,247,0.08)] md:p-6">
                  <div className="flex items-start gap-3">
                    <div className="rounded-2xl bg-violet-100 p-2.5">
                      <Lock className="h-5 w-5 text-violet-600" />
                    </div>

                    <div className="flex-1">
                      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div className="max-w-2xl">
                          <h3 className="text-lg font-semibold text-slate-900">{unlockTitle}</h3>
                          <p className="mt-2 text-sm leading-6 text-slate-600">
                            {unlockDescription}
                          </p>
                        </div>

                        {onUnlock ? (
                          <Button
                            type="button"
                            onClick={onUnlock}
                            className="h-11 rounded-2xl border-0 bg-gradient-to-r from-violet-600 via-fuchsia-500 to-rose-500 px-6 text-sm font-semibold text-white shadow-[0_10px_26px_rgba(168,85,247,0.24)] hover:brightness-[1.03]"
                          >
                            <Crown className="mr-2.5 h-4.5 w-4.5" />
                            {unlockButtonLabel}
                          </Button>
                        ) : null}
                      </div>

                      <div className="mt-5 grid gap-3 md:grid-cols-3">
                        <div className="rounded-2xl border border-white/90 bg-white/85 p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                            Teacher coaching
                          </p>
                          <p className="mt-2 text-sm leading-6 text-slate-700">
                            Mercy explains what changed, what matters, and what to practice next.
                          </p>
                        </div>

                        <div className="rounded-2xl border border-white/90 bg-white/85 p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                            Memory loop
                          </p>
                          <p className="mt-2 text-sm leading-6 text-slate-700">
                            Journey keeps your sentence history, focus areas, and language patterns in one place.
                          </p>
                        </div>

                        <div className="rounded-2xl border border-white/90 bg-white/85 p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                            Clear direction
                          </p>
                          <p className="mt-2 text-sm leading-6 text-slate-700">
                            Instead of separate tools, students get one guided path from sentence to understanding.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                <section className="rounded-3xl border border-white/80 bg-white/90 p-5 shadow-[0_10px_28px_rgba(148,163,184,0.06)] md:p-6">
                  <div className="flex items-center gap-2.5">
                    <Brain className="h-5 w-5 text-violet-500" />
                    <h3 className="text-lg font-semibold text-slate-900">
                      Journey preview
                    </h3>
                  </div>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    This is the premium teacher layer students unlock after Grammar, Speak, and Logic.
                  </p>

                  <div className="mt-5 grid gap-3 md:grid-cols-2">
                    {lockedPreviewNotes.map((note) => (
                      <div
                        key={`${note.title}-${note.body}`}
                        className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                      >
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                          {note.title}
                        </p>
                        <p className="mt-2 text-base leading-7 text-slate-700">{note.body}</p>
                      </div>
                    ))}
                  </div>

                  {onUnlock ? (
                    <div className="mt-5 rounded-2xl border border-amber-100 bg-gradient-to-r from-amber-50/80 to-white p-4">
                      <div className="flex items-start gap-2">
                        <ArrowRight className="mt-0.5 h-4.5 w-4.5 shrink-0 text-amber-600" />
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-slate-900">
                            Unlock the full Mercy teacher system
                          </p>
                          <p className="mt-1 text-sm leading-6 text-slate-700">
                            Give students the full sentence journey: improve, speak, understand, remember.
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={onUnlock}
                          className="rounded-2xl border-violet-200 bg-white text-violet-700 hover:bg-violet-50"
                        >
                          {unlockButtonLabel}
                        </Button>
                      </div>
                    </div>
                  ) : null}
                </section>

                <section className="rounded-3xl border border-white/80 bg-white/90 p-5 shadow-[0_10px_28px_rgba(148,163,184,0.06)] md:p-6">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    <h3 className="text-lg font-semibold text-slate-900">
                      The Mercy learning loop
                    </h3>
                  </div>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Journey sits at the top of the loop and makes the rest of the product feel like one teacher.
                  </p>

                  <div className="mt-5 grid gap-3 md:grid-cols-4">
                    {journeySteps.map((step) => {
                      const styles =
                        step.key === 'express'
                          ? expressStyles
                          : step.key === 'improve'
                            ? improveStyles
                            : step.key === 'speak'
                              ? speakStyles
                              : understandStyles;

                      return (
                        <div
                          key={step.key}
                          className={`rounded-2xl border border-slate-200 bg-white p-4 shadow-sm border-l-4 ${styles.border}`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <p className={`text-xs font-semibold uppercase tracking-[0.14em] ${styles.label}`}>
                              {step.title}
                            </p>

                            <span
                              className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${styles.badge}`}
                            >
                              {step.done ? 'seen' : 'preview'}
                            </span>
                          </div>

                          <p className="mt-2.5 text-base leading-7 text-slate-700">{step.caption}</p>
                        </div>
                      );
                    })}
                  </div>
                </section>
              </>
            ) : (
              <>
                <section className="rounded-3xl border border-white/80 bg-gradient-to-r from-amber-50/65 via-white to-violet-50/55 p-5 shadow-[0_10px_28px_rgba(148,163,184,0.06)] md:p-6">
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="h-5 w-5 text-amber-500" />
                    <h3 className="text-lg font-semibold text-slate-900">
                      What Mercy remembers about your English
                    </h3>
                  </div>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Journey is Mercy’s memory space for this learner: strengths, focus, logic patterns, and what to practice next.
                  </p>

                  {teacherMemorySummary.length === 0 ? (
                    <div className="mt-4 rounded-2xl border border-white/90 bg-white/85 p-4">
                      <p className="text-base leading-7 text-slate-600">
                        Mercy will start remembering your patterns after you move one real sentence through Grammar, Speak, and Logic a few times.
                      </p>
                    </div>
                  ) : (
                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                      {teacherMemorySummary.map((item, index) => (
                        <div
                          key={`${item.type}-${index}-${item.label}`}
                          className="flex items-start gap-3 rounded-2xl border border-white/90 bg-white/85 p-4 shadow-sm"
                        >
                          {getMemoryIcon(item.type)}
                          <p className="text-base leading-7 text-slate-700">{item.label}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </section>

                <section className="rounded-3xl border border-white/80 bg-white/90 p-5 shadow-[0_10px_28px_rgba(148,163,184,0.06)] md:p-6">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    <h3 className="text-lg font-semibold text-slate-900">Your current learning flow</h3>
                  </div>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    One sentence should move through the full Mercy loop: express it, improve it, say it, understand it, then remember it.
                  </p>

                  <div className="mt-5 grid gap-3 md:grid-cols-4">
                    {journeySteps.map((step) => {
                      const styles =
                        step.key === 'express'
                          ? expressStyles
                          : step.key === 'improve'
                            ? improveStyles
                            : step.key === 'speak'
                              ? speakStyles
                              : understandStyles;

                      return (
                        <div
                          key={step.key}
                          className={`rounded-2xl border border-slate-200 bg-white p-4 shadow-sm border-l-4 ${styles.border}`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <p className={`text-xs font-semibold uppercase tracking-[0.14em] ${styles.label}`}>
                              {step.title}
                            </p>

                            <span
                              className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${styles.badge}`}
                            >
                              {step.done ? 'done' : 'next'}
                            </span>
                          </div>

                          <p className="mt-2.5 text-base leading-7 text-slate-700">{step.caption}</p>
                        </div>
                      );
                    })}
                  </div>
                </section>

                <section className="rounded-3xl border border-white/80 bg-gradient-to-br from-white to-slate-50/70 p-5 shadow-[0_10px_28px_rgba(148,163,184,0.06)] md:p-6">
                  <div className="flex items-center gap-2.5">
                    <Brain className="h-5 w-5 text-violet-500" />
                    <h3 className="text-lg font-semibold text-slate-900">
                      Teacher Mercy progress note
                    </h3>
                  </div>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    After each sentence cycle, Journey should keep a warm teacher note so the learner can see real progress, not just raw system output.
                  </p>

                  <div className="mt-5 grid gap-3 md:grid-cols-2">
                    {progressNotes.map((note) => (
                      <div
                        key={`${note.title}-${note.body}`}
                        className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                      >
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                          {note.title}
                        </p>
                        <p className="mt-2 text-base leading-7 text-slate-700">{note.body}</p>
                      </div>
                    ))}
                  </div>
                </section>

                {latestWriting ? (
                  <section className="rounded-3xl border border-white/80 bg-white/90 p-5 shadow-[0_10px_28px_rgba(148,163,184,0.06)] md:p-6">
                    <div className="flex items-center gap-2.5">
                      <PenSquare className="h-5 w-5 text-slate-700" />
                      <h3 className="text-lg font-semibold text-slate-900">Your current sentence</h3>
                    </div>

                    <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                        Student writing
                      </p>
                      <p className="mt-3 text-base leading-7 text-slate-700">{latestWriting}</p>
                    </div>

                    {(writingMode || focusText) && (
                      <div className="mt-4 grid gap-3 md:grid-cols-2">
                        {writingMode ? (
                          <div className="rounded-2xl border border-slate-200 bg-white p-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                              Writing mode
                            </p>
                            <p className="mt-2 text-base text-slate-700">{writingMode}</p>
                          </div>
                        ) : null}

                        {focusText ? (
                          <div className="rounded-2xl border border-slate-200 bg-white p-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                              Current focus
                            </p>
                            <p className="mt-2 text-base text-slate-700">{focusText}</p>
                          </div>
                        ) : null}
                      </div>
                    )}

                    <div className="mt-5 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4">
                      <div className="flex items-start gap-2">
                        <ArrowRight className="mt-0.5 h-4.5 w-4.5 shrink-0 text-emerald-600" />
                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            Mercy’s next step for this same sentence
                          </p>
                          <p className="mt-1 text-sm leading-6 text-slate-700">
                            Keep this exact line moving. First improve it in Grammar, then speak it aloud, then open Logic to understand the English pattern behind it.
                          </p>
                        </div>
                      </div>
                    </div>
                  </section>
                ) : (
                  <section className="rounded-3xl border border-white/80 bg-white/90 p-5 shadow-[0_10px_28px_rgba(148,163,184,0.06)] md:p-6">
                    <div className="flex items-center gap-2.5">
                      <Clock3 className="h-5 w-5 text-slate-700" />
                      <h3 className="text-lg font-semibold text-slate-900">Before you start</h3>
                    </div>

                    <p className="mt-3 text-base leading-7 text-slate-600">
                      Try one sentence about your mood, a moment from today, or a thought you keep replaying in your head.
                    </p>

                    <div className="mt-5 rounded-2xl border border-violet-100 bg-gradient-to-r from-violet-50/60 to-sky-50/50 p-5">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-violet-600">
                        Example starting ideas
                      </p>
                      <p className="mt-3 text-base leading-7 text-slate-700">
                        {PROMPTS.join(' • ')}
                      </p>
                    </div>
                  </section>
                )}

                {hasAnalysis ? (
                  <section className="rounded-3xl border border-white/80 bg-white/92 p-5 shadow-[0_12px_32px_rgba(168,85,247,0.08)] md:p-6">
                    <div className="flex items-center gap-2.5">
                      <Sparkles className="h-5 w-5 text-violet-500" />
                      <h3 className="text-lg font-semibold text-slate-900">
                        Mercy has already started helping
                      </h3>
                    </div>

                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      Journey should show the student’s real sentence and Mercy’s real help, not a disconnected demo.
                    </p>

                    <div className="mt-5 grid gap-4 md:grid-cols-2">
                      {enhancedText ? (
                        <div className="rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50/70 to-white p-5">
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-violet-600">
                            Natural English
                          </p>
                          <p className="mt-3 text-base leading-7 text-slate-700">{enhancedText}</p>
                        </div>
                      ) : null}

                      {correctedText ? (
                        <div className="rounded-2xl border border-slate-200 bg-white p-5">
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                            Corrected version
                          </p>
                          <p className="mt-3 text-base leading-7 text-slate-700">{correctedText}</p>
                        </div>
                      ) : null}
                    </div>

                    {explanationText ? (
                      <div className="mt-4 rounded-2xl border border-sky-100 bg-sky-50/55 p-5">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                          Why Mercy changed it
                        </p>
                        <p className="mt-3 text-base leading-7 text-slate-700">{explanationText}</p>
                      </div>
                    ) : null}

                    {(grammarPoints.length > 0 || tenseText) && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {grammarPoints.map((point) => (
                          <span
                            key={point}
                            className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700"
                          >
                            {point}
                          </span>
                        ))}

                        {tenseText ? (
                          <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700">
                            {tenseText} tense
                          </span>
                        ) : null}
                      </div>
                    )}

                    <div className="mt-5 rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50/80 to-white p-4">
                      <div className="flex items-start gap-2">
                        <ArrowRight className="mt-0.5 h-4.5 w-4.5 shrink-0 text-emerald-600" />
                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            Keep the same sentence moving
                          </p>
                          <p className="mt-1 text-sm leading-6 text-slate-700">
                            Improve it in Grammar. Say it in Speak. Understand it in Logic. Then let Mercy remember the pattern for the next sentence.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-3">
                      {showWritingButton ? (
                        <Button
                          type="button"
                          onClick={onOpenWriting}
                          className="h-11 rounded-2xl border-0 bg-gradient-to-r from-[#FF8A65] to-[#FF6F61] px-6 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(255,111,97,0.22)] hover:brightness-[1.03]"
                        >
                          <PenSquare className="mr-2.5 h-4.5 w-4.5" />
                          Continue in Grammar
                        </Button>
                      ) : null}

                      {showPronunciationButton ? (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={onOpenPronunciation}
                          className="h-11 rounded-2xl border-sky-200 bg-white text-sky-700 hover:bg-sky-50"
                        >
                          <Mic className="mr-2.5 h-4.5 w-4.5" />
                          Continue to Speak
                        </Button>
                      ) : null}
                    </div>
                  </section>
                ) : null}
              </>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}

export default MercyTeacherTab;