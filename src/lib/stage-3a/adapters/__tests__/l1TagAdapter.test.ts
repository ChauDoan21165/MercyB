/**
 * Stage 3A — L1 tag adapter unit tests.
 *
 * Pure-localStorage smoke. Re-creates JSDOM's localStorage between
 * cases so writes from one test don't bleed into the next.
 */

import { describe, expect, it, beforeEach } from "vitest";

import {
  recordL1Tag,
  readL1RecentTags,
} from "../l1TagAdapter";

const STORAGE_KEY = "mb.stage3a.l1.recent";

beforeEach(() => {
  // JSDOM's localStorage persists between tests; reset to a clean slate
  // so test order doesn't matter.
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* noop */
  }
});

describe("recordL1Tag + readL1RecentTags", () => {
  it("writes a tag and reads it back", () => {
    recordL1Tag("vi_l1_3rd_person_s", 1_000_000);
    const out = readL1RecentTags();
    expect(out).toEqual([{ tag: "vi_l1_3rd_person_s", ts: 1_000_000 }]);
  });

  it("FIFO-caps at 50 entries (51st append evicts the oldest)", () => {
    // Insert 51 distinct entries; only the last 50 should survive.
    for (let i = 0; i < 51; i++) {
      recordL1Tag("vi_l1_past_ed", i + 1);
    }
    const out = readL1RecentTags();
    expect(out.length).toBe(50);
    // First entry should be ts=2 (ts=1 was evicted as the 51st pushed
    // it past the cap).
    expect(out[0].ts).toBe(2);
    expect(out[out.length - 1].ts).toBe(51);
  });

  it("dedupes identical (tag, ts) entries — second append is a no-op", () => {
    recordL1Tag("vi_l1_missing_be", 5_000);
    recordL1Tag("vi_l1_missing_be", 5_000);
    recordL1Tag("vi_l1_missing_be", 5_001); // different ts — distinct
    const out = readL1RecentTags();
    expect(out.length).toBe(2);
    expect(out[0]).toEqual({ tag: "vi_l1_missing_be", ts: 5_000 });
    expect(out[1]).toEqual({ tag: "vi_l1_missing_be", ts: 5_001 });
  });

  it("handles localStorage unavailable without throwing (SSR / private mode)", () => {
    // Simulate `getItem` throwing (private-mode iOS Safari behaviour).
    const originalGetItem = window.localStorage.getItem.bind(
      window.localStorage,
    );
    const originalSetItem = window.localStorage.setItem.bind(
      window.localStorage,
    );
    try {
      window.localStorage.getItem = () => {
        throw new Error("storage disabled");
      };
      window.localStorage.setItem = () => {
        throw new Error("storage disabled");
      };
      expect(() => recordL1Tag("vi_l1_plural_s", 9_999)).not.toThrow();
      expect(readL1RecentTags()).toEqual([]);
    } finally {
      window.localStorage.getItem = originalGetItem;
      window.localStorage.setItem = originalSetItem;
    }
  });
});
