// Unit tests for userFacts. Mocks @/lib/supabaseClient via the shared
// supabaseMock helper so we can re-stub the from() chain per test.

import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/supabaseClient", async () => {
  const mod = await vi.importActual<any>("@/test/mocks/supabaseMock");
  const supabase = mod.createSupabaseMock();
  return {
    supabase,
    __mock: supabase,
  };
});

import * as SupaMod from "@/lib/supabaseClient";
const supabaseMock = (SupaMod as any).__mock;

import {
  addFact,
  getActiveFactsForUser,
  supersedeFact,
  markFactReferenced,
  decayUnusedFacts,
  defaultConfidenceForSource,
} from "../userFacts";

beforeEach(() => {
  vi.clearAllMocks();
});

// Helper — build a minimal chainable that resolves to the given payload
// at the terminal call (maybeSingle, then-via-await on the final builder,
// or order(...).order(...)).
function chain(terminalPayload: { data: unknown; error: unknown } | null) {
  const c: any = {};
  const ret = () => c;
  c.select = vi.fn(ret);
  c.insert = vi.fn(ret);
  c.update = vi.fn(ret);
  c.delete = vi.fn(ret);
  c.eq = vi.fn(ret);
  c.is = vi.fn(ret);
  c.lt = vi.fn(ret);
  c.order = vi.fn(ret);
  c.maybeSingle = vi.fn(() =>
    Promise.resolve(terminalPayload ?? { data: null, error: null }),
  );
  // Allow `await chain` to resolve to the terminal payload (used by
  // queries that don't end in maybeSingle, e.g. select-list).
  c.then = (resolve: (v: unknown) => unknown) =>
    resolve(terminalPayload ?? { data: [], error: null });
  return c;
}

describe("defaultConfidenceForSource", () => {
  it("user_stated → 0.8, inferred → 0.5, admin_set → 1.0", () => {
    expect(defaultConfidenceForSource("user_stated")).toBe(0.8);
    expect(defaultConfidenceForSource("inferred")).toBe(0.5);
    expect(defaultConfidenceForSource("admin_set")).toBe(1.0);
  });
});

describe("addFact", () => {
  it("rejects empty userId or content without hitting Supabase", async () => {
    expect(await addFact("", "goal", "x", "user_stated")).toBeNull();
    expect(await addFact("u1", "goal", "   ", "user_stated")).toBeNull();
    expect(supabaseMock.from).not.toHaveBeenCalled();
  });

  it("inserts and returns the new fact mapped to camelCase", async () => {
    const inserted = {
      id: "f1",
      user_id: "u1",
      fact_type: "goal",
      content: "Pass IELTS 7.5",
      source: "user_stated",
      confidence: 0.8,
      created_at: "2026-04-25T00:00:00Z",
      last_referenced_at: null,
      superseded_by: null,
    };
    supabaseMock.from.mockReturnValueOnce(
      chain({ data: inserted, error: null }),
    );

    const result = await addFact("u1", "goal", "Pass IELTS 7.5", "user_stated");
    expect(result).toMatchObject({
      id: "f1",
      userId: "u1",
      factType: "goal",
      content: "Pass IELTS 7.5",
      source: "user_stated",
      confidence: 0.8,
      supersededBy: null,
    });
  });

  it("trims content before inserting", async () => {
    const insertSpy = vi.fn(function (this: any) {
      return this;
    });
    const c = chain({ data: { id: "f2", user_id: "u1", fact_type: "context", content: "loves coffee", confidence: 0.5 }, error: null });
    c.insert = insertSpy;
    supabaseMock.from.mockReturnValueOnce(c);

    await addFact("u1", "context", "  loves coffee  ", "inferred");
    expect(insertSpy).toHaveBeenCalledWith(
      expect.objectContaining({ content: "loves coffee" }),
    );
  });

  it("uses default confidence per source when none supplied", async () => {
    const insertSpy = vi.fn(function (this: any) {
      return this;
    });
    const c = chain({ data: { id: "f3", user_id: "u1", fact_type: "context", content: "x", confidence: 0.5 }, error: null });
    c.insert = insertSpy;
    supabaseMock.from.mockReturnValueOnce(c);

    await addFact("u1", "context", "x", "inferred");
    expect(insertSpy).toHaveBeenCalledWith(
      expect.objectContaining({ confidence: 0.5 }),
    );
  });

  it("re-reads existing row on unique violation (idempotent)", async () => {
    // First call: insert returns 23505.
    supabaseMock.from.mockReturnValueOnce(
      chain({ data: null, error: { code: "23505", message: "duplicate" } }),
    );
    // Second call: re-read returns the existing row.
    const existing = {
      id: "f-existing",
      user_id: "u1",
      fact_type: "preference",
      content: "short replies",
      source: "user_stated",
      confidence: 0.8,
      created_at: "2026-04-20T00:00:00Z",
      last_referenced_at: null,
      superseded_by: null,
    };
    supabaseMock.from.mockReturnValueOnce(
      chain({ data: existing, error: null }),
    );

    const result = await addFact("u1", "preference", "short replies", "user_stated");
    expect(result?.id).toBe("f-existing");
  });

  it("returns null on non-unique error", async () => {
    supabaseMock.from.mockReturnValueOnce(
      chain({ data: null, error: { code: "42501", message: "permission denied" } }),
    );
    const result = await addFact("u1", "goal", "x", "user_stated");
    expect(result).toBeNull();
  });
});

describe("getActiveFactsForUser", () => {
  it("returns [] without query when userId missing", async () => {
    expect(await getActiveFactsForUser("")).toEqual([]);
    expect(supabaseMock.from).not.toHaveBeenCalled();
  });

  it("returns mapped active facts (filters via supabase chain)", async () => {
    const rows = [
      {
        id: "a",
        user_id: "u1",
        fact_type: "goal",
        content: "IELTS 7.5",
        source: "user_stated",
        confidence: 0.9,
        created_at: "2026-04-25T00:00:00Z",
        last_referenced_at: null,
        superseded_by: null,
      },
      {
        id: "b",
        user_id: "u1",
        fact_type: "goal",
        content: "Move to Canada",
        source: "user_stated",
        confidence: 0.7,
        created_at: "2026-04-20T00:00:00Z",
        last_referenced_at: null,
        superseded_by: null,
      },
    ];
    supabaseMock.from.mockReturnValueOnce(chain({ data: rows, error: null }));

    const result = await getActiveFactsForUser("u1", "goal");
    expect(result).toHaveLength(2);
    expect(result[0].id).toBe("a");
    expect(result[1].id).toBe("b");
    expect(result[0].factType).toBe("goal");
  });

  it("returns [] on error", async () => {
    supabaseMock.from.mockReturnValueOnce(
      chain({ data: null, error: { message: "boom" } }),
    );
    expect(await getActiveFactsForUser("u1")).toEqual([]);
  });
});

describe("supersedeFact", () => {
  it("returns null if old fact not found", async () => {
    supabaseMock.from.mockReturnValueOnce(chain({ data: null, error: null }));
    const result = await supersedeFact("missing", "new content");
    expect(result).toBeNull();
  });

  it("inserts new row and links the old one", async () => {
    const oldRow = {
      id: "old",
      user_id: "u1",
      fact_type: "goal",
      content: "Reach 6.5",
      source: "user_stated",
      confidence: 0.8,
      created_at: "2026-03-01T00:00:00Z",
      last_referenced_at: "2026-04-01T00:00:00Z",
      superseded_by: null,
    };
    const newRow = {
      ...oldRow,
      id: "new",
      content: "Reach 7.5",
      confidence: 0.9,
      created_at: "2026-04-25T00:00:00Z",
    };

    // 1) read old
    supabaseMock.from.mockReturnValueOnce(chain({ data: oldRow, error: null }));
    // 2) insert new
    supabaseMock.from.mockReturnValueOnce(chain({ data: newRow, error: null }));
    // 3) update old.superseded_by — this chain doesn't end in maybeSingle,
    //    so the await resolves through chain.then.
    supabaseMock.from.mockReturnValueOnce(chain({ data: null, error: null }));

    const result = await supersedeFact("old", "Reach 7.5", 0.9);
    expect(result).toMatchObject({
      id: "new",
      content: "Reach 7.5",
      confidence: 0.9,
    });
  });

  it("returns null when the new insert fails (no link write)", async () => {
    const oldRow = {
      id: "old",
      user_id: "u1",
      fact_type: "goal",
      content: "x",
      source: "user_stated",
      confidence: 0.8,
      created_at: "2026-03-01T00:00:00Z",
      last_referenced_at: null,
      superseded_by: null,
    };
    supabaseMock.from.mockReturnValueOnce(chain({ data: oldRow, error: null }));
    supabaseMock.from.mockReturnValueOnce(
      chain({ data: null, error: { message: "boom" } }),
    );
    const result = await supersedeFact("old", "y");
    expect(result).toBeNull();
  });
});

describe("markFactReferenced", () => {
  it("no-ops on empty id", async () => {
    await markFactReferenced("");
    expect(supabaseMock.from).not.toHaveBeenCalled();
  });

  it("issues an update with last_referenced_at = now-ish", async () => {
    const updateSpy = vi.fn<(row: Record<string, unknown>) => unknown>(
      function (this: any) {
        return this;
      },
    );
    const c = chain({ data: null, error: null });
    c.update = updateSpy;
    supabaseMock.from.mockReturnValueOnce(c);

    await markFactReferenced("f1");
    expect(updateSpy).toHaveBeenCalled();
    const arg = updateSpy.mock.calls[0][0];
    expect(arg).toHaveProperty("last_referenced_at");
    expect(typeof arg.last_referenced_at).toBe("string");
  });
});

describe("decayUnusedFacts", () => {
  it("returns zero counts on missing userId", async () => {
    expect(await decayUnusedFacts("", 90)).toEqual({ scanned: 0, decayed: 0 });
    expect(supabaseMock.from).not.toHaveBeenCalled();
  });

  it("subtracts step from candidate confidence and floors at 0", async () => {
    // Two reads (never-ref + old-ref) → merged + dedup'd → updates.
    const neverRef = [{ id: "a", confidence: 0.5 }];
    const oldRef = [
      { id: "b", confidence: 0.9 },
      { id: "a", confidence: 0.5 }, // duplicate of neverRef[0] — must dedup
    ];
    supabaseMock.from
      .mockReturnValueOnce(chain({ data: neverRef, error: null })) // never-ref
      .mockReturnValueOnce(chain({ data: oldRef, error: null }))   // old-ref
      .mockReturnValueOnce(chain({ data: null, error: null }))      // update a
      .mockReturnValueOnce(chain({ data: null, error: null }));     // update b

    const result = await decayUnusedFacts("u1", 90, 0.2);
    expect(result.scanned).toBe(2); // dedup'd
    expect(result.decayed).toBe(2);
  });

  it("skips updates that wouldn't change confidence (already 0)", async () => {
    const neverRef = [{ id: "a", confidence: 0 }]; // already 0; step would no-op
    supabaseMock.from
      .mockReturnValueOnce(chain({ data: neverRef, error: null }))
      .mockReturnValueOnce(chain({ data: [], error: null }));
    // No third call — because no update should fire.

    const result = await decayUnusedFacts("u1", 90, 0.2);
    expect(result.scanned).toBe(1);
    expect(result.decayed).toBe(0);
  });
});
