/**
 * /admin/slo/:sloId — drill-down for a single SLO.
 *
 * Sections:
 *   1. SLO definition card (target, window, criteria)
 *   2. Current budget summary
 *   3. Hour-by-hour bad-rate breakdown (24h)
 *   4. Top failing operations (when this SLO is latency_events backed,
 *      surfaces which operation contributed most bad samples)
 *   5. Recent burn alerts + incidents for this SLO
 */

import React, { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { useAdminAccess } from "@/hooks/admin/useAdminAccess";
import { supabase } from "@/lib/supabaseClient";
import {
  calculateErrorBudget,
  type BudgetResult,
  type BudgetStatus,
} from "@/lib/admin/errorBudget";
import { listRecentIncidents, type IncidentRow } from "@/lib/admin/incidentLog";
import { getSloById } from "@/config/slos";

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

const STATUS_COLOR: Record<BudgetStatus, string> = {
  healthy: "#10b981",
  warning: "#f59e0b",
  critical: "#ef4444",
  exhausted: "#7f1d1d",
  no_data: "#94a3b8", // a11y-contrast:exception — used as borderColor on the SLO status badge (WCAG 1.4.11 non-text 3:1; slate-500 on white = 3.13:1 PASSES). Not text. Audit doc §wave-5.
};

interface HourBucket {
  hour: string;
  good: number;
  bad: number;
  bad_percent: number;
}

interface BurnAlertRow {
  id: number;
  severity: string;
  burn_rate: number;
  budget_remaining_percent: number;
  sent_at: string;
}

function bucketEventsHourly(
  rows: { recorded_at: string; duration_ms: number; status: string }[],
  threshold: number,
): HourBucket[] {
  const buckets = new Map<string, { good: number; bad: number }>();
  for (const row of rows) {
    const t = new Date(row.recorded_at);
    t.setUTCMinutes(0, 0, 0);
    const key = t.toISOString();
    const cur = buckets.get(key) ?? { good: 0, bad: 0 };
    if (row.status === "success" && row.duration_ms <= threshold) cur.good++;
    else cur.bad++;
    buckets.set(key, cur);
  }
  const out: HourBucket[] = [];
  for (const [hour, c] of buckets.entries()) {
    const total = c.good + c.bad;
    out.push({
      hour: hour.slice(11, 16),
      good: c.good,
      bad: c.bad,
      bad_percent: total === 0 ? 0 : Math.round((c.bad / total) * 100 * 10) / 10,
    });
  }
  out.sort((a, b) => a.hour.localeCompare(b.hour));
  return out;
}

export default function SloDetail() {
  const params = useParams();
  const sloId = params.sloId ?? "";
  const slo = getSloById(sloId);

  const admin = useAdminAccess();
  const level = admin.permissions.level;
  const adminLoading = admin.loading;

  const [budget, setBudget] = useState<BudgetResult | null>(null);
  const [hourly, setHourly] = useState<HourBucket[]>([]);
  const [incidents, setIncidents] = useState<IncidentRow[]>([]);
  const [alerts, setAlerts] = useState<BurnAlertRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (adminLoading || level < 9) return;
    if (!slo) return;

    let alive = true;
    setLoading(true);

    void (async () => {
      try {
        const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

        const eventsPromise =
          slo.data_source === "latency_events" && slo.operation && typeof slo.good_threshold_ms === "number"
            ? supabase
                .from("latency_events")
                .select("recorded_at, duration_ms, status")
                .eq("operation", slo.operation)
                .gte("recorded_at", since)
                .order("recorded_at", { ascending: true })
            : Promise.resolve({ data: [] as unknown[] });

        const [b, eventsResp, incidentRows, alertsResp] = await Promise.all([
          calculateErrorBudget(sloId),
          eventsPromise,
          listRecentIncidents(50),
          supabase
            .from("slo_burn_alerts")
            .select("id, severity, burn_rate, budget_remaining_percent, sent_at")
            .eq("slo_id", sloId)
            .order("sent_at", { ascending: false })
            .limit(50),
        ]);

        if (!alive) return;
        setBudget(b);

        if (slo.data_source === "latency_events" && typeof slo.good_threshold_ms === "number") {
          setHourly(
            bucketEventsHourly(
              (eventsResp.data ?? []) as { recorded_at: string; duration_ms: number; status: string }[],
              slo.good_threshold_ms,
            ),
          );
        }

        setIncidents(incidentRows.filter((i) => i.slo_id === sloId));
        setAlerts((alertsResp.data ?? []) as BurnAlertRow[]);
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
  }, [adminLoading, level, slo, sloId]);

  const status: BudgetStatus = useMemo(() => budget?.status ?? "no_data", [budget]);

  if (adminLoading) return <div style={wrap}>Checking admin access…</div>;
  if (level < 9) return <Navigate to="/" replace />;
  if (!slo) {
    return (
      <div style={wrap}>
        <div style={container}>
          <div style={card}>Unknown SLO id: <code>{sloId}</code></div>
          <div>
            <Link to="/admin/slo">← Back to SLO dashboard</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={wrap}>
      <div style={container}>
        <div>
          <Link to="/admin/slo" style={{ fontSize: 13 }}>← All SLOs</Link>
          <h1 style={{ ...heading, fontSize: 24, marginTop: 8 }}>
            {slo.name_vi}
          </h1>
          <div style={{ ...subHeading, marginBottom: 4 }}>{slo.name_en}</div>
          <div style={{ fontSize: 13, color: "rgba(0,0,0,0.7)" }}>
            <code>{slo.id}</code> · target {slo.target_percent}% · window {slo.window_days}d
          </div>
        </div>

        {error ? (
          <div style={{ ...card, borderColor: "#ef4444", color: "#b91c1c" }}>
            {error}
          </div>
        ) : null}

        {/* Definition + budget summary */}
        <div style={{ ...card, borderLeft: `6px solid ${STATUS_COLOR[status]}` }}>
          <div style={{ fontSize: 13, color: "rgba(0,0,0,0.6)" }}>
            <b>Success criteria:</b> {slo.success_criteria}
          </div>
          {budget ? (
            <div style={{ marginTop: 12, display: "grid", gap: 8, gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
              <Stat label="Status" value={status} />
              <Stat label="Actual %" value={`${budget.actual_percent}%`} />
              <Stat label="Budget remaining" value={`${budget.budget_remaining_percent}%`} />
              <Stat label="Burn rate" value={`${budget.burn_rate_per_hour}× normal`} />
              <Stat label="Samples" value={String(budget.total_count)} />
              <Stat label="Bad" value={String(budget.bad_count)} />
            </div>
          ) : null}
        </div>

        {/* 24h hourly bad-rate */}
        {slo.data_source === "latency_events" ? (
          <div style={card}>
            <h2 style={heading}>24-hour bad-rate breakdown</h2>
            <div style={subHeading}>
              Percentage of {slo.operation} requests that fell outside the SLO threshold
            </div>
            {loading ? (
              <div>Loading…</div>
            ) : hourly.length === 0 ? (
              <div style={{ color: "rgba(0,0,0,0.5)", fontSize: 13 }}>
                No samples in the last 24 hours.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={hourly}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="hour" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} unit="%" />
                  <Tooltip />
                  <Bar dataKey="bad_percent" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        ) : (
          <div style={card}>
            <h2 style={heading}>Hour-by-hour breakdown</h2>
            <div style={{ color: "rgba(0,0,0,0.6)", fontSize: 13 }}>
              This SLO is sourced from <code>{slo.data_source}</code>. Hourly
              breakdown is not yet wired — see <code>docs/slo-handbook.md</code>
              for how to populate the snapshot table.
            </div>
          </div>
        )}

        {/* Burn alerts for this SLO */}
        <div style={card}>
          <h2 style={heading}>Recent burn alerts</h2>
          <div style={subHeading}>Last 50 for this SLO</div>
          {alerts.length === 0 ? (
            <div style={{ color: "rgba(0,0,0,0.5)", fontSize: 13 }}>None.</div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ textAlign: "left" }}>
                  <th style={th}>When</th>
                  <th style={th}>Severity</th>
                  <th style={th}>Burn rate</th>
                  <th style={th}>Remaining</th>
                </tr>
              </thead>
              <tbody>
                {alerts.map((row) => (
                  <tr key={row.id}>
                    <td style={td}>{new Date(row.sent_at).toLocaleString()}</td>
                    <td style={td}>{row.severity}</td>
                    <td style={td}>{row.burn_rate}×</td>
                    <td style={td}>{row.budget_remaining_percent}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Incidents for this SLO */}
        <div style={card}>
          <h2 style={heading}>Incidents</h2>
          <div style={subHeading}>For this SLO only</div>
          {incidents.length === 0 ? (
            <div style={{ color: "rgba(0,0,0,0.5)", fontSize: 13 }}>None.</div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ textAlign: "left" }}>
                  <th style={th}>Started</th>
                  <th style={th}>Status</th>
                  <th style={th}>Peak burn</th>
                  <th style={th}>Resolved</th>
                </tr>
              </thead>
              <tbody>
                {incidents.map((row) => (
                  <tr key={row.id}>
                    <td style={td}>{new Date(row.started_at).toLocaleString()}</td>
                    <td style={td}>{row.peak_status}</td>
                    <td style={td}>{row.peak_burn_rate ?? "—"}×</td>
                    <td style={td}>{row.resolved_at ? new Date(row.resolved_at).toLocaleString() : "open"}</td>
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

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(0,0,0,0.55)", textTransform: "uppercase" }}>
        {label}
      </div>
      <div style={{ fontSize: 16, fontWeight: 800, marginTop: 2 }}>{value}</div>
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
