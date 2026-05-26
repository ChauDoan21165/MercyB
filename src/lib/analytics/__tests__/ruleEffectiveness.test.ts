// src/lib/analytics/__tests__/ruleEffectiveness.test.ts

import { describe, expect, it, vi, beforeEach } from "vitest";

const rpcReturn = {
  data: null as unknown,
  error: null as unknown,
};
vi.mock("@/lib/supabaseClient", () => ({
  supabase: {
    rpc: vi.fn(async () => ({ data: rpcReturn.data, error: rpcReturn.error })),
  },
}));

import {
  getL1RuleEffectiveness,
  getRulesNeedingAttention,
  summariseRuleEffectiveness,
  NEEDS_ATTENTION_MIN_SAMPLE,
  type L1RuleEffectivenessRow,
} from "../ruleEffectiveness";

const SAMPLE: L1RuleEffectivenessRow[] = [
  { rule_tag: "vi_l1_3rd_person_s",   total_attempts: 200, improvements: 160, improvement_rate: 0.80, sample_size: 60 },
  { rule_tag: "vi_l1_past_ed",        total_attempts: 150, improvements: 60,  improvement_rate: 0.40, sample_size: 40 },
  { rule_tag: "vi_l1_question_no_aux", total_attempts: 80, improvements: 12,  improvement_rate: 0.15, sample_size: 25 },
  { rule_tag: "vi_l1_tag_question",   total_attempts: 30, improvements: 1,   improvement_rate: 0.03, sample_size: 3  }, // below sample floor
  { rule_tag: "vi_l1_make_vs_do",     total_attempts: 60, improvements: 24,  improvement_rate: 0.40, sample_size: 18 },
];

beforeEach(() => {
  rpcReturn.data = SAMPLE;
  rpcReturn.error = null;
});

describe("getL1RuleEffectiveness", () => {
  it("normalises numeric strings (Postgres numeric → number)", async () => {
    rpcReturn.data = [
      { rule_tag: "x", total_attempts: "10", improvements: "3", improvement_rate: "0.30", sample_size: "5" },
    ];
    const result = await getL1RuleEffectiveness();
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data[0].total_attempts).toBe(10);
      expect(result.data[0].improvement_rate).toBeCloseTo(0.3);
    }
  });

  it("surfaces RPC errors", async () => {
    rpcReturn.data = null;
    rpcReturn.error = { message: "denied", code: "42501" };
    const result = await getL1RuleEffectiveness();
    expect(result.ok).toBe(false);
  });
});

describe("getRulesNeedingAttention", () => {
  it("filters out rules below the sample-size floor", async () => {
    const result = await getRulesNeedingAttention();
    expect(result.ok).toBe(true);
    if (result.ok) {
      const tags = result.data.map((r) => r.rule_tag);
      // tag_question has sample 3 (< 5 floor) — must be excluded.
      expect(tags).not.toContain("vi_l1_tag_question");
    }
  });

  it("returns only rules with rate < 0.3 by default", async () => {
    const result = await getRulesNeedingAttention();
    expect(result.ok).toBe(true);
    if (result.ok) {
      // From SAMPLE: only vi_l1_question_no_aux (0.15) qualifies.
      expect(result.data.length).toBe(1);
      expect(result.data[0].rule_tag).toBe("vi_l1_question_no_aux");
    }
  });

  it("ranks by (rate ASC, total_attempts DESC)", async () => {
    rpcReturn.data = [
      { rule_tag: "low_busy",  total_attempts: 200, improvements: 20, improvement_rate: 0.10, sample_size: 50 },
      { rule_tag: "low_quiet", total_attempts: 50,  improvements: 5,  improvement_rate: 0.10, sample_size: 20 },
      { rule_tag: "med",       total_attempts: 80,  improvements: 16, improvement_rate: 0.20, sample_size: 30 },
    ];
    const result = await getRulesNeedingAttention();
    expect(result.ok).toBe(true);
    if (result.ok) {
      // 0.10 ties → busier first.
      expect(result.data.map((r) => r.rule_tag)).toEqual([
        "low_busy",
        "low_quiet",
        "med",
      ]);
    }
  });

  it("respects custom thresholds", async () => {
    const result = await getRulesNeedingAttention({
      rateThreshold: 0.5,
      minSampleSize: NEEDS_ATTENTION_MIN_SAMPLE,
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      // With threshold 0.5: past_ed (0.4), question_no_aux (0.15), make_vs_do (0.4) qualify.
      const tags = result.data.map((r) => r.rule_tag);
      expect(tags).toContain("vi_l1_past_ed");
      expect(tags).toContain("vi_l1_question_no_aux");
      expect(tags).toContain("vi_l1_make_vs_do");
      expect(tags).not.toContain("vi_l1_3rd_person_s");
    }
  });
});

describe("summariseRuleEffectiveness", () => {
  it("returns the empty shape for no input", () => {
    const out = summariseRuleEffectiveness([]);
    expect(out.total_rules).toBe(0);
    expect(out.rules_with_data).toBe(0);
    expect(out.best).toBeNull();
    expect(out.worst).toBeNull();
    expect(out.needs_attention_count).toBe(0);
  });

  it("computes best/worst from rules above the sample floor", () => {
    const out = summariseRuleEffectiveness(SAMPLE);
    expect(out.best?.rule_tag).toBe("vi_l1_3rd_person_s");
    expect(out.worst?.rule_tag).toBe("vi_l1_question_no_aux");
    // tag_question (sample 3) excluded; rules_with_data is 4.
    expect(out.rules_with_data).toBe(4);
    expect(out.needs_attention_count).toBe(1); // only question_no_aux is < 0.3
  });
});
