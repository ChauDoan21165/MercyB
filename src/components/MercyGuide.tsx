/**
 * File: MercyGuide.tsx
 * Path: src/components/MercyGuide.tsx
 * Version: v2026-03-25-responsive-width
 */

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  BookOpen,
  ChevronDown,
  GraduationCap,
  GripHorizontal,
  MessageCircleQuestion,
  Mic,
  Sparkles,
  User,
  X,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { useMercyGuide } from '@/hooks/useMercyGuide';
import { CompanionProfile, getCompanionProfile } from '@/services/companion';
import { SuggestedItem, getSuggestionsForUser } from '@/services/suggestions';
import {
  StudyLogEntry,
  getRecentMoods,
  getYesterdayAndTodaySummary,
} from '@/services/studyLog';
import { MercyGuideProfileSettings } from './MercyGuideProfileSettings';
import {
  buildMercyContext,
  getBreathingReplyId,
  getGreetingReplyId,
  getMercyReply,
  preloadMercyLibrary,
} from '@/mercy';
import {
  MERCY_HOST_IMAGE_FALLBACK,
  MERCY_HOST_IMAGE_SRC,
  getCheckInMessage,
} from './mercy-guide/shared';
import { useTroubleWordsVault } from './mercy-guide/hooks/useTroubleWordsVault';
import { useSpeakPractice } from './mercy-guide/hooks/useSpeakPractice';
import { DailyCoachCard } from './mercy-guide/DailyCoachCard';
import { MercyGuideTab } from './mercy-guide/MercyGuideTab';
import { MercyTeacherTab } from './mercy-guide/MercyTeacherTab';
import { MercyEnglishTab } from './mercy-guide/MercyEnglishTab';
import { MercySpeakTab } from './mercy-guide/MercySpeakTab';
import { MercySuggestTab } from './mercy-guide/MercySuggestTab';

interface MercyGuideProps {
  roomId?: string;
  roomTitle?: string;
  tier?: string;
  pathSlug?: string;
  tags?: string[];
  contentEn?: string;
}

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

const DEFAULT_PANEL_HEIGHT_RATIO = 0.75;
const DEFAULT_PANEL_RIGHT = 24;
const DEFAULT_PANEL_BOTTOM = 80;
const MIN_PANEL_WIDTH = 340;
const MIN_PANEL_HEIGHT = 480;
const MIN_PANEL_MARGIN = 8;
const MOBILE_PANEL_TOP_SAFE = 12;
const MOBILE_PANEL_BOTTOM_SAFE = 108;
const PANEL_SIZE_STORAGE_KEY = 'mercy-guide-panel-size';
const PANEL_SIZE_STORAGE_KEY_MOBILE = 'mercy-guide-panel-size-mobile';
const PANEL_SIZE_STORAGE_KEY_DESKTOP = 'mercy-guide-panel-size-desktop';

const BUBBLE_SIZE = 64;
const BUBBLE_SAFE_MARGIN = 12;
const DEFAULT_BUBBLE_RIGHT = 16;
const DEFAULT_BUBBLE_BOTTOM = 96;
const BUBBLE_POSITION_STORAGE_KEY = 'mercy-guide-bubble-position';

const EDGE_HANDLE_THICKNESS = 12;
const CORNER_HANDLE_SIZE = 18;

function isMobileViewport() {
  return typeof window !== 'undefined' && window.innerWidth < 768;
}

function getPanelWidthPolicy() {
  if (typeof window === 'undefined') {
    return {
      defaultWidth: 560,
      maxWidth: 960,
    };
  }

  const vw = window.innerWidth;

  if (vw < 768) {
    return {
      defaultWidth: Math.min(400, vw - 24),
      maxWidth: Math.min(440, vw - 16),
    };
  }

  if (vw < 1200) {
    return {
      defaultWidth: 560,
      maxWidth: Math.min(820, vw - 32),
    };
  }

  return {
    defaultWidth: 640,
    maxWidth: Math.min(1040, vw - 48),
  };
}

function getPanelHeightPolicy() {
  if (typeof window === 'undefined') {
    return {
      maxHeight: 900,
    };
  }

  if (window.innerWidth < 768) {
    return {
      maxHeight: Math.min(820, window.innerHeight - MOBILE_PANEL_TOP_SAFE - MOBILE_PANEL_BOTTOM_SAFE),
    };
  }

  return {
    maxHeight: Math.min(960, window.innerHeight - MIN_PANEL_MARGIN * 2),
  };
}

function getPanelStorageKey() {
  if (typeof window === 'undefined') return PANEL_SIZE_STORAGE_KEY;
  return isMobileViewport() ? PANEL_SIZE_STORAGE_KEY_MOBILE : PANEL_SIZE_STORAGE_KEY_DESKTOP;
}

export function MercyGuide({
  roomId,
  roomTitle,
  tier,
  pathSlug,
  tags,
  contentEn,
}: MercyGuideProps) {
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('guide');
  const [showSettings, setShowSettings] = useState(false);
  const [coachStage, setCoachStage] = useState<'intro' | 'coach' | 'dismissed'>('intro');

  const [profile, setProfile] = useState<CompanionProfile>({});
  const [checkInMessage, setCheckInMessage] = useState<{ en: string; vi: string } | null>(
    null
  );
  const [suggestions, setSuggestions] = useState<SuggestedItem[]>([]);
  const [yesterdaySummary, setYesterdaySummary] = useState<StudyLogEntry | undefined>();
  const [todayTotalMinutes, setTodayTotalMinutes] = useState(0);
  const [hasHeavyMoods, setHasHeavyMoods] = useState(false);

  const [showBreathingScript, setShowBreathingScript] = useState(false);
  const [breathingStep, setBreathingStep] = useState(0);
  const [showReframe, setShowReframe] = useState(false);

  const initialWidthPolicy = getPanelWidthPolicy();
  const [panelRect, setPanelRect] = useState<PanelRect>({
    width: initialWidthPolicy.defaultWidth,
    height: MIN_PANEL_HEIGHT,
    right: DEFAULT_PANEL_RIGHT,
    bottom: DEFAULT_PANEL_BOTTOM,
  });

  const [bubblePos, setBubblePos] = useState<BubblePos>({
    right: DEFAULT_BUBBLE_RIGHT,
    bottom: DEFAULT_BUBBLE_BOTTOM,
  });

  const {
    articles,
    isEnabled,
    canAskQuestion,
    incrementQuestionCount,
    getQuestionsRemaining,
  } = useMercyGuide();

  const { troubleWords, addToTroubleWords } = useTroubleWordsVault();

  const speakPractice = useSpeakPractice({
    contentEn,
    englishLevel: profile.english_level,
    preferredName: profile.preferred_name,
    addToTroubleWords,
  });

  const {
    resetPlaybackState,
    resetPracticeState,
    handleVaultReplay: replayVaultWord,
  } = speakPractice;

  const hasEnglishContext = Boolean(contentEn || roomId);

  const clampPanelRect = useCallback((next: PanelRect): PanelRect => {
    const mobile = isMobileViewport();
    const leftSafe = MIN_PANEL_MARGIN;
    const rightSafe = MIN_PANEL_MARGIN;
    const topSafe = mobile ? MOBILE_PANEL_TOP_SAFE : MIN_PANEL_MARGIN;
    const bottomSafe = mobile ? MOBILE_PANEL_BOTTOM_SAFE : MIN_PANEL_MARGIN;
    const widthPolicy = getPanelWidthPolicy();
    const heightPolicy = getPanelHeightPolicy();

    if (typeof window === 'undefined') {
      return {
        width: Math.min(widthPolicy.maxWidth, Math.max(MIN_PANEL_WIDTH, next.width)),
        height: Math.min(heightPolicy.maxHeight, Math.max(MIN_PANEL_HEIGHT, next.height)),
        right: Math.max(rightSafe, next.right),
        bottom: Math.max(bottomSafe, next.bottom),
      };
    }

    const maxWidth = Math.min(widthPolicy.maxWidth, window.innerWidth - leftSafe - rightSafe);
    const maxHeight = Math.min(heightPolicy.maxHeight, window.innerHeight - topSafe - bottomSafe);
    const minWidth = Math.min(MIN_PANEL_WIDTH, maxWidth);
    const minHeight = Math.min(MIN_PANEL_HEIGHT, maxHeight);

    const width = Math.min(maxWidth, Math.max(minWidth, next.width));
    const height = Math.min(maxHeight, Math.max(minHeight, next.height));
    const maxRight = Math.max(rightSafe, window.innerWidth - width - leftSafe);
    const maxBottom = Math.max(bottomSafe, window.innerHeight - height - topSafe);

    return {
      width,
      height,
      right: Math.min(maxRight, Math.max(rightSafe, next.right)),
      bottom: Math.min(maxBottom, Math.max(bottomSafe, next.bottom)),
    };
  }, []);

  const clampBubblePos = useCallback((next: BubblePos): BubblePos => {
    if (typeof window === 'undefined') {
      return {
        right: Math.max(BUBBLE_SAFE_MARGIN, next.right),
        bottom: Math.max(BUBBLE_SAFE_MARGIN, next.bottom),
      };
    }

    const maxRight = Math.max(
      BUBBLE_SAFE_MARGIN,
      window.innerWidth - BUBBLE_SIZE - BUBBLE_SAFE_MARGIN
    );
    const maxBottom = Math.max(
      BUBBLE_SAFE_MARGIN,
      window.innerHeight - BUBBLE_SIZE - BUBBLE_SAFE_MARGIN
    );

    return {
      right: Math.min(maxRight, Math.max(BUBBLE_SAFE_MARGIN, next.right)),
      bottom: Math.min(maxBottom, Math.max(BUBBLE_SAFE_MARGIN, next.bottom)),
    };
  }, []);

  const getOpenPanelRectFromBubble = useCallback(
    (bubble: BubblePos, current: PanelRect): PanelRect => {
      const mobile = isMobileViewport();

      const candidate: PanelRect = {
        width: current.width,
        height: current.height,
        right: mobile ? bubble.right : Math.max(MIN_PANEL_MARGIN, bubble.right - 8),
        bottom: mobile ? MOBILE_PANEL_BOTTOM_SAFE : Math.max(MIN_PANEL_MARGIN, bubble.bottom - 8),
      };

      const clamped = clampPanelRect(candidate);

      if (!mobile) return clamped;

      const openOnRightHalf =
        typeof window !== 'undefined' ? bubble.right < window.innerWidth / 2 : true;

      return clampPanelRect({
        ...clamped,
        right: openOnRightHalf
          ? Math.max(MIN_PANEL_MARGIN, bubble.right)
          : Math.max(MIN_PANEL_MARGIN, bubble.right - 120),
        bottom: MOBILE_PANEL_BOTTOM_SAFE,
      });
    },
    [clampPanelRect]
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const widthPolicy = getPanelWidthPolicy();
    const fallbackRect = clampPanelRect({
      width: widthPolicy.defaultWidth,
      height: Math.round(window.innerHeight * DEFAULT_PANEL_HEIGHT_RATIO),
      right: DEFAULT_PANEL_RIGHT,
      bottom: DEFAULT_PANEL_BOTTOM,
    });

    try {
      const legacyStored = window.sessionStorage.getItem(PANEL_SIZE_STORAGE_KEY);
      const scopedStored = window.sessionStorage.getItem(getPanelStorageKey());
      const stored = scopedStored ?? legacyStored;

      if (stored) {
        const parsed = JSON.parse(stored) as Partial<PanelRect>;
        setPanelRect(
          clampPanelRect({
            width: parsed.width ?? fallbackRect.width,
            height: parsed.height ?? fallbackRect.height,
            right: parsed.right ?? fallbackRect.right,
            bottom: parsed.bottom ?? fallbackRect.bottom,
          })
        );
        return;
      }
    } catch (error) {
      console.error('Failed to restore Mercy Guide panel size:', error);
    }

    setPanelRect(fallbackRect);
  }, [clampPanelRect]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const stored = window.sessionStorage.getItem(BUBBLE_POSITION_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Partial<BubblePos>;
        setBubblePos(
          clampBubblePos({
            right: parsed.right ?? DEFAULT_BUBBLE_RIGHT,
            bottom: parsed.bottom ?? DEFAULT_BUBBLE_BOTTOM,
          })
        );
        return;
      }
    } catch (error) {
      console.error('Failed to restore Mercy Guide bubble position:', error);
    }

    setBubblePos(
      clampBubblePos({
        right: DEFAULT_BUBBLE_RIGHT,
        bottom: DEFAULT_BUBBLE_BOTTOM,
      })
    );
  }, [clampBubblePos]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      window.sessionStorage.setItem(getPanelStorageKey(), JSON.stringify(panelRect));
      window.sessionStorage.setItem(PANEL_SIZE_STORAGE_KEY, JSON.stringify(panelRect));
    } catch (error) {
      console.error('Failed to persist Mercy Guide panel size:', error);
    }
  }, [panelRect]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      window.sessionStorage.setItem(BUBBLE_POSITION_STORAGE_KEY, JSON.stringify(bubblePos));
    } catch (error) {
      console.error('Failed to persist Mercy Guide bubble position:', error);
    }
  }, [bubblePos]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleWindowResize = () => {
      setPanelRect((prev) => {
        const widthPolicy = getPanelWidthPolicy();
        const fallbackNext = clampPanelRect({
          ...prev,
          width: !isMobileViewport() && prev.width < widthPolicy.defaultWidth
            ? widthPolicy.defaultWidth
            : prev.width,
        });

        try {
          const stored = window.sessionStorage.getItem(getPanelStorageKey());
          if (stored) {
            const parsed = JSON.parse(stored) as Partial<PanelRect>;
            return clampPanelRect({
              width: parsed.width ?? fallbackNext.width,
              height: parsed.height ?? fallbackNext.height,
              right: parsed.right ?? fallbackNext.right,
              bottom: parsed.bottom ?? fallbackNext.bottom,
            });
          }
        } catch (error) {
          console.error('Failed to sync Mercy Guide panel size on resize:', error);
        }

        return fallbackNext;
      });

      setBubblePos((prev) => clampBubblePos(prev));
    };

    window.addEventListener('resize', handleWindowResize);
    return () => window.removeEventListener('resize', handleWindowResize);
  }, [clampBubblePos, clampPanelRect]);

  useEffect(() => {
    if (!isOpen) return;
    setPanelRect((prev) => clampPanelRect(prev));
  }, [isOpen, clampPanelRect]);

  const greeting = useMemo(
    () =>
      profile.preferred_name
        ? {
            en: `Hi, ${profile.preferred_name}. How can I help?`,
            vi: `Chào ${profile.preferred_name}. Mình giúp gì được cho bạn?`,
          }
        : {
            en: 'Hi! How can I help?',
            vi: 'Chào bạn! Mình giúp gì được?',
          },
    [profile.preferred_name]
  );

  const handleAvatarError = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const img = e.currentTarget;

      if (!img.dataset.fallbackApplied) {
        img.dataset.fallbackApplied = 'true';
        img.src = MERCY_HOST_IMAGE_FALLBACK;
        return;
      }

      img.style.display = 'none';
      const parent = img.parentElement;

      if (parent) {
        parent.classList.add('flex', 'items-center', 'justify-center');
        parent.innerHTML =
          '<span class="text-xs font-semibold text-rose-700">MH</span>';
      }
    },
    []
  );

  const openGuideFromBubble = useCallback(() => {
    setPanelRect((prev) => getOpenPanelRectFromBubble(bubblePos, prev));
    setIsOpen(true);
  }, [bubblePos, getOpenPanelRectFromBubble]);

  const handleCollapseGuide = useCallback(() => {
    resetPlaybackState();
    setShowSettings(false);
    setIsOpen(false);
  }, [resetPlaybackState]);

  const handleCloseGuide = useCallback(() => {
    resetPracticeState();
    setShowSettings(false);
    setIsOpen(false);
  }, [resetPracticeState]);

  const handleNavigateSuggestion = useCallback(
    (item: SuggestedItem) => {
      const url = item.type === 'path' ? `/paths/${item.slug}` : `/room/${item.slug}`;
      navigate(url);
      setIsOpen(false);
    },
    [navigate]
  );

  const handleVaultReplay = useCallback(
    (word: string) => {
      setActiveTab('speak');
      replayVaultWord(word);
    },
    [replayVaultWord]
  );

  const handleBubblePointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();

      const startX = event.clientX;
      const startY = event.clientY;
      const startPos = bubblePos;
      const pointerId = event.pointerId;
      let moved = false;

      const onPointerMove = (moveEvent: PointerEvent) => {
        if (moveEvent.pointerId !== pointerId) return;

        const dx = moveEvent.clientX - startX;
        const dy = moveEvent.clientY - startY;

        if (Math.abs(dx) > 4 || Math.abs(dy) > 4) moved = true;

        setBubblePos(
          clampBubblePos({
            right: startPos.right - dx,
            bottom: startPos.bottom - dy,
          })
        );
      };

      const onPointerUp = (upEvent: PointerEvent) => {
        if (upEvent.pointerId !== pointerId) return;

        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerup', onPointerUp);
        window.removeEventListener('pointercancel', onPointerUp);

        if (!moved) {
          openGuideFromBubble();
        }
      };

      window.addEventListener('pointermove', onPointerMove, { passive: false });
      window.addEventListener('pointerup', onPointerUp);
      window.addEventListener('pointercancel', onPointerUp);
    },
    [bubblePos, clampBubblePos, openGuideFromBubble]
  );

  const handlePanelDragStart = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest('button')) return;

      event.preventDefault();

      const startX = event.clientX;
      const startY = event.clientY;
      const startRect = panelRect;
      const pointerId = event.pointerId;
      const previousUserSelect = document.body.style.userSelect;

      document.body.style.userSelect = 'none';

      const onPointerMove = (moveEvent: PointerEvent) => {
        if (moveEvent.pointerId !== pointerId) return;

        const dx = moveEvent.clientX - startX;
        const dy = moveEvent.clientY - startY;

        setPanelRect(
          clampPanelRect({
            ...startRect,
            right: startRect.right - dx,
            bottom: startRect.bottom - dy,
          })
        );
      };

      const cleanup = () => {
        document.body.style.userSelect = previousUserSelect;
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerup', onPointerUp);
        window.removeEventListener('pointercancel', onPointerUp);
      };

      const onPointerUp = (upEvent: PointerEvent) => {
        if (upEvent.pointerId !== pointerId) return;
        cleanup();
      };

      window.addEventListener('pointermove', onPointerMove);
      window.addEventListener('pointerup', onPointerUp);
      window.addEventListener('pointercancel', onPointerUp);
    },
    [clampPanelRect, panelRect]
  );

  const handleResizePointerDown = useCallback(
    (direction: ResizeDirection) => (event: React.PointerEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();

      const startX = event.clientX;
      const startY = event.clientY;
      const startRect = panelRect;
      const pointerId = event.pointerId;
      const handleElement = event.currentTarget;
      const previousUserSelect = document.body.style.userSelect;

      document.body.style.userSelect = 'none';

      if (handleElement.setPointerCapture) {
        try {
          handleElement.setPointerCapture(pointerId);
        } catch (error) {
          console.error('Failed to capture resize pointer:', error);
        }
      }

      const handlePointerMove = (moveEvent: PointerEvent) => {
        if (moveEvent.pointerId !== pointerId) return;

        const dx = moveEvent.clientX - startX;
        const dy = moveEvent.clientY - startY;

        let nextRect: PanelRect = { ...startRect };

        if (direction.includes('left')) {
          nextRect.width = startRect.width - dx;
        }

        if (direction.includes('right')) {
          nextRect.width = startRect.width + dx;
          nextRect.right = startRect.right - dx;
        }

        if (direction.includes('top')) {
          nextRect.height = startRect.height - dy;
        }

        if (direction.includes('bottom')) {
          nextRect.height = startRect.height + dy;
          nextRect.bottom = startRect.bottom - dy;
        }

        setPanelRect(clampPanelRect(nextRect));
      };

      const cleanup = () => {
        document.body.style.userSelect = previousUserSelect;
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('pointerup', handlePointerUp);
        window.removeEventListener('pointercancel', handlePointerUp);

        if (handleElement.releasePointerCapture) {
          try {
            if (handleElement.hasPointerCapture?.(pointerId)) {
              handleElement.releasePointerCapture(pointerId);
            }
          } catch (error) {
            console.error('Failed to release resize pointer:', error);
          }
        }
      };

      const handlePointerUp = (upEvent: PointerEvent) => {
        if (upEvent.pointerId !== pointerId) return;
        cleanup();
      };

      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
      window.addEventListener('pointercancel', handlePointerUp);
    },
    [clampPanelRect, panelRect]
  );

  useEffect(() => {
    preloadMercyLibrary();
  }, []);

  useEffect(() => {
    if (!isOpen || showSettings) {
      setCoachStage('intro');
      return;
    }

    setCoachStage('intro');
  }, [isOpen, showSettings]);

  useEffect(() => {
    if (!isOpen) return;

    async function loadData() {
      try {
        const profileData = await getCompanionProfile();
        setProfile(profileData);

        const ctx = buildMercyContext({
          lastActiveAt: profileData.last_english_activity,
          isFirstVisit: !profileData.last_english_activity,
        });

        const greetingId = getGreetingReplyId(ctx);
        const greetingReply = await getMercyReply(greetingId);

        if (greetingReply) {
          setCheckInMessage({
            en: greetingReply.text_en,
            vi: greetingReply.text_vi,
          });
        } else {
          const message = getCheckInMessage(
            profileData,
            undefined,
            profileData.last_english_activity || undefined
          );
          setCheckInMessage(message);
        }

        await getMercyReply(getBreathingReplyId('intro'));

        const suggestionsData = await getSuggestionsForUser({
          profile: profileData,
          lastRoomId: roomId,
          lastTags: tags,
        });
        setSuggestions(suggestionsData);

        const summary = await getYesterdayAndTodaySummary();
        setYesterdaySummary(summary.yesterday);
        setTodayTotalMinutes(summary.todayTotalMinutes);

        const recentMoods = await getRecentMoods(3);
        const heavyCount = recentMoods.filter(
          (m) => m === 'heavy' || m === 'anxious'
        ).length;
        setHasHeavyMoods(heavyCount >= 2);
      } catch (error) {
        console.error('Failed to load guide data:', error);
      }
    }

    loadData();
  }, [isOpen, roomId, tags]);

  if (!isEnabled) return null;

  const widthPolicy = getPanelWidthPolicy();
  const heightPolicy = getPanelHeightPolicy();

  return (
    <>
      {!isOpen && (
        <div
          className="fixed z-40 select-none"
          style={{
            right: bubblePos.right,
            bottom: bubblePos.bottom,
            touchAction: 'none',
            WebkitUserSelect: 'none',
            userSelect: 'none',
          }}
        >
          <div className="relative flex items-end justify-end">
            <div className="absolute -left-16 top-2 z-0 hidden rotate-[-14deg] rounded-[20px] bg-white px-2.5 py-2 shadow-lg ring-1 ring-black/5 transition-transform duration-200 sm:block">
              <div className="leading-none">
                <p className="text-[13px] font-extrabold tracking-tight text-black">
                  Mercy Host
                </p>
                <p className="mt-1 text-[10px] font-medium text-black/70">
                  Need a guide?
                </p>
              </div>
            </div>

            <div
              role="button"
              tabIndex={0}
              onPointerDown={handleBubblePointerDown}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  openGuideFromBubble();
                }
              }}
              aria-label="Open Mercy Guide"
              className="relative z-10 h-16 w-16 cursor-grab rounded-full bg-pink-200 p-[3px] shadow-xl ring-2 ring-white active:cursor-grabbing"
            >
              <div className="h-full w-full overflow-hidden rounded-full bg-gradient-to-b from-pink-100 to-rose-100">
                <img
                  src={MERCY_HOST_IMAGE_SRC}
                  alt="Mercy Host"
                  className="pointer-events-none h-full w-full object-cover object-center"
                  loading="eager"
                  decoding="async"
                  draggable={false}
                  onError={handleAvatarError}
                />
              </div>
              <div className="pointer-events-none absolute inset-0 rounded-full bg-white/10" />
            </div>
          </div>
        </div>
      )}

      {isOpen && (
        <div
          className="fixed z-50 flex flex-col overflow-hidden rounded-xl border border-border bg-white shadow-2xl"
          style={{
            width: panelRect.width,
            height: panelRect.height,
            right: panelRect.right,
            bottom: panelRect.bottom,
            minWidth: Math.min(MIN_PANEL_WIDTH, panelRect.width),
            minHeight: Math.min(MIN_PANEL_HEIGHT, panelRect.height),
            maxWidth: `min(${widthPolicy.maxWidth}px, calc(100vw - ${MIN_PANEL_MARGIN * 2}px))`,
            maxHeight: `min(${heightPolicy.maxHeight}px, calc(100vh - ${MIN_PANEL_MARGIN * 2}px))`,
          }}
        >
          <div
            className="flex cursor-move items-center justify-between border-b border-border bg-muted/20 px-4 py-3"
            onPointerDown={handlePanelDragStart}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-6 items-center justify-center rounded-md text-muted-foreground/70">
                <GripHorizontal className="h-4 w-4" />
              </div>

              <div className="h-10 w-10 overflow-hidden rounded-full bg-pink-100 ring-2 ring-pink-200">
                <img
                  src={MERCY_HOST_IMAGE_SRC}
                  alt="Mercy Host"
                  className="h-full w-full object-cover object-center"
                  loading="eager"
                  decoding="async"
                  onError={handleAvatarError}
                />
              </div>

              <div>
                <h3 className="font-semibold text-foreground md:text-[17px]">Mercy Guide</h3>
                <p className="text-xs text-muted-foreground md:text-sm">{greeting.en}</p>
                <p className="text-[11px] text-muted-foreground/80 md:text-xs">{greeting.vi}</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setShowSettings(!showSettings)}
                title="Settings"
              >
                <User className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleCollapseGuide}
                title="Collapse"
              >
                <ChevronDown className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleCloseGuide}
                title="Close"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {showSettings && (
            <MercyGuideProfileSettings
              onClose={() => setShowSettings(false)}
              onSaved={(newProfile) =>
                setProfile((prev) => ({
                  ...prev,
                  ...newProfile,
                }))
              }
            />
          )}

          {!showSettings && (
            <>
              {checkInMessage && (
                <div className="border-b border-primary/10 bg-primary/5 px-4 py-2 md:px-5 md:py-3">
                  <p className="text-sm text-foreground md:text-[15px]">{checkInMessage.en}</p>
                  <p className="text-xs text-muted-foreground md:text-[13px]">{checkInMessage.vi}</p>
                </div>
              )}

              {!profile.preferred_name && (
                <button
                  onClick={() => setShowSettings(true)}
                  className="border-b border-border bg-white px-4 py-2 text-left text-xs text-primary hover:underline md:px-5 md:py-3 md:text-sm"
                >
                  Tell me your name →
                </button>
              )}

              {coachStage !== 'dismissed' && (
                <div className="shrink-0 px-3 pt-2 md:px-4 md:pt-3">
                  {coachStage === 'intro' && (
                    <div className="rounded-xl border border-primary/10 bg-primary/5 p-3 md:p-4">
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-foreground md:text-base">Mercy</p>
                        <p className="text-sm text-foreground md:text-[15px]">
                          I can guide you with one short speaking step today.
                        </p>
                        <p className="text-xs text-muted-foreground md:text-[13px]">
                          It only takes a moment.
                        </p>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <Button size="sm" onClick={() => setCoachStage('coach')}>
                          Start with one phrase
                        </Button>

                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setCoachStage('dismissed')}
                        >
                          Maybe later
                        </Button>
                      </div>
                    </div>
                  )}

                  {coachStage === 'coach' && (
                    <div className="max-h-[160px] overflow-y-auto pr-1 animate-in fade-in duration-200">
                      <DailyCoachCard
                        profile={profile}
                        contentEn={contentEn}
                        troubleWords={troubleWords}
                        speakPractice={speakPractice}
                        onOpenSpeak={() => setActiveTab('speak')}
                      />
                    </div>
                  )}
                </div>
              )}

              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="flex min-h-0 flex-1 flex-col overflow-hidden"
              >
                <TabsList className="mx-3 mt-2 shrink-0 grid grid-cols-5 rounded-xl border border-border/60 bg-muted/50 p-1 shadow-sm md:mx-4 md:mt-3 md:p-1.5">
                  <TabsTrigger
                    value="guide"
                    className={cn(
                      'h-9 gap-1 rounded-lg border px-2 text-[11px] font-semibold transition-all md:h-10 md:px-3 md:text-[12px]',
                      'border-transparent text-muted-foreground opacity-75',
                      'data-[state=active]:border-border data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:opacity-100 data-[state=active]:shadow-sm',
                      'data-[state=inactive]:hover:bg-white/80 data-[state=inactive]:hover:text-foreground'
                    )}
                  >
                    <MessageCircleQuestion className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">Guide</span>
                  </TabsTrigger>

                  <TabsTrigger
                    value="teacher"
                    className={cn(
                      'h-9 gap-1 rounded-lg border px-2 text-[11px] font-semibold transition-all md:h-10 md:px-3 md:text-[12px]',
                      'border-transparent text-muted-foreground opacity-75',
                      'data-[state=active]:border-border data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:opacity-100 data-[state=active]:shadow-sm',
                      'data-[state=inactive]:hover:bg-white/80 data-[state=inactive]:hover:text-foreground'
                    )}
                  >
                    <GraduationCap className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">Teacher</span>
                  </TabsTrigger>

                  <TabsTrigger
                    value="english"
                    className={cn(
                      'h-9 gap-1 rounded-lg border px-2 text-[11px] font-semibold transition-all md:h-10 md:px-3 md:text-[12px]',
                      hasEnglishContext
                        ? 'border-transparent text-muted-foreground opacity-75'
                        : 'border-transparent text-muted-foreground/70 opacity-65',
                      'data-[state=active]:border-border data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:opacity-100 data-[state=active]:shadow-sm',
                      'data-[state=inactive]:hover:bg-white/80 data-[state=inactive]:hover:text-foreground'
                    )}
                  >
                    <BookOpen className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">English</span>
                  </TabsTrigger>

                  <TabsTrigger
                    value="speak"
                    className={cn(
                      'h-9 gap-1 rounded-lg border px-2 text-[11px] font-semibold transition-all md:h-10 md:px-3 md:text-[12px]',
                      'border-transparent text-muted-foreground opacity-75',
                      'data-[state=active]:border-border data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:opacity-100 data-[state=active]:shadow-sm',
                      'data-[state=inactive]:hover:bg-white/80 data-[state=inactive]:hover:text-foreground'
                    )}
                  >
                    <Mic className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">Speak</span>
                  </TabsTrigger>

                  <TabsTrigger
                    value="suggest"
                    className={cn(
                      'h-9 gap-1 rounded-lg border px-2 text-[11px] font-semibold transition-all md:h-10 md:px-3 md:text-[12px]',
                      'border-transparent text-muted-foreground opacity-75',
                      'data-[state=active]:border-border data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:opacity-100 data-[state=active]:shadow-sm',
                      'data-[state=inactive]:hover:bg-white/80 data-[state=inactive]:hover:text-foreground'
                    )}
                  >
                    <Sparkles className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">For You</span>
                  </TabsTrigger>
                </TabsList>

                <div className="relative min-h-0 flex-1 overflow-hidden">
                  <MercyGuideTab
                    articles={articles}
                    canAskQuestion={canAskQuestion}
                    incrementQuestionCount={incrementQuestionCount}
                    getQuestionsRemaining={getQuestionsRemaining}
                    roomId={roomId}
                    roomTitle={roomTitle}
                    tier={tier}
                    pathSlug={pathSlug}
                    tags={tags}
                    englishLevel={profile.english_level}
                    learningGoal={profile.learning_goal}
                    onRequestSpeakTab={() => setActiveTab('speak')}
                  />

                  <MercyTeacherTab
                    profile={profile}
                    yesterdaySummary={yesterdaySummary}
                    todayTotalMinutes={todayTotalMinutes}
                    hasHeavyMoods={hasHeavyMoods}
                    suggestions={suggestions}
                    showBreathingScript={showBreathingScript}
                    breathingStep={breathingStep}
                    showReframe={showReframe}
                    setShowBreathingScript={setShowBreathingScript}
                    setBreathingStep={setBreathingStep}
                    setShowReframe={setShowReframe}
                    onNavigateSuggestion={handleNavigateSuggestion}
                  />

                  <MercyEnglishTab
                    roomId={roomId}
                    roomTitle={roomTitle}
                    contentEn={contentEn}
                    englishLevel={profile.english_level}
                    troubleWords={troubleWords}
                    onVaultReplay={handleVaultReplay}
                    onRequestGuideTab={() => setActiveTab('guide')}
                  />

                  <MercySpeakTab
                    roomId={roomId}
                    contentEn={contentEn}
                    profile={profile}
                    troubleWords={troubleWords}
                    speakPractice={speakPractice}
                  />

                  <MercySuggestTab
                    suggestions={suggestions}
                    onNavigateSuggestion={handleNavigateSuggestion}
                  />
                </div>
              </Tabs>
            </>
          )}

          <div
            className="absolute inset-x-3 top-0 z-20 touch-none"
            style={{ height: EDGE_HANDLE_THICKNESS, cursor: 'n-resize' }}
            onPointerDown={handleResizePointerDown('top')}
          />
          <div
            className="absolute inset-x-3 bottom-0 z-20 touch-none"
            style={{ height: EDGE_HANDLE_THICKNESS, cursor: 's-resize' }}
            onPointerDown={handleResizePointerDown('bottom')}
          />
          <div
            className="absolute inset-y-3 left-0 z-20 touch-none"
            style={{ width: EDGE_HANDLE_THICKNESS, cursor: 'w-resize' }}
            onPointerDown={handleResizePointerDown('left')}
          />
          <div
            className="absolute inset-y-3 right-0 z-20 touch-none"
            style={{ width: EDGE_HANDLE_THICKNESS, cursor: 'e-resize' }}
            onPointerDown={handleResizePointerDown('right')}
          />
          <div
            className="absolute left-0 top-0 z-30 flex touch-none items-start justify-start"
            style={{ width: CORNER_HANDLE_SIZE, height: CORNER_HANDLE_SIZE, cursor: 'nw-resize' }}
            onPointerDown={handleResizePointerDown('top-left')}
          >
            <div className="ml-1 mt-1 h-2.5 w-2.5 rounded-full border border-border/70 bg-background shadow-sm" />
          </div>
          <div
            className="absolute right-0 top-0 z-30 flex touch-none items-start justify-end"
            style={{ width: CORNER_HANDLE_SIZE, height: CORNER_HANDLE_SIZE, cursor: 'ne-resize' }}
            onPointerDown={handleResizePointerDown('top-right')}
          >
            <div className="mr-1 mt-1 h-2.5 w-2.5 rounded-full border border-border/70 bg-background shadow-sm" />
          </div>
          <div
            className="absolute bottom-0 left-0 z-30 flex touch-none items-end justify-start"
            style={{ width: CORNER_HANDLE_SIZE, height: CORNER_HANDLE_SIZE, cursor: 'sw-resize' }}
            onPointerDown={handleResizePointerDown('bottom-left')}
          >
            <div className="mb-1 ml-1 h-2.5 w-2.5 rounded-full border border-border/70 bg-background shadow-sm" />
          </div>
          <div
            className="absolute bottom-0 right-0 z-30 flex touch-none items-end justify-end"
            style={{ width: CORNER_HANDLE_SIZE, height: CORNER_HANDLE_SIZE, cursor: 'se-resize' }}
            onPointerDown={handleResizePointerDown('bottom-right')}
          >
            <div className="mb-1 mr-1 h-2.5 w-2.5 rounded-full border border-border/70 bg-background shadow-sm" />
          </div>
        </div>
      )}
    </>
  );
}
