/**
 * File: MercyGuide.tsx
 * Path: src/components/MercyGuide.tsx
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { useMercyGuide } from '@/hooks/useMercyGuide';
import type { CompanionProfile } from '@/services/companion';
import type { SuggestedItem } from '@/services/suggestions';
import type { StudyLogEntry } from '@/services/studyLog';
import { MercyGuidePanel } from './mercy-guide/MercyGuidePanel';
import {
  BUBBLE_POSITION_STORAGE_KEY,
  BUBBLE_SAFE_MARGIN,
  BUBBLE_SIZE,
  DEFAULT_BUBBLE_BOTTOM,
  DEFAULT_BUBBLE_RIGHT,
  DEFAULT_PANEL_BOTTOM,
  DEFAULT_PANEL_HEIGHT_RATIO,
  DEFAULT_PANEL_RIGHT,
  MIN_PANEL_HEIGHT,
  MIN_PANEL_MARGIN,
  MIN_PANEL_WIDTH,
  MOBILE_PANEL_BOTTOM_SAFE,
  MUSIC_BAR_SAFE_HEIGHT,
  PANEL_SIZE_STORAGE_KEY_DESKTOP,
  PANEL_SIZE_STORAGE_KEY_MOBILE,
  SIZE_PRESETS,
} from './mercy-guide/mercyGuide.constants';
import {
  getPanelHeightPolicy,
  getPanelWidthPolicy,
} from './mercy-guide/mercyGuide.utils';
import { MERCY_HOST_IMAGE_FALLBACK, MERCY_HOST_IMAGE_SRC } from './mercy-guide/shared';
import { analyzeGrammarWithApi } from './mercy-guide/tabs/grammar-writing/api';
import useMercyMemory from './mercy-guide/hooks/useMercyMemory';
import type {
  MercyGuideProps,
  GrammarApiResponse,
  GrammarWritingTeacherState,
  PronunciationLaunchPayload,
  TeacherWritingTask,
} from './mercy-guide/types';

type GuideTab = 'teacher' | 'grammar' | 'pronunciation' | 'logic';

type ResizeDirection =
  | 'top'
  | 'right'
  | 'bottom'
  | 'left'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right';

type PanelRect = {
  width: number;
  height: number;
  right: number;
  bottom: number;
};

type BubblePos = {
  right: number;
  bottom: number;
};

type RoomContextSummary = {
  hasRoomContext: boolean;
  roomName: string;
  tierLabel: string | null;
  topicLabel: string | null;
  shortSummary: string | null;
};

const MercyGuidePanelView = MercyGuide as unknown as React.ComponentType<any>;
// eslint-disable-next-line @typescript-eslint/no-redeclare
const MercyGuidePanelResolved = MercyGuidePanel as React.ComponentType<any>;

function isMobileViewport(): boolean {
  return typeof window !== 'undefined' && window.innerWidth < 768;
}

function getPanelStorageKey(): string {
  return isMobileViewport()
    ? PANEL_SIZE_STORAGE_KEY_MOBILE
    : PANEL_SIZE_STORAGE_KEY_DESKTOP;
}

function getBubbleBottomSafe(): number {
  return isMobileViewport() ? DEFAULT_BUBBLE_BOTTOM : 24;
}

function getGuideTabBottomBuffer(): number {
  return isMobileViewport() ? 20 : 12;
}

function cleanText(value?: string | null): string {
  return value ? value.replace(/\s+/g, ' ').trim() : '';
}

function stripHtml(value?: string | null): string {
  return value ? cleanText(value.replace(/<[^>]*>/g, ' ')) : '';
}

function truncateWords(value?: string | null, maxWords = 20): string {
  const text = cleanText(value);

  if (!text) {
    return '';
  }

  const words = text.split(/\s+/);
  if (words.length <= maxWords) {
    return text;
  }

  return `${words.slice(0, maxWords).join(' ')}…`;
}

function deriveRoomContextSummary({
  roomTitle,
  tier,
  tags,
  contentEn,
}: MercyGuideProps): RoomContextSummary {
  const safeRoomTitle = cleanText(roomTitle);
  const safeTier = cleanText(tier);
  const roomName = safeRoomTitle || (safeTier ? `${safeTier} room` : 'this room');
  const hasRoomContext = Boolean(safeRoomTitle || safeTier || contentEn);

  return {
    hasRoomContext,
    roomName,
    tierLabel: safeTier || null,
    topicLabel: tags && tags.length > 0 ? tags.slice(0, 3).join(', ') : null,
    shortSummary: truncateWords(stripHtml(contentEn), 24) || null,
  };
}

function clampNumber(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function readStoredPanelRect(): Partial<PanelRect> | null {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.localStorage.getItem(getPanelStorageKey());
    if (!raw) return null;
    return JSON.parse(raw) as Partial<PanelRect>;
  } catch {
    return null;
  }
}

function writeStoredPanelRect(rect: PanelRect) {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(getPanelStorageKey(), JSON.stringify(rect));
  } catch {
    // ignore storage failures
  }
}

function readStoredBubblePos(): Partial<BubblePos> | null {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.localStorage.getItem(BUBBLE_POSITION_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Partial<BubblePos>;
  } catch {
    return null;
  }
}

function writeStoredBubblePos(pos: BubblePos) {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(BUBBLE_POSITION_STORAGE_KEY, JSON.stringify(pos));
  } catch {
    // ignore storage failures
  }
}

function fallbackAvatar(event: React.SyntheticEvent<HTMLImageElement>) {
  const img = event.currentTarget;
  if (img.src === MERCY_HOST_IMAGE_FALLBACK) return;
  img.onerror = null;
  img.src = MERCY_HOST_IMAGE_FALLBACK;
}

export function MercyGuide({
  roomId,
  roomTitle,
  tier,
  pathSlug,
  tags,
  contentEn,
}: MercyGuideProps) {
  const { isEnabled } = useMercyGuide();

  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<GuideTab>('teacher');
  const [showSettings, setShowSettings] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const [latestAnalysisResult, setLatestAnalysisResult] =
    useState<GrammarApiResponse | null>(null);
  const [activeTeacherTask, setActiveTeacherTask] =
    useState<TeacherWritingTask | null>(null);
  const [latestTeacherWritingState, setLatestTeacherWritingState] =
    useState<GrammarWritingTeacherState | null>(null);
  const [pendingPronunciationPayload, setPendingPronunciationPayload] =
    useState<PronunciationLaunchPayload | null>(null);

  const [showBreathingScript, setShowBreathingScript] = useState(false);
  const [breathingStep, setBreathingStep] = useState(0);
  const [showReframe, setShowReframe] = useState(false);

  const [profile, setProfile] = useState<CompanionProfile>(
    () =>
      ({
        english_level: 'intermediate',
      }) as CompanionProfile,
  );

  const { memory, teacherSummary, updateMemory } = useMercyMemory(profile);

  const suggestions = useMemo<SuggestedItem[]>(() => [], []);
  const yesterdaySummary = useMemo<StudyLogEntry | undefined>(() => undefined, []);
  const todayTotalMinutes = 0;
  const hasHeavyMoods = false;
  const troubleWords = useMemo<any[]>(
    () =>
      (memory?.pronunciation?.troubleWords ?? []).map((word) => ({
        word,
      })),
    [memory],
  );
  const speakPractice = null;

  const initialWidthPolicy = getPanelWidthPolicy();
  const initialHeight = useMemo(() => {
    if (typeof window === 'undefined') {
      return MIN_PANEL_HEIGHT;
    }

    const preferred = Math.round(window.innerHeight * DEFAULT_PANEL_HEIGHT_RATIO);
    return Math.max(MIN_PANEL_HEIGHT, preferred);
  }, []);

  const [panelRect, setPanelRect] = useState<PanelRect>(() => {
    const stored = readStoredPanelRect();

    return {
      width: stored?.width ?? initialWidthPolicy.defaultWidth,
      height: stored?.height ?? initialHeight,
      right: stored?.right ?? DEFAULT_PANEL_RIGHT,
      bottom: stored?.bottom ?? DEFAULT_PANEL_BOTTOM,
    };
  });

  const panelRectBeforeFullscreenRef = useRef<PanelRect | null>(null);

  const [bubblePos, setBubblePos] = useState<BubblePos>(() => {
    const stored = readStoredBubblePos();

    return {
      right: stored?.right ?? DEFAULT_BUBBLE_RIGHT,
      bottom: stored?.bottom ?? DEFAULT_BUBBLE_BOTTOM,
    };
  });

  const roomSummary = useMemo(
    () =>
      deriveRoomContextSummary({
        roomId,
        roomTitle,
        tier,
        pathSlug,
        tags,
        contentEn,
      }),
    [contentEn, pathSlug, roomId, roomTitle, tags, tier],
  );

  const guideTabBottomBuffer = getGuideTabBottomBuffer();
  const journeyTitle = roomSummary.hasRoomContext ? roomSummary.roomName : 'Teacher Mercy';

  const clampBubblePos = useCallback((next: BubblePos): BubblePos => {
    if (typeof window === 'undefined') return next;

    const maxRight = Math.max(
      BUBBLE_SAFE_MARGIN,
      window.innerWidth - BUBBLE_SIZE - BUBBLE_SAFE_MARGIN,
    );
    const maxBottom = Math.max(
      getBubbleBottomSafe(),
      window.innerHeight - BUBBLE_SIZE - BUBBLE_SAFE_MARGIN,
    );

    return {
      right: clampNumber(next.right, BUBBLE_SAFE_MARGIN, maxRight),
      bottom: clampNumber(next.bottom, getBubbleBottomSafe(), maxBottom),
    };
  }, []);

  const clampPanelRect = useCallback((next: PanelRect): PanelRect => {
    if (typeof window === 'undefined') return next;

    const widthPolicyRaw = getPanelWidthPolicy();
    const heightPolicyRaw = getPanelHeightPolicy();

    const widthPolicy: {
      minWidth?: number;
      defaultWidth: number;
      maxWidth?: number;
    } = widthPolicyRaw;

    const heightPolicy: {
      minHeight?: number;
      maxHeight?: number;
    } = heightPolicyRaw;

    const maxWidth = Math.max(
      MIN_PANEL_WIDTH,
      window.innerWidth - MIN_PANEL_MARGIN * 2,
    );

    const maxHeight = Math.max(
      MIN_PANEL_HEIGHT,
      window.innerHeight -
        MIN_PANEL_MARGIN * 2 -
        MOBILE_PANEL_BOTTOM_SAFE -
        MUSIC_BAR_SAFE_HEIGHT,
    );

    const width = clampNumber(
      next.width,
      widthPolicy.minWidth ?? MIN_PANEL_WIDTH,
      Math.min(widthPolicy.maxWidth ?? maxWidth, maxWidth),
    );

    const height = clampNumber(
      next.height,
      heightPolicy.minHeight ?? MIN_PANEL_HEIGHT,
      Math.min(heightPolicy.maxHeight ?? maxHeight, maxHeight),
    );

    const maxRight = Math.max(
      MIN_PANEL_MARGIN,
      window.innerWidth - width - MIN_PANEL_MARGIN,
    );
    const maxBottom = Math.max(
      MIN_PANEL_MARGIN,
      window.innerHeight - height - MIN_PANEL_MARGIN,
    );

    return {
      width,
      height,
      right: clampNumber(next.right, MIN_PANEL_MARGIN, maxRight),
      bottom: clampNumber(next.bottom, MIN_PANEL_MARGIN, maxBottom),
    };
  }, []);

  useEffect(() => {
    writeStoredPanelRect(panelRect);
  }, [panelRect]);

  useEffect(() => {
    writeStoredBubblePos(bubblePos);
  }, [bubblePos]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const onResize = () => {
      setPanelRect((current) => clampPanelRect(current));
      setBubblePos((current) => clampBubblePos(current));
    };

    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [clampBubblePos, clampPanelRect]);

  const handleOpenGuideFromBubble = useCallback(() => {
    setIsOpen(true);
  }, []);

  const handleCollapseGuide = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleCloseGuide = useCallback(() => {
    setIsOpen(false);
    setShowSettings(false);
  }, []);

  const handleToggleFullscreen = useCallback(() => {
    if (isMobileViewport()) {
      return;
    }

    setIsFullscreen((current) => {
      if (!current) {
        panelRectBeforeFullscreenRef.current = panelRect;
        return true;
      }

      setPanelRect(
        clampPanelRect(
          panelRectBeforeFullscreenRef.current ?? {
            width: initialWidthPolicy.defaultWidth,
            height: initialHeight,
            right: DEFAULT_PANEL_RIGHT,
            bottom: DEFAULT_PANEL_BOTTOM,
          },
        ),
      );

      return false;
    });
  }, [clampPanelRect, initialHeight, initialWidthPolicy.defaultWidth, panelRect]);

  const handleBubblePointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      event.preventDefault();

      const startX = event.clientX;
      const startY = event.clientY;
      const startPos = bubblePos;
      let moved = false;

      const onMove = (moveEvent: PointerEvent) => {
        const dx = moveEvent.clientX - startX;
        const dy = moveEvent.clientY - startY;

        if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
          moved = true;
        }

        setBubblePos(
          clampBubblePos({
            right: startPos.right - dx,
            bottom: startPos.bottom - dy,
          }),
        );
      };

      const onUp = () => {
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', onUp);

        if (!moved) {
          handleOpenGuideFromBubble();
        }
      };

      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
    },
    [bubblePos, clampBubblePos, handleOpenGuideFromBubble],
  );

  const handlePanelDragStart = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (isFullscreen || (event.target as HTMLElement).closest('button')) {
        return;
      }

      event.preventDefault();

      const startX = event.clientX;
      const startY = event.clientY;
      const startRect = panelRect;

      const onMove = (moveEvent: PointerEvent) => {
        setPanelRect(
          clampPanelRect({
            ...startRect,
            right: startRect.right - (moveEvent.clientX - startX),
            bottom: startRect.bottom - (moveEvent.clientY - startY),
          }),
        );
      };

      const onUp = () => {
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', onUp);
      };

      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
    },
    [clampPanelRect, isFullscreen, panelRect],
  );

  const handleResizePointerDown = useCallback(
    (direction: ResizeDirection) =>
      (event: React.PointerEvent<HTMLDivElement>) => {
        if (isFullscreen) {
          return;
        }

        event.preventDefault();
        event.stopPropagation();

        const startX = event.clientX;
        const startY = event.clientY;
        const startRect = panelRect;

        const onMove = (moveEvent: PointerEvent) => {
          const dx = moveEvent.clientX - startX;
          const dy = moveEvent.clientY - startY;

          const next: PanelRect = { ...startRect };

          if (direction.includes('left')) {
            next.width = startRect.width - dx;
          }

          if (direction.includes('right')) {
            next.width = startRect.width + dx;
            next.right = startRect.right - dx;
          }

          if (direction.includes('top')) {
            next.height = startRect.height - dy;
          }

          if (direction.includes('bottom')) {
            next.height = startRect.height + dy;
            next.bottom = startRect.bottom - dy;
          }

          setPanelRect(clampPanelRect(next));
        };

        const onUp = () => {
          window.removeEventListener('pointermove', onMove);
          window.removeEventListener('pointerup', onUp);
        };

        window.addEventListener('pointermove', onMove);
        window.addEventListener('pointerup', onUp);
      },
    [clampPanelRect, isFullscreen, panelRect],
  );

  const handleSetSizePreset = useCallback(
    (presetKey: keyof typeof SIZE_PRESETS) => {
      const preset = SIZE_PRESETS[presetKey];
      if (!preset) return;

      setPanelRect((current) =>
        clampPanelRect({
          ...current,
          width: preset.width,
          height: preset.height,
        }),
      );
    },
    [clampPanelRect],
  );

  const handleUpdateInteraction = useCallback(() => {
    // reserved hook point for future analytics / freshness timestamps
  }, []);

  const handleAvatarError = useCallback(() => {
    // reserved hook point for fallback avatar behavior
  }, []);

  const handleAnalysisResult = useCallback((result: GrammarApiResponse | null) => {
    setLatestAnalysisResult(result);
  }, []);

  const handlePracticePronunciation = useCallback(
    (payload: PronunciationLaunchPayload) => {
      setPendingPronunciationPayload(payload);
      setActiveTab('pronunciation');
    },
    [],
  );

  const handleOpenEnglishLogic = useCallback(() => {
    setActiveTab('logic');
  }, []);

  const handleTeacherOpenPronunciation = useCallback(() => {
    const sourceText =
      cleanText(latestTeacherWritingState?.latestSubmittedText) ||
      cleanText(memory?.writing?.lastSubmittedText);

    const correctedText =
      cleanText(latestAnalysisResult?.correctedText) ||
      cleanText(memory?.writing?.lastCorrectedText);

    const enhancedText =
      cleanText(latestAnalysisResult?.enhancedText) ||
      cleanText(memory?.writing?.lastEnhancedText);

    if (!sourceText && !correctedText && !enhancedText) {
      setActiveTab('pronunciation');
      return;
    }

    setPendingPronunciationPayload({
      sourceText,
      correctedText: correctedText || enhancedText || sourceText,
      enhancedText: enhancedText || undefined,
    });

    setActiveTab('pronunciation');
  }, [latestAnalysisResult, latestTeacherWritingState, memory]);

  const handleTeacherOpenWriting = useCallback(() => {
    setActiveTab('grammar');
  }, []);

  const handleTeacherWritingStateChange = useCallback(
    (state: GrammarWritingTeacherState) => {
      setLatestTeacherWritingState(state);

      if (state.latestAnalysisResult) {
        setLatestAnalysisResult(state.latestAnalysisResult);
      }
    },
    [],
  );

  const handleSubmitTeacherRevision = useCallback(
    async (payload: {
      originalText: string;
      revisedText: string;
      taskType?: string;
      focus?: string;
    }) => {
      const revisedText = cleanText(payload.revisedText);
      if (!revisedText) return null;

      const result = await analyzeGrammarWithApi({
        text: revisedText,
        roomId,
        roomTitle,
        contentEn,
        originalText: cleanText(payload.originalText) || undefined,
        focus: payload.focus,
        taskType: payload.taskType,
        isTeacherInitiated: true,
        isRevisionAttempt: true,
      });

      setLatestAnalysisResult(result);

      const nextTeacherState: GrammarWritingTeacherState = {
        latestAnalysisResult: result,
        currentWritingMode: result?.writingMode,
        isTeacherInitiated: true,
        isRevisionAttempt: true,
        latestSubmittedText: revisedText,
        teacherTask: activeTeacherTask ?? undefined,
        revisionSourceText: cleanText(payload.originalText) || undefined,
      };

      setLatestTeacherWritingState(nextTeacherState);

      if (result?.correctedText || result?.enhancedText) {
        setPendingPronunciationPayload({
          sourceText: revisedText,
          correctedText:
            cleanText(result.correctedText) ||
            cleanText(result.enhancedText) ||
            revisedText,
          enhancedText: cleanText(result.enhancedText) || undefined,
        });
      }

      return result;
    },
    [activeTeacherTask, contentEn, roomId, roomTitle],
  );

  const handleSaveProfile = useCallback((nextProfile: CompanionProfile) => {
    setProfile(nextProfile);
  }, []);

  if (!isEnabled) {
    return null;
  }

  return (
    <>
      {!isOpen && (
        <div
          role="button"
          tabIndex={0}
          onPointerDown={handleBubblePointerDown}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              handleOpenGuideFromBubble();
            }
          }}
          className="fixed z-[90] flex flex-col items-center"
          style={{
            right: bubblePos.right,
            bottom: bubblePos.bottom,
          }}
          aria-label="Open Mercy Guide"
        >
          <div
            className={cn(
              'h-20 w-20 overflow-hidden rounded-full border border-slate-200 bg-white shadow-lg transition hover:shadow-xl',
            )}
          >
            <img
              src={MERCY_HOST_IMAGE_SRC}
              alt="Teacher Mercy"
              onError={(event) => {
                fallbackAvatar(event);
                handleAvatarError();
              }}
              className="h-full w-full rounded-full object-cover object-[50%_32%] scale-110"
            />
          </div>

          <span className="mt-2 text-sm font-semibold text-slate-700">
            Teacher Mercy
          </span>
        </div>
      )}

      {isOpen && (
        <div
          className={cn(
            'fixed z-[95] overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-2xl',
            isFullscreen &&
              'left-6 right-6 top-6 bottom-6 rounded-[24px] md:left-10 md:right-10 md:top-8 md:bottom-8 lg:left-14 lg:right-14 lg:top-10 lg:bottom-10',
          )}
          style={
            isFullscreen
              ? undefined
              : {
                  width: panelRect.width,
                  height: panelRect.height,
                  right: panelRect.right,
                  bottom: panelRect.bottom,
                }
          }
        >
          <MercyGuidePanelResolved
            isOpen={isOpen}
            activeTab={activeTab}
            setActiveTab={(value: string) => setActiveTab(value as GuideTab)}
            showSettings={showSettings}
            setShowSettings={setShowSettings}
            panelRect={panelRect}
            bubblePos={bubblePos}
            hasEnglishContext={Boolean(contentEn)}
            guideTabBottomBuffer={guideTabBottomBuffer}
            journeyTitle={journeyTitle}
            roomId={roomId}
            roomTitle={roomTitle}
            contentEn={contentEn}
            profile={profile}
            suggestions={suggestions}
            yesterdaySummary={yesterdaySummary}
            todayTotalMinutes={todayTotalMinutes}
            hasHeavyMoods={hasHeavyMoods}
            showBreathingScript={showBreathingScript}
            breathingStep={breathingStep}
            showReframe={showReframe}
            setShowBreathingScript={setShowBreathingScript}
            setBreathingStep={setBreathingStep}
            setShowReframe={setShowReframe}
            troubleWords={troubleWords}
            speakPractice={speakPractice}
            latestAnalysisResult={latestAnalysisResult}
            pendingPronunciationPayload={pendingPronunciationPayload}
            activeTeacherTask={activeTeacherTask}
            latestTeacherWritingState={latestTeacherWritingState}
            memory={memory}
            teacherMemorySummary={teacherSummary}
            isFullscreen={isFullscreen}
            onToggleFullscreen={handleToggleFullscreen}
            onUpdateInteraction={handleUpdateInteraction}
            onOpenGuideFromBubble={handleOpenGuideFromBubble}
            onBubblePointerDown={handleBubblePointerDown}
            onPanelDragStart={handlePanelDragStart}
            onResizePointerDown={handleResizePointerDown}
            onSetSizePreset={handleSetSizePreset}
            onCollapseGuide={handleCollapseGuide}
            onCloseGuide={handleCloseGuide}
            onAvatarError={handleAvatarError}
            onNavigateSuggestion={() => undefined}
            onAnalysisResult={handleAnalysisResult}
            onPracticePronunciation={handlePracticePronunciation}
            onOpenEnglishLogic={handleOpenEnglishLogic}
            onTeacherOpenPronunciation={handleTeacherOpenPronunciation}
            onTeacherOpenWriting={handleTeacherOpenWriting}
            onTeacherWritingStateChange={handleTeacherWritingStateChange}
            onSubmitTeacherRevision={async (payload: {
              previousText: string;
              newText: string;
              taskType?: string;
              focus?: string;
            }) =>
              handleSubmitTeacherRevision({
                originalText: payload.previousText,
                revisedText: payload.newText,
                taskType: payload.taskType,
                focus: payload.focus,
              })
            }
            onMemoryUpdate={updateMemory}
            onSaveProfile={handleSaveProfile}
          />

          {!isFullscreen && (
            <>
              <div
                className="absolute inset-x-3 top-0 z-[70] h-1.5 cursor-n-resize bg-slate-300/70 hover:bg-slate-400/80"
                onPointerDown={handleResizePointerDown('top')}
              />
              <div
                className="absolute inset-x-3 bottom-0 z-[70] h-1.5 cursor-s-resize bg-slate-300/70 hover:bg-slate-400/80"
                onPointerDown={handleResizePointerDown('bottom')}
              />
              <div
                className="absolute inset-y-3 left-0 z-[70] w-1.5 cursor-w-resize bg-slate-300/70 hover:bg-slate-400/80"
                onPointerDown={handleResizePointerDown('left')}
              />
              <div
                className="absolute inset-y-3 right-0 z-[70] w-1.5 cursor-e-resize bg-slate-300/70 hover:bg-slate-400/80"
                onPointerDown={handleResizePointerDown('right')}
              />
              <div
                className="absolute left-0 top-0 z-[80] h-2.5 w-2.5 cursor-nw-resize rounded-br bg-slate-400/80"
                onPointerDown={handleResizePointerDown('top-left')}
              />
              <div
                className="absolute right-0 top-0 z-[80] h-2.5 w-2.5 cursor-ne-resize rounded-bl bg-slate-400/80"
                onPointerDown={handleResizePointerDown('top-right')}
              />
              <div
                className="absolute bottom-0 left-0 z-[80] h-2.5 w-2.5 cursor-sw-resize rounded-tr bg-slate-400/80"
                onPointerDown={handleResizePointerDown('bottom-left')}
              />
              <div
                className="absolute bottom-0 right-0 z-[80] h-2.5 w-2.5 cursor-se-resize rounded-tl bg-slate-400/80"
                onPointerDown={handleResizePointerDown('bottom-right')}
              />
            </>
          )}
        </div>
      )}
    </>
  );
}

export default MercyGuide;