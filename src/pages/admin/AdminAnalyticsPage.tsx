/**
 * /admin/analytics — usage dashboard for level-9+ admins.
 *
 * Calls four SECURITY DEFINER RPCs (see
 * supabase/migrations/20260427000000_admin_analytics_views.sql); every
 * RPC gates on get_admin_level >= 9 server-side, so even if someone
 * bypasses the client-side <Navigate> we never leak aggregate rows.
 *
 * Gating layers (defense-in-depth):
 *   1. useAdminAccess → level < 9 → <Navigate to="/" />.
 *   2. admin_analytics_enabled DB flag → disabled → <Navigate to="/admin" />.
 *   3. RPC itself rejects non-admins with 42501.
 */

import React, { useEffect, useMemo, useState } from "react";
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
import { useFeatureFlag } from "@/hooks/useFeatureFlag";
import {
  deriveHeadlineNumbers,
  fetchDailyActiveUsers,
  fetchFeatureUsage7d,
  fetchRoomPopularity,
  fetchUserFunnel,
  FUNNEL_LABELS,
  type DauRow,
  type FeatureUsageRow,
  type FunnelRow,
  type RoomPopularityRow,
} from "@/services/analyticsAdmin";

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
  gap: 12,
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
};
const kpiCard: React.CSSProperties = {
  ...card,
  display: "flex",
  flexDirection: "column",
  gap: 6,
};
const kpiLabel: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: 0.4,
  color: "rgba(0,0,0,0.55)",
  textTransform: "uppercase",
};
const kpiNumber: React.CSSProperties = {
  fontSize: 36,
  fontWeight: 900,
  letterSpacing: -1,
  color: "#0f172a",
  lineHeight: 1,
};
const tableStyle: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  fontSize: 13,
};
const thStyle: React.CSSProperties = {
  textAlign: "left",
  padding: "8px 10px",
  borderBottom: "1px solid rgba(0,0,0,0.08)",
  fontWeight: 700,
  color: "rgba(0,0,0,0.6)",
  cursor: "pointer",
  userSelect: "none",
};
const tdStyle: React.CSSProperties = {
  padding: "8px 10px",
  borderBottom: "1px solid rgba(0,0,0,0.04)",
};

type SortDir = "asc" | "desc";

function useSortedRooms(
  rows: RoomPopularityRow[],
  sortKey: keyof RoomPopularityRow,
  dir: SortDir,
) {
  return useMemo(() => {
    const out = [...rows];
    out.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (av === bv) return 0;
      if (av === null || av === undefined) return 1;
      if (bv === null || bv === undefined) return -1;
      if (typeof av === "number" && typeof bv === "number") {
        return dir === "asc" ? av - bv : bv - av;
      }
      const sa = String(av);
      const sb = String(bv);
      return dir === "asc" ? sa.localeCompare(sb) : sb.localeCompare(sa);
    });
    return out;
  }, [rows, sortKey, dir]);
}

export default function AdminAnalyticsPage() {
  const admin = useAdminAccess();
  const level = admin.permissions.level;
  const adminLoading = admin.loading;
  const { enabled: flagEnabled, loading: flagLoading } = useFeatureFlag(
    "admin_analytics_enabled",
    false,
  );

  const [dau, setDau] = useState<DauRow[]>([]);
  const [features, setFeatures] = useState<FeatureUsageRow[]>([]);
  const [funnel, setFunnel] = useState<FunnelRow[]>([]);
  const [rooms, setRooms] = useState<RoomPopularityRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [roomSortKey, setRoomSortKey] =
    useState<keyof RoomPopularityRow>("enrollments");
  const [roomSortDir, setRoomSortDir] = useState<SortDir>("desc");
  const sortedRooms = useSortedRooms(rooms, roomSortKey, roomSortDir);

  useEffect(() => {
    if (adminLoading || flagLoading) return;
    if (level < 9) return;
    if (!flagEnabled) return;

    let alive = true;
    setLoading(true);
    setError(null);

    Promise.all([
      fetchDailyActiveUsers(),
      fetchFeatureUsage7d(),
      fetchUserFunnel(),
      fetchRoomPopularity(),
    ])
      .then(([d, f, u, r]) => {
        if (!alive) return;
        setDau(d);
        setFeatures(f);
        setFunnel(u);
        setRooms(r);
        setLoading(false);
      })
      .catch((err) => {
        if (!alive) return;
        setError(err instanceof Error ? err.message : String(err));
        setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [level, adminLoading, flagEnabled, flagLoading]);

  if (adminLoading || flagLoading) {
    return (
      <div style={wrap}>
        <div style={container}>
          <p style={{ opacity: 0.6 }}>Loading…</p>
        </div>
      </div>
    );
  }
  if (level < 9) {
    // Client-side gate. The RPCs would reject anyway — this just avoids
    // a network roundtrip and the RPC error flash.
    return <Navigate to="/" replace />;
  }
  if (!flagEnabled) {
    return <Navigate to="/admin" replace />;
  }

  const kpi = deriveHeadlineNumbers(dau, funnel);

  return (
    <div style={wrap} data-testid="admin-analytics-page">
      <div style={container}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 900, margin: 0 }}>
            Admin analytics
          </h1>
          <p style={{ fontSize: 13, color: "rgba(0,0,0,0.55)", margin: "4px 0 0" }}>
            Usage overview across the last 30 days. Level 9+ only.
          </p>
        </div>

        {error ? (
          <div
            role="alert"
            style={{
              ...card,
              background: "#fef2f2",
              color: "#991b1b",
              borderColor: "#fecaca",
            }}
          >
            Failed to load: {error}
          </div>
        ) : null}

        {/* KPI row */}
        <div style={kpiGrid} data-testid="admin-analytics-kpis">
          <div style={kpiCard}>
            <span style={kpiLabel}>Total users</span>
            <span style={kpiNumber} data-testid="kpi-total-users">
              {kpi.totalUsers}
            </span>
          </div>
          <div style={kpiCard}>
            <span style={kpiLabel}>Active last 7 days</span>
            <span style={kpiNumber} data-testid="kpi-active-7d">
              {kpi.activeLast7d}
            </span>
            <span style={{ fontSize: 11, color: "rgba(0,0,0,0.45)" }}>
              peak DAU in window
            </span>
          </div>
          <div style={kpiCard}>
            <span style={kpiLabel}>Active last 30 days</span>
            <span style={kpiNumber} data-testid="kpi-active-30d">
              {kpi.activeLast30d}
            </span>
            <span style={{ fontSize: 11, color: "rgba(0,0,0,0.45)" }}>
              peak DAU in window
            </span>
          </div>
          <div style={kpiCard}>
            <span style={kpiLabel}>Paying users</span>
            <span style={kpiNumber} data-testid="kpi-paying-users">
              {kpi.payingUsers}
            </span>
            <span style={{ fontSize: 11, color: "rgba(0,0,0,0.45)" }}>
              hardcoded — wire to Stripe later
            </span>
          </div>
        </div>

        {/* DAU chart */}
        <div style={card} data-testid="dau-chart-card">
          <h2 style={heading}>Daily active users (30d)</h2>
          <p style={subHeading}>Distinct users per day, sourced from user_sessions.</p>
          <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer>
              <LineChart data={dau}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => String(v).slice(5)}
                />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="active_users"
                  stroke="#0ea5e9"
                  strokeWidth={2}
                  dot={{ r: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top features */}
        <div style={card} data-testid="features-card">
          <h2 style={heading}>Top feature events (7d)</h2>
          <p style={subHeading}>
            From user_behavior_tracking.interaction_type — more event
            sources will land as CC tracks wire up more emit points.
          </p>
          <div style={{ width: "100%", height: 220, marginBottom: 12 }}>
            <ResponsiveContainer>
              <BarChart data={features.slice(0, 8)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="event_name" tick={{ fontSize: 10 }} interval={0} angle={-20} textAnchor="end" height={60} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="event_count" fill="#0ea5e9" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <table style={tableStyle} data-testid="features-table">
            <thead>
              <tr>
                <th style={thStyle}>Event</th>
                <th style={{ ...thStyle, textAlign: "right" }}>Count</th>
                <th style={{ ...thStyle, textAlign: "right" }}>Unique users</th>
              </tr>
            </thead>
            <tbody>
              {features.length === 0 && !loading ? (
                <tr>
                  <td style={tdStyle} colSpan={3}>
                    No events in the last 7 days yet.
                  </td>
                </tr>
              ) : (
                features.map((f) => (
                  <tr key={f.event_name}>
                    <td style={{ ...tdStyle, fontFamily: "monospace" }}>{f.event_name}</td>
                    <td style={{ ...tdStyle, textAlign: "right" }}>{f.event_count}</td>
                    <td style={{ ...tdStyle, textAlign: "right" }}>{f.unique_users}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Funnel */}
        <div style={card} data-testid="funnel-card">
          <h2 style={heading}>User funnel</h2>
          <p style={subHeading}>% of signed-up users who reached each stage.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {funnel.map((row) => {
              const label =
                FUNNEL_LABELS[row.stage] ?? { en: row.stage, vi: row.stage };
              const pct = Number(row.pct_of_signups) || 0;
              return (
                <div key={row.stage_order} data-testid={`funnel-row-${row.stage}`}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: 13,
                      fontWeight: 700,
                      marginBottom: 4,
                    }}
                  >
                    <span>
                      {label.en}
                      <span style={{ fontWeight: 500, color: "rgba(0,0,0,0.45)", marginLeft: 8 }}>
                        {label.vi}
                      </span>
                    </span>
                    <span>
                      {row.count} ({pct.toFixed(1)}%)
                    </span>
                  </div>
                  <div
                    style={{
                      height: 10,
                      background: "#e2e8f0",
                      borderRadius: 9999,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${Math.min(100, Math.max(0, pct))}%`,
                        height: "100%",
                        background: "#0ea5e9",
                        borderRadius: 9999,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Room popularity */}
        <div style={card} data-testid="rooms-card">
          <h2 style={heading}>Room popularity</h2>
          <p style={subHeading}>Click a column header to sort.</p>
          <div style={{ overflowX: "auto" }}>
            <table style={tableStyle} data-testid="rooms-table">
              <thead>
                <tr>
                  {(
                    [
                      { key: "room_id", label: "Room" },
                      { key: "enrollments", label: "Enrollments" },
                      { key: "completions", label: "Completions" },
                      { key: "avg_progress_pct", label: "Avg progress %" },
                      { key: "last_activity_at", label: "Last activity" },
                    ] as Array<{ key: keyof RoomPopularityRow; label: string }>
                  ).map(({ key, label }) => {
                    const isActive = roomSortKey === key;
                    return (
                      <th
                        key={String(key)}
                        style={{
                          ...thStyle,
                          textAlign: key === "room_id" ? "left" : "right",
                          color: isActive ? "#0ea5e9" : thStyle.color,
                        }}
                        onClick={() => {
                          if (roomSortKey === key) {
                            setRoomSortDir((d) => (d === "asc" ? "desc" : "asc"));
                          } else {
                            setRoomSortKey(key);
                            setRoomSortDir("desc");
                          }
                        }}
                        data-testid={`room-sort-${String(key)}`}
                      >
                        {label}
                        {isActive ? (roomSortDir === "asc" ? " ↑" : " ↓") : ""}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {sortedRooms.length === 0 && !loading ? (
                  <tr>
                    <td style={tdStyle} colSpan={5}>
                      No room enrollments yet.
                    </td>
                  </tr>
                ) : (
                  sortedRooms.map((r) => (
                    <tr key={r.room_id}>
                      <td style={{ ...tdStyle, fontFamily: "monospace" }}>{r.room_id}</td>
                      <td style={{ ...tdStyle, textAlign: "right" }}>{r.enrollments}</td>
                      <td style={{ ...tdStyle, textAlign: "right" }}>{r.completions}</td>
                      <td style={{ ...tdStyle, textAlign: "right" }}>
                        {r.avg_progress_pct == null
                          ? "—"
                          : Number(r.avg_progress_pct).toFixed(1)}
                      </td>
                      <td style={{ ...tdStyle, textAlign: "right" }}>
                        {r.last_activity_at
                          ? new Date(r.last_activity_at).toISOString().slice(0, 10)
                          : "—"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {loading ? (
          <p style={{ opacity: 0.5, fontSize: 13 }}>Refreshing…</p>
        ) : null}
      </div>
    </div>
  );
}
