/**
 * Regression test for the isPage3LessonKey over-match bug.
 *
 * Old predicate `/^k\d+_/i` accepted ANY k-prefixed digit key, so
 * page-11 through page-34 keys (k11_…, k34_…) were routed through
 * getPage3LessonByKey, which built /images/mercy-kids-page-3/k34_*.png
 * URLs that 404'd in production. Symptom on /kids/vi-english:
 * selecting Page 34 → lesson 001 → switching to Mercy Speak rendered
 * an `<img>` with naturalSize 0x0 (404) instead of the page-34 PNG.
 *
 * Fixed predicate `/^k0\d+_/i` only accepts 3-digit zero-padded
 * page-3 keys (k001_…, k010_…, k099_…). Pages 11–34 fall through to
 * the async page-NN loader.
 */
import { describe, expect, it } from "vitest";
import { isPage3LessonKey } from "../MercySpeakTab";

describe("isPage3LessonKey — regression: page-11..34 keys must NOT match", () => {
  it("returns true for a real page-3 key (k001_…)", () => {
    expect(isPage3LessonKey("k001_hello_mercy")).toBe(true);
  });

  it("returns true for the page-3 edge (k0NN — any leading-zero 3-digit slug)", () => {
    expect(isPage3LessonKey("k011_something")).toBe(true);
    expect(isPage3LessonKey("k099_lastpage3")).toBe(true);
  });

  it("returns false for page-11 keys (k11_…) — pre-fix bug regressed here", () => {
    expect(isPage3LessonKey("k11_topic_comment")).toBe(false);
  });

  it("returns false for page-34 keys (k34_…) — the symptom report case", () => {
    expect(isPage3LessonKey("k34_001_i_would_like_to_discuss_my_grade")).toBe(false);
  });

  it("returns false for other page-NN keys across the 14–34 range", () => {
    expect(isPage3LessonKey("k14_first")).toBe(false);
    expect(isPage3LessonKey("k20_middle")).toBe(false);
    expect(isPage3LessonKey("k27_late")).toBe(false);
    expect(isPage3LessonKey("k33_almost_last")).toBe(false);
  });

  it("returns false for empty / nullish input", () => {
    expect(isPage3LessonKey("")).toBe(false);
    expect(isPage3LessonKey(null)).toBe(false);
    expect(isPage3LessonKey(undefined)).toBe(false);
  });

  it("returns false for non-k-prefixed strings", () => {
    expect(isPage3LessonKey("apple")).toBe(false);
    expect(isPage3LessonKey("page3_001")).toBe(false);
  });
});
