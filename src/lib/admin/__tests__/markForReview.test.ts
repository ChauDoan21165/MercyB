// Unit tests for markContentForReview / bulkMarkForReview.
// Mocks the supabase client with a chained-builder pattern that mirrors
// the actual call shape: from(...).select(...).eq(...).eq(...).maybeSingle()
// and from(...).upsert(..., {...}).

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { bulkMarkForReview, markContentForReview } from "../markForReview";

const fromMock = vi.fn();

vi.mock("@/lib/supabaseClient", () => ({
  supabase: {
    from: (...args: unknown[]) => fromMock(...args),
  },
}));

interface ExistingRow {
  status: string | null;
}

function buildSelectBuilder(existing: ExistingRow | null) {
  const maybeSingle = vi.fn().mockResolvedValue({ data: existing, error: null });
  const eq2 = vi.fn().mockReturnValue({ maybeSingle });
  const eq1 = vi.fn().mockReturnValue({ eq: eq2 });
  const select = vi.fn().mockReturnValue({ eq: eq1 });
  return { select, eq1, eq2, maybeSingle };
}

function buildUpsertBuilder({ error = null }: { error?: { message: string } | null } = {}) {
  const upsert = vi.fn().mockResolvedValue({ data: null, error });
  return { upsert };
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(console, "warn").mockImplementation(() => {});
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("markContentForReview", () => {
  it("rejects empty inputs", async () => {
    const r = await markContentForReview("vstep", "");
    expect(r.ok).toBe(false);
  });

  it("inserts with correct fields when no row exists", async () => {
    const selectBuilder = buildSelectBuilder(null);
    const upsertBuilder = buildUpsertBuilder();

    let call = 0;
    fromMock.mockImplementation(() => {
      call++;
      // Two from() calls: one for SELECT, one for UPSERT.
      return call === 1 ? selectBuilder : upsertBuilder;
    });

    const r = await markContentForReview("ielts", "ielts_speaking_part1_hometown");
    expect(r.ok).toBe(true);
    expect(upsertBuilder.upsert).toHaveBeenCalledTimes(1);
    const args = upsertBuilder.upsert.mock.calls[0];
    expect(args[0]).toMatchObject({
      content_id: "ielts_speaking_part1_hometown",
      content_type: "ielts",
      status: "in_review",
    });
    expect(typeof args[0].marked_for_review_at).toBe("string");
    expect(args[1]).toEqual({ onConflict: "content_id,content_type" });
  });

  it("is a no-op when row is already in_review (idempotent)", async () => {
    const selectBuilder = buildSelectBuilder({ status: "in_review" });
    const upsertBuilder = buildUpsertBuilder();
    fromMock.mockImplementation(() => selectBuilder);

    const r = await markContentForReview("toeic", "toeic_section_1_item_1");
    expect(r.ok).toBe(true);
    expect(upsertBuilder.upsert).not.toHaveBeenCalled();
  });

  it("re-marks when previous status was approved", async () => {
    const selectBuilder = buildSelectBuilder({ status: "approved" });
    const upsertBuilder = buildUpsertBuilder();
    let call = 0;
    fromMock.mockImplementation(() => {
      call++;
      return call === 1 ? selectBuilder : upsertBuilder;
    });

    const r = await markContentForReview("vstep", "vstep_speaking_topic_1");
    expect(r.ok).toBe(true);
    expect(upsertBuilder.upsert).toHaveBeenCalledTimes(1);
  });

  it("returns ok:false on supabase upsert error", async () => {
    const selectBuilder = buildSelectBuilder(null);
    const upsertBuilder = buildUpsertBuilder({ error: { message: "RLS denied" } });
    let call = 0;
    fromMock.mockImplementation(() => {
      call++;
      return call === 1 ? selectBuilder : upsertBuilder;
    });

    const r = await markContentForReview("ielts", "x_y");
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.reason).toBe("RLS denied");
    }
  });
});

describe("bulkMarkForReview", () => {
  it("returns the correct marked vs skipped count for mixed inputs", async () => {
    // Sequence per ID:
    //   "new" → bulk pre-check select(null) → markForReview select(null)
    //           → upsert ok
    //   "exists" → bulk pre-check select({status:'in_review'})
    //
    // We use a queue of expected return values keyed on which call number
    // we're at.
    const ids = ["new-1", "exists-2", "new-3"];

    // Build per-call builders. Track call sequence.
    const queue: Array<() => unknown> = [
      () => buildSelectBuilder(null),                     // new-1 pre-check
      () => buildSelectBuilder(null),                     // new-1 mark internal select
      () => buildUpsertBuilder(),                         // new-1 upsert
      () => buildSelectBuilder({ status: "in_review" }),  // exists-2 pre-check (skipped)
      () => buildSelectBuilder(null),                     // new-3 pre-check
      () => buildSelectBuilder(null),                     // new-3 mark internal select
      () => buildUpsertBuilder(),                         // new-3 upsert
    ];

    let idx = 0;
    fromMock.mockImplementation(() => {
      const builderFactory = queue[idx];
      if (!builderFactory) {
        throw new Error(`unexpected from() call #${idx}`);
      }
      idx++;
      return builderFactory();
    });

    const result = await bulkMarkForReview("ielts", ids);
    expect(result.marked).toBe(2);
    expect(result.skipped).toBe(1);
  });
});
