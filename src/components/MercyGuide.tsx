/**
 * File: MercyGuide.tsx
 * Path: src/components/MercyGuide.tsx
 * Version: v2026-03-11-merge-safe-bilingual-speak-scroll-vault-13
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
  const [showCoach, setShowCoach] = useState(false);

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
    [setActiveTab, replayVaultWord]
  );

  useEffect(() => {
    preloadMercyLibrary();
  }, []);

  useEffect(() => {
    if (!isOpen || showSettings) {
      setShowCoach(false);
      return;
    }

    const timer = setTimeout(() => {
      setShowCoach(true);
    }, 500);

    return () => clearTimeout(timer);
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
        <div className="fixed bottom-20 right-6 z-50 flex max-h-[75vh] w-[min(380px,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-xl border border-border bg-white shadow-2xl">
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

              {showCoach && (
                <div className="animate-in fade-in duration-300 px-3 pt-3">
                  <DailyCoachCard
                    profile={profile}
                    contentEn={contentEn}
                    troubleWords={troubleWords}
                    speakPractice={speakPractice}
                    onOpenSpeak={() => setActiveTab('speak')}
                  />
                </div>
              )}

              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="flex min-h-0 flex-1 flex-col overflow-hidden"
              >
                <TabsList className="mx-3 mt-2 grid grid-cols-5">
                  <TabsTrigger value="guide" className="text-xs">
                    <MessageCircleQuestion className="mr-1 h-3 w-3" />
                    Guide
                  </TabsTrigger>

                  <TabsTrigger value="teacher" className="text-xs">
                    <GraduationCap className="mr-1 h-3 w-3" />
                    Teacher
                  </TabsTrigger>

                  <TabsTrigger
                    value="english"
                    className="text-xs"
                    disabled={!contentEn && !roomId}
                  >
                    <BookOpen className="mr-1 h-3 w-3" />
                    English
                  </TabsTrigger>

                  <TabsTrigger value="speak" className="text-xs">
                    <Mic className="mr-1 h-3 w-3" />
                    Speak
                  </TabsTrigger>

                  <TabsTrigger value="suggest" className="text-xs">
                    <Sparkles className="mr-1 h-3 w-3" />
                    For You
                  </TabsTrigger>
                </TabsList>

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
              </Tabs>
            </>
          )}
        </div>
      )}
    </>
  );
}