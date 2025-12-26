/**
 * MercyBlade Blue — main.tsx (Single Router Owner + Single Auth Owner)
 * File: src/main.tsx
 * Version: MB-BLUE-94.14.25 — 2025-12-26 (+0700)
 *
 * LOCKED RULES:
 * - BrowserRouter is created ONLY here (exactly once)
 * - AuthProvider is created ONLY here (single auth source of truth)
 * - App.tsx must NOT create routers OR mount AuthProvider
 * - All global providers live ABOVE <App />
 * - "./index.css" must be imported here for Tailwind/UI visibility
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
