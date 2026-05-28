/**
 * Stage 4 (L4) — signal-change hook (Q9=B).
 *
 * Q9=B: L4 evaluates its rules ON SIGNAL CHANGE, via a write-side hook
 * on the L3 ring-buffer write path — NOT on every consumer read. The
 * consumer just reads the persisted buffer (cheap); the rules run only
 * when the underlying signal actually changes.
 *
 * Flow when an L1 tag is recorded:
 *   recordL1Tag(...) writes the ring buffer
 *     → notifies its post-write subscribers
 *       → `runStage4OnSignalChange()` reads the current device-local
 *         signals + gate, evaluates the rule table, and persists the
 *         (≤1) resulting suggestion to the L4 buffer.
 *
 * The per-session cap (Q7=A) is NOT applied here — it is a display-time
 * concern (see `store.ts` / `useStage4Suggestion`), so the buffer always
 * reflects the freshest evaluation and the cap decides what surfaces.
 *
 * Local-only: reads the two device-local L3 sources, writes one local
 * buffer. No Supabase, no network, no `mercy_user_facts`.
 */

import { subscribeL1TagRecorded } from "@/lib/stage-3a/adapters/l1TagAdapter";
import { readL1RecentTags } from "@/lib/stage-3a/adapters/l1TagAdapter";
import { readPlacementSnapshot } from "@/lib/stage-3a/adapters/placementSnapshotAdapter";

import { evaluateStage4 } from "./evaluate";
import { readStage4Gate, writeStoredStage4Suggestion } from "./store";
import type { Stage4Signals, Stage4Suggestion } from "./types";

/**
 * Read the current device-local L3 signals into the evaluator's pure
 * input shape. Both reads tolerate missing/denied storage (they return
 * `[]` / `null`), so this never throws.
 */
export function readStage4Signals(now: number): Stage4Signals {
  let l1Recent: Stage4Signals["l1Recent"] = [];
  let placementWeaknesses: Stage4Signals["placementWeaknesses"] = [];
  try {
    l1Recent = readL1RecentTags();
  } catch {
    l1Recent = [];
  }
  try {
    placementWeaknesses = readPlacementSnapshot()?.weaknesses ?? [];
  } catch {
    placementWeaknesses = [];
  }
  return { l1Recent, placementWeaknesses, now };
}

/**
 * Re-evaluate the L4 rules against current signals and persist the
 * result. Called from the signal-change subscription; also safe to call
 * directly (e.g. once on mount to seed the buffer). Returns the
 * persisted suggestion (or null) for tests / callers that want it.
 */
export function runStage4OnSignalChange(
  now: number = Date.now(),
): Stage4Suggestion | null {
  const signals = readStage4Signals(now);
  const gate = readStage4Gate();
  const suggestion = evaluateStage4(signals, gate);
  writeStoredStage4Suggestion(suggestion);
  return suggestion;
}

/** Module-level guard so repeated installs share one subscription. */
let uninstall: (() => void) | null = null;

/**
 * Subscribe L4 to the L1 ring-buffer write path so the rules run on
 * signal change (Q9=B). Idempotent — calling it again returns the same
 * teardown without double-subscribing. Returns an unsubscribe fn.
 *
 * Seeds the buffer once on install so a consumer mounting after signals
 * already exist still sees an up-to-date suggestion.
 */
export function installStage4SignalHook(): () => void {
  if (uninstall) return uninstall;
  // Seed from whatever signals already exist on this device.
  runStage4OnSignalChange();
  const off = subscribeL1TagRecorded(() => {
    runStage4OnSignalChange();
  });
  uninstall = () => {
    off();
    uninstall = null;
  };
  return uninstall;
}
