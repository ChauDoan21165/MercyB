// src/lib/offline/offlineDb.ts
//
// Offline Lite v1 — IndexedDB shell.
// Three stores:
//   - `rooms` : downloaded room JSON keyed by roomId
//   - `queue` : safe sync-queue entries keyed by uuid
//   - `meta`  : tiny key/value table (contentVersion, audioCacheVersion, etc.)
//
// Promise-based, no third-party deps. The schema is small enough that
// adding `idb` / `dexie` / `localforage` would be net-negative (bytes,
// install graph). Revisit when stores > 3 or when migrations get hairy.
//
// Hard rules (see docs/offline-lite-v1.md):
//   - No PII in `meta`.
//   - The `queue` store is for low-stakes, idempotent retries only.
//   - Logout must call `clearOfflineForLogout()` to wipe rooms + queue +
//     PII-free meta keys are kept; everything else is dropped.
//
// SSR / non-browser safety: every public function returns a sane default
// (or rejects with a typed error) when `indexedDB` is unavailable, so
// importing this module never crashes server-side renders or unit tests
// that don't stub IDB.

const DB_NAME = "mb-offline";
const DB_VERSION = 1;

export const STORE_ROOMS = "rooms";
export const STORE_QUEUE = "queue";
export const STORE_META = "meta";

export interface OfflineRoomRecord {
  roomId: string;
  json: unknown;
  cachedAt: number;
  contentVersion: number;
}

export interface OfflineQueueRecord {
  id: string;
  kind: string;
  payload: unknown;
  enqueuedAt: number;
  attempts: number;
}

export interface OfflineMetaRecord {
  key: string;
  value: unknown;
}

export class OfflineDbUnavailableError extends Error {
  constructor() {
    super("IndexedDB is not available in this environment");
    this.name = "OfflineDbUnavailableError";
  }
}

function hasIndexedDb(): boolean {
  return typeof indexedDB !== "undefined";
}

function openDb(): Promise<IDBDatabase> {
  if (!hasIndexedDb()) {
    return Promise.reject(new OfflineDbUnavailableError());
  }
  return new Promise<IDBDatabase>((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_ROOMS)) {
        db.createObjectStore(STORE_ROOMS, { keyPath: "roomId" });
      }
      if (!db.objectStoreNames.contains(STORE_QUEUE)) {
        const queueStore = db.createObjectStore(STORE_QUEUE, { keyPath: "id" });
        queueStore.createIndex("by_enqueuedAt", "enqueuedAt", { unique: false });
      }
      if (!db.objectStoreNames.contains(STORE_META)) {
        db.createObjectStore(STORE_META, { keyPath: "key" });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error ?? new Error("Failed to open offline DB"));
    req.onblocked = () => reject(new Error("Offline DB open blocked by another connection"));
  });
}

type StoreMode = "readonly" | "readwrite";

async function withStore<T>(
  storeName: string,
  mode: StoreMode,
  fn: (store: IDBObjectStore) => Promise<T> | T,
): Promise<T> {
  const db = await openDb();
  try {
    return await new Promise<T>((resolve, reject) => {
      const tx = db.transaction(storeName, mode);
      const store = tx.objectStore(storeName);
      let result: T;
      Promise.resolve(fn(store))
        .then((r) => {
          result = r;
        })
        .catch(reject);
      tx.oncomplete = () => resolve(result);
      tx.onerror = () => reject(tx.error ?? new Error("Offline DB transaction failed"));
      tx.onabort = () => reject(tx.error ?? new Error("Offline DB transaction aborted"));
    });
  } finally {
    db.close();
  }
}

function reqToPromise<T>(req: IDBRequest<T>): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error ?? new Error("IDB request failed"));
  });
}

// ---------- rooms ----------

export async function putRoom(record: OfflineRoomRecord): Promise<void> {
  await withStore(STORE_ROOMS, "readwrite", (store) => {
    store.put(record);
  });
}

export async function getRoom(roomId: string): Promise<OfflineRoomRecord | undefined> {
  return withStore(STORE_ROOMS, "readonly", async (store) => {
    const result = await reqToPromise(store.get(roomId));
    return (result as OfflineRoomRecord | undefined) ?? undefined;
  });
}

export async function listRoomIds(): Promise<string[]> {
  return withStore(STORE_ROOMS, "readonly", async (store) => {
    const keys = await reqToPromise(store.getAllKeys());
    return (keys as IDBValidKey[]).map((k) => String(k));
  });
}

export async function deleteRoom(roomId: string): Promise<void> {
  await withStore(STORE_ROOMS, "readwrite", (store) => {
    store.delete(roomId);
  });
}

export async function clearRooms(): Promise<void> {
  await withStore(STORE_ROOMS, "readwrite", (store) => {
    store.clear();
  });
}

export async function countRooms(): Promise<number> {
  return withStore(STORE_ROOMS, "readonly", async (store) => {
    return (await reqToPromise(store.count())) as number;
  });
}

// ---------- queue (low-level; high-level API in offlineQueue.ts) ----------

export async function putQueueEntry(entry: OfflineQueueRecord): Promise<void> {
  await withStore(STORE_QUEUE, "readwrite", (store) => {
    store.put(entry);
  });
}

export async function listQueueEntries(): Promise<OfflineQueueRecord[]> {
  return withStore(STORE_QUEUE, "readonly", async (store) => {
    const all = await reqToPromise(store.getAll());
    const entries = (all as OfflineQueueRecord[]) ?? [];
    return entries.sort((a, b) => a.enqueuedAt - b.enqueuedAt);
  });
}

export async function deleteQueueEntry(id: string): Promise<void> {
  await withStore(STORE_QUEUE, "readwrite", (store) => {
    store.delete(id);
  });
}

export async function clearQueue(): Promise<void> {
  await withStore(STORE_QUEUE, "readwrite", (store) => {
    store.clear();
  });
}

export async function countQueueEntries(): Promise<number> {
  return withStore(STORE_QUEUE, "readonly", async (store) => {
    return (await reqToPromise(store.count())) as number;
  });
}

// ---------- meta ----------

export async function getMeta<T = unknown>(key: string): Promise<T | undefined> {
  return withStore(STORE_META, "readonly", async (store) => {
    const result = (await reqToPromise(store.get(key))) as OfflineMetaRecord | undefined;
    return (result?.value as T | undefined) ?? undefined;
  });
}

export async function setMeta(key: string, value: unknown): Promise<void> {
  await withStore(STORE_META, "readwrite", (store) => {
    store.put({ key, value });
  });
}

export async function deleteMeta(key: string): Promise<void> {
  await withStore(STORE_META, "readwrite", (store) => {
    store.delete(key);
  });
}

// ---------- logout helper ----------

const META_KEYS_TO_KEEP_ON_LOGOUT: ReadonlySet<string> = new Set([
  "contentVersion",
  "audioCacheVersion",
  "lastSeenAppVersion",
]);

/**
 * Wipe per-user offline state on signOut.
 * Keeps non-PII meta keys (contentVersion, audioCacheVersion, lastSeenAppVersion)
 * so the next login doesn't re-download everything we already have.
 *
 * Caller responsibilities (NOT done here, on purpose):
 *   - Clearing the audio Cache API store — see audioCache.clearAll().
 *   - Clearing localStorage keys prefixed `mb_offline_`.
 *
 * Foundation only: this helper exists so the eventual auth wiring has
 * one entry point. Don't call it from auth yet — that's a v2 task.
 */
export async function clearOfflineForLogout(): Promise<void> {
  if (!hasIndexedDb()) return;
  await clearRooms();
  await clearQueue();
  await withStore(STORE_META, "readwrite", async (store) => {
    const keys = (await reqToPromise(store.getAllKeys())) as IDBValidKey[];
    for (const k of keys) {
      const stringKey = String(k);
      if (!META_KEYS_TO_KEEP_ON_LOGOUT.has(stringKey)) {
        store.delete(stringKey);
      }
    }
  });
}

// ---------- internal exports for tests ----------

export const __INTERNAL__ = {
  DB_NAME,
  DB_VERSION,
  hasIndexedDb,
  openDb,
};
