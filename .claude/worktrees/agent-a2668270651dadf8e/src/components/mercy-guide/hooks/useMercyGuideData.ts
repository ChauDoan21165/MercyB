// PATH: src/components/mercy-guide/hooks/useMercyGuideData.ts

import { useEffect, useMemo, useState } from "react";
import { getCompanionProfile, type CompanionProfile } from "@/services/companion";
import { getSuggestionsForUser, type SuggestedItem } from "@/services/suggestions";
import {
  getRecentMoods,
  getYesterdayAndTodaySummary,
  type StudyLogEntry,
} from "@/services/studyLog";
import {
  buildMercyContext,
  getBreathingReplyId,
  getGreetingReplyId,
  getMercyReply,
  preloadMercyLibrary,
} from "@/mercy";
import { getCheckInMessage } from "../shared";
import { buildRoomAwareCheckIn, cleanText } from "../mercyGuide.utils";
import type { CheckInMessage, ExtendedCompanionProfile } from "../types";

type RoomSummary = {
  hasRoomContext: boolean;
  roomName?: string;
};

type UseMercyGuideDataInput = {
  isOpen: boolean;
  roomId?: string;
  tags?: string[];
  roomSummary: RoomSummary;
  triggerBilingualHint: (hintKey: "idle") => void;
};

export function useMercyGuideData({
  isOpen,
  roomId,
  tags,
  roomSummary,
  triggerBilingualHint,
}: UseMercyGuideDataInput) {
  const [profile, setProfile] = useState<CompanionProfile>({});
  const [checkInMessage, setCheckInMessage] = useState<CheckInMessage | null>(null);
  const [suggestions, setSuggestions] = useState<SuggestedItem[]>([]);
  const [yesterdaySummary, setYesterdaySummary] = useState<StudyLogEntry | undefined>();
  const [todayTotalMinutes, setTodayTotalMinutes] = useState(0);
  const [hasHeavyMoods, setHasHeavyMoods] = useState(false);

  useEffect(() => {
    preloadMercyLibrary();
  }, []);

  const normalizedTags = useMemo(() => (tags ? [...tags] : []), [tags]);
  const tagsKey = useMemo(() => normalizedTags.join("|"), [normalizedTags]);

  const hasRoomContext = roomSummary.hasRoomContext;
  const roomName = roomSummary.roomName ?? "";

  const guessedName = useMemo(() => {
    const profileWithExtras = profile as ExtendedCompanionProfile;

    return (
      cleanText(profile.preferred_name) ||
      cleanText(profileWithExtras.display_name) ||
      cleanText(profileWithExtras.first_name) ||
      cleanText(profileWithExtras.name) ||
      ""
    );
  }, [profile]);

  const greeting = useMemo<CheckInMessage>(() => {
    if (guessedName && hasRoomContext) {
      return {
        en: `Hi, ${guessedName}. You’re in ${roomName}.`,
        vi: `Chào ${guessedName}. Bạn đang ở ${roomName}.`,
      };
    }

    if (guessedName) {
      return {
        en: `Hi, ${guessedName}. How can I help?`,
        vi: `Chào ${guessedName}. Mình giúp gì được cho bạn?`,
      };
    }

    if (hasRoomContext) {
      return {
        en: `Hi! You’re in ${roomName}.`,
        vi: `Chào bạn! Bạn đang ở ${roomName}.`,
      };
    }

    return {
      en: "Hi! How can I help?",
      vi: "Chào bạn! Mình giúp gì được?",
    };
  }, [guessedName, hasRoomContext, roomName]);

  useEffect(() => {
    if (!isOpen) return;

    let cancelled = false;

    async function loadData() {
      try {
        const profileData = await getCompanionProfile();
        if (cancelled) return;
        setProfile(profileData);

        const ctx = buildMercyContext({
          lastActiveAt: profileData.last_english_activity,
          isFirstVisit: !profileData.last_english_activity,
        });

        const greetingId = getGreetingReplyId(ctx);
        const greetingReply = await getMercyReply(greetingId);
        if (cancelled) return;

        if (hasRoomContext) {
          setCheckInMessage(
            buildRoomAwareCheckIn(profileData, {
              hasRoomContext,
              roomName: roomName || undefined,
            })
          );
        } else if (greetingReply) {
          setCheckInMessage({
            en: greetingReply.text_en ?? greeting.en,
            vi: greetingReply.text_vi ?? greeting.vi,
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

        await getMercyReply(getBreathingReplyId("intro"));
        if (cancelled) return;

        const suggestionsData = await getSuggestionsForUser({
          profile: profileData,
          lastRoomId: roomId,
          lastTags: normalizedTags,
        });
        if (cancelled) return;
        setSuggestions(suggestionsData);

        const summary = await getYesterdayAndTodaySummary();
        if (cancelled) return;
        setYesterdaySummary(summary.yesterday);
        setTodayTotalMinutes(summary.todayTotalMinutes);

        const recentMoods = await getRecentMoods(3);
        if (cancelled) return;
        const heavyCount = recentMoods.filter(
          (m) => m === "heavy" || m === "anxious"
        ).length;
        setHasHeavyMoods(heavyCount >= 2);

        if (!hasRoomContext) {
          triggerBilingualHint("idle");
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Failed to load guide data:", error);
        }
      }
    }

    void loadData();

    return () => {
      cancelled = true;
    };
  }, [
    isOpen,
    roomId,
    tagsKey,
    hasRoomContext,
    roomName,
    triggerBilingualHint,
    normalizedTags,
    greeting,
  ]);

  return {
    profile,
    setProfile,
    checkInMessage,
    suggestions,
    yesterdaySummary,
    todayTotalMinutes,
    hasHeavyMoods,
    greeting,
  };
}