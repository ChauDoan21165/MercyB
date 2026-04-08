/**
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
};

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

function getTabAccent(tabId: MercyTabType) {
  switch (tabId) {
    case 'teacher':
      return {
        active:
          'border-[#FFB39A] bg-gradient-to-r from-[#FFF1EA] to-[#FFF8F4] text-[#E76F51] shadow-[0_8px_18px_rgba(255,138,101,0.10)]',
        icon: 'text-[#FF8A65]',
      };
    case 'grammar':
      return {
        active:
          'border-[#A7F3D0] bg-gradient-to-r from-[#ECFDF5] to-[#F7FFF9] text-[#0F9F6E] shadow-[0_8px_18px_rgba(16,185,129,0.10)]',
        icon: 'text-[#10B981]',
      };
    case 'pronunciation':
      return {
        active:
          'border-[#BFDBFE] bg-gradient-to-r from-[#EFF6FF] to-[#F7FBFF] text-[#2563EB] shadow-[0_8px_18px_rgba(59,130,246,0.10)]',
        icon: 'text-[#3B82F6]',
      };
    case 'logic':
      return {
        active:
          'border-[#E9D5FF] bg-gradient-to-r from-[#FAF5FF] to-[#FFF9FF] text-[#9333EA] shadow-[0_8px_18px_rgba(168,85,247,0.10)]',
        icon: 'text-[#A855F7]',
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
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-3xl border border-amber-200 bg-gradient-to-br from-[#FFF8F1] via-white to-[#F8FAFF] p-6 shadow-[0_10px_28px_rgba(148,163,184,0.06)]">
      <div className="flex items-start gap-3">
        <div className="rounded-2xl bg-amber-100 p-2.5">
          <Lock className="h-5 w-5 text-amber-600" />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
        </div>
      </div>
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
  const scrollRef = useRef<HTMLDivElement>(null);

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
        enabled: access.features.hasMercyJourney,
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
        return access.features.hasMercyJourney;
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
    if (access.features.hasMercyJourney) return 'teacher';
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
      return;
    }

    handleTabChange('grammar');
    onTeacherOpenWriting?.();
  };

  const handleOpenPronunciation = (payload?: PronunciationLaunchPayload) => {
    if (!access.features.hasMercySpeak) {
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
      return;
    }

    handleTabChange('logic');
    onOpenEnglishLogic?.();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="relative flex h-full flex-col overflow-hidden border-l border-white/70 bg-gradient-to-br from-[#FFF9F5] via-[#F8FAFF] to-[#F4F1FF] shadow-2xl">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-36 bg-[radial-gradient(circle_at_top,_rgba(255,138,101,0.12),_rgba(192,132,252,0.06)_45%,_transparent_75%)]" />

      <div
        className="relative z-10 flex items-center justify-between border-b border-white/70 bg-white/75 px-4 py-3 backdrop-blur-md"
        onPointerDown={onPanelDragStart}
      >
        <div className="flex items-center gap-3">
          <div className="relative shrink-0">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#FFD7C8] to-[#DCC8FF] blur-sm opacity-70" />
            <img
              src={MERCY_HOST_IMAGE_SRC}
              alt="Teacher Mercy"
              className="relative h-11 w-11 rounded-full border-2 border-white object-cover shadow-sm"
              onError={(event) => {
                fallbackAvatar(event);
                onAvatarError?.(event);
              }}
            />
            <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-400" />
          </div>

          <div className="min-w-0">
            <h2 className="truncate text-lg font-semibold tracking-tight text-slate-900">
              Mercy
            </h2>
            <p className="truncate text-sm text-slate-600">
              {journeyTitle || 'Teacher Mercy'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            className="rounded-full border border-transparent bg-white/70 p-2 text-slate-500 transition hover:border-slate-200 hover:bg-white hover:text-slate-700"
            aria-label={isFullscreen ? 'Exit full screen' : 'Full screen'}
            onClick={onToggleFullscreen}
          >
            {isFullscreen ? <Minimize2 size={17} /> : <Maximize2 size={17} />}
          </button>

          <button
            type="button"
            className="rounded-full border border-transparent bg-white/70 p-2 text-slate-500 transition hover:border-slate-200 hover:bg-white hover:text-slate-700"
            aria-label="Profile"
          >
            <User size={17} />
          </button>

          <button
            type="button"
            onClick={handleCollapse}
            className="rounded-full border border-transparent bg-white/70 p-2 text-slate-500 transition hover:border-slate-200 hover:bg-white hover:text-slate-700"
            aria-label="Collapse Mercy panel"
          >
            <ChevronDown size={17} />
          </button>

          <button
            type="button"
            onClick={handleClose}
            className="rounded-full border border-transparent bg-white/70 p-2 text-slate-400 transition hover:border-red-100 hover:bg-red-50 hover:text-red-500"
            aria-label="Close Mercy panel"
          >
            <X size={17} />
          </button>
        </div>
      </div>

      <div className="relative z-10 border-b border-white/70 bg-white/55 px-3 py-2.5 backdrop-blur-sm">
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
                className={`flex min-h-[68px] flex-col items-center justify-center gap-1.5 rounded-2xl border px-2 py-2.5 text-center transition-all duration-200 ${
                  isActive
                    ? accent.active
                    : tab.enabled
                      ? 'border-transparent bg-white/60 text-slate-500 hover:border-white hover:bg-white/85 hover:text-slate-700'
                      : 'cursor-not-allowed border-transparent bg-slate-100/80 text-slate-300 opacity-80'
                }`}
                aria-pressed={isActive}
                aria-disabled={!tab.enabled}
                title={tab.enabled ? tab.label : `${tab.label} requires premium access`}
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
            />
          ) : null}

          {activeTab === 'teacher' && access.features.hasMercyJourney && (
            <MercyTeacherTab
              latestTeacherWritingState={latestTeacherWritingState}
              latestAnalysisResult={resolvedLatestAnalysisResult}
              teacherMemorySummary={teacherMemorySummary}
              onOpenPronunciation={() => handleOpenPronunciation(pronunciationPayload ?? undefined)}
              onOpenWriting={handleOpenWriting}
            />
          )}

          {activeTab === 'grammar' && access.features.hasMercyGrammar && (
            <GrammarWritingTab
              roomId={roomId}
              roomTitle={roomTitle}
              contentEn={contentEn}
              teacherTask={resolvedTeacherTask ?? undefined}
              onAnalysisResult={onAnalysisResult}
              onTeacherWritingStateChange={onTeacherWritingStateChange}
              onPracticePronunciation={(payload) => {
                if (!access.features.hasMercySpeak) {
                  return;
                }

                onPracticePronunciation?.(payload);
                handleTabChange('pronunciation');
              }}
              onOpenEnglishLogic={handleOpenLogic}
              onMemoryUpdate={onMemoryUpdate}
            />
          )}

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
            />
          )}

          {activeTab === 'logic' && access.features.hasMercyLogic && (
            <EnglishLogicTab
              roomTitle={roomTitle}
              contentEn={contentEn}
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
        </div>
      </div>

      <div className="relative z-10 border-t border-white/70 bg-white/70 px-4 py-2.5 backdrop-blur-sm">
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