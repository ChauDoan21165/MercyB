import { describe, it, expect, vi, beforeEach } from "vitest";

const mockSelect = vi.fn();
const mockEq = vi.fn();
const mockUpdate = vi.fn();
const mockOrder = vi.fn();
const mockSingle = vi.fn();
const mockMaybeSingle = vi.fn();

const chain: any = {
  select: (...args: unknown[]) => {
    mockSelect(...args);
    return chain;
  },
  update: (...args: unknown[]) => {
    mockUpdate(...args);
    return chain;
  },
  eq: (...args: unknown[]) => {
    mockEq(...args);
    return chain;
  },
  order: (...args: unknown[]) => {
    mockOrder(...args);
    return Promise.resolve({ data: chain._mockListResult ?? [], error: chain._mockListError ?? null });
  },
  single: () => mockSingle(),
  maybeSingle: () => mockMaybeSingle(),
};
const mockFrom = vi.fn((..._args: unknown[]) => chain);

vi.mock("@/lib/supabaseClient", () => ({
  supabase: { from: (...a: unknown[]) => mockFrom(...a) },
}));

import {
  addToCohort,
  listFeatureFlags,
  lookupProfileByEmail,
  removeFromCohort,
  updateFeatureFlag,
} from "../featureFlagsAdmin";

beforeEach(() => {
  mockSelect.mockReset();
  mockUpdate.mockReset();
  mockEq.mockReset();
  mockOrder.mockReset();
  mockSingle.mockReset();
  mockMaybeSingle.mockReset();
  mockFrom.mockClear();
  chain._mockListResult = undefined;
  chain._mockListError = undefined;
});

describe("addToCohort / removeFromCohort", () => {
  it("addToCohort appends new UUIDs", () => {
    expect(addToCohort(["a"], "b")).toEqual(["a", "b"]);
  });

  it("addToCohort is idempotent — ignores duplicates", () => {
    expect(addToCohort(["a", "b"], "a")).toEqual(["a", "b"]);
  });

  it("addToCohort trims whitespace and ignores empties", () => {
    expect(addToCohort(["a"], "")).toEqual(["a"]);
    expect(addToCohort(["a"], "   ")).toEqual(["a"]);
    expect(addToCohort(["a"], "  b  ")).toEqual(["a", "b"]);
  });

  it("removeFromCohort filters out matching UUID", () => {
    expect(removeFromCohort(["a", "b", "c"], "b")).toEqual(["a", "c"]);
  });

  it("removeFromCohort is a no-op on missing UUID", () => {
    expect(removeFromCohort(["a", "b"], "z")).toEqual(["a", "b"]);
  });
});

describe("listFeatureFlags", () => {
  it("returns normalized rows", async () => {
    chain._mockListResult = [
      {
        id: "00000000-0000-0000-0000-000000000001",
        flag_key: "abc",
        is_enabled: true,
        description: "desc",
        enabled_user_ids: ["u1"],
        created_at: "2026-01-01T00:00:00Z",
        updated_at: "2026-01-02T00:00:00Z",
      },
    ];
    const rows = await listFeatureFlags();
    expect(rows).toHaveLength(1);
    expect(rows[0].flag_key).toBe("abc");
    expect(rows[0].enabled_user_ids).toEqual(["u1"]);
  });

  it("coerces missing enabled_user_ids to []", async () => {
    chain._mockListResult = [
      {
        id: "00000000-0000-0000-0000-000000000001",
        flag_key: "abc",
        is_enabled: false,
        description: null,
        enabled_user_ids: null,
        created_at: "2026-01-01T00:00:00Z",
        updated_at: "2026-01-02T00:00:00Z",
      },
    ];
    const rows = await listFeatureFlags();
    expect(rows[0].enabled_user_ids).toEqual([]);
  });

  it("throws on supabase error", async () => {
    chain._mockListError = { message: "RLS denied" };
    await expect(listFeatureFlags()).rejects.toEqual({ message: "RLS denied" });
  });
});

describe("updateFeatureFlag", () => {
  it("builds minimal payload from patch", async () => {
    mockSingle.mockResolvedValueOnce({
      data: {
        id: "f1",
        flag_key: "abc",
        is_enabled: true,
        description: "hi",
        enabled_user_ids: [],
        created_at: "2026-01-01T00:00:00Z",
        updated_at: "2026-01-01T00:00:00Z",
      },
      error: null,
    });

    await updateFeatureFlag("f1", { is_enabled: true });

    const payload = mockUpdate.mock.calls[0][0];
    expect(payload).toEqual({ is_enabled: true });
    expect(payload.description).toBeUndefined();
    expect(payload.enabled_user_ids).toBeUndefined();
  });

  it("sends description + cohort when present in patch", async () => {
    mockSingle.mockResolvedValueOnce({
      data: {
        id: "f1",
        flag_key: "abc",
        is_enabled: true,
        description: "new-desc",
        enabled_user_ids: ["u1", "u2"],
        created_at: "2026-01-01T00:00:00Z",
        updated_at: "2026-01-01T00:00:00Z",
      },
      error: null,
    });

    await updateFeatureFlag("f1", {
      description: "new-desc",
      enabled_user_ids: ["u1", "u2"],
    });

    const payload = mockUpdate.mock.calls[0][0];
    expect(payload).toEqual({
      description: "new-desc",
      enabled_user_ids: ["u1", "u2"],
    });
  });

  it("propagates supabase error as thrown", async () => {
    mockSingle.mockResolvedValueOnce({
      data: null,
      error: { message: "permission denied" },
    });
    await expect(
      updateFeatureFlag("f1", { is_enabled: true }),
    ).rejects.toEqual({ message: "permission denied" });
  });
});

describe("lookupProfileByEmail", () => {
  it("rejects obviously invalid email without hitting the DB", async () => {
    const r = await lookupProfileByEmail("not-an-email");
    expect(r).toBeNull();
    expect(mockMaybeSingle).not.toHaveBeenCalled();
  });

  it("returns null for whitespace input", async () => {
    const r = await lookupProfileByEmail("   ");
    expect(r).toBeNull();
  });

  it("lower-cases + trims the email before query", async () => {
    mockMaybeSingle.mockResolvedValueOnce({
      data: {
        id: "00000000-0000-0000-0000-000000000002",
        email: "chau@mercyblade.com",
        username: null,
        display_name: "Chau",
      },
      error: null,
    });

    await lookupProfileByEmail("  Chau@MercyBlade.com  ");

    const [col, val] = mockEq.mock.calls[0];
    expect(col).toBe("email");
    expect(val).toBe("chau@mercyblade.com");
  });

  it("returns null when no profile matches", async () => {
    mockMaybeSingle.mockResolvedValueOnce({ data: null, error: null });
    const r = await lookupProfileByEmail("nobody@example.com");
    expect(r).toBeNull();
  });

  it("returns profile shape on match", async () => {
    mockMaybeSingle.mockResolvedValueOnce({
      data: {
        id: "00000000-0000-0000-0000-000000000002",
        email: "chau@mercyblade.com",
        username: "chau",
        display_name: "Chau",
      },
      error: null,
    });
    const r = await lookupProfileByEmail("chau@mercyblade.com");
    expect(r).toEqual({
      id: "00000000-0000-0000-0000-000000000002",
      email: "chau@mercyblade.com",
      username: "chau",
      display_name: "Chau",
    });
  });

  it("throws on supabase error", async () => {
    mockMaybeSingle.mockResolvedValueOnce({
      data: null,
      error: { message: "permission denied" },
    });
    await expect(lookupProfileByEmail("x@y.com")).rejects.toEqual({
      message: "permission denied",
    });
  });
});
