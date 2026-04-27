// SVG heatmap of per-day per-phoneme accuracy.
//
// Rows = phonemes (vowels first, then consonants — see
// phonemeHeatmap.phonemeCategory). Columns = days, oldest left. Cell
// color encodes the average score:
//   red     <60
//   yellow  60..79
//   green   ≥80
//   gray    no attempts that (phoneme, day)
//
// On mobile (<= 480px) the table scrolls horizontally; the row labels
// stay sticky in a left column so the user can tell which phoneme
// they're looking at while panning across days. We deliberately don't
// reach for a chart library here — the layout is a fixed-pitch grid,
// CSS handles it more reliably than Recharts' Cell coordinate math.
//
// Cells are buttons (not divs) so click + keyboard activation come for
// free. Selected cell gets a 2px ring.

import React, { useMemo } from "react";

import type { HeatmapCell, HeatmapData } from "@/lib/pronunciation/phonemeHeatmap";

export type PhonemeHeatmapProps = {
  data: HeatmapData;
  /** Currently-selected cell (drives drill-down panel). */
  selected?: { phoneme: string; day: string } | null;
  onCellClick?: (cell: HeatmapCell) => void;
};

const CELL_SIZE = 14;
const CELL_GAP = 2;
const ROW_LABEL_WIDTH = 48;
const COL_LABEL_HEIGHT = 18;

export function PhonemeHeatmap({ data, selected, onCellClick }: PhonemeHeatmapProps) {
  // Index cells by `${phoneme}|${day}` for O(1) lookup at render.
  const cellIndex = useMemo(() => {
    const m = new Map<string, HeatmapCell>();
    for (const c of data.cells) m.set(`${c.phoneme}|${c.day}`, c);
    return m;
  }, [data.cells]);

  const colTickStride = data.days.length <= 14 ? 2 : data.days.length <= 35 ? 7 : 14;

  return (
    <div style={wrapStyle} role="region" aria-label="Bản đồ tiến độ phát âm · Pronunciation progress heatmap">
      <Legend />
      <div style={scrollerStyle} data-testid="heatmap-scroller">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `${ROW_LABEL_WIDTH}px repeat(${data.days.length}, ${CELL_SIZE}px)`,
            columnGap: CELL_GAP,
            rowGap: CELL_GAP,
            paddingLeft: 4,
          }}
          aria-hidden={false}
        >
          {/* Top-left empty corner */}
          <div style={{ height: COL_LABEL_HEIGHT }} />
          {/* Day column ticks */}
          {data.days.map((day, idx) => (
            <div key={day} style={{ ...colLabelStyle, width: CELL_SIZE }}>
              {idx % colTickStride === 0 ? formatDayTick(day) : ""}
            </div>
          ))}

          {data.phonemes.map((phoneme) => (
            <React.Fragment key={phoneme}>
              <div style={rowLabelStyle}>/{phoneme}/</div>
              {data.days.map((day) => {
                const cell = cellIndex.get(`${phoneme}|${day}`) ?? null;
                const isSelected =
                  selected?.phoneme === phoneme && selected?.day === day;
                return (
                  <CellButton
                    key={`${phoneme}|${day}`}
                    phoneme={phoneme}
                    day={day}
                    cell={cell}
                    selected={isSelected}
                    onClick={onCellClick}
                  />
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

function CellButton({
  phoneme,
  day,
  cell,
  selected,
  onClick,
}: {
  phoneme: string;
  day: string;
  cell: HeatmapCell | null;
  selected: boolean;
  onClick?: (cell: HeatmapCell) => void;
}) {
  const bg = cell ? colorForScore(cell.averageScore) : "#e2e8f0";
  const tooltip = cell
    ? `${day} · /${phoneme}/ · ${cell.averageScore}/100 · ${cell.attemptCount} lần thử`
    : `${day} · /${phoneme}/ · không có dữ liệu · no data`;
  return (
    <button
      type="button"
      onClick={cell && onClick ? () => onClick(cell) : undefined}
      disabled={!cell}
      title={tooltip}
      aria-label={tooltip}
      data-testid={`heatmap-cell-${phoneme}-${day}`}
      style={{
        width: CELL_SIZE,
        height: CELL_SIZE,
        background: bg,
        border: "none",
        borderRadius: 3,
        padding: 0,
        cursor: cell ? "pointer" : "default",
        boxShadow: selected ? "0 0 0 2px #4F46E5" : "none",
        transition: "box-shadow 120ms",
      }}
    />
  );
}

function Legend() {
  return (
    <div style={legendRowStyle} aria-label="Chú giải · Legend">
      <span style={legendLabelStyle}>Điểm · Score</span>
      <LegendSwatch color={colorForScore(40)} label="< 60" />
      <LegendSwatch color={colorForScore(70)} label="60–79" />
      <LegendSwatch color={colorForScore(90)} label="≥ 80" />
      <LegendSwatch color="#e2e8f0" label="—" />
    </div>
  );
}

function LegendSwatch({ color, label }: { color: string; label: string }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
      <span
        aria-hidden
        style={{
          width: 10,
          height: 10,
          background: color,
          borderRadius: 2,
          display: "inline-block",
        }}
      />
      <span style={{ fontSize: 11, color: "rgba(0,0,0,0.65)" }}>{label}</span>
    </span>
  );
}

// ── Helpers ──────────────────────────────────────────────────────────────

export function colorForScore(score: number): string {
  if (score >= 80) return "#22c55e"; // green-500
  if (score >= 60) return "#eab308"; // yellow-500
  return "#ef4444"; // red-500
}

function formatDayTick(day: string): string {
  // Show "MM/DD" — tight enough to fit a 14px column. Year is implied
  // by the window (max 180 days).
  const [, m, d] = day.split("-");
  return `${parseInt(m, 10)}/${parseInt(d, 10)}`;
}

// ── Styles ───────────────────────────────────────────────────────────────

const wrapStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 10,
};

const scrollerStyle: React.CSSProperties = {
  overflowX: "auto",
  paddingBottom: 6,
};

const colLabelStyle: React.CSSProperties = {
  fontSize: 9,
  color: "rgba(0,0,0,0.45)",
  textAlign: "left",
  whiteSpace: "nowrap",
  height: COL_LABEL_HEIGHT,
  display: "flex",
  alignItems: "flex-end",
  paddingBottom: 2,
};

const rowLabelStyle: React.CSSProperties = {
  fontSize: 11,
  color: "rgba(0,0,0,0.7)",
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
  display: "flex",
  alignItems: "center",
  paddingRight: 6,
  width: ROW_LABEL_WIDTH,
};

const legendRowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  flexWrap: "wrap",
  fontSize: 11,
};

const legendLabelStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  color: "rgba(0,0,0,0.65)",
};

export default PhonemeHeatmap;
