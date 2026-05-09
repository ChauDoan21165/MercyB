// src/pages/exam-prep/VSTEPIndexPage.tsx — /exam/vstep
//
// VSTEP landing page. Sections: Speaking, Listening, Reading, Writing,
// B1/B2 explanation, exam structure overview. Vietnamese-first.

import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Headphones, BookOpen, PenLine, Mic } from "lucide-react";

const SECTION_CARDS = [
  {
    to: "/exam/vstep/speaking",
    icon: <Mic size={22} />,
    labelVi: "Nói · Speaking",
    descVi: "30 chủ đề B1 + B2, mẹo riêng cho người Việt, từ vựng theo trình độ.",
    color: "rgba(185,28,28,0.10)",
    border: "rgba(185,28,28,0.18)",
    text: "rgba(127,29,29,0.94)",
  },
  {
    to: "/exam/vstep/listening",
    icon: <Headphones size={22} />,
    labelVi: "Nghe · Listening",
    descVi: "12 bài nghe B1 + B2 — hội thoại, thông báo, bài giảng, tin tức.",
    color: "rgba(14,116,144,0.10)",
    border: "rgba(14,116,144,0.18)",
    text: "rgba(8,75,90,0.94)",
  },
  {
    to: "/exam/vstep/reading",
    icon: <BookOpen size={22} />,
    labelVi: "Đọc · Reading",
    descVi: "12 bài đọc B1 + B2 — email, thông báo, bài báo, đoạn luận.",
    color: "rgba(20,184,166,0.10)",
    border: "rgba(20,184,166,0.18)",
    text: "rgba(6,95,70,0.94)",
  },
  {
    to: "/exam/vstep/writing",
    icon: <PenLine size={22} />,
    labelVi: "Viết · Writing",
    descVi: "8 đề viết B1 + B2 — email, thư khiếu nại, bài luận ngắn.",
    color: "rgba(99,102,241,0.10)",
    border: "rgba(99,102,241,0.18)",
    text: "rgba(55,48,163,0.94)",
  },
];

export default function VSTEPIndexPage() {
  return (
    <div style={{ maxWidth: 880, margin: "0 auto", padding: "20px 16px 60px" }}>
      <header style={{ marginBottom: 20 }}>
        <h1
          style={{
            margin: 0,
            fontSize: 28,
            fontWeight: 950,
            letterSpacing: -0.5,
            color: "rgba(15,23,42,0.94)",
          }}
        >
          VSTEP · Kỳ thi năng lực ngoại ngữ Việt Nam
        </h1>
        <p style={{ marginTop: 8, fontSize: 14, lineHeight: 1.55, color: "rgba(0,0,0,0.66)" }}>
          Luyện thi VSTEP B1 + B2 theo định dạng Bộ Giáo dục và Đào tạo
          (Thông tư 23/2017/TT-BGDĐT). Bốn kỹ năng: Nghe, Nói, Đọc, Viết.
        </p>
      </header>

      <section style={{ marginBottom: 24 }}>
        <h2
          style={{
            fontSize: 16,
            fontWeight: 900,
            color: "rgba(0,0,0,0.55)",
            letterSpacing: 0.3,
            marginBottom: 12,
          }}
        >
          Chọn kỹ năng · Choose a skill
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: 12,
          }}
        >
          {SECTION_CARDS.map((card) => (
            <Link
              key={card.to}
              to={card.to}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                padding: "18px 16px",
                borderRadius: 16,
                background: card.color,
                border: `1px solid ${card.border}`,
                textDecoration: "none",
              }}
            >
              <div style={{ color: card.text, flexShrink: 0 }}>{card.icon}</div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 900, color: card.text, letterSpacing: -0.2 }}>
                  {card.labelVi}
                </div>
                <div style={{ fontSize: 12, fontWeight: 600, color: "rgba(0,0,0,0.50)", marginTop: 4, lineHeight: 1.45 }}>
                  {card.descVi}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section style={{ padding: "18px 20px", borderRadius: 16, background: "rgba(254,252,232,0.55)", border: "1px solid #fde68a" }}>
        <h2 style={{ margin: "0 0 10px", fontSize: 16, fontWeight: 900, color: "rgba(127,29,29,0.94)" }}>
          VSTEP là gì? · What is VSTEP?
        </h2>
        <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6, color: "rgba(0,0,0,0.72)" }}>
          VSTEP (Vietnamese Standardized Test of English Proficiency) là kỳ thi
          đánh giá năng lực tiếng Anh theo khung 6 bậc của Bộ Giáo dục và Đào
          tạo. Bài thi kiểm tra 4 kỹ năng: Nghe, Nói, Đọc, Viết. B1 là chuẩn
          đầu ra đại học; B2 là yêu cầu cho cao học và một số vị trí viên chức.
        </p>
        <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 8 }}>
          {[
            { label: "B1", desc: "Sơ cấp — tốt nghiệp đại học" },
            { label: "B2", desc: "Trung cấp — cao học, viên chức" },
          ].map((b) => (
            <span key={b.label} style={{ padding: "4px 12px", borderRadius: 9999, background: "white", border: "1px solid #fde68a", fontSize: 12, fontWeight: 800, color: "rgba(127,29,29,0.88)" }}>
              {b.label}: {b.desc}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}