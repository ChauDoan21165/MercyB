// Tests for getPromptsForInterview — Phase 2 I/O wrapper that pulls
// community prompts from Supabase, mixes with caller-supplied
// hardcoded prompts, and falls back silently on error / empty result.
//
// Mock pattern mirrors src/lib/interviewPrompts/__tests__/voting.test.ts
// — chained builder where we control the terminal `.limit()` resolve.

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  getPromptsForInterview,
  type HardcodedPromptInput,
} from "../mixPrompts";

const fromMock = vi.fn();

vi.mock("@/lib/supabaseClient", () => ({
  supabase: {
    from: (...args: unknown[]) => fromMock(...args),
  },
}));

beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(console, "warn").mockImplementation(() => {});
  vi.spyOn(console, "info").mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

const HARDCODED: HardcodedPromptInput[] = [
  { text: "H1 question", textVi: "H1 câu hỏi" },
  { text: "H2 question", textVi: "H2 câu hỏi" },
  { text: "H3 question" },
  { text: "H4 question" },
  { text: "H5 question" },
];

interface RowShape {
  id: string;
  question_text_en: string;
  question_text_vi: string | null;
  context: string | null;
  submitter_anonymous: boolean;
  upvotes_count: number;
  published_at: string | null;
  profiles: { display_name: string | null } | null;
}

/**
 * Build a chained-builder mock that resolves to {data, error} at the
 * end of .limit(). Each call to `from()` returns a new builder.
 */
function builderResolving(result: { data: RowShape[] | null; error: { message: string } | null }) {
  const limit = vi.fn().mockResolvedValue(result);
  const order2 = vi.fn().mockReturnValue({ limit });
  const order1 = vi.fn().mockReturnValue({ order: order2, limit });
  const eq2 = vi.fn().mockReturnValue({ order: order1, limit });
  const eq1 = vi.fn().mockReturnValue({ eq: eq2 });
  const select = vi.fn().mockReturnValue({ eq: eq1 });
  return { select, limit, order1, order2, eq1, eq2 };
}

function builderThrowing(err: Error) {
  // .limit() rejects — exercises the catch path.
  const limit = vi.fn().mockRejectedValue(err);
  const order2 = vi.fn().mockReturnValue({ limit });
  const order1 = vi.fn().mockReturnValue({ order: order2, limit });
  const eq2 = vi.fn().mockReturnValue({ order: order1, limit });
  const eq1 = vi.fn().mockReturnValue({ eq: eq2 });
  const select = vi.fn().mockReturnValue({ eq: eq1 });
  return { select };
}

describe("getPromptsForInterview", () => {
  it("returns hardcodedCount + communityCount items when both have enough data", async () => {
    const rows: RowShape[] = Array.from({ length: 3 }, (_, i) => ({
      id: `c${i + 1}`,
      question_text_en: `C${i + 1} question`,
      question_text_vi: `C${i + 1} câu hỏi`,
      context: null,
      submitter_anonymous: true,
      upvotes_count: 100 - i,
      published_at: "2026-04-01T00:00:00Z",
      profiles: null,
    }));
    fromMock.mockReturnValueOnce(builderResolving({ data: rows, error: null }));
    const result = await getPromptsForInterview({
      profession: "tech-worker",
      hardcodedPrompts: HARDCODED,
      hardcodedCount: 2,
      communityCount: 3,
    });
    expect(result).toHaveLength(5);
    expect(result.filter((p) => p.source === "community")).toHaveLength(3);
    expect(result.filter((p) => p.source === "hardcoded")).toHaveLength(2);
  });

  it("returns all-hardcoded when community result is empty", async () => {
    fromMock.mockReturnValueOnce(builderResolving({ data: [], error: null }));
    const result = await getPromptsForInterview({
      profession: "tech-worker",
      hardcodedPrompts: HARDCODED,
      hardcodedCount: 3,
      communityCount: 2,
    });
    expect(result).toHaveLength(5);
    expect(result.every((p) => p.source === "hardcoded")).toBe(true);
  });

  it("returns all-hardcoded when supabase throws (silent fallback)", async () => {
    fromMock.mockReturnValueOnce(builderThrowing(new Error("network down")));
    const result = await getPromptsForInterview({
      profession: "tech-worker",
      hardcodedPrompts: HARDCODED,
      hardcodedCount: 3,
      communityCount: 2,
    });
    expect(result).toHaveLength(5);
    expect(result.every((p) => p.source === "hardcoded")).toBe(true);
  });

  it("returns all-hardcoded when supabase returns an error object", async () => {
    fromMock.mockReturnValueOnce(
      builderResolving({ data: null, error: { message: "RLS denied" } }),
    );
    const result = await getPromptsForInterview({
      profession: "tech-worker",
      hardcodedPrompts: HARDCODED,
      hardcodedCount: 3,
      communityCount: 2,
    });
    expect(result.every((p) => p.source === "hardcoded")).toBe(true);
  });

  it("populates submitterDisplayName=null when prompt is anonymous", async () => {
    const rows: RowShape[] = [
      {
        id: "c1",
        question_text_en: "Anon question",
        question_text_vi: null,
        context: null,
        submitter_anonymous: true,
        upvotes_count: 10,
        published_at: "2026-04-01T00:00:00Z",
        // Even if a profile exists, anonymous=true must suppress the name.
        profiles: { display_name: "Should Not Appear" },
      },
    ];
    fromMock.mockReturnValueOnce(builderResolving({ data: rows, error: null }));
    const result = await getPromptsForInterview({
      profession: "tech-worker",
      hardcodedPrompts: HARDCODED,
      hardcodedCount: 0,
      communityCount: 1,
    });
    const community = result.find((p) => p.source === "community");
    expect(community?.submitterDisplayName).toBeNull();
  });

  it("uses profile.display_name when not anonymous", async () => {
    const rows: RowShape[] = [
      {
        id: "c1",
        question_text_en: "Named question",
        question_text_vi: null,
        context: "Hỏi tại Wells Fargo",
        submitter_anonymous: false,
        upvotes_count: 10,
        published_at: "2026-04-01T00:00:00Z",
        profiles: { display_name: "Linh N." },
      },
    ];
    fromMock.mockReturnValueOnce(builderResolving({ data: rows, error: null }));
    const result = await getPromptsForInterview({
      profession: "tech-worker",
      hardcodedPrompts: HARDCODED,
      hardcodedCount: 0,
      communityCount: 1,
    });
    const community = result.find((p) => p.source === "community");
    expect(community?.submitterDisplayName).toBe("Linh N.");
    expect(community?.context).toBe("Hỏi tại Wells Fargo");
  });

  it("orders community results by upvotes_count desc (relies on Supabase .order())", async () => {
    // We can't observe sort order from inside getPromptsForInterview
    // because the helper trusts whatever Supabase returns; we instead
    // verify the chained .order() call is wired with the right column.
    const builder = builderResolving({ data: [], error: null });
    fromMock.mockReturnValueOnce(builder);
    await getPromptsForInterview({
      profession: "tech-worker",
      hardcodedPrompts: HARDCODED,
      hardcodedCount: 0,
      communityCount: 3,
    });
    expect(builder.order1).toHaveBeenCalledWith("upvotes_count", {
      ascending: false,
    });
  });

  it("is deterministic when called twice with the same seed", async () => {
    const rows: RowShape[] = Array.from({ length: 3 }, (_, i) => ({
      id: `c${i + 1}`,
      question_text_en: `C${i + 1}`,
      question_text_vi: null,
      context: null,
      submitter_anonymous: true,
      upvotes_count: 10 - i,
      published_at: null,
      profiles: null,
    }));
    fromMock.mockReturnValue(builderResolving({ data: rows, error: null }));
    const a = await getPromptsForInterview({
      profession: "tech-worker",
      hardcodedPrompts: HARDCODED,
      hardcodedCount: 2,
      communityCount: 3,
      seed: 42,
    });
    const b = await getPromptsForInterview({
      profession: "tech-worker",
      hardcodedPrompts: HARDCODED,
      hardcodedCount: 2,
      communityCount: 3,
      seed: 42,
    });
    expect(a.map((p) => p.text)).toEqual(b.map((p) => p.text));
  });

  it("pads hardcoded slots when community returns fewer rows than requested (underflow)", async () => {
    const rows: RowShape[] = [
      {
        id: "c1",
        question_text_en: "Only one community",
        question_text_vi: null,
        context: null,
        submitter_anonymous: true,
        upvotes_count: 5,
        published_at: null,
        profiles: null,
      },
    ];
    fromMock.mockReturnValueOnce(builderResolving({ data: rows, error: null }));
    const result = await getPromptsForInterview({
      profession: "tech-worker",
      hardcodedPrompts: HARDCODED,
      hardcodedCount: 2,
      communityCount: 3, // Asked for 3, only 1 available.
    });
    // Total slots preserved at 5 (2 + 3); 1 community + 4 hardcoded.
    expect(result).toHaveLength(5);
    expect(result.filter((p) => p.source === "community")).toHaveLength(1);
    expect(result.filter((p) => p.source === "hardcoded")).toHaveLength(4);
  });

  it("returns hardcoded only when communityCount=0 (skips Supabase entirely)", async () => {
    const result = await getPromptsForInterview({
      profession: "tech-worker",
      hardcodedPrompts: HARDCODED,
      hardcodedCount: 5,
      communityCount: 0,
    });
    expect(fromMock).not.toHaveBeenCalled();
    expect(result).toHaveLength(5);
    expect(result.every((p) => p.source === "hardcoded")).toBe(true);
  });
});
