/**
 * Mercy Host Engine - Core Implementation
 * 
 * Full engine with init, greet, events, state management.
 * Phase 6: Added rituals, ceremonies, streaks.
 * Phase 7: Added English teacher mode and logging.
 */

import { getTierScript, getTierGreeting, getTierEncouragement } from './tierScripts';
import { getVoiceLineByTrigger, getVoiceLineById, type VoiceLine } from './voicePack';
import { getSavedAvatarStyle, saveAvatarStyle, type MercyAvatarStyle } from './avatarStyles';
import { FALLBACK_NAMES } from './persona';
import { getAnimationForEvent, type MercyEventType, type MercyAnimationType } from './eventMap';
import { 
  getRitualForEvent, 
  getRitualText, 
  computeVisitStreak, 
  checkStreakMilestone,
  updateStreak,
  type RitualSpec
} from './rituals';
import { 
  executeVipCeremony, 
  getCeremonyText, 
  type VipCeremonySpec 
} from './vipCeremonies';
import { isCrisisRoom, isSafeTrigger, enforceSafeEmotion } from './safetyRails';
import { memory } from './memory';
import { submitThrottledEvent } from './eventLimiter';
import { getDomainCategory, isEnglishDomain, isMartialDomain, type DomainCategory } from './domainMap';
import { getTeacherTip, type TeacherLevel, type TeacherContext } from './teacherScripts';
import { getMartialCoachTip, inferMartialDiscipline, type MartialCoachLevel, type MartialContext } from './martialCoachScripts';
import { logEvent } from './logs';
import { 
  getEffectiveBudget, 
  isInGrowthMode, 
  normalizeTierId,
  formatCharCount,
  type TierId 
} from './talkBudget';

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
const RITUAL_BANNER_DURATION_MS = 12000; // 12 seconds
const TEACHER_HINT_DURATION_MS = 20000; // 20 seconds

export type HostPresenceState = 'hidden' | 'idle' | 'active';
export type RitualIntensity = 'off' | 'minimal' | 'normal';

export type { TeacherLevel };
export type { MartialCoachLevel };

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
  // Phase 6: Ritual & Streak state
  visitStreak: number;
  lastVisitISO: string | null;
  lastRitualId: string | null;
  lastRitualText: { en: string; vi: string } | null;
  lastCeremonyTier: string | null;
  isRitualBannerVisible: boolean;
  ritualIntensity: RitualIntensity;
  silenceMode: boolean;
  // Phase 7: Teacher state
  teacherLevel: TeacherLevel;
  currentRoomId: string | null;
  currentRoomDomain: DomainCategory;
  lastEnglishTip: { en: string; vi: string } | null;
  isTeacherHintVisible: boolean;
  // Phase 8: Martial Coach state
  martialCoachLevel: 'off' | 'gentle' | 'focused' | 'dojo';
  currentMartialDiscipline: string | null;
  lastMartialTipId: string | null;
  lastMartialTip: { en: string; vi: string } | null;
  isMartialHintVisible: boolean;
  // Phase 9: Talk Budget state
  talkUsedToday: number;
  talkDailyLimit: number;
  talkSoftWarnAt: number;
  talkHardCap: number;
  isTalkLimited: boolean;
  hasTalkSoftWarned: boolean;
  isGrowthModeActive: boolean;
  hasShownLimitMessageThisSession: boolean;
}

export interface MercyEngineActions {
  init: (config: EngineConfig) => void;
  greet: () => void;
  onEnterRoom: (roomId: string, roomTitle: string) => void;
  onReturnRoom: (roomId: string) => void;
  onTierChange: (newTier: string) => void;
  onEvent: (event: MercyEventType, payload?: Record<string, unknown>) => void;
  onNewSession: (context?: SessionContext) => void;
  onRoomComplete: (roomId: string, roomTags?: string[], roomDomain?: string) => void;
  setEnabled: (enabled: boolean) => void;
  setAvatarStyle: (style: MercyAvatarStyle) => void;
  setLanguage: (lang: 'en' | 'vi') => void;
  setUserName: (name: string | null) => void;
  setRitualIntensity: (intensity: RitualIntensity) => void;
  setSilenceMode: (silent: boolean) => void;
  setTeacherLevel: (level: TeacherLevel) => void;
  dismissTeacherHint: () => void;
  dismissRitualBanner: () => void;
  // Phase 8: Martial Coach
  setMartialCoachLevel: (level: MartialCoachLevel) => void;
  dismissMartialHint: () => void;
  recordMartialPractice: (context?: { discipline?: string }) => void;
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

export interface SessionContext {
  tier?: string;
  roomTags?: string[];
  roomDomain?: string;
  lastVisitISO?: string | null;
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
  let ritualBannerTimeout: ReturnType<typeof setTimeout> | null = null;

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
      const sessionGreeted = JSON.parse(sessionStorage.getItem(STORAGE_KEYS.SESSION_GREETED) || '{}');
      if (sessionGreeted[roomId]) return false;

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
      const sessionGreeted = JSON.parse(sessionStorage.getItem(STORAGE_KEYS.SESSION_GREETED) || '{}');
      sessionGreeted[roomId] = true;
      sessionStorage.setItem(STORAGE_KEYS.SESSION_GREETED, JSON.stringify(sessionGreeted));
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

  // Helper: show ritual banner
  const showRitualBanner = (ritual: RitualSpec | VipCeremonySpec, isCeremony = false) => {
    const state = getState();
    
    // Respect silence mode - no voice or large animations
    if (state.silenceMode) {
      // Still show text banner if not completely off
      if (state.ritualIntensity !== 'off') {
        const text = isCeremony 
          ? { en: (ritual as VipCeremonySpec).textEn, vi: (ritual as VipCeremonySpec).textVi }
          : { en: (ritual as RitualSpec).textEn, vi: (ritual as RitualSpec).textVi };
        
        setState(s => ({
          ...s,
          lastRitualId: ritual.tier || (ritual as RitualSpec).id,
          lastRitualText: text,
          isRitualBannerVisible: true
        }));
        
        scheduleRitualBannerDismiss();
      }
      return;
    }

    const text = isCeremony 
      ? { en: (ritual as VipCeremonySpec).textEn, vi: (ritual as VipCeremonySpec).textVi }
      : { en: (ritual as RitualSpec).textEn, vi: (ritual as RitualSpec).textVi };

    setState(s => ({
      ...s,
      lastRitualId: ritual.tier || (ritual as RitualSpec).id,
      lastRitualText: text,
      lastCeremonyTier: isCeremony ? (ritual as VipCeremonySpec).tier : s.lastCeremonyTier,
      currentAnimation: ritual.animation,
      isRitualBannerVisible: true,
      presenceState: 'active'
    }));

    // Trigger voice if allowed
    if (ritual.voiceTrigger && !state.silenceMode) {
      const voiceLine = getVoiceLineByTrigger(ritual.voiceTrigger, getDisplayName(state));
      if (voiceLine) {
        setState(s => ({ ...s, currentVoiceLine: voiceLine }));
      }
    }

    scheduleRitualBannerDismiss();
  };

  // Helper: schedule banner dismissal
  const scheduleRitualBannerDismiss = () => {
    if (ritualBannerTimeout) clearTimeout(ritualBannerTimeout);
    
    ritualBannerTimeout = setTimeout(() => {
      setState(s => ({ 
        ...s, 
        isRitualBannerVisible: false,
        currentAnimation: 'halo'
      }));
    }, RITUAL_BANNER_DURATION_MS);
  };

  let teacherHintTimeout: ReturnType<typeof setTimeout> | null = null;
  let martialHintTimeout: ReturnType<typeof setTimeout> | null = null;
  const MARTIAL_HINT_DURATION_MS = 12000;

  // Helper: show teacher hint bubble
  const showTeacherHint = (tip: { en: string; vi: string }) => {
    const state = getState();
    if (state.silenceMode || state.ritualIntensity === 'off') return;

    setState(s => ({
      ...s,
      lastEnglishTip: tip,
      isTeacherHintVisible: true
    }));

    // Auto-dismiss after timeout
    if (teacherHintTimeout) clearTimeout(teacherHintTimeout);
    teacherHintTimeout = setTimeout(() => {
      setState(s => ({ ...s, isTeacherHintVisible: false }));
    }, TEACHER_HINT_DURATION_MS);
  };

  // Helper: show martial hint bubble
  const showMartialHint = (tip: { id: string; en: string; vi: string }) => {
    const state = getState();
    if (state.silenceMode || state.ritualIntensity === 'off') return;
    if (!tip.en && !tip.vi) return; // Skip empty tips (off mode)

    setState(s => ({
      ...s,
      lastMartialTipId: tip.id,
      lastMartialTip: { en: tip.en, vi: tip.vi },
      isMartialHintVisible: true
    }));

    // Auto-dismiss after timeout
    if (martialHintTimeout) clearTimeout(martialHintTimeout);
    martialHintTimeout = setTimeout(() => {
      setState(s => ({ ...s, isMartialHintVisible: false }));
    }, MARTIAL_HINT_DURATION_MS);
  };

  // Store reference to onNewSession for use in init
  let onNewSessionFn: ((context?: SessionContext) => void) | null = null;

  const actions: MercyEngineActions = {
    init: (config) => {
      const savedEnabled = localStorage.getItem(STORAGE_KEYS.HOST_ENABLED);
      const savedLang = localStorage.getItem(STORAGE_KEYS.LANGUAGE) as 'en' | 'vi' | null;
      const tier = config.tier || 'free';
      const tierScript = getTierScript(tier);
      const mem = memory.get();

      const tierId = normalizeTierId(tier);
      const talkUsage = memory.getTalkUsage();
      const budget = getEffectiveBudget(tierId, mem.totalVisits);
      const growthActive = isInGrowthMode(tierId, mem.totalVisits);

      setState(s => ({
        ...s,
        isEnabled: savedEnabled !== 'false',
        language: savedLang || config.language || 'en',
        currentTier: tier,
        currentTone: tierScript.tone,
        userName: config.userName || null,
        avatarStyle: getAvatarForTier(tier),
        presenceState: 'active',
        visitStreak: (mem as any).streakDays || 0,
        lastVisitISO: mem.lastVisitISO,
        ritualIntensity: (mem as any).ritualIntensity || 'normal',
        silenceMode: mem.hostPreferences?.silenceMode || false,
        teacherLevel: (mem as any).teacherLevel || 'normal',
        // Phase 8: Martial Coach from memory
        martialCoachLevel: (mem as any).martialCoachLevel || 'off',
        currentMartialDiscipline: (mem as any).lastMartialDiscipline || null,
        lastMartialTipId: (mem as any).lastMartialTipId || null,
        // Phase 9: Talk Budget from memory
        talkUsedToday: talkUsage.usedChars,
        talkDailyLimit: budget.dailyChars,
        talkSoftWarnAt: budget.softWarnAt,
        talkHardCap: budget.hardCap,
        isTalkLimited: talkUsage.hardBlocked,
        hasTalkSoftWarned: talkUsage.softWarned,
        isGrowthModeActive: growthActive
      }));

      resetIdleTimer();

      // Call onNewSession directly (no recursion)
      if (onNewSessionFn) {
        onNewSessionFn({ tier, lastVisitISO: mem.lastVisitISO });
      }
    },

    onNewSession: (context) => {
      const state = getState();
      if (!state.isEnabled) return;

      const tier = context?.tier || state.currentTier;
      const mem = memory.get();
      const previousStreak = (mem as any).streakDays || 0;
      
      // Update streak
      const { streak, milestone } = updateStreak();

      setState(s => ({
        ...s,
        visitStreak: streak,
        lastVisitISO: new Date().toISOString()
      }));

      // Check for comeback after gap (7+ days)
      const daysSinceLastVisit = mem.lastVisitISO 
        ? Math.floor((Date.now() - new Date(mem.lastVisitISO).getTime()) / (1000 * 60 * 60 * 24))
        : 0;

      if (daysSinceLastVisit >= 7) {
        const comebackRitual = getRitualForEvent('comeback_after_gap', {
          tier,
          daysSinceLastVisit,
          roomTags: context?.roomTags,
          roomDomain: context?.roomDomain
        });

        if (comebackRitual) {
          setTimeout(() => showRitualBanner(comebackRitual), jitter());
          return; // Don't also show streak milestone
        }
      }

      // Check for streak milestone
      if (milestone !== null) {
        const streakRitual = getRitualForEvent('streak_milestone', {
          tier,
          streakDays: streak,
          roomTags: context?.roomTags,
          roomDomain: context?.roomDomain
        });

        if (streakRitual) {
          setTimeout(() => showRitualBanner(streakRitual), jitter());
        }
      }
    },

    greet: () => {
      const state = getState();
      if (!state.isEnabled) return;
      if (state.silenceMode) return; // Respect silence mode

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

      setTimeout(() => {
        setState(s => ({ ...s, isBubbleVisible: false }));
      }, 5000 + jitter());
    },

    onEnterRoom: (roomId, roomTitle) => {
      const state = getState();
      if (!state.isEnabled) return;

      // Determine domain category
      const domain = getDomainCategory(roomId, roomTitle);
      
      // Update current room state
      setState(s => ({
        ...s,
        currentRoomId: roomId,
        currentRoomDomain: domain
      }));

      // Log room entry
      logEvent({
        type: 'room_enter',
        roomId,
        roomTitle,
        domain,
        tier: state.currentTier,
        language: state.language
      });

      const isFirstTime = shouldGreet(roomId);
      
      if (isFirstTime && !state.silenceMode) {
        const displayName = getDisplayName(state);
        const greeting = getTierGreeting(state.currentTier, displayName);
        const voiceLine = getVoiceLineByTrigger('room_enter', displayName);

        setTimeout(() => {
          setState(s => ({
            ...s,
            greetingText: {
              en: truncateSpeech(greeting.en.replace('{{roomTitle}}', roomTitle)),
              vi: truncateSpeech(greeting.vi.replace('{{roomTitle}}', roomTitle))
            },
            currentVoiceLine: voiceLine,
            currentAnimation: 'glow',
            isGreetingVisible: true,
            isBubbleVisible: true,
            presenceState: 'active'
          }));

          markGreeted(roomId);
          
          createMercyEngine(setState, getState).trackAnalytics('mercy_host_greeted_room', {
            roomId,
            tier: state.currentTier
          });

          resetIdleTimer();

          setTimeout(() => {
            setState(s => ({ ...s, isBubbleVisible: false, currentAnimation: 'halo' }));
          }, 5000 + jitter());
        }, jitter());
      }

      // Phase 8: Martial Coach behavior
      if (domain === 'martial' && state.martialCoachLevel !== 'off' && !state.silenceMode) {
        const roomTags = [domain];
        const crisisCheck = isCrisisRoom(roomTags, domain);
        if (!crisisCheck) {
          // Determine martial context based on mood (simple heuristic)
          const martialContext: MartialContext = 'martial_room_enter';
          const tip = getMartialCoachTip({
            level: state.martialCoachLevel,
            context: martialContext,
            userName: state.userName
          });
          
          // Show martial hint after greeting fades
          setTimeout(() => {
            showMartialHint(tip);
          }, isFirstTime ? 6000 : 1000);
          
          // Log martial room enter
          logEvent({
            type: 'martial_room_enter',
            roomId,
            domain,
            tier: state.currentTier
          });
        }
      }

      // English Teacher behavior
      if (domain === 'english' && state.teacherLevel !== 'gentle' && !state.silenceMode) {
        const tip = getTeacherTip({
          tier: state.currentTier,
          teacherLevel: state.teacherLevel,
          context: 'ef_room_enter',
          userName: state.userName || undefined
        });
        
        // Show teacher hint after greeting fades
        setTimeout(() => {
          showTeacherHint({ en: tip.en, vi: tip.vi });
        }, isFirstTime ? 6000 : 1000);
      }
    },

    onReturnRoom: (roomId) => {
      const state = getState();
      if (!state.isEnabled || state.silenceMode) return;

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
      const state = getState();
      const prevTier = state.currentTier;
      const tierScript = getTierScript(newTier);

      setState(s => ({
        ...s,
        currentTier: newTier,
        currentTone: tierScript.tone,
        avatarStyle: getAvatarForTier(newTier)
      }));

      // Check for VIP ceremony
      const ceremony = executeVipCeremony(newTier, prevTier);
      
      if (ceremony) {
        // VIP upgrade ceremony
        setTimeout(() => {
          showRitualBanner(ceremony, true);
        }, jitter());
      } else if (newTier.startsWith('vip') && !state.silenceMode) {
        // Generic VIP encouragement
        const encouragement = getTierEncouragement(newTier);
        setTimeout(() => {
          setState(s => ({
            ...s,
            greetingText: encouragement,
            isBubbleVisible: true,
            currentAnimation: 'shimmer'
          }));

          setTimeout(() => {
            setState(s => ({ ...s, isBubbleVisible: false }));
          }, 4000);
        }, jitter());
      }
    },

    onEvent: (event, payload) => {
      const state = getState();
      if (!state.isEnabled) return;

      // Use global throttling
      const canProcess = submitThrottledEvent(event, payload);
      if (!canProcess) return;

      const animation = getAnimationForEvent(event);
      const displayName = getDisplayName(state);

      setState(s => ({
        ...s,
        currentAnimation: animation,
        presenceState: 'active'
      }));

      resetIdleTimer();

      // Handle entry_complete ritual
      if (event === 'entry_complete') {
        const entriesCompleted = (payload?.entriesCompleted as number) || 1;
        const roomTags = payload?.roomTags as string[] | undefined;
        const roomDomain = payload?.roomDomain as string | undefined;

        const ritual = getRitualForEvent('entry_complete', {
          tier: state.currentTier,
          entriesCompleted,
          roomTags,
          roomDomain
        });

        if (ritual && state.ritualIntensity !== 'off') {
          // Only show ritual sometimes to avoid overwhelming
          if (Math.random() > 0.5 || entriesCompleted >= 3) {
            setTimeout(() => showRitualBanner(ritual), jitter());
            return;
          }
        }
      }

      // Existing voice line triggers (with silence mode check)
      if (!state.silenceMode) {
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
      }
    },

    onRoomComplete: (roomId, roomTags, roomDomain) => {
      const state = getState();
      if (!state.isEnabled) return;

      // Determine effective domain
      const effectiveDomain = roomDomain || state.currentRoomDomain || getDomainCategory(roomId);

      // Log room completion
      logEvent({
        type: 'room_complete',
        roomId,
        domain: effectiveDomain,
        tier: state.currentTier,
        language: state.language
      });

      if (state.ritualIntensity === 'off') return;

      const isCrisis = isCrisisRoom(roomTags, roomDomain);

      const ritual = getRitualForEvent('room_complete', {
        tier: state.currentTier,
        roomId,
        roomTags,
        roomDomain
      });

      if (ritual) {
        // For crisis rooms, ensure we use the gentle ritual
        if (isCrisis && !isSafeTrigger(ritual.voiceTrigger, true)) {
          // Get crisis-safe ritual instead
          const safeRitual = getRitualForEvent('room_complete', {
            tier: state.currentTier,
            roomId,
            roomTags: ['crisis'], // Force crisis context
            roomDomain
          });
          if (safeRitual) {
            setTimeout(() => showRitualBanner(safeRitual), jitter());
          }
          return;
        }

        setTimeout(() => showRitualBanner(ritual), jitter());
      }

      // English Teacher behavior for room completion
      if (effectiveDomain === 'english' && !isCrisis && !state.silenceMode) {
        const tip = getTeacherTip({
          tier: state.currentTier,
          teacherLevel: state.teacherLevel,
          context: 'ef_entry_complete',
          userName: state.userName || undefined
        });
        
        // Show teacher tip after ritual fades
        setTimeout(() => {
          showTeacherHint({ en: tip.en, vi: tip.vi });
        }, ritual ? RITUAL_BANNER_DURATION_MS + 1000 : 1000);
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

    setRitualIntensity: (intensity) => {
      const mem = memory.get();
      memory.update({ ...mem, ritualIntensity: intensity } as any);
      setState(s => ({ ...s, ritualIntensity: intensity }));
    },

    setSilenceMode: (silent) => {
      const mem = memory.get();
      memory.update({
        ...mem,
        hostPreferences: { ...mem.hostPreferences, silenceMode: silent }
      });
      setState(s => ({ ...s, silenceMode: silent }));
    },

    setTeacherLevel: (level) => {
      const mem = memory.get();
      memory.update({ ...mem, teacherLevel: level } as any);
      setState(s => ({ ...s, teacherLevel: level }));
    },

    dismissTeacherHint: () => {
      if (teacherHintTimeout) clearTimeout(teacherHintTimeout);
      setState(s => ({ ...s, isTeacherHintVisible: false }));
    },

    // Phase 8: Martial Coach actions
    setMartialCoachLevel: (level) => {
      const mem = memory.get();
      memory.update({ ...mem, martialCoachLevel: level } as any);
      setState(s => ({ ...s, martialCoachLevel: level }));
    },

    dismissMartialHint: () => {
      if (martialHintTimeout) clearTimeout(martialHintTimeout);
      setState(s => ({ ...s, isMartialHintVisible: false }));
    },

    recordMartialPractice: (context) => {
      const mem = memory.get();
      const practiceCount = ((mem as any).martialPracticeCount || 0) + 1;
      const discipline = context?.discipline || getState().currentMartialDiscipline;
      
      memory.update({ 
        ...mem, 
        martialPracticeCount: practiceCount,
        lastMartialDiscipline: discipline
      } as any);
      
      setState(s => ({
        ...s,
        currentMartialDiscipline: discipline
      }));

      // Log practice event
      logEvent({
        type: 'martial_practice',
        extra: { discipline, practiceCount }
      });
    },

    dismissRitualBanner: () => {
      if (ritualBannerTimeout) clearTimeout(ritualBannerTimeout);
      setState(s => ({ ...s, isRitualBannerVisible: false }));
    },

    dismiss: () => {
      setState(s => ({
        ...s,
        isGreetingVisible: false,
        isBubbleVisible: false,
        isRitualBannerVisible: false,
        isTeacherHintVisible: false,
        isMartialHintVisible: false,
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
      // Log to mercy logs
      logEvent({
        type: 'chat_message',
        extra: { analyticsEvent: event, ...data }
      });
      
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('mercy_analytics', {
          detail: { event, data, timestamp: Date.now() }
        }));
      }
    }
  };

  // Wire up onNewSession reference for init() to call
  onNewSessionFn = actions.onNewSession;

  return actions;
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
  isBubbleVisible: false,
  // Phase 6 additions
  visitStreak: 0,
  lastVisitISO: null,
  lastRitualId: null,
  lastRitualText: null,
  lastCeremonyTier: null,
  isRitualBannerVisible: false,
  ritualIntensity: 'normal',
  silenceMode: false,
  // Phase 7 additions
  teacherLevel: 'normal',
  currentRoomId: null,
  currentRoomDomain: 'other',
  lastEnglishTip: null,
  isTeacherHintVisible: false,
  // Phase 8 additions
  martialCoachLevel: 'off',
  currentMartialDiscipline: null,
  lastMartialTipId: null,
  lastMartialTip: null,
  isMartialHintVisible: false,
  // Phase 9 additions
  talkUsedToday: 0,
  talkDailyLimit: 3000,
  talkSoftWarnAt: 2400,
  talkHardCap: 3300,
  isTalkLimited: false,
  hasTalkSoftWarned: false,
  isGrowthModeActive: false,
  hasShownLimitMessageThisSession: false
};
