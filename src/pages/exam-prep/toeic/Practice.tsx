/**
 * /exam-prep/toeic — TOEIC L&R 30-item practice pack.
 *
 * Two sections (Listening, Reading), filterable by Part / topic / band.
 * Each card expands inline to show the passage, multiple-choice
 * questions, Vietnamese explanations, typical-trap warnings, and
 * vocabulary focus. No paywall — this is the marketing surface for
 * the corporate TOEIC vertical. Premium-gated timed practice lives at
 * /exam/toeic (the existing prep mode shell).
 *
 * Bilingual VI primary throughout — the audience is Vietnamese
 * learners preparing TOEIC for jobs and promotions.
 */

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Clock3, Headphones, BookOpen, AlertTriangle, Volume2, Square, RotateCcw } from "lucide-react";

import {
  TOEIC_LISTENING_ITEMS,
  TOEIC_READING_ITEMS,
  type TOEICPracticeItem,
  type TOEICPart,
  type TOEICTopic,
  type TOEICTargetBand,
} from "@/data/exam-prep/toeic/practice-items";
import { useAudioUrl } from "@/hooks/useAudioUrl";

type TabId = "listening" | "reading";

const PART_LABELS: Record<TOEICPart, { en: string; vi: string }> = {
  1: { en: "Part 1 · Photos", vi: "Phần 1 · Tranh" },
  2: { en: "Part 2 · Q-Response", vi: "Phần 2 · Hỏi-đáp" },
  3: { en: "Part 3 · Conversations", vi: "Phần 3 · Hội thoại" },
  4: { en: "Part 4 · Talks", vi: "Phần 4 · Bài nói" },
  5: { en: "Part 5 · Sentences", vi: "Phần 5 · Câu hoàn chỉnh" },
  6: { en: "Part 6 · Text completion", vi: "Phần 6 · Điền đoạn" },
  7: { en: "Part 7 · Reading", vi: "Phần 7 · Đọc hiểu" },
};

const TOPIC_LABELS: Record<TOEICTopic, string> = {
  office_communication: "Văn phòng",
  business_meeting: "Họp kinh doanh",
  travel: "Du lịch",
  dining: "Ăn uống",
  shopping: "Mua sắm",
  airport_hotel: "Sân bay - khách sạn",
  finance: "Tài chính",
  hr_recruitment: "Tuyển dụng - HR",
  marketing_advertising: "Marketing",
  logistics_shipping: "Logistics - giao nhận",
  it_support: "IT - hỗ trợ kỹ thuật",
  health_safety: "An toàn lao động",
  real_estate: "Bất động sản",
  training_workshop: "Đào tạo - hội thảo",
  product_launch: "Ra mắt sản phẩm",
  contracts_legal: "Hợp đồng - pháp lý",
  email_correspondence: "Email - thư tín",
  customer_service: "Chăm sóc khách hàng",
  maintenance_facilities: "Bảo trì - cơ sở vật chất",
};

const BAND_LABELS: Record<TOEICTargetBand, string> = {
  405: "Mục tiêu 405 (B1)",
  605: "Mục tiêu 605 (B2)",
  785: "Mục tiêu 785 (C1)",
  905: "Mục tiêu 905+ (C2)",
};

export default function Practice() {
  const [tab, setTab] = useState<TabId>("listening");
  const [partFilter, setPartFilter] = useState<TOEICPart | "all">("all");
  const [topicFilter, setTopicFilter] = useState<TOEICTopic | "all">("all");
  const [bandFilter, setBandFilter] = useState<TOEICTargetBand | "all">("all");
  const [openId, setOpenId] = useState<string | null>(null);

  const sourceItems = tab === "listening" ? TOEIC_LISTENING_ITEMS : TOEIC_READING_ITEMS;

  const items = useMemo(() => {
    return sourceItems.filter((item) => {
      if (partFilter !== "all" && item.part !== partFilter) return false;
      if (topicFilter !== "all" && item.topic !== topicFilter) return false;
      if (bandFilter !== "all" && item.level !== bandFilter) return false;
      return true;
    });
  }, [sourceItems, partFilter, topicFilter, bandFilter]);

  const availableParts = useMemo<TOEICPart[]>(() => {
    return Array.from(new Set(sourceItems.map((i) => i.part))).sort() as TOEICPart[];
  }, [sourceItems]);

  const availableTopics = useMemo<TOEICTopic[]>(() => {
    return Array.from(new Set(sourceItems.map((i) => i.topic))) as TOEICTopic[];
  }, [sourceItems]);

  return (
    <div style={{ maxWidth: 920, margin: "0 auto", padding: "20px 16px 80px" }}>
      <header style={{ marginBottom: 18 }}>
        <h1
          style={{
            margin: 0,
            fontSize: 32,
            fontWeight: 950,
            letterSpacing: -0.6,
            color: "rgba(15,23,42,0.96)",
          }}
        >
          Luyện TOEIC · TOEIC practice pack
        </h1>
        <p style={{ marginTop: 6, fontSize: 15, fontWeight: 700, color: "rgba(0,0,0,0.78)", lineHeight: 1.5 }}>
          30 bài luyện theo định dạng chính thức. Giải thích bằng tiếng Việt — tập trung vào các bẫy
          mà người Việt hay mắc.
        </p>
        <p style={{ marginTop: 4, fontSize: 13, fontWeight: 600, color: "rgba(0,0,0,0.55)", lineHeight: 1.5 }}>
          30 items modeled on the official TOEIC L&amp;R format. Vietnamese explanations focused on
          the traps Vietnamese learners hit most.
        </p>
        <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 8 }}>
          <Link
            to="/exam/toeic"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 14px",
              borderRadius: 9999,
              background: "rgba(99,102,241,0.10)",
              border: "1px solid rgba(99,102,241,0.30)",
              color: "rgba(67,56,202,0.95)",
              fontSize: 13,
              fontWeight: 800,
              textDecoration: "none",
            }}
          >
            Chế độ luyện có timer · Timed practice
            <ChevronRight size={14} aria-hidden />
          </Link>
          <Link
            to="/exam/toeic/estimator"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 14px",
              borderRadius: 9999,
              background: "rgba(16,185,129,0.10)",
              border: "1px solid rgba(16,185,129,0.30)",
              color: "rgba(6,95,70,0.95)",
              fontSize: 13,
              fontWeight: 800,
              textDecoration: "none",
            }}
          >
            Ước tính điểm · Score estimator
            <ChevronRight size={14} aria-hidden />
          </Link>
        </div>
      </header>

      {/* Tabs */}
      <div role="tablist" aria-label="TOEIC sections" style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <TabButton
          active={tab === "listening"}
          onClick={() => { setTab("listening"); setPartFilter("all"); setTopicFilter("all"); setBandFilter("all"); }}
          icon={<Headphones size={16} aria-hidden />}
          labelEn="Listening"
          labelVi="Nghe"
          count={TOEIC_LISTENING_ITEMS.length}
        />
        <TabButton
          active={tab === "reading"}
          onClick={() => { setTab("reading"); setPartFilter("all"); setTopicFilter("all"); setBandFilter("all"); }}
          icon={<BookOpen size={16} aria-hidden />}
          labelEn="Reading"
          labelVi="Đọc"
          count={TOEIC_READING_ITEMS.length}
        />
      </div>

      {/* Filters */}
      <section
        aria-label="Filters · Bộ lọc"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 10,
          marginBottom: 16,
          padding: 12,
          borderRadius: 14,
          background: "rgba(248,250,252,0.95)",
          border: "1px solid rgba(0,0,0,0.06)",
        }}
      >
        <FilterGroup label="Phần · Part">
          <select
            value={partFilter === "all" ? "all" : String(partFilter)}
            onChange={(e) => setPartFilter(e.target.value === "all" ? "all" : (Number(e.target.value) as TOEICPart))}
            style={selectStyle}
          >
            <option value="all">Tất cả · All</option>
            {availableParts.map((p) => (
              <option key={p} value={p}>
                {PART_LABELS[p].vi}
              </option>
            ))}
          </select>
        </FilterGroup>
        <FilterGroup label="Chủ đề · Topic">
          <select
            value={topicFilter}
            onChange={(e) => setTopicFilter(e.target.value as TOEICTopic | "all")}
            style={selectStyle}
          >
            <option value="all">Tất cả · All</option>
            {availableTopics.map((t) => (
              <option key={t} value={t}>
                {TOPIC_LABELS[t]}
              </option>
            ))}
          </select>
        </FilterGroup>
        <FilterGroup label="Mục tiêu điểm · Target band">
          <select
            value={bandFilter === "all" ? "all" : String(bandFilter)}
            onChange={(e) => setBandFilter(e.target.value === "all" ? "all" : (Number(e.target.value) as TOEICTargetBand))}
            style={selectStyle}
          >
            <option value="all">Tất cả · All</option>
            {([405, 605, 785, 905] as TOEICTargetBand[]).map((b) => (
              <option key={b} value={b}>
                {BAND_LABELS[b]}
              </option>
            ))}
          </select>
        </FilterGroup>
      </section>

      <p style={{ margin: "0 0 12px", fontSize: 13, fontWeight: 700, color: "rgba(0,0,0,0.62)" }}>
        {items.length} bài · {items.length} item{items.length === 1 ? "" : "s"}
      </p>

      {items.length === 0 ? (
        <div
          style={{
            padding: 24,
            borderRadius: 14,
            background: "rgba(254,249,231,0.95)",
            border: "1px solid rgba(245,158,11,0.30)",
            color: "rgba(120,53,15,0.92)",
            fontSize: 14,
            fontWeight: 700,
            textAlign: "center",
          }}
        >
          Không có bài nào khớp với bộ lọc. Bỏ bớt một filter để xem.
          <br />
          <span style={{ fontSize: 12, fontWeight: 600, opacity: 0.75 }}>
            No items match. Loosen a filter.
          </span>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {items.map((item) => (
            <PracticeItemCard
              key={item.id}
              item={item}
              expanded={openId === item.id}
              onToggle={() => setOpenId((cur) => (cur === item.id ? null : item.id))}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────

const selectStyle: React.CSSProperties = {
  width: "100%",
  padding: "8px 10px",
  borderRadius: 10,
  border: "1px solid rgba(0,0,0,0.16)",
  background: "white",
  fontSize: 13,
  fontWeight: 700,
  color: "rgba(15,23,42,0.92)",
};

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 12, fontWeight: 800, color: "rgba(0,0,0,0.62)", letterSpacing: 0.2 }}>
      {label}
      {children}
    </label>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  labelEn,
  labelVi,
  count,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  labelEn: string;
  labelVi: string;
  count: number;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      style={{
        flex: 1,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        padding: "12px 14px",
        borderRadius: 14,
        border: active ? "1px solid rgba(99,102,241,0.55)" : "1px solid rgba(0,0,0,0.10)",
        background: active ? "rgba(99,102,241,0.10)" : "white",
        color: active ? "rgba(67,56,202,0.96)" : "rgba(0,0,0,0.74)",
        fontSize: 14,
        fontWeight: 900,
        cursor: "pointer",
      }}
    >
      {icon}
      <span>{labelVi} · {labelEn}</span>
      <span
        style={{
          padding: "2px 8px",
          borderRadius: 9999,
          background: active ? "rgba(99,102,241,0.20)" : "rgba(0,0,0,0.06)",
          fontSize: 11,
          fontWeight: 800,
        }}
      >
        {count}
      </span>
    </button>
  );
}

// ────────────────────────────────────────────────────────────────────

function PracticeItemCard({
  item,
  expanded,
  onToggle,
}: {
  item: TOEICPracticeItem;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <article
      style={{
        borderRadius: 16,
        border: "1px solid rgba(0,0,0,0.08)",
        background: "white",
        boxShadow: expanded ? "0 8px 24px rgba(99,102,241,0.10)" : "0 2px 6px rgba(0,0,0,0.04)",
        overflow: "hidden",
      }}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={expanded}
        style={{
          width: "100%",
          padding: "14px 16px",
          background: "none",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
      >
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
          <Pill>{PART_LABELS[item.part].vi}</Pill>
          <Pill tone="topic">{TOPIC_LABELS[item.topic]}</Pill>
          <Pill tone="band">{BAND_LABELS[item.level]}</Pill>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 700, color: "rgba(0,0,0,0.58)" }}>
            <Clock3 size={12} aria-hidden /> {item.estimated_time_minutes} phút
          </span>
        </div>
        <div style={{ fontSize: 17, fontWeight: 900, color: "rgba(15,23,42,0.96)", letterSpacing: -0.2 }}>
          {item.title_vi}
        </div>
        <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(0,0,0,0.58)" }}>
          {item.title_en}
        </div>
      </button>

      {expanded ? <PracticeItemDetail item={item} /> : null}
    </article>
  );
}

function Pill({ children, tone = "part" }: { children: React.ReactNode; tone?: "part" | "topic" | "band" }) {
  const palette =
    tone === "topic"
      ? { bg: "rgba(20,184,166,0.10)", color: "rgba(15,118,110,0.95)", border: "rgba(20,184,166,0.25)" }
      : tone === "band"
        ? { bg: "rgba(245,158,11,0.10)", color: "rgba(146,64,14,0.95)", border: "rgba(245,158,11,0.25)" }
        : { bg: "rgba(99,102,241,0.10)", color: "rgba(67,56,202,0.95)", border: "rgba(99,102,241,0.25)" };
  return (
    <span
      style={{
        padding: "3px 9px",
        borderRadius: 9999,
        background: palette.bg,
        color: palette.color,
        border: `1px solid ${palette.border}`,
        fontSize: 11,
        fontWeight: 800,
        letterSpacing: 0.2,
      }}
    >
      {children}
    </span>
  );
}

// Part 1 items voice the photo description only — we deliberately did not
// generate audio for them (a recorded description without the photo would
// mislead learners). The audio script writes nothing to Supabase for these.
function isPart1Photo(item: TOEICPracticeItem): boolean {
  return item.section === "listening" && item.part === 1;
}

function ListeningAudioPlayer({ itemId, hasAudio }: { itemId: string; hasAudio: boolean }) {
  const { url, loading } = useAudioUrl(hasAudio ? `toeic-listening/${itemId}.mp3` : null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [errored, setErrored] = useState(false);

  // Auto-play when URL becomes available (treated as user gesture: detail
  // panel opened by click). Silently ignore if browser blocks auto-play.
  useEffect(() => {
    if (!url) return;
    setErrored(false);
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = 0;
    audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
  }, [url]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    }
  };

  const replay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = 0;
    audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
  };

  if (!hasAudio) {
    return (
      <div style={{ padding: "8px 12px", borderRadius: 10, background: "rgba(248,250,252,0.95)", border: "1px solid rgba(0,0,0,0.06)", fontSize: 12, color: "rgba(0,0,0,0.6)" }}>
        🖼️ Part 1 — yêu cầu ảnh thực tế. Bài tự luyện không kèm âm thanh; hãy đọc kỹ phần mô tả ảnh và 4 lựa chọn.
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ padding: "8px 12px", borderRadius: 10, background: "rgba(248,250,252,0.95)", border: "1px solid rgba(0,0,0,0.06)", fontSize: 12, color: "rgba(0,0,0,0.6)" }}>
        Đang tải âm thanh…
      </div>
    );
  }

  if (errored || !url) {
    return (
      <div style={{ padding: "8px 12px", borderRadius: 10, background: "rgba(254,242,242,0.95)", border: "1px solid rgba(252,165,165,0.40)", fontSize: 12, color: "rgba(127,29,29,0.86)" }}>
        Audio unavailable
      </div>
    );
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", borderRadius: 10, background: "rgba(239,246,255,0.95)", border: "1px solid rgba(59,130,246,0.30)" }}>
      <button
        type="button"
        onClick={togglePlay}
        aria-label={playing ? "Stop" : "Play"}
        style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 36, height: 36, borderRadius: 8, border: "1px solid rgba(59,130,246,0.40)", background: "rgba(255,255,255,0.96)", color: "rgba(29,78,216,0.96)", cursor: "pointer" }}
      >
        {playing ? <Square size={16} /> : <Volume2 size={16} />}
      </button>
      <button
        type="button"
        onClick={replay}
        aria-label="Replay"
        style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 36, height: 36, borderRadius: 8, border: "1px solid rgba(59,130,246,0.40)", background: "rgba(255,255,255,0.96)", color: "rgba(29,78,216,0.96)", cursor: "pointer" }}
      >
        <RotateCcw size={16} />
      </button>
      <span style={{ fontSize: 12, fontWeight: 600, color: "rgba(29,78,216,0.86)" }}>
        Phát lời thoại · Listen to the audio
      </span>
      <audio
        ref={audioRef}
        src={url}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        onError={() => {
          setErrored(true);
          setPlaying(false);
        }}
        preload="auto"
      />
    </div>
  );
}

function PracticeItemDetail({ item }: { item: TOEICPracticeItem }) {
  const passageHeader = item.section === "listening" ? "Audio script · Lời thoại" : "Passage · Đoạn văn";
  const showListeningAudio = item.section === "listening";
  const hasAudio = showListeningAudio && !isPart1Photo(item);
  return (
    <div style={{ padding: "0 16px 18px", display: "flex", flexDirection: "column", gap: 14, borderTop: "1px solid rgba(0,0,0,0.06)" }}>
      {showListeningAudio ? (
        <ListeningAudioPlayer itemId={item.id} hasAudio={hasAudio} />
      ) : null}
      <Section title={passageHeader}>
        <pre
          style={{
            margin: 0,
            padding: 12,
            borderRadius: 10,
            background: "rgba(248,250,252,0.95)",
            border: "1px solid rgba(0,0,0,0.06)",
            whiteSpace: "pre-wrap",
            fontFamily: "inherit",
            fontSize: 13,
            lineHeight: 1.6,
            color: "rgba(15,23,42,0.92)",
          }}
        >
          {item.passage_or_audio_script}
        </pre>
      </Section>

      <Section title="Câu hỏi · Questions">
        <ol style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 12 }}>
          {item.questions.map((q, qi) => (
            <li key={qi} style={{ padding: 12, borderRadius: 10, background: "rgba(248,250,252,0.95)", border: "1px solid rgba(0,0,0,0.06)" }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: "rgba(15,23,42,0.96)", marginBottom: 8 }}>
                {qi + 1}. {q.question_en}
              </div>
              <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 6 }}>
                {q.options_en.map((opt, oi) => {
                  const isCorrect = oi === q.correct_index;
                  return (
                    <li
                      key={oi}
                      style={{
                        padding: "6px 10px",
                        borderRadius: 8,
                        background: isCorrect ? "rgba(16,185,129,0.10)" : "rgba(255,255,255,0.95)",
                        border: isCorrect ? "1px solid rgba(16,185,129,0.40)" : "1px solid rgba(0,0,0,0.06)",
                        fontSize: 13,
                        fontWeight: isCorrect ? 800 : 600,
                        color: isCorrect ? "rgba(6,95,70,0.96)" : "rgba(0,0,0,0.78)",
                      }}
                    >
                      <span style={{ display: "inline-block", width: 22, fontWeight: 900 }}>
                        {String.fromCharCode(65 + oi)}.
                      </span>
                      {opt}
                      {isCorrect ? (
                        <span style={{ marginLeft: 8, fontSize: 11, fontWeight: 800, color: "rgba(6,95,70,0.85)" }}>
                          ✓ Đáp án đúng
                        </span>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
              <div
                style={{
                  marginTop: 8,
                  padding: 10,
                  borderRadius: 8,
                  background: "rgba(255,251,235,0.95)",
                  border: "1px solid rgba(245,158,11,0.30)",
                  fontSize: 13,
                  fontWeight: 600,
                  color: "rgba(120,53,15,0.94)",
                  lineHeight: 1.55,
                }}
              >
                <strong style={{ fontWeight: 900 }}>Giải thích:</strong> {q.explanation_vi}
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section title="Bẫy thường gặp · Typical traps" icon={<AlertTriangle size={14} aria-hidden />}>
        <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, lineHeight: 1.6, color: "rgba(0,0,0,0.78)" }}>
          {item.typical_traps.map((trap, ti) => (
            <li key={ti}>{trap}</li>
          ))}
        </ul>
      </Section>

      <Section title="Từ vựng trọng tâm · Vocabulary focus">
        <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
          {item.vocabulary_focus.map((v, vi) => (
            <li
              key={vi}
              style={{
                padding: 10,
                borderRadius: 8,
                background: "rgba(248,250,252,0.95)",
                border: "1px solid rgba(0,0,0,0.06)",
              }}
            >
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "baseline" }}>
                <strong style={{ fontSize: 14, fontWeight: 900, color: "rgba(15,23,42,0.96)" }}>{v.word}</strong>
                <span style={{ fontSize: 12, fontWeight: 600, color: "rgba(0,0,0,0.55)", fontStyle: "italic" }}>
                  {v.ipa}
                </span>
                <span style={{ fontSize: 13, fontWeight: 700, color: "rgba(67,56,202,0.94)" }}>
                  → {v.vi_translation}
                </span>
              </div>
              <div style={{ marginTop: 4, fontSize: 12, fontWeight: 600, color: "rgba(0,0,0,0.62)" }}>
                Đi cùng: {v.common_collocations.join(" · ")}
              </div>
            </li>
          ))}
        </ul>
      </Section>

      {/* Topic-detail page link — gives crawlers an indexable surface
          for this item beyond the inline expand-only treatment. */}
      <div style={{ marginTop: 4, textAlign: "right" }}>
        <Link
          to={`/toeic/practice/${item.id}`}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            color: "#1e3a8a",
            fontSize: 13,
            fontWeight: 700,
            textDecoration: "none",
          }}
          aria-label={`Open TOEIC topic page for ${item.title_en}`}
        >
          Đọc chi tiết · Read full guide
          <ChevronRight size={14} aria-hidden />
        </Link>
      </div>
    </div>
  );
}

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h3
        style={{
          margin: "0 0 8px",
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          fontSize: 13,
          fontWeight: 900,
          letterSpacing: 0.4,
          textTransform: "uppercase",
          color: "rgba(0,0,0,0.55)",
        }}
      >
        {icon}
        {title}
      </h3>
      {children}
    </section>
  );
}
