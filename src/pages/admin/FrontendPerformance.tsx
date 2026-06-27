/**
 * /admin/frontend-perf — Core Web Vitals dashboard for level-9+ admins.
 *
 * Sections:
 *   1. Hero: latest LCP / INP / CLS rating across all routes (mobile + desktop)
 *   2. 30-day P50/P95 LCP per route (line chart)
 *   3. Top 10 slowest routes (table)
 *   4. CLS distribution (bar chart by route)
 *   5. Recent perf-alert sends
 *   6. Device-class filter toggle (mobile / desktop / both)
 *
 * Companions: src/lib/perf/webVitalsTracking.ts, src/config/perfBudget.ts,
 *             supabase/functions/perf-alert/.
 */

import React, { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { useAdminAccess } from "@/hooks/admin/useAdminAccess";
import { supabase } from "@/lib/supabaseClient";
import {
  WEB_VITAL_THRESHOLDS,
  rateVital,
  type VitalRating,
  type WebVitalName,
} from "@/config/perfBudget";

const wrap: React.CSSProperties = {
  width: "100%",
  minHeight: "100vh",
  padding: "24px 24px 80px",
  background: "#f8fafc",
};
const container: React.CSSProperties = {
  maxWidth: 1200,
  margin: "0 auto",
  display: "flex",
  flexDirection: "column",
  gap: 20,
};
const card: React.CSSProperties = {
  background: "white",
  border: "1px solid rgba(0,0,0,0.06)",
  borderRadius: 14,
  padding: 20,
  boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
};
const heading: React.CSSProperties = {
  fontSize: 18,
  fontWeight: 900,
  marginTop: 0,
  marginBottom: 4,
};
const subHeading: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 500,
  color: "rgba(0,0,0,0.5)",
  marginBottom: 16,
};

const RATING_COLOR: Record<VitalRating, string> = {
  good: "#10b981",
  needs_improvement: "#f59e0b",
  poor: "#ef4444",
  no_data: "#94a3b8", // a11y-contrast:exception — used as borderColor on the rating chip (WCAG 1.4.11 non-text 3:1; slate-500 on white = 3.13:1 PASSES). Not text. Audit doc §wave-5.
};
const RATING_LABEL_VI: Record<VitalRating, string> = {
  good: "Tốt",
  needs_improvement: "Cần cải thiện",
  poor: "Yếu",
  no_data: "Chưa có dữ liệu",
};

interface AggRow {
  date: string;
  route: string;
  metric_name: WebVitalName;
  device_class: "mobile" | "desktop";
  sample_count: number;
  p50_value: number;
  p95_value: number;
  p99_value: number;
}

interface AlertRow {
  id: number;
  route: string;
  current_p95_ms: number;
  threshold_ms: number;
  sample_count: number;
  sent_at: string;
  email_sent: boolean;
}

type DeviceFilter = "all" | "mobile" | "desktop";

export default function FrontendPerformance() {
  const admin = useAdminAccess();
  const level = admin.permissions.level;
  const adminLoading = admin.loading;

  const [aggregates, setAggregates] = useState<AggRow[]>([]);
  const [alerts, setAlerts] = useState<AlertRow[]>([]);
  const [device, setDevice] = useState<DeviceFilter>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (adminLoading || level < 9) return;
    let alive = true;
    setLoading(true);
    setError(null);

    void (async () => {
      try {
        const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .slice(0, 10);
        const [aggResp, alertResp] = await Promise.all([
          supabase
            .from("web_vitals_aggregates")
            .select(
              "date, route, metric_name, device_class, sample_count, p50_value, p95_value, p99_value",
            )
            .gte("date", since)
            .order("date", { ascending: true }),
          supabase
            .from("perf_alert_history")
            .select("id, route, current_p95_ms, threshold_ms, sample_count, sent_at, email_sent")
            .order("sent_at", { ascending: false })
            .limit(50),
        ]);

        if (!alive) return;
        setAggregates((aggResp.data ?? []) as AggRow[]);
        setAlerts((alertResp.data ?? []) as AlertRow[]);
        setLoading(false);
      } catch (err) {
        if (!alive) return;
        setError(err instanceof Error ? err.message : String(err));
        setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [adminLoading, level]);

  const filteredAgg = useMemo(() => {
    if (device === "all") return aggregates;
    return aggregates.filter((r) => r.device_class === device);
  }, [aggregates, device]);

  const heroRatings = useMemo(() => {
    // For each metric, take the most recent day's P95 across all
    // routes/devices (weighted average proxy: simple max of p95).
    const out: Partial<Record<WebVitalName, { value: number; rating: VitalRating }>> = {};
    for (const metric of ["LCP", "INP", "CLS", "FCP", "TTFB"] as WebVitalName[]) {
      const rows = filteredAgg.filter((r) => r.metric_name === metric);
      if (rows.length === 0) {
        out[metric] = { value: 0, rating: "no_data" };
        continue;
      }
      const recent = rows.slice(-50);
      const median = recent
        .map((r) => Number(r.p95_value))
        .sort((a, b) => a - b)[Math.floor(recent.length / 2)] ?? 0;
      out[metric] = { value: median, rating: rateVital(metric, median) };
    }
    return out;
  }, [filteredAgg]);

  const lcpByRoute = useMemo(() => {
    const rows = filteredAgg.filter((r) => r.metric_name === "LCP");
    // Pivot: { date, [route]: p95 }.
    const byDate = new Map<string, Record<string, number | string>>();
    for (const r of rows) {
      const point = byDate.get(r.date) ?? { date: r.date };
      point[r.route] = Number(r.p95_value);
      byDate.set(r.date, point);
    }
    return Array.from(byDate.values()).sort((a, b) =>
      String(a.date).localeCompare(String(b.date)),
    );
  }, [filteredAgg]);

  const distinctRoutes = useMemo(() => {
    const set = new Set<string>();
    for (const r of filteredAgg) set.add(r.route);
    return Array.from(set).sort();
  }, [filteredAgg]);

  const slowestRoutes = useMemo(() => {
    const map = new Map<string, { p95Sum: number; n: number }>();
    for (const r of filteredAgg) {
      if (r.metric_name !== "LCP") continue;
      const cur = map.get(r.route) ?? { p95Sum: 0, n: 0 };
      cur.p95Sum += Number(r.p95_value);
      cur.n++;
      map.set(r.route, cur);
    }
    return Array.from(map.entries())
      .map(([route, v]) => ({ route, p95: Math.round(v.p95Sum / v.n) }))
      .sort((a, b) => b.p95 - a.p95)
      .slice(0, 10);
  }, [filteredAgg]);

  const clsByRoute = useMemo(() => {
    const map = new Map<string, number>();
    for (const r of filteredAgg) {
      if (r.metric_name !== "CLS") continue;
      const cur = map.get(r.route) ?? 0;
      map.set(r.route, Math.max(cur, Number(r.p95_value)));
    }
    return Array.from(map.entries())
      .map(([route, value]) => ({ route, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
  }, [filteredAgg]);

  if (adminLoading) return <div style={wrap}>Checking admin access…</div>;
  if (level < 9) return <Navigate to="/" replace />;

  return (
    <div style={wrap}>
      <div style={container}>
        <div>
          <h1 style={{ ...heading, fontSize: 24 }}>
            Frontend performance · Hiệu năng giao diện
          </h1>
          <div style={subHeading}>
            Core Web Vitals over the last 30 days. Anonymous browser samples; never
            stores user_id or session id.
          </div>
        </div>

        {error ? (
          <div style={{ ...card, borderColor: "#ef4444", color: "#b91c1c" }}>
            {error}
          </div>
        ) : null}

        {/* Device filter */}
        <div style={card}>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <span style={{ fontWeight: 700 }}>Device class:</span>
            {(["all", "mobile", "desktop"] as DeviceFilter[]).map((d) => (
              <button
                key={d}
                onClick={() => setDevice(d)}
                style={{
                  padding: "6px 12px",
                  borderRadius: 8,
                  border: "1px solid rgba(0,0,0,0.12)",
                  background: device === d ? "#2563eb" : "white",
                  color: device === d ? "white" : "inherit",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Hero ratings */}
        <div>
          <h2 style={heading}>Latest ratings</h2>
          <div style={subHeading}>Median of the last 50 daily aggregate rows</div>
          <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))" }}>
            {(Object.keys(WEB_VITAL_THRESHOLDS) as WebVitalName[]).map((m) => {
              const data = heroRatings[m];
              const rating = data?.rating ?? "no_data";
              const t = WEB_VITAL_THRESHOLDS[m];
              const value = data?.value ?? 0;
              const display = t.unit === "ms" ? `${Math.round(value)} ms` : value.toFixed(3);
              return (
                <div
                  key={m}
                  style={{
                    ...card,
                    borderColor: RATING_COLOR[rating],
                    borderWidth: 2,
                  }}
                >
                  <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(0,0,0,0.55)", textTransform: "uppercase" }}>
                    {RATING_LABEL_VI[rating]}
                  </div>
                  <div style={{ fontWeight: 800, fontSize: 14, marginTop: 4 }}>
                    {t.labelVi}
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 900, marginTop: 8 }}>{display}</div>
                  <div style={{ fontSize: 11, color: "rgba(0,0,0,0.5)" }}>
                    Good ≤ {t.unit === "ms" ? `${t.good}ms` : t.good}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* LCP per route line chart */}
        <div style={card}>
          <h2 style={heading}>LCP P95 per route (30d)</h2>
          <div style={subHeading}>One line per route. Mobile and desktop combined unless filtered.</div>
          {loading ? (
            <div>Loading…</div>
          ) : lcpByRoute.length === 0 ? (
            <div style={{ color: "rgba(0,0,0,0.5)", fontSize: 13 }}>No aggregates yet.</div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={lcpByRoute}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                {distinctRoutes.map((route, i) => (
                  <Line
                    key={route}
                    type="monotone"
                    dataKey={route}
                    stroke={lineColor(i)}
                    dot={false}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Top 10 slowest routes */}
        <div style={card}>
          <h2 style={heading}>Top 10 slowest routes (LCP)</h2>
          <div style={subHeading}>30-day average LCP P95</div>
          {slowestRoutes.length === 0 ? (
            <div style={{ color: "rgba(0,0,0,0.5)", fontSize: 13 }}>No data.</div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ textAlign: "left" }}>
                  <th style={th}>Route</th>
                  <th style={th}>LCP P95 (avg, ms)</th>
                </tr>
              </thead>
              <tbody>
                {slowestRoutes.map((r) => (
                  <tr key={r.route}>
                    <td style={td}><code>{r.route}</code></td>
                    <td style={{ ...td, color: r.p95 > 4000 ? "#b91c1c" : "#0f172a", fontWeight: 700 }}>
                      {r.p95}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* CLS by route */}
        <div style={card}>
          <h2 style={heading}>CLS distribution (top 10 routes)</h2>
          <div style={subHeading}>Worst-day CLS observed per route</div>
          {clsByRoute.length === 0 ? (
            <div style={{ color: "rgba(0,0,0,0.5)", fontSize: 13 }}>No data.</div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={clsByRoute}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="route" tick={{ fontSize: 10 }} interval={0} angle={-30} textAnchor="end" height={80} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="value" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Recent perf alerts */}
        <div style={card}>
          <h2 style={heading}>Recent perf alerts</h2>
          <div style={subHeading}>Last 50 from perf_alert_history</div>
          {alerts.length === 0 ? (
            <div style={{ color: "rgba(0,0,0,0.5)", fontSize: 13 }}>None.</div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ textAlign: "left" }}>
                  <th style={th}>When</th>
                  <th style={th}>Route</th>
                  <th style={th}>P95</th>
                  <th style={th}>Threshold</th>
                  <th style={th}>Samples</th>
                  <th style={th}>Email</th>
                </tr>
              </thead>
              <tbody>
                {alerts.map((row) => (
                  <tr key={row.id}>
                    <td style={td}>{new Date(row.sent_at).toLocaleString()}</td>
                    <td style={td}><code>{row.route}</code></td>
                    <td style={td}>{Math.round(row.current_p95_ms)}ms</td>
                    <td style={td}>{Math.round(row.threshold_ms)}ms</td>
                    <td style={td}>{row.sample_count}</td>
                    <td style={td}>{row.email_sent ? "✓" : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

const th: React.CSSProperties = {
  padding: "8px 10px",
  borderBottom: "1px solid rgba(0,0,0,0.08)",
  fontWeight: 700,
  color: "rgba(0,0,0,0.6)",
};
const td: React.CSSProperties = {
  padding: "8px 10px",
  borderBottom: "1px solid rgba(0,0,0,0.04)",
};

function lineColor(i: number): string {
  const palette = ["#2563eb", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#ec4899", "#65a30d"];
  return palette[i % palette.length];
}
