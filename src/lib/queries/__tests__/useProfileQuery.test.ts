// src/lib/queries/__tests__/useProfileQuery.test.ts
//
// Covers the contract of useProfileQuery — the shared profiles read.
// What we guard:
//   - disabled when userId is null/undefined (no network call)
//   - returns the row from supabase.from('profiles').select('*')
//   - returns null when the row is missing (maybeSingle)
//   - surfaces errors to the consumer
//   - dedupes: two parallel hook instances for the same userId fire
//     a single underlying fetch

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

const mockMaybeSingle = vi.fn();
const mockEq = vi.fn(() => ({ maybeSingle: () => mockMaybeSingle() }));
const mockSelect = vi.fn(() => ({ eq: mockEq }));
const mockFrom = vi.fn((_table: string) => ({ select: mockSelect }));

vi.mock("@/lib/supabaseClient", () => ({
  supabase: { from: (t: string) => mockFrom(t) },
}));

import { useProfileQuery } from "../useProfileQuery";

function makeWrapper() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client }, children);
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("useProfileQuery", () => {
  it("is disabled and makes no network call when userId is null", () => {
    const { result } = renderHook(() => useProfileQuery(null), {
      wrapper: makeWrapper(),
    });
    expect(result.current.fetchStatus).toBe("idle");
    expect(mockFrom).not.toHaveBeenCalled();
  });

  it("is disabled when userId is undefined", () => {
    const { result } = renderHook(() => useProfileQuery(undefined), {
      wrapper: makeWrapper(),
    });
    expect(result.current.fetchStatus).toBe("idle");
    expect(mockFrom).not.toHaveBeenCalled();
  });

  it("returns the row from supabase for a given userId", async () => {
    mockMaybeSingle.mockResolvedValue({
      data: { id: "u1", email: "a@b.com", full_name: "Alice" },
      error: null,
    });

    const { result } = renderHook(() => useProfileQuery("u1"), {
      wrapper: makeWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual({
      id: "u1",
      email: "a@b.com",
      full_name: "Alice",
    });
    expect(mockFrom).toHaveBeenCalledWith("profiles");
    expect(mockSelect).toHaveBeenCalledWith("*");
    expect(mockEq).toHaveBeenCalledWith("id", "u1");
  });

  it("returns null when the profile row is missing", async () => {
    mockMaybeSingle.mockResolvedValue({ data: null, error: null });

    const { result } = renderHook(() => useProfileQuery("missing"), {
      wrapper: makeWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBeNull();
  });

  it("surfaces supabase errors as react-query errors", async () => {
    mockMaybeSingle.mockResolvedValue({
      data: null,
      error: { message: "boom" },
    });

    const { result } = renderHook(() => useProfileQuery("u1"), {
      wrapper: makeWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect((result.current.error as Error | null)?.message).toBe("boom");
  });

  it("dedupes parallel callers for the same userId into one fetch", async () => {
    mockMaybeSingle.mockResolvedValue({
      data: { id: "u1" },
      error: null,
    });

    const wrapper = makeWrapper();
    const a = renderHook(() => useProfileQuery("u1"), { wrapper });
    const b = renderHook(() => useProfileQuery("u1"), { wrapper });

    await waitFor(() => {
      expect(a.result.current.isSuccess).toBe(true);
      expect(b.result.current.isSuccess).toBe(true);
    });

    expect(mockMaybeSingle).toHaveBeenCalledTimes(1);
  });
});
