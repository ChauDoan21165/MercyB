// FILE: AppShell.tsx
// PATH: src/layouts/AppShell.tsx
//
// FIX (2026-01-31):
// - DO NOT wrap the global header inside the 980px frame.
// - Header must be full-width so Home/Back can reach viewport edge.
// - Content stays constrained to PAGE_MAX=980 + px-4.

import React from "react";
import AppHeader from "@/components/layout/AppHeader";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full">
      {/* ✅ FULL-WIDTH HEADER (NOT inside max-w frame) */}
      <AppHeader />

      {/* ✅ Content frame matches Home: PAGE_MAX=980 + 16px padding */}
      <div className="mx-auto max-w-[980px] px-4 py-4">{children}</div>
    </div>
  );
}
