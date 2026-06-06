// src/lib/analytics/__tests__/cohortRetention.bucketing.test.ts
//
// The retention scoreboard's client-side bucketing (pivotForChart) is the
// last transform before the D1/D7/D14/D30 numbers hit the chart. These
// edges are the ones that silently corrupt a scoreboard:
//
//   - a genuine 0% must render as 0, never collapse to "no data" (null);
//   - day-offsets outside the canonical {1,7,14,30} must be dropped, not
//     mis-bucketed;
//   - cohorts must bucket independently;
//   - missing offsets stay null so the chart can gap them.

import { describe, it, expect, vi } from "vitest";

// pivotForChart is pure, but the module pulls the supabase singleton at
// import time — keep it inert.
vi.mock("@/lib/supabaseClient", () => ({ supabase: { rpc: vi.fn() } }));

import { pivotForChart, type CohortRetentionRow } from "../cohortRetention";

const row = (
  cohort_week: string,
  day_offset: number,
  retention_pct: number,
  cohort_size = 50,
): CohortRetentionRow => ({
  cohort_week,
  day_offset,
  cohort_size,
  retained_users: Math.round((retention_pct / 100) * cohort_size),
  retention_pct,
});

describe("pivotForChart — scoreboard bucketing edges", () => {
  it("preserves a genuine 0% as 0, not null", () => {
    const out = pivotForChart([row("2026-05-04", 1, 0), row("2026-05-04", 7, 0)]);
    expect(out[0].d1).toBe(0);
    expect(out[0].d7).toBe(0);
    // untouched offsets remain null (no data), distinct from a real 0
    expect(out[0].d14).toBeNull();
    expect(out[0].d30).toBeNull();
  });

  it("drops non-canonical day-offsets instead of mis-bucketing them", () => {
    const out = pivotForChart([
      row("2026-05-04", 1, 90),
      row("2026-05-04", 3, 70), // not a column
      row("2026-05-04", 60, 10), // not a column
      row("2026-05-04", 30, 25),
    ]);
    expect(out[0]).toEqual({
      cohort_week: "2026-05-04",
      cohort_size: 50,
      d1: 90,
      d7: null,
      d14: null,
      d30: 25,
    });
  });

  it("buckets each cohort independently", () => {
    const out = pivotForChart([
      row("2026-05-04", 1, 90),
      row("2026-04-27", 1, 80),
      row("2026-05-04", 7, 50),
      row("2026-04-27", 30, 12),
    ]);
    const may04 = out.find((c) => c.cohort_week === "2026-05-04");
    const apr27 = out.find((c) => c.cohort_week === "2026-04-27");
    expect(may04).toMatchObject({ d1: 90, d7: 50, d14: null, d30: null });
    expect(apr27).toMatchObject({ d1: 80, d7: null, d14: null, d30: 12 });
  });

  it("takes cohort_size from the first row seen for a cohort", () => {
    const out = pivotForChart([
      row("2026-05-04", 1, 90, 50),
      row("2026-05-04", 7, 50, 999), // size on later rows is ignored
    ]);
    expect(out[0].cohort_size).toBe(50);
  });

  it("last write wins on a duplicated offset", () => {
    const out = pivotForChart([row("2026-05-04", 1, 90), row("2026-05-04", 1, 42)]);
    expect(out[0].d1).toBe(42);
  });
});
