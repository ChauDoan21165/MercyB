// src/components/admin/AdminLayout.tsx
// MB-BLUE-98.3 — 2025-12-29 (+0700)
//
// PURPOSE (TEMPORARY):
// - Keep admin routes compiling
// - Remove ALL Lovable / shadcn / command palette deps
// - Support BOTH named + default imports
//
// Admin UI is NOT launch-critical.
// This is a build-stabilizer only.

import React from "react";

export interface AdminLayoutProps {
  children?: React.ReactNode;
}

/** ✅ Named export (for legacy imports) */
export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div
      className="min-h-screen w-full bg-background text-foreground"
      data-mb-scope="admin-layout"
    >
      <header className="border-b px-6 py-4">
        <h1 className="text-lg font-semibold">Admin</h1>
        <p className="text-sm text-muted-foreground">
          Administrative tools (disabled in launch build)
        </p>
      </header>

      <main className="p-6">
        {children ? (
          children
        ) : (
          <div className="text-sm text-muted-foreground">
            No admin content enabled.
          </div>
        )}
      </main>
    </div>
  );
}

/** ✅ Default export (safe for future imports) */
export default AdminLayout;
