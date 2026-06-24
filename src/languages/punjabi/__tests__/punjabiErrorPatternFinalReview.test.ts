import { describe, expect, it } from "vitest";

import {
  PUNJABI_FINAL_REVIEW_MODES,
  PUNJABI_FINAL_REVIEW_NOTICE,
  PUNJABI_FINAL_REVIEW_PATTERNS,
  punjabiErrorPatternFinalReview,
  type PunjabiErrorPatternFinalReviewItem,
} from "@/languages/punjabi/errorPatternFinalReview";

const GURMUKHI_SCRIPT = /[\u0A00-\u0A7F]/;
const VIETNAMESE_MARKS = /[ăâđêôơưàáạảãằắặẳẵầấậẩẫèéẹẻẽềếệểễìíịỉĩòóọỏõồốộổỗờớợởỡùúụủũừứựửữỳýỵỷỹ]/i;

describe("punjabiErrorPatternFinalReview - size and identity", () => {
  it("keeps a compact final-review set", () => {
    expect(punjabiErrorPatternFinalReview.length).toBeGreaterThanOrEqual(14);
    expect(punjabiErrorPatternFinalReview.length).toBeLessThanOrEqual(45);
  });

  it("has unique kebab-case ids", () => {
    const ids = punjabiErrorPatternFinalReview.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) {
      expect(id).toMatch(/^final-[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });
});

describe("punjabiErrorPatternFinalReview - app fields", () => {
  const requiredText: (keyof PunjabiErrorPatternFinalReviewItem)[] = [
    "title_vi",
    "title_en",
    "prompt_vi",
    "prompt_en",
    "target_pa",
    "meaning_vi",
    "meaning_en",
    "checkpoint_vi",
    "checkpoint_en",
    "qaCue_vi",
    "qaCue_en",
    "commonTrap",
    "reviewTip_vi",
    "reviewTip_en",
    "expectedSignal",
    "followUpRoute",
  ];

  it("fills every required text field", () => {
    for (const item of punjabiErrorPatternFinalReview) {
      for (const key of requiredText) {
        const value = item[key];
        expect(typeof value, `${item.id}.${key}`).toBe("string");
        expect((value as string).trim().length, `${item.id}.${key}`).toBeGreaterThan(0);
      }
    }
  });

  it("uses Gurmukhi as primary target evidence", () => {
    for (const item of punjabiErrorPatternFinalReview) {
      expect(GURMUKHI_SCRIPT.test(item.target_pa), `${item.id}.target_pa`).toBe(true);
      if (item.flawed_pa) {
        expect(GURMUKHI_SCRIPT.test(item.flawed_pa), `${item.id}.flawed_pa`).toBe(true);
      }
    }
  });

  it("keeps Vietnamese and English learner support distinct", () => {
    for (const item of punjabiErrorPatternFinalReview) {
      expect(item.title_vi).not.toBe(item.title_en);
      expect(item.prompt_vi).not.toBe(item.prompt_en);
      expect(item.checkpoint_vi).not.toBe(item.checkpoint_en);
      expect(
        VIETNAMESE_MARKS.test(item.title_vi) ||
          VIETNAMESE_MARKS.test(item.prompt_vi) ||
          VIETNAMESE_MARKS.test(item.reviewTip_vi),
        `${item.id} should include Vietnamese text`,
      ).toBe(true);
    }
  });
});

describe("punjabiErrorPatternFinalReview - coverage", () => {
  it("covers every requested final-review pattern", () => {
    const present = new Set<PunjabiErrorPatternFinalReviewItem["pattern"]>();
    for (const item of punjabiErrorPatternFinalReview) {
      expect(PUNJABI_FINAL_REVIEW_PATTERNS).toContain(item.pattern);
      present.add(item.pattern);
    }
    for (const pattern of PUNJABI_FINAL_REVIEW_PATTERNS) {
      expect(present.has(pattern), `missing pattern ${pattern}`).toBe(true);
    }
  });

  it("uses recognize, repair, and produce review modes", () => {
    const modes = new Set<PunjabiErrorPatternFinalReviewItem["mode"]>();
    for (const item of punjabiErrorPatternFinalReview) {
      expect(PUNJABI_FINAL_REVIEW_MODES).toContain(item.mode);
      modes.add(item.mode);
    }
    for (const mode of PUNJABI_FINAL_REVIEW_MODES) {
      expect(modes.has(mode), `missing mode ${mode}`).toBe(true);
    }
  });

  it("includes Vietnamese-specific, English-specific, and shared transfer support", () => {
    const audiences = new Set(punjabiErrorPatternFinalReview.map((item) => item.audience));
    expect(audiences.has("vi")).toBe(true);
    expect(audiences.has("en")).toBe(true);
    expect(audiences.has("both")).toBe(true);
  });

  it("includes compact Canada-practical phrase-gap review", () => {
    const canadaItems = punjabiErrorPatternFinalReview.filter((item) => item.canadaPractical);
    expect(canadaItems.length).toBeGreaterThanOrEqual(6);
    expect(canadaItems.some((item) => item.target_pa.includes("ਲਾਇਬ੍ਰੇਰੀ"))).toBe(true);
    expect(canadaItems.some((item) => item.target_pa.includes("ਅਰਜ਼ੀ"))).toBe(true);
    expect(canadaItems.some((item) => item.target_pa.includes("ਅਪਾਇੰਟਮੈਂਟ"))).toBe(true);
  });
});

describe("punjabiErrorPatternFinalReview - guardrails", () => {
  it("mentions Shahmukhi only as awareness, not a full course", () => {
    const serialized = `${PUNJABI_FINAL_REVIEW_NOTICE} ${JSON.stringify(punjabiErrorPatternFinalReview)}`.toLowerCase();
    expect(serialized).toContain("shahmukhi");
    expect(serialized).toContain("awareness");
    expect(serialized).toContain("not a full course");
  });

  it("does not claim native review, official placement, or A11 integration", () => {
    const notice = PUNJABI_FINAL_REVIEW_NOTICE.toLowerCase();
    expect(notice).toContain("wave 13 final review only");
    expect(notice).toContain("not a11 integration");
    expect(notice).toContain("study support only");
    expect(notice).toContain("not official placement");
    expect(notice).toContain("native review deferred");
    expect(notice).not.toContain("native reviewed");
  });
});
