import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/supabaseClient", async () => {
  const mod = await vi.importActual<any>("@/test/mocks/supabaseMock");
  const supabase = mod.createSupabaseMock();
  return { supabase, __mock: supabase };
});

import { __test, upvote, removeVote } from "../roadmapClient";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("toItem mapper", () => {
  it("maps snake_case row to camelCase", () => {
    expect(__test.toItem({
      id: "r1",
      title: "Offline mode",
      description_vi: "Học không cần mạng",
      description_en: "Learn without internet",
      status: "planned",
      priority: 5,
      public_visible: true,
      vote_count: 12,
      created_at: "2026-04-25T00:00:00Z",
      shipped_at: null,
    })).toEqual({
      id: "r1",
      title: "Offline mode",
      descriptionVi: "Học không cần mạng",
      descriptionEn: "Learn without internet",
      status: "planned",
      priority: 5,
      publicVisible: true,
      voteCount: 12,
      createdAt: "2026-04-25T00:00:00Z",
      shippedAt: null,
    });
  });

  it("clamps unknown status to 'planned'", () => {
    expect(__test.toItem({ status: "weird" }).status).toBe("planned");
  });

  it("preserves null descriptions + shipped_at", () => {
    const item = __test.toItem({});
    expect(item.descriptionVi).toBeNull();
    expect(item.descriptionEn).toBeNull();
    expect(item.shippedAt).toBeNull();
    expect(item.publicVisible).toBe(false);
    expect(item.voteCount).toBe(0);
  });
});

describe("upvote", () => {
  it("returns not_signed_in when userId is missing", async () => {
    const result = await upvote(null, "item-1");
    expect(result).toEqual({ ok: false, error: "not_signed_in" });
  });
});

describe("removeVote", () => {
  it("returns ok:false without touching DB when userId is missing", async () => {
    const result = await removeVote(undefined, "item-1");
    expect(result).toEqual({ ok: false });
  });
});
