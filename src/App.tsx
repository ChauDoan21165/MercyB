// src/App.tsx — v2025-12-14-03 (NO BrowserRouter here)
import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
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

import Home from "@/pages/Home";
import RoomGrid from "@/pages/RoomGrid";

const queryClient = new QueryClient();

export default function App() {
  useEffect(() => {
    console.log("App.tsx version: v2025-12-14-03");
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

                  {/* Router must be provided by main.tsx */}
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/free" element={<RoomGrid />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>

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
