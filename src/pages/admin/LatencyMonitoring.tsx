/**
 * /admin/latency — slow-degradation dashboard for level-9+ admins.
 *
 * Companion: src/lib/admin/latencyAlerts.ts (detection logic),
 * src/config/latencyThresholds.ts (per-op thresholds),
 * supabase/functions/latency-alert-cron/ (15-min check + email).
 *
 * Sections:
 *   1. Live status card per monitored operation (green/yellow/red)
 *   2. 24-hour P50/P95/P99 line chart per operation
 *   3. Alert history (last 100)
 *   4. Pause-alerts-for-N-hours button (sets alert_pause.paused_until)
 */

import React, { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
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

import { useAdminAccess } from "@/hooks/admin/useAdminAccess";
import { supabase } from "@/lib/supabaseClient";
import {
  detectLatencyDegradation,
  type DegradationResult,
  type DegradationStatus,
} from "@/lib/admin/latencyAlerts";
import {
  LATENCY_THRESHOLDS,
  MONITORED_OPERATIONS,
  type LatencyOperation,
} from "@/config/latencyThresholds";

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
const statusGrid: React.CSSProperties = {
  display: "grid",
  gap: 12,
  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
};

const STATUS_BG: Record<DegradationStatus, string> = {
  healthy: "#ecfdf5",
  warning: "#fef3c7",
  alert: "#fee2e2",
  insufficient_data: "#f1f5f9",
};
const STATUS_BORDER: Record<DegradationStatus, string> = {
  healthy: "#10b981",
  warning: "#f59e0b",
  alert: "#ef4444",
  insufficient_data: "#94a3b8",
};
const STATUS_LABEL: Record<DegradationStatus, string> = {
  healthy: "Healthy",
  warning: "Warning",
  alert: "Alert",
  insufficient_data: "No data",
};

interface AlertRow {
  id: number;
  operation: string;
  current_p95_ms: number;
  baseline_p95_ms: number;
  increase_percent: number;
  severity: string;
  sent_at: string;
  email_sent: boolean;
}

interface ChartPoint {
  bucket: string;
  p50: number | null;
  p95: number | null;
  p99: number | null;
}

interface RawEvent {
  recorded_at: string;
  duration_ms: number;
}

function bucketEventsHourly(rows: RawEvent[]): ChartPoint[] {
  const buckets = new Map<string, number[]>();
  for (const row of rows) {
    const t = new Date(row.recorded_at);
    t.setUTCMinutes(0, 0, 0);
    const key = t.toISOString();
    const arr = buckets.get(key) ?? [];
    arr.push(row.duration_ms);
    buckets.set(key, arr);
  }
  const out: ChartPoint[] = [];
  for (const [bucket, durations] of buckets.entries()) {
    durations.sort((a, b) => a - b);
    out.push({
      bucket: bucket.slice(11, 16),
      p50: percentile(durations, 0.5),
      p95: percentile(durations, 0.95),
      p99: percentile(durations, 0.99),
    });
  }
  out.sort((a, b) => a.bucket.localeCompare(b.bucket));
  return out;
}

function percentile(sortedAsc: number[], p: number): number | null {
  if (sortedAsc.length === 0) return null;
  const idx = Math.min(
    sortedAsc.length - 1,
    Math.floor(p * sortedAsc.length),
  );
  return sortedAsc[idx];
}

export default function LatencyMonitoring() {
  const admin = useAdminAccess();
  const level = admin.permissions.level;
  const adminLoading = admin.loading;

  const [statuses, setStatuses] = useState<Record<string, DegradationResult>>({});
  const [chartData, setChartData] = useState<Record<string, ChartPoint[]>>({});
  const [alerts, setAlerts] = useState<AlertRow[]>([]);
  const [pausedUntil, setPausedUntil] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pauseHours, setPauseHours] = useState(2);

  useEffect(() => {
    if (adminLoading) return;
    if (level < 9) return;

    let alive = true;
    setLoading(true);
    setError(null);

    void (async () => {
      try {
        const [statusEntries, chartEntries, alertsResp, pauseResp] = await Promise.all([
          Promise.all(
            MONITORED_OPERATIONS.map(async (op) => {
              const result = await detectLatencyDegradation(op);
              return [op, result] as const;
            }),
          ),
          Promise.all(
            MONITORED_OPERATIONS.map(async (op) => {
              const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
              const { data } = await supabase
                .from("latency_events")
                .select("recorded_at, duration_ms")
                .eq("operation", op)
                .gte("recorded_at", since)
                .order("recorded_at", { ascending: true });
              const rows = (data ?? []) as RawEvent[];
              return [op, bucketEventsHourly(rows)] as const;
            }),
          ),
          supabase
            .from("alert_history")
            .select("id, operation, current_p95_ms, baseline_p95_ms, increase_percent, severity, sent_at, email_sent")
            .order("sent_at", { ascending: false })
            .limit(100),
          supabase
            .from("alert_pause")
            .select("paused_until")
            .eq("id", 1)
            .maybeSingle(),
        ]);

        if (!alive) return;

        const sMap: Record<string, DegradationResult> = {};
        for (const [op, result] of statusEntries) sMap[op] = result;
        setStatuses(sMap);

        const cMap: Record<string, ChartPoint[]> = {};
        for (const [op, points] of chartEntries) cMap[op] = points;
        setChartData(cMap);

        setAlerts((alertsResp.data ?? []) as AlertRow[]);
        setPausedUntil(
          (pauseResp.data as { paused_until?: string | null } | null)?.paused_until ?? null,
        );
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

  const isPaused = useMemo(() => {
    if (!pausedUntil) return false;
    const ms = Date.parse(pausedUntil);
    return Number.isFinite(ms) && ms > Date.now();
  }, [pausedUntil]);

  if (adminLoading) {
    return <div style={wrap}>Checking admin access…</div>;
  }
  if (level < 9) {
    return <Navigate to="/" replace />;
  }

  const handlePause = async () => {
    const until = new Date(Date.now() + pauseHours * 60 * 60 * 1000).toISOString();
    const { error: updErr } = await supabase
      .from("alert_pause")
      .update({
        paused_until: until,
        paused_by: admin.userId ?? null,
        reason: `paused ${pauseHours}h via /admin/latency`,
        updated_at: new Date().toISOString(),
      })
      .eq("id", 1);
    if (updErr) {
      setError(updErr.message);
      return;
    }
    setPausedUntil(until);
  };

  const handleResume = async () => {
    const { error: updErr } = await supabase
      .from("alert_pause")
      .update({
        paused_until: null,
        paused_by: admin.userId ?? null,
        reason: "resumed via /admin/latency",
        updated_at: new Date().toISOString(),
      })
      .eq("id", 1);
    if (updErr) {
      setError(updErr.message);
      return;
    }
    setPausedUntil(null);
  };

  return (
    <div style={wrap}>
      <div style={container}>
        <div>
          <h1 style={{ ...heading, fontSize: 24 }}>Latency monitoring</h1>
          <div style={subHeading}>
            P95 over the last hour vs the 7-day baseline. Alerts go to admin@mercyblade.com.
          </div>
        </div>

        {error ? (
          <div style={{ ...card, borderColor: "#ef4444", color: "#b91c1c" }}>
            {error}
          </div>
        ) : null}

        {/* Pause control */}
        <div style={card}>
          <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
            {isPaused ? (
              <>
                <span style={{ fontWeight: 700 }}>
                  Alerts paused until {pausedUntil ? new Date(pausedUntil).toLocaleString() : "?"}
                </span>
                <button
                  onClick={handleResume}
                  style={btn("#10b981")}
                >
                  Resume alerts
                </button>
              </>
            ) : (
              <>
                <span style={{ fontWeight: 700 }}>Pause alerts for</span>
                <select
                  value={pauseHours}
                  onChange={(e) => setPauseHours(Number(e.target.value))}
                  style={{ padding: 6, borderRadius: 8, border: "1px solid rgba(0,0,0,0.12)" }}
                >
                  <option value={1}>1 hour</option>
                  <option value={2}>2 hours</option>
                  <option value={4}>4 hours</option>
                  <option value={8}>8 hours</option>
                </select>
                <button onClick={handlePause} style={btn("#2563eb")}>
                  Pause
                </button>
                <span style={{ fontSize: 12, color: "rgba(0,0,0,0.5)" }}>
                  Use during deploys to suppress noise.
                </span>
              </>
            )}
          </div>
        </div>

        {/* Live status cards */}
        <div>
          <h2 style={heading}>Current status</h2>
          <div style={subHeading}>Last hour P95 per operation</div>
          {loading ? (
            <div style={card}>Loading…</div>
          ) : (
            <div style={statusGrid}>
              {MONITORED_OPERATIONS.map((op) => {
                const result = statuses[op];
                const threshold = LATENCY_THRESHOLDS[op as LatencyOperation];
                if (!result) return null;
                return (
                  <div
                    key={op}
                    style={{
                      ...card,
                      background: STATUS_BG[result.status],
                      borderColor: STATUS_BORDER[result.status],
                      borderWidth: 2,
                    }}
                  >
                    <div style={{ fontSize: 12, fontWeight: 700, color: "rgba(0,0,0,0.5)", textTransform: "uppercase" }}>
                      {STATUS_LABEL[result.status]}
                    </div>
                    <div style={{ fontWeight: 800, fontSize: 15, marginTop: 4 }}>
                      {threshold?.label ?? op}
                    </div>
                    <div style={{ fontSize: 12, color: "rgba(0,0,0,0.6)", marginTop: 2 }}>
                      <code>{op}</code>
                    </div>
                    <div style={{ marginTop: 10, fontSize: 13 }}>
                      <div>
                        <b>Current P95:</b> {result.current_p95_ms} ms
                      </div>
                      <div>
                        <b>Baseline P95:</b> {result.baseline_p95_ms} ms
                      </div>
                      <div>
                        <b>Δ:</b>{" "}
                        <span style={{ color: result.increase_percent >= 30 ? "#b91c1c" : "#0f172a" }}>
                          {result.increase_percent >= 0 ? "+" : ""}
                          {result.increase_percent}%
                        </span>
                      </div>
                      <div>
                        <b>Samples (1h):</b> {result.sample_count}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Per-operation 24h charts */}
        <div>
          <h2 style={heading}>24-hour latency trend</h2>
          <div style={subHeading}>P50, P95, P99 per hour bucket</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {MONITORED_OPERATIONS.map((op) => {
              const data = chartData[op] ?? [];
              return (
                <div key={op} style={card}>
                  <div style={{ fontWeight: 800, marginBottom: 8 }}>
                    {LATENCY_THRESHOLDS[op as LatencyOperation]?.label ?? op}
                  </div>
                  {data.length === 0 ? (
                    <div style={{ color: "rgba(0,0,0,0.5)", fontSize: 13 }}>
                      No samples in the last 24 hours.
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={220}>
                      <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="bucket" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="p50" stroke="#10b981" dot={false} />
                        <Line type="monotone" dataKey="p95" stroke="#f59e0b" dot={false} />
                        <Line type="monotone" dataKey="p99" stroke="#ef4444" dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Alert history */}
        <div style={card}>
          <h2 style={heading}>Alert history</h2>
          <div style={subHeading}>Last 100 alerts</div>
          {alerts.length === 0 ? (
            <div style={{ color: "rgba(0,0,0,0.5)", fontSize: 13 }}>
              No alerts on record.
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ textAlign: "left" }}>
                  <th style={th}>When</th>
                  <th style={th}>Operation</th>
                  <th style={th}>Severity</th>
                  <th style={th}>Current P95</th>
                  <th style={th}>Baseline</th>
                  <th style={th}>Δ</th>
                  <th style={th}>Email</th>
                </tr>
              </thead>
              <tbody>
                {alerts.map((row) => (
                  <tr key={row.id}>
                    <td style={td}>{new Date(row.sent_at).toLocaleString()}</td>
                    <td style={td}><code>{row.operation}</code></td>
                    <td style={td}>{row.severity}</td>
                    <td style={td}>{row.current_p95_ms} ms</td>
                    <td style={td}>{row.baseline_p95_ms} ms</td>
                    <td style={td}>+{row.increase_percent}%</td>
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

function btn(bg: string): React.CSSProperties {
  return {
    background: bg,
    color: "white",
    border: "none",
    borderRadius: 8,
    padding: "8px 14px",
    fontWeight: 800,
    cursor: "pointer",
  };
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
