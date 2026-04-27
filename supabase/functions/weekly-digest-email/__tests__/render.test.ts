// supabase/functions/weekly-digest-email/__tests__/render.test.ts
//
// Pin the public renderer behavior. The function file imports Resend +
// Supabase, so we only test the pure render layer here — that's where
// the bilingual + privacy logic lives.

import { describe, it, expect } from "vitest";

import {
  buildVariables,
  formatPhonemeBlock,
  formatScoreDelta,
  formatTopicBlock,
  renderDigest,
  toEmailHtml,
  type DigestAggregate,
  type DigestTemplate,
  type UserContribution,
} from "../render";

import digestTemplate from "../templates/digest.json";

const TEMPLATE = digestTemplate as DigestTemplate;

const baseAgg: DigestAggregate = {
  week_starts_on: "2026-04-20",
  total_attempts_this_week: 12381,
  total_unique_active_users_this_week: 247,
  new_users_this_week: 18,
  top_phoneme_improved: "θ",
  top_phoneme_improvement_points: 5.3,
  top_topic_practiced: "vstep_b2_speaking",
  top_topic_attempt_count: 612,
};

const baseUser: UserContribution = {
  attempts_count: 14,
  sentences_practiced: 8,
  topics_explored: 3,
  score_delta_vs_last_week: 4.2,
};

describe("formatPhonemeBlock", () => {
  it("formats a present phoneme bilingually with sign", () => {
    expect(formatPhonemeBlock(baseAgg)).toEqual({
      vi: "/θ/ — trung bình cộng đồng tăng +5.3 điểm",
      en: "/θ/ — community average up +5.3 points",
    });
  });

  it("falls back when phoneme data is missing", () => {
    const agg = { ...baseAgg, top_phoneme_improved: null, top_phoneme_improvement_points: null };
    const out = formatPhonemeBlock(agg);
    expect(out.vi).toContain("chưa đủ dữ liệu");
    expect(out.en).toContain("not enough data");
  });

  it("handles a negative delta with explicit minus sign", () => {
    const agg = { ...baseAgg, top_phoneme_improvement_points: -1.5 };
    const out = formatPhonemeBlock(agg);
    expect(out.vi).toContain("-1.5");
    expect(out.en).toContain("-1.5");
  });
});

describe("formatTopicBlock", () => {
  it("includes attempt count in both languages", () => {
    const out = formatTopicBlock(baseAgg);
    expect(out.vi).toContain("612 lượt luyện");
    expect(out.en).toContain("612 attempts");
  });

  it("falls back when topic is missing", () => {
    const agg = { ...baseAgg, top_topic_practiced: null, top_topic_attempt_count: null };
    const out = formatTopicBlock(agg);
    expect(out.vi).toContain("chưa có phòng nào");
    expect(out.en).toContain("no standout room");
  });
});

describe("formatScoreDelta", () => {
  it("returns 'no change' when delta is zero", () => {
    expect(formatScoreDelta(0)).toEqual({ vi: "giữ nguyên", en: "no change" });
  });

  it("prefixes positive deltas with + in both languages", () => {
    expect(formatScoreDelta(3)).toEqual({ vi: "+3 điểm", en: "+3 points" });
  });

  it("preserves the negative sign without doubling", () => {
    expect(formatScoreDelta(-2.5)).toEqual({
      vi: "-2.5 điểm",
      en: "-2.5 points",
    });
  });
});

describe("buildVariables", () => {
  it("builds every variable referenced in the template", () => {
    const vars = buildVariables(baseAgg, baseUser);
    // Pull the set of {{tokens}} actually used across the template.
    const tokens = new Set<string>();
    const tokenRegex = /\{\{(\w+)\}\}/g;
    for (const text of [
      TEMPLATE.subject_vi,
      TEMPLATE.subject_en,
      TEMPLATE.body_vi,
      TEMPLATE.body_en,
    ]) {
      for (const match of text.matchAll(tokenRegex)) {
        tokens.add(match[1]);
      }
    }
    for (const t of tokens) {
      expect(vars).toHaveProperty(t);
      expect(vars[t]).toBeDefined();
    }
  });

  it("computes 'unique_users_minus_one' as a non-negative integer", () => {
    const vars = buildVariables(baseAgg, baseUser);
    expect(vars.unique_users_minus_one).toBe("246");
  });

  it("clamps 'unique_users_minus_one' at zero when count is 1", () => {
    const agg = { ...baseAgg, total_unique_active_users_this_week: 1 };
    const vars = buildVariables(agg, baseUser);
    expect(vars.unique_users_minus_one).toBe("0");
  });
});

describe("renderDigest", () => {
  it("produces a Vietnamese-first subject with the user count substituted", () => {
    const out = renderDigest(TEMPLATE, baseAgg, baseUser);
    expect(out.subject).toContain("247");
    expect(out.subject.toLowerCase()).toContain("người việt");
  });

  it("body_vi includes user contribution numbers", () => {
    const out = renderDigest(TEMPLATE, baseAgg, baseUser);
    expect(out.body_vi).toContain("14 lượt phát âm");
    expect(out.body_vi).toContain("8 câu khác nhau");
    expect(out.body_vi).toContain("3 chủ đề");
    expect(out.body_vi).toContain("+4.2 điểm");
  });

  it("body_en mirrors body_vi with English values", () => {
    const out = renderDigest(TEMPLATE, baseAgg, baseUser);
    expect(out.body_en).toContain("14 attempts");
    expect(out.body_en).toContain("8 unique sentences");
    expect(out.body_en).toContain("+4.2 points");
  });

  it("flags inactive users (zero attempts) for caller decision", () => {
    const inactive = { ...baseUser, attempts_count: 0 };
    const out = renderDigest(TEMPLATE, baseAgg, inactive);
    expect(out.is_inactive_user).toBe(true);
  });

  it("leaves NO unresolved {{token}} placeholders after rendering", () => {
    const out = renderDigest(TEMPLATE, baseAgg, baseUser);
    expect(out.subject).not.toMatch(/\{\{\w+\}\}/);
    expect(out.body_vi).not.toMatch(/\{\{\w+\}\}/);
    expect(out.body_en).not.toMatch(/\{\{\w+\}\}/);
  });

  it("handles missing phoneme + topic data without leaving placeholders", () => {
    const sparseAgg: DigestAggregate = {
      ...baseAgg,
      top_phoneme_improved: null,
      top_phoneme_improvement_points: null,
      top_topic_practiced: null,
      top_topic_attempt_count: null,
    };
    const out = renderDigest(TEMPLATE, sparseAgg, baseUser);
    expect(out.body_vi).not.toMatch(/\{\{\w+\}\}/);
    expect(out.body_en).not.toMatch(/\{\{\w+\}\}/);
  });
});

describe("toEmailHtml", () => {
  it("includes both VI and EN content in the rendered HTML", () => {
    const rendered = renderDigest(TEMPLATE, baseAgg, baseUser);
    const html = toEmailHtml(rendered);
    expect(html).toContain("247");
    expect(html).toContain("attempts");
    expect(html.toLowerCase()).toContain("người việt");
  });

  it("escapes raw HTML so user-derived content cannot inject markup", () => {
    const tampered = renderDigest(
      { ...TEMPLATE, body_vi: "<script>x</script> Xin chào", body_en: "Hi" },
      baseAgg,
      baseUser,
    );
    const html = toEmailHtml(tampered);
    expect(html).not.toContain("<script>x</script>");
    expect(html).toContain("&lt;script&gt;");
  });
});
