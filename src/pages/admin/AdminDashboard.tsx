// src/pages/admin/AdminHome.tsx
// MB-BLUE-101.0 — 2025-12-31 (+0700)
//
// ADMIN HOME (UI ONLY):
// - Reorganized into modern black/white "control board" layout.
// - Keeps existing links + content intent (no new logic).
// - Classy: typography, spacing, card grid, subtle borders.

import React from "react";
import { Link, useNavigate } from "react-router-dom";

type AdminTile = {
  title: string;
  desc: string;
  href?: string; // internal route
  badge?: string;
  disabled?: boolean;
};

export default function AdminHome() {
  const nav = useNavigate();

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

  const sectionTitle: React.CSSProperties = {
    margin: 0,
    fontSize: 16,
    fontWeight: 900,
    letterSpacing: 0.2,
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

  const linkA: React.CSSProperties = {
    textDecoration: "none",
    color: "inherit",
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
      title: "Audio Ops",
      desc: "Coverage checks and scanner pages (no destructive actions).",
      href: "/admin/audio",
      badge: "READY",
    },
    {
      title: "Room Health",
      desc: "Room integrity & coverage diagnostics (read-only).",
      href: "/admin/rooms",
      badge: "SAFE",
    },
    {
      title: "System Monitoring",
      desc: "Surface operational signals. Anything marked “Soon” can be wired later without changing this board.",
      href: "/admin/monitoring",
      badge: "SOON",
      disabled: true,
    },
  ];

  function go(href?: string) {
    if (!href) return;
    nav(href);
  }

  return (
    <div style={wrap}>
      <div style={frame}>
        <div style={topBar}>
          <div>
            <div style={smallTag}>ADMIN • CONTROL BOARD</div>
            <h1 style={title}>Admin</h1>
            <p style={subtitle}>
              One place to operate Mercy Blade: payments, audio coverage, room health, and system monitoring.
              <br />
              <span style={{ color: "rgba(0,0,0,0.55)" }}>
                Administrative tools (disabled in launch build).
              </span>
            </p>
          </div>

          <div style={pillRow}>
            <Link to="/" style={linkA}>
              <button type="button" style={pill}>Back to Home</button>
            </Link>
            <button
              type="button"
              style={pill}
              onClick={() => nav("/rooms")}
              aria-label="Open a room"
            >
              Open a Room
            </button>
          </div>
        </div>

        <hr style={hr} />

        {/* Summary strip */}
        <div style={{ ...card, padding: 14, marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <div>
              <div style={sectionTitle}>Safety Notice</div>
              <p style={{ ...cardDesc, marginTop: 6 }}>
                This board links to panels. It does not assume payment/email is “done.” It’s an operator surface only.
              </p>
            </div>

            <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
              <span style={badge}>RISK MODE: SAFE</span>
              <span style={badge}>NO DESTRUCTIVE ACTIONS</span>
            </div>
          </div>
        </div>

        {/* Panels grid */}
        <div style={grid}>
          {tiles.map((t) => {
            const span = t.title === "System Monitoring" ? 12 : 6; // nice layout
            const isDisabled = !!t.disabled;

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
                  >
                    Open
                  </button>

                  <div style={{ fontSize: 12, color: "rgba(0,0,0,0.55)", fontWeight: 800 }}>
                    {t.href ? `Route: ${t.href}` : "Route: —"}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <hr style={hr} />

        {/* Footer */}
        <div style={{ fontSize: 12, color: "rgba(0,0,0,0.55)", fontWeight: 800, lineHeight: 1.6 }}>
          Tip: keep Admin pages minimal and operator-focused. Prefer read-only panels with explicit “Safe” labeling.
        </div>
      </div>
    </div>
  );
}

/* New thing to learn:
   “Modern” admin UI is mostly spacing + hierarchy + consistency.
   Black/white becomes classy when borders/shadows are subtle and typography is strong. */
