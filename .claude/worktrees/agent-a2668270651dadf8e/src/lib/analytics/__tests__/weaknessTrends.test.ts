// src/lib/analytics/__tests__/weaknessTrends.test.ts

import { describe, expect, it, vi } from "vitest";

// Importing weaknessTrends.ts pulls in @/lib/supabaseClient at module
// init, which would throw without VITE_SUPABASE_URL in this worktree.
// We don't exercise the network helpers here — only the pure summary
// helpers — so a no-op stub is enough.
vi.mock("@/lib/supabaseClient", () => ({
  supabase: {
    rpc: vi.fn(async () => ({ data: [], error: null })),
  },
}));

import {
  summariseWeaknessTrends,
  topImprovingWeaknesses,
  topWorseningWeaknesses,
  type WeaknessTrendRow,
} from "../weaknessTrends";

const ROWS: WeaknessTrendRow[] = [
  // most recent first per RPC contract
  { week_start: "2026-04-13", weakness_tag: "past_ed",       total_occurrences: 30, unique_users: 20 },
  { week_start: "2026-04-06", weakness_tag: "past_ed",       total_occurrences: 50, unique_users: 30 },
  { week_start: "2026-04-13", weakness_tag: "third_person_s", total_occurrences: 60, unique_users: 35 },
  { week_start: "2026-04-06", weakness_tag: "third_person_s", total_occurrences: 40, unique_users: 25 },
  { week_start: "2026-04-13", weakness_tag: "new_pattern",   total_occurrences: 5,  unique_users: 4 },
];

describe("summariseWeaknessTrends", () => {
  it("computes delta vs previous week per tag", () => {
    const out = summariseWeaknessTrends(ROWS);
    const past_ed = out.find((s) => s.weakness_tag === "past_ed");
    expect(past_ed?.delta_vs_prev_week).toBe(-20); // 30 - 50
    const tps = out.find((s) => s.weakness_tag === "third_person_s");
    expect(tps?.delta_vs_prev_week).toBe(20); // 60 - 40
  });

  it("returns delta 0 (or latest count) for tags seen only one week", () => {
    const out = summariseWeaknessTrends(ROWS);
    const np = out.find((s) => s.weakness_tag === "new_pattern");
    // Only one week of data → delta = latest - 0 = 5.
    expect(np?.delta_vs_prev_week).toBe(5);
    expect(np?.total_weeks_seen).toBe(1);
  });

  it("returns an empty list for empty input", () => {
    expect(summariseWeaknessTrends([])).toEqual([]);
  });
});

describe("topImprovingWeaknesses", () => {
  it("includes only tags with negative delta and >= 2 weeks of data", () => {
    const out = topImprovingWeaknesses(ROWS);
    expect(out.map((s) => s.weakness_tag)).toEqual(["past_ed"]);
  });

  it("respects the limit", () => {
    const many: WeaknessTrendRow[] = [];
    for (let i = 0; i < 8; i++) {
      many.push(
        { week_start: "2026-04-13", weakness_tag: `t${i}`, total_occurrences: 1, unique_users: 1 },
        { week_start: "2026-04-06", weakness_tag: `t${i}`, total_occurrences: 10, unique_users: 5 },
      );
    }
    const out = topImprovingWeaknesses(many, 3);
    expect(out.length).toBe(3);
  });
});

describe("topWorseningWeaknesses", () => {
  it("includes only tags with positive delta and >= 2 weeks of data", () => {
    const out = topWorseningWeaknesses(ROWS);
    expect(out.map((s) => s.weakness_tag)).toEqual(["third_person_s"]);
  });
});
