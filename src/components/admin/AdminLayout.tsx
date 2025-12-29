// src/components/admin/AdminLayout.tsx
// MB-BLUE-98.2 — 2025-12-29 (+0700)
//
// PURPOSE (TEMPORARY):
// - Keep admin route compiling
// - Remove ALL Lovable / shadcn / command palette dependencies
// - Zero external UI deps
//
// NOTE:
// - Admin UI is NOT part of launch scope
// - This file exists only to prevent broken imports
// - Can be expanded later in Phase V+

import React from "react";

interface AdminLayoutProps {
  children?: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
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
