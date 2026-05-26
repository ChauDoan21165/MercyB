/**
 * /admin/behavioral — daily activity + conversion funnel.
 *
 * Reads through SECURITY DEFINER RPCs (get_behavioral_metrics +
 * get_conversion_funnel). The RPCs are admin-gated server-side; this
 * page also gates client-side via useAdminAccess for defense in
 * depth.
 *
 * Charts:
 *   - Daily new signups (last 90 days)
 *   - Daily active users (heartbeat: user_sessions.last_activity)
 *   - Daily speech_attempts
 *   - Conversion funnel snapshot
 *
 * The Recharts surfaces are read-only — date-range filter changes
 * trigger a single RPC roundtrip; we never recompute on the client.
 */

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { useAdminAccess } from "@/hooks/admin/useAdminAccess";
import { supabase } from "@/lib/supabaseClient";

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
  fontSize: 22,
  fontWeight: 900,
  marginTop: 0,
  marginBottom: 4,
  color: "rgba(10,10,10,0.94)",
};
const subhead: React.CSSProperties = {
  fontSize: 13,
  color: "#64748b",
  margin: 0,
};
const sectionTitle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: 0.4,
  color: "rgba(0,0,0,0.55)",
};

type MetricRow = {
  metric_date: string;
  new_signups: number;
  active_users: number;
  speech_attempts: number;
};

type FunnelRow = {
  signed_up: number;
  reached_first: number;
  reached_five: number;
  reached_thirty: number;
  paid: number;
};

type Window = 30 | 60 | 90;

function pct(part: number, whole: number): string {
  if (whole <= 0) return "—";
  return `${Math.round((part / whole) * 100)}%`;
}

export default function BehavioralAnalytics(): React.ReactElement {
  const { permissions, loading: accessLoading } = useAdminAccess();
  const [windowDays, setWindowDays] = useState<Window>(90);
  const [metrics, setMetrics] = useState<MetricRow[]>([]);
  const [funnel, setFunnel] = useState<FunnelRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const since = new Date(Date.now() - windowDays * 86400_000)
        .toISOString()
        .slice(0, 10);
      const until = new Date().toISOString().slice(0, 10);
      const [{ data: metricRows, error: metricErr }, { data: funnelRows, error: funnelErr }] =
        await Promise.all([
          supabase.rpc("get_behavioral_metrics" as never, {
            p_since: since,
            p_until: until,
          } as never),
          supabase.rpc("get_conversion_funnel" as never),
        ]);
      if (metricErr) throw metricErr;
      if (funnelErr) throw funnelErr;
      setMetrics(((metricRows as unknown) ?? []) as MetricRow[]);
      const fr = Array.isArray(funnelRows) ? funnelRows[0] : (funnelRows as unknown);
      setFunnel((fr as FunnelRow | undefined) ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, [windowDays]);

  useEffect(() => {
    if (accessLoading || permissions.level < 9) return;
    void reload();
  }, [accessLoading, permissions.level, reload]);

  const chartRows = useMemo(
    () =>
      metrics.map((m) => ({
        date: m.metric_date.slice(5), // MM-DD
        new_signups: m.new_signups,
        active_users: m.active_users,
        speech_attempts: m.speech_attempts,
      })),
    [metrics],
  );

  if (accessLoading) {
    return (
      <div style={wrap}>
        <p style={{ color: "#64748b", fontSize: 13 }}>Loading…</p>
      </div>
    );
  }
  if (permissions.level < 9) return <Navigate to="/" replace />;

  return (
    <div style={wrap}>
      <div style={container}>
        <header>
          <h1 style={heading}>Phân tích hành vi · Behavioral analytics</h1>
          <p style={subhead}>
            Daily active users, signups, speech attempts, and the conversion funnel.
          </p>
        </header>

        <section style={card}>
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "rgba(0,0,0,0.55)" }}>
              Cửa sổ · Window:
            </span>
            {([30, 60, 90] as Window[]).map((w) => (
              <button
                key={w}
                type="button"
                onClick={() => setWindowDays(w)}
                data-testid={`behavioral-window-${w}`}
                style={{
                  padding: "4px 12px",
                  borderRadius: 9999,
                  fontSize: 12,
                  fontWeight: 700,
                  border: `1px solid ${windowDays === w ? "#1e3a8a" : "rgba(0,0,0,0.12)"}`,
                  background: windowDays === w ? "#1e3a8a" : "white",
                  color: windowDays === w ? "white" : "#1f2937",
                  cursor: "pointer",
                }}
              >
                {w}d
              </button>
            ))}
          </div>
        </section>

        {error ? (
          <div role="alert" style={{ ...card, borderColor: "#fecaca", background: "#fef2f2", color: "#991b1b", fontSize: 13 }}>
            {error}
          </div>
        ) : null}

        {loading ? (
          <div style={{ ...card, color: "#64748b", fontSize: 13 }}>Đang tải… · Loading…</div>
        ) : (
          <>
            {/* DAU + signups (line) */}
            <section style={card}>
              <div style={sectionTitle}>DAU và đăng ký mới · DAU and new signups</div>
              <div style={{ width: "100%", height: 260, marginTop: 10 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartRows}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="date" tick={{ fontSize: 10 }} interval={Math.floor(chartRows.length / 12)} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="active_users"
                      stroke="#1e3a8a"
                      strokeWidth={2}
                      name="DAU"
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="new_signups"
                      stroke="#059669"
                      strokeWidth={2}
                      name="New signups"
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </section>

            {/* Daily speech attempts (bar) */}
            <section style={card}>
              <div style={sectionTitle}>Speech attempts mỗi ngày · Daily speech attempts</div>
              <div style={{ width: "100%", height: 220, marginTop: 10 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartRows}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="date" tick={{ fontSize: 10 }} interval={Math.floor(chartRows.length / 12)} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Bar dataKey="speech_attempts" fill="#d97706" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>

            {/* Funnel */}
            {funnel ? (
              <section style={card}>
                <div style={sectionTitle}>Phễu chuyển đổi · Conversion funnel</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10, marginTop: 12 }}>
                  <FunnelStat label="Signed up · Đăng ký" value={funnel.signed_up} ofTotal={funnel.signed_up} />
                  <FunnelStat label="First attempt" value={funnel.reached_first} ofTotal={funnel.signed_up} />
                  <FunnelStat label="5 attempts" value={funnel.reached_five} ofTotal={funnel.signed_up} />
                  <FunnelStat label="30 attempts" value={funnel.reached_thirty} ofTotal={funnel.signed_up} />
                  <FunnelStat label="Paid · Trả phí" value={funnel.paid} ofTotal={funnel.signed_up} highlight />
                </div>
              </section>
            ) : null}
          </>
        )}

        <p style={{ fontSize: 11, color: "#94a3b8" }}>
          Data is read through SECURITY DEFINER RPCs that gate on get_admin_level
          ≥ 9. No individual user rows are returned to the client.
        </p>
      </div>
    </div>
  );
}

function FunnelStat({
  label,
  value,
  ofTotal,
  highlight,
}: {
  label: string;
  value: number;
  ofTotal: number;
  highlight?: boolean;
}) {
  return (
    <div
      style={{
        padding: "12px 14px",
        background: highlight ? "#ecfdf5" : "#f8fafc",
        border: `1px solid ${highlight ? "#a7f3d0" : "rgba(0,0,0,0.06)"}`,
        borderRadius: 12,
      }}
    >
      <div style={{ fontSize: 11, fontWeight: 700, color: "#475569" }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 900, color: highlight ? "#065f46" : "#1f2937", marginTop: 4, fontVariantNumeric: "tabular-nums" }}>
        {value.toLocaleString()}
      </div>
      <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>
        {pct(value, ofTotal)} of signups
      </div>
    </div>
  );
}
