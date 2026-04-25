#!/usr/bin/env node
//
// Reads every .md file in src/data/blog-posts/, parses frontmatter, and
// writes public/blog-rss.xml. Run it whenever a post is added, edited,
// or removed:
//
//   node scripts/generate-blog-rss.mjs
//
// Frontmatter format mirrors src/lib/blog/blogManifest.ts — keep both
// in sync if you change one. (This script is intentionally a separate
// implementation rather than importing the TS module so it can run
// outside the Vite pipeline.)

import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const POSTS_DIR = join(ROOT, "src/data/blog-posts");
const OUTPUT = join(ROOT, "public/blog-rss.xml");

const SITE_URL = process.env.MERCYBLADE_SITE_URL ?? "https://mercyblade.com";

const FRONTMATTER_RE = /^---\s*\n([\s\S]+?)\n---\s*\n([\s\S]*)$/;

function parseFrontmatter(src) {
  const out = {};
  for (const lineRaw of src.split("\n")) {
    const line = lineRaw.trimEnd();
    if (!line.trim() || line.trim().startsWith("#")) continue;
    const colon = line.indexOf(":");
    if (colon === -1) continue;
    const key = line.slice(0, colon).trim();
    const value = line.slice(colon + 1).trim();
    if (!key) continue;
    if (value.startsWith("[") && value.endsWith("]")) {
      out[key] = value
        .slice(1, -1)
        .split(",")
        .map((s) => s.trim().replace(/^["']|["']$/g, ""))
        .filter(Boolean);
    } else {
      out[key] = value.replace(/^["']|["']$/g, "");
    }
  }
  return out;
}

function escapeXml(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function rfc822(iso) {
  // iso = YYYY-MM-DD; treat as 09:00 UTC of that day for stable feeds.
  const d = new Date(`${iso}T09:00:00Z`);
  if (Number.isNaN(d.getTime())) return new Date().toUTCString();
  return d.toUTCString();
}

function loadPosts() {
  if (!existsSync(POSTS_DIR)) return [];
  const files = readdirSync(POSTS_DIR).filter((f) => f.endsWith(".md"));
  const posts = [];
  for (const file of files) {
    const raw = readFileSync(join(POSTS_DIR, file), "utf8");
    const m = FRONTMATTER_RE.exec(raw);
    if (!m) continue;
    const fm = parseFrontmatter(m[1]);
    const slug = fm.slug ?? file.replace(/\.md$/, "");
    posts.push({
      slug,
      title_vi: fm.title_vi ?? "",
      title_en: fm.title_en ?? "",
      summary_vi: fm.summary_vi ?? "",
      summary_en: fm.summary_en ?? "",
      published_at: fm.published_at ?? "",
      tags: Array.isArray(fm.tags) ? fm.tags : [],
      author: fm.author ?? "Chau Doan",
    });
  }
  posts.sort((a, b) => (a.published_at < b.published_at ? 1 : -1));
  return posts;
}

function buildRss(posts) {
  const items = posts
    .map((p) => {
      const link = `${SITE_URL}/blog/${p.slug}`;
      const title = p.title_vi || p.title_en || p.slug;
      const description = p.summary_vi || p.summary_en || "";
      const categories = p.tags.map((t) => `      <category>${escapeXml(t)}</category>`).join("\n");
      return `    <item>
      <title>${escapeXml(title)}</title>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="true">${escapeXml(link)}</guid>
      <pubDate>${rfc822(p.published_at)}</pubDate>
      <author>noreply@mercyblade.com (${escapeXml(p.author)})</author>
      <description>${escapeXml(description)}</description>
${categories}
    </item>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Blog MercyBlade</title>
    <link>${escapeXml(SITE_URL)}/blog</link>
    <atom:link href="${escapeXml(SITE_URL)}/blog-rss.xml" rel="self" type="application/rss+xml"/>
    <description>Câu chuyện, mẹo học, và sự thật về tiếng Anh cho người Việt. Stories and tips for Vietnamese learners of English.</description>
    <language>vi</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>
`;
}

function main() {
  const posts = loadPosts();
  const xml = buildRss(posts);
  mkdirSync(dirname(OUTPUT), { recursive: true });
  writeFileSync(OUTPUT, xml);
  console.log(`[blog-rss] wrote ${OUTPUT} with ${posts.length} post(s)`);
}

main();
