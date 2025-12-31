// src/App.tsx
// MB-BLUE-101.2 — 2025-12-31 (+0700)
//
// APP ROOT (LOCKED):
// - DO NOT define <Routes> here.
// - Single router source of truth: src/router/AppRouter.tsx
// - This file exists only as a safe wrapper if anything imports <App />.

import React from "react";
import AppRouter from "@/router/AppRouter";

export default function App() {
  return <AppRouter />;
}

/* New thing to learn:
   Kill “duplicate routers” by making every non-authoritative App file a pure wrapper. */
