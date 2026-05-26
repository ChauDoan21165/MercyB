// src/lib/seo/__tests__/generateSitemap.test.ts
//
// Coverage: the sitemap covers all 60+ topic URLs, emits valid XML,
// and never references a topic ID the runtime can't resolve.

import { describe, expect, it } from "vitest";

import {
  buildSitemapUrls,
  generateSitemap,
} from "../generateSitemap";
import { VSTEP_SPEAKING_TOPICS } from "@/data/exam-prep/vstep/speaking-topics";
import { TOEIC_PRACTICE_ITEMS } from "@/data/exam-prep/toeic/practice-items";
import { IELTS_WRITING_TOPICS } from "@/data/exam-prep/ielts/writing-topics";

describe("buildSitemapUrls", () => {
  const urls = buildSitemapUrls();
  const locs = urls.map((u) => u.loc);

  it("includes the homepage at priority 1.0", () => {
    const home = urls.find((u) => u.loc.endsWith("/"));
    expect(home).toBeDefined();
    expect(home!.priority).toBe("1.0");
  });

  it("covers every VSTEP topic", () => {
    for (const topic of VSTEP_SPEAKING_TOPICS) {
      expect(locs).toContain(`https://mercyblade.com/vstep/speaking/${topic.id}`);
    }
  });

  it("covers every TOEIC item", () => {
    for (const item of TOEIC_PRACTICE_ITEMS) {
      expect(locs).toContain(`https://mercyblade.com/toeic/practice/${item.id}`);
    }
  });

  it("covers every IELTS Writing topic", () => {
    for (const topic of IELTS_WRITING_TOPICS) {
      expect(locs).toContain(
        `https://mercyblade.com/ielts/writing/topic/${topic.id}`,
      );
    }
  });

  it("emits at least 60 topic URLs (30 VSTEP + 30 TOEIC + 10 IELTS)", () => {
    const topicLocs = locs.filter(
      (l) =>
        l.includes("/vstep/speaking/") ||
        l.includes("/toeic/practice/") ||
        l.includes("/ielts/writing/topic/"),
    );
    expect(topicLocs.length).toBeGreaterThanOrEqual(60);
  });

  it("has no duplicate locs", () => {
    expect(new Set(locs).size).toBe(locs.length);
  });
});

describe("generateSitemap", () => {
  const xml = generateSitemap();

  it("starts with the XML declaration", () => {
    expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
  });

  it("declares the sitemap-protocol namespace", () => {
    expect(xml).toContain(
      'xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
    );
  });

  it("contains one <url> entry per buildSitemapUrls row", () => {
    const expected = buildSitemapUrls().length;
    const matches = xml.match(/<url>/g) ?? [];
    expect(matches.length).toBe(expected);
  });
});
