/**
 * /admin/cost-monitoring — operational cost dashboard for level-9+ admins.
 *
 * Why: MercyBlade's spend spans OpenAI/Gemini, ElevenLabs, Resend, Azure
 * Speech. Without a unified view, Chau can't tell which feature flag to
 * darken when costs spike or whether unit economics work.
 *
 * Source of truth: existing telemetry tables (ai_usage_logs,
 * mercy_tts_usage, email_sends_log, speech_attempts). NO new tracking
 * columns. Pure aggregation in src/lib/admin/costMonitoring.ts; this file
 * is the rendering layer.
 *
 * Defense-in-depth gating:
 *   1. useAdminAccess → level < 9 → <Navigate to="/" />.
 *   2. RLS on the source tables (admin reads via service role inside
 *      Supabase queries; non-admins get zero rows).
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Navigate } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { useAdminAccess } from "@/hooks/admin/useAdminAccess";
import { supabase } from "@/lib/supabaseClient";
import {
  COST_CATEGORY_LABELS,
  costToRevenueRatio,
  DEFAULT_USD_VND_RATE,
  forecastMonthlyVnd,
  getMonthlyRecognizedRevenueVnd,
  getTotalDailyCost,
  toCsv,
  type CostCategory,
  type DailyCostPoint,
  type UserCostRow,
} from "@/lib/admin/costMonitoring";
import {
  DEFAULT_THRESHOLD_USD,
  evaluateAlert,
  shouldDispatchEmail,
  type AlertEvaluation,
  type AlertLevel,
} from "@/lib/admin/costAlerts";

const ALERT_PREV_LEVEL_KEY = "mb.admin.cost.prevAlertLevel";
const REFRESH_MS = 60_000;

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
const kpiGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
  gap: 16,
};
const kpi: React.CSSProperties = {
  background: "white",
  border: "1px solid rgba(0,0,0,0.06)",
  borderRadius: 12,
  padding: 16,
};
const kpiLabel: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 600,
  color: "rgba(0,0,0,0.55)",
  marginBottom: 6,
};
const kpiValue: React.CSSProperties = {
  fontSize: 22,
  fontWeight: 900,
  color: "#0f172a",
};
const tableStyle: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  fontSize: 13,
};
const th: React.CSSProperties = {
  textAlign: "right",
  padding: "8px 12px",
  borderBottom: "1px solid rgba(0,0,0,0.08)",
  fontWeight: 700,
  fontSize: 12,
  color: "rgba(0,0,0,0.6)",
};
const thLeft: React.CSSProperties = { ...th, textAlign: "left" };
const td: React.CSSProperties = {
  textAlign: "right",
  padding: "8px 12px",
  borderBottom: "1px solid rgba(0,0,0,0.04)",
};
const tdLeft: React.CSSProperties = { ...td, textAlign: "left" };

const CATEGORY_COLOR: Record<CostCategory, string> = {
  openai: "#6366f1",
  elevenlabs: "#10b981",
  resend: "#f59e0b",
  azure: "#ef4444",
};

function fmtVnd(n: number): string {
  if (!Number.isFinite(n)) return "—";
  return `${n.toLocaleString("vi-VN")} ₫`;
}

function alertColor(level: AlertLevel): { bg: string; fg: string; label: { vi: string; en: string } } {
  if (level === "alert")
    return {
      bg: "#fee2e2",
      fg: "#991b1b",
      label: { vi: "Cảnh báo", en: "Alert" },
    };
  if (level === "watch")
    return {
      bg: "#fef9c3",
      fg: "#854d0e",
      label: { vi: "Theo dõi", en: "Watch" },
    };
  return {
    bg: "#dcfce7",
    fg: "#14532d",
    label: { vi: "Ổn", en: "OK" },
  };
}

function downloadCsv(csv: string, filename: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

interface FetchResult {
  daily30: DailyCostPoint[];
  topUsers: UserCostRow[];
  forecastMonthlyVnd: number;
  monthlyRevenueVnd: number;
  fetchedAt: number;
}

async function fetchAll(usdVndRate: number): Promise<FetchResult> {
  const now = new Date();
  const [{ daily, topUsers, forecast_monthly_vnd }, monthlyRevenueVnd] = await Promise.all([
    getTotalDailyCost(supabase as any, 30, { now, usdVndRate, topN: 10 }),
    getMonthlyRecognizedRevenueVnd(supabase as any).catch(() => 0),
  ]);
  return {
    daily30: daily,
    topUsers,
    forecastMonthlyVnd: forecast_monthly_vnd,
    monthlyRevenueVnd,
    fetchedAt: Date.now(),
  };
}

export default function CostMonitoring(): React.ReactElement {
  const { permissions, loading: accessLoading } = useAdminAccess();
  const [usdVndRate] = useState(DEFAULT_USD_VND_RATE);
  const [thresholdUsd, setThresholdUsd] = useState<number>(DEFAULT_THRESHOLD_USD);
  const [data, setData] = useState<FetchResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetchAll(usdVndRate);
      setData(r);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load cost data");
    } finally {
      setLoading(false);
    }
  }, [usdVndRate]);

  useEffect(() => {
    if (!permissions.canEditSystem) return;
    void loadData();
    intervalRef.current = setInterval(() => {
      void loadData();
    }, REFRESH_MS);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [loadData, permissions.canEditSystem]);

  const alert: AlertEvaluation | null = useMemo(() => {
    if (!data) return null;
    return evaluateAlert(data.forecastMonthlyVnd, thresholdUsd, usdVndRate);
  }, [data, thresholdUsd, usdVndRate]);

  // Side-effect: when the alert level escalates, log a console line that
  // the dashboard surfaces as a banner. The actual admin email send
  // belongs in a separate action (manual button below) so we don't spam
  // on every refresh tick.
  useEffect(() => {
    if (!alert) return;
    const previous = (typeof window !== "undefined"
      ? (localStorage.getItem(ALERT_PREV_LEVEL_KEY) as AlertLevel | null)
      : null);
    if (shouldDispatchEmail(alert.level, previous)) {
      console.warn("[CostMonitoring] alert level escalated:", {
        from: previous,
        to: alert.level,
        ratio: alert.ratio,
      });
    }
    if (typeof window !== "undefined") {
      localStorage.setItem(ALERT_PREV_LEVEL_KEY, alert.level);
    }
  }, [alert]);

  if (accessLoading) {
    return (
      <div style={wrap}>
        <div style={container}>
          <div style={card}>Loading…</div>
        </div>
      </div>
    );
  }
  if (!permissions.canEditSystem) {
    return <Navigate to="/" replace />;
  }

  if (error) {
    return (
      <div style={wrap}>
        <div style={container}>
          <div style={{ ...card, color: "#991b1b" }}>
            <h1 style={heading}>Cost Monitoring</h1>
            <p>Could not load cost data: {error}</p>
            <button onClick={() => void loadData()}>Retry</button>
          </div>
        </div>
      </div>
    );
  }

  const today = data?.daily30[data.daily30.length - 1];
  const last7 = data?.daily30.slice(-7) ?? [];
  const todayTotal = today?.vnd_cost ?? 0;
  const last7Forecast = data ? forecastMonthlyVnd(data.daily30, 7) : 0;
  const cToR = data ? costToRevenueRatio(last7Forecast, data.monthlyRevenueVnd) : null;
  const alertStyle = alert ? alertColor(alert.level) : alertColor("ok");

  // Per-feature breakdown: average daily VND across last 7 days per category.
  const perFeature: Array<{ key: CostCategory; vi: string; en: string; avgPerDay: number }> = (
    Object.keys(COST_CATEGORY_LABELS) as CostCategory[]
  ).map((key) => {
    const total = last7.reduce((acc, p) => acc + (p.breakdown[key] ?? 0), 0);
    const avg = last7.length ? total / last7.length : 0;
    return {
      key,
      vi: COST_CATEGORY_LABELS[key].vi,
      en: COST_CATEGORY_LABELS[key].en,
      avgPerDay: Math.round(avg),
    };
  });

  return (
    <div style={wrap}>
      <div style={container}>
        <div style={card}>
          <h1 style={heading}>Chi phí vận hành / Cost Monitoring</h1>
          <p style={subHeading}>
            FX: {usdVndRate.toLocaleString("vi-VN")} VND/USD · auto-refresh every 60s
          </p>

          {alert ? (
            <div
              style={{
                marginTop: 12,
                padding: 12,
                borderRadius: 10,
                background: alertStyle.bg,
                color: alertStyle.fg,
                fontWeight: 700,
              }}
            >
              [{alertStyle.label.vi} / {alertStyle.label.en}] {alert.message.vi} · {alert.message.en}
            </div>
          ) : null}

          <div style={{ marginTop: 12, fontSize: 12, color: "rgba(0,0,0,0.6)" }}>
            <label>
              Hạn mức / Threshold (USD/month):{" "}
              <input
                type="number"
                min={1}
                value={thresholdUsd}
                onChange={(e) => setThresholdUsd(Number(e.target.value) || DEFAULT_THRESHOLD_USD)}
                style={{ width: 80, padding: 4 }}
              />
            </label>
          </div>
        </div>

        {/* KPI strip */}
        <div style={kpiGrid}>
          <div style={kpi}>
            <div style={kpiLabel}>Hôm nay / Today</div>
            <div style={kpiValue}>{fmtVnd(todayTotal)}</div>
          </div>
          <div style={kpi}>
            <div style={kpiLabel}>Dự kiến tháng / Monthly forecast</div>
            <div style={kpiValue}>{fmtVnd(last7Forecast)}</div>
          </div>
          <div style={kpi}>
            <div style={kpiLabel}>Doanh thu tháng / Monthly revenue</div>
            <div style={kpiValue}>{fmtVnd(data?.monthlyRevenueVnd ?? 0)}</div>
          </div>
          <div style={kpi}>
            <div style={kpiLabel}>Cost ÷ Revenue</div>
            <div style={kpiValue}>{cToR === null ? "—" : `${(cToR * 100).toFixed(1)}%`}</div>
          </div>
        </div>

        {/* 7-day stacked chart */}
        <div style={card}>
          <h2 style={heading}>7 ngày gần nhất / Last 7 days</h2>
          <p style={subHeading}>
            Stacked: OpenAI · ElevenLabs · Resend · Azure (VND)
          </p>
          <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer>
              <BarChart
                data={last7.map((p) => ({
                  date: p.date.slice(5),
                  openai: p.breakdown.openai ?? 0,
                  elevenlabs: p.breakdown.elevenlabs ?? 0,
                  resend: p.breakdown.resend ?? 0,
                  azure: p.breakdown.azure ?? 0,
                }))}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip
                  formatter={(value) => {
                    const n = typeof value === "number" ? value : Number(value);
                    return Number.isFinite(n) ? `${n.toLocaleString("vi-VN")} ₫` : "—";
                  }}
                />
                <Legend />
                <Bar dataKey="openai" stackId="a" fill={CATEGORY_COLOR.openai} name="OpenAI/Gemini" />
                <Bar dataKey="elevenlabs" stackId="a" fill={CATEGORY_COLOR.elevenlabs} name="ElevenLabs" />
                <Bar dataKey="resend" stackId="a" fill={CATEGORY_COLOR.resend} name="Resend" />
                <Bar dataKey="azure" stackId="a" fill={CATEGORY_COLOR.azure} name="Azure" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 30-day table + CSV */}
        <div style={card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h2 style={heading}>30 ngày / Last 30 days</h2>
              <p style={subHeading}>Daily total per category, in VND.</p>
            </div>
            <button
              type="button"
              onClick={() =>
                downloadCsv(toCsv(data?.daily30 ?? []), `mercyblade-cost-${new Date().toISOString().slice(0, 10)}.csv`)
              }
              style={{
                padding: "8px 12px",
                borderRadius: 8,
                border: "1px solid rgba(0,0,0,0.1)",
                background: "white",
                cursor: "pointer",
                fontSize: 13,
              }}
            >
              Tải CSV / Download CSV
            </button>
          </div>
          <div style={{ overflowX: "auto", marginTop: 12 }}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thLeft}>Date</th>
                  <th style={th}>OpenAI</th>
                  <th style={th}>ElevenLabs</th>
                  <th style={th}>Resend</th>
                  <th style={th}>Azure</th>
                  <th style={th}>Total</th>
                </tr>
              </thead>
              <tbody>
                {(data?.daily30 ?? []).map((p) => (
                  <tr key={p.date}>
                    <td style={tdLeft}>{p.date}</td>
                    <td style={td}>{fmtVnd(p.breakdown.openai ?? 0)}</td>
                    <td style={td}>{fmtVnd(p.breakdown.elevenlabs ?? 0)}</td>
                    <td style={td}>{fmtVnd(p.breakdown.resend ?? 0)}</td>
                    <td style={td}>{fmtVnd(p.breakdown.azure ?? 0)}</td>
                    <td style={{ ...td, fontWeight: 700 }}>{fmtVnd(p.vnd_cost)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Per-feature breakdown */}
        <div style={card}>
          <h2 style={heading}>Trung bình mỗi ngày (7d) / Avg per day (7d)</h2>
          <p style={subHeading}>
            Helps decide which feature flag to flip dark when costs spike.
          </p>
          <div style={kpiGrid}>
            {perFeature.map((f) => (
              <div key={f.key} style={kpi}>
                <div style={kpiLabel}>{f.vi} · {f.en}</div>
                <div style={{ ...kpiValue, color: CATEGORY_COLOR[f.key] }}>{fmtVnd(f.avgPerDay)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Top users */}
        <div style={card}>
          <h2 style={heading}>Top 10 user tốn kém nhất / Top 10 most expensive users (30d)</h2>
          <p style={subHeading}>
            Use to spot abusive patterns before they become invoices.
          </p>
          <div style={{ overflowX: "auto", marginTop: 12 }}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thLeft}>User ID</th>
                  <th style={th}>OpenAI</th>
                  <th style={th}>ElevenLabs</th>
                  <th style={th}>Azure</th>
                  <th style={th}>Total</th>
                </tr>
              </thead>
              <tbody>
                {(data?.topUsers ?? []).map((u) => (
                  <tr key={u.user_id}>
                    <td style={tdLeft} title={u.user_id}>
                      {u.user_id.slice(0, 8)}…
                    </td>
                    <td style={td}>{fmtVnd(u.breakdown.openai ?? 0)}</td>
                    <td style={td}>{fmtVnd(u.breakdown.elevenlabs ?? 0)}</td>
                    <td style={td}>{fmtVnd(u.breakdown.azure ?? 0)}</td>
                    <td style={{ ...td, fontWeight: 700 }}>{fmtVnd(u.vnd_cost)}</td>
                  </tr>
                ))}
                {(!data || data.topUsers.length === 0) && !loading ? (
                  <tr>
                    <td style={tdLeft} colSpan={5}>
                      Chưa có dữ liệu / No data yet.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
