import { useState, useCallback, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getCompanionEnabled } from './useCompanionSession';

export type IntroState = 
  | 'greeting'
  | 'ask_feeling'
  | 'ask_intro_consent'
  | 'ask_language'
  | 'playing_intro'
  | 'idle';

export type MoodType = 'calm' | 'okay' | 'stressed' | 'overwhelmed';
export type IntroLanguage = 'en' | 'vi' | 'both';

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
  introVi?: string;
  userName?: string;
}

const INTRO_STATE_KEY = 'mercy_room_intro_state';

function getStoredIntroState(): Record<string, RoomIntroState> {
  try {
    return JSON.parse(localStorage.getItem(INTRO_STATE_KEY) || '{}');
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
  roomTitleEn = 'this room',
  roomTitleVi = 'phòng này',
  introEn = '',
  introVi = '',
  userName = 'friend',
}: UseMercyRoomIntroProps) {
  const [state, setState] = useState<IntroState>('idle');
  const [visible, setVisible] = useState(false);
  const [text, setText] = useState('');
  const [textVi, setTextVi] = useState<string | undefined>();
  const [actions, setActions] = useState<CompanionAction[]>([]);
  const [isTalking, setIsTalking] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<IntroLanguage>('en');
  const [currentMood, setCurrentMood] = useState<MoodType | null>(null);
  
  const hasInitialized = useRef(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastRoomRef = useRef<string | undefined>(undefined);

  // Check if debug mode
  const isDebugMode = typeof window !== 'undefined' && 
    new URLSearchParams(window.location.search).get('debug') === 'companion';

  // Get room intro state
  const getRoomState = useCallback((): RoomIntroState | null => {
    if (!roomId) return null;
    return getStoredIntroState()[roomId] || null;
  }, [roomId]);

  // Save room intro state
  const saveRoomState = useCallback((update: Partial<RoomIntroState>) => {
    if (!roomId) return;
    const current = getRoomState() || { completed: false, skipped: false };
    setStoredIntroState(roomId, { ...current, ...update });
  }, [roomId, getRoomState]);

  // Log event to companion_events
  const logEvent = useCallback(async (eventType: string, metadata?: Record<string, any>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      await supabase.from('companion_events').insert({
        user_id: user.id,
        room_id: roomId,
        event_type: eventType,
        metadata: metadata || {},
      });
    } catch (err) {
      console.error('Failed to log companion event:', err);
    }
  }, [roomId]);

  // Reset when room changes
  useEffect(() => {
    if (roomId !== lastRoomRef.current) {
      hasInitialized.current = false;
      lastRoomRef.current = roomId;
      setState('idle');
      setVisible(false);
      setActions([]);
      setIsTalking(false);
    }
  }, [roomId]);

  // Initialize intro flow
  useEffect(() => {
    if (!roomId || hasInitialized.current) return;
    if (!isDebugMode && !getCompanionEnabled()) return;

    // Check muted rooms
    const mutedRooms = JSON.parse(localStorage.getItem('mercy_muted_rooms') || '[]');
    if (!isDebugMode && mutedRooms.includes(roomId)) return;

    const roomState = getRoomState();
    
    // If intro already completed, show short welcome
    if (roomState?.completed && !isDebugMode) {
      hasInitialized.current = true;
      setTimeout(() => {
        setText(`Welcome back to ${roomTitleEn}.`);
        setTextVi(`Chào mừng bạn quay lại ${roomTitleVi}.`);
        setVisible(true);
        setActions([{
          id: 'replay',
          label: 'Replay intro',
          labelVi: 'Xem lại giới thiệu',
          onClick: () => {
            saveRoomState({ completed: false });
            startIntroFlow();
          }
        }]);
        // Auto-hide after 5s
        setTimeout(() => {
          setVisible(false);
          setState('idle');
        }, 5000);
      }, 800);
      return;
    }

    // Start intro flow
    hasInitialized.current = true;
    setTimeout(startIntroFlow, 1000);
  }, [roomId, roomTitleEn, roomTitleVi, isDebugMode]);

  const startIntroFlow = useCallback(() => {
    setState('greeting');
    setText(`Hi ${userName}, welcome to ${roomTitleEn}.`);
    setTextVi(`Chào ${userName}, chào mừng bạn đến với ${roomTitleVi}.`);
    setVisible(true);
    setActions([{
      id: 'next',
      label: 'Continue',
      labelVi: 'Tiếp tục',
      onClick: () => goToAskFeeling(),
    }]);
    logEvent('intro_started', { room_title: roomTitleEn });
  }, [userName, roomTitleEn, roomTitleVi, logEvent]);

  const goToAskFeeling = useCallback(() => {
    setState('ask_feeling');
    setText('How are you feeling right now?');
    setTextVi('Bạn đang cảm thấy thế nào?');
    setActions([
      { id: 'calm', label: '😌 Calm', labelVi: '😌 Bình tĩnh', onClick: () => selectMood('calm') },
      { id: 'okay', label: '🙂 Okay', labelVi: '🙂 Ổn', onClick: () => selectMood('okay') },
      { id: 'stressed', label: '😟 Stressed', labelVi: '😟 Căng thẳng', onClick: () => selectMood('stressed') },
      { id: 'overwhelmed', label: '😰 Overwhelmed', labelVi: '😰 Quá tải', onClick: () => selectMood('overwhelmed') },
    ]);
  }, []);

  const selectMood = useCallback((mood: MoodType) => {
    setCurrentMood(mood);
    saveRoomState({ lastMood: mood });
    logEvent('mood_selected', { mood });
    goToAskIntroConsent();
  }, [saveRoomState, logEvent]);

  const goToAskIntroConsent = useCallback(() => {
    setState('ask_intro_consent');
    setText('Would you like me to introduce this room for you?');
    setTextVi('Bạn có muốn mình giới thiệu phòng này cho bạn không?');
    setActions([
      { id: 'yes', label: 'Yes, please', labelVi: 'Có', onClick: () => goToAskLanguage() },
      { id: 'no', label: 'Not now', labelVi: 'Để sau', onClick: () => skipIntro() },
    ]);
  }, []);

  const skipIntro = useCallback(() => {
    saveRoomState({ skipped: true, completed: true });
    logEvent('intro_skipped');
    setText("No problem! Explore at your own pace. I'm here if you need me.");
    setTextVi('Không sao! Hãy khám phá theo cách của bạn. Mình ở đây nếu bạn cần.');
    setActions([]);
    setTimeout(() => {
      setVisible(false);
      setState('idle');
    }, 3000);
  }, [saveRoomState, logEvent]);

  const goToAskLanguage = useCallback(() => {
    setState('ask_language');
    setText('Which language would you like today?');
    setTextVi('Hôm nay bạn muốn nghe bằng ngôn ngữ nào?');
    setActions([
      { id: 'en', label: 'English', labelVi: 'Tiếng Anh', onClick: () => selectLanguage('en') },
      { id: 'vi', label: 'Vietnamese', labelVi: 'Tiếng Việt', onClick: () => selectLanguage('vi') },
      { id: 'both', label: 'Both', labelVi: 'Cả hai', onClick: () => selectLanguage('both') },
    ]);
  }, []);

  const selectLanguage = useCallback((lang: IntroLanguage) => {
    setSelectedLanguage(lang);
    saveRoomState({ preferredLanguage: lang });
    logEvent('language_selected', { language: lang });
    playIntro(lang);
  }, [saveRoomState, logEvent]);

  const playIntro = useCallback(async (lang: IntroLanguage) => {
    setState('playing_intro');
    setIsTalking(true);
    setActions([]);

    // Set the intro text based on language
    if (lang === 'en') {
      setText(introEn || `Welcome to ${roomTitleEn}. Explore the keywords to discover insights.`);
      setTextVi(undefined);
    } else if (lang === 'vi') {
      setText(introVi || `Chào mừng đến với ${roomTitleVi}. Khám phá từ khóa để tìm hiểu thêm.`);
      setTextVi(undefined);
    } else {
      // Both - show English first
      setText(introEn || `Welcome to ${roomTitleEn}.`);
      setTextVi(introVi || `Chào mừng đến với ${roomTitleVi}.`);
    }

    // Try to play pre-recorded audio first
    const audioBasePath = `/audio/room_intros/${roomId}`;
    let audioPlayed = false;

    const tryPlayAudio = async (audioPath: string): Promise<boolean> => {
      return new Promise((resolve) => {
        const audio = new Audio(audioPath);
        audioRef.current = audio;
        
        audio.oncanplaythrough = () => {
          audio.play().catch(() => resolve(false));
        };
        audio.onended = () => resolve(true);
        audio.onerror = () => resolve(false);
        
        // Timeout after 3s if audio doesn't load
        setTimeout(() => resolve(false), 3000);
      });
    };

    // Try playing audio based on language selection
    if (lang === 'en' || lang === 'both') {
      audioPlayed = await tryPlayAudio(`${audioBasePath}_intro_en.mp3`);
    }
    if ((lang === 'vi' || lang === 'both') && !audioPlayed) {
      audioPlayed = await tryPlayAudio(`${audioBasePath}_intro_vi.mp3`);
    }

    // If no pre-recorded audio, just show text for a few seconds
    if (!audioPlayed) {
      await new Promise(resolve => setTimeout(resolve, 4000));
    }

    setIsTalking(false);
    completeIntro();
  }, [roomId, introEn, introVi, roomTitleEn, roomTitleVi]);

  const completeIntro = useCallback(() => {
    saveRoomState({ completed: true, skipped: false });
    logEvent('intro_completed');
    
    setText("You can tap the keywords to explore. I'm here if you need help.");
    setTextVi('Bạn có thể nhấp vào từ khóa để khám phá. Mình luôn ở đây nếu bạn cần hỗ trợ.');
    setActions([]);
    
    setTimeout(() => {
      setVisible(false);
      setState('idle');
    }, 4000);
  }, [saveRoomState, logEvent]);

  // Manual close handler
  const handleClose = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setVisible(false);
    setIsTalking(false);
    
    // If closed during flow, mark as skipped
    if (state !== 'idle' && state !== 'playing_intro') {
      saveRoomState({ skipped: true, completed: true });
    }
    setState('idle');
  }, [state, saveRoomState]);

  // Replay intro function (for external trigger)
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
    isInIntroFlow: state !== 'idle',
  };
}

/**
 * Helper to extract room intro content from room data
 */
export function getRoomIntro(room: any): { introEn: string; introVi: string } {
  // Try explicit intro fields first
  if (room?.intro_en || room?.intro_vi) {
    return {
      introEn: room.intro_en || room.content?.en || '',
      introVi: room.intro_vi || room.content?.vi || '',
    };
  }
  
  // Fallback to room essay
  if (room?.room_essay_en || room?.room_essay_vi) {
    return {
      introEn: room.room_essay_en || '',
      introVi: room.room_essay_vi || '',
    };
  }
  
  // Fallback to content fields
  return {
    introEn: room?.content?.en || room?.description_en || '',
    introVi: room?.content?.vi || room?.description_vi || '',
  };
}
