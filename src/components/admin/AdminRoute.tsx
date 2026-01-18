// src/components/admin/AdminRoute.tsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useUserAccess } from "@/hooks/useUserAccess";

type Props = { children: React.ReactNode };

export default function AdminRoute({ children }: Props) {
  const access = useUserAccess();
  const location = useLocation();

  const loading = !!(access.loading || access.isLoading);
  const isAdmin = !!(access.isAdmin || access.isHighAdmin || (access.adminLevel ?? 0) >= 1);

  if (loading) {
    return (
      <div style={{ padding: 18, fontFamily: "system-ui" }}>
        <div style={{ fontWeight: 900 }}>Loading…</div>
        <div style={{ opacity: 0.7, marginTop: 8 }}>Checking admin access…</div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div style={{ padding: 18, fontFamily: "system-ui" }}>
        <div style={{ fontWeight: 900, fontSize: 18 }}>Admin only</div>
        <div style={{ opacity: 0.75, marginTop: 8, lineHeight: 1.6 }}>
          Signed in as: <b>{String(access.email || access.userId || "unknown")}</b>
          <br />
          Admin level: <b>{Number(access.adminLevel ?? 0)}</b>
        </div>

        <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link
            to="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "10px 12px",
              borderRadius: 12,
              border: "1px solid rgba(0,0,0,0.14)",
              fontWeight: 900,
              textDecoration: "none",
              color: "black",
              background: "white",
            }}
          >
            ← Back to Home
          </Link>

          <div style={{ fontSize: 12, opacity: 0.65, fontWeight: 800 }}>
            Path: <code>{location.pathname}</code>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
