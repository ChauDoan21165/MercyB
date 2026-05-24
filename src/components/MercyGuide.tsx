/**
 * Path: src/components/MercyGuide.tsx
 * File: MercyGuide.tsx
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { useProfileQuery } from '@/lib/queries/useProfileQuery';
import { getTotalPoints, getStreakDays, getStreakEmoji, getPointsDisplay, loadPointsFromSupabase } from '@/services/pointsService';
import { cn } from '@/lib/utils';
import { useMercyGuide } from '@/hooks/useMercyGuide';
import type { CompanionProfile } from '@/services/companion';
import type { SuggestedItem } from '@/services/suggestions';
import type { StudyLogEntry } from '@/services/studyLog';
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
import {
  MERCY_HOST_IMAGE_AVIF,
  MERCY_HOST_IMAGE_FALLBACK,
  MERCY_HOST_IMAGE_SRC,
  MERCY_HOST_IMAGE_WEBP,
} from './mercy-guide/shared';
import { analyzeGrammarWithApi } from './mercy-guide/tabs/grammar-writing/api';
import { breadcrumbMercyPanel } from '@/lib/monitoring/breadcrumbs';
import useMercyMemory from './mercy-guide/hooks/useMercyMemory';
import type {
  MercyGuideProps,
  GrammarApiResponse,
  GrammarWritingTeacherState,
  PronunciationLaunchPayload,
  TeacherWritingTask,
} from './mercy-guide/types';

type GuideTab = 'teacher' | 'grammar' | 'pronunciation' | 'logic';
type TeacherMode = 'adult' | 'kids';

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

type TeacherUiPreset = {
  bubbleLabel: string;
  bubbleSubtitle: string | null;
  journeyTitle: string;
  defaultTab: GuideTab;
  availableTabs: GuideTab[];
  hideGrammarTab: boolean;
  hideLogicTab: boolean;
  disableTeacherWriting: boolean;
  disableGrammarAnalysis: boolean;
  disableEnglishLogic: boolean;
  preferPronunciationFirst: boolean;
  preferTapAndRepeat: boolean;
};

// Lazy-load the heavy guide panel so its ~39 KB gz chunk is not eagerly
// modulepreloaded on every first paint (homepage included). The panel only
// renders behind `isOpen` (default false), so the Suspense boundary at the
// `{isOpen && …}` block below fires only on the first open of the guide.
// See reports/RECON-bundle-audit-A25.md (Lever 1).
const MercyGuidePanel = React.lazy(
  () => import('./mercy-guide/MercyGuidePanel'),
);
const MercyGuidePanelResolved =
  MercyGuidePanel as unknown as React.ComponentType<any>;
const KIDS_CONTEXT_PATTERN =
  /\bkids?\b|children|child|toddler|preschool|kindergarten|kids[_-]?l?[123]|kidslevel[123]/i;
const FULLSCREEN_OVERLAY_Z_INDEX = 1000000;

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

function hasReadableRoomContent(value?: string | null): boolean {
  return Boolean(stripHtml(value));
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

function deriveTeacherMode({
  roomId,
  roomTitle,
  tier,
  pathSlug,
  tags,
  contentEn,
}: MercyGuideProps): TeacherMode {
  const joined = [
    cleanText(roomId),
    cleanText(roomTitle),
    cleanText(tier),
    cleanText(pathSlug),
    ...(tags ?? []).map((tag) => cleanText(tag)),
    truncateWords(stripHtml(contentEn), 40),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  if (!joined) {
    return 'kids';
  }

  return KIDS_CONTEXT_PATTERN.test(joined) ? 'kids' : 'adult';
}

function buildTeacherUiPreset(
  mode: TeacherMode,
  roomSummary: RoomContextSummary,
): TeacherUiPreset {
  if (mode === 'kids') {
    return {
      bubbleLabel: 'Mercy Kids',
      bubbleSubtitle: null,
      journeyTitle: roomSummary.hasRoomContext ? roomSummary.roomName : 'Mercy Kids',
      defaultTab: 'teacher',
      availableTabs: ['pronunciation', 'teacher'],
      hideGrammarTab: true,
      hideLogicTab: true,
      disableTeacherWriting: true,
      disableGrammarAnalysis: true,
      disableEnglishLogic: true,
      preferPronunciationFirst: true,
      preferTapAndRepeat: true,
    };
  }

  return {
    bubbleLabel: 'Teacher Mercy',
    bubbleSubtitle: null,
    journeyTitle: roomSummary.hasRoomContext ? roomSummary.roomName : 'Teacher Mercy',
    defaultTab: 'teacher',
    availableTabs: ['teacher', 'grammar', 'pronunciation', 'logic'],
    hideGrammarTab: false,
    hideLogicTab: false,
    disableTeacherWriting: false,
    disableGrammarAnalysis: false,
    disableEnglishLogic: false,
    preferPronunciationFirst: false,
    preferTapAndRepeat: false,
  };
}

function clampNumber(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function readStoredPanelRect(): Partial<PanelRect> | null {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.localStorage.getItem(getPanelStorageKey());
    if (!raw) return null;

    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== 'object') return null;

    const record = parsed as Record<string, unknown>;
    const next: Partial<PanelRect> = {};

    if (isFiniteNumber(record.width)) next.width = record.width;
    if (isFiniteNumber(record.height)) next.height = record.height;
    if (isFiniteNumber(record.right)) next.right = record.right;
    if (isFiniteNumber(record.bottom)) next.bottom = record.bottom;

    return Object.keys(next).length > 0 ? next : null;
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

    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== 'object') return null;

    const record = parsed as Record<string, unknown>;
    const next: Partial<BubblePos> = {};

    if (isFiniteNumber(record.right)) next.right = record.right;
    if (isFiniteNumber(record.bottom)) next.bottom = record.bottom;

    return Object.keys(next).length > 0 ? next : null;
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
  initialTab,
  initialPracticeLine,
  openRequestId,
}: MercyGuideProps) {
  const { isEnabled } = useMercyGuide();

  const teacherMode = useMemo(
    () =>
      deriveTeacherMode({
        roomId,
        roomTitle,
        tier,
        pathSlug,
        tags,
        contentEn,
      }),
    [contentEn, pathSlug, roomId, roomTitle, tags, tier],
  );

  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<GuideTab>(
    initialTab ?? (teacherMode === 'kids' ? 'pronunciation' : 'teacher'),
  );

  // When Home increments openRequestId (Try-one-word card), open the
  // panel on the requested tab. Bumping the id retriggers this effect
  // even if initialTab / initialPracticeLine values are unchanged across
  // repeated clicks.
  useEffect(() => {
    if (!openRequestId) return;
    if (initialTab) setActiveTab(initialTab);
    setIsOpen(true);
  }, [openRequestId, initialTab]);
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
  const pointerCleanupRef = useRef<(() => void) | null>(null);
  const bubbleRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const bubbleDragFrameRef = useRef<number | null>(null);
  const bubbleDragOffsetRef = useRef({ x: 0, y: 0 });
  const panelDragFrameRef = useRef<number | null>(null);
  const panelDragOffsetRef = useRef({ x: 0, y: 0 });

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

  const teacherUi = useMemo(
    () => buildTeacherUiPreset(teacherMode, roomSummary),
    [roomSummary, teacherMode],
  );

  const isMobileRoomReading =
    isMobileViewport() && hasReadableRoomContent(contentEn);
  const showBubbleLabel = !isMobileRoomReading;

  const guideTabBottomBuffer = getGuideTabBottomBuffer();
  const journeyTitle = teacherUi.journeyTitle;

  useEffect(() => {
    if (teacherMode !== 'kids') return;

    setActiveTab((current) => {
      if (current === 'grammar' || current === 'logic' || current === 'teacher') {
        return teacherUi.defaultTab;
      }
      return current;
    });
  }, [teacherMode, teacherUi.defaultTab]);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (!isOpen || !isFullscreen) return;

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, [isFullscreen, isOpen]);

  const clearPointerListeners = useCallback(() => {
    if (pointerCleanupRef.current) {
      pointerCleanupRef.current();
      pointerCleanupRef.current = null;
    }
  }, []);

  const scheduleBubbleDragPreview = useCallback((dx: number, dy: number) => {
    if (typeof window === 'undefined') return;

    bubbleDragOffsetRef.current = { x: dx, y: dy };

    if (bubbleDragFrameRef.current !== null) {
      return;
    }

    bubbleDragFrameRef.current = window.requestAnimationFrame(() => {
      bubbleDragFrameRef.current = null;

      if (!bubbleRef.current) {
        return;
      }

      const { x, y } = bubbleDragOffsetRef.current;
      bubbleRef.current.style.willChange = 'transform';
      bubbleRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    });
  }, []);

  const clearBubbleDragPreview = useCallback(() => {
    if (typeof window !== 'undefined' && bubbleDragFrameRef.current !== null) {
      window.cancelAnimationFrame(bubbleDragFrameRef.current);
      bubbleDragFrameRef.current = null;
    }

    bubbleDragOffsetRef.current = { x: 0, y: 0 };

    if (bubbleRef.current) {
      bubbleRef.current.style.transform = '';
      bubbleRef.current.style.willChange = '';
    }
  }, []);

  const schedulePanelDragPreview = useCallback((dx: number, dy: number) => {
    if (typeof window === 'undefined') return;

    panelDragOffsetRef.current = { x: dx, y: dy };

    if (panelDragFrameRef.current !== null) {
      return;
    }

    panelDragFrameRef.current = window.requestAnimationFrame(() => {
      panelDragFrameRef.current = null;

      if (!panelRef.current) {
        return;
      }

      const { x, y } = panelDragOffsetRef.current;
      panelRef.current.style.willChange = 'transform';
      panelRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    });
  }, []);

  const clearPanelDragPreview = useCallback(() => {
    if (typeof window !== 'undefined' && panelDragFrameRef.current !== null) {
      window.cancelAnimationFrame(panelDragFrameRef.current);
      panelDragFrameRef.current = null;
    }

    panelDragOffsetRef.current = { x: 0, y: 0 };

    if (panelRef.current) {
      panelRef.current.style.transform = '';
      panelRef.current.style.willChange = '';
    }
  }, []);

  const bindPointerListeners = useCallback(
    (onMove: (event: PointerEvent) => void, onUp?: () => void) => {
      if (typeof window === 'undefined') return;

      clearPointerListeners();

      const handleMove = (event: PointerEvent) => {
        onMove(event);
      };

      const handleUp = () => {
        clearPointerListeners();
        onUp?.();
      };

      window.addEventListener('pointermove', handleMove);
      window.addEventListener('pointerup', handleUp);
      window.addEventListener('pointercancel', handleUp);

      pointerCleanupRef.current = () => {
        window.removeEventListener('pointermove', handleMove);
        window.removeEventListener('pointerup', handleUp);
        window.removeEventListener('pointercancel', handleUp);
      };
    },
    [clearPointerListeners],
  );

  const clampBubblePos = useCallback(
    (next: BubblePos): BubblePos => {
      if (typeof window === 'undefined') return next;

      const maxRight = Math.max(
        BUBBLE_SAFE_MARGIN,
        window.innerWidth - BUBBLE_SIZE - BUBBLE_SAFE_MARGIN,
      );
      const maxBottom = Math.max(
        getBubbleBottomSafe(),
        window.innerHeight - BUBBLE_SIZE - BUBBLE_SAFE_MARGIN,
      );

      const bottom = clampNumber(next.bottom, getBubbleBottomSafe(), maxBottom);

      if (isMobileRoomReading) {
        const snapThreshold = (BUBBLE_SAFE_MARGIN + maxRight) / 2;
        const snappedRight =
          next.right >= snapThreshold ? maxRight : BUBBLE_SAFE_MARGIN;

        return {
          right: snappedRight,
          bottom,
        };
      }

      return {
        right: clampNumber(next.right, BUBBLE_SAFE_MARGIN, maxRight),
        bottom,
      };
    },
    [isMobileRoomReading],
  );

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
    return () => {
      clearPointerListeners();
      clearBubbleDragPreview();
      clearPanelDragPreview();
    };
  }, [clearBubbleDragPreview, clearPanelDragPreview, clearPointerListeners]);

  useEffect(() => {
    if (!isMobileRoomReading) {
      return;
    }

    clearBubbleDragPreview();
    setBubblePos((current) => {
      const next = clampBubblePos(current);
      if (next.right === current.right && next.bottom === current.bottom) {
        return current;
      }
      return next;
    });
  }, [clampBubblePos, clearBubbleDragPreview, isMobileRoomReading]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const onResize = () => {
      clearBubbleDragPreview();
      clearPanelDragPreview();
      setPanelRect((current) => clampPanelRect(current));
      setBubblePos((current) => clampBubblePos(current));
    };

    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [
    clampBubblePos,
    clampPanelRect,
    clearBubbleDragPreview,
    clearPanelDragPreview,
  ]);

  const handleOpenGuideFromBubble = useCallback(() => {
    setIsOpen(true);
    breadcrumbMercyPanel('open', { source: 'bubble' });
    if (teacherUi.preferPronunciationFirst) {
      setActiveTab('pronunciation');
    }
  }, [teacherUi.preferPronunciationFirst]);

  const handleCollapseGuide = useCallback(() => {
    setIsOpen(false);
    breadcrumbMercyPanel('close', { source: 'collapse' });
  }, []);

  const handleCloseGuide = useCallback(() => {
    setIsOpen(false);
    setShowSettings(false);
    setIsFullscreen(false);
    breadcrumbMercyPanel('close', { source: 'close' });
  }, []);

  const handleToggleFullscreen = useCallback(() => {
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

      const target = event.currentTarget;
      target.setPointerCapture?.(event.pointerId);

      const previousTouchAction = target.style.touchAction;
      const previousUserSelect = target.style.userSelect;

      target.style.touchAction = 'none';
      target.style.userSelect = 'none';

      clearBubbleDragPreview();

      const startX = event.clientX;
      const startY = event.clientY;
      const startPos = bubblePos;
      let moved = false;

      bindPointerListeners(
        (moveEvent) => {
          const dx = moveEvent.clientX - startX;
          const dy = moveEvent.clientY - startY;

          if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
            moved = true;
          }

          if (isMobileRoomReading) {
            scheduleBubbleDragPreview(0, dy);
            return;
          }

          scheduleBubbleDragPreview(dx, dy);
        },
        () => {
          const { x, y } = bubbleDragOffsetRef.current;

          target.style.touchAction = previousTouchAction;
          target.style.userSelect = previousUserSelect;

          clearBubbleDragPreview();

          if (!moved) {
            handleOpenGuideFromBubble();
            return;
          }

          if (isMobileRoomReading) {
            setBubblePos(
              clampBubblePos({
                right: startPos.right,
                bottom: startPos.bottom - y,
              }),
            );
            return;
          }

          setBubblePos(
            clampBubblePos({
              right: startPos.right - x,
              bottom: startPos.bottom - y,
            }),
          );
        },
      );
    },
    [
      bindPointerListeners,
      bubblePos,
      clampBubblePos,
      clearBubbleDragPreview,
      handleOpenGuideFromBubble,
      isMobileRoomReading,
      scheduleBubbleDragPreview,
    ],
  );

  const handlePanelDragStart = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const targetElement = event.target as HTMLElement;

      if (
        isFullscreen ||
        targetElement.closest(
          'button, a, input, textarea, select, audio, video, [role="button"], [data-mercy-no-drag="true"]',
        )
      ) {
        return;
      }

      event.preventDefault();

      const dragHandle = event.currentTarget;
      dragHandle.setPointerCapture?.(event.pointerId);

      const previousTouchAction = dragHandle.style.touchAction;
      const previousUserSelect = dragHandle.style.userSelect;

      dragHandle.style.touchAction = 'none';
      dragHandle.style.userSelect = 'none';

      clearPanelDragPreview();

      const startX = event.clientX;
      const startY = event.clientY;
      const startRect = panelRect;

      bindPointerListeners(
        (moveEvent) => {
          const dx = moveEvent.clientX - startX;
          const dy = moveEvent.clientY - startY;

          schedulePanelDragPreview(dx, dy);
        },
        () => {
          const { x, y } = panelDragOffsetRef.current;

          dragHandle.style.touchAction = previousTouchAction;
          dragHandle.style.userSelect = previousUserSelect;

          clearPanelDragPreview();

          setPanelRect(
            clampPanelRect({
              ...startRect,
              right: startRect.right - x,
              bottom: startRect.bottom - y,
            }),
          );
        },
      );
    },
    [
      bindPointerListeners,
      clampPanelRect,
      clearPanelDragPreview,
      isFullscreen,
      panelRect,
      schedulePanelDragPreview,
    ],
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

        bindPointerListeners((moveEvent) => {
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
        });
      },
    [bindPointerListeners, clampPanelRect, isFullscreen, panelRect],
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
    if (teacherUi.disableGrammarAnalysis) {
      return;
    }

    setLatestAnalysisResult(result);
  }, [teacherUi.disableGrammarAnalysis]);

  const handlePracticePronunciation = useCallback(
    (payload: PronunciationLaunchPayload) => {
      setPendingPronunciationPayload(payload);
      setActiveTab('pronunciation');
    },
    [],
  );

  const handleOpenEnglishLogic = useCallback(() => {
    if (teacherUi.disableEnglishLogic) {
      setActiveTab('pronunciation');
      return;
    }

    setActiveTab('logic');
  }, [teacherUi.disableEnglishLogic]);

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
      correctedText: correctedText || undefined,
      enhancedText: enhancedText || undefined,
    });

    setActiveTab('pronunciation');
  }, [latestAnalysisResult, latestTeacherWritingState, memory]);

  const handleTeacherOpenWriting = useCallback(() => {
    if (teacherUi.disableTeacherWriting) {
      setActiveTab('pronunciation');
      return;
    }

    setActiveTab('grammar');
  }, [teacherUi.disableTeacherWriting]);

  const handleTeacherWritingStateChange = useCallback(
    (state: GrammarWritingTeacherState) => {
      if (teacherUi.disableTeacherWriting) {
        return;
      }

      setLatestTeacherWritingState(state);

      if (state.latestAnalysisResult) {
        setLatestAnalysisResult(state.latestAnalysisResult);
      }
    },
    [teacherUi.disableTeacherWriting],
  );

  const handleSubmitTeacherRevision = useCallback(
    async (payload: {
      originalText: string;
      revisedText: string;
      taskType?: string;
      focus?: string;
    }) => {
      if (teacherUi.disableTeacherWriting || teacherUi.disableGrammarAnalysis) {
        return null;
      }

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
    [
      activeTeacherTask,
      contentEn,
      roomId,
      roomTitle,
      teacherUi.disableGrammarAnalysis,
      teacherUi.disableTeacherWriting,
    ],
  );

  const handleSaveProfile = useCallback((nextProfile: CompanionProfile) => {
    setProfile(nextProfile);
  }, []);

  // Load student name from the shared profile cache.
  // `english_level` lives on `companion_state`, not `profiles`
  // (fetched separately via getCompanionProfile) — only safe profile
  // columns are read here.
  const { user: authUser } = useAuth();
  const { data: profileRow } = useProfileQuery(authUser?.id ?? null);
  useEffect(() => {
    if (!profileRow) return;
    const row = profileRow as {
      preferred_name?: string | null;
      full_name?: string | null;
      email?: string | null;
    };
    const fallback = row.email?.split('@')[0] ?? null;
    setProfile(prev => ({
      ...prev,
      preferred_name: row.preferred_name || row.full_name || fallback,
    } as CompanionProfile));
  }, [profileRow]);

  // Load points from Supabase on mount
  useEffect(() => {
    void loadPointsFromSupabase();
  }, []);

  if (!isEnabled) {
    return null;
  }

  const fullscreenStyle =
    isFullscreen && isMobileViewport()
      ? {
          top: 0,
          zIndex: FULLSCREEN_OVERLAY_Z_INDEX,
          paddingTop: 'env(safe-area-inset-top)',
        }
      : isFullscreen
        ? {
            zIndex: FULLSCREEN_OVERLAY_Z_INDEX,
          }
        : undefined;

  return (
    <>
      {!isOpen && (
        <div
          ref={bubbleRef}
          role="button"
          tabIndex={0}
          onPointerDown={handleBubblePointerDown}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              handleOpenGuideFromBubble();
            }
          }}
          className="fixed z-[90] flex select-none flex-col items-center"
          style={{
            right: bubblePos.right,
            bottom: bubblePos.bottom,
            touchAction: 'none',
          }}
          aria-label={
            teacherMode === 'kids'
              ? 'Open Mercy Kids'
              : 'Open Mercy Guide'
          }
        >
          <div
            className={cn(
              'overflow-hidden rounded-full border border-slate-200 bg-white shadow-lg transition hover:shadow-xl',
              showBubbleLabel ? 'h-20 w-20' : 'h-16 w-16',
            )}
          >
            <picture>
              <source srcSet={MERCY_HOST_IMAGE_AVIF} type="image/avif" />
              <source srcSet={MERCY_HOST_IMAGE_WEBP} type="image/webp" />
              <img
                src={MERCY_HOST_IMAGE_SRC}
                alt={teacherUi.bubbleLabel}
                width={640}
                height={640}
                decoding="async"
                onError={(event) => {
                  fallbackAvatar(event);
                  handleAvatarError();
                }}
                className="h-full w-full rounded-full object-cover object-[50%_32%] scale-110"
              />
            </picture>
          </div>

          {showBubbleLabel && (
            <span className="mt-2 text-sm font-semibold text-slate-700">
              {teacherUi.bubbleLabel}
            </span>
          )}
          {showBubbleLabel && teacherUi.bubbleSubtitle && (
            <span className="mt-0.5 text-xs font-medium text-slate-400">
              {teacherUi.bubbleSubtitle}
            </span>
          )}
        </div>
      )}

      {isOpen && (
        <React.Suspense fallback={null}>
        <div
          ref={panelRef}
          className={cn(
            'fixed overflow-hidden border border-slate-200 bg-white shadow-2xl',
            isFullscreen
              ? 'left-0 right-0 top-0 bottom-0 rounded-none border-0 shadow-none md:left-10 md:right-10 md:top-8 md:bottom-8 md:rounded-[24px] md:border md:border-slate-200 md:shadow-2xl lg:left-14 lg:right-14 lg:top-10 lg:bottom-10'
              : 'z-[95] rounded-[28px]',
          )}
          style={
            isFullscreen
              ? fullscreenStyle
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
            setActiveTab={(value: string) => {
              const nextTab = value as GuideTab;
              if (
                teacherMode === 'kids' &&
                (nextTab === 'grammar' || nextTab === 'logic')
              ) {
                setActiveTab('pronunciation');
                return;
              }
              setActiveTab(nextTab);
            }}
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
            initialPracticeLine={initialPracticeLine}
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
            teacherMode={teacherMode}
            isKidsMode={teacherMode === 'kids'}
            kidsModeAgeBand="3-4"
            bubbleLabel={teacherUi.bubbleLabel}
            bubbleSubtitle={teacherUi.bubbleSubtitle}
            panelTitle={teacherUi.bubbleLabel}
            availableTabs={teacherUi.availableTabs}
            hideGrammarTab={teacherUi.hideGrammarTab}
            hideLogicTab={teacherUi.hideLogicTab}
            disableTeacherWriting={teacherUi.disableTeacherWriting}
            disableGrammarAnalysis={teacherUi.disableGrammarAnalysis}
            disableEnglishLogic={teacherUi.disableEnglishLogic}
            preferPronunciationFirst={teacherUi.preferPronunciationFirst}
            preferTapAndRepeat={teacherUi.preferTapAndRepeat}
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
        </React.Suspense>
      )}
    </>
  );
}

export default MercyGuide;
