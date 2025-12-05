/**
 * Mercy Memory Schema & Validation
 * 
 * Hardened memory system with schema validation and migration.
 */

import { safeLocalStorage } from './guard';

// Current schema version
export const MEMORY_SCHEMA_VERSION = 2;

export interface MercyMemoryV2 {
  version: number;
  userName: string | null;
  lastVisitISO: string | null;
  lastRoom: string | null;
  totalVisits: number;
  hasOnboarded: boolean;
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
  lastRepairAt: string | null;
}

const MEMORY_KEY = 'mercy_host_memory';

const DEFAULT_MEMORY: MercyMemoryV2 = {
  version: MEMORY_SCHEMA_VERSION,
  userName: null,
  lastVisitISO: null,
  lastRoom: null,
  totalVisits: 0,
  hasOnboarded: false,
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
  sessionCount: 0,
  lastRepairAt: null
};

/**
 * Validate memory object against schema
 */
export function validateMemorySchema(data: unknown): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data || typeof data !== 'object') {
    return { valid: false, errors: ['Memory is not an object'] };
  }

  const mem = data as Record<string, unknown>;

  // Check required fields
  if (typeof mem.version !== 'number') {
    errors.push('Missing or invalid version');
  }

  if (mem.totalVisits !== undefined && typeof mem.totalVisits !== 'number') {
    errors.push('Invalid totalVisits');
  }

  if (mem.hasOnboarded !== undefined && typeof mem.hasOnboarded !== 'boolean') {
    errors.push('Invalid hasOnboarded');
  }

  if (mem.greetedRooms !== undefined && !Array.isArray(mem.greetedRooms)) {
    errors.push('Invalid greetedRooms');
  }

  if (mem.hostPreferences !== undefined) {
    if (typeof mem.hostPreferences !== 'object') {
      errors.push('Invalid hostPreferences');
    } else {
      const prefs = mem.hostPreferences as Record<string, unknown>;
      if (prefs.enabled !== undefined && typeof prefs.enabled !== 'boolean') {
        errors.push('Invalid hostPreferences.enabled');
      }
    }
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Migrate old memory versions to current
 */
export function migrateMemory(data: Record<string, unknown>): MercyMemoryV2 {
  const version = typeof data.version === 'number' ? data.version : 1;

  // Start with defaults
  const migrated: MercyMemoryV2 = { ...DEFAULT_MEMORY };

  // Copy over valid fields from old data
  if (typeof data.userName === 'string') migrated.userName = data.userName;
  if (typeof data.lastVisitISO === 'string') migrated.lastVisitISO = data.lastVisitISO;
  if (typeof data.lastRoom === 'string') migrated.lastRoom = data.lastRoom;
  if (typeof data.totalVisits === 'number') migrated.totalVisits = data.totalVisits;
  if (typeof data.hasOnboarded === 'boolean') migrated.hasOnboarded = data.hasOnboarded;
  if (typeof data.sessionCount === 'number') migrated.sessionCount = data.sessionCount;
  if (Array.isArray(data.greetedRooms)) migrated.greetedRooms = data.greetedRooms.filter(r => typeof r === 'string');
  if (Array.isArray(data.favoriteRooms)) migrated.favoriteRooms = data.favoriteRooms.filter(r => typeof r === 'string');

  // Migrate hostPreferences
  if (data.hostPreferences && typeof data.hostPreferences === 'object') {
    const oldPrefs = data.hostPreferences as Record<string, unknown>;
    migrated.hostPreferences = {
      ...DEFAULT_MEMORY.hostPreferences,
      enabled: typeof oldPrefs.enabled === 'boolean' ? oldPrefs.enabled : true,
      avatarStyle: typeof oldPrefs.avatarStyle === 'string' ? oldPrefs.avatarStyle : 'minimalist',
      language: oldPrefs.language === 'vi' ? 'vi' : 'en',
      voiceEnabled: typeof oldPrefs.voiceEnabled === 'boolean' ? oldPrefs.voiceEnabled : true,
      animationsEnabled: typeof oldPrefs.animationsEnabled === 'boolean' ? oldPrefs.animationsEnabled : true,
      silenceMode: typeof oldPrefs.silenceMode === 'boolean' ? oldPrefs.silenceMode : false
    };
  }

  // V1 → V2: Add silenceMode if missing
  if (version < 2) {
    migrated.hostPreferences.silenceMode = false;
    migrated.lastRepairAt = null;
  }

  // Set current version
  migrated.version = MEMORY_SCHEMA_VERSION;

  return migrated;
}

/**
 * Load memory with validation and auto-repair
 */
export function loadValidatedMemory(): MercyMemoryV2 {
  try {
    const stored = localStorage.getItem(MEMORY_KEY);
    if (!stored) return { ...DEFAULT_MEMORY };

    const parsed = JSON.parse(stored);
    const validation = validateMemorySchema(parsed);

    if (!validation.valid) {
      console.warn('[MercyMemory] Schema validation failed, migrating:', validation.errors);
      const migrated = migrateMemory(parsed);
      saveMemory(migrated);
      return migrated;
    }

    // Check version and migrate if needed
    if (parsed.version < MEMORY_SCHEMA_VERSION) {
      console.info('[MercyMemory] Migrating from v' + parsed.version);
      const migrated = migrateMemory(parsed);
      saveMemory(migrated);
      return migrated;
    }

    return { ...DEFAULT_MEMORY, ...parsed };
  } catch (error) {
    console.error('[MercyMemory] Failed to load, resetting:', error);
    const fresh = { ...DEFAULT_MEMORY, lastRepairAt: new Date().toISOString() };
    saveMemory(fresh);
    return fresh;
  }
}

/**
 * Save memory (with validation)
 */
export function saveMemory(memory: MercyMemoryV2): boolean {
  try {
    memory.version = MEMORY_SCHEMA_VERSION;
    localStorage.setItem(MEMORY_KEY, JSON.stringify(memory));
    return true;
  } catch (error) {
    console.error('[MercyMemory] Failed to save:', error);
    return false;
  }
}

/**
 * Reset memory to defaults
 */
export function resetMemory(): MercyMemoryV2 {
  const fresh = { ...DEFAULT_MEMORY, lastRepairAt: new Date().toISOString() };
  saveMemory(fresh);
  return fresh;
}

/**
 * Update specific memory fields
 */
export function updateMemory(updates: Partial<MercyMemoryV2>): MercyMemoryV2 {
  const current = loadValidatedMemory();
  const updated = { ...current, ...updates };
  saveMemory(updated);
  return updated;
}
