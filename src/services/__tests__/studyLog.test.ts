import { vi, describe, it, expect, beforeEach } from "vitest";

// Chainable, thenable stand-in for the Supabase query builder: every builder
// method returns the builder, and awaiting it resolves to { data, error }.
const h = vi.hoisted(() => ({
  user: { id: "u1" } as { id: string } | null,
  data: null as unknown[] | null,
  error: null as { message: string } | null,
}));

vi.mock("@/lib/supabaseClient", () => {
  const builder: Record<string, unknown> = {};
  for (const m of ["select", "eq", "not", "order", "limit"]) builder[m] = () => builder;
  builder.then = (resolve: (v: { data: unknown[] | null; error: unknown }) => unknown) =>
    resolve({ data: h.data, error: h.error });
  return {
    supabase: {
      auth: { getUser: async () => ({ data: { user: h.user }, error: null }) },
      from: () => builder,
    },
  };
});

import { getRecentMoods } from "../studyLog";

beforeEach(() => {
  h.user = { id: "u1" };
  h.data = null;
  h.error = null;
});

describe("studyLog.getRecentMoods — error surfacing (WP-H8)", () => {
  it("surfaces a Supabase read error (not silently swallowed) and returns a safe empty list", async () => {
    h.data = null;
    h.error = { message: "timeout" };
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    try {
      const moods = await getRecentMoods();
      expect(moods).toEqual([]); // safe fallback preserved
      expect(warn).toHaveBeenCalledTimes(1);
      expect(warn.mock.calls[0].join(" ")).toMatch(/getRecentMoods: read failed/i);
    } finally {
      warn.mockRestore();
    }
  });

  it("does not warn on a successful read", async () => {
    h.data = [{ mood_after: "great" }, { mood_after: "ok" }];
    h.error = null;
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    try {
      const moods = await getRecentMoods();
      expect(moods).toEqual(["great", "ok"]);
      expect(warn).not.toHaveBeenCalled();
    } finally {
      warn.mockRestore();
    }
  });
});
