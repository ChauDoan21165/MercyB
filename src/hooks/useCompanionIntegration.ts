import { useEffect, useRef, useCallback } from 'react';
import { useCompanionSession } from './useCompanionSession';
import { CompanionCategory } from '@/lib/companionLines';
import { getCompanionState, updateCompanionState, logCompanionEvent } from '@/services/companion';

interface UseCompanionIntegrationOptions {
  roomId: string;
  isPathDay?: boolean;
  dayIndex?: number;
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
  const reflectionVisibleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const nextRoomTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Show greeting on mount
  useEffect(() => {
    if (hasShownGreetingRef.current) return;
    hasShownGreetingRef.current = true;

    const showGreeting = async () => {
      try {
        const state = await getCompanionState();
        let category: CompanionCategory = 'greeting';

        if (state?.last_active_at) {
          const lastActive = new Date(state.last_active_at).getTime();
          const now = Date.now();
          const hoursSinceLastVisit = (now - lastActive) / (1000 * 60 * 60);

          if (hoursSinceLastVisit >= 24 * 7) {
            category = 'returnAfterGap_long';
          } else if (hoursSinceLastVisit >= 24) {
            category = 'returnAfterGap_short';
          }
        }

        // Small delay for page to settle
        setTimeout(() => {
          session.showBubble(category);
        }, 800);

        // Update companion state
        await updateCompanionState({
          last_room: roomId,
        });
      } catch (err) {
        // Fallback to simple greeting
        setTimeout(() => {
          session.showBubble('greeting');
        }, 800);
      }
    };

    showGreeting();
  }, [roomId, session]);

  // Show path progress for day > 1
  useEffect(() => {
    if (!isPathDay || dayIndex <= 1) return;
    
    // Delay to not overlap with greeting
    const timer = setTimeout(() => {
      if (session.canSpeak()) {
        session.showBubble('pathProgress');
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [isPathDay, dayIndex, session]);

  // Handler for first audio play
  const onAudioPlay = useCallback(() => {
    if (hasShownAudioIntroRef.current) return;
    hasShownAudioIntroRef.current = true;
    session.showBubble('audioIntro');
  }, [session]);

  // Handler for audio ended
  const onAudioEnded = useCallback(() => {
    session.showBubble('postAudio', true); // Override cooldown
    logCompanionEvent('audio_completed', { room_id: roomId }, roomId);
  }, [session, roomId]);

  // Handler for reflection area becoming visible
  const onReflectionVisible = useCallback(() => {
    if (hasShownReflectionHintRef.current) return;
    hasShownReflectionHintRef.current = true;

    // Small delay after becoming visible
    reflectionVisibleTimerRef.current = setTimeout(() => {
      session.showBubble('reflectionHint');
    }, 1500);
  }, [session]);

  // Handler for reflection submission
  const onReflectionSubmit = useCallback(
    async (reflectionText: string) => {
      session.showBubble('reflectionThanks', true);
      
      await logCompanionEvent(
        'reflection_submitted',
        { room_id: roomId, text_length: reflectionText.length },
        roomId
      );

      // Set up next room suggestion after 15 seconds
      nextRoomTimerRef.current = setTimeout(() => {
        if (session.canSpeak()) {
          session.showBubble('nextRoomSuggestion');
        }
      }, 15000);
    },
    [session, roomId]
  );

  // Handler for mood selection
  const onMoodSelect = useCallback(
    (mood: string) => {
      const heavyMoods = ['heavy', 'sad', 'anxious', 'stressed', 'overwhelmed'];
      const okayMoods = ['okay', 'grateful', 'calm', 'neutral', 'fine'];

      if (heavyMoods.includes(mood.toLowerCase())) {
        session.showBubble('moodFollowup_heavy', true);
      } else if (okayMoods.includes(mood.toLowerCase())) {
        session.showBubble('moodFollowup_okay', true);
      }

      logCompanionEvent('mood_selected', { mood, room_id: roomId }, roomId);
    },
    [session, roomId]
  );

  // Handler for path day completion
  const onDayComplete = useCallback(() => {
    session.showBubble('pathProgress', true);
    logCompanionEvent('path_day_completed', { day_index: dayIndex, room_id: roomId }, roomId);
  }, [session, dayIndex, roomId]);

  // Cleanup timers
  useEffect(() => {
    return () => {
      if (reflectionVisibleTimerRef.current) {
        clearTimeout(reflectionVisibleTimerRef.current);
      }
      if (nextRoomTimerRef.current) {
        clearTimeout(nextRoomTimerRef.current);
      }
    };
  }, []);

  return {
    ...session,
    // Integration handlers
    onAudioPlay,
    onAudioEnded,
    onReflectionVisible,
    onReflectionSubmit,
    onMoodSelect,
    onDayComplete,
  };
}
