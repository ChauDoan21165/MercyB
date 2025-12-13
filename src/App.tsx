// src/App.tsx — v2025-12-14-01
import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";

import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

import { MusicPlayerProvider } from "@/contexts/MusicPlayerContext";
import { LowDataModeProvider } from "@/contexts/LowDataModeContext";
import { MbThemeProvider } from "@/hooks/useMbTheme";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { OfflineDetector } from "@/components/OfflineDetector";

import Home from "@/pages/Home"; // MUST match actual file name: Home.tsx (case sensitive on Vercel)
import RoomGrid from "@/pages/RoomGrid";

const queryClient = new QueryClient();

export default function App() {
  useEffect(() => {
    console.log("App.tsx version: v2025-12-14-01");

    // Global crash visibility (very useful when libraries throw weird stuff)
    const onError = (event: ErrorEvent) => {
      console.group("🌋 window.onerror");
      console.error("message:", event.message);
      console.error("filename:", event.filename);
      console.error("lineno:", event.lineno, "colno:", event.colno);
      console.error("error object:", event.error);
      console.groupEnd();
    };

    const onRejection = (event: PromiseRejectionEvent) => {
      console.group("🌋 unhandledrejection");
      console.error("reason:", event.reason);
      console.groupEnd();
    };

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);

    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
    };
  }, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <MbThemeProvider>
            <LowDataModeProvider>
              <MusicPlayerProvider>
                <TooltipProvider>
                  <OfflineDetector />

                  <BrowserRouter>
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/free" element={<RoomGrid />} />
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </BrowserRouter>

                  <Toaster />
                  <Sonner />
                </TooltipProvider>
              </MusicPlayerProvider>
            </LowDataModeProvider>
          </MbThemeProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
