// src/lib/__tests__/roomSpecificationCache.test.ts
// A27 — getEffectiveRoomSpec in-memory result cache (hit / miss / expiry).

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

// One recording chain that collapses Supabase's fluent
// .from().select().eq().eq().maybeSingle() into a counter + a swappable result.
let fromCalls = 0;
let nextResult: { data: unknown; error: unknown } = { data: null, error: null };

vi.mock("@/lib/supabaseClient", () => {
  const chain: {
    eq: (c: string, v: unknown) => typeof chain;
    maybeSingle: () => Promise<{ data: unknown; error: unknown }>;
  } = {
    eq: vi.fn(() => chain),
    maybeSingle: vi.fn(() => Promise.resolve(nextResult)),
  };
  return {
    supabase: {
      from: vi.fn(() => {
        fromCalls += 1;
        return { select: vi.fn(() => chain) };
      }),
    },
  };
});

import {
  getEffectiveRoomSpec,
  getRoomSpecCacheStats,
  invalidateRoomSpecCache,
  __resetRoomSpecCacheForTests,
} from "../roomSpecification";

beforeEach(() => {
  fromCalls = 0;
  nextResult = { data: null, error: null }; // → no assignment → DEFAULT (the 99% path)
  __resetRoomSpecCacheForTests();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("getEffectiveRoomSpec result cache", () => {
  it("misses on first call, hits on repeat (no extra Supabase round-trip)", async () => {
    const first = await getEffectiveRoomSpec("roomA", null);
    expect(first.id).toBe("app_default");
    const callsAfterMiss = fromCalls;
    expect(callsAfterMiss).toBeGreaterThan(0); // Supabase was queried
    expect(getRoomSpecCacheStats()).toEqual({ hits: 0, misses: 1, size: 1 });

    const second = await getEffectiveRoomSpec("roomA", null);
    expect(second).toEqual(first);
    expect(fromCalls).toBe(callsAfterMiss); // no further round-trip
    expect(getRoomSpecCacheStats()).toEqual({ hits: 1, misses: 1, size: 1 });
  });

  it("keys by (room, tier) — different tier is a separate miss", async () => {
    await getEffectiveRoomSpec("roomA", null);
    await getEffectiveRoomSpec("roomA", "tier2");
    expect(getRoomSpecCacheStats()).toEqual({ hits: 0, misses: 2, size: 2 });

    await getEffectiveRoomSpec("roomA", "tier2"); // repeat → hit
    expect(getRoomSpecCacheStats().hits).toBe(1);
  });

  it("returns a copy — mutating the result cannot poison the cache", async () => {
    const a = await getEffectiveRoomSpec("roomA", null);
    a.use_color_theme = false;
    a.id = "tampered";
    const b = await getEffectiveRoomSpec("roomA", null); // cache hit
    expect(b.use_color_theme).toBe(true);
    expect(b.id).toBe("app_default");
  });

  it("expires after the 5-minute TTL → re-fetches", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-05-18T00:00:00Z"));

    await getEffectiveRoomSpec("roomA", null);
    const callsAfterMiss = fromCalls;
    await getEffectiveRoomSpec("roomA", null); // within TTL → hit
    expect(fromCalls).toBe(callsAfterMiss);
    expect(getRoomSpecCacheStats().hits).toBe(1);

    vi.advanceTimersByTime(5 * 60 * 1000 + 1); // past TTL

    await getEffectiveRoomSpec("roomA", null); // expired → miss + re-fetch
    expect(fromCalls).toBeGreaterThan(callsAfterMiss);
    expect(getRoomSpecCacheStats().misses).toBe(2);
  });

  it("invalidateRoomSpecCache() clears all entries", async () => {
    await getEffectiveRoomSpec("roomA", null);
    await getEffectiveRoomSpec("roomB", null);
    expect(getRoomSpecCacheStats().size).toBe(2);

    invalidateRoomSpecCache();
    expect(getRoomSpecCacheStats().size).toBe(0);

    const calls = fromCalls;
    await getEffectiveRoomSpec("roomA", null); // forced miss after invalidation
    expect(fromCalls).toBeGreaterThan(calls);
  });

  it("invalidateRoomSpecCache(roomId) drops only that room's variants", async () => {
    await getEffectiveRoomSpec("roomA", null);
    await getEffectiveRoomSpec("roomA", "tier2");
    await getEffectiveRoomSpec("roomB", null);
    expect(getRoomSpecCacheStats().size).toBe(3);

    invalidateRoomSpecCache("roomA");
    expect(getRoomSpecCacheStats().size).toBe(1); // roomB survives

    await getEffectiveRoomSpec("roomB", null); // still cached → hit
    expect(getRoomSpecCacheStats().hits).toBe(1);
  });

  it("does NOT cache fail-open error returns (so Supabase recovery is visible)", async () => {
    nextResult = { data: null, error: { message: "boom" } };

    const r1 = await getEffectiveRoomSpec("roomA", null);
    expect(r1.id).toBe("app_default"); // fail-open default
    expect(getRoomSpecCacheStats().size).toBe(0); // not stored

    const calls = fromCalls;
    const r2 = await getEffectiveRoomSpec("roomA", null);
    expect(r2.id).toBe("app_default");
    expect(fromCalls).toBeGreaterThan(calls); // queried Supabase again, not served stale
  });
});
