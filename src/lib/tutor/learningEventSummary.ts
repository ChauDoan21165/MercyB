import { getLearningEvents } from "@/lib/tutor/learningEvents";
import type {
  LearningEvent,
  LearningEventMode,
  LearningEventProduct,
  LearningEventType,
} from "@/lib/tutor/learningEvents";

export type LearningEventModeUsageCounts = Record<LearningEventMode, number>;

export type LearningEventProgressSummary = {
  lessonsStartedToday: number;
  lessonsCompletedToday: number;
  lessonResumesToday: number;
  lessonResumedToday: boolean;
  retryCountToday: number;
  modeUsageCountsToday: LearningEventModeUsageCounts;
  logicInsightViewsToday: number;
  logicInsightViewedToday: boolean;
  nextFocusViewsToday: number;
  nextFocusViewedToday: boolean;
  placementCtaClicksToday: number;
  placementCtaClickedToday: boolean;
  kidsPictureSelectionsToday: number;
  kidsSpeakClicksToday: number;
  lastSafeActivityAt: number | null;
};

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
const MODES: LearningEventMode[] = ["journey", "grammar", "speak", "logic"];
const MODE_SET = new Set<LearningEventMode>(MODES);

export function summarizeLearningEvents(events: readonly unknown[], now = Date.now()): LearningEventProgressSummary {
  const safeNow = normalizeTimestamp(now) ?? Date.now();
  const todayStart = getStartOfLocalDay(safeNow);
  const summary = createEmptySummary();

  for (const event of events) {
    const normalized = normalizeSummaryEvent(event);
    if (!normalized || normalized.timestamp > safeNow) continue;

    summary.lastSafeActivityAt = summary.lastSafeActivityAt === null
      ? normalized.timestamp
      : Math.max(summary.lastSafeActivityAt, normalized.timestamp);

    if (normalized.timestamp < todayStart) continue;

    applyTodayEvent(summary, normalized);
  }

  summary.lessonResumedToday = summary.lessonResumesToday > 0;
  summary.logicInsightViewedToday = summary.logicInsightViewsToday > 0;
  summary.nextFocusViewedToday = summary.nextFocusViewsToday > 0;
  summary.placementCtaClickedToday = summary.placementCtaClicksToday > 0;

  return summary;
}

export function getLocalLearningEventProgressSummary(now = Date.now()): LearningEventProgressSummary {
  return summarizeLearningEvents(getLearningEvents(), now);
}

function createEmptySummary(): LearningEventProgressSummary {
  return {
    lessonsStartedToday: 0,
    lessonsCompletedToday: 0,
    lessonResumesToday: 0,
    lessonResumedToday: false,
    retryCountToday: 0,
    modeUsageCountsToday: {
      journey: 0,
      grammar: 0,
      speak: 0,
      logic: 0,
    },
    logicInsightViewsToday: 0,
    logicInsightViewedToday: false,
    nextFocusViewsToday: 0,
    nextFocusViewedToday: false,
    placementCtaClicksToday: 0,
    placementCtaClickedToday: false,
    kidsPictureSelectionsToday: 0,
    kidsSpeakClicksToday: 0,
    lastSafeActivityAt: null,
  };
}

function applyTodayEvent(summary: LearningEventProgressSummary, event: LearningEvent): void {
  switch (event.eventType) {
    case "lesson_started":
      summary.lessonsStartedToday += 1;
      break;
    case "lesson_resumed":
      summary.lessonResumesToday += 1;
      break;
    case "lesson_completed":
      summary.lessonsCompletedToday += 1;
      break;
    case "mistake_retried":
      summary.retryCountToday += event.count ?? 1;
      break;
    case "logic_insight_viewed":
      summary.logicInsightViewsToday += 1;
      break;
    case "next_focus_viewed":
      summary.nextFocusViewsToday += 1;
      break;
    case "placement_cta_clicked":
      summary.placementCtaClicksToday += 1;
      break;
    case "kids_picture_selected":
      summary.kidsPictureSelectionsToday += 1;
      break;
    case "kids_speak_clicked":
      summary.kidsSpeakClicksToday += 1;
      break;
    case "mode_selected":
    case "lesson_restarted":
      break;
  }

  if (event.mode) {
    summary.modeUsageCountsToday[event.mode] += 1;
  }
}

function normalizeSummaryEvent(value: unknown): LearningEvent | null {
  if (!value || typeof value !== "object") return null;
  const event = value as Partial<LearningEvent>;

  if (!EVENT_TYPES.has(event.eventType as LearningEventType)) return null;
  if (!PRODUCTS.has(event.product as LearningEventProduct)) return null;

  const timestamp = normalizeTimestamp(event.timestamp);
  if (timestamp === null) return null;

  const mode = MODE_SET.has(event.mode as LearningEventMode) ? event.mode as LearningEventMode : undefined;
  const count = normalizeCount(event.count);

  return {
    eventType: event.eventType as LearningEventType,
    product: event.product as LearningEventProduct,
    targetLanguage: "",
    timestamp,
    sessionId: "",
    ...(mode ? { mode } : {}),
    ...(count !== undefined ? { count } : {}),
  };
}

function normalizeTimestamp(value: unknown): number | null {
  if (!Number.isFinite(value)) return null;
  const timestamp = Math.floor(Number(value));
  return timestamp >= 0 ? timestamp : null;
}

function normalizeCount(value: unknown): number | undefined {
  if (!Number.isFinite(value)) return undefined;
  return Math.min(9999, Math.max(0, Math.floor(Number(value))));
}

function getStartOfLocalDay(timestamp: number): number {
  const day = new Date(timestamp);
  return new Date(day.getFullYear(), day.getMonth(), day.getDate()).getTime();
}
