// src/pages/speech/SpeechHistoryPage.tsx
//
// Route: /speech/history — "My Pronunciation History / Lịch sử phát âm của tôi".
//
// Top block: big average score + 7/30/90-day windows + trend arrow.
// Middle:    newest-first attempt list with tap-to-expand word breakdown.
//            Paginated 20 rows at a time via a Load-more button.
// Bottom:    CTA back to /speak.
//
// Feature-flag gated: pronunciationScoringEnabled. Off → redirect to /.
// Same gate as /speak — keep the feature invisible until launch.

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { ChevronDown, ChevronRight } from "lucide-react";

import { useFeatureFlag } from "@/hooks/useFeatureFlag";
import {
  getAttempts,
  getUserStats,
  type SpeechAttemptRow,
  type UserPronunciationStats,
  EMPTY_STATS,
} from "@/services/speechHistory";

// ── Styling tokens (match SpeechDrillPage / AccountPage palette) ──────

const wrap: React.CSSProperties = {
  width: "100%",
  minHeight: "calc(100vh - 72px)",
  padding: "20px 16px 80px",
  display: "flex",
  justifyContent: "center",
};

const column: React.CSSProperties = {
  width: "100%",
  maxWidth: 680,
  display: "flex",
  flexDirection: "column",
  gap: 16,
};

const cardStyle: React.CSSProperties = {
  border: "1px solid rgba(0,0,0,0.10)",
  borderRadius: 20,
  padding: 20,
  background: "white",
  boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
};

const heading: React.CSSProperties = {
  fontSize: 22,
  fontWeight: 900,
  letterSpacing: -0.3,
  margin: 0,
  color: "rgba(10,10,10,0.94)",
};

const headingVi: React.CSSProperties = {
  marginTop: 4,
  fontSize: 13,
  fontWeight: 500,
  color: "#94a3b8",
};

const primaryBtn: React.CSSProperties = {
  background: "#111827",
  color: "white",
  borderRadius: 9999,
  minHeight: 44,
  padding: "0 22px",
  fontWeight: 700,
  fontSize: 14,
  border: "none",
  cursor: "pointer",
};

const secondaryBtn: React.CSSProperties = {
  background: "white",
  color: "#111827",
  borderRadius: 9999,
  minHeight: 40,
  padding: "0 18px",
  fontWeight: 600,
  fontSize: 13,
  border: "1px solid rgba(0,0,0,0.12)",
  cursor: "pointer",
};

const PAGE_SIZE = 20;

// ── Colour helpers ─────────────────────────────────────────────────────

function scoreColor(n: number | null): string {
  if (n === null) return "#94a3b8";
  if (n >= 80) return "#059669"; // green
  if (n >= 60) return "#d97706"; // amber
  return "#dc2626"; // red
}

function scorePillStyle(n: number | null): React.CSSProperties {
  const base = scoreColor(n);
  return {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 42,
    padding: "4px 10px",
    borderRadius: 9999,
    background: `${base}14`, // 8% alpha
    color: base,
    fontWeight: 800,
    fontSize: 13,
    fontVariantNumeric: "tabular-nums",
  };
}

// ── Time helpers ───────────────────────────────────────────────────────

function relativeTime(isoString: string): { en: string; vi: string } {
  const then = new Date(isoString).getTime();
  if (!Number.isFinite(then)) return { en: "just now", vi: "vừa xong" };
  const diffSec = Math.max(0, Math.round((Date.now() - then) / 1000));

  if (diffSec < 60) return { en: "just now", vi: "vừa xong" };
  const diffMin = Math.round(diffSec / 60);
  if (diffMin < 60) {
    return {
      en: `${diffMin} min${diffMin === 1 ? "" : "s"} ago`,
      vi: `${diffMin} phút trước`,
    };
  }
  const diffHr = Math.round(diffMin / 60);
  if (diffHr < 24) {
    return {
      en: `${diffHr} hr${diffHr === 1 ? "" : "s"} ago`,
      vi: `${diffHr} giờ trước`,
    };
  }
  const diffDay = Math.round(diffHr / 24);
  if (diffDay === 1) return { en: "yesterday", vi: "hôm qua" };
  if (diffDay < 7) return { en: `${diffDay} days ago`, vi: `${diffDay} ngày trước` };
  const diffWk = Math.round(diffDay / 7);
  if (diffWk < 5) {
    return {
      en: `${diffWk} week${diffWk === 1 ? "" : "s"} ago`,
      vi: `${diffWk} tuần trước`,
    };
  }
  const d = new Date(isoString);
  const dateStr = d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  return { en: dateStr, vi: dateStr };
}

type Trend = "improving" | "declining" | "stable" | "insufficient";

function computeTrend(stats: UserPronunciationStats): Trend {
  if (stats.avg_score_7d === null || stats.avg_score_30d === null) {
    return "insufficient";
  }
  const delta = stats.avg_score_7d - stats.avg_score_30d;
  if (delta > 3) return "improving";
  if (delta < -3) return "declining";
  return "stable";
}

function TrendBadge({ trend }: { trend: Trend }) {
  if (trend === "insufficient") {
    return (
      <span style={{ fontSize: 12, color: "#94a3b8" }}>
        Not enough data yet · Chưa đủ dữ liệu
      </span>
    );
  }
  const label =
    trend === "improving"
      ? { en: "Improving 🔥", vi: "Đang tiến bộ 🔥", a11y: "Improving", color: "#059669" }
      : trend === "declining"
        ? { en: "Room to improve", vi: "Còn có thể tiến bộ hơn", a11y: "Room to improve", color: "#dc2626" }
        : { en: "Stable ✓", vi: "Ổn định ✓", a11y: "Stable", color: "#64748b" };
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        fontSize: 13,
        color: label.color,
        fontWeight: 700,
      }}
      aria-label={`Trend: ${label.a11y}`}
    >
      {label.en} · {label.vi}
    </span>
  );
}

// ── Component ──────────────────────────────────────────────────────────

export default function SpeechHistoryPage() {
  const navigate = useNavigate();
  const { enabled, loading: flagLoading } = useFeatureFlag(
    "pronunciationScoringEnabled",
    false,
  );

  const [stats, setStats] = useState<UserPronunciationStats>(EMPTY_STATS);
  const [attempts, setAttempts] = useState<SpeechAttemptRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const loadInitial = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsResult, firstPage] = await Promise.all([
        getUserStats(),
        getAttempts({ limit: PAGE_SIZE + 1, offset: 0 }),
      ]);
      setStats(statsResult);
      const rows = firstPage.slice(0, PAGE_SIZE);
      setAttempts(rows);
      setHasMore(firstPage.length > PAGE_SIZE);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!flagLoading && enabled) void loadInitial();
  }, [flagLoading, enabled, loadInitial]);

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const next = await getAttempts({
        limit: PAGE_SIZE + 1,
        offset: attempts.length,
      });
      setAttempts((prev) => [...prev, ...next.slice(0, PAGE_SIZE)]);
      setHasMore(next.length > PAGE_SIZE);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoadingMore(false);
    }
  }, [attempts.length, hasMore, loadingMore]);

  const trend = useMemo(() => computeTrend(stats), [stats]);

  if (flagLoading) {
    return (
      <div style={wrap}>
        <div style={column}>
          <p style={{ color: "#64748b" }}>Loading… · Đang tải…</p>
        </div>
      </div>
    );
  }
  if (!enabled) return <Navigate to="/" replace />;

  const hasAnyAttempts = stats.attempts_90d > 0 || attempts.length > 0;

  return (
    <div style={wrap}>
      <div style={column}>
        <header>
          <h1 style={heading}>My Pronunciation History</h1>
          <div style={headingVi}>Lịch sử phát âm của tôi</div>
        </header>

        {error ? (
          <div
            role="alert"
            style={{
              ...cardStyle,
              borderColor: "#fecaca",
              background: "#fef2f2",
              color: "#991b1b",
              fontSize: 13,
            }}
          >
            Failed to load: {error}
          </div>
        ) : null}

        {loading ? (
          <div style={{ ...cardStyle, color: "#64748b", fontSize: 13 }}>
            Loading… · Đang tải…
          </div>
        ) : null}

        {/* STATS */}
        {!loading && hasAnyAttempts ? (
          <section style={cardStyle} aria-label="Pronunciation statistics">
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: 0.4,
                color: "rgba(0,0,0,0.55)",
              }}
            >
              Average last 90 days · Điểm trung bình 90 ngày qua
            </div>
            <div
              style={{
                marginTop: 6,
                fontSize: 52,
                fontWeight: 950,
                letterSpacing: -1.5,
                lineHeight: 1,
                color: scoreColor(stats.avg_score_90d),
              }}
              aria-label={
                stats.avg_score_90d !== null
                  ? `Average score ${stats.avg_score_90d} out of 100`
                  : "Average score unavailable"
              }
            >
              {stats.avg_score_90d ?? "—"}
            </div>

            <div style={{ marginTop: 12 }}>
              <TrendBadge trend={trend} />
            </div>

            <div
              style={{
                marginTop: 18,
                display: "grid",
                gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                gap: 10,
              }}
            >
              <StatCell
                labelEn="Last 7 days"
                labelVi="7 ngày gần nhất"
                attempts={stats.attempts_7d}
                avg={stats.avg_score_7d}
              />
              <StatCell
                labelEn="Last 30 days"
                labelVi="30 ngày gần nhất"
                attempts={stats.attempts_30d}
                avg={stats.avg_score_30d}
              />
              <StatCell
                labelEn="Total attempts"
                labelVi="Tổng số lần luyện"
                attempts={stats.attempts_90d}
                avg={stats.avg_score_90d}
              />
            </div>
          </section>
        ) : null}

        {/* ATTEMPT LIST */}
        {!loading && attempts.length > 0 ? (
          <section style={cardStyle} aria-label="Recent attempts">
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: 0.4,
                color: "rgba(0,0,0,0.55)",
                marginBottom: 10,
              }}
            >
              Recent attempts · Lần thử gần đây
            </div>

            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: 6,
              }}
            >
              {attempts.map((row) => (
                <AttemptRow
                  key={row.id}
                  row={row}
                  expanded={expanded.has(row.id)}
                  onToggle={() =>
                    setExpanded((prev) => {
                      const next = new Set(prev);
                      if (next.has(row.id)) next.delete(row.id);
                      else next.add(row.id);
                      return next;
                    })
                  }
                />
              ))}
            </ul>

            {hasMore ? (
              <div style={{ marginTop: 14, textAlign: "center" }}>
                <button
                  type="button"
                  style={secondaryBtn}
                  onClick={() => void loadMore()}
                  disabled={loadingMore}
                >
                  {loadingMore ? "Loading…" : "Load more attempts · Tải thêm"}
                </button>
              </div>
            ) : null}
          </section>
        ) : null}

        {/* EMPTY STATE */}
        {!loading && !hasAnyAttempts ? (
          <section
            style={{ ...cardStyle, textAlign: "center" }}
            data-testid="speech-history-empty"
          >
            <div style={{ fontSize: 48 }} aria-hidden>
              🎤
            </div>
            <div
              style={{
                marginTop: 8,
                fontSize: 16,
                fontWeight: 800,
                whiteSpace: "pre-line",
              }}
            >
              {"You haven't practiced pronunciation yet.\nGo to the Speak page to record your first attempt."}
            </div>
            <div
              style={{
                marginTop: 8,
                fontSize: 13,
                color: "#94a3b8",
                whiteSpace: "pre-line",
              }}
            >
              {"Bạn chưa luyện phát âm lần nào.\nHãy vào trang Speak để ghi âm lần đầu nhé!"}
            </div>
          </section>
        ) : null}

        {/* CTA */}
        {!loading ? (
          <div style={{ marginTop: 8, textAlign: "center" }}>
            <button
              type="button"
              style={primaryBtn}
              onClick={() => navigate("/speak")}
              aria-label="Practice more"
            >
              Practice more · Luyện thêm ngay
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

// ── Small sub-components ───────────────────────────────────────────────

function StatCell({
  labelEn,
  labelVi,
  attempts,
  avg,
}: {
  labelEn: string;
  labelVi: string;
  attempts: number;
  avg: number | null;
}) {
  return (
    <div
      style={{
        borderRadius: 12,
        background: "#f8fafc",
        border: "1px solid rgba(0,0,0,0.04)",
        padding: "10px 12px",
        display: "flex",
        flexDirection: "column",
        gap: 4,
      }}
    >
      <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(0,0,0,0.55)" }}>
        {labelEn}
      </div>
      <div style={{ fontSize: 10, color: "#94a3b8" }}>{labelVi}</div>
      <div
        style={{
          marginTop: 4,
          fontSize: 20,
          fontWeight: 900,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {attempts}
      </div>
      <div
        style={{
          fontSize: 12,
          color: scoreColor(avg),
          fontWeight: 700,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        avg {avg ?? "—"}
      </div>
    </div>
  );
}

function AttemptRow({
  row,
  expanded,
  onToggle,
}: {
  row: SpeechAttemptRow;
  expanded: boolean;
  onToggle: () => void;
}) {
  const time = relativeTime(row.attempted_at);
  const truncated =
    row.target_text.length > 48
      ? `${row.target_text.slice(0, 46).trim()}…`
      : row.target_text;

  return (
    <li
      style={{
        borderRadius: 12,
        border: "1px solid rgba(0,0,0,0.06)",
        background: expanded ? "#f8fafc" : "white",
      }}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={expanded}
        aria-label={`Attempt from ${time.en}: ${row.target_text}`}
        data-testid="attempt-row-toggle"
        style={{
          width: "100%",
          display: "grid",
          gridTemplateColumns: "auto 1fr auto auto",
          alignItems: "center",
          gap: 10,
          padding: "10px 12px",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <span aria-hidden>
          {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </span>
        <span
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            fontSize: 14,
            color: "rgba(0,0,0,0.85)",
          }}
        >
          {truncated}
        </span>
        <span style={{ fontSize: 11, color: "#94a3b8", whiteSpace: "nowrap" }}>
          {time.en}
        </span>
        <span style={scorePillStyle(row.overall_score)}>
          {row.overall_score ?? "—"}
        </span>
      </button>

      {expanded ? (
        <div style={{ padding: "0 12px 12px", fontSize: 13, color: "#475569" }}>
          <div style={{ marginBottom: 6 }}>
            <strong>Target:</strong> {row.target_text}
          </div>
          {row.transcript ? (
            <div style={{ marginBottom: 6 }}>
              <strong>Heard:</strong> {row.transcript}
            </div>
          ) : null}
          {row.word_scores.length > 0 ? (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {row.word_scores.map((w, i) => {
                const color =
                  typeof w.score === "number"
                    ? scoreColor(w.score)
                    : w.status === "correct"
                      ? "#059669"
                      : w.status === "missing"
                        ? "#dc2626"
                        : "#64748b";
                return (
                  <span
                    key={`${w.word}-${i}`}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                      padding: "3px 8px",
                      borderRadius: 9999,
                      background: `${color}14`,
                      color,
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                  >
                    {w.word}
                    {typeof w.score === "number" ? ` · ${w.score}` : null}
                  </span>
                );
              })}
            </div>
          ) : null}
        </div>
      ) : null}
    </li>
  );
}
