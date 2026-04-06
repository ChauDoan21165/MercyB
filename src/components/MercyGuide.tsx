// PATH: src/components/MercyGuide.tsx

import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
  IDLE_THRESHOLD_MS,
  MERCY_BLUE_PATH_FORWARD,
  MIN_PANEL_HEIGHT,
  MIN_PANEL_MARGIN,
  MIN_PANEL_WIDTH,
  MOBILE_PANEL_BOTTOM_SAFE,
  MUSIC_BAR_SAFE_HEIGHT,
  PANEL_SIZE_STORAGE_KEY_DESKTOP,
  PANEL_SIZE_STORAGE_KEY_MOBILE,
  SESSION_HINT_KEY,
  SIZE_PRESETS,
} from './mercy-guide/mercyGuide.constants';
import {
  getPanelHeightPolicy,
  getPanelWidthPolicy,
} from './mercy-guide/mercyGuide.utils';
import { MERCY_HOST_IMAGE_FALLBACK } from './mercy-guide/shared';
import { analyzeGrammarWithApi } from './mercy-guide/tabs/grammar-writing/api';
import type {
  GrammarApiResponse,
  GrammarWritingTeacherState,
  PathHint,
  PronunciationLaunchPayload,
  TeacherWritingTask,
} from './mercy-guide/types';

interface MercyGuideProps {
  roomId?: string;
  roomTitle?: string;
  tier?: string;
  pathSlug?: string;
  tags?: string[];
  contentEn?: string;
}

type GuideTab = 'teacher' | 'english' | 'speak' | 'suggest';
type HintKey = keyof typeof MERCY_BLUE_PATH_FORWARD;
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

const MercyGuidePanelView = MercyGuidePanel as React.ComponentType<any>;

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

  const words = text.split(' ');
  return words.length <= maxWords
    ? text
    : `${words.slice(0, maxWords).join(' ')}…`;
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
  const [pathHint, setPathHint] = useState<PathHint | null>(null);
  const [isGhosted, setIsGhosted] = useState(false);

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

  const suggestions = useMemo<SuggestedItem[]>(() => [], []);
  const yesterdaySummary = useMemo<StudyLogEntry | undefined>(() => undefined, []);
  const todayTotalMinutes = 0;
  const hasHeavyMoods = false;
  const troubleWords = useMemo<any[]>(() => [], []);
  const speakPractice = null;

  const initialWidthPolicy = getPanelWidthPolicy();
  const initialHeight = useMemo(() => {
    if (typeof window === 'undefined') {
      return MIN_PANEL_HEIGHT;
    }

    const preferred = Math.round(window.innerHeight * DEFAULT_PANEL_HEIGHT_RATIO);
    return Math.max(MIN_PANEL_HEIGHT, preferred);
  }, []);

  const [panelRect, setPanelRect] = useState<PanelRect>({
    width: initialWidthPolicy.defaultWidth,
    height: initialHeight,
    right: DEFAULT_PANEL_RIGHT,
    bottom: DEFAULT_PANEL_BOTTOM,
  });

  const [bubblePos, setBubblePos] = useState<BubblePos>({
    right: DEFAULT_BUBBLE_RIGHT,
    bottom: DEFAULT_BUBBLE_BOTTOM,
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
  const journeyTitle = roomSummary.hasRoomContext
    ? roomSummary.roomName
    : 'Teacher Mercy';

  const clampPanelRect = useCallback((next: PanelRect): PanelRect => {
    if (typeof window === 'undefined') {
      return next;
    }

    const widthPolicy = getPanelWidthPolicy();
    const heightPolicy = getPanelHeightPolicy();

    return {
      width: Math.min(widthPolicy.maxWidth, Math.max(MIN_PANEL_WIDTH, next.width)),
      height: Math.min(heightPolicy.maxHeight, Math.max(MIN_PANEL_HEIGHT, next.height)),
      right: Math.min(
        window.innerWidth - MIN_PANEL_WIDTH,
        Math.max(MIN_PANEL_MARGIN, next.right),
      ),
      bottom: Math.min(
        window.innerHeight - MIN_PANEL_HEIGHT - 32,
        Math.max(
          isMobileViewport() ? MOBILE_PANEL_BOTTOM_SAFE : MUSIC_BAR_SAFE_HEIGHT,
          next.bottom,
        ),
      ),
    };
  }, []);

  const clampBubblePos = useCallback((next: BubblePos): BubblePos => {
    if (typeof window === 'undefined') {
      return next;
    }

    return {
      right: Math.min(
        window.innerWidth - BUBBLE_SIZE,
        Math.max(BUBBLE_SAFE_MARGIN, next.right),
      ),
      bottom: Math.min(
        window.innerHeight - BUBBLE_SIZE - 20,
        Math.max(getBubbleBottomSafe(), next.bottom),
      ),
    };
  }, []);

  const showUnseenHint = useCallback((hint: PathHint) => {
    if (typeof window === 'undefined') {
      setPathHint(hint);
      setIsGhosted(false);
      return;
    }

    try {
      const raw = window.sessionStorage.getItem(SESSION_HINT_KEY);
      const seen: string[] = raw ? JSON.parse(raw) : [];

      if (!seen.includes(hint.vi)) {
        window.sessionStorage.setItem(
          SESSION_HINT_KEY,
          JSON.stringify([...seen, hint.vi]),
        );
      }

      setPathHint(hint);
      setIsGhosted(false);
    } catch {
      setPathHint(hint);
      setIsGhosted(false);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      const storedPanel = window.sessionStorage.getItem(getPanelStorageKey());
      const storedBubble = window.sessionStorage.getItem(BUBBLE_POSITION_STORAGE_KEY);

      if (storedPanel) {
        setPanelRect(clampPanelRect(JSON.parse(storedPanel) as PanelRect));
      }

      if (storedBubble) {
        setBubblePos(clampBubblePos(JSON.parse(storedBubble) as BubblePos));
      }
    } catch (error) {
      console.error(error);
    }
  }, [clampBubblePos, clampPanelRect]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    window.sessionStorage.setItem(getPanelStorageKey(), JSON.stringify(panelRect));
    window.sessionStorage.setItem(
      BUBBLE_POSITION_STORAGE_KEY,
      JSON.stringify(bubblePos),
    );
  }, [bubblePos, panelRect]);

  useEffect(() => {
    if (!isOpen || activeTab !== 'speak') {
      return;
    }

    const timer = window.setTimeout(() => {
      showUnseenHint(MERCY_BLUE_PATH_FORWARD.idle_speak);
    }, IDLE_THRESHOLD_MS);

    return () => {
      window.clearTimeout(timer);
    };
  }, [activeTab, isOpen, showUnseenHint]);

  useEffect(() => {
    setIsGhosted(activeTab === 'speak' && !pathHint);
  }, [activeTab, pathHint]);

  useEffect(() => {
    if (!isOpen || roomSummary.hasRoomContext) {
      return;
    }

    showUnseenHint(MERCY_BLUE_PATH_FORWARD.idle);
  }, [isOpen, roomSummary.hasRoomContext, showUnseenHint]);

  useEffect(() => {
    const handleResize = () => {
      setPanelRect((current) => clampPanelRect(current));
      setBubblePos((current) => clampBubblePos(current));
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [clampBubblePos, clampPanelRect]);

  const handleAvatarError = useCallback(
    (event: React.SyntheticEvent<HTMLImageElement>) => {
      event.currentTarget.src = MERCY_HOST_IMAGE_FALLBACK;
    },
    [],
  );

  const handleUpdateInteraction = useCallback(() => {
    if (isGhosted) {
      setIsGhosted(false);
    }
  }, [isGhosted]);

  const handleOpenGuideFromBubble = useCallback(() => {
    setIsOpen(true);
  }, []);

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
      if ((event.target as HTMLElement).closest('button')) {
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
    [clampPanelRect, panelRect],
  );

  const handleResizePointerDown = useCallback(
    (direction: ResizeDirection) =>
      (event: React.PointerEvent<HTMLDivElement>) => {
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
    [clampPanelRect, panelRect],
  );

  const handleSetSizePreset = useCallback(
    (size: keyof typeof SIZE_PRESETS) => {
      setPanelRect((current) =>
        clampPanelRect({
          ...current,
          width: SIZE_PRESETS[size].width,
          height: SIZE_PRESETS[size].height,
        }),
      );
    },
    [clampPanelRect],
  );

  const handleCollapseGuide = useCallback(() => {
    setIsOpen(false);
    setShowSettings(false);
    setPathHint(null);
  }, []);

  const handleCloseGuide = useCallback(() => {
    setIsOpen(false);
    setShowSettings(false);
    setPathHint(null);
  }, []);

  const handleTriggerBilingualHint = useCallback(
    (hintKey: HintKey) => {
      const hint = MERCY_BLUE_PATH_FORWARD[hintKey];

      if (!hint) {
        return;
      }

      showUnseenHint(hint);

      if (typeof window !== 'undefined') {
        window.setTimeout(() => setPathHint(null), 3000);
      }
    },
    [showUnseenHint],
  );

  const handleNavigateSuggestion = useCallback((_item: SuggestedItem) => {
    setActiveTab('teacher');
  }, []);

  const handleAnalysisResult = useCallback((result: GrammarApiResponse | null) => {
    setLatestAnalysisResult(result);

    setLatestTeacherWritingState((current) => {
      if (!current && !result) {
        return current;
      }

      return {
        latestAnalysisResult: result ?? null,
        currentWritingMode: result?.writingMode ?? current?.currentWritingMode,
        isTeacherInitiated: current?.isTeacherInitiated ?? false,
        isRevisionAttempt: current?.isRevisionAttempt ?? false,
        latestSubmittedText: current?.latestSubmittedText ?? '',
        teacherTask: current?.teacherTask,
        revisionSourceText: current?.revisionSourceText,
      };
    });
  }, []);

  const handlePracticePronunciation = useCallback(
    (payload: PronunciationLaunchPayload) => {
      setPendingPronunciationPayload(payload);
      setActiveTab('speak');
      setIsOpen(true);
    },
    [],
  );

  const handleTeacherOpenPronunciation = useCallback(() => {
    setActiveTab('speak');
    setIsOpen(true);
  }, []);

  const handleTeacherOpenWriting = useCallback(() => {
    setActiveTab('english');
    setIsOpen(true);
  }, []);

  const handleTeacherWritingStateChange = useCallback(
    (state: GrammarWritingTeacherState) => {
      setLatestTeacherWritingState(state);
      setActiveTeacherTask(state.teacherTask ?? null);

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
      const input = {
        text: payload.revisedText,
        originalText: payload.originalText,
        focus: payload.focus,
        taskType: payload.taskType,
        isTeacherInitiated: true,
        isRevisionAttempt: true,
      } as Parameters<typeof analyzeGrammarWithApi>[0];

      const result = await analyzeGrammarWithApi(input);

      setLatestAnalysisResult(result ?? null);
      setLatestTeacherWritingState((current) => {
        if (!current) {
          return {
            latestAnalysisResult: result ?? null,
            currentWritingMode: result?.writingMode ?? undefined,
            isTeacherInitiated: true,
            isRevisionAttempt: true,
            latestSubmittedText: payload.revisedText,
            teacherTask: activeTeacherTask ?? undefined,
            revisionSourceText: payload.originalText,
          };
        }

        return {
          ...current,
          latestAnalysisResult: result ?? null,
          currentWritingMode: result?.writingMode ?? current.currentWritingMode,
          isTeacherInitiated: true,
          isRevisionAttempt: true,
          latestSubmittedText: payload.revisedText,
          revisionSourceText: payload.originalText,
        };
      });

      return result ?? null;
    },
    [activeTeacherTask],
  );

  const handleSaveProfile = useCallback((newProfile: Partial<CompanionProfile>) => {
    setProfile((current) => ({ ...current, ...newProfile }));
  }, []);

  if (!isEnabled) {
    return null;
  }

  return (
    <MercyGuidePanelView
      isOpen={isOpen}
      isGhosted={isGhosted}
      activeTab={activeTab}
      setActiveTab={(value: string) => setActiveTab(value as GuideTab)}
      showSettings={showSettings}
      setShowSettings={setShowSettings}
      pathHint={pathHint}
      setPathHint={setPathHint}
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
      onUpdateInteraction={handleUpdateInteraction}
      onOpenGuideFromBubble={handleOpenGuideFromBubble}
      onBubblePointerDown={handleBubblePointerDown}
      onPanelDragStart={handlePanelDragStart}
      onResizePointerDown={handleResizePointerDown}
      onSetSizePreset={handleSetSizePreset}
      onCollapseGuide={handleCollapseGuide}
      onCloseGuide={handleCloseGuide}
      onTriggerBilingualHint={handleTriggerBilingualHint}
      onAvatarError={handleAvatarError}
      onNavigateSuggestion={handleNavigateSuggestion}
      onAnalysisResult={handleAnalysisResult}
      onPracticePronunciation={handlePracticePronunciation}
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
      onSaveProfile={handleSaveProfile}
    />
  );
}

export default MercyGuide;