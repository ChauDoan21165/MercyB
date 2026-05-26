import type { TutorProduct } from "@/lib/ai-tutor/learningMemory";
import type { TodayLessonMode } from "@/lib/tutor/todayLessonPlanner";

export type StudySessionState = {
  product: TutorProduct;
  targetLanguage: string;
  currentStep: number;
  retryCount: number;
  completedPromptsCount: number;
  lastSafeTopicTag: string;
  suggestedNextFocus: string;
  recommendedMode: TodayLessonMode;
  updatedAt: number;
};

export type StudySessionStartInput = {
  product: TutorProduct;
  targetLanguage: string;
  safeTopicTag?: string | null;
  suggestedNextFocus?: string | null;
  recommendedMode?: TodayLessonMode | null;
  now?: number;
};

export type StudySessionUpdateInput = {
  safeTopicTag?: string | null;
  suggestedNextFocus?: string | null;
  now?: number;
};

const STORAGE_PREFIX = "mercy.studySession.v1";
const MAX_SAFE_TAG_LENGTH = 48;

export function getStudySessionStorageKey(product: TutorProduct, targetLanguage: string): string {
  return `${STORAGE_PREFIX}.${normalizeKeyPart(product)}.${normalizeKeyPart(targetLanguage)}`;
}

export function createStudySessionState(input: StudySessionStartInput): StudySessionState {
  return {
    product: normalizeKeyPart(input.product) as TutorProduct,
    targetLanguage: normalizeKeyPart(input.targetLanguage),
    currentStep: 1,
    retryCount: 0,
    completedPromptsCount: 0,
    lastSafeTopicTag: sanitizeStudyTopicTag(input.safeTopicTag),
    suggestedNextFocus: sanitizeStudyTopicTag(input.suggestedNextFocus),
    recommendedMode: normalizeRecommendedMode(input.recommendedMode),
    updatedAt: normalizeTimestamp(input.now),
  };
}

export function loadStudySessionState(product: TutorProduct, targetLanguage: string): StudySessionState | null {
  const storage = getLocalStorage();
  if (!storage) return null;

  try {
    const raw = storage.getItem(getStudySessionStorageKey(product, targetLanguage));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<StudySessionState>;
    return normalizeStudySessionState(parsed, product, targetLanguage);
  } catch {
    return null;
  }
}

export function saveStudySessionState(state: StudySessionState): StudySessionState {
  const normalized = normalizeStudySessionState(state, state.product, state.targetLanguage);
  const storage = getLocalStorage();
  if (!storage) return normalized;

  try {
    storage.setItem(getStudySessionStorageKey(normalized.product, normalized.targetLanguage), JSON.stringify(normalized));
  } catch {
    // Local-only state is best-effort. Quota/private-mode failures should not block study.
  }

  return normalized;
}

export function startStudySession(input: StudySessionStartInput): StudySessionState {
  return saveStudySessionState(createStudySessionState(input));
}

export function recordStudyPromptCompleted(
  state: StudySessionState,
  input: StudySessionUpdateInput = {},
): StudySessionState {
  return saveStudySessionState({
    ...state,
    currentStep: Math.max(state.currentStep, 2),
    completedPromptsCount: clampCount(state.completedPromptsCount + 1),
    lastSafeTopicTag: sanitizeStudyTopicTag(input.safeTopicTag) || state.lastSafeTopicTag,
    suggestedNextFocus: sanitizeStudyTopicTag(input.suggestedNextFocus) || state.suggestedNextFocus,
    updatedAt: normalizeTimestamp(input.now),
  });
}

export function recordStudyRetry(
  state: StudySessionState,
  input: StudySessionUpdateInput = {},
): StudySessionState {
  return saveStudySessionState({
    ...state,
    currentStep: Math.max(state.currentStep, 3),
    retryCount: clampCount(state.retryCount + 1),
    lastSafeTopicTag: sanitizeStudyTopicTag(input.safeTopicTag) || state.lastSafeTopicTag,
    suggestedNextFocus: sanitizeStudyTopicTag(input.suggestedNextFocus) || state.suggestedNextFocus,
    updatedAt: normalizeTimestamp(input.now),
  });
}

export function clearStudySessionState(product: TutorProduct, targetLanguage: string): void {
  const storage = getLocalStorage();
  if (!storage) return;
  try {
    storage.removeItem(getStudySessionStorageKey(product, targetLanguage));
  } catch {
    // Best-effort local cleanup.
  }
}

export function sanitizeStudyTopicTag(value: string | null | undefined): string {
  const cleaned = String(value ?? "")
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "")
    .replace(/\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/gi, "")
    .replace(/\b\d{6,}\b/g, "")
    .replace(/[^\p{L}\p{N}\s._:-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase()
    .slice(0, MAX_SAFE_TAG_LENGTH);

  return cleaned
    .replace(/\s+/g, "-")
    .replace(/_+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function normalizeStudySessionState(
  state: Partial<StudySessionState>,
  product: TutorProduct,
  targetLanguage: string,
): StudySessionState {
  return {
    product: normalizeKeyPart(product) as TutorProduct,
    targetLanguage: normalizeKeyPart(targetLanguage),
    currentStep: clampStep(state.currentStep),
    retryCount: clampCount(state.retryCount),
    completedPromptsCount: clampCount(state.completedPromptsCount),
    lastSafeTopicTag: sanitizeStudyTopicTag(state.lastSafeTopicTag),
    suggestedNextFocus: sanitizeStudyTopicTag(state.suggestedNextFocus),
    recommendedMode: normalizeRecommendedMode(state.recommendedMode),
    updatedAt: normalizeTimestamp(state.updatedAt),
  };
}

function normalizeKeyPart(value: string): string {
  return String(value ?? "").trim().toLowerCase() || "unknown";
}

function normalizeTimestamp(value: number | null | undefined): number {
  return Number.isFinite(value) && Number(value) >= 0 ? Math.floor(Number(value)) : Date.now();
}

function clampStep(value: number | undefined): number {
  return Math.min(5, Math.max(1, Math.floor(value ?? 1)));
}

function clampCount(value: number | undefined): number {
  return Math.min(999, Math.max(0, Math.floor(value ?? 0)));
}

function normalizeRecommendedMode(value: string | null | undefined): TodayLessonMode {
  return value === "journey" || value === "grammar" || value === "speak" || value === "logic"
    ? value
    : "grammar";
}

function getLocalStorage(): Storage | null {
  if (typeof window === "undefined" || typeof window.localStorage === "undefined") return null;
  return window.localStorage;
}
