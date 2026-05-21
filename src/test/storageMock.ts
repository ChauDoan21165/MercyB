type StorageName = "localStorage" | "sessionStorage";

class MemoryStorage implements Storage {
  #store = new Map<string, string>();

  get length(): number {
    return this.#store.size;
  }

  clear(): void {
    this.#store.clear();
  }

  getItem(key: string): string | null {
    return this.#store.has(key) ? this.#store.get(key)! : null;
  }

  key(index: number): string | null {
    return Array.from(this.#store.keys())[index] ?? null;
  }

  removeItem(key: string): void {
    this.#store.delete(key);
  }

  setItem(key: string, value: string): void {
    this.#store.set(key, String(value));
  }
}

type StorageState = {
  localStorage: Storage;
  sessionStorage: Storage;
};

declare global {
  // eslint-disable-next-line no-var -- ambient test state shared by Vitest setup.
  var __MB_TEST_STORAGE_STATE__: StorageState | undefined;
}

function state(): StorageState {
  globalThis.__MB_TEST_STORAGE_STATE__ ??= {
    localStorage: new MemoryStorage(),
    sessionStorage: new MemoryStorage(),
  };

  return globalThis.__MB_TEST_STORAGE_STATE__;
}

function installStorage(target: typeof globalThis, name: StorageName, storage: Storage) {
  Object.defineProperty(target, name, {
    configurable: true,
    enumerable: true,
    value: storage,
  });
}

export function installCanonicalStorageMock(): StorageState {
  const current = state();

  installStorage(globalThis, "localStorage", current.localStorage);
  installStorage(globalThis, "sessionStorage", current.sessionStorage);

  if (typeof window !== "undefined") {
    installStorage(window as unknown as typeof globalThis, "localStorage", current.localStorage);
    installStorage(window as unknown as typeof globalThis, "sessionStorage", current.sessionStorage);
  }

  return current;
}

export function resetCanonicalStorageMock(): StorageState {
  const current = installCanonicalStorageMock();
  current.localStorage.clear();
  current.sessionStorage.clear();
  return current;
}

export function getCanonicalLocalStorage(): Storage {
  return installCanonicalStorageMock().localStorage;
}

export function getCanonicalSessionStorage(): Storage {
  return installCanonicalStorageMock().sessionStorage;
}
