// src/pages/admin/AdminMonitoring.tsx
// MB-BLUE-101.6 — 2026-01-01 (+0700)
//
// ADMIN MONITORING (READ-ONLY, SAFE, MULTI-APP READY):
// - Recent feedback stream (latest 20)
// - Recent sessions stream (latest 20 by last_activity)
// - No destructive actions, no writes.
// - Manual refresh only.
// - Multi-app: appId is editable + persisted (localStorage) + supports ?app= query.
// - Best-effort: if a query fails, page still renders (partial truth).
//
// FIX (101.6):
// - Add app context selector (same pattern as AdminMetrics/AdminDashboard).
// - Preserve app context in navigation links.
// - Soft error note (does not prevent other stream from showing).
// - Fallback if app_id column missing: auto-try query without app_id.

import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";

type FeedbackRow = {
  id?: string;
  created_at?: string;
  app_id?: string | null;
  email?: string | null;
  username?: string | null;
  source?: string | null;
  status?: string | null;
  message?: string | null;
};

type SessionRow = {
  id?: string;
  created_at?: string;
  app_id?: string | null;
  user_id?: string | null;
  session_id?: string | null;
  device_type?: string | null;
  last_activity?: string | null;
  current_room_id?: string | null;
};

const ADMIN_APP_ID_KEY = "mb_admin_app_id";

function fmtTime(ts?: string | null) {
  if (!ts) return "—";
  const d = new Date(ts);
  if (Number.isNaN(d.getTime())) return ts;
  return d.toLocaleString();
}

function clip(s?: string | null, n = 140) {
  const t = (s || "").trim();
  if (!t) return "—";
  return t.length > n ? `${t.slice(0, n)}…` : t;
}

function getAppFromUrl(search: string) {
  try {
    return (new URLSearchParams(search).get("app") || "").trim();
  } catch {
    return "";
  }
}

function getAppFromStorage() {
  try {
    return (localStorage.getItem(ADMIN_APP_ID_KEY) || "").trim();
  } catch {
    return "";
  }
}

function persistApp(appId: string) {
  const cleaned = (appId || "").trim();
  if (!cleaned) return;

  try {
    localStorage.setItem(ADMIN_APP_ID_KEY, cleaned);
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

function withApp(href: string, appId: string) {
  const cleaned = (appId || "").trim();
  if (!cleaned) return href;
  const sep = href.includes("?") ? "&" : "?";
  return `${href}${sep}app=${encodeURIComponent(cleaned)}`;
}

async function withOptionalAppIdFilter<T extends { error?: any }>(
  queryWithAppId: Promise<T>,
  queryWithoutAppId: Promise<T>
): Promise<T> {
  const res = await queryWithAppId;
  if (!res?.error) return res;

  const fallback = await queryWithoutAppId;
  if (!fallback?.error) return fallback;

  return res;
}

export default function AdminMonitoring() {
  const location = useLocation();

  const urlApp = useMemo(() => getAppFromUrl(location.search), [location.search]);

  const [appId, setAppId] = useState<string>(() => {
    const saved = getAppFromStorage();
    return (urlApp || saved || "mercy_blade").trim() || "mercy_blade";
  });

  const [appIdDraft, setAppIdDraft] = useState<string>(appId);

  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState<string | null>(null);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);

  const [feedback, setFeedback] = useState<FeedbackRow[]>([]);
  const [sessions, setSessions] = useState<SessionRow[]>([]);

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
    maxWidth: 820,
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

  const input: React.CSSProperties = {
    border: "1px solid rgba(0,0,0,0.14)",
    borderRadius: 12,
    padding: "10px 12px",
    fontSize: 13,
    fontWeight: 900,
    minWidth: 260,
    outline: "none",
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

  const safeFeedbackSelect = useMemo(
    () => "id, created_at, app_id, email, username, source, status, message",
    []
  );
  const safeSessionsSelect = useMemo(
    () => "id, created_at, app_id, user_id, session_id, device_type, last_activity, current_room_id",
    []
  );

  function applyApp(next: string) {
    const cleaned = (next || "").trim();
    if (!cleaned) return;
    setAppId(cleaned);
    setAppIdDraft(cleaned);
    persistApp(cleaned);
  }

  async function load(currentAppId: string) {
    setLoading(true);
    setNote(null);

    // Clear lists so we don’t show stale truth
    setFeedback([]);
    setSessions([]);

    try {
      // Feedback stream (best-effort app_id filter)
      const fb = await withOptionalAppIdFilter(
        supabase
          .from("user_feedback")
          .select(safeFeedbackSelect)
          .eq("app_id", currentAppId)
          .order("created_at", { ascending: false })
          .limit(20),
        supabase
          .from("user_feedback")
          .select(safeFeedbackSelect)
          .order("created_at", { ascending: false })
          .limit(20)
      );

      // Sessions stream (best-effort app_id filter)
      const ss = await withOptionalAppIdFilter(
        supabase
          .from("user_sessions")
          .select(safeSessionsSelect)
          .eq("app_id", currentAppId)
          .order("last_activity", { ascending: false })
          .limit(20),
        supabase
          .from("user_sessions")
          .select(safeSessionsSelect)
          .order("last_activity", { ascending: false })
          .limit(20)
      );

      // Soft note: if either fails, show message but keep page alive.
      const soft =
        (fb as any).error?.message ||
        (ss as any).error?.message ||
        null;

      setNote(soft);

      if (!(fb as any).error) setFeedback(((fb as any).data as any[]) || []);
      if (!(ss as any).error) setSessions(((ss as any).data as any[]) || []);

      setUpdatedAt(new Date().toLocaleString());
    } catch (e: any) {
      setNote(e?.message || String(e));
    } finally {
      setLoading(false);
    }
  }

  // Respect URL app param changes
  useEffect(() => {
    if (urlApp && urlApp !== appId) {
      applyApp(urlApp);
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlApp]);

  useEffect(() => {
    load(appId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appId]);

  return (
    <div style={wrap}>
      <div style={frame}>
        <div style={topBar}>
          <div>
            <div style={smallTag}>ADMIN • MONITORING • READ-ONLY</div>
            <h1 style={title}>System Monitoring</h1>
            <p style={subtitle}>
              Two truth streams: feedback and sessions. No writes. No bulk ops.
              <br />
              <span style={{ color: "rgba(0,0,0,0.55)" }}>
                Manual refresh only (operator-safe). Multi-app via <span style={mono}>app_id</span>.
              </span>
            </p>
          </div>

          <div style={pillRow}>
            <Link to={withApp("/admin", appId)} style={pill}>
              ← Back to Admin
            </Link>
            <button
              type="button"
              style={{
                ...pill,
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
              }}
              onClick={() => load(appId)}
              aria-label="Refresh monitoring"
              disabled={loading}
            >
              Refresh
            </button>
          </div>
        </div>

        {/* App context selector */}
        <div style={{ ...card, padding: 14, marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <div>
              <div style={{ fontWeight: 900, marginBottom: 6 }}>App Context</div>
              <div style={{ fontSize: 13, color: "rgba(0,0,0,0.70)", lineHeight: 1.6 }}>
                Streams are filtered by <span style={mono}>app_id</span>. If a table lacks <span style={mono}>app_id</span>,
                we auto-fallback to an unfiltered query (best-effort).
              </div>
              <div style={{ marginTop: 10, display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                <span style={badge}>
                  APP: <span style={mono}>{appId}</span>
                </span>
                <span style={badge}>{updatedAt ? `UPDATED: ${updatedAt}` : "UPDATED: —"}</span>
                <span style={badge}>READ-ONLY</span>
              </div>
            </div>

            <div style={{ minWidth: 320 }}>
              <div style={{ fontWeight: 900, marginBottom: 6 }}>Switch App</div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                <input
                  value={appIdDraft}
                  onChange={(e) => setAppIdDraft(e.target.value)}
                  placeholder="app_id (e.g. mercy_blade)"
                  style={input}
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
                  onClick={() => applyApp(appIdDraft)}
                  aria-label="Apply app id"
                >
                  Apply
                </button>
                <button
                  type="button"
                  style={pill}
                  onClick={() => applyApp("mercy_blade")}
                  aria-label="Switch to mercy_blade"
                >
                  mercy_blade
                </button>
              </div>
              <div style={{ marginTop: 8, fontSize: 12, color: "rgba(0,0,0,0.55)", fontWeight: 900 }}>
                Shareable links: <span style={mono}>/admin/monitoring?app=your_app_id</span>
              </div>
            </div>
          </div>

          {note && (
            <div style={{ marginTop: 12, padding: 12, borderRadius: 14, border: "1px solid rgba(0,0,0,0.12)" }}>
              <div style={{ fontWeight: 900, marginBottom: 6 }}>Snapshot note</div>
              <div style={{ ...mono, whiteSpace: "pre-wrap" }}>{note}</div>
              <div style={{ marginTop: 10, fontSize: 12, color: "rgba(0,0,0,0.55)", fontWeight: 800 }}>
                Partial truth is normal: one stream can fail (RLS/table/column) while the other still works.
              </div>
            </div>
          )}
        </div>

        <hr style={hr} />

        {/* Streams */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 14 }}>
          {/* Feedback */}
          <div style={{ ...card, gridColumn: "span 12" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
              <div>
                <div style={{ fontWeight: 900, fontSize: 16 }}>Feedback Stream</div>
                <div style={{ fontSize: 12, color: "rgba(0,0,0,0.55)", fontWeight: 800, marginTop: 4 }}>
                  Latest 20 from <span style={mono}>public.user_feedback</span> ordered by <span style={mono}>created_at</span>.
                </div>
              </div>
              <div style={{ fontSize: 12, color: "rgba(0,0,0,0.55)", fontWeight: 900 }}>
                rows: {feedback.length}
              </div>
            </div>

            <div style={{ marginTop: 12, overflowX: "auto" }}>
              <table style={table}>
                <thead>
                  <tr>
                    <th style={th}>Time</th>
                    <th style={th}>Status</th>
                    <th style={th}>User</th>
                    <th style={th}>Source</th>
                    <th style={th}>Message</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td style={{ ...td, borderBottom: 0 }} colSpan={5}>
                        Loading…
                      </td>
                    </tr>
                  ) : feedback.length ? (
                    feedback.map((r, i) => (
                      <tr key={(r.id || "") + i}>
                        <td style={td}>
                          <div style={{ fontWeight: 900 }}>{fmtTime(r.created_at)}</div>
                          <div style={mono}>{r.id ? clip(r.id, 18) : "—"}</div>
                        </td>
                        <td style={td}>
                          <span style={badge}>{(r.status || "open").toString()}</span>
                        </td>
                        <td style={td}>
                          <div style={{ fontWeight: 900 }}>{r.username || "—"}</div>
                          <div style={mono}>{r.email || "—"}</div>
                        </td>
                        <td style={td}>{r.source || "—"}</td>
                        <td style={td}>
                          <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.5 }}>
                            {clip(r.message, 260)}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td style={{ ...td, borderBottom: 0 }} colSpan={5}>
                        No feedback rows found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sessions */}
          <div style={{ ...card, gridColumn: "span 12" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
              <div>
                <div style={{ fontWeight: 900, fontSize: 16 }}>Sessions Stream</div>
                <div style={{ fontSize: 12, color: "rgba(0,0,0,0.55)", fontWeight: 800, marginTop: 4 }}>
                  Latest 20 from <span style={mono}>public.user_sessions</span> ordered by <span style={mono}>last_activity</span>.
                </div>
              </div>
              <div style={{ fontSize: 12, color: "rgba(0,0,0,0.55)", fontWeight: 900 }}>
                rows: {sessions.length}
              </div>
            </div>

            <div style={{ marginTop: 12, overflowX: "auto" }}>
              <table style={table}>
                <thead>
                  <tr>
                    <th style={th}>Last Activity</th>
                    <th style={th}>User</th>
                    <th style={th}>Device</th>
                    <th style={th}>Room</th>
                    <th style={th}>Session</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td style={{ ...td, borderBottom: 0 }} colSpan={5}>
                        Loading…
                      </td>
                    </tr>
                  ) : sessions.length ? (
                    sessions.map((r, i) => (
                      <tr key={(r.id || "") + i}>
                        <td style={td}>
                          <div style={{ fontWeight: 900 }}>{fmtTime(r.last_activity || r.created_at)}</div>
                          <div style={mono}>{r.id ? clip(r.id, 18) : "—"}</div>
                        </td>
                        <td style={td}>
                          <div style={mono}>{r.user_id ? clip(r.user_id, 22) : "—"}</div>
                        </td>
                        <td style={td}>{r.device_type || "—"}</td>
                        <td style={td}>
                          <div style={{ fontWeight: 900 }}>{r.current_room_id || "—"}</div>
                        </td>
                        <td style={td}>
                          <div style={mono}>{r.session_id ? clip(r.session_id, 28) : "—"}</div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td style={{ ...td, borderBottom: 0 }} colSpan={5}>
                        No session rows found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <hr style={hr} />

        <div style={{ fontSize: 12, color: "rgba(0,0,0,0.55)", fontWeight: 800, lineHeight: 1.6 }}>
          Tip: Monitoring should answer “what is happening right now?” more than “what is the perfect KPI?”
        </div>
      </div>
    </div>
  );
}

/* New thing to learn:
   Monitoring is a stream, not a report.
   The job is to reduce confusion in the next 10 minutes — not to be perfect forever. */
