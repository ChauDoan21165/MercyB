// src/lib/xp/__tests__/dailyChallenge.test.ts
//
// Unit tests for the daily challenge generator + completion flow.
// Pure pickers are tested directly; the I/O paths are tested by
// patching the supabase mock chain to return canned rows.

import { describe, it, expect, vi, beforeEach } from "vitest";
import type { createSupabaseMock } from "@/test/mocks/supabaseMock";

type SupabaseMock = ReturnType<typeof createSupabaseMock>;

vi.mock("@/lib/supabaseClient", async () => {
  const mod = await vi.importActual<typeof import("@/test/mocks/supabaseMock")>("@/test/mocks/supabaseMock");
  const supabase = mod.createSupabaseMock();
  return { supabase, __mock: supabase };
});

import * as SupaMod from "@/lib/supabaseClient";
const supabaseMock = (SupaMod as typeof SupaMod & { __mock: SupabaseMock }).__mock;

import {
  pickChallenge,
  dateSeed,
  xpForKind,
  generateDaily,
  completeDaily,
} from "../dailyChallenge";
import type { DailyChallengeRow } from "../dailyChallenge";

type MaybeDailyChallengeRow = DailyChallengeRow | null;

describe("xpForKind", () => {
  it("matches the documented XP table", () => {
    expect(xpForKind("sentence")).toBe(10);
    expect(xpForKind("rule")).toBe(15);
    expect(xpForKind("pronunciation")).toBe(15);
    expect(xpForKind("mixed")).toBe(20);
  });
});

describe("dateSeed", () => {
  it("is deterministic for the same date", () => {
    expect(dateSeed("2026-04-22")).toBe(dateSeed("2026-04-22"));
  });

  it("differs across different dates", () => {
    expect(dateSeed("2026-04-22")).not.toBe(dateSeed("2026-04-23"));
  });

  it("returns a non-negative integer", () => {
    const v = dateSeed("2026-04-22");
    expect(Number.isInteger(v)).toBe(true);
    expect(v).toBeGreaterThanOrEqual(0);
  });
});

describe("pickChallenge", () => {
  it("picks 'rule' when the user has any L1 grammar tag", () => {
    const out = pickChallenge(["vi_l1_3rd_person_s"], "2026-04-22");
    expect(out.kind).toBe("rule");
    expect(out.sourceTag).toBe("vi_l1_3rd_person_s");
    expect(out.prompt_vi).toContain("vi_l1_3rd_person_s");
  });

  it("uses the FIRST grammar tag when multiple are present", () => {
    const out = pickChallenge(
      ["vi_l1_past_ed", "vi_l1_plural_s"],
      "2026-04-22",
    );
    expect(out.sourceTag).toBe("vi_l1_past_ed");
  });

  it("ignores non-grammar tags when picking 'rule'", () => {
    const out = pickChallenge(["pronunciation_th"], "2026-04-22");
    expect(out.kind).not.toBe("rule");
  });

  it("returns one of the four kinds with no signal", () => {
    const out = pickChallenge([], "2026-04-22");
    expect(["sentence", "pronunciation", "mixed"]).toContain(out.kind);
  });

  it("is deterministic for the same (tags, date)", () => {
    const a = pickChallenge([], "2026-04-22");
    const b = pickChallenge([], "2026-04-22");
    expect(a).toEqual(b);
  });

  it("always emits a Vietnamese prompt", () => {
    const out = pickChallenge([], "2026-04-22");
    expect(out.prompt_vi.length).toBeGreaterThan(0);
  });
});

describe("generateDaily", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  function mockDailyChallengesRead(row: MaybeDailyChallengeRow) {
    const maybeSingle = vi.fn().mockResolvedValue({ data: row, error: null });
    const eqDate = vi.fn(() => ({ maybeSingle }));
    const eqUser = vi.fn(() => ({ eq: eqDate }));
    const select = vi.fn(() => ({ eq: eqUser }));
    return { select, eqUser, eqDate, maybeSingle };
  }

  function mockProfileRead(weaknesses: string[]) {
    const maybeSingle = vi.fn().mockResolvedValue({
      data: { placement_weaknesses: weaknesses },
      error: null,
    });
    const eq = vi.fn(() => ({ maybeSingle }));
    const select = vi.fn(() => ({ eq }));
    return { select };
  }

  function mockDailyChallengesInsert(row: DailyChallengeRow) {
    const single = vi.fn().mockResolvedValue({ data: row, error: null });
    const select = vi.fn(() => ({ single }));
    const insert = vi.fn(() => ({ select }));
    return { insert, single };
  }

  it("returns the existing row when one already exists for the date", async () => {
    const existing = {
      id: "row-1",
      user_id: "u1",
      date: "2026-04-22",
      challenge_kind: "sentence",
      challenge_payload: { kind: "sentence", prompt_vi: "x" },
      completed: false,
      completed_at: null,
      xp_awarded: 0,
    };

    const dc = mockDailyChallengesRead(existing);
    supabaseMock.from.mockImplementationOnce(() => ({ select: dc.select }));

    const result = await generateDaily("u1", "2026-04-22");
    expect(result?.id).toBe("row-1");
    expect(supabaseMock.from).toHaveBeenCalledWith("daily_challenges");
    expect(supabaseMock.from).toHaveBeenCalledTimes(1); // no profile read
  });

  it("generates + inserts a new row when none exists", async () => {
    // 1. read daily_challenges → null
    const dcRead = mockDailyChallengesRead(null);
    // 2. read profiles → grammar tag, drives 'rule'
    const profile = mockProfileRead(["vi_l1_past_ed"]);
    // 3. insert daily_challenges → returns inserted row
    const insertedRow = {
      id: "row-2",
      user_id: "u1",
      date: "2026-04-22",
      challenge_kind: "rule",
      challenge_payload: {
        kind: "rule",
        sourceTag: "vi_l1_past_ed",
        prompt_vi: "x",
      },
      completed: false,
      completed_at: null,
      xp_awarded: 0,
    };
    const dcInsert = mockDailyChallengesInsert(insertedRow);

    supabaseMock.from
      .mockImplementationOnce(() => ({ select: dcRead.select }))
      .mockImplementationOnce(() => ({ select: profile.select }))
      .mockImplementationOnce(() => ({ insert: dcInsert.insert }));

    const result = await generateDaily("u1", "2026-04-22");
    expect(result?.id).toBe("row-2");
    expect(result?.challenge_kind).toBe("rule");
    expect(dcInsert.insert).toHaveBeenCalledWith(
      expect.objectContaining({
        user_id: "u1",
        date: "2026-04-22",
        challenge_kind: "rule",
      }),
    );
  });
});

describe("completeDaily", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  function mockReadRow(row: MaybeDailyChallengeRow) {
    const maybeSingle = vi.fn().mockResolvedValue({ data: row, error: null });
    const eqDate = vi.fn(() => ({ maybeSingle }));
    const eqUser = vi.fn(() => ({ eq: eqDate }));
    const select = vi.fn(() => ({ eq: eqUser }));
    return { select };
  }

  function mockUpdateRow(row: DailyChallengeRow) {
    const single = vi.fn().mockResolvedValue({ data: row, error: null });
    const select = vi.fn(() => ({ single }));
    const eqDate = vi.fn(() => ({ select }));
    const eqUser = vi.fn(() => ({ eq: eqDate }));
    const update = vi.fn(() => ({ eq: eqUser }));
    return { update, eqUser, eqDate, select, single };
  }

  it("returns ok:false when no challenge exists for the date", async () => {
    const r = mockReadRow(null);
    supabaseMock.from.mockImplementationOnce(() => ({ select: r.select }));

    const result = await completeDaily("u1", "2026-04-22");
    expect(result.ok).toBe(false);
  });

  it("is idempotent on an already-completed row", async () => {
    const completedRow = {
      id: "row-3",
      user_id: "u1",
      date: "2026-04-22",
      challenge_kind: "sentence",
      challenge_payload: { kind: "sentence", prompt_vi: "x" },
      completed: true,
      completed_at: "2026-04-22T08:00:00Z",
      xp_awarded: 10,
    };
    const r = mockReadRow(completedRow);
    supabaseMock.from.mockImplementationOnce(() => ({ select: r.select }));

    const result = await completeDaily("u1", "2026-04-22");
    expect(result).toEqual({ ok: true, xpAwarded: 10, xpTotal: 0 });
  });

  it("flips the row, awards XP, and returns the new total", async () => {
    const pendingRow = {
      id: "row-4",
      user_id: "u1",
      date: "2026-04-22",
      challenge_kind: "rule",
      challenge_payload: { kind: "rule", prompt_vi: "x" },
      completed: false,
      completed_at: null,
      xp_awarded: 0,
    };
    const updatedRow = { ...pendingRow, completed: true, xp_awarded: 15 };

    const r = mockReadRow(pendingRow);
    const u = mockUpdateRow(updatedRow);

    supabaseMock.from
      .mockImplementationOnce(() => ({ select: r.select })) // load
      .mockImplementationOnce(() => ({ update: u.update })); // update

    supabaseMock.rpc.mockResolvedValueOnce({ data: 100, error: null });

    const result = await completeDaily("u1", "2026-04-22");
    expect(result).toEqual({ ok: true, xpAwarded: 15, xpTotal: 100 });
    expect(supabaseMock.rpc).toHaveBeenCalledWith("increment_user_xp", {
      p_points: 15,
    });
  });
});
