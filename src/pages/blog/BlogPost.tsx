// Single blog post view. Reads slug from the route, looks up the post
// in the manifest, and renders body + locale toggle + share buttons.

import React, { useMemo, useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { ArrowLeft, Share2, Copy, Check } from "lucide-react";

import { getPostBySlug, splitBilingualBody } from "@/lib/blog/blogManifest";
import { renderMarkdown } from "@/lib/blog/markdownRenderer";
import type { BlogLocale } from "@/lib/blog/blogTypes";

export default function BlogPost() {
  const { slug = "" } = useParams<{ slug: string }>();
  const post = useMemo(() => getPostBySlug(slug), [slug]);

  const [locale, setLocale] = useState<BlogLocale>("vi");
  const [linkCopied, setLinkCopied] = useState(false);

  if (!post) return <Navigate to="/blog" replace />;

  const split = splitBilingualBody(post.body);
  const body = locale === "en" && split.en ? split.en : split.vi;

  const title = locale === "en" && post.title_en ? post.title_en : post.title_vi;
  const summary = locale === "en" && post.summary_en ? post.summary_en : post.summary_vi;

  const onCopyLink = async () => {
    try {
      const url = typeof window !== "undefined" ? window.location.href : "";
      await navigator.clipboard.writeText(url);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 1800);
    } catch {
      /* noop */
    }
  };

  const url = typeof window !== "undefined" ? window.location.href : "";
  const fbShare = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
  // Zalo share (Vietnam-dominant chat); falls back gracefully if user has no Zalo.
  const zaloShare = `https://zalo.me/share?u=${encodeURIComponent(url)}&t=${encodeURIComponent(title)}`;

  return (
    <article
      style={{
        maxWidth: 720,
        margin: "0 auto",
        padding: "20px 16px 80px",
      }}
    >
      <Link
        to="/blog"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          fontSize: 13,
          fontWeight: 700,
          color: "rgba(67,56,202,0.85)",
          textDecoration: "none",
          marginBottom: 14,
        }}
      >
        <ArrowLeft size={14} aria-hidden /> Tất cả bài viết · All posts
      </Link>

      {/* Locale toggle */}
      <div
        role="group"
        aria-label="Language toggle"
        style={{
          display: "inline-flex",
          padding: 3,
          borderRadius: 9999,
          background: "rgba(99,102,241,0.10)",
          border: "1px solid rgba(99,102,241,0.18)",
          marginBottom: 16,
        }}
      >
        <button
          type="button"
          onClick={() => setLocale("vi")}
          style={localeBtnStyle(locale === "vi")}
          aria-pressed={locale === "vi"}
        >
          Tiếng Việt
        </button>
        <button
          type="button"
          onClick={() => setLocale("en")}
          style={localeBtnStyle(locale === "en")}
          aria-pressed={locale === "en"}
          disabled={!split.en && !post.title_en}
        >
          English
        </button>
      </div>

      <header style={{ marginBottom: 14 }}>
        <h1
          style={{
            margin: 0,
            fontSize: 32,
            fontWeight: 950,
            letterSpacing: -0.6,
            lineHeight: 1.2,
            color: "rgba(15,23,42,0.94)",
          }}
        >
          {title}
        </h1>
        <p
          style={{
            marginTop: 10,
            marginBottom: 0,
            fontSize: 15,
            lineHeight: 1.55,
            color: "rgba(0,0,0,0.65)",
          }}
        >
          {summary}
        </p>
        <div
          style={{
            marginTop: 14,
            display: "flex",
            gap: 10,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <span style={{ fontSize: 13, fontWeight: 700, color: "rgba(0,0,0,0.55)" }}>
            {post.author}
          </span>
          <span style={{ color: "rgba(0,0,0,0.30)" }}>·</span>
          <time
            dateTime={post.published_at}
            style={{ fontSize: 13, fontWeight: 600, color: "rgba(0,0,0,0.50)" }}
          >
            {post.published_at.slice(0, 10)}
          </time>
        </div>
      </header>

      <hr style={{ border: "none", borderTop: "1px solid rgba(0,0,0,0.10)", margin: "16px 0 8px" }} />

      {/* Body */}
      <div style={{ marginTop: 6 }}>{renderMarkdown(body, locale)}</div>

      {/* Share footer */}
      <div
        style={{
          marginTop: 36,
          padding: "16px 20px",
          borderRadius: 16,
          background: "rgba(99,102,241,0.06)",
          border: "1px solid rgba(99,102,241,0.16)",
        }}
      >
        <div
          style={{
            fontSize: 13,
            fontWeight: 800,
            color: "rgba(67,56,202,0.85)",
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            marginBottom: 10,
          }}
        >
          <Share2 size={14} aria-hidden /> Chia sẻ bài viết · Share this post
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <a
            href={fbShare}
            target="_blank"
            rel="noopener noreferrer"
            style={shareBtnStyle}
          >
            Facebook
          </a>
          <a
            href={zaloShare}
            target="_blank"
            rel="noopener noreferrer"
            style={shareBtnStyle}
          >
            Zalo
          </a>
          <button type="button" onClick={onCopyLink} style={shareBtnStyle}>
            {linkCopied ? (
              <>
                <Check size={12} aria-hidden /> Đã chép · Copied
              </>
            ) : (
              <>
                <Copy size={12} aria-hidden /> Chép link · Copy link
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}

const shareBtnStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  padding: "8px 14px",
  borderRadius: 9999,
  background: "white",
  border: "1px solid rgba(99,102,241,0.25)",
  color: "rgba(67,56,202,0.90)",
  fontWeight: 800,
  fontSize: 13,
  textDecoration: "none",
  cursor: "pointer",
};

function localeBtnStyle(active: boolean): React.CSSProperties {
  return {
    padding: "6px 14px",
    borderRadius: 9999,
    border: "none",
    background: active ? "white" : "transparent",
    color: active ? "rgba(67,56,202,0.95)" : "rgba(67,56,202,0.65)",
    fontWeight: 800,
    fontSize: 12,
    cursor: "pointer",
    boxShadow: active ? "0 2px 6px rgba(79,70,229,0.16)" : "none",
  };
}
