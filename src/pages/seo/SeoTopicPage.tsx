// src/pages/seo/SeoTopicPage.tsx
//
// Generic SEO topic landing page used by VSTEP / TOEIC / IELTS topic
// wrappers. Each wrapper resolves its data file by topicId and passes
// a `SeoTopicPageProps` bundle. The page itself is data-shape agnostic
// so future verticals (CELPIP, OET, etc.) can reuse it.
//
// Render budget — sections in order:
//   1. Breadcrumb back to the parent index page
//   2. H1 — title in VN + EN
//   3. Description paragraph (VN + EN)
//   4. Sample questions / prompt list
//   5. Vietnamese-speaker tips list
//   6. Vocabulary preview (5 most-relevant terms)
//   7. "Practice now" CTA → links to existing exam-prep flow
//   8. Related topics sidebar
//
// Bilingual VI primary throughout. Renders SeoMeta tags imperatively
// so each route gets its own <title> + <meta name="description"> +
// JSON-LD without bundling react-helmet.

import React from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

import SeoMeta from "@/components/seo/SeoMeta";
import { getSeoMeta, type TopicType } from "@/lib/seo/topicSeoMeta";

export type SeoTopicVocabularyItem = {
  word: string;
  translationVi: string;
  pronunciationIpa: string;
  /** Optional CEFR badge text. */
  level?: string;
};

export type SeoTopicRelated = {
  id: string;
  titleVi: string;
  titleEn: string;
  /** Absolute path (e.g. "/vstep/speaking/family"). */
  href: string;
};

export type SeoTopicPageProps = {
  topicType: TopicType;
  topicId: string;
  /** Visible above the H1 — e.g. "VSTEP B1 · Phần 1". */
  eyebrow: string;
  titleVi: string;
  titleEn: string;
  descriptionVi: string;
  descriptionEn: string;
  /**
   * Either sample interview questions (VSTEP), reading/listening passage
   * (TOEIC), or essay prompts (IELTS). Rendered as an ordered list.
   */
  sampleQuestions: string[];
  /** Vietnamese-speaker coaching tips. */
  vietnameseTips: string[];
  /** Up to 5 most-relevant terms — extra entries are truncated by the page. */
  vocabulary: SeoTopicVocabularyItem[];
  /** "Practice now" CTA destination — usually the existing exam-prep flow. */
  practiceCtaHref: string;
  /** "Practice now" CTA label override (defaults to bilingual). */
  practiceCtaLabel?: { vi: string; en: string };
  /** Parent index breadcrumb. */
  parent: { titleVi: string; titleEn: string; href: string };
  /** Related topics in the same vertical. Up to 6 displayed. */
  related: SeoTopicRelated[];
};

const wrap: React.CSSProperties = {
  width: "100%",
  minHeight: "calc(100vh - 72px)",
  padding: "20px 16px 80px",
  display: "flex",
  justifyContent: "center",
};

const column: React.CSSProperties = {
  width: "100%",
  maxWidth: 880,
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr)",
  gap: 16,
};

const cardStyle: React.CSSProperties = {
  border: "1px solid rgba(0,0,0,0.10)",
  borderRadius: 20,
  padding: 22,
  background: "white",
  boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
};

const sectionHeader: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: 0.4,
  color: "rgba(0,0,0,0.55)",
};

const primaryBtnStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  background: "#111827",
  color: "white",
  borderRadius: 9999,
  minHeight: 48,
  padding: "0 22px",
  fontWeight: 700,
  fontSize: 15,
  textDecoration: "none",
};

const breadcrumbLink: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 4,
  color: "#475569",
  fontSize: 13,
  textDecoration: "none",
};

export default function SeoTopicPage(props: SeoTopicPageProps): React.ReactElement {
  const meta = getSeoMeta(props.topicType, props.topicId);
  const ctaLabel = props.practiceCtaLabel ?? {
    vi: "Bắt đầu luyện ngay",
    en: "Practice now",
  };
  const vocab = props.vocabulary.slice(0, 5);
  const related = props.related.slice(0, 6);

  return (
    <div style={wrap}>
      {meta ? (
        <SeoMeta
          title={meta.title}
          description={meta.description}
          canonical={meta.canonical}
          ogImage={meta.ogImage}
          lang="vi"
          structuredData={meta.structuredData}
        />
      ) : null}
      <div style={column}>
        {/* Breadcrumb */}
        <Link to={props.parent.href} style={breadcrumbLink} aria-label="Back to index">
          <ChevronLeft size={14} aria-hidden />
          <span>
            {props.parent.titleVi} · {props.parent.titleEn}
          </span>
        </Link>

        {/* Hero */}
        <header style={cardStyle}>
          <div style={sectionHeader}>{props.eyebrow}</div>
          <h1
            style={{
              fontSize: 28,
              fontWeight: 950,
              letterSpacing: -0.5,
              lineHeight: 1.15,
              margin: "8px 0 4px",
              color: "rgba(10,10,10,0.94)",
            }}
          >
            {props.titleVi}
          </h1>
          <p style={{ fontSize: 15, color: "#64748b", margin: 0 }}>{props.titleEn}</p>
          <p style={{ fontSize: 15, color: "#475569", marginTop: 14, lineHeight: 1.55 }}>
            {props.descriptionVi}
          </p>
          <p style={{ fontSize: 13, color: "#64748b", marginTop: 8, lineHeight: 1.5 }}>
            {props.descriptionEn}
          </p>

          <div style={{ marginTop: 18 }}>
            <Link
              to={props.practiceCtaHref}
              style={primaryBtnStyle}
              data-testid="seo-topic-practice-cta"
            >
              <span>
                {ctaLabel.vi} · {ctaLabel.en}
              </span>
              <ChevronRight size={16} aria-hidden />
            </Link>
          </div>
        </header>

        {/* Sample questions / prompt */}
        {props.sampleQuestions.length > 0 ? (
          <section style={cardStyle} aria-label="Sample questions">
            <div style={sectionHeader}>Câu hỏi mẫu · Sample questions</div>
            <ol
              style={{
                margin: "12px 0 0",
                paddingLeft: 20,
                color: "#1f2937",
                fontSize: 15,
                lineHeight: 1.6,
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              {props.sampleQuestions.map((q, i) => (
                <li key={`q-${i}`}>{q}</li>
              ))}
            </ol>
          </section>
        ) : null}

        {/* Vietnamese-speaker tips */}
        {props.vietnameseTips.length > 0 ? (
          <section style={cardStyle} aria-label="Vietnamese-speaker tips">
            <div style={sectionHeader}>Mẹo cho người Việt · Tips for Vietnamese speakers</div>
            <ul
              style={{
                margin: "12px 0 0",
                paddingLeft: 18,
                color: "#1f2937",
                fontSize: 14,
                lineHeight: 1.6,
                display: "flex",
                flexDirection: "column",
                gap: 6,
              }}
            >
              {props.vietnameseTips.map((tip, i) => (
                <li key={`tip-${i}`}>{tip}</li>
              ))}
            </ul>
          </section>
        ) : null}

        {/* Vocabulary preview */}
        {vocab.length > 0 ? (
          <section style={cardStyle} aria-label="Vocabulary preview">
            <div style={sectionHeader}>Từ vựng nổi bật · Key vocabulary</div>
            <ul
              style={{
                margin: "12px 0 0",
                padding: 0,
                listStyle: "none",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 10,
              }}
            >
              {vocab.map((v, i) => (
                <li
                  key={`v-${i}`}
                  style={{
                    background: "#f8fafc",
                    border: "1px solid rgba(0,0,0,0.04)",
                    borderRadius: 12,
                    padding: "10px 12px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      justifyContent: "space-between",
                      gap: 6,
                    }}
                  >
                    <strong style={{ fontSize: 15 }}>{v.word}</strong>
                    {v.level ? (
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 800,
                          color: "#475569",
                          background: "#e2e8f0",
                          padding: "1px 6px",
                          borderRadius: 9999,
                        }}
                      >
                        {v.level}
                      </span>
                    ) : null}
                  </div>
                  <div style={{ fontSize: 12, color: "#64748b" }}>
                    {v.pronunciationIpa}
                  </div>
                  <div style={{ fontSize: 13, color: "#1f2937", marginTop: 2 }}>
                    {v.translationVi}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {/* Bottom CTA */}
        <div style={{ textAlign: "center", marginTop: 4 }}>
          <Link
            to={props.practiceCtaHref}
            style={primaryBtnStyle}
            data-testid="seo-topic-practice-cta-bottom"
          >
            <span>
              {ctaLabel.vi} · {ctaLabel.en}
            </span>
            <ChevronRight size={16} aria-hidden />
          </Link>
        </div>

        {/* Related topics */}
        {related.length > 0 ? (
          <section style={cardStyle} aria-label="Related topics">
            <div style={sectionHeader}>Chủ đề liên quan · Related topics</div>
            <ul
              style={{
                margin: "12px 0 0",
                padding: 0,
                listStyle: "none",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: 8,
              }}
            >
              {related.map((r) => (
                <li key={r.id}>
                  <Link
                    to={r.href}
                    style={{
                      display: "block",
                      padding: "10px 12px",
                      background: "#f8fafc",
                      border: "1px solid rgba(0,0,0,0.06)",
                      borderRadius: 12,
                      textDecoration: "none",
                      color: "#1f2937",
                    }}
                  >
                    <div style={{ fontSize: 14, fontWeight: 700 }}>{r.titleVi}</div>
                    <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
                      {r.titleEn}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>
    </div>
  );
}
