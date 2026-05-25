export type LearningEventType =
  | "lesson_started"
  | "lesson_resumed"
  | "lesson_completed"
  | "lesson_restarted"
  | "mode_selected"
  | "mistake_retried"
  | "logic_insight_viewed"
  | "next_focus_viewed"
  | "placement_cta_clicked"
  | "kids_picture_selected"
  | "kids_speak_clicked";

export type LearningEventProduct = "ai_tutor" | "mercy_kids";
export type LearningEventMode = "journey" | "grammar" | "speak" | "logic";

export type LearningEvent = {
  eventType: LearningEventType;
  product: LearningEventProduct;
  targetLanguage: string;
  timestamp: number;
  sessionId: string;
  mode?: LearningEventMode;
  safeTopicTag?: string;
  count?: number;
  value?: number;
};

export type LearningEventInput = {
  eventType: LearningEventType;
  product: LearningEventProduct;
  targetLanguage?: string | null;
  timestamp?: number | null;
  sessionId?: string | null;
  mode?: LearningEventMode | null;
  safeTopicTag?: string | null;
  count?: number | null;
  value?: number | null;
};

export type LearningEventFilter = {
  eventType?: LearningEventType;
  product?: LearningEventProduct;
  targetLanguage?: string;
  mode?: LearningEventMode;
  since?: number;
  until?: number;
};

export type LearningEventSummary = {
  lessonsStarted: number;
  lessonsCompleted: number;
  retryCount: number;
  logicInsightViews: number;
  mostUsedMode: LearningEventMode | null;
  lastActiveAt: number | null;
  completionRate: number;
};

export type LearningEventPruneOptions = {
  maxEvents?: number;
  maxAgeDays?: number;
  now?: number;
};

const EVENTS_STORAGE_KEY = "mercy.learningEvents.v1";
const SESSION_STORAGE_KEY = "mercy.learningEvents.session.v1";
const DEFAULT_TARGET_LANGUAGE = "en";
const DEFAULT_MAX_EVENTS = 200;
const DEFAULT_MAX_AGE_DAYS = 30;
const MAX_SAFE_TAG_LENGTH = 48;
const MAX_COUNT_VALUE = 9999;
const DAY_MS = 24 * 60 * 60 * 1000;

const EVENT_TYPES = new Set<LearningEventType>([
  "lesson_started",
  "lesson_resumed",
  "lesson_completed",
  "lesson_restarted",
  "mode_selected",
  "mistake_retried",
  "logic_insight_viewed",
  "next_focus_viewed",
  "placement_cta_clicked",
  "kids_picture_selected",
  "kids_speak_clicked",
]);

const PRODUCTS = new Set<LearningEventProduct>(["ai_tutor", "mercy_kids"]);
const MODES = new Set<LearningEventMode>(["journey", "grammar", "speak", "logic"]);

export function recordLearningEvent(event: LearningEventInput): LearningEvent | null {
  const normalized = normalizeLearningEvent(event);
  if (!normalized) return null;

  const events = [...readStoredEvents(), normalized];
  writeStoredEvents(pruneEvents(events));
  return normalized;
}

export function getLearningEvents(filter: LearningEventFilter = {}): LearningEvent[] {
  const normalizedTargetLanguage = filter.targetLanguage ? normalizeLanguage(filter.targetLanguage) : undefined;

  return readStoredEvents().filter((event) => {
    if (filter.eventType && event.eventType !== filter.eventType) return false;
    if (filter.product && event.product !== filter.product) return false;
    if (normalizedTargetLanguage && event.targetLanguage !== normalizedTargetLanguage) return false;
    if (filter.mode && event.mode !== filter.mode) return false;
    if (typeof filter.since === "number" && event.timestamp < filter.since) return false;
    if (typeof filter.until === "number" && event.timestamp > filter.until) return false;
    return true;
  });
}

export function getLearningEventSummary(): LearningEventSummary {
  const events = getLearningEvents();
  const lessonsStarted = countEvents(events, "lesson_started") + countEvents(events, "lesson_resumed");
  const lessonsCompleted = countEvents(events, "lesson_completed");
  const retryCount = events
    .filter((event) => event.eventType === "mistake_retried")
    .reduce((total, event) => total + (event.count ?? 1), 0);
  const logicInsightViews = countEvents(events, "logic_insight_viewed");
  const lastActiveAt = events.reduce<number | null>((latest, event) => {
    if (latest === null) return event.timestamp;
    return Math.max(latest, event.timestamp);
  }, null);

  return {
    lessonsStarted,
    lessonsCompleted,
    retryCount,
    logicInsightViews,
    mostUsedMode: getMostUsedMode(events),
    lastActiveAt,
    completionRate: lessonsStarted > 0 ? roundRate(lessonsCompleted / lessonsStarted) : 0,
  };
}

export function clearLearningEvents(): void {
  const storage = getLocalStorage();
  if (!storage) return;

  try {
    storage.removeItem(EVENTS_STORAGE_KEY);
  } catch {
    // Local analytics are best-effort and should never block learning.
  }
}

export function pruneLearningEvents(options: LearningEventPruneOptions = {}): LearningEvent[] {
  const pruned = pruneEvents(readStoredEvents(), options);
  writeStoredEvents(pruned);
  return pruned;
}

export function getLearningEventsStorageKey(): string {
  return EVENTS_STORAGE_KEY;
}

export function getLearningEventsSessionKey(): string {
  return SESSION_STORAGE_KEY;
}

function normalizeLearningEvent(input: LearningEventInput): LearningEvent | null {
  if (!EVENT_TYPES.has(input.eventType)) return null;
  if (!PRODUCTS.has(input.product)) return null;

  const mode = normalizeMode(input.mode);
  const safeTopicTag = sanitizeSafeTopicTag(input.safeTopicTag);
  const count = normalizeOptionalNumber(input.count);
  const value = normalizeOptionalNumber(input.value);

  return {
    eventType: input.eventType,
    product: input.product,
    targetLanguage: normalizeLanguage(input.targetLanguage),
    timestamp: normalizeTimestamp(input.timestamp),
    sessionId: sanitizeSessionId(input.sessionId) || getOrCreateSessionId(),
    ...(mode ? { mode } : {}),
    ...(safeTopicTag ? { safeTopicTag } : {}),
    ...(count !== undefined ? { count } : {}),
    ...(value !== undefined ? { value } : {}),
  };
}

function readStoredEvents(): LearningEvent[] {
  const storage = getLocalStorage();
  if (!storage) return [];

  try {
    const raw = storage.getItem(EVENTS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((event) => normalizeStoredEvent(event))
      .filter((event): event is LearningEvent => Boolean(event));
  } catch {
    return [];
  }
}

function writeStoredEvents(events: LearningEvent[]): void {
  const storage = getLocalStorage();
  if (!storage) return;

  try {
    storage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(events));
  } catch {
    // Local analytics are best-effort and should never block learning.
  }
}

function normalizeStoredEvent(value: unknown): LearningEvent | null {
  if (!value || typeof value !== "object") return null;
  const event = value as Partial<LearningEvent>;
  return normalizeLearningEvent({
    eventType: event.eventType as LearningEventType,
    product: event.product as LearningEventProduct,
    targetLanguage: event.targetLanguage,
    timestamp: event.timestamp,
    sessionId: event.sessionId,
    mode: event.mode,
    safeTopicTag: event.safeTopicTag,
    count: event.count,
    value: event.value,
  });
}

function pruneEvents(events: LearningEvent[], options: LearningEventPruneOptions = {}): LearningEvent[] {
  const maxEvents = clampInteger(options.maxEvents ?? DEFAULT_MAX_EVENTS, 1, 300);
  const maxAgeDays = clampInteger(options.maxAgeDays ?? DEFAULT_MAX_AGE_DAYS, 1, 365);
  const now = normalizeTimestamp(options.now);
  const oldestAllowed = now - maxAgeDays * DAY_MS;

  return events
    .filter((event) => event.timestamp >= oldestAllowed)
    .sort((a, b) => a.timestamp - b.timestamp)
    .slice(-maxEvents);
}

function getMostUsedMode(events: LearningEvent[]): LearningEventMode | null {
  const counts = new Map<LearningEventMode, number>();

  for (const event of events) {
    if (!event.mode) continue;
    counts.set(event.mode, (counts.get(event.mode) ?? 0) + 1);
  }

  let bestMode: LearningEventMode | null = null;
  let bestCount = 0;
  for (const [mode, count] of counts) {
    if (count > bestCount) {
      bestMode = mode;
      bestCount = count;
    }
  }

  return bestMode;
}

function countEvents(events: LearningEvent[], eventType: LearningEventType): number {
  return events.filter((event) => event.eventType === eventType).length;
}

function normalizeMode(value: LearningEventMode | null | undefined): LearningEventMode | undefined {
  return value && MODES.has(value) ? value : undefined;
}

function normalizeLanguage(value: string | null | undefined): string {
  const cleaned = String(value ?? DEFAULT_TARGET_LANGUAGE)
    .trim()
    .toLowerCase()
    .replace(/[^a-z-]/g, "")
    .slice(0, 12);
  return cleaned || DEFAULT_TARGET_LANGUAGE;
}

function normalizeTimestamp(value: number | null | undefined): number {
  return Number.isFinite(value) && Number(value) >= 0 ? Math.floor(Number(value)) : Date.now();
}

function normalizeOptionalNumber(value: number | null | undefined): number | undefined {
  if (!Number.isFinite(value)) return undefined;
  return clampInteger(Number(value), 0, MAX_COUNT_VALUE);
}

function clampInteger(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, Math.floor(value)));
}

function sanitizeSafeTopicTag(value: string | null | undefined): string {
  const cleaned = String(value ?? "")
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "")
    .replace(/\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/gi, "")
    .replace(/\b\d{6,}\b/g, "")
    .replace(/[^\p{L}\p{N}\s._:-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase()
    .slice(0, MAX_SAFE_TAG_LENGTH);
  const tokens = cleaned.split(/\s+/).filter(Boolean);
  if (tokens.length > 4) return "";

  return cleaned
    .replace(/\s+/g, "-")
    .replace(/_+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function sanitizeSessionId(value: string | null | undefined): string {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._:-]/g, "")
    .slice(0, 64);
}

function getOrCreateSessionId(): string {
  const storage = getLocalStorage();
  if (!storage) return createSessionId();

  try {
    const existing = sanitizeSessionId(storage.getItem(SESSION_STORAGE_KEY));
    if (existing) return existing;
    const next = createSessionId();
    storage.setItem(SESSION_STORAGE_KEY, next);
    return next;
  } catch {
    return createSessionId();
  }
}

function createSessionId(): string {
  const random = Math.random().toString(36).slice(2, 12);
  return `local-${Date.now().toString(36)}-${random}`;
}

function roundRate(value: number): number {
  return Math.round(value * 100) / 100;
}

function getLocalStorage(): Storage | null {
  if (typeof window === "undefined" || typeof window.localStorage === "undefined") return null;
  return window.localStorage;
}
