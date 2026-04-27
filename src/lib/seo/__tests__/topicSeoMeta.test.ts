// src/lib/seo/__tests__/topicSeoMeta.test.ts
//
// Coverage: getSeoMeta returns correctly-shaped metadata for each
// vertical, the description honors the 150-char snippet budget, and
// unknown IDs return null.

import { describe, expect, it } from "vitest";

import {
  SITE_ORIGIN,
  getSeoMeta,
  truncateForSnippet,
} from "../topicSeoMeta";
import { VSTEP_SPEAKING_TOPICS } from "@/data/exam-prep/vstep/speaking-topics";
import { TOEIC_PRACTICE_ITEMS } from "@/data/exam-prep/toeic/practice-items";
import { IELTS_WRITING_TOPICS } from "@/data/exam-prep/ielts/writing-topics";

describe("truncateForSnippet", () => {
  it("returns input unchanged when under the budget", () => {
    expect(truncateForSnippet("hello world", 150)).toBe("hello world");
  });

  it("trims to the closest word boundary above max-30", () => {
    const long = "Aaaa bbbb cccc dddd eeee ffff gggg hhhh iiii jjjj";
    const out = truncateForSnippet(long, 20);
    expect(out.length).toBeLessThanOrEqual(20);
    expect(out.endsWith("…")).toBe(true);
  });

  it("counts unicode chars (not bytes) so VN diacritics fit", () => {
    const vi = "Luyện thi VSTEP cho người Việt — phát âm chuẩn quốc gia";
    expect(truncateForSnippet(vi, 100)).toBe(vi);
  });
});

describe("getSeoMeta — VSTEP", () => {
  const sample = VSTEP_SPEAKING_TOPICS[0];

  it("returns null for unknown id", () => {
    expect(getSeoMeta("vstep_speaking", "not_a_real_topic")).toBeNull();
  });

  it("emits a VN-keyword-front-loaded title", () => {
    const meta = getSeoMeta("vstep_speaking", sample.id);
    expect(meta).not.toBeNull();
    expect(meta!.title.startsWith(`VSTEP ${sample.level} Speaking:`)).toBe(true);
    expect(meta!.title).toContain(sample.topic_title_vi);
  });

  it("description fits the 150-char snippet budget", () => {
    const meta = getSeoMeta("vstep_speaking", sample.id);
    expect([...meta!.description].length).toBeLessThanOrEqual(151); // includes ellipsis
  });

  it("canonical points at /vstep/speaking/:id", () => {
    const meta = getSeoMeta("vstep_speaking", sample.id);
    expect(meta!.canonical).toBe(`${SITE_ORIGIN}/vstep/speaking/${sample.id}`);
  });

  it("structuredData is an Article with Course about", () => {
    const meta = getSeoMeta("vstep_speaking", sample.id);
    expect(meta!.structuredData["@type"]).toBe("Article");
    expect((meta!.structuredData.about as { "@type": string })["@type"]).toBe(
      "Course",
    );
  });
});

describe("getSeoMeta — TOEIC", () => {
  const sample = TOEIC_PRACTICE_ITEMS[0];

  it("title matches the TOEIC pattern", () => {
    const meta = getSeoMeta("toeic_practice", sample.id);
    expect(meta!.title.startsWith(`TOEIC Part ${sample.part}`)).toBe(true);
    expect(meta!.title).toContain("Luyện thi TOEIC");
  });

  it("canonical points at /toeic/practice/:id", () => {
    const meta = getSeoMeta("toeic_practice", sample.id);
    expect(meta!.canonical).toBe(`${SITE_ORIGIN}/toeic/practice/${sample.id}`);
  });
});

describe("getSeoMeta — IELTS", () => {
  const sample = IELTS_WRITING_TOPICS[0];

  it("title matches the IELTS pattern", () => {
    const meta = getSeoMeta("ielts_writing", sample.id);
    expect(meta!.title.startsWith("IELTS Writing Task 2:")).toBe(true);
    expect(meta!.title).toContain("Mẹo cho người Việt");
  });

  it("canonical points at /ielts/writing/topic/:id", () => {
    const meta = getSeoMeta("ielts_writing", sample.id);
    expect(meta!.canonical).toBe(
      `${SITE_ORIGIN}/ielts/writing/topic/${sample.id}`,
    );
  });
});
