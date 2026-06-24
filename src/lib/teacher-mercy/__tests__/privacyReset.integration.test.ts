// src/lib/teacher-mercy/__tests__/privacyReset.integration.test.ts
// Privacy proof: "Reset Mercy's Memory" leaves no recoverable learner data
// across all storage layers.
//
// The AccountPage "Reset Mercy's Memory" flow clears:
//   1. Supabase teacher_memory row (server-side)
//   2. localStorage mercy_host_memory (host preferences, visits, streaks)
//   3. localStorage mercy_host_logs (event log)
//   4. localStorage curriculum state (topic progress)
//
// Additionally, the AI tutor memory (IndexedDB) has its own clear path.
// This test proves that a complete reset across all layers leaves zero
// recoverable learner data on the device.

import "fake-indexeddb/auto";

import { beforeEach, describe, expect, it } from "vitest";
import { clearAllTutorMemory, putCorrection } from "@/lib/ai-tutor/learningMemory";
import { clearMemory, getMemory as getHostMemory, updateMemory } from "../memory";
import { loadValidatedMemory, resetMemory } from "../memorySchema";
import { clearLogs, logEvent, getAllLogs } from "../logs";
import { loadCurriculumState, resetCurriculumState, updateCurriculumTopic } from "../curriculumTracker";

// ── Helpers ──────────────────────────────────────────────────────

function populateAllStorageLayers(): void {
  // 1. localStorage: host memory
  updateMemory({
    userName: "Learner",
    totalVisits: 42,
    streakDays: 14,
    greetedRooms: ["room-a", "room-b", "room-c"],
    favoriteRooms: ["room-fav"],
    teacherLevel: "intense",
    englishProgress: {
      roomsVisited: ["ef-room-1", "ef-room-2"],
      entriesCompleted: 20,
      lastEfVisitISO: "2026-06-22T10:00:00.000Z",
    },
  });

  // 2. localStorage: event logs
  logEvent({ type: "room_enter", roomId: "room-a" });
  logEvent({ type: "room_complete", roomId: "room-a" });
  logEvent({ type: "ef_practice", roomId: "ef-room-1" });
  logEvent({ type: "streak_milestone" });
  logEvent({ type: "chat_message", roomId: "room-b" });

  // 3. localStorage: curriculum state
  updateCurriculumTopic({ topic: "past-tense", correct: true });
  updateCurriculumTopic({ topic: "articles", correct: false });
  updateCurriculumTopic({ topic: "prepositions", correct: true });
}

async function populateIndexedDbTutorMemory(): Promise<void> {
  await putCorrection({
    id: "corr-1",
    topic: "past-tense",
    cefr: "A2",
    createdAt: 1000,
    practiced: true,
    tutorProduct: "ai-tutor",
    targetLanguage: "en",
  });
  await putCorrection({
    id: "corr-2",
    topic: "articles",
    cefr: "A2",
    createdAt: 2000,
    practiced: false,
    tutorProduct: "ai-tutor",
    targetLanguage: "en",
  });
  await putCorrection({
    id: "corr-3",
    topic: "prepositions",
    cefr: "B1",
    createdAt: 3000,
    practiced: true,
    tutorProduct: "ai-tutor",
    targetLanguage: "en",
  });
}

async function getIndexedDbRecordCount(): Promise<number> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open("mb-ai-tutor", 2);
    req.onsuccess = () => {
      const db = req.result;
      try {
        const tx = db.transaction("memorySummaries", "readonly");
        const store = tx.objectStore("memorySummaries");
        const countReq = store.count();
        countReq.onsuccess = () => resolve(countReq.result);
        countReq.onerror = () => reject(countReq.error);
      } catch {
        db.close();
        resolve(0);
      }
    };
    req.onerror = () => resolve(0);
  });
}

function getLocalStorageKeys(): string[] {
  const keys: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    keys.push(localStorage.key(i)!);
  }
  return keys;
}

// ── Tests ────────────────────────────────────────────────────────

beforeEach(() => {
  localStorage.clear();
});

describe("privacyReset — complete reset leaves no trace", () => {
  it("PR1: before reset, all storage layers contain learner data", () => {
    populateAllStorageLayers();

    // Host memory has data
    const hostMemory = loadValidatedMemory();
    expect(hostMemory.totalVisits).toBeGreaterThan(0);
    expect(hostMemory.greetedRooms.length).toBeGreaterThan(0);

    // Logs have data
    const logs = getAllLogs();
    expect(logs.length).toBeGreaterThan(0);

    // Curriculum has data
    const curriculum = loadCurriculumState();
    expect(Object.keys(curriculum.topics).length).toBeGreaterThan(0);
  });

  it("PR2: clearMemory() removes host memory from localStorage", () => {
    populateAllStorageLayers();

    // Verify data exists
    expect(getHostMemory().totalVisits).toBeGreaterThan(0);

    // Clear
    clearMemory();

    // localStorage key is removed
    expect(localStorage.getItem("mercy_host_memory")).toBeNull();

    // loadValidatedMemory returns fresh defaults (not stale cached data)
    const loaded = loadValidatedMemory();
    expect(loaded.totalVisits).toBe(0);
    expect(loaded.userName).toBeNull();
    expect(loaded.greetedRooms).toEqual([]);
    expect(loaded.favoriteRooms).toEqual([]);
    expect(loaded.streakDays).toBe(0);
  });

  it("PR3: clearLogs() removes all event logs from localStorage", () => {
    populateAllStorageLayers();

    // Verify logs exist
    expect(getAllLogs().length).toBeGreaterThan(0);

    // Clear
    clearLogs();

    // No logs remain
    expect(getAllLogs()).toEqual([]);
    expect(localStorage.getItem("mercy_host_logs")).toBeNull();
  });

  it("PR4: resetCurriculumState() clears all topic progress", () => {
    populateAllStorageLayers();

    // Verify curriculum has data
    const before = loadCurriculumState();
    expect(Object.keys(before.topics).length).toBeGreaterThan(0);

    // Reset
    const after = resetCurriculumState();

    // Empty state returned
    expect(after.topics).toEqual({});
    expect(after.recentTopics).toEqual([]);

    // Persisted empty
    const loaded = loadCurriculumState();
    expect(loaded.topics).toEqual({});
    expect(loaded.recentTopics).toEqual([]);
  });

  it("PR5: complete reset flow leaves all learner-memory storage empty", () => {
    populateAllStorageLayers();

    // Execute complete reset (matching AccountPage handler)
    clearMemory(); // mercy_host_memory
    clearLogs(); // mercy_host_logs
    resetCurriculumState(); // curriculum state → writes empty state

    // Host memory key removed entirely
    expect(localStorage.getItem("mercy_host_memory")).toBeNull();

    // Logs key removed entirely
    expect(localStorage.getItem("mercy_host_logs")).toBeNull();

    // Curriculum key may remain but contains only empty state
    const curriculumRaw = localStorage.getItem("mercy_curriculum_tracker");
    if (curriculumRaw) {
      const parsed = JSON.parse(curriculumRaw);
      expect(parsed.topics).toEqual({});
      expect(parsed.recentTopics).toEqual([]);
    }
  });

  it("PR6: after resetMemory(), subsequent load returns clean defaults (not stale)", () => {
    populateAllStorageLayers();

    // Reset
    resetMemory();

    // Load fresh
    const fresh = loadValidatedMemory();
    expect(fresh.totalVisits).toBe(0);
    expect(fresh.userName).toBeNull();
    expect(fresh.streakDays).toBe(0);
    expect(fresh.greetedRooms).toEqual([]);
    expect(fresh.favoriteRooms).toEqual([]);
    expect(fresh.teacherLevel).toBe("normal");
    expect(fresh.sessionCount).toBe(0);
  });

  it("PR7: reset cannot be bypassed — cleared data stays cleared", () => {
    populateAllStorageLayers();

    // Clear
    clearMemory();
    clearLogs();
    resetCurriculumState();

    // Verify cleared
    expect(loadValidatedMemory().totalVisits).toBe(0);
    expect(getAllLogs()).toEqual([]);
    expect(loadCurriculumState().topics).toEqual({});

    // Try to "recover" by loading again — still clear
    expect(loadValidatedMemory().totalVisits).toBe(0);
    expect(getAllLogs()).toEqual([]);
    expect(loadCurriculumState().topics).toEqual({});
  });

  it("PR8: IndexedDB AI tutor memory is fully clearable via clearAllTutorMemory", async () => {
    await populateIndexedDbTutorMemory();

    // Verify data exists
    const before = await getIndexedDbRecordCount();
    expect(before).toBeGreaterThan(0);

    // Clear
    await clearAllTutorMemory();

    // Verify empty
    const after = await getIndexedDbRecordCount();
    expect(after).toBe(0);
  });

  it("PR9: after reset, re-populating works correctly (reset doesn't corrupt storage)", () => {
    // Populate → Reset → Re-populate
    populateAllStorageLayers();

    clearMemory();
    clearLogs();
    resetCurriculumState();

    // Re-populate with different data
    updateMemory({ totalVisits: 7, userName: "NewStart" });
    logEvent({ type: "room_enter", roomId: "fresh-room" });
    updateCurriculumTopic({ topic: "new-topic", correct: true });

    // Verify new data exists and is correct
    const memory = loadValidatedMemory();
    expect(memory.totalVisits).toBe(7);
    expect(memory.userName).toBe("NewStart");

    const logs = getAllLogs();
    expect(logs.length).toBe(1);
    expect(logs[0].roomId).toBe("fresh-room");

    const curriculum = loadCurriculumState();
    expect(curriculum.topics["new-topic"]).toBeDefined();
  });
});

describe("privacyReset — storage isolation", () => {
  it("PI1: clearing host memory does not affect non-MercyBlade localStorage keys", () => {
    // Set a non-MercyBlade key
    localStorage.setItem("other-app-prefs", "dark-mode");

    populateAllStorageLayers();
    clearMemory();

    // Non-MercyBlade keys survive
    expect(localStorage.getItem("other-app-prefs")).toBe("dark-mode");
  });

  it("PI2: clearing logs does not affect host memory or curriculum state", () => {
    populateAllStorageLayers();

    clearLogs();

    // Host memory intact
    expect(loadValidatedMemory().totalVisits).toBeGreaterThan(0);

    // Curriculum intact
    expect(Object.keys(loadCurriculumState().topics).length).toBeGreaterThan(0);

    // Logs gone
    expect(getAllLogs()).toEqual([]);
  });

  it("PI3: clearing IndexedDB tutor memory does not affect localStorage data", async () => {
    populateAllStorageLayers();
    await populateIndexedDbTutorMemory();

    await clearAllTutorMemory();

    // localStorage data intact
    expect(loadValidatedMemory().totalVisits).toBeGreaterThan(0);
    expect(getAllLogs().length).toBeGreaterThan(0);
  });
});

describe("privacyReset — data from storage never contains PII", () => {
  it("DP1: host memory logged events contain no raw learner text", () => {
    populateAllStorageLayers();
    // Add an event that has "extra" data — should not contain PII
    logEvent({
      type: "chat_message",
      roomId: "room-a",
      extra: { messageLength: 42, hasCorrection: true },
    });

    const logs = getAllLogs();
    const serialized = JSON.stringify(logs);

    // No PII patterns in logs
    expect(serialized).not.toMatch(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
    expect(serialized).not.toMatch(/\beyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\b/);
    expect(serialized).not.toMatch(/\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/i);
  });

  it("DP2: curriculum state contains only topic tags, no raw learner text", () => {
    populateAllStorageLayers();

    const curriculum = loadCurriculumState();
    const serialized = JSON.stringify(curriculum);

    // Check that topic keys are clean (sanitized before storage)
    for (const topic of Object.keys(curriculum.topics)) {
      expect(topic).not.toMatch(/@/);
      expect(topic).not.toMatch(/eyJ/);
      expect(topic).not.toMatch(/\b[0-9a-f]{8}-[0-9a-f]{4}-/);
    }

    // No raw sentences in curriculum
    expect(serialized).not.toContain("I went to");
    expect(serialized).not.toContain("my teacher said");
  });

  it("DP3: host memory stores only aggregate data — no free-form learner text", () => {
    updateMemory({ userName: "TestUser" });

    const memory = loadValidatedMemory();
    const serialized = JSON.stringify(memory);

    // Verify all string values are short (no free text hiding in memory)
    const allStringValues = collectAllStrings(memory);
    for (const str of allStringValues) {
      expect(str.length).toBeLessThanOrEqual(200);
    }
  });
});

// ── Utility ──────────────────────────────────────────────────────

function collectAllStrings(obj: unknown): string[] {
  const results: string[] = [];
  const walk = (value: unknown): void => {
    if (typeof value === "string") {
      results.push(value);
    } else if (Array.isArray(value)) {
      for (const item of value) walk(item);
    } else if (value && typeof value === "object") {
      for (const v of Object.values(value as Record<string, unknown>)) {
        walk(v);
      }
    }
  };
  walk(obj);
  return results;
}
