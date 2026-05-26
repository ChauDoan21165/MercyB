import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useLessonData, __clearLessonCache } from "@/hooks/useLessonData";

// Real row shape: every Supabase `public.lessons` row has the lesson
// payload wrapped in a `content` JSONB column. The hook is responsible
// for unwrapping that — callers receive the lesson content directly.
// Mocking the wrapped shape here so a regression that re-introduces
// `data as T` (returning the full row) fails CI.
const mockRow = {
  id: "uuid-test",
  language: "german",
  level: "b2",
  lesson_index: 1,
  content: { id: "german_b2_test", title_en: "Test" },
};

const mockMaybeSingle = vi.fn();
// Capture every .eq() call so we can assert the 1-based index contract.
const eqCalls: Array<[string, unknown]> = [];

vi.mock("@/lib/supabaseClient", () => {
  // Build a single chain object whose .eq() recursively returns itself.
  // This collapses Supabase's fluent chain (`.from().select().eq().eq().eq().maybeSingle()`)
  // into a recording matcher without nested mocks.
  const chain: { eq: (column: string, value: unknown) => typeof chain; maybeSingle: () => unknown } = {
    eq: vi.fn((column: string, value: unknown) => {
      eqCalls.push([column, value]);
      return chain;
    }),
    maybeSingle: () => mockMaybeSingle(),
  };
  return {
    supabase: {
      from: vi.fn(() => ({
        select: vi.fn(() => chain),
      })),
    },
  };
});

beforeEach(() => {
  vi.clearAllMocks();
  mockMaybeSingle.mockReset();
  eqCalls.length = 0;
});

afterEach(() => {
  __clearLessonCache();
});

describe("useLessonData", () => {
  it("returns the unwrapped content payload, not the whole row", async () => {
    mockMaybeSingle.mockResolvedValue({ data: mockRow, error: null });

    const { result } = renderHook(() => useLessonData("german", "b2", 1));
    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(result.current.loading).toBe(false));

    // Hook strips the row metadata (id, language, level, lesson_index)
    // and exposes only `content` to consumers.
    expect(result.current.lesson).toEqual(mockRow.content);
    expect(result.current.lesson).not.toEqual(mockRow);
    expect(result.current.error).toBeNull();
  });

  it("queries the DB with the caller's 1-based lesson_index (no offset)", async () => {
    mockMaybeSingle.mockResolvedValue({ data: mockRow, error: null });

    renderHook(() => useLessonData("german", "b2", 1));
    await waitFor(() => expect(mockMaybeSingle).toHaveBeenCalled());

    // Caller passes 1 → query must be .eq("lesson_index", 1). A regression
    // that re-introduces an offset (.eq("lesson_index", index + 1) or
    // index - 1) fails this assertion.
    expect(eqCalls).toContainEqual(["lesson_index", 1]);
    expect(eqCalls).not.toContainEqual(["lesson_index", 0]);
    expect(eqCalls).not.toContainEqual(["lesson_index", 2]);
  });

  it("returns error string on Supabase failure", async () => {
    mockMaybeSingle.mockResolvedValue({
      data: null,
      error: { message: "DB down" },
    });
    const { result } = renderHook(() => useLessonData("german", "b2", 1));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.lesson).toBeNull();
    expect(result.current.error).toBe(
      "Could not load lesson. Please try again.",
    );
  });

  it("returns cached content on second call without hitting Supabase", async () => {
    mockMaybeSingle.mockResolvedValue({ data: mockRow, error: null });

    const { result, rerender } = renderHook(() =>
      useLessonData("german", "b2", 1),
    );

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.lesson).toEqual(mockRow.content);

    rerender();

    expect(mockMaybeSingle).toHaveBeenCalledTimes(1);
  });
});
