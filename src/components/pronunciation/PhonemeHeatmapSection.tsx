// /progress section: insights cards above, heatmap grid, optional
// drill-down panel under it. Owns the 7/30/90-day toggle and the
// selected-cell state. Self-fetches on mount + on window change.
//
// Composes:
//   - HeatmapInsightsRow (top): 0..4 clickable cards
//   - PhonemeHeatmap     (mid): the SVG grid
//   - HeatmapDrillDown   (bottom, conditional): when a cell is selected
//
// Empty states:
//   - anonymous          → "Hãy luyện ít nhất 5 câu để xem bản đồ tiến độ"
//   - <5 attempts        → same copy
//   - fetch failed       → silent (the rest of /progress still renders)

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getPhonemeHeatmap,
  type HeatmapCell,
  type HeatmapData,
} from "@/lib/pronunciation/phonemeHeatmap";
import {
  generateInsights,
  type Insight,
} from "@/lib/pronunciation/heatmapInsights";

import { PhonemeHeatmap } from "./PhonemeHeatmap";
import { HeatmapDrillDown } from "./HeatmapDrillDown";

export type PhonemeHeatmapSectionProps = {
  userId: string | null;
};

const WINDOW_OPTIONS: Array<{ days: number; label: string }> = [
  { days: 7, label: "7 ngày · 7 d" },
  { days: 30, label: "30 ngày · 30 d" },
  { days: 90, label: "90 ngày · 90 d" },
];

export function PhonemeHeatmapSection({ userId }: PhonemeHeatmapSectionProps) {
  const [daysBack, setDaysBack] = useState<number>(30);
  const [data, setData] = useState<HeatmapData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selected, setSelected] = useState<{ phoneme: string; day: string } | null>(null);
  const nav = useNavigate();

  useEffect(() => {
    if (!userId) {
      setData(null);
      setLoading(false);
      return;
    }
    let alive = true;
    setLoading(true);
    getPhonemeHeatmap(userId, daysBack)
      .then((next) => {
        if (!alive) return;
        setData(next);
        setSelected(null);
      })
      .catch(() => {
        if (!alive) return;
        setData(null);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [userId, daysBack]);

  const insights = useMemo(() => generateInsights(data), [data]);

  const onCellClick = useCallback((cell: HeatmapCell) => {
    setSelected({ phoneme: cell.phoneme, day: cell.day });
  }, []);

  const onInsightClick = useCallback(
    (insight: Insight) => {
      if (insight.action_target.startsWith("/")) {
        nav(insight.action_target);
      } else {
        nav(`/room/${insight.action_target}`);
      }
    },
    [nav],
  );

  return (
    <section style={sectionStyle} aria-label="Bản đồ tiến độ phát âm · Phoneme heatmap">
      <header style={headerStyle}>
        <div>
          <div style={titleViStyle}>Bản đồ tiến độ phát âm</div>
          <div style={titleEnStyle}>Phoneme progress heatmap</div>
        </div>
        <WindowToggle daysBack={daysBack} onChange={setDaysBack} />
      </header>

      {loading ? (
        <div style={emptyCopyStyle}>Đang tải bản đồ… · Loading heatmap…</div>
      ) : !data ? (
        <div style={emptyCopyStyle}>
          Hãy luyện ít nhất 5 câu để xem bản đồ tiến độ.
          <div style={emptyEnStyle}>
            Practise at least 5 lines to unlock your progress map.
          </div>
        </div>
      ) : (
        <>
          {insights.length > 0 ? (
            <InsightsRow insights={insights} onClick={onInsightClick} />
          ) : null}
          <PhonemeHeatmap
            data={data}
            selected={selected}
            onCellClick={onCellClick}
          />
          {selected ? (
            <HeatmapDrillDown
              userId={userId}
              day={selected.day}
              phoneme={selected.phoneme}
              onClose={() => setSelected(null)}
            />
          ) : null}
        </>
      )}
    </section>
  );
}

function WindowToggle({
  daysBack,
  onChange,
}: {
  daysBack: number;
  onChange: (n: number) => void;
}) {
  return (
    <div role="tablist" aria-label="Chọn khoảng thời gian · Pick window" style={toggleRowStyle}>
      {WINDOW_OPTIONS.map((opt) => {
        const active = opt.days === daysBack;
        return (
          <button
            key={opt.days}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(opt.days)}
            style={toggleBtnStyle(active)}
            data-testid={`heatmap-window-${opt.days}`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

function InsightsRow({
  insights,
  onClick,
}: {
  insights: Insight[];
  onClick: (i: Insight) => void;
}) {
  return (
    <ul style={insightsRowStyle} aria-label="Nhận xét · Insights">
      {insights.map((ins) => (
        <li key={`${ins.kind}:${ins.phoneme}`} style={{ listStyle: "none" }}>
          <button
            type="button"
            onClick={() => onClick(ins)}
            style={insightCardStyle(ins.kind)}
            data-testid={`heatmap-insight-${ins.kind}`}
          >
            <span aria-hidden style={{ fontSize: 16 }}>{insightEmoji(ins.kind)}</span>
            <span style={{ display: "flex", flexDirection: "column", textAlign: "left" }}>
              <span style={insightViStyle}>{ins.copy_vi}</span>
              <span style={insightEnStyle}>{ins.copy_en}</span>
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}

function insightEmoji(kind: Insight["kind"]): string {
  switch (kind) {
    case "most_improved": return "📈";
    case "plateau": return "➖";
    case "needs_work": return "🎯";
    case "doing_well": return "🌟";
  }
}

// ── Styles ───────────────────────────────────────────────────────────────

const sectionStyle: React.CSSProperties = {
  marginTop: 16,
  padding: 14,
  borderRadius: 14,
  background: "white",
  border: "1px solid rgba(0,0,0,0.06)",
  boxShadow: "0 4px 12px rgba(15,23,42,0.04)",
};

const headerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: 10,
  marginBottom: 12,
  flexWrap: "wrap",
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

const toggleRowStyle: React.CSSProperties = {
  display: "inline-flex",
  gap: 4,
  background: "rgba(99,102,241,0.06)",
  border: "1px solid rgba(99,102,241,0.16)",
  borderRadius: 9999,
  padding: 3,
};

const toggleBtnStyle = (active: boolean): React.CSSProperties => ({
  padding: "4px 10px",
  borderRadius: 9999,
  border: "none",
  background: active ? "white" : "transparent",
  color: active ? "rgba(67,56,202,0.95)" : "rgba(67,56,202,0.7)",
  fontSize: 11,
  fontWeight: 800,
  cursor: "pointer",
  boxShadow: active ? "0 1px 3px rgba(15,23,42,0.08)" : "none",
});

const emptyCopyStyle: React.CSSProperties = {
  fontSize: 13,
  color: "rgba(15,23,42,0.7)",
  padding: "10px 0",
};

const emptyEnStyle: React.CSSProperties = {
  fontSize: 11,
  color: "rgba(0,0,0,0.5)",
  marginTop: 2,
};

const insightsRowStyle: React.CSSProperties = {
  display: "flex",
  gap: 8,
  flexWrap: "wrap",
  margin: 0,
  padding: 0,
  marginBottom: 12,
};

const insightCardStyle = (kind: Insight["kind"]): React.CSSProperties => {
  const tone =
    kind === "most_improved"
      ? "rgba(34,197,94,0.10)"
      : kind === "doing_well"
      ? "rgba(34,197,94,0.10)"
      : kind === "needs_work"
      ? "rgba(239,68,68,0.08)"
      : "rgba(99,102,241,0.06)";
  const border =
    kind === "most_improved"
      ? "rgba(34,197,94,0.25)"
      : kind === "doing_well"
      ? "rgba(34,197,94,0.25)"
      : kind === "needs_work"
      ? "rgba(239,68,68,0.20)"
      : "rgba(99,102,241,0.20)";
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "8px 12px",
    borderRadius: 12,
    background: tone,
    border: `1px solid ${border}`,
    cursor: "pointer",
    maxWidth: 320,
  };
};

const insightViStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 800,
  color: "rgba(15,23,42,0.9)",
};

const insightEnStyle: React.CSSProperties = {
  fontSize: 11,
  color: "rgba(0,0,0,0.55)",
  marginTop: 2,
};

export default PhonemeHeatmapSection;
