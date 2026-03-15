/**
 * File: MercyGuide.tsx
 * Path: src/components/MercyGuide.tsx
 * Version: v2026-03-11-merge-safe-bilingual-speak-scroll-vault-14
 */

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  BookOpen,
  ChevronDown,
  GraduationCap,
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

const DEFAULT_PANEL_WIDTH = 380;
const DEFAULT_PANEL_HEIGHT_RATIO = 0.75;
const DEFAULT_PANEL_RIGHT = 24;
const DEFAULT_PANEL_BOTTOM = 80;
const MIN_PANEL_WIDTH = 340;
const MAX_PANEL_WIDTH = 720;
const MIN_PANEL_HEIGHT = 480;
const MAX_PANEL_HEIGHT = 900;
const MIN_PANEL_MARGIN = 8;
const PANEL_SIZE_STORAGE_KEY = 'mercy-guide-panel-size';

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

  const [panelRect, setPanelRect] = useState<PanelRect>({
    width: DEFAULT_PANEL_WIDTH,
    height: MIN_PANEL_HEIGHT,
    right: DEFAULT_PANEL_RIGHT,
    bottom: DEFAULT_PANEL_BOTTOM,
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
    if (typeof window === 'undefined') {
      return {
        width: Math.min(MAX_PANEL_WIDTH, Math.max(MIN_PANEL_WIDTH, next.width)),
        height: Math.min(MAX_PANEL_HEIGHT, Math.max(MIN_PANEL_HEIGHT, next.height)),
        right: Math.max(MIN_PANEL_MARGIN, next.right),
        bottom: Math.max(MIN_PANEL_MARGIN, next.bottom),
      };
    }

    const maxWidth = Math.min(MAX_PANEL_WIDTH, window.innerWidth - MIN_PANEL_MARGIN * 2);
    const maxHeight = Math.min(MAX_PANEL_HEIGHT, window.innerHeight - MIN_PANEL_MARGIN * 2);
    const minWidth = Math.min(MIN_PANEL_WIDTH, maxWidth);
    const minHeight = Math.min(MIN_PANEL_HEIGHT, maxHeight);

    const width = Math.min(maxWidth, Math.max(minWidth, next.width));
    const height = Math.min(maxHeight, Math.max(minHeight, next.height));
    const maxRight = Math.max(MIN_PANEL_MARGIN, window.innerWidth - width - MIN_PANEL_MARGIN);
    const maxBottom = Math.max(MIN_PANEL_MARGIN, window.innerHeight - height - MIN_PANEL_MARGIN);

    return {
      width,
      height,
      right: Math.min(maxRight, Math.max(MIN_PANEL_MARGIN, next.right)),
      bottom: Math.min(maxBottom, Math.max(MIN_PANEL_MARGIN, next.bottom)),
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const fallbackRect = clampPanelRect({
      width: DEFAULT_PANEL_WIDTH,
      height: Math.round(window.innerHeight * DEFAULT_PANEL_HEIGHT_RATIO),
      right: DEFAULT_PANEL_RIGHT,
      bottom: DEFAULT_PANEL_BOTTOM,
    });

    try {
      const stored = window.sessionStorage.getItem(PANEL_SIZE_STORAGE_KEY);

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
      window.sessionStorage.setItem(PANEL_SIZE_STORAGE_KEY, JSON.stringify(panelRect));
    } catch (error) {
      console.error('Failed to persist Mercy Guide panel size:', error);
    }
  }, [panelRect]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleWindowResize = () => {
      setPanelRect((prev) => clampPanelRect(prev));
    };

    window.addEventListener('resize', handleWindowResize);
    return () => window.removeEventListener('resize', handleWindowResize);
  }, [clampPanelRect]);

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

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-20 right-6 z-40 group"
          aria-label="Open Mercy Guide"
        >
          <div className="relative flex items-end justify-end">
            <div className="absolute -left-20 top-2 z-0 rotate-[-20deg] rounded-[24px] bg-white px-3 py-2.5 shadow-xl ring-1 ring-black/5 transition-transform duration-200 group-hover:scale-[1.02]">
              <div className="leading-none">
                <p className="text-[16px] font-extrabold tracking-tight text-black">
                  Mercy Host
                </p>
                <p className="mt-1 text-[11px] font-medium text-black/70">
                  Need a guide?
                </p>
              </div>
            </div>

            <div className="relative z-10 h-28 w-28 rounded-full bg-pink-200 p-[6px] shadow-2xl ring-4 ring-white transition-transform duration-200 group-hover:scale-[1.03]">
              <div className="h-full w-full overflow-hidden rounded-full bg-gradient-to-b from-pink-100 to-rose-100">
                <img
                  src={MERCY_HOST_IMAGE_SRC}
                  alt="Mercy Host"
                  className="h-full w-full object-cover object-center"
                  loading="eager"
                  decoding="async"
                  onError={handleAvatarError}
                />
              </div>
              <div className="pointer-events-none absolute inset-0 rounded-full bg-white/10" />
            </div>
          </div>
        </button>
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
            maxWidth: `min(${MAX_PANEL_WIDTH}px, calc(100vw - ${MIN_PANEL_MARGIN * 2}px))`,
            maxHeight: `min(${MAX_PANEL_HEIGHT}px, calc(100vh - ${MIN_PANEL_MARGIN * 2}px))`,
          }}
        >
          <div className="flex items-center justify-between border-b border-border bg-white px-4 py-3">
            <div className="flex items-center gap-3">
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
                <h3 className="font-semibold text-foreground">Mercy Guide</h3>
                <p className="text-xs text-muted-foreground">{greeting.en}</p>
                <p className="text-[11px] text-muted-foreground/80">{greeting.vi}</p>
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
                <div className="border-b border-primary/10 bg-primary/5 px-4 py-2">
                  <p className="text-sm text-foreground">{checkInMessage.en}</p>
                  <p className="text-xs text-muted-foreground">{checkInMessage.vi}</p>
                </div>
              )}

              {!profile.preferred_name && (
                <button
                  onClick={() => setShowSettings(true)}
                  className="border-b border-border bg-white px-4 py-2 text-left text-xs text-primary hover:underline"
                >
                  Tell me your name →
                </button>
              )}

              {coachStage !== 'dismissed' && (
                <div className="shrink-0 px-3 pt-2">
                  {coachStage === 'intro' && (
                    <div className="rounded-xl border border-primary/10 bg-primary/5 p-3">
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-foreground">Mercy</p>
                        <p className="text-sm text-foreground">
                          I can guide you with one short speaking step today.
                        </p>
                        <p className="text-xs text-muted-foreground">
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
                <TabsList className="mx-3 mt-2 shrink-0 grid grid-cols-5 rounded-xl border border-border/60 bg-muted/50 p-1 shadow-sm">
                  <TabsTrigger
                    value="guide"
                    className={cn(
                      'h-9 gap-1 rounded-lg border px-2 text-[11px] font-semibold transition-all',
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
                      'h-9 gap-1 rounded-lg border px-2 text-[11px] font-semibold transition-all',
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
                      'h-9 gap-1 rounded-lg border px-2 text-[11px] font-semibold transition-all',
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
                      'h-9 gap-1 rounded-lg border px-2 text-[11px] font-semibold transition-all',
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
                      'h-9 gap-1 rounded-lg border px-2 text-[11px] font-semibold transition-all',
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
            className="absolute inset-x-2 top-0 z-20 h-2 cursor-n-resize touch-none"
            onPointerDown={handleResizePointerDown('top')}
          />
          <div
            className="absolute inset-x-2 bottom-0 z-20 h-2 cursor-s-resize touch-none"
            onPointerDown={handleResizePointerDown('bottom')}
          />
          <div
            className="absolute inset-y-2 left-0 z-20 w-2 cursor-w-resize touch-none"
            onPointerDown={handleResizePointerDown('left')}
          />
          <div
            className="absolute inset-y-2 right-0 z-20 w-2 cursor-e-resize touch-none"
            onPointerDown={handleResizePointerDown('right')}
          />
          <div
            className="absolute left-0 top-0 z-20 h-4 w-4 cursor-nw-resize touch-none"
            onPointerDown={handleResizePointerDown('top-left')}
          />
          <div
            className="absolute right-0 top-0 z-20 h-4 w-4 cursor-ne-resize touch-none"
            onPointerDown={handleResizePointerDown('top-right')}
          />
          <div
            className="absolute bottom-0 left-0 z-20 h-4 w-4 cursor-sw-resize touch-none"
            onPointerDown={handleResizePointerDown('bottom-left')}
          />
          <div
            className="absolute bottom-0 right-0 z-20 h-4 w-4 cursor-se-resize touch-none"
            onPointerDown={handleResizePointerDown('bottom-right')}
          />
        </div>
      )}
    </>
  );
}