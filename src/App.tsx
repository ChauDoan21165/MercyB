/**
 * MercyBlade Blue — App (Providers Only)
 * File: src/App.tsx
 * Version: MB-BLUE-94.14.24 — 2025-12-26 (+0700)
 *
 * LOCKED:
 * - App.tsx MUST NOT mount AuthProvider
 * - AuthProvider lives ONLY in main.tsx
 */

import { useEffect } from "react";
import AppRouter from "@/router/AppRouter";

export default function App() {
  useEffect(() => {
    console.log("App.tsx version: MB-BLUE-94.14.24");
    (window as any).__MB_APP_VERSION__ = "MB-BLUE-94.14.24";
  }, []);

  return <AppRouter />;
}
