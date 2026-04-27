// src/pages/exam-prep/VSTEPSpeakingPage.tsx — /exam/vstep/speaking
//
// VSTEP Speaking landing page. Surfaces the 30 B1 + B2 topics from
// src/data/exam-prep/vstep/speaking-topics.ts grouped by level and
// speaking part. Each card opens a detail panel inline (no extra
// route for now — keeps the prep flow on a single page).
//
// Vietnamese-first per CLAUDE.md: VI primary, EN secondary.

import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

import {
  VSTEP_B1_TOPICS,
  VSTEP_B2_TOPICS,
  type VstepLevel,
  type VstepSpeakingTopic,
} from "@/data/exam-prep/vstep/speaking-topics";

const PART_TITLE_VI: Record<1 | 2 | 3, string> = {
  1: "Phần 1 · Giao tiếp xã hội",
  2: "Phần 2 · Thảo luận giải pháp",
  3: "Phần 3 · Phát triển chủ đề",
};
const PART_TITLE_EN: Record<1 | 2 | 3, string> = {
  1: "Part 1 · Social interaction",
  2: "Part 2 · Solution discussion",
  3: "Part 3 · Topic development",
};

function partGroups(topics: VstepSpeakingTopic[]) {
  return [1, 2, 3].map((part) => ({
    part: part as 1 | 2 | 3,
    topics: topics.filter((t) => t.part === part),
  }));
}

function LevelBadge({ level }: { level: VstepLevel }) {
  const palette =
    level === "B1"
      ? { bg: "rgba(254,243,199,0.85)", color: "#854d0e", border: "#fde68a" }
      : { bg: "rgba(254,226,226,0.85)", color: "#9b1c1c", border: "#fecaca" };
  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 10px",
        borderRadius: 9999,
        background: palette.bg,
        color: palette.color,
        border: `1px solid ${palette.border}`,
        fontSize: 11,
        fontWeight: 800,
        letterSpacing: 0.4,
      }}
    >
      VSTEP {level}
    </span>
  );
}

function TopicCard({
  topic,
  onSelect,
  isSelected,
}: {
  topic: VstepSpeakingTopic;
  onSelect: () => void;
  isSelected: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-expanded={isSelected}
      style={{
        width: "100%",
        textAlign: "left",
        background: isSelected ? "rgba(254,242,242,0.85)" : "white",
        border: `1px solid ${isSelected ? "#fecaca" : "rgba(15,23,42,0.10)"}`,
        borderRadius: 16,
        padding: "14px 16px",
        cursor: "pointer",
        boxShadow: isSelected
          ? "0 6px 18px rgba(159,18,57,0.10)"
          : "0 2px 8px rgba(15,23,42,0.04)",
        transition: "all 120ms ease",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <LevelBadge level={topic.level} />
            <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(0,0,0,0.5)" }}>
              {topic.estimated_time_minutes} min
            </span>
          </div>
          <div style={{ fontSize: 16, fontWeight: 800, color: "rgba(15,23,42,0.92)", lineHeight: 1.3 }}>
            {topic.topic_title_vi}
          </div>
          <div style={{ fontSize: 12, fontWeight: 600, color: "rgba(0,0,0,0.5)", marginTop: 2 }}>
            {topic.topic_title_en}
          </div>
          <div style={{ fontSize: 13, fontWeight: 500, color: "rgba(0,0,0,0.66)", marginTop: 6, lineHeight: 1.5 }}>
            {topic.description_vi}
          </div>
        </div>
        <ChevronRight
          size={20}
          style={{
            color: "rgba(0,0,0,0.35)",
            flexShrink: 0,
            transform: isSelected ? "rotate(90deg)" : "rotate(0deg)",
            transition: "transform 120ms ease",
          }}
        />
      </div>
    </button>
  );
}

function TopicDetail({ topic }: { topic: VstepSpeakingTopic }) {
  return (
    <div
      style={{
        marginTop: 8,
        padding: "16px 18px",
        background: "rgba(254,252,232,0.55)",
        border: "1px solid #fde68a",
        borderRadius: 16,
      }}
    >
      <h3 style={{ margin: "0 0 8px", fontSize: 14, fontWeight: 800, color: "rgba(15,23,42,0.92)" }}>
        Câu hỏi mẫu · Sample questions
      </h3>
      <ul style={{ margin: "0 0 14px", paddingLeft: 20, lineHeight: 1.6 }}>
        {topic.sample_questions.map((q, idx) => (
          <li key={idx} style={{ fontSize: 13, color: "rgba(0,0,0,0.78)" }}>
            {q}
          </li>
        ))}
      </ul>

      <h3 style={{ margin: "0 0 8px", fontSize: 14, fontWeight: 800, color: "rgba(15,23,42,0.92)" }}>
        Mẹo cho người Việt · Tips for Vietnamese speakers
      </h3>
      <ul style={{ margin: "0 0 14px", paddingLeft: 20, lineHeight: 1.6 }}>
        {topic.vietnamese_speaker_tips.map((tip, idx) => (
          <li key={idx} style={{ fontSize: 13, color: "rgba(0,0,0,0.78)" }}>
            {tip}
          </li>
        ))}
      </ul>

      <h3 style={{ margin: "0 0 8px", fontSize: 14, fontWeight: 800, color: "rgba(15,23,42,0.92)" }}>
        Từ vựng quan trọng · Key vocabulary
      </h3>
      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 14, fontSize: 13 }}>
        <thead>
          <tr style={{ textAlign: "left", color: "rgba(0,0,0,0.55)", fontSize: 11, letterSpacing: 0.4 }}>
            <th style={{ padding: "4px 6px", fontWeight: 700 }}>Từ</th>
            <th style={{ padding: "4px 6px", fontWeight: 700 }}>Nghĩa</th>
            <th style={{ padding: "4px 6px", fontWeight: 700 }}>IPA</th>
            <th style={{ padding: "4px 6px", fontWeight: 700 }}>Cấp</th>
          </tr>
        </thead>
        <tbody>
          {topic.key_vocabulary.map((v, idx) => (
            <tr key={idx} style={{ borderTop: "1px solid rgba(0,0,0,0.05)" }}>
              <td style={{ padding: "6px", fontWeight: 700, color: "rgba(15,23,42,0.92)" }}>{v.word}</td>
              <td style={{ padding: "6px", color: "rgba(0,0,0,0.78)" }}>{v.translation_vi}</td>
              <td style={{ padding: "6px", fontFamily: "monospace", color: "rgba(0,0,0,0.7)" }}>{v.pronunciation_ipa}</td>
              <td style={{ padding: "6px", color: "rgba(0,0,0,0.5)" }}>{v.level}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 style={{ margin: "0 0 8px", fontSize: 14, fontWeight: 800, color: "rgba(15,23,42,0.92)" }}>
        Tham chiếu band · Band descriptors
      </h3>
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 8 }}>
        {topic.typical_band_descriptors.map((b, idx) => (
          <div
            key={idx}
            style={{
              padding: "8px 12px",
              background: "white",
              border: "1px solid rgba(0,0,0,0.08)",
              borderRadius: 10,
              fontSize: 12,
              lineHeight: 1.5,
            }}
          >
            <div style={{ fontWeight: 800, color: "rgba(15,23,42,0.92)", marginBottom: 2 }}>{b.band}</div>
            <div style={{ color: "rgba(0,0,0,0.78)" }}>{b.criteria_vi}</div>
            <div style={{ color: "rgba(0,0,0,0.5)", marginTop: 2 }}>{b.criteria_en}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LevelSection({
  level,
  topics,
  selectedId,
  onSelect,
}: {
  level: VstepLevel;
  topics: VstepSpeakingTopic[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const groups = useMemo(() => partGroups(topics), [topics]);
  return (
    <section style={{ marginBottom: 26 }}>
      <header style={{ marginBottom: 12, display: "flex", alignItems: "center", gap: 10 }}>
        <LevelBadge level={level} />
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 900, color: "rgba(15,23,42,0.92)" }}>
          Phần Nói · Speaking section
        </h2>
      </header>
      {groups.map((g) => (
        <div key={g.part} style={{ marginBottom: 14 }}>
          <h3 style={{ margin: "0 0 8px", fontSize: 13, fontWeight: 800, color: "rgba(0,0,0,0.55)", letterSpacing: 0.3 }}>
            {PART_TITLE_VI[g.part]}
            <span style={{ fontWeight: 600, color: "rgba(0,0,0,0.4)", marginLeft: 8 }}>
              · {PART_TITLE_EN[g.part]}
            </span>
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 10 }}>
            {g.topics.map((topic) => (
              <div key={topic.id}>
                <TopicCard
                  topic={topic}
                  isSelected={selectedId === topic.id}
                  onSelect={() => onSelect(topic.id)}
                />
                {selectedId === topic.id ? <TopicDetail topic={topic} /> : null}
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}

export default function VSTEPSpeakingPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSelect = (id: string) =>
    setSelectedId((current) => (current === id ? null : id));

  return (
    <div style={{ maxWidth: 880, margin: "0 auto", padding: "20px 16px 60px" }}>
      <header style={{ marginBottom: 20 }}>
        <Link
          to="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            color: "rgba(0,0,0,0.55)",
            fontSize: 12,
            fontWeight: 700,
            textDecoration: "none",
            marginBottom: 12,
          }}
        >
          <ChevronLeft size={14} />
          Trang chủ · Home
        </Link>
        <h1
          style={{
            margin: 0,
            fontSize: 28,
            fontWeight: 950,
            letterSpacing: -0.5,
            color: "rgba(15,23,42,0.94)",
          }}
        >
          VSTEP Speaking · Luyện nói VSTEP
        </h1>
        <p style={{ marginTop: 8, fontSize: 14, lineHeight: 1.55, color: "rgba(0,0,0,0.66)" }}>
          MercyBlade là app học tiếng Anh tập trung riêng vào VSTEP — theo đúng
          định dạng Bộ Giáo dục và Đào tạo (Thông tư 23/2017/TT-BGDĐT). 30 chủ
          đề Speaking, 15 cấp B1 và 15 cấp B2, cùng mẹo riêng cho người Việt.
        </p>
        <p style={{ marginTop: 4, fontSize: 12, color: "rgba(0,0,0,0.45)", lineHeight: 1.5 }}>
          MercyBlade is the English-learning app focused on VSTEP — matching
          the MoET specification (Circular 23/2017/TT-BGDĐT). 30 Speaking
          topics across B1 + B2, with Vietnamese-speaker-specific tips.
        </p>
      </header>

      <LevelSection
        level="B1"
        topics={VSTEP_B1_TOPICS}
        selectedId={selectedId}
        onSelect={handleSelect}
      />
      <LevelSection
        level="B2"
        topics={VSTEP_B2_TOPICS}
        selectedId={selectedId}
        onSelect={handleSelect}
      />
    </div>
  );
}
