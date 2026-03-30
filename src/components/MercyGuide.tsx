/**
 * File: MercyGuide.tsx
 * Path: src/components/MercyGuide.tsx
 */

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  BookOpen,
  ChevronDown,
  GraduationCap,
  GripHorizontal,
  HelpCircle,
  LifeBuoy,
  MapPin,
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
import { MercyTeacherTab } from './mercy-guide/MercyTeacherTab';
import { MercyEnglishTab } from './mercy-guide/MercyEnglishTab';
import { MercySpeakTab } from './mercy-guide/MercySpeakTab';
import { MercySuggestTab } from './mercy-guide/MercySuggestTab';

/**
 * MERCY_BLUE_PATH_FORWARD (SOP V4.0)
 * Contextual help constants for the Vietnamese market.
 */
const MERCY_BLUE_PATH_FORWARD = {
  idle: {
    vi: "Bạn cần giúp gì không? Hãy thử tab 'Speak' để luyện phát âm nhé!",
    en: "Need a hand? Try the 'Speak' tab to practice your pronunciation!"
  },
  navigation: {
    vi: "Bạn có thể hỏi mình về nội dung phòng này hoặc cách sử dụng các tính năng.",
    en: "You can ask me about this room's content or how to use the features."
  },
  switching: {
    vi: "Đang chuyển đổi... 'Teacher' giúp sửa lỗi, 'Speak' giúp luyện nói.",
    en: "Switching... 'Teacher' fixes mistakes, 'Speak' helps you talk."
  }
};

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

type RoomContextSummary = {
  hasRoomContext: boolean;
  roomName: string;
  tierLabel: string | null;
  topicLabel: string | null;
  shortSummary: string | null;
  usageHintEn: string;
  usageHintVi: string;
  whereAreWeEn: string | null;
  whereAreWeVi: string | null;
};

const DEFAULT_PANEL_HEIGHT_RATIO = 0.75;
const DEFAULT_PANEL_RIGHT = 24;
const DEFAULT_PANEL_BOTTOM = 80;
const MIN_PANEL_WIDTH = 340;
const MIN_PANEL_HEIGHT = 480;
const MIN_PANEL_MARGIN = 8;
const MOBILE_PANEL_TOP_SAFE = 12;
const MOBILE_PANEL_BOTTOM_SAFE = 108;

const PANEL_SIZE_STORAGE_KEY = 'mercy-guide-panel-size-v2';
const PANEL_SIZE_STORAGE_KEY_MOBILE = 'mercy-guide-panel-size-mobile-v2';
const PANEL_SIZE_STORAGE_KEY_DESKTOP = 'mercy-guide-panel-size-desktop-v2';

const BUBBLE_SIZE = 64;
const BUBBLE_SAFE_MARGIN = 12;
const BUBBLE_BOTTOM_SAFE_MOBILE = 112;
const BUBBLE_BOTTOM_SAFE_DESKTOP = 24;
const DEFAULT_BUBBLE_RIGHT = 16;
const DEFAULT_BUBBLE_BOTTOM = 112;
const BUBBLE_POSITION_STORAGE_KEY = 'mercy-guide-bubble-position-v2';

const EDGE_HANDLE_THICKNESS = 12;
const CORNER_HANDLE_SIZE = 18;

const GUIDE_TAB_BOTTOM_BUFFER_DESKTOP = 12;
const GUIDE_TAB_BOTTOM_BUFFER_MOBILE = 20;

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
      maxHeight: Math.min(
        820,
        window.innerHeight - MOBILE_PANEL_TOP_SAFE - MOBILE_PANEL_BOTTOM_SAFE
      ),
    };
  }
  return {
    maxHeight: Math.min(960, window.innerHeight - MIN_PANEL_MARGIN * 2),
  };
}

function getPanelStorageKey() {
  if (typeof window === 'undefined') return PANEL_SIZE_STORAGE_KEY;
  return isMobileViewport()
    ? PANEL_SIZE_STORAGE_KEY_MOBILE
    : PANEL_SIZE_STORAGE_KEY_DESKTOP;
}

function getBubbleBottomSafe() {
  return isMobileViewport()
    ? BUBBLE_BOTTOM_SAFE_MOBILE
    : BUBBLE_BOTTOM_SAFE_DESKTOP;
}

function getGuideTabBottomBuffer() {
  return isMobileViewport()
    ? GUIDE_TAB_BOTTOM_BUFFER_MOBILE
    : GUIDE_TAB_BOTTOM_BUFFER_DESKTOP;
}

function cleanText(value?: string | null) {
  if (!value) return '';
  return value.replace(/\s+/g, ' ').trim();
}

function stripHtml(value?: string | null) {
  if (!value) return '';
  return cleanText(value.replace(/<[^>]*>/g, ' '));
}

function sentenceCase(value?: string | null) {
  const text = cleanText(value);
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function truncateWords(value?: string | null, maxWords = 20) {
  const text = cleanText(value);
  if (!text) return '';
  const words = text.split(' ');
  if (words.length <= maxWords) return text;
  return `${words.slice(0, maxWords).join(' ')}…`;
}

function humanizeSlug(value?: string | null) {
  const text = cleanText(value);
  if (!text) return '';
  return sentenceCase(text.replace(/[-_/]+/g, ' '));
}

function deriveTopicLabel(tags?: string[], contentEn?: string) {
  const usableTags = (tags ?? [])
    .map((tag) => cleanText(tag))
    .filter(Boolean)
    .slice(0, 3);
  if (usableTags.length > 0) {
    return usableTags.join(', ');
  }
  const content = stripHtml(contentEn);
  if (!content) return null;
  const firstSentence =
    content.split(/[.!?]/).map((part) => cleanText(part)).find(Boolean) ?? '';
  return truncateWords(firstSentence, 12) || null;
}

function deriveRoomContextSummary({
  roomTitle,
  tier,
  pathSlug,
  tags,
  contentEn,
}: MercyGuideProps): RoomContextSummary {
  const safeRoomTitle = cleanText(roomTitle);
  const safeTier = cleanText(tier);
  const safeSlug = humanizeSlug(pathSlug);
  const topicLabel = deriveTopicLabel(tags, contentEn);
  const contentSummary = truncateWords(stripHtml(contentEn), 24);
  const roomName =
    safeRoomTitle || safeSlug || (safeTier ? `${safeTier} room` : 'this room');
  const hasRoomContext = Boolean(
    safeRoomTitle || safeTier || safeSlug || topicLabel || contentSummary
  );
  const shortSummary =
    contentSummary ||
    (topicLabel ? `${roomName} focuses on ${topicLabel}.` : null) ||
    (safeTier ? `${roomName} is part of the ${safeTier} tier.` : null);
  const whereAreWeEn = hasRoomContext
    ? `You are in ${roomName}${topicLabel ? `, focused on ${topicLabel}` : ''}.`
    : null;
  const whereAreWeVi = hasRoomContext
    ? `Bạn đang ở ${roomName}${topicLabel ? `, tập trung vào ${topicLabel}` : ''}.`
    : null;
  return {
    hasRoomContext,
    roomName,
    tierLabel: safeTier || null,
    topicLabel,
    shortSummary,
    usageHintEn: hasRoomContext
      ? `Ask me what this room is about, where we are, or how to use ${roomName}.`
      : 'Ask me what this room is about, where we are, or how to use this space.',
    usageHintVi: hasRoomContext
      ? `Bạn có thể hỏi mình phòng này nói về gì, chúng ta đang ở đâu, hoặc cách dùng ${roomName}.`
      : 'Bạn có thể hỏi mình phòng này nói về gì, chúng ta đang ở đâu, hoặc cách dùng không gian này.',
    whereAreWeEn,
    whereAreWeVi,
  };
}

function buildRoomAwareCheckIn(
  profile: CompanionProfile,
  roomSummary: RoomContextSummary
) {
  const preferredName = cleanText(profile.preferred_name);
  const introName = preferredName ? `${preferredName}, ` : '';
  if (!roomSummary.hasRoomContext) {
    return {
      en: preferredName
        ? `Welcome back, ${preferredName}. I’m here to guide you.`
        : 'Welcome back. I’m here to guide you.',
      vi: preferredName
        ? `Chào mừng quay lại, ${preferredName}. Mình ở đây để hướng dẫn bạn.`
        : 'Chào mừng quay lại. Mình ở đây để hướng dẫn bạn.',
    };
  }
  const roomSentence =
    roomSummary.whereAreWeEn ?? `You are in ${roomSummary.roomName}.`;
  const summarySentence = roomSummary.shortSummary
    ? truncateWords(roomSummary.shortSummary, 22)
    : null;
  return {
    en: `${introName}${roomSentence}${
      summarySentence ? ` ${summarySentence}` : ''
    } ${roomSummary.usageHintEn}`,
    vi: `${preferredName ? `${preferredName}, ` : ''}${
      roomSummary.whereAreWeVi ?? `Bạn đang ở ${roomSummary.roomName}.`
    } ${roomSummary.usageHintVi}`,
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
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('teacher');
  const [showSettings, setShowSettings] = useState(false);
  
  // UX State for Path Forward
  const [pathHint, setPathHint] = useState<{ vi: string, en: string } | null>(null);

  const [profile, setProfile] = useState<CompanionProfile>({});
  const [checkInMessage, setCheckInMessage] = useState<{
    en: string;
    vi: string;
  } | null>(null);
  const [suggestions, setSuggestions] = useState<SuggestedItem[]>([]);
  const [yesterdaySummary, setYesterdaySummary] = useState<
    StudyLogEntry | undefined
  >();
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
    isEnabled,
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
    [contentEn, pathSlug, roomId, roomTitle, tags, tier]
  );

  const hasEnglishContext = Boolean(
    contentEn || roomId || roomTitle || (tags && tags.length > 0)
  );

  const guideTabBottomBuffer = useMemo(
    () => getGuideTabBottomBuffer(),
    []
  );

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
        width: Math.min(
          widthPolicy.maxWidth,
          Math.max(MIN_PANEL_WIDTH, next.width)
        ),
        height: Math.min(
          heightPolicy.maxHeight,
          Math.max(MIN_PANEL_HEIGHT, next.height)
        ),
        right: Math.max(rightSafe, next.right),
        bottom: Math.max(bottomSafe, next.bottom),
      };
    }

    const maxWidth = Math.min(
      widthPolicy.maxWidth,
      window.innerWidth - leftSafe - rightSafe
    );
    const maxHeight = Math.min(
      heightPolicy.maxHeight,
      window.innerHeight - topSafe - bottomSafe
    );
    const minWidth = Math.min(MIN_PANEL_WIDTH, maxWidth);
    const minHeight = Math.min(MIN_PANEL_HEIGHT, maxHeight);

    const width = Math.min(maxWidth, Math.max(minWidth, next.width));
    const height = Math.min(maxHeight, Math.max(minHeight, next.height));
    const maxRight = Math.max(rightSafe, window.innerWidth - width - leftSafe);
    const maxBottom = Math.max(
      bottomSafe,
      window.innerHeight - height - topSafe
    );

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
        bottom: Math.max(getBubbleBottomSafe(), next.bottom),
      };
    }
    const bottomSafe = getBubbleBottomSafe();
    const maxRight = Math.max(
      BUBBLE_SAFE_MARGIN,
      window.innerWidth - BUBBLE_SIZE - BUBBLE_SAFE_MARGIN
    );
    const maxBottom = Math.max(
      bottomSafe,
      window.innerHeight - BUBBLE_SIZE - BUBBLE_SAFE_MARGIN
    );
    return {
      right: Math.min(maxRight, Math.max(BUBBLE_SAFE_MARGIN, next.right)),
      bottom: Math.min(maxBottom, Math.max(bottomSafe, next.bottom)),
    };
  }, []);

  const getOpenPanelRectFromBubble = useCallback(
    (bubble: BubblePos, current: PanelRect): PanelRect => {
      const mobile = isMobileViewport();
      const candidate: PanelRect = {
        width: current.width,
        height: current.height,
        right: mobile ? bubble.right : Math.max(MIN_PANEL_MARGIN, bubble.right - 8),
        bottom: mobile
          ? MOBILE_PANEL_BOTTOM_SAFE
          : Math.max(MIN_PANEL_MARGIN, bubble.bottom - 8),
      };
      const clamped = clampPanelRect(candidate);
      if (!mobile) return clamped;
      const openOnRightHalf =
        typeof window !== 'undefined'
          ? bubble.right < window.innerWidth / 2
          : true;
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
      const stored = window.sessionStorage.getItem(getPanelStorageKey());
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
      window.sessionStorage.setItem(
        getPanelStorageKey(),
        JSON.stringify(panelRect)
      );
    } catch (error) {
      console.error('Failed to persist Mercy Guide panel size:', error);
    }
  }, [panelRect]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.sessionStorage.setItem(
        BUBBLE_POSITION_STORAGE_KEY,
        JSON.stringify(bubblePos)
      );
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
          width:
            !isMobileViewport() && prev.width < widthPolicy.defaultWidth
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
          console.error(
            'Failed to sync Mercy Guide panel size on resize:',
            error
          );
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

  const guessedName = useMemo(() => {
    const profileWithExtras = profile as CompanionProfile & {
      display_name?: string | null;
      first_name?: string | null;
      name?: string | null;
    };
    return (
      cleanText(profile.preferred_name) ||
      cleanText(profileWithExtras.display_name) ||
      cleanText(profileWithExtras.first_name) ||
      cleanText(profileWithExtras.name) ||
      ''
    );
  }, [profile]);

  const greeting = useMemo(() => {
    if (guessedName && roomSummary.hasRoomContext) {
      return {
        en: `Hi, ${guessedName}. You’re in ${roomSummary.roomName}.`,
        vi: `Chào ${guessedName}. Bạn đang ở ${roomSummary.roomName}.`,
      };
    }
    if (guessedName) {
      return {
        en: `Hi, ${guessedName}. How can I help?`,
        vi: `Chào ${guessedName}. Mình giúp gì được cho bạn?`,
      };
    }
    if (roomSummary.hasRoomContext) {
      return {
        en: `Hi! You’re in ${roomSummary.roomName}.`,
        vi: `Chào bạn! Bạn đang ở ${roomSummary.roomName}.`,
      };
    }
    return {
      en: 'Hi! How can I help?',
      vi: 'Chào bạn! Mình giúp gì được?',
    };
  }, [guessedName, roomSummary]);

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
          '<span class="text-sm font-semibold text-rose-700">MH</span>';
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
    (direction: ResizeDirection) =>
      (event: React.PointerEvent<HTMLDivElement>) => {
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
        if (roomSummary.hasRoomContext) {
          setCheckInMessage(buildRoomAwareCheckIn(profileData, roomSummary));
        } else if (greetingReply) {
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
        
        // Logic for Path Forward: If no context, suggest a path.
        if (!roomSummary.hasRoomContext) {
          setPathHint(MERCY_BLUE_PATH_FORWARD.idle);
        }
      } catch (error) {
        console.error('Failed to load guide data:', error);
      }
    }
    loadData();
  }, [isOpen, roomId, roomSummary, tags]);

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
          <div className="flex flex-col items-center">
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
                  alt="Teacher Mercy"
                  className="pointer-events-none h-full w-full object-cover object-center"
                  loading="eager"
                  decoding="async"
                  draggable={false}
                  onError={handleAvatarError}
                />
              </div>
              <div className="pointer-events-none absolute inset-0 rounded-full bg-white/10" />
            </div>
            <div className="mt-3 rounded-full bg-white/90 px-4 py-1.5 shadow-md ring-1 ring-black/5">
              <p className="text-[14px] font-extrabold tracking-tight text-black">
                Teacher Mercy
              </p>
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
            maxWidth: `min(${widthPolicy.maxWidth}px, calc(100vw - ${
              MIN_PANEL_MARGIN * 2
            }px))`,
            maxHeight: `min(${heightPolicy.maxHeight}px, calc(100vh - ${
              MIN_PANEL_MARGIN * 2
            }px))`,
          }}
        >
          <div
            className="flex cursor-move items-center justify-between border-b border-border bg-muted/20 px-4 py-3"
            onPointerDown={handlePanelDragStart}
          >
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-6 items-center justify-center rounded-md text-muted-foreground/70">
                <GripHorizontal className="h-4 w-4" />
              </div>
              <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-pink-100 ring-2 ring-pink-200">
                <img
                  src={MERCY_HOST_IMAGE_SRC}
                  alt="Mercy Host"
                  className="h-full w-full object-cover object-center"
                  loading="eager"
                  decoding="async"
                  onError={handleAvatarError}
                />
              </div>
              <div className="min-w-0">
                <h3 className="text-lg font-semibold text-foreground md:text-[20px]">
                  Mercy
                </h3>
                <p className="truncate text-sm text-muted-foreground md:text-base">
                  {greeting.vi}
                </p>
                {roomSummary.hasRoomContext && (
                  <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground md:text-sm">
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/6 px-2.5 py-1 text-primary">
                      <MapPin className="h-3.5 w-3.5" />
                      <span>{roomSummary.roomName}</span>
                    </span>
                    {roomSummary.tierLabel && (
                      <span className="rounded-full border border-border/70 px-2.5 py-1">
                        {roomSummary.tierLabel}
                      </span>
                    )}
                    {roomSummary.topicLabel && (
                      <span className="rounded-full border border-border/70 px-2.5 py-1">
                        {truncateWords(roomSummary.topicLabel, 6)}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                onClick={() => setShowSettings(!showSettings)}
                title="Hồ sơ"
              >
                <User className="h-4.5 w-4.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                onClick={handleCollapseGuide}
                title="Thu gọn"
              >
                <ChevronDown className="h-4.5 w-4.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                onClick={handleCloseGuide}
                title="Đóng"
              >
                <X className="h-4.5 w-4.5" />
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
            <Tabs
              value={activeTab}
              onValueChange={(v) => {
                setActiveTab(v);
                setPathHint(MERCY_BLUE_PATH_FORWARD.switching);
                setTimeout(() => setPathHint(null), 3500);
              }}
              className="flex min-h-0 flex-1 flex-col overflow-hidden"
            >
              <div className="shrink-0 px-3 pt-3 md:px-4 md:pt-4">
                <TabsList className="flex w-full items-center gap-2 overflow-x-auto rounded-xl border border-border/60 bg-muted/50 p-1.5 shadow-sm md:p-2">
                  <TabsTrigger
                    value="teacher"
                    className={cn(
                      'h-10 shrink-0 whitespace-nowrap gap-1.5 rounded-lg border px-3 text-sm font-semibold transition-all md:h-11 md:px-3.5 md:text-[14px]',
                      'border-transparent text-muted-foreground opacity-80',
                      'data-[state=active]:border-border data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:opacity-100 data-[state=active]:shadow-sm',
                      'data-[state=inactive]:hover:bg-white/80 data-[state=inactive]:hover:text-foreground'
                    )}
                  >
                    <GraduationCap className="h-4 w-4 shrink-0" />
                    <span>Teacher</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="english"
                    className={cn(
                      'h-10 shrink-0 whitespace-nowrap gap-1.5 rounded-lg border px-3 text-sm font-semibold transition-all md:h-11 md:px-3.5 md:text-[14px]',
                      hasEnglishContext
                        ? 'border-transparent text-muted-foreground opacity-80'
                        : 'border-transparent text-muted-foreground/70 opacity-70',
                      'data-[state=active]:border-border data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:opacity-100 data-[state=active]:shadow-sm',
                      'data-[state=inactive]:hover:bg-white/80 data-[state=inactive]:hover:text-foreground'
                    )}
                  >
                    <BookOpen className="h-4 w-4 shrink-0" />
                    <span>English</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="speak"
                    className={cn(
                      'h-10 shrink-0 whitespace-nowrap gap-1.5 rounded-lg border px-3 text-sm font-semibold transition-all md:h-11 md:px-3.5 md:text-[14px]',
                      'border-transparent text-muted-foreground opacity-80',
                      'data-[state=active]:border-border data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:opacity-100 data-[state=active]:shadow-sm',
                      'data-[state=inactive]:hover:bg-white/80 data-[state=inactive]:hover:text-foreground'
                    )}
                  >
                    <Mic className="h-4 w-4 shrink-0" />
                    <span>Speak</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="suggest"
                    className={cn(
                      'h-10 shrink-0 whitespace-nowrap gap-1.5 rounded-lg border px-3 text-sm font-semibold transition-all md:h-11 md:px-3.5 md:text-[14px]',
                      'border-transparent text-muted-foreground opacity-80',
                      'data-[state=active]:border-border data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:opacity-100 data-[state=active]:shadow-sm',
                      'data-[state=inactive]:hover:bg-white/80 data-[state=inactive]:hover:text-foreground'
                    )}
                  >
                    <Sparkles className="h-4 w-4 shrink-0" />
                    <span>For You</span>
                  </TabsTrigger>
                </TabsList>
              </div>

              <div
                className="relative min-h-0 flex-1 overflow-hidden"
                style={{
                  paddingBottom: `calc(${guideTabBottomBuffer}px + env(safe-area-inset-bottom, 0px))`,
                }}
              >
                {/* Path Forward Overlay */}
                {pathHint && (
                  <div className="absolute inset-x-4 top-4 z-[90] animate-in fade-in slide-in-from-top-2 rounded-lg border border-pink-100 bg-pink-50/95 p-3 shadow-md backdrop-blur-sm">
                    <div className="flex items-start justify-between">
                      <div className="flex gap-2">
                        <HelpCircle className="h-5 w-5 text-pink-600" />
                        <div>
                          <p className="text-sm font-medium text-pink-900">{pathHint.vi}</p>
                          <p className="text-xs text-pink-700 italic">{pathHint.en}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setPathHint(null)}><X className="h-3 w-3" /></Button>
                    </div>
                  </div>
                )}

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
                  onRequestGuideTab={() => setActiveTab('teacher')}
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
          )}
          
          {/* Guide Quick-Action Bar */}
          {!showSettings && (
            <div className="flex items-center justify-between border-t bg-muted/10 px-4 py-2.5">
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="h-8 rounded-full border-pink-200 bg-white text-xs" onClick={() => setPathHint(MERCY_BLUE_PATH_FORWARD.navigation)}><Sparkles className="mr-1.5 h-3 w-3" />Hướng dẫn</Button>
                <Button variant="outline" size="sm" className="h-8 rounded-full border-blue-200 bg-white text-xs" onClick={() => setPathHint(MERCY_BLUE_PATH_FORWARD.idle)}><LifeBuoy className="mr-1.5 h-3 w-3" />Cần giúp?</Button>
              </div>
              <p className="text-[10px] text-muted-foreground font-medium">MercyB Guide v4.0</p>
            </div>
          )}

          <div className="pointer-events-none absolute inset-x-0 top-3 z-[85] flex justify-center">
            <div className="h-1.5 w-20 rounded-full bg-gray-400/80 shadow-sm" />
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-5 z-[85] flex justify-center">
            <div className="h-1.5 w-20 rounded-full bg-gray-400/80 shadow-sm" />
          </div>
          <div className="pointer-events-none absolute inset-y-0 left-3 z-[85] flex items-center">
            <div className="h-20 w-1.5 rounded-full bg-gray-400/80 shadow-sm" />
          </div>
          <div className="pointer-events-none absolute inset-y-0 right-3 z-[85] flex items-center">
            <div className="h-20 w-1.5 rounded-full bg-gray-400/80 shadow-sm" />
          </div>

          <div className="absolute inset-x-3 top-0 z-[70] touch-none" style={{ height: EDGE_HANDLE_THICKNESS, cursor: 'n-resize' }} onPointerDown={handleResizePointerDown('top')} />
          <div className="absolute inset-x-3 bottom-0 z-[70] touch-none" style={{ height: EDGE_HANDLE_THICKNESS, cursor: 's-resize' }} onPointerDown={handleResizePointerDown('bottom')} />
          <div className="absolute inset-y-3 left-0 z-[70] touch-none" style={{ width: EDGE_HANDLE_THICKNESS, cursor: 'w-resize' }} onPointerDown={handleResizePointerDown('left')} />
          <div className="absolute inset-y-3 right-0 z-[70] touch-none" style={{ width: EDGE_HANDLE_THICKNESS, cursor: 'e-resize' }} onPointerDown={handleResizePointerDown('right')} />
          
          <div className="absolute left-0 top-0 z-[80] flex touch-none items-start justify-start" style={{ width: CORNER_HANDLE_SIZE, height: CORNER_HANDLE_SIZE, cursor: 'nw-resize' }} onPointerDown={handleResizePointerDown('top-left')}>
            <div className="ml-1 mt-1 h-2.5 w-2.5 rounded-full border border-border/70 bg-background shadow-sm" />
          </div>
          <div className="absolute right-0 top-0 z-[80] flex touch-none items-start justify-end" style={{ width: CORNER_HANDLE_SIZE, height: CORNER_HANDLE_SIZE, cursor: 'ne-resize' }} onPointerDown={handleResizePointerDown('top-right')}>
            <div className="mr-1 mt-1 h-2.5 w-2.5 rounded-full border border-border/70 bg-background shadow-sm" />
          </div>
          <div className="absolute bottom-0 left-0 z-[80] flex touch-none items-end justify-start" style={{ width: CORNER_HANDLE_SIZE, height: CORNER_HANDLE_SIZE, cursor: 'sw-resize' }} onPointerDown={handleResizePointerDown('bottom-left')}>
            <div className="mb-1 ml-1 h-2.5 w-2.5 rounded-full border border-border/70 bg-background shadow-sm" />
          </div>
          <div className="absolute bottom-0 right-0 z-[80] flex touch-none items-end justify-end" style={{ width: CORNER_HANDLE_SIZE, height: CORNER_HANDLE_SIZE, cursor: 'se-resize' }} onPointerDown={handleResizePointerDown('bottom-right')}>
            <div className="mb-1 mr-1 h-2.5 w-2.5 rounded-full border border-border/70 bg-background shadow-sm" />
          </div>
        </div>
      )}
    </>
  );
}