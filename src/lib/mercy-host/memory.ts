/**
 * Mercy Memory System
 * 
 * Stores user-related data for personalized host behavior.
 * Uses localStorage for persistence across sessions.
 * Phase 6: Delegates to memorySchema.ts for single source of truth.
 * Phase 9: Added talk usage helpers.
 */

import { 
  loadValidatedMemory, 
  saveMemory as saveSchemaMemory,
  updateMemory as updateSchemaMemory,
  type MercyMemoryV2,
  type RitualIntensity,
  type EmotionCoachingLevel
} from './memorySchema';
import { 
  type TalkUsage,
  type TalkBudget,
  resetTalkUsageIfNewDay,
  incrementTalkUsage as incrementTalkUsageRaw,
  createDefaultTalkUsage
} from './talkBudget';

// Re-export types for backward compatibility
export type { MercyMemoryV2, RitualIntensity, EmotionCoachingLevel, TalkUsage };
export type MercyMemory = MercyMemoryV2;

const MEMORY_KEY = 'mercy_host_memory';

/**
 * Get all memory data
 */
export function getMemory(): MercyMemoryV2 {
  return loadValidatedMemory();
}

/**
 * Set entire memory object
 */
export function setMemory(memory: MercyMemoryV2): void {
  saveSchemaMemory(memory);
}

/**
 * Update specific memory fields
 */
export function updateMemory(updates: Partial<MercyMemoryV2>): void {
  updateSchemaMemory(updates);
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
export function get<K extends keyof MercyMemoryV2>(key: K): MercyMemoryV2[K] {
  return getMemory()[key];
}

/**
 * Set a specific memory value
 */
export function set<K extends keyof MercyMemoryV2>(key: K, value: MercyMemoryV2[K]): void {
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

/**
 * Add a tier to the celebrated list
 */
export function addCelebratedTier(tier: string): void {
  const memory = getMemory();
  if (!memory.tiersCelebrated.includes(tier.toLowerCase())) {
    memory.tiersCelebrated = [...memory.tiersCelebrated, tier.toLowerCase()];
    setMemory(memory);
  }
}

/**
 * Check if a tier has been celebrated
 */
export function hasCelebratedTier(tier: string): boolean {
  return getMemory().tiersCelebrated.includes(tier.toLowerCase());
}

/**
 * Update streak milestone
 */
export function recordStreakMilestone(days: number): void {
  updateMemory({ lastStreakMilestone: days });
}

/**
 * Update streak days
 */
export function updateStreakDays(newStreak: number): void {
  const memory = getMemory();
  memory.streakDays = newStreak;
  if (newStreak > memory.longestStreak) {
    memory.longestStreak = newStreak;
  }
  setMemory(memory);
}

// ============ Phase 9: Talk Budget Helpers ============

/**
 * Get current talk usage (auto-resets if new day)
 */
export function getTalkUsage(): TalkUsage {
  const memory = getMemory();
  return resetTalkUsageIfNewDay(memory.talkUsage || createDefaultTalkUsage());
}

/**
 * Update talk usage atomically
 */
export function updateTalkUsage(updater: (usage: TalkUsage) => TalkUsage): TalkUsage {
  const memory = getMemory();
  const currentUsage = resetTalkUsageIfNewDay(memory.talkUsage || createDefaultTalkUsage());
  const newUsage = updater(currentUsage);
  memory.talkUsage = newUsage;
  setMemory(memory);
  return newUsage;
}

/**
 * Increment talk usage by delta chars
 */
export function incrementTalkUsage(deltaChars: number, budget: TalkBudget): TalkUsage {
  return updateTalkUsage((usage) => incrementTalkUsageRaw(usage, deltaChars, budget));
}

/**
 * Reset talk usage for today (admin/debug only)
 */
export function resetTalkUsageForToday(): void {
  const memory = getMemory();
  memory.talkUsage = createDefaultTalkUsage();
  setMemory(memory);
}

/**
 * Mark growth mode welcome as seen
 */
export function markGrowthModeSeen(): void {
  updateMemory({ growthModeSeen: true });
}

/**
 * Check if growth mode welcome has been seen
 */
export function hasSeenGrowthModeWelcome(): boolean {
  return getMemory().growthModeSeen;
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
  completeOnboarding,
  addCelebratedTier,
  hasCelebratedTier,
  recordStreakMilestone,
  updateStreakDays,
  // Phase 9: Talk budget
  getTalkUsage,
  updateTalkUsage,
  incrementTalkUsage,
  resetTalkUsageForToday,
  markGrowthModeSeen,
  hasSeenGrowthModeWelcome
};
};
