// src/lib/seo/generateSitemap.ts
//
// Static sitemap generator. Called at build time by
// scripts/generate-sitemap.mjs to produce public/sitemap.xml. Pure
// function — no I/O — so unit tests can verify URL coverage without
// touching the filesystem.
//
// Output is conformant XML against
// https://www.sitemaps.org/schemas/sitemap/0.9. Priorities follow the
// existing /seo/* page conventions (homepage 1.0, evergreen
// keyword pages 0.9, exam-prep topic pages 0.8, transactional 0.7).

import { VSTEP_SPEAKING_TOPICS } from "@/data/exam-prep/vstep/speaking-topics";
import { TOEIC_PRACTICE_ITEMS } from "@/data/exam-prep/toeic/practice-items";
import { IELTS_WRITING_TOPICS } from "@/data/exam-prep/ielts/writing-topics";
import { SITE_ORIGIN } from "@/lib/seo/topicSeoMeta";

export type SitemapUrl = {
  loc: string;
  changefreq: "daily" | "weekly" | "monthly";
  priority: string;
};

const STATIC_URLS: SitemapUrl[] = [
  { loc: `${SITE_ORIGIN}/`, changefreq: "weekly", priority: "1.0" },
  {
    loc: `${SITE_ORIGIN}/seo/hoc-tieng-anh-cho-nguoi-viet`,
    changefreq: "monthly",
    priority: "0.9",
  },
  {
    loc: `${SITE_ORIGIN}/seo/sua-phat-am-tieng-anh`,
    changefreq: "monthly",
    priority: "0.9",
  },
  {
    loc: `${SITE_ORIGIN}/seo/loi-tieng-anh-nguoi-viet-hay-sai`,
    changefreq: "monthly",
    priority: "0.9",
  },
  {
    loc: `${SITE_ORIGIN}/seo/phong-van-tieng-anh`,
    changefreq: "monthly",
    priority: "0.9",
  },
  {
    loc: `${SITE_ORIGIN}/seo/hoc-tieng-anh-mien-phi`,
    changefreq: "monthly",
    priority: "0.9",
  },
  // Exam-prep index pages — navigation hubs that link to topic pages.
  { loc: `${SITE_ORIGIN}/exam/vstep/speaking`, changefreq: "monthly", priority: "0.85" },
  { loc: `${SITE_ORIGIN}/exam-prep/toeic`, changefreq: "monthly", priority: "0.85" },
  { loc: `${SITE_ORIGIN}/exam/ielts/writing`, changefreq: "monthly", priority: "0.85" },
  { loc: `${SITE_ORIGIN}/pricing`, changefreq: "monthly", priority: "0.7" },
];

export function buildSitemapUrls(): SitemapUrl[] {
  const urls: SitemapUrl[] = [...STATIC_URLS];

  for (const topic of VSTEP_SPEAKING_TOPICS) {
    urls.push({
      loc: `${SITE_ORIGIN}/vstep/speaking/${topic.id}`,
      changefreq: "monthly",
      priority: "0.8",
    });
  }
  for (const item of TOEIC_PRACTICE_ITEMS) {
    urls.push({
      loc: `${SITE_ORIGIN}/toeic/practice/${item.id}`,
      changefreq: "monthly",
      priority: "0.8",
    });
  }
  for (const topic of IELTS_WRITING_TOPICS) {
    urls.push({
      loc: `${SITE_ORIGIN}/ielts/writing/topic/${topic.id}`,
      changefreq: "monthly",
      priority: "0.8",
    });
  }

  return urls;
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function generateSitemap(): string {
  const urls = buildSitemapUrls();
  const body = urls
    .map(
      (u) =>
        `  <url>\n    <loc>${escapeXml(u.loc)}</loc>\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`,
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}
