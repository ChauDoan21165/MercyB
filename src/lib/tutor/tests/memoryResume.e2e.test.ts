import "fake-indexeddb/auto";

import { beforeEach, describe, expect, it } from "vitest";
import {
  clearAllTutorMemory,
  getMemorySummary,
  getTutorMemoryKey,
  putCorrection,
  type CorrectionRecord,
} from "@/lib/ai-tutor/learningMemory";
import { planTodayLesson } from "@/lib/tutor/todayLessonPlanner";

const PRODUCT = "ai-tutor";
const TARGET_LANGUAGE = "en";
const MEMORY_KEY = getTutorMemoryKey(PRODUCT, TARGET_LANGUAGE);

const FORBIDDEN_RAW_VALUES = [
  "I send money yesterday to my sister.",
  "raw learner audio bytes",
  "full transcript from session one",
  "learner@example.com",
  "550e8400-e29b-41d4-a716-446655440000",
  "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJsZWFybmVyIn0.signature",
  "session-one full conversation history",
];

beforeEach(async () => {
  await clearAllTutorMemory();
});

describe("AI tutor memory resume e2e", () => {
  it("persists safe aggregate memory in one session and changes next-session planning without raw learner data", async () => {
    const emptySummary = await getMemorySummary(PRODUCT, TARGET_LANGUAGE);
    const firstSessionPlan = planTodayLesson(emptySummary);
    expect(firstSessionPlan.nextFocus).toBe("starter sentence");

    await recordSessionOneCorrection("corr-1", 1_000, true);
    await recordSessionOneCorrection("corr-2", 2_000, true);
    await recordSessionOneCorrection("corr-3", 3_000, false);

    const persistedRecord = await readPersistedMemorySummary();
    expect(persistedRecord).toMatchObject({
      memoryKey: MEMORY_KEY,
      totalCorrections: 3,
      practicedCount: 2,
      strongestTopic: "past tense",
      topicCounts: { "past tense": 3 },
    });

    const persistedJson = JSON.stringify(persistedRecord);
    for (const forbidden of FORBIDDEN_RAW_VALUES) {
      expect(persistedJson).not.toContain(forbidden);
    }
    expect(persistedJson).not.toMatch(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
    expect(persistedJson).not.toMatch(/\beyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\b/);
    expect(persistedJson).not.toMatch(/\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/i);
    expect(persistedJson).not.toMatch(/\b(?:audio|transcript|conversation history|raw learner)\b/i);

    const nextSessionSummary = await getMemorySummary(PRODUCT, TARGET_LANGUAGE);
    const nextSessionPlan = planTodayLesson(nextSessionSummary);

    expect(nextSessionPlan.nextFocus).toBe("past tense");
    expect(nextSessionPlan.lessonTitle).toContain("past tense");
    expect(nextSessionPlan.lessonTitle).not.toBe(firstSessionPlan.lessonTitle);
    expect(nextSessionPlan.reason).toContain("2 practiced items");

    const planJson = JSON.stringify(nextSessionPlan);
    for (const forbidden of FORBIDDEN_RAW_VALUES) {
      expect(planJson).not.toContain(forbidden);
    }
    expect(planJson).not.toMatch(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
    expect(planJson).not.toMatch(/\beyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\b/);
  });
});

async function recordSessionOneCorrection(id: string, createdAt: number, practiced: boolean): Promise<void> {
  await putCorrection({
    id,
    topic: "past tense",
    cefr: "A2",
    createdAt,
    practiced,
    tutorProduct: PRODUCT,
    targetLanguage: TARGET_LANGUAGE,
    original: FORBIDDEN_RAW_VALUES[0],
    audio: FORBIDDEN_RAW_VALUES[1],
    transcript: FORBIDDEN_RAW_VALUES[2],
    learnerEmail: FORBIDDEN_RAW_VALUES[3],
    userId: FORBIDDEN_RAW_VALUES[4],
    jwt: FORBIDDEN_RAW_VALUES[5],
    fullConversationHistory: FORBIDDEN_RAW_VALUES[6],
  } as CorrectionRecord & Record<string, unknown>);
}

async function readPersistedMemorySummary(): Promise<Record<string, unknown>> {
  const db = await openMemoryDb();
  try {
    return await new Promise((resolve, reject) => {
      const tx = db.transaction("memorySummaries", "readonly");
      const request = tx.objectStore("memorySummaries").get(MEMORY_KEY);
      request.onsuccess = () => resolve(request.result as Record<string, unknown>);
      request.onerror = () => reject(request.error ?? new Error("Failed to read persisted memory"));
    });
  } finally {
    db.close();
  }
}

async function openMemoryDb(): Promise<IDBDatabase> {
  return await new Promise((resolve, reject) => {
    const request = indexedDB.open("mb-ai-tutor", 2);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("Failed to open tutor memory DB"));
  });
}
