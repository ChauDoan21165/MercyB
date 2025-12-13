// src/App.tsx — v2025-12-13-02
import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

import { MusicPlayerProvider } from "@/contexts/MusicPlayerContext";
import { LowDataModeProvider } from "@/contexts/LowDataModeContext";
import { MbThemeProvider } from "@/hooks/useMbTheme";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { OfflineDetector } from "@/components/OfflineDetector";

import Home from "@/pages/Hom";       // correct filename
import RoomGrid from "@/pages/RoomGrid";

const queryClient = new QueryClient();

export default function App() {
  // version marker (you were right to ask for this 👍)
  useEffect(() => {
    console.log("✅ App.tsx version: v2025-12-13-02 (next-themes removed)");
  }, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
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
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
