/**
 * Stage 3A — L1 detector tag adapter (re-land of PR #1201).
 *
 * Local-only mirror of the L1 detector's per-turn `weaknessTag` into a
 * `localStorage` ring buffer. Stage 3A's "What I'm Weak At" screen
 * reads this buffer to surface recent L1 transfer patterns; no
 * Supabase, no network, no analytics, no learner text.
 *
 * Spec source: `docs/stage-3a/local-weakness-map-design.md` §2.1.
 *
 * Deliberate divergence from original #1201:
 *   - Cap = 50 entries (was 20 in original #1201; raised per the
 *     re-land brief so the read-side aggregation has more signal).
 *   - Entry field name is `ts` (the brief's chosen name) — the design
 *     doc's example sketch used `t`; the brief's `ts` is authoritative
 *     here. Trivial to rename if the reader-side picks `t`.
 *
 * Invariants (per Stage 3A boundaries + brief hard rules):
 *   - No Supabase writes.
 *   - No network / fetch.
 *   - No `mercy_user_facts` touch.
 *   - No placement-state touch.
 *   - localStorage only; tolerates missing localStorage (SSR / private
 *     browsing / disabled storage) without throwing.
 *   - Idempotent on the same (tag, ts) pair — duplicate appends are
 *     silently dropped.
 */

import type { L1WeaknessTag } from "@/lib/feedback/l1-error-detector";

const STORAGE_KEY = "mb.stage3a.l1.recent";
const MAX_ENTRIES = 50;

export interface L1RecentEntry {
  tag: L1WeaknessTag;
  ts: number;
}

/**
 * Post-write subscribers. A generic notifier so downstream layers (e.g.
 * Stage 4's signal-change hook, Q9=B) can react to a fresh L1 tag write
 * WITHOUT this adapter importing them — the dependency points the right
 * way (the listener imports the adapter, not vice-versa), so Stage 3A
 * stays Stage-4-agnostic. Listeners are notified after a successful
 * write; a throwing listener is isolated so it can never corrupt the
 * ring-buffer write path.
 */
type L1TagListener = () => void;
const l1TagListeners = new Set<L1TagListener>();

/**
 * Register a listener fired after each successful `recordL1Tag` write.
 * Returns an unsubscribe fn. Idempotent on the same listener reference.
 */
export function subscribeL1TagRecorded(listener: L1TagListener): () => void {
  l1TagListeners.add(listener);
  return () => {
    l1TagListeners.delete(listener);
  };
}

function notifyL1TagRecorded(): void {
  for (const listener of l1TagListeners) {
    try {
      listener();
    } catch {
      // A downstream listener must never break the ring-buffer write.
    }
  }
}

function getStorage(): Storage | null {
  try {
    if (typeof window === "undefined") return null;
    return window.localStorage;
  } catch {
    // Some browsers throw on `window.localStorage` access in private
    // mode with cookies disabled; fall back to no-op.
    return null;
  }
}

function safeRead(storage: Storage): L1RecentEntry[] {
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Defensive filter — drop any entries that don't match the shape.
    return parsed.filter(
      (e): e is L1RecentEntry =>
        e != null &&
        typeof e === "object" &&
        typeof (e as L1RecentEntry).tag === "string" &&
        typeof (e as L1RecentEntry).ts === "number",
    );
  } catch {
    return [];
  }
}

function safeWrite(storage: Storage, entries: L1RecentEntry[]): void {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // Quota exceeded / disabled / etc. — silently no-op so the
    // caller (a tutor turn handler) never breaks on a storage edge.
  }
}

/**
 * Append a fresh L1 tag observation to the recent ring buffer.
 *
 * - `tag`: the `L1WeaknessTag` the detector emitted on this turn.
 * - `timestamp`: optional epoch-ms; defaults to `Date.now()`.
 *
 * Behaviour:
 *   - Idempotent on (tag, ts) — duplicate appends are dropped.
 *   - FIFO eviction at 50 entries (oldest first).
 *   - Silent no-op when `localStorage` is unavailable.
 */
export function recordL1Tag(
  tag: L1WeaknessTag,
  timestamp?: number,
): void {
  const storage = getStorage();
  if (!storage) return;

  const ts = typeof timestamp === "number" ? timestamp : Date.now();
  const existing = safeRead(storage);

  // Dedupe by exact (tag, ts) match.
  for (const entry of existing) {
    if (entry.tag === tag && entry.ts === ts) return;
  }

  const next: L1RecentEntry[] = [...existing, { tag, ts }];
  // FIFO eviction — drop oldest if over cap.
  const trimmed =
    next.length > MAX_ENTRIES ? next.slice(next.length - MAX_ENTRIES) : next;
  safeWrite(storage, trimmed);

  // Notify post-write subscribers (e.g. Stage 4's signal-change hook).
  // After the write so listeners read the up-to-date buffer; only on a
  // real append (the dedupe path above returns before reaching here).
  notifyL1TagRecorded();
}

/**
 * Read the current recent-tags ring buffer, oldest first.
 *
 * Returns `[]` when storage is unavailable, the key is missing, or
 * the stored blob is corrupt.
 */
export function readL1RecentTags(): L1RecentEntry[] {
  const storage = getStorage();
  if (!storage) return [];
  return safeRead(storage);
}
