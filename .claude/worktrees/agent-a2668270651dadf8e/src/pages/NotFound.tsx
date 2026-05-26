// src/pages/NotFound.tsx
import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function NotFound() {
  const loc = useLocation();
  return (
    <div style={{ minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ maxWidth: 640 }}>
        <div style={{ fontSize: 44, fontWeight: 900, letterSpacing: -1 }}>404</div>
        <div style={{ marginTop: 8, fontSize: 16, color: "rgba(0,0,0,0.7)", lineHeight: 1.6 }}>
          Page not found: <code>{loc.pathname}</code>
        </div>
        <div style={{ marginTop: 18, display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link to="/" style={{ padding: "10px 12px", borderRadius: 12, border: "1px solid rgba(0,0,0,0.14)" }}>
            Home
          </Link>
          <Link to="/rooms" style={{ padding: "10px 12px", borderRadius: 12, border: "1px solid rgba(0,0,0,0.14)" }}>
            Rooms
          </Link>
          <Link to="/signin" style={{ padding: "10px 12px", borderRadius: 12, border: "1px solid rgba(0,0,0,0.14)" }}>
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
