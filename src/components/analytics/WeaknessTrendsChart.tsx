// src/components/analytics/WeaknessTrendsChart.tsx
//
// Per-week weakness flag counts. Shows the top N most-flagged
// weakness tags as separate lines so a teacher can see whether a
// pattern is fading or spreading. The chart shows raw counts (not
// percentages) — each weakness is a different cohort and normalising
// would hide the raw scale.
//
// "Improving" / "worsening" callouts surface the largest week-over-
// week deltas so Chau doesn't have to read the chart to find the
// signal.

import React, { useEffect, useMemo, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  getWeaknessTrends,
  topImprovingWeaknesses,
  topWorseningWeaknesses,
  type WeaknessTrendRow,
} from "@/lib/analytics/weaknessTrends";

const LINE_COLOURS = [
  "#0ea5e9",
  "#22c55e",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#14b8a6",
  "#ec4899",
  "#64748b",
];

export type WeaknessTrendsChartProps = {
  weeks?: number;
  /** Top-N tags to render as separate lines. Default 6. */
  tagLimit?: number;
};

export function WeaknessTrendsChart({
  weeks = 12,
  tagLimit = 6,
}: WeaknessTrendsChartProps) {
  const [rows, setRows] = useState<WeaknessTrendRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const result = await getWeaknessTrends(weeks);
      if (cancelled) return;
      if (!result.ok) {
        setError(result.error);
        setRows([]);
        return;
      }
      setError(null);
      setRows(result.data);
    })();
    return () => {
      cancelled = true;
    };
  }, [weeks]);

  const series = useMemo(() => {
    if (!rows || rows.length === 0) return null;

    // Pick the top-N tags by total occurrences across the window.
    const totals = new Map<string, number>();
    for (const r of rows) {
      totals.set(r.weakness_tag, (totals.get(r.weakness_tag) ?? 0) + r.total_occurrences);
    }
    const topTags = [...totals.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, tagLimit)
      .map(([tag]) => tag);

    // Build week → tag → count grid.
    const weekKeys = Array.from(new Set(rows.map((r) => r.week_start))).sort();
    return weekKeys.map((week) => {
      const point: Record<string, number | string> = { week };
      for (const tag of topTags) {
        const row = rows.find(
          (r) => r.week_start === week && r.weakness_tag === tag,
        );
        point[tag] = row?.total_occurrences ?? 0;
      }
      return point;
    });
  }, [rows, tagLimit]);

  const tagsInSeries = useMemo(() => {
    if (!series || series.length === 0) return [];
    return Object.keys(series[0]).filter((k) => k !== "week");
  }, [series]);

  const improving = useMemo(
    () => (rows ? topImprovingWeaknesses(rows, 3) : []),
    [rows],
  );
  const worsening = useMemo(
    () => (rows ? topWorseningWeaknesses(rows, 3) : []),
    [rows],
  );

  if (rows === null && !error) {
    return <p className="text-sm text-slate-500">Loading weakness trends…</p>;
  }
  if (error) {
    return (
      <p className="text-sm text-red-700 dark:text-red-300" role="alert">
        {error}
      </p>
    );
  }
  if (!rows || rows.length === 0 || !series) {
    return (
      <p className="text-sm text-slate-500">
        No weakness trend data yet (needs at least one user_placements row).
      </p>
    );
  }

  return (
    <section
      aria-label="Weakness trends chart"
      className="space-y-4"
      data-testid="weakness-trends-chart"
    >
      <div className="rounded-xl border border-black/10 bg-white p-4">
        <h3 className="text-sm font-semibold text-black/85 mb-3">
          Top {tagsInSeries.length} weakness tags — last {weeks} weeks
        </h3>
        <div style={{ width: "100%", height: 320 }}>
          <ResponsiveContainer>
            <LineChart data={series}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="week" />
              <YAxis allowDecimals={false} width={40} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              {tagsInSeries.map((tag, i) => (
                <Line
                  key={tag}
                  type="monotone"
                  dataKey={tag}
                  stroke={LINE_COLOURS[i % LINE_COLOURS.length]}
                  strokeWidth={2}
                  dot={{ r: 2 }}
                  isAnimationActive={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <CalloutCard
          title="Top improving"
          tone="emerald"
          empty="No improving signal yet."
          rows={improving.map((w) => ({
            tag: w.weakness_tag,
            value: `${w.latest_count} this week (↓ ${Math.abs(w.delta_vs_prev_week)})`,
          }))}
        />
        <CalloutCard
          title="Top worsening"
          tone="amber"
          empty="No worsening signal yet."
          rows={worsening.map((w) => ({
            tag: w.weakness_tag,
            value: `${w.latest_count} this week (↑ ${w.delta_vs_prev_week})`,
          }))}
        />
      </div>
    </section>
  );
}

function CalloutCard({
  title,
  tone,
  rows,
  empty,
}: {
  title: string;
  tone: "emerald" | "amber";
  rows: Array<{ tag: string; value: string }>;
  empty: string;
}) {
  const cls =
    tone === "emerald"
      ? "border-emerald-300 bg-emerald-50 text-emerald-900"
      : "border-amber-300 bg-amber-50 text-amber-900";
  return (
    <div className={`rounded-xl border p-3 ${cls}`}>
      <div className="font-semibold mb-2 text-sm">{title}</div>
      {rows.length === 0 ? (
        <p className="text-xs">{empty}</p>
      ) : (
        <ul className="text-xs font-mono space-y-1">
          {rows.map((r) => (
            <li key={r.tag}>
              {r.tag} — {r.value}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default WeaknessTrendsChart;
