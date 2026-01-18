// src/layouts/AppShell.tsx
// MB-BLUE-101.HERO-SHELL — 2026-01-13 (+0700)
//
// GLOBAL LAYOUT SHELL (LOCKED INTENT):
// - Reuse Home header + hero band across ALL pages
// - EXCEPT /signin (signin stays standalone)
// - Pages should NOT render their own header/hero anymore

import React from "react";
import { Outlet } from "react-router-dom";

// Option A (recommended): import extracted pieces from Home (minimal duplication).
// You will add these named exports in Home.tsx in step (2).
import { GlobalHeader, GlobalHeroBand } from "@/pages/Home";

export default function AppShell() {
  return (
    <div className="min-h-screen">
      <GlobalHeader />
      <GlobalHeroBand />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
