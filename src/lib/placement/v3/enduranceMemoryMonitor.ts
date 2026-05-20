export type PlacementEnduranceMemorySnapshot = {
  label: string;
  timestamp: string;
  heapUsedMb: number | null;
  heapTotalMb: number | null;
  jsHeapSizeLimitMb: number | null;
  listenerCount: number;
  timerCount: number;
  fetchInFlight: number;
  retainedSessionKeys: number;
};

type ListenerRecord = {
  target: EventTarget;
  type: string;
  listener: EventListenerOrEventListenerObject;
};

const state = {
  installed: false,
  listeners: new Set<ListenerRecord>(),
  timers: new Set<number>(),
  fetchInFlight: 0,
  originals: {} as {
    addEventListener?: typeof EventTarget.prototype.addEventListener;
    removeEventListener?: typeof EventTarget.prototype.removeEventListener;
    setTimeout?: typeof window.setTimeout;
    clearTimeout?: typeof window.clearTimeout;
    setInterval?: typeof window.setInterval;
    clearInterval?: typeof window.clearInterval;
    fetch?: typeof window.fetch;
  },
};

function mb(value: number | undefined): number | null {
  return typeof value === "number" && Number.isFinite(value)
    ? Math.round((value / 1024 / 1024) * 100) / 100
    : null;
}

function sessionKeyCount(): number {
  try {
    let count = 0;
    for (let i = 0; i < window.localStorage.length; i += 1) {
      const key = window.localStorage.key(i) ?? "";
      if (key.startsWith("mb.placement.v3")) count += 1;
    }
    for (let i = 0; i < window.sessionStorage.length; i += 1) {
      const key = window.sessionStorage.key(i) ?? "";
      if (key.startsWith("mb.placement.v3")) count += 1;
    }
    return count;
  } catch {
    return 0;
  }
}

export function installPlacementEnduranceMemoryMonitor(): void {
  if (typeof window === "undefined" || state.installed) return;
  state.installed = true;
  state.originals.addEventListener = EventTarget.prototype.addEventListener;
  state.originals.removeEventListener = EventTarget.prototype.removeEventListener;
  state.originals.setTimeout = window.setTimeout;
  state.originals.clearTimeout = window.clearTimeout;
  state.originals.setInterval = window.setInterval;
  state.originals.clearInterval = window.clearInterval;
  state.originals.fetch = window.fetch.bind(window);

  EventTarget.prototype.addEventListener = function patchedAdd(type, listener, options) {
    if (listener) state.listeners.add({ target: this, type, listener });
    return state.originals.addEventListener!.call(this, type, listener, options);
  };

  EventTarget.prototype.removeEventListener = function patchedRemove(type, listener, options) {
    for (const record of [...state.listeners]) {
      if (record.target === this && record.type === type && record.listener === listener) {
        state.listeners.delete(record);
      }
    }
    return state.originals.removeEventListener!.call(this, type, listener, options);
  };

  window.setTimeout = ((handler: TimerHandler, timeout?: number, ...args: unknown[]) => {
    const id = state.originals.setTimeout!(handler, timeout, ...args) as unknown as number;
    state.timers.add(id);
    return id;
  }) as typeof window.setTimeout;

  window.clearTimeout = ((id?: number) => {
    if (typeof id === "number") state.timers.delete(id);
    return state.originals.clearTimeout!(id);
  }) as typeof window.clearTimeout;

  window.setInterval = ((handler: TimerHandler, timeout?: number, ...args: unknown[]) => {
    const id = state.originals.setInterval!(handler, timeout, ...args) as unknown as number;
    state.timers.add(id);
    return id;
  }) as typeof window.setInterval;

  window.clearInterval = ((id?: number) => {
    if (typeof id === "number") state.timers.delete(id);
    return state.originals.clearInterval!(id);
  }) as typeof window.clearInterval;

  window.fetch = (async (...args: Parameters<typeof fetch>) => {
    state.fetchInFlight += 1;
    try {
      return await state.originals.fetch!(...args);
    } finally {
      state.fetchInFlight -= 1;
    }
  }) as typeof window.fetch;
}

export function snapshotPlacementEnduranceMemory(label = "snapshot"): PlacementEnduranceMemorySnapshot {
  const perf = performance as Performance & {
    memory?: {
      usedJSHeapSize?: number;
      totalJSHeapSize?: number;
      jsHeapSizeLimit?: number;
    };
  };
  return {
    label,
    timestamp: new Date().toISOString(),
    heapUsedMb: mb(perf.memory?.usedJSHeapSize),
    heapTotalMb: mb(perf.memory?.totalJSHeapSize),
    jsHeapSizeLimitMb: mb(perf.memory?.jsHeapSizeLimit),
    listenerCount: state.listeners.size,
    timerCount: state.timers.size,
    fetchInFlight: state.fetchInFlight,
    retainedSessionKeys: sessionKeyCount(),
  };
}

export function resetPlacementEnduranceMemoryMonitor(): void {
  state.listeners.clear();
  state.timers.clear();
  state.fetchInFlight = 0;
}

declare global {
  interface Window {
    __placementV3EnduranceMemory__?: {
      install: typeof installPlacementEnduranceMemoryMonitor;
      snapshot: typeof snapshotPlacementEnduranceMemory;
      reset: typeof resetPlacementEnduranceMemoryMonitor;
    };
  }
}

if (typeof window !== "undefined") {
  window.__placementV3EnduranceMemory__ = {
    install: installPlacementEnduranceMemoryMonitor,
    snapshot: snapshotPlacementEnduranceMemory,
    reset: resetPlacementEnduranceMemoryMonitor,
  };
}
