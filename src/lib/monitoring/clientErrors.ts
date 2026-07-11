import { supabase } from "@/lib/supabaseClient";
import { stripPII } from "@/lib/security/piiProtection";

export const CLIENT_ERRORS_TABLE = "client_errors";

const STORAGE_KEY = "mercy.clientErrors.v1";
const MAX_QUEUE = 200;
const MAX_EVENT_AGE_MS = 7 * 24 * 60 * 60 * 1000;
const DEFAULT_BATCH_SIZE = 20;
const DEFAULT_SIZE_THRESHOLD = 5;
const DEFAULT_FLUSH_INTERVAL_MS = 15_000;
const BASE_BACKOFF_MS = 1_000;
const MAX_BACKOFF_MS = 5 * 60_000;
const SAMPLE_WINDOW_MS = 10 * 60_000;
const MAX_PER_SIGNATURE_PER_WINDOW = 5;

type ClientErrorKind = "api" | "js" | "unhandledrejection";

export type ClientErrorEvent = {
  id: string;
  timestamp: number;
  route: string;
  userId: string | null;
  buildSha: string | null;
  endpoint: string | null;
  status: number | null;
  method: string | null;
  durationMs: number | null;
  errorSignature: string;
  errorKind: ClientErrorKind;
};

export type ClientErrorRow = {
  client_ts: string | null;
  route: string;
  user_id: string | null;
  build_sha: string | null;
  endpoint: string | null;
  status: number | null;
  method: string | null;
  duration_ms: number | null;
  error_signature: string;
  error_kind: ClientErrorKind;
  source: "r1-sentinel";
};

export type InsertResult = { error: unknown | null };

export type ClientErrorSinkDeps = {
  readQueue?: () => ClientErrorEvent[];
  writeQueue?: (events: ClientErrorEvent[]) => void;
  insertRows?: (rows: ClientErrorRow[]) => Promise<InsertResult>;
  getUserId?: () => Promise<string | null>;
  now?: () => number;
  batchSize?: number;
  sizeThreshold?: number;
  flushIntervalMs?: number;
  enabled?: boolean;
};

export type FlushOutcome = {
  flushed: number;
  skipped?: "disabled" | "backoff" | "empty";
  error?: unknown;
};

export type ClientErrorSink = {
  enqueue: (event: Omit<ClientErrorEvent, "id" | "timestamp" | "route" | "userId" | "buildSha"> & Partial<Pick<ClientErrorEvent, "route" | "buildSha">>) => Promise<FlushOutcome | null>;
  flush: () => Promise<FlushOutcome>;
  start: () => void;
  stop: () => void;
  isEnabled: () => boolean;
};

declare global {
  interface Window {
    __MB_CLIENT_ERROR_SENTINEL__?: boolean;
  }
}

let installed = false;

export function isClientErrorSinkEnabled(): boolean {
  try {
    return import.meta.env?.VITE_CLIENT_ERROR_SINK_ENABLED !== "false";
  } catch {
    return true;
  }
}

export function createClientErrorSink(deps: ClientErrorSinkDeps = {}): ClientErrorSink {
  const readQueue = deps.readQueue ?? readStoredQueue;
  const writeQueue = deps.writeQueue ?? writeStoredQueue;
  const insertRows = deps.insertRows ?? defaultInsertRows;
  const getUserId = deps.getUserId ?? defaultGetUserId;
  const now = deps.now ?? (() => Date.now());
  const batchSize = clampPositive(deps.batchSize, DEFAULT_BATCH_SIZE);
  const sizeThreshold = clampPositive(deps.sizeThreshold, DEFAULT_SIZE_THRESHOLD);
  const flushIntervalMs = clampPositive(deps.flushIntervalMs, DEFAULT_FLUSH_INTERVAL_MS);
  const enabled = deps.enabled ?? isClientErrorSinkEnabled();

  let backoffUntil = 0;
  let backoffAttempts = 0;
  let inFlight = false;
  let timer: ReturnType<typeof setInterval> | null = null;
  const signatureSamples = new Map<string, number[]>();

  function resetBackoff(): void {
    backoffAttempts = 0;
    backoffUntil = 0;
  }

  function backoff(): void {
    backoffAttempts += 1;
    const delay = Math.min(BASE_BACKOFF_MS * 2 ** (backoffAttempts - 1), MAX_BACKOFF_MS);
    backoffUntil = now() + delay;
  }

  function shouldSample(signature: string): boolean {
    const cutoff = now() - SAMPLE_WINDOW_MS;
    const recent = (signatureSamples.get(signature) ?? []).filter((ts) => ts >= cutoff);
    if (recent.length >= MAX_PER_SIGNATURE_PER_WINDOW) {
      signatureSamples.set(signature, recent);
      return false;
    }
    recent.push(now());
    signatureSamples.set(signature, recent);
    return true;
  }

  async function enqueue(
    partial: Omit<ClientErrorEvent, "id" | "timestamp" | "route" | "userId" | "buildSha"> & Partial<Pick<ClientErrorEvent, "route" | "buildSha">>,
  ): Promise<FlushOutcome | null> {
    if (!enabled) return { flushed: 0, skipped: "disabled" };
    const errorSignature = cleanSignature(partial.errorSignature);
    if (!errorSignature || !shouldSample(errorSignature)) return null;
    const userId = await getUserId();
    const event: ClientErrorEvent = {
      id: makeEventId(now),
      timestamp: now(),
      route: cleanRoute(partial.route ?? currentRoute()),
      userId,
      buildSha: cleanNullable(partial.buildSha ?? readBuildSha(), 80),
      endpoint: cleanNullable(partial.endpoint, 500),
      status: normalizeStatus(partial.status),
      method: cleanMethod(partial.method),
      durationMs: normalizeDuration(partial.durationMs),
      errorSignature,
      errorKind: partial.errorKind,
    };
    const queue = pruneQueue([...readQueue(), event], now()).slice(-MAX_QUEUE);
    writeQueue(queue);
    if (queue.length >= sizeThreshold) return flush();
    return null;
  }

  async function flush(): Promise<FlushOutcome> {
    if (!enabled) return { flushed: 0, skipped: "disabled" };
    if (now() < backoffUntil) return { flushed: 0, skipped: "backoff" };
    if (inFlight) return { flushed: 0, skipped: "empty" };

    inFlight = true;
    try {
      const queue = pruneQueue(readQueue(), now());
      if (queue.length === 0) {
        writeQueue([]);
        return { flushed: 0, skipped: "empty" };
      }

      const batch = queue.slice(0, batchSize);
      const rows = batch.map((event) => toClientErrorRow(event));
      const { error } = await insertRows(rows);
      if (error) {
        writeQueue(queue);
        backoff();
        return { flushed: 0, error };
      }

      writeQueue(queue.slice(batch.length));
      resetBackoff();
      return { flushed: batch.length };
    } finally {
      inFlight = false;
    }
  }

  function start(): void {
    if (!enabled) return;
    if (typeof window === "undefined") return;
    if (timer) return;
    timer = setInterval(() => { void flush(); }, flushIntervalMs);
    void flush();
  }

  function stop(): void {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  return { enqueue, flush, start, stop, isEnabled: () => enabled };
}

export function installClientErrorSentinel(sink = createClientErrorSink()): ClientErrorSink {
  if (typeof window === "undefined") return sink;
  if (installed || window.__MB_CLIENT_ERROR_SENTINEL__) {
    sink.start();
    return sink;
  }
  installed = true;
  window.__MB_CLIENT_ERROR_SENTINEL__ = true;

  installGlobalErrorListeners(sink);
  installFetchWrapper(sink);
  sink.start();
  return sink;
}

function installGlobalErrorListeners(sink: ClientErrorSink): void {
  window.addEventListener("error", (event) => {
    void sink.enqueue({
      endpoint: null,
      status: null,
      method: null,
      durationMs: null,
      errorKind: "js",
      errorSignature: buildJsSignature("js", event.error ?? event.message),
    });
  }, true);

  window.addEventListener("unhandledrejection", (event) => {
    void sink.enqueue({
      endpoint: null,
      status: null,
      method: null,
      durationMs: null,
      errorKind: "unhandledrejection",
      errorSignature: buildJsSignature("unhandledrejection", event.reason),
    });
  }, true);
}

function installFetchWrapper(sink: ClientErrorSink): void {
  if (typeof window.fetch !== "function") return;
  const originalFetch = window.fetch.bind(window);
  window.fetch = (async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const started = Date.now();
    const method = inferMethod(input, init);
    const endpoint = normalizeEndpoint(input);
    try {
      const response = await originalFetch(input, init);
      if (response.status >= 400 && endpoint && !isTelemetryEndpoint(endpoint)) {
        void sink.enqueue({
          endpoint,
          status: response.status,
          method,
          durationMs: Date.now() - started,
          errorKind: "api",
          errorSignature: buildApiSignature(method, endpoint, response.status),
        });
      }
      return response;
    } catch (err) {
      if (endpoint && !isTelemetryEndpoint(endpoint)) {
        void sink.enqueue({
          endpoint,
          status: null,
          method,
          durationMs: Date.now() - started,
          errorKind: "api",
          errorSignature: buildApiSignature(method, endpoint, "network_error"),
        });
      }
      throw err;
    }
  }) as typeof window.fetch;
}

export function toClientErrorRow(event: ClientErrorEvent): ClientErrorRow {
  return {
    client_ts: Number.isFinite(event.timestamp) ? new Date(event.timestamp).toISOString() : null,
    route: cleanRoute(event.route),
    user_id: event.userId,
    build_sha: cleanNullable(event.buildSha, 80),
    endpoint: cleanNullable(event.endpoint, 500),
    status: normalizeStatus(event.status),
    method: cleanMethod(event.method),
    duration_ms: normalizeDuration(event.durationMs),
    error_signature: cleanSignature(event.errorSignature),
    error_kind: event.errorKind,
    source: "r1-sentinel",
  };
}

async function defaultInsertRows(rows: ClientErrorRow[]): Promise<InsertResult> {
  const { error } = await supabase.from(CLIENT_ERRORS_TABLE).insert(rows);
  return { error: error ?? null };
}

async function defaultGetUserId(): Promise<string | null> {
  try {
    const { data } = await supabase.auth.getSession();
    return data.session?.user?.id ?? null;
  } catch {
    return null;
  }
}

function readStoredQueue(): ClientErrorEvent[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isClientErrorEvent);
  } catch {
    return [];
  }
}

function writeStoredQueue(events: ClientErrorEvent[]): void {
  try {
    if (events.length === 0) {
      window.localStorage.removeItem(STORAGE_KEY);
      return;
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(events.slice(-MAX_QUEUE)));
  } catch {
    /* localStorage may be disabled or full; telemetry must not affect UX */
  }
}

function pruneQueue(events: ClientErrorEvent[], nowMs: number): ClientErrorEvent[] {
  return events.filter((event) => nowMs - event.timestamp <= MAX_EVENT_AGE_MS).slice(-MAX_QUEUE);
}

function isClientErrorEvent(value: unknown): value is ClientErrorEvent {
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  return (
    typeof record.id === "string" &&
    typeof record.timestamp === "number" &&
    typeof record.route === "string" &&
    (record.userId === null || typeof record.userId === "string") &&
    (record.buildSha === null || typeof record.buildSha === "string") &&
    (record.endpoint === null || typeof record.endpoint === "string") &&
    (record.status === null || typeof record.status === "number") &&
    (record.method === null || typeof record.method === "string") &&
    (record.durationMs === null || typeof record.durationMs === "number") &&
    typeof record.errorSignature === "string" &&
    (record.errorKind === "api" || record.errorKind === "js" || record.errorKind === "unhandledrejection")
  );
}

function buildApiSignature(method: string | null, endpoint: string, status: number | "network_error"): string {
  return cleanSignature(`api:${method || "GET"} ${endpoint} -> ${status}`);
}

function buildJsSignature(kind: "js" | "unhandledrejection", value: unknown): string {
  const name = value instanceof Error ? value.name : kind;
  return cleanSignature(`${kind}:${name}`);
}

function normalizeEndpoint(input: RequestInfo | URL): string | null {
  try {
    const url =
      typeof input === "string"
        ? new URL(input, window.location.origin)
        : input instanceof URL
          ? input
          : new URL(input.url, window.location.origin);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    const sameOrigin = url.origin === window.location.origin;
    return sameOrigin ? url.pathname : `${url.hostname}${url.pathname}`;
  } catch {
    return null;
  }
}

function isTelemetryEndpoint(endpoint: string): boolean {
  return /\/rest\/v1\/client_errors\b/.test(endpoint) || /\/functions\/v1\/client-error-alert\b/.test(endpoint);
}

function inferMethod(input: RequestInfo | URL, init?: RequestInit): string | null {
  if (init?.method) return cleanMethod(init.method);
  if (typeof Request !== "undefined" && input instanceof Request) return cleanMethod(input.method);
  return "GET";
}

function currentRoute(): string {
  try {
    return window.location.pathname || "/";
  } catch {
    return "/";
  }
}

function readBuildSha(): string | null {
  try {
    return (
      String(import.meta.env?.VITE_MERCYB_BUILD_HASH ?? "").trim() ||
      String(import.meta.env?.VITE_VERCEL_GIT_COMMIT_SHA ?? "").trim() ||
      null
    );
  } catch {
    return null;
  }
}

function cleanRoute(value: string): string {
  const route = stripPII(value || "/").split("?")[0]?.slice(0, 300) || "/";
  return route.startsWith("/") ? route : `/${route}`;
}

function cleanNullable(value: string | null | undefined, max: number): string | null {
  if (!value) return null;
  const cleaned = stripPII(value).split("?")[0]?.trim().slice(0, max) || "";
  return cleaned || null;
}

function cleanSignature(value: string): string {
  return stripPII(value).replace(/\s+/g, " ").trim().slice(0, 500);
}

function cleanMethod(value: string | null | undefined): string | null {
  if (!value) return null;
  return value.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 16) || null;
}

function normalizeStatus(value: number | null | undefined): number | null {
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  return Math.max(0, Math.min(599, Math.floor(value)));
}

function normalizeDuration(value: number | null | undefined): number | null {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) return null;
  return Math.floor(value);
}

function clampPositive(value: number | undefined, fallback: number): number {
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) return fallback;
  return Math.floor(value);
}

function makeEventId(now: () => number): string {
  const random =
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2);
  return `${Math.floor(now())}-${random}`;
}

export const __internal = {
  buildApiSignature,
  buildJsSignature,
  normalizeEndpoint,
  isTelemetryEndpoint,
  readStoredQueue,
  writeStoredQueue,
};
