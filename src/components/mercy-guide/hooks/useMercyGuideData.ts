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
      en: "Hi! How can I help?",
      vi: "Chào bạn! Mình giúp gì được?",
    };
  }, [guessedName, roomSummary]);

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
          setCheckInMessage(
            buildRoomAwareCheckIn(profileData, roomSummary as any)
          );
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

        await getMercyReply(getBreathingReplyId("intro"));

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
          (m) => m === "heavy" || m === "anxious"
        ).length;
        setHasHeavyMoods(heavyCount >= 2);

        if (!roomSummary.hasRoomContext) {
          triggerBilingualHint("idle");
        }
      } catch (error) {
        console.error("Failed to load guide data:", error);
      }
    }

    void loadData();
  }, [isOpen, roomId, roomSummary, tags, triggerBilingualHint]);

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