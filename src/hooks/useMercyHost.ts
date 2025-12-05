/**
 * useMercyHost - Complete Mercy Host Engine Hook
 * 
 * Provides full host functionality: greeting, avatar, animations, voice, tier scripts.
 */

import { useState, useEffect, useCallback, useMemo, createElement } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useColorMode } from '@/lib/color-mode';
import { 
  wasGreetingShown,
  markGreetingShown,
  FALLBACK_NAMES
} from '@/lib/mercy-host/mercyHost';
import { getTierScript, getTierGreeting } from '@/lib/mercy-host/tierScripts';
import { getVoiceLineByTrigger, type VoiceLine } from '@/lib/mercy-host/voicePack';
import { getSavedAvatarStyle, saveAvatarStyle, type MercyAvatarStyle } from '@/lib/mercy-host/avatarStyles';
import { MercyAvatar } from '@/components/mercy/MercyAvatar';
import { MercyAnimation } from '@/components/mercy/MercyAnimations';
import type { MercyHostEngine, MercyHostConfig, MercyEvent } from '@/lib/mercy-host/types';

const LAST_ACTIVE_KEY = 'mercy_last_active';
const INACTIVE_THRESHOLD_MS = 12 * 60 * 60 * 1000; // 12 hours

export function useMercyHost(config: MercyHostConfig): MercyHostEngine {
  const { 
    roomId, 
    roomTitle, 
    roomTier = 'free', 
    language = 'en',
    enableVoice = true,
    enableAnimations = true
  } = config;
  
  // State
  const [userName, setUserName] = useState<string | null>(null);
  const [avatarStyle, setAvatarStyleState] = useState<MercyAvatarStyle>(getSavedAvatarStyle);
  const [isGreetingVisible, setIsGreetingVisible] = useState(false);
  const [greetingText, setGreetingText] = useState<{ en: string; vi: string } | null>(null);
  const [currentVoiceLine, setCurrentVoiceLine] = useState<VoiceLine | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [currentAnimation, setCurrentAnimation] = useState<'halo' | 'ripple' | 'glow' | null>('halo');
  
  const { mode } = useColorMode();
  
  // Get tier script
  const tierScript = useMemo(() => getTierScript(roomTier), [roomTier]);
  
  // Fetch user profile
  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name, username')
            .eq('id', user.id)
            .single();
          
          if (profile) {
            const name = profile.full_name || profile.username || user.email?.split('@')[0];
            setUserName(name || null);
          }
        }
      } catch (error) {
        console.warn('[useMercyHost] Failed to fetch user profile:', error);
      }
    };
    
    fetchUserName();
  }, []);
  
  // Check for return after long inactivity
  const checkInactiveReturn = useCallback((): boolean => {
    try {
      const lastActive = localStorage.getItem(LAST_ACTIVE_KEY);
      const now = Date.now();
      localStorage.setItem(LAST_ACTIVE_KEY, String(now));
      
      if (lastActive) {
        const elapsed = now - parseInt(lastActive, 10);
        return elapsed > INACTIVE_THRESHOLD_MS;
      }
    } catch {
      // ignore storage errors
    }
    return false;
  }, []);
  
  // Initialize greeting on room enter
  useEffect(() => {
    if (!roomId || !roomTitle) return;
    
    // Check if already shown this session
    if (wasGreetingShown(roomId)) {
      return;
    }
    
    const displayName = userName || (language === 'vi' ? FALLBACK_NAMES.vi : FALLBACK_NAMES.en);
    const isInactiveReturn = checkInactiveReturn();
    
    // Generate greeting text
    const greeting = getTierGreeting(roomTier, displayName);
    setGreetingText(greeting);
    setIsGreetingVisible(true);
    markGreetingShown(roomId);
    
    // Trigger animation
    if (enableAnimations) {
      setCurrentAnimation('ripple');
      setTimeout(() => setCurrentAnimation('halo'), 1500);
    }
    
    // Play voice if enabled and returning after inactivity
    if (enableVoice && isInactiveReturn) {
      const line = getVoiceLineByTrigger('return_inactive', displayName);
      playVoiceLine(line);
    }
  }, [roomId, roomTitle, roomTier, userName, language, enableVoice, enableAnimations, checkInactiveReturn]);
  
  // Color mode change response
  useEffect(() => {
    // Only respond 30% of the time
    if (Math.random() > 0.3) return;
    
    if (enableVoice) {
      const line = getVoiceLineByTrigger('color_toggle', userName || undefined);
      setCurrentVoiceLine(line);
      
      if (enableAnimations) {
        setCurrentAnimation('glow');
        setTimeout(() => setCurrentAnimation('halo'), 2000);
      }
    }
  }, [mode]);
  
  // Voice playback function
  const playVoiceLine = useCallback((line: VoiceLine) => {
    if (!enableVoice) return;
    
    // Stop any current playback
    if (audioElement) {
      audioElement.pause();
      audioElement.currentTime = 0;
    }
    
    setCurrentVoiceLine(line);
    
    const audioPath = language === 'vi' ? line.audioVi : line.audioEn;
    if (!audioPath) return;
    
    const audio = new Audio(audioPath);
    setAudioElement(audio);
    
    audio.onplay = () => setIsPlaying(true);
    audio.onended = () => {
      setIsPlaying(false);
      setCurrentVoiceLine(null);
    };
    audio.onerror = () => {
      setIsPlaying(false);
      // Voice file not found - this is expected until files are added
      console.debug('[Mercy] Voice file not found:', audioPath);
    };
    
    audio.play().catch(() => {
      // Autoplay blocked or file not found
      setIsPlaying(false);
    });
  }, [enableVoice, language, audioElement]);
  
  // Actions
  const greet = useCallback(() => {
    const displayName = userName || (language === 'vi' ? FALLBACK_NAMES.vi : FALLBACK_NAMES.en);
    const greeting = getTierGreeting(roomTier, displayName);
    setGreetingText(greeting);
    setIsGreetingVisible(true);
    
    if (enableAnimations) {
      setCurrentAnimation('ripple');
      setTimeout(() => setCurrentAnimation('halo'), 1500);
    }
    
    if (enableVoice) {
      const line = getVoiceLineByTrigger('room_enter', displayName);
      playVoiceLine(line);
    }
  }, [userName, language, roomTier, enableAnimations, enableVoice, playVoiceLine]);
  
  const dismiss = useCallback(() => {
    setIsGreetingVisible(false);
  }, []);
  
  const reopen = useCallback(() => {
    setIsGreetingVisible(true);
  }, []);
  
  const playVoice = useCallback((trigger: VoiceLine['trigger']) => {
    const displayName = userName || undefined;
    const line = getVoiceLineByTrigger(trigger, displayName);
    playVoiceLine(line);
  }, [userName, playVoiceLine]);
  
  const stopVoice = useCallback(() => {
    if (audioElement) {
      audioElement.pause();
      audioElement.currentTime = 0;
    }
    setIsPlaying(false);
    setCurrentVoiceLine(null);
  }, [audioElement]);
  
  const respondToEvent = useCallback((event: MercyEvent) => {
    const displayName = userName || undefined;
    
    switch (event) {
      case 'room_enter':
        greet();
        break;
      case 'entry_complete':
        if (enableVoice && Math.random() > 0.5) {
          const line = getVoiceLineByTrigger('entry_complete', displayName);
          playVoiceLine(line);
        }
        break;
      case 'entry_click':
        if (enableAnimations) {
          setCurrentAnimation('shimmer' as any);
          setTimeout(() => setCurrentAnimation('halo'), 500);
        }
        break;
      case 'color_toggle':
        if (enableVoice && Math.random() > 0.7) {
          const line = getVoiceLineByTrigger('color_toggle', displayName);
          playVoiceLine(line);
        }
        break;
      case 'return_inactive':
        if (enableVoice) {
          const line = getVoiceLineByTrigger('return_inactive', displayName);
          playVoiceLine(line);
        }
        break;
      case 'scroll_reflection':
        if (enableAnimations) {
          setCurrentAnimation('glow');
          setTimeout(() => setCurrentAnimation('halo'), 3000);
        }
        break;
    }
  }, [userName, greet, enableVoice, enableAnimations, playVoiceLine]);
  
  const setAvatarStyle = useCallback((style: MercyAvatarStyle) => {
    setAvatarStyleState(style);
    saveAvatarStyle(style);
  }, []);
  
  // Computed components
  const avatar = useMemo(() => 
    createElement(MercyAvatar, { 
      size: 48, 
      style: avatarStyle,
      animate: enableAnimations 
    }), 
    [avatarStyle, enableAnimations]
  );
  
  const animation = useMemo(() => {
    if (!enableAnimations || !currentAnimation) return null;
    return createElement(MercyAnimation, { variant: currentAnimation, size: 60 });
  }, [enableAnimations, currentAnimation]);
  
  return {
    // State
    tier: roomTier,
    tone: tierScript.tone,
    avatarStyle,
    userName,
    language,
    isGreetingVisible,
    currentVoiceLine,
    isPlaying,
    
    // Computed
    avatar,
    animation,
    greetingText,
    
    // Actions
    greet,
    dismiss,
    reopen,
    playVoice,
    stopVoice,
    respondToEvent,
    setAvatarStyle
  };
}
