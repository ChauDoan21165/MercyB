// src/features/gamification/store/IndexedDbGamificationStore.ts
//
// IndexedDB-backed GamificationStore (F5). The shipping persistence impl:
// client-first, dependency-free, promise-based. Mirrors the native pattern in
// src/lib/offline/offlineDb.ts (hasIndexedDb guard, openDb with
// onupgradeneeded, withStore helper, typed unavailable error) so we don't pull
// in idb/dexie/fake-indexeddb.
//
// Shape: ONE object store ("state") holding the entire GamificationState as a
// single record keyed by a synthetic id "singleton". The synthetic id is an
// IDB keyPath concern only — it is stripped before the state is returned, so
// callers never see it.
//
// SSR / test safety: when `indexedDB` is unavailable (jsdom, Node, SSR),
// load() returns a fresh default and save()/clear() resolve as no-ops. Never
// throws on the read/write path.
//
// Forward-safe migration: a persisted record whose schemaVersion does not
// match GAMIFICATION_SCHEMA_VERSION is discarded (default returned) rather than
// trusted — a non-additive shape change should not crash an old client.

import { createDefaultState } from "../defaults";
import {
  GAMIFICATION_SCHEMA_VERSION,
  type GamificationState,
  type GamificationStore,
} from "../types";

const DB_NAME = "mb-gamification";
const DB_VERSION = 1;
const STORE_STATE = "state";
const SINGLETON_ID = "singleton";

type PersistedRecord = GamificationState & { id: string };

export class GamificationDbUnavailableError extends Error {
  constructor() {
    super("IndexedDB is not available in this environment");
    this.name = "GamificationDbUnavailableError";
  }
}

function hasIndexedDb(): boolean {
  return typeof indexedDB !== "undefined";
}

function openDb(): Promise<IDBDatabase> {
  if (!hasIndexedDb()) {
    return Promise.reject(new GamificationDbUnavailableError());
  }
  return new Promise<IDBDatabase>((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_STATE)) {
        db.createObjectStore(STORE_STATE, { keyPath: "id" });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () =>
      reject(req.error ?? new Error("Failed to open gamification DB"));
    req.onblocked = () =>
      reject(new Error("Gamification DB open blocked by another connection"));
  });
}

type StoreMode = "readonly" | "readwrite";

async function withStore<T>(
  mode: StoreMode,
  fn: (store: IDBObjectStore) => Promise<T> | T,
): Promise<T> {
  const db = await openDb();
  try {
    return await new Promise<T>((resolve, reject) => {
      const tx = db.transaction(STORE_STATE, mode);
      const store = tx.objectStore(STORE_STATE);
      let result: T;
      Promise.resolve(fn(store))
        .then((r) => {
          result = r;
        })
        .catch(reject);
      tx.oncomplete = () => resolve(result);
      tx.onerror = () =>
        reject(tx.error ?? new Error("Gamification DB transaction failed"));
      tx.onabort = () =>
        reject(tx.error ?? new Error("Gamification DB transaction aborted"));
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

/** Drop the synthetic `id` keyPath before handing state back to callers. */
function stripId(record: PersistedRecord): GamificationState {
  const { id: _id, ...state } = record;
  void _id;
  return state;
}

export class IndexedDbGamificationStore implements GamificationStore {
  isAvailable(): boolean {
    return hasIndexedDb();
  }

  async load(): Promise<GamificationState> {
    if (!hasIndexedDb()) return createDefaultState();
    const record = await withStore("readonly", async (store) => {
      return (await reqToPromise(store.get(SINGLETON_ID))) as
        | PersistedRecord
        | undefined;
    });
    // No record persisted yet → fresh default.
    if (!record) return createDefaultState();
    // Incompatible old shape → discard rather than crash (forward-safe).
    if (record.schemaVersion !== GAMIFICATION_SCHEMA_VERSION) {
      return createDefaultState();
    }
    return stripId(record);
  }

  async save(state: GamificationState): Promise<void> {
    if (!hasIndexedDb()) return;
    const record: PersistedRecord = { id: SINGLETON_ID, ...state };
    await withStore("readwrite", (store) => {
      store.put(record);
    });
  }

  async clear(): Promise<void> {
    if (!hasIndexedDb()) return;
    await withStore("readwrite", (store) => {
      store.delete(SINGLETON_ID);
    });
  }
}
