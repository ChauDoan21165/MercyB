// Filesystem-driven blog post type. Posts live as .md files in
// src/data/blog-posts/<slug>.md with bilingual frontmatter and a single
// markdown body that contains both VN and EN sections (separated by an
// HTML comment marker — see markdownRenderer.tsx).
//
// Why bilingual-in-one-file rather than two files per slug:
//   - Vietnamese is the primary language; English is the toggle. Keeping
//     them in one file forces translators to update both at once and
//     never lets a post drift to VN-only or EN-only.
//   - The markdown renderer slices on the marker so we don't need a
//     compile step or a CMS.

export type BlogPost = {
  slug: string;
  title_vi: string;
  title_en: string;
  summary_vi: string;
  summary_en: string;
  /** Markdown source — both languages, split by the LANG_MARKER from markdownRenderer. */
  body: string;
  published_at: string; // ISO 8601 date, e.g. "2026-04-24"
  tags: string[];
  cover_image: string | null;
  author: string;
};

export type BlogLocale = "vi" | "en";

export const BLOG_LANG_MARKER = "<!-- :lang:en -->";
