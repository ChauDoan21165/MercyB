// src/hooks/useMercyRoomIntro.ts — MB-BLUE-93.7 — 2025-12-24 (+0700)
import { useState, useCallback, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import { getCompanionEnabled } from "./useCompanionSession";
import { useMusicPlayer } from "@/contexts/MusicPlayerContext";

export type IntroState =
  | "greeting"
  | "ask_feeling"
  | "ask_intro_consent"
  | "playing_intro"
  | "idle";

export type MoodType = "calm" | "okay" | "stressed" | "overwhelmed";

/**
 * Locked (current app reality):
 * - EN audio only. No Vietnamese audio assets in this app right now.
 */
export type IntroLanguage = "en";

export interface RoomIntroState {
  completed: boolean;
  skipped: boolean;
  preferredLanguage?: IntroLanguage;
  lastMood?: MoodType;
}

export interface CompanionAction {
  id: string;
  label: string;
  labelVi?: string;
  onClick: () => void;
}

interface UseMercyRoomIntroProps {
  roomId: string | undefined;
  roomTitleEn?: string;
  roomTitleVi?: string;
  introEn?: string;
  introVi?: string; // kept for future compatibility (not used for audio)
  userName?: string;
}

const INTRO_STATE_KEY = "mercy_room_intro_state";

function getStoredIntroState(): Record<string, RoomIntroState> {
  try {
    return JSON.parse(localStorage.getItem(INTRO_STATE_KEY) || "{}");
  } catch {
    return {};
  }
}

function setStoredIntroState(roomId: string, state: RoomIntroState) {
  const all = getStoredIntroState();
  all[roomId] = state;
  localStorage.setItem(INTRO_STATE_KEY, JSON.stringify(all));
}

export function useMercyRoomIntro({
  roomId,
  roomTitleEn = "this room",
  roomTitleVi = "phòng này",
  introEn = "",
  introVi = "",
  userName = "friend",
}: UseMercyRoomIntroProps) {
  const { requestPlay, notifyStop } = useMusicPlayer();

  const [state, setState] = useState<IntroState>("idle");
  const [visible, setVisible] = useState(false);
  const [text, setText] = useState("");
  const [textVi, setTextVi] = useState<string | undefined>();
  const [actions, setActions] = useState<CompanionAction[]>([]);
  const [isTalking, setIsTalking] = useState(false);
  const [currentMood, setCurrentMood] = useState<MoodType | null>(null);

  const hasInitialized = useRef(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastRoomRef = useRef<string | undefined>(undefined);

  // Debug mode
  const isDebugMode =
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("debug") === "companion";

  const getRoomState = useCallback((): RoomIntroState | null => {
    if (!roomId) return null;
    return getStoredIntroState()[roomId] || null;
  }, [roomId]);

  const saveRoomState = useCallback(
    (update: Partial<RoomIntroState>) => {
      if (!roomId) return;
      const current = getRoomState() || { completed: false, skipped: false };
      setStoredIntroState(roomId, { ...current, ...update });
    },
    [roomId, getRoomState]
  );

  const logEvent = useCallback(
    async (eventType: string, metadata?: Record<string, any>) => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;

        await supabase.from("companion_events").insert({
          user_id: user.id,
          room_id: roomId,
          event_type: eventType,
          metadata: metadata || {},
        });
      } catch (err) {
        console.error("Failed to log companion event:", err);
      }
    },
    [roomId]
  );

  // Reset when room changes
  useEffect(() => {
    if (roomId !== lastRoomRef.current) {
      hasInitialized.current = false;
      lastRoomRef.current = roomId;
      setState("idle");
      setVisible(false);
      setActions([]);
      setIsTalking(false);

      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      notifyStop();
    }
  }, [roomId, notifyStop]);

  const startIntroFlow = useCallback(() => {
    setState("greeting");
    setText(`Hi ${userName}, welcome to ${roomTitleEn}.`);
    // keep vi text only as optional UI text (no vi audio)
    setTextVi(`Chào ${userName}, chào mừng bạn đến với ${roomTitleVi}.`);
    setVisible(true);
    setActions([
      {
        id: "next",
        label: "Continue",
        labelVi: "Tiếp tục",
        onClick: () => goToAskFeeling(),
      },
    ]);
    logEvent("intro_started", { room_title: roomTitleEn });
  }, [userName, roomTitleEn, roomTitleVi, logEvent]);

  const goToAskFeeling = useCallback(() => {
    setState("ask_feeling");
    setText("How are you feeling right now?");
    setTextVi("Bạn đang cảm thấy thế nào?");
    setActions([
      {
        id: "calm",
        label: "😌 Calm",
        labelVi: "😌 Bình tĩnh",
        onClick: () => selectMood("calm"),
      },
      {
        id: "okay",
        label: "🙂 Okay",
        labelVi: "🙂 Ổn",
        onClick: () => selectMood("okay"),
      },
      {
        id: "stressed",
        label: "😟 Stressed",
        labelVi: "😟 Căng thẳng",
        onClick: () => selectMood("stressed"),
      },
      {
        id: "overwhelmed",
        label: "😰 Overwhelmed",
        labelVi: "😰 Quá tải",
        onClick: () => selectMood("overwhelmed"),
      },
    ]);
  }, []);

  const selectMood = useCallback(
    (mood: MoodType) => {
      setCurrentMood(mood);
      saveRoomState({ lastMood: mood });
      logEvent("mood_selected", { mood });
      goToAskIntroConsent();
    },
    [saveRoomState, logEvent]
  );

  const goToAskIntroConsent = useCallback(() => {
    setState("ask_intro_consent");
    setText("Would you like me to introduce this room for you? (EN audio)");
    setTextVi("Bạn có muốn mình giới thiệu phòng này cho bạn không?");
    setActions([
      { id: "yes", label: "Yes, please", labelVi: "Có", onClick: () => playIntro() },
      { id: "no", label: "Not now", labelVi: "Để sau", onClick: () => skipIntro() },
    ]);
  }, []);

  const skipIntro = useCallback(() => {
    saveRoomState({ skipped: true, completed: true, preferredLanguage: "en" });
    logEvent("intro_skipped");
    setText("No problem! Explore at your own pace. I'm here if you need me.");
    setTextVi("Không sao! Hãy khám phá theo cách của bạn. Mình ở đây nếu bạn cần.");
    setActions([]);
    setTimeout(() => {
      setVisible(false);
      setState("idle");
    }, 3000);
  }, [saveRoomState, logEvent]);

  const completeIntro = useCallback(() => {
    saveRoomState({ completed: true, skipped: false, preferredLanguage: "en" });
    logEvent("intro_completed");

    setText("Tap a keyword to explore. I'm here if you need help.");
    setTextVi("Bạn có thể nhấp vào từ khóa để khám phá. Mình luôn ở đây nếu bạn cần hỗ trợ.");
    setActions([]);

    setTimeout(() => {
      setVisible(false);
      setState("idle");
    }, 3500);
  }, [saveRoomState, logEvent]);

  const playIntro = useCallback(async () => {
    if (!roomId) return;

    setState("playing_intro");
    setIsTalking(true);
    setActions([]);

    // Text (EN only for audio)
    setText(introEn || `Welcome to ${roomTitleEn}. Explore the keywords to discover insights.`);
    setTextVi(introVi || `Chào mừng đến với ${roomTitleVi}.`);

    // Audio strategy:
    // 1) try room intro file: /audio/room_intros/{roomId}_intro_en.mp3
    // 2) if not found, just wait a bit (text-only)
    const owner = `room_intro:${roomId}`;

    const tryPlayAudio = async (audioPath: string): Promise<boolean> => {
      // global single-player lock
      const granted = requestPlay({ isPlaying: true, currentTrackName: owner });
      if (!granted) return false;

      return new Promise((resolve) => {
        const audio = new Audio(audioPath);
        audioRef.current = audio;

        let finished = false;
        const done = (ok: boolean) => {
          if (finished) return;
          finished = true;
          notifyStop();
          resolve(ok);
        };

        audio.onplay = () => setIsTalking(true);
        audio.onended = () => done(true);
        audio.onerror = () => done(false);

        // load timeout
        const t = window.setTimeout(() => done(false), 2500);

        audio.oncanplaythrough = () => {
          window.clearTimeout(t);
          audio.play().catch(() => done(false));
        };
      });
    };

    try {
      const audioBasePath = `/audio/room_intros/${roomId}_intro_en.mp3`;
      const audioPlayed = await tryPlayAudio(audioBasePath);

      if (!audioPlayed) {
        // text-only fallback
        notifyStop();
        await new Promise((r) => setTimeout(r, 3000));
      }
    } finally {
      setIsTalking(false);
      completeIntro();
    }
  }, [
    roomId,
    introEn,
    introVi,
    roomTitleEn,
    roomTitleVi,
    requestPlay,
    notifyStop,
    completeIntro,
  ]);

  // Initialize intro flow
  useEffect(() => {
    if (!roomId || hasInitialized.current) return;
    if (!isDebugMode && !getCompanionEnabled()) return;

    const mutedRooms = JSON.parse(localStorage.getItem("mercy_muted_rooms") || "[]");
    if (!isDebugMode && mutedRooms.includes(roomId)) return;

    const roomState = getRoomState();

    if (roomState?.completed && !isDebugMode) {
      hasInitialized.current = true;
      setTimeout(() => {
        setText(`Welcome back to ${roomTitleEn}.`);
        setTextVi(`Chào mừng bạn quay lại ${roomTitleVi}.`);
        setVisible(true);
        setActions([
          {
            id: "replay",
            label: "Replay intro",
            labelVi: "Xem lại giới thiệu",
            onClick: () => {
              saveRoomState({ completed: false });
              startIntroFlow();
            },
          },
        ]);
        setTimeout(() => {
          setVisible(false);
          setState("idle");
        }, 4500);
      }, 800);
      return;
    }

    hasInitialized.current = true;
    setTimeout(startIntroFlow, 900);
  }, [roomId, roomTitleEn, roomTitleVi, isDebugMode, getRoomState, saveRoomState, startIntroFlow]);

  const handleClose = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    notifyStop();
    setVisible(false);
    setIsTalking(false);

    if (state !== "idle" && state !== "playing_intro") {
      saveRoomState({ skipped: true, completed: true, preferredLanguage: "en" });
    }
    setState("idle");
  }, [state, saveRoomState, notifyStop]);

  const replayIntro = useCallback(() => {
    hasInitialized.current = false;
    saveRoomState({ completed: false, skipped: false });
    setTimeout(startIntroFlow, 100);
  }, [saveRoomState, startIntroFlow]);

  return {
    visible,
    text,
    textVi,
    actions,
    isTalking,
    state,
    handleClose,
    replayIntro,
    currentMood,
    isInIntroFlow: state !== "idle",
  };
}

/**
 * Helper to extract room intro content from room data
 */
export function getRoomIntro(room: any): { introEn: string; introVi: string } {
  if (room?.intro_en || room?.intro_vi) {
    return {
      introEn: room.intro_en || room.content?.en || "",
      introVi: room.intro_vi || room.content?.vi || "",
    };
  }
  if (room?.room_essay_en || room?.room_essay_vi) {
    return {
      introEn: room.room_essay_en || "",
      introVi: room.room_essay_vi || "",
    };
  }
  return {
    introEn: room?.content?.en || room?.description_en || "",
    introVi: room?.content?.vi || room?.description_vi || "",
  };
}
