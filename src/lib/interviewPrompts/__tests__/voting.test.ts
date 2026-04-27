// Voting library unit tests. Mirrors the chained-builder mock approach
// used in src/lib/stories/__tests__/eligibility.test.ts.
//
// Three checked behaviours:
//   1. Daily cap of 30 returns ok=false reason='daily_cap'.
//   2. flagPrompt INSERTs with vote_type='flag'.
//   3. Already-voted pre-check returns reason='already_voted'.

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { flagPrompt, upvotePrompt } from "../voting";

const fromMock = vi.fn();

vi.mock("@/lib/supabaseClient", () => ({
  supabase: {
    from: (...args: unknown[]) => fromMock(...args),
  },
}));

beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(console, "warn").mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

// daily-count: select(...).eq().gte() resolves
function dailyCountBuilder(count: number) {
  const gte = vi.fn().mockResolvedValue({ count, error: null });
  const eq = vi.fn().mockReturnValue({ gte });
  const select = vi.fn().mockReturnValue({ eq });
  return { select };
}

// hasExistingVote: select().eq().eq().eq().maybeSingle() resolves
function existsBuilder(exists: boolean) {
  const maybeSingle = vi
    .fn()
    .mockResolvedValue({ data: exists ? { user_id: "u" } : null, error: null });
  const eq3 = vi.fn().mockReturnValue({ maybeSingle });
  const eq2 = vi.fn().mockReturnValue({ eq: eq3 });
  const eq1 = vi.fn().mockReturnValue({ eq: eq2 });
  const select = vi.fn().mockReturnValue({ eq: eq1 });
  return { select };
}

const insertSpy = vi.fn().mockResolvedValue({ error: null });
function insertBuilder() {
  return { insert: insertSpy };
}

describe("upvotePrompt — daily cap", () => {
  it("blocks at 30 votes in the last 24h", async () => {
    let call = 0;
    fromMock.mockImplementation(() => {
      call++;
      if (call === 1) return dailyCountBuilder(30);
      throw new Error("should not reach existence check after cap fail");
    });
    const result = await upvotePrompt("p-1", "u-1");
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason).toBe("daily_cap");
  });

  it("returns already_voted when the user already upvoted this prompt", async () => {
    let call = 0;
    fromMock.mockImplementation(() => {
      call++;
      if (call === 1) return dailyCountBuilder(0);
      if (call === 2) return existsBuilder(true);
      throw new Error("should not reach insert when already voted");
    });
    const result = await upvotePrompt("p-1", "u-1");
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason).toBe("already_voted");
  });

  it("inserts when under the cap and no existing vote", async () => {
    insertSpy.mockClear();
    insertSpy.mockResolvedValue({ error: null });

    let call = 0;
    fromMock.mockImplementation(() => {
      call++;
      if (call === 1) return dailyCountBuilder(0);
      if (call === 2) return existsBuilder(false);
      if (call === 3) return insertBuilder();
      throw new Error(`unexpected from() call #${call}`);
    });
    const result = await upvotePrompt("p-1", "u-1");
    expect(result.ok).toBe(true);
    expect(insertSpy).toHaveBeenCalledWith({
      prompt_id: "p-1",
      user_id: "u-1",
      vote_type: "up",
    });
  });
});

describe("flagPrompt", () => {
  it("inserts with vote_type='flag'", async () => {
    insertSpy.mockClear();
    insertSpy.mockResolvedValue({ error: null });

    let call = 0;
    fromMock.mockImplementation(() => {
      call++;
      if (call === 1) return dailyCountBuilder(0);
      if (call === 2) return existsBuilder(false);
      if (call === 3) return insertBuilder();
      throw new Error(`unexpected from() call #${call}`);
    });
    const result = await flagPrompt("p-1", "u-1");
    expect(result.ok).toBe(true);
    expect(insertSpy).toHaveBeenCalledWith({
      prompt_id: "p-1",
      user_id: "u-1",
      vote_type: "flag",
    });
  });
});

describe("upvotePrompt — self-upvote signal from trigger", () => {
  it("translates the trigger error into reason='self_upvote'", async () => {
    let call = 0;
    fromMock.mockImplementation(() => {
      call++;
      if (call === 1) return dailyCountBuilder(0);
      if (call === 2) return existsBuilder(false);
      if (call === 3) {
        return {
          insert: vi.fn().mockResolvedValue({
            error: { message: "cannot upvote your own prompt", code: "42501" },
          }),
        };
      }
      throw new Error(`unexpected from() call #${call}`);
    });
    const result = await upvotePrompt("p-1", "u-1");
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason).toBe("self_upvote");
  });
});
