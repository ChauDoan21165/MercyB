import React from "react";
import { Link, Outlet } from "react-router-dom";
import { useAdminAccess } from "@/hooks/admin/useAdminAccess";

export default function AdminRoute() {
  const access = useAdminAccess();

  const email = access.email;
  const userId = access.userId;
  const loading = access.loading;

  const isAdmin = Boolean(access.permissions?.isAdmin);
  const adminLevel = Number(access.permissions?.level ?? 0);

  if (loading) {
    return (
      <div style={{ padding: 24 }}>
        <div style={{ fontWeight: 900, fontSize: 18 }}>Checking admin access…</div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div style={{ padding: 24 }}>
        <div style={{ fontWeight: 900, fontSize: 18 }}>Admin only</div>

        <div style={{ marginTop: 16, fontSize: 16 }}>
          Signed in as: <b>{String(email || userId || "unknown")}</b>
        </div>

        <div style={{ marginTop: 8, fontSize: 16 }}>
          Admin level: <b>{adminLevel}</b>
        </div>

        {access.error ? (
          <div style={{ marginTop: 12, color: "#b91c1c", fontSize: 14 }}>
            {access.error}
          </div>
        ) : null}

        <div style={{ marginTop: 20 }}>
          <Link
            to="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 14px",
              borderRadius: 12,
              border: "1px solid rgba(0,0,0,0.12)",
              textDecoration: "none",
              color: "inherit",
              fontWeight: 800,
            }}
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return <Outlet />;
}