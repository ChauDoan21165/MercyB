/**
 * File: MercyGuidePanel.tsx
 * Path: src/components/mercy-guide/MercyGuidePanel.tsx
 */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  X,
  User,
  ChevronDown,
  Mic,
  Brain,
  Maximize2,
  Minimize2,
  BookOpenText,
  PenSquare,
  Lock,
  Crown,
  Check,
  Sprout,
  Leaf,
  Trees,
} from 'lucide-react';

import { useUserAccess } from '@/hooks/useUserAccess';
import { MERCY_HOST_IMAGE_FALLBACK, MERCY_HOST_IMAGE_SRC } from './shared';
import MercyTeacherTab from './MercyTeacherTab';
import MercySpeakTab from './MercySpeakTab';
import { GrammarWritingTab } from './tabs/grammar-writing/GrammarWritingTab';
import EnglishLogicTab from './tabs/EnglishLogicTab';

import type {
  GrammarApiResponse,
  GrammarWritingTeacherState,
  PronunciationLaunchPayload,
  StudentMercyMemory,
  StudentMercyMemoryUpdate,
  TeacherMemorySummaryItem,
  TeacherWritingTask,
  LearningSupportMode,
} from './types';

type MercyTabType = 'teacher' | 'grammar' | 'pronunciation' | 'logic';

type TroubleWordItem = string | { word?: string | null };

type MercyGuidePanelProps = {
  isOpen: boolean;
  onClose?: () => void;
  activeTab?: string;
  setActiveTab?: (value: string) => void;

  latestTeacherWritingState?: GrammarWritingTeacherState | null;
  latestAnalysisResult?: GrammarApiResponse | null;
  activeTeacherTask?: TeacherWritingTask | null;
  pendingPronunciationPayload?: PronunciationLaunchPayload | null;

  onTeacherOpenPronunciation?: () => void;
  onTeacherOpenWriting?: () => void;
  onAnalysisResult?: (result: GrammarApiResponse | null) => void;
  onTeacherWritingStateChange?: (state: GrammarWritingTeacherState) => void;
  onPracticePronunciation?: (payload: PronunciationLaunchPayload) => void;
  onOpenEnglishLogic?: () => void;
  onMemoryUpdate?: (patch: StudentMercyMemoryUpdate) => void;

  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;

  onCloseGuide?: () => void;
  onCollapseGuide?: () => void;
  onPanelDragStart?: (event: React.PointerEvent<HTMLDivElement>) => void;
  onAvatarError?: (event: React.SyntheticEvent<HTMLImageElement>) => void;
  onUpdateInteraction?: () => void;

  roomId?: string;
  roomTitle?: string;
  contentEn?: string;
  profile?: unknown;
  troubleWords?: unknown[];
  speakPractice?: unknown;

  memory?: StudentMercyMemory | null;
  teacherMemorySummary?: TeacherMemorySummaryItem[];

  showSettings?: boolean;
  setShowSettings?: (value: boolean) => void;
  panelRect?: unknown;
  bubblePos?: unknown;
  hasEnglishContext?: boolean;
  guideTabBottomBuffer?: number;
  journeyTitle?: string;
  suggestions?: unknown[];
  yesterdaySummary?: unknown;
  todayTotalMinutes?: number;
  hasHeavyMoods?: boolean;
  showBreathingScript?: boolean;
  breathingStep?: number;
  showReframe?: boolean;
  setShowBreathingScript?: (value: boolean) => void;
  setBreathingStep?: (value: number) => void;
  setShowReframe?: (value: boolean) => void;
  onOpenGuideFromBubble?: () => void;
  onBubblePointerDown?: (event: React.PointerEvent<HTMLDivElement>) => void;
  onResizePointerDown?: unknown;
  onSetSizePreset?: unknown;
  onNavigateSuggestion?: (...args: unknown[]) => void;
  onSubmitTeacherRevision?: (...args: unknown[]) => Promise<unknown>;
  onSaveProfile?: (...args: unknown[]) => void;
};

type MercyTabConfig = {
  id: MercyTabType;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  enabled: boolean;
  teaser?: boolean;
};

type LearningSupportOption = {
  value: LearningSupportMode;
  label: string;
  shortLabel: string;
  description: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
};

const LEARNING_SUPPORT_STORAGE_KEY = 'mercy.learningSupportMode';

const LEARNING_SUPPORT_OPTIONS: LearningSupportOption[] = [
  {
    value: 'gentle',
    label: 'Gentle',
    shortLabel: '🌱 Gentle',
    description: 'English + Vietnamese support for key teaching moments.',
    icon: Sprout,
  },
  {
    value: 'guided',
    label: 'Guided',
    shortLabel: '🌿 Guided',
    description: 'Mostly English, with small bilingual hints when helpful.',
    icon: Leaf,
  },
  {
    value: 'immersion',
    label: 'Immersion',
    shortLabel: '🌳 Immersion',
    description: 'English only for learners ready to stay fully in English.',
    icon: Trees,
  },
];

function normalizeTab(value: string | undefined): MercyTabType {
  switch (value) {
    case 'teacher':
    case 'grammar':
    case 'pronunciation':
    case 'logic':
      return value;
    case 'english':
      return 'logic';
    case 'speak':
      return 'pronunciation';
    case 'suggest':
      return 'teacher';
    default:
      return 'teacher';
  }
}

function normalizeLearningSupportMode(value: unknown): LearningSupportMode {
  if (value === 'gentle' || value === 'guided' || value === 'immersion') {
    return value;
  }

  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();

    if (
      normalized === 'gentle' ||
      normalized === 'guided' ||
      normalized === 'immersion'
    ) {
      return normalized;
    }

    if (
      normalized === 'full immersion' ||
      normalized === 'full-immersion' ||
      normalized === 'english only' ||
      normalized === 'english-only'
    ) {
      return 'immersion';
    }
  }

  return 'gentle';
}

function fallbackAvatar(event: React.SyntheticEvent<HTMLImageElement>): void {
  const img = event.currentTarget;

  if (img.src === MERCY_HOST_IMAGE_FALLBACK) {
    return;
  }

  img.onerror = null;
  img.src = MERCY_HOST_IMAGE_FALLBACK;
}

function cleanText(value?: string | null): string {
  return typeof value === 'string' ? value.replace(/\s+/g, ' ').trim() : '';
}

function normalizeTroubleWords(value: unknown): TroubleWordItem[] {
  if (!Array.isArray(value)) return [];

  return value.filter((item): item is TroubleWordItem => {
    if (typeof item === 'string') return true;
    if (item && typeof item === 'object') return 'word' in item;
    return false;
  });
}

function readStoredLearningSupportMode(): LearningSupportMode {
  if (typeof window === 'undefined') return 'gentle';

  const stored = window.localStorage.getItem(LEARNING_SUPPORT_STORAGE_KEY);
  return normalizeLearningSupportMode(stored);
}

function getSupportModeStyles(mode: LearningSupportMode) {
  switch (mode) {
    case 'gentle':
      return {
        trigger:
          'border-[#FFD7C8] bg-gradient-to-r from-[#FFF4EE] to-[#FFF9F5] text-[#E76F51] shadow-[0_8px_18px_rgba(255,138,101,0.12)]',
        dot: 'bg-[#FF8A65]',
      };
    case 'guided':
      return {
        trigger:
          'border-[#CDE5FF] bg-gradient-to-r from-[#F4F9FF] to-[#FBFDFF] text-[#2563EB] shadow-[0_8px_18px_rgba(59,130,246,0.10)]',
        dot: 'bg-[#3B82F6]',
      };
    case 'immersion':
    default:
      return {
        trigger:
          'border-[#E9D5FF] bg-gradient-to-r from-[#FAF5FF] to-[#FDFBFF] text-[#7C3AED] shadow-[0_8px_18px_rgba(124,58,237,0.10)]',
        dot: 'bg-[#8B5CF6]',
      };
  }
}

function getTabAccent(tabId: MercyTabType) {
  switch (tabId) {
    case 'teacher':
      return {
        active:
          'border-[#FFB39A] bg-gradient-to-r from-[#FFF1EA] to-[#FFF8F4] text-[#E76F51] shadow-[0_10px_22px_rgba(255,138,101,0.14)]',
        icon: 'text-[#FF8A65]',
      };
    case 'grammar':
      return {
        active:
          'border-[#A7F3D0] bg-gradient-to-r from-[#ECFDF5] to-[#F7FFF9] text-[#0F9F6E] shadow-[0_10px_22px_rgba(16,185,129,0.12)]',
        icon: 'text-[#10B981]',
      };
    case 'pronunciation':
      return {
        active:
          'border-[#BFDBFE] bg-gradient-to-r from-[#EFF6FF] to-[#F7FBFF] text-[#2563EB] shadow-[0_10px_22px_rgba(59,130,246,0.12)]',
        icon: 'text-[#3B82F6]',
      };
    case 'logic':
      return {
        active:
          'border-[#DDD6FE] bg-gradient-to-r from-[#F6F3FF] to-[#FCFBFF] text-[#7C3AED] shadow-[0_10px_22px_rgba(139,92,246,0.12)]',
        icon: 'text-[#8B5CF6]',
      };
    default:
      return {
        active: 'border-slate-200 bg-white text-slate-700',
        icon: 'text-slate-500',
      };
  }
}

function LockedAccessCard({
  title,
  description,
  onUnlock,
}: {
  title: string;
  description: string;
  onUnlock?: () => void;
}) {
  return (
    <div className="rounded-3xl border border-amber-200 bg-gradient-to-br from-[#FFF8F1] via-white to-[#F8FAFF] p-6 shadow-[0_10px_28px_rgba(148,163,184,0.06)]">
      <div className="flex items-start gap-3">
        <div className="rounded-2xl bg-amber-100 p-2.5">
          <Lock className="h-5 w-5 text-amber-600" />
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>

          {onUnlock ? (
            <button
              type="button"
              onClick={onUnlock}
              className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-500 to-rose-500 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_10px_26px_rgba(168,85,247,0.24)]"
            >
              <Crown size={16} />
              Upgrade to Premium
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function LearningSupportModePicker({
  value,
  onChange,
}: {
  value: LearningSupportMode;
  onChange: (value: LearningSupportMode) => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    window.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleEscape);

    return () => {
      window.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const selected =
    LEARNING_SUPPORT_OPTIONS.find((option) => option.value === value) ??
    LEARNING_SUPPORT_OPTIONS[0];
  const SelectedIcon = selected.icon;
  const styles = getSupportModeStyles(selected.value);

  return (
    <div ref={rootRef} className="relative z-30 w-full md:w-[320px]">
      <div className="mb-1 px-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
        Learning support
      </div>

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`flex min-h-[48px] w-full items-center justify-between gap-3 rounded-2xl border px-3 py-2.5 text-left transition ${styles.trigger}`}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <div className="flex min-w-0 items-center gap-2.5">
          <SelectedIcon size={16} className="shrink-0" />
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold">{selected.shortLabel}</div>
            <div className="truncate text-xs opacity-80">{selected.description}</div>
          </div>
        </div>

        <ChevronDown size={16} className={`shrink-0 transition ${open ? 'rotate-180' : ''}`} />
      </button>

      {open ? (
        <div
          className="absolute right-0 z-[80] mt-2 w-full rounded-3xl border border-white/90 bg-white/95 p-2 shadow-[0_18px_42px_rgba(15,23,42,0.14)] backdrop-blur-md"
          role="listbox"
          aria-label="Learning support mode"
        >
          {LEARNING_SUPPORT_OPTIONS.map((option) => {
            const isActive = option.value === value;
            const Icon = option.icon;
            const optionStyles = getSupportModeStyles(option.value);

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className={`flex w-full items-start gap-3 rounded-2xl px-3 py-3 text-left transition ${
                  isActive ? 'bg-[#FAF7F2]' : 'hover:bg-[#FAF7F2]'
                }`}
                role="option"
                aria-selected={isActive}
              >
                <div className="mt-0.5 shrink-0">
                  <Icon size={16} className="text-slate-600" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-900">{option.label}</span>
                    <span className={`h-2 w-2 rounded-full ${optionStyles.dot}`} />
                  </div>
                  <div className="mt-1 text-xs leading-5 text-slate-600">{option.description}</div>
                </div>

                {isActive ? (
                  <div className="pt-0.5">
                    <Check size={16} className="text-violet-600" />
                  </div>
                ) : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

export const MercyGuidePanel: React.FC<MercyGuidePanelProps> = ({
  isOpen,
  onClose,
  activeTab: initialTab = 'teacher',
  setActiveTab,

  latestTeacherWritingState,
  latestAnalysisResult,
  activeTeacherTask,
  pendingPronunciationPayload,

  onTeacherOpenPronunciation,
  onTeacherOpenWriting,
  onAnalysisResult,
  onTeacherWritingStateChange,
  onPracticePronunciation,
  onOpenEnglishLogic,
  onMemoryUpdate,

  isFullscreen,
  onToggleFullscreen,

  onCloseGuide,
  onCollapseGuide,
  onPanelDragStart,
  onAvatarError,
  onUpdateInteraction,

  roomId,
  roomTitle,
  contentEn,
  profile,
  troubleWords,
  speakPractice,

  memory,
  teacherMemorySummary = [],

  journeyTitle,
}) => {
  const access = useUserAccess();
  const [activeTab, setLocalActiveTab] = useState<MercyTabType>(
    normalizeTab(initialTab),
  );
  const [learningSupportMode, setLearningSupportMode] = useState<LearningSupportMode>('gentle');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLearningSupportMode(readStoredLearningSupportMode());
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(LEARNING_SUPPORT_STORAGE_KEY, learningSupportMode);
  }, [learningSupportMode]);

  const learningSupportHint = useMemo(() => {
    switch (learningSupportMode) {
      case 'gentle':
        return 'Bilingual support is on for new learners.';
      case 'guided':
        return 'Mostly English, with small bilingual hints.';
      case 'immersion':
      default:
        return 'Full English mode for confident learners.';
    }
  }, [learningSupportMode]);

  const goToPricing = () => {
    window.location.assign('/pricing');
  };

  const normalizedTroubleWords = useMemo<TroubleWordItem[]>(
    () => normalizeTroubleWords(troubleWords ?? memory?.pronunciation?.troubleWords ?? []),
    [memory?.pronunciation?.troubleWords, troubleWords],
  );

  const tabs = useMemo<MercyTabConfig[]>(
    () => [
      {
        id: 'teacher',
        label: 'Journey',
        icon: Brain,
        enabled: true,
        teaser: !access.features.hasMercyJourney,
      },
      {
        id: 'grammar',
        label: 'Grammar',
        icon: PenSquare,
        enabled: access.features.hasMercyGrammar,
      },
      {
        id: 'pronunciation',
        label: 'Speak',
        icon: Mic,
        enabled: access.features.hasMercySpeak,
      },
      {
        id: 'logic',
        label: 'Logic',
        icon: BookOpenText,
        enabled: access.features.hasMercyLogic,
      },
    ],
    [access.features],
  );

  const enabledTabs = useMemo(() => tabs.filter((tab) => tab.enabled), [tabs]);

  const isTabAllowed = (tabId: MercyTabType): boolean => {
    switch (tabId) {
      case 'teacher':
        return true;
      case 'grammar':
        return access.features.hasMercyGrammar;
      case 'pronunciation':
        return access.features.hasMercySpeak;
      case 'logic':
        return access.features.hasMercyLogic;
      default:
        return false;
    }
  };

  const getFirstAllowedTab = (): MercyTabType => {
    if (isTabAllowed('teacher')) return 'teacher';
    if (access.features.hasMercyGrammar) return 'grammar';
    if (access.features.hasMercySpeak) return 'pronunciation';
    if (access.features.hasMercyLogic) return 'logic';
    return 'teacher';
  };

  useEffect(() => {
    const nextTab = normalizeTab(initialTab);
    if (isTabAllowed(nextTab)) {
      setLocalActiveTab(nextTab);
      return;
    }

    setLocalActiveTab(getFirstAllowedTab());
  }, [
    initialTab,
    access.features.hasMercyGrammar,
    access.features.hasMercyJourney,
    access.features.hasMercyLogic,
    access.features.hasMercySpeak,
  ]);

  useEffect(() => {
    if (!isTabAllowed(activeTab)) {
      const nextTab = getFirstAllowedTab();
      setLocalActiveTab(nextTab);
      setActiveTab?.(nextTab);
    }
  }, [
    activeTab,
    access.features.hasMercyGrammar,
    access.features.hasMercyJourney,
    access.features.hasMercyLogic,
    access.features.hasMercySpeak,
    setActiveTab,
  ]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [activeTab]);

  const resolvedLatestAnalysisResult =
    latestAnalysisResult ?? latestTeacherWritingState?.latestAnalysisResult ?? null;

  const resolvedTeacherTask =
    activeTeacherTask ?? latestTeacherWritingState?.teacherTask ?? null;

  const pronunciationPayload = useMemo<PronunciationLaunchPayload | null>(() => {
    if (pendingPronunciationPayload) {
      return pendingPronunciationPayload;
    }

    const sourceText = cleanText(latestTeacherWritingState?.latestSubmittedText);
    const correctedText = cleanText(resolvedLatestAnalysisResult?.correctedText);
    const enhancedText = cleanText(resolvedLatestAnalysisResult?.enhancedText);

    if (!sourceText && !correctedText && !enhancedText) {
      return null;
    }

    return {
      sourceText,
      correctedText: correctedText || enhancedText || sourceText,
      enhancedText: enhancedText || undefined,
    };
  }, [
    latestTeacherWritingState?.latestSubmittedText,
    pendingPronunciationPayload,
    resolvedLatestAnalysisResult,
  ]);

  const handleTabChange = (tabId: MercyTabType) => {
    if (!isTabAllowed(tabId)) {
      return;
    }

    setLocalActiveTab(tabId);
    onUpdateInteraction?.();
    setActiveTab?.(tabId);
  };

  const handleClose = () => {
    if (onCloseGuide) {
      onCloseGuide();
      return;
    }

    onClose?.();
  };

  const handleCollapse = () => {
    if (onCollapseGuide) {
      onCollapseGuide();
      return;
    }

    onClose?.();
  };

  const handleOpenWriting = () => {
    if (!access.features.hasMercyGrammar) {
      goToPricing();
      return;
    }

    handleTabChange('grammar');
    onTeacherOpenWriting?.();
  };

  const handleOpenPronunciation = (payload?: PronunciationLaunchPayload) => {
    if (!access.features.hasMercySpeak) {
      goToPricing();
      return;
    }

    if (payload) {
      onPracticePronunciation?.(payload);
    } else if (pronunciationPayload) {
      onPracticePronunciation?.(pronunciationPayload);
    }

    handleTabChange('pronunciation');
    onTeacherOpenPronunciation?.();
  };

  const handleOpenLogic = () => {
    if (!access.features.hasMercyLogic) {
      goToPricing();
      return;
    }

    handleTabChange('logic');
    onOpenEnglishLogic?.();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="relative flex h-full flex-col overflow-hidden border-l border-white/70 bg-gradient-to-br from-[#FFF8F1] via-[#FFFCFA] to-[#F7F5FF] shadow-2xl">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top,_rgba(255,159,122,0.14),_rgba(192,132,252,0.07)_42%,_transparent_74%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(to_top,rgba(255,255,255,0.72),transparent)]" />

      <div
        className="relative z-10 flex items-center justify-between border-b border-white/80 bg-white/78 px-4 py-3 backdrop-blur-md"
        onPointerDown={onPanelDragStart}
      >
        <div className="flex items-center gap-3">
          <div className="relative shrink-0">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#FFD7C8] via-[#FFE6DC] to-[#DCC8FF] blur-sm opacity-80" />
            <img
              src={MERCY_HOST_IMAGE_SRC}
              alt="Teacher Mercy"
              className="relative h-11 w-11 rounded-full border-2 border-white object-cover object-[50%_32%] scale-110 shadow-[0_8px_18px_rgba(148,163,184,0.18)]"
              onError={(event) => {
                fallbackAvatar(event);
                onAvatarError?.(event);
              }}
            />
            <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-400" />
          </div>

          <div className="min-w-0 pt-1">
            <p className="truncate text-base font-semibold text-slate-900">
              {journeyTitle || 'Teacher Mercy'}
            </p>
            <p className="truncate text-xs font-medium text-slate-500">
              Warm guidance across Journey, Grammar, Speak, and Logic
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            className="rounded-full border border-transparent bg-white/75 p-2 text-slate-500 transition hover:border-slate-200 hover:bg-white hover:text-slate-700"
            aria-label={isFullscreen ? 'Exit full screen' : 'Full screen'}
            onClick={onToggleFullscreen}
          >
            {isFullscreen ? <Minimize2 size={17} /> : <Maximize2 size={17} />}
          </button>

          <button
            type="button"
            className="rounded-full border border-transparent bg-white/75 p-2 text-slate-500 transition hover:border-slate-200 hover:bg-white hover:text-slate-700"
            aria-label="Profile"
          >
            <User size={17} />
          </button>

          <button
            type="button"
            onClick={handleCollapse}
            className="rounded-full border border-transparent bg-white/75 p-2 text-slate-500 transition hover:border-slate-200 hover:bg-white hover:text-slate-700"
            aria-label="Collapse Mercy panel"
          >
            <ChevronDown size={17} />
          </button>

          <button
            type="button"
            onClick={handleClose}
            className="rounded-full border border-transparent bg-white/75 p-2 text-slate-400 transition hover:border-red-100 hover:bg-red-50 hover:text-red-500"
            aria-label="Close Mercy panel"
          >
            <X size={17} />
          </button>
        </div>
      </div>

      <div className="relative z-20 border-b border-white/80 bg-white/58 px-3 py-3 backdrop-blur-sm">
        {!access.features.hasMercyJourney ? (
          <div className="mb-3 rounded-2xl border border-violet-200 bg-gradient-to-r from-violet-50 via-white to-rose-50 px-4 py-3 shadow-[0_8px_22px_rgba(168,85,247,0.08)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Unlock the full Mercy Journey
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-600">
                  Keep coaching, memory, Speak, and Logic connected in one premium teacher flow.
                </p>
              </div>

              <button
                type="button"
                onClick={goToPricing}
                className="inline-flex shrink-0 items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-500 to-rose-500 px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_26px_rgba(168,85,247,0.24)]"
              >
                <Crown size={16} />
                Upgrade
              </button>
            </div>
          </div>
        ) : null}

        <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div className="px-1">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
              Mercy teaching mode
            </p>
            <p className="mt-1 text-xs leading-5 text-slate-600">{learningSupportHint}</p>
          </div>

          <LearningSupportModePicker
            value={learningSupportMode}
            onChange={setLearningSupportMode}
          />
        </div>

        <div className="grid grid-cols-4 gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id && tab.enabled;
            const accent = getTabAccent(tab.id);

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabChange(tab.id)}
                disabled={!tab.enabled}
                className={`flex min-h-[72px] flex-col items-center justify-center gap-1.5 rounded-2xl border px-2 py-3 text-center transition-all duration-200 ${
                  isActive
                    ? accent.active
                    : tab.enabled
                      ? 'border-white/70 bg-white/72 text-slate-600 shadow-[0_6px_16px_rgba(148,163,184,0.06)] hover:border-white hover:bg-white hover:text-slate-800 hover:shadow-[0_10px_20px_rgba(148,163,184,0.10)]'
                      : 'cursor-not-allowed border-transparent bg-slate-100/80 text-slate-300 opacity-80'
                }`}
                aria-pressed={isActive}
                aria-disabled={!tab.enabled}
                title={
                  tab.enabled
                    ? tab.label
                    : `${tab.label} requires premium access`
                }
              >
                <div className="flex items-center gap-1">
                  <Icon
                    size={18}
                    className={
                      isActive
                        ? accent.icon
                        : tab.enabled
                          ? 'text-slate-400'
                          : 'text-slate-300'
                    }
                  />
                  {!tab.enabled ? <Lock size={12} className="text-slate-300" /> : null}
                  {tab.teaser ? <Crown size={12} className="text-amber-500" /> : null}
                </div>

                <span className="text-[11px] font-semibold uppercase tracking-[0.12em] leading-tight">
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div ref={scrollRef} className="relative z-10 flex-1 overflow-y-auto">
        <div className="min-h-full p-3 md:p-4">
          {enabledTabs.length === 0 ? (
            <LockedAccessCard
              title="Mercy premium features are locked"
              description="Guide can stay visible, but Journey, Grammar, Speak, and Logic unlock when billing grants premium access."
              onUnlock={goToPricing}
            />
          ) : null}

          {activeTab === 'teacher' && (
            <MercyTeacherTab
              latestTeacherWritingState={latestTeacherWritingState}
              latestAnalysisResult={resolvedLatestAnalysisResult}
              teacherMemorySummary={teacherMemorySummary}
              onOpenPronunciation={() => handleOpenPronunciation(pronunciationPayload ?? undefined)}
              onOpenWriting={handleOpenWriting}
              isLocked={!access.features.hasMercyJourney}
              onUnlock={goToPricing}
              unlockTitle="Unlock Mercy Journey"
              unlockDescription="Journey turns one real sentence into coaching, memory, progress notes, and a clear next step across Grammar, Speak, and Logic."
              unlockButtonLabel="Upgrade to Premium"
              learningSupportMode={learningSupportMode}
            />
          )}

          {activeTab === 'grammar' && access.features.hasMercyGrammar && (
            <GrammarWritingTab
              roomId={roomId}
              roomTitle={roomTitle}
              contentEn={contentEn}
              learningSupportMode={learningSupportMode}
              teacherTask={resolvedTeacherTask ?? undefined}
              onAnalysisResult={onAnalysisResult}
              onTeacherWritingStateChange={onTeacherWritingStateChange}
              onPracticePronunciation={(payload) => {
                if (!access.features.hasMercySpeak) {
                  goToPricing();
                  return;
                }

                onPracticePronunciation?.(payload);
                handleTabChange('pronunciation');
              }}
              onOpenEnglishLogic={handleOpenLogic}
              onMemoryUpdate={onMemoryUpdate}
            />
          )}

          {activeTab === 'grammar' && !access.features.hasMercyGrammar ? (
            <LockedAccessCard
              title="Grammar is part of Premium"
              description="Unlock Grammar to improve a real sentence naturally, then pass it into Speak and Logic."
              onUnlock={goToPricing}
            />
          ) : null}

          {activeTab === 'pronunciation' && access.features.hasMercySpeak && (
            <MercySpeakTab
              roomId={roomId}
              roomTitle={roomTitle}
              contentEn={contentEn}
              profile={
                profile as
                  | {
                      preferred_name?: string | null;
                      english_level?: string | null;
                    }
                  | null
                  | undefined
              }
              troubleWords={normalizedTroubleWords}
              speakPractice={speakPractice}
              launchPayload={pronunciationPayload}
              pendingPayload={pronunciationPayload}
              pendingPronunciationPayload={pronunciationPayload}
              onMemoryUpdate={onMemoryUpdate}
              onOpenEnglishLogic={handleOpenLogic}
              learningSupportMode={learningSupportMode}
            />
          )}

          {activeTab === 'pronunciation' && !access.features.hasMercySpeak ? (
            <LockedAccessCard
              title="Speak is part of Premium"
              description="Unlock Speak to practice the same improved sentence aloud and build pronunciation memory over time."
              onUnlock={goToPricing}
            />
          ) : null}

          {activeTab === 'logic' && access.features.hasMercyLogic && (
            <EnglishLogicTab
              roomTitle={roomTitle}
              contentEn={contentEn}
              learningSupportMode={learningSupportMode}
              troubleWords={normalizedTroubleWords}
              latestTeacherWritingState={latestTeacherWritingState}
              latestAnalysisResult={resolvedLatestAnalysisResult}
              pendingPronunciationPayload={pronunciationPayload}
              onOpenPronunciation={handleOpenPronunciation}
              onOpenWriting={handleOpenWriting}
              onMemoryUpdate={onMemoryUpdate}
              onVaultReplay={() => {}}
            />
          )}

          {activeTab === 'logic' && !access.features.hasMercyLogic ? (
            <LockedAccessCard
              title="Logic is part of Premium"
              description="Unlock Logic to see the English pattern behind the sentence and connect that lesson back into Mercy’s memory."
              onUnlock={goToPricing}
            />
          ) : null}
        </div>
      </div>

      <div className="relative z-10 border-t border-white/80 bg-white/72 px-4 py-3 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
            {tabs.map((tab) => {
              const Icon = tab.icon;

              return (
                <button
                  key={tab.id}
                  type="button"
                  className={`flex items-center gap-1.5 transition ${
                    tab.enabled
                      ? 'hover:text-slate-700'
                      : 'cursor-not-allowed text-slate-300'
                  }`}
                  onClick={() => handleTabChange(tab.id)}
                  disabled={!tab.enabled}
                  title={tab.enabled ? tab.label : `${tab.label} requires premium access`}
                >
                  <Icon size={12} />
                  {tab.label}
                  {!tab.enabled ? <Lock size={10} /> : null}
                </button>
              );
            })}
          </div>

          <div className="text-[11px] font-medium text-slate-400">
            Mercy Learning Flow
          </div>
        </div>
      </div>
    </div>
  );
};

export default MercyGuidePanel;