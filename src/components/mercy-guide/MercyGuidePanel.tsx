// Path: src/components/mercy-guide/MercyGuidePanel.tsx
// File: MercyGuidePanel.tsx

import { getPointsDisplay, getStreakDays, getStreakEmoji } from '@/services/pointsService';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  X,
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
type TeacherMode = 'adult' | 'kids';
type KidsPageId =
  | 'page1'
  | 'page2'
  | 'page3'
  | 'page4'
  | 'page5'
  | 'page6'
  | 'page7'
  | 'page8'
  | 'page9'
  | 'page10'
  | 'page11'
  | 'page12'
  | 'page13'
  | 'page14'
  | 'page15'
  | 'page16'
  | 'page17'
  | 'page18'
  | 'page19'
  | 'page20'
  | 'page21'
  | 'page22'
  | 'page23'
  | 'page24'
  | 'page25'
  | 'page26'
  | 'page27'
  | 'page28'
  | 'page29'
  | 'page30'
  | 'page31'
  | 'page32'
  | 'page33'
  | 'page34';

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
  onPanelDragStart?: (event: React.PointerEvent<HTMLDivElement>) => void;
  onAvatarError?: (event: React.SyntheticEvent<HTMLImageElement>) => void;
  onUpdateInteraction?: () => void;

  roomId?: string;
  roomTitle?: string;
  contentEn?: string;
  /** Pre-fill the Speak-tab practice line. See MercyGuideProps.initialPracticeLine. */
  initialPracticeLine?: string;
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

  teacherMode?: TeacherMode;
  isKidsMode?: boolean;
  kidsModeAgeBand?: string | null;
  bubbleLabel?: string | null;
  bubbleSubtitle?: string | null;
  panelTitle?: string | null;
  availableTabs?: string[];
  hideGrammarTab?: boolean;
  hideLogicTab?: boolean;
  disableTeacherWriting?: boolean;
  disableGrammarAnalysis?: boolean;
  disableEnglishLogic?: boolean;
  preferPronunciationFirst?: boolean;
  preferTapAndRepeat?: boolean;
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

type AccessFeatures = {
  hasMercyJourney: boolean;
  hasMercyGrammar: boolean;
  hasMercySpeak: boolean;
  hasMercyLogic: boolean;
};

const LEARNING_SUPPORT_STORAGE_KEY = 'mercy.learningSupportMode';
const TEACHER_MODE_STORAGE_KEY = 'mercy.teacherMode';
const KIDS_OBJECT_STORAGE_KEY = 'mercy.kids.selectedObjectKey';
const KIDS_PAGE_STORAGE_KEY = 'mercy.kids.selectedPage';

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

const DEFAULT_ACCESS_FEATURES: AccessFeatures = {
  hasMercyJourney: false,
  hasMercyGrammar: false,
  hasMercySpeak: false,
  hasMercyLogic: false,
};

const KIDS_OBJECT_KEYS = [
  'apple',
  'banana',
  'orange',
  'milk',
  'cup',
  'spoon',
  'plate',
  'bottle',
  'ball',
  'teddy-bear',
] as const;

const KIDS_EXTENDED_PAGE_PREFIXES = ['k4_', 'k5_', 'k6_', 'k7_', 'k8_', 'k9_'] as const;

const DEFAULT_KIDS_OBJECT_KEY = KIDS_OBJECT_KEYS[0];
const DEFAULT_KIDS_PAGE: KidsPageId = 'page1';

const VALID_KIDS_PAGES = new Set<KidsPageId>([
  'page1',
  'page2',
  'page3',
  'page4',
  'page5',
  'page6',
  'page7',
  'page8',
  'page9',
  'page10',
  'page11',
  'page12',
  'page13',
  'page14',
  'page15',
  'page16',
  'page17',
  'page18',
  'page19',
  'page20',
  'page21',
  'page22',
  'page23',
  'page24',
  'page25',
  'page26',
  'page27',
  'page28',
  'page29',
  'page30',
  'page31',
  'page32',
  'page33',
  'page34',
]);

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

function normalizeTeacherMode(value: unknown): TeacherMode {
  return value === 'kids' ? 'kids' : 'adult';
}

function normalizeVisibleTabs(
  availableTabs: string[] | undefined,
  isKidsMode: boolean,
): MercyTabType[] {
  const fallback: MercyTabType[] = isKidsMode
    ? ['teacher', 'pronunciation']
    : ['teacher', 'grammar', 'pronunciation', 'logic'];

  if (!Array.isArray(availableTabs) || availableTabs.length === 0) {
    return fallback;
  }

  const normalized = availableTabs
    .map((tab) => normalizeTab(tab))
    .filter((tab, index, array) => array.indexOf(tab) === index);

  return normalized.length > 0 ? normalized : fallback;
}

function isSupportedKidsObjectKey(value: string): boolean {
  if (KIDS_OBJECT_KEYS.includes(value as (typeof KIDS_OBJECT_KEYS)[number])) {
    return true;
  }

  if (KIDS_EXTENDED_PAGE_PREFIXES.some((prefix) => value.startsWith(prefix))) {
    return true;
  }

  if (value.startsWith('p2_')) {
    return true;
  }

  if (/^k\d+_\d+/.test(value)) {
    return true;
  }

  return false;
}

function normalizeKidsObjectKey(
  value?: string | null,
  fallback: string = DEFAULT_KIDS_OBJECT_KEY,
): string {
  const normalized = typeof value === 'string' ? value.trim() : '';
  if (!normalized) {
    return fallback;
  }

  if (isSupportedKidsObjectKey(normalized)) {
    return normalized;
  }

  return fallback;
}

function normalizeKidsPage(value: unknown): KidsPageId {
  if (typeof value === 'string' && VALID_KIDS_PAGES.has(value as KidsPageId)) {
    return value as KidsPageId;
  }
  return DEFAULT_KIDS_PAGE;
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

function isInteractiveHeaderTarget(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) return false;

  return Boolean(
    target.closest(
      'button,[role="listbox"],[role="option"],a,input,textarea,select,label',
    ),
  );
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

  try {
    const stored = window.localStorage.getItem(LEARNING_SUPPORT_STORAGE_KEY);
    return normalizeLearningSupportMode(stored);
  } catch {
    return 'gentle';
  }
}

function writeStoredLearningSupportMode(value: LearningSupportMode): void {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(LEARNING_SUPPORT_STORAGE_KEY, value);
  } catch {
    // ignore storage failures
  }
}

function readStoredTeacherMode(): TeacherMode | null {
  if (typeof window === 'undefined') return null;

  try {
    const stored = window.localStorage.getItem(TEACHER_MODE_STORAGE_KEY);
    if (!stored) return null;
    return normalizeTeacherMode(stored);
  } catch {
    return null;
  }
}

function writeStoredTeacherMode(value: TeacherMode): void {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(TEACHER_MODE_STORAGE_KEY, value);
  } catch {
    // ignore storage failures
  }
}

function readStoredKidsObjectKey(): string | null {
  if (typeof window === 'undefined') return null;

  try {
    const stored = window.localStorage.getItem(KIDS_OBJECT_STORAGE_KEY);
    if (!stored) return null;
    return normalizeKidsObjectKey(stored);
  } catch {
    return null;
  }
}

function writeStoredKidsObjectKey(value: string): void {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(
      KIDS_OBJECT_STORAGE_KEY,
      normalizeKidsObjectKey(value),
    );
  } catch {
    // ignore storage failures
  }
}

function readStoredKidsPage(): KidsPageId | null {
  if (typeof window === 'undefined') return null;

  try {
    const stored = window.localStorage.getItem(KIDS_PAGE_STORAGE_KEY);
    if (!stored) return null;
    const page = normalizeKidsPage(stored);
    return page;
  } catch {
    return null;
  }
}

function writeStoredKidsPage(value: KidsPageId): void {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(KIDS_PAGE_STORAGE_KEY, value);
  } catch {
    // ignore storage failures
  }
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

function getTeacherModeStyles(mode: TeacherMode) {
  if (mode === 'kids') {
    return {
      trigger:
        'border-[#CDEEE1] bg-gradient-to-r from-[#F2FFF8] to-[#FBFFFD] text-[#0F9F6E] shadow-[0_8px_18px_rgba(16,185,129,0.10)]',
      dot: 'bg-[#10B981]',
    };
  }

  return {
    trigger:
      'border-[#FFE1D5] bg-gradient-to-r from-[#FFF6F1] to-[#FFFDFC] text-[#C45A3C] shadow-[0_8px_18px_rgba(255,138,101,0.10)]',
    dot: 'bg-[#FF8A65]',
  };
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
    <div className="rounded-2xl md:rounded-3xl border border-amber-200 bg-gradient-to-br from-[#FFF8F1] via-white to-[#F8FAFF] p-4 md:p-6 shadow-[0_10px_28px_rgba(148,163,184,0.06)]">
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
  compact?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const COLORS: Record<LearningSupportMode, { active: string; dot: string; bar: string }> = {
    gentle:    { active: 'bg-[#FFF3ED] border-[#FFB39A] text-[#C05830]', dot: 'bg-[#FF8A65]', bar: 'bg-[#FF8A65]' },
    guided:    { active: 'bg-[#EDF7F0] border-[#7CC9A0] text-[#1E7A4A]', dot: 'bg-[#43C59E]', bar: 'bg-[#43C59E]' },
    immersion: { active: 'bg-[#EEF4FF] border-[#93B4F5] text-[#2A56C6]', dot: 'bg-[#5B8DEF]', bar: 'bg-[#5B8DEF]' },
  };

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    function handleEscape(e: KeyboardEvent) { if (e.key === 'Escape') setOpen(false); }
    window.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleEscape);
    return () => { window.removeEventListener('mousedown', handleClickOutside); window.removeEventListener('keydown', handleEscape); };
  }, []);

  const activeIdx = LEARNING_SUPPORT_OPTIONS.findIndex(o => o.value === value);

  return (
    <div ref={rootRef} className="relative shrink-0">
      {/* Emoji bar — 3 dots, compact */}
      <div className="flex h-9 items-stretch overflow-hidden rounded-full border border-slate-200 bg-white shadow-sm">
        {LEARNING_SUPPORT_OPTIONS.map((opt, idx) => {
          const isActive = opt.value === value;
          const c = COLORS[opt.value];
          return (
            <button key={opt.value} type="button"
              onClick={() => { onChange(opt.value); setOpen(true); }}
              className={[
                'relative flex w-9 items-center justify-center transition-all',
                isActive ? `${c.active} border` : 'text-slate-400 hover:bg-slate-50',
                idx === 0 ? 'rounded-l-full' : idx === 2 ? 'rounded-r-full' : 'border-x border-slate-100',
              ].join(' ')} aria-pressed={isActive} title={opt.label}>
              <span className="text-[15px] leading-none">{opt.shortLabel.split(' ')[0]}</span>
              {isActive && <span className={`absolute bottom-0.5 left-1/2 h-0.5 w-3 -translate-x-1/2 rounded-full ${c.dot}`} />}
            </button>
          );
        })}
        {/* Info button */}
        <button type="button" onClick={() => setOpen(v => !v)}
          className="flex w-7 items-center justify-center rounded-r-full border-l border-slate-100 text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-all text-[11px] font-bold">
          ?
        </button>
      </div>

      {/* Progress bar */}
      <div className="mt-0.5 h-0.5 overflow-hidden rounded-full bg-slate-100">
        <div className={`h-full rounded-full transition-all duration-300 ${COLORS[value].bar}`}
          style={{ width: `${((activeIdx + 1) / 3) * 100}%` }} />
      </div>

      {/* Dropdown explanation panel */}
      {open && (
        <div className="absolute right-0 top-11 z-[90] w-[min(260px,calc(100vw-24px))] rounded-2xl border border-slate-100 bg-white p-2 shadow-xl">
          {LEARNING_SUPPORT_OPTIONS.map((opt) => {
            const isActive = opt.value === value;
            const c = COLORS[opt.value];
            return (
              <button key={opt.value} type="button"
                onClick={() => { onChange(opt.value); setOpen(false); }}
                className={['flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition',
                  isActive ? 'bg-slate-50' : 'hover:bg-slate-50'].join(' ')}>
                <span className="mt-0.5 text-lg leading-none">{opt.shortLabel.split(' ')[0]}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-semibold text-slate-900">{opt.label}</span>
                    <span className={`h-2 w-2 rounded-full ${c.dot}`} />
                    {isActive && <span className="ml-auto text-xs font-bold text-slate-400">✓</span>}
                  </div>
                  <p className="mt-0.5 text-xs leading-5 text-slate-500">{opt.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function TeacherModePicker({
  value,
  onChange,
  compact = false,
}: {
  value: TeacherMode;
  onChange: (value: TeacherMode) => void;
  compact?: boolean;
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

  const styles = getTeacherModeStyles(value);
  const subtitle =
    value === 'kids'
      ? 'Simple listening and repeating'
      : 'Full teacher flow';
  const menuPlacementClass = compact ? 'left-0 w-[220px]' : 'right-0 w-full';

  return (
    <div
      ref={rootRef}
      className={`relative z-40 ${
        compact
          ? 'shrink-0 w-fit'
          : 'w-full md:w-[260px]'
      }`}
    >
      {!compact ? (
        <div className="mb-1 px-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
          Teacher mode
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`flex w-full items-center justify-between gap-1.5 border text-left transition ${
          compact
            ? `min-h-[40px] rounded-2xl px-2.5 py-2 ${styles.trigger}`
            : `min-h-[48px] rounded-2xl px-3 py-2.5 ${styles.trigger}`
        }`}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <div className="flex min-w-0 items-center gap-1.5">
          <span className={`h-2.5 w-2.5 rounded-full ${styles.dot}`} />
          <div className="min-w-0">
            <div className={compact ? 'truncate text-[13px] font-semibold' : 'truncate text-sm font-semibold'}>
              {compact
                ? value === 'kids'
                  ? 'Kids'
                  : 'Adult'
                : value === 'kids'
                  ? 'Kids mode'
                  : 'Adult mode'}
            </div>
            {!compact ? (
              <div className="truncate text-xs opacity-80">{subtitle}</div>
            ) : null}
          </div>
        </div>

        <ChevronDown
          size={compact ? 14 : 16}
          className={`shrink-0 transition ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open ? (
        <div
          className={`absolute z-[90] mt-2 max-w-[calc(100vw-24px)] rounded-2xl md:rounded-3xl border border-white/90 bg-white/95 p-2 shadow-[0_18px_42px_rgba(15,23,42,0.14)] backdrop-blur-md ${menuPlacementClass}`}
          role="listbox"
          aria-label="Teacher mode"
        >
          {(['adult', 'kids'] as TeacherMode[]).map((option) => {
            const isActive = option === value;
            const optionStyles = getTeacherModeStyles(option);

            return (
              <button
                key={option}
                type="button"
                onClick={() => {
                  onChange(option);
                  setOpen(false);
                }}
                className={`flex w-full items-start gap-3 rounded-2xl px-3 py-3 text-left transition ${
                  isActive ? 'bg-[#FAF7F2]' : 'hover:bg-[#FAF7F2]'
                }`}
                role="option"
                aria-selected={isActive}
              >
                <div className="mt-1 shrink-0">
                  <span className={`block h-2.5 w-2.5 rounded-full ${optionStyles.dot}`} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-900">
                      {option === 'kids' ? 'Kids mode' : 'Adult mode'}
                    </span>
                  </div>
                  <div className="mt-1 text-xs leading-5 text-slate-600">
                    {option === 'kids'
                      ? 'Use Mercy from the homepage for little kids too.'
                      : 'Journey, Grammar, Speak, and Logic stay fully available.'}
                  </div>
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
  onPanelDragStart,
  onAvatarError,
  onUpdateInteraction,

  roomId,
  roomTitle,
  contentEn,
  initialPracticeLine,
  profile,
  troubleWords,
  speakPractice,

  memory,
  teacherMemorySummary = [],

  journeyTitle,
  teacherMode = 'adult',
  isKidsMode = false,
  kidsModeAgeBand,
  bubbleLabel,
  bubbleSubtitle,
  panelTitle,
  availableTabs,
  hideGrammarTab = false,
  hideLogicTab = false,
  disableTeacherWriting = false,
  disableGrammarAnalysis = false,
  disableEnglishLogic = false,
  preferPronunciationFirst = false,
  preferTapAndRepeat = false,
}) => {
  void bubbleSubtitle;

  const access = useUserAccess();
  const accessFeatures = access?.features ?? DEFAULT_ACCESS_FEATURES;

  const derivedTeacherMode: TeacherMode =
    isKidsMode || teacherMode === 'kids' ? 'kids' : 'adult';

  const [manualTeacherMode, setManualTeacherMode] = useState<TeacherMode>(
    readStoredTeacherMode() ?? derivedTeacherMode,
  );
  const effectiveTeacherMode: TeacherMode = manualTeacherMode;
  const kidsModeActive = effectiveTeacherMode === 'kids';

  const visibleTabs = useMemo(
    () => normalizeVisibleTabs(availableTabs, kidsModeActive),
    [availableTabs, kidsModeActive],
  );

  const [activeTab, setLocalActiveTab] = useState<MercyTabType>(
    normalizeTab(initialTab),
  );
  const [showGreeting, setShowGreeting] = useState(true);
  const [learningSupportMode, setLearningSupportMode] =
    useState<LearningSupportMode>('gentle');
  const [selectedKidsObjectKey, setSelectedKidsObjectKey] = useState<string>(
    () => readStoredKidsObjectKey() ?? DEFAULT_KIDS_OBJECT_KEY,
  );
  const [selectedKidsPage, setSelectedKidsPage] = useState<KidsPageId>(
    () => readStoredKidsPage() ?? DEFAULT_KIDS_PAGE,
  );

  const scrollRef = useRef<HTMLDivElement>(null);

  const safelyUpdateInteraction = useCallback(() => {
    try {
      onUpdateInteraction?.();
    } catch {
      // keep panel stable if optional interaction hook throws
    }
  }, [onUpdateInteraction]);

  useEffect(() => {
    setLearningSupportMode(readStoredLearningSupportMode());
  }, []);

  useEffect(() => {
    const storedMode = readStoredTeacherMode();
    if (!storedMode) {
      setManualTeacherMode(derivedTeacherMode);
    }
  }, [derivedTeacherMode]);

  useEffect(() => {
    if (kidsModeActive) {
      setLearningSupportMode('gentle');
      setSelectedKidsObjectKey((current) => normalizeKidsObjectKey(current));
      setSelectedKidsPage((current) => normalizeKidsPage(current));
    }
  }, [kidsModeActive]);

  useEffect(() => {
    writeStoredLearningSupportMode(learningSupportMode);
  }, [learningSupportMode]);

  useEffect(() => {
    writeStoredTeacherMode(manualTeacherMode);
  }, [manualTeacherMode]);

  useEffect(() => {
    if (kidsModeActive) {
      writeStoredKidsObjectKey(selectedKidsObjectKey);
    }
  }, [kidsModeActive, selectedKidsObjectKey]);

  useEffect(() => {
    if (kidsModeActive) {
      writeStoredKidsPage(selectedKidsPage);
    }
  }, [kidsModeActive, selectedKidsPage]);

  const goToPricing = useCallback(() => {
    if (typeof window === 'undefined') return;
    window.location.assign('/pricing');
  }, []);

  const normalizedTroubleWords = useMemo<TroubleWordItem[]>(
    () =>
      normalizeTroubleWords(
        troubleWords ?? memory?.pronunciation?.troubleWords ?? [],
      ),
    [memory?.pronunciation?.troubleWords, troubleWords],
  );

  const handleSelectKidsObject = useCallback((nextKey: string) => {
    setSelectedKidsObjectKey(normalizeKidsObjectKey(nextKey, nextKey));
  }, []);

  const handleSelectKidsPage = useCallback((page: KidsPageId) => {
    setSelectedKidsPage(page);
    setSelectedKidsObjectKey('');
  }, []);

  const tabs = useMemo<MercyTabConfig[]>(() => {
    const baseTabs: MercyTabConfig[] = [
      {
        id: 'teacher',
        label: kidsModeActive ? 'Images' : 'Journey',
        icon: Brain,
        enabled: true,
        teaser: !kidsModeActive && !accessFeatures.hasMercyJourney,
      },
      {
        id: 'grammar',
        label: kidsModeActive ? 'Write' : 'Grammar',
        icon: PenSquare,
        enabled:
          accessFeatures.hasMercyGrammar &&
          !hideGrammarTab &&
          !kidsModeActive,
      },
      {
        id: 'pronunciation',
        label: kidsModeActive ? 'Say' : 'Speak',
        icon: Mic,
        enabled: accessFeatures.hasMercySpeak,
      },
      {
        id: 'logic',
        label: 'Logic',
        icon: BookOpenText,
        enabled:
          accessFeatures.hasMercyLogic && !hideLogicTab && !kidsModeActive,
      },
    ];

    return baseTabs.filter((tab) => visibleTabs.includes(tab.id));
  }, [
    accessFeatures,
    hideGrammarTab,
    hideLogicTab,
    kidsModeActive,
    visibleTabs,
  ]);

  const enabledTabs = useMemo(() => tabs.filter((tab) => tab.enabled), [tabs]);

  const isTabAllowed = useCallback(
    (tabId: MercyTabType): boolean => {
      if (!visibleTabs.includes(tabId)) {
        return false;
      }

      switch (tabId) {
        case 'teacher':
          return true;
        case 'grammar':
          return (
            accessFeatures.hasMercyGrammar &&
            !hideGrammarTab &&
            !kidsModeActive
          );
        case 'pronunciation':
          return accessFeatures.hasMercySpeak;
        case 'logic':
          return (
            accessFeatures.hasMercyLogic &&
            !hideLogicTab &&
            !kidsModeActive
          );
        default:
          return false;
      }
    },
    [accessFeatures, hideGrammarTab, hideLogicTab, kidsModeActive, visibleTabs],
  );

  const getFirstAllowedTab = useCallback((): MercyTabType => {
    const orderedCandidates: MercyTabType[] = kidsModeActive
      ? ['teacher', 'pronunciation']
      : preferPronunciationFirst
        ? ['pronunciation', 'teacher', 'grammar', 'logic']
        : ['teacher', 'grammar', 'pronunciation', 'logic'];

    for (const tab of orderedCandidates) {
      if (isTabAllowed(tab)) {
        return tab;
      }
    }

    return 'teacher';
  }, [isTabAllowed, kidsModeActive, preferPronunciationFirst]);

  useEffect(() => {
    const nextTab = normalizeTab(initialTab);
    if (isTabAllowed(nextTab)) {
      setLocalActiveTab(nextTab);
      return;
    }

    setLocalActiveTab(getFirstAllowedTab());
  }, [getFirstAllowedTab, initialTab, isTabAllowed]);

  useEffect(() => {
    if (!isTabAllowed(activeTab)) {
      const nextTab = getFirstAllowedTab();
      setLocalActiveTab(nextTab);
      setActiveTab?.(nextTab);
    }
  }, [activeTab, getFirstAllowedTab, isTabAllowed, setActiveTab]);

  useEffect(() => {
    if (kidsModeActive) {
      const current = normalizeTab(initialTab);
      if (current === 'grammar' || current === 'logic') {
        const nextTab = getFirstAllowedTab();
        setLocalActiveTab(nextTab);
        setActiveTab?.(nextTab);
      }
    }
  }, [getFirstAllowedTab, initialTab, kidsModeActive, setActiveTab]);

  useEffect(() => {
    if (scrollRef.current) {
      try {
        scrollRef.current.scrollTop = 0;
      } catch {
        // ignore rare scroll container issues
      }
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
      correctedText: correctedText || undefined,
      enhancedText: enhancedText || undefined,
    };
  }, [
    latestTeacherWritingState?.latestSubmittedText,
    pendingPronunciationPayload,
    resolvedLatestAnalysisResult,
  ]);

  const handleTabChange = useCallback(
    (tabId: MercyTabType) => {
      if (!isTabAllowed(tabId)) {
        return;
      }

      setLocalActiveTab(tabId);
      safelyUpdateInteraction();
      setActiveTab?.(tabId);
    },
    [isTabAllowed, safelyUpdateInteraction, setActiveTab],
  );

  const handleTeacherModeChange = useCallback(
    (nextMode: TeacherMode) => {
      setManualTeacherMode(nextMode);

      if (nextMode === 'kids') {
        setLearningSupportMode('gentle');
        setLocalActiveTab('teacher');
        setActiveTab?.('teacher');
        return;
      }

      const nextTab = getFirstAllowedTab();
      setLocalActiveTab(nextTab);
      setActiveTab?.(nextTab);
    },
    [getFirstAllowedTab, setActiveTab],
  );

  const handleClose = useCallback(() => {
    if (onCloseGuide) {
      onCloseGuide();
      return;
    }

    onClose?.();
  }, [onClose, onCloseGuide]);

  const handleOpenWriting = useCallback(() => {
    if (disableTeacherWriting || hideGrammarTab || kidsModeActive) {
      if (isTabAllowed('pronunciation')) {
        handleTabChange('pronunciation');
      } else {
        handleTabChange(getFirstAllowedTab());
      }
      return;
    }

    if (!accessFeatures.hasMercyGrammar) {
      goToPricing();
      return;
    }

    handleTabChange('grammar');
    onTeacherOpenWriting?.();
  }, [
    accessFeatures.hasMercyGrammar,
    disableTeacherWriting,
    getFirstAllowedTab,
    goToPricing,
    handleTabChange,
    hideGrammarTab,
    isTabAllowed,
    kidsModeActive,
    onTeacherOpenWriting,
  ]);

  const handleOpenPronunciation = useCallback(
    (payload?: PronunciationLaunchPayload) => {
      if (!accessFeatures.hasMercySpeak) {
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
    },
    [
      accessFeatures.hasMercySpeak,
      goToPricing,
      handleTabChange,
      onPracticePronunciation,
      onTeacherOpenPronunciation,
      pronunciationPayload,
    ],
  );

  const handleOpenLogic = useCallback(() => {
    if (disableEnglishLogic || hideLogicTab || kidsModeActive) {
      if (isTabAllowed('pronunciation')) {
        handleTabChange('pronunciation');
      } else {
        handleTabChange(getFirstAllowedTab());
      }
      return;
    }

    if (!accessFeatures.hasMercyLogic) {
      goToPricing();
      return;
    }

    handleTabChange('logic');
    onOpenEnglishLogic?.();
  }, [
    accessFeatures.hasMercyLogic,
    disableEnglishLogic,
    getFirstAllowedTab,
    goToPricing,
    handleTabChange,
    hideLogicTab,
    isTabAllowed,
    kidsModeActive,
    onOpenEnglishLogic,
  ]);

  const headerTitle =
    cleanText(journeyTitle) ||
    cleanText(panelTitle) ||
    cleanText(bubbleLabel) ||
    'Teacher Mercy';

  const shouldDisablePanelScroll =
    kidsModeActive && (activeTab === 'teacher' || activeTab === 'pronunciation');

  if (!isOpen) {
    return null;
  }

  return (
    <div className="relative flex h-full min-h-0 flex-col overflow-hidden border-l border-white/70 bg-gradient-to-br from-[#FFF8F1] via-[#FFFCFA] to-[#F7F5FF] shadow-2xl">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top,_rgba(255,159,122,0.14),_rgba(192,132,252,0.07)_42%,_transparent_74%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(to_top,rgba(255,255,255,0.72),transparent)]" />

      <div
        className="relative z-30 flex items-center gap-2 border-b border-white/80 bg-white/78 px-2.5 py-2.5 backdrop-blur-md"
        onPointerDown={(event) => {
          if (isInteractiveHeaderTarget(event.target)) return;
          onPanelDragStart?.(event);
        }}
      >
        <div className="relative shrink-0">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#FFD7C8] via-[#FFE6DC] to-[#DCC8FF] blur-sm opacity-80" />
          <img
            src={MERCY_HOST_IMAGE_SRC}
            alt={headerTitle}
            className="relative h-10 w-10 rounded-full border-2 border-white object-cover object-[50%_32%] scale-110 shadow-[0_8px_18px_rgba(148,163,184,0.18)]"
            onError={(event) => {
              fallbackAvatar(event);
              onAvatarError?.(event);
            }}
          />
          <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-400" />
        </div>

        <div className="ml-auto flex min-w-0 flex-1 items-center justify-end gap-1.5">
          <TeacherModePicker
            value={effectiveTeacherMode}
            onChange={handleTeacherModeChange}
            compact
          />

          {!kidsModeActive ? (
            <LearningSupportModePicker
              value={learningSupportMode}
              onChange={setLearningSupportMode}
              compact
            />
          ) : null}

          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              className="rounded-full p-2 text-slate-400 outline-none transition hover:bg-white/70 hover:text-slate-600 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
              aria-label={isFullscreen ? 'Exit full screen' : 'Full screen'}
              onClick={onToggleFullscreen}
            >
              {isFullscreen ? <Minimize2 size={17} /> : <Maximize2 size={17} />}
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
      </div>

      {/* Greeting banner removed — total points display moved to bottom of panel. */}

      <div className="relative z-20 border-b border-white/80 bg-white/58 px-3 py-2 backdrop-blur-sm">
        {!accessFeatures.hasMercyJourney && !kidsModeActive ? (
          <div className="mb-2 rounded-2xl border border-violet-200 bg-gradient-to-r from-violet-50 via-white to-rose-50 px-4 py-3 shadow-[0_8px_22px_rgba(168,85,247,0.08)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Unlock the full Mercy Journey
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-600">
                  Keep coaching, memory, Speak, and Logic connected in one
                  premium teacher flow.
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

        <div
          className={`grid gap-1.5 ${
            tabs.length <= 2
              ? 'grid-cols-2'
              : tabs.length === 3
                ? 'grid-cols-3'
                : 'grid-cols-4'
          }`}
        >
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
                className={`flex min-h-[48px] flex-col items-center justify-center gap-1 rounded-xl border px-2 py-2 text-center transition-all duration-200 ${
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
                    size={16}
                    className={
                      isActive
                        ? accent.icon
                        : tab.enabled
                          ? 'text-slate-400'
                          : 'text-slate-300'
                    }
                  />
                  {!tab.enabled ? (
                    <Lock size={11} className="text-slate-300" />
                  ) : null}
                  {tab.teaser ? (
                    <Crown size={11} className="text-amber-500" />
                  ) : null}
                </div>

                <span className="text-[10px] font-semibold uppercase tracking-[0.12em] leading-tight sm:text-[11px]">
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div
        ref={scrollRef}
        className={`relative z-10 min-h-0 flex-1 ${
          shouldDisablePanelScroll ? 'overflow-hidden' : 'overflow-y-auto'
        }`}
      >
        <div
          className={`${shouldDisablePanelScroll ? 'h-full' : 'min-h-full'} p-3 md:p-4`}
        >
          {enabledTabs.length === 0 ? (
            <LockedAccessCard
              title="Mercy premium features are locked"
              description="Guide can stay visible, but Journey, Grammar, Speak, and Logic unlock when billing grants premium access."
              onUnlock={goToPricing}
            />
          ) : null}

          {activeTab === 'teacher' ? (
            <MercyTeacherTab
              latestTeacherWritingState={latestTeacherWritingState}
              latestAnalysisResult={resolvedLatestAnalysisResult}
              teacherMemorySummary={teacherMemorySummary}
              onOpenPronunciation={() =>
                handleOpenPronunciation(pronunciationPayload ?? undefined)
              }
              onOpenWriting={handleOpenWriting}
              isLocked={!accessFeatures.hasMercyJourney && !kidsModeActive}
              onUnlock={kidsModeActive ? undefined : goToPricing}
              unlockTitle={
                kidsModeActive ? 'Mercy kids mode' : 'Unlock Mercy Journey'
              }
              unlockDescription={
                kidsModeActive
                  ? 'Mercy keeps kids mode simple, warm, and listening-first.'
                  : 'Journey turns one real sentence into coaching, memory, progress notes, and a clear next step across Grammar, Speak, and Logic.'
              }
              unlockButtonLabel="Upgrade to Premium"
              learningSupportMode={learningSupportMode}
              isKidsMode={kidsModeActive}
              kidsModeAgeBand={kidsModeAgeBand}
              teacherLabel={
                cleanText(panelTitle) ||
                cleanText(bubbleLabel) ||
                'Teacher Mercy'
              }
              disableTeacherWriting={disableTeacherWriting}
              selectedKidsObjectKey={selectedKidsObjectKey}
              onSelectKidsObject={handleSelectKidsObject}
              selectedKidsPage={selectedKidsPage}
              onSelectKidsPage={handleSelectKidsPage}
            />
          ) : null}

          <div style={{ display: activeTab === 'grammar' && accessFeatures.hasMercyGrammar && !hideGrammarTab && !disableGrammarAnalysis && !kidsModeActive ? 'contents' : 'none' }}>
            <GrammarWritingTab
              roomId={roomId}
              roomTitle={roomTitle}
              contentEn={contentEn}
              englishLevel={
                (profile as { english_level?: string | null } | null | undefined)
                  ?.english_level ?? null
              }
              learningSupportMode={learningSupportMode}
              teacherTask={resolvedTeacherTask ?? undefined}
              onAnalysisResult={onAnalysisResult}
              onTeacherWritingStateChange={onTeacherWritingStateChange}
              onPracticePronunciation={(payload) => {
                if (!accessFeatures.hasMercySpeak) {
                  goToPricing();
                  return;
                }

                onPracticePronunciation?.(payload);
                handleTabChange('pronunciation');
              }}
              onOpenEnglishLogic={handleOpenLogic}
              onMemoryUpdate={onMemoryUpdate}
            />
          </div>

          {activeTab === 'grammar' &&
          (!accessFeatures.hasMercyGrammar ||
            hideGrammarTab ||
            disableGrammarAnalysis ||
            kidsModeActive) ? (
            <LockedAccessCard
              title={
                kidsModeActive
                  ? 'Writing is off in kids mode'
                  : 'Grammar is part of Premium'
              }
              description={
                kidsModeActive
                  ? 'Kids mode stays simple. Use Speak for listen-and-repeat practice.'
                  : 'Unlock Grammar to improve a real sentence naturally, then pass it into Speak and Logic.'
              }
              onUnlock={kidsModeActive ? undefined : goToPricing}
            />
          ) : null}

          {activeTab === 'pronunciation' && accessFeatures.hasMercySpeak ? (
            <MercySpeakTab
              roomId={roomId}
              roomTitle={roomTitle}
              contentEn={contentEn}
              initialPracticeLine={initialPracticeLine}
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
              onOpenEnglishLogic={
                disableEnglishLogic || hideLogicTab || kidsModeActive
                  ? undefined
                  : handleOpenLogic
              }
              learningSupportMode={
                kidsModeActive ? 'gentle' : learningSupportMode
              }
              isKidsMode={kidsModeActive}
              kidsModeAgeBand={kidsModeAgeBand}
              preferTapAndRepeat={kidsModeActive || preferTapAndRepeat}
              teacherLabel={
                cleanText(panelTitle) ||
                cleanText(bubbleLabel) ||
                'Teacher Mercy'
              }
              selectedKidsObjectKey={selectedKidsObjectKey}
            />
          ) : null}

          {activeTab === 'pronunciation' && !accessFeatures.hasMercySpeak ? (
            <LockedAccessCard
              title="Speak is part of Premium"
              description="Unlock Speak to practice the same improved sentence aloud and build pronunciation memory over time."
              onUnlock={goToPricing}
            />
          ) : null}

          <div style={{ display: activeTab === 'logic' && accessFeatures.hasMercyLogic && !hideLogicTab && !disableEnglishLogic && !kidsModeActive ? 'contents' : 'none' }}>
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
              isKidsMode={kidsModeActive}
              kidsModeAgeBand={kidsModeAgeBand}
              teacherLabel={
                cleanText(panelTitle) ||
                cleanText(bubbleLabel) ||
                'Teacher Mercy'
              }
            />
          </div>

          {activeTab === 'logic' &&
          (!accessFeatures.hasMercyLogic ||
            hideLogicTab ||
            disableEnglishLogic ||
            kidsModeActive) ? (
            <LockedAccessCard
              title={
                kidsModeActive
                  ? 'Logic is off in kids mode'
                  : 'Logic is part of Premium'
              }
              description={
                kidsModeActive
                  ? 'Kids mode keeps Mercy focused on listening and speaking.'
                  : 'Unlock Logic to see the English pattern behind the sentence and connect that lesson back into Mercy\'s memory.'
              }
              onUnlock={kidsModeActive ? undefined : goToPricing}
            />
          ) : null}
        </div>
      </div>

      <div className="relative z-10 hidden border-t border-white/80 bg-white/72 px-4 py-3 backdrop-blur-sm md:block">
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
                  title={
                    tab.enabled
                      ? tab.label
                      : `${tab.label} requires premium access`
                  }
                >
                  <Icon size={12} />
                  {tab.label}
                  {!tab.enabled ? <Lock size={10} /> : null}
                </button>
              );
            })}
          </div>

          <div className="text-[11px] font-medium text-slate-400">
            {getPointsDisplay()}
          </div>
        </div>
      </div>

      {/* Mobile-visible points footer — single plain number, no label. */}
      <div className="relative z-10 flex justify-center border-t border-white/80 bg-white/72 px-4 py-1.5 text-[11px] font-medium text-slate-400 backdrop-blur-sm md:hidden">
        {getPointsDisplay()}
      </div>
    </div>
  );
};

export default MercyGuidePanel;
