// src/App.tsx — v2025-12-14-ROUTER
import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import RoomGrid from "@/pages/RoomGrid";
import ChatHub from "@/pages/ChatHub";

export default function App() {
  useEffect(() => {
    console.log("App.tsx version: v2025-12-14-ROUTER");
    (window as any).__MB_APP_VERSION__ = "v2025-12-14-ROUTER";
  }, []);

  return (
    <Routes>
      {/* Free rooms grid */}
      <Route path="/" element={<RoomGrid />} />
      <Route path="/free" element={<RoomGrid />} />

      {/* Chat room */}
      <Route path="/room/:roomId" element={<ChatHub />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
