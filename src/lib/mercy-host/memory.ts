/**
 * Mercy Memory System
 * 
 * Stores user-related data for personalized host behavior.
 * Uses localStorage for persistence across sessions.
 */

import type { EmotionState } from './emotionModel';

export interface MercyMemory {
  userName: string | null;
  lastVisitISO: string | null;
  lastRoom: string | null;
  totalVisits: number;
  hasOnboarded: boolean;
  onboardingEmotionSeed: EmotionState | null;
  emotionCoachingLevel: 'off' | 'gentle' | 'full';
  hostPreferences: {
    enabled: boolean;
    avatarStyle: string;
    language: 'en' | 'vi';
    voiceEnabled: boolean;
    animationsEnabled: boolean;
    silenceMode: boolean;
  };
  greetedRooms: string[];
  favoriteRooms: string[];
  lastMood: 'neutral' | 'happy' | 'focused' | 'tired' | null;
  sessionCount: number;
}

const MEMORY_KEY = 'mercy_host_memory';

const DEFAULT_MEMORY: MercyMemory = {
  userName: null,
  lastVisitISO: null,
  lastRoom: null,
  totalVisits: 0,
  hasOnboarded: false,
  onboardingEmotionSeed: null,
  emotionCoachingLevel: 'full',
  hostPreferences: {
    enabled: true,
    avatarStyle: 'minimalist',
    language: 'en',
    voiceEnabled: true,
    animationsEnabled: true,
    silenceMode: false
  },
  greetedRooms: [],
  favoriteRooms: [],
  lastMood: null,
  sessionCount: 0
};

/**
 * Get all memory data
 */
export function getMemory(): MercyMemory {
  try {
    const stored = localStorage.getItem(MEMORY_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return { ...DEFAULT_MEMORY, ...parsed };
    }
  } catch {
    // ignore parse errors
  }
  return { ...DEFAULT_MEMORY };
}

/**
 * Set entire memory object
 */
export function setMemory(memory: MercyMemory): void {
  try {
    localStorage.setItem(MEMORY_KEY, JSON.stringify(memory));
  } catch {
    // ignore storage errors
  }
}

/**
 * Update specific memory fields
 */
export function updateMemory(updates: Partial<MercyMemory>): void {
  const current = getMemory();
  setMemory({ ...current, ...updates });
}

/**
 * Clear all memory
 */
export function clearMemory(): void {
  try {
    localStorage.removeItem(MEMORY_KEY);
  } catch {
    // ignore
  }
}

/**
 * Get a specific memory value
 */
export function get<K extends keyof MercyMemory>(key: K): MercyMemory[K] {
  return getMemory()[key];
}

/**
 * Set a specific memory value
 */
export function set<K extends keyof MercyMemory>(key: K, value: MercyMemory[K]): void {
  const memory = getMemory();
  memory[key] = value;
  setMemory(memory);
}

/**
 * Record a room visit
 */
export function recordVisit(roomId: string): void {
  const memory = getMemory();
  memory.lastRoom = roomId;
  memory.lastVisitISO = new Date().toISOString();
  memory.totalVisits += 1;
  
  // Track greeted rooms (max 50)
  if (!memory.greetedRooms.includes(roomId)) {
    memory.greetedRooms = [...memory.greetedRooms.slice(-49), roomId];
  }
  
  setMemory(memory);
}

/**
 * Check if this is a new session (based on 4hr gap)
 */
export function isNewSession(): boolean {
  const memory = getMemory();
  if (!memory.lastVisitISO) return true;
  
  const lastVisit = new Date(memory.lastVisitISO).getTime();
  const now = Date.now();
  const fourHours = 4 * 60 * 60 * 1000;
  
  return (now - lastVisit) > fourHours;
}

/**
 * Increment session count if new session
 */
export function startSession(): boolean {
  if (isNewSession()) {
    const memory = getMemory();
    memory.sessionCount += 1;
    memory.lastVisitISO = new Date().toISOString();
    setMemory(memory);
    return true;
  }
  return false;
}

/**
 * Check if user has been greeted in a room this session
 */
export function hasBeenGreetedInRoom(roomId: string): boolean {
  try {
    const sessionKey = `mercy_session_greeted_${roomId}`;
    return sessionStorage.getItem(sessionKey) === 'true';
  } catch {
    return false;
  }
}

/**
 * Mark room as greeted this session
 */
export function markRoomGreeted(roomId: string): void {
  try {
    const sessionKey = `mercy_session_greeted_${roomId}`;
    sessionStorage.setItem(sessionKey, 'true');
  } catch {
    // ignore
  }
}

/**
 * Get time since last visit in hours
 */
export function getHoursSinceLastVisit(): number | null {
  const memory = getMemory();
  if (!memory.lastVisitISO) return null;
  
  const lastVisit = new Date(memory.lastVisitISO).getTime();
  const now = Date.now();
  return (now - lastVisit) / (60 * 60 * 1000);
}

/**
 * Check if user is a first-time visitor
 */
export function isFirstTimeVisitor(): boolean {
  return getMemory().totalVisits === 0;
}

/**
 * Check if onboarding is needed
 */
export function needsOnboarding(): boolean {
  const memory = getMemory();
  return !memory.hasOnboarded && memory.totalVisits < 2;
}

/**
 * Mark onboarding as complete
 */
export function completeOnboarding(): void {
  updateMemory({ hasOnboarded: true });
}

// Export memory API as object for convenient use
export const memory = {
  get: getMemory,
  set: setMemory,
  update: updateMemory,
  clear: clearMemory,
  getValue: get,
  setValue: set,
  recordVisit,
  isNewSession,
  startSession,
  hasBeenGreetedInRoom,
  markRoomGreeted,
  getHoursSinceLastVisit,
  isFirstTimeVisitor,
  needsOnboarding,
  completeOnboarding
};
