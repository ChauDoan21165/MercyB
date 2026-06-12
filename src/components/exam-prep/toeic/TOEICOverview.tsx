// 7-section overview grid + total time/question budget + suggested
// CEFR target. Tap a card → /exam/toeic/practice/:sectionId.

import React from "react";
import { Link } from "react-router-dom";
import { Headphones, BookOpen, ChevronRight, Target } from "lucide-react";

import {
  TOEIC_LISTENING_SECTIONS,
  TOEIC_READING_SECTIONS,
  TOEIC_TOTAL_QUESTIONS,
  TOEIC_TOTAL_TIME_MINUTES,
  type TOEICSection,
} from "@/data/exam-prep/toeic/structure";

export default function TOEICOverview() {
  return (
    <div style={{ maxWidth: 880, margin: "0 auto", padding: "20px 16px 60px" }}>
      <header style={{ marginBottom: 20 }}>
        <h1
          style={{
            margin: 0,
            fontSize: 30,
            fontWeight: 950,
            letterSpacing: -0.5,
            color: "rgba(15,23,42,0.94)",
          }}
        >
          Luyện thi TOEIC · TOEIC prep
        </h1>
        <p
          style={{
            marginTop: 6,
            fontSize: 14,
            lineHeight: 1.55,
            color: "rgba(0,0,0,0.66)",
          }}
        >
          7 phần, {TOEIC_TOTAL_QUESTIONS} câu, khoảng {TOEIC_TOTAL_TIME_MINUTES} phút
          — cùng cấu trúc với bài thi thật.
        </p>
        <p style={{ marginTop: 2, fontSize: 12, color: "rgba(0,0,0,0.45)" }}>
          7 sections, {TOEIC_TOTAL_QUESTIONS} questions, about {TOEIC_TOTAL_TIME_MINUTES} minutes
          — the same shape as the real exam.
        </p>
      </header>

      <Link
        to="/exam/toeic/estimator"
        className="inline-flex items-center gap-2 rounded-full border border-indigo-300 bg-indigo-50 px-4 py-2 text-[13px] font-bold text-indigo-700 hover:bg-indigo-100"
        style={{ marginBottom: 24 }}
      >
        <Target size={14} aria-hidden /> Ước tính điểm · Estimate my score
        <ChevronRight size={14} aria-hidden />
      </Link>

      <SectionGroup
        title_en="Kỹ năng Nghe · Listening"
        icon={<Headphones size={18} aria-hidden />}
        sections={TOEIC_LISTENING_SECTIONS}
      />

      <div style={{ height: 18 }} />

      <SectionGroup
        title_en="Kỹ năng Đọc · Reading"
        icon={<BookOpen size={18} aria-hidden />}
        sections={TOEIC_READING_SECTIONS}
      />
    </div>
  );
}

function SectionGroup({
  title_en,
  icon,
  sections,
}: {
  title_en: string;
  icon: React.ReactNode;
  sections: readonly TOEICSection[];
}) {
  return (
    <section>
      <h2
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          margin: "8px 0 12px",
          fontSize: 18,
          fontWeight: 900,
          color: "rgba(15,23,42,0.92)",
        }}
      >
        {icon}
        {title_en}
      </h2>
      <ul
        style={{
          listStyle: "none",
          padding: 0,
          margin: 0,
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: 10,
        }}
      >
        {sections.map((s) => (
          <li key={s.id}>
            <Link
              to={`/exam/toeic/practice/${s.id}`}
              style={{
                display: "block",
                padding: "16px 18px",
                borderRadius: 16,
                border: "1px solid rgba(99,102,241,0.18)",
                background:
                  "linear-gradient(150deg, rgba(238,242,255,0.70), rgba(252,252,255,0.96))",
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 12,
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 16,
                      fontWeight: 900,
                      color: "rgba(15,23,42,0.92)",
                    }}
                  >
                    {s.name_en}
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: "rgba(99,102,241,0.75)",
                      marginTop: 2,
                    }}
                  >
                    {s.name_vi}
                  </div>
                  <p
                    style={{
                      marginTop: 6,
                      marginBottom: 0,
                      fontSize: 13,
                      lineHeight: 1.5,
                      color: "rgba(0,0,0,0.65)",
                    }}
                  >
                    {s.description_en}
                  </p>
                  <div
                    style={{
                      marginTop: 6,
                      display: "flex",
                      gap: 10,
                      flexWrap: "wrap",
                      fontSize: 12,
                      color: "rgba(0,0,0,0.50)",
                      fontWeight: 700,
                    }}
                  >
                    <span>{s.questionCount} questions</span>
                    <span>·</span>
                    <span>{s.timeLimitMinutes} min</span>
                  </div>
                </div>
                <ChevronRight
                  size={18}
                  style={{
                    color: "rgba(99,102,241,0.65)",
                    flexShrink: 0,
                    marginTop: 4,
                  }}
                  aria-hidden
                />
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
