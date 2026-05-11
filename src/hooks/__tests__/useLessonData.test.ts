import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useLessonData, __clearLessonCache } from "@/hooks/useLessonData";

const mockMaybeSingle = vi.fn();

vi.mock("@/lib/supabaseClient", () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          eq: vi.fn(() => ({
            eq: vi.fn(() => ({
              maybeSingle: mockMaybeSingle,
            })),
          })),
        })),
      })),
    })),
  },
}));

beforeEach(() => {
  vi.clearAllMocks();
  mockMaybeSingle.mockReset();
});

afterEach(() => {
  __clearLessonCache();
});

describe("useLessonData", () => {
  it("returns lesson on success", async () => {
    const mockLesson = { id: "german_b2_test", title_en: "Test" };
    mockMaybeSingle.mockResolvedValue({ data: mockLesson, error: null });

    const { result } = renderHook(() => useLessonData("german", "b2", 0));
    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.lesson).toEqual(mockLesson);
    expect(result.current.error).toBeNull();
  });

  it("returns error string on failure", async () => {
    mockMaybeSingle.mockResolvedValue({ data: null, error: { message: "DB down" } });
    const { result } = renderHook(() => useLessonData("german", "b2", 0));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.lesson).toBeNull();
    expect(result.current.error).toBe("Could not load lesson. Please try again.");
  });

  it("returns cached result on second call without hitting Supabase", async () => {
    const mockLesson = { id: "german_b2_test", title_en: "Test" };
    mockMaybeSingle.mockResolvedValue({ data: mockLesson, error: null });

    const { result, rerender } = renderHook(() =>
      useLessonData("german", "b2", 0),
    );

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.lesson).toEqual(mockLesson);

    rerender();

    // Supabase only called once — second render hits cache
    expect(mockMaybeSingle).toHaveBeenCalledTimes(1);
  });
});