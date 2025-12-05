/**
 * Mercy Host Logs - Phase 7
 * 
 * Client-side event logging for user behavior tracking.
 * Stores last 100 events with localStorage persistence.
 */

const LOGS_KEY = 'mercy_host_logs';
const MAX_LOGS = 100;

export type MercyLogEventType = 
  | 'room_enter'
  | 'room_complete'
  | 'entry_click'
  | 'chat_message'
  | 'ef_practice'
  | 'streak_milestone'
  | 'vip_upgrade'
  | 'color_toggle'
  | 'host_toggle';

export interface MercyLogEvent {
  id: string;
  type: MercyLogEventType;
  timestampISO: string;
  roomId?: string;
  roomTitle?: string;
  entrySlug?: string;
  tier?: string;
  domain?: string;
  language?: 'en' | 'vi';
  extra?: Record<string, unknown>;
}

/**
 * Generate unique ID for log entry
 */
function generateLogId(): string {
  return `log_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Get all logs from storage
 */
function getStoredLogs(): MercyLogEvent[] {
  try {
    const stored = localStorage.getItem(LOGS_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Save logs to storage
 */
function saveLogs(logs: MercyLogEvent[]): void {
  try {
    // Keep only last MAX_LOGS
    const trimmed = logs.slice(-MAX_LOGS);
    localStorage.setItem(LOGS_KEY, JSON.stringify(trimmed));
  } catch {
    // Storage might be full or disabled
    console.warn('[MercyLogs] Failed to save logs');
  }
}

/**
 * Log a new event
 */
export function logEvent(
  event: Omit<MercyLogEvent, 'id' | 'timestampISO'>
): MercyLogEvent {
  const fullEvent: MercyLogEvent = {
    ...event,
    id: generateLogId(),
    timestampISO: new Date().toISOString()
  };

  const logs = getStoredLogs();
  logs.push(fullEvent);
  saveLogs(logs);

  // Debug log in development
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    console.debug('[MercyLog]', fullEvent.type, fullEvent);
  }

  return fullEvent;
}

/**
 * Get recent logs (newest first)
 */
export function getRecentLogs(limit: number = 20): MercyLogEvent[] {
  const logs = getStoredLogs();
  return logs.slice(-limit).reverse();
}

/**
 * Get all logs
 */
export function getAllLogs(): MercyLogEvent[] {
  return getStoredLogs();
}

/**
 * Get logs by type
 */
export function getLogsByType(type: MercyLogEventType): MercyLogEvent[] {
  return getStoredLogs().filter(log => log.type === type);
}

/**
 * Get log summary counts
 */
export function getLogSummary(): Record<MercyLogEventType, number> {
  const logs = getStoredLogs();
  const summary: Record<string, number> = {
    room_enter: 0,
    room_complete: 0,
    entry_click: 0,
    chat_message: 0,
    ef_practice: 0,
    streak_milestone: 0,
    vip_upgrade: 0,
    color_toggle: 0,
    host_toggle: 0
  };

  for (const log of logs) {
    if (log.type in summary) {
      summary[log.type]++;
    }
  }

  return summary as Record<MercyLogEventType, number>;
}

/**
 * Get English Foundation specific stats
 */
export function getEfStats(): { sessions: number; uniqueRooms: string[] } {
  const logs = getStoredLogs();
  const efLogs = logs.filter(l => 
    l.type === 'ef_practice' || 
    (l.domain === 'English' || l.domain === 'english')
  );

  const uniqueRooms = [...new Set(efLogs.map(l => l.roomId).filter(Boolean))] as string[];

  return {
    sessions: efLogs.filter(l => l.type === 'ef_practice').length,
    uniqueRooms
  };
}

/**
 * Clear all logs
 */
export function clearLogs(): void {
  try {
    localStorage.removeItem(LOGS_KEY);
  } catch {
    // Ignore
  }
}

/**
 * Get log buffer size
 */
export function getLogBufferSize(): number {
  return getStoredLogs().length;
}
