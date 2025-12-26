/**
 * MercyBlade Blue — main.tsx (Single Router + Single Auth Owner)
 * File: src/main.tsx
 * Version: MB-BLUE-94.14.23 — 2025-12-26 (+0700)
 *
 * LOCKED RULES:
 * - BrowserRouter is created ONLY here (exactly once)
 * - AuthProvider is created ONLY here (exactly once)
 * - App.tsx must NOT create routes, routers, or AuthProvider
 * - All global providers live ABOVE <App />
 *
 * PURPOSE:
 * - Eliminate “useAuth must be used inside <AuthProvider>” forever
 */

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import App from "./App";
import "./index.css";

// Providers
import { LowDataModeProvider } from "@/contexts/LowDataModeContext";
import { MercyHostProvider } from "@/components/mercy/MercyHostProvider";
import { MbThemeProvider } from "@/hooks/useMbTheme";
import { MusicPlayerProvider } from "@/contexts/MusicPlayerContext";

// ✅ SINGLE AUTH SOURCE OF TRUTH (ONLY HERE)
import { AuthProvider } from "@/providers/AuthProvider";

// 🔥 Module proof
console.log("🔥 main.tsx MODULE LOADED: MB-BLUE-94.14.23");
(window as any).__MB_MAIN_VERSION__ = "MB-BLUE-94.14.23";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <MbThemeProvider>
            <LowDataModeProvider>
              <MercyHostProvider>
                <MusicPlayerProvider>
                  <App />
                </MusicPlayerProvider>
              </MercyHostProvider>
            </LowDataModeProvider>
          </MbThemeProvider>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
);
