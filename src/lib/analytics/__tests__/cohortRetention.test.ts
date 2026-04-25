// src/lib/analytics/__tests__/cohortRetention.test.ts
//
// Pure-helper coverage: the network layer is a thin RPC wrapper, so
// the high-value tests sit on `pivotForChart` (data shape) and the
// week-clamping behaviour of `getCohortRetention`.

import { describe, expect, it, vi, beforeEach } from "vitest";

const rpcReturn = {
  data: null as unknown,
  error: null as unknown,
};
const rpcCalls: Array<{ name: string; args: Record<string, unknown> | undefined }> = [];

vi.mock("@/lib/supabaseClient", () => ({
  supabase: {
    rpc: vi.fn(async (name: string, args: Record<string, unknown> | undefined) => {
      rpcCalls.push({ name, args });
      return { data: rpcReturn.data, error: rpcReturn.error };
    }),
  },
}));

import {
  getCohortRetention,
  getCohortStats,
  pivotForChart,
  type CohortRetentionRow,
} from "../cohortRetention";

beforeEach(() => {
  rpcReturn.data = [];
  rpcReturn.error = null;
  rpcCalls.length = 0;
});

describe("pivotForChart", () => {
  const sample: CohortRetentionRow[] = [
    { cohort_week: "2026-04-13", day_offset: 1,  cohort_size: 50, retained_users: 45, retention_pct: 90 },
    { cohort_week: "2026-04-13", day_offset: 7,  cohort_size: 50, retained_users: 30, retention_pct: 60 },
    { cohort_week: "2026-04-13", day_offset: 14, cohort_size: 50, retained_users: 20, retention_pct: 40 },
    { cohort_week: "2026-04-13", day_offset: 30, cohort_size: 50, retained_users: 15, retention_pct: 30 },
    { cohort_week: "2026-04-06", day_offset: 1,  cohort_size: 40, retained_users: 36, retention_pct: 90 },
    { cohort_week: "2026-04-06", day_offset: 7,  cohort_size: 40, retained_users: 24, retention_pct: 60 },
  ];

  it("groups rows by cohort_week with d1/d7/d14/d30 columns", () => {
    const out = pivotForChart(sample);
    expect(out.length).toBe(2);
    expect(out[0]).toEqual({
      cohort_week: "2026-04-13",
      cohort_size: 50,
      d1: 90,
      d7: 60,
      d14: 40,
      d30: 30,
    });
  });

  it("leaves missing day-offsets as null (cohort too new)", () => {
    const out = pivotForChart(sample);
    const apr06 = out.find((c) => c.cohort_week === "2026-04-06");
    expect(apr06?.d14).toBeNull();
    expect(apr06?.d30).toBeNull();
  });

  it("sorts cohorts newest first", () => {
    const out = pivotForChart(sample);
    expect(out[0].cohort_week).toBe("2026-04-13");
    expect(out[1].cohort_week).toBe("2026-04-06");
  });

  it("returns an empty array when given no rows", () => {
    expect(pivotForChart([])).toEqual([]);
  });
});

describe("getCohortRetention RPC contract", () => {
  it("calls analytics_cohort_retention with the requested weeks", async () => {
    rpcReturn.data = [];
    await getCohortRetention(8);
    expect(rpcCalls[0].name).toBe("analytics_cohort_retention");
    expect(rpcCalls[0].args).toEqual({ p_weeks: 8 });
  });

  it("clamps weeks to [1, 52] before sending", async () => {
    rpcReturn.data = [];
    await getCohortRetention(0);
    expect(rpcCalls[0].args?.p_weeks).toBe(12); // default fallback

    rpcCalls.length = 0;
    await getCohortRetention(999);
    expect(rpcCalls[0].args?.p_weeks).toBe(52);
  });

  it("surfaces RPC errors as Result.ok=false", async () => {
    rpcReturn.error = { message: "permission denied", code: "42501" };
    const result = await getCohortRetention(12);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.code).toBe("42501");
    }
  });
});

describe("getCohortStats", () => {
  it("validates the cohortWeek argument", async () => {
    const result = await getCohortStats("");
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe("VALIDATION");
  });

  it("filters and orders the rows for the requested cohort", async () => {
    rpcReturn.data = [
      { cohort_week: "2026-04-13", day_offset: 14, cohort_size: 50, retained_users: 20, retention_pct: 40 },
      { cohort_week: "2026-04-13", day_offset: 1,  cohort_size: 50, retained_users: 45, retention_pct: 90 },
      { cohort_week: "2026-04-06", day_offset: 1,  cohort_size: 40, retained_users: 36, retention_pct: 90 },
    ];
    const result = await getCohortStats("2026-04-13");
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.map((r) => r.day_offset)).toEqual([1, 14]);
    }
  });
});
