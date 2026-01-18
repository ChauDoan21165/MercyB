// src/pages/admin/AdminDashboard.tsx
// MB-BLUE-101.6 → MB-BLUE-101.6a — 2026-01-14 (+0700)
//
// ✅ FIX (101.6a):
// - Stop blank /admin page.
// - Gate admin dashboard UI by useUserAccess().
// - If not admin: show clear message + sign-in link (never return null).
// - Keep existing multi-app context behavior unchanged.

import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useUserAccess } from "@/hooks/useUserAccess";

type AdminTile = {
  title: string;
  desc: string;
  href?: string;
  badge?: string;
  disabled?: boolean;
};

const ADMIN_APP_ID_KEY = "mb_admin_app_id";

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

  // Keep URL shareable
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

export default function AdminDashboard() {
  const nav = useNavigate();
  const location = useLocation();

  // ✅ REAL admin gate (same source of truth as Room gating)
  const access = useUserAccess();
  const accessLoading = access.loading || access.isLoading;
  const isAdmin = !!(access.isAdmin || access.isHighAdmin || (access.adminLevel ?? 0) >= 9);

  const urlApp = useMemo(() => getAppFromUrl(location.search), [location.search]);

  const [appId, setAppId] = useState<string>(() => {
    const saved = getAppFromStorage();
    return (urlApp || saved || "mercy_blade").trim() || "mercy_blade";
  });

  const [appIdDraft, setAppIdDraft] = useState<string>(appId);

  // If URL app changes, respect it and persist.
  useEffect(() => {
    if (urlApp && urlApp !== appId) {
      setAppId(urlApp);
      setAppIdDraft(urlApp);
      persistApp(urlApp);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlApp]);

  function applyApp(next: string) {
    const cleaned = (next || "").trim();
    if (!cleaned) return;
    setAppId(cleaned);
    setAppIdDraft(cleaned);
    persistApp(cleaned);
  }

  const wrap: React.CSSProperties = {
    minHeight: "100vh",
    background: "white",
    color: "black",
  };

  const frame: React.CSSProperties = {
    maxWidth: 980,
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
    fontSize: 44,
    letterSpacing: -1.2,
    fontWeight: 900,
    lineHeight: 1.05,
  };

  const subtitle: React.CSSProperties = {
    marginTop: 8,
    marginBottom: 0,
    fontSize: 15,
    lineHeight: 1.6,
    color: "rgba(0,0,0,0.70)",
    maxWidth: 720,
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
    fontWeight: 800,
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

  const grid: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(12, 1fr)",
    gap: 14,
  };

  const card: React.CSSProperties = {
    border: "1px solid rgba(0,0,0,0.10)",
    borderRadius: 18,
    padding: 16,
    background: "white",
    boxShadow: "0 10px 24px rgba(0,0,0,0.04)",
  };

  const cardTitle: React.CSSProperties = {
    margin: 0,
    fontSize: 18,
    fontWeight: 900,
    letterSpacing: -0.2,
  };

  const cardDesc: React.CSSProperties = {
    marginTop: 8,
    marginBottom: 0,
    fontSize: 14,
    lineHeight: 1.6,
    color: "rgba(0,0,0,0.68)",
  };

  const cardFooter: React.CSSProperties = {
    marginTop: 14,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    flexWrap: "wrap",
  };

  const linkBtn: React.CSSProperties = {
    border: "1px solid rgba(0,0,0,0.14)",
    background: "white",
    borderRadius: 12,
    padding: "10px 12px",
    fontWeight: 900,
    cursor: "pointer",
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

  const mono: React.CSSProperties = {
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
    fontSize: 12,
    color: "rgba(0,0,0,0.75)",
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

  const tiles: AdminTile[] = [
    {
      title: "Payments",
      desc: "Inspect payments, Stripe test flows, and verification tools.",
      href: "/admin/payments",
      badge: "SAFE",
    },
    {
      title: "Bank Transfers",
      desc: "Manual transfer logs and reconciliation helpers.",
      href: "/admin/bank-transfers",
      badge: "SAFE",
    },
    {
      title: "Payment Verification",
      desc: "Verification and review actions for manual approvals (keep safe).",
      href: "/admin/payment-verification",
      badge: "SAFE",
    },
    {
      title: "Access Codes",
      desc: "Generate and manage redeem / access codes.",
      href: "/admin/access-codes",
      badge: "SAFE",
    },
    {
      title: "Audio Coverage",
      desc: "Coverage checks for room audio (read-only tools).",
      href: "/admin/audio-coverage",
      badge: "READY",
    },
    {
      title: "System Monitoring",
      desc: "Truth streams: latest feedback + sessions (read-only).",
      href: "/admin/monitoring",
      badge: "READY",
    },
    {
      title: "Metrics",
      desc: "KPIs & distribution snapshots (read-only).",
      href: "/admin/metrics",
      badge: "READY",
    },
    {
      title: "Feedback",
      desc: "Read user feedback from rooms (read-only).",
      href: "/admin/feedback",
      badge: "READY",
    },
  ];

  function go(href?: string) {
    if (!href) return;
    nav(withApp(href, appId));
  }

  return (
    <div style={wrap}>
      <div style={frame}>
        {/* ✅ Never blank */}
        {accessLoading ? (
          <div style={{ ...card, padding: 18 }}>
            <div style={{ fontWeight: 950, fontSize: 18 }}>Admin</div>
            <div style={{ marginTop: 8, opacity: 0.75, fontWeight: 800 }}>Checking access…</div>
          </div>
        ) : !isAdmin ? (
          <div style={{ ...card, padding: 18 }}>
            <div style={smallTag}>ADMIN • ACCESS REQUIRED</div>
            <h1 style={{ ...title, marginTop: 10 }}>Not admin</h1>
            <p style={subtitle}>
              This account does not have admin permissions.
              <br />
              Sign in as <b>cd12536@gmail.com</b> (admin_level = 9) and refresh.
            </p>

            <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Link to="/signin" style={pill}>
                Go to Sign In
              </Link>
              <Link to="/" style={pill}>
                Back to Home
              </Link>
            </div>

            <div style={{ marginTop: 12, fontSize: 12, color: "rgba(0,0,0,0.60)", fontWeight: 900 }}>
              Your tier: <span style={mono}>{String(access.tier || "free")}</span> • admin_level:{" "}
              <span style={mono}>{String(access.adminLevel ?? 0)}</span>
            </div>
          </div>
        ) : (
          <>
            <div style={topBar}>
              <div>
                <div style={smallTag}>ADMIN • CONTROL BOARD</div>
                <h1 style={title}>Admin</h1>
                <p style={subtitle}>
                  One place to operate your ecosystem: payments, access, audio coverage, and truth screens.
                  <br />
                  <span style={{ color: "rgba(0,0,0,0.55)" }}>
                    Operator UI only — keep actions safe & explicit.
                  </span>
                </p>
              </div>

              <div style={pillRow}>
                <Link to="/" style={pill}>
                  Back to Home
                </Link>
                <button type="button" style={pill} onClick={() => nav("/rooms")} aria-label="Open Rooms">
                  Open Rooms
                </button>
              </div>
            </div>

            {/* App context (multi-app) */}
            <div style={{ ...card, padding: 14, marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                <div>
                  <div style={{ fontWeight: 900, marginBottom: 6 }}>App Context</div>
                  <div style={{ fontSize: 13, color: "rgba(0,0,0,0.70)", lineHeight: 1.6 }}>
                    Every admin page must show and filter by <span style={mono}>app_id</span>. This prevents
                    cross-app mistakes.
                  </div>
                  <div style={{ marginTop: 10, display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                    <span style={badge}>
                      APP: <span style={mono}>{appId}</span>
                    </span>
                    <span style={badge}>RISK MODE: SAFE</span>
                    <span style={badge}>NO DESTRUCTIVE ACTIONS</span>
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
                      style={{ ...linkBtn, padding: "10px 12px" }}
                      onClick={() => applyApp(appIdDraft)}
                      aria-label="Apply app id"
                    >
                      Apply
                    </button>
                    <button type="button" style={pill} onClick={() => applyApp("mercy_blade")} aria-label="Switch to mercy_blade">
                      mercy_blade
                    </button>
                  </div>
                  <div style={{ marginTop: 8, fontSize: 12, color: "rgba(0,0,0,0.55)", fontWeight: 900 }}>
                    Shareable links: <span style={mono}>/admin?app=your_app_id</span>
                  </div>
                </div>
              </div>
            </div>

            <hr style={hr} />

            <div style={grid}>
              {tiles.map((t) => {
                const span = t.title === "System Monitoring" || t.title === "Metrics" ? 12 : 6;
                const isDisabled = !!t.disabled;
                const hrefWithApp = t.href ? withApp(t.href, appId) : undefined;

                return (
                  <div
                    key={t.title}
                    style={{
                      ...card,
                      gridColumn: `span ${span}`,
                      opacity: isDisabled ? 0.55 : 1,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
                      <h2 style={cardTitle}>{t.title}</h2>
                      {t.badge && <span style={badge}>{t.badge}</span>}
                    </div>

                    <p style={cardDesc}>{t.desc}</p>

                    <div style={cardFooter}>
                      <button
                        type="button"
                        style={{
                          ...linkBtn,
                          opacity: isDisabled ? 0.6 : 1,
                          cursor: isDisabled ? "not-allowed" : "pointer",
                        }}
                        onClick={() => (!isDisabled ? go(t.href) : null)}
                        disabled={isDisabled}
                        aria-label={`Open ${t.title}`}
                      >
                        Open
                      </button>

                      <div style={{ fontSize: 12, color: "rgba(0,0,0,0.55)", fontWeight: 800 }}>
                        {hrefWithApp ? (
                          <>
                            Route: <span style={mono}>{hrefWithApp}</span>
                          </>
                        ) : (
                          "Route: —"
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <hr style={hr} />

            <div style={{ fontSize: 12, color: "rgba(0,0,0,0.55)", fontWeight: 800, lineHeight: 1.6 }}>
              Tip: A strong admin console is mostly: context clarity, safety labeling, and fast navigation.
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* New thing to learn:
   The #1 multi-app admin bug is “wrong context.”
   If app_id is not obvious on every screen, mistakes are guaranteed. */
