// Manual score estimator. Learner enters per-section correct/total and
// the component reports an estimated TOEIC score + CEFR band. Useful
// for learners coming back from a paper test or a different platform
// who want to see "where am I right now?" without re-doing 200 q.

import React, { useMemo, useState } from "react";

import { TOEIC_SECTIONS } from "@/data/exam-prep/toeic/structure";
import {
  estimateTOEICScore,
  type TOEICScoreEstimate,
} from "@/data/exam-prep/toeic/score-bands";

type Row = { sectionId: string; correct: string; total: string };

export default function TOEICScoreEstimator() {
  const [rows, setRows] = useState<Row[]>(() =>
    TOEIC_SECTIONS.map((s) => ({
      sectionId: s.id,
      correct: "",
      total: String(s.questionCount),
    })),
  );

  const estimate: TOEICScoreEstimate | null = useMemo(() => {
    const parsed = rows
      .map((r) => ({
        sectionId: r.sectionId,
        correct: Number(r.correct),
        total: Number(r.total),
      }))
      .filter(
        (r) =>
          Number.isFinite(r.correct) &&
          Number.isFinite(r.total) &&
          r.total > 0,
      );
    if (parsed.length === 0) return null;
    return estimateTOEICScore(parsed);
  }, [rows]);

  const updateRow = (idx: number, patch: Partial<Row>) => {
    setRows((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], ...patch };
      return next;
    });
  };

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "20px 16px 60px" }}>
      <h1 style={{ margin: 0, fontSize: 26, fontWeight: 950 }}>
        Score estimator · Ước tính điểm
      </h1>
      <p style={{ marginTop: 6, fontSize: 14, color: "rgba(0,0,0,0.66)" }}>
        Enter your correct answers per section. Skip a section to leave it
        out of the estimate.
      </p>
      <p style={{ marginTop: 2, fontSize: 12, color: "rgba(0,0,0,0.45)" }}>
        Nhập số câu đúng cho mỗi phần. Bỏ qua phần nào nếu bạn không làm.
      </p>

      <table
        style={{
          width: "100%",
          marginTop: 16,
          borderCollapse: "separate",
          borderSpacing: 0,
        }}
      >
        <thead>
          <tr>
            <th style={th}>Section · Phần</th>
            <th style={th}>Correct · Đúng</th>
            <th style={th}>Total · Tổng</th>
          </tr>
        </thead>
        <tbody>
          {TOEIC_SECTIONS.map((s, idx) => (
            <tr key={s.id}>
              <td style={td}>
                <div style={{ fontWeight: 800 }}>{s.name_en}</div>
                <div style={{ fontSize: 12, color: "rgba(99,102,241,0.75)" }}>
                  {s.name_vi}
                </div>
              </td>
              <td style={td}>
                <input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  max={s.questionCount}
                  value={rows[idx].correct}
                  onChange={(e) =>
                    updateRow(idx, { correct: e.target.value })
                  }
                  placeholder="0"
                  style={input}
                />
              </td>
              <td style={td}>
                <input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  value={rows[idx].total}
                  onChange={(e) => updateRow(idx, { total: e.target.value })}
                  style={input}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {estimate && (
        <div
          style={{
            marginTop: 22,
            padding: "16px 18px",
            borderRadius: 16,
            background:
              "linear-gradient(150deg, rgba(238,242,255,0.94), rgba(252,252,255,0.96))",
            border: "1px solid rgba(99,102,241,0.20)",
          }}
        >
          <div
            style={{
              fontSize: 12,
              fontWeight: 800,
              textTransform: "uppercase",
              color: "rgba(67,56,202,0.85)",
              letterSpacing: 0.5,
            }}
          >
            Estimate · Ước tính
          </div>
          <div
            style={{
              marginTop: 4,
              fontSize: 36,
              fontWeight: 950,
              color: "rgba(15,23,42,0.94)",
              letterSpacing: -0.5,
            }}
            aria-live="polite"
          >
            {estimate.totalScore} <span style={{ fontSize: 14, fontWeight: 700, color: "rgba(0,0,0,0.50)" }}>/ 990</span>
          </div>
          <div style={{ fontSize: 14, color: "rgba(0,0,0,0.65)" }}>
            Listening {estimate.listeningScore} · Reading {estimate.readingScore}
          </div>
          <div style={{ marginTop: 10, fontSize: 14, fontWeight: 800 }}>
            {estimate.band.label_en}
          </div>
          <div style={{ fontSize: 13, color: "rgba(67,56,202,0.85)" }}>
            {estimate.band.label_vi}
          </div>
          <p style={{ marginTop: 8, fontSize: 13, color: "rgba(0,0,0,0.66)" }}>
            {estimate.band.description_en}
          </p>
          <p style={{ marginTop: 2, fontSize: 12, color: "rgba(0,0,0,0.50)" }}>
            {estimate.band.description_vi}
          </p>
        </div>
      )}
    </div>
  );
}

const th: React.CSSProperties = {
  textAlign: "left",
  padding: "8px 10px",
  fontSize: 12,
  fontWeight: 800,
  color: "rgba(0,0,0,0.55)",
  borderBottom: "1px solid rgba(0,0,0,0.10)",
};
const td: React.CSSProperties = {
  padding: "10px 10px",
  borderBottom: "1px solid rgba(0,0,0,0.06)",
  verticalAlign: "top",
  fontSize: 13,
};
const input: React.CSSProperties = {
  width: 80,
  padding: "6px 8px",
  borderRadius: 8,
  border: "1px solid rgba(0,0,0,0.18)",
  fontSize: 14,
  fontVariantNumeric: "tabular-nums",
};
