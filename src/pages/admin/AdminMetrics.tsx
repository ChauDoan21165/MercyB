// src/pages/admin/AdminMetrics.tsx
// MB-BLUE-101.6 — 2026-01-01 (+0700)
//
// ADMIN METRICS (READ-ONLY, SAFE, MULTI-APP READY):
// - “Truth screen” for KPIs: online users, active users, feedback counts, tier distribution.
// - Manual refresh only (operator-safe).
// - Resilient: partial truth — one failed query does NOT blank the whole page.
// - Multi-app: operator can switch app_id (persisted locally + optional URL ?app=...).
//
// Schema truth (confirmed for Mercy Blade):
// - public.user_sessions has: app_id, user_id, last_activity
// - public.user_feedback has: app_id, status, created_at
// - public.profiles has: app_id, tier
//
// FIX (101.6):
// - Add AdminStatsStrip at top (passes current appId).
// - Keep app context in navigation links (Back to Admin preserves ?app=...).
// - Add small helper: withApp(path) to prevent mixed realities.

import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";

// ✅ Live snapshot strip (multi-app)
import AdminStatsStrip from "@/components/admin/widgets/AdminStatsStrip";

type MetricCard = {
  label: string;
  value: string;
  hint?: string;
  status?: "ok" | "warn" | "off";
};

type TierCount = { tier_id: string; users: number };

function fmtNum(n: number | null | undefined) {
  if (n == null || Number.isNaN(n)) return "—";
  return n.toLocaleString();
}

function isoMinutesAgo(mins: number) {
  return new Date(Date.now() - mins * 60 * 1000).toISOString();
}

function isoHoursAgo(hours: number) {
  return new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
}

export default function AdminMetrics() {
  const location = useLocation();

  const appIdFromUrl = useMemo(() => {
    try {
      return new URLSearchParams(location.search).get("app") || "";
    } catch {
      return "";
    }
  }, [location.search]);

  const [appId, setAppId] = useState<string>(() => {
    const saved = (() => {
      try {
        return localStorage.getItem("mb_admin_app_id") || "";
      } catch {
        return "";
      }
    })();
    return (appIdFromUrl || saved || "mercy_blade").trim() || "mercy_blade";
  });

  const [appIdDraft, setAppIdDraft] = useState<string>(appId);

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);

  const [onlineUsers10m, setOnlineUsers10m] = useState<number | null>(null);
  const [activeUsers24h, setActiveUsers24h] = useState<number | null>(null);

  const [feedbackUnread, setFeedbackUnread] = useState<number | null>(null);
  const [feedbackToday, setFeedbackToday] = useState<number | null>(null);

  const [tierCounts, setTierCounts] = useState<TierCount[] | null>(null);
  const [tierSource, setTierSource] = useState<string>("—");

  const windowOnlineMinutes = 10;
  const windowActiveHours = 24;

  function withApp(path: string) {
    const cleaned = (appId || "").trim();
    if (!cleaned) return path;
    const joiner = path.includes("?") ? "&" : "?";
    return `${path}${joiner}app=${encodeURIComponent(cleaned)}`;
  }

  const wrap: React.CSSProperties = {
    minHeight: "100vh",
    background: "white",
    color: "black",
  };

  const frame: React.CSSProperties = {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "28px 16px 80px",
  };

  const topBar: React.CSSProperties = {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 18,
  };

  const title: React.CSSProperties = {
    margin: 0,
    fontSize: 36,
    letterSpacing: -0.9,
    fontWeight: 900,
    lineHeight: 1.08,
  };

  const subtitle: React.CSSProperties = {
    marginTop: 8,
    marginBottom: 0,
    fontSize: 14,
    lineHeight: 1.65,
    color: "rgba(0,0,0,0.70)",
    maxWidth: 860,
  };

  const pillRow: React.CSSProperties = {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
    justifyContent: "flex-end",
  };

  const pill: React.CSSProperties = {
    border: "1px solid rgba(0,0,0,0.14)",
    borderRadius: 999,
    padding: "10px 14px",
    background: "white",
    fontWeight: 900,
    cursor: "pointer",
    whiteSpace: "nowrap",
    textDecoration: "none",
    color: "inherit",
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
  };

  const smallTag: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    border: "1px solid rgba(0,0,0,0.10)",
    borderRadius: 999,
    padding: "6px 10px",
    fontSize: 12,
    fontWeight: 900,
    letterSpacing: 0.6,
    color: "rgba(0,0,0,0.72)",
    background: "rgba(0,0,0,0.03)",
  };

  const hr: React.CSSProperties = {
    height: 1,
    border: 0,
    background: "rgba(0,0,0,0.10)",
    margin: "16px 0",
  };

  const card: React.CSSProperties = {
    border: "1px solid rgba(0,0,0,0.10)",
    borderRadius: 18,
    padding: 16,
    background: "white",
    boxShadow: "0 10px 24px rgba(0,0,0,0.04)",
  };

  const badge: React.CSSProperties = {
    border: "1px solid rgba(0,0,0,0.14)",
    borderRadius: 999,
    padding: "6px 10px",
    fontSize: 12,
    fontWeight: 900,
    background: "rgba(0,0,0,0.03)",
    color: "rgba(0,0,0,0.72)",
  };

  const grid: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(12, 1fr)",
    gap: 14,
  };

  const metricCard: React.CSSProperties = {
    ...card,
    padding: 14,
  };

  const metricLabel: React.CSSProperties = {
    fontSize: 12,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    fontWeight: 900,
    color: "rgba(0,0,0,0.65)",
    marginBottom: 6,
  };

  const metricValue: React.CSSProperties = {
    fontSize: 34,
    fontWeight: 950 as any,
    letterSpacing: -0.7,
    lineHeight: 1.05,
    margin: 0,
  };

  const metricHint: React.CSSProperties = {
    marginTop: 8,
    fontSize: 12,
    fontWeight: 800,
    color: "rgba(0,0,0,0.55)",
    lineHeight: 1.5,
  };

  const table: React.CSSProperties = {
    width: "100%",
    borderCollapse: "separate",
    borderSpacing: 0,
    overflow: "hidden",
    borderRadius: 14,
    border: "1px solid rgba(0,0,0,0.10)",
  };

  const th: React.CSSProperties = {
    textAlign: "left",
    fontSize: 12,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    padding: "10px 12px",
    borderBottom: "1px solid rgba(0,0,0,0.10)",
    background: "rgba(0,0,0,0.03)",
    fontWeight: 900,
    color: "rgba(0,0,0,0.75)",
    whiteSpace: "nowrap",
  };

  const td: React.CSSProperties = {
    padding: "10px 12px",
    borderBottom: "1px solid rgba(0,0,0,0.08)",
    fontSize: 13,
    verticalAlign: "top",
  };

  const mono: React.CSSProperties = {
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
    fontSize: 12,
    color: "rgba(0,0,0,0.75)",
  };

  const cards: MetricCard[] = useMemo(() => {
    return [
      {
        label: `Users Online (${windowOnlineMinutes}m)`,
        value: fmtNum(onlineUsers10m),
        hint: `Distinct users from public.user_sessions where last_activity >= now-${windowOnlineMinutes}m.`,
        status: onlineUsers10m == null ? "off" : "ok",
      },
      {
        label: `Active Users (${windowActiveHours}h)`,
        value: fmtNum(activeUsers24h),
        hint: `Distinct users active in last ${windowActiveHours}h.`,
        status: activeUsers24h == null ? "off" : "ok",
      },
      {
        label: "Feedback Unread",
        value: fmtNum(feedbackUnread),
        hint: `Count from public.user_feedback with status in (open,new,unread).`,
        status: feedbackUnread == null ? "off" : feedbackUnread > 0 ? "warn" : "ok",
      },
      {
        label: "Feedback (24h)",
        value: fmtNum(feedbackToday),
        hint: `Count from public.user_feedback created in last 24h.`,
        status: feedbackToday == null ? "off" : "ok",
      },
    ];
  }, [activeUsers24h, feedbackToday, feedbackUnread, onlineUsers10m]);

  function applyAppId(next: string) {
    const cleaned = (next || "").trim();
    if (!cleaned) return;

    setAppId(cleaned);
    setAppIdDraft(cleaned);

    try {
      localStorage.setItem("mb_admin_app_id", cleaned);
    } catch {
      // ignore
    }

    // Optional: reflect in URL (no router changes; keeps shareable links)
    try {
      const url = new URL(window.location.href);
      url.searchParams.set("app", cleaned);
      window.history.replaceState({}, "", url.toString());
    } catch {
      // ignore
    }
  }

  async function loadMetrics(currentAppId: string) {
    setLoading(true);
    setErr(null);

    // Reset optional areas so UI doesn’t show stale values if a query fails
    setTierCounts(null);
    setTierSource("—");

    // Also clear core values to avoid “stale truth”
    setOnlineUsers10m(null);
    setActiveUsers24h(null);
    setFeedbackUnread(null);
    setFeedbackToday(null);

    try {
      const since10m = isoMinutesAgo(windowOnlineMinutes);
      const since24h = isoHoursAgo(windowActiveHours);
      const sinceFeedback24h = isoHoursAgo(24);

      const onlineP = supabase
        .from("user_sessions")
        .select("user_id")
        .eq("app_id", currentAppId)
        .gte("last_activity", since10m)
        .limit(5000);

      const activeP = supabase
        .from("user_sessions")
        .select("user_id")
        .eq("app_id", currentAppId)
        .gte("last_activity", since24h)
        .limit(15000);

      const unreadP = supabase
        .from("user_feedback")
        .select("id", { count: "exact", head: true })
        .eq("app_id", currentAppId)
        .in("status", ["open", "new", "unread"]);

      const feedback24hP = supabase
        .from("user_feedback")
        .select("id", { count: "exact", head: true })
        .eq("app_id", currentAppId)
        .gte("created_at", sinceFeedback24h);

      const tiersP = supabase
        .from("profiles")
        .select("tier")
        .eq("app_id", currentAppId)
        .limit(5000);

      const [onlineR, activeR, unreadR, fb24hR, tiersR] = await Promise.all([
        onlineP,
        activeP,
        unreadP,
        feedback24hP,
        tiersP,
      ]);

      const softErr =
        onlineR.error?.message ||
        activeR.error?.message ||
        unreadR.error?.message ||
        fb24hR.error?.message ||
        tiersR.error?.message ||
        null;

      setErr(softErr);

      if (!onlineR.error) {
        const uniq = new Set<string>();
        (onlineR.data || []).forEach((r: any) => {
          const u = (r?.user_id || "").toString().trim();
          if (u) uniq.add(u);
        });
        setOnlineUsers10m(uniq.size);
      }

      if (!activeR.error) {
        const uniq = new Set<string>();
        (activeR.data || []).forEach((r: any) => {
          const u = (r?.user_id || "").toString().trim();
          if (u) uniq.add(u);
        });
        setActiveUsers24h(uniq.size);
      }

      if (!unreadR.error) setFeedbackUnread(unreadR.count ?? 0);
      if (!fb24hR.error) setFeedbackToday(fb24hR.count ?? 0);

      if (!tiersR.error) {
        const map: Record<string, number> = {};
        (tiersR.data || []).forEach((r: any) => {
          const t = (r?.tier || "unknown").toString().trim() || "unknown";
          map[t] = (map[t] || 0) + 1;
        });

        const list: TierCount[] = Object.entries(map)
          .map(([tier_id, users]) => ({ tier_id, users }))
          .sort((a, b) => b.users - a.users);

        setTierCounts(list.length ? list : []);
        setTierSource("public.profiles.tier");
      } else {
        setTierCounts(null);
        setTierSource("—");
      }

      setUpdatedAt(new Date().toLocaleString());
    } catch (e: any) {
      setErr(e?.message || String(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (appIdFromUrl && appIdFromUrl.trim() && appIdFromUrl.trim() !== appId) {
      applyAppId(appIdFromUrl.trim());
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appIdFromUrl]);

  useEffect(() => {
    loadMetrics(appId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appId]);

  return (
    <div style={wrap}>
      <div style={frame}>
        <div style={topBar}>
          <div>
            <div style={smallTag}>ADMIN • METRICS • READ-ONLY</div>
            <h1 style={title}>System Overview</h1>
            <p style={subtitle}>
              A single “truth screen” for KPIs: online users, active users, feedback volume, and tier distribution.
              <br />
              <span style={{ color: "rgba(0,0,0,0.55)" }}>
                Manual refresh only. No writes. No destructive actions.
              </span>
            </p>
          </div>

          <div style={pillRow}>
            <Link to={withApp("/admin")} style={pill}>
              ← Back to Admin
            </Link>
            <button
              type="button"
              style={{
                ...pill,
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
              }}
              onClick={() => loadMetrics(appId)}
              aria-label="Refresh metrics"
              disabled={loading}
            >
              Refresh
            </button>
          </div>
        </div>

        {/* ✅ Live snapshot strip (consistent with app context) */}
        <AdminStatsStrip appId={appId} />

        {/* Multi-app selector */}
        <div style={{ ...card, padding: 14, marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <div>
              <div style={{ fontWeight: 900, marginBottom: 6 }}>App Context</div>
              <div style={{ fontSize: 13, color: "rgba(0,0,0,0.70)", lineHeight: 1.6 }}>
                This admin console can operate multiple apps in your ecosystem. Metrics are filtered by{" "}
                <span style={mono}>app_id</span>.
                <div style={{ marginTop: 6, fontSize: 12, fontWeight: 900, color: "rgba(0,0,0,0.55)" }}>
                  Tip: You can also use <span style={mono}>?app=your_app_id</span> in the URL.
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
              <span style={badge}>APP: {appId}</span>
              <span style={badge}>{updatedAt ? `UPDATED: ${updatedAt}` : "UPDATED: —"}</span>
              <span style={badge}>READ-ONLY</span>
            </div>
          </div>

          <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
            <input
              value={appIdDraft}
              onChange={(e) => setAppIdDraft(e.target.value)}
              placeholder="app_id (e.g. mercy_blade)"
              style={{
                border: "1px solid rgba(0,0,0,0.14)",
                borderRadius: 12,
                padding: "10px 12px",
                fontSize: 13,
                fontWeight: 900,
                minWidth: 260,
                outline: "none",
              }}
              aria-label="App ID"
            />
            <button
              type="button"
              style={{
                border: "1px solid rgba(0,0,0,0.14)",
                background: "white",
                borderRadius: 12,
                padding: "10px 12px",
                fontWeight: 900,
                cursor: "pointer",
              }}
              onClick={() => applyAppId(appIdDraft)}
              aria-label="Apply app id"
            >
              Apply
            </button>

            <button
              type="button"
              style={{ ...pill, padding: "10px 12px" }}
              onClick={() => applyAppId("mercy_blade")}
              aria-label="Switch to mercy_blade"
            >
              mercy_blade
            </button>
          </div>

          {err && (
            <div style={{ marginTop: 12, padding: 12, borderRadius: 14, border: "1px solid rgba(0,0,0,0.12)" }}>
              <div style={{ fontWeight: 900, marginBottom: 6 }}>Snapshot note</div>
              <div style={{ ...mono, whiteSpace: "pre-wrap" }}>{err}</div>
              <div style={{ marginTop: 10, fontSize: 12, color: "rgba(0,0,0,0.55)", fontWeight: 800 }}>
                This page shows partial truth. A note means one metric query failed (RLS/table/column), not that the page is broken.
              </div>
            </div>
          )}
        </div>

        {/* Top metrics strip */}
        <div style={grid}>
          {cards.map((c) => (
            <div key={c.label} style={{ ...metricCard, gridColumn: "span 3" }}>
              <div style={metricLabel}>{c.label}</div>
              <h2 style={metricValue}>{loading ? "…" : c.value}</h2>
              <div style={metricHint}>{c.hint}</div>
            </div>
          ))}
        </div>

        <hr style={hr} />

        {/* Tier distribution (profiles.tier) */}
        <div style={{ ...card }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <div>
              <div style={{ fontWeight: 900, fontSize: 16 }}>Tier Distribution</div>
              <div style={{ marginTop: 6, fontSize: 12, color: "rgba(0,0,0,0.55)", fontWeight: 800 }}>
                Source: <span style={mono}>{tierSource}</span>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
              <span style={badge}>APP: {appId}</span>
              <span style={badge}>READ-ONLY</span>
            </div>
          </div>

          <div style={{ marginTop: 12, overflowX: "auto" }}>
            <table style={table}>
              <thead>
                <tr>
                  <th style={th}>Tier</th>
                  <th style={th}>Users</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td style={{ ...td, borderBottom: 0 }} colSpan={2}>
                      Loading…
                    </td>
                  </tr>
                ) : tierCounts && tierCounts.length ? (
                  tierCounts.map((r) => (
                    <tr key={r.tier_id}>
                      <td style={td}>
                        <div style={{ fontWeight: 900 }}>{r.tier_id}</div>
                      </td>
                      <td style={td}>
                        <div style={{ fontWeight: 900 }}>{fmtNum(r.users)}</div>
                      </td>
                    </tr>
                  ))
                ) : tierCounts && tierCounts.length === 0 ? (
                  <tr>
                    <td style={{ ...td, borderBottom: 0 }} colSpan={2}>
                      No tier rows found for this app_id.
                    </td>
                  </tr>
                ) : (
                  <tr>
                    <td style={{ ...td, borderBottom: 0 }} colSpan={2}>
                      Unavailable (profiles.tier query failed or RLS blocked).
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <hr style={hr} />

        <div style={{ fontSize: 12, color: "rgba(0,0,0,0.55)", fontWeight: 800, lineHeight: 1.6 }}>
          Tip: Don’t chase “perfect analytics” first. Lock the truth screens early — they reveal schema gaps instantly.
        </div>
      </div>
    </div>
  );
}

/* New thing to learn:
   Multi-app navigation must carry context.
   If one link drops app_id, you silently mix datasets and trust collapses. */
