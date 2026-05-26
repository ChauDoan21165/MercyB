// src/components/auth/MercyRightBrandOverlay.tsx
// MB-BLUE-101.3i.fix-rainbow-contrast.2 — 2026-01-12 (+0700)
//
// FIX:
// - Make gradient clip to TEXT (not a rainbow rectangle).
// - Match HOME feel: flat rainbow text + tiny drop-shadow only.
// - Keep overlay light + readable, no big UI box.
//
// NOTE: This component is ONLY for the /signin right panel overlay.

import React from "react";

const rainbow =
  "linear-gradient(90deg,#ff2d2d 0%,#ffb000 18%,#a8ff2a 36%,#22f7b0 54%,#2aa6ff 72%,#9a4dff 90%,#ff3de6 100%)";

export default function MercyRightBrandOverlay() {
  const wrap: React.CSSProperties = {
    position: "absolute",
    top: 18,
    left: 0,
    right: 0,
    zIndex: 9999,
    pointerEvents: "none",
    display: "flex",
    justifyContent: "center",
    padding: "0 18px",
  };

  const plate: React.CSSProperties = {
    padding: "10px 18px 12px",
    borderRadius: 18,
    background: "rgba(255,255,255,0.50)",
    border: "1px solid rgba(0,0,0,0.10)",
    backdropFilter: "blur(10px)",
    boxShadow: "0 10px 24px rgba(0,0,0,0.08)",
    textAlign: "center",
  };

  // ✅ MUST be inline-block + WebkitTextFillColor for reliable gradient-text on Chrome/Safari.
  const mercy: React.CSSProperties = {
    display: "inline-block",
    fontSize: 92,
    lineHeight: 1,
    fontWeight: 950,
    letterSpacing: "-0.04em",
    margin: 0,

    background: rainbow,
    backgroundClip: "text",
    WebkitBackgroundClip: "text",

    color: "transparent",
    WebkitTextFillColor: "transparent",

    whiteSpace: "nowrap",
    filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.18))",
    WebkitFontSmoothing: "antialiased",
  };

  const sub: React.CSSProperties = {
    marginTop: 8,
    fontSize: 12,
    fontWeight: 900,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: "rgba(0,0,0,0.58)",
    whiteSpace: "nowrap",
  };

  return (
    <div style={wrap} aria-hidden="true">
      <div style={plate}>
        <div style={mercy}>Mercy</div>
        <div style={sub}>Mercy Account • Serving Humanity</div>
      </div>
    </div>
  );
}
