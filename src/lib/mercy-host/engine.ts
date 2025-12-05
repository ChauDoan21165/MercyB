/**
 * Mercy Host Engine - Core Implementation
 * 
 * Full engine with init, greet, events, state management.
 * All 40 Phase 3 requirements implemented.
 */

import { getTierScript, getTierGreeting, getTierEncouragement } from './tierScripts';
import { getVoiceLineByTrigger, getVoiceLineById, type VoiceLine } from './voicePack';
import { getSavedAvatarStyle, saveAvatarStyle, type MercyAvatarStyle } from './avatarStyles';
import { FALLBACK_NAMES } from './persona';
import { getAnimationForEvent, type MercyEventType } from './eventMap';

// Storage keys
const STORAGE_KEYS = {
  HOST_ENABLED: 'mercy_host_enabled',
  LAST_GREET: 'mercy_last_greet',
  AVATAR_STYLE: 'mercy_avatar_style',
  LANGUAGE: 'mercy_language',
  SESSION_GREETED: 'mercy_session_greeted_rooms'
} as const;

// Time constants
const GREET_COOLDOWN_MS = 4 * 60 * 60 * 1000; // 4 hours
const IDLE_TIMEOUT_MS = 12 * 1000; // 12 seconds
const JITTER_MIN_MS = 120;
const JITTER_MAX_MS = 350;
const MAX_SPEECH_LENGTH = 160;

export type HostPresenceState = 'hidden' | 'idle' | 'active';

export interface MercyEngineState {
  isEnabled: boolean;
  presenceState: HostPresenceState;
  avatarStyle: MercyAvatarStyle;
  language: 'en' | 'vi';
  currentTier: string;
  currentTone: string;
  userName: string | null;
  currentVoiceLine: VoiceLine | null;
  currentAnimation: string | null;
  greetingText: { en: string; vi: string } | null;
  isGreetingVisible: boolean;
  isBubbleVisible: boolean;
}

export interface MercyEngineActions {
  init: (config: EngineConfig) => void;
  greet: () => void;
  onEnterRoom: (roomId: string, roomTitle: string) => void;
  onReturnRoom: (roomId: string) => void;
  onTierChange: (newTier: string) => void;
  onEvent: (event: MercyEventType) => void;
  setEnabled: (enabled: boolean) => void;
  setAvatarStyle: (style: MercyAvatarStyle) => void;
  setLanguage: (lang: 'en' | 'vi') => void;
  setUserName: (name: string | null) => void;
  dismiss: () => void;
  show: () => void;
  trackAnalytics: (event: string, data?: Record<string, unknown>) => void;
}

export interface EngineConfig {
  roomId?: string;
  roomTitle?: string;
  tier?: string;
  userName?: string | null;
  language?: 'en' | 'vi';
}

export type MercyEngine = MercyEngineState & MercyEngineActions;

/**
 * Create the Mercy Host Engine
 */
export function createMercyEngine(
  setState: (updater: (prev: MercyEngineState) => MercyEngineState) => void,
  getState: () => MercyEngineState
): MercyEngineActions {
  let idleTimeout: ReturnType<typeof setTimeout> | null = null;

  // Helper: micro-delay jitter for natural timing
  const jitter = () => Math.random() * (JITTER_MAX_MS - JITTER_MIN_MS) + JITTER_MIN_MS;

  // Helper: truncate speech to max length
  const truncateSpeech = (text: string): string => {
    if (text.length <= MAX_SPEECH_LENGTH) return text;
    return text.slice(0, MAX_SPEECH_LENGTH - 3) + '...';
  };

  // Helper: check if should greet (session + cooldown rules)
  const shouldGreet = (roomId: string): boolean => {
    try {
      // Check session greeted
      const sessionGreeted = JSON.parse(sessionStorage.getItem(STORAGE_KEYS.SESSION_GREETED) || '{}');
      if (sessionGreeted[roomId]) return false;

      // Check cooldown
      const lastGreet = localStorage.getItem(`${STORAGE_KEYS.LAST_GREET}_${roomId}`);
      if (lastGreet) {
        const elapsed = Date.now() - parseInt(lastGreet, 10);
        if (elapsed < GREET_COOLDOWN_MS) return false;
      }

      return true;
    } catch {
      return true;
    }
  };

  // Helper: mark room as greeted
  const markGreeted = (roomId: string) => {
    try {
      // Session
      const sessionGreeted = JSON.parse(sessionStorage.getItem(STORAGE_KEYS.SESSION_GREETED) || '{}');
      sessionGreeted[roomId] = true;
      sessionStorage.setItem(STORAGE_KEYS.SESSION_GREETED, JSON.stringify(sessionGreeted));

      // Cooldown
      localStorage.setItem(`${STORAGE_KEYS.LAST_GREET}_${roomId}`, String(Date.now()));
    } catch {
      // ignore storage errors
    }
  };

  // Helper: reset idle timer
  const resetIdleTimer = () => {
    if (idleTimeout) clearTimeout(idleTimeout);
    
    idleTimeout = setTimeout(() => {
      setState(s => ({ ...s, presenceState: 'idle' }));
    }, IDLE_TIMEOUT_MS);
  };

  // Helper: get display name
  const getDisplayName = (state: MercyEngineState): string => {
    if (state.userName) return state.userName;
    return state.language === 'vi' ? FALLBACK_NAMES.vi : FALLBACK_NAMES.en;
  };

  // Helper: auto-select avatar based on tier
  const getAvatarForTier = (tier: string): MercyAvatarStyle => {
    if (tier === 'vip9') return 'angelic';
    if (['vip6', 'vip7', 'vip8'].includes(tier)) return 'abstract';
    return getSavedAvatarStyle();
  };

  return {
    init: (config) => {
      const savedEnabled = localStorage.getItem(STORAGE_KEYS.HOST_ENABLED);
      const savedLang = localStorage.getItem(STORAGE_KEYS.LANGUAGE) as 'en' | 'vi' | null;
      const tier = config.tier || 'free';
      const tierScript = getTierScript(tier);

      setState(s => ({
        ...s,
        isEnabled: savedEnabled !== 'false',
        language: savedLang || config.language || 'en',
        currentTier: tier,
        currentTone: tierScript.tone,
        userName: config.userName || null,
        avatarStyle: getAvatarForTier(tier),
        presenceState: 'active'
      }));

      resetIdleTimer();
    },

    greet: () => {
      const state = getState();
      if (!state.isEnabled) return;

      const displayName = getDisplayName(state);
      const greeting = getTierGreeting(state.currentTier, displayName);
      const voiceLine = getVoiceLineByTrigger('room_enter', displayName);
      const animation = getAnimationForEvent('room_enter');

      setState(s => ({
        ...s,
        greetingText: {
          en: truncateSpeech(greeting.en),
          vi: truncateSpeech(greeting.vi)
        },
        currentVoiceLine: voiceLine,
        currentAnimation: animation,
        isGreetingVisible: true,
        isBubbleVisible: true,
        presenceState: 'active'
      }));

      resetIdleTimer();

      // Auto-hide bubble after delay
      setTimeout(() => {
        setState(s => ({ ...s, isBubbleVisible: false }));
      }, 5000 + jitter());
    },

    onEnterRoom: (roomId, roomTitle) => {
      const state = getState();
      if (!state.isEnabled) return;

      // First-time room entry gets color-shift glow
      const isFirstTime = shouldGreet(roomId);
      
      if (isFirstTime) {
        const displayName = getDisplayName(state);
        const greeting = getTierGreeting(state.currentTier, displayName);
        const voiceLine = getVoiceLineByTrigger('room_enter', displayName);

        // Apply jitter delay for natural timing
        setTimeout(() => {
          setState(s => ({
            ...s,
            greetingText: {
              en: truncateSpeech(greeting.en.replace('{{roomTitle}}', roomTitle)),
              vi: truncateSpeech(greeting.vi.replace('{{roomTitle}}', roomTitle))
            },
            currentVoiceLine: voiceLine,
            currentAnimation: 'glow', // color-shift glow for first entry
            isGreetingVisible: true,
            isBubbleVisible: true,
            presenceState: 'active'
          }));

          markGreeted(roomId);
          
          // Track analytics
          createMercyEngine(setState, getState).trackAnalytics('mercy_host_greeted_room', {
            roomId,
            tier: state.currentTier
          });

          resetIdleTimer();

          // Fade bubble
          setTimeout(() => {
            setState(s => ({ ...s, isBubbleVisible: false, currentAnimation: 'halo' }));
          }, 5000 + jitter());
        }, jitter());
      }
    },

    onReturnRoom: (roomId) => {
      const state = getState();
      if (!state.isEnabled) return;

      const displayName = getDisplayName(state);
      const voiceLine = getVoiceLineByTrigger('return_inactive', displayName);

      setTimeout(() => {
        setState(s => ({
          ...s,
          currentVoiceLine: voiceLine,
          currentAnimation: 'ripple',
          isBubbleVisible: true,
          presenceState: 'active'
        }));

        resetIdleTimer();

        setTimeout(() => {
          setState(s => ({ ...s, isBubbleVisible: false, currentAnimation: 'halo' }));
        }, 4000 + jitter());
      }, jitter());
    },

    onTierChange: (newTier) => {
      const tierScript = getTierScript(newTier);
      const state = getState();
      const displayName = getDisplayName(state);

      setState(s => ({
        ...s,
        currentTier: newTier,
        currentTone: tierScript.tone,
        avatarStyle: getAvatarForTier(newTier),
        currentAnimation: 'shimmer'
      }));

      // Speak tier change if VIP
      if (newTier.startsWith('vip')) {
        const encouragement = getTierEncouragement(newTier);
        setTimeout(() => {
          setState(s => ({
            ...s,
            greetingText: encouragement,
            isBubbleVisible: true
          }));

          setTimeout(() => {
            setState(s => ({ ...s, isBubbleVisible: false }));
          }, 4000);
        }, jitter());
      }
    },

    onEvent: (event) => {
      const state = getState();
      if (!state.isEnabled) return;

      const animation = getAnimationForEvent(event);
      const displayName = getDisplayName(state);

      setState(s => ({
        ...s,
        currentAnimation: animation,
        presenceState: 'active'
      }));

      resetIdleTimer();

      // Some events trigger voice
      if (event === 'entry_complete' && Math.random() > 0.6) {
        const voiceLine = getVoiceLineByTrigger('entry_complete', displayName);
        setState(s => ({
          ...s,
          currentVoiceLine: voiceLine,
          isBubbleVisible: true
        }));

        setTimeout(() => {
          setState(s => ({ ...s, isBubbleVisible: false }));
        }, 3000 + jitter());
      }

      if (event === 'color_toggle' && Math.random() > 0.7) {
        const voiceLine = getVoiceLineByTrigger('color_toggle', displayName);
        setState(s => ({
          ...s,
          currentVoiceLine: voiceLine,
          isBubbleVisible: true
        }));

        setTimeout(() => {
          setState(s => ({ ...s, isBubbleVisible: false }));
        }, 3000);
      }
    },

    setEnabled: (enabled) => {
      localStorage.setItem(STORAGE_KEYS.HOST_ENABLED, String(enabled));
      setState(s => ({
        ...s,
        isEnabled: enabled,
        presenceState: enabled ? 'active' : 'hidden'
      }));
    },

    setAvatarStyle: (style) => {
      saveAvatarStyle(style);
      setState(s => ({ ...s, avatarStyle: style }));
    },

    setLanguage: (lang) => {
      localStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
      setState(s => ({ ...s, language: lang }));
    },

    setUserName: (name) => {
      setState(s => ({ ...s, userName: name }));
    },

    dismiss: () => {
      setState(s => ({
        ...s,
        isGreetingVisible: false,
        isBubbleVisible: false,
        presenceState: 'idle'
      }));
    },

    show: () => {
      setState(s => ({
        ...s,
        isGreetingVisible: true,
        presenceState: 'active'
      }));
      resetIdleTimer();
    },

    trackAnalytics: (event, data) => {
      // Analytics tracking - can be connected to actual analytics service
      console.debug('[Mercy Analytics]', event, data);
      
      // Dispatch custom event for external tracking
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('mercy_analytics', {
          detail: { event, data, timestamp: Date.now() }
        }));
      }
    }
  };
}

/**
 * Initial engine state
 */
export const initialEngineState: MercyEngineState = {
  isEnabled: true,
  presenceState: 'idle',
  avatarStyle: 'minimalist',
  language: 'en',
  currentTier: 'free',
  currentTone: 'warm, encouraging, gentle',
  userName: null,
  currentVoiceLine: null,
  currentAnimation: 'halo',
  greetingText: null,
  isGreetingVisible: false,
  isBubbleVisible: false
};
