// Eligibility unit tests. The pure helpers (bucket + sustained
// improvement) are tested directly. The full Supabase-touching
// `isUserEligibleToShareStory` is tested with a chained-builder mock
// that mirrors the actual `supabase.from(...).select(...).eq(...).maybeSingle()`
// shape — same approach as src/lib/auth/__tests__/anonymousBootstrap.test.ts.

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  bucketAttemptScoresByWeek,
  hasSustainedImprovement,
} from "../eligibility";

const fromMock = vi.fn();

vi.mock("@/lib/supabaseClient", () => ({
  supabase: {
    from: (...args: unknown[]) => fromMock(...args),
  },
}));

// Build a profile builder: profiles.select(...).eq(...).maybeSingle()
function profileBuilder(profile: { tier: number | null; created_at: string | null } | null) {
  const maybeSingle = vi.fn().mockResolvedValue({ data: profile, error: null });
  const eq = vi.fn().mockReturnValue({ maybeSingle });
  const select = vi.fn().mockReturnValue({ eq });
  return { select };
}

// Build a count builder: speech_attempts.select(..., {count, head}).eq(...) → resolves
function countBuilder(count: number) {
  const eq = vi.fn().mockResolvedValue({ count, error: null });
  const select = vi.fn().mockReturnValue({ eq });
  return { select };
}

// Build an attempts-list builder: speech_attempts.select(...).eq(...).gte(...).order(...) → resolves
function attemptsBuilder(attempts: Array<{ match_score: number | null; created_at: string }>) {
  const order = vi.fn().mockResolvedValue({ data: attempts, error: null });
  const gte = vi.fn().mockReturnValue({ order });
  const eq = vi.fn().mockReturnValue({ gte });
  const select = vi.fn().mockReturnValue({ eq });
  return { select };
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(console, "warn").mockImplementation(() => {});
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

// Helpers to wire the multiple `from()` calls for a single eligibility run.
// First call: profiles, second: count, third: attempts.
function wireBuilders(
  profile: { tier: number | null; created_at: string | null } | null,
  count: number,
  attempts: Array<{ match_score: number | null; created_at: string }>,
) {
  const p = profileBuilder(profile);
  const c = countBuilder(count);
  const a = attemptsBuilder(attempts);
  fromMock.mockImplementation((table: string) => {
    if (table === "profiles") return p;
    if (table === "speech_attempts") {
      // First speech_attempts call is the count (head:true), second the
      // attempts list. Use a simple counter.
      return fromMock.mock.calls.filter((c) => c[0] === "speech_attempts").length === 1 ? c : a;
    }
    throw new Error(`unexpected table: ${table}`);
  });
}

const NOW = Date.now();
const DAY = 86_400_000;

function attemptsAt(scores: number[]): Array<{ match_score: number; created_at: string }> {
  // Chronological order: scores[0] = oldest, scores[N-1] = newest.
  // Reading `attemptsAt([0.5, 0.6, 0.7])` then matches "scores rose from 0.5 → 0.6 → 0.7 over time".
  const N = scores.length;
  return scores.map((s, i) => ({
    match_score: s,
    created_at: new Date(NOW - (1 + (N - 1 - i) * 7) * DAY).toISOString(),
  }));
}

describe("bucketAttemptScoresByWeek", () => {
  it("returns an array of length `weeks`", () => {
    const out = bucketAttemptScoresByWeek([], new Date(NOW), 3);
    expect(out).toHaveLength(3);
    expect(out).toEqual([null, null, null]);
  });

  it("ignores attempts with null match_score", () => {
    const out = bucketAttemptScoresByWeek(
      [
        { match_score: null, created_at: new Date(NOW - DAY).toISOString() },
      ],
      new Date(NOW),
      3,
    );
    expect(out[2]).toBeNull();
  });

  it("places attempts into the correct trailing bucket", () => {
    const out = bucketAttemptScoresByWeek(
      [
        { match_score: 0.5, created_at: new Date(NOW - 1 * DAY).toISOString() },  // most recent
        { match_score: 0.3, created_at: new Date(NOW - 8 * DAY).toISOString() },  // mid
        { match_score: 0.1, created_at: new Date(NOW - 15 * DAY).toISOString() }, // oldest
      ],
      new Date(NOW),
      3,
    );
    expect(out[0]).toBeCloseTo(0.1);
    expect(out[1]).toBeCloseTo(0.3);
    expect(out[2]).toBeCloseTo(0.5);
  });
});

describe("hasSustainedImprovement", () => {
  it("returns false when any bucket is null", () => {
    expect(hasSustainedImprovement([null, 0.5, 0.6])).toBe(false);
    expect(hasSustainedImprovement([0.4, null, 0.6])).toBe(false);
  });

  it("returns false when scores decline at any step", () => {
    expect(hasSustainedImprovement([0.5, 0.4, 0.6])).toBe(false);
  });

  it("returns false when cumulative gain is too small", () => {
    expect(hasSustainedImprovement([0.50, 0.51, 0.53])).toBe(false); // gain only 0.03
  });

  it("returns true when scores rise monotonically with sufficient gain", () => {
    expect(hasSustainedImprovement([0.50, 0.55, 0.60])).toBe(true);
  });

  it("returns false on insufficient buckets", () => {
    expect(hasSustainedImprovement([0.5, 0.6])).toBe(false);
  });
});

describe("isUserEligibleToShareStory", () => {
  it("rejects users with tier < 1", async () => {
    const { isUserEligibleToShareStory } = await import("../eligibility");
    wireBuilders(
      { tier: 0, created_at: new Date(NOW - 60 * DAY).toISOString() },
      100,
      attemptsAt([0.5, 0.6, 0.7]),
    );
    const result = await isUserEligibleToShareStory("u-1");
    expect(result.eligible).toBe(false);
    if (!result.eligible) {
      expect(result.reasonVi).toMatch(/trả phí/);
    }
  });

  it("rejects accounts < 21 days old", async () => {
    const { isUserEligibleToShareStory } = await import("../eligibility");
    wireBuilders(
      { tier: 1, created_at: new Date(NOW - 5 * DAY).toISOString() },
      100,
      attemptsAt([0.5, 0.6, 0.7]),
    );
    const result = await isUserEligibleToShareStory("u-2");
    expect(result.eligible).toBe(false);
    if (!result.eligible) {
      expect(result.reasonVi).toMatch(/ngày/);
    }
  });

  it("rejects users with < 50 attempts", async () => {
    const { isUserEligibleToShareStory } = await import("../eligibility");
    wireBuilders(
      { tier: 1, created_at: new Date(NOW - 60 * DAY).toISOString() },
      10,
      attemptsAt([0.5, 0.6, 0.7]),
    );
    const result = await isUserEligibleToShareStory("u-3");
    expect(result.eligible).toBe(false);
    if (!result.eligible) {
      expect(result.reasonVi).toMatch(/50 lần/);
    }
  });

  it("rejects flat or declining score trends", async () => {
    const { isUserEligibleToShareStory } = await import("../eligibility");
    wireBuilders(
      { tier: 1, created_at: new Date(NOW - 60 * DAY).toISOString() },
      100,
      attemptsAt([0.7, 0.6, 0.5]), // declining
    );
    const result = await isUserEligibleToShareStory("u-4");
    expect(result.eligible).toBe(false);
    if (!result.eligible) {
      expect(result.reasonVi).toMatch(/tiến bộ|dữ liệu/);
    }
  });

  it("accepts users meeting all four conditions", async () => {
    const { isUserEligibleToShareStory } = await import("../eligibility");
    wireBuilders(
      { tier: 1, created_at: new Date(NOW - 60 * DAY).toISOString() },
      100,
      attemptsAt([0.50, 0.60, 0.70]), // sustained, gain = 0.20
    );
    const result = await isUserEligibleToShareStory("u-5");
    expect(result.eligible).toBe(true);
  });
});
