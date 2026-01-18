// src/components/admin/AdminLayout.tsx
// MB-BLUE-98.3a — 2026-01-14 (+0700)
//
// PURPOSE (TEMPORARY, STABLE):
// - Keep admin routes VISIBLE
// - NO Tailwind theme tokens
// - NO shadcn / Lovable deps
// - Works even if CSS is broken

import React from "react";

export interface AdminLayoutProps {
  children?: React.ReactNode;
}

/** ✅ Named export */
export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        background: "white",
        color: "black",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont",
      }}
      data-mb-scope="admin-layout"
    >
      <header
        style={{
          borderBottom: "1px solid rgba(0,0,0,0.12)",
          padding: "16px 24px",
        }}
      >
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 900 }}>Admin</h1>
        <p style={{ marginTop: 6, fontSize: 13, opacity: 0.7 }}>
          Administrative tools
        </p>
      </header>

      <main style={{ padding: 24 }}>
        {children ? (
          children
        ) : (
          <div style={{ fontSize: 14, opacity: 0.7 }}>
            No admin content enabled.
          </div>
        )}
      </main>
    </div>
  );
}

/** ✅ Default export */
export default AdminLayout;
