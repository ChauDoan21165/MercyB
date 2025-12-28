/**
 * MercyBlade Blue — main.tsx (Single Router Owner + Single Auth Owner)
 * File: src/main.tsx
 * Version: MB-BLUE-96.4 — 2025-12-28 (+0700)
 *
 * LOCKED RULES:
 * - BrowserRouter is created ONLY here (exactly once)
 * - AuthProvider is created ONLY here (single auth source of truth)
 * - App.tsx must NOT create routers OR mount AuthProvider
 * - All global providers live ABOVE <App />
 * - "./index.css" must be imported here for Tailwind/UI visibility
 * - MbColorModeProvider is mounted here (global theme toggle)
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
import { MbColorModeProvider } from "@/contexts/MbColorModeContext";

// ✅ SINGLE AUTH SOURCE OF TRUTH (must wrap everything that uses useAuth)
import { AuthProvider } from "@/providers/AuthProvider";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// 🔥 Module proof (helps diagnose “wrong entry file / double router” issues)
console.log("🔥 main.tsx MODULE LOADED: MB-BLUE-96.4");
(window as any).__MB_MAIN_VERSION__ = "MB-BLUE-96.4";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <MbThemeProvider>
            <MbColorModeProvider>
              <LowDataModeProvider>
                <MercyHostProvider>
                  <MusicPlayerProvider>
                    <App />
                  </MusicPlayerProvider>
                </MercyHostProvider>
              </LowDataModeProvider>
            </MbColorModeProvider>
          </MbThemeProvider>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
);
