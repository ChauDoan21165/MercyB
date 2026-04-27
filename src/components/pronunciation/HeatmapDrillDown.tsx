// Drill-down panel for a single (day, phoneme) cell. Shows every
// attempt that contributed to the cell, newest first, with each
// attempt's overall score, the per-phoneme average for that attempt,
// and the target text + transcript.
//
// Lazy-fetches when (day, phoneme) changes; the panel never owns its
// own visibility (parent decides whether to render us at all).

import React, { useEffect, useState } from "react";

import {
  getHeatmapDrillDown,
  type HeatmapDrillDownAttempt,
} from "@/lib/pronunciation/phonemeHeatmap";
import { colorForScore } from "./PhonemeHeatmap";

export type HeatmapDrillDownProps = {
  userId: string | null;
  day: string;
  phoneme: string;
  onClose?: () => void;
};

export function HeatmapDrillDown({
  userId,
  day,
  phoneme,
  onClose,
}: HeatmapDrillDownProps) {
  const [attempts, setAttempts] = useState<HeatmapDrillDownAttempt[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) {
      setAttempts([]);
      return;
    }
    let alive = true;
    setLoading(true);
    getHeatmapDrillDown(userId, day, phoneme)
      .then((rows) => {
        if (!alive) return;
        setAttempts(rows);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [userId, day, phoneme]);

  const best = attempts[0]
    ? attempts.reduce((acc, a) =>
        a.phonemeAverage > acc.phonemeAverage ? a : acc,
      attempts[0])
    : null;
  const worst = attempts[0]
    ? attempts.reduce((acc, a) =>
        a.phonemeAverage < acc.phonemeAverage ? a : acc,
      attempts[0])
    : null;

  return (
    <div style={panelStyle} role="region" aria-label={`Chi tiết · Day detail · ${day} · /${phoneme}/`}>
      <header style={headerStyle}>
        <div>
          <div style={titleViStyle}>
            {day} · âm /{phoneme}/
          </div>
          <div style={titleEnStyle}>
            {day} · /{phoneme}/ · {attempts.length} lần thử · attempts
          </div>
        </div>
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng · Close"
            style={closeBtnStyle}
            data-testid="heatmap-drill-close"
          >
            ✕
          </button>
        ) : null}
      </header>

      {loading ? (
        <div style={emptyStyle}>Đang tải… · Loading…</div>
      ) : attempts.length === 0 ? (
        <div style={emptyStyle}>
          Không tìm thấy lần thử nào. · No attempts found for this cell.
        </div>
      ) : (
        <>
          {best && worst && best.id !== worst.id ? (
            <div style={highlightRowStyle}>
              <BestWorstChip
                label_vi="Tốt nhất"
                label_en="Best"
                score={best.phonemeAverage}
              />
              <BestWorstChip
                label_vi="Thấp nhất"
                label_en="Lowest"
                score={worst.phonemeAverage}
              />
            </div>
          ) : null}

          <ul style={listStyle}>
            {attempts.map((a) => (
              <li key={a.id} style={attemptRowStyle}>
                <span
                  aria-hidden
                  style={{
                    ...scoreDotStyle,
                    background: colorForScore(a.phonemeAverage),
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={attemptTextStyle}>
                    {a.targetText ?? a.transcript ?? "(không có văn bản)"}
                  </div>
                  <div style={attemptMetaStyle}>
                    {a.phonemeAverage}/100 · {a.phonemeAttemptCount} mẫu
                    {a.overallScore !== null
                      ? ` · tổng ${a.overallScore}/100`
                      : ""}
                  </div>
                </div>
                <span style={timeStyle}>{formatTime(a.attemptedAt)}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

function BestWorstChip({
  label_vi,
  label_en,
  score,
}: {
  label_vi: string;
  label_en: string;
  score: number;
}) {
  return (
    <div style={chipStyle}>
      <span
        aria-hidden
        style={{ ...scoreDotStyle, background: colorForScore(score) }}
      />
      <div style={{ display: "flex", flexDirection: "column" }}>
        <span style={{ fontSize: 11, fontWeight: 800, color: "rgba(15,23,42,0.85)" }}>
          {label_vi} · {label_en}
        </span>
        <span style={{ fontSize: 11, color: "rgba(0,0,0,0.65)" }}>
          {score}/100
        </span>
      </div>
    </div>
  );
}

function formatTime(iso: string): string {
  try {
    return new Date(iso).toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso.slice(11, 16);
  }
}

// ── Styles ───────────────────────────────────────────────────────────────

const panelStyle: React.CSSProperties = {
  marginTop: 12,
  padding: 12,
  borderRadius: 12,
  background: "white",
  border: "1px solid rgba(0,0,0,0.08)",
  boxShadow: "0 4px 12px rgba(15,23,42,0.04)",
};

const headerStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: 12,
  marginBottom: 10,
};

const titleViStyle: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 800,
  color: "rgba(15,23,42,0.92)",
};

const titleEnStyle: React.CSSProperties = {
  fontSize: 11,
  color: "rgba(0,0,0,0.55)",
  marginTop: 2,
};

const closeBtnStyle: React.CSSProperties = {
  background: "transparent",
  border: "1px solid rgba(0,0,0,0.12)",
  borderRadius: 9999,
  padding: "2px 8px",
  fontSize: 12,
  cursor: "pointer",
  color: "#475569",
};

const emptyStyle: React.CSSProperties = {
  fontSize: 12,
  color: "rgba(0,0,0,0.55)",
  padding: "12px 4px",
};

const listStyle: React.CSSProperties = {
  margin: 0,
  padding: 0,
  listStyle: "none",
  display: "flex",
  flexDirection: "column",
  gap: 8,
};

const attemptRowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  padding: "8px 10px",
  borderRadius: 8,
  background: "rgba(0,0,0,0.025)",
};

const scoreDotStyle: React.CSSProperties = {
  width: 10,
  height: 10,
  borderRadius: 9999,
  flexShrink: 0,
};

const attemptTextStyle: React.CSSProperties = {
  fontSize: 13,
  color: "rgba(15,23,42,0.85)",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const attemptMetaStyle: React.CSSProperties = {
  fontSize: 11,
  color: "rgba(0,0,0,0.55)",
  marginTop: 2,
};

const timeStyle: React.CSSProperties = {
  fontSize: 11,
  color: "rgba(0,0,0,0.45)",
  flexShrink: 0,
};

const highlightRowStyle: React.CSSProperties = {
  display: "flex",
  gap: 10,
  marginBottom: 10,
  flexWrap: "wrap",
};

const chipStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  padding: "6px 10px",
  borderRadius: 9999,
  background: "rgba(99,102,241,0.06)",
  border: "1px solid rgba(99,102,241,0.20)",
};

export default HeatmapDrillDown;
