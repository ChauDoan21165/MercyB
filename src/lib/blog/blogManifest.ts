// Loads all blog posts at build time via Vite's import.meta.glob.
//
// Adding a new post = drop a new .md into src/data/blog-posts/. No
// registry edit needed; the glob picks it up.
//
// Frontmatter format (required at the top of every .md):
//
//   ---
//   slug: my-slug
//   title_vi: Tiếng Việt
//   title_en: English Title
//   summary_vi: ...
//   summary_en: ...
//   published_at: 2026-04-24
//   tags: [vietnamese, learning]
//   cover_image: /blog/cover.jpg
//   author: Chau Doan
//   ---
//
// Body follows after the closing `---` and contains both languages
// separated by `<!-- :lang:en -->` (see BLOG_LANG_MARKER).

import { BLOG_LANG_MARKER, type BlogPost } from "./blogTypes";

// Vite handles this at build time. `?raw` returns the file as a string.
const POST_MODULES = import.meta.glob("@/data/blog-posts/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

let cachedManifest: BlogPost[] | null = null;

export function getAllPosts(): BlogPost[] {
  if (cachedManifest) return cachedManifest;

  const posts: BlogPost[] = [];
  for (const [path, raw] of Object.entries(POST_MODULES)) {
    const post = parsePost(path, raw);
    if (post) posts.push(post);
  }
  // Newest first.
  posts.sort((a, b) => (a.published_at < b.published_at ? 1 : -1));
  cachedManifest = posts;
  return posts;
}

export function getPostBySlug(slug: string): BlogPost | null {
  return getAllPosts().find((p) => p.slug === slug) ?? null;
}

// ── Frontmatter parser ───────────────────────────────────────────────────
//
// Intentionally minimal: supports `key: scalar` and `key: [a, b, c]`
// arrays. No nested objects, no multi-line values. If a post needs more
// structure, add fields here rather than reaching for a YAML lib.

const FRONTMATTER_RE = /^---\s*\n([\s\S]+?)\n---\s*\n([\s\S]*)$/;

function parsePost(path: string, raw: string): BlogPost | null {
  const match = FRONTMATTER_RE.exec(raw);
  if (!match) {
    console.warn(`[blogManifest] skipping ${path}: missing frontmatter`);
    return null;
  }

  const fm = parseFrontmatter(match[1]);
  const body = match[2];

  const slug = String(fm.slug ?? deriveSlugFromPath(path));
  if (!slug) return null;

  return {
    slug,
    title_vi: String(fm.title_vi ?? ""),
    title_en: String(fm.title_en ?? ""),
    summary_vi: String(fm.summary_vi ?? ""),
    summary_en: String(fm.summary_en ?? ""),
    body,
    published_at: String(fm.published_at ?? ""),
    tags: Array.isArray(fm.tags) ? fm.tags.map(String) : [],
    cover_image: fm.cover_image ? String(fm.cover_image) : null,
    author: String(fm.author ?? "Chau Doan"),
  };
}

function parseFrontmatter(src: string): Record<string, unknown> {
  const out: Record<string, unknown> = {};
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

function deriveSlugFromPath(path: string): string {
  const m = /\/([^/]+)\.md$/.exec(path);
  return m ? m[1] : "";
}

/**
 * Splits a markdown body into VN and EN halves on BLOG_LANG_MARKER.
 * If the marker is missing, the whole body is treated as VN and the
 * EN side is empty (the locale toggle then falls back to the VN copy).
 */
export function splitBilingualBody(body: string): { vi: string; en: string } {
  const idx = body.indexOf(BLOG_LANG_MARKER);
  if (idx === -1) return { vi: body, en: "" };
  return {
    vi: body.slice(0, idx).trim(),
    en: body.slice(idx + BLOG_LANG_MARKER.length).trim(),
  };
}

/** Test-only — clear the module cache so tests can swap glob modules. */
export function __resetBlogCacheForTests(): void {
  cachedManifest = null;
}
