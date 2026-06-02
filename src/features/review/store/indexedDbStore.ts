// src/features/review/store/indexedDbStore.ts — Lane D (D2)
//
// ReviewStore implemented over IndexedDB via `idb`. This is the persistence
// seam: a Supabase-backed store can replace it later without touching any
// other slice, because every caller depends only on the `ReviewStore`
// interface from `@/features/review/types`.
//
// Object stores:
//   - cards        keyPath ["flow","itemId"]; index "flow" for list/due scans.
//   - logs         autoIncrement; index "flow" for getLog scans.
//   - dailyCounts  keyPath ["flow","day"].
//   - settings     keyPath "flow".
//
// All persisted shapes match the types.ts interfaces exactly (stored as-is).

import { openDB, type DBSchema, type IDBPDatabase } from "idb";
import {
  DEFAULT_REVIEW_SETTINGS,
  type DailyCount,
  type ReviewFlowId,
  type ReviewLogEntry,
  type ReviewSettings,
  type ReviewStore,
  type StoredCard,
} from "@/features/review/types";

const DEFAULT_DB_NAME = "mercyblade-review";
const DB_VERSION = 1;

interface ReviewDb extends DBSchema {
  cards: {
    key: [ReviewFlowId, string];
    value: StoredCard;
    indexes: { flow: ReviewFlowId };
  };
  logs: {
    key: number;
    value: ReviewLogEntry;
    indexes: { flow: ReviewFlowId };
  };
  dailyCounts: {
    key: [ReviewFlowId, string];
    value: DailyCount;
  };
  settings: {
    key: ReviewFlowId;
    value: ReviewSettings;
  };
}

function openReviewDb(dbName: string): Promise<IDBPDatabase<ReviewDb>> {
  return openDB<ReviewDb>(dbName, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("cards")) {
        const cards = db.createObjectStore("cards", {
          keyPath: ["flow", "itemId"],
        });
        cards.createIndex("flow", "flow");
      }
      if (!db.objectStoreNames.contains("logs")) {
        const logs = db.createObjectStore("logs", { autoIncrement: true });
        logs.createIndex("flow", "flow");
      }
      if (!db.objectStoreNames.contains("dailyCounts")) {
        db.createObjectStore("dailyCounts", { keyPath: ["flow", "day"] });
      }
      if (!db.objectStoreNames.contains("settings")) {
        db.createObjectStore("settings", { keyPath: "flow" });
      }
    },
  });
}

/**
 * Create an IndexedDB-backed {@link ReviewStore}. The db name is overridable so
 * tests (and parallel browser contexts) can isolate their data.
 */
export function createReviewStore(
  dbName: string = DEFAULT_DB_NAME,
): ReviewStore {
  let dbPromise: Promise<IDBPDatabase<ReviewDb>> | null = null;

  function db(): Promise<IDBPDatabase<ReviewDb>> {
    if (!dbPromise) dbPromise = openReviewDb(dbName);
    return dbPromise;
  }

  return {
    // ── Cards ──────────────────────────────────────────────────────────────
    async getCard(flow, itemId) {
      const conn = await db();
      return conn.get("cards", [flow, itemId]);
    },

    async getCards(flow) {
      const conn = await db();
      return conn.getAllFromIndex("cards", "flow", flow);
    },

    async getDueCards(flow, nowMs) {
      const conn = await db();
      const cards = await conn.getAllFromIndex("cards", "flow", flow);
      return cards.filter((c) => c.state.due <= nowMs);
    },

    async putCard(card) {
      const conn = await db();
      await conn.put("cards", card);
    },

    // ── Review log ───────────────────────────────────────────────────────────
    async appendLog(entry) {
      const conn = await db();
      await conn.add("logs", entry);
    },

    async getLog(flow, sinceMs) {
      const conn = await db();
      const entries = await conn.getAllFromIndex("logs", "flow", flow);
      const filtered =
        sinceMs === undefined
          ? entries
          : entries.filter((e) => e.reviewedAt >= sinceMs);
      return filtered.sort((a, b) => a.reviewedAt - b.reviewedAt);
    },

    // ── Daily counts ─────────────────────────────────────────────────────────
    async getDailyCount(flow, day) {
      const conn = await db();
      const existing = await conn.get("dailyCounts", [flow, day]);
      return existing ?? { day, flow, newCards: 0, reviews: 0 };
    },

    async incrementDailyCount(flow, day, delta) {
      const conn = await db();
      const tx = conn.transaction("dailyCounts", "readwrite");
      const store = tx.objectStore("dailyCounts");
      const existing = (await store.get([flow, day])) ?? {
        day,
        flow,
        newCards: 0,
        reviews: 0,
      };
      const updated: DailyCount = {
        day,
        flow,
        newCards: existing.newCards + (delta.newCards ?? 0),
        reviews: existing.reviews + (delta.reviews ?? 0),
      };
      await store.put(updated);
      await tx.done;
    },

    // ── Settings ───────────────────────────────────────────────────────────
    async getSettings(flow) {
      const conn = await db();
      const existing = await conn.get("settings", flow);
      return existing ?? { flow, ...DEFAULT_REVIEW_SETTINGS };
    },

    async putSettings(settings) {
      const conn = await db();
      await conn.put("settings", settings);
    },

    // ── Reset ──────────────────────────────────────────────────────────────
    async clear() {
      const conn = await db();
      const tx = conn.transaction(
        ["cards", "logs", "dailyCounts", "settings"],
        "readwrite",
      );
      await Promise.all([
        tx.objectStore("cards").clear(),
        tx.objectStore("logs").clear(),
        tx.objectStore("dailyCounts").clear(),
        tx.objectStore("settings").clear(),
      ]);
      await tx.done;
    },
  };
}
