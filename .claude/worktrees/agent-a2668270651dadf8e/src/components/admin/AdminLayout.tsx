// Path: src/components/admin/AdminLayout.tsx
// src/components/admin/AdminLayout.tsx
// MB-BLUE-98.3a → MB-BLUE-98.4 — 2026-04-17
//
// PURPOSE (STABLE):
// - Keep admin routes VISIBLE
// - Make admin sidebar appear on admin dashboard and admin pages
// - Keep simple, reliable inline styles
// - Avoid unrelated refactors
//
// CHANGE (98.4):
// - Mount AdminSidebar in the shared admin layout
// - Wrap layout with SidebarProvider so AdminSidebar can render safely
// - Keep existing header and main content behavior

import React from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export interface AdminLayoutProps {
  children?: React.ReactNode;
}

/** ✅ Named export */
export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <SidebarProvider defaultOpen>
      <div
        style={{
          minHeight: "100vh",
          width: "100%",
          background: "white",
          color: "black",
          fontFamily: "system-ui, -apple-system, BlinkMacSystemFont",
          display: "flex",
        }}
        data-mb-scope="admin-layout"
      >
        <AdminSidebar />

        <div
          style={{
            minHeight: "100vh",
            flex: 1,
            minWidth: 0,
            background: "white",
            color: "black",
          }}
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
      </div>
    </SidebarProvider>
  );
}

/** ✅ Default export */
export default AdminLayout;