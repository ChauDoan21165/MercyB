/**
 * Stage 4 (L4) — signal-change hook tests (Q9=B).
 *
 * Verifies the engine evaluates on the L1 ring-buffer WRITE path, not on
 * read: recording L1 tags through `recordL1Tag` drives the L4 buffer
 * update via the adapter subscription. Also covers the pure signal
 * reader and the seed-on-install behaviour.
 */

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { recordL1Tag } from "@/lib/stage-3a/adapters/l1TagAdapter";
import { recordPlacementSnapshot } from "@/lib/stage-3a/adapters/placementSnapshotAdapter";

import {
  PAST_TENSE_INTERVENTION_MIN_COUNT,
  PAST_TENSE_L1_TAG,
  PAST_TENSE_PLACEMENT_TAG,
} from "../rules";
import {
  installStage4SignalHook,
  readStage4Signals,
  runStage4OnSignalChange,
} from "../signalHook";
import { readStoredStage4Suggestion } from "../store";

const NOW = 1_700_000_000_000;

let teardown: (() => void) | null = null;

function reset() {
  window.localStorage.clear();
  window.sessionStorage.clear();
}

function seedPlacementPastTense() {
  recordPlacementSnapshot({
    cefr: "A2",
    weaknesses: [PAST_TENSE_PLACEMENT_TAG],
    completedAt: NOW - 1000,
    sessionId: "test-session",
  });
}

beforeEach(reset);
afterEach(() => {
  if (teardown) {
    teardown();
    teardown = null;
  }
  reset();
});

describe("readStage4Signals", () => {
  it("reads the L1 ring buffer and placement weaknesses into the pure shape", () => {
    seedPlacementPastTense();
    recordL1Tag(PAST_TENSE_L1_TAG, NOW - 5000);
    const signals = readStage4Signals(NOW);
    expect(signals.now).toBe(NOW);
    expect(signals.placementWeaknesses).toContain(PAST_TENSE_PLACEMENT_TAG);
    expect(signals.l1Recent.some((e) => e.tag === PAST_TENSE_L1_TAG)).toBe(true);
  });

  it("returns empty arrays when no signals exist", () => {
    const signals = readStage4Signals(NOW);
    expect(signals.l1Recent).toEqual([]);
    expect(signals.placementWeaknesses).toEqual([]);
  });
});

describe("runStage4OnSignalChange", () => {
  it("persists a suggestion when the rule fires", () => {
    seedPlacementPastTense();
    for (let i = 0; i < PAST_TENSE_INTERVENTION_MIN_COUNT; i += 1) {
      recordL1Tag(PAST_TENSE_L1_TAG, NOW - i * 60_000);
    }
    const out = runStage4OnSignalChange(NOW);
    expect(out).not.toBeNull();
    expect(out!.id).toBe(`stage4:${PAST_TENSE_L1_TAG}`);
    expect(readStoredStage4Suggestion(NOW)).toEqual(out);
  });

  it("clears the buffer when nothing fires", () => {
    // Below threshold → no fire → buffer cleared.
    seedPlacementPastTense();
    recordL1Tag(PAST_TENSE_L1_TAG, NOW);
    const out = runStage4OnSignalChange(NOW);
    expect(out).toBeNull();
    expect(readStoredStage4Suggestion(NOW)).toBeNull();
  });
});

describe("installStage4SignalHook (Q9=B — evaluate on signal change)", () => {
  it("re-evaluates and persists when L1 tags are recorded after install", () => {
    seedPlacementPastTense();
    teardown = installStage4SignalHook();

    // The subscription recomputes with the real clock, so the L1 hits
    // must be recent enough to fall inside the live-evidence window.
    const base = Date.now();
    for (let i = 0; i < PAST_TENSE_INTERVENTION_MIN_COUNT; i += 1) {
      recordL1Tag(PAST_TENSE_L1_TAG, base - i * 60_000);
    }

    const stored = readStoredStage4Suggestion(base);
    expect(stored).not.toBeNull();
    expect(stored!.id).toBe(`stage4:${PAST_TENSE_L1_TAG}`);
  });

  it("is idempotent — repeated installs share one subscription", () => {
    teardown = installStage4SignalHook();
    const again = installStage4SignalHook();
    expect(again).toBe(teardown);
  });

  it("stops re-evaluating after teardown", () => {
    seedPlacementPastTense();
    const off = installStage4SignalHook();
    off();
    teardown = null;

    for (let i = 0; i < PAST_TENSE_INTERVENTION_MIN_COUNT; i += 1) {
      recordL1Tag(PAST_TENSE_L1_TAG, NOW - i * 60_000);
    }
    // Subscription removed → buffer was only seeded (empty at seed time).
    expect(readStoredStage4Suggestion(Date.now())).toBeNull();
  });
});
