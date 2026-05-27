/**
 * Stage 3A — Placement snapshot adapter tests.
 *
 * Verifies the four contract bullets from the dispatch:
 *   1. writes a snapshot, reads it back
 *   2. overwrites a previous snapshot (latest-wins; not an array)
 *   3. returns null when nothing has been written
 *   4. handles localStorage unavailable (private mode / quota / disabled)
 *
 * Plus one extra: malformed stored value reads as null (defensive — a
 * future schema bump or hand-edited localStorage shouldn't crash the
 * Stage 3A aggregator).
 */

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  type PlacementSnapshot,
  readPlacementSnapshot,
  recordPlacementSnapshot,
} from "../placementSnapshotAdapter";

const STORAGE_KEY = "mb.stage3a.placement.snapshot";

const sample: PlacementSnapshot = {
  cefr: "B1",
  weaknesses: ["vi_l1_past_ed", "vi_l1_missing_be", "vi_l1_3rd_person_s"],
  completedAt: 1779700000000,
  sessionId: "sess-01HXYZ",
};

describe("placementSnapshotAdapter", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("returns null when nothing has been written", () => {
    expect(readPlacementSnapshot()).toBeNull();
  });

  it("writes a snapshot, reads it back unchanged", () => {
    recordPlacementSnapshot(sample);
    expect(readPlacementSnapshot()).toEqual(sample);
  });

  it("overwrites the previous snapshot (latest wins; not appended as an array)", () => {
    recordPlacementSnapshot(sample);
    const next: PlacementSnapshot = {
      cefr: "B2",
      weaknesses: ["vi_l1_some_vs_any"],
      completedAt: sample.completedAt + 86_400_000,
      sessionId: "sess-01HXYZ-NEXT",
    };
    recordPlacementSnapshot(next);

    const stored = readPlacementSnapshot();
    expect(stored).toEqual(next);
    expect(stored?.sessionId).toBe("sess-01HXYZ-NEXT");

    // localStorage holds a single object, never an array.
    const raw = window.localStorage.getItem(STORAGE_KEY);
    expect(raw).not.toBeNull();
    expect(JSON.parse(raw!)).not.toBeInstanceOf(Array);
  });

  it("handles localStorage unavailable — record is silent, read returns null", () => {
    const orig = Object.getOwnPropertyDescriptor(window, "localStorage");
    Object.defineProperty(window, "localStorage", {
      configurable: true,
      get() {
        throw new Error("localStorage denied (simulated private mode)");
      },
    });
    try {
      expect(() => recordPlacementSnapshot(sample)).not.toThrow();
      expect(readPlacementSnapshot()).toBeNull();
    } finally {
      if (orig) Object.defineProperty(window, "localStorage", orig);
    }
  });

  it("handles localStorage.setItem throwing (quota exceeded) — silent drop", () => {
    // Spy on the live instance, not Storage.prototype — jsdom's localStorage
    // doesn't always route instance calls through the prototype.
    const spy = vi
      .spyOn(window.localStorage, "setItem")
      .mockImplementationOnce(() => {
        throw new Error("QuotaExceededError");
      });
    expect(() => recordPlacementSnapshot(sample)).not.toThrow();
    expect(window.localStorage.getItem(STORAGE_KEY)).toBeNull();
    expect(readPlacementSnapshot()).toBeNull();
    spy.mockRestore();
  });

  it("returns null when the stored value is malformed", () => {
    window.localStorage.setItem(STORAGE_KEY, '{"cefr": 42, "weaknesses": "oops"}');
    expect(readPlacementSnapshot()).toBeNull();
  });

  afterEach(() => {
    window.localStorage.clear();
  });
});
