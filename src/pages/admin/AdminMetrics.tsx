import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import AdminStatsStrip from "@/components/admin/widgets/AdminStatsStrip";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from "recharts";

type MetricCard = {
  label: string;
  value: string;
  hint?: string;
  status?: "ok" | "warn" | "off";
};

type TierCount = { tier_id: string; users: number };

type RevenueSubscriptionRow = {
  subscription_id: string | null;
  status: string | null;
  price_id: string | null;
  cancel_at_period_end: boolean | null;
  current_period_end: string | null;
};

type RevenueMetrics = {
  activeSubscriptions: number | null;
  monthlySubscriptions: number | null;
  yearlySubscriptions: number | null;
  mrrVnd: number | null;
  scheduledCancellations: number | null;
  cancellationsNext30d: number | null;
  renewalsNext30d: number | null;
};

const MONTHLY_PRICE_ID = "price_1TCKY02K1tPxy04uCHQNbvik";
const YEARLY_PRICE_ID = "price_1TCKSF2K1tPxy04uNeKcQWp5";
const MONTHLY_PRICE_VND = 200_000;
const YEARLY_PRICE_VND = 2_000_000;

function fmtNum(n: number | null | undefined) {
  if (n == null || Number.isNaN(n)) return "—";
  return n.toLocaleString();
}

function fmtCurrencyVnd(n: number | null | undefined) {
  if (n == null || Number.isNaN(n)) return "—";
  return `${Math.round(n).toLocaleString()} VND`;
}

function isoMinutesAgo(mins: number) {
  return new Date(Date.now() - mins * 60 * 1000).toISOString();
}

function isoHoursAgo(hours: number) {
  return new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
}

function normalizeStatus(value: string | null | undefined): string {
  return String(value ?? "").trim().toLowerCase();
}

function isRevenueActiveStatus(value: string | null | undefined): boolean {
  const s = normalizeStatus(value);
  return s === "active" || s === "trialing" || s === "past_due";
}

function getMonthlyEquivalentVnd(priceId: string | null | undefined): number {
  const p = String(priceId ?? "").trim();
  if (p === MONTHLY_PRICE_ID) return MONTHLY_PRICE_VND;
  if (p === YEARLY_PRICE_ID) return Math.round(YEARLY_PRICE_VND / 12);
  return 0;
}

function isFutureWithinDays(
  value: string | null | undefined,
  days: number,
): boolean {
  if (!value) return false;
  const t = new Date(value).getTime();
  if (Number.isNaN(t)) return false;

  const now = Date.now();
  const upper = now + days * 24 * 60 * 60 * 1000;
  return t > now && t <= upper;
}

function computeRevenueMetrics(
  rows: RevenueSubscriptionRow[] | null,
): RevenueMetrics {
  if (!rows) {
    return {
      activeSubscriptions: null,
      monthlySubscriptions: null,
      yearlySubscriptions: null,
      mrrVnd: null,
      scheduledCancellations: null,
      cancellationsNext30d: null,
      renewalsNext30d: null,
    };
  }

  const activeRows = rows.filter((r) => isRevenueActiveStatus(r.status));
  const monthlySubscriptions = activeRows.filter(
    (r) => String(r.price_id ?? "").trim() === MONTHLY_PRICE_ID,
  ).length;
  const yearlySubscriptions = activeRows.filter(
    (r) => String(r.price_id ?? "").trim() === YEARLY_PRICE_ID,
  ).length;

  const scheduledCancellations = activeRows.filter(
    (r) => r.cancel_at_period_end === true && isFutureWithinDays(r.current_period_end, 3650),
  ).length;

  const cancellationsNext30d = activeRows.filter(
    (r) => r.cancel_at_period_end === true && isFutureWithinDays(r.current_period_end, 30),
  ).length;

  const renewalsNext30d = activeRows.filter((r) =>
    isFutureWithinDays(r.current_period_end, 30),
  ).length;

  const mrrVnd = activeRows.reduce(
    (sum, row) => sum + getMonthlyEquivalentVnd(row.price_id),
    0,
  );

  return {
    activeSubscriptions: activeRows.length,
    monthlySubscriptions,
    yearlySubscriptions,
    mrrVnd,
    scheduledCancellations,
    cancellationsNext30d,
    renewalsNext30d,
  };
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

  const [revenueMetrics, setRevenueMetrics] = useState<RevenueMetrics>({
    activeSubscriptions: null,
    monthlySubscriptions: null,
    yearlySubscriptions: null,
    mrrVnd: null,
    scheduledCancellations: null,
    cancellationsNext30d: null,
    renewalsNext30d: null,
  });

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
    fontWeight: 950 as React.CSSProperties["fontWeight"],
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
      {
        label: "MRR",
        value: fmtCurrencyVnd(revenueMetrics.mrrVnd),
        hint: `Computed from active subscriptions using monthly-equivalent VND.`,
        status: revenueMetrics.mrrVnd == null ? "off" : "ok",
      },
      {
        label: "Active Subs",
        value: fmtNum(revenueMetrics.activeSubscriptions),
        hint: `Statuses counted: active, trialing, past_due.`,
        status: revenueMetrics.activeSubscriptions == null ? "off" : "ok",
      },
      {
        label: "Monthly / Yearly",
        value:
          revenueMetrics.monthlySubscriptions == null ||
          revenueMetrics.yearlySubscriptions == null
            ? "—"
            : `${fmtNum(revenueMetrics.monthlySubscriptions)} / ${fmtNum(
                revenueMetrics.yearlySubscriptions,
              )}`,
        hint: `Active subscription mix by Stripe price_id.`,
        status:
          revenueMetrics.monthlySubscriptions == null ||
          revenueMetrics.yearlySubscriptions == null
            ? "off"
            : "ok",
      },
      {
        label: "Scheduled Cancellations",
        value: fmtNum(revenueMetrics.scheduledCancellations),
        hint: `cancel_at_period_end = true and still in future.`,
        status:
          revenueMetrics.scheduledCancellations == null
            ? "off"
            : revenueMetrics.scheduledCancellations > 0
              ? "warn"
              : "ok",
      },
      {
        label: "Cancels Next 30d",
        value: fmtNum(revenueMetrics.cancellationsNext30d),
        hint: `Scheduled cancellations ending in the next 30 days.`,
        status:
          revenueMetrics.cancellationsNext30d == null
            ? "off"
            : revenueMetrics.cancellationsNext30d > 0
              ? "warn"
              : "ok",
      },
      {
        label: "Renewals Next 30d",
        value: fmtNum(revenueMetrics.renewalsNext30d),
        hint: `Active subscriptions with current_period_end in the next 30 days.`,
        status: revenueMetrics.renewalsNext30d == null ? "off" : "ok",
      },
    ];
  }, [
    activeUsers24h,
    feedbackToday,
    feedbackUnread,
    onlineUsers10m,
    revenueMetrics,
    windowActiveHours,
    windowOnlineMinutes,
  ]);

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

    setTierCounts(null);
    setTierSource("—");

    setOnlineUsers10m(null);
    setActiveUsers24h(null);
    setFeedbackUnread(null);
    setFeedbackToday(null);
    setRevenueMetrics({
      activeSubscriptions: null,
      monthlySubscriptions: null,
      yearlySubscriptions: null,
      mrrVnd: null,
      scheduledCancellations: null,
      cancellationsNext30d: null,
      renewalsNext30d: null,
    });

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

      const revenueP = supabase
        .from("subscriptions")
        .select(
          "subscription_id,status,price_id,cancel_at_period_end,current_period_end",
        )
        .eq("app_id", currentAppId)
        .limit(10000);

      const [onlineR, activeR, unreadR, fb24hR, tiersR, revenueR] =
        await Promise.all([
          onlineP,
          activeP,
          unreadP,
          feedback24hP,
          tiersP,
          revenueP,
        ]);

      const softErrors = [
        onlineR.error?.message,
        activeR.error?.message,
        unreadR.error?.message,
        fb24hR.error?.message,
        tiersR.error?.message,
        revenueR.error?.message,
      ].filter(Boolean);

      setErr(softErrors.length ? softErrors.join("\n") : null);

      if (!onlineR.error) {
        const uniq = new Set<string>();
        (onlineR.data || []).forEach((r: { user_id?: string | null }) => {
          const u = String(r?.user_id || "").trim();
          if (u) uniq.add(u);
        });
        setOnlineUsers10m(uniq.size);
      }

      if (!activeR.error) {
        const uniq = new Set<string>();
        (activeR.data || []).forEach((r: { user_id?: string | null }) => {
          const u = String(r?.user_id || "").trim();
          if (u) uniq.add(u);
        });
        setActiveUsers24h(uniq.size);
      }

      if (!unreadR.error) setFeedbackUnread(unreadR.count ?? 0);
      if (!fb24hR.error) setFeedbackToday(fb24hR.count ?? 0);

      if (!tiersR.error) {
        const map: Record<string, number> = {};
        (tiersR.data || []).forEach((r: { tier?: string | null }) => {
          const t = String(r?.tier || "unknown").trim() || "unknown";
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

      if (!revenueR.error) {
        setRevenueMetrics(
          computeRevenueMetrics(
            (revenueR.data ?? []) as RevenueSubscriptionRow[],
          ),
        );
      }

      setUpdatedAt(new Date().toLocaleString());
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (appIdFromUrl && appIdFromUrl.trim() && appIdFromUrl.trim() !== appId) {
      applyAppId(appIdFromUrl.trim());
      return;
    }
  }, [appIdFromUrl, appId]);

  useEffect(() => {
    void loadMetrics(appId);
  }, [appId]);

  return (
    <div style={wrap}>
      <div style={frame}>
        <div style={topBar}>
          <div>
            <div style={smallTag}>ADMIN • METRICS • READ-ONLY</div>
            <h1 style={title}>System Overview</h1>
            <p style={subtitle}>
              A single “truth screen” for KPIs: online users, active users,
              feedback volume, tier distribution, MRR, renewal risk, and
              cancellation risk.
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
              onClick={() => void loadMetrics(appId)}
              aria-label="Refresh metrics"
              disabled={loading}
            >
              Refresh
            </button>
          </div>
        </div>

        <AdminStatsStrip appId={appId} />

        <div style={{ ...card, padding: 14, marginBottom: 14 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <div>
              <div style={{ fontWeight: 900, marginBottom: 6 }}>App Context</div>
              <div
                style={{
                  fontSize: 13,
                  color: "rgba(0,0,0,0.70)",
                  lineHeight: 1.6,
                }}
              >
                This admin console can operate multiple apps in your ecosystem.
                Metrics are filtered by <span style={mono}>app_id</span>.
                <div
                  style={{
                    marginTop: 6,
                    fontSize: 12,
                    fontWeight: 900,
                    color: "rgba(0,0,0,0.55)",
                  }}
                >
                  Tip: You can also use{" "}
                  <span style={mono}>?app=your_app_id</span> in the URL.
                </div>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                gap: 10,
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <span style={badge}>APP: {appId}</span>
              <span style={badge}>{updatedAt ? `UPDATED: ${updatedAt}` : "UPDATED: —"}</span>
              <span style={badge}>READ-ONLY</span>
            </div>
          </div>

          <div
            style={{
              marginTop: 12,
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
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
            <div
              style={{
                marginTop: 12,
                padding: 12,
                borderRadius: 14,
                border: "1px solid rgba(0,0,0,0.12)",
              }}
            >
              <div style={{ fontWeight: 900, marginBottom: 6 }}>Snapshot note</div>
              <div style={{ ...mono, whiteSpace: "pre-wrap" }}>{err}</div>
              <div
                style={{
                  marginTop: 10,
                  fontSize: 12,
                  color: "rgba(0,0,0,0.55)",
                  fontWeight: 800,
                }}
              >
                This page shows partial truth. A note means one metric query
                failed, not that the page is broken.
              </div>
            </div>
          )}
        </div>

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

        <div style={card}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <div>
              <div style={{ fontWeight: 900, fontSize: 16 }}>Tier Distribution</div>
              <div
                style={{
                  marginTop: 6,
                  fontSize: 12,
                  color: "rgba(0,0,0,0.55)",
                  fontWeight: 800,
                }}
              >
                Source: <span style={mono}>{tierSource}</span>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                gap: 10,
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
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

        {/* CHARTS */}
        <hr style={hr} />
        <div style={{ fontWeight: 900, fontSize: 20, marginBottom: 14 }}>📊 Visual Overview</div>

        <div style={{ ...card, marginBottom: 14 }}>
          <div style={{ fontWeight: 900, fontSize: 15, marginBottom: 4 }}>Tier Distribution</div>
          <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.5)', marginBottom: 14 }}>Users per tier</div>
          {tierCounts && tierCounts.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={tierCounts} margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                <XAxis dataKey="tier_id" tick={{ fontSize: 11, fontWeight: 800 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v) => [Number(v).toLocaleString(), 'Users']} />
                <Bar dataKey="users" fill="#FF8A65" radius={[6,6,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <div style={{ color: 'rgba(0,0,0,0.4)', fontSize: 13 }}>No tier data.</div>}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
          <div style={card}>
            <div style={{ fontWeight: 900, fontSize: 15, marginBottom: 4 }}>Subscription Mix</div>
            <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.5)', marginBottom: 14 }}>Monthly vs Yearly</div>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={[
                  { name: 'Monthly', value: revenueMetrics.monthlySubscriptions ?? 0 },
                  { name: 'Yearly',  value: revenueMetrics.yearlySubscriptions ?? 0 },
                ]} cx="50%" cy="50%" outerRadius={75} dataKey="value"
                  label={({ name, percent }: any) => `${name} ${((percent as number)*100).toFixed(0)}%`}>
                  <Cell fill="#FF8A65" />
                  <Cell fill="#43C59E" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div style={card}>
            <div style={{ fontWeight: 900, fontSize: 15, marginBottom: 4 }}>Renewal Risk (30d)</div>
            <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.5)', marginBottom: 14 }}>Renewals vs Cancellations</div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={[
                { label: 'Renewals', value: revenueMetrics.renewalsNext30d ?? 0 },
                { label: 'Cancels',  value: revenueMetrics.cancellationsNext30d ?? 0 },
              ]} margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                <XAxis dataKey="label" tick={{ fontSize: 12, fontWeight: 800 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="value" radius={[6,6,0,0]}>
                  <Cell fill="#43C59E" />
                  <Cell fill="#FF6B6B" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={{ ...card, marginBottom: 14 }}>
          <div style={{ fontWeight: 900, fontSize: 15, marginBottom: 4 }}>Activity Snapshot</div>
          <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.5)', marginBottom: 14 }}>Online / Active / Feedback</div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={[
              { label: 'Online 10m',  value: onlineUsers10m ?? 0 },
              { label: 'Active 24h',  value: activeUsers24h ?? 0 },
              { label: 'Feedback 24h', value: feedbackToday ?? 0 },
              { label: 'Unread FB',   value: feedbackUnread ?? 0 },
            ]} margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
              <XAxis dataKey="label" tick={{ fontSize: 11, fontWeight: 700 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="value" radius={[6,6,0,0]}>
                <Cell fill="#5B8DEF" />
                <Cell fill="#43C59E" />
                <Cell fill="#FF8A65" />
                <Cell fill="#FF6B6B" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ ...card, marginBottom: 14, borderColor: (feedbackUnread ?? 0) > 10 ? '#FF6B6B' : 'rgba(0,0,0,0.10)' }}>
          <div style={{ fontWeight: 900, fontSize: 15, marginBottom: 8 }}>
            {(feedbackUnread ?? 0) > 10 ? '🚨' : '🛡️'} Security Signals
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
            {[
              { label: 'Unread Feedback', value: feedbackUnread ?? 0, warn: (feedbackUnread ?? 0) > 10, hint: '>10 may indicate spam' },
              { label: 'Feedback Spike 24h', value: feedbackToday ?? 0, warn: (feedbackToday ?? 0) > 20, hint: '>20/day is unusual' },
              { label: 'Sched. Cancels', value: revenueMetrics.scheduledCancellations ?? 0, warn: (revenueMetrics.scheduledCancellations ?? 0) > 5, hint: '>5 needs review' },
            ].map(item => (
              <div key={item.label} style={{ padding: 12, borderRadius: 12, border: `1px solid ${item.warn ? '#FF6B6B' : 'rgba(0,0,0,0.08)'}`, background: item.warn ? '#FFF5F5' : 'white' }}>
                <div style={{ fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 0.5, color: item.warn ? '#CC2222' : 'rgba(0,0,0,0.55)', marginBottom: 4 }}>{item.label}</div>
                <div style={{ fontSize: 28, fontWeight: 900, color: item.warn ? '#CC2222' : 'black' }}>{item.value.toLocaleString()}</div>
                <div style={{ fontSize: 11, color: 'rgba(0,0,0,0.45)', marginTop: 4 }}>{item.hint}</div>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            fontSize: 12,
            color: "rgba(0,0,0,0.55)",
            fontWeight: 800,
            lineHeight: 1.6,
          }}
        >
          Tip: Don’t chase “perfect analytics” first. Lock the truth screens
          early — they reveal schema gaps instantly.
        </div>
      </div>
    </div>
  );
}