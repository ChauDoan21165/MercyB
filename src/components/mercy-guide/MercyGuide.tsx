// PATH: src/components/mercy-guide/MercyGuide.tsx

/**
 * Path: src/components/mercy-guide/MercyGuide.tsx
 */

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ChevronDown,
  GripHorizontal,
  HelpCircle,
  LifeBuoy,
  Sparkles,
  User,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useMercyGuide } from "@/hooks/useMercyGuide";
import {
  getCompanionProfile,
  type CompanionProfile,
} from "@/services/companion";
import {
  getSuggestionsForUser,
  type SuggestedItem,
} from "@/services/suggestions";
import {
  getRecentMoods,
  getYesterdayAndTodaySummary,
  type StudyLogEntry,
} from "@/services/studyLog";
import {
  MERCY_HOST_IMAGE_FALLBACK,
  MERCY_HOST_IMAGE_SRC,
  type TroubleWord,
} from "./shared";
import { useTroubleWordsVault } from "./hooks/useTroubleWordsVault";
import { useSpeakPractice } from "./hooks/useSpeakPractice";
import { MercyTeacherTab } from "./MercyTeacherTab";
import EnglishLogicTab from "./tabs/EnglishLogicTab";
import PronunciationTab from "./tabs/PronunciationTab";
import { MercySuggestTab } from "./MercySuggestTab";

type GuideTab = "teacher" | "english" | "speak" | "suggest";

interface MercyGuideProps {
  roomId?: string;
  roomTitle?: string;
  tier?: string;
  pathSlug?: string;
  tags?: string[];
  contentEn?: string;
}

interface MercyGuideProfileSettingsProps {
  onClose: () => void;
  onSaved: (nextProfile: Partial<CompanionProfile>) => void;
}

const MERCY_BLUE_PATH_FORWARD = {
  idle: {
    vi: "Bạn cần giúp gì không? Hãy thử tab Speak để luyện phát âm nhé!",
    en: "Need a hand? Try the Speak tab to practice your pronunciation!",
  },
  navigation: {
    vi: "Bạn có thể hỏi mình về nội dung phòng này hoặc cách dùng các tính năng.",
    en: "You can ask me about this room or how to use the features.",
  },
  switching: {
    vi: "Đang chuyển đổi... Teacher giúp sửa lỗi, Speak giúp luyện nói.",
    en: "Switching... Teacher helps fix mistakes, Speak helps you talk.",
  },
} as const;

const DEFAULT_PANEL_RIGHT = 24;
const DEFAULT_PANEL_BOTTOM = 80;
const DEFAULT_PANEL_WIDTH = 640;
const DEFAULT_PANEL_HEIGHT = 720;
const MIN_PANEL_WIDTH = 360;
const MIN_PANEL_HEIGHT = 520;
const MUSIC_BAR_SAFE_HEIGHT = 72;
const SESSION_HINT_KEY = "mercy-guide-hint-memory";

function MercyGuideProfileSettings({
  onClose,
  onSaved,
}: MercyGuideProfileSettingsProps) {
  return (
    <div className="p-4">
      <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
        <h3 className="text-base font-semibold text-foreground">
          Mercy Guide settings
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Profile settings are temporarily simplified in this build.
        </p>
        <div className="mt-4 flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              onSaved({});
              onClose();
            }}
          >
            Save
          </Button>
          <Button type="button" variant="ghost" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}

function cleanText(value?: string | null): string {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function getNormalizedMoodValue(entry: unknown): string {
  if (typeof entry === "string") {
    return entry.toLowerCase().trim();
  }

  if (entry && typeof entry === "object") {
    const raw = entry as Record<string, unknown>;
    const value =
      raw.mood ?? raw.label ?? raw.name ?? raw.key ?? raw.value ?? "";
    return String(value).toLowerCase().trim();
  }

  return "";
}

function getSuggestionTarget(item: SuggestedItem | null | undefined): string | null {
  if (!item || typeof item !== "object") {
    return null;
  }

  const raw = item as unknown as Record<string, unknown>;

  const directPath = cleanText(raw.path as string);
  if (directPath) return directPath;

  const href = cleanText(raw.href as string);
  if (href) return href;

  const slug = cleanText(raw.slug as string);
  if (slug) return slug.startsWith("/") ? slug : `/${slug}`;

  const roomId = cleanText((raw.roomId as string) || (raw.room_id as string));
  if (roomId) return `/rooms/${roomId}`;

  const id = cleanText(raw.id as string);
  if (id) return `/rooms/${id}`;

  return null;
}

function getEnglishLevel(profile: CompanionProfile | null): string | null {
  const value = (profile as Record<string, unknown> | null)?.english_level;
  return typeof value === "string" ? value : null;
}

function getPreferredName(profile: CompanionProfile | null): string | undefined {
  const value = profile?.preferred_name;
  return typeof value === "string" && value.trim() ? value : undefined;
}

function getTroubleWordStrings(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (typeof item === "string") {
        return item.trim();
      }

      if (item && typeof item === "object") {
        return cleanText((item as TroubleWord).word);
      }

      return "";
    })
    .filter(Boolean);
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
  const [activeTab, setActiveTab] = useState<GuideTab>("teacher");
  const [showSettings, setShowSettings] = useState(false);
  const [profile, setProfile] = useState<CompanionProfile | null>(null);
  const [suggestions, setSuggestions] = useState<SuggestedItem[]>([]);
  const [yesterdaySummary, setYesterdaySummary] = useState<StudyLogEntry | undefined>(
    undefined
  );
  const [todayTotalMinutes, setTodayTotalMinutes] = useState(0);
  const [hasHeavyMoods, setHasHeavyMoods] = useState(false);
  const [showBreathingScript, setShowBreathingScript] = useState(false);
  const [breathingStep, setBreathingStep] = useState(0);
  const [showReframe, setShowReframe] = useState(false);
  const [pathHint, setPathHint] = useState<string | null>(null);

  const { troubleWords, addToTroubleWords } = useTroubleWordsVault() as {
    troubleWords: TroubleWord[] | string[];
    addToTroubleWords?: (word: string, score?: number) => void;
  };

  const preferredName = useMemo(() => getPreferredName(profile), [profile]);
  const englishLevel = useMemo(() => getEnglishLevel(profile), [profile]);
  const troubleWordStrings = useMemo(
    () => getTroubleWordStrings(troubleWords),
    [troubleWords]
  );

  const speakPractice = useSpeakPractice({
    contentEn,
    englishLevel,
    preferredName,
    addToTroubleWords,
  } as any);

  const greetingText = useMemo(() => {
    if (roomTitle) {
      return `Mercy is here with you in ${roomTitle}.`;
    }

    if (tier) {
      return `Mercy is here with your ${tier} learning flow.`;
    }

    return "Mercy is here with you.";
  }, [roomTitle, tier]);

  const handleAvatarError = useCallback(
    (event: React.SyntheticEvent<HTMLImageElement>) => {
      event.currentTarget.src = MERCY_HOST_IMAGE_FALLBACK;
    },
    []
  );

  const handleNavigateSuggestion = useCallback(
    (item: SuggestedItem) => {
      const target = getSuggestionTarget(item);

      if (target) {
        navigate(target);
        setIsOpen(false);
      }
    },
    [navigate]
  );

  const handleVaultReplay = useCallback(
    (word: string) => {
      const replay = (speakPractice as Record<string, unknown>)
        ?.handleVaultReplay as ((value: string) => void) | undefined;

      if (typeof replay === "function") {
        replay(word);
      }
    },
    [speakPractice]
  );

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    let cancelled = false;

    async function loadData() {
      try {
        const profileData = await getCompanionProfile();
        if (cancelled) return;

        setProfile(profileData);

        const suggestionData = await getSuggestionsForUser({
          profile: profileData as any,
          lastRoomId: roomId,
        } as any);

        if (!cancelled) {
          setSuggestions(Array.isArray(suggestionData) ? suggestionData : []);
        }

        const logData = await getYesterdayAndTodaySummary();
        if (!cancelled) {
          setYesterdaySummary((logData?.yesterday as StudyLogEntry) ?? undefined);
          setTodayTotalMinutes(
            typeof logData?.todayTotalMinutes === "number"
              ? logData.todayTotalMinutes
              : 0
          );
        }

        try {
          const moods = await getRecentMoods();
          if (!cancelled) {
            const heavy = Array.isArray(moods)
              ? moods.some((entry) =>
                  ["sad", "anxious", "stressed", "overwhelmed", "heavy", "tired"].includes(
                    getNormalizedMoodValue(entry)
                  )
                )
              : false;

            setHasHeavyMoods(heavy);
          }
        } catch {
          if (!cancelled) {
            setHasHeavyMoods(false);
          }
        }
      } catch (error) {
        console.error(error);
      }
    }

    void loadData();

    return () => {
      cancelled = true;
    };
  }, [isOpen, roomId]);

  useEffect(() => {
    if (typeof window === "undefined" || !isOpen) {
      return;
    }

    try {
      const seen = JSON.parse(
        window.sessionStorage.getItem(SESSION_HINT_KEY) ?? "[]"
      ) as string[];

      if (!seen.includes(activeTab)) {
        const hint =
          activeTab === "teacher"
            ? MERCY_BLUE_PATH_FORWARD.idle.en
            : activeTab === "english"
            ? MERCY_BLUE_PATH_FORWARD.navigation.en
            : MERCY_BLUE_PATH_FORWARD.switching.en;

        setPathHint(hint);
        window.sessionStorage.setItem(
          SESSION_HINT_KEY,
          JSON.stringify([...seen, activeTab])
        );
      } else {
        setPathHint(null);
      }
    } catch {
      setPathHint(null);
    }
  }, [activeTab, isOpen]);

  if (!isEnabled) {
    return null;
  }

  return (
    <>
      {!isOpen ? (
        <div
          className="fixed z-40"
          style={{
            right: DEFAULT_PANEL_RIGHT,
            bottom: DEFAULT_PANEL_BOTTOM,
          }}
        >
          <div className="flex flex-col items-center">
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="h-16 w-16 overflow-hidden rounded-full bg-pink-100 p-[3px] shadow-xl ring-2 ring-white"
              aria-label="Open Mercy Guide"
            >
              <img
                src={MERCY_HOST_IMAGE_SRC}
                alt="Mercy"
                className="h-full w-full rounded-full object-cover"
                onError={handleAvatarError}
              />
            </button>

            <div className="mt-3 rounded-full bg-white/90 px-4 py-1.5 shadow-md ring-1 ring-black/5">
              <p className="text-[14px] font-extrabold tracking-tight text-black">
                Teacher Mercy
              </p>
            </div>
          </div>
        </div>
      ) : null}

      {isOpen ? (
        <div
          className={cn(
            "fixed z-50 flex flex-col overflow-hidden rounded-xl border border-border bg-white shadow-2xl"
          )}
          style={{
            width: DEFAULT_PANEL_WIDTH,
            minWidth: MIN_PANEL_WIDTH,
            height: DEFAULT_PANEL_HEIGHT,
            minHeight: MIN_PANEL_HEIGHT,
            right: DEFAULT_PANEL_RIGHT,
            bottom: Math.max(DEFAULT_PANEL_BOTTOM, MUSIC_BAR_SAFE_HEIGHT),
          }}
        >
          <div className="flex items-center justify-between border-b border-border bg-muted/20 px-4 py-3">
            <div className="flex min-w-0 items-center gap-3">
              <GripHorizontal className="h-4 w-4 text-muted-foreground/70" />
              <div className="h-10 w-10 overflow-hidden rounded-full bg-pink-100 ring-2 ring-pink-200">
                <img
                  src={MERCY_HOST_IMAGE_SRC}
                  alt="Mercy"
                  className="h-full w-full object-cover"
                  onError={handleAvatarError}
                />
              </div>
              <div className="min-w-0">
                <h3 className="text-lg font-semibold text-foreground">Mercy</h3>
                <p className="truncate text-sm text-muted-foreground">
                  {greetingText}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setShowSettings((prev) => !prev)}
              >
                <User className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => {
                  setIsOpen(false);
                  setShowSettings(false);
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="relative flex-1 overflow-hidden">
            {pathHint ? (
              <div className="absolute inset-x-4 top-4 z-20 rounded-lg border border-pink-100 bg-pink-50/95 p-3 shadow-md">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex gap-2">
                    <HelpCircle className="mt-0.5 h-5 w-5 text-pink-600" />
                    <p className="text-sm font-medium leading-tight text-pink-900">
                      {pathHint}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="text-pink-400"
                    onClick={() => setPathHint(null)}
                    aria-label="Dismiss hint"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : null}

            {showSettings ? (
              <MercyGuideProfileSettings
                onClose={() => setShowSettings(false)}
                onSaved={(nextProfile: Partial<CompanionProfile>) =>
                  setProfile((prev) => ({ ...(prev ?? {}), ...nextProfile }))
                }
              />
            ) : (
              <Tabs
                value={activeTab}
                onValueChange={(value) => setActiveTab(value as GuideTab)}
                className="flex h-full flex-col"
              >
                <TabsList className="mx-4 mt-4 bg-muted/50 p-1">
                  <TabsTrigger value="teacher">Teacher</TabsTrigger>
                  <TabsTrigger value="english">English</TabsTrigger>
                  <TabsTrigger value="speak">Speak</TabsTrigger>
                  <TabsTrigger value="suggest">For You</TabsTrigger>
                </TabsList>

                <div className="flex-1 overflow-y-auto p-4">
                  {activeTab === "teacher" ? (
                    <MercyTeacherTab
                      profile={(profile ?? {}) as CompanionProfile}
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
                      onOpenPronunciation={() => setActiveTab("speak")}
                      onOpenWriting={() => setActiveTab("english")}
                    />
                  ) : null}

                  {activeTab === "english" ? (
                    <EnglishLogicTab
                      roomId={roomId}
                      roomTitle={roomTitle}
                      pathSlug={pathSlug}
                      tags={tags}
                      contentEn={contentEn}
                      englishLevel={englishLevel}
                      troubleWords={troubleWordStrings}
                      onVaultReplay={handleVaultReplay}
                      onRequestGuideTab={() => setActiveTab("teacher")}
                    />
                  ) : null}

                  {activeTab === "speak" ? (
                    <PronunciationTab
                      roomId={roomId}
                      contentEn={contentEn}
                      profile={(profile ?? {}) as CompanionProfile}
                      troubleWords={troubleWordStrings}
                      speakPractice={speakPractice as any}
                    />
                  ) : null}

                  {activeTab === "suggest" ? (
                    <MercySuggestTab
                      suggestions={suggestions as any}
                      onNavigateSuggestion={handleNavigateSuggestion as any}
                    />
                  ) : null}
                </div>
              </Tabs>
            )}
          </div>

          {!showSettings ? (
            <div className="flex items-center justify-between border-t bg-muted/10 px-4 py-2.5">
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 rounded-full border-pink-200 bg-white text-xs"
                  onClick={() => setPathHint(MERCY_BLUE_PATH_FORWARD.navigation.en)}
                >
                  <Sparkles className="mr-1.5 h-3 w-3" />
                  Hướng dẫn
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 rounded-full border-blue-200 bg-white text-xs"
                  onClick={() => setPathHint(MERCY_BLUE_PATH_FORWARD.idle.en)}
                >
                  <LifeBuoy className="mr-1.5 h-3 w-3" />
                  Cần giúp?
                </Button>
              </div>

              <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                Advisor 2026
              </p>
            </div>
          ) : null}
        </div>
      ) : null}
    </>
  );
}

export default MercyGuide;