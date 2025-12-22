/**
 * MercyBlade Blue — APP SHELL (Providers-only)
 * File: src/App.tsx
 * Version: MB-BLUE-93.1 — 2025-12-23 (+0700)
 *
 * Goal:
 * - App.tsx must be minimal (providers only)
 * - ALL routes must live in src/router/AppRouter.tsx
 * - Fix /admin bouncing back to / caused by old wildcard routes in App.tsx
 */

import { useEffect } from "react";
import AppRouter from "@/router/AppRouter";

export default function App() {
  useEffect(() => {
    console.log("App.tsx version: MB-BLUE-93.1 — 2025-12-23 (+0700)");
    (window as any).__MB_APP_VERSION__ = "MB-BLUE-93.1";
  }, []);

  return <AppRouter />;
}
