/**
 * /admin/retention — cohort retention triangle.
 *
 * Reads pre-computed buckets from public.cohort_retention_daily via
 * the get_cohort_retention SECURITY DEFINER RPC. The aggregator edge
 * function (cohort-retention-aggregator) writes that table on a daily
 * cron. The dashboard never recomputes retention on the client.
 *
 * Defense-in-depth gating:
 *   1. useAdminAccess → level < 9 → <Navigate to="/" />.
 *   2. RPC itself checks public.get_admin_level() >= 9 and returns
 *      zero rows for non-admins.
 *
 * VI labels are surfaced alongside EN per CLAUDE.md, even on admin
 * surfaces, so screenshots taken for the team thread read identically
 * across the bilingual user base.
 */

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";

import { useAdminAccess } from "@/hooks/admin/useAdminAccess";
import { supabase } from "@/lib/supabaseClient";
import {
  RETENTION_DAY_OFFSETS,
  classifyRetention,
  type CohortBucketCount,
  type RetentionDayOffset,
  type Segment,
  type RetentionTier,
} from "@/lib/admin/cohortRetention";
import {
  generateEngagementInsights,
  type EngagementInsight,
} from "@/lib/admin/engagementInsights";

// ── Style tokens (match the rest of /admin/*) ─────────────────────────

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

// ── Cell colour palette ───────────────────────────────────────────────

const TIER_COLOR: Record<RetentionTier, { bg: string; fg: string }> = {
  red:    { bg: "#fee2e2", fg: "#991b1b" },
  yellow: { bg: "#fef3c7", fg: "#92400e" },
  green:  { bg: "#d1fae5", fg: "#065f46" },
  // n/a cell uses slate-600 fg on slate-100 bg (6.4:1 PASSES AA). Earlier
  // slate-500 / slate-500 fg both failed against slate-100 — see the
  // wave-3 LessonRenderer FallbackBadge precedent in
  // docs/a11y/audit.md §"Color contrast — at-a-glance".
  "n/a":  { bg: "#f1f5f9", fg: "#475569" },
};

// ── RPC type (cast for fields not in generated types yet) ─────────────

type RetentionRow = {
  cohort_week_start: string;
  days_since_signup: number;
  segment: Segment;
  active_users: number;
  total_users: number;
};

function rowsToTriangle(rows: RetentionRow[]): CohortBucketCount[] {
  return rows
    .filter((r) =>
      RETENTION_DAY_OFFSETS.includes(r.days_since_signup as RetentionDayOffset),
    )
    .map((r) => ({
      cohortWeekStart: r.cohort_week_start,
      daysSinceSignup: r.days_since_signup as RetentionDayOffset,
      activeUsers: r.active_users,
      totalUsers: r.total_users,
    }));
}

function pivot(
  rows: CohortBucketCount[],
): Map<string, Map<RetentionDayOffset, CohortBucketCount>> {
  const out = new Map<string, Map<RetentionDayOffset, CohortBucketCount>>();
  for (const r of rows) {
    let inner = out.get(r.cohortWeekStart);
    if (!inner) {
      inner = new Map();
      out.set(r.cohortWeekStart, inner);
    }
    inner.set(r.daysSinceSignup, r);
  }
  return out;
}

function formatRatio(active: number, total: number): string {
  if (total <= 0) return "—";
  return `${Math.round((active / total) * 100)}%`;
}

function formatPct(n: number): string {
  return `${Math.round(n * 100)}%`;
}

function formatRelative(iso: string | null): string {
  if (!iso) return "never";
  const t = new Date(iso).getTime();
  const ageMin = Math.max(0, Math.round((Date.now() - t) / 60000));
  if (ageMin < 60) return `${ageMin}m ago`;
  const ageHr = Math.round(ageMin / 60);
  if (ageHr < 24) return `${ageHr}h ago`;
  const ageDay = Math.round(ageHr / 24);
  return `${ageDay}d ago`;
}

// ── Component ─────────────────────────────────────────────────────────

export default function RetentionDashboard(): React.ReactElement {
  const { permissions, loading: accessLoading } = useAdminAccess();
  const [segment, setSegment] = useState<Segment>("all");
  const [rows, setRows] = useState<CohortBucketCount[]>([]);
  const [freshness, setFreshness] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const sinceDate = new Date(Date.now() - 12 * 7 * 86400_000)
        .toISOString()
        .slice(0, 10);
      const untilDate = new Date().toISOString().slice(0, 10);
      const [{ data: rpcRows, error: rpcErr }, { data: freshRow, error: freshErr }] =
        await Promise.all([
          supabase.rpc("get_cohort_retention" as never, {
            p_since: sinceDate,
            p_until: untilDate,
            p_segment: segment,
          } as never),
          supabase.rpc("get_cohort_retention_freshness" as never),
        ]);
      if (rpcErr) throw rpcErr;
      if (freshErr) console.warn("[retention] freshness RPC failed:", freshErr);
      setRows(rowsToTriangle(((rpcRows as unknown) ?? []) as RetentionRow[]));
      setFreshness((freshRow as unknown as string) ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, [segment]);

  useEffect(() => {
    if (accessLoading || permissions.level < 9) return;
    void reload();
  }, [accessLoading, permissions.level, reload]);

  const pivoted = useMemo(() => pivot(rows), [rows]);
  const insights = useMemo(() => generateEngagementInsights(rows), [rows]);

  if (accessLoading) {
    return (
      <div style={wrap}>
        <p style={{ color: "#64748b", fontSize: 13 }}>Loading… · Đang tải…</p>
      </div>
    );
  }
  if (permissions.level < 9) return <Navigate to="/" replace />;

  // Cohort weeks ordered newest first.
  const weeks = [...pivoted.keys()].sort((a, b) => (a < b ? 1 : -1));

  return (
    <div style={wrap}>
      <div style={container}>
        <header>
          <h1 style={heading}>Tỷ lệ giữ chân theo cohort · Cohort retention</h1>
          <p style={subhead}>
            Mỗi hàng là tuần đăng ký. Cột là số ngày kể từ khi đăng ký. Ô màu
            đỏ &lt;20%, vàng 20–50%, xanh ≥50%.
          </p>
          <p style={subhead}>
            Each row is a signup week. Each column is days since signup.
            Red &lt;20%, yellow 20–50%, green ≥50%.
          </p>
        </header>

        {/* Controls */}
        <section style={card}>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
            <div style={{ display: "flex", gap: 8 }}>
              {(["all", "free", "paid"] as Segment[]).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSegment(s)}
                  data-testid={`retention-segment-${s}`}
                  style={{
                    padding: "6px 14px",
                    borderRadius: 9999,
                    fontSize: 13,
                    fontWeight: 700,
                    border: `1px solid ${segment === s ? "#1e3a8a" : "rgba(0,0,0,0.12)"}`,
                    background: segment === s ? "#1e3a8a" : "white",
                    color: segment === s ? "white" : "#1f2937",
                    cursor: "pointer",
                  }}
                >
                  {s === "all" ? "Tất cả · All" : s === "free" ? "Free" : "Paid"}
                </button>
              ))}
            </div>
            <div style={{ flex: 1, fontSize: 12, color: "#64748b" }}>
              Cập nhật lần cuối · Last refresh:{" "}
              <strong>{formatRelative(freshness)}</strong>
            </div>
            <button
              type="button"
              onClick={() => void reload()}
              style={{
                padding: "6px 14px",
                borderRadius: 9999,
                fontSize: 12,
                fontWeight: 600,
                border: "1px solid rgba(0,0,0,0.12)",
                background: "white",
                cursor: "pointer",
              }}
            >
              Tải lại · Reload
            </button>
          </div>
        </section>

        {error ? (
          <div
            role="alert"
            style={{
              ...card,
              borderColor: "#fecaca",
              background: "#fef2f2",
              color: "#991b1b",
              fontSize: 13,
            }}
          >
            {error}
          </div>
        ) : null}

        {/* Insights */}
        {insights.length > 0 ? (
          <section style={card}>
            <div style={sectionTitle}>Nhận định · Insights</div>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: "12px 0 0",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: 10,
              }}
            >
              {insights.map((ins, i) => (
                <li key={i} style={{ ...card, padding: 14, boxShadow: "none" }}>
                  <InsightCardBody insight={ins} />
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {/* Triangle table */}
        <section style={card} aria-label="Cohort retention table">
          <div style={sectionTitle}>
            Bảng tam giác · Triangle ({weeks.length} cohorts × {RETENTION_DAY_OFFSETS.length} offsets)
          </div>
          {loading ? (
            <p style={{ fontSize: 13, color: "#64748b", marginTop: 12 }}>
              Đang tải dữ liệu… · Loading…
            </p>
          ) : weeks.length === 0 ? (
            <p style={{ fontSize: 13, color: "#64748b", marginTop: 12 }}>
              Chưa có dữ liệu — chạy aggregator trước. · No data yet — run the
              aggregator first.
            </p>
          ) : (
            <div style={{ overflowX: "auto", marginTop: 12 }}>
              <table
                style={{
                  borderCollapse: "collapse",
                  fontSize: 13,
                  fontVariantNumeric: "tabular-nums",
                  width: "100%",
                  minWidth: 540,
                }}
              >
                <thead>
                  <tr>
                    <th
                      style={{
                        textAlign: "left",
                        padding: "8px 10px",
                        color: "#64748b",
                        fontWeight: 700,
                      }}
                    >
                      Cohort week
                    </th>
                    {RETENTION_DAY_OFFSETS.map((d) => (
                      <th
                        key={d}
                        style={{
                          padding: "8px 10px",
                          color: "#64748b",
                          fontWeight: 700,
                        }}
                      >
                        D{d}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {weeks.map((wk) => (
                    <tr key={wk}>
                      <td
                        style={{
                          padding: "6px 10px",
                          fontWeight: 600,
                          color: "#1f2937",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {wk}
                      </td>
                      {RETENTION_DAY_OFFSETS.map((d) => {
                        const cell = pivoted.get(wk)?.get(d);
                        const cls = classifyRetention(
                          cell?.activeUsers ?? 0,
                          cell?.totalUsers ?? 0,
                        );
                        const palette = TIER_COLOR[cls.tier];
                        const title = cell
                          ? `${wk} · D${d}: ${cell.activeUsers}/${cell.totalUsers} active`
                          : `${wk} · D${d}: no data`;
                        return (
                          <td
                            key={d}
                            title={title}
                            data-testid={`retention-cell-${wk}-${d}`}
                            style={{
                              padding: "6px 10px",
                              textAlign: "center",
                              background: palette.bg,
                              color: palette.fg,
                              fontWeight: 700,
                            }}
                          >
                            {formatRatio(cell?.activeUsers ?? 0, cell?.totalUsers ?? 0)}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <p style={{ fontSize: 11, color: "#64748b" }}>
          Privacy posture: dashboard reads aggregate counts only via a
          SECURITY DEFINER RPC; admin level &lt; 9 sees nothing. No
          individual user data is exposed.
        </p>
      </div>
    </div>
  );
}

// ── Insight card renderer ─────────────────────────────────────────────

function InsightCardBody({ insight }: { insight: EngagementInsight }) {
  if (insight.kind === "better_cohort") {
    return (
      <>
        <div style={{ fontSize: 12, color: "#059669", fontWeight: 800 }}>
          🚀 Cohort vượt trội · Strong cohort
        </div>
        <div style={{ fontSize: 14, fontWeight: 700, marginTop: 4 }}>
          Tuần {insight.cohortWeekStart}
        </div>
        <div style={{ fontSize: 12, color: "#475569", marginTop: 2 }}>
          Day-7 retention {formatPct(insight.day7Retention)} (avg {formatPct(insight.averageDay7)})
        </div>
        <div style={{ fontSize: 11, color: "#059669", marginTop: 4, fontWeight: 700 }}>
          +{formatPct(insight.delta)} so với trung bình · vs average
        </div>
      </>
    );
  }
  if (insight.kind === "weak_cohort") {
    return (
      <>
        <div style={{ fontSize: 12, color: "#dc2626", fontWeight: 800 }}>
          ⚠️ Cohort yếu · Weak cohort
        </div>
        <div style={{ fontSize: 14, fontWeight: 700, marginTop: 4 }}>
          Tuần {insight.cohortWeekStart}
        </div>
        <div style={{ fontSize: 12, color: "#475569", marginTop: 2 }}>
          Day-7 retention {formatPct(insight.day7Retention)} (avg {formatPct(insight.averageDay7)})
        </div>
        <div style={{ fontSize: 11, color: "#dc2626", marginTop: 4, fontWeight: 700 }}>
          {formatPct(insight.delta)} so với trung bình · vs average
        </div>
      </>
    );
  }
  // drop_off
  return (
    <>
      <div style={{ fontSize: 12, color: "#d97706", fontWeight: 800 }}>
        📉 Sụt giảm rõ rệt · Sharpest drop-off
      </div>
      <div style={{ fontSize: 14, fontWeight: 700, marginTop: 4 }}>
        D{insight.fromOffset} → D{insight.toOffset}
      </div>
      <div style={{ fontSize: 12, color: "#475569", marginTop: 2 }}>
        {formatPct(insight.averageBefore)} → {formatPct(insight.averageAfter)} (avg)
      </div>
      <div style={{ fontSize: 11, color: "#d97706", marginTop: 4, fontWeight: 700 }}>
        −{formatPct(insight.drop)} drop
      </div>
    </>
  );
}
