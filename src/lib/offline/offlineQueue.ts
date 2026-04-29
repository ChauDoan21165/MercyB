// src/lib/offline/offlineQueue.ts
//
// Offline Lite v1 — sync queue shell.
// Wraps the raw `queue` store in offlineDb with safety rails:
//   - whitelist of allowed kinds (defense in depth — caller should
//     also gate, but we refuse to enqueue an unknown kind here)
//   - hard cap on entries (oldest dropped on overflow)
//   - retention sweep (drop entries older than MAX_AGE_MS on next boot)
//
// `flush(handler)` walks entries in enqueue order and lets the caller
// decide success / failure per entry. We do NOT make network calls
// here — that wiring belongs to whatever module owns the corresponding
// server endpoint. This file is just the buffer.
//
// See docs/offline-lite-v1.md for the queue contract and rationale.

import {
  countQueueEntries,
  deleteQueueEntry,
  listQueueEntries,
  putQueueEntry,
  type OfflineQueueRecord,
} from "./offlineDb";

export type OfflineQueueKind =
  | "ROOM_COMPLETED"
  | "PRONUNCIATION_ATTEMPT_SAVED"
  | "SRS_REVIEW_SUBMITTED";

const ALLOWED_KINDS: ReadonlySet<OfflineQueueKind> = new Set([
  "ROOM_COMPLETED",
  "PRONUNCIATION_ATTEMPT_SAVED",
  "SRS_REVIEW_SUBMITTED",
]);

export const MAX_QUEUE_ENTRIES = 500;
export const MAX_AGE_MS = 14 * 24 * 60 * 60 * 1000; // 14 days

export class UnsupportedQueueKindError extends Error {
  constructor(kind: string) {
    super(`Offline queue refused unsupported kind: ${kind}`);
    this.name = "UnsupportedQueueKindError";
  }
}

export interface EnqueueInput {
  kind: OfflineQueueKind;
  payload: unknown;
}

export interface FlushResult {
  attempted: number;
  succeeded: number;
  failedAt: OfflineQueueRecord | null;
  remaining: number;
}

export type FlushOutcome = "ok" | "retry" | "drop";

/**
 * Handler called per entry during flush. Return:
 *   - "ok"   : entry handled, remove from queue
 *   - "retry": stop the flush, leave this and following entries
 *   - "drop" : entry is permanently bad, remove without success counting
 */
export type FlushHandler = (entry: OfflineQueueRecord) => Promise<FlushOutcome> | FlushOutcome;

function generateId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `mb-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export async function enqueue(input: EnqueueInput): Promise<OfflineQueueRecord> {
  if (!ALLOWED_KINDS.has(input.kind)) {
    throw new UnsupportedQueueKindError(input.kind);
  }
  const entry: OfflineQueueRecord = {
    id: generateId(),
    kind: input.kind,
    payload: input.payload,
    enqueuedAt: Date.now(),
    attempts: 0,
  };
  await putQueueEntry(entry);
  await trimToCap();
  return entry;
}

export async function listQueue(): Promise<OfflineQueueRecord[]> {
  return listQueueEntries();
}

export async function removeQueueEntry(id: string): Promise<void> {
  await deleteQueueEntry(id);
}

export async function queueSize(): Promise<number> {
  return countQueueEntries();
}

/**
 * Drop entries older than MAX_AGE_MS. Safe to call at boot.
 */
export async function pruneStaleEntries(now: number = Date.now()): Promise<number> {
  const entries = await listQueueEntries();
  let removed = 0;
  for (const entry of entries) {
    if (now - entry.enqueuedAt > MAX_AGE_MS) {
      await deleteQueueEntry(entry.id);
      removed += 1;
    }
  }
  return removed;
}

/**
 * Walk entries in enqueue order. Caller's handler decides outcome
 * per entry. We persist `attempts++` only when the handler returns
 * "retry", so successful and dropped entries don't bloat the count.
 */
export async function flush(handler: FlushHandler): Promise<FlushResult> {
  const entries = await listQueueEntries();
  let succeeded = 0;
  let attempted = 0;
  let failedAt: OfflineQueueRecord | null = null;

  for (const entry of entries) {
    attempted += 1;
    let outcome: FlushOutcome;
    try {
      outcome = await handler(entry);
    } catch {
      outcome = "retry";
    }

    if (outcome === "ok") {
      await deleteQueueEntry(entry.id);
      succeeded += 1;
      continue;
    }
    if (outcome === "drop") {
      await deleteQueueEntry(entry.id);
      continue;
    }
    // retry: bump attempts and stop
    await putQueueEntry({ ...entry, attempts: entry.attempts + 1 });
    failedAt = entry;
    break;
  }

  const remaining = await countQueueEntries();
  return { attempted, succeeded, failedAt, remaining };
}

async function trimToCap(): Promise<void> {
  const size = await countQueueEntries();
  if (size <= MAX_QUEUE_ENTRIES) return;
  const entries = await listQueueEntries(); // ordered oldest → newest
  const overflow = size - MAX_QUEUE_ENTRIES;
  for (let i = 0; i < overflow; i += 1) {
    const victim = entries[i];
    if (!victim) break;
    await deleteQueueEntry(victim.id);
  }
}

export const __INTERNAL__ = {
  ALLOWED_KINDS,
  generateId,
  trimToCap,
};
