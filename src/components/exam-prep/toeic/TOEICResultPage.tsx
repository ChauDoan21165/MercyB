// Section-by-section result breakdown + L1-mistake-cluster analysis.
//
// This component is shell-only — the full L1-mistake clustering ties
// into the existing weakness analytics layer in src/lib/weakness/ and
// will be wired in a follow-up. Today the result page accepts a list
// of per-section results (passed in by the caller) and renders the
// breakdown + a placeholder for the cluster analysis so the layout is
// reviewable.

import React from "react";

import {
  estimateTOEICScore,
  type TOEICScoreEstimate,
} from "@/data/exam-prep/toeic/score-bands";
import { TOEIC_SECTIONS } from "@/data/exam-prep/toeic/structure";

export type TOEICResultPerSection = {
  sectionId: string;
  correct: number;
  total: number;
  /** Optional: tags collected by the engine that the learner missed. */
  weaknessTags?: string[];
};

export type TOEICResultPageProps = {
  results: TOEICResultPerSection[];
};

export default function TOEICResultPage({ results }: TOEICResultPageProps) {
  const estimate: TOEICScoreEstimate = estimateTOEICScore(results);
  const tagCounts = clusterTags(results);

  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "20px 16px 80px" }}>
      <h1 style={{ margin: 0, fontSize: 26, fontWeight: 950 }}>
        Your TOEIC result · Kết quả
      </h1>

      <section style={summaryShell}>
        <div style={{ fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.5, color: "rgba(67,56,202,0.85)" }}>
          Estimate · Ước tính
        </div>
        <div style={{ marginTop: 4, fontSize: 40, fontWeight: 950 }}>
          {estimate.totalScore} <span style={{ fontSize: 14, fontWeight: 700, color: "rgba(0,0,0,0.50)" }}>/ 990</span>
        </div>
        <div style={{ fontSize: 14, color: "rgba(0,0,0,0.65)" }}>
          Listening {estimate.listeningScore} · Reading {estimate.readingScore}
        </div>
        <div style={{ marginTop: 8, fontSize: 14, fontWeight: 800 }}>
          {estimate.band.label_en}
        </div>
        <div style={{ fontSize: 13, color: "rgba(67,56,202,0.85)" }}>
          {estimate.band.label_vi}
        </div>
      </section>

      <section style={{ marginTop: 22 }}>
        <h2 style={{ fontSize: 16, fontWeight: 900, margin: "0 0 8px" }}>
          Section breakdown · Phân tích từng phần
        </h2>
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
          {results.map((r) => {
            const sec = TOEIC_SECTIONS.find((s) => s.id === r.sectionId);
            const pct =
              r.total > 0 ? Math.round((r.correct / r.total) * 100) : 0;
            return (
              <li key={r.sectionId} style={breakdownRow}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 800 }}>
                    {sec?.name_en ?? r.sectionId}
                  </div>
                  <div style={{ fontSize: 12, color: "rgba(99,102,241,0.75)" }}>
                    {sec?.name_vi}
                  </div>
                </div>
                <div style={{ fontSize: 14, fontWeight: 800, color: pctColor(pct) }}>
                  {r.correct}/{r.total} · {pct}%
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      {tagCounts.length > 0 && (
        <section style={{ marginTop: 22 }}>
          <h2 style={{ fontSize: 16, fontWeight: 900, margin: "0 0 8px" }}>
            Mistake clusters · Cụm lỗi hay gặp
          </h2>
          <p style={{ fontSize: 12, color: "rgba(0,0,0,0.50)", margin: "0 0 8px" }}>
            Pulled from L1-error tagging across this attempt — the more a
            tag appears, the more it's worth a focused practice round.
          </p>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexWrap: "wrap", gap: 6 }}>
            {tagCounts.map(({ tag, count }) => (
              <li
                key={tag}
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  padding: "4px 10px",
                  borderRadius: 9999,
                  background: "rgba(99,102,241,0.10)",
                  color: "rgba(67,56,202,0.85)",
                }}
              >
                {tag} × {count}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function pctColor(pct: number): string {
  if (pct >= 80) return "rgba(6,95,70,0.92)";
  if (pct >= 60) return "rgba(67,56,202,0.85)";
  if (pct >= 40) return "rgba(180,83,9,0.92)";
  return "rgba(185,28,28,0.92)";
}

function clusterTags(
  results: TOEICResultPerSection[],
): Array<{ tag: string; count: number }> {
  const counts = new Map<string, number>();
  for (const r of results) {
    for (const t of r.weaknessTags ?? []) {
      counts.set(t, (counts.get(t) ?? 0) + 1);
    }
  }
  return Array.from(counts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}

const summaryShell: React.CSSProperties = {
  marginTop: 14,
  padding: "16px 18px",
  borderRadius: 16,
  background:
    "linear-gradient(150deg, rgba(238,242,255,0.94), rgba(252,252,255,0.96))",
  border: "1px solid rgba(99,102,241,0.20)",
};

const breakdownRow: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  padding: "10px 12px",
  borderRadius: 12,
  background: "white",
  border: "1px solid rgba(0,0,0,0.10)",
};
