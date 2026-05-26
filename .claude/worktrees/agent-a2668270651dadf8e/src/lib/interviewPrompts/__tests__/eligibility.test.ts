// Eligibility unit tests. Pure helpers (`hasReachedMonthlyLimit`)
// tested directly. The Supabase-touching `canSubmitInterviewPrompt` is
// tested via a chained-builder mock that mirrors the real
// `supabase.from(...).select(...).eq(...)` shape — same approach as
// src/lib/stories/__tests__/eligibility.test.ts.

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  canSubmitInterviewPrompt,
  hasReachedMonthlyLimit,
} from "../eligibility";

const fromMock = vi.fn();

vi.mock("@/lib/supabaseClient", () => ({
  supabase: {
    from: (...args: unknown[]) => fromMock(...args),
  },
}));

// ── pure helpers ────────────────────────────────────────────────────
describe("hasReachedMonthlyLimit", () => {
  const now = new Date("2026-04-27T00:00:00.000Z");
  const day = 86_400_000;

  it("returns false at exactly 9 submissions in the last 30 days", () => {
    const subs = Array.from(
      { length: 9 },
      (_, i) => new Date(now.getTime() - i * day),
    );
    expect(hasReachedMonthlyLimit(subs, now)).toBe(false);
  });

  it("returns true at exactly 10 submissions in the last 30 days", () => {
    const subs = Array.from(
      { length: 10 },
      (_, i) => new Date(now.getTime() - i * day),
    );
    expect(hasReachedMonthlyLimit(subs, now)).toBe(true);
  });

  it("ignores submissions older than 30 days", () => {
    const subs = [
      ...Array.from({ length: 9 }, (_, i) => new Date(now.getTime() - i * day)),
      // These are 31+ days old and must not count.
      new Date(now.getTime() - 31 * day),
      new Date(now.getTime() - 60 * day),
    ];
    expect(hasReachedMonthlyLimit(subs, now)).toBe(false);
  });
});

// ── chained-builder helpers for the Supabase mock ───────────────────
function completedCountBuilder(count: number, error: string | null = null) {
  // mock_interview_sessions.select(..., {count,head}).eq().eq() resolves
  const eq2 = vi
    .fn()
    .mockResolvedValue({ count, error: error ? { message: error } : null });
  const eq1 = vi.fn().mockReturnValue({ eq: eq2 });
  const select = vi.fn().mockReturnValue({ eq: eq1 });
  return { select };
}

function recentSubsCountBuilder(count: number, error: string | null = null) {
  // user_interview_prompts.select(..., {count,head}).eq().gte() resolves
  const gte = vi
    .fn()
    .mockResolvedValue({ count, error: error ? { message: error } : null });
  const eq = vi.fn().mockReturnValue({ gte });
  const select = vi.fn().mockReturnValue({ eq });
  return { select };
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(console, "warn").mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("canSubmitInterviewPrompt", () => {
  it("returns ineligible with VI reason when fewer than 3 completions", async () => {
    fromMock.mockImplementation((table: string) => {
      if (table === "mock_interview_sessions") return completedCountBuilder(2);
      if (table === "user_interview_prompts") return recentSubsCountBuilder(0);
      throw new Error(`unexpected table ${table}`);
    });

    const result = await canSubmitInterviewPrompt("user-123");
    expect(result.eligible).toBe(false);
    if (!result.eligible) {
      expect(result.reasonVi).toContain("3 phỏng vấn");
    }
  });

  it("returns ineligible at exactly 10 submissions in the last 30 days", async () => {
    fromMock.mockImplementation((table: string) => {
      if (table === "mock_interview_sessions") return completedCountBuilder(5);
      if (table === "user_interview_prompts") return recentSubsCountBuilder(10);
      throw new Error(`unexpected table ${table}`);
    });

    const result = await canSubmitInterviewPrompt("user-123");
    expect(result.eligible).toBe(false);
    if (!result.eligible) {
      expect(result.reasonVi).toMatch(/10/);
    }
  });

  it("returns eligible when both gates pass", async () => {
    fromMock.mockImplementation((table: string) => {
      if (table === "mock_interview_sessions") return completedCountBuilder(3);
      if (table === "user_interview_prompts") return recentSubsCountBuilder(0);
      throw new Error(`unexpected table ${table}`);
    });

    const result = await canSubmitInterviewPrompt("user-123");
    expect(result.eligible).toBe(true);
  });

  it("returns ineligible without an empty userId", async () => {
    const result = await canSubmitInterviewPrompt("");
    expect(result.eligible).toBe(false);
  });
});
