// Blog index — VN-first list of all posts.
//
// Layout: hero (title + subtitle), tag filter chips, and a card grid.
// Each card shows the VN title prominently, EN title as secondary, then
// a short summary (always VN), tags, and the published date. Tapping a
// card navigates to /blog/:slug.

import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Tag, ChevronRight } from "lucide-react";

import { getAllPosts } from "@/lib/blog/blogManifest";

export default function BlogIndex() {
  const posts = useMemo(() => getAllPosts(), []);
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const allTags = useMemo(() => {
    const set = new Set<string>();
    posts.forEach((p) => p.tags.forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [posts]);

  const visible = useMemo(() => {
    if (!activeTag) return posts;
    return posts.filter((p) => p.tags.includes(activeTag));
  }, [posts, activeTag]);

  return (
    <div
      style={{
        maxWidth: 880,
        margin: "0 auto",
        padding: "20px 16px 80px",
      }}
    >
      <header style={{ textAlign: "center", marginTop: 8, marginBottom: 24 }}>
        <h1
          style={{
            fontSize: 32,
            fontWeight: 950,
            letterSpacing: -0.6,
            color: "rgba(15,23,42,0.94)",
            margin: 0,
          }}
        >
          Blog MercyBlade
        </h1>
        <div
          style={{
            marginTop: 4,
            fontSize: 13,
            fontWeight: 700,
            color: "rgba(99,102,241,0.80)",
            letterSpacing: 0.3,
          }}
        >
          Câu chuyện, mẹo học, và sự thật về tiếng Anh cho người Việt
        </div>
        <div
          style={{
            marginTop: 2,
            fontSize: 12,
            fontWeight: 600,
            color: "rgba(99,102,241,0.55)",
          }}
        >
          Stories, learning tips, and truths about English for Vietnamese speakers
        </div>
      </header>

      {/* Tag chips */}
      {allTags.length > 0 && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            justifyContent: "center",
            marginBottom: 24,
          }}
          role="region"
          aria-label="Filter by tag"
        >
          <TagChip
            label="Tất cả · All"
            active={activeTag === null}
            onClick={() => setActiveTag(null)}
          />
          {allTags.map((tag) => (
            <TagChip
              key={tag}
              label={tag}
              active={activeTag === tag}
              onClick={() => setActiveTag(tag)}
            />
          ))}
        </div>
      )}

      {/* Post grid */}
      {visible.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "40px 20px",
            color: "rgba(0,0,0,0.50)",
            fontSize: 14,
          }}
        >
          Chưa có bài viết nào. Hãy quay lại sớm nhé!
          <div style={{ fontSize: 12, marginTop: 4, opacity: 0.7 }}>
            No posts yet. Check back soon!
          </div>
        </div>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 14 }}>
          {visible.map((post) => (
            <li key={post.slug}>
              <Link
                to={`/blog/${post.slug}`}
                style={{
                  display: "block",
                  padding: "18px 20px",
                  borderRadius: 18,
                  border: "1px solid rgba(99,102,241,0.16)",
                  background: "linear-gradient(150deg, rgba(238,242,255,0.96), rgba(252,252,255,0.94))",
                  textDecoration: "none",
                  color: "inherit",
                  boxShadow: "0 8px 22px rgba(79,70,229,0.06)",
                  transition: "transform 120ms ease",
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h2
                      style={{
                        margin: 0,
                        fontSize: 18,
                        fontWeight: 900,
                        color: "rgba(15,23,42,0.92)",
                        lineHeight: 1.3,
                      }}
                    >
                      {post.title_vi}
                    </h2>
                    <div
                      style={{
                        marginTop: 2,
                        fontSize: 13,
                        fontWeight: 600,
                        color: "rgba(99,102,241,0.70)",
                        lineHeight: 1.4,
                      }}
                    >
                      {post.title_en}
                    </div>
                    <p
                      style={{
                        marginTop: 8,
                        marginBottom: 0,
                        fontSize: 14,
                        lineHeight: 1.55,
                        color: "rgba(0,0,0,0.65)",
                      }}
                    >
                      {post.summary_vi}
                    </p>
                    <div
                      style={{
                        marginTop: 10,
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 6,
                        alignItems: "center",
                      }}
                    >
                      <time
                        dateTime={post.published_at}
                        style={{ fontSize: 12, fontWeight: 700, color: "rgba(0,0,0,0.45)" }}
                      >
                        {formatDate(post.published_at)}
                      </time>
                      {post.tags.map((t) => (
                        <span
                          key={t}
                          style={{
                            fontSize: 11,
                            padding: "2px 8px",
                            borderRadius: 9999,
                            background: "rgba(99,102,241,0.10)",
                            color: "rgba(67,56,202,0.85)",
                            fontWeight: 700,
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 3,
                          }}
                        >
                          <Tag size={10} aria-hidden /> {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <ChevronRight
                    size={20}
                    style={{ color: "rgba(99,102,241,0.65)", flexShrink: 0, marginTop: 4 }}
                    aria-hidden
                  />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {/* RSS link */}
      <div
        style={{
          marginTop: 32,
          textAlign: "center",
          fontSize: 12,
          color: "rgba(0,0,0,0.45)",
        }}
      >
        <a
          href="/blog-rss.xml"
          style={{ color: "rgba(99,102,241,0.85)", textDecoration: "underline" }}
        >
          RSS feed
        </a>{" "}
        · báo chí cộng đồng được phép tổng hợp
      </div>
    </div>
  );
}

function TagChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: "6px 14px",
        borderRadius: 9999,
        border: active
          ? "1px solid rgba(67,56,202,0.85)"
          : "1px solid rgba(99,102,241,0.25)",
        background: active ? "rgba(99,102,241,0.95)" : "rgba(255,255,255,0.85)",
        color: active ? "white" : "rgba(67,56,202,0.85)",
        fontWeight: 800,
        fontSize: 12,
        cursor: "pointer",
      }}
    >
      {label}
    </button>
  );
}

function formatDate(iso: string): string {
  if (!iso) return "";
  // Avoid Intl in case test env doesn't have full ICU — render YYYY-MM-DD.
  return iso.slice(0, 10);
}
