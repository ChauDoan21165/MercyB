// src/lib/ai-tutor/learningMemory.ts
// AI Tutor safe local memory.
// Stores: aggregate summary by tutor product + target language.
// Does NOT store: raw audio, raw user text, raw transcripts, corrected
// sentence text, full conversation history, PII, JWT content, user IDs.

const DB_NAME = "mb-ai-tutor";
const DB_VERSION = 2;
const LEGACY_CORRECTIONS_STORE = "corrections";
const SUMMARY_STORE = "memorySummaries";

export type TutorProduct = "ai-tutor" | "vi-kids-english" | (string & {});
export type ConfidenceTrend = "not-enough-data" | "steady" | "improving" | "needs-review";

export interface TutorMemorySummary {
  /** Product namespace. */
  tutorProduct: TutorProduct;
  /** Target language being learned, for example "en" or "fr". */
  targetLanguage: string;
  /** Product + targetLanguage key. */
  memoryKey: string;
  /** Safe aggregate strengths only; never raw learner text. */
  strengths: string[];
  /** Safe aggregate review topics only; never raw learner text. */
  needsReview: string[];
  /** Safe aggregate mistake pattern tags only; never raw learner text. */
  commonMistakePatterns: string[];
  /** Safe next focus tag. */
  nextRecommendedFocus: string;
  /** Simple aggregate confidence trend. */
  confidenceTrend: ConfidenceTrend;
  /** Unix ms of last update. */
  updatedAt: number | null;
  /** Total correction events recorded for this product/language. */
  totalCorrections: number;
  /** Correction events marked practiced for this product/language. */
  practicedCount: number;
  /** Most frequent safe topic tag. */
  strongestTopic: string;
  /** Number of corrections for strongest topic. */
  strongestTopicCount: number;
  /** Least practiced safe topic tag. */
  topicNeedingReview: string;
  /** Number of corrections for topic needing review. */
  topicNeedingReviewCount: number;
  /** Topic of most recent correction. */
  lastPracticedTopic: string;
  /** Unix ms of most recent correction. */
  lastPracticedAt: number | null;
  /** Back-compat alias for nextRecommendedFocus. */
  suggestedNextFocus: string;
  /** Internal aggregate counts. Safe tags only. */
  topicCounts: Record<string, number>;
  /** Internal generated IDs only, used to avoid double-counting practice. */
  unpracticedCorrectionIds: string[];
}

export type MemorySummary = TutorMemorySummary;

export interface CorrectionRecord {
  id: string;
  /** Grammar topic tag. */
  topic: string;
  /** CEFR level estimate. */
  cefr: string;
  /** Unix ms timestamp. */
  createdAt: number;
  /** Whether learner completed the follow-up practice. */
  practiced: boolean;
  targetLanguage?: string;
  tutorProduct?: TutorProduct;
}

const DEFAULT_PRODUCT: TutorProduct = "ai-tutor";
const DEFAULT_LANGUAGE = "en";

export function getTutorMemoryKey(product: TutorProduct, targetLanguage: string): string {
  return `${normalizeKeyPart(product)}:${normalizeKeyPart(targetLanguage)}`;
}

function normalizeKeyPart(value: string): string {
  return value.trim().toLowerCase() || "unknown";
}

function emptySummary(product: TutorProduct, targetLanguage: string): TutorMemorySummary {
  const normalizedProduct = normalizeKeyPart(product) as TutorProduct;
  const normalizedLanguage = normalizeKeyPart(targetLanguage);
  return {
    tutorProduct: normalizedProduct,
    targetLanguage: normalizedLanguage,
    memoryKey: getTutorMemoryKey(normalizedProduct, normalizedLanguage),
    strengths: [],
    needsReview: [],
    commonMistakePatterns: [],
    nextRecommendedFocus: "",
    confidenceTrend: "not-enough-data",
    updatedAt: null,
    totalCorrections: 0,
    practicedCount: 0,
    strongestTopic: "",
    strongestTopicCount: 0,
    topicNeedingReview: "",
    topicNeedingReviewCount: 0,
    lastPracticedTopic: "",
    lastPracticedAt: null,
    suggestedNextFocus: "",
    topicCounts: {},
    unpracticedCorrectionIds: [],
  };
}

export const EMPTY_SUMMARY: MemorySummary = emptySummary(DEFAULT_PRODUCT, DEFAULT_LANGUAGE);

function hasIndexedDb(): boolean {
  return typeof indexedDB !== "undefined";
}

function openDb(): Promise<IDBDatabase> {
  if (!hasIndexedDb()) return Promise.reject(new Error("IndexedDB unavailable"));
  return new Promise<IDBDatabase>((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (db.objectStoreNames.contains(LEGACY_CORRECTIONS_STORE)) {
        db.deleteObjectStore(LEGACY_CORRECTIONS_STORE);
      }
      if (!db.objectStoreNames.contains(SUMMARY_STORE)) {
        db.createObjectStore(SUMMARY_STORE, { keyPath: "memoryKey" });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error ?? new Error("Failed to open ai-tutor DB"));
  });
}

function reqToPromise<T>(req: IDBRequest<T>): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error ?? new Error("IDB request failed"));
  });
}

async function withStore<T>(
  mode: IDBTransactionMode,
  fn: (store: IDBObjectStore) => Promise<T> | T,
): Promise<T> {
  const db = await openDb();
  try {
    return await new Promise<T>((resolve, reject) => {
      const tx = db.transaction(SUMMARY_STORE, mode);
      const store = tx.objectStore(SUMMARY_STORE);
      let result: T;
      Promise.resolve(fn(store)).then((r) => { result = r; }).catch(reject);
      tx.oncomplete = () => resolve(result);
      tx.onerror = () => reject(tx.error ?? new Error("Transaction failed"));
    });
  } finally {
    db.close();
  }
}

function sanitizeMemoryTag(value: string): string {
  const withoutEmail = value.replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "").trim();
  const withoutTokens = withoutEmail
    .replace(/\beyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\b/g, "")
    .replace(/\bBearer\s+[A-Za-z0-9._-]+\b/gi, "")
    .trim();
  const withoutIds = withoutTokens
    .replace(/\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/gi, "")
    .replace(/\b\d{6,}\b/g, "")
    .trim();
  const normalized = withoutIds.replace(/[^\p{L}\p{N}\s._:-]/gu, "").replace(/\s+/g, " ").trim();
  if (!normalized) return "general";
  const wordCount = normalized.split(/\s+/).filter(Boolean).length;
  const hasRawSentencePronoun = /\b(?:i|me|my|mine|we|our|ours|you|your|yours|he|him|she|her|they|them|their)\b/i.test(normalized);
  const hasPrivacyNoun = /\b(?:audio|recording|transcript|conversation history|raw text|jwt|bearer|password|secret|email|phone)\b/i.test(normalized);
  const hasSentencePunctuation = /[?!.]/.test(value);
  if (hasPrivacyNoun || hasSentencePunctuation || wordCount > 5 || (hasRawSentencePronoun && wordCount > 3)) {
    return "general";
  }
  return normalized.slice(0, 60);
}

function sortTopicEntries(topicCounts: Record<string, number>): Array<[string, number]> {
  return Object.entries(topicCounts).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
}

function deriveSummary(summary: TutorMemorySummary): TutorMemorySummary {
  const topics = sortTopicEntries(summary.topicCounts);
  const strongest = topics[0] ?? ["", 0];
  const weakest = [...topics].sort((a, b) => a[1] - b[1] || a[0].localeCompare(b[0]))[0] ?? ["", 0];
  const focus = weakest[0];
  const confidenceTrend: ConfidenceTrend =
    summary.totalCorrections === 0
      ? "not-enough-data"
      : summary.practicedCount >= Math.ceil(summary.totalCorrections * 0.7)
        ? "improving"
        : summary.practicedCount === 0
          ? "needs-review"
          : "steady";

  return {
    ...summary,
    strengths: topics.slice(0, 3).map(([topic]) => topic).filter(Boolean),
    needsReview: focus ? [focus] : [],
    commonMistakePatterns: topics.slice(0, 5).map(([topic]) => topic).filter(Boolean),
    nextRecommendedFocus: focus,
    confidenceTrend,
    strongestTopic: strongest[0],
    strongestTopicCount: strongest[1],
    topicNeedingReview: weakest[0],
    topicNeedingReviewCount: weakest[1],
    suggestedNextFocus: focus,
  };
}

function normalizeSummary(
  summary: Partial<TutorMemorySummary> | undefined,
  product: TutorProduct,
  targetLanguage: string,
): TutorMemorySummary {
  const base = emptySummary(product, targetLanguage);
  if (!summary) return base;
  return deriveSummary({
    ...base,
    ...summary,
    tutorProduct: base.tutorProduct,
    targetLanguage: base.targetLanguage,
    memoryKey: base.memoryKey,
    topicCounts: summary.topicCounts ?? {},
    unpracticedCorrectionIds: summary.unpracticedCorrectionIds ?? [],
  });
}

export function summarizeCorrections(
  all: CorrectionRecord[],
  product: TutorProduct = DEFAULT_PRODUCT,
  targetLanguage: string = DEFAULT_LANGUAGE,
): MemorySummary {
  const summary = emptySummary(product, targetLanguage);
  const records = all
    .filter((record) => normalizeKeyPart(record.tutorProduct ?? product) === normalizeKeyPart(product))
    .filter((record) => normalizeKeyPart(record.targetLanguage ?? targetLanguage) === normalizeKeyPart(targetLanguage))
    .sort((a, b) => b.createdAt - a.createdAt);

  for (const record of records) {
    const topic = sanitizeMemoryTag(record.topic || "general");
    summary.totalCorrections += 1;
    if (record.practiced) summary.practicedCount += 1;
    summary.topicCounts[topic] = (summary.topicCounts[topic] ?? 0) + 1;
    if (!summary.lastPracticedAt || record.createdAt > summary.lastPracticedAt) {
      summary.lastPracticedAt = record.createdAt;
      summary.lastPracticedTopic = topic;
    }
    summary.updatedAt = Math.max(summary.updatedAt ?? 0, record.createdAt);
  }

  return deriveSummary(summary);
}

export async function getTutorMemory(
  product: TutorProduct,
  targetLanguage: string,
): Promise<MemorySummary> {
  const memoryKey = getTutorMemoryKey(product, targetLanguage);
  return withStore("readonly", async (store) => {
    const existing = await reqToPromise(store.get(memoryKey));
    return normalizeSummary(existing as Partial<TutorMemorySummary> | undefined, product, targetLanguage);
  });
}

export async function summarizeTutorMemoryByLanguage(
  product: TutorProduct,
  targetLanguage: string,
): Promise<MemorySummary> {
  return getTutorMemory(product, targetLanguage);
}

export async function clearTutorMemory(product: TutorProduct, targetLanguage: string): Promise<void> {
  const memoryKey = getTutorMemoryKey(product, targetLanguage);
  await withStore("readwrite", (store) => { store.delete(memoryKey); });
}

export async function clearAllTutorMemory(): Promise<void> {
  await withStore("readwrite", (store) => { store.clear(); });
}

export async function putCorrection(record: CorrectionRecord): Promise<void> {
  const product = record.tutorProduct ?? DEFAULT_PRODUCT;
  const targetLanguage = record.targetLanguage ?? DEFAULT_LANGUAGE;
  const memoryKey = getTutorMemoryKey(product, targetLanguage);
  await withStore("readwrite", async (store) => {
    const existing = await reqToPromise(store.get(memoryKey));
    const summary = normalizeSummary(existing as Partial<TutorMemorySummary> | undefined, product, targetLanguage);
    const topic = sanitizeMemoryTag(record.topic || "general");
    summary.totalCorrections += 1;
    if (record.practiced) summary.practicedCount += 1;
    else summary.unpracticedCorrectionIds = [...summary.unpracticedCorrectionIds, record.id].slice(-50);
    summary.topicCounts[topic] = (summary.topicCounts[topic] ?? 0) + 1;
    summary.lastPracticedTopic = topic;
    summary.lastPracticedAt = record.createdAt;
    summary.updatedAt = record.createdAt;
    store.put(deriveSummary(summary));
  });
}

export async function markPracticed(
  id: string,
  product: TutorProduct = DEFAULT_PRODUCT,
  targetLanguage: string = DEFAULT_LANGUAGE,
): Promise<void> {
  const memoryKey = getTutorMemoryKey(product, targetLanguage);
  await withStore("readwrite", async (store) => {
    const existing = await reqToPromise(store.get(memoryKey));
    const summary = normalizeSummary(existing as Partial<TutorMemorySummary> | undefined, product, targetLanguage);
    if (!summary.unpracticedCorrectionIds.includes(id)) return;
    summary.unpracticedCorrectionIds = summary.unpracticedCorrectionIds.filter((pendingId) => pendingId !== id);
    summary.practicedCount = Math.min(summary.totalCorrections, summary.practicedCount + 1);
    summary.updatedAt = Date.now();
    store.put(deriveSummary(summary));
  });
}

export async function listCorrections(): Promise<CorrectionRecord[]> {
  return [];
}

export async function countCorrections(
  product: TutorProduct = DEFAULT_PRODUCT,
  targetLanguage: string = DEFAULT_LANGUAGE,
): Promise<number> {
  return (await getTutorMemory(product, targetLanguage)).totalCorrections;
}

export async function countPracticed(
  product: TutorProduct = DEFAULT_PRODUCT,
  targetLanguage: string = DEFAULT_LANGUAGE,
): Promise<number> {
  return (await getTutorMemory(product, targetLanguage)).practicedCount;
}

export async function clearCorrections(): Promise<void> {
  await clearAllTutorMemory();
}

export async function getMemorySummary(
  product: TutorProduct = DEFAULT_PRODUCT,
  targetLanguage: string = DEFAULT_LANGUAGE,
): Promise<MemorySummary> {
  return summarizeTutorMemoryByLanguage(product, targetLanguage);
}
