// src/components/analytics/CohortRetentionChart.tsx
//
// Recharts <LineChart>: x-axis = day-offset (1, 7, 14, 30), y = %
// retained, one line per cohort. Compact legend keeps mobile layout
// readable. Cohorts older than the chart's `cohortLimit` (default 8)
// are dropped to keep the line forest manageable.

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
  getCohortRetention,
  pivotForChart,
  type CohortRetentionRow,
} from "@/lib/analytics/cohortRetention";

const DAY_OFFSETS = [1, 7, 14, 30] as const;

const LINE_COLOURS = [
  "#0ea5e9", // sky
  "#22c55e", // emerald
  "#f59e0b", // amber
  "#ef4444", // red
  "#8b5cf6", // violet
  "#14b8a6", // teal
  "#ec4899", // pink
  "#64748b", // slate
];

export type CohortRetentionChartProps = {
  /** How many recent cohorts to render. Defaults to 8. */
  cohortLimit?: number;
  /** Override the lookback (passed to the RPC). Defaults to 12 weeks. */
  weeks?: number;
};

export function CohortRetentionChart({
  cohortLimit = 8,
  weeks = 12,
}: CohortRetentionChartProps) {
  const [rows, setRows] = useState<CohortRetentionRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const result = await getCohortRetention(weeks);
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
    if (!rows) return null;
    const pivoted = pivotForChart(rows).slice(0, cohortLimit);
    // Recharts wants one row per x-axis tick, one column per series.
    return DAY_OFFSETS.map((day) => {
      const point: Record<string, number | string> = { day: `D${day}` };
      for (const cohort of pivoted) {
        const value =
          day === 1
            ? cohort.d1
            : day === 7
            ? cohort.d7
            : day === 14
            ? cohort.d14
            : cohort.d30;
        point[cohort.cohort_week] = value ?? 0;
      }
      return point;
    });
  }, [rows, cohortLimit]);

  const cohorts = useMemo(() => {
    if (!rows) return [];
    return pivotForChart(rows).slice(0, cohortLimit).map((c) => c.cohort_week);
  }, [rows, cohortLimit]);

  if (rows === null && !error) {
    return <p className="text-sm text-slate-600">Loading cohort retention…</p>;
  }
  if (error) {
    return (
      <p className="text-sm text-red-700 dark:text-red-300" role="alert">
        {error}
      </p>
    );
  }
  if (!series || series.length === 0 || cohorts.length === 0) {
    return (
      <p className="text-sm text-slate-600">
        No cohort retention data yet.
      </p>
    );
  }

  return (
    <section
      aria-label="Cohort retention chart"
      className="rounded-xl border border-black/10 bg-white p-4"
      data-testid="cohort-retention-chart"
    >
      <h3 className="text-sm font-semibold text-black/85 mb-3">
        Cohort retention — last {cohorts.length} weeks
      </h3>
      <div style={{ width: "100%", height: 320 }}>
        <ResponsiveContainer>
          <LineChart data={series}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="day" />
            <YAxis
              domain={[0, 100]}
              tickFormatter={(v) => `${v}%`}
              width={50}
            />
            <Tooltip
              formatter={(value) => {
                const n = typeof value === "number" ? value : Number(value);
                return Number.isFinite(n) ? `${n.toFixed(1)}%` : String(value);
              }}
            />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            {cohorts.map((cohort, i) => (
              <Line
                key={cohort}
                type="monotone"
                dataKey={cohort}
                stroke={LINE_COLOURS[i % LINE_COLOURS.length]}
                strokeWidth={2}
                dot={{ r: 3 }}
                isAnimationActive={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

export default CohortRetentionChart;
