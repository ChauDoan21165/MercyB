/**
 * Audio Lifecycle Database (ALD) v1.0
 * Phase 5: Track audio file history and state
 * 
 * Tracks:
 * - generated_at
 * - last_verified
 * - last_fixed
 * - last_regenerated
 * - source: "tts" | "manual" | "repaired"
 * - confidence_score
 * - hash of audio file
 */

// ============================================
// Types
// ============================================

export interface AudioLifecycleEntry {
  filename: string;
  roomId: string;
  entrySlug: string;
  language: 'en' | 'vi';
  source: 'tts' | 'manual' | 'repaired' | 'unknown';
  generatedAt: string;
  lastVerified?: string;
  lastFixed?: string;
  lastRegenerated?: string;
  confidenceScore: number;
  fileHash?: string;
  fileSizeBytes?: number;
  durationMs?: number;
  metadata?: Record<string, unknown>;
}

export interface AudioLifecycleDB {
  version: string;
  updatedAt: string;
  totalEntries: number;
  entries: Record<string, AudioLifecycleEntry>;
}

export interface LifecycleStats {
  totalFiles: number;
  bySource: Record<string, number>;
  avgConfidence: number;
  recentlyGenerated: number;
  recentlyFixed: number;
  needsRegeneration: number;
}

// ============================================
// Lifecycle Database Operations
// ============================================

const LIFECYCLE_DB_KEY = 'audio_lifecycle_db';

/**
 * Get the lifecycle database from localStorage (browser) or return empty
 */
export function getLifecycleDB(): AudioLifecycleDB {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return createEmptyDB();
  }
  
  try {
    const stored = localStorage.getItem(LIFECYCLE_DB_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // Invalid JSON, return empty
  }
  
  return createEmptyDB();
}

/**
 * Save the lifecycle database
 */
export function saveLifecycleDB(db: AudioLifecycleDB): void {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return;
  }
  
  db.updatedAt = new Date().toISOString();
  db.totalEntries = Object.keys(db.entries).length;
  
  localStorage.setItem(LIFECYCLE_DB_KEY, JSON.stringify(db));
}

/**
 * Create empty database
 */
function createEmptyDB(): AudioLifecycleDB {
  return {
    version: '1.0',
    updatedAt: new Date().toISOString(),
    totalEntries: 0,
    entries: {},
  };
}

// ============================================
// Entry Operations
// ============================================

/**
 * Add or update a lifecycle entry
 */
export function upsertLifecycleEntry(
  db: AudioLifecycleDB,
  entry: Omit<AudioLifecycleEntry, 'generatedAt'> & { generatedAt?: string }
): AudioLifecycleDB {
  const existing = db.entries[entry.filename];
  
  db.entries[entry.filename] = {
    ...existing,
    ...entry,
    generatedAt: entry.generatedAt || existing?.generatedAt || new Date().toISOString(),
  };
  
  return db;
}

/**
 * Mark an entry as verified
 */
export function markVerified(db: AudioLifecycleDB, filename: string): AudioLifecycleDB {
  if (db.entries[filename]) {
    db.entries[filename].lastVerified = new Date().toISOString();
  }
  return db;
}

/**
 * Mark an entry as fixed/repaired
 */
export function markFixed(db: AudioLifecycleDB, filename: string): AudioLifecycleDB {
  if (db.entries[filename]) {
    db.entries[filename].lastFixed = new Date().toISOString();
    db.entries[filename].source = 'repaired';
  }
  return db;
}

/**
 * Mark an entry as regenerated
 */
export function markRegenerated(db: AudioLifecycleDB, filename: string): AudioLifecycleDB {
  if (db.entries[filename]) {
    db.entries[filename].lastRegenerated = new Date().toISOString();
  }
  return db;
}

/**
 * Get entry by filename
 */
export function getLifecycleEntry(db: AudioLifecycleDB, filename: string): AudioLifecycleEntry | undefined {
  return db.entries[filename];
}

/**
 * Remove entry
 */
export function removeLifecycleEntry(db: AudioLifecycleDB, filename: string): AudioLifecycleDB {
  delete db.entries[filename];
  return db;
}

// ============================================
// Statistics
// ============================================

/**
 * Calculate lifecycle statistics
 */
export function calculateLifecycleStats(db: AudioLifecycleDB): LifecycleStats {
  const entries = Object.values(db.entries);
  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  const bySource: Record<string, number> = {};
  let totalConfidence = 0;
  let recentlyGenerated = 0;
  let recentlyFixed = 0;
  let needsRegeneration = 0;
  
  for (const entry of entries) {
    // Count by source
    bySource[entry.source] = (bySource[entry.source] || 0) + 1;
    
    // Sum confidence
    totalConfidence += entry.confidenceScore;
    
    // Check recent activity
    if (entry.generatedAt && new Date(entry.generatedAt) > oneWeekAgo) {
      recentlyGenerated++;
    }
    
    if (entry.lastFixed && new Date(entry.lastFixed) > oneWeekAgo) {
      recentlyFixed++;
    }
    
    // Check if needs regeneration (low confidence or old)
    if (entry.confidenceScore < 0.7) {
      needsRegeneration++;
    }
  }
  
  return {
    totalFiles: entries.length,
    bySource,
    avgConfidence: entries.length > 0 ? totalConfidence / entries.length : 0,
    recentlyGenerated,
    recentlyFixed,
    needsRegeneration,
  };
}

// ============================================
// Queries
// ============================================

/**
 * Find entries by room
 */
export function findEntriesByRoom(db: AudioLifecycleDB, roomId: string): AudioLifecycleEntry[] {
  return Object.values(db.entries).filter(e => e.roomId === roomId);
}

/**
 * Find entries needing regeneration
 */
export function findEntriesNeedingRegeneration(
  db: AudioLifecycleDB,
  confidenceThreshold = 0.7
): AudioLifecycleEntry[] {
  return Object.values(db.entries).filter(e => e.confidenceScore < confidenceThreshold);
}

/**
 * Find recently modified entries
 */
export function findRecentlyModified(
  db: AudioLifecycleDB,
  days = 7
): AudioLifecycleEntry[] {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  
  return Object.values(db.entries).filter(e => {
    const lastActivity = e.lastRegenerated || e.lastFixed || e.lastVerified || e.generatedAt;
    return lastActivity && new Date(lastActivity) > cutoff;
  });
}

/**
 * Export lifecycle database to JSON
 */
export function exportLifecycleDB(db: AudioLifecycleDB): string {
  return JSON.stringify(db, null, 2);
}

/**
 * Import lifecycle database from JSON
 */
export function importLifecycleDB(json: string): AudioLifecycleDB {
  try {
    const parsed = JSON.parse(json);
    if (parsed.version && parsed.entries) {
      return parsed;
    }
  } catch {
    // Invalid JSON
  }
  return createEmptyDB();
}
