// src/lib/__tests__/featureFlags.test.ts
//
// Locks behaviour of getUserHashBucket — the deterministic hash that
// drives feature_flags.rollout_percentage. The four invariants the
// migration relies on:
//   1. Stable: same userId → same bucket forever.
//   2. Bounded: every output is in [0, 99].
//   3. Roughly uniform across UUIDs (sanity, not a stats test).
//   4. Throws on empty / undefined inputs (no silent bucket-0 trap).
//
// Pure-function tests — no Supabase mock, no network.

import { describe, it, expect } from "vitest";

import { getUserHashBucket } from "@/lib/featureFlags";

function randomUuid(): string {
  // Don't depend on global crypto.randomUUID being available across
  // every test runtime — synthesise a uuid-v4-shaped string from
  // Math.random. Distribution-quality is tested below; this is just a
  // shape guarantee for the input.
  const hex = "0123456789abcdef";
  const r = (n: number) =>
    Array.from({ length: n }, () => hex[Math.floor(Math.random() * 16)]).join("");
  return `${r(8)}-${r(4)}-4${r(3)}-${r(4)}-${r(12)}`;
}

describe("getUserHashBucket — determinism", () => {
  it("returns the same bucket for the same userId across repeated calls", () => {
    const ids = [
      "00000000-0000-0000-0000-000000000001",
      "11111111-2222-3333-4444-555555555555",
      "abc-def-ghi-jkl-mno",
      "chau",
      "user_with_unicode_日本語",
    ];
    for (const id of ids) {
      const first = getUserHashBucket(id);
      for (let i = 0; i < 5; i++) {
        expect(getUserHashBucket(id)).toBe(first);
      }
    }
  });
});

describe("getUserHashBucket — bounds", () => {
  it("always returns an integer in [0, 99]", () => {
    for (let i = 0; i < 1000; i++) {
      const bucket = getUserHashBucket(randomUuid());
      expect(Number.isInteger(bucket)).toBe(true);
      expect(bucket).toBeGreaterThanOrEqual(0);
      expect(bucket).toBeLessThanOrEqual(99);
    }
  });
});

describe("getUserHashBucket — distribution sanity", () => {
  it("spreads 10000 random UUIDs across all 100 buckets, ~80-120 per bucket", () => {
    const counts = new Array<number>(100).fill(0);
    for (let i = 0; i < 10_000; i++) {
      counts[getUserHashBucket(randomUuid())] += 1;
    }
    // Every bucket should have been hit at least once at this sample size.
    for (let i = 0; i < 100; i++) {
      expect(counts[i], `bucket ${i} hit count`).toBeGreaterThanOrEqual(1);
    }
    // Loose tolerance — sanity, not statistics. Mean is 100; allow a
    // wide envelope so flakiness is bounded.
    const min = Math.min(...counts);
    const max = Math.max(...counts);
    expect(min).toBeGreaterThanOrEqual(50);
    expect(max).toBeLessThanOrEqual(160);
  });
});

describe("getUserHashBucket — invalid inputs throw", () => {
  it("throws TypeError for empty string", () => {
    expect(() => getUserHashBucket("")).toThrow(TypeError);
  });

  it("throws TypeError for whitespace-only string", () => {
    expect(() => getUserHashBucket("   ")).toThrow(TypeError);
  });

  it("throws TypeError for null", () => {
    // @ts-expect-error — exercising the runtime guard intentionally.
    expect(() => getUserHashBucket(null)).toThrow(TypeError);
  });

  it("throws TypeError for undefined", () => {
    // @ts-expect-error — exercising the runtime guard intentionally.
    expect(() => getUserHashBucket(undefined)).toThrow(TypeError);
  });
});
