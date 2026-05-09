// src/pages/exam-prep/VSTEPListeningPage.tsx — /exam/vstep/listening

import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, Headphones } from "lucide-react";
import { VSTEP_LISTENING_ITEMS } from "@/data/exam-prep/vstep/listening-items";
import type { VstepListeningItem } from "@/types/vstep";

const LEVEL_BADGE: Record<string, { vi: string; bg: string; border: string; text: string }> = {
  B1: { vi: "B1", bg: "rgba(254,243,199,0.85)", border: "#fde68a", text: "#854d0e" },
  B2: { vi: "B2", bg: "rgba(254,226,226,0.85)", border: "#fecaca", text: "#9b1c1c" },
};
const SECTION_LABEL: Record<string, string> = {
  short_conversation: "Hội thoại", announcement: "Thông báo", talk: "Bài nói",
  lecture: "Bài giảng", discussion: "Thảo luận", news_report: "Tin tức",
};

function ItemCard({ item }: { item: VstepListeningItem }) {
  const [open, setOpen] = useState(false);
  const b = LEVEL_BADGE[item.level] ?? LEVEL_BADGE.B1;
  return (
    <div style={{ borderRadius: 14, border: "1px solid rgba(0,0,0,0.08)", background: "white", overflow: "hidden" }}>
      <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} style={{ width: "100%", padding: "14px 16px", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
          <span style={{ padding: "2px 10px", borderRadius: 9999, background: b.bg, color: b.text, border: `1px solid ${b.border}`, fontSize: 11, fontWeight: 800 }}>VSTEP {b.vi}</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(0,0,0,0.50)" }}>{SECTION_LABEL[item.section] ?? item.section}</span>
          <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(0,0,0,0.40)", marginLeft: "auto" }}>{item.estimatedDurationSec}s</span>
        </div>
        <div style={{ fontSize: 16, fontWeight: 900, color: "rgba(15,23,42,0.92)", marginTop: 4 }}>{item.title_vi}</div>
        <div style={{ fontSize: 12, fontWeight: 600, color: "rgba(0,0,0,0.50)" }}>{item.title_en}</div>
      </button>
      {open && (
        <div style={{ padding: "0 16px 16px", borderTop: "1px solid rgba(0,0,0,0.06)" }}>
          <div style={{ marginTop: 12, padding: "10px 14px", borderRadius: 12, background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.20)", fontSize: 13, fontWeight: 700, color: "rgba(146,64,14,0.85)", textAlign: "center" }}>
            🔊 Audio đang được chuẩn bị · Audio coming soon (Tui 3b)
          </div>
          <pre style={{ margin: "12px 0 0", padding: 12, borderRadius: 10, background: "rgba(248,250,252,0.95)", border: "1px solid rgba(0,0,0,0.06)", whiteSpace: "pre-wrap", fontFamily: "inherit", fontSize: 13, lineHeight: 1.6, color: "rgba(15,23,42,0.92)" }}>
            {item.transcript}
          </pre>
          <div style={{ marginTop: 12 }}>
            <h4 style={{ margin: "0 0 8px", fontSize: 13, fontWeight: 800, color: "rgba(0,0,0,0.55)", letterSpacing: 0.3 }}>Câu hỏi · Questions</h4>
            <ol style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
              {item.questions.map((q) => (
                <li key={q.number} style={{ padding: "10px 12px", borderRadius: 10, background: "rgba(248,250,252,0.95)", border: "1px solid rgba(0,0,0,0.06)" }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: "rgba(15,23,42,0.96)", marginBottom: 6 }}>{q.number}. {q.question_vi}</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {q.options?.map((opt, oi) => {
                      const letter = String.fromCharCode(65 + oi);
                      const isCorrect = letter === q.answer;
                      return <span key={oi} style={{ padding: "3px 10px", borderRadius: 9999, background: isCorrect ? "rgba(16,185,129,0.12)" : "rgba(0,0,0,0.04)", border: isCorrect ? "1px solid rgba(16,185,129,0.35)" : "1px solid rgba(0,0,0,0.08)", fontSize: 12, fontWeight: isCorrect ? 800 : 600, color: isCorrect ? "rgba(6,95,70,0.94)" : "rgba(0,0,0,0.66)" }}>{letter}. {opt}{isCorrect ? " ✓" : ""}</span>;
                    })}
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div style={{ marginTop: 12, padding: "10px 14px", borderRadius: 10, background: "rgba(255,251,235,0.85)", border: "1px solid #fde68a" }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: "rgba(120,53,15,0.90)", marginBottom: 6 }}>Mẹo cho người Việt</div>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12, lineHeight: 1.6, color: "rgba(0,0,0,0.72)" }}>
              {item.vietnameseLearnerTips.map((t, i) => <li key={i}>{t}</li>)}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default function VSTEPListeningPage() {
  const [levelFilter, setLevelFilter] = useState<"all" | "B1" | "B2">("all");
  const items = useMemo(() => {
    if (levelFilter === "all") return VSTEP_LISTENING_ITEMS;
    return VSTEP_LISTENING_ITEMS.filter((i) => i.level === levelFilter);
  }, [levelFilter]);

  return (
    <div style={{ maxWidth: 880, margin: "0 auto", padding: "20px 16px 60px" }}>
      <header style={{ marginBottom: 18 }}>
        <Link to="/exam/vstep" style={{ display: "inline-flex", alignItems: "center", gap: 4, color: "rgba(0,0,0,0.50)", fontSize: 12, fontWeight: 700, textDecoration: "none", marginBottom: 10 }}>
          <ChevronLeft size={14} />VSTEP · Quay lại
        </Link>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 950, letterSpacing: -0.5, color: "rgba(15,23,42,0.94)" }}>
          <Headphones size={22} style={{ verticalAlign: "middle", marginRight: 6 }} />
          VSTEP Listening · Luyện nghe
        </h1>
        <p style={{ marginTop: 6, fontSize: 13, fontWeight: 600, color: "rgba(0,0,0,0.50)" }}>12 bài nghe B1 + B2 — hội thoại, thông báo, bài giảng, tin tức</p>
      </header>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {(["all", "B1", "B2"] as const).map((l) => (
          <button key={l} type="button" onClick={() => setLevelFilter(l)} style={{
            padding: "6px 16px", borderRadius: 9999,
            border: levelFilter === l ? "1px solid rgba(99,102,241,0.55)" : "1px solid rgba(0,0,0,0.12)",
            background: levelFilter === l ? "rgba(99,102,241,0.10)" : "white",
            color: levelFilter === l ? "rgba(67,56,202,0.96)" : "rgba(0,0,0,0.62)",
            fontSize: 12, fontWeight: 800, cursor: "pointer",
          }}>
            {l === "all" ? "Tất cả" : l}
          </button>
        ))}
        <span style={{ marginLeft: "auto", fontSize: 12, fontWeight: 700, color: "rgba(0,0,0,0.45)", alignSelf: "center" }}>{items.length} bài</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {items.map((item) => <ItemCard key={item.id} item={item} />)}
      </div>
    </div>
  );
}