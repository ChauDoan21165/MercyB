// src/lib/analytics/__tests__/dataMoatReport.test.ts

import { describe, expect, it, vi } from "vitest";

// Same supabase short-circuit as the other analytics unit tests.
vi.mock("@/lib/supabaseClient", () => ({
  supabase: {
    rpc: vi.fn(async () => ({ data: [], error: null })),
  },
}));

import { buildDataMoatReport } from "../dataMoatReport";
import type { CohortRetentionRow } from "../cohortRetention";
import type { L1RuleEffectivenessRow } from "../ruleEffectiveness";
import type { WeaknessTrendRow } from "../weaknessTrends";

const cohorts: CohortRetentionRow[] = [
  { cohort_week: "2026-04-13", day_offset: 1,  cohort_size: 50, retained_users: 45, retention_pct: 90 },
  { cohort_week: "2026-04-13", day_offset: 7,  cohort_size: 50, retained_users: 30, retention_pct: 60 },
  { cohort_week: "2026-04-13", day_offset: 14, cohort_size: 50, retained_users: 20, retention_pct: 40 },
  { cohort_week: "2026-04-13", day_offset: 30, cohort_size: 50, retained_users: 15, retention_pct: 30 },
  { cohort_week: "2026-04-06", day_offset: 1,  cohort_size: 40, retained_users: 36, retention_pct: 90 },
  { cohort_week: "2026-04-06", day_offset: 7,  cohort_size: 40, retained_users: 26, retention_pct: 65 },
];

const rules: L1RuleEffectivenessRow[] = [
  { rule_tag: "vi_l1_3rd_person_s", total_attempts: 200, improvements: 160, improvement_rate: 0.80, sample_size: 60 },
  { rule_tag: "vi_l1_question_no_aux", total_attempts: 80, improvements: 12, improvement_rate: 0.15, sample_size: 25 },
];

const weaknesses: WeaknessTrendRow[] = [
  { week_start: "2026-04-13", weakness_tag: "vi_l1_past_ed",      total_occurrences: 30, unique_users: 20 },
  { week_start: "2026-04-06", weakness_tag: "vi_l1_past_ed",      total_occurrences: 50, unique_users: 30 },
  { week_start: "2026-04-13", weakness_tag: "vi_l1_3rd_person_s", total_occurrences: 60, unique_users: 35 },
  { week_start: "2026-04-06", weakness_tag: "vi_l1_3rd_person_s", total_occurrences: 40, unique_users: 25 },
];

describe("buildDataMoatReport", () => {
  it("renders all three sections with sensible content", () => {
    const md = buildDataMoatReport({
      cohorts,
      ruleEffectiveness: rules,
      weaknessTrends: weaknesses,
      generatedAt: "2026-04-25",
    });
    expect(md).toContain("# MercyBlade — Monthly Data Moat Report");
    expect(md).toContain("_Generated: 2026-04-25_");
    expect(md).toContain("## 1. Cohort retention");
    expect(md).toContain("## 2. L1 rule effectiveness");
    expect(md).toContain("## 3. Weakness trends");
    // Cohort table contains the most-recent week.
    expect(md).toContain("| 2026-04-13 |");
    // Best/worst rule tags surface.
    expect(md).toContain("vi_l1_3rd_person_s");
    expect(md).toContain("vi_l1_question_no_aux");
    // Improving / worsening callouts use raw counts.
    expect(md).toMatch(/Top improving|Top worsening/);
  });

  it("D7 delta calls out direction vs prior cohort", () => {
    const md = buildDataMoatReport({
      cohorts,
      ruleEffectiveness: rules,
      weaknessTrends: weaknesses,
      generatedAt: "2026-04-25",
    });
    // 60% (newest) vs 65% (prior) → ↓ 5.0 pts.
    expect(md).toContain("D7 retention vs prior cohort");
    expect(md).toMatch(/↓ 5\.0 pts/);
  });

  it("renders graceful empty messages when input arrays are empty", () => {
    const md = buildDataMoatReport({
      cohorts: [],
      ruleEffectiveness: [],
      weaknessTrends: [],
      generatedAt: "2026-04-25",
    });
    expect(md).toContain("No cohort data available yet");
    expect(md).toContain("No rule effectiveness data with sufficient sample size yet");
    expect(md).toContain("No weakness-trend signal yet");
  });

  it("never crashes on minimal/single-row inputs", () => {
    const md = buildDataMoatReport({
      cohorts: [
        { cohort_week: "2026-04-13", day_offset: 1, cohort_size: 1, retained_users: 1, retention_pct: 100 },
      ],
      ruleEffectiveness: [
        { rule_tag: "x", total_attempts: 5, improvements: 5, improvement_rate: 1.0, sample_size: 5 },
      ],
      weaknessTrends: [
        { week_start: "2026-04-13", weakness_tag: "y", total_occurrences: 1, unique_users: 1 },
      ],
      generatedAt: "2026-04-25",
    });
    expect(typeof md).toBe("string");
    expect(md.length).toBeGreaterThan(100);
  });
});
