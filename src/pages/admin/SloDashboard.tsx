/**
 * /admin/slo — Service Level Objective dashboard for level-9+ admins.
 *
 * Hero card: worst SLO determines overall traffic-light state.
 * Per-SLO cards: target, current 28-day actual, remaining budget, burn rate.
 * Burn-down chart per SLO: budget consumption trend over the SLO window.
 * Recent burn alerts table: from slo_burn_alerts (last 50).
 * Pause non-critical work toggle: flips feature_flags.slo_pause_active.
 *
 * Companions: src/lib/admin/errorBudget.ts, src/lib/admin/incidentLog.ts,
 *             src/config/slos.ts, supabase/functions/error-budget-alert/.
 */

import React, { useEffect, useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { useAdminAccess } from "@/hooks/admin/useAdminAccess";
import { supabase } from "@/lib/supabaseClient";
import {
  calculateAllBudgets,
  type BudgetResult,
  type BudgetStatus,
} from "@/lib/admin/errorBudget";
import {
  listRecentIncidents,
  pickWorstStatus,
  readSloPauseFlag,
  setSloPauseFlag,
  type IncidentRow,
} from "@/lib/admin/incidentLog";
import { SLOS, getSloById } from "@/config/slos";

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
const sloGrid: React.CSSProperties = {
  display: "grid",
  gap: 12,
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
};

const STATUS_BG: Record<BudgetStatus, string> = {
  healthy: "#ecfdf5",
  warning: "#fef3c7",
  critical: "#fee2e2",
  exhausted: "#fecaca",
  no_data: "#f1f5f9",
};
const STATUS_BORDER: Record<BudgetStatus, string> = {
  healthy: "#10b981",
  warning: "#f59e0b",
  critical: "#ef4444",
  exhausted: "#7f1d1d",
  no_data: "#94a3b8", // a11y-contrast:exception — used as borderColor on the SLO dashboard status badge (WCAG 1.4.11 non-text 3:1; slate-500 on white = 3.13:1 PASSES). Not text. Audit doc §wave-5.
};
const STATUS_LABEL_VI: Record<BudgetStatus, string> = {
  healthy: "Khỏe mạnh",
  warning: "Cảnh báo",
  critical: "Nguy cấp",
  exhausted: "Hết ngân sách",
  no_data: "Chưa đủ dữ liệu",
};

interface BurnChartPoint {
  hour: string;
  budget_remaining: number;
}

interface BurnAlertRow {
  id: number;
  slo_id: string;
  severity: string;
  burn_rate: number;
  budget_remaining_percent: number;
  sent_at: string;
  email_sent: boolean;
}

export default function SloDashboard() {
  const admin = useAdminAccess();
  const level = admin.permissions.level;
  const adminLoading = admin.loading;

  const [budgets, setBudgets] = useState<BudgetResult[]>([]);
  const [chartData, setChartData] = useState<Record<string, BurnChartPoint[]>>({});
  const [alerts, setAlerts] = useState<BurnAlertRow[]>([]);
  const [incidents, setIncidents] = useState<IncidentRow[]>([]);
  const [paused, setPaused] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (adminLoading) return;
    if (level < 9) return;

    let alive = true;
    setLoading(true);
    setError(null);

    void (async () => {
      try {
        const [budgetResults, alertsResp, incidentRows, pauseStatus] = await Promise.all([
          calculateAllBudgets(),
          supabase
            .from("slo_burn_alerts")
            .select("id, slo_id, severity, burn_rate, budget_remaining_percent, sent_at, email_sent")
            .order("sent_at", { ascending: false })
            .limit(50),
          listRecentIncidents(25),
          readSloPauseFlag(),
        ]);

        if (!alive) return;

        setBudgets(budgetResults);
        setAlerts((alertsResp.data ?? []) as BurnAlertRow[]);
        setIncidents(incidentRows);
        setPaused(pauseStatus.active);

        // Build per-SLO burn-down by aggregating slo_burn_alerts as
        // sample points (best-effort visualisation; the live current
        // value is shown in the per-SLO card above).
        const cMap: Record<string, BurnChartPoint[]> = {};
        for (const slo of SLOS) {
          const points = ((alertsResp.data ?? []) as BurnAlertRow[])
            .filter((r) => r.slo_id === slo.id)
            .slice()
            .reverse()
            .map((r) => ({
              hour: new Date(r.sent_at).toLocaleString(),
              budget_remaining: r.budget_remaining_percent,
            }));
          cMap[slo.id] = points;
        }
        setChartData(cMap);

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

  const overallStatus = useMemo(() => pickWorstStatus(budgets), [budgets]);

  if (adminLoading) {
    return <div style={wrap}>Checking admin access…</div>;
  }
  if (level < 9) return <Navigate to="/" replace />;

  const togglePause = async () => {
    const next = !paused;
    await setSloPauseFlag(next);
    setPaused(next);
  };

  return (
    <div style={wrap}>
      <div style={container}>
        <div>
          <h1 style={{ ...heading, fontSize: 24 }}>
            Error budget &amp; SLOs · Ngân sách lỗi &amp; SLO
          </h1>
          <div style={subHeading}>
            Reliability over time. Alerts go to admin@mercyblade.com.
          </div>
        </div>

        {error ? (
          <div style={{ ...card, borderColor: "#ef4444", color: "#b91c1c" }}>
            {error}
          </div>
        ) : null}

        {/* Hero */}
        <div
          style={{
            ...card,
            background: STATUS_BG[overallStatus],
            borderColor: STATUS_BORDER[overallStatus],
            borderWidth: 2,
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 700, color: "rgba(0,0,0,0.5)", textTransform: "uppercase" }}>
            Overall · Tổng quan
          </div>
          <div style={{ fontSize: 26, fontWeight: 900, marginTop: 4 }}>
            {STATUS_LABEL_VI[overallStatus]}
          </div>
          <div style={{ fontSize: 13, color: "rgba(0,0,0,0.6)", marginTop: 4 }}>
            {budgets.filter((b) => b.status === "healthy").length} healthy ·{" "}
            {budgets.filter((b) => b.status === "warning").length} warning ·{" "}
            {budgets.filter((b) => b.status === "critical").length} critical ·{" "}
            {budgets.filter((b) => b.status === "exhausted").length} exhausted ·{" "}
            {budgets.filter((b) => b.status === "no_data").length} no data
          </div>

          <div style={{ marginTop: 16, display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
            <button
              onClick={togglePause}
              style={{
                background: paused ? "#10b981" : "#dc2626",
                color: "white",
                border: "none",
                borderRadius: 8,
                padding: "10px 14px",
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              {paused ? "Resume non-critical work" : "Pause non-critical work"}
            </button>
            <span style={{ fontSize: 12, color: "rgba(0,0,0,0.55)" }}>
              {paused
                ? "slo_pause_active is ON — experiments and deploy gates can use this signal."
                : "slo_pause_active is OFF. Toggle on when reliability degrades."}
            </span>
          </div>
        </div>

        {/* Per-SLO cards */}
        <div>
          <h2 style={heading}>Per-SLO status</h2>
          <div style={subHeading}>
            Budget consumption over each SLO's rolling window
          </div>
          {loading ? (
            <div style={card}>Loading…</div>
          ) : (
            <div style={sloGrid}>
              {budgets.map((b) => {
                const slo = getSloById(b.slo_id);
                if (!slo) return null;
                return (
                  <Link
                    key={b.slo_id}
                    to={`/admin/slo/${b.slo_id}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <div
                      style={{
                        ...card,
                        background: STATUS_BG[b.status],
                        borderColor: STATUS_BORDER[b.status],
                        borderWidth: 2,
                        cursor: "pointer",
                      }}
                    >
                      <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(0,0,0,0.55)", textTransform: "uppercase" }}>
                        {STATUS_LABEL_VI[b.status]}
                      </div>
                      <div style={{ fontWeight: 800, fontSize: 15, marginTop: 4 }}>
                        {slo.name_vi}
                      </div>
                      <div style={{ fontSize: 11, color: "rgba(0,0,0,0.55)" }}>
                        {slo.name_en}
                      </div>
                      <div style={{ marginTop: 12, fontSize: 13 }}>
                        <div>
                          <b>Target:</b> {slo.target_percent}% · {slo.window_days}d
                        </div>
                        <div>
                          <b>Current:</b> {b.actual_percent}%
                        </div>
                        <div>
                          <b>Budget remaining:</b> {b.budget_remaining_percent}%
                        </div>
                        <div>
                          <b>Burn rate:</b> {b.burn_rate_per_hour}× normal
                        </div>
                        <div style={{ color: "rgba(0,0,0,0.5)", fontSize: 11, marginTop: 4 }}>
                          {b.total_count} samples · {b.bad_count} bad
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Per-SLO burn-down chart */}
        <div>
          <h2 style={heading}>Budget burn-down</h2>
          <div style={subHeading}>
            Remaining budget at each alert sample (latest 50)
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {SLOS.map((slo) => {
              const data = chartData[slo.id] ?? [];
              return (
                <div key={slo.id} style={card}>
                  <div style={{ fontWeight: 800, marginBottom: 8 }}>
                    {slo.name_vi} · <code style={{ fontSize: 12 }}>{slo.id}</code>
                  </div>
                  {data.length === 0 ? (
                    <div style={{ color: "rgba(0,0,0,0.5)", fontSize: 13 }}>
                      No burn-rate alerts on record yet.
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={180}>
                      <AreaChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="hour" tick={{ fontSize: 10 }} hide />
                        <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                        <Tooltip />
                        <Area type="monotone" dataKey="budget_remaining" stroke="#2563eb" fill="#bfdbfe" />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent burn events */}
        <div style={card}>
          <h2 style={heading}>Recent burn alerts</h2>
          <div style={subHeading}>Last 50 from slo_burn_alerts</div>
          {alerts.length === 0 ? (
            <div style={{ color: "rgba(0,0,0,0.5)", fontSize: 13 }}>
              No burn alerts on record.
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ textAlign: "left" }}>
                  <th style={th}>When</th>
                  <th style={th}>SLO</th>
                  <th style={th}>Severity</th>
                  <th style={th}>Burn rate</th>
                  <th style={th}>Budget remaining</th>
                  <th style={th}>Email</th>
                </tr>
              </thead>
              <tbody>
                {alerts.map((row) => (
                  <tr key={row.id}>
                    <td style={td}>{new Date(row.sent_at).toLocaleString()}</td>
                    <td style={td}><code>{row.slo_id}</code></td>
                    <td style={td}>{row.severity}</td>
                    <td style={td}>{row.burn_rate}× normal</td>
                    <td style={td}>{row.budget_remaining_percent}%</td>
                    <td style={td}>{row.email_sent ? "✓" : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Incidents */}
        <div style={card}>
          <h2 style={heading}>Incidents</h2>
          <div style={subHeading}>
            Auto-opened on critical SLO state, auto-resolved after 4 healthy hours.
          </div>
          {incidents.length === 0 ? (
            <div style={{ color: "rgba(0,0,0,0.5)", fontSize: 13 }}>
              No incidents on record.
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ textAlign: "left" }}>
                  <th style={th}>Started</th>
                  <th style={th}>SLO</th>
                  <th style={th}>Status</th>
                  <th style={th}>Peak burn</th>
                  <th style={th}>Resolved</th>
                </tr>
              </thead>
              <tbody>
                {incidents.map((row) => (
                  <tr key={row.id}>
                    <td style={td}>{new Date(row.started_at).toLocaleString()}</td>
                    <td style={td}><code>{row.slo_id}</code></td>
                    <td style={td}>{row.peak_status}</td>
                    <td style={td}>{row.peak_burn_rate ?? "—"}×</td>
                    <td style={td}>
                      {row.resolved_at
                        ? new Date(row.resolved_at).toLocaleString()
                        : "open"}
                    </td>
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
