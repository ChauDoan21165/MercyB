// src/lib/ai-tutor/learningMemory.ts
// AI Tutor — IndexedDB-backed correction history.
// Stores: STT text, corrected sentence, timestamp, topic, CEFR, practiced flag.
// Does NOT store: raw audio, full transcripts, PII, JWT content, user IDs.

const DB_NAME = "mb-ai-tutor";
const DB_VERSION = 1;
const STORE = "corrections";

export interface CorrectionRecord {
  id: string;
  /** User's original text (from STT or typed input) */
  original: string;
  /** AI-corrected sentence */
  corrected: string;
  /** Grammar topic tag */
  topic: string;
  /** CEFR level estimate */
  cefr: string;
  /** Unix ms timestamp */
  createdAt: number;
  /** Whether learner completed the follow-up practice */
  practiced: boolean;
}

function hasIndexedDb(): boolean {
  return typeof indexedDB !== "undefined";
}

function openDb(): Promise<IDBDatabase> {
  if (!hasIndexedDb()) return Promise.reject(new Error("IndexedDB unavailable"));
  return new Promise<IDBDatabase>((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: "id" });
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
      const tx = db.transaction(STORE, mode);
      const store = tx.objectStore(STORE);
      let result: T;
      Promise.resolve(fn(store)).then((r) => { result = r; }).catch(reject);
      tx.oncomplete = () => resolve(result);
      tx.onerror = () => reject(tx.error ?? new Error("Transaction failed"));
    });
  } finally {
    db.close();
  }
}

/** Save a correction record. */
export async function putCorrection(record: CorrectionRecord): Promise<void> {
  await withStore("readwrite", (store) => { store.put(record); });
}

/** List all corrections, most recent first. */
export async function listCorrections(): Promise<CorrectionRecord[]> {
  return withStore("readonly", async (store) => {
    const all = await reqToPromise(store.getAll());
    const records = (all as CorrectionRecord[]) ?? [];
    return records.sort((a, b) => b.createdAt - a.createdAt);
  });
}

/** Count total corrections. */
export async function countCorrections(): Promise<number> {
  return withStore("readonly", async (store) => {
    return (await reqToPromise(store.count())) as number;
  });
}

/** Count practiced corrections. */
export async function countPracticed(): Promise<number> {
  const all = await listCorrections();
  return all.filter((r) => r.practiced).length;
}

/** Mark a correction as practiced. */
export async function markPracticed(id: string): Promise<void> {
  await withStore("readwrite", async (store) => {
    const existing = (await reqToPromise(store.get(id))) as CorrectionRecord | undefined;
    if (existing) {
      store.put({ ...existing, practiced: true });
    }
  });
}

/** Clear all correction history (logout helper). */
export async function clearCorrections(): Promise<void> {
  await withStore("readwrite", (store) => { store.clear(); });
}

// ─── M3: Aggregate Memory Summary ─────────────────────────────────────

/** Safe aggregate summary of correction history. No raw text, no PII. */
export interface MemorySummary {
  /** Total corrections ever recorded. */
  totalCorrections: number;
  /** Corrections marked practiced. */
  practicedCount: number;
  /** Most frequent grammar topic tag. */
  strongestTopic: string;
  /** Number of corrections for strongest topic. */
  strongestTopicCount: number;
  /** Least practiced grammar topic tag. */
  topicNeedingReview: string;
  /** Number of corrections for topic needing review. */
  topicNeedingReviewCount: number;
  /** Topic of most recent correction. */
  lastPracticedTopic: string;
  /** Unix ms of most recent correction. */
  lastPracticedAt: number | null;
  /** Suggested next focus topic (the one needing review). */
  suggestedNextFocus: string;
}

const EMPTY_SUMMARY: MemorySummary = {
  totalCorrections: 0,
  practicedCount: 0,
  strongestTopic: "",
  strongestTopicCount: 0,
  topicNeedingReview: "",
  topicNeedingReviewCount: 0,
  lastPracticedTopic: "",
  lastPracticedAt: null,
  suggestedNextFocus: "",
};

/**
 * Build an aggregate memory summary from correction records.
 * Uses only topic tags and counts — never exposes raw sentence text,
 * learner PII, or correction content.
 */
export function summarizeCorrections(all: CorrectionRecord[]): MemorySummary {
  if (all.length === 0) return EMPTY_SUMMARY;

  const records = [...all].sort((a, b) => b.createdAt - a.createdAt);
  const totalCorrections = records.length;
  const practicedCount = records.filter((r) => r.practiced).length;

  // Count by topic
  const topicCounts = new Map<string, number>();
  for (const r of records) {
    const t = r.topic || "general";
    topicCounts.set(t, (topicCounts.get(t) ?? 0) + 1);
  }

  // Strongest topic = most frequent
  let strongestTopic = "";
  let strongestTopicCount = 0;
  for (const [topic, count] of topicCounts) {
    if (count > strongestTopicCount) {
      strongestTopic = topic;
      strongestTopicCount = count;
    }
  }

  // Topic needing review = least frequent (excluding the strongest if only one topic)
  let topicNeedingReview = "";
  let topicNeedingReviewCount = Infinity;
  for (const [topic, count] of topicCounts) {
    if (count < topicNeedingReviewCount) {
      topicNeedingReview = topic;
      topicNeedingReviewCount = count;
    }
  }
  // If only one topic exists, it's both strongest and needs review
  if (topicCounts.size === 1) {
    topicNeedingReview = strongestTopic;
    topicNeedingReviewCount = strongestTopicCount;
  }

  // Last practiced
  const lastRecord = records[0];
  const lastPracticedTopic = lastRecord.topic || "general";
  const lastPracticedAt = lastRecord.createdAt;

  // Suggested next focus = the topic needing review
  const suggestedNextFocus = topicNeedingReview;

  return {
    totalCorrections,
    practicedCount,
    strongestTopic,
    strongestTopicCount,
    topicNeedingReview,
    topicNeedingReviewCount,
    lastPracticedTopic,
    lastPracticedAt,
    suggestedNextFocus,
  };
}

/**
 * Build an aggregate memory summary from IndexedDB correction records.
 * Uses only topic tags and counts — never exposes raw sentence text,
 * learner PII, or correction content.
 */
export async function getMemorySummary(): Promise<MemorySummary> {
  return summarizeCorrections(await listCorrections());
}
