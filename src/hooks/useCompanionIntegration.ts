// FILE: useCompanionIntegration.ts
// PATH: src/hooks/useCompanionIntegration.ts
// VERSION: MB-BLUE-101.16b — 2026-01-19 (+0700)
//
// CLEAN REWRITE (behavior preserved, structure fixed):
// - No double-closing hooks, no stray IIFEs.
// - Debounced callbacks remain VOID (safe for React deps + ESLint).
// - Browser-safe timers (number) instead of NodeJS.Timeout.
// - Keeps ALL original behaviors: greeting, path progress, audio, reflection, mood, next-room suggestion, cleanup.

import { useCallback, useEffect, useMemo, useRef } from "react";
import { useCompanionSession } from "./useCompanionSession";
import type { CompanionCategory } from "@/lib/companionLines";
import {
  getCompanionState,
  updateCompanionState,
  logCompanionEvent,
} from "@/services/companion";

interface UseCompanionIntegrationOptions {
  roomId: string;
  isPathDay?: boolean;
  dayIndex?: number;
}

/**
 * Debounce helper for batching state updates / logs.
 * - Browser timer IDs are numbers in Vite/DOM builds.
 * - Callback is VOID-only so we can safely call async work inside without returning a Promise.
 */
function useDebouncedCallback<TArgs extends unknown[]>(
  callback: (...args: TArgs) => void,
  delay: number
) {
  const timeoutRef = useRef<number | null>(null);
  const pendingArgsRef = useRef<TArgs | null>(null);

  return useCallback(
    (...args: TArgs) => {
      pendingArgsRef.current = args;

      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = window.setTimeout(() => {
        const pending = pendingArgsRef.current;
        if (pending) {
          callback(...pending);
          pendingArgsRef.current = null;
        }
      }, delay);
    },
    [callback, delay]
  );
}

/**
 * High-level hook that integrates companion with room/path pages
 * Handles all trigger points automatically
 */
export function useCompanionIntegration(options: UseCompanionIntegrationOptions) {
  const { roomId, isPathDay = false, dayIndex = 1 } = options;

  const session = useCompanionSession(roomId);

  const hasShownGreetingRef = useRef(false);
  const hasShownAudioIntroRef = useRef(false);
  const hasShownReflectionHintRef = useRef(false);

  const reflectionVisibleTimerRef = useRef<number | null>(null);
  const nextRoomTimerRef = useRef<number | null>(null);

  // Debounced state update to batch writes
  const debouncedUpdateState = useDebouncedCallback(
    (updates: Parameters<typeof updateCompanionState>[0]) => {
      void updateCompanionState(updates).catch((err) => {
        // keep behavior: best-effort only, never crash the UI
        // eslint-disable-next-line no-console
        console.warn("Failed to update companion state:", err);
      });
    },
    3000 // Batch updates every 3 seconds
  );

  // Debounced event logging
  const debouncedLogEvent = useDebouncedCallback(
    (eventType: string, metadata: Record<string, unknown>, roomIdArg?: string) => {
      void logCompanionEvent(eventType, metadata, roomIdArg).catch((err) => {
        // eslint-disable-next-line no-console
        console.warn("Failed to log companion event:", err);
      });
    },
    3000
  );

  // Show greeting on mount (once)
  useEffect(() => {
    if (hasShownGreetingRef.current) return;
    hasShownGreetingRef.current = true;

    const showGreeting = async () => {
      try {
        const state = await getCompanionState();
        let category: CompanionCategory = "greeting";

        if (state?.last_active_at) {
          const lastActive = new Date(state.last_active_at).getTime();
          const now = Date.now();
          const hoursSinceLastVisit = (now - lastActive) / (1000 * 60 * 60);

          if (hoursSinceLastVisit >= 24 * 7) {
            category = "returnAfterGap_long";
          } else if (hoursSinceLastVisit >= 24) {
            category = "returnAfterGap_short";
          }
        }

        // Small delay for page to settle
        window.setTimeout(() => {
          session.showBubble(category);
        }, 800);

        // Update companion state (debounced)
        debouncedUpdateState({
          last_room: roomId,
        });
      } catch {
        // Fallback to simple greeting
        window.setTimeout(() => {
          session.showBubble("greeting");
        }, 800);
      }
    };

    void showGreeting();
  }, [roomId, session, debouncedUpdateState]);

  // Show path progress for day > 1
  useEffect(() => {
    if (!isPathDay || dayIndex <= 1) return;

    // Delay to not overlap with greeting
    const timer = window.setTimeout(() => {
      if (session.canSpeak()) {
        session.showBubble("pathProgress");
      }
    }, 5000);

    return () => window.clearTimeout(timer);
  }, [isPathDay, dayIndex, session]);

  // Handler for first audio play
  const onAudioPlay = useCallback(() => {
    if (hasShownAudioIntroRef.current) return;
    hasShownAudioIntroRef.current = true;
    session.showBubble("audioIntro");
  }, [session]);

  // Handler for audio ended
  const onAudioEnded = useCallback(() => {
    session.showBubble("postAudio", true); // Override cooldown
    debouncedLogEvent("audio_completed", { room_id: roomId }, roomId);
  }, [session, roomId, debouncedLogEvent]);

  // Handler for reflection area becoming visible
  const onReflectionVisible = useCallback(() => {
    if (hasShownReflectionHintRef.current) return;
    hasShownReflectionHintRef.current = true;

    // Small delay after becoming visible
    if (reflectionVisibleTimerRef.current !== null) {
      window.clearTimeout(reflectionVisibleTimerRef.current);
    }

    reflectionVisibleTimerRef.current = window.setTimeout(() => {
      session.showBubble("reflectionHint");
    }, 1500);
  }, [session]);

  // Handler for reflection submission
  const onReflectionSubmit = useCallback(
    (reflectionText: string) => {
      session.showBubble("reflectionThanks", true);

      debouncedLogEvent(
        "reflection_submitted",
        { room_id: roomId, text_length: reflectionText.length },
        roomId
      );

      // Set up next room suggestion after 15 seconds
      if (nextRoomTimerRef.current !== null) {
        window.clearTimeout(nextRoomTimerRef.current);
      }

      nextRoomTimerRef.current = window.setTimeout(() => {
        if (session.canSpeak()) {
          session.showBubble("nextRoomSuggestion");
        }
      }, 15000);
    },
    [session, roomId, debouncedLogEvent]
  );

  // Handler for mood selection
  const onMoodSelect = useCallback(
    (mood: string) => {
      const heavyMoods = ["heavy", "sad", "anxious", "stressed", "overwhelmed"];
      const okayMoods = ["okay", "grateful", "calm", "neutral", "fine"];

      const m = String(mood || "").toLowerCase();

      if (heavyMoods.includes(m)) {
        session.showBubble("moodFollowup_heavy", true);
      } else if (okayMoods.includes(m)) {
        session.showBubble("moodFollowup_okay", true);
      }

      debouncedLogEvent("mood_selected", { mood, room_id: roomId }, roomId);
    },
    [session, roomId, debouncedLogEvent]
  );

  // Handler for path day completion
  const onDayComplete = useCallback(() => {
    session.showBubble("pathProgress", true);
    debouncedLogEvent(
      "path_day_completed",
      { day_index: dayIndex, room_id: roomId },
      roomId
    );
  }, [session, dayIndex, roomId, debouncedLogEvent]);

  // Cleanup timers
  useEffect(() => {
    return () => {
      if (reflectionVisibleTimerRef.current !== null) {
        window.clearTimeout(reflectionVisibleTimerRef.current);
        reflectionVisibleTimerRef.current = null;
      }
      if (nextRoomTimerRef.current !== null) {
        window.clearTimeout(nextRoomTimerRef.current);
        nextRoomTimerRef.current = null;
      }
    };
  }, []);

  // Memoize return value to prevent unnecessary re-renders
  return useMemo(
    () => ({
      ...session,
      // Integration handlers
      onAudioPlay,
      onAudioEnded,
      onReflectionVisible,
      onReflectionSubmit,
      onMoodSelect,
      onDayComplete,
    }),
    [
      session,
      onAudioPlay,
      onAudioEnded,
      onReflectionVisible,
      onReflectionSubmit,
      onMoodSelect,
      onDayComplete,
    ]
  );
}
