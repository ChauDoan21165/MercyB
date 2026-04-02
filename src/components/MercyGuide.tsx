/**
 * File: MercyGuide.tsx
 * Path: src/components/MercyGuide.tsx
 * Smaller shell: constants/utils/shell logic extracted
 * Safe fix: preserve old tab bodies, rename labels only
 * Grammar fix: use GrammarWritingTab for paste/analyze flow
 */

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ChevronDown,
  GraduationCap,
  GripHorizontal,
  HelpCircle,
  LifeBuoy,
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
import { useMercyGuideShell } from './mercy-guide/hooks/useMercyGuideShell';
import { MercyTeacherTab } from './mercy-guide/MercyTeacherTab';
import { MercySpeakTab } from './mercy-guide/MercySpeakTab';
import { MercySuggestTab } from './mercy-guide/MercySuggestTab';
import { GrammarWritingTab } from './mercy-guide/tabs/GrammarWritingTab';
import {
  CORNER_HANDLE_SIZE,
  EDGE_HANDLE_THICKNESS,
  IDLE_THRESHOLD_MS,
  MERCY_BLUE_PATH_FORWARD,
  MIN_PANEL_HEIGHT,
  MIN_PANEL_MARGIN,
  MIN_PANEL_WIDTH,
  SIZE_PRESETS,
} from './mercy-guide/mercyGuide.constants';
import {
  buildRoomAwareCheckIn,
  cleanText,
  deriveRoomContextSummary,
  getGuideTabBottomBuffer,
  getPanelHeightPolicy,
  getPanelWidthPolicy,
} from './mercy-guide/mercyGuide.utils';

interface MercyGuideProps {
  roomId?: string;
  roomTitle?: string;
  tier?: string;
  pathSlug?: string;
  tags?: string[];
  contentEn?: string;
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
  const { isEnabled } = useMercyGuide();

  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('teacher');
  const [showSettings, setShowSettings] = useState(false);
  const [pathHint, setPathHint] = useState<{ vi: string; en: string } | null>(null);
  const [isGhosted, setIsGhosted] = useState(false);
  const [lastInteraction, setLastInteraction] = useState(Date.now());
  const [shownTipIds, setShownTipIds] = useState<Set<string>>(new Set());

  const [profile, setProfile] = useState<CompanionProfile>({});
  const [checkInMessage, setCheckInMessage] = useState<{ en: string; vi: string } | null>(null);
  const [suggestions, setSuggestions] = useState<SuggestedItem[]>([]);
  const [yesterdaySummary, setYesterdaySummary] = useState<StudyLogEntry | undefined>();
  const [todayTotalMinutes, setTodayTotalMinutes] = useState(0);
  const [hasHeavyMoods, setHasHeavyMoods] = useState(false);
  const [showBreathingScript, setShowBreathingScript] = useState(false);
  const [breathingStep, setBreathingStep] = useState(0);
  const [showReframe, setShowReframe] = useState(false);

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
    isPracticing,
  } = speakPractice;

  const roomSummary = useMemo(
    () =>
      deriveRoomContextSummary({
        roomTitle,
        tier,
        pathSlug,
        tags,
        contentEn,
      }),
    [roomTitle, tier, pathSlug, tags, contentEn]
  );

  const hasEnglishContext = Boolean(
    contentEn || roomId || roomTitle || (tags && tags.length > 0)
  );

  const guideTabBottomBuffer = useMemo(() => getGuideTabBottomBuffer(), []);
  const updateInteraction = useCallback(() => setLastInteraction(Date.now()), []);

  const {
    panelRect,
    bubblePos,
    openGuideFromBubble,
    handleSetSizePreset,
    handleBubblePointerDown,
    handlePanelDragStart,
    handleResizePointerDown,
  } = useMercyGuideShell({
    isOpen,
    setIsOpen,
    updateInteraction,
  });

  useEffect(() => {
    preloadMercyLibrary();
  }, []);

  useEffect(() => {
    if (isPracticing && activeTab === 'speak') {
      setIsGhosted(true);
    } else {
      setIsGhosted(false);
    }
  }, [isPracticing, activeTab]);

  useEffect(() => {
    const idleCheck = setInterval(() => {
      const now = Date.now();
      if (now - lastInteraction > IDLE_THRESHOLD_MS && isGhosted) {
        setIsGhosted(false);
      }
    }, 5000);

    return () => clearInterval(idleCheck);
  }, [lastInteraction, isGhosted]);

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

  const handleAvatarError = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
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
      parent.innerHTML = '<span class="text-sm font-semibold text-rose-700">MH</span>';
    }
  }, []);

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

  const triggerBilingualHint = useCallback(
    (hintKey: keyof typeof MERCY_BLUE_PATH_FORWARD) => {
      if (shownTipIds.has(hintKey)) return;
      setPathHint(MERCY_BLUE_PATH_FORWARD[hintKey]);
      setShownTipIds((prev) => new Set(prev).add(hintKey));
      setTimeout(() => setPathHint(null), 6000);
    },
    [shownTipIds]
  );

  useEffect(() => {
    if (!isOpen || activeTab !== 'speak') return;

    const timer = setTimeout(() => {
      triggerBilingualHint('idle_speak');
    }, IDLE_THRESHOLD_MS);

    return () => clearTimeout(timer);
  }, [isOpen, activeTab, triggerBilingualHint]);

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
          setCheckInMessage(
            getCheckInMessage(
              profileData,
              undefined,
              profileData.last_english_activity || undefined
            )
          );
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

        if (!roomSummary.hasRoomContext) {
          triggerBilingualHint('idle');
        }
      } catch (error) {
        console.error('Failed to load guide data:', error);
      }
    }

    loadData();
  }, [isOpen, roomId, roomSummary, tags, triggerBilingualHint]);

  if (!isEnabled) return null;

  const widthPolicy = getPanelWidthPolicy();
  const heightPolicy = getPanelHeightPolicy();
  const journeyTitle = checkInMessage?.vi || greeting.vi;

  return (
    <>
      {!isOpen && (
        <div
          className="fixed z-40 select-none"
          onPointerDown={updateInteraction}
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
          className={cn(
            'fixed z-50 flex flex-col overflow-hidden rounded-xl border border-border bg-white shadow-2xl transition-all duration-300',
            isGhosted ? 'opacity-40 pointer-events-none' : 'opacity-100'
          )}
          onPointerDown={updateInteraction}
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
            className="flex cursor-move flex-col border-b border-border bg-muted/20 px-4 py-3"
            onPointerDown={handlePanelDragStart}
          >
            <div className="mb-3 flex items-center justify-between">
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
                    {journeyTitle}
                  </p>
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

            <div className="flex items-center gap-2">
              {(['S', 'M', 'L', 'XL'] as const).map((s) => (
                <Button
                  key={s}
                  variant="outline"
                  size="sm"
                  className={cn(
                    'h-7 w-9 rounded-md text-[10px] font-bold transition-all',
                    panelRect.width === SIZE_PRESETS[s].width
                      ? 'bg-pink-100 border-pink-300 text-pink-700 shadow-inner'
                      : 'bg-white text-muted-foreground'
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSetSizePreset(s);
                  }}
                >
                  {s}
                </Button>
              ))}

              <span className="ml-2 text-[10px] font-medium italic text-muted-foreground">
                Drag handles to resize
              </span>
            </div>
          </div>

          {showSettings && (
            <MercyGuideProfileSettings
              onClose={() => setShowSettings(false)}
              onSaved={(newProfile) => setProfile((prev) => ({ ...prev, ...newProfile }))}
            />
          )}

          {!showSettings && (
            <Tabs
              value={activeTab}
              onValueChange={(v) => {
                setActiveTab(v);
                triggerBilingualHint('switching');
              }}
              className="flex min-h-0 flex-1 flex-col overflow-hidden"
            >
              <div className="shrink-0 px-3 pt-3 md:px-4 md:pt-4">
                <TabsList className="flex h-[58px] w-full items-stretch gap-2 rounded-xl border border-border/60 bg-muted/50 p-1.5 shadow-sm md:h-[62px] md:p-2">
                  <TabsTrigger
                    value="teacher"
                    className={cn(
                      'flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-lg border px-2 py-2 text-[11px] font-semibold transition-all md:text-[12px]',
                      'border-transparent text-muted-foreground opacity-80',
                      'data-[state=active]:border-border data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:opacity-100 data-[state=active]:shadow-sm',
                      'data-[state=inactive]:hover:bg-white/80 data-[state=inactive]:hover:text-foreground'
                    )}
                  >
                    <GraduationCap className="h-4 w-4 shrink-0" />
                    <span className="block text-center leading-tight">
                      Your<br />Journey
                    </span>
                  </TabsTrigger>

                  <TabsTrigger
                    value="english"
                    className={cn(
                      'flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-lg border px-2 py-2 text-[10px] font-semibold transition-all md:text-[11px]',
                      hasEnglishContext
                        ? 'border-transparent text-muted-foreground opacity-80'
                        : 'border-transparent text-muted-foreground/70 opacity-70',
                      'data-[state=active]:border-border data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:opacity-100 data-[state=active]:shadow-sm',
                      'data-[state=inactive]:hover:bg-white/80 data-[state=inactive]:hover:text-foreground'
                    )}
                  >
                    <span className="block text-center leading-tight">
                      Grammar &amp;<br />Writing
                    </span>
                  </TabsTrigger>

                  <TabsTrigger
                    value="speak"
                    className={cn(
                      'flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-lg border px-2 py-2 text-[11px] font-semibold transition-all md:text-[12px]',
                      'border-transparent text-muted-foreground opacity-80',
                      'data-[state=active]:border-border data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:opacity-100 data-[state=active]:shadow-sm',
                      'data-[state=inactive]:hover:bg-white/80 data-[state=inactive]:hover:text-foreground'
                    )}
                  >
                    <Mic className="h-4 w-4 shrink-0" />
                    <span className="block text-center leading-tight">
                      Pronunciation
                    </span>
                  </TabsTrigger>

                  <TabsTrigger
                    value="suggest"
                    className={cn(
                      'flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-lg border px-2 py-2 text-[10px] font-semibold transition-all md:text-[11px]',
                      'border-transparent text-muted-foreground opacity-80',
                      'data-[state=active]:border-border data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:opacity-100 data-[state=active]:shadow-sm',
                      'data-[state=inactive]:hover:bg-white/80 data-[state=inactive]:hover:text-foreground'
                    )}
                  >
                    <Sparkles className="h-4 w-4 shrink-0" />
                    <span className="block text-center leading-tight">
                      English<br />Logic
                    </span>
                  </TabsTrigger>
                </TabsList>
              </div>

              <div
                className="relative min-h-0 flex-1 overflow-hidden"
                style={{
                  paddingBottom: `calc(${guideTabBottomBuffer}px + env(safe-area-inset-bottom, 0px))`,
                }}
              >
                {pathHint && (
                  <div className="absolute inset-x-4 top-4 z-[100] animate-in fade-in slide-in-from-top-2 rounded-lg border border-pink-100 bg-pink-50/95 p-3 shadow-md backdrop-blur-sm">
                    <div className="flex items-start justify-between">
                      <div className="flex gap-2">
                        <HelpCircle className="h-5 w-5 text-pink-600" />
                        <div>
                          <p className="leading-tight text-sm font-bold text-pink-900">
                            {pathHint.en}
                          </p>
                          <p className="mt-1 text-xs font-light italic text-pink-700">
                            {pathHint.vi}
                          </p>
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => setPathHint(null)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                )}

                {activeTab === 'teacher' && (
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
                )}

                {activeTab === 'english' && (
                  <GrammarWritingTab
                    roomId={roomId}
                    roomTitle={roomTitle}
                    contentEn={contentEn}
                    englishLevel={profile.english_level}
                  />
                )}

                {activeTab === 'speak' && (
                  <MercySpeakTab
                    roomId={roomId}
                    contentEn={contentEn}
                    profile={profile}
                    troubleWords={troubleWords}
                    speakPractice={speakPractice}
                  />
                )}

                {activeTab === 'suggest' && (
                  <MercySuggestTab
                    suggestions={suggestions}
                    onNavigateSuggestion={handleNavigateSuggestion}
                  />
                )}
              </div>
            </Tabs>
          )}

          {!showSettings && (
            <div className="flex items-center justify-between border-t bg-muted/10 px-4 py-2.5">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 rounded-full border-pink-200 bg-white text-[10px] font-bold"
                  onClick={() => triggerBilingualHint('navigation')}
                >
                  <Sparkles className="mr-1.5 h-3 w-3" />
                  Hướng dẫn
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 rounded-full border-blue-200 bg-white text-[10px] font-bold"
                  onClick={() => triggerBilingualHint('idle')}
                >
                  <LifeBuoy className="mr-1.5 h-3 w-3" />
                  Cần giúp?
                </Button>
              </div>

              <p className="text-[10px] font-medium text-muted-foreground">
                Advisor Standard v4.8
              </p>
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

          <div
            className="absolute inset-x-3 top-0 z-[70] touch-none"
            style={{ height: EDGE_HANDLE_THICKNESS, cursor: 'n-resize' }}
            onPointerDown={handleResizePointerDown('top')}
          />
          <div
            className="absolute inset-x-3 bottom-0 z-[70] touch-none"
            style={{ height: EDGE_HANDLE_THICKNESS, cursor: 's-resize' }}
            onPointerDown={handleResizePointerDown('bottom')}
          />
          <div
            className="absolute inset-y-3 left-0 z-[70] touch-none"
            style={{ width: EDGE_HANDLE_THICKNESS, cursor: 'w-resize' }}
            onPointerDown={handleResizePointerDown('left')}
          />
          <div
            className="absolute inset-y-3 right-0 z-[70] touch-none"
            style={{ width: EDGE_HANDLE_THICKNESS, cursor: 'e-resize' }}
            onPointerDown={handleResizePointerDown('right')}
          />

          <div
            className="absolute left-0 top-0 z-[80] flex touch-none items-start justify-start"
            style={{ width: CORNER_HANDLE_SIZE, height: CORNER_HANDLE_SIZE, cursor: 'nw-resize' }}
            onPointerDown={handleResizePointerDown('top-left')}
          >
            <div className="ml-1 mt-1 h-2.5 w-2.5 rounded-full border border-border/70 bg-background shadow-sm" />
          </div>

          <div
            className="absolute right-0 top-0 z-[80] flex touch-none items-start justify-end"
            style={{ width: CORNER_HANDLE_SIZE, height: CORNER_HANDLE_SIZE, cursor: 'ne-resize' }}
            onPointerDown={handleResizePointerDown('top-right')}
          >
            <div className="mr-1 mt-1 h-2.5 w-2.5 rounded-full border border-border/70 bg-background shadow-sm" />
          </div>

          <div
            className="absolute bottom-0 left-0 z-[80] flex touch-none items-end justify-start"
            style={{ width: CORNER_HANDLE_SIZE, height: CORNER_HANDLE_SIZE, cursor: 'sw-resize' }}
            onPointerDown={handleResizePointerDown('bottom-left')}
          >
            <div className="mb-1 ml-1 h-2.5 w-2.5 rounded-full border border-border/70 bg-background shadow-sm" />
          </div>

          <div
            className="absolute bottom-0 right-0 z-[80] flex touch-none items-end justify-end"
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