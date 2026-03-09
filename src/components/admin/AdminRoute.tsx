// src/components/admin/AdminRoute.tsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useUserAccess } from "@/hooks/useUserAccess";

type Props = { children: React.ReactNode };

type AccessIdentity = {
  email?: string;
  userId?: string;
  user?: {
    email?: string;
    id?: string;
  };
};

function readAccessIdentity(value: unknown): AccessIdentity {
  if (!value || typeof value !== "object") return {};

  const obj = value as Record<string, unknown>;
  const userRaw = obj.user;
  const user =
    userRaw && typeof userRaw === "object"
      ? (userRaw as Record<string, unknown>)
      : undefined;

  return {
    email: typeof obj.email === "string" ? obj.email : undefined,
    userId: typeof obj.userId === "string" ? obj.userId : undefined,
    user: user
      ? {
          email: typeof user.email === "string" ? user.email : undefined,
          id: typeof user.id === "string" ? user.id : undefined,
        }
      : undefined,
  };
}

export default function AdminRoute({ children }: Props) {
  const access = useUserAccess();
  const location = useLocation();

  const loading = Boolean(access.loading || access.isLoading);
  const isAdmin = Boolean(
    access.isAdmin ||
      access.isHighAdmin ||
      (access.adminLevel ?? 0) >= 1
  );

  const identity = readAccessIdentity(access);

  const email = identity.email ?? identity.user?.email;
  const userId = identity.userId ?? identity.user?.id;

  if (loading) {
    return (
      <div style={{ padding: 18, fontFamily: "system-ui" }}>
        <div style={{ fontWeight: 900 }}>Loading…</div>
        <div style={{ opacity: 0.7, marginTop: 8 }}>
          Checking admin access…
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div style={{ padding: 18, fontFamily: "system-ui" }}>
        <div style={{ fontWeight: 900, fontSize: 18 }}>Admin only</div>
        <div
          style={{
            opacity: 0.75,
            marginTop: 8,
            lineHeight: 1.6,
          }}
        >
          Signed in as: <b>{String(email || userId || "unknown")}</b>
          <br />
          Admin level: <b>{Number(access.adminLevel ?? 0)}</b>
        </div>

        <div
          style={{
            marginTop: 14,
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
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