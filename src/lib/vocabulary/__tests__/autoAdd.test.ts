import { beforeEach, describe, expect, it, vi } from "vitest";

// ── Mocks ──────────────────────────────────────────────────────────────

const supabaseFromMock = vi.fn();
vi.mock("@/lib/supabaseClient", () => ({
  supabase: {
    from: (...args: unknown[]) => supabaseFromMock(...args),
  },
}));

import { ensureVocabulary } from "../autoAdd";

type Resolved<T> = Promise<T>;

// Builds a chainable supabase query stub. The same chain is used for
// both `.select(...).eq(...).eq(...).maybeSingle()` (pre-check) and
// `.insert(...).select(...).single()` (insert).
function buildChain({
  selectResult,
  insertResult,
}: {
  selectResult: Resolved<{ data: any; error: any }>;
  insertResult: Resolved<{ data: any; error: any }>;
}) {
  const chain: Record<string, any> = {};
  chain.select = vi.fn(() => chain);
  chain.eq = vi.fn(() => chain);
  chain.maybeSingle = vi.fn(() => selectResult);
  chain.insert = vi.fn(() => ({
    select: () => ({ single: () => insertResult }),
  }));
  return chain;
}

beforeEach(() => {
  supabaseFromMock.mockReset();
});

// ── Tests ──────────────────────────────────────────────────────────────

describe("ensureVocabulary", () => {
  it("returns added=false with reason 'empty_word' when word is blank", async () => {
    const result = await ensureVocabulary({ user_id: "u1", word: "  " });
    expect(result).toEqual({ ok: true, added: false, reason: "empty_word" });
    expect(supabaseFromMock).not.toHaveBeenCalled();
  });

  it("returns added=false with reason 'anon' when user_id is empty", async () => {
    const result = await ensureVocabulary({ user_id: "", word: "hello" });
    expect(result).toEqual({ ok: true, added: false, reason: "anon" });
    expect(supabaseFromMock).not.toHaveBeenCalled();
  });

  it("inserts a new row and returns added=true with the new id", async () => {
    const chain = buildChain({
      selectResult: Promise.resolve({ data: null, error: null }),
      insertResult: Promise.resolve({ data: { id: "vocab-1" }, error: null }),
    });
    supabaseFromMock.mockReturnValue(chain);

    const result = await ensureVocabulary({
      user_id: "u1",
      word: "ephemeral",
      ipa: "/ɪˈfemərəl/",
      definition_vi: "phù du",
      source: "ielts:reading:passage_1",
    });

    expect(result).toEqual({ ok: true, added: true, id: "vocab-1" });
    expect(chain.insert).toHaveBeenCalledTimes(1);
  });

  it("is idempotent: returns added=false when the row already exists", async () => {
    const chain = buildChain({
      selectResult: Promise.resolve({ data: { id: "vocab-existing" }, error: null }),
      // Insert path should not be reached, but stub it anyway so the
      // chain object is fully formed.
      insertResult: Promise.resolve({ data: null, error: null }),
    });
    supabaseFromMock.mockReturnValue(chain);

    const result = await ensureVocabulary({
      user_id: "u1",
      word: "ephemeral",
    });

    expect(result).toEqual({ ok: true, added: false, reason: "already_exists" });
    expect(chain.insert).not.toHaveBeenCalled();
  });

  it("treats a 23505 unique-violation race as 'already_exists'", async () => {
    const chain = buildChain({
      selectResult: Promise.resolve({ data: null, error: null }),
      insertResult: Promise.resolve({
        data: null,
        error: { code: "23505", message: "duplicate key" },
      }),
    });
    supabaseFromMock.mockReturnValue(chain);

    const result = await ensureVocabulary({ user_id: "u1", word: "race" });
    expect(result).toEqual({ ok: true, added: false, reason: "already_exists" });
  });

  it("returns ok=false on a non-uniqueness insert error", async () => {
    const chain = buildChain({
      selectResult: Promise.resolve({ data: null, error: null }),
      insertResult: Promise.resolve({
        data: null,
        error: { code: "42501", message: "RLS denied" },
      }),
    });
    supabaseFromMock.mockReturnValue(chain);

    const result = await ensureVocabulary({ user_id: "u1", word: "rls" });
    expect(result).toEqual({ ok: false, error: "RLS denied" });
  });

  it("returns ok=false when the pre-check select errors", async () => {
    const chain = buildChain({
      selectResult: Promise.resolve({
        data: null,
        error: { message: "network fail" },
      }),
      insertResult: Promise.resolve({ data: null, error: null }),
    });
    supabaseFromMock.mockReturnValue(chain);

    const result = await ensureVocabulary({ user_id: "u1", word: "down" });
    expect(result).toEqual({ ok: false, error: "network fail" });
    expect(chain.insert).not.toHaveBeenCalled();
  });

  it("trims surrounding whitespace from the word before persisting", async () => {
    const chain = buildChain({
      selectResult: Promise.resolve({ data: null, error: null }),
      insertResult: Promise.resolve({ data: { id: "v1" }, error: null }),
    });
    supabaseFromMock.mockReturnValue(chain);

    await ensureVocabulary({ user_id: "u1", word: "  trimmed  " });
    const passedWord = (chain.eq as any).mock.calls.find(
      (c: any[]) => c[0] === "word",
    )?.[1];
    expect(passedWord).toBe("trimmed");
  });
});
