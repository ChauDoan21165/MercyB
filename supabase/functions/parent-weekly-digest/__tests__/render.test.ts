// supabase/functions/parent-weekly-digest/__tests__/render.test.ts
//
// Pin the pure parent-digest renderer. The index.ts imports Resend +
// Supabase (Deno-only), so we test only the pure render layer here.

import { describe, expect, it } from "vitest";

import digestTemplate from "../templates/digest.json";
import {
  buildVariables,
  formatAttributionBlock,
  formatCefrBlock,
  formatPatternsBlock,
  renderParentDigest,
  toEmailHtml,
  type ParentDigestData,
  type ParentDigestTemplate,
} from "../render";

const TEMPLATE = digestTemplate as unknown as ParentDigestTemplate;

function data(overrides: Partial<ParentDigestData> = {}): ParentDigestData {
  return {
    learner_name_vi: "Con bạn",
    learner_name_en: "your learner",
    cefr: "B1",
    weakness_count: 2,
    ...overrides,
  };
}

describe("parent digest render", () => {
  it("L5-PENDING attribution block is empty (Q9=A descriptive only)", () => {
    expect(formatAttributionBlock()).toEqual({ vi: "", en: "" });
  });

  it("formats CEFR null-safely", () => {
    expect(formatCefrBlock(data({ cefr: null })).vi).toContain("Chưa");
    expect(formatCefrBlock(data({ cefr: "A2" })).en).toContain("A2");
  });

  it("formats the patterns block for zero and many", () => {
    expect(formatPatternsBlock(data({ weakness_count: 0 })).vi).toContain(
      "chưa có",
    );
    expect(formatPatternsBlock(data({ weakness_count: 3 })).en).toContain("3");
  });

  it("substitutes every variable — no stray {{tokens}} remain", () => {
    const rendered = renderParentDigest(TEMPLATE, data());
    expect(rendered.subject).not.toMatch(/\{\{.*?\}\}/);
    expect(rendered.body_vi).not.toMatch(/\{\{.*?\}\}/);
    expect(rendered.body_en).not.toMatch(/\{\{.*?\}\}/);
  });

  it("marks a digest empty when there is no CEFR and no patterns", () => {
    expect(
      renderParentDigest(TEMPLATE, data({ cefr: null, weakness_count: 0 }))
        .is_empty,
    ).toBe(true);
    expect(renderParentDigest(TEMPLATE, data()).is_empty).toBe(false);
  });

  it("buildVariables exposes the attribution slot keys", () => {
    const vars = buildVariables(data());
    expect(vars).toHaveProperty("attribution_block_vi");
    expect(vars).toHaveProperty("attribution_block_en");
  });

  it("renders bilingual HTML (VI then EN)", () => {
    const html = toEmailHtml(renderParentDigest(TEMPLATE, data()));
    expect(html).toContain("<!doctype html>");
    expect(html.indexOf("Con bạn")).toBeLessThan(html.indexOf("your learner"));
  });
});
