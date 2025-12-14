// src/App.tsx — v2025-12-14-FIX-QUERY-LOWDATA
import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { LowDataModeProvider } from "@/contexts/LowDataModeContext";

import Home from "@/pages/Home";
import RoomGrid from "@/pages/RoomGrid";
import ChatHub from "@/pages/ChatHub";

const queryClient = new QueryClient();

export default function App() {
  useEffect(() => {
    console.log("App.tsx version: v2025-12-14-FIX-QUERY-LOWDATA");
    (window as any).__MB_APP_VERSION__ = "v2025-12-14-FIX-QUERY-LOWDATA";
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <LowDataModeProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/free" element={<RoomGrid />} />
          <Route path="/room/:roomId" element={<ChatHub />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </LowDataModeProvider>
    </QueryClientProvider>
  );
}
