/**
 * Path: src/components/mercy-guide/MercyTeacherTab.tsx
 * File: MercyTeacherTab.tsx
 */

import React, { useMemo } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  Brain,
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

type LearningSupportMode = 'gentle' | 'guided' | 'immersion';

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
  learningSupportMode?: LearningSupportMode | string;
  isKidsMode?: boolean;
  kidsModeAgeBand?: string | null;
  teacherLabel?: string | null;
  disableTeacherWriting?: boolean;
  selectedKidsObjectKey?: string | null;
  onSelectKidsObject?: (key: string) => void;
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

type KidsObjectCard = {
  key: string;
  label: string;
  sentence: string;
  imageSrc: string;
  aliases: string[];
};

const PROMPTS = [
  'My mood today is...',
  'Something happened today that made me...',
  'I keep thinking about...',
  'Today I realized...',
  'I want to say this in English...',
];

const KIDS_OBJECT_KEYS = [
  'airplane',
  'apple',
  'bag',
  'ball',
  'banana',
  'bathtub',
  'bed',
  'bicycle',
  'bird',
  'blanket',
  'boat',
  'book',
  'bottle',
  'bus',
  'cat',
  'chair',
  'clock',
  'cloud',
  'cup',
  'dog',
  'doll',
  'door',
  'duck',
  'fish',
  'flower',
  'hat',
  'house',
  'key',
  'leaf',
  'milk',
  'moon',
  'orange',
  'pencil',
  'phone',
  'pillow',
  'plate',
  'rainbow',
  'shirt',
  'shoes',
  'soap',
  'sock',
  'spoon',
  'star',
  'sun',
  'table',
  'teddy-bear',
  'toothbrush',
  'toy-car',
  'tree',
  'window',
  'ant',
  'baby-bib',
  'backpack',
  'balloon',
  'bee',
  'bell',
  'block',
  'butterfly',
  'cake',
  'candle',
  'carrot',
  'cookie',
  'cow',
  'crayon',
  'dinosaur',
  'elephant',
  'envelope',
  'frog',
  'gift-box',
  'grapes',
  'hammer',
  'helicopter',
  'ice-cream',
  'jar',
  'kite',
  'lamp',
  'lion',
  'lollipop',
  'monkey',
  'mouse',
  'mushroom',
  'pear',
  'pig',
  'pizza',
  'rabbit',
  'rocket',
  'sandwich',
  'sheep',
  'strawberry',
  'train',
  'truck',
  'turtle',
  'watermelon',
  'whistle',
  'mitten',
  'scarf',
  'drum',
  'bear-face',
  'juice-box',
  'juice',
] as const;

const KIDS_UNCOUNTABLE_KEYS = new Set<string>([
  'milk',
  'soap',
  'juice',
  'ice-cream',
]);

const KIDS_EXTRA_ALIASES: Record<string, string[]> = {
  'teddy-bear': ['teddy bear', 'bear'],
  'toy-car': ['toy car', 'car'],
  'baby-bib': ['baby bib', 'bib'],
  backpack: ['back pack'],
  'gift-box': ['gift box', 'gift'],
  'ice-cream': ['ice cream'],
  'juice-box': ['juice box'],
  'bear-face': ['bear face', 'bear'],
};

function toKidsLabel(key: string): string {
  return key
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function startsWithVowelSound(text: string): boolean {
  return /^[aeiou]/i.test(text.trim());
}

function toKidsSentence(key: string): string {
  const lowerLabel = toKidsLabel(key).toLowerCase();

  if (KIDS_UNCOUNTABLE_KEYS.has(key)) {
    return `This is ${lowerLabel}.`;
  }

  return `This is ${startsWithVowelSound(lowerLabel) ? 'an' : 'a'} ${lowerLabel}.`;
}

function toKidsAliases(key: string): string[] {
  const normalized = key.replace(/-/g, ' ');
  const label = toKidsLabel(key).toLowerCase();
  const extra = KIDS_EXTRA_ALIASES[key] ?? [];

  return Array.from(new Set([key, normalized, label, ...extra]));
}

const KIDS_OBJECTS: KidsObjectCard[] = KIDS_OBJECT_KEYS.map((key) => ({
  key,
  label: toKidsLabel(key),
  sentence: toKidsSentence(key),
  imageSrc: `/images/mercy-kids/${key}.jpg`,
  aliases: toKidsAliases(key),
}));

const KIDS_IMAGE_GRID = KIDS_OBJECTS.map((object) => ({
  slotId: object.key,
  object,
}));

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

function normalizeLearningSupportMode(value?: string | null): LearningSupportMode {
  const normalized = cleanText(value).toLowerCase();

  if (normalized === 'guided') return 'guided';
  if (normalized === 'immersion') return 'immersion';
  return 'gentle';
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

function gentleFocusVi(focusText: string): string {
  const lower = focusText.toLowerCase();

  const parts: string[] = [];

  if (lower.includes('reason connector')) {
    parts.push('liên từ nối ý, nhất là cách nối lý do cho rõ hơn');
  }

  if (lower.includes('sentence structure')) {
    parts.push('cấu trúc câu rõ ràng và thẳng ý hơn');
  }

  if (lower.includes('past tense')) {
    parts.push('quá khứ đơn');
  }

  if (lower.includes('present simple')) {
    parts.push('hiện tại đơn');
  }

  if (lower.includes('present perfect')) {
    parts.push('hiện tại hoàn thành');
  }

  if (!parts.length) {
    parts.push('diễn đạt câu tiếng Anh tự nhiên hơn');
  }

  return `👉 Điểm đang luyện: ${parts.join(' + ')}.`;
}

function guidedFocusVi(focusText: string): string {
  const lower = focusText.toLowerCase();

  if (lower.includes('reason connector') && lower.includes('sentence structure')) {
    return 'Gợi ý ngắn: đang luyện liên từ + cấu trúc câu.';
  }
  if (lower.includes('past tense')) {
    return 'Gợi ý ngắn: chú ý quá khứ đơn.';
  }
  if (lower.includes('present simple')) {
    return 'Gợi ý ngắn: chú ý hiện tại đơn.';
  }
  if (lower.includes('present perfect')) {
    return 'Gợi ý ngắn: chú ý hiện tại hoàn thành.';
  }

  return 'Gợi ý ngắn: Mercy đang làm câu rõ và tự nhiên hơn.';
}

function supportLine(
  mode: LearningSupportMode,
  gentle: string,
  guided?: string,
) {
  if (mode === 'immersion') return '';
  if (mode === 'guided') return guided || gentle;
  return gentle;
}

function normalizeKidsLookup(text: string): string {
  return cleanText(text).toLowerCase().replace(/-/g, ' ');
}

function getKidsObjectFromSentence(sentence: string): KidsObjectCard {
  const normalized = normalizeKidsLookup(sentence);

  if (!normalized) {
    return KIDS_OBJECTS[0];
  }

  const found = KIDS_OBJECTS.find((item) =>
    item.aliases.some((alias) => normalized.includes(alias)),
  );

  return found ?? KIDS_OBJECTS[0];
}

function getKidsObjectByKey(key?: string | null): KidsObjectCard | null {
  if (!key) return null;
  return KIDS_OBJECTS.find((item) => item.key === key) ?? null;
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
  learningSupportMode = 'gentle',
  isKidsMode = false,
  disableTeacherWriting = false,
  selectedKidsObjectKey,
  onSelectKidsObject,
}: Props) {
  const mode = useMemo(
    () => normalizeLearningSupportMode(learningSupportMode),
    [learningSupportMode],
  );

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

  const coachingLead = useMemo(() => {
    if (teacherMemorySummary.length > 0) {
      const focusItem = teacherMemorySummary.find((item) => item.type === 'focus');
      const focusLabel = cleanText(focusItem?.label);
      if (focusLabel) return `Current focus: ${focusLabel}.`;
    }

    if (focusText) return `Current focus: ${focusText}.`;

    return 'Start with one real thought, not a perfect sentence.';
  }, [focusText, teacherMemorySummary]);

  const quickCoach = useMemo(() => {
    if (!latestWriting) {
      return 'A short honest sentence is enough. Mercy will guide it step by step.';
    }

    if (enhancedText) {
      return 'Mercy already has a stronger version. Keep the same sentence moving.';
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

  const showWritingButton =
    typeof onOpenWriting === 'function' && !disableTeacherWriting && !isKidsMode;
  const showPronunciationButton = typeof onOpenPronunciation === 'function';

  const focusSupport = supportLine(
    mode,
    gentleFocusVi(focusText),
    guidedFocusVi(focusText),
  );

  const nextStepSupport = supportLine(
    mode,
    hasAnalysis
      ? '👉 Bước tiếp theo: đọc câu đã được cải thiện thành tiếng, rồi mở Logic để hiểu vì sao tiếng Anh dùng cấu trúc như vậy.'
      : '👉 Bước tiếp theo: mở Grammar trước để Mercy sửa chính câu này.',
    hasAnalysis
      ? 'Gợi ý ngắn: nói câu này trước, rồi mở Logic.'
      : 'Gợi ý ngắn: mở Grammar trước.',
  );

  const selectedKidsObject = useMemo(() => {
    return getKidsObjectByKey(selectedKidsObjectKey) ?? getKidsObjectFromSentence(primarySentence);
  }, [primarySentence, selectedKidsObjectKey]);

  if (isKidsMode) {
    return (
      <div className="m-0 flex h-full min-h-0 flex-1 overflow-hidden">
        <div
          className="h-full w-full overflow-y-auto overscroll-contain px-2 pb-3 pt-2 sm:px-3 sm:pb-4 sm:pt-3"
          style={{
            WebkitOverflowScrolling: 'touch',
            touchAction: 'pan-y',
          }}
        >
          <div className="mx-auto w-full max-w-[920px]">
            <div className="grid grid-cols-5 gap-2 sm:gap-3">
              {KIDS_IMAGE_GRID.map(({ slotId, object }) => {
                const isSelected = object.key === selectedKidsObject.key;

                return (
                  <button
                    key={slotId}
                    type="button"
                    onClick={() => onSelectKidsObject?.(object.key)}
                    className={`aspect-square w-full overflow-hidden rounded-xl border bg-white transition ${
                      isSelected
                        ? 'border-[#FFB39A] shadow-[0_8px_18px_rgba(255,138,101,0.18)]'
                        : 'border-white/80 hover:border-[#FFD7C8] hover:shadow-[0_6px_14px_rgba(148,163,184,0.08)]'
                    }`}
                    aria-label={object.label}
                    title={object.label}
                  >
                    <img
                      src={object.imageSrc}
                      alt={object.label}
                      className="h-full w-full object-contain p-1.5 sm:p-2"
                      loading="lazy"
                      decoding="async"
                      draggable={false}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="m-0 flex-1 overflow-hidden">
      <ScrollArea className="h-full bg-gradient-to-br from-[#FFF7F0] via-[#F8FAFF] to-[#F0F4FF]">
        <div className="relative p-4 md:p-5">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-[radial-gradient(circle_at_top,_rgba(255,138,101,0.08),_rgba(192,132,252,0.04)_45%,_transparent_75%)]" />

          <div className="relative space-y-4">
            <section className="overflow-hidden rounded-3xl border border-white/80 bg-white/90 p-5 shadow-[0_12px_32px_rgba(255,138,101,0.08)] backdrop-blur-sm">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-rose-100/90 p-2.5">
                      {isLocked ? (
                        <Lock className="h-5 w-5 text-rose-500" />
                      ) : (
                        <MessageCircleHeart className="h-5 w-5 text-rose-500" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <h2 className="text-xl font-semibold tracking-tight text-slate-900">
                        Journey
                      </h2>
                      <p className="mt-1 text-sm leading-6 text-slate-600">
                        {isLocked
                          ? 'Unlock one place for sentence, focus, and next step.'
                          : 'One place for your current sentence, focus, and next step.'}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700">
                      {primarySentence ? '1 sentence active' : 'No sentence yet'}
                    </span>

                    <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700">
                      Focus: {focusText}
                    </span>

                    {writingMode ? (
                      <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700">
                        {writingMode}
                      </span>
                    ) : null}

                    {teacherMemorySummary.length > 0 ? (
                      <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700">
                        {teacherMemorySummary.length} memory note
                        {teacherMemorySummary.length > 1 ? 's' : ''}
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-4 flex flex-wrap gap-3">
                    {showWritingButton ? (
                      <Button
                        type="button"
                        onClick={onOpenWriting}
                        className="h-10 rounded-2xl border-0 bg-gradient-to-r from-[#FF8A65] to-[#FF6F61] px-5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(255,111,97,0.22)] hover:brightness-[1.03]"
                      >
                        <PenSquare className="mr-2.5 h-4.5 w-4.5" />
                        {latestWriting ? 'Open Grammar' : 'Start in Grammar'}
                      </Button>
                    ) : null}

                    {!isLocked && hasAnalysis && showPronunciationButton ? (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={onOpenPronunciation}
                        className="h-10 rounded-2xl border-sky-200 bg-white text-sky-700 hover:bg-sky-50"
                      >
                        <Mic className="mr-2.5 h-4.5 w-4.5" />
                        Open Speak
                      </Button>
                    ) : null}

                    {isLocked && onUnlock ? (
                      <Button
                        type="button"
                        onClick={onUnlock}
                        className="h-10 rounded-2xl border-0 bg-gradient-to-r from-violet-600 via-fuchsia-500 to-rose-500 px-5 text-sm font-semibold text-white shadow-[0_10px_26px_rgba(168,85,247,0.24)] hover:brightness-[1.03]"
                      >
                        <Crown className="mr-2.5 h-4.5 w-4.5" />
                        {unlockButtonLabel}
                      </Button>
                    ) : null}
                  </div>
                </div>

                <div className="rounded-2xl border border-amber-100/80 bg-gradient-to-r from-[#FFF8F1] via-white to-[#F8FAFF] p-4 lg:max-w-sm">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="mt-0.5 h-4.5 w-4.5 shrink-0 text-amber-500" />
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {isLocked ? 'Preview' : 'Current focus'}
                      </p>
                      <p className="mt-1 text-sm leading-6 text-slate-700">
                        {isLocked
                          ? 'Journey keeps the teacher loop together so learning does not reset on every tab.'
                          : coachingLead}
                      </p>
                      {!isLocked && focusSupport ? (
                        <p className="mt-1 text-sm leading-6 text-[#D66A4E]">
                          {focusSupport}
                        </p>
                      ) : null}
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {isLocked
                          ? 'See the sentence, the pattern, and the next move in one place.'
                          : quickCoach}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {isLocked ? (
              <section className="rounded-3xl border border-white/80 bg-white/92 p-5 shadow-[0_10px_28px_rgba(148,163,184,0.06)]">
                <div className="flex items-center gap-2.5">
                  <Crown className="h-5 w-5 text-violet-500" />
                  <h3 className="text-lg font-semibold text-slate-900">{unlockTitle}</h3>
                </div>

                <p className="mt-2 text-sm leading-6 text-slate-600">{unlockDescription}</p>

                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  {lockedPreviewNotes.slice(0, 3).map((note) => (
                    <div
                      key={`${note.title}-${note.body}`}
                      className="rounded-2xl border border-slate-200 bg-white p-4"
                    >
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                        {note.title}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-slate-700">{note.body}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 grid gap-2 md:grid-cols-4">
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
                        className={`rounded-2xl border border-slate-200 bg-white p-3 border-l-4 ${styles.border}`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <p className={`text-[11px] font-semibold uppercase tracking-[0.14em] ${styles.label}`}>
                            {step.title}
                          </p>

                          <span
                            className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] ${styles.badge}`}
                          >
                            {step.done ? 'seen' : 'preview'}
                          </span>
                        </div>

                        <p className="mt-2 text-sm leading-6 text-slate-600">{step.caption}</p>
                      </div>
                    );
                  })}
                </div>
              </section>
            ) : (
              <section className="rounded-3xl border border-white/80 bg-white/92 p-5 shadow-[0_10px_28px_rgba(148,163,184,0.06)]">
                <div className="flex items-center gap-2.5">
                  <Brain className="h-5 w-5 text-violet-500" />
                  <h3 className="text-lg font-semibold text-slate-900">Current loop</h3>
                </div>

                <div className="mt-4 grid gap-2 md:grid-cols-4">
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
                        className={`rounded-2xl border border-slate-200 bg-white p-3 border-l-4 ${styles.border}`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <p className={`text-[11px] font-semibold uppercase tracking-[0.14em] ${styles.label}`}>
                            {step.title}
                          </p>

                          <span
                            className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] ${styles.badge}`}
                          >
                            {step.done ? 'done' : 'next'}
                          </span>
                        </div>

                        <p className="mt-2 text-sm leading-6 text-slate-600">{step.caption}</p>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 grid gap-3 lg:grid-cols-3">
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
                      Focus
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-700">{focusText}</p>
                    {focusSupport ? (
                      <p className="mt-2 text-sm leading-6 text-[#D66A4E]">
                        {focusSupport}
                      </p>
                    ) : null}
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="flex items-center gap-2">
                      <ArrowRight className="h-4.5 w-4.5 text-emerald-600" />
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                        Next
                      </p>
                    </div>

                    <p className="mt-2 text-sm leading-6 text-slate-700">
                      {hasAnalysis
                        ? 'Say the improved sentence, then open Logic.'
                        : 'Open Grammar and shape the same sentence first.'}
                    </p>

                    {nextStepSupport ? (
                      <p className="mt-2 text-sm leading-6 text-[#D66A4E]">
                        {nextStepSupport}
                      </p>
                    ) : null}
                  </div>
                </div>

                {teacherMemorySummary.length > 0 ? (
                  <div className="mt-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                      What Mercy remembers
                    </p>

                    <div className="mt-3 grid gap-3 md:grid-cols-2">
                      {teacherMemorySummary.slice(0, 4).map((item, index) => (
                        <div
                          key={`${item.type}-${index}-${item.label}`}
                          className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4"
                        >
                          {getMemoryIcon(item.type)}
                          <p className="text-sm leading-6 text-slate-700">{item.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}

                {latestWriting ? (
                  primarySentence && primarySentence !== latestWriting ? (
                    <div className="mt-4 rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50/55 to-white p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-violet-600">
                        Original → current
                      </p>

                      <div className="mt-3 grid gap-3 md:grid-cols-2">
                        <div className="rounded-2xl border border-slate-200 bg-white p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                            Original
                          </p>
                          <p className="mt-2 text-sm leading-6 text-slate-700">{latestWriting}</p>
                        </div>

                        <div className="rounded-2xl border border-violet-200 bg-white p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-violet-600">
                            Current
                          </p>
                          <p className="mt-2 text-sm leading-6 text-slate-700">{primarySentence}</p>
                        </div>
                      </div>
                    </div>
                  ) : null
                ) : (
                  <div className="mt-4 rounded-2xl border border-rose-100/80 bg-gradient-to-r from-[#FFF8F1] via-white to-[#F8FAFF] p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-rose-600">
                      Start ideas
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2.5">
                      {PROMPTS.slice(0, 4).map((prompt) => (
                        <span
                          key={prompt}
                          className="rounded-full border border-rose-200/80 bg-white px-3 py-1.5 text-sm font-medium text-rose-700"
                        >
                          {prompt}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </section>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}

export default MercyTeacherTab;