import type { LoadMergedRoomResult } from "./roomLoader";

interface CacheEntry {
  value: LoadMergedRoomResult;
  expiresAt: number;
}

const DEFAULT_TTL_MS = 60_000;

const resultCache = new Map<string, CacheEntry>();
const inFlightCache = new Map<string, Promise<LoadMergedRoomResult>>();

function isTestEnv(): boolean {
  return (
    typeof process !== "undefined" &&
    (process.env.VITEST === "true" || process.env.NODE_ENV === "test")
  );
}

export function shouldUseRoomLoaderCache(): boolean {
  return !isTestEnv();
}

export function getCachedRoom(roomId: string): LoadMergedRoomResult | null {
  if (!shouldUseRoomLoaderCache()) return null;

  const entry = resultCache.get(roomId);
  if (!entry) return null;

  if (Date.now() >= entry.expiresAt) {
    resultCache.delete(roomId);
    return null;
  }

  return entry.value;
}

export function setCachedRoom(
  roomId: string,
  value: LoadMergedRoomResult,
  ttlMs: number = DEFAULT_TTL_MS
): void {
  if (!shouldUseRoomLoaderCache()) return;

  if (!value.hasFullAccess) {
    return;
  }

  resultCache.set(roomId, {
    value,
    expiresAt: Date.now() + ttlMs,
  });
}

export function getInFlightRoom(
  roomId: string
): Promise<LoadMergedRoomResult> | null {
  if (!shouldUseRoomLoaderCache()) return null;
  return inFlightCache.get(roomId) ?? null;
}

export function setInFlightRoom(
  roomId: string,
  promise: Promise<LoadMergedRoomResult>
): void {
  if (!shouldUseRoomLoaderCache()) return;
  inFlightCache.set(roomId, promise);
}

export function clearInFlightRoom(roomId: string): void {
  inFlightCache.delete(roomId);
}

export function clearRoomLoaderCache(): void {
  resultCache.clear();
  inFlightCache.clear();
}